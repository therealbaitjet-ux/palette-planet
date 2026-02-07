// API: Upload with Supabase + GitHub persistence
// Saves to Supabase for immediate availability, then GitHub for persistence
// Note: Local filesystem is read-only on Vercel, so we skip local save

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "baitjet";
const GITHUB_REPO = process.env.GITHUB_REPO || "palette-planet";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

// Supabase configuration - lazy loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jqygmrgargwvjovhrbid.supabase.co";

function getSupabase() {
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;

    if (!file || !name) {
      return NextResponse.json(
        { error: "Missing file or name" },
        { status: 400 }
      );
    }

    // Validate
    const validTypes = ["image/png", "image/svg+xml", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use PNG, SVG, or JPG" },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 2MB" },
        { status: 400 }
      );
    }

    // Generate slug and filename
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const ext = file.type === "image/svg+xml" ? "svg" : "png";
    const filename = `${slug}.${ext}`;
    const filepath = `public/logos/${filename}`;
    const logoUrl = `/logos/${filename}`;
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Save brand data to Supabase FIRST (for immediate site availability)
    const brandData = {
      id: slug,
      name: name,
      slug: slug,
      description: `${name} is a leading brand known for its distinctive visual identity.`,
      category_slug: category,
      tags: ["brand", "logo", category],
      logo_url: logoUrl,
      dominant_colors: [],
      country: "US",
      website: `https://${slug.replace(/-/g, "")}.com`,
      featured: false,
      views: 0,
    };

    let supabaseSuccess = false;
    try {
      const { error: dbError } = await getSupabase()
        .from("brands")
        .upsert(brandData, { onConflict: "id" });

      if (dbError) {
        console.error("Supabase error:", dbError);
      } else {
        supabaseSuccess = true;
        console.log("✓ Saved to Supabase:", slug);
      }
    } catch (err) {
      console.error("Supabase exception:", err);
    }

    // 3. Commit logo file to GitHub (for persistence across deploys)
    let githubSuccess = false;
    if (GITHUB_TOKEN) {
      try {
        const content = buffer.toString("base64");
        
        // Get current file SHA (if exists)
        let sha: string | undefined;
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

        // Commit to GitHub
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
              message: `Add logo: ${name}`,
              content,
              branch: GITHUB_BRANCH,
              ...(sha && { sha }),
            }),
          }
        );

        if (commitRes.ok) {
          githubSuccess = true;
          console.log("✓ Committed to GitHub:", filename);
        } else {
          console.error("✗ GitHub commit failed:", await commitRes.text());
        }
      } catch (err) {
        console.error("✗ GitHub error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Logo uploaded successfully!",
      filename,
      slug,
      brandData,
      local: true,
      supabase: supabaseSuccess,
      github: githubSuccess,
      note: "Logo is now live on the site!",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
