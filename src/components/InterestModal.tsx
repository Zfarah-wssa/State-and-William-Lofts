"use client";

import { useId, useState } from "react";

type InterestFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

const emptyForm: InterestFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
};

export function InterestModal({
  unitName,
  buttonClass = "bg-brass text-ink hover:bg-brass-soft",
}: {
  unitName: string;
  buttonClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<InterestFormState>(emptyForm);
  const headingId = useId();

  const close = () => {
    setOpen(false);
    setSubmitted(false);
    setForm(emptyForm);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const updateField = (field: keyof InterestFormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${buttonClass}`}
      >
        Interest for {unitName}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            aria-hidden
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-cloud shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
              <h2 id={headingId} className="font-display text-xl text-ink">
                {submitted ? "Thank you!" : `Interest in ${unitName}`}
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
                  We&rsquo;ve received your interest in <strong className="text-ink">{unitName}</strong>.
                  A member of our leasing team will reach out to{" "}
                  <strong className="text-ink">{form.email || "you"}</strong> shortly.
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="First name"
                    id="interest-first-name"
                    value={form.firstName}
                    onChange={updateField("firstName")}
                    required
                  />
                  <Field
                    label="Last name"
                    id="interest-last-name"
                    value={form.lastName}
                    onChange={updateField("lastName")}
                    required
                  />
                </div>
                <Field
                  label="Email"
                  id="interest-email"
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  required
                />
                <Field
                  label="Phone number"
                  id="interest-phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField("phone")}
                  required
                />
                <div className="space-y-1.5">
                  <label htmlFor="interest-notes" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                    Any other info
                  </label>
                  <textarea
                    id="interest-notes"
                    rows={4}
                    value={form.notes}
                    onChange={updateField("notes")}
                    placeholder="Move-in timing, group size, questions for the leasing team..."
                    className="w-full resize-none rounded-xl border border-ink/15 bg-stone px-4 py-3 text-sm text-ink outline-none ring-2 ring-transparent transition focus:border-transparent focus:ring-brass/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-stone transition-colors hover:bg-ink-soft"
                >
                  Submit interest
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-ink/15 bg-stone px-4 py-3 text-sm text-ink outline-none ring-2 ring-transparent transition focus:border-transparent focus:ring-brass/30"
      />
    </div>
  );
}
