"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Link from "next/link";

import Navbar from "@/components/layout/Navbar";

import BookingSummary from "@/components/booking/BookingSummary";

import {
  doctors,
} from "@/lib/mock-data/doctors";

import {
  ensureDoctorSlotsSeeded,
  getAvailableSlotsForDoctor,
  getRegisteredDoctors,
  mergeDoctorProfiles,
  saveBookingWithSlot,
  saveLatestBookingId,
} from "@/lib/client-storage";

import type {
  Booking,
  BookingAttachment,
} from "@/types/booking";

import type {
  Doctor,
} from "@/types/doctor";

import type {
  DoctorSlot,
} from "@/types/availability";


const MAX_FILE_SIZE =
  1024 *
  1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];


function to24Hour(
  time: string
) {
  const [
    clock,
    period,
  ] =
    time.split(" ");

  let [
    hours,
    minutes,
  ] =
    clock
      .split(":")
      .map(Number);

  if (
    period ===
      "PM" &&
    hours !== 12
  ) {
    hours +=
      12;
  }

  if (
    period ===
      "AM" &&
    hours === 12
  ) {
    hours =
      0;
  }

  return `${String(
    hours
  ).padStart(
    2,
    "0"
  )}:${String(
    minutes
  ).padStart(
    2,
    "0"
  )}:00`;
}


function formatFileSize(
  bytes: number
) {
  return `${(
    bytes /
    1024
  ).toFixed(
    1
  )} KB`;
}


