import Link from "next/link";
import { Metadata } from "next";
import BrandGrid from "@/components/BrandGrid";
import GodLevelSearch from "@/components/GodLevelSearch";
import TagsFilter from "@/components/TagsFilter";
import SeoJsonLd from "@/components/SeoJsonLd";
import { Brand, getBrands, categories } from "@/lib/data";
import { DEFAULT_DESCRIPTION, absoluteUrl, truncate } from "@/lib/seo";

const PAGE_SIZE = 20;

const sortOptions = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "az", label: "A–Z" },
];

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
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
      result = result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
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
  alternates: {
    canonical: absoluteUrl("/gallery"),
  },
  openGraph: {
    title: "Logo Gallery",
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl("/gallery"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Logo Gallery",
    description: DEFAULT_DESCRIPTION,
  },
};

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
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

  const filtered = filterBrands({ brands, query, category, tag, sort });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const tagOptions = Array.from(new Set(brands.flatMap((brand) => brand.tags)));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: paginated.map((brand, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/brand/${brand.slug}`),
      name: brand.name,
    })),
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
      <SeoJsonLd data={itemList} id="gallery-itemlist" />
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Gallery</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">Browse brand logos</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Filter by category, tag, and popularity to discover premium logo systems built for modern brands.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GodLevelSearch placeholder="Search 196+ brand logos..." />
        <div className="glass flex flex-col gap-4 rounded-2xl p-4">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Category</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/gallery${buildQueryString({
                    q: query || undefined,
                    category: cat.slug,
                    tag,
                    sort,
                  })}`}
                  className={`rounded-full border px-4 py-2 text-xs transition focus-ring ${
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
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 transition hover:border-white/30 focus-ring"
              >
                All categories
              </Link>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Sort</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Link
                  key={option.value}
                  href={`/gallery${buildQueryString({
                    q: query || undefined,
                    category,
                    tag,
                    sort: option.value,
                  })}`}
                  className={`rounded-full border px-4 py-2 text-xs transition focus-ring ${
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

      {paginated.length > 0 ? (
        <BrandGrid brands={paginated} />
      ) : (
        <div className="glass rounded-3xl p-10 text-center">
          <h2 className="text-xl font-semibold text-white">No results found</h2>
          <p className="mt-2 text-sm text-slate-300">
            Try clearing filters or searching by a broader keyword.
          </p>
          <Link
            href="/gallery"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm text-slate-200 hover:border-white/40 focus-ring"
          >
            Reset filters
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>
          Showing {paginated.length} of {filtered.length} brands
        </span>
        <div className="flex items-center gap-3">
          <Link
            href={`/gallery${buildQueryString({
              q: query || undefined,
              category,
              tag,
              sort,
              page: currentPage > 1 ? String(currentPage - 1) : undefined,
            })}`}
            aria-disabled={currentPage === 1}
            className={`rounded-full border px-4 py-2 text-xs transition focus-ring ${
              currentPage === 1
                ? "border-white/5 text-slate-500"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
            }`}
          >
            Previous
          </Link>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Link
            href={`/gallery${buildQueryString({
              q: query || undefined,
              category,
              tag,
              sort,
              page: currentPage < totalPages ? String(currentPage + 1) : undefined,
            })}`}
            aria-disabled={currentPage === totalPages}
            className={`rounded-full border px-4 py-2 text-xs transition focus-ring ${
              currentPage === totalPages
                ? "border-white/5 text-slate-500"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
