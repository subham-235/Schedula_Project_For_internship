"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { specialties } from "@/lib/mock-data/doctors";

export default function Hero() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("General Medicine");
  const [location, setLocation] = useState("Kolkata");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (specialty !== "All") params.set("specialty", specialty);
    if (location.trim()) params.set("location", location.trim());
    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <section className="brand-grid overflow-hidden border-b border-[var(--line)]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--brand)] soft-shadow">
            <span className="size-2 rounded-full bg-[var(--brand)]" />
            Trusted appointment discovery
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            The right doctor.
            <span className="block text-[var(--brand)]">The right time.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Search by specialty, compare trusted doctors, check available slots and confirm your appointment in just a few steps.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 grid gap-2 rounded-2xl border border-[var(--line)] bg-white p-2 soft-shadow sm:grid-cols-[1fr_1fr_auto]"
          >
            <label className="rounded-xl px-3 py-2">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Specialty</span>
              <select
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
              >
                {specialties.filter((item) => item !== "All").map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="rounded-xl border-t border-[var(--line)] px-3 py-2 sm:border-l sm:border-t-0">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Location</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                placeholder="Enter your city"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
            >
              Search doctors
            </button>
          </form>

          <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-[var(--line)]">
            <div className="pr-4">
              <p className="text-xl font-semibold">4.9/5</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Patient rating</p>
            </div>
            <div className="px-4">
              <p className="text-xl font-semibold">25k+</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Mock bookings</p>
            </div>
            <div className="pl-4">
              <p className="text-xl font-semibold">6</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Specialties</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="rounded-[2rem] border border-[var(--line)] bg-white p-5 soft-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--muted)]">Recommended for you</p>
                <p className="mt-1 font-semibold">Available today</p>
              </div>
              <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">Live mock slots</span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                ["AR", "Dr. Anika Rao", "General Medicine", "4.9", ["10:30 AM", "12:00 PM", "04:00 PM"]],
                ["MC", "Dr. Martin Cole", "Dermatology", "4.8", ["11:30 AM", "03:00 PM"]],
              ].map(([initials, name, specialtyName, rating, slots]) => (
                <div key={String(name)} className="rounded-2xl border border-[var(--line)] p-4">
                  <div className="flex gap-3">
                    <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[var(--brand-soft)] font-semibold text-[var(--brand)]">
                      {String(initials)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-semibold">{String(name)}</p>
                          <p className="mt-0.5 text-xs text-[var(--muted)]">{String(specialtyName)}</p>
                        </div>
                        <span className="text-xs font-semibold">★ {String(rating)}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(slots as string[]).map((slot) => (
                          <span key={slot} className="rounded-lg border border-[var(--line)] bg-[#fbfdfc] px-2.5 py-1.5 text-[11px] font-semibold">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Verified profiles", "Simple slots", "Instant confirmation"].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--line)] bg-white p-3 text-center text-[11px] font-semibold text-[var(--muted)]">
                <span className="mb-2 block text-lg text-[var(--brand)]">✓</span>{item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
