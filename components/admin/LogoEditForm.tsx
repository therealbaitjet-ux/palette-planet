"use client";

import { useFormState, useFormStatus } from "react-dom";

type ActionState = {
  error?: string;
  success?: string;
};

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  categories: { name: string; slug: string }[];
  brand: {
    id: string;
    name: string;
    slug: string;
    description: string;
    categorySlug: string;
    tags: string[];
    logoUrl: string;
    dominantColors: string[];
    country: string;
    website?: string;
    featured: boolean;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Saving..." : "Save changes"}
    </button>
  );
}

export default function LogoEditForm({ action, categories, brand }: Props) {
  const [state, formAction] = useFormState(action, { error: undefined, success: undefined });

  return (
    <form
      action={formAction}
      className="glass flex w-full flex-col gap-6 rounded-3xl p-8"
    >
      <input type="hidden" name="id" value={brand.id} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Brand name
          <input
            type="text"
            name="name"
            required
            defaultValue={brand.name}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Slug
          <input
            type="text"
            name="slug"
            defaultValue={brand.slug}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Category
          <select
            name="categorySlug"
            required
            defaultValue={brand.categorySlug}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Country
          <input
            type="text"
            name="country"
            required
            defaultValue={brand.country}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300 md:col-span-2">
          Description
          <textarea
            name="description"
            rows={3}
            defaultValue={brand.description}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Website
          <input
            type="url"
            name="website"
            placeholder="https://"
            defaultValue={brand.website ?? ""}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Tags (comma separated)
          <input
            type="text"
            name="tags"
            defaultValue={brand.tags.join(", ")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Dominant colors (comma separated hex)
          <input
            type="text"
            name="dominantColors"
            defaultValue={brand.dominantColors.join(", ")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Replace logo file (optional)
          <input
            type="file"
            name="logo"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={brand.featured}
            className="h-4 w-4 rounded border border-white/20 bg-white/5 text-indigo-400"
          />
          Featured brand
        </label>
      </div>
      {state?.error ? (
        <p className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
          {state.success}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
