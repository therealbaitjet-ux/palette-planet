import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandGrid from "@/components/BrandGrid";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getBrands, categories, getBrandBySlug, getCategoryBySlug } from "@/lib/data";
import { absoluteUrl, truncate } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = true;

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

  const title = `${brand.name} Logo - ${brand.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Brand Identity | Palette Planet`;
  const description = truncate(`${brand.name} logo and brand identity analysis. ${brand.description} Explore design elements, color palette, and typography. Part of our curated gallery of ${brand.tags.slice(0, 3).join(', ')} brand designs.`, 155);
  const url = absoluteUrl(`/brand/${brand.slug}`);

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

export default function BrandPage({ params }: { params: { slug: string } }) {
  const brand = getBrandBySlug(params.slug);
  if (!brand) {
    notFound();
  }

  const category = getCategoryBySlug(brand.categorySlug);
  const related = getBrands()
    .filter(
      (item) =>
        item.slug !== brand.slug &&
        (item.categorySlug === brand.categorySlug ||
          item.tags.some((tag) => brand.tags.includes(tag)))
    )
    .slice(0, 3);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.website ?? absoluteUrl(`/brand/${brand.slug}`),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(brand.logoUrl),
      caption: `${brand.name} logo - ${brand.categorySlug.replace(/-/g, ' ')} brand identity`,
    },
    sameAs: brand.website ? [brand.website] : undefined,
    description: brand.description,
    brand: {
      "@type": "Brand",
      name: brand.name,
      logo: absoluteUrl(brand.logoUrl),
    },
  };

  const imageObject = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: absoluteUrl(brand.logoUrl),
    name: `${brand.name} logo`,
    description: `${brand.name} ${brand.categorySlug.replace(/-/g, ' ')} logo design and brand identity`,
    author: {
      "@type": "Organization",
      name: brand.name,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gallery",
        item: absoluteUrl("/gallery"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brand.name,
        item: absoluteUrl(`/brand/${brand.slug}`),
      },
    ],
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
      <SeoJsonLd data={organization} id={`brand-${brand.slug}-org`} />
      <SeoJsonLd data={imageObject} id={`brand-${brand.slug}-image`} />
      <SeoJsonLd data={breadcrumb} id={`brand-${brand.slug}-breadcrumb`} />
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-70 blur-3xl"
            style={{
              background: `radial-gradient(circle at top, ${
                brand.dominantColors[0] ?? "rgba(99,102,241,0.35)"
              } 0%, transparent 70%)`,
            }}
          />
          <Link href={`/logo/${brand.slug}`} className="relative z-10 block focus-ring">
            <Image
              src={brand.logoUrl}
              alt={`${brand.name} logo - ${brand.categorySlug.replace(/-/g, ' ')} brand identity design`}
              width={520}
              height={320}
              className="h-44 w-full object-contain drop-shadow-[0_28px_50px_rgba(15,23,42,0.6)] transition hover:scale-[1.02] md:h-56"
              priority
            />
          </Link>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Brand detail</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              {brand.name}
            </h1>
            <p className="mt-4 text-sm text-slate-300">{brand.description}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
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
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Related brands</h2>
        {related.length > 0 ? (
          <BrandGrid brands={related} />
        ) : (
          <p className="text-sm text-slate-300">
            Explore more brands in the gallery to discover similar visual systems.
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
        <Link href="/gallery" className="hover:text-white focus-ring">
          Back to gallery
        </Link>
        {category ? (
          <Link href={`/category/${category.slug}`} className="hover:text-white focus-ring">
            Explore {category.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
