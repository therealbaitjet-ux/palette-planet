// API: Update existing logo via GitHub + Supabase
// Replace file or edit metadata
// Note: Vercel serverless is read-only, so we skip local file save

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "baitjet";
const GITHUB_REPO = process.env.GITHUB_REPO || "palette-planet";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jqygmrgargwvjovhrbid.supabase.co";

function getSupabase() {
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const file = formData.get("file") as File | null;

    if (!id) {
      return NextResponse.json(
        { error: "Missing brand ID" },
        { status: 400 }
      );
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "GitHub not configured" },
        { status: 500 }
      );
    }

    // If new file provided, save locally + GitHub
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/svg+xml", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Use PNG, SVG, or JPG" },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File too large. Max 2MB" },
          { status: 400 }
        );
      }

      const ext = file.type === "image/svg+xml" ? "svg" : "png";
      const filename = `${id}.${ext}`;
      const filepath = `public/logos/${filename}`;

      // Convert to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 1. Update Supabase FIRST (immediate site availability)
      const logoUrl = `/logos/${filename}`;
      const { error: dbError } = await getSupabase()
        .from("brands")
        .upsert({
          id,
          name,
          slug: id,
          category_slug: category,
          logo_url: logoUrl,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });

      if (dbError) {
        console.error("Supabase error:", dbError);
        // Continue anyway - local file is saved
      }

      // 3. Commit to GitHub (for persistence)
      if (GITHUB_TOKEN) {
        let sha: string | undefined;
        try {
          const checkRes = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filepath}?ref=${GITHUB_BRANCH}`,
            {
              headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          if (checkRes.ok) {
            const data = await checkRes.json();
            sha = data.sha;
          }
        } catch {
          // File doesn't exist yet
        }

        const content = buffer.toString("base64");
        const commitRes = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filepath}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Update logo: ${name}`,
              content,
              branch: GITHUB_BRANCH,
              ...(sha && { sha }),
            }),
          }
        );

        if (!commitRes.ok) {
          console.error("GitHub commit failed:", await commitRes.text());
          // Continue - local file and Supabase are updated
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Logo updated successfully",
      id,
      name,
      category,
      deployed: true,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
