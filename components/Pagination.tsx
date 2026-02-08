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

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
      <span className="text-sm text-slate-400">
        Page {currentPage} of {totalPages}
      </span>
      
      <div className="flex items-center gap-2">
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

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => (
            <span key={index}>
              {page === "..." ? (
                <span className="px-2 text-slate-500">...</span>
              ) : (
                <Link
                  href={`${basePath}/${slug}?page=${page}`}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    page === currentPage
                      ? "bg-indigo-600 text-white"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {page}
                </Link>
              )}
            </span>
          ))}
        </div>

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
