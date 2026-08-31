"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Appointment,
  AppointmentStatus,
} from "@/types/appointment";

import type {
  Booking,
} from "@/types/booking";

import type {
  Doctor,
} from "@/types/doctor";

import {
  getBookings,
  getCurrentUser,
  getRegisteredDoctors,
  mergeDoctorProfiles,
} from "@/lib/client-storage";

import {
  doctors,
} from "@/lib/mock-data/doctors";


type Filter =
  | "all"
  | AppointmentStatus;

type ApiResponse = {
  data:
    Appointment[];
};


function normalize(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}


function initials(
  value: string
) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(
      0,
      2
    )
    .map(
      (item) =>
        item[0]
          ?.toUpperCase()
    )
    .join("");
}


function bookingToAppointment(
  booking: Booking
): Appointment {
  return {
    id:
      booking.id,

    patient: {
      name:
        booking.patientName,

      initials:
        initials(
          booking.patientName
        ),

      age:
        booking.patientAge,
    },

    clinician:
      booking.doctorName,

    specialty:
      booking.specialty,

    startsAt:
      booking.startsAt,

    durationMinutes:
      30,

    status:
      booking.status,

    reason:
      booking.reason,

    room:
      booking.doctorLocation ??
      "Clinic booking",
  };
}


function dataUrlToBlob(
  dataUrl: string
) {
  const [
    header,
    encoded,
  ] =
    dataUrl.split(",");

  const mime =
    header.match(
      /data:(.*?);base64/
    )?.[1] ??
    "application/octet-stream";

  const binary =
    atob(
      encoded
    );

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let i = 0;
    i < binary.length;
    i++
  ) {
    bytes[i] =
      binary.charCodeAt(
        i
      );
  }

  return new Blob(
    [
      bytes,
    ],
    {
      type:
        mime,
    }
  );
}


