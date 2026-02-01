"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({
  placeholder = "Search brands",
  basePath,
}: {
  placeholder?: string;
  basePath?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(initialQuery);

  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const targetPath = basePath ?? pathname;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value) {
      params.set("q", value);
      params.set("page", "1");
    } else {
      params.delete("q");
    }
    router.push(`${targetPath}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 focus-within:border-white/30"
    >
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-400 focus-ring"
        aria-label="Search brands"
      />
      <button
        type="submit"
        className="rounded-xl bg-indigo-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 focus-ring"
      >
        Search
      </button>
    </form>
  );
}
