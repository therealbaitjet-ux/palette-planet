import Image from "next/image";
import { Brand } from "@/lib/data";
import Link from "next/link";

const formatColors = (colors: string[]) =>
  colors.length ? `linear-gradient(135deg, ${colors.join(", ")})` : "";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10">
      {/* Hover gradient effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: formatColors(brand.dominantColors) }}
      />
      
      <div className="relative flex h-full flex-col gap-2">
        {/* Logo Image Container */}
        <Link
          href={`/logo/${brand.slug}`}
          className="relative overflow-hidden rounded-lg border border-white/10 bg-black/30 p-2 transition hover:border-white/30 focus-ring"
          aria-label={`${brand.name} logo page`}
        >
          {/* Glow effect behind logo */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 blur-2xl transition-opacity group-hover:opacity-60"
            style={{ background: formatColors(brand.dominantColors) }}
          />
          
          {/* Logo Image */}
          <Image
            src={brand.logoUrl}
            alt={`${brand.name} logo`}
            width={320}
            height={180}
            className="relative z-10 h-36 w-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105 md:h-40"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </Link>
        
        {/* Brand Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-white">
            <Link 
              href={`/brand/${brand.slug}`} 
              className="hover:text-indigo-300 transition-colors focus-ring"
            >
              {brand.name}
            </Link>
          </h3>
          
          {brand.tags && brand.tags.length > 0 && (
            <p className="text-xs text-slate-400 line-clamp-1">
              {brand.tags.slice(0, 3).join(' • ')}
            </p>
          )}
          
          {brand.website ? (
            <Link
              href={brand.website}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-indigo-300 transition-colors focus-ring"
            >
              {brand.website.replace(/^https?:\/\//, "").replace(/^www\./, "")}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
