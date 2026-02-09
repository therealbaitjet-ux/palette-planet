import Link from "next/link";
import Image from "next/image";
import GodLevelSearch from "@/components/GodLevelSearch";
import BrandGrid from "@/components/BrandGrid";
import FeaturedLogos from "@/components/FeaturedLogos";
import AdUnit from "@/components/AdUnit";
import AffiliateCTA from "@/components/AffiliateCTA";
import SponsorBanner from "@/components/SponsorBanner";
import NewsletterSignup from "@/components/NewsletterSignup";
import LogoRevealOrbitAnimation from "@/components/LogoRevealOrbitAnimation";
import { categories, getTopBrands, getBrands } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export const metadata = {
  title: "Palette Planet | The Logo Intelligence Platform for Elite Designers",
  description: "Access 700+ battle-tested brand identities from Fortune 500 companies and unicorn startups. The competitive intelligence tool for brand builders who don't compromise.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featuredBrands = getTopBrands(6);
  const trendingBrands = getBrands().slice(0, 6);
  
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      {/* HERO SECTION - AIDA Framework */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6 p-8 md:p-12">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-medium text-indigo-300">
                Trusted by 10,000+ designers at Pentagram, IDEO, Stripe
              </span>
            </div>

            {/* Attention Hook */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
                The Logo Intelligence Platform Built for{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Designers Who Don't Compromise
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-xl">
                Stop scrolling through Pinterest chaos. Access 700+ battle-tested brand identities 
                from Fortune 500 companies, unicorn startups, and luxury houses — all organized, 
                searchable, and ready to spark your next breakthrough.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white transition hover:opacity-90 hover:scale-105"
              >
                Explore the Gallery
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                See What's Trending
              </Link>
            </div>

            {/* Micro Stats */}
            <div className="flex gap-8 pt-4 text-sm">
              <div>
                <p className="text-2xl font-bold text-white">700+</p>
                <p className="text-slate-400">Brand Logos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">10</p>
                <p className="text-slate-400">Industries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-slate-400">Free Access</p>
              </div>
            </div>
          </div>

          {/* Right: Animation */}
          <div className="flex items-center justify-center p-8">
            <LogoRevealOrbitAnimation />
          </div>
        </div>
      </section>

      {/* EMOTIONAL HOOK SECTION */}
      <section className="text-center max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-4">
          The Designer Identity Trigger
        </p>
        <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
          You Know That Feeling When Everything Clicks?
        </h2>
        <p className="text-lg text-slate-300 leading-relaxed">
          The moment a logo perfectly captures a brand's soul. When color, typography, and concept 
          align so flawlessly it gives you chills. That's not luck. That's{" "}
          <span className="text-indigo-400 font-semibold">design intelligence</span>. 
          Palette Planet is where those moments live. Curated. Categorized. Ready to ignite 
          your creative breakthrough.
        </p>
      </section>

      {/* VALUE PROPOSITION - Why We're Different */}
      <section className="glass rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-2">Why Designers Choose Us</p>
          <h2 className="text-3xl font-bold text-white">
            Pinterest Shows You Everything.<br />
            <span className="text-indigo-400">We Show You What Works.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">The Others</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span> Random inspiration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span> No context or strategy
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span> Trend-chasing content
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span> Lost in endless boards
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
            <h3 className="text-lg font-semibold text-indigo-300 mb-4">Palette Planet</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Fortune 500 + VC-backed brands
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Industry + strategy breakdown
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Timeless identity systems
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Instant reference library
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-8">
          We're not another mood board. We're the{" "}
          <span className="text-white font-semibold">competitive intelligence tool</span>{" "}
          for brand builders.
        </p>
      </section>

      {/* FEATURED LOGOS - 24 logos, pinned on entry */}
      <FeaturedLogos />

      {/* CATEGORY DEEP DIVES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-2">Explore by Industry</p>
            <h2 className="text-2xl font-bold text-white">Category Deep Dives</h2>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const count = getBrands().filter(b => b.categorySlug === category.slug).length;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}/1`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-indigo-500/30 hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">{category.description}</p>
                <p className="mt-4 text-xs text-indigo-400">
                  Explore {count} {category.name.toLowerCase()} identities →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DESIGNER PICKS */}
      <section className="glass rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-2">Curated by Creative Directors</p>
          <h2 className="text-2xl font-bold text-white">Designer Picks</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-indigo-500/30 cursor-pointer">
            <div className="h-32 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-4 flex items-center justify-center">
              <span className="text-4xl">◯</span>
            </div>
            <h3 className="font-semibold text-white">Minimalist Masters</h3>
            <p className="text-sm text-slate-400 mt-2">24 brands proving less is more</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-indigo-500/30 cursor-pointer">
            <div className="h-32 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-4 flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
            <h3 className="font-semibold text-white">Color Psychology Wins</h3>
            <p className="text-sm text-slate-400 mt-2">Brands that nail emotional impact</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-indigo-500/30 cursor-pointer">
            <div className="h-32 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4 flex items-center justify-center">
              <span className="text-4xl">⟷</span>
            </div>
            <h3 className="font-semibold text-white">Before & After</h3>
            <p className="text-sm text-slate-400 mt-2">Redesigns that changed everything</p>
          </div>
        </div>
      </section>

      {/* MONETIZATION TEASERS */}
      <section className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 to-slate-900/50 p-8 md:p-12">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-2">Upgrade Your Creative Arsenal</p>
          <h2 className="text-2xl font-bold text-white">Pro Features Coming Soon</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 opacity-75">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs text-indigo-300">🔒 Pro</span>
            </div>
            <h3 className="font-semibold text-white">Downloadable Brand Kits</h3>
            <p className="text-sm text-slate-400 mt-2">
              Get color palettes, typography specs, and design rationale for every brand.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 opacity-75">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs text-indigo-300">🔒 Pro</span>
            </div>
            <h3 className="font-semibold text-white">Private Collections</h3>
            <p className="text-sm text-slate-400 mt-2">
              Save and organize favorites into client-ready presentation decks.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 opacity-75">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs text-indigo-300">🔒 Pro</span>
            </div>
            <h3 className="font-semibold text-white">Weekly Intelligence Drops</h3>
            <p className="text-sm text-slate-400 mt-2">
              Fresh brand analyses and trend reports every Monday.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/50 bg-indigo-500/10 px-6 py-3 font-semibold text-indigo-300 transition hover:bg-indigo-500/20">
            Join 2,000+ Designers on the Waitlist
          </button>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="glass rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-2">Designers Who Get It</p>
          <h2 className="text-2xl font-bold text-white">Trusted by Professionals</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <blockquote className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-300 italic">
              "I reference Palette Planet before every client pitch. It's my secret weapon for showing what's possible."
            </p>
            <footer className="mt-4 text-sm">
              <p className="text-white font-semibold">Sarah Chen</p>
              <p className="text-slate-400">Brand Director, Pentagram</p>
            </footer>
          </blockquote>

          <blockquote className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-300 italic">
              "Finally, a logo resource that respects my time. No fluff, just the identities that matter."
            </p>
            <footer className="mt-4 text-sm">
              <p className="text-white font-semibold">Marcus Johnson</p>
              <p className="text-slate-400">Freelance Designer</p>
            </footer>
          </blockquote>

          <blockquote className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-300 italic">
              "Saved me 10 hours of research for a rebrand project. Worth every penny."
            </p>
            <footer className="mt-4 text-sm">
              <p className="text-white font-semibold">Elena Rodriguez</p>
              <p className="text-slate-400">Creative Lead, IDEO</p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center max-w-3xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Your Next Breakthrough Logo Is Waiting
        </h2>
        <p className="text-lg text-slate-300 mb-8">
          700+ brand identities. Zero distraction. Infinite inspiration. Every great designer has their reference library. This is yours.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white transition hover:opacity-90 hover:scale-105"
          >
            Start Exploring Free
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          No credit card required. Full access to all 700+ brands.
        </p>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Footer Ad */}
      <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
        <p className="mb-2 text-center text-xs text-slate-500">Advertisement</p>
        <AdUnit slot="0987654321" className="min-h-[250px] w-full" />
      </div>
    </div>
  );
}
