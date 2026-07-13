const STATE_ABBR =
  "AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC";

const CITY_STATE_RE = new RegExp(
  `([A-Z][a-zA-Z.'\\s]{1,40}?),\\s*(${STATE_ABBR})\\b`
);

/**
 * Best-effort "City, ST" extraction from a notice's title or description, used to scope
 * broker research to the right metro. Checks the title first since SAM.gov lease notices
 * conventionally name the city there; falls back to the description.
 */
export function parseLocation(title: string, description: string): string | null {
  const fromTitle = title.match(CITY_STATE_RE);
  if (fromTitle) return `${fromTitle[1].trim()}, ${fromTitle[2]}`;

  const fromDescription = description.match(CITY_STATE_RE);
  if (fromDescription) return `${fromDescription[1].trim()}, ${fromDescription[2]}`;

  return null;
}
