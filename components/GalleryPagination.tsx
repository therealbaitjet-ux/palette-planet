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

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage <= 3) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
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
        Showing {showingResults} of {totalResults} brands • Page {currentPage} of {totalPages}
      </span>
      
      <div className="flex items-center gap-2">
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

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => (
            <span key={index}>
              {page === "..." ? (
                <span className="px-2 text-slate-500">...</span>
              ) : (
                <Link
                  href={`/gallery${buildQueryString(page as number)}`}
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
