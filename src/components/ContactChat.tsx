"use client";

import { ChatBot } from "@/components/ChatBot";

export function ContactChat() {
  return (
    <ChatBot
      isOpen={true}
      onClose={() => {}}
      trigger="contact"
      variant="page"
    />
  );
}
