import Link from "next/link";
import { Metadata } from "next";
import BrandGrid from "@/components/BrandGrid";
import GodLevelSearch from "@/components/GodLevelSearch";
import TagsFilter from "@/components/TagsFilter";
import SeoJsonLd from "@/components/SeoJsonLd";
import { Brand, getBrands, categories } from "@/lib/data";
import { DEFAULT_DESCRIPTION, absoluteUrl, truncate } from "@/lib/seo";

const sortOptions = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "az", label: "A–Z" },
];

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const normalize = (value: string) => value.toLowerCase();

const filterBrands = ({
  brands,
  query,
  category,
  tag,
  sort,
}: {
  brands: Brand[];
  query: string;
  category?: string;
  tag?: string;
  sort?: string;
}) => {
  const normalizedQuery = normalize(query);
  let result = brands.filter((brand) => {
    const matchesQuery = normalizedQuery
      ? [brand.name, brand.description, brand.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      : true;
    const matchesCategory = category ? brand.categorySlug === category : true;
    const matchesTag = tag ? brand.tags.includes(tag) : true;
    return matchesQuery && matchesCategory && matchesTag;
  });

  switch (sort) {
    case "newest":
      result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "az":
      result = result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "popular":
    default:
      result = result.sort((a, b) => b.views - a.views);
  }

  return result;
};

export const metadata: Metadata = {
  title: "Logo Gallery",
  description: truncate(DEFAULT_DESCRIPTION),
  alternates: { canonical: absoluteUrl("/gallery") },
};

const ITEMS_PER_PAGE = 24;

export const dynamic = "force-dynamic";

export default function GalleryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const brands = getBrands();
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const tag = typeof searchParams.tag === "string" ? searchParams.tag : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "popular";
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) || 1 : 1;

  const filtered = filterBrands({ brands, query, category, tag, sort });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(Math.max(page, 1), totalPages || 1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBrands = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const tagOptions = Array.from(new Set(brands.flatMap((brand) => brand.tags)));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
      <SeoJsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: paginatedBrands.map((brand, index) => ({
          "@type": "ListItem",
          position: startIndex + index + 1,
          url: absoluteUrl(`/brand/${brand.slug}`),
          name: brand.name,
        })),
      }} id="gallery-itemlist" />
      
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Gallery</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">Browse brand logos</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Filter by category, tag, and popularity to discover premium logo systems.
        </p>
        <p className="text-sm text-slate-400">
          {filtered.length} brands {totalPages > 1 && `• Page ${currentPage} of ${totalPages}`}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GodLevelSearch placeholder={`Search ${brands.length}+ brand logos...`} />
        <div className="glass flex flex-col gap-4 rounded-2xl p-4">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Category</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/gallery${buildQueryString({ q: query || undefined, category: cat.slug, tag, sort })}`}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    category === cat.slug
                      ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href={`/gallery${buildQueryString({ q: query || undefined, tag, sort })}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 transition hover:border-white/30"
              >
                All
              </Link>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Sort</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Link
                  key={option.value}
                  href={`/gallery${buildQueryString({ q: query || undefined, category, tag, sort: option.value })}`}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    sort === option.value
                      ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
          <TagsFilter
            tags={tagOptions}
            selectedTag={tag}
            basePath="/gallery"
            queryParams={{ q: query || undefined, category, sort }}
            brands={brands}
          />
        </div>
      </div>

      {paginatedBrands.length > 0 ? (
        <BrandGrid brands={paginatedBrands} />
      ) : (
        <div className="glass rounded-3xl p-10 text-center">
          <h2 className="text-xl font-semibold text-white">No results found</h2>
          <Link href="/gallery" className="mt-4 inline-block rounded-full border border-white/20 px-5 py-2 text-sm text-slate-200 hover:border-white/40">
            Reset filters
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {currentPage > 1 && (
            <Link
              href={`/gallery${buildQueryString({ q: query || undefined, category, tag, sort, page: String(currentPage - 1) })}`}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              ← Prev
            </Link>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/gallery${buildQueryString({ q: query || undefined, category, tag, sort, page: p === 1 ? undefined : String(p) })}`}
              className={`rounded-lg px-4 py-2 text-sm min-w-[40px] text-center ${
                p === currentPage
                  ? "bg-indigo-600 text-white font-semibold"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {p}
            </Link>
          ))}
          
          {currentPage < totalPages && (
            <Link
              href={`/gallery${buildQueryString({ q: query || undefined, category, tag, sort, page: String(currentPage + 1) })}`}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
