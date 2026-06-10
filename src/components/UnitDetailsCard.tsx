"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Unit621William } from "@/data/units-621-william";
import { InterestModal } from "@/components/InterestModal";
import { ImageLightbox } from "@/components/ImageLightbox";

const accentClasses: Record<
  Unit621William["accent"],
  { rule: string; text: string; button: string }
> = {
  blue: {
    rule: "bg-[#2f5d8a]",
    text: "text-[#2f5d8a]",
    button: "bg-[#2f5d8a] text-stone hover:bg-[#264a6e]",
  },
  brass: {
    rule: "bg-brass",
    text: "text-brass",
    button: "bg-brass text-ink hover:bg-brass-soft",
  },
  green: {
    rule: "bg-[#2f7a52]",
    text: "text-[#2f7a52]",
    button: "bg-[#2f7a52] text-stone hover:bg-[#266042]",
  },
};

const currency = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 0 });

export function UnitDetailsCard({ unit }: { unit: Unit621William }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const accent = accentClasses[unit.accent];

  const stats = useMemo(() => {
    const sfPerBed = unit.squareFootage / unit.bedrooms;
    const bathRatio = unit.bathrooms / unit.bedrooms;
    return { sfPerBed, bathRatio };
  }, [unit]);

  const [primaryImage = unit.floorPlan, ...restRenderings] = unit.renderings;
  const smallerImages = [
    ...restRenderings.map((r) => ({ ...r, isFloorPlan: false })),
    { ...unit.floorPlan, isFloorPlan: true },
  ];
  const hasImages = unit.renderings.length > 0;

  // All images in order for lightbox navigation: primary, then smaller images
  const allImages = [
    primaryImage,
    ...restRenderings,
    unit.floorPlan,
  ];

  return (
    <>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={allImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      <article
        id={unit.id}
        className="scroll-mt-28 overflow-hidden rounded-2xl border border-ink/8 bg-cloud shadow-sm"
      >
        <div className={`h-1 w-full ${accent.rule}`} aria-hidden />

        <div className={hasImages ? "grid gap-0 lg:grid-cols-[1.1fr_1fr]" : ""}>
          {hasImages && (
            <div className="border-b border-ink/8 lg:border-b-0 lg:border-r">
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="group relative block w-full overflow-hidden focus:outline-none"
                aria-label={`Expand image: ${primaryImage.caption}`}
              >
                <div className="relative aspect-[4/3] bg-white">
                  <Image
                    src={primaryImage.src}
                    alt={primaryImage.alt}
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-ink/70 px-4 py-2 text-xs font-medium uppercase tracking-wide text-stone">
                    {primaryImage.caption}
                  </span>
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/50 text-stone opacity-0 transition-opacity group-hover:opacity-100 text-lg">
                    ⤢
                  </span>
                </div>
              </button>

              {smallerImages.length > 0 && (
                <div className="grid grid-cols-3 gap-px bg-ink/8">
                  {smallerImages.map((image, i) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => setLightboxIndex(i + 1)}
                      className="group relative aspect-[4/3] overflow-hidden bg-cloud focus:outline-none"
                      aria-label={`Expand image: ${image.caption}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 160px, 33vw"
                        className={
                          image.isFloorPlan
                            ? "object-contain bg-stone-deep p-1.5 transition-transform duration-300 group-hover:scale-[1.03]"
                            : "object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        }
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-ink/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-stone">
                        {image.caption}
                      </figcaption>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-5 p-6 sm:p-7">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${accent.text}`}>
                Unit details
              </p>
              <h3 className="mt-1 font-display text-2xl text-ink">{unit.name}</h3>
              <p className="text-sm text-slate">
                {unit.address} &middot; {unit.bedrooms} bed / {unit.bathrooms} bath
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Newly constructed", "Fully furnished", "Laundry machines included per unit"].map(
                  (label) => (
                    <span
                      key={label}
                      className="rounded-full bg-stone-deep px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-ink-text"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-ink/8 py-5 text-sm">
              <div className="flex items-center justify-between gap-3 col-span-2">
                <dt className="text-slate">Square footage</dt>
                <dd className="font-semibold text-ink">{currency(unit.squareFootage)} SF</dd>
              </div>
              <div className="flex items-center justify-between gap-3 col-span-2">
                <dt className="text-slate">SF per bed</dt>
                <dd className="font-semibold text-ink">{Math.round(stats.sfPerBed)} SF</dd>
              </div>
              <div className="flex items-center justify-between gap-3 col-span-2">
                <dt className="text-slate">Bath ratio</dt>
                <dd className="flex items-center gap-2 font-semibold text-ink">
                  {stats.bathRatio.toFixed(2)}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      stats.bathRatio >= 1
                        ? "bg-[#2f7a52]/10 text-[#2f7a52]"
                        : "bg-rose-500/10 text-rose-600"
                    }`}
                  >
                    {stats.bathRatio >= 1 ? "full parity" : "shared"}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="rounded-xl border border-ink/10 bg-stone px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate mb-3">
                Rent
              </p>
              <div className="flex flex-col gap-2">
                {unit.roomPricing ? (
                  <>
                    {unit.roomPricing.map((room) => (
                      <div key={room.label} className="flex items-baseline justify-between">
                        <span className="text-sm text-slate">{room.label}</span>
                        <span className="font-display text-xl font-semibold text-ink">
                          ${currency(room.price)}
                          <span className="ml-1 text-sm font-normal text-slate">/ mo</span>
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-slate">Per bed</span>
                    <span className="font-display text-xl font-semibold text-ink">
                      ${currency(unit.basePricePerBed)}
                      <span className="ml-1 text-sm font-normal text-slate">/ mo</span>
                    </span>
                  </div>
                )}
                {unit.pricePerUnit && (
                  <div className="flex items-baseline justify-between border-t border-ink/8 pt-2">
                    <span className="text-sm text-slate">Entire unit</span>
                    <span className="font-display text-xl font-semibold text-ink">
                      ${currency(unit.pricePerUnit)}
                      <span className="ml-1 text-sm font-normal text-slate">/ mo</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-1">
              <InterestModal unitName={unit.name} buttonClass={accent.button} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
