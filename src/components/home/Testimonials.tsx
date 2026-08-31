"use client";

import {
  useRef,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Quote,
  Star,
} from "lucide-react";

const testimonials = [
  {
    quote:
      "The booking flow feels clear from the first search to final confirmation.",
    name:
      "Patient experience",
    location:
      "Kolkata",
    initials:
      "PE",
  },
  {
    quote:
      "Seeing actual doctor-created availability makes the appointment flow much easier to understand.",
    name:
      "Patient demo",
    location:
      "West Bengal",
    initials:
      "PD",
  },
  {
    quote:
      "The doctor portal brings profile, appointments and recurring availability into one place.",
    name:
      "Doctor experience",
    location:
      "Schedula demo",
    initials:
      "DE",
  },
  {
    quote:
      "Uploading a medical document while booking adds useful context before the consultation.",
    name:
      "Booking experience",
    location:
      "Patient portal",
    initials:
      "BE",
  },
];

export default function Testimonials() {
  const ref =
    useRef<HTMLDivElement>(null);

  const scroll = (
    direction:
      "left" | "right"
  ) => {
    ref.current?.scrollBy({
      left:
        direction === "right"
          ? 410
          : -410,
      behavior:
        "smooth",
    });
  };

  return (
    <section className="bg-[#f7fbf9] py-20 sm:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#087f69]">
              Designed around real journeys
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#0d2f28] sm:text-4xl">
              A healthcare experience that feels simple.
            </h2>

          </div>


          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                scroll(
                  "left"
                )
              }
              className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() =>
                scroll(
                  "right"
                )
              }
              className="grid size-11 place-items-center rounded-full bg-[#102f29] text-white"
            >
              <ArrowRight size={18} />
            </button>

          </div>

        </div>


        <div
          ref={ref}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >

          {testimonials.map(
            (
              item,
              index
            ) => (

              <motion.article
                key={item.quote}
                initial={{
                  opacity: 0,
                  y: 22,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay:
                    index * 0.06,
                }}
                className="min-w-[88%] snap-start rounded-[28px] border border-white bg-white p-6 shadow-[0_15px_55px_rgba(17,79,65,0.07)] sm:min-w-[380px]"
              >

                <div className="flex items-center justify-between">

                  <div className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-[#087f69]">
                    <Quote size={18} />
                  </div>

                  <div className="flex gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={13}
                          fill="currentColor"
                        />
                      )
                    )}
                  </div>

                </div>


                <p className="mt-6 min-h-[96px] text-base font-bold leading-7 text-[#183d35]">
                  “{item.quote}”
                </p>


                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">

                  <div className="grid size-10 place-items-center rounded-full bg-[#102f29] text-xs font-extrabold text-white">
                    {item.initials}
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-[#183d35]">
                      {item.name}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                      {item.location}
                    </p>
                  </div>

                </div>

              </motion.article>

            )
          )}

        </div>

      </div>

    </section>
  );
}