"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Baby, Bone, Brain, HeartPulse, ScanFace, Stethoscope, type LucideIcon } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const items: { name: string; note: string; icon: LucideIcon }[] = [
  { name: "General Medicine", note: "Everyday and preventive care", icon: Stethoscope },
  { name: "Dermatology", note: "Skin, hair and nail health", icon: ScanFace },
  { name: "Cardiology", note: "Heart and vascular care", icon: HeartPulse },
  { name: "Orthopedics", note: "Bones, joints and mobility", icon: Bone },
  { name: "Pediatrics", note: "Thoughtful care for children", icon: Baby },
  { name: "Neurology", note: "Brain and nervous system", icon: Brain },
];

export default function SpecialtySection() {
  return <AnimatedSection id="specialties" className="bg-[var(--background)] py-20 sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-6 border-b border-[var(--line)] pb-10 lg:grid-cols-[0.45fr_1fr]"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Specialty index / 01—06</p><h2 className="font-editorial max-w-3xl text-4xl leading-[1.05] sm:text-6xl">Find the discipline.<br />Meet the right specialist.</h2></div><div>{items.map((item, index) => { const Icon = item.icon; return <motion.div key={item.name} initial="rest" whileHover="hover"><Link href={`/doctors?specialty=${encodeURIComponent(item.name)}`} className="group grid grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-[var(--line)] py-6 sm:grid-cols-[80px_1fr_1fr_auto] sm:py-8"><motion.span variants={{ rest: { x: 0 }, hover: { x: 5 } }} className="font-editorial text-xl text-[var(--muted)] group-hover:text-[var(--brand)]">0{index + 1}</motion.span><motion.h3 variants={{ rest: { x: 0 }, hover: { x: 8 } }} className="font-editorial text-2xl sm:text-4xl">{item.name}</motion.h3><p className="hidden text-sm text-[var(--muted)] sm:block">{item.note}</p><span className="grid size-10 place-items-center text-[var(--brand)] sm:size-12"><Icon size={20} className="transition group-hover:scale-0" /><ArrowUpRight size={20} className="absolute scale-0 transition group-hover:scale-100" /></span></Link></motion.div>; })}</div></div></AnimatedSection>;
}
