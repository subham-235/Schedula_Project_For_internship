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
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

import type {
  Booking,
} from "@/types/booking";

import type {
  Doctor,
} from "@/types/doctor";

import type {
  DoctorSlot,
} from "@/types/availability";

import {
  getBookingsForDoctor,
  getCurrentUser,
  getDoctorSlots,
  getRegisteredDoctors,
  mergeDoctorProfiles,
  rescheduleBooking,
  type StoredUser,
} from "@/lib/client-storage";

import {
  doctors,
} from "@/lib/mock-data/doctors";

import StatusBadge from "@/components/appointments/StatusBadge";


type CalendarView =
  | "day"
  | "week"
  | "month";


function normalize(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}


function findDoctorProfile(
  user: StoredUser
):
  Doctor | undefined {

  const profiles =
    mergeDoctorProfiles(
      doctors,
      getRegisteredDoctors()
    );

  return (
    profiles.find(
      (doctor) =>
        doctor.id ===
        user.id
    ) ??
    profiles.find(
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


function dateKey(
  date: Date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}


function startOfWeek(
  value: Date
) {
  const result =
    new Date(value);

  const day =
    result.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() +
      difference
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}


function addDays(
  value: Date,
  amount: number
) {
  const date =
    new Date(value);

  date.setDate(
    date.getDate() +
      amount
  );

  return date;
}


function formatHeader(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday:
        "long",

      day:
        "numeric",

      month:
        "long",

      year:
        "numeric",
    }
  ).format(
    date
  );
}


function formatShortDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday:
        "short",

      day:
        "numeric",

      month:
        "short",
    }
  ).format(
    date
  );
}


function isDraggable(
  booking: Booking
) {
  return (
    booking.status ===
      "confirmed" &&
    new Date(
      booking.startsAt
    ).getTime() >
      Date.now()
  );
}


