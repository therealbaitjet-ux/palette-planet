import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Logo Design Blog | Brand Identity Insights & Inspiration",
  description: "Explore the latest trends in logo design, brand identity best practices, and Fortune 500 branding analysis. Expert insights for designers and founders.",
  alternates: {
    canonical: absoluteUrl("/blog"),
  },
};

const blogPosts = [
  {
    slug: "top-50-tech-company-logos-2025",
    title: "Top 50 Tech Company Logos of 2025: Technology Brand Identity Guide",
    excerpt: "Explore the best tech company logos from Fortune 500 giants to innovative startups. Discover design trends, color psychology, and what makes a great technology brand identity.",
    date: "February 4, 2026",
    readTime: "12 min read",
    category: "Analysis",
  },
  {
    slug: "fortune-500-logo-trends-2025",
    title: "Fortune 500 Logo Trends for 2025: What Big Brands Are Doing",
    excerpt: "Discover the latest logo design trends from America's biggest companies. From minimalism to bold color choices, see what's dominating the Fortune 500.",
    date: "February 4, 2026",
    readTime: "8 min read",
    category: "Trends",
  },
  {
    slug: "why-logos-matter-brand-identity",
    title: "Why Logos Matter: The Psychology Behind Brand Identity",
    excerpt: "Your logo is often the first impression customers have of your brand. Learn the psychological principles that make logos memorable and effective.",
    date: "February 3, 2026",
    readTime: "6 min read",
    category: "Branding",
  },
  {
    slug: "tech-company-logos-evolution",
    title: "How Tech Giants Evolved Their Logos: Apple, Google, Amazon",
    excerpt: "A deep dive into how the biggest technology companies have refined their visual identities over the decades to stay relevant and impactful.",
    date: "February 2, 2026",
    readTime: "10 min read",
    category: "Analysis",
  },
  {
    slug: "color-psychology-branding",
    title: "Color Psychology in Branding: What Your Logo Says About You",
    excerpt: "Colors evoke emotions and associations. Learn how Fortune 500 companies use color psychology to influence perception and drive brand recognition.",
    date: "February 1, 2026",
    readTime: "7 min read",
    category: "Design",
  },
  {
    slug: "minimalist-logo-design-guide",
    title: "The Art of Minimalist Logo Design: Less is More",
    excerpt: "Minimalism dominates modern branding. Explore why the world's most successful brands embrace simplicity and how to apply these principles to your logo.",
    date: "January 30, 2026",
    readTime: "5 min read",
    category: "Design",
  },
  {
    slug: "retail-branding-strategies",
    title: "Retail Branding Strategies: Lessons from Walmart & Target",
    excerpt: "How retail giants use branding to create customer loyalty. Analyze the strategies behind the most successful retail brand identities.",
    date: "January 28, 2026",
    readTime: "9 min read",
    category: "Strategy",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Logo Design Blog
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Expert insights on brand identity, logo design trends, and Fortune 500 branding strategies.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <>
            <article
              key={post.slug}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30"
            >
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-indigo-300">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white group-hover:text-indigo-300">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm text-slate-300 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">{post.readTime}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-indigo-300 hover:text-indigo-200"
                >
                  Read more →
                </Link>
              </div>
            </article>
          </>
        ))}
      </div>

      {/* Newsletter Section */}
      <section className="glass rounded-3xl p-10 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Get Branding Insights Weekly
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Join 10,000+ designers and founders. Get the latest logo trends and branding strategies delivered to your inbox.
        </p>
        <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
