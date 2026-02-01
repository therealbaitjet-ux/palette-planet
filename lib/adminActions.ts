"use server";

import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
import {
  canSignUp,
  clearAdminSession,
  createAdminUser,
  requireAdmin,
  setAdminSession,
  verifyAdminCredentials,
} from "@/lib/adminAuth";
import { readAdminBrands, writeAdminBrands } from "@/lib/adminStore";
import { getBrandBySlug } from "@/lib/data";

type ActionState = {
  error?: string;
  success?: string;
};

const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");

const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const signupAdmin = async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
  if (!canSignUp()) {
    return { error: "Admin limit reached. Signup is disabled." };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = createAdminUser(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  setAdminSession(email.trim().toLowerCase());
  redirect("/admin/upload");
};

export const signinAdmin = async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = verifyAdminCredentials(email, password);
  if (!result.ok || !result.email) {
    return { error: result.error ?? "Invalid email or password." };
  }

  setAdminSession(result.email);
  redirect("/admin/upload");
};

export const signoutAdmin = async () => {
  clearAdminSession();
  redirect("/admin/signin");
};

export const createLogo = async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
  requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "");
  const slug = slugify(rawSlug || name);
  const description = String(formData.get("description") ?? "").trim();
  const categorySlug = String(formData.get("categorySlug") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const dominantColorsRaw = String(formData.get("dominantColors") ?? "").trim();
  const file = formData.get("logo");

  if (!name || !slug || !categorySlug || !country) {
    return { error: "Name, slug, category, and country are required." };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug can only include lowercase letters, numbers, and dashes." };
  }

  if (getBrandBySlug(slug)) {
    return { error: "This slug already exists. Choose a unique slug." };
  }

  if (!file || !(file instanceof File)) {
    return { error: "Please attach a logo file." };
  }

  const maxSizeMb = 4;
  if (file.size > maxSizeMb * 1024 * 1024) {
    return { error: `Logo must be smaller than ${maxSizeMb}MB.` };
  }

  const allowedTypes: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  const ext = allowedTypes[file.type];
  if (!ext) {
    return { error: "Logo must be PNG, JPG, WEBP, or SVG." };
  }

  ensureUploadDir();
  const filename = `${slug}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const tags = tagsRaw
    ? Array.from(new Set(tagsRaw.split(",").map((tag) => tag.trim()).filter(Boolean)))
    : [];
  const dominantColors = dominantColorsRaw
    ? dominantColorsRaw
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean)
        .slice(0, 2)
    : [];

  const newBrand = {
    id: `adm-${Date.now()}`,
    name,
    slug,
    description: description || `${name} logo`,
    categorySlug,
    tags,
    logoUrl: `/uploads/logos/${filename}`,
    dominantColors,
    country,
    website: website || undefined,
    createdAt: new Date().toISOString(),
    featured,
    views: 0,
  };

  const current = readAdminBrands();
  writeAdminBrands([...current, newBrand]);

  return { success: "Logo added successfully." };
};

export const updateLogo = async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
  requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "");
  const slug = slugify(rawSlug || name);
  const description = String(formData.get("description") ?? "").trim();
  const categorySlug = String(formData.get("categorySlug") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const dominantColorsRaw = String(formData.get("dominantColors") ?? "").trim();
  const file = formData.get("logo");

  if (!id) {
    return { error: "Missing logo id." };
  }

  if (!name || !slug || !categorySlug || !country) {
    return { error: "Name, slug, category, and country are required." };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug can only include lowercase letters, numbers, and dashes." };
  }

  const current = readAdminBrands();
  const index = current.findIndex((brand) => brand.id === id);
  if (index === -1) {
    return { error: "Logo not found." };
  }

  const existing = current[index];
  const slugConflict = getBrandBySlug(slug);
  if (slugConflict && slugConflict.id !== existing.id) {
    return { error: "This slug already exists. Choose a unique slug." };
  }

  let logoUrl = existing.logoUrl;
  const allowedTypes: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };

  const hasNewFile = file instanceof File && file.size > 0;
  if (hasNewFile) {
    const maxSizeMb = 4;
    if (file.size > maxSizeMb * 1024 * 1024) {
      return { error: `Logo must be smaller than ${maxSizeMb}MB.` };
    }
    const ext = allowedTypes[file.type];
    if (!ext) {
      return { error: "Logo must be PNG, JPG, WEBP, or SVG." };
    }
    ensureUploadDir();
    const filename = `${slug}.${ext}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    logoUrl = `/uploads/logos/${filename}`;
  } else if (slug !== existing.slug && existing.logoUrl.startsWith("/uploads/logos/")) {
    const existingExt = existing.logoUrl.split(".").pop() ?? "png";
    const newFilename = `${slug}.${existingExt}`;
    const oldPath = path.join(process.cwd(), "public", existing.logoUrl);
    const newPath = path.join(uploadDir, newFilename);
    ensureUploadDir();
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      logoUrl = `/uploads/logos/${newFilename}`;
    }
  }

  const tags = tagsRaw
    ? Array.from(new Set(tagsRaw.split(",").map((tag) => tag.trim()).filter(Boolean)))
    : [];
  const dominantColors = dominantColorsRaw
    ? dominantColorsRaw
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean)
        .slice(0, 2)
    : [];

  const updated = {
    ...existing,
    name,
    slug,
    description: description || `${name} logo`,
    categorySlug,
    tags,
    logoUrl,
    dominantColors,
    country,
    website: website || undefined,
    featured,
  };

  const next = [...current];
  next[index] = updated;
  writeAdminBrands(next);

  return { success: "Logo updated successfully." };
};

export const deleteLogo = async (formData: FormData) => {
  requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin/logos");
  }

  const current = readAdminBrands();
  const target = current.find((brand) => brand.id === id);
  if (!target) {
    redirect("/admin/logos");
  }

  const remaining = current.filter((brand) => brand.id !== id);
  writeAdminBrands(remaining);

  if (target.logoUrl.startsWith("/uploads/logos/")) {
    const filePath = path.join(process.cwd(), "public", target.logoUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  redirect("/admin/logos");
};
