import Link from "next/link";
import { categories } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export const metadata = {
  title: "Categories",
  description: "Browse logo categories across technology, lifestyle, wellness, and hospitality.",
  alternates: {
    canonical: absoluteUrl("/category"),
  },
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Categories</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          Explore logo categories
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Each category highlights brands with distinct visual systems, from modern SaaS identity to
          hospitality experiences and lifestyle retail.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-white/30 focus-ring"
          >
            <h2 className="text-xl font-semibold text-white">{category.name}</h2>
            <p className="mt-3 text-sm text-slate-300">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
