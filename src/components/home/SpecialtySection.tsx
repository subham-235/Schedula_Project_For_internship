import Link from "next/link";

const items = [
  ["General Medicine", "Primary care", "GM"],
  ["Dermatology", "Skin & hair", "DR"],
  ["Cardiology", "Heart health", "CR"],
  ["Orthopedics", "Bones & joints", "OR"],
  ["Pediatrics", "Child care", "PD"],
  ["Neurology", "Brain & nerves", "NR"],
];

export default function SpecialtySection() {
  return (
    <section id="specialties" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Browse quickly</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Find care by specialty</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[var(--muted)]">Choose a specialty to immediately narrow the doctor list.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map(([name, note, initials]) => (
          <Link
            key={name}
            href={`/doctors?specialty=${encodeURIComponent(name)}`}
            className="group rounded-2xl border border-[var(--line)] bg-white p-4 hover:-translate-y-1 hover:border-[var(--brand)]"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white">
              {initials}
            </span>
            <p className="mt-5 text-sm font-semibold">{name}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{note}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
