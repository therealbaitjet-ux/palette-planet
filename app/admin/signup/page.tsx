import Link from "next/link";
import { redirect } from "next/navigation";
import AdminAuthForm from "@/components/admin/AdminAuthForm";
import { signupAdmin } from "@/lib/adminActions";
import { canSignUp, getAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default function AdminSignUpPage() {
  const session = getAdminSession();
  if (session) {
    redirect("/admin/upload");
  }

  const available = canSignUp();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16">
      {available ? (
        <AdminAuthForm
          title="Create admin"
          submitLabel="Create account"
          action={signupAdmin}
          helper={
            <p className="text-sm text-slate-300">
              Already registered?{" "}
              <Link href="/admin/signin" className="text-indigo-300 hover:text-indigo-200">
                Sign in
              </Link>
            </p>
          }
        />
      ) : (
        <div className="glass max-w-md rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Signup closed</h1>
          <p className="mt-3 text-sm text-slate-300">
            Two admins are already registered. Please sign in instead.
          </p>
          <Link
            href="/admin/signin"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Go to sign in
          </Link>
        </div>
      )}
    </div>
  );
}
