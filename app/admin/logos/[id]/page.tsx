import Link from "next/link";
import { notFound } from "next/navigation";
import LogoEditForm from "@/components/admin/LogoEditForm";
import { updateLogo } from "@/lib/adminActions";
import { requireAdmin } from "@/lib/adminAuth";
import { readAdminBrands } from "@/lib/adminStore";
import { categories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function AdminLogoEditPage({ params }: { params: { id: string } }) {
  requireAdmin();
  const brands = readAdminBrands();
  const brand = brands.find((item) => item.id === params.id);
  if (!brand) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin</p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Edit logo</h1>
          <p className="mt-3 text-sm text-slate-300">{brand.name}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/logos"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 transition hover:border-white/30 focus-ring"
          >
            Back to list
          </Link>
          <Link
            href={`/logo/${brand.slug}`}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 transition hover:border-white/30 focus-ring"
          >
            View logo
          </Link>
        </div>
      </div>

      <LogoEditForm action={updateLogo} categories={categories} brand={brand} />
    </div>
  );
}
