"use client";

import Link from "next/link";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  CalendarCheck,
  Stethoscope,
} from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">

      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#087f69] px-6 py-12 text-white shadow-[0_30px_100px_rgba(6,100,82,0.22)] sm:px-10 lg:px-14 lg:py-16"
      >

        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-white/10 blur-2xl" />

        <div className="absolute -bottom-40 left-1/3 size-96 rounded-full bg-emerald-300/10 blur-3xl" />


        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-extrabold text-emerald-50">
              <CalendarCheck size={15} />
              Ready when you are
            </div>


            <h2 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
              Your next appointment can
              start with a few simple clicks.
            </h2>

            <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-emerald-50/70 sm:text-base">
              Find a doctor, choose an available
              slot and manage your healthcare
              journey with Schedula.
            </p>

          </div>


          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

            <Link
              href="/doctors"
              className="group inline-flex min-w-[200px] items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-extrabold text-[#087f69] transition hover:bg-emerald-50"
            >
              Find a doctor

              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/signup"
              className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-extrabold text-white transition hover:bg-white/15"
            >
              <Stethoscope size={17} />

              Join as doctor
            </Link>

          </div>

        </div>

      </motion.div>

    </section>
  );
}