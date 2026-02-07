"use client";

import Link from "next/link";

export default function SponsorBanner() {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Featured Sponsor
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">Get Your Brand Featured</h3>
          <p className="text-sm text-slate-300">
            Reach 10,000+ designers and founders. Premium placement starts at $49/month.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/advertise"
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-center text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 focus-ring"
          >
            View Pricing
          </Link>
          <Link
            href="/contact"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90 focus-ring"
          >
            Advertise
          </Link>
        </div>
      </div>
    </div>
  );
}
