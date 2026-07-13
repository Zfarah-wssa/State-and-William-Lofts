import Anthropic from "@anthropic-ai/sdk";
import type { BrokerRecommendation } from "./types";

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

function extractJsonArray(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON array found in response");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

function isBrokerRecommendation(v: unknown): v is BrokerRecommendation {
  const r = v as Record<string, unknown>;
  return (
    typeof r === "object" &&
    r !== null &&
    typeof r.name === "string" &&
    typeof r.firm === "string" &&
    typeof r.rationale === "string"
  );
}

/**
 * Best-effort research (via Claude's web search tool) into the top commercial real estate
 * brokers active in a metro for federal/government leasing deals. Requires ANTHROPIC_API_KEY;
 * returns null when unset so the report can note the section as unavailable rather than fail
 * the whole run — useful for local dry runs where no key is configured.
 */
export async function findTopBrokers(location: string): Promise<BrokerRecommendation[] | null> {
  if (!client) return null;

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }],
    messages: [
      {
        role: "user",
        content: `Search for the top 5 commercial real estate brokers or brokerage teams active in ${location} who have experience with federal government leasing (GSA, VA, or other agency build-to-suit / long-term leases), or failing that, large institutional/office leasing generally in that market.

Respond with ONLY a JSON array of exactly 5 objects, no markdown fence, no commentary before or after. Each object: {"name": "<broker or team name>", "firm": "<brokerage firm>", "rationale": "<one sentence on why they're a fit, citing what you found>"}.`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJsonArray(text);
  if (!Array.isArray(parsed) || !parsed.every(isBrokerRecommendation)) {
    throw new Error("Broker response did not match the expected shape");
  }
  return parsed;
}
