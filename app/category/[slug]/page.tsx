// ONE FILE - handles /category/[slug] and ?page=N
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandGrid from "@/components/BrandGrid";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getBrands, categories, getCategoryBySlug } from "@/lib/data";
import { absoluteUrl, truncate } from "@/lib/seo";

const PER_PAGE = 24;

// Static paths for categories (just the base paths)
export async function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: truncate(cat.description, 155),
  };
}

// This MUST be dynamic to read searchParams
export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  // Parse page number
  const pageNum = Math.max(1, parseInt(pageStr || "1", 10));
  
  // Get brands for this category
  const allBrands = getBrands().filter(b => b.categorySlug === slug);
  const totalPages = Math.ceil(allBrands.length / PER_PAGE);
  
  // Validate page
  if (pageNum > totalPages) notFound();
  
  // Get brands for current page
  const start = (pageNum - 1) * PER_PAGE;
  const brands = allBrands.slice(start, start + PER_PAGE);

  // Build page URLs
  const makeUrl = (p: number) => p === 1 ? `/category/${slug}` : `/category/${slug}?page=${p}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SeoJsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: brands.map((b, i) => ({
          "@type": "ListItem",
          position: start + i + 1,
          url: absoluteUrl(`/brand/${b.slug}`),
          name: b.name,
        })),
      }} />

      <div className="mb-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Category</p>
        <h1 className="text-3xl font-semibold text-white">{category.name}</h1>
        <p className="text-slate-300">{category.description}</p>
        <p className="text-sm text-slate-400">
          Showing {brands.length} of {allBrands.length} brands • Page {pageNum} of {totalPages}
        </p>
      </div>

      <BrandGrid brands={brands} />

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2 border-t border-white/10 pt-6 flex-wrap">
          
          {/* Previous */}
          {pageNum > 1 ? (
            <Link href={makeUrl(pageNum - 1)} 
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
              ← Prev
            </Link>
          ) : (
            <span className="rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-500">
              ← Prev
            </span>
          )}

          {/* Page Numbers 1 to N */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={makeUrl(p)}
              className={`rounded-lg px-4 py-2 text-sm min-w-[44px] text-center transition ${
                p === pageNum 
                  ? "bg-indigo-600 text-white font-semibold" 
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}>
              {p}
            </Link>
          ))}

          {/* Next */}
          {pageNum < totalPages ? (
            <Link href={makeUrl(pageNum + 1)} 
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
              Next →
            </Link>
          ) : (
            <span className="rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-500">
              Next →
            </span>
          )}
          
        </nav>
      )}

      {/* Other categories */}
      <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
        <Link href="/gallery" className="hover:text-white">All brands</Link>
        {categories.filter(c => c.slug !== slug).map(c => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="hover:text-white">{c.name}</Link>
        ))}
      </div>
    </div>
  );
}
