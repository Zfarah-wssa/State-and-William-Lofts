"use client";

import { useState } from "react";
import Link from "next/link";
import { LocationModal } from "@/components/LocationModal";
import { ChatBot } from "@/components/ChatBot";

const navLinks = [
  { label: "Listings", href: "#listings" },
  { label: "Resident Life", href: "#resident-life" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [locationOpen, setLocationOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <>
      {locationOpen && <LocationModal onClose={() => setLocationOpen(false)} />}
      <ChatBot isOpen={tourOpen} onClose={() => setTourOpen(false)} trigger="tour" />

      <header className="sticky top-0 z-50 border-b border-ink/10 bg-stone/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl tracking-tight text-ink">
              State &amp; William
            </span>
            <span className="hidden font-sans text-xs uppercase tracking-[0.3em] text-brass sm:inline">
              Lofts
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#listings"
              className="text-sm font-medium text-slate transition-colors hover:text-ink"
            >
              Listings
            </a>
            <button
              type="button"
              onClick={() => setLocationOpen(true)}
              className="text-sm font-medium text-slate transition-colors hover:text-ink"
            >
              Location
            </button>
            <a
              href="#resident-life"
              className="text-sm font-medium text-slate transition-colors hover:text-ink"
            >
              Resident Life
            </a>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate transition-colors hover:text-ink"
            >
              Contact
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setTourOpen(true)}
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-stone transition-colors hover:bg-ink-soft sm:inline-flex"
          >
            Tour a Loft
          </button>
        </div>
      </header>
    </>
  );
}
