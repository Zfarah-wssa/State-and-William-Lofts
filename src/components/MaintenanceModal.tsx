"use client";

import { useState } from "react";
import { ChatBot } from "@/components/ChatBot";

export function MaintenanceModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-left text-sm text-stone/70 transition-colors hover:text-stone"
      >
        Maintenance Requests
      </button>

      <ChatBot
        isOpen={open}
        onClose={() => setOpen(false)}
        trigger="maintenance"
      />
    </>
  );
}
