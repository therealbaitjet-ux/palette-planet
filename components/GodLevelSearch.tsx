"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Brand, getBrands, categories } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

interface SearchResult {
  brand: Brand;
  score: number;
  matchType: "name" | "tag" | "category" | "description";
}

export default function GodLevelSearch({
  placeholder = "Search 196+ brand logos...",
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const brands = useMemo(() => getBrands(), []);
  const targetPath = basePath ?? pathname;

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("palettePlanetRecentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const newSearches = [query, ...prev.filter((s) => s !== query)].slice(0, 5);
      localStorage.setItem("palettePlanetRecentSearches", JSON.stringify(newSearches));
      return newSearches;
    });
  }, []);

  // Advanced search with scoring
  const searchResults = useMemo(() => {
    if (!value.trim()) return [];
    
    const query = value.toLowerCase();
    const results: SearchResult[] = [];
    
    brands.forEach((brand) => {
      let score = 0;
      let matchType: SearchResult["matchType"] = "description";
      
      // Name match (highest priority)
      if (brand.name.toLowerCase().includes(query)) {
        score += 100;
        if (brand.name.toLowerCase().startsWith(query)) score += 50;
        matchType = "name";
      }
      
      // Tag match
      const tagMatch = brand.tags.some((tag) => 
        tag.toLowerCase().includes(query)
      );
      if (tagMatch) {
        score += 30;
        matchType = "tag";
      }
      
      // Category match
      if (brand.categorySlug.toLowerCase().includes(query)) {
        score += 20;
        matchType = "category";
      }
      
      // Description match
      if (brand.description.toLowerCase().includes(query)) {
        score += 10;
      }
      
      if (score > 0) {
        results.push({ brand, score, matchType });
      }
    });
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [value, brands]);

  // Popular suggestions when empty
  const popularSuggestions = useMemo(() => {
    return [
      { label: "Tech companies", icon: "💻", query: "tech" },
      { label: "Fortune 500", icon: "🏢", query: "fortune" },
      { label: "Developer tools", icon: "🛠️", query: "developer" },
      { label: "SaaS brands", icon: "☁️", query: "saas" },
      { label: "Startups", icon: "🚀", query: "startup" },
    ];
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      inputRef.current?.focus();
      setIsOpen(true);
    }
    
    if (!isOpen) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => 
          Math.min(prev + 1, searchResults.length - 1)
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          const brand = searchResults[selectedIndex].brand;
          saveRecentSearch(value);
          router.push(`/brand/${brand.slug}`);
          setIsOpen(false);
          setValue("");
        } else if (value.trim()) {
          saveRecentSearch(value);
          const params = new URLSearchParams(searchParams.toString());
          params.set("q", value);
          params.set("page", "1");
          router.push(`${targetPath}?${params.toString()}`);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, selectedIndex, searchResults, value, router, targetPath, searchParams, saveRecentSearch]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      saveRecentSearch(value);
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", value);
      params.set("page", "1");
      router.push(`${targetPath}?${params.toString()}`);
      setIsOpen(false);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-indigo-500/30 text-indigo-200 rounded px-0.5">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`
            relative flex items-center gap-3 rounded-2xl border bg-white/5 
            transition-all duration-300 ease-out
            ${isOpen 
              ? "border-indigo-400/50 bg-white/10 shadow-lg shadow-indigo-500/10" 
              : "border-white/10 hover:border-white/20"
            }
          `}
        >
          {/* Search Icon */}
          <div className="pl-4">
            <svg 
              className={`w-5 h-5 transition-colors duration-200 ${isOpen ? "text-indigo-400" : "text-slate-400"}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent px-2 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            aria-label="Search brands"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          
          {/* Keyboard Shortcut Hint */}
          <div className="hidden md:flex items-center gap-1 pr-2">
            {value ? (
              <button
                type="button"
                onClick={() => {
                  setValue("");
                  inputRef.current?.focus();
                }}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-500">
                <span>⌘</span><span>K</span>
              </kbd>
            )}
          </div>
          
          <button
            type="submit"
            className="mr-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-indigo-400 hover:to-purple-400 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && (
        <div 
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Results Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
              {value.trim() ? `${searchResults.length} results` : "Popular searches"}
            </span>
            <span className="text-xs text-slate-600">
              {value.trim() ? "↑↓ navigate • ↵ select" : "Type to search"}
            </span>
          </div>

          {/* Search Results */}
          {value.trim() ? (
            <div className="max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <ul className="py-2">
                  {searchResults.map((result, index) => (
                    <li key={result.brand.id}>
                      <Link
                        href={`/brand/${result.brand.slug}`}
                        onClick={() => {
                          saveRecentSearch(value);
                          setIsOpen(false);
                          setValue("");
                        }}
                        className={`
                          flex items-center gap-4 px-4 py-3 transition-all duration-150
                          ${index === selectedIndex 
                            ? "bg-indigo-500/20 border-l-2 border-indigo-400" 
                            : "hover:bg-white/5 border-l-2 border-transparent"
                          }
                        `}
                      >
                        {/* Brand Logo */}
                        <div className="relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                          {result.brand.logoUrl ? (
                            <Image
                              src={result.brand.logoUrl}
                              alt={result.brand.name}
                              fill
                              className="object-contain p-2"
                            />
                          ) : (
                            <span className="text-lg font-bold text-slate-400">
                              {result.brand.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        
                        {/* Brand Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white truncate">
                              {highlightMatch(result.brand.name, value)}
                            </span>
                            <span className={`
                              text-xs px-2 py-0.5 rounded-full
                              ${result.matchType === "name" ? "bg-green-500/20 text-green-400" : ""}
                              ${result.matchType === "tag" ? "bg-blue-500/20 text-blue-400" : ""}
                              ${result.matchType === "category" ? "bg-purple-500/20 text-purple-400" : ""}
                            `}>
                              {result.matchType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {result.brand.tags.slice(0, 3).join(" • ")}
                          </p>
                        </div>
                        
                        {/* Arrow */}
                        <svg 
                          className={`w-4 h-4 transition-all duration-200 ${
                            index === selectedIndex ? "text-indigo-400 translate-x-1" : "text-slate-600"
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">No brands found</p>
                  <p className="text-slate-600 text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          ) : (
            /* Empty State - Popular Searches */
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-2">
                    Recent searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => {
                          setValue(search);
                          inputRef.current?.focus();
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all"
                      >
                        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Popular Categories */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-2">
                  Popular categories
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {popularSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.query}
                      onClick={() => {
                        setValue(suggestion.query);
                        inputRef.current?.focus();
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-left hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {suggestion.icon}
                      </span>
                      <span className="text-sm text-slate-300 group-hover:text-white">
                        {suggestion.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">⌘K</kbd> to search</span>
              <span>196 brands indexed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
