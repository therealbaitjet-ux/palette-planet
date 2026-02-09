import { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Palette Planet - Rules and guidelines for using our website.",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-white mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-slate-300">
        <p>Last updated: February 9, 2025</p>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
          <p>
            By accessing and using Palette Planet (&quot;the Site&quot;), you agree to be bound by these 
            Terms of Service. If you disagree with any part of these terms, you may not access the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials on Palette Planet for personal, 
            non-commercial use only. This is the grant of a license, not a transfer of title.
          </p>
          <p className="mt-2">Under this license you may not:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Modify or copy the materials for commercial purposes</li>
            <li>Use the materials for any commercial purpose without authorization</li>
            <li>Attempt to decompile or reverse engineer any software on the Site</li>
            <li>Remove any copyright or proprietary notations from the materials</li>
            <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Intellectual Property</h2>
          <p>
            All logos, trademarks, and brand materials displayed on this site are the property of their 
            respective owners. Palette Planet does not claim ownership of any third-party trademarks or logos.
          </p>
          <p className="mt-2">
            The compilation of all content on this site is the exclusive property of Palette Planet 
            and is protected by copyright laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Disclaimer</h2>
          <p>
            The materials on Palette Planet are provided on an &quot;as is&quot; basis. We make no warranties, 
            expressed or implied, and hereby disclaim all other warranties including, without limitation, 
            implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Limitations</h2>
          <p>
            In no event shall Palette Planet or its suppliers be liable for any damages arising out of 
            the use or inability to use the materials on the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Accuracy of Materials</h2>
          <p>
            The materials appearing on Palette Planet could include technical, typographical, or 
            photographic errors. We do not warrant that any of the materials on the Site are accurate, 
            complete, or current.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Links</h2>
          <p>
            Palette Planet has not reviewed all of the sites linked to its website and is not responsible 
            for the contents of any such linked site. The inclusion of any link does not imply endorsement 
            by Palette Planet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Modifications</h2>
          <p>
            We may revise these Terms of Service at any time without notice. By using this Site you are 
            agreeing to be bound by the then current version of these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of 
            the United States and you irrevocably submit to the exclusive jurisdiction of the courts 
            in that location.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us through our{" "}
            <a href="/contact" className="text-indigo-400 hover:text-indigo-300">Contact Page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
