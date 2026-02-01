import fs from "fs";
import path from "path";
import crypto from "crypto";

export type AdminUser = {
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

export type StoredBrand = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  tags: string[];
  logoUrl: string;
  dominantColors: string[];
  country: string;
  website?: string;
  createdAt: string;
  featured: boolean;
  views: number;
};

const dataDir = path.join(process.cwd(), "data");
const usersPath = path.join(dataDir, "admin-users.json");
const brandsPath = path.join(dataDir, "admin-brands.json");
const sessionSecretPath = path.join(dataDir, "admin-session-secret");

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const readJson = <T>(filePath: string, fallback: T): T => {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (filePath: string, payload: unknown) => {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
};

export const readAdminUsers = () => readJson<AdminUser[]>(usersPath, []);

export const writeAdminUsers = (users: AdminUser[]) => {
  writeJson(usersPath, users);
};

export const readAdminBrands = () => readJson<StoredBrand[]>(brandsPath, []);

export const writeAdminBrands = (brands: StoredBrand[]) => {
  writeJson(brandsPath, brands);
};

export const getSessionSecret = () => {
  if (process.env.ADMIN_SESSION_SECRET) {
    return process.env.ADMIN_SESSION_SECRET;
  }

  ensureDataDir();
  if (fs.existsSync(sessionSecretPath)) {
    return fs.readFileSync(sessionSecretPath, "utf8").trim();
  }

  const secret = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(sessionSecretPath, secret, { encoding: "utf8", mode: 0o600 });
  return secret;
};