export default function AllAppointmentsPage() {
  const router =
    useRouter();

  const [
    appointments,
    setAppointments,
  ] =
    useState<
      Appointment[]
    >([]);

  const [
    bookings,
    setBookings,
  ] =
    useState<
      Booking[]
    >([]);

  const [
    filter,
    setFilter,
  ] =
    useState<Filter>(
      "all"
    );

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );


  useEffect(() => {

    const load =
      async () => {

        const user =
          getCurrentUser();

        if (
          !user ||
          user.role !==
            "doctor"
        ) {
          router.replace(
            "/login"
          );

          return;
        }


        const profiles =
          mergeDoctorProfiles(
            doctors,
            getRegisteredDoctors()
          );


        const profile:
          Doctor | undefined =
            profiles.find(
              (
                item
              ) =>
                item.userId ===
                user.id
            ) ??
            profiles.find(
              (
                item
              ) =>
                item.id ===
                user.id
            ) ??
            profiles.find(
              (
                item
              ) =>
                normalize(
                  item.name
                ) ===
                normalize(
                  user.name
                )
            );


        if (
          !profile
        ) {
          return;
        }


        const storedBookings =
          getBookings().filter(
            (
              booking
            ) =>
              booking.doctorId ===
                profile.id ||
              normalize(
                booking.doctorName
              ) ===
                normalize(
                  profile.name
                )
          );


        setBookings(
          storedBookings
        );


        let apiAppointments:
          Appointment[] =
            [];


        try {
          const response =
            await fetch(
              "/api/appointments",
              {
                cache:
                  "no-store",
              }
            );

          if (
            response.ok
          ) {
            const result =
              await response.json() as ApiResponse;

            apiAppointments =
              result.data.filter(
                (
                  appointment
                ) =>
                  normalize(
                    appointment.clinician
                  ) ===
                    normalize(
                      profile.name
                    ) ||
                  normalize(
                    appointment.clinician
                  ) ===
                    normalize(
                      user.name
                    )
              );
          }

        } catch {
          apiAppointments =
            [];
        }


        const merged = [
          ...storedBookings.map(
            bookingToAppointment
          ),
          ...apiAppointments,
        ];


        const seen =
          new Set<string>();


        setAppointments(
          merged
            .filter(
              (
                item
              ) => {
                if (
                  seen.has(
                    item.id
                  )
                ) {
                  return false;
                }

                seen.add(
                  item.id
                );

                return true;
              }
            )
            .sort(
              (
                a,
                b
              ) =>
                new Date(
                  b.startsAt
                ).getTime() -
                new Date(
                  a.startsAt
                ).getTime()
            )
        );


        setLoading(
          false
        );
      };


    load();

  }, [
    router,
  ]);


  const visible =
    useMemo(
      () =>
        appointments.filter(
          (
            appointment
          ) => {

            const matchesStatus =
              filter ===
                "all" ||
              appointment.status ===
                filter;


            const normalized =
              query
                .trim()
                .toLowerCase();


            const matchesSearch =
              !normalized ||
              appointment.patient.name
                .toLowerCase()
                .includes(
                  normalized
                ) ||
              appointment.reason
                .toLowerCase()
                .includes(
                  normalized
                );


            return (
              matchesStatus &&
              matchesSearch
            );
          }
        ),
      [
        appointments,
        filter,
        query,
      ]
    );


  const openAttachment =
    (
      booking:
        Booking
    ) => {

      if (
        !booking.attachment
      ) {
        return;
      }


      const blob =
        dataUrlToBlob(
          booking.attachment.dataUrl
        );


      const url =
        URL.createObjectURL(
          blob
        );


      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );


      setTimeout(
        () =>
          URL.revokeObjectURL(
            url
          ),
        60000
      );
    };


  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">

      <div className="mx-auto max-w-7xl">

        <Link
          href="/doctor-dashboard"
          className="text-sm font-semibold text-[var(--brand)]"
        >
          ← Back to dashboard
        </Link>


        <div className="mt-6">

          <p className="text-sm font-semibold text-[var(--brand)]">
            Appointments
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            All Appointments
          </h1>

        </div>


        <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-white p-4 sm:flex-row">

          <input
            value={
              query
            }
            onChange={(
              event
            ) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Search patient or reason..."
            className="flex-1 rounded-xl border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
          />


          <div className="flex flex-wrap gap-2">

            {(
              [
                "all",
                "pending",
                "confirmed",
                "cancelled",
              ] as Filter[]
            ).map(
              (
                item
              ) => (

                <button
                  key={
                    item
                  }
                  type="button"
                  onClick={() =>
                    setFilter(
                      item
                    )
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${
                    filter ===
                    item
                      ? "bg-[var(--brand)] text-white"
                      : "bg-stone-100"
                  }`}
                >
                  {
                    item
                  }
                </button>

              )
            )}

          </div>

        </div>


        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-white">

          {loading ? (

            <div className="p-10 text-center text-sm text-[var(--muted)]">
              Loading appointments...
            </div>

          ) : visible.length >
            0 ? (

            <div className="divide-y divide-[var(--line)]">

              {visible.map(
                (
                  appointment
                ) => {

                  const booking =
                    bookings.find(
                      (
                        item
                      ) =>
                        item.id ===
                        appointment.id
                    );


                  return (
                    <div
                      key={
                        appointment.id
                      }
                      className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_1fr_auto]"
                    >

                      <div>

                        <p className="font-semibold">
                          {
                            appointment.patient.name
                          }
                        </p>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {
                            appointment.patient.age
                          }{" "}
                          years ·{" "}
                          {
                            appointment.reason
                          }
                        </p>

                      </div>


                      <div>

                        <p className="text-xs text-[var(--muted)]">
                          Appointment
                        </p>

                        <p className="mt-1 text-sm font-semibold">

                          {new Intl.DateTimeFormat(
                            "en-IN",
                            {
                              dateStyle:
                                "medium",
                            }
                          ).format(
                            new Date(
                              appointment.startsAt
                            )
                          )}

                        </p>

                        <p className="mt-1 text-xs text-[var(--muted)]">

                          {new Intl.DateTimeFormat(
                            "en-IN",
                            {
                              timeStyle:
                                "short",
                            }
                          ).format(
                            new Date(
                              appointment.startsAt
                            )
                          )}

                        </p>

                      </div>


                      <div>

                        {booking && (
                          <>
                            <p className="text-xs text-[var(--muted)]">
                              Contact
                            </p>

                            <p className="mt-1 break-all text-sm">
                              {
                                booking.patientEmail
                              }
                            </p>

                            <p className="mt-1 text-sm">
                              {
                                booking.patientPhone
                              }
                            </p>
                          </>
                        )}

                      </div>


                      <div className="flex flex-col items-start gap-2">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            appointment.status ===
                            "confirmed"
                              ? "bg-emerald-50 text-emerald-700"
                              : appointment.status ===
                                "pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {
                            appointment.status
                          }
                        </span>


                        {booking?.attachment && (

                          <button
                            type="button"
                            onClick={() =>
                              openAttachment(
                                booking
                              )
                            }
                            className="text-xs font-semibold text-[var(--brand)]"
                          >
                            📎 View document
                          </button>

                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <div className="p-12 text-center">

              <p className="font-semibold">
                No appointments found
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Try changing your search or filter.
              </p>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}