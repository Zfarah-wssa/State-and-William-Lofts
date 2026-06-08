"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import type { Unit621William } from "@/data/units-621-william";

const accentClasses: Record<Unit621William["accent"], { rule: string; text: string; ring: string }> = {
  blue: { rule: "bg-[#2f5d8a]", text: "text-[#2f5d8a]", ring: "focus:ring-[#2f5d8a]/30" },
  brass: { rule: "bg-brass", text: "text-brass", ring: "focus:ring-brass/30" },
  green: { rule: "bg-[#2f7a52]", text: "text-[#2f7a52]", ring: "focus:ring-[#2f7a52]/30" },
};

const currency = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 0 });

export function UnitAnalysisCard({ unit }: { unit: Unit621William }) {
  const [pricePerBed, setPricePerBed] = useState(unit.basePricePerBed);
  const inputId = useId();
  const accent = accentClasses[unit.accent];

  const stats = useMemo(() => {
    const sfPerBed = unit.squareFootage / unit.bedrooms;
    const bathRatio = unit.bathrooms / unit.bedrooms;
    const totalMonthlyRent = pricePerBed * unit.bedrooms;
    const pricePerSf = totalMonthlyRent / unit.squareFootage;
    const annualGrossRevenue = totalMonthlyRent * 12;
    const discountToComp = ((unit.compPricePerBed - pricePerBed) / unit.compPricePerBed) * 100;

    return { sfPerBed, bathRatio, pricePerSf, annualGrossRevenue, discountToComp };
  }, [pricePerBed, unit]);

  const handlePriceChange = (raw: string) => {
    const parsed = Number(raw.replace(/[^0-9.]/g, ""));
    setPricePerBed(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-ink/8 bg-cloud shadow-sm">
      <div className={`h-1 w-full ${accent.rule}`} aria-hidden />

      <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
        {/* Imagery */}
        <div className="border-b border-ink/8 lg:border-b-0 lg:border-r">
          <div className="relative aspect-[4/3]">
            <Image
              src={unit.floorPlan.src}
              alt={unit.floorPlan.alt}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-contain bg-stone-deep p-2"
            />
          </div>
          <p className="px-5 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-slate">
            {unit.floorPlan.caption}
          </p>
          {unit.renderings.length > 0 && (
            <div className="grid grid-cols-2 gap-px bg-ink/8 px-0">
              {unit.renderings.map((rendering) => (
                <figure key={rendering.src} className="relative aspect-[4/3] bg-cloud">
                  <Image
                    src={rendering.src}
                    alt={rendering.alt}
                    fill
                    sizes="(min-width: 1024px) 240px, 50vw"
                    className="object-cover"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-ink/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-stone">
                    {rendering.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        {/* Analysis */}
        <div className="flex flex-col gap-5 p-6 sm:p-7">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${accent.text}`}>
              {unit.compName ? "Unit market analysis" : "Unit"}
            </p>
            <h3 className="mt-1 font-display text-2xl text-ink">{unit.name}</h3>
            <p className="text-sm text-slate">
              {unit.address} &middot; {unit.bedrooms} bed / {unit.bathrooms} bath
            </p>
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

          <div className="space-y-1.5">
            <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
              Price per bed (editable)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink/50">
                $
              </span>
              <input
                id={inputId}
                type="text"
                inputMode="numeric"
                value={pricePerBed}
                onChange={(event) => handlePriceChange(event.target.value)}
                className={`w-full rounded-xl border border-ink/15 bg-stone py-3 pl-8 pr-20 font-display text-xl text-ink outline-none ring-2 ring-transparent transition focus:border-transparent ${accent.ring}`}
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate">
                / mo
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 col-span-2">
              <dt className="text-slate">Price per SF</dt>
              <dd className="font-semibold text-ink">${stats.pricePerSf.toFixed(2)} / SF</dd>
            </div>
            <div className="flex items-center justify-between gap-3 col-span-2">
              <dt className="text-slate">Annual gross revenue</dt>
              <dd className="font-semibold text-ink">${currency(stats.annualGrossRevenue)} / yr</dd>
            </div>
            <div className="flex items-center justify-between gap-3 col-span-2">
              <dt className="text-slate">Discount to comp</dt>
              <dd className="font-semibold text-ink">
                {stats.discountToComp >= 0 ? "−" : "+"}
                {Math.abs(stats.discountToComp).toFixed(0)}%{" "}
                <span className="font-normal text-slate">vs {unit.compName}</span>
              </dd>
            </div>
          </dl>

          <p className="text-xs text-slate/80">
            Closest competitor by SF &mdash; {unit.compName} (reference rent ${currency(unit.compPricePerBed)} / bed / mo).
            Adjust the price per bed above to model revenue and positioning.
          </p>
        </div>
      </div>
    </article>
  );
}
