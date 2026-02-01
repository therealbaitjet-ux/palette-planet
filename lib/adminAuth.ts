import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSessionSecret,
  readAdminUsers,
  writeAdminUsers,
  AdminUser,
  readResetTokens,
  writeResetTokens,
  pruneExpiredResetTokens,
} from "@/lib/adminStore";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ADMIN_LIMIT = 7;

const base64UrlEncode = (input: Buffer | string) =>
  Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

const base64UrlDecode = (input: string) => {
  const pad = input.length % 4;
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/") + (pad ? "=".repeat(4 - pad) : "");
  return Buffer.from(normalized, "base64").toString("utf8");
};

const sign = (payload: string) => {
  const hmac = crypto.createHmac("sha256", getSessionSecret());
  hmac.update(payload);
  return base64UrlEncode(hmac.digest());
};

const hashPassword = (password: string, salt: string) =>
  crypto.scryptSync(password, salt, 64).toString("hex");

export const createAdminUser = (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || password.length < 8) {
    return { ok: false, error: "Use a valid email and a password of at least 8 characters." };
  }

  const users = readAdminUsers();
  if (users.length >= ADMIN_LIMIT) {
    return { ok: false, error: "Admin limit reached. Signup is disabled." };
  }

  if (users.some((user) => user.email === normalizedEmail)) {
    return { ok: false, error: "This email is already registered." };
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  const nextUser: AdminUser = {
    email: normalizedEmail,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };

  writeAdminUsers([...users, nextUser]);
  return { ok: true };
};

export const verifyAdminCredentials = (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readAdminUsers();
  const user = users.find((item) => item.email === normalizedEmail);
  if (!user) {
    return { ok: false, error: "Invalid email or password." };
  }

  const incomingHash = hashPassword(password, user.salt);
  const a = Buffer.from(user.passwordHash, "hex");
  const b = Buffer.from(incomingHash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, error: "Invalid email or password." };
  }

  return { ok: true, email: normalizedEmail };
};

export const setAdminSession = (email: string) => {
  const now = Date.now();
  const payload = JSON.stringify({ email, exp: now + SESSION_TTL_MS });
  const encoded = base64UrlEncode(payload);
  const signature = sign(encoded);
  const token = `${encoded}.${signature}`;

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
};

export const clearAdminSession = () => {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
};

export const getAdminSession = () => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  if (sign(encoded) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as { email: string; exp: number };
    if (!payload?.email || !payload?.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export const requireAdmin = () => {
  const session = getAdminSession();
  if (!session) {
    redirect("/admin/signin");
  }
  return session;
};

export const canSignUp = () => readAdminUsers().length < ADMIN_LIMIT;

/* Password reset helpers (store only token hashes) */
const sha256Hex = (input: string) => crypto.createHash("sha256").update(input).digest("hex");

const generateToken = (len = 48) => base64UrlEncode(crypto.randomBytes(len));

export const createPasswordReset = async (email: string, origin = "") => {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return { ok: false, error: "Provide an email." };

  const users = readAdminUsers();
  const user = users.find((u) => u.email === normalized);
  const generic = { ok: true, message: "If an account exists we sent reset instructions." };

  if (!user) return generic;

  pruneExpiredResetTokens();

  const token = generateToken(32);
  const tokenHash = sha256Hex(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString();

  const tokens = readResetTokens();
  const nextRecord = {
    email: normalized,
    tokenHash,
    expiresAt,
    createdAt: new Date().toISOString(),
  };
  writeResetTokens([...tokens, nextRecord]);

  const resetUrl = origin
    ? `${origin.replace(/\/$/, "")}/admin/password-reset/${token}`
    : `/admin/password-reset/${token}`;

  // Always log the link to server logs (useful when no email configured)
  console.info("Password reset link:", resetUrl);

  // Only return the link in responses when explicitly allowed.
  const showResetLink =
    process.env.SHOW_RESET_LINK === "true" || origin.includes("localhost") || process.env.NODE_ENV !== "production";

  if (showResetLink) {
    return { ok: true, message: "Reset link generated.", resetUrl };
  }

  return generic;
};

export const resetPasswordWithToken = (token: string, newPassword: string) => {
  if (!token || typeof token !== "string" || newPassword.length < 8) {
    return { ok: false, error: "Invalid token or password too short (min 8 chars)." };
  }

  pruneExpiredResetTokens();
  const tokens = readResetTokens();
  const tokenHash = sha256Hex(token);
  const now = Date.now();
  const idx = tokens.findIndex((t) => t.tokenHash === tokenHash && new Date(t.expiresAt).getTime() > now);
  if (idx === -1) {
    return { ok: false, error: "Invalid or expired token." };
  }

  const rec = tokens[idx];
  const users = readAdminUsers();
  const userIndex = users.findIndex((u) => u.email === rec.email);
  if (userIndex === -1) {
    tokens.splice(idx, 1);
    writeResetTokens(tokens);
    return { ok: false, error: "Account not found." };
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(newPassword, salt);
  users[userIndex].salt = salt;
  users[userIndex].passwordHash = passwordHash;
  writeAdminUsers(users);

  // consume token
  tokens.splice(idx, 1);
  writeResetTokens(tokens);

  return { ok: true };
};
