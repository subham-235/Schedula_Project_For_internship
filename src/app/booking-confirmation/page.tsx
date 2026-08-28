"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import type { Booking } from "@/types/booking";

export default function BookingConfirmationPage() {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    try {
      const value = localStorage.getItem("schedula-latest-booking");
      setBooking(value ? (JSON.parse(value) as Booking) : null);
    } catch {
      setBooking(null);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-12">
        <section className="w-full max-w-2xl rounded-[2rem] border border-[var(--line)] bg-white p-6 text-center soft-shadow sm:p-10">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--brand-soft)] text-2xl font-semibold text-[var(--brand)]">✓</div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Booking successful</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Appointment confirmed</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">Your appointment has been stored in the Day 1 mock booking flow. The doctor dashboard can also read locally created bookings.</p>

          {booking ? (
            <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-[var(--line)] bg-[#fbfdfc] p-5 text-left">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
                <div><p className="font-semibold">{booking.doctorName}</p><p className="mt-1 text-sm text-[var(--muted)]">{booking.specialty}</p></div>
                <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)]">Confirmed</span>
              </div>
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div><dt className="text-[var(--muted)]">Patient</dt><dd className="mt-1 font-medium">{booking.patientName}</dd></div>
                <div><dt className="text-[var(--muted)]">Appointment ID</dt><dd className="mt-1 font-medium">{booking.id}</dd></div>
                <div><dt className="text-[var(--muted)]">Date</dt><dd className="mt-1 font-medium">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(`${booking.date}T00:00:00`))}</dd></div>
                <div><dt className="text-[var(--muted)]">Time</dt><dd className="mt-1 font-medium">{booking.time}</dd></div>
                <div><dt className="text-[var(--muted)]">Fee</dt><dd className="mt-1 font-medium">₹{booking.fee}</dd></div>
                <div><dt className="text-[var(--muted)]">Email</dt><dd className="mt-1 break-all font-medium">{booking.patientEmail}</dd></div>
              </dl>
              {/* <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800">Email delivery is simulated in this mock-only Day 1 version. Connect an email provider when backend work begins.</div> */}
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">No recent local booking was found. Create an appointment first.</div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/doctors" className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]">Book another appointment</Link>
            {/* <Link href="/doctor-dashboard" className="rounded-xl border border-[var(--line)] px-5 py-3 text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]">View doctor dashboard</Link> */}
          </div>
        </section>
      </main>
    </>
  );
}
