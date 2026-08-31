"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/layout/Navbar";

import Footer from "@/components/layout/Footer";

import DoctorCard from "@/components/doctors/DoctorCard";

import { doctors, specialties } from "@/lib/mock-data/doctors";

import {
  ensureDoctorSlotsSeeded,
  getAvailableSlotsForDoctor,
  getRegisteredDoctors,
  mergeDoctorProfiles,
} from "@/lib/client-storage";

import type { Doctor } from "@/types/doctor";

export default function DoctorsPage() {
  const [query, setQuery] = useState("");

  const [specialty, setSpecialty] = useState("All");

  const [location, setLocation] = useState("");

  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);

  const loadDoctors = () => {
    const combined = mergeDoctorProfiles(doctors, getRegisteredDoctors());

    const withAvailability = combined.map((doctor) => {
      ensureDoctorSlotsSeeded(doctor.id, doctor.slots);

      const slotCount = getAvailableSlotsForDoctor(doctor.id).length;

      return {
        ...doctor,

        availability:
          slotCount > 0
            ? `${slotCount} slot${slotCount === 1 ? "" : "s"} available`
            : "No slots available",
      };
    });

    setAllDoctors(withAvailability);
  };

  useEffect(() => {
    loadDoctors();

    const params = new URLSearchParams(window.location.search);

    const specialtyFromUrl = params.get("specialty");

    const locationFromUrl = params.get("location");

    if (
      specialtyFromUrl &&
      specialties.includes(specialtyFromUrl as (typeof specialties)[number])
    ) {
      setSpecialty(specialtyFromUrl);
    }

    if (locationFromUrl) {
      setLocation(locationFromUrl);
    }

    window.addEventListener("focus", loadDoctors);

    return () => window.removeEventListener("focus", loadDoctors);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    const loc = location.trim().toLowerCase();

    return allDoctors.filter((doctor) => {
      const specialtyMatch =
        specialty === "All" || doctor.specialty === specialty;

      const locationMatch = !loc || doctor.location.toLowerCase().includes(loc);

      const queryMatch =
        !q ||
        doctor.name.toLowerCase().includes(q) ||
        doctor.specialty.toLowerCase().includes(q);

      return specialtyMatch && locationMatch && queryMatch;
    });
  }, [allDoctors, query, specialty, location]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="border-b border-[var(--line)] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
              Doctor Discovery
            </p>

            <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">
                  Find the right doctor for your needs
                </h1>

                <p className="mt-3 text-sm text-[var(--muted)]">
                  Search doctors and view their current available appointments.
                </p>
              </div>

              <p className="text-sm text-[var(--muted)]">
                <strong>{visible.length}</strong> doctors found
              </p>
            </div>

            <div className="mt-8 grid gap-3 rounded-2xl border border-[var(--line)] bg-[#fbfdfc] p-3 md:grid-cols-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Doctor or specialty"
                className="rounded-xl bg-white px-4 py-3 text-sm outline-none"
              />

              <select
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                className="rounded-xl bg-white px-4 py-3 text-sm outline-none"
              >
                {specialties.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
                className="rounded-xl bg-white px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {visible.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] p-12 text-center">
              No doctors found.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
