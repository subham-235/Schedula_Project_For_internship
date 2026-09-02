import Link from "next/link";
import { ArrowUpRight, Bell, CalendarClock, FileText, RefreshCcw, Search, Stethoscope, UserRound } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const patientItems = [
  { label: "Find trusted specialists", icon: Search },
  { label: "Receive timely updates", icon: Bell },
  { label: "Access prescriptions", icon: FileText },
  { label: "Review and rebook", icon: RefreshCcw },
];
const doctorItems = [
  { label: "Manage availability", icon: CalendarClock },
  { label: "Confirm appointments", icon: Stethoscope },
  { label: "Keep patient context", icon: UserRound },
  { label: "Create prescriptions", icon: FileText },
];

export default function ForEveryone() {
  return <AnimatedSection id="for-everyone" className="bg-[var(--ivory)] py-20 sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid border border-[var(--line)] bg-[var(--card)] lg:grid-cols-2"><article className="p-7 sm:p-10 lg:p-14"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">For patients</p><h2 className="font-editorial mt-4 text-4xl">Care, kept beautifully simple.</h2><p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">Discover the right doctor and carry every part of your appointment journey with confidence.</p><div className="mt-9 grid gap-px border-y border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">{patientItems.map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-3 bg-[var(--card)] px-3 py-4 text-sm font-medium"><Icon size={17} className="text-[var(--brand)]" />{label}</div>)}</div><Link href="/doctors" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)]">Explore patient care <ArrowUpRight size={16} /></Link></article><article className="bg-[var(--brand)] p-7 text-white sm:p-10 lg:p-14"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">For doctors</p><h2 className="font-editorial mt-4 text-4xl">A clinical workspace that stays out of your way.</h2><p className="mt-4 max-w-md text-sm leading-7 text-white/65">Shape your schedule, respond to patients, and complete care without scattered tools.</p><div className="mt-9 grid gap-px border-y border-white/15 bg-white/15 sm:grid-cols-2">{doctorItems.map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-3 bg-[var(--brand)] px-3 py-4 text-sm font-medium"><Icon size={17} className="text-[var(--coral)]" />{label}</div>)}</div><Link href="/signup" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-white">Join as a doctor <ArrowUpRight size={16} /></Link></article></div></div></AnimatedSection>;
}
