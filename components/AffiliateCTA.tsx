"use client";

import { useEffect } from "react";

interface AffiliateCTAProps {
  tool: "canva" | "figma" | "adobe" | "looka" | "general";
  className?: string;
}

const affiliateData = {
  canva: {
    name: "Canva Pro",
    description: "Design professional logos in minutes",
    cta: "Try Canva Free",
    url: "https://www.canva.com/pro?referrer=affiliate&utm_source=paletteplanet",
    color: "bg-gradient-to-r from-purple-600 to-blue-600",
    icon: "🎨",
  },
  figma: {
    name: "Figma",
    description: "The collaborative interface design tool",
    cta: "Start Designing Free",
    url: "https://www.figma.com/?ref=paletteplanet",
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    icon: "✏️",
  },
  adobe: {
    name: "Adobe Creative Cloud",
    description: "Professional design software suite",
    cta: "Get 7 Days Free",
    url: "https://www.adobe.com/creativecloud.html?ref=paletteplanet",
    color: "bg-gradient-to-r from-red-600 to-pink-600",
    icon: "🎭",
  },
  looka: {
    name: "Looka AI Logo Maker",
    description: "AI-powered logo design in minutes",
    cta: "Create Your Logo",
    url: "https://looka.com/?ref=paletteplanet",
    color: "bg-gradient-to-r from-indigo-600 to-purple-600",
    icon: "🤖",
  },
  general: {
    name: "Design Your Brand",
    description: "Professional tools to create your perfect logo",
    cta: "Explore Tools",
    url: "/design-tools",
    color: "bg-gradient-to-r from-emerald-500 to-teal-600",
    icon: "🚀",
  },
};

export default function AffiliateCTA({ tool, className = "" }: AffiliateCTAProps) {
  const data = affiliateData[tool];

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-6 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{data.icon}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Partner
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">{data.name}</h3>
          <p className="text-sm text-slate-400">{data.description}</p>
        </div>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`${data.color} rounded-xl px-6 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90 focus-ring`}
        >
          {data.cta}
        </a>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        We may earn a commission if you purchase through this link.
      </p>
    </div>
  );
}
