import { Metadata } from "next";
import Link from "next/link";
import AdUnit from "@/components/AdUnit";
import { absoluteUrl } from "@/lib/seo";

interface BlogPostPageProps {
  params: { slug: string };
}

const blogContent: Record<string, {
  title: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
}> = {
  "fortune-500-logo-trends-2025": {
    title: "Fortune 500 Logo Trends for 2025: What Big Brands Are Doing",
    date: "February 4, 2026",
    readTime: "8 min read",
    category: "Trends",
    content: `
## The Evolution of Corporate Branding

Fortune 500 companies invest millions in their brand identities, and for good reason. A strong logo can increase brand recognition by up to 80% and significantly impact consumer trust.

### Key Trends We're Seeing

**1. Minimalism Continues to Dominate**
Companies like Apple, Nike, and Target have proven that less is more. The trend toward simplified logos isn't slowing down—it's accelerating. In 2025, we're seeing even traditional brands stripping away complexity.

**2. Dynamic and Responsive Logos**
Static logos are becoming a thing of the past. Major brands now employ flexible logo systems that adapt to different contexts while maintaining core recognition elements.

**3. Bold, Confident Typography**
Custom typefaces are the new differentiator. Companies are investing heavily in bespoke fonts that communicate their unique personality while ensuring readability across all platforms.

**4. Sustainable Color Palettes**
Environmental consciousness is influencing color choices. Earth tones and nature-inspired palettes are replacing aggressive, artificial colors.

### What This Means for Your Brand

Whether you're a startup or an established company, these trends offer valuable lessons:

- Simplify your visual identity
- Invest in flexibility
- Prioritize digital-first design
- Consider sustainability in your brand choices

## Case Studies from the Fortune 500

### Walmart's 2025 Refresh
Walmart's recent logo evolution maintains its spark while modernizing the wordmark. The result feels more approachable and digitally-native.

### Tech Giant Simplicity
Amazon, Google, and Microsoft have all embraced cleaner, more versatile logos that work seamlessly across apps, websites, and physical products.

## Conclusion

The Fortune 500 continues to lead in brand innovation. By studying their approaches, businesses of any size can elevate their visual identity and connect more effectively with their audiences.
    `,
  },
  "why-logos-matter-brand-identity": {
    title: "Why Logos Matter: The Psychology Behind Brand Identity",
    date: "February 3, 2026",
    readTime: "6 min read",
    category: "Branding",
    content: `
## First Impressions Count

Research shows that consumers form an opinion about a brand within 7 seconds of seeing its logo. That split-second judgment can determine whether they engage further or move on.

### The Science of Recognition

Our brains process images 60,000 times faster than text. A well-designed logo leverages this neurological shortcut, creating instant brand association and emotional connection.

**Color Psychology in Action**

- Blue (IBM, Facebook, Twitter): Trust, stability, professionalism
- Red (Coca-Cola, Netflix, YouTube): Energy, excitement, urgency
- Green (Starbucks, Whole Foods, Spotify): Growth, health, nature
- Black (Nike, Apple, Chanel): Luxury, sophistication, power

### Building Trust Through Design

Fortune 500 companies spend billions on brand identity because it works. Consistent branding across all touchpoints increases revenue by an average of 23%.

## The Elements of Effective Logos

**Simplicity**: The most memorable logos are often the simplest
**Relevance**: Design should reflect your industry and values
**Timelessness**: Avoid trends that will date your brand
**Versatility**: Your logo must work everywhere, from billboards to app icons

## Measuring Logo Success

Track these metrics to evaluate your logo's performance:
- Brand recognition rates
- Customer trust scores
- Social media engagement
- Conversion rates

## Conclusion

Your logo is more than decoration—it's a strategic business asset. Invest accordingly.
    `,
  },
};

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = blogContent[params.slug];
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  
  return {
    title: `${post.title} | palette-planet.com Blog`,
    description: post.content.slice(0, 160).replace(/[#\*]/g, ""),
    alternates: {
      canonical: absoluteUrl(`/blog/${params.slug}`),
    },
  };
}

export function generateStaticParams() {
  return Object.keys(blogContent).map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogContent[params.slug];
  
  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-2xl text-white">Post not found</h1>
        <Link href="/blog" className="mt-4 text-indigo-300 hover:text-indigo-200">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-indigo-300">
            {post.category}
          </span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
          {post.title}
        </h1>
      </header>

      {/* Top Ad */}
      <div className="mb-8">
        <AdUnit slot="article-top" style={{ minHeight: "90px" }} />
      </div>

      {/* Content */}
      <div 
        className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-indigo-300 prose-strong:text-white"
        dangerouslySetInnerHTML={{ 
          __html: post.content
            .replace(/## (.*)/g, '<h2 class="text-2xl font-semibold text-white mt-8 mb-4">$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
            .replace(/\n\n/g, '</p><p class="mb-4 text-slate-300">')
            .replace(/^/, '<p class="mb-4 text-slate-300">')
            .replace(/$/, '</p>')
        }}
      />

      {/* Middle Ad */}
      <div className="my-8">
        <AdUnit slot="article-mid" style={{ minHeight: "250px" }} />
      </div>

      {/* Back Link */}
      <div className="mt-12">
        <Link href="/blog" className="text-indigo-300 hover:text-indigo-200">
          ← Back to all articles
        </Link>
      </div>

      {/* Bottom Ad */}
      <div className="mt-8">
        <AdUnit slot="article-bottom" style={{ minHeight: "90px" }} />
      </div>
    </article>
  );
}
