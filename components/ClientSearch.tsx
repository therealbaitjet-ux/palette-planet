"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  logoUrl: string;
}

interface ClientSearchProps {
  brands: Brand[];
  placeholder?: string;
}

export default function ClientSearch({ brands, placeholder = "Search brands..." }: ClientSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(brands, {
      keys: [
        { name: "name", weight: 0.7 },
        { name: "categorySlug", weight: 0.3 },
      ],
      threshold: 0.3, // Lower = more strict
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [brands]);

  // Perform search
  const results = useMemo(() => {
    if (!query.trim()) return [];
    setIsSearching(true);
    const searchResults = fuse.search(query).slice(0, 10); // Top 10 results
    setIsSearching(false);
    return searchResults;
  }, [query, fuse]);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 pl-12 text-white placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none"
        />
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {query.trim() && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-auto py-2">
              {results.map(({ item, score }) => (
                <li key={item.id}>
                  <Link
                    href={`/brand/${item.slug}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/5"
                    onClick={() => setQuery("")}
                  >
                    <div className="relative h-10 w-10 flex-shrink-0 rounded bg-white/5 p-1">
                      <Image
                        src={item.logoUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{item.categorySlug.replace(/-/g, " ")}</p>
                    </div>
                    {score && score < 0.1 && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                        Exact match
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-slate-400">
              <p>No brands found</p>
              <p className="mt-1 text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {/* Search stats */}
      {query.trim() && results.length > 0 && (
        <p className="mt-2 text-right text-xs text-slate-500">
          {results.length} result{results.length !== 1 ? "s" : ""} • {brands.length} total brands
        </p>
      )}
    </div>
  );
}
