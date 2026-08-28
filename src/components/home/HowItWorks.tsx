const steps = [
  ["01", "Search", "Choose a specialty, location or doctor to discover relevant options."],
  ["02", "Pick a slot", "Open a doctor profile and select an available date and time."],
  ["03", "Confirm", "Enter patient details and get an immediate booking confirmation."],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-[var(--line)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">One booking, zero confusion</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">A clear experience for patients and doctors.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
              Day 1 focuses on a complete mock workflow rather than backend complexity: discover, select, book, confirm and surface the visit in the doctor dashboard.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map(([number, title, copy]) => (
              <div key={number} className="rounded-2xl border border-[var(--line)] bg-[#fbfdfc] p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand)]">{number}</span>
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
