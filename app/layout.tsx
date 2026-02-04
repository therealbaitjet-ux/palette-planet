import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL, absoluteUrl } from "@/lib/seo";
import AdSenseScript from "@/components/AdSenseScript";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | palette-planet.com`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "palette-planet.com",
    images: [
      {
        url: absoluteUrl("/logos/palette-planet-logo.svg"),
        width: 1200,
        height: 630,
        alt: "Palette Planet - Logo Gallery & Brand Identity Directory",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl("/logos/palette-planet-logo.svg")],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <AdSenseScript />
      </head>
      <body className="min-h-screen bg-midnight font-sans">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <header className="relative z-10 border-b border-white/10">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
              <Link href="/" className="flex items-center gap-3 transition hover:opacity-80 focus-ring">
                <Image
                  src="/logos/palette-planet-icon.svg"
                  alt="Palette Planet"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-lg font-semibold tracking-tight text-white">
                  palette-planet.com
                </span>
              </Link>
              <nav className="flex items-center gap-6 text-sm text-slate-300">
                <Link href="/" className="transition hover:text-white focus-ring">
                  Home
                </Link>
                <Link href="/gallery" className="transition hover:text-white focus-ring">
                  Gallery
                </Link>
                <Link href="/category" className="transition hover:text-white focus-ring">
                  Categories
                </Link>
                <Link href="/blog" className="transition hover:text-white focus-ring">
                  Blog
                </Link>
              </nav>
            </div>
          </header>
          <main className="relative z-10">{children}</main>
          <footer className="relative z-10 border-t border-white/10">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} palette-planet.com. All rights reserved.</div>
              <div className="flex gap-4">
                <Link href="/gallery" className="hover:text-white focus-ring">
                  Browse gallery
                </Link>
                <Link href="/category" className="hover:text-white focus-ring">
                  Explore categories
                </Link>
                <Link href="/admin/signin" className="hover:text-white focus-ring">
                  Admin sign in
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
