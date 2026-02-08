import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandGrid from "@/components/BrandGrid";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getBrands, categories, getCategoryBySlug } from "@/lib/data";
import { absoluteUrl, truncate } from "@/lib/seo";

const PER_PAGE = 30;

// Build EVERY page at build time - no runtime params
export async function generateStaticParams() {
  const paths = [];
  for (const cat of categories) {
    const count = getBrands().filter(b => b.categorySlug === cat.slug).length;
    const pages = Math.ceil(count / PER_PAGE);
    for (let i = 1; i <= pages; i++) {
      paths.push({ slug: cat.slug, num: String(i) });
    }
  }
  return paths;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; num: string }> 
}) {
  const { slug, num } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return { title: `${cat.name} - Page ${num}` };
}

export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string; num: string }> 
}) {
  const { slug, num } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const pageNum = parseInt(num, 10);
  const all = getBrands().filter(b => b.categorySlug === slug);
  const total = Math.ceil(all.length / PER_PAGE);
  
  if (pageNum < 1 || pageNum > total) notFound();
  
  const start = (pageNum - 1) * PER_PAGE;
  const brands = all.slice(start, start + PER_PAGE);

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
        <p className="text-sm text-slate-400">Page {pageNum} of {total}</p>
      </div>

      <BrandGrid brands={brands} />

      {/* NAV with smart ellipses */}
      {total > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-1 flex-wrap">
          {/* Prev */}
          {pageNum > 1 ? (
            <Link href={`/category/p/${slug}/${pageNum - 1}`} 
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10">
              ← Prev
            </Link>
          ) : (
            <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-500">← Prev</span>
          )}

          {/* Smart page numbers with ellipses */}
          {(() => {
            const pages: (number | string)[] = [];
            const delta = 2;
            for (let i = 1; i <= total; i++) {
              if (i === 1 || i === total || (i >= pageNum - delta && i <= pageNum + delta)) {
                pages.push(i);
              } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
              }
            }
            return pages.map((p, idx) => (
              <span key={idx}>
                {p === "..." ? (
                  <span className="px-1 text-slate-500">...</span>
                ) : (
                  <Link href={`/category/p/${slug}/${p}`}
                    className={`rounded-lg px-3 py-2 text-sm min-w-[40px] text-center transition ${
                      p === pageNum ? "bg-indigo-600 text-white font-semibold" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}>
                    {p}
                  </Link>
                )}
              </span>
            ));
          })()}
          
          {/* Next */}
          {pageNum < total ? (
            <Link href={`/category/p/${slug}/${pageNum + 1}`} 
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10">
              Next →
            </Link>
          ) : (
            <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-500">Next →</span>
          )}
        </nav>
      )}

      <div className="mt-8 flex gap-4 text-sm text-slate-400">
        <Link href="/gallery" className="hover:text-white">All brands</Link>
        {categories.filter(c => c.slug !== slug).map(c => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="hover:text-white">{c.name}</Link>
        ))}
      </div>
    </div>
  );
}
