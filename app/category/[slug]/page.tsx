import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandGrid from "@/components/BrandGrid";
import SeoJsonLd from "@/components/SeoJsonLd";
import Pagination from "@/components/Pagination";
import { getBrands, categories, getCategoryBySlug } from "@/lib/data";
import { absoluteUrl, truncate } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false; // Only allow pre-defined categories

const ITEMS_PER_PAGE = 24;

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return {};
  }

  const title = `${category.name} Logos`;
  const description = truncate(category.description, 155);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/category/${category.slug}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/category/${slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const allBrands = getBrands().filter((brand) => brand.categorySlug === category.slug);
  
  // Pagination
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10));
  const totalPages = Math.ceil(allBrands.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBrands = allBrands.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: paginatedBrands.map((brand, index) => ({
      "@type": "ListItem",
      position: startIndex + index + 1,
      url: absoluteUrl(`/brand/${brand.slug}`),
      name: brand.name,
    })),
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
      <SeoJsonLd data={itemList} id={`category-${category.slug}-itemlist`} />
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Category</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">{category.name}</h1>
        <p className="max-w-3xl text-sm text-slate-300">{category.description}</p>
        <p className="text-sm text-slate-400">
          Showing {paginatedBrands.length} of {allBrands.length} brands
        </p>
      </div>

      <div className="glass rounded-3xl p-8">
        <h2 className="text-lg font-semibold text-white">SEO overview</h2>
        <p className="mt-3 text-sm text-slate-300">{category.seoIntro}</p>
      </div>

      <BrandGrid brands={paginatedBrands} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/category"
        slug={slug}
      />

      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
        <Link href="/gallery" className="hover:text-white focus-ring">
          Browse full gallery
        </Link>
        {categories
          .filter((cat) => cat.slug !== category.slug)
          .map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="hover:text-white focus-ring"
            >
              {cat.name}
            </Link>
          ))}
      </div>
    </div>
  );
}
