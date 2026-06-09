"use client";

import { useEffect } from "react";

const landmarks = [
  { name: "The Diag", walk: "5 min", icon: "🎓" },
  { name: "Law Quad", walk: "5 min", icon: "⚖️" },
  { name: "Ross School of Business", walk: "9 min", icon: "📈" },
  { name: "Michigan Stadium", walk: "20 min", icon: "🏟️" },
];

export function LocationModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[150] flex flex-col overflow-y-auto">
      {/* Dark overlay background */}
      <div aria-hidden className="absolute inset-0 bg-ink" />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-stone transition-colors hover:bg-white/20"
      >
        ✕
      </button>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-0 px-6 pb-16 pt-14 lg:px-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-brass/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brass-soft">
            Ann Arbor, Michigan
          </p>
          <h2 className="font-display text-4xl text-stone sm:text-5xl">
            Right in the heart of it all.
          </h2>
          <p className="mt-3 text-stone/60">
            621 E. William St &amp; 615.5 E. William St — steps from Central Campus
          </p>
        </div>

        {/* Map */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ height: "460px" }}>
          <iframe
            title="State & William Lofts location"
            src="https://maps.google.com/maps?q=621+E+William+St,+Ann+Arbor,+MI+48104&t=k&z=16&output=embed&iwloc=near"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Address pin overlay */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/90 px-4 py-2 text-xs font-semibold text-stone backdrop-blur-sm">
            📍 State &amp; William Lofts
          </div>
        </div>

        {/* Walking distances */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {landmarks.map((lm) => (
            <div
              key={lm.name}
              className="flex flex-col items-center gap-2 rounded-2xl border border-stone/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm"
            >
              <span className="text-2xl">{lm.icon}</span>
              <div>
                <p className="font-display text-2xl font-semibold text-brass-soft">{lm.walk}</p>
                <p className="text-xs text-stone/50 uppercase tracking-wide">walk</p>
              </div>
              <p className="text-sm font-medium text-stone/80">{lm.name}</p>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p className="mt-8 text-center text-sm text-stone/40">
          On-street parking available &middot; Near AATA bus routes &middot; Bike-friendly neighborhood
        </p>
      </div>
    </div>
  );
}
