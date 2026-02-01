import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionSecret, readAdminUsers, writeAdminUsers, AdminUser } from "@/lib/adminStore";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ADMIN_LIMIT = 2;

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
