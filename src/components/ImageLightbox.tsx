"use client";

import { useEffect } from "react";
import Image from "next/image";

export function ImageLightbox({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div aria-hidden className="absolute inset-0 bg-ink/90 backdrop-blur-sm" />
      <div
        className="relative flex max-h-[90vh] max-w-5xl w-full flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full text-stone/70 transition-colors hover:text-stone"
        >
          ✕
        </button>
        <div className="relative min-h-0 flex-1" style={{ aspectRatio: "16/10" }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="90vw"
            className="rounded-xl object-contain"
            priority
          />
        </div>
        {caption && (
          <p className="mt-3 text-center text-sm font-medium uppercase tracking-wide text-stone/60">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
