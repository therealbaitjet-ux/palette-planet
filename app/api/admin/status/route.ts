// API: Check admin configuration status
// Diagnoses why uploads might not be working

import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    github_token_set: !!process.env.GITHUB_TOKEN,
    github_token_length: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0,
    github_owner: process.env.GITHUB_OWNER || "baitjet (default)",
    github_repo: process.env.GITHUB_REPO || "palette-planet (default)",
    github_branch: process.env.GITHUB_BRANCH || "main (default)",
    admin_password_set: !!process.env.ADMIN_PASSWORD,
  };

  // Test GitHub API connection
  let githubTest = { success: false, error: null };
  if (process.env.GITHUB_TOKEN) {
    try {
      const testRes = await fetch(
        `https://api.github.com/repos/${process.env.GITHUB_OWNER || "baitjet"}/${process.env.GITHUB_REPO || "palette-planet"}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      
      if (testRes.ok) {
        const data = await testRes.json();
        githubTest = { 
          success: true, 
          repo_exists: true,
          repo_name: data.full_name,
          default_branch: data.default_branch
        };
      } else {
        const error = await testRes.text();
        githubTest = { 
          success: false, 
          error: `GitHub API error: ${testRes.status}`,
          details: error
        };
      }
    } catch (err: any) {
      githubTest = { 
        success: false, 
        error: err.message 
      };
    }
  }

  return NextResponse.json({
    status: "diagnostic",
    checks,
    github_test: githubTest,
    timestamp: new Date().toISOString(),
  });
}
