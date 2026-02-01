import Link from "next/link";
import { redirect } from "next/navigation";
import AdminAuthForm from "@/components/admin/AdminAuthForm";
import { signinAdmin } from "@/lib/adminActions";
import { getAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default function AdminSignInPage() {
  const session = getAdminSession();
  if (session) {
    redirect("/admin/upload");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16">
      <AdminAuthForm
        title="Admin sign in"
        submitLabel="Sign in"
        action={signinAdmin}
        helper={
          <p className="text-sm text-slate-300">
            Need access?{" "}
            <Link href="/admin/signup" className="text-indigo-300 hover:text-indigo-200">
              Create admin
            </Link>
          </p>
        }
      />
    </div>
  );
}
