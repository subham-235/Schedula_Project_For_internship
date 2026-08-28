import Link from "next/link";
import type { Doctor } from "@/types/doctor";

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-white p-5 hover:-translate-y-1 hover:border-[var(--brand)] soft-shadow">
      <div className="flex items-start gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[var(--brand-soft)] text-lg font-semibold text-[var(--brand)]">
          {doctor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">{doctor.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{doctor.specialty}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold">★ {doctor.rating}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--muted)]">
            <span>{doctor.experience} yrs experience</span>
            <span>{doctor.reviews} reviews</span>
            <span>{doctor.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-[#f8fbf9] p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--muted)]">Consultation fee</p>
            <p className="mt-1 font-semibold">₹{doctor.fee}</p>
          </div>
          <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)]">{doctor.availability}</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link
          href={`/doctors/${doctor.id}`}
          className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-center text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          View profile
        </Link>
        <Link
          href={`/booking/${doctor.id}`}
          className="rounded-xl bg-[var(--brand)] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
        >
          Book appointment
        </Link>
      </div>
    </article>
  );
}