export default function DoctorCalendarPage() {
  const router =
    useRouter();

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
    slots,
    setSlots,
  ] =
    useState<
      DoctorSlot[]
    >([]);

  const [
    view,
    setView,
  ] =
    useState<CalendarView>(
      "week"
    );

  const [
    cursor,
    setCursor,
  ] =
    useState(
      new Date()
    );

  const [
    draggingBookingId,
    setDraggingBookingId,
  ] =
    useState<
      string | null
    >(null);

  const [
    message,
    setMessage,
  ] =
    useState("");


  const load =
    useCallback(() => {
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

      const doctor =
        findDoctorProfile(
          user
        );

      if (
        !doctor
      ) {
        router.replace(
          "/doctors"
        );

        return;
      }

      setProfile(
        doctor
      );

      setBookings(
        getBookingsForDoctor(
          doctor.id,
          doctor.name
        )
      );

      setSlots(
        getDoctorSlots(
          doctor.id
        )
      );

    }, [
      router,
    ]);


  useEffect(() => {
    load();
  }, [load]);


  const move =
    (
      direction:
        -1 | 1
    ) => {
      const next =
        new Date(
          cursor
        );

      if (
        view ===
        "day"
      ) {
        next.setDate(
          next.getDate() +
            direction
        );
      }

      if (
        view ===
        "week"
      ) {
        next.setDate(
          next.getDate() +
            direction *
              7
        );
      }

      if (
        view ===
        "month"
      ) {
        next.setMonth(
          next.getMonth() +
            direction
        );
      }

      setCursor(
        next
      );
    };


  const dropOnSlot =
    (
      slot:
        DoctorSlot
    ) => {
      if (
        !draggingBookingId
      ) {
        return;
      }

      if (
        slot.status !==
        "available"
      ) {
        setMessage(
          "This slot is unavailable."
        );

        return;
      }

      const updated =
        rescheduleBooking(
          draggingBookingId,
          slot.id
        );

      setDraggingBookingId(
        null
      );

      if (
        updated
      ) {
        setMessage(
          "Appointment rescheduled successfully. The patient was notified."
        );

        load();
      } else {
        setMessage(
          "Unable to reschedule. The slot may already be booked."
        );

        load();
      }

      setTimeout(
        () =>
          setMessage(
            ""
          ),
        3500
      );
    };


  const renderBooking =
    (
      booking:
        Booking
    ) => {
      const draggable =
        isDraggable(
          booking
        );

      return (
        <div
          key={
            booking.id
          }
          draggable={
            draggable
          }
          onDragStart={() =>
            draggable &&
            setDraggingBookingId(
              booking.id
            )
          }
          onDragEnd={() =>
            setDraggingBookingId(
              null
            )
          }
          className={`rounded-xl border p-3 ${
            draggable
              ? "cursor-grab border-emerald-200 bg-emerald-50/70 active:cursor-grabbing"
              : "border-stone-200 bg-stone-100"
          }`}
        >
          <div className="flex items-start justify-between gap-2">

            <div>
              <p className="text-sm font-semibold">
                {
                  booking.patientName
                }
              </p>

              <p className="mt-1 text-[11px] text-[var(--muted)]">
                {
                  booking.time
                }{" "}
                ·{" "}
                {
                  booking.appointmentType ??
                  "In-person"
                }
              </p>
            </div>

            <StatusBadge
              status={
                booking.status
              }
            />

          </div>

          {draggable && (
            <p className="mt-2 text-[10px] font-semibold text-[var(--brand)]">
              Drag to an available slot
            </p>
          )}

        </div>
      );
    };


  const renderSlot =
    (
      slot:
        DoctorSlot
    ) => (
      <div
        key={
          slot.id
        }
        onDragOver={(
          event
        ) => {
          if (
            slot.status ===
            "available"
          ) {
            event.preventDefault();
          }
        }}
        onDrop={() =>
          dropOnSlot(
            slot
          )
        }
        className={`rounded-xl border border-dashed p-3 text-xs font-semibold ${
          slot.status ===
          "available"
            ? "border-emerald-300 bg-white text-emerald-700"
            : "border-stone-200 bg-stone-100 text-stone-400"
        }`}
      >
        <div className="flex items-center gap-2">
          <Clock3
            size={
              13
            }
          />

          {
            slot.time
          }
        </div>

        <p className="mt-1 text-[10px] uppercase tracking-wide">
          {
            slot.status
          }
        </p>
      </div>
    );


  const weekDays =
    useMemo(() => {
      const start =
        startOfWeek(
          cursor
        );

      return Array.from(
        {
          length:
            7,
        },
        (
          _,
          index
        ) =>
          addDays(
            start,
            index
          )
      );
    }, [
      cursor,
    ]);


  const monthDays =
    useMemo(() => {
      const first =
        new Date(
          cursor.getFullYear(),
          cursor.getMonth(),
          1
        );

      const start =
        startOfWeek(
          first
        );

      return Array.from(
        {
          length:
            42,
        },
        (
          _,
          index
        ) =>
          addDays(
            start,
            index
          )
      );
    }, [
      cursor,
    ]);


  if (
    !profile
  ) {
    return (
      <main className="grid min-h-screen place-items-center">
        Loading calendar...
      </main>
    );
  }


  const cursorKey =
    dateKey(
      cursor
    );


  const dayBookings =
    bookings.filter(
      (booking) =>
        booking.date ===
        cursorKey
    );


  const daySlots =
    slots.filter(
      (slot) =>
        slot.date ===
        cursorKey
    );


  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-8 sm:px-8">

      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>

            <Link
              href="/doctor-dashboard"
              className="text-sm font-semibold text-[var(--brand)]"
            >
              ← Back to dashboard
            </Link>

            <p className="mt-6 text-sm font-semibold text-[var(--brand)]">
              Calendar
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Appointment Calendar
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Drag confirmed future appointments onto available slots to reschedule them.
            </p>

          </div>


          <div className="flex flex-wrap gap-2">

            {(
              [
                "day",
                "week",
                "month",
              ] as CalendarView[]
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
                    setView(
                      item
                    )
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold capitalize ${
                    view ===
                    item
                      ? "bg-[var(--brand)] text-white"
                      : "border border-[var(--line)] bg-white"
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


        {message && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {
              message
            }
          </div>
        )}


        <div className="mt-6 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white p-4">

          <button
            type="button"
            onClick={() =>
              move(
                -1
              )
            }
            className="grid size-10 place-items-center rounded-xl border border-[var(--line)]"
          >
            <ArrowLeft
              size={
                18
              }
            />
          </button>


          <div className="text-center">

            <p className="font-semibold">
              {view ===
              "month"
                ? new Intl.DateTimeFormat(
                    "en-IN",
                    {
                      month:
                        "long",
                      year:
                        "numeric",
                    }
                  ).format(
                    cursor
                  )
                : formatHeader(
                    cursor
                  )}
            </p>

            <button
              type="button"
              onClick={() =>
                setCursor(
                  new Date()
                )
              }
              className="mt-1 text-xs font-semibold text-[var(--brand)]"
            >
              Today
            </button>

          </div>


          <button
            type="button"
            onClick={() =>
              move(
                1
              )
            }
            className="grid size-10 place-items-center rounded-xl border border-[var(--line)]"
          >
            <ArrowRight
              size={
                18
              }
            />
          </button>

        </div>


        {view ===
          "day" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            <section className="rounded-2xl border border-[var(--line)] bg-white p-5">

              <h2 className="flex items-center gap-2 font-semibold">
                <CalendarDays
                  size={
                    18
                  }
                />

                Appointments
              </h2>

              <div className="mt-4 space-y-3">

                {dayBookings.length >
                0 ? (
                  dayBookings.map(
                    renderBooking
                  )
                ) : (
                  <p className="text-sm text-[var(--muted)]">
                    No appointments for this day.
                  </p>
                )}

              </div>

            </section>


            <section className="rounded-2xl border border-[var(--line)] bg-white p-5">

              <h2 className="font-semibold">
                Availability
              </h2>

              <p className="mt-1 text-xs text-[var(--muted)]">
                Drop a confirmed appointment onto a green available slot.
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">

                {daySlots.length >
                0 ? (
                  daySlots.map(
                    renderSlot
                  )
                ) : (
                  <p className="text-sm text-[var(--muted)]">
                    No availability configured.
                  </p>
                )}

              </div>

            </section>

          </div>
        )}


        {view ===
          "week" && (
          <div className="mt-6 grid gap-3 xl:grid-cols-7">

            {weekDays.map(
              (
                date
              ) => {
                const key =
                  dateKey(
                    date
                  );

                const appointmentsForDay =
                  bookings.filter(
                    (booking) =>
                      booking.date ===
                      key
                  );

                const slotsForDay =
                  slots.filter(
                    (slot) =>
                      slot.date ===
                      key
                  );

                return (
                  <section
                    key={
                      key
                    }
                    className="min-h-[320px] rounded-2xl border border-[var(--line)] bg-white p-3"
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setCursor(
                          date
                        );

                        setView(
                          "day"
                        );
                      }}
                      className="w-full text-left"
                    >
                      <p className="text-xs font-semibold text-[var(--brand)]">
                        {
                          formatShortDate(
                            date
                          )
                        }
                      </p>
                    </button>


                    <div className="mt-3 space-y-2">

                      {appointmentsForDay.map(
                        renderBooking
                      )}

                    </div>


                    <div className="mt-4 border-t border-[var(--line)] pt-3">

                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                        Available slots
                      </p>

                      <div className="mt-2 space-y-2">

                        {slotsForDay
                          .filter(
                            (slot) =>
                              slot.status ===
                              "available"
                          )
                          .map(
                            renderSlot
                          )}

                      </div>

                    </div>

                  </section>
                );
              }
            )}

          </div>
        )}


        {view ===
          "month" && (
          <div className="mt-6 grid grid-cols-7 overflow-hidden rounded-2xl border border-[var(--line)] bg-white">

            {[
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
              "Sun",
            ].map(
              (
                day
              ) => (
                <div
                  key={
                    day
                  }
                  className="border-b border-r border-[var(--line)] p-3 text-center text-xs font-semibold text-[var(--muted)]"
                >
                  {
                    day
                  }
                </div>
              )
            )}


            {monthDays.map(
              (
                date
              ) => {
                const key =
                  dateKey(
                    date
                  );

                const appointmentCount =
                  bookings.filter(
                    (booking) =>
                      booking.date ===
                      key
                  ).length;

                const availableCount =
                  slots.filter(
                    (slot) =>
                      slot.date ===
                        key &&
                      slot.status ===
                        "available"
                  ).length;

                const belongsToMonth =
                  date.getMonth() ===
                  cursor.getMonth();

                return (
                  <button
                    key={
                      key
                    }
                    type="button"
                    onClick={() => {
                      setCursor(
                        date
                      );

                      setView(
                        "day"
                      );
                    }}
                    className={`min-h-28 border-b border-r border-[var(--line)] p-2 text-left transition hover:bg-emerald-50/40 ${
                      belongsToMonth
                        ? "bg-white"
                        : "bg-stone-50 text-stone-400"
                    }`}
                  >

                    <span className="text-xs font-semibold">
                      {
                        date.getDate()
                      }
                    </span>

                    {appointmentCount >
                      0 && (
                      <p className="mt-3 rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                        {appointmentCount} appointment
                        {appointmentCount !==
                        1
                          ? "s"
                          : ""}
                      </p>
                    )}

                    {availableCount >
                      0 && (
                      <p className="mt-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                        {availableCount} available
                      </p>
                    )}

                  </button>
                );
              }
            )}

          </div>
        )}

      </div>

    </main>
  );
}