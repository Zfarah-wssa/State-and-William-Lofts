import Link from "next/link";
import Image from "next/image";
import { units621William, williamStreetAddress } from "@/data/units-621-william";

export function FeaturedListings() {
  return (
    <section id="listings" className="bg-stone py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">
              Available Units
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              621 William &mdash; now leasing for Fall 2026
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate">
            {williamStreetAddress}. Three fully furnished units, each
            professionally managed and steps from Central Campus.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {units621William.map((unit) => (
            <Link
              key={unit.id}
              href={`/properties/621-william#${unit.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-cloud shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-deep">
                <Image
                  src={unit.renderings[0]?.src ?? unit.floorPlan.src}
                  alt={unit.renderings[0]?.alt ?? unit.floorPlan.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium uppercase tracking-wide text-stone backdrop-blur-sm">
                  Fall 2026 Lease
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
                    {unit.address}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-ink">{unit.name}</h3>
                  <p className="mt-1 text-sm text-slate">
                    {unit.bedrooms} bed &middot; {unit.bathrooms} bath &middot;{" "}
                    {unit.squareFootage.toLocaleString()} SF
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-stone-deep px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink-text">
                    Fully furnished &middot; in-unit washer &amp; dryer
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-ink/8 pt-4">
                  <p className="font-display text-xl text-ink">
                    ${unit.basePricePerBed.toLocaleString()}
                    <span className="text-sm font-sans font-normal text-slate"> / bed / mo</span>
                  </p>
                  <span className="inline-flex items-center justify-center rounded-full border border-ink px-4 py-2 text-xs font-semibold text-ink transition-colors group-hover:bg-ink group-hover:text-stone">
                    View Unit
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
