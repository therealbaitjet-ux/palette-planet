import Link from "next/link";
import UploadForm from "@/components/admin/UploadForm";
import { createLogo, signoutAdmin } from "@/lib/adminActions";
import { requireAdmin } from "@/lib/adminAuth";
import { categories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function AdminUploadPage() {
  const session = requireAdmin();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin</p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Upload a logo</h1>
          <p className="mt-3 text-sm text-slate-300">
            Signed in as {session.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/logos"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 transition hover:border-white/30 focus-ring"
          >
            Manage logos
          </Link>
          <Link
            href="/gallery"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 transition hover:border-white/30 focus-ring"
          >
            View gallery
          </Link>
          <form action={signoutAdmin}>
            <button
              type="submit"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-100 transition hover:border-white/30 focus-ring"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <UploadForm action={createLogo} categories={categories} />
    </div>
  );
}
