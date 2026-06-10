"use client";

import { useState } from "react";
import { ChatBot } from "@/components/ChatBot";

export function InterestModal({
  unitName,
  buttonClass = "bg-brass text-ink hover:bg-brass-soft",
}: {
  unitName: string;
  buttonClass?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${buttonClass}`}
      >
        Interest for {unitName}
      </button>

      <ChatBot
        isOpen={open}
        onClose={() => setOpen(false)}
        trigger="interest"
        unitName={unitName}
      />
    </>
  );
}
