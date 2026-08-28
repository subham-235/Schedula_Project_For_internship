"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DoctorCard from "@/components/doctors/DoctorCard";
import { doctors, specialties } from "@/lib/mock-data/doctors";

export default function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const specialtyFromUrl = params.get("specialty");
    const locationFromUrl = params.get("location");
    if (specialtyFromUrl && specialties.includes(specialtyFromUrl as (typeof specialties)[number])) {
      setSpecialty(specialtyFromUrl);
    }
    if (locationFromUrl) setLocation(locationFromUrl);
  }, []);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSpecialty = specialty === "All" || doctor.specialty === specialty;
      const matchesLocation = !normalizedLocation || doctor.location.toLowerCase().includes(normalizedLocation);
      const matchesQuery =
        !normalizedQuery ||
        doctor.name.toLowerCase().includes(normalizedQuery) ||
        doctor.specialty.toLowerCase().includes(normalizedQuery);

      return matchesSpecialty && matchesLocation && matchesQuery;
    });
  }, [query, specialty, location]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-[var(--line)] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Doctor discovery</p>
            <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Find the right doctor for your needs</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">Search by doctor name, specialty or location. All results on this Day 1 build come from local mock data.</p>
              </div>
              <p className="text-sm text-[var(--muted)]"><span className="font-semibold text-[var(--foreground)]">{visible.length}</span> doctors found</p>
            </div>

            <div className="mt-8 grid gap-3 rounded-2xl border border-[var(--line)] bg-[#fbfdfc] p-3 md:grid-cols-[1.2fr_1fr_1fr]">
              <label className="rounded-xl bg-white px-4 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Search</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Doctor name or specialty"
                  className="mt-1 block w-full bg-transparent text-sm font-medium outline-none"
                />
              </label>
              <label className="rounded-xl bg-white px-4 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Specialty</span>
                <select value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="mt-1 block w-full bg-transparent text-sm font-medium outline-none">
                  {specialties.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="rounded-xl bg-white px-4 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Location</span>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Kolkata"
                  className="mt-1 block w-full bg-transparent text-sm font-medium outline-none"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {visible.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center">
              <h2 className="font-semibold">No doctors match those filters.</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Try changing the specialty, location or search text.</p>
              <button
                type="button"
                onClick={() => { setQuery(""); setSpecialty("All"); setLocation(""); }}
                className="mt-5 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