export default function BookingPage() {
  const params =
    useParams<{
      doctorId:
        string;
    }>();

  const router =
    useRouter();

  const [
    doctor,
    setDoctor,
  ] =
    useState<
      Doctor | null
    >(null);

  const [
    availableSlots,
    setAvailableSlots,
  ] =
    useState<
      DoctorSlot[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );


  const [
    date,
    setDate,
  ] =
    useState("");

  const [
    time,
    setTime,
  ] =
    useState("");

  const [
    selectedSlotId,
    setSelectedSlotId,
  ] =
    useState("");


  const [
    patientName,
    setPatientName,
  ] =
    useState("");

  const [
    patientEmail,
    setPatientEmail,
  ] =
    useState("");

  const [
    patientPhone,
    setPatientPhone,
  ] =
    useState("");

  const [
    patientAge,
    setPatientAge,
  ] =
    useState("");

  const [
    reason,
    setReason,
  ] =
    useState("");

  const [
    attachment,
    setAttachment,
  ] =
    useState<
      BookingAttachment | undefined
    >(undefined);

  const [
    fileLoading,
    setFileLoading,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState("");


  useEffect(() => {

    const profiles =
      mergeDoctorProfiles(
        doctors,
        getRegisteredDoctors()
      );


    const found =
      profiles.find(
        (
          item
        ) =>
          item.id ===
          params.doctorId
      );


    if (
      !found
    ) {
      setLoading(
        false
      );

      return;
    }


    ensureDoctorSlotsSeeded(
      found.id,
      found.slots
    );


    const slots =
      getAvailableSlotsForDoctor(
        found.id
      );


    setDoctor(
      found
    );

    setAvailableSlots(
      slots
    );


    if (
      slots.length >
      0
    ) {
      setDate(
        slots[0].date
      );
    }


    setLoading(
      false
    );

  }, [
    params.doctorId,
  ]);


  const availableDates =
    useMemo(
      () =>
        Array.from(
          new Set(
            availableSlots.map(
              (
                slot
              ) =>
                slot.date
            )
          )
        ).sort(),
      [
        availableSlots,
      ]
    );


  const slotsForDate =
    useMemo(
      () =>
        availableSlots.filter(
          (
            slot
          ) =>
            slot.date ===
            date
        ),
      [
        availableSlots,
        date,
      ]
    );


  const chooseDate =
    (
      value:
        string
    ) => {
      setDate(
        value
      );

      setTime("");

      setSelectedSlotId("");
  };


  const chooseSlot =
    (
      slot:
        DoctorSlot
    ) => {
      setTime(
        slot.time
      );

      setSelectedSlotId(
        slot.id
      );
    };


  const handleFileUpload =
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        event.target
          .files?.[0];

      setError("");

      if (
        !file
      ) {
        return;
      }

      if (
        !ALLOWED_FILE_TYPES.includes(
          file.type
        )
      ) {
        setError(
          "Only PDF, JPG and PNG files are allowed."
        );

        return;
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        setError(
          "Medical document must be smaller than 1 MB."
        );

        return;
      }


      setFileLoading(
        true
      );


      const reader =
        new FileReader();


      reader.onload =
        () => {

          if (
            typeof reader.result !==
            "string"
          ) {
            setFileLoading(
              false
            );

            return;
          }


          setAttachment({
            name:
              file.name,

            type:
              file.type,

            size:
              file.size,

            dataUrl:
              reader.result,
          });


          setFileLoading(
            false
          );
        };


      reader.onerror =
        () => {
          setError(
            "Unable to read file."
          );

          setFileLoading(
            false
          );
        };


      reader.readAsDataURL(
        file
      );
    };


  const submit =
    (
      event:
        FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault();

      setError("");


      if (
        !doctor ||
        !selectedSlotId ||
        !date ||
        !time
      ) {
        setError(
          "Please select an available appointment slot."
        );

        return;
      }


      if (
        !patientName.trim() ||
        !patientEmail.trim() ||
        !patientPhone.trim() ||
        !patientAge.trim() ||
        !reason.trim()
      ) {
        setError(
          "Please complete all patient details."
        );

        return;
      }


      if (
        !/^\S+@\S+\.\S+$/.test(
          patientEmail.trim()
        )
      ) {
        setError(
          "Please enter a valid email address."
        );

        return;
      }


      const phone =
        patientPhone.replace(
          /\D/g,
          ""
        );


      if (
        !/^\d{10}$/.test(
          phone
        )
      ) {
        setError(
          "Please enter a valid 10-digit phone number."
        );

        return;
      }


      const age =
        Number(
          patientAge
        );


      if (
        !Number.isFinite(
          age
        ) ||
        age <
          1 ||
        age >
          120
      ) {
        setError(
          "Please enter a valid patient age."
        );

        return;
      }


      const booking:
        Booking = {
        id:
          `apt-${Date.now()}`,

        doctorId:
          doctor.id,

        doctorName:
          doctor.name,

        specialty:
          doctor.specialty,

        doctorLocation:
          doctor.location,

        slotId:
          selectedSlotId,

        patientName:
          patientName.trim(),

        patientEmail:
          patientEmail
            .trim()
            .toLowerCase(),

        patientPhone:
          phone,

        patientAge:
          age,

        reason:
          reason.trim(),

        date,

        time,

        startsAt:
          `${date}T${to24Hour(
            time
          )}`,

        fee:
          doctor.fee,

        status:
          "confirmed",

        createdAt:
          new Date()
            .toISOString(),

        attachment,
      };


      const success =
        saveBookingWithSlot(
          booking,
          selectedSlotId
        );


      if (
        !success
      ) {
        setError(
          "This slot is no longer available. Please choose another slot."
        );

        setAvailableSlots(
          getAvailableSlotsForDoctor(
            doctor.id
          )
        );

        setSelectedSlotId("");

        setTime("");

        return;
      }


      saveLatestBookingId(
        booking.id
      );


      router.push(
        "/booking-confirmation"
      );
    };


  if (
    loading
  ) {
    return (
      <>
        <Navbar />

        <main className="grid min-h-[60vh] place-items-center">
          Loading availability...
        </main>
      </>
    );
  }


  if (
    !doctor
  ) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-20 text-center">

          <h1 className="text-3xl font-semibold">
            Doctor not found
          </h1>

          <Link
            href="/doctors"
            className="mt-5 inline-flex rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to doctors
          </Link>

        </main>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        <Link
          href={`/doctors/${doctor.id}`}
          className="text-sm font-semibold text-[var(--brand)]"
        >
          ← Back to doctor profile
        </Link>


        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">

          <form
            onSubmit={
              submit
            }
            className="space-y-6"
          >

            <section className="rounded-2xl border border-[var(--line)] bg-white p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                Appointment Booking
              </p>

              <h1 className="mt-2 text-3xl font-semibold">
                Book your appointment
              </h1>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Booking with{" "}
                <strong>
                  {
                    doctor.name
                  }
                </strong>
              </p>

            </section>


            <section className="rounded-2xl border border-[var(--line)] bg-white p-6">

              <h2 className="font-semibold">
                1. Select available date
              </h2>


              {availableDates.length >
              0 ? (

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

                  {availableDates.map(
                    (
                      item
                    ) => (

                      <button
                        key={
                          item
                        }
                        type="button"
                        onClick={() =>
                          chooseDate(
                            item
                          )
                        }
                        className={`rounded-xl border p-3 text-left ${
                          date ===
                          item
                            ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]"
                            : "border-[var(--line)]"
                        }`}
                      >

                        <span className="text-sm font-semibold">

                          {new Intl.DateTimeFormat(
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
                            new Date(
                              `${item}T00:00:00`
                            )
                          )}

                        </span>

                      </button>

                    )
                  )}

                </div>

              ) : (

                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                  This doctor currently has no available appointment slots.
                </div>

              )}

            </section>


            <section className="rounded-2xl border border-[var(--line)] bg-white p-6">

              <h2 className="font-semibold">
                2. Select available time
              </h2>


              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

                {slotsForDate.map(
                  (
                    slot
                  ) => (

                    <button
                      key={
                        slot.id
                      }
                      type="button"
                      onClick={() =>
                        chooseSlot(
                          slot
                        )
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                        selectedSlotId ===
                        slot.id
                          ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                          : "border-[var(--line)] hover:border-[var(--brand)]"
                      }`}
                    >
                      {
                        slot.time
                      }
                    </button>

                  )
                )}

              </div>

            </section>


            <section className="rounded-2xl border border-[var(--line)] bg-white p-6">

              <h2 className="font-semibold">
                3. Patient Details
              </h2>


              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <label>
                  <span className="text-sm font-medium">
                    Full Name
                  </span>

                  <input
                    value={
                      patientName
                    }
                    onChange={(
                      event
                    ) =>
                      setPatientName(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm"
                  />
                </label>


                <label>
                  <span className="text-sm font-medium">
                    Age
                  </span>

                  <input
                    value={
                      patientAge
                    }
                    onChange={(
                      event
                    ) =>
                      setPatientAge(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm"
                  />
                </label>


                <label>
                  <span className="text-sm font-medium">
                    Email
                  </span>

                  <input
                    type="email"
                    value={
                      patientEmail
                    }
                    onChange={(
                      event
                    ) =>
                      setPatientEmail(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm"
                  />
                </label>


                <label>
                  <span className="text-sm font-medium">
                    Phone
                  </span>

                  <input
                    value={
                      patientPhone
                    }
                    onChange={(
                      event
                    ) =>
                      setPatientPhone(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm"
                  />
                </label>


                <label className="sm:col-span-2">
                  <span className="text-sm font-medium">
                    Reason for Consultation
                  </span>

                  <textarea
                    rows={
                      4
                    }
                    value={
                      reason
                    }
                    onChange={(
                      event
                    ) =>
                      setReason(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full resize-none rounded-xl border border-[var(--line)] px-4 py-3 text-sm"
                  />
                </label>


                <div className="sm:col-span-2">

                  <p className="text-sm font-medium">
                    Medical Document{" "}
                    <span className="font-normal text-[var(--muted)]">
                      (optional)
                    </span>
                  </p>


                  {!attachment ? (

                    <label className="mt-2 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-[var(--line)] p-8 text-center">

                      <span className="text-2xl">
                        📎
                      </span>

                      <span className="mt-2 text-sm font-semibold">
                        Upload Medical Report
                      </span>

                      <span className="mt-1 text-xs text-[var(--muted)]">
                        PDF / JPG / PNG · Max 1 MB
                      </span>

                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={
                          handleFileUpload
                        }
                        className="hidden"
                      />

                    </label>

                  ) : (

                    <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                      <div>

                        <p className="text-sm font-semibold">
                          📄{" "}
                          {
                            attachment.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {
                            formatFileSize(
                              attachment.size
                            )
                          }
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setAttachment(
                            undefined
                          )
                        }
                        className="text-sm font-semibold text-red-600"
                      >
                        Remove
                      </button>

                    </div>

                  )}

                </div>

              </div>

            </section>


            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {
                  error
                }
              </div>
            )}


            <button
              type="submit"
              disabled={
                fileLoading ||
                availableSlots.length ===
                  0
              }
              className="w-full rounded-xl bg-[var(--brand)] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Confirm Appointment
            </button>

          </form>


          <BookingSummary
            doctor={
              doctor
            }
            date={
              date
            }
            time={
              time
            }
          />

        </div>

      </main>
    </>
  );
}