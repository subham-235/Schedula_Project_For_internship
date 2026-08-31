"use client";

import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  MapPin,
  Star,
} from "lucide-react";

import {
  doctors,
} from "@/lib/mock-data/doctors";

import {
  getRegisteredDoctors,
} from "@/lib/client-storage";

import type {
  Doctor,
} from "@/types/doctor";


export default function FeaturedDoctors() {
  const carouselRef =
    useRef<HTMLDivElement>(null);

  const [
    doctorList,
    setDoctorList,
  ] = useState<Doctor[]>(
    doctors.slice(0, 6)
  );


  // =========================================
  // LOAD STATIC + REGISTERED DOCTORS
  // =========================================

  useEffect(() => {
    const registeredDoctors =
      getRegisteredDoctors();

    const allDoctors = [
      ...doctors,
      ...registeredDoctors,
    ];

    setDoctorList(
      allDoctors.slice(0, 6)
    );
  }, []);


  // =========================================
  // CAROUSEL CONTROLS
  // =========================================

  const scrollCarousel = (
    direction: "left" | "right"
  ) => {
    carouselRef.current?.scrollBy({
      left:
        direction === "right"
          ? 390
          : -390,

      behavior: "smooth",
    });
  };


  return (
    <section
      className="
        overflow-hidden
        bg-[#f7fbf9]
        py-20
        sm:py-24
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* =================================
            HEADER
        ================================= */}

        <div
          className="
            flex
            flex-col
            justify-between
            gap-6
            sm:flex-row
            sm:items-end
          "
        >
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

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-200
                bg-emerald-50
                px-3
                py-1.5
              "
            >
              <span
                className="
                  size-1.5
                  rounded-full
                  bg-[#087f69]
                "
              />

              <span
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-[#087f69]
                "
              >
                Trusted specialists
              </span>
            </div>


            <h2
              className="
                mt-4
                max-w-3xl
                text-3xl
                font-extrabold
                tracking-[-0.045em]
                text-[#0d2f28]
                sm:text-4xl
                lg:text-5xl
              "
            >
              Doctors patients can
              count on.
            </h2>


            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                font-medium
                leading-7
                text-slate-500
                sm:text-base
              "
            >
              Compare experience,
              specialty, consultation
              fees and doctor-managed
              availability before
              booking your appointment.
            </p>

          </motion.div>


          {/* NAVIGATION */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <Link
              href="/doctors"
              className="
                group
                hidden
                items-center
                gap-2
                text-sm
                font-extrabold
                text-[#087f69]
                transition
                sm:inline-flex
              "
            >
              View all doctors

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>


            <button
              type="button"
              aria-label="Previous doctors"
              onClick={() =>
                scrollCarousel("left")
              }
              className="
                grid
                size-12
                place-items-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-[#163b33]
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#087f69]
                hover:bg-emerald-50
                hover:text-[#087f69]
              "
            >
              <ArrowLeft size={19} />
            </button>


            <button
              type="button"
              aria-label="Next doctors"
              onClick={() =>
                scrollCarousel("right")
              }
              className="
                grid
                size-12
                place-items-center
                rounded-full
                bg-[#102f29]
                text-white
                shadow-lg
                shadow-emerald-950/10
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#087f69]
              "
            >
              <ArrowRight size={19} />
            </button>

          </div>

        </div>


        {/* =================================
            CAROUSEL
        ================================= */}

        <div
          ref={carouselRef}
          className="
            mt-10
            flex
            snap-x
            snap-mandatory
            gap-5
            overflow-x-auto
            scroll-smooth
            pb-8
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          {doctorList.map(
            (doctor, index) => (
              <DoctorFeaturedCard
                key={doctor.id}
                doctor={doctor}
                index={index}
              />
            )
          )}

        </div>


        {/* MOBILE VIEW ALL */}

        <Link
          href="/doctors"
          className="
            mt-1
            inline-flex
            items-center
            gap-2
            text-sm
            font-extrabold
            text-[#087f69]
            sm:hidden
          "
        >
          View all doctors

          <ArrowRight size={16} />
        </Link>

      </div>
    </section>
  );
}



/* =========================================
   DOCTOR CARD
========================================= */

function DoctorFeaturedCard({
  doctor,
  index,
}: {
  doctor: Doctor;
  index: number;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 26,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.45,
        delay:
          index * 0.05,
      }}
      className="
        group
        min-w-[88%]
        snap-start
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/80
        bg-white
        shadow-[0_10px_40px_rgba(15,76,62,0.06)]
        transition-all
        duration-500
        hover:-translate-y-1.5
        hover:border-emerald-200
        hover:shadow-[0_25px_65px_rgba(15,76,62,0.12)]
        sm:min-w-[350px]
        lg:min-w-[365px]
      "
    >

      {/* =================================
          DOCTOR PHOTO
      ================================= */}

      <div
        className="
          relative
          h-[270px]
          overflow-hidden
          bg-[#eaf5f1]
        "
      >

        {doctor.image ? (
          <>

            {/* BLURRED BACKGROUND */}

            <img
              src={doctor.image}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                scale-110
                object-cover
                opacity-30
                blur-2xl
              "
            />


            {/* LIGHT OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-white/25
              "
            />


            {/* ACTUAL DOCTOR IMAGE */}

            <img
              src={doctor.image}
              alt={doctor.name}
              className="
                relative
                z-10
                h-full
                w-full
                object-contain
                object-center
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.025]
              "
            />

          </>
        ) : (

          /* FALLBACK */

          <div
            className="
              grid
              h-full
              w-full
              place-items-center
              bg-gradient-to-br
              from-emerald-50
              to-[#dff2ea]
            "
          >
            <span
              className="
                grid
                size-28
                place-items-center
                rounded-full
                border
                border-white
                bg-white
                text-3xl
                font-extrabold
                text-[#087f69]
                shadow-xl
              "
            >
              {doctor.initials}
            </span>
          </div>

        )}


        {/* BOTTOM GRADIENT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-20
            h-16
            bg-gradient-to-t
            from-black/15
            to-transparent
          "
        />


        {/* VERIFIED */}

        <div
          className="
            absolute
            left-4
            top-4
            z-30
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-white/70
            bg-white/90
            px-3
            py-1.5
            text-[10px]
            font-extrabold
            text-[#087f69]
            shadow-md
            backdrop-blur-xl
          "
        >
          <BadgeCheck size={13} />

          Verified profile
        </div>


        {/* RATING */}

        {doctor.reviews > 0 ? (

          <div
            className="
              absolute
              bottom-4
              right-4
              z-30
              flex
              items-center
              gap-1.5
              rounded-full
              bg-white/95
              px-3
              py-1.5
              text-xs
              font-extrabold
              text-[#143b32]
              shadow-md
              backdrop-blur-xl
            "
          >
            <Star
              size={13}
              fill="currentColor"
              className="text-amber-400"
            />

            {doctor.rating}
          </div>

        ) : (

          <div
            className="
              absolute
              bottom-4
              right-4
              z-30
              rounded-full
              bg-white/95
              px-3
              py-1.5
              text-[10px]
              font-extrabold
              text-[#087f69]
              shadow-md
            "
          >
            New on Schedula
          </div>

        )}

      </div>



      {/* =================================
          CONTENT
      ================================= */}

      <div className="p-5">

        {/* NAME */}

        <div>
          <h3
            className="
              truncate
              text-xl
              font-extrabold
              tracking-[-0.025em]
              text-[#102f29]
            "
          >
            {doctor.name}
          </h3>


          <p
            className="
              mt-1
              text-sm
              font-bold
              text-[#087f69]
            "
          >
            {doctor.specialty}
          </p>
        </div>


        {/* EXPERIENCE + FEE */}

        <div
          className="
            mt-5
            grid
            grid-cols-2
            gap-3
          "
        >

          <div
            className="
              rounded-2xl
              border
              border-slate-100
              bg-[#f7faf9]
              px-4
              py-3.5
            "
          >
            <p
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              Experience
            </p>

            <p
              className="
                mt-1.5
                text-sm
                font-extrabold
                text-[#173a32]
              "
            >
              {doctor.experience} years
            </p>
          </div>


          <div
            className="
              rounded-2xl
              border
              border-slate-100
              bg-[#f7faf9]
              px-4
              py-3.5
            "
          >
            <p
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              Consultation
            </p>

            <p
              className="
                mt-1.5
                text-sm
                font-extrabold
                text-[#173a32]
              "
            >
              ₹{doctor.fee}
            </p>
          </div>

        </div>


        {/* LOCATION */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              grid
              size-9
              shrink-0
              place-items-center
              rounded-xl
              bg-emerald-50
              text-[#087f69]
            "
          >
            <MapPin size={16} />
          </span>

          <p
            className="
              truncate
              text-xs
              font-semibold
              text-slate-500
            "
          >
            {doctor.location}
          </p>
        </div>


        {/* AVAILABILITY */}

        <div
          className="
            mt-3
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              grid
              size-9
              shrink-0
              place-items-center
              rounded-xl
              bg-emerald-50
              text-[#087f69]
            "
          >
            <Clock3 size={16} />
          </span>

          <p
            className="
              text-xs
              font-extrabold
              text-[#087f69]
            "
          >
            {doctor.availability}
          </p>
        </div>



        {/* =================================
            SLOTS
        ================================= */}

        {doctor.slots.length > 0 && (

          <div
            className="
              mt-5
              border-t
              border-slate-100
              pt-4
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <p
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.12em]
                  text-slate-400
                "
              >
                Next available
              </p>


              <p
                className="
                  text-[10px]
                  font-extrabold
                  text-[#087f69]
                "
              >
                {doctor.slots.length} slots
              </p>

            </div>


            <div
              className="
                mt-3
                grid
                grid-cols-3
                gap-2
              "
            >

              {doctor.slots
                .slice(0, 3)
                .map(
                  (slot) => (

                    <span
                      key={slot}
                      className="
                        rounded-xl
                        border
                        border-emerald-100
                        bg-emerald-50/60
                        px-2
                        py-2.5
                        text-center
                        text-[10px]
                        font-extrabold
                        text-[#087f69]
                      "
                    >
                      {slot}
                    </span>

                  )
                )}

            </div>

          </div>

        )}



        {/* =================================
            BUTTONS
        ================================= */}

        <div
          className="
            mt-5
            grid
            grid-cols-[.9fr_1.1fr]
            gap-2.5
          "
        >

          <Link
            href={`/doctors/${doctor.id}`}
            className="
              flex
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-3
              text-sm
              font-extrabold
              text-[#183b33]
              transition-all
              duration-300
              hover:border-[#087f69]
              hover:bg-emerald-50
              hover:text-[#087f69]
            "
          >
            View profile
          </Link>


          <Link
            href={`/booking/${doctor.id}`}
            className="
              group/button
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#087f69]
              px-3
              py-3
              text-sm
              font-extrabold
              text-white
              shadow-md
              shadow-emerald-950/10
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#066b59]
            "
          >

            <CalendarDays
              size={16}
            />

            Book now

            <ArrowRight
              size={14}
              className="
                transition-transform
                duration-300
                group-hover/button:translate-x-0.5
              "
            />

          </Link>

        </div>

      </div>

    </motion.article>
  );
}