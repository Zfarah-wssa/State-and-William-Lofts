import { properties } from "@/data/properties";
import { PropertyCard } from "@/components/PropertyCard";

export function FeaturedListings() {
  return (
    <section id="listings" className="bg-stone py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">
              Featured Listings
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Apartments and lofts within walking distance of everything that matters
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate">
            Every State &amp; William property is professionally managed, fully
            furnished, and located along Ann Arbor&rsquo;s most walkable
            corridors &mdash; from the Diag to South University.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
