import { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Palette Planet. Questions, suggestions, or partnership inquiries.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-white mb-4">Contact Us</h1>
      <p className="text-slate-300 mb-8">
        Have questions, suggestions, or want to partner with us? We&apos;d love to hear from you.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Send a Message</h2>
          <form className="space-y-4" action="mailto:hello@palette-planet.com" method="post" encType="text/plain">
            <div>
              <label htmlFor="name" className="block text-sm text-slate-400 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-slate-400 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold transition hover:bg-indigo-500"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Get in Touch</h2>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">Email</h3>
                <a href="mailto:hello@palette-planet.com" className="text-indigo-400 hover:text-indigo-300">
                  hello@palette-planet.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">Business Hours</h3>
                <p>Monday - Friday: 9AM - 6PM EST</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Partnership Opportunities</h2>
            <p className="text-slate-300 mb-4">
              Interested in featuring your brand or advertising on Palette Planet?
            </p>
            <a
              href="mailto:partnerships@palette-planet.com"
              className="inline-flex items-center text-indigo-400 hover:text-indigo-300"
            >
              partnerships@palette-planet.com
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Connect With Us</h2>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/paletteplanet"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com/paletteplanet"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">Can I use these logos for my project?</h3>
            <p className="text-slate-300">
              All logos are property of their respective owners. This site is for inspiration and 
              reference only. Always obtain proper licensing before using any brand assets.
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">How do I get my brand featured?</h3>
            <p className="text-slate-300">
              We&apos;re always looking for great brand identities. Contact us with your brand details 
              and we&apos;ll consider it for inclusion.
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">Do you offer advertising?</h3>
            <p className="text-slate-300">
              Yes! We offer sponsored listings and banner advertising. Contact our partnerships team 
              for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
