"use client";

import { MaintenanceModal } from "@/components/MaintenanceModal";

const residentLinks = ["Resident Portal", "Lease Renewals", "Resident Life"];

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-stone/10 bg-ink text-stone/80">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-2xl text-stone">State &amp; William Lofts</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone/60">
              Premium, fully furnished student housing across Ann Arbor &mdash;
              steps from the University of Michigan&rsquo;s Central Campus.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass-soft">
              Residents
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <MaintenanceModal />
              </li>
              {residentLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-stone/70 transition-colors hover:text-stone">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass-soft">
              West Second Street Associates
            </p>
            <div className="mt-4 space-y-1 text-sm text-stone/70">
              <p>West Second Street Associates, LLC</p>
              <p>Mott Foundation Building</p>
              <p>503 S. Saginaw St., Suite 600</p>
              <p>Flint, Michigan 48502</p>
              <p className="pt-2">
                <a href="tel:+18102391551" className="hover:text-brass-soft">
                  Phone: 810.239.1551
                </a>
              </p>
              <p>Fax: 810.767.1196</p>
              <p>
                <a href="mailto:info@wssallc.com" className="hover:text-brass-soft">
                  info@wssallc.com
                </a>
              </p>
            </div>
            <a
              href="https://wssallc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-stone/25 px-5 py-2.5 text-sm font-semibold text-stone transition-colors hover:border-brass-soft hover:text-brass-soft"
            >
              About Us
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-stone/10 pt-6 text-xs text-stone/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} State &amp; William Lofts. All rights reserved.</p>
          <p>Equal Housing Opportunity &middot; Professionally managed in Ann Arbor, MI</p>
        </div>
      </div>
    </footer>
  );
}
