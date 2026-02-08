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
    
    if (totalPages <= 9) {
      // Show all pages if 9 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination with start, middle, and end visible
      const showStartEndCount = 2; // Pages to show at start and end
      const showAroundCurrent = 1; // Pages around current page
      
      // Always add first pages
      for (let i = 1; i <= showStartEndCount; i++) {
        pages.push(i);
      }
      
      // Calculate if we need left ellipsis
      if (currentPage > showStartEndCount + showAroundCurrent + 1) {
        pages.push("...");
      } else if (currentPage === showStartEndCount + showAroundCurrent + 1) {
        // No ellipsis, just add the missing page
        pages.push(showStartEndCount + 1);
      }
      
      // Add pages around current
      const startAround = Math.max(showStartEndCount + 1, currentPage - showAroundCurrent);
      const endAround = Math.min(totalPages - showStartEndCount, currentPage + showAroundCurrent);
      
      for (let i = startAround; i <= endAround; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      // Calculate if we need right ellipsis
      if (currentPage < totalPages - showStartEndCount - showAroundCurrent) {
        pages.push("...");
      } else if (currentPage === totalPages - showStartEndCount - showAroundCurrent) {
        // No ellipsis, just add the missing page
        const missingPage = totalPages - showStartEndCount;
        if (!pages.includes(missingPage)) {
          pages.push(missingPage);
        }
      }
      
      // Always add last pages
      for (let i = totalPages - showStartEndCount + 1; i <= totalPages; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
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
      
      <div className="flex items-center gap-1 flex-wrap justify-center">
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
        {pages.map((page, index) => (
          <span key={index}>
            {page === "..." ? (
              <span className="px-1 text-slate-500">...</span>
            ) : (
              <Link
                href={`${basePath}/${slug}?page=${page}`}
                className={`rounded-lg px-3 py-2 text-sm transition min-w-[36px] text-center ${
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
