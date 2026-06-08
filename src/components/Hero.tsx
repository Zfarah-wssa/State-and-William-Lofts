import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink text-stone">
      <Image
        src="/images/621-william/render-vaulted-living.jpg"
        alt="Sunlit living room and kitchen interior at 621 William"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-40 sm:pb-20 lg:px-10 lg:pb-24">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brass/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brass-soft backdrop-blur-sm">
          Now Leasing &middot; Fall 2026 &middot; 621 E. William St.
        </p>

        <h1 className="max-w-3xl font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          State-of-the-art, newly constructed units &mdash; fully furnished,
          steps from <span className="text-brass-soft">Central Campus</span>.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-stone/85 sm:text-lg">
          State &amp; William Lofts brings three newly constructed, curated
          units to 621 E. William St. &mdash; a five-minute walk from the Diag.
          Every home is fully furnished, and laundry machines are included per
          unit.
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/properties/621-william"
            className="inline-flex items-center justify-center rounded-full bg-brass px-8 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brass/30 transition-transform hover:-translate-y-0.5 hover:bg-brass-soft"
          >
            View Units
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-stone/30 px-8 py-3.5 text-sm font-semibold text-stone backdrop-blur-sm transition-colors hover:border-stone/60"
          >
            Schedule a Private Tour
          </a>
        </div>

        <ul className="mt-12 flex flex-wrap gap-3 text-sm">
          {[
            "Newly constructed",
            "Fully furnished",
            "Laundry machines included per unit",
            "Central A/C",
            "5 min to The Diag",
          ].map((item) => (
            <li
              key={item}
              className="rounded-full border border-stone/15 bg-white/5 px-4 py-2 font-medium text-stone/90 backdrop-blur-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
