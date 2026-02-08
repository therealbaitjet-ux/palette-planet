"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  slug: string;
}

export default function Pagination({ currentPage, totalPages, basePath, slug }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Always show all page numbers - every page must be accessible
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
      {/* Info line */}
      <div className="text-center text-sm text-slate-400">
        Page {currentPage} of {totalPages}
      </div>
      
      {/* Full pagination bar */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={`${basePath}/${slug}?page=${currentPage - 1}`}
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
            href={`${basePath}/${slug}?page=${page}`}
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
            href={`${basePath}/${slug}?page=${currentPage + 1}`}
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
