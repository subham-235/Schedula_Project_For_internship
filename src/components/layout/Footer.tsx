import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] font-serif text-xl text-white">S</span>
            <span className="text-lg font-semibold">Schedula</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Find trusted doctors, compare availability and book appointments without unnecessary friction.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Explore</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <Link className="block hover:text-[var(--brand)]" href="/doctors">Find doctors</Link>
            <Link className="block hover:text-[var(--brand)]" href="/login">Patient login</Link>
            <Link className="block hover:text-[var(--brand)]" href="/doctor-dashboard">Doctor dashboard</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Demo note</p>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Day 1 uses mock data and browser storage. No production authentication, database or real email service is connected yet.
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] py-5 text-center text-xs text-[var(--muted)]">
        © 2026 Schedula internship starter
      </div>
    </footer>
  );
}
