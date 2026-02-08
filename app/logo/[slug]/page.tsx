import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getBrands, getBrandBySlug, getCategoryBySlug } from "@/lib/data";
import { absoluteUrl, truncate } from "@/lib/seo";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const brands = getBrands();
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const brand = getBrandBySlug(params.slug);
  if (!brand) {
    return {};
  }

  const title = `${brand.name} Logo`;
  const description = truncate(`View the ${brand.name} logo in high clarity.`, 155);
  const url = absoluteUrl(`/logo/${brand.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: absoluteUrl(brand.logoUrl),
          width: 1200,
          height: 630,
          alt: `${brand.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(brand.logoUrl)],
    },
  };
};

export default function LogoPage({ params }: { params: { slug: string } }) {
  const brand = getBrandBySlug(params.slug);
  if (!brand) {
    notFound();
  }

  const category = getCategoryBySlug(brand.categorySlug);
  const spotlight = brand.dominantColors[0] ?? "rgba(99,102,241,0.35)";

  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: `${brand.name} logo`,
    contentUrl: absoluteUrl(brand.logoUrl),
    description: brand.description,
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
      <SeoJsonLd data={imageSchema} id={`logo-${brand.slug}-image`} />
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Logo</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          {brand.name} logo
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">{brand.description}</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 blur-3xl"
          style={{
            background: `radial-gradient(circle at top, ${spotlight} 0%, transparent 70%)`,
          }}
        />
        <Image
          src={brand.logoUrl}
          alt={`${brand.name} logo`}
          width={820}
          height={460}
          className="relative z-10 h-56 w-full object-contain drop-shadow-[0_35px_65px_rgba(15,23,42,0.6)] md:h-72"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
        {category ? (
          <Link href={`/category/${category.slug}`} className="hover:text-white focus-ring">
            {category.name}
          </Link>
        ) : null}
        <span>{brand.country}</span>
        <span>Founded in {new Date(brand.createdAt).getFullYear()}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {brand.tags.map((tag) => (
          <Link
            key={tag}
            href={`/gallery?tag=${encodeURIComponent(tag)}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:border-white/30 focus-ring"
          >
            {tag}
          </Link>
        ))}
      </div>

      {brand.website ? (
        <Link
          href={brand.website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200 focus-ring"
        >
          Visit website →
        </Link>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/brand/${brand.slug}`}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 transition hover:border-white/30 focus-ring"
        >
          View brand details
        </Link>
        <Link
          href="/gallery"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 transition hover:border-white/30 focus-ring"
        >
          Back to gallery
        </Link>
      </div>
    </div>
  );
}
