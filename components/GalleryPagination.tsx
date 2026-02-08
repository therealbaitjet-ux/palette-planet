"use client";

import Link from "next/link";

interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  query: string;
  category?: string;
  tag?: string;
  sort: string;
  totalResults: number;
  showingResults: number;
}

export default function GalleryPagination({
  currentPage,
  totalPages,
  query,
  category,
  tag,
  sort,
  totalResults,
  showingResults,
}: GalleryPaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="text-center text-sm text-slate-400">
        Showing {showingResults} of {totalResults} brands
      </div>
    );
  }

  const buildQueryString = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (sort && sort !== "popular") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  // Always show all page numbers - every page must be accessible
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
      {/* Info line */}
      <div className="text-center text-sm text-slate-400">
        Showing {showingResults} of {totalResults} brands • Page {currentPage} of {totalPages}
      </div>
      
      {/* Full pagination bar */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={`/gallery${buildQueryString(currentPage - 1)}`}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
          >
            ← Prev
          </Link>
        ) : (
          <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-500 cursor-not-allowed">
            ← Prev
          </span>
        )}

        {/* All Page Numbers - No gaps, every page clickable */}
        {pages.map((page) => (
          <Link
            key={page}
            href={`/gallery${buildQueryString(page)}`}
            className={`rounded-lg px-3 py-2 text-sm transition min-w-[40px] text-center ${
              page === currentPage
                ? "bg-indigo-600 text-white font-semibold"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {page}
          </Link>
        ))}

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={`/gallery${buildQueryString(currentPage + 1)}`}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
          >
            Next →
          </Link>
        ) : (
          <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-500 cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
