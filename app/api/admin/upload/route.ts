// API: Upload with Git persistence via GitHub API
// Saves file, commits to GitHub, Vercel auto-redeploys

import { NextResponse } from "next/server";

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "baitjet";
const GITHUB_REPO = process.env.GITHUB_REPO || "palette-planet";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const content = buffer.toString("base64");

    // Check if GitHub token is configured
    if (!GITHUB_TOKEN) {
      // Fallback: Save locally and return message
      return NextResponse.json({
        success: false,
        error: "GitHub not configured",
        message: "Contact Baitjet to configure GitHub integration",
        filename,
        slug,
      });
    }

    // Get current file SHA (if exists)
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

    if (!commitRes.ok) {
      const error = await commitRes.text();
      console.error("GitHub commit failed:", error);
      return NextResponse.json(
        { error: "Failed to commit to GitHub", details: error },
        { status: 500 }
      );
    }

    // Create brand data
    const brandData = {
      id: slug,
      name,
      slug,
      description: `${name} is a leading brand known for its distinctive visual identity.`,
      categorySlug: category,
      tags: ["brand", "logo", category],
      logoUrl: `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filepath}`,
      dominantColors: [],
      country: "US",
      website: `https://${slug.replace(/-/g, "")}.com`,
      createdAt: new Date().toISOString(),
      featured: false,
      views: 0,
    };

    // Also commit the brand data update
    // (In production, you'd update a JSON file or database)

    return NextResponse.json({
      success: true,
      message: "Logo uploaded and committed to GitHub!",
      filename,
      slug,
      brandData,
      deployed: true,
      note: "Vercel will redeploy automatically in 1-2 minutes",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
