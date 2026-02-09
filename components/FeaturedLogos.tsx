import Image from "next/image";
import Link from "next/link";
import { getTopBrands } from "@/lib/data";

export default function FeaturedLogos() {
  // Get exactly 24 top brands (by views/popularity)
  const featuredBrands = getTopBrands(24);

  return (
    <>
      {/* Featured Section - Normal flow, no pinning */}
      <section className="relative w-full py-12">
        <div className="w-full max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-2">
              Featured Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              24 Iconic Brand Logos
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto">
              Hand-picked identities from Fortune 500 companies and unicorn startups
            </p>
          </div>

          {/* Logo Grid - 6 cols desktop, 4 tablet, 2 mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="group flex items-center justify-center p-2 rounded-lg border border-white/10 bg-white/5 transition hover:border-indigo-500/30 hover:bg-white/10"
              >
                <div className="relative w-full h-20 md:h-24">
                  <Image
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain transition group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Strong Divider */}
      <div className="relative w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500 rounded-full" />
            <Link 
              href="/gallery"
              className="px-4 py-2 rounded-full border-2 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition"
            >
              <span className="text-sm font-medium text-indigo-300">
                Explore All Brands
              </span>
            </Link>
            <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500 rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}
