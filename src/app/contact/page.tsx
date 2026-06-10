import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactChat } from "@/components/ContactChat";

export const metadata: Metadata = {
  title: "Contact | State & William Lofts",
  description:
    "Get in touch with the State & William Lofts team. Questions about leasing, the building, or anything else — we're here to help.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <section className="bg-ink text-stone">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass-soft">
              Get in Touch
            </p>
            <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              We&rsquo;re here to help
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone/70 sm:text-base">
              Questions about a unit, the lease process, or anything else — chat
              with our assistant below and we&rsquo;ll make sure the right
              person follows up with you.
            </p>
          </div>
        </section>

        <section className="bg-stone">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-start">
              {/* Left: contact details */}
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">
                    Property Management
                  </p>
                  <p className="mt-3 font-display text-xl text-ink">
                    West Second Street Associates
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-slate">
                    <p>Mott Foundation Building</p>
                    <p>503 S. Saginaw St., Suite 600</p>
                    <p>Flint, Michigan 48502</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <a
                    href="tel:+18102391551"
                    className="flex items-center gap-2 text-slate transition-colors hover:text-ink"
                  >
                    <span className="text-brass">→</span>
                    810.239.1551
                  </a>
                  <a
                    href="mailto:info@wssallc.com"
                    className="flex items-center gap-2 text-slate transition-colors hover:text-ink"
                  >
                    <span className="text-brass">→</span>
                    info@wssallc.com
                  </a>
                  <a
                    href="https://wssallc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate transition-colors hover:text-ink"
                  >
                    <span className="text-brass">→</span>
                    wssallc.com
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">
                    Properties
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-slate">
                    <p>615.5 E. William St. — Level 2 West</p>
                    <p>621 E. William St. — Level 2 &amp; 3 East</p>
                    <p>Ann Arbor, Michigan 48104</p>
                  </div>
                </div>
              </div>

              {/* Right: embedded chat */}
              <ContactChat />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
