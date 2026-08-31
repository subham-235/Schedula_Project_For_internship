import Link from "next/link";

import type {
  Doctor,
} from "@/types/doctor";

export default function DoctorCard({
  doctor,
}: {
  doctor: Doctor;
}) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[1.7rem]
        border
        border-[var(--line)]
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--brand)]
        hover:shadow-xl
        hover:shadow-emerald-950/5
      "
    >

      {/* DOCTOR INFORMATION */}

      <div className="p-5">

        <div className="flex items-start gap-4">

          {/* PHOTO */}

          <div
            className="
              size-20
              shrink-0
              overflow-hidden
              rounded-2xl
              border
              border-emerald-100
              bg-[var(--brand-soft)]
            "
          >

            {doctor.image ? (

              <img
                src={doctor.image}
                alt={doctor.name}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />

            ) : (

              <div className="grid h-full w-full place-items-center text-lg font-semibold text-[var(--brand)]">

                {doctor.initials}

              </div>

            )}

          </div>


          {/* NAME + SPECIALITY */}

          <div className="min-w-0 flex-1">

            <div className="flex items-start justify-between gap-3">

              <div>

                <h3 className="text-lg font-semibold tracking-tight">

                  {doctor.name}

                </h3>

                <p className="mt-1 text-sm font-medium text-[var(--brand)]">

                  {doctor.specialty}

                </p>

              </div>


              {/* RATING */}

              {doctor.reviews > 0 && (

                <span className="shrink-0 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">

                  ★ {doctor.rating}

                </span>

              )}

            </div>


            {/* REVIEWS */}

            {doctor.reviews > 0 ? (

              <p className="mt-2 text-xs text-[var(--muted)]">

                {doctor.reviews} patient reviews

              </p>

            ) : (

              <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">

                New on Schedula

              </span>

            )}

          </div>

        </div>


        {/* DETAILS */}

        <div className="mt-6 grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-[#f7faf8] p-3">

            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">

              Experience

            </p>

            <p className="mt-1 text-sm font-semibold">

              {doctor.experience} years

            </p>

          </div>


          <div className="rounded-xl bg-[#f7faf8] p-3">

            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">

              Consultation

            </p>

            <p className="mt-1 text-sm font-semibold">

              ₹{doctor.fee}

            </p>

          </div>

        </div>


        {/* LOCATION */}

        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)]">

          <span className="text-[var(--brand)]">
            ●
          </span>

          <span className="truncate">

            {doctor.location}

          </span>

        </div>


        {/* AVAILABILITY */}

        <div className="mt-4">

          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

            <span className="size-2 rounded-full bg-emerald-500" />

            {doctor.availability}

          </span>

        </div>


        {/* SLOTS */}

        {doctor.slots.length > 0 && (

          <div className="mt-5">

            <p className="text-xs font-semibold">
              Available slots
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              {doctor.slots
                .slice(0, 3)
                .map((slot) => (

                  <span
                    key={slot}
                    className="
                      rounded-lg
                      border
                      border-emerald-100
                      bg-emerald-50/60
                      px-2.5
                      py-1.5
                      text-[11px]
                      font-semibold
                      text-emerald-800
                    "
                  >

                    {slot}

                  </span>

                ))}

            </div>

          </div>

        )}

      </div>


      {/* BUTTONS */}

      <div className="border-t border-[var(--line)] bg-[#fbfdfc] p-4">

        <div className="grid grid-cols-2 gap-3">

          <Link
            href={`/doctors/${doctor.id}`}
            className="
              rounded-xl
              border
              border-[var(--line)]
              bg-white
              px-4
              py-3
              text-center
              text-sm
              font-semibold
              transition
              hover:border-[var(--brand)]
              hover:text-[var(--brand)]
            "
          >

            View profile

          </Link>


          <Link
            href={`/booking/${doctor.id}`}
            className="
              rounded-xl
              bg-[var(--brand)]
              px-4
              py-3
              text-center
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[var(--brand-deep)]
            "
          >

            Book appointment

          </Link>

        </div>

      </div>

    </article>
  );
}