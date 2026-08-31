"use client";

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock3,
  HeartPulse,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
} from "lucide-react";

import {
  specialties,
} from "@/lib/mock-data/doctors";

export default function Hero() {
  const router =
    useRouter();

  const [
    specialty,
    setSpecialty,
  ] =
    useState(
      "General Medicine"
    );

  const [
    location,
    setLocation,
  ] =
    useState(
      "Kolkata"
    );

  const submit = (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const params =
      new URLSearchParams();

    if (
      specialty !== "All"
    ) {
      params.set(
        "specialty",
        specialty
      );
    }

    if (
      location.trim()
    ) {
      params.set(
        "location",
        location.trim()
      );
    }

    router.push(
      `/doctors?${params.toString()}`
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#f7fbf9] pb-20 pt-32 sm:pt-36 lg:min-h-[850px] lg:pb-24 lg:pt-40">

      {/* BACKGROUND DECORATION */}

      <div className="pointer-events-none absolute -left-52 top-20 size-[520px] rounded-full bg-emerald-200/25 blur-[100px]" />

      <div className="pointer-events-none absolute -right-64 top-0 size-[600px] rounded-full bg-teal-200/30 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 size-[440px] -translate-x-1/2 rounded-full bg-cyan-100/30 blur-[120px]" />


      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.04fr_.96fr] lg:px-8">

        {/* LEFT */}

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-3.5 py-2 text-xs font-bold text-[#087f69] shadow-sm backdrop-blur-xl">
            <Sparkles size={14} />

            Smarter healthcare scheduling
          </div>


          <h1 className="mt-7 max-w-3xl text-[44px] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#0b2d27] sm:text-6xl lg:text-[72px]">

            Healthcare that fits

            <span className="relative mt-1 block text-[#087f69]">
              your schedule.
            </span>

          </h1>


          <p className="mt-6 max-w-xl text-base font-medium leading-8 text-slate-600 sm:text-lg">

            Discover trusted doctors,
            explore real availability,
            upload medical documents and
            book appointments without the
            usual back-and-forth.

          </p>


          {/* SEARCH */}

          <motion.form
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.6,
            }}
            onSubmit={submit}
            className="mt-8 grid gap-2 rounded-[24px] border border-white bg-white/90 p-2.5 shadow-[0_22px_70px_rgba(18,77,64,0.13)] backdrop-blur-xl sm:grid-cols-[1fr_1fr_auto]"
          >

            <label className="group flex items-center gap-3 rounded-[18px] px-3 py-2.5 transition hover:bg-[#f5faf8]">

              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-[#087f69]">
                <Stethoscope size={18} />
              </div>

              <div className="min-w-0 flex-1">

                <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Specialty
                </span>

                <div className="relative">

                  <select
                    value={specialty}
                    onChange={(event) =>
                      setSpecialty(
                        event.target.value
                      )
                    }
                    className="mt-0.5 w-full appearance-none bg-transparent pr-6 text-sm font-bold text-[#183e36] outline-none"
                  >
                    {specialties
                      .filter(
                        (item) =>
                          item !== "All"
                      )
                      .map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

              </div>

            </label>


            <label className="group flex items-center gap-3 rounded-[18px] border-t border-slate-100 px-3 py-2.5 transition hover:bg-[#f5faf8] sm:border-l sm:border-t-0">

              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-[#087f69]">
                <MapPin size={18} />
              </div>

              <div className="min-w-0">

                <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Location
                </span>

                <input
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  placeholder="Enter your city"
                  className="mt-0.5 w-full bg-transparent text-sm font-bold text-[#183e36] outline-none placeholder:text-slate-400"
                />

              </div>

            </label>


            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#087f69] px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-950/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#066c59]"
            >
              <Search size={18} />

              Find doctors

              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </button>

          </motion.form>


          {/* MINI TRUST */}

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">

            {[
              [
                ShieldCheck,
                "Doctor-managed slots",
              ],
              [
                CalendarCheck,
                "Instant confirmation",
              ],
              [
                HeartPulse,
                "Simple patient flow",
              ],
            ].map(
              ([Icon, label]) => {
                const Component =
                  Icon as typeof ShieldCheck;

                return (
                  <div
                    key={String(label)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-emerald-100 text-[#087f69]">
                      <Component size={14} />
                    </span>

                    {String(label)}
                  </div>
                );
              }
            )}

          </div>

        </motion.div>


        {/* RIGHT */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94,
            x: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          transition={{
            delay: 0.12,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="relative mx-auto w-full max-w-[560px]"
        >

          <div className="absolute -left-6 top-24 hidden rounded-2xl border border-white bg-white/95 p-4 shadow-xl shadow-emerald-950/10 backdrop-blur-xl sm:block">

            <div className="flex items-center gap-3">

              <div className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-[#087f69]">
                <CalendarCheck size={18} />
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#123b33]">
                  Appointment confirmed
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  In just a few clicks
                </p>
              </div>

            </div>

          </div>


          <div className="relative rounded-[34px] border border-white/90 bg-white/90 p-4 shadow-[0_35px_100px_rgba(12,66,53,0.16)] backdrop-blur-2xl sm:p-6">

            {/* TOP */}

            <div className="flex items-center justify-between border-b border-slate-100 pb-5">

              <div>

                <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
                  Your appointment
                </p>

                <p className="mt-1 text-lg font-extrabold tracking-[-0.025em] text-[#11372f]">
                  Upcoming consultation
                </p>

              </div>

              <div className="grid size-11 place-items-center rounded-2xl bg-[#087f69] text-white">
                <CalendarCheck size={20} />
              </div>

            </div>


            {/* DOCTOR */}

            <div className="mt-5 rounded-[24px] bg-[#f5faf8] p-4 sm:p-5">

              <div className="flex items-center gap-4">

                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Doctor"
                  className="size-16 rounded-2xl object-cover shadow-sm"
                />

                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between gap-3">

                    <div>
                      <p className="font-extrabold text-[#11372f]">
                        Dr. Anika Rao
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        General Medicine
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-xs font-extrabold text-[#163b33]">
                      <Star
                        size={13}
                        fill="currentColor"
                        className="text-amber-400"
                      />

                      4.9
                    </div>

                  </div>

                </div>

              </div>


              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-white p-3.5">

                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarCheck size={14} />

                    <span className="text-[10px] font-extrabold uppercase tracking-wider">
                      Date
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-extrabold text-[#183d35]">
                    02 Sep, Wed
                  </p>

                </div>


                <div className="rounded-2xl bg-white p-3.5">

                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock3 size={14} />

                    <span className="text-[10px] font-extrabold uppercase tracking-wider">
                      Time
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-extrabold text-[#183d35]">
                    10:30 AM
                  </p>

                </div>

              </div>

            </div>


            <div className="mt-5">

              <div className="flex items-center justify-between">

                <p className="text-xs font-extrabold text-[#183d35]">
                  Available today
                </p>

                <span className="text-[10px] font-bold text-[#087f69]">
                  4 slots
                </span>

              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">

                {[
                  "09:00 AM",
                  "10:30 AM",
                  "12:00 PM",
                ].map(
                  (slot, index) => (
                    <div
                      key={slot}
                      className={`rounded-xl border px-2 py-2.5 text-center text-[11px] font-extrabold ${
                        index === 1
                          ? "border-[#087f69] bg-[#087f69] text-white"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {slot}
                    </div>
                  )
                )}

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                router.push(
                  "/doctors/doc-001"
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#102f29] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#087f69]"
            >
              View appointment details

              <ArrowRight size={16} />
            </button>

          </div>


          {/* FLOATING RATING */}

          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            className="absolute -bottom-5 -right-2 hidden rounded-2xl border border-white bg-white p-4 shadow-xl shadow-emerald-950/10 sm:block"
          >

            <div className="flex items-center gap-2">

              <div className="flex -space-x-2">

                {[
                  "https://randomuser.me/api/portraits/women/65.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/44.jpg",
                ].map(
                  (image) => (
                    <img
                      key={image}
                      src={image}
                      alt=""
                      className="size-8 rounded-full border-2 border-white object-cover"
                    />
                  )
                )}

              </div>

              <div>

                <div className="flex items-center gap-1 text-xs font-extrabold">
                  <Star
                    size={12}
                    fill="currentColor"
                    className="text-amber-400"
                  />

                  4.9 average
                </div>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  Demo doctor ratings
                </p>

              </div>

            </div>

          </motion.div>

        </motion.div>

      </div>


      {/* BOTTOM BRAND STRIP */}

      <div className="relative mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid gap-4 rounded-[28px] border border-emerald-100 bg-[#eaf7f2]/80 p-5 sm:grid-cols-3 sm:p-6">

          {[
            [
              Check,
              "Find the right specialist",
              "Search doctors by specialty and location.",
            ],
            [
              CalendarCheck,
              "Choose real availability",
              "See slots created directly by doctors.",
            ],
            [
              ShieldCheck,
              "Book with clarity",
              "Receive confirmation and appointment details.",
            ],
          ].map(
            ([Icon, title, description]) => {
              const Component =
                Icon as typeof Check;

              return (
                <div
                  key={String(title)}
                  className="flex gap-3 rounded-2xl px-2 py-2"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#087f69] shadow-sm">
                    <Component size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-[#173a33]">
                      {String(title)}
                    </p>

                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      {String(description)}
                    </p>
                  </div>
                </div>
              );
            }
          )}

        </div>

      </div>

    </section>
  );
}