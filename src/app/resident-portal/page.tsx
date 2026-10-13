import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Resident Portal",
  description: "The State & William Lofts resident portal is coming soon.",
  // Placeholder page — keep it out of search results until the portal is live.
  robots: { index: false, follow: true },
};

export default function ResidentPortalPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-ink text-stone">
        <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass-soft">
            Resident Portal
          </p>
          <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
            Coming Soon
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-stone/70 sm:text-base">
            Online rent payments and resident accounts are on the way. Check back soon.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brass-soft"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-stone/25 px-6 py-3 text-sm font-semibold text-stone transition-colors hover:border-brass-soft hover:text-brass-soft"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
