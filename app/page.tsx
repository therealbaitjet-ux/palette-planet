import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import BrandGrid from "@/components/BrandGrid";
import AdUnit from "@/components/AdUnit";
import { categories, getFeaturedBrands } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export const metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featuredBrands = getFeaturedBrands();
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="glass rounded-3xl p-10 md:p-14">
        <div className="flex flex-col gap-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Premium Logo Directory
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              A curated gallery of brand identities, built for founders and designers.
            </h1>
            <p className="text-base text-slate-300">
              Discover modern logos and identity systems across technology, lifestyle, wellness, and hospitality.
              Each brand includes thoughtful context to inspire your next build.
            </p>
          </div>
          <SearchBar placeholder="Search 101+ Fortune 500 brands" basePath="/gallery" />
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <span>Popular categories:</span>
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:border-white/30 focus-ring"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Ad Unit - Above the Fold */}
      <div className="mx-auto w-full max-w-4xl">
        <AdUnit slot="top-banner" style={{ minHeight: "90px" }} />
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Featured categories</h2>
            <p className="text-sm text-slate-400">
              Hand-picked collections with strong visual identity and brand storytelling.
            </p>
          </div>
          <Link
            href="/category"
            className="text-sm font-semibold text-indigo-300 hover:text-indigo-200 focus-ring"
          >
            View all categories
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-white/30 focus-ring"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  <p className="text-sm text-slate-300">{category.description}</p>
                </div>
                <Image
                  src="/logos/abstract-mark.svg"
                  alt="Category icon"
                  width={48}
                  height={48}
                  className="opacity-70"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Featured brands</h2>
            <p className="text-sm text-slate-400">
              Standout logos that set the tone for world-class identity systems.
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-semibold text-indigo-300 hover:text-indigo-200 focus-ring"
          >
            Browse all brands
          </Link>
        </div>
        <BrandGrid brands={featuredBrands} />
      </section>

      {/* Middle Ad Unit - In Content */}
      <div className="mx-auto w-full max-w-4xl">
        <AdUnit slot="middle-banner" style={{ minHeight: "250px" }} />
      </div>

      <section className="glass rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-semibold text-white">Browse the complete gallery</h2>
        <p className="mt-3 text-sm text-slate-300">
          Filter by category, tags, and popularity to discover logos with premium visual direction.
        </p>
        <Link
          href="/gallery"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus-ring"
        >
          Browse all brands
        </Link>
      </section>
    </div>
  );
}
