"use client";

import { useState } from "react";
import Link from "next/link";
import { ChatBot } from "@/components/ChatBot";

export function SiteHeader() {
  const [tourOpen, setTourOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <ChatBot isOpen={tourOpen} onClose={() => setTourOpen(false)} trigger="tour" />

      <header className="sticky top-0 z-50 border-b border-ink/10 bg-stone/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-baseline gap-2" onClick={() => setMenuOpen(false)}>
            <span className="font-display text-2xl tracking-tight text-ink">
              State &amp; William
            </span>
            <span className="hidden font-sans text-xs uppercase tracking-[0.3em] text-brass sm:inline">
              Lofts
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="/#listings" className="text-sm font-medium text-slate transition-colors hover:text-ink">
              Listings
            </a>
            <Link href="/location" className="text-sm font-medium text-slate transition-colors hover:text-ink">
              Location
            </Link>
            <a href="/#resident-life" className="text-sm font-medium text-slate transition-colors hover:text-ink">
              Resident Life
            </a>
            <Link href="/contact" className="text-sm font-medium text-slate transition-colors hover:text-ink">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTourOpen(true)}
              className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-stone transition-colors hover:bg-ink-soft sm:inline-flex"
            >
              Tour a Loft
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-ink transition-all duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="border-t border-ink/10 bg-stone/95 px-6 pb-6 pt-4 md:hidden">
            <div className="flex flex-col gap-1">
              <a
                href="/#listings"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Listings
              </a>
              <Link
                href="/location"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Location
              </Link>
              <a
                href="/#resident-life"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Resident Life
              </a>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate transition-colors hover:bg-ink/5 hover:text-ink"
              >
                Contact
              </Link>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setTourOpen(true); }}
                className="mt-2 w-full rounded-full bg-ink py-3 text-sm font-semibold text-stone transition-colors hover:bg-ink-soft"
              >
                Tour a Loft
              </button>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
