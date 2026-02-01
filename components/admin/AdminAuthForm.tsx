"use client";

import type { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";

type ActionState = {
  error?: string;
};

type Props = {
  title: string;
  submitLabel: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  helper?: ReactNode;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Working..." : label}
    </button>
  );
}

export default function AdminAuthForm({ title, submitLabel, action, helper }: Props) {
  const [state, formAction] = useFormState(action, { error: undefined });

  return (
    <form
      action={formAction}
      className="glass flex w-full max-w-md flex-col gap-4 rounded-3xl p-8"
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin access</p>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {helper}
      </div>
      <label className="flex flex-col gap-2 text-sm text-slate-300">
        Email
        <input
          type="email"
          name="email"
          required
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-slate-300">
        Password
        <input
          type="password"
          name="password"
          required
          minLength={8}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
        />
      </label>
      {state?.error ? (
        <p className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
          {state.error}
        </p>
      ) : null}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
