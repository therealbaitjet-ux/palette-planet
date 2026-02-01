import Image from "next/image";
import { Brand } from "@/lib/data";
import Link from "next/link";

const formatColors = (colors: string[]) =>
  colors.length ? `linear-gradient(135deg, ${colors.join(", ")})` : "";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20">
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
        style={{ background: formatColors(brand.dominantColors) }}
      />
      <div className="relative flex h-full flex-col gap-6">
        <Link
          href={`/logo/${brand.slug}`}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-6 transition hover:border-white/30 focus-ring"
          aria-label={`${brand.name} logo page`}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60 blur-2xl"
            style={{ background: formatColors(brand.dominantColors) }}
          />
          <Image
            src={brand.logoUrl}
            alt={`${brand.name} logo`}
            width={320}
            height={180}
            className="relative z-10 h-36 w-full object-contain drop-shadow-[0_22px_45px_rgba(15,23,42,0.65)] md:h-40"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-white">
            <Link href={`/brand/${brand.slug}`} className="hover:text-white/90 focus-ring">
              {brand.name}
            </Link>
          </h3>
          {brand.website ? (
            <Link
              href={brand.website}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-white focus-ring"
            >
              {brand.website.replace(/^https?:\/\//, "")}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
