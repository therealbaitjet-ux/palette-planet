import Link from "next/link";
import { categories } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export const metadata = {
  title: "Categories",
  description: "Browse logo categories: Tech, Finance, Retail, Automotive, Healthcare, Entertainment, Food & Beverage, Energy, Travel, and Telecom.",
  alternates: { canonical: absoluteUrl("/category") },
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Categories</p>
        <h1 className="text-3xl font-semibold text-white">Explore logo categories</h1>
        <p className="text-slate-300 max-w-2xl">
          Browse 10 curated categories. Each collection showcases brands with distinct visual identities.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {categories.map(category => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-indigo-500/30 hover:bg-white/10"
          >
            <h2 className="text-lg font-semibold text-white">{category.name}</h2>
            <p className="mt-2 text-sm text-slate-400 line-clamp-3">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
