export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-stone">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 10%, rgba(200,155,60,0.35), transparent 45%), radial-gradient(circle at 10% 90%, rgba(227,196,120,0.18), transparent 40%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(246,243,236,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(246,243,236,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-24 lg:flex-row lg:items-center lg:gap-16 lg:px-10 lg:py-32">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brass/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brass-soft">
            Now Leasing &middot; Fall 2026
          </p>
          <h1 className="font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Premium student living, steps from{" "}
            <span className="text-brass-soft">Central Campus</span>.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-stone/80 sm:text-lg">
            State &amp; William Lofts curates a portfolio of beautifully renovated
            apartments and townhomes across Ann Arbor &mdash; designed for Michigan
            students who expect more from where they live.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#listings"
              className="inline-flex items-center justify-center rounded-full bg-brass px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brass/20 transition-transform hover:-translate-y-0.5 hover:bg-brass-soft"
            >
              Explore Available Lofts
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-stone/25 px-7 py-3.5 text-sm font-semibold text-stone transition-colors hover:border-stone/60"
            >
              Schedule a Private Tour
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-stone/10 pt-8 sm:max-w-md">
            <div>
              <dt className="font-display text-2xl text-brass-soft sm:text-3xl">6</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide text-stone/60">
                Curated properties
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xl text-brass-soft sm:text-3xl">0.4 mi</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide text-stone/60">
                Avg. distance to The Diag
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xl text-brass-soft sm:text-3xl">2026</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide text-stone/60">
                Fall lease term
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg">
          <div className="absolute -inset-4 rounded-[2rem] border border-brass/20" aria-hidden />
          <div className="overflow-hidden rounded-3xl border border-stone/10 bg-ink-soft/60 shadow-2xl shadow-black/30">
            <div className="space-y-4 p-7">
              <p className="text-xs uppercase tracking-[0.25em] text-brass-soft">
                Featured this week
              </p>
              <h2 className="font-display text-2xl text-stone">
                The State House on State
              </h2>
              <p className="text-sm leading-relaxed text-stone/70">
                A landmark brick mid-rise reimagined with designer interiors,
                steps from the Diag &mdash; with a rooftop lounge overlooking
                Central Campus.
              </p>
              <div className="flex items-center justify-between border-t border-stone/10 pt-4">
                <span className="font-display text-xl text-brass-soft">
                  $1,095<span className="text-sm text-stone/60"> / bed / mo</span>
                </span>
                <span className="rounded-full bg-stone/10 px-3 py-1 text-xs font-medium text-stone/80">
                  4 bed &middot; 2 bath
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
