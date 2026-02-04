"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface TagFilterProps {
  tags: string[];
  selectedTag?: string;
  basePath: string;
  queryParams: {
    q?: string;
    category?: string;
    sort?: string;
  };
  brands: { tags: string[] }[];
}

// Tag category groups for developers
const tagGroups: Record<string, string[]> = {
  "💻 Technology": [
    "technology", "software", "developer", "javascript", "frontend", "backend", 
    "api", "cloud", "database", "open-source", "framework", "library"
  ],
  "🎨 Design": [
    "design", "creative", "ui-ux", "graphic-design", "prototyping", 
    "vector", "illustration", "animation", "design-system"
  ],
  "💼 Business": [
    "enterprise", "saas", "startup", "productivity", "collaboration",
    "project-management", "crm", "marketing", "automation"
  ],
  "🏢 Industry": [
    "fortune-500", "finance", "healthcare", "retail", "e-commerce",
    "manufacturing", "automotive", "energy", "telecommunications"
  ],
  "🎯 Function": [
    "analytics", "communication", "hosting", "payments", "security",
    "storage", "deployment", "testing", "monitoring"
  ],
};

export default function TagsFilter({ tags, selectedTag, basePath, queryParams, brands }: TagFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Calculate tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    brands.forEach((brand) => {
      brand.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [brands]);

  // Get top tags by count
  const topTags = useMemo(() => {
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [tagCounts]);

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    let result = tags;
    if (searchQuery) {
      result = result.filter((tag) => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedGroup) {
      const groupTags = tagGroups[selectedGroup] || [];
      result = result.filter((tag) => groupTags.includes(tag));
    }
    return result.sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0));
  }, [tags, searchQuery, selectedGroup, tagCounts]);

  const buildQueryString = (tag?: string) => {
    const params = new URLSearchParams();
    if (queryParams.q) params.set("q", queryParams.q);
    if (queryParams.category) params.set("category", queryParams.category);
    if (queryParams.sort) params.set("sort", queryParams.sort);
    if (tag) params.set("tag", tag);
    params.set("page", "1");
    const query = params.toString();
    return query ? `?${query}` : "";
  };

  return (
    <div className="space-y-3">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Tags
          <span className="ml-2 text-slate-600">({tags.length})</span>
        </label>
        {selectedTag && (
          <Link
            href={`${basePath}${buildQueryString()}`}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Clear filter
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        )}
      </div>

      {/* Search tags */}
      <div className="relative">
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Group filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedGroup(null)}
          className={`px-2 py-1 rounded-lg text-xs transition-all ${
            selectedGroup === null
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              : "bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent"
          }`}
        >
          All
        </button>
        {Object.keys(tagGroups).map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group === selectedGroup ? null : group)}
            className={`px-2 py-1 rounded-lg text-xs transition-all ${
              selectedGroup === group
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Top Tags - Always visible */}
      {!searchQuery && !selectedGroup && (
        <div className="space-y-2">
          <span className="text-xs text-slate-500">Popular</span>
          <div className="flex flex-wrap gap-1.5">
            {topTags.map((tag) => (
              <Link
                key={tag}
                href={`${basePath}${buildQueryString(tag)}`}
                className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
                  selectedTag === tag
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:border-white/20"
                }`}
              >
                {tag}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedTag === tag ? "bg-white/20" : "bg-white/10 text-slate-400"
                }`}>
                  {tagCounts[tag] || 0}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Expandable All Tags */}
      <div className={`transition-all duration-300 ease-out overflow-hidden ${
        isExpanded ? "max-h-96" : "max-h-0"
      }`}>
        <div className="pt-3 border-t border-white/5">
          <span className="text-xs text-slate-500">
            {searchQuery || selectedGroup ? `Results (${filteredTags.length})` : "All tags"}
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {filteredTags.map((tag) => (
              <Link
                key={tag}
                href={`${basePath}${buildQueryString(tag)}`}
                className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all duration-200 ${
                  selectedTag === tag
                    ? "bg-indigo-500 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
              >
                {tag}
                <span className={`text-[10px] ${selectedTag === tag ? "text-white/70" : "text-slate-500"}`}>
                  {tagCounts[tag] || 0}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs text-slate-400 hover:text-slate-300"
      >
        {isExpanded ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Show less
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Show all {tags.length} tags
          </>
        )}
      </button>
    </div>
  );
}
