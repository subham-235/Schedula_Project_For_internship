"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const testimonials = [
  { quote: "The entire experience felt considered—from finding the right doctor to having the confirmation in one clear place.", name: "Maya Sen", role: "Patient, Kolkata", initials: "MS" },
  { quote: "Schedula gives me a clean view of the day without making clinical work feel like administration.", name: "Dr. Arjun Mehta", role: "Orthopedic specialist", initials: "AM" },
  { quote: "Having the prescription available after the appointment made follow-up care much easier for my family.", name: "Rohan Das", role: "Patient, New Town", initials: "RD" },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const move = (direction: number) => setActive((active + direction + testimonials.length) % testimonials.length);
  const item = testimonials[active];
  return <AnimatedSection className="bg-[var(--background)] py-20 sm:py-28"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 md:grid-cols-[0.35fr_1fr] md:items-start"><div><Quote size={34} strokeWidth={1.4} className="text-[var(--coral)]" /><p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Patient stories</p><div className="mt-8 flex gap-2"><button type="button" onClick={() => move(-1)} aria-label="Previous testimonial" className="grid size-11 place-items-center border border-[var(--line)] bg-[var(--card)]"><ArrowLeft size={18} /></button><button type="button" onClick={() => move(1)} aria-label="Next testimonial" className="grid size-11 place-items-center bg-[var(--brand)] text-white"><ArrowRight size={18} /></button></div></div><AnimatePresence mode="wait"><motion.blockquote key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}><p className="font-editorial text-3xl leading-[1.25] sm:text-5xl">“{item.quote}”</p><footer className="mt-9 flex items-center gap-4 border-t border-[var(--line)] pt-6"><span className="grid size-11 place-items-center bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)]">{item.initials}</span><span><strong className="block text-sm font-semibold">{item.name}</strong><span className="mt-1 block text-xs text-[var(--muted)]">{item.role}</span></span></footer></motion.blockquote></AnimatePresence></div></div></AnimatedSection>;
}
