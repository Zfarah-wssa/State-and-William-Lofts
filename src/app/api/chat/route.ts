import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { units621William, williamStreetAddress } from "@/data/units-621-william";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const unitsSummary = units621William
  .map(
    (unit) =>
      `- ${unit.name} (${unit.address}): ${unit.bedrooms} bed / ${unit.bathrooms} bath, ${unit.squareFootage} SF, starting around $${unit.basePricePerBed}/bed per month.`,
  )
  .join("\n");

const SYSTEM_PROMPT = `You are the friendly leasing assistant for State & William Lofts, a premium fully furnished student housing property at ${williamStreetAddress}, steps from the University of Michigan's Central Campus.

Available units:
${unitsSummary}

All units are newly constructed, fully furnished, and include in-unit laundry machines.

Guidelines:
- Be warm, concise, and helpful — you're talking to prospective student tenants and their families.
- Answer questions about the units, pricing, location, and amenities using the information above.
- If asked about something you don't know (exact availability, lease terms, application process), suggest they use the "Interest" form on the site or contact the leasing team via the Contact section, and offer to help with anything else.
- Keep responses short — a few sentences at most, unless more detail is specifically requested.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const messages = body.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Missing messages" }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Chat request failed:", error);
    return NextResponse.json({ error: "Failed to get a response" }, { status: 500 });
  }
}
