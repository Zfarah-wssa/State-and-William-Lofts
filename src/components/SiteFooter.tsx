const columns = [
  {
    heading: "Company",
    links: ["About State & William", "Careers", "Press"],
  },
  {
    heading: "Residents",
    links: ["Resident Portal", "Maintenance Requests", "Lease Renewals", "Resident Life"],
  },
  {
    heading: "Neighborhoods",
    links: ["Central Campus", "South University", "Kerrytown", "North Campus Gateway"],
  },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-stone/10 bg-ink text-stone/80">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl text-stone">State &amp; William Lofts</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone/60">
              Premium, fully furnished student housing across Ann Arbor &mdash;
              steps from the University of Michigan&rsquo;s Central Campus.
            </p>
            <div className="mt-6 space-y-1 text-sm text-stone/70">
              <p>123 S Main St, Suite 400</p>
              <p>Ann Arbor, MI 48104</p>
              <p>
                <a href="tel:+17345550142" className="hover:text-brass-soft">
                  (734) 555-0142
                </a>
              </p>
              <p>
                <a href="mailto:leasing@stateandwilliam.com" className="hover:text-brass-soft">
                  leasing@stateandwilliam.com
                </a>
              </p>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass-soft">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-stone/70 transition-colors hover:text-stone">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-stone/10 pt-6 text-xs text-stone/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} State &amp; William Lofts. All rights reserved.</p>
          <p>Equal Housing Opportunity &middot; Professionally managed in Ann Arbor, MI</p>
        </div>
      </div>
    </footer>
  );
}
