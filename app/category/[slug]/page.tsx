import { redirect } from "next/navigation";
import { categories } from "@/lib/data";

export async function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/category/p/${slug}/1`);
}
