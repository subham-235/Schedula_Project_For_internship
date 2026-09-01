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

import {
  CalendarDays,
  Clock3,
  ListChecks,
  UserRound,
} from "lucide-react";

import type {
  Booking,
} from "@/types/booking";

import type {
  Doctor,
} from "@/types/doctor";

import {
  clearCurrentUser,
  getBookingsForDoctor,
  getCurrentUser,
  getRegisteredDoctors,
  mergeDoctorProfiles,
  type StoredUser,
} from "@/lib/client-storage";

import {
  doctors,
} from "@/lib/mock-data/doctors";

import {
  formatAppointmentDate,
  formatAppointmentTime,
  isDashboardUpcoming,
} from "@/lib/appointment-utils";

import StatusBadge from "@/components/appointments/StatusBadge";


function normalize(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
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
      (
        doctorProfile:
          Doctor
      ) => {
        setLoading(
          true
        );

        setBookings(
          getBookingsForDoctor(
            doctorProfile.id,
            doctorProfile.name
          )
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
      doctorProfile
    );

  }, [
    router,
    loadDashboard,
  ]);


  useEffect(() => {
    if (
      !profile
    ) {
      return;
    }

    const handleFocus =
      () => {
        loadDashboard(
          profile
        );
      };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () =>
      window.removeEventListener(
        "focus",
        handleFocus
      );

  }, [
    profile,
    loadDashboard,
  ]);


  const upcoming =
    useMemo(
      () =>
        bookings
          .filter(
            isDashboardUpcoming
          )
          .sort(
            (a, b) =>
              new Date(
                a.startsAt
              ).getTime() -
              new Date(
                b.startsAt
              ).getTime()
          ),
      [bookings]
    );


  const pending =
    upcoming.filter(
      (booking) =>
        booking.status ===
        "pending"
    ).length;


  const confirmed =
    upcoming.filter(
      (booking) =>
        booking.status ===
        "confirmed"
    ).length;


  const today =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );


  const todayCount =
    upcoming.filter(
      (booking) =>
        booking.date ===
        today
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
    <main className="min-h-screen bg-[#f7faf8] px-4 py-6 sm:px-8 lg:px-12">

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
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
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
            Your dashboard only shows upcoming patient appointments.
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


          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-sm text-amber-700">
              Pending
            </p>

            <p className="mt-2 text-3xl font-semibold text-amber-900">
              {
                pending
              }
            </p>
          </div>


          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
            <p className="text-sm text-emerald-700">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-semibold text-emerald-900">
              {
                confirmed
              }
            </p>
          </div>


          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
            <p className="text-sm text-blue-700">
              Today
            </p>

            <p className="mt-2 text-3xl font-semibold text-blue-900">
              {
                todayCount
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
                  Pending and confirmed future visits only
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
                    6
                  )
                  .map(
                    (
                      booking
                    ) => (

                      <div
                        key={
                          booking.id
                        }
                        className="p-5"
                      >

                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                          <div className="flex gap-4">

                            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-[var(--brand)]">
                              <UserRound
                                size={
                                  20
                                }
                              />
                            </div>

                            <div>

                              <div className="flex flex-wrap items-center gap-2">

                                <p className="font-semibold">
                                  {
                                    booking.patientName
                                  }
                                </p>

                                <StatusBadge
                                  status={
                                    booking.status
                                  }
                                />

                              </div>


                              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">

                                <span className="inline-flex items-center gap-1.5">
                                  <CalendarDays
                                    size={
                                      14
                                    }
                                  />

                                  {
                                    formatAppointmentDate(
                                      booking.startsAt
                                    )
                                  }
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                  <Clock3
                                    size={
                                      14
                                    }
                                  />

                                  {
                                    formatAppointmentTime(
                                      booking.startsAt
                                    )
                                  }
                                </span>

                              </div>

                              <p className="mt-2 text-xs font-semibold text-[var(--brand)]">
                                {
                                  booking.appointmentType ??
                                  "In-person"
                                }
                              </p>

                            </div>

                          </div>


                          <div className="flex flex-wrap gap-2">

                            <Link
                              href="/doctor-dashboard/appointments"
                              className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]"
                            >
                              <UserRound
                                size={
                                  14
                                }
                              />

                              Patient details
                            </Link>


                            <Link
                              href="/doctor-dashboard/calendar"
                              className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]"
                            >
                              <CalendarDays
                                size={
                                  14
                                }
                              />

                              Calendar
                            </Link>


                            <Link
                              href="/doctor-dashboard/appointments"
                              className="rounded-xl bg-[var(--brand)] px-3 py-2 text-xs font-semibold text-white"
                            >
                              View details
                            </Link>

                          </div>

                        </div>

                      </div>

                    )
                  )}

              </div>

            ) : (

              <div className="p-12 text-center">

                <CalendarDays
                  size={28}
                  className="mx-auto text-stone-300"
                />

                <p className="mt-4 font-semibold">
                  No upcoming appointments
                </p>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  New patient booking requests will appear here.
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
                <p className="flex items-center gap-2 font-semibold">
                  <UserRound
                    size={
                      17
                    }
                  />

                  My Profile
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Update profile and availability
                </p>
              </Link>


              <Link
                href="/doctor-dashboard/calendar"
                className="block rounded-xl border border-[var(--line)] p-4 transition hover:border-[var(--brand)] hover:bg-emerald-50/40"
              >
                <p className="flex items-center gap-2 font-semibold">
                  <CalendarDays
                    size={
                      17
                    }
                  />

                  Calendar
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Day, week and month schedule
                </p>
              </Link>


              <Link
                href="/doctor-dashboard/appointments"
                className="block rounded-xl border border-[var(--line)] p-4 transition hover:border-[var(--brand)] hover:bg-emerald-50/40"
              >
                <p className="flex items-center gap-2 font-semibold">
                  <ListChecks
                    size={
                      17
                    }
                  />

                  All Appointments
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Manage appointment status and details
                </p>
              </Link>

            </div>

          </aside>

        </section>

      </div>

    </main>
  );
}