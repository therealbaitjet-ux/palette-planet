import { redirect } from "next/navigation";
import { categories } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = false;

// Generate static params for redirect page
export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Redirect /category/[slug] to /category/[slug]/1
export default async function CategoryRedirect({ 
  params 
}: { 
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/category/${slug}/1`);
}
