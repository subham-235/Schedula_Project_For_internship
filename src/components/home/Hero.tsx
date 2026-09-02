"use client";

/* eslint-disable @next/next/no-img-element */
import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Check, Clock3, MapPin, Search, ShieldCheck, Star } from "lucide-react";

import { specialties } from "@/lib/mock-data/doctors";

export default function Hero() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("General Medicine");
  const [location, setLocation] = useState("Kolkata");
  const [availability, setAvailability] = useState("Any day");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (specialty !== "All") params.set("specialty", specialty);
    if (location.trim()) params.set("location", location.trim());
    if (availability !== "Any day") params.set("availability", availability);
    router.push(`/doctors?${params.toString()}`);
  };

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const reveal = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };

  return (
    <section className="border-b border-[var(--line)] bg-[var(--background)] pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[630px] items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.p variants={reveal} className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">Healthcare, reworked.</motion.p>
            <motion.h1 variants={reveal} className="font-editorial mt-5 text-[3.75rem] leading-[0.9] tracking-[-0.065em] text-[var(--charcoal-deep)] sm:text-7xl lg:text-[6.35rem]">
              Healthcare,<br />without the<br /><span className="text-[var(--brand)]">waiting game.</span>
            </motion.h1>
            <motion.p variants={reveal} className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Find the right specialist, choose an available slot and manage your care without endless phone calls.
            </motion.p>
            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              <a href="#doctor-search" className="inline-flex items-center gap-2 bg-[var(--brand)] px-6 py-3.5 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[var(--brand-deep)]">Find a doctor <ArrowRight size={17} /></a>
              <a href="#how-it-works" className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--card)] px-6 py-3.5 text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]">How Schedula works</a>
            </motion.div>
            <motion.div variants={reveal} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[var(--muted)]">
              <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[var(--brand)]" /> Verified clinicians</span>
              <span className="flex items-center gap-2"><Clock3 size={16} className="text-[var(--brand)]" /> Live availability</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-[var(--brand)]" /> Clear confirmations</span>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative mx-auto w-full max-w-lg lg:mr-0">
            <div className="ml-auto w-[86%] overflow-hidden bg-[var(--sand)]">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Dr. Anika Rao" className="aspect-[4/5] w-full object-cover object-top saturate-[0.8]" />
            </div>
            <div className="absolute -bottom-7 left-0 w-[72%] border-l-4 border-[var(--coral)] bg-[var(--card)] p-5 shadow-[0_18px_50px_rgba(18,16,15,0.12)]">
              <div className="flex items-start justify-between gap-4">
                <div><p className="font-semibold">Dr. Anika Rao</p><p className="mt-1 text-xs text-[var(--muted)]">General Medicine · 12 years</p></div>
                <span className="flex items-center gap-1 text-xs font-semibold"><Star size={14} className="fill-[var(--amber)] text-[var(--amber)]" /> 4.9</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-xs"><span className="flex items-center gap-2 text-[var(--muted)]"><CalendarDays size={15} /> Today, 4:00 PM</span><span className="font-semibold text-[var(--brand)]">Available</span></div>
            </div>
          </motion.div>
        </div>

        <form id="doctor-search" onSubmit={submit} className="relative z-10 grid border border-[var(--line)] bg-[var(--card)] p-3 shadow-[0_16px_50px_rgba(18,16,15,0.08)] md:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3 md:border-b-0 md:border-r">
            <Search size={18} className="text-[var(--brand)]" /><span className="flex-1"><span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Specialty</span><select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="mt-1 w-full appearance-none bg-transparent text-sm font-semibold outline-none">{specialties.map((item) => <option key={item}>{item}</option>)}</select></span>
          </label>
          <label className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3 md:border-b-0 md:border-r">
            <MapPin size={18} className="text-[var(--brand)]" /><span className="flex-1"><span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Location</span><input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full bg-transparent text-sm font-semibold outline-none" /></span>
          </label>
          <label className="flex items-center gap-3 px-4 py-3">
            <CalendarDays size={18} className="text-[var(--brand)]" /><span className="flex-1"><span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Availability</span><select value={availability} onChange={(e) => setAvailability(e.target.value)} className="mt-1 w-full appearance-none bg-transparent text-sm font-semibold outline-none"><option>Any day</option><option>Today</option><option>Tomorrow</option></select></span>
          </label>
          <button type="submit" className="bg-[var(--brand)] px-7 py-4 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]">Search doctors</button>
        </form>
      </div>
    </section>
  );
}
