import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function FinalCTA() {
  return <AnimatedSection className="bg-[var(--ivory)] px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-7xl border-y border-[var(--line)] py-14 text-center sm:py-24"><CalendarDays className="mx-auto text-[var(--coral)]" size={28} strokeWidth={1.6} /><h2 className="font-editorial mx-auto mt-6 max-w-5xl text-5xl leading-[0.98] tracking-[-0.055em] sm:text-7xl">Your next appointment<br />should take minutes,<br />not phone calls.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[var(--muted)]">Find a specialist, choose a time, and let Schedula keep the details together.</p><Link href="/doctors" className="group mt-8 inline-flex items-center gap-2 bg-[var(--brand)] px-7 py-4 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[var(--brand-deep)]">Find your doctor <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link></div></AnimatedSection>;
}
