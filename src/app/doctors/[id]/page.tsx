"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Award, BadgeCheck, BookOpen, CalendarDays, Languages, MapPin, Star, Stethoscope } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { doctors } from "@/lib/mock-data/doctors";
import { ensureDoctorSlotsSeeded, getAvailableSlotsForDoctor, getRegisteredDoctors, mergeDoctorProfiles } from "@/lib/client-storage";
import type { Doctor } from "@/types/doctor";
import type { DoctorSlot } from "@/types/availability";

export default function DoctorProfilePage() {
  const params = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const found = mergeDoctorProfiles(doctors, getRegisteredDoctors()).find((item) => item.id === params.id);
      if (!found) { setLoading(false); return; }
      ensureDoctorSlotsSeeded(found.id, found.slots);
      setDoctor(found);
      setSlots(getAvailableSlotsForDoctor(found.id));
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [params.id]);

  const groupedSlots = useMemo(() => {
    const groups = new Map<string, DoctorSlot[]>();
    slots.forEach((slot) => groups.set(slot.date, [...(groups.get(slot.date) ?? []), slot]));
    return Array.from(groups.entries());
  }, [slots]);

  if (loading) return <><Navbar /><main className="grid min-h-[65vh] place-items-center bg-[var(--background)]"><div className="text-center"><span className="mx-auto block size-8 animate-spin rounded-full border-2 border-[var(--sand)] border-t-[var(--brand)]" /><p className="mt-4 text-sm text-[var(--muted)]">Preparing doctor profile…</p></div></main></>;
  if (!doctor) return <><Navbar /><main className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="font-editorial text-4xl">Doctor not found</h1><Link href="/doctors" className="mt-6 inline-flex bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white">Back to doctors</Link></main></>;

  return <><Navbar /><main className="bg-[var(--background)]"><section className="border-b border-[var(--line)] bg-[var(--ivory)]"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Link href="/doctors" className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand)]"><ArrowLeft size={15} /> Back to doctors</Link><div className="mt-7 grid gap-7 md:grid-cols-[220px_1fr] md:items-end"><div className="overflow-hidden bg-[var(--sand)]"><img src={doctor.image} alt={doctor.name} className="aspect-[4/5] w-full object-cover object-top saturate-[0.85]" /></div><div className="pb-2"><span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]"><BadgeCheck size={15} /> Verified specialist</span><h1 className="font-editorial mt-3 text-4xl leading-none sm:text-6xl">{doctor.name}</h1><p className="mt-3 text-base font-semibold text-[var(--brand)]">{doctor.specialty}</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]"><span className="flex items-center gap-2"><Star size={16} className="fill-[var(--amber)] text-[var(--amber)]" /> {doctor.rating} ({doctor.reviews} reviews)</span><span className="flex items-center gap-2"><Award size={16} /> {doctor.experience} years</span><span className="flex items-center gap-2"><MapPin size={16} /> {doctor.location}</span></div></div></div></div></section><section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8 lg:py-14"><div className="space-y-10"><article><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Professional profile</p><h2 className="font-editorial mt-3 text-3xl">About {doctor.name.replace("Dr. ", "")}</h2><p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--muted)]">{doctor.bio}</p></article><div className="grid gap-px border-y border-[var(--line)] bg-[var(--line)] sm:grid-cols-2"><article className="bg-[var(--card)] p-6"><BookOpen size={20} className="text-[var(--brand)]" /><h2 className="mt-5 font-semibold">Education</h2><ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">{doctor.education.map((item) => <li key={item} className="border-l-2 border-[var(--sand)] pl-3">{item}</li>)}</ul></article><article className="bg-[var(--card)] p-6"><Languages size={20} className="text-[var(--brand)]" /><h2 className="mt-5 font-semibold">Languages</h2><p className="mt-4 text-sm leading-7 text-[var(--muted)]">{doctor.languages.join(" · ")}</p></article></div><article className="border-t border-[var(--line)] pt-8"><div className="flex items-center gap-3"><Stethoscope size={20} className="text-[var(--brand)]" /><h2 className="text-lg font-semibold">Clinical focus</h2></div><p className="mt-4 text-sm leading-7 text-[var(--muted)]">Consultations are tailored to your concerns, medical history, and follow-up needs. Bring any relevant reports when booking.</p></article></div><aside className="h-fit border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_18px_45px_rgba(18,16,15,0.07)] lg:sticky lg:top-24"><div className="flex items-end justify-between border-b border-[var(--line)] pb-5"><div><p className="text-xs text-[var(--muted)]">Consultation fee</p><p className="mt-1 text-2xl font-semibold">₹{doctor.fee}</p></div><CalendarDays className="text-[var(--brand)]" size={22} /></div><div className="mt-5 border-l-2 border-[var(--amber)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--brand)]">{slots.length ? `${slots.length} appointments available` : "No appointments available"}</div><h2 className="mt-6 text-sm font-semibold">Choose an appointment</h2>{groupedSlots.length ? <div className="warm-scrollbar mt-4 max-h-80 space-y-5 overflow-y-auto pr-1">{groupedSlots.map(([date, dateSlots]) => <div key={date}><p className="text-xs font-semibold text-[var(--muted)]">{new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${date}T00:00:00`))}</p><div className="mt-2 grid grid-cols-2 gap-2">{dateSlots.map((slot) => <span key={slot.id} className="border border-[var(--line)] bg-[var(--background)] px-2 py-2 text-center text-xs font-semibold text-[var(--brand)]">{slot.time}</span>)}</div></div>)}</div> : <p className="mt-4 text-sm leading-6 text-[var(--muted)]">This doctor has not published new appointments yet.</p>}{slots.length ? <Link href={`/booking/${doctor.id}`} className="mt-6 block bg-[var(--brand)] px-5 py-3.5 text-center text-sm font-semibold text-white hover:bg-[var(--brand-deep)]">Book appointment</Link> : <div className="mt-6 bg-[#F7F4EF] px-5 py-3 text-center text-sm font-semibold text-[#746E68]">No booking slots</div>}</aside></section></main><Footer /></>;
}
