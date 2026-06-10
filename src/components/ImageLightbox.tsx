"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";

type LightboxImage = { src: string; alt: string; caption: string };

export function ImageLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const image = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const prev = useCallback(() => { if (hasPrev) onNavigate(index - 1); }, [hasPrev, index, onNavigate]);
  const next = useCallback(() => { if (hasNext) onNavigate(index + 1); }, [hasNext, index, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [prev, next, onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div aria-hidden className="absolute inset-0 bg-ink/90 backdrop-blur-sm" />

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-stone transition-colors hover:bg-white/20"
      >
        ✕
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-stone text-xl transition-colors hover:bg-white/25"
        >
          ‹
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-stone text-xl transition-colors hover:bg-white/25"
        >
          ›
        </button>
      )}

      {/* Image */}
      <div
        className="relative flex max-h-[88vh] max-w-5xl w-full flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="90vw"
            className="rounded-xl object-contain"
            priority
          />
        </div>
        <div className="mt-3 flex items-center justify-center gap-4">
          <p className="text-sm font-medium text-stone/70 uppercase tracking-wide">
            {image.caption}
          </p>
          {images.length > 1 && (
            <p className="text-xs text-stone/40">
              {index + 1} / {images.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
