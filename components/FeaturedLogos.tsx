"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTopBrands } from "@/lib/data";

export default function FeaturedLogos() {
  const [isPinned, setIsPinned] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  // Get exactly 24 top brands (by views/popularity)
  const featuredBrands = getTopBrands(24);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsPinned(false);
      return;
    }

    // Center the section on initial load
    if (sectionRef.current && isPinned) {
      sectionRef.current.scrollIntoView({ block: "center", behavior: "auto" });
    }

    // Event handlers to unpin
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPinned(false);
      }
    };

    // Add listeners for all interaction types
    const events = ["wheel", "scroll", "touchstart", "keydown", "pointerdown"];
    events.forEach((event) => {
      window.addEventListener(event, handleInteraction, { passive: true, once: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [hasInteracted, isPinned]);

  return (
    <>
      {/* Spacer to prevent layout shift when pinned */}
      {isPinned && (
        <div
          ref={spacerRef}
          className="h-screen w-full"
          aria-hidden="true"
        />
      )}

      {/* Featured Section */}
      <section
        ref={sectionRef}
        className={`transition-all duration-500 ${
          isPinned
            ? "fixed inset-0 z-50 flex items-center justify-center bg-midnight/95 backdrop-blur-sm"
            : "relative w-full"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-2">
              Featured Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              24 Iconic Brand Logos
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto">
              Hand-picked identities from Fortune 500 companies and unicorn startups
            </p>
          </div>

          {/* Logo Grid - 6 cols desktop, 4 tablet, 2 mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="group flex items-center justify-center p-2 rounded-lg border border-white/10 bg-white/5 transition hover:border-indigo-500/30 hover:bg-white/10"
              >
                <div className="relative w-full h-20 md:h-24">
                  <Image
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain transition group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Scroll indicator when pinned */}
          {isPinned && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center animate-bounce">
              <p className="text-sm text-slate-400 mb-2">Scroll to explore</p>
              <svg
                className="w-6 h-6 text-indigo-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          )}
        </div>
      </section>

      {/* Strong Divider */}
      <div className="relative w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500 rounded-full" />
            <Link 
              href="/gallery"
              className="px-4 py-2 rounded-full border-2 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition"
            >
              <span className="text-sm font-medium text-indigo-300">
                Explore All Brands
              </span>
            </Link>
            <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500 rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}
