"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarCheck2,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  X,
} from "lucide-react";

import DoctorCard from "@/components/doctors/DoctorCard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import {
  ensureDoctorSlotsSeeded,
  getAvailableSlotsForDoctor,
  getRegisteredDoctors,
  mergeDoctorProfiles,
} from "@/lib/client-storage";
import { doctors, specialties } from "@/lib/mock-data/doctors";
import type { Doctor } from "@/types/doctor";

type SortOption = "recommended" | "rating" | "experience" | "fee-low";

const specialtyDescriptions: Record<string, string> = {
  All: "All doctors",
  "General Medicine": "Primary care",
  Dermatology: "Skin & hair",
  Cardiology: "Heart care",
  Orthopedics: "Bones & joints",
  Pediatrics: "Child care",
  Neurology: "Brain & nerves",
};

export default function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [location, setLocation] = useState("");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [maximumFee, setMaximumFee] = useState(2000);
  const [minimumExperience, setMinimumExperience] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    setIsLoading(false);
  };

  useEffect(() => {
    const initializeTimer = window.setTimeout(() => {
      loadDoctors();

      const params = new URLSearchParams(window.location.search);
      const specialtyFromUrl = params.get("specialty");
      const locationFromUrl = params.get("location");
      const availabilityFromUrl = params.get("availability");

      if (
        specialtyFromUrl &&
        specialties.includes(specialtyFromUrl as (typeof specialties)[number])
      ) {
        setSpecialty(specialtyFromUrl);
      }

      if (locationFromUrl) setLocation(locationFromUrl);
      if (availabilityFromUrl && availabilityFromUrl !== "Any day") setAvailabilityOnly(true);
    }, 0);

    window.addEventListener("focus", loadDoctors);
    return () => {
      window.clearTimeout(initializeTimer);
      window.removeEventListener("focus", loadDoctors);
    };
  }, []);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

    const matches = allDoctors.filter((doctor) => {
      const matchesSpecialty =
        specialty === "All" || doctor.specialty === specialty;
      const matchesLocation =
        !normalizedLocation ||
        doctor.location.toLowerCase().includes(normalizedLocation);
      const matchesQuery =
        !normalizedQuery ||
        doctor.name.toLowerCase().includes(normalizedQuery) ||
        doctor.specialty.toLowerCase().includes(normalizedQuery) ||
        doctor.bio.toLowerCase().includes(normalizedQuery);
      const matchesAvailability = !availabilityOnly || !doctor.availability.startsWith("No");
      const matchesFee = doctor.fee <= maximumFee;
      const matchesExperience = doctor.experience >= minimumExperience;

      return matchesSpecialty && matchesLocation && matchesQuery && matchesAvailability && matchesFee && matchesExperience;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return b.experience - a.experience;
      if (sortBy === "fee-low") return a.fee - b.fee;
      return b.rating * Math.log10(b.reviews + 10) - a.rating * Math.log10(a.reviews + 10);
    });
  }, [allDoctors, availabilityOnly, location, maximumFee, minimumExperience, query, sortBy, specialty]);

  const hasActiveFilters = Boolean(query || location || specialty !== "All" || availabilityOnly || maximumFee < 2000 || minimumExperience > 0);
  const clearFilters = () => {
    setQuery("");
    setLocation("");
    setSpecialty("All");
    setAvailabilityOnly(false);
    setMaximumFee(2000);
    setMinimumExperience(0);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F4EF]">
        <section className="border-b border-[var(--line)] bg-[var(--ivory)]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:px-8 lg:py-14">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
                <Stethoscope className="size-4" />
                Schedula care network
              </div>
              <h1 className="font-editorial mt-4 text-4xl tracking-tight text-[var(--charcoal-deep)] sm:text-6xl sm:leading-[1.02]">
                Find care that feels right for you.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Compare verified specialists, see live availability, and book an
                appointment in a few simple steps.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 self-end">
              <div className="border-l-2 border-[var(--coral)] bg-[var(--card)] p-4">
                <BadgeCheck className="size-5 text-[var(--brand)]" />
                <p className="mt-5 text-2xl font-semibold">{allDoctors.length || "—"}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Verified doctors</p>
              </div>
              <div className="border-l-2 border-[var(--amber)] bg-[var(--card)] p-4">
                <CalendarCheck2 className="size-5 text-[var(--brand)]" />
                <p className="mt-5 text-2xl font-semibold">Live</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Slot availability</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--line)] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr_auto]">
              <label className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[#FFFFFF] px-4 focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[#F2C2A7]">
                <Search className="size-5 shrink-0 text-[var(--muted)]" />
                <span className="sr-only">Search doctors</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search doctor, specialty, or condition"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-[#746E68]"
                />
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[#FFFFFF] px-4 focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[#F2C2A7]">
                <MapPin className="size-5 shrink-0 text-[var(--muted)]" />
                <span className="sr-only">Search by location</span>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Area or city"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-[#746E68]"
                />
              </label>

              <button
                type="button"
                onClick={() => document.getElementById("doctor-results")?.scrollIntoView()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
              >
                <Search className="size-4" />
                Find doctors
              </button>
            </div>
          </div>
        </section>

        <section id="doctor-results" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">
            {filtersOpen && <button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="fixed inset-0 z-40 bg-[#12100F]/45 lg:hidden" />}
            <aside className={`${filtersOpen ? "fixed inset-x-3 bottom-3 z-50 block max-h-[85vh] overflow-y-auto shadow-[0_20px_60px_rgba(18,16,15,0.18)]" : "hidden"} h-fit rounded-xl border border-[var(--line)] bg-white p-5 lg:sticky lg:top-24 lg:block lg:max-h-none lg:overflow-visible lg:shadow-none`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-[var(--brand)]" />
                  <h2 className="font-semibold">Specialty</h2>
                </div>
                {hasActiveFilters && (
                  <button type="button" onClick={clearFilters} className="text-xs font-semibold text-[var(--brand)] hover:text-[var(--brand-deep)]">
                    Clear all
                  </button>
                )}
                <button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="grid size-8 place-items-center lg:hidden"><X size={17} /></button>
              </div>

              <div className="mt-4 space-y-1">
                {specialties.map((item) => {
                  const selected = specialty === item;
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setSpecialty(item)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${selected ? "bg-[var(--brand-soft)] font-semibold text-[var(--brand-deep)]" : "text-[var(--muted)] hover:bg-[#F7F4EF] hover:text-[var(--foreground)]"}`}
                    >
                      <span>
                        <span className="block">{item}</span>
                        <span className={`mt-0.5 block text-[10px] ${selected ? "text-[var(--brand)]" : "text-[#746E68]"}`}>
                          {specialtyDescriptions[item]}
                        </span>
                      </span>
                      {selected && <span className="size-2 rounded-full bg-[var(--brand)]" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-[var(--line)] pt-5">
                <h3 className="text-sm font-semibold">Availability</h3>
                <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-[var(--muted)]">
                  <input type="checkbox" checked={availabilityOnly} onChange={(event) => setAvailabilityOnly(event.target.checked)} className="size-4 accent-[var(--brand)]" />
                  Available doctors only
                </label>
              </div>

              <div className="mt-6 border-t border-[var(--line)] pt-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">Consultation fee</h3>
                  <span className="text-xs text-[var(--muted)]">Up to ₹{maximumFee}</span>
                </div>
                <input type="range" min="500" max="2000" step="100" value={maximumFee} onChange={(event) => setMaximumFee(Number(event.target.value))} className="mt-4 w-full accent-[var(--brand)]" />
              </div>

              <div className="mt-6 border-t border-[var(--line)] pt-5">
                <h3 className="text-sm font-semibold">Experience</h3>
                <select value={minimumExperience} onChange={(event) => setMinimumExperience(Number(event.target.value))} className="mt-3 w-full border border-[var(--line)] bg-[var(--card)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)]">
                  <option value={0}>Any experience</option>
                  <option value={5}>5+ years</option>
                  <option value={10}>10+ years</option>
                  <option value={15}>15+ years</option>
                </select>
              </div>

              <div className="mt-5 border-t border-[var(--line)] pt-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" />
                  <div>
                    <p className="text-sm font-semibold">Verified profiles</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                      Credentials and professional details are reviewed.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <div>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Available specialists</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    {isLoading ? "Finding doctors…" : `${visible.length} doctor${visible.length === 1 ? "" : "s"} found`}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {specialty === "All" ? "Across all specialties" : `Specializing in ${specialty}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-semibold lg:hidden"><SlidersHorizontal size={16} /> Filters</button>
                <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  Sort by
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 font-semibold text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest rated</option>
                    <option value="experience">Most experienced</option>
                    <option value="fee-low">Lowest fee</option>
                  </select>
                </label>
                </div>
              </div>

              {isLoading ? (
                <div className="border-t border-[var(--line)]">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-80 animate-pulse rounded-xl border border-[var(--line)] bg-white" />
                  ))}
                </div>
              ) : visible.length > 0 ? (
                <div className="border-t border-[var(--line)]">
                  {visible.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--line)] bg-white px-6 py-16 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                    <Search className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No matching doctors</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                    Try a different specialty, doctor name, or nearby location.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  >
                    <X className="size-4" />
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
