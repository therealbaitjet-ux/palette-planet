import { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Palette Planet - How we handle your data.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-white mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-slate-300">
        <p>Last updated: February 9, 2025</p>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
          <p>
            Palette Planet (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This Privacy Policy 
            explains how we collect, use, and protect your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
          <p>We collect minimal information to improve your experience:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Usage Data:</strong> We use Google Analytics to understand how visitors interact with our site.</li>
            <li><strong>Cookies:</strong> We use cookies for analytics and to remember your preferences.</li>
            <li><strong>Search Queries:</strong> Search terms you enter on our site (not personally identifiable).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To improve our website and user experience</li>
            <li>To analyze traffic and usage patterns</li>
            <li>To display relevant advertisements (via Google AdSense)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Google Analytics:</strong> For website traffic analysis</li>
            <li><strong>Google AdSense:</strong> For displaying advertisements</li>
            <li><strong>Vercel:</strong> For website hosting</li>
            <li><strong>Cloudinary:</strong> For image hosting and optimization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your information. 
            However, no internet transmission is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Opt-out of Google Analytics tracking</li>
            <li>Disable cookies in your browser settings</li>
            <li>Request information about data we hold about you</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page 
            with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us through our{" "}
            <a href="/contact" className="text-indigo-400 hover:text-indigo-300">Contact Page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
