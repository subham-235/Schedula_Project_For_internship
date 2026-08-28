"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { doctors } from "@/lib/mock-data/doctors";

export default function DoctorProfilePage() {
  const params = useParams<{ id: string }>();
  const doctor = doctors.find((item) => item.id === params.id);

  if (!doctor) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold">Doctor not found</h1>
          <Link href="/doctors" className="mt-5 inline-flex rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white">Back to doctors</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/doctors" className="text-sm font-semibold text-[var(--brand)] hover:underline">← Back to doctor listing</Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-[var(--line)] bg-white p-6 soft-shadow sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="grid size-24 shrink-0 place-items-center rounded-[1.75rem] bg-[var(--brand-soft)] text-2xl font-semibold text-[var(--brand)]">{doctor.initials}</div>
                <div className="flex-1">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <h1 className="text-3xl font-semibold tracking-tight">{doctor.name}</h1>
                      <p className="mt-2 text-[var(--brand)]">{doctor.specialty}</p>
                    </div>
                    <span className="h-fit rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800">★ {doctor.rating} · {doctor.reviews} reviews</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                    <span>{doctor.experience} years experience</span>
                    <span>•</span>
                    <span>{doctor.location}</span>
                    <span>•</span>
                    <span>₹{doctor.fee} consultation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{doctor.bio}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
                <h2 className="font-semibold">Education</h2>
                <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                  {doctor.education.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
                <h2 className="font-semibold">Languages</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {doctor.languages.map((item) => <span key={item} className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)]">{item}</span>)}
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] border border-[var(--line)] bg-white p-6 soft-shadow lg:sticky lg:top-24">
            <p className="text-sm text-[var(--muted)]">Consultation fee</p>
            <p className="mt-1 text-2xl font-semibold">₹{doctor.fee}</p>
            <div className="mt-5 rounded-xl bg-[var(--brand-soft)] p-3 text-sm font-semibold text-[var(--brand)]">{doctor.availability}</div>
            <h2 className="mt-6 font-semibold">Available slots</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {doctor.slots.map((slot) => <span key={slot} className="rounded-xl border border-[var(--line)] px-3 py-2.5 text-center text-xs font-semibold">{slot}</span>)}
            </div>
            <Link href={`/booking/${doctor.id}`} className="mt-6 block rounded-xl bg-[var(--brand)] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--brand-deep)]">Book appointment</Link>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
