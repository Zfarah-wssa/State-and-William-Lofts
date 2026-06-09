"use client";

import { useId, useState } from "react";

const UNITS = [
  "Level 2 West — 615.5 E. William St.",
  "Level 2 East — 621 E. William St.",
  "Level 3 East — 621 E. William St.",
];

type FormState = { unit: string; description: string };
const empty: FormState = { unit: "", description: "" };

export function MaintenanceModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const headingId = useId();

  const close = () => {
    setOpen(false);
    setSubmitted(false);
    setForm(empty);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-stone/70 transition-colors hover:text-stone text-sm text-left"
      >
        Maintenance Requests
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div aria-hidden className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={close} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-cloud shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
              <h2 id={headingId} className="font-display text-xl text-ink">
                {submitted ? "Request submitted" : "Maintenance Request"}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate transition-colors hover:bg-stone-deep hover:text-ink"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="space-y-4 px-6 py-8">
                <p className="text-sm leading-relaxed text-slate">
                  Your maintenance request for <strong className="text-ink">{form.unit}</strong> has
                  been received. Our team will follow up with you shortly.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-stone transition-colors hover:bg-ink-soft"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                    Unit
                  </label>
                  <select
                    required
                    value={form.unit}
                    onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                    className="w-full rounded-xl border border-ink/15 bg-stone px-4 py-3 text-sm text-ink outline-none ring-2 ring-transparent transition focus:border-transparent focus:ring-brass/30"
                  >
                    <option value="" disabled>Select your unit</option>
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                    Describe your issue or maintenance needed
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Please describe the issue in as much detail as possible..."
                    className="w-full resize-none rounded-xl border border-ink/15 bg-stone px-4 py-3 text-sm text-ink outline-none ring-2 ring-transparent transition focus:border-transparent focus:ring-brass/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-stone transition-colors hover:bg-ink-soft disabled:opacity-60"
                >
                  {loading ? "Submitting…" : "Submit request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
