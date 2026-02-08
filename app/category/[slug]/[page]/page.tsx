import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandGrid from "@/components/BrandGrid";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getBrands, categories, getCategoryBySlug } from "@/lib/data";
import { absoluteUrl, truncate } from "@/lib/seo";

// Show 30 brands per page
const BRANDS_PER_PAGE = 30;

// Build ALL category pages at build time
export async function generateStaticParams() {
  const paths = [];
  
  for (const category of categories) {
    const count = getBrands().filter(b => b.categorySlug === category.slug).length;
    const pages = Math.ceil(count / BRANDS_PER_PAGE);
    
    for (let i = 1; i <= pages; i++) {
      paths.push({ slug: category.slug, page: String(i) });
    }
  }
  
  return paths;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; page: string }> }) {
  const { slug, page } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} - Page ${page}`,
    description: truncate(cat.description, 155),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string; page: string }> }) {
  const { slug, page } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) notFound();

  const all = getBrands().filter(b => b.categorySlug === category.slug);
  const currentPage = parseInt(page, 10);
  const totalPages = Math.ceil(all.length / BRANDS_PER_PAGE);
  
  if (currentPage < 1 || currentPage > totalPages) notFound();
  
  const start = (currentPage - 1) * BRANDS_PER_PAGE;
  const brands = all.slice(start, start + BRANDS_PER_PAGE);

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
        <p className="text-sm text-slate-400">Page {currentPage} of {totalPages}</p>
      </div>

      <BrandGrid brands={brands} />

      {/* NAVIGATION */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2 border-t border-white/10 pt-6">
          {/* Previous */}
          {currentPage > 1 ? (
            <Link href={`/category/${slug}/${currentPage - 1}`} 
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
              ← Prev
            </Link>
          ) : (
            <span className="rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-500">← Prev</span>
          )}

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`/category/${slug}/${p}`}
              className={`rounded-lg px-4 py-2 text-sm min-w-[44px] text-center ${
                p === currentPage 
                  ? "bg-indigo-600 text-white font-semibold" 
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}>
              {p}
            </Link>
          ))}

          {/* Next */}
          {currentPage < totalPages ? (
            <Link href={`/category/${slug}/${currentPage + 1}`} 
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
              Next →
            </Link>
          ) : (
            <span className="rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-500">Next →</span>
          )}
        </nav>
      )}

      <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
        <Link href="/gallery" className="hover:text-white">All brands</Link>
        {categories.filter(c => c.slug !== slug).map(c => (
          <Link key={c.slug} href={`/category/${c.slug}/1`} className="hover:text-white">{c.name}</Link>
        ))}
      </div>
    </div>
  );
}
