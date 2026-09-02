import { CalendarCheck, Check, FileText, Search, Stethoscope } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const steps = [
  { title: "Find your doctor", note: "Search by expertise, location, and availability.", icon: Search },
  { title: "Choose a time", note: "Select a live appointment slot that suits you.", icon: CalendarCheck },
  { title: "Doctor confirms", note: "Receive a clear confirmation and any updates.", icon: Check },
  { title: "Attend your visit", note: "Arrive prepared with all details in one place.", icon: Stethoscope },
  { title: "Follow up", note: "Access prescriptions, reviews, and simple rebooking.", icon: FileText },
];

export default function HowItWorks() {
  return <AnimatedSection id="how-it-works" className="bg-[var(--charcoal-deep)] py-20 text-white sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]"><div className="lg:sticky lg:top-28 lg:self-start"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--coral)]">A calmer path to care</p><h2 className="font-editorial mt-4 text-4xl leading-tight sm:text-5xl">From search to follow-up, without the friction.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-white/55">Schedula keeps the practical details moving so your attention can stay on your health.</p></div><ol className="border-t border-white/15">{steps.map((step, index) => { const Icon = step.icon; return <li key={step.title} className="group grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-white/15 py-6 sm:grid-cols-[54px_1fr_auto]"><span className="font-editorial text-2xl text-white/35">0{index + 1}</span><div><h3 className="font-medium">{step.title}</h3><p className="mt-1 text-sm text-white/50">{step.note}</p></div><span className="grid size-10 place-items-center border border-white/15 text-[var(--coral)] transition group-hover:border-[var(--coral)] group-hover:bg-[var(--coral)] group-hover:text-white"><Icon size={18} /></span></li>; })}</ol></div></div></AnimatedSection>;
}
