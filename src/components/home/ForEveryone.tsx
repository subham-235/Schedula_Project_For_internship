"use client";

import Link from "next/link";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  CalendarClock,
  FileText,
  LayoutDashboard,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react";

export default function ForEveryone() {
  return (
    <section
      id="for-everyone"
      className="bg-white py-20 sm:py-24"
    >

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#087f69]">
            Built for both sides of care
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#0d2f28] sm:text-4xl lg:text-5xl">
            Better for patients.
            <br />
            Better for doctors.
          </h2>

        </div>


        <div className="mt-12 grid gap-6 lg:grid-cols-2">

          {/* PATIENT */}

          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            className="group relative overflow-hidden rounded-[32px] border border-emerald-100 bg-[#eff9f5] p-7 sm:p-9"
          >

            <div className="absolute -right-24 -top-24 size-64 rounded-full bg-emerald-200/30 blur-3xl" />


            <div className="relative">

              <div className="grid size-14 place-items-center rounded-2xl bg-white text-[#087f69] shadow-sm">
                <UserRound size={23} />
              </div>

              <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.16em] text-[#087f69]">
                For patients
              </p>

              <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#12372f]">
                Find care without
                the waiting game.
              </h3>


              <div className="mt-7 space-y-4">

                {[
                  [
                    Search,
                    "Discover doctors by specialty and location",
                  ],
                  [
                    CalendarClock,
                    "See real doctor-created appointment slots",
                  ],
                  [
                    FileText,
                    "Upload documents and receive confirmation",
                  ],
                ].map(
                  ([Icon, text]) => {
                    const Component =
                      Icon as typeof Search;

                    return (
                      <div
                        key={String(text)}
                        className="flex items-center gap-3"
                      >
                        <span className="grid size-9 place-items-center rounded-xl bg-white text-[#087f69]">
                          <Component size={16} />
                        </span>

                        <p className="text-sm font-bold text-slate-600">
                          {String(text)}
                        </p>
                      </div>
                    );
                  }
                )}

              </div>


              <Link
                href="/doctors"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#087f69] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#066b59]"
              >
                Find a doctor
                <ArrowRight size={16} />
              </Link>

            </div>

          </motion.div>


          {/* DOCTOR */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            className="group relative overflow-hidden rounded-[32px] bg-[#102f29] p-7 text-white sm:p-9"
          >

            <div className="absolute -bottom-20 -right-20 size-64 rounded-full bg-emerald-400/10 blur-3xl" />


            <div className="relative">

              <div className="grid size-14 place-items-center rounded-2xl bg-white/10 text-emerald-300">
                <Stethoscope size={23} />
              </div>

              <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-300">
                For doctors
              </p>

              <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">
                Your schedule,
                fully in your control.
              </h3>


              <div className="mt-7 space-y-4">

                {[
                  [
                    LayoutDashboard,
                    "Manage upcoming patient appointments",
                  ],
                  [
                    CalendarClock,
                    "Create single and recurring availability",
                  ],
                  [
                    FileText,
                    "Access patient appointment documents",
                  ],
                ].map(
                  ([Icon, text]) => {
                    const Component =
                      Icon as typeof LayoutDashboard;

                    return (
                      <div
                        key={String(text)}
                        className="flex items-center gap-3"
                      >
                        <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-emerald-300">
                          <Component size={16} />
                        </span>

                        <p className="text-sm font-bold text-emerald-50/70">
                          {String(text)}
                        </p>
                      </div>
                    );
                  }
                )}

              </div>


              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#102f29] transition hover:bg-emerald-50"
              >
                Join as doctor
                <ArrowRight size={16} />
              </Link>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}