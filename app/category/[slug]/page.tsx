import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandGrid from "@/components/BrandGrid";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getBrands, categories, getCategoryBySlug } from "@/lib/data";
import { absoluteUrl, truncate } from "@/lib/seo";

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: truncate(cat.description, 155),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const brands = getBrands().filter((b) => b.categorySlug === slug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SeoJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: brands.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/brand/${b.slug}`),
            name: b.name,
          })),
        }}
      />

      <div className="mb-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Category</p>
        <h1 className="text-3xl font-semibold text-white">{category.name}</h1>
        <p className="text-slate-300">{category.description}</p>
        <p className="text-sm text-slate-400">{brands.length} brands</p>
      </div>

      <div className="glass rounded-3xl p-8">
        <h2 className="text-lg font-semibold text-white">SEO overview</h2>
        <p className="mt-3 text-sm text-slate-300">{category.seoIntro}</p>
      </div>

      <BrandGrid brands={brands} />

      <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
        <Link href="/gallery" className="hover:text-white">
          All brands
        </Link>
        {categories
          .filter((c) => c.slug !== slug)
          .map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="hover:text-white">
              {c.name}
            </Link>
          ))}
      </div>
    </div>
  );
}
