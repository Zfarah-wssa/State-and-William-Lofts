import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { UnitDetailsCard } from "@/components/UnitDetailsCard";
import { units621William, williamStreetAddress } from "@/data/units-621-william";

export const metadata: Metadata = {
  title: "621 William | Floor Plans & Renderings | State & William Lofts",
  description:
    "Architect floor plans and interior renderings for the three units at 621 William — Level 2 West, Level 2 East, and Level 3 East. Fully furnished, with laundry machines included in every unit.",
};

export default function William621Page() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-stone">
        <section className="bg-ink text-stone">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass-soft">
              Owner Review &middot; Architect Renderings
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              621 William &mdash; floor plans &amp; unit renderings
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone/70 sm:text-base">
              {williamStreetAddress}. Browse architect floor plans and interior
              renderings for each of our three curated units &mdash; every home
              is fully furnished, and laundry machines are included per unit.
              Use the editable price field to model your own rent scenarios.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
          <div className="space-y-10">
            {units621William.map((unit) => (
              <UnitDetailsCard key={unit.id} unit={unit} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
