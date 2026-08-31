"use client";

import {
  motion,
} from "framer-motion";

import {
  ArrowDown,
  CalendarCheck,
  CheckCircle2,
  Search,
  UserRoundSearch,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find your doctor",
    description:
      "Search by specialty, location or doctor name and compare the right options.",
    icon: UserRoundSearch,
  },
  {
    number: "02",
    title: "Choose availability",
    description:
      "Pick from appointment slots published directly by the doctor.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Confirm your visit",
    description:
      "Add patient information, attach a medical document and confirm your booking.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#102f29] py-20 text-white sm:py-24"
    >

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >

            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-300">
              Simple from start to finish
            </p>

            <h2 className="mt-4 max-w-lg text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
              Booking healthcare shouldn&apos;t
              feel complicated.
            </h2>

            <p className="mt-5 max-w-md text-sm font-medium leading-7 text-emerald-50/65 sm:text-base">
              Schedula connects doctor-controlled
              availability directly with the patient
              booking experience.
            </p>


            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">

              <div className="grid size-10 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                <Search size={18} />
              </div>

              <div>
                <p className="text-xs font-extrabold">
                  One continuous experience
                </p>

                <p className="mt-1 text-[11px] font-medium text-emerald-50/50">
                  Discover → Select → Book → Confirm
                </p>
              </div>

            </div>

          </motion.div>


          <div className="relative">

            <div className="absolute left-[27px] top-10 hidden h-[calc(100%-80px)] w-px bg-gradient-to-b from-emerald-400 via-emerald-400/40 to-transparent sm:block" />


            <div className="space-y-4">

              {steps.map(
                (
                  step,
                  index
                ) => {
                  const Icon =
                    step.icon;

                  return (
                    <motion.div
                      key={step.number}
                      initial={{
                        opacity: 0,
                        x: 28,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay:
                          index * 0.12,
                      }}
                      className="relative grid gap-5 rounded-[26px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl sm:grid-cols-[58px_1fr] sm:p-6"
                    >

                      <div className="relative z-10 grid size-14 place-items-center rounded-2xl border border-emerald-300/20 bg-[#173d34] text-emerald-300">
                        <Icon size={22} />
                      </div>


                      <div>

                        <div className="flex items-center gap-3">

                          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                            Step {step.number}
                          </span>

                        </div>

                        <h3 className="mt-2 text-xl font-extrabold">
                          {step.title}
                        </h3>

                        <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-emerald-50/60">
                          {step.description}
                        </p>

                      </div>


                      {index <
                        steps.length -
                          1 && (
                        <ArrowDown
                          size={17}
                          className="absolute -bottom-3 left-[20px] z-20 hidden rounded-full bg-[#102f29] text-emerald-300 sm:block"
                        />
                      )}

                    </motion.div>
                  );
                }
              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}