"use client";

import Link from "next/link";

import {
  useRef,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  HeartPulse,
  ScanFace,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

type SpecialtyItem = {
  name: string;
  description: string;
  doctors: string;
  icon: LucideIcon;
};

const items: SpecialtyItem[] = [
  {
    name: "General Medicine",
    description:
      "Everyday health, diagnosis and preventive care.",
    doctors: "Primary care",
    icon: Stethoscope,
  },
  {
    name: "Dermatology",
    description:
      "Expert care for your skin, hair and nails.",
    doctors: "Skin & hair",
    icon: ScanFace,
  },
  {
    name: "Cardiology",
    description:
      "Heart health, hypertension and cardiac care.",
    doctors: "Heart care",
    icon: HeartPulse,
  },
  {
    name: "Orthopedics",
    description:
      "Joint, bone and musculoskeletal treatment.",
    doctors: "Bones & joints",
    icon: Bone,
  },
  {
    name: "Pediatrics",
    description:
      "Thoughtful medical care for children.",
    doctors: "Child care",
    icon: Baby,
  },
  {
    name: "Neurology",
    description:
      "Care for brain, nerve and neurological concerns.",
    doctors: "Brain & nerves",
    icon: Brain,
  },
];

export default function SpecialtySection() {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const scroll = (
    direction:
      "left" | "right"
  ) => {
    containerRef.current?.scrollBy({
      left:
        direction === "right"
          ? 380
          : -380,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="specialties"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

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
            transition={{
              duration: 0.5,
            }}
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#087f69]">
              Care for every need
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-[-0.045em] text-[#0d2f28] sm:text-4xl lg:text-5xl">
              Explore care by specialty.
            </h2>

            <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-slate-500 sm:text-base">
              Start with what you need.
              Schedula helps you quickly narrow
              down the right medical specialists.
            </p>
          </motion.div>


          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                scroll("left")
              }
              className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#087f69] hover:bg-emerald-50 hover:text-[#087f69]"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() =>
                scroll("right")
              }
              className="grid size-11 place-items-center rounded-full bg-[#102f29] text-white transition hover:bg-[#087f69]"
            >
              <ArrowRight size={18} />
            </button>

          </div>

        </div>


        <div
          ref={containerRef}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >

          {items.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              return (
                <motion.div
                  key={item.name}
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
                  transition={{
                    delay:
                      index * 0.07,
                  }}
                  className="min-w-[82%] snap-start sm:min-w-[330px] lg:min-w-[350px]"
                >

                  <Link
                    href={`/doctors?specialty=${encodeURIComponent(
                      item.name
                    )}`}
                    className="group block h-full rounded-[28px] border border-slate-100 bg-[#f7fbf9] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-[0_22px_65px_rgba(16,84,68,0.10)]"
                  >

                    <div className="flex items-start justify-between">

                      <div className="grid size-14 place-items-center rounded-2xl bg-white text-[#087f69] shadow-sm transition duration-300 group-hover:bg-[#087f69] group-hover:text-white">
                        <Icon
                          size={24}
                          strokeWidth={1.8}
                        />
                      </div>

                      <ArrowRight
                        size={19}
                        className="text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:text-[#087f69]"
                      />

                    </div>


                    <p className="mt-7 text-lg font-extrabold tracking-[-0.02em] text-[#143930]">
                      {item.name}
                    </p>

                    <p className="mt-2 min-h-[48px] text-sm font-medium leading-6 text-slate-500">
                      {item.description}
                    </p>


                    <div className="mt-6 border-t border-slate-200/70 pt-4">
                      <span className="text-xs font-extrabold text-[#087f69]">
                        {item.doctors}
                      </span>
                    </div>

                  </Link>

                </motion.div>
              );
            }
          )}

        </div>

      </div>
    </section>
  );
}