"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Appointment,
} from "@/types/appointment";

import type {
  Booking,
} from "@/types/booking";

import type {
  Doctor,
} from "@/types/doctor";

import {
  clearCurrentUser,
  getBookings,
  getCurrentUser,
  getRegisteredDoctors,
  mergeDoctorProfiles,
  type StoredUser,
} from "@/lib/client-storage";

import {
  doctors,
} from "@/lib/mock-data/doctors";


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
  name: string
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]
          ?.toUpperCase()
    )
    .join("");
}


function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day:
        "numeric",
      month:
        "short",
      year:
        "numeric",
    }
  ).format(
    new Date(value)
  );
}


function formatTime(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour:
        "numeric",
      minute:
        "2-digit",
    }
  ).format(
    new Date(value)
  );
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


function findDoctorProfile(
  user: StoredUser
): Doctor | undefined {

  const allDoctors =
    mergeDoctorProfiles(
      doctors,
      getRegisteredDoctors()
    );

  return (
    allDoctors.find(
      (doctor) =>
        doctor.userId ===
        user.id
    ) ??
    allDoctors.find(
      (doctor) =>
        doctor.id ===
        user.id
    ) ??
    allDoctors.find(
      (doctor) =>
        normalize(
          doctor.name
        ) ===
        normalize(
          user.name
        )
    )
  );
}


export default function DoctorDashboardPage() {
  const router =
    useRouter();

  const [
    user,
    setUser,
  ] =
    useState<
      StoredUser | null
    >(null);

  const [
    profile,
    setProfile,
  ] =
    useState<
      Doctor | null
    >(null);

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
    loading,
    setLoading,
  ] =
    useState(
      true
    );


  const loadDashboard =
    useCallback(
      async (
        doctorUser:
          StoredUser,
        doctorProfile:
          Doctor
      ) => {

        setLoading(
          true
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
                      doctorProfile.name
                    ) ||
                  normalize(
                    appointment.clinician
                  ) ===
                    normalize(
                      doctorUser.name
                    )
              );
          }

        } catch {
          apiAppointments =
            [];
        }


        const doctorBookings =
          getBookings().filter(
            (booking) =>
              booking.doctorId ===
                doctorProfile.id ||
              normalize(
                booking.doctorName
              ) ===
                normalize(
                  doctorProfile.name
                )
          );


        setBookings(
          doctorBookings
        );


        const localAppointments =
          doctorBookings.map(
            bookingToAppointment
          );


        const combined = [
          ...localAppointments,
          ...apiAppointments,
        ];


        const seen =
          new Set<string>();


        const unique =
          combined
            .filter(
              (
                appointment
              ) => {
                if (
                  seen.has(
                    appointment.id
                  )
                ) {
                  return false;
                }

                seen.add(
                  appointment.id
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
                  a.startsAt
                ).getTime() -
                new Date(
                  b.startsAt
                ).getTime()
            );


        setAppointments(
          unique
        );

        setLoading(
          false
        );
      },
      []
    );


  useEffect(() => {
    const currentUser =
      getCurrentUser();

    if (
      !currentUser
    ) {
      router.replace(
        "/login"
      );

      return;
    }

    if (
      currentUser.role !==
      "doctor"
    ) {
      router.replace(
        "/doctors"
      );

      return;
    }

    const doctorProfile =
      findDoctorProfile(
        currentUser
      );

    if (
      !doctorProfile
    ) {
      router.replace(
        "/doctors"
      );

      return;
    }

    setUser(
      currentUser
    );

    setProfile(
      doctorProfile
    );

    loadDashboard(
      currentUser,
      doctorProfile
    );

  }, [
    router,
    loadDashboard,
  ]);


  const upcoming =
    useMemo(
      () =>
        appointments.filter(
          (
            appointment
          ) =>
            appointment.status !==
              "cancelled" &&
            new Date(
              appointment.startsAt
            ).getTime() >
              Date.now()
        ),
      [appointments]
    );


  const confirmed =
    appointments.filter(
      (item) =>
        item.status ===
        "confirmed"
    ).length;


  const pending =
    appointments.filter(
      (item) =>
        item.status ===
        "pending"
    ).length;


  const logout =
    () => {
      clearCurrentUser();

      router.push(
        "/login"
      );
    };


  if (
    !user ||
    !profile
  ) {
    return (
      <main className="grid min-h-screen place-items-center">
        <p className="text-sm text-[var(--muted)]">
          Loading doctor dashboard...
        </p>
      </main>
    );
  }


  return (
    <main className="min-h-screen px-4 py-6 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        <header className="flex flex-col gap-5 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-center sm:justify-between">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="grid size-11 place-items-center rounded-xl bg-[var(--brand)] text-xl font-semibold text-white">
              S
            </div>

            <div>
              <p className="text-lg font-semibold">
                Schedula
              </p>

              <p className="text-sm text-[var(--muted)]">
                Doctor Portal
              </p>
            </div>

          </Link>


          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold">
                {
                  profile.name
                }
              </p>

              <p className="text-xs text-[var(--muted)]">
                {
                  profile.specialty
                }
              </p>

            </div>

            <div className="grid size-10 place-items-center rounded-full bg-emerald-100 text-sm font-semibold text-[var(--brand)]">
              {
                profile.initials
              }
            </div>

            <button
              type="button"
              onClick={
                logout
              }
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Logout
            </button>

          </div>

        </header>


        <section className="py-9">

          <p className="text-sm font-semibold text-[var(--brand)]">
            Doctor Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back,{" "}
            {
              profile.name
            }
          </h1>

          <p className="mt-2 text-[var(--muted)]">
            Here&apos;s an overview of your
            appointments and practice.
          </p>

        </section>


        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <p className="text-sm text-[var(--muted)]">
              Upcoming
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {
                upcoming.length
              }
            </p>
          </div>


          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <p className="text-sm text-emerald-700">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-semibold text-emerald-900">
              {
                confirmed
              }
            </p>
          </div>


          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <p className="text-sm text-amber-700">
              Pending
            </p>

            <p className="mt-2 text-3xl font-semibold text-amber-900">
              {
                pending
              }
            </p>
          </div>


          <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <p className="text-sm text-[var(--muted)]">
              Total appointments
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {
                appointments.length
              }
            </p>
          </div>

        </section>


        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">

          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">

            <div className="flex items-center justify-between border-b border-[var(--line)] p-5">

              <div>
                <h2 className="font-semibold">
                  Upcoming appointments
                </h2>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Your next scheduled patient visits
                </p>
              </div>

              <Link
                href="/doctor-dashboard/appointments"
                className="text-sm font-semibold text-[var(--brand)]"
              >
                View all
              </Link>

            </div>


            {loading ? (

              <div className="p-8 text-sm text-[var(--muted)]">
                Loading appointments...
              </div>

            ) : upcoming.length >
              0 ? (

              <div className="divide-y divide-[var(--line)]">

                {upcoming
                  .slice(
                    0,
                    5
                  )
                  .map(
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
                          className="grid gap-4 p-5 sm:grid-cols-[8rem_1fr_auto]"
                        >

                          <div>

                            <p className="text-xs text-[var(--muted)]">
                              {
                                formatDate(
                                  appointment.startsAt
                                )
                              }
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {
                                formatTime(
                                  appointment.startsAt
                                )
                              }
                            </p>

                          </div>


                          <div>

                            <p className="font-semibold">
                              {
                                appointment.patient.name
                              }
                            </p>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                              {
                                appointment.reason
                              }
                            </p>

                            {booking?.attachment && (
                              <p className="mt-2 text-xs font-semibold text-[var(--brand)]">
                                📎 Medical document attached
                              </p>
                            )}

                          </div>


                          <span
                            className={`h-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              appointment.status ===
                              "confirmed"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {
                              appointment.status
                            }
                          </span>

                        </div>
                      );
                    }
                  )}

              </div>

            ) : (

              <div className="p-10 text-center">

                <p className="font-semibold">
                  No upcoming appointments
                </p>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  New patient bookings will appear here.
                </p>

              </div>

            )}

          </div>


          <aside className="h-fit rounded-2xl border border-[var(--line)] bg-white p-5">

            <h2 className="font-semibold">
              Quick Actions
            </h2>

            <div className="mt-4 space-y-3">

              <Link
                href="/doctor-dashboard/profile"
                className="block rounded-xl border border-[var(--line)] p-4 transition hover:border-[var(--brand)] hover:bg-emerald-50/40"
              >
                <p className="font-semibold">
                  👤 My Profile
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Update details and manage availability
                </p>
              </Link>


              <Link
                href="/doctor-dashboard/appointments"
                className="block rounded-xl border border-[var(--line)] p-4 transition hover:border-[var(--brand)] hover:bg-emerald-50/40"
              >
                <p className="font-semibold">
                  📅 View All Appointments
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Review patient bookings and status
                </p>
              </Link>

            </div>

          </aside>

        </section>

      </div>

    </main>
  );
}