"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to your email service (SendGrid, Mailchimp, etc.)
    setStatus("success");
    setEmail("");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-8">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-2xl font-semibold text-white">Weekly Design Inspiration</h3>
        <p className="mt-2 text-slate-300">
          Get curated brand identities, logo design tips, and exclusive resources delivered to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Subscribe
          </button>
        </form>
        
        {status === "success" && (
          <p className="mt-3 text-sm text-emerald-400">✓ Thanks for subscribing!</p>
        )}
        
        <p className="mt-3 text-xs text-slate-500">
          Join 2,000+ designers. No spam, unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
