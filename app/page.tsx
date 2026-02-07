import Link from "next/link";
import Image from "next/image";
import GodLevelSearch from "@/components/GodLevelSearch";
import BrandGrid from "@/components/BrandGrid";
import AdUnit from "@/components/AdUnit";
import AffiliateCTA from "@/components/AffiliateCTA";
import SponsorBanner from "@/components/SponsorBanner";
import NewsletterSignup from "@/components/NewsletterSignup";
import LogoRevealOrbitAnimation from "@/components/LogoRevealOrbitAnimation";
import { categories, getTopBrands } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export const metadata = {
  title: "Palette Planet | Curated Brand Logo Gallery for Designers & Founders",
  description: "Discover 500+ brand identities and logos. Get inspired by curated collections from tech, lifestyle, and hospitality. Design tools and resources included.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featuredBrands = getTopBrands(20);
  
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      {/* Advanced Logo Reveal + Orbit Animation Hero */}
      <section className="rounded-3xl overflow-hidden border border-white/10">
        <LogoRevealOrbitAnimation />
      </section>

      {/* Hero Content Below Animation */}
      <section className="glass rounded-3xl p-8 md:p-12">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto text-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">
              Curated Brand Identity Gallery
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Discover World-Class Brand Logos
            </h1>
            <p className="text-lg text-slate-300">
              Explore 559+ carefully curated brand identities from the world&apos;s most innovative companies.
              Get inspired, study design patterns, and find resources to create your own.
            </p>
          </div>

          <GodLevelSearch placeholder="Search 559+ brand logos..." basePath="/gallery" />

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
            <span>Popular:</span>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-indigo-500/50 hover:bg-indigo-500/10"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Unit - Below Hero */}
      <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
        <p className="mb-2 text-center text-xs text-slate-500">Advertisement</p>
        <AdUnit slot="1234567890" className="min-h-[90px] w-full" />
      </div>

      {/* Affiliate CTA - Design Tools */}
      <section>
        <AffiliateCTA tool="canva" />
      </section>

      {/* Featured Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Browse by Category</h2>
            <p className="text-sm text-slate-400">
              Hand-picked collections with strong visual identity
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            View all →
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-indigo-500/30 hover:bg-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{category.description}</p>
                </div>
                <Image
                  src="/logos/abstract-mark.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="opacity-50 group-hover:opacity-100"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sponsor Banner */}
      <section>
        <SponsorBanner />
      </section>

      {/* Top Brands */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Most Popular Logos</h2>
            <p className="text-sm text-slate-400">
              The most viewed brand identities this week
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            View all →
          </Link>
        </div>
        
        <BrandGrid brands={featuredBrands} />
      </section>

      {/* Affiliate CTA - Logo Maker */}
      <section>
        <AffiliateCTA tool="looka" />
      </section>

      {/* Newsletter */}
      <section>
        <NewsletterSignup />
      </section>

      {/* Design Resources Section */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">Design Resources</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="https://www.canva.com/pro?ref=paletteplanet"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-purple-500/50 hover:bg-white/10"
          >
            <span className="text-2xl">🎨</span>
            <h3 className="mt-2 font-semibold text-white">Canva Pro</h3>
            <p className="text-sm text-slate-400">Design logos easily</p>
          </a>
          <a
            href="https://www.figma.com/?ref=paletteplanet"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-orange-500/50 hover:bg-white/10"
          >
            <span className="text-2xl">✏️</span>
            <h3 className="mt-2 font-semibold text-white">Figma</h3>
            <p className="text-sm text-slate-400">Professional design</p>
          </a>
          <a
            href="https://looka.com/?ref=paletteplanet"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-500/50 hover:bg-white/10"
          >
            <span className="text-2xl">🤖</span>
            <h3 className="mt-2 font-semibold text-white">Looka</h3>
            <p className="text-sm text-slate-400">AI logo maker</p>
          </a>
          <Link
            href="/blog"
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-500/50 hover:bg-white/10"
          >
            <span className="text-2xl">📚</span>
            <h3 className="mt-2 font-semibold text-white">Design Blog</h3>
            <p className="text-sm text-slate-400">Tips & tutorials</p>
          </Link>
        </div>
      </section>

      {/* Footer Ad */}
      <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
        <p className="mb-2 text-center text-xs text-slate-500">Advertisement</p>
        <AdUnit slot="0987654321" className="min-h-[250px] w-full" />
      </div>
    </div>
  );
}
