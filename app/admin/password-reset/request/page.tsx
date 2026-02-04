import { requestPasswordResetForm } from "@/lib/adminActions";

export const dynamic = "force-dynamic";

export default function RequestResetPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center p-8">
      <form action={requestPasswordResetForm} className="glass w-full max-w-md rounded-3xl p-8">
        <h1 className="text-xl font-semibold text-white">Reset admin password</h1>
        <label className="flex flex-col gap-2 text-sm text-slate-300 mt-4">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          Send reset link
        </button>
      </form>
    </div>
  );
}
