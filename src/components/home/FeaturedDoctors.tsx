"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, BadgeCheck, MapPin, Star } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { doctors } from "@/lib/mock-data/doctors";
import { getRegisteredDoctors } from "@/lib/client-storage";
import type { Doctor } from "@/types/doctor";

export default function FeaturedDoctors() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const [doctorList, setDoctorList] = useState<Doctor[]>(doctors.slice(0, 6));

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDoctorList([...doctors, ...getRegisteredDoctors()].slice(0, 6)),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatedSection className="bg-[var(--background)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Featured doctors</p>
            <h2 className="font-editorial mt-3 text-4xl sm:text-5xl">Clinicians patients trust.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">Experienced specialists, verified profiles and appointment availability.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label="Previous doctors" className="grid size-11 place-items-center border border-[var(--line)] bg-[var(--card)] hover:border-[var(--foreground)]"><ArrowLeft size={18} /></button>
            <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label="Next doctors" className="grid size-11 place-items-center bg-[var(--brand)] text-white hover:bg-[var(--brand-deep)]"><ArrowRight size={18} /></button>
          </div>
        </div>

        <div ref={emblaRef} className="mt-12 overflow-hidden" aria-roledescription="carousel">
          <div className="flex touch-pan-y gap-5">
            {doctorList.map((doctor) => (
              <article key={doctor.id} className="group min-w-0 flex-[0_0_88%] overflow-hidden border border-[var(--line)] bg-[var(--card)] sm:flex-[0_0_48%] lg:flex-[0_0_calc(33.333%-14px)]">
                <div className="relative overflow-hidden bg-[var(--sand)]">
                  <img src={doctor.image} alt={doctor.name} className="aspect-[4/5] w-full object-cover object-top saturate-[0.8] transition duration-500 ease-out group-hover:scale-[1.025]" />
                  <span className="absolute left-4 top-4 flex items-center gap-1.5 bg-[var(--card)] px-3 py-1.5 text-xs font-semibold"><BadgeCheck size={14} className="text-[var(--brand)]" /> Verified</span>
                </div>
                <div className="p-5 transition-transform duration-300 group-hover:translate-y-[-2px]">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-lg font-semibold">{doctor.name}</h3><p className="mt-1 text-sm text-[var(--brand)]">{doctor.specialty}</p></div>
                    <span className="flex items-center gap-1 text-sm"><Star size={14} className="fill-[var(--accent)] text-[var(--accent)]" /> {doctor.rating}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 border-y border-[var(--line)] py-4 text-xs"><div><span className="block text-[var(--muted)]">Experience</span><strong className="mt-1 block">{doctor.experience} years</strong></div><div><span className="block text-[var(--muted)]">Consultation</span><strong className="mt-1 block">₹{doctor.fee}</strong></div></div>
                  <p className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]"><MapPin size={14} className="text-[var(--brand)]" /> {doctor.location}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3"><Link href={`/doctors/${doctor.id}`} className="border border-[var(--line)] px-3 py-2.5 text-center text-xs font-semibold hover:border-[var(--foreground)]">View profile</Link><Link href={`/booking/${doctor.id}`} className="group/book bg-[var(--brand)] px-3 py-2.5 text-center text-xs font-semibold text-white hover:bg-[var(--brand-deep)]">Book <ArrowRight size={13} className="ml-1 inline transition group-hover/book:translate-x-1" /></Link></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
