import Image from "next/image";
import type { Property } from "@/data/properties";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-cloud shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.image}
          alt={`${property.title} exterior`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium uppercase tracking-wide text-stone backdrop-blur-sm">
          {property.availability}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
            {property.neighborhood}
          </p>
          <h3 className="mt-1 font-display text-xl text-ink">{property.title}</h3>
          <p className="mt-1 text-sm text-slate">{property.address}</p>
        </div>

        <p className="text-sm leading-relaxed text-slate">{property.blurb}</p>

        <ul className="space-y-1.5 border-y border-ink/8 py-4 text-sm text-ink-text">
          {property.landmarks.map((landmark) => (
            <li key={landmark.name} className="flex items-center justify-between gap-3">
              <span className="text-slate">{landmark.name}</span>
              <span className="font-medium">{landmark.distance}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {property.amenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-stone-deep px-3 py-1 text-xs font-medium text-ink-text"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <p className="font-display text-2xl text-ink">
              ${property.pricePerBed.toLocaleString()}
              <span className="text-sm font-sans font-normal text-slate"> / bed / mo</span>
            </p>
            <p className="text-sm text-slate">
              {property.bedrooms} bed &middot; {property.bathrooms} bath
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-stone"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}
