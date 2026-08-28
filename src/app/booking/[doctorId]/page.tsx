"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import BookingSummary from "@/components/booking/BookingSummary";
import { doctors } from "@/lib/mock-data/doctors";
import { saveBooking } from "@/lib/client-storage";
import type { Booking } from "@/types/booking";

function to24Hour(time: string) {
  const [clock, period] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

export default function BookingPage() {
  const params = useParams<{ doctorId: string }>();
  const router = useRouter();
  const doctor = doctors.find((item) => item.id === params.doctorId);
  const dates = useMemo(() => Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  }), []);

  const [date, setDate] = useState(dates[0] ?? "");
  const [time, setTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!doctor) {
    return <><Navbar /><main className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-3xl font-semibold">Doctor not found</h1><Link href="/doctors" className="mt-5 inline-flex rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white">Back to doctors</Link></main></>;
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!date || !time) return setError("Please select both a date and an appointment time.");
    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim() || !patientAge.trim() || !reason.trim()) return setError("Please complete all patient details.");
    if (!/^\S+@\S+\.\S+$/.test(patientEmail)) return setError("Please enter a valid email address.");
    if (!/^\d{10}$/.test(patientPhone.replace(/\D/g, ""))) return setError("Please enter a valid 10-digit phone number.");
    const age = Number(patientAge);
    if (!Number.isFinite(age) || age < 1 || age > 120) return setError("Please enter a valid patient age.");

    const booking: Booking = {
      id: `apt-${Date.now().toString().slice(-6)}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: age,
      reason: reason.trim(),
      date,
      time,
      startsAt: `${date}T${to24Hour(time)}`,
      fee: doctor.fee,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    saveBooking(booking);
    localStorage.setItem("schedula-latest-booking", JSON.stringify(booking));
    router.push("/booking-confirmation");
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href={`/doctors/${doctor.id}`} className="text-sm font-semibold text-(--brand) hover:underline">← Back to doctor profile</Link>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <form onSubmit={submit} className="space-y-6">
            <section className="rounded-2xl border border-(--line) bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Doctor booking flow</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Book your appointment</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">Select a date and time, enter patient details and confirm the visit.</p>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <h2 className="font-semibold">1. Select a date</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {dates.map((item) => {
                  const current = new Date(`${item}T00:00:00`);
                  return (
                    <button key={item} type="button" onClick={() => setDate(item)} className={`rounded-xl border p-3 text-left ${date === item ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]" : "border-[var(--line)] hover:border-[var(--brand)]"}`}>
                      <span className="block text-xs font-medium">{new Intl.DateTimeFormat("en", { weekday: "short" }).format(current)}</span>
                      <span className="mt-1 block text-sm font-semibold">{new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(current)}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <h2 className="font-semibold">2. Select an available time</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {doctor.slots.map((slot) => (
                  <button key={slot} type="button" onClick={() => setTime(slot)} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${time === slot ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--line)] hover:border-[var(--brand)] hover:text-[var(--brand)]"}`}>{slot}</button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-6">
              <h2 className="font-semibold">3. Patient details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label><span className="text-sm font-medium">Full name</span><input value={patientName} onChange={(e) => setPatientName(e.target.value)} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]" placeholder="Patient name" /></label>
                <label><span className="text-sm font-medium">Age</span><input inputMode="numeric" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]" placeholder="34" /></label>
                <label><span className="text-sm font-medium">Email</span><input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]" placeholder="patient@example.com" /></label>
                <label><span className="text-sm font-medium">Phone</span><input inputMode="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]" placeholder="9876543210" /></label>
                <label className="sm:col-span-2"><span className="text-sm font-medium">Reason for consultation</span><textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} className="mt-2 w-full resize-none rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]" placeholder="Briefly describe the reason for your visit" /></label>
              </div>
            </section>

            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button type="submit" className="w-full rounded-xl bg-[var(--brand)] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]">Confirm appointment</button>
          </form>

          <BookingSummary doctor={doctor} date={date} time={time} />
        </div>
      </main>
    </>
  );
}
