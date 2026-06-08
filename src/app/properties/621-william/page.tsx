import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { UnitAnalysisCard } from "@/components/UnitAnalysisCard";
import { units621William, williamStreetAddress } from "@/data/units-621-william";

export const metadata: Metadata = {
  title: "621 William | Unit Renderings & Market Analysis | State & William Lofts",
  description:
    "Architect renderings, floor plans, and live market analysis for the 621 William development — Level 2 West, Level 2 East, and Level 3 East units.",
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
              621 William &mdash; unit renderings &amp; live market analysis
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone/70 sm:text-base">
              {williamStreetAddress}. Browse architect floor plans and interior
              renderings for each unit alongside a live market analysis &mdash;
              adjust the price per bed to instantly model price per square foot,
              annual gross revenue, and discount versus the closest comparable
              property.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
          <div className="space-y-10">
            {units621William.map((unit) => (
              <UnitAnalysisCard key={unit.id} unit={unit} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
