"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import type { Booking } from "@/types/booking";
import { getBookings } from "@/lib/client-storage";

type Filter = "all" | AppointmentStatus;
type ApiResponse = { data: Appointment[] };

const styles: Record<AppointmentStatus, string> = {
  confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  cancelled: "bg-stone-100 text-stone-600 ring-stone-200",
};

const time = (value: string) =>
  new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(value));

const initials = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

function bookingToAppointment(booking: Booking): Appointment {
  return {
    id: booking.id,
    patient: {
      name: booking.patientName,
      initials: initials(booking.patientName),
      age: booking.patientAge,
    },
    clinician: booking.doctorName,
    specialty: booking.specialty,
    startsAt: booking.startsAt,
    durationMinutes: 30,
    status: "confirmed",
    reason: booking.reason,
    room: "Clinic booking",
  };
}

export default function DoctorDashboardPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    fetch("/api/appointments")
      .then((response) => response.ok ? (response.json() as Promise<ApiResponse>) : Promise.reject())
      .then(({ data }) => {
        const local = getBookings().map(bookingToAppointment);
        const merged = [...local, ...data].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
        setItems(merged);
        setSelectedId(merged[0]?.id);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const visible = useMemo(() => filter === "all" ? items : items.filter((item) => item.status === filter), [items, filter]);
  const selected = items.find((item) => item.id === selectedId);
  const counts = items.reduce<Record<Filter, number>>((total, item) => ({ ...total, all: total.all + 1, [item.status]: total[item.status] + 1 }), { all: 0, confirmed: 0, pending: 0, cancelled: 0 });

  return (
    <main className="min-h-screen px-4 py-5 sm:px-8 sm:py-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-[var(--line)] pb-7 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] font-serif text-xl text-white">S</div>
            <div><p className="text-lg font-semibold tracking-tight">Schedula</p><p className="text-sm text-[var(--muted)]">Clinic operations</p></div>
          </Link>
          <div className="flex gap-2">
            <Link href="/doctors" className="rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]">Patient view</Link>
            <Link href="/doctors" className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]">New appointment</Link>
          </div>
        </header>

        <section className="py-8" aria-labelledby="dashboard-title">
          <p className="text-sm font-medium text-[var(--brand)]">Friday, 28 August</p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><h1 id="dashboard-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Today&apos;s appointments</h1><p className="mt-2 max-w-xl text-[var(--muted)]">Keep the day moving with a clear view of every patient and visit status.</p></div>
            <p className="text-sm text-[var(--muted)]"><span className="font-semibold text-[var(--foreground)]">{counts.confirmed} confirmed</span> of {counts.all} visits</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="overflow-hidden rounded-xl border border-[var(--line)] bg-white" aria-labelledby="schedule-title">
            <div className="flex flex-col gap-4 border-b border-[var(--line)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="schedule-title" className="font-semibold">Schedule</h2>
              <div className="flex flex-wrap gap-1 rounded-lg bg-stone-100 p-1" role="group" aria-label="Filter appointments">
                {(["all", "confirmed", "pending", "cancelled"] as Filter[]).map((item) => (
                  <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-md px-3 py-1.5 text-sm capitalize ${filter === item ? "bg-white font-medium shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}>
                    {item} <span className="ml-1 text-xs">{counts[item]}</span>
                  </button>
                ))}
              </div>
            </div>

            {status === "loading" && <div className="space-y-4 p-5" aria-busy="true">{[1, 2, 3].map((item) => <div className="h-20 animate-pulse rounded-lg bg-stone-100" key={item} />)}</div>}
            {status === "error" && <div className="p-8 text-center" role="alert"><p className="font-medium">We couldn&apos;t load appointments.</p><button className="mt-3 text-sm font-semibold text-[var(--brand)] underline" onClick={() => window.location.reload()} type="button">Try again</button></div>}
            {status === "ready" && visible.length > 0 && (
              <ul className="divide-y divide-[var(--line)]" role="list">
                {visible.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id} className={`grid w-full grid-cols-[4.5rem_minmax(0,1fr)] gap-3 px-5 py-4 text-left hover:bg-emerald-50/40 ${selectedId === item.id ? "bg-emerald-50/60" : ""}`}>
                      <time className="pt-1 text-sm font-medium text-[var(--muted)]">{time(item.startsAt)}</time>
                      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div><p className="font-semibold">{item.patient.name} <span className="font-normal text-[var(--muted)]">· {item.durationMinutes} min</span></p><p className="mt-0.5 truncate text-sm text-[var(--muted)]">{item.reason} · {item.clinician}</p></div>
                        <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[item.status]}`}>{item.status}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {status === "ready" && visible.length === 0 && <div className="p-10 text-center"><p className="font-medium">No appointments match this filter.</p><button type="button" onClick={() => setFilter("all")} className="mt-2 text-sm font-semibold text-[var(--brand)]">Show all appointments</button></div>}
          </section>

          <aside className="rounded-xl border border-[var(--line)] bg-white p-5" aria-live="polite">
            <p className="text-sm font-medium text-[var(--muted)]">Appointment details</p>
            {selected ? (
              <div className="mt-5">
                <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-emerald-100 text-sm font-semibold text-[var(--brand-deep)]">{selected.patient.initials}</span><div><h2 className="font-semibold">{selected.patient.name}</h2><p className="text-sm text-[var(--muted)]">{selected.patient.age} years old</p></div></div>
                <dl className="mt-6 space-y-4 text-sm">
                  <div><dt className="text-[var(--muted)]">Visit</dt><dd className="mt-1 font-medium">{selected.reason}</dd></div>
                  <div><dt className="text-[var(--muted)]">Time & room</dt><dd className="mt-1 font-medium">{time(selected.startsAt)} · {selected.room}</dd></div>
                  <div><dt className="text-[var(--muted)]">Care team</dt><dd className="mt-1 font-medium">{selected.clinician}<br />{selected.specialty}</dd></div>
                </dl>
                <button type="button" className="mt-7 w-full rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]">Open patient record</button>
              </div>
            ) : <p className="mt-5 text-sm text-[var(--muted)]">Select an appointment to see visit details.</p>}
          </aside>
        </div>
      </div>
    </main>
  );
}
