import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandGrid from "@/components/BrandGrid";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getBrands, categories, getCategoryBySlug } from "@/lib/data";
import { absoluteUrl, truncate } from "@/lib/seo";

const ITEMS_PER_PAGE = 24;

export async function generateStaticParams() {
  const paths: { slug: string; page: string }[] = [];
  for (const cat of categories) {
    const count = getBrands().filter((b) => b.categorySlug === cat.slug).length;
    const pages = Math.ceil(count / ITEMS_PER_PAGE);
    for (let i = 1; i <= pages; i++) {
      paths.push({ slug: cat.slug, page: String(i) });
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}): Promise<Metadata> {
  const { slug, page } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} - Page ${page}`,
    description: truncate(cat.description, 155),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}) {
  const { slug, page } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const allBrands = getBrands().filter((b) => b.categorySlug === slug);
  const currentPage = parseInt(page, 10) || 1;
  const totalPages = Math.ceil(allBrands.length / ITEMS_PER_PAGE);

  if (currentPage < 1 || currentPage > totalPages) notFound();

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const brands = allBrands.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SeoJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: brands.map((b, i) => ({
            "@type": "ListItem",
            position: start + i + 1,
            url: absoluteUrl(`/brand/${b.slug}`),
            name: b.name,
          })),
        }}
      />

      <div className="mb-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Category</p>
        <h1 className="text-3xl font-semibold text-white">{category.name}</h1>
        <p className="text-slate-300">{category.description}</p>
        <p className="text-sm text-slate-400">
          {allBrands.length} brands • Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="glass rounded-3xl p-8">
        <h2 className="text-lg font-semibold text-white">SEO overview</h2>
        <p className="mt-3 text-sm text-slate-300">{category.seoIntro}</p>
      </div>

      <BrandGrid brands={brands} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-8 border-t border-white/10 mt-10">
          {/* Previous */}
          {currentPage > 1 ? (
            <Link
              href={`/category/${slug}/${currentPage - 1}`}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Prev
            </Link>
          ) : (
            <span className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-600 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Prev
            </span>
          )}

          {/* First + Ellipsis */}
          {currentPage > 3 && (
            <>
              <Link
                href={`/category/${slug}/1`}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white min-w-[40px] text-center"
              >
                1
              </Link>
              {currentPage > 4 && <span className="px-1 text-slate-500">...</span>}
            </>
          )}

          {/* Page Numbers - show 5 around current */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p >= Math.max(1, currentPage - 2) && p <= Math.min(totalPages, currentPage + 2))
            .map((p) => (
            <Link
              key={p}
              href={`/category/${slug}/${p}`}
              className={`rounded-lg px-3 py-2 text-sm min-w-[40px] text-center transition ${
                p === currentPage
                  ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/25"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {p}
            </Link>
          ))}

          {/* Ellipsis + Last */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span className="px-1 text-slate-500">...</span>}
              <Link
                href={`/category/${slug}/${totalPages}`}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white min-w-[40px] text-center"
              >
                {totalPages}
              </Link>
            </>
          )}

          {/* Next */}
          {currentPage < totalPages ? (
            <Link
              href={`/category/${slug}/${currentPage + 1}`}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          ) : (
            <span className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-600 cursor-not-allowed">
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </span>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
        <Link href="/gallery" className="hover:text-white">
          All brands
        </Link>
        {categories
          .filter((c) => c.slug !== slug)
          .map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}/1`} className="hover:text-white">
              {c.name}
            </Link>
          ))}
      </div>
    </div>
  );
}
