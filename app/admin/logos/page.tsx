import Link from "next/link";
import { readAdminBrands } from "@/lib/adminStore";
import { deleteLogo } from "@/lib/adminActions";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default function AdminLogosPage() {
  requireAdmin();
  const brands = readAdminBrands();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin</p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Manage logos</h1>
          <p className="mt-3 text-sm text-slate-300">
            Edit or delete logos you have uploaded.
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus-ring"
        >
          Upload new logo
        </Link>
      </div>

      {brands.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-sm text-slate-300">
          No admin logos yet. Upload one to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="glass flex flex-col gap-4 rounded-3xl border border-white/10 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">{brand.name}</p>
                <p className="text-xs text-slate-400">{brand.slug}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/logo/${brand.slug}`}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 transition hover:border-white/30 focus-ring"
                >
                  View logo
                </Link>
                <Link
                  href={`/admin/logos/${brand.id}`}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 transition hover:border-white/30 focus-ring"
                >
                  Edit
                </Link>
                <form action={deleteLogo}>
                  <input type="hidden" name="id" value={brand.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs text-rose-100 transition hover:border-rose-400 focus-ring"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
