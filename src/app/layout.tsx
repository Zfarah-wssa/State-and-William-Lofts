import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.stateandwilliamlofts.com";
const SITE_NAME = "State & William Lofts";
const DESCRIPTION =
  "Modern, fully furnished student apartments at 615.5 / 621 E. William St, Ann Arbor, MI — steps from Central Campus, The Diag, and the Michigan Union. Now leasing for Fall 2026.";
const OG_IMAGE = "/images/621-william/render-3d-level2west.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} | Premium Student Housing Near UMich`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "State and William Lofts",
    "State & William Lofts",
    "Ann Arbor student housing",
    "621 E William St Ann Arbor",
    "University of Michigan apartments",
    "Ann Arbor furnished apartments",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Student Housing Near UMich`,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Student Housing Near UMich`,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  name: SITE_NAME,
  description: DESCRIPTION,
  url: BASE_URL,
  image: `${BASE_URL}${OG_IMAGE}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "615.5 / 621 E. William St.",
    addressLocality: "Ann Arbor",
    addressRegion: "MI",
    postalCode: "48104",
    addressCountry: "US",
  },
  telephone: "+1-810-239-1551",
  email: "info@wssallc.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone text-ink font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
