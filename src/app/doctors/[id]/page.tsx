"use client";

import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";

import Footer from "@/components/layout/Footer";

import { doctors } from "@/lib/mock-data/doctors";

import {
  ensureDoctorSlotsSeeded,
  getAvailableSlotsForDoctor,
  getRegisteredDoctors,
  mergeDoctorProfiles,
} from "@/lib/client-storage";

import type { Doctor } from "@/types/doctor";

import type { DoctorSlot } from "@/types/availability";

export default function DoctorProfilePage() {
  const params = useParams<{
    id: string;
  }>();

  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [slots, setSlots] = useState<DoctorSlot[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allDoctors = mergeDoctorProfiles(doctors, getRegisteredDoctors());

    const found = allDoctors.find((item) => item.id === params.id);

    if (!found) {
      setLoading(false);

      return;
    }

    ensureDoctorSlotsSeeded(found.id, found.slots);

    setDoctor(found);

    setSlots(getAvailableSlotsForDoctor(found.id));

    setLoading(false);
  }, [params.id]);

  const groupedSlots = useMemo(() => {
    const groups = new Map<string, DoctorSlot[]>();

    slots.forEach((slot) => {
      const existing = groups.get(slot.date) ?? [];

      groups.set(slot.date, [...existing, slot]);
    });

    return Array.from(groups.entries());
  }, [slots]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="grid min-h-[60vh] place-items-center">
          Loading doctor profile...
        </main>
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold">Doctor not found</h1>

          <Link
            href="/doctors"
            className="mt-5 inline-flex rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to doctors
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/doctors"
          className="text-sm font-semibold text-[var(--brand)]"
        >
          ← Back to doctors
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_23rem]">
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-[var(--line)] bg-white p-7 soft-shadow">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="size-28 overflow-hidden rounded-[1.75rem] bg-[var(--brand-soft)]">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl font-semibold text-[var(--brand)]">
                      {doctor.initials}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-semibold">{doctor.name}</h1>

                  <p className="mt-2 font-medium text-[var(--brand)]">
                    {doctor.specialty}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                    <span>{doctor.experience} years experience</span>

                    <span>•</span>

                    <span>{doctor.location}</span>

                    <span>•</span>

                    <span>₹{doctor.fee}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <h2 className="font-semibold">About</h2>

              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {doctor.bio}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
                <h2 className="font-semibold">Education</h2>

                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  {doctor.education.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
                <h2 className="font-semibold">Languages</h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {doctor.languages.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] border border-[var(--line)] bg-white p-6 soft-shadow lg:sticky lg:top-24">
            <p className="text-sm text-[var(--muted)]">Consultation fee</p>

            <p className="mt-1 text-2xl font-semibold">₹{doctor.fee}</p>

            <div className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
              {slots.length > 0
                ? `${slots.length} available slot${slots.length === 1 ? "" : "s"}`
                : "No slots currently available"}
            </div>

            <h2 className="mt-6 font-semibold">Available appointments</h2>

            {groupedSlots.length > 0 ? (
              <div className="mt-4 max-h-80 space-y-4 overflow-y-auto">
                {groupedSlots.map(([date, dateSlots]) => (
                  <div key={date}>
                    <p className="text-xs font-semibold text-[var(--muted)]">
                      {new Intl.DateTimeFormat("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      }).format(new Date(`${date}T00:00:00`))}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {dateSlots.map((slot) => (
                        <span
                          key={slot.id}
                          className="rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700"
                        >
                          {slot.time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">
                This doctor has not published any available appointments yet.
              </p>
            )}

            {slots.length > 0 ? (
              <Link
                href={`/booking/${doctor.id}`}
                className="mt-6 block rounded-xl bg-[var(--brand)] px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Book appointment
              </Link>
            ) : (
              <div className="mt-6 rounded-xl bg-stone-100 px-5 py-3 text-center text-sm font-semibold text-stone-500">
                No booking slots
              </div>
            )}
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
