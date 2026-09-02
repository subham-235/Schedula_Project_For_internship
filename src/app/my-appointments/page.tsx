"use client";

import Link from "next/link";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  CalendarDays,
  Download,
  FileText,
  RefreshCcw,
  Star,
  Stethoscope,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";

import StatusBadge from "@/components/appointments/StatusBadge";

import type { Booking } from "@/types/booking";

import type { Prescription } from "@/types/prescription";

import {
  getBookingsForPatient,
  getCurrentUser,
  getPrescriptionByBookingId,
  getReviewByBookingId,
  saveDoctorReview,
} from "@/lib/client-storage";

import {
  formatAppointmentFullDate,
  formatAppointmentTime,
} from "@/lib/appointment-utils";

import {
  downloadPrescriptionPdf,
} from "@/lib/prescription-pdf";

type Tab = "upcoming" | "completed" | "cancelled";

export default function MyAppointmentsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [tab, setTab] = useState<Tab>("upcoming");

  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [message, setMessage] = useState("");

  const load = useCallback(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace("/login");

      return;
    }

    if (user.role !== "patient") {
      router.replace("/doctor-dashboard");

      return;
    }

    setBookings(getBookingsForPatient(user.id, user.email));
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const syncPatientRecords = () => {
      load();
      setSelectedPrescription((current) =>
        current ? getPrescriptionByBookingId(current.bookingId) : null,
      );
    };

    window.addEventListener("focus", syncPatientRecords);
    window.addEventListener("storage", syncPatientRecords);

    return () => {
      window.removeEventListener("focus", syncPatientRecords);
      window.removeEventListener("storage", syncPatientRecords);
    };
  }, [load]);

  const visible = useMemo(
    () =>
      bookings.filter((booking) => {
        if (tab === "upcoming") {
          return booking.status === "pending" || booking.status === "confirmed";
        }

        if (tab === "cancelled") {
          return booking.status === "cancelled" || booking.status === "missed";
        }

        return booking.status === tab;
      }),
    [bookings, tab],
  );

  const downloadPrescription = (
    booking: Booking,
    prescription: Prescription,
  ) => {
    downloadPrescriptionPdf(
      booking,
      prescription,
    );
  };

  const submitReview = () => {
    if (!reviewBooking) {
      return;
    }

    const user = getCurrentUser();

    if (!user) {
      return;
    }

    const success = saveDoctorReview({
      id: `review-${Date.now()}`,

      bookingId: reviewBooking.id,

      doctorId: reviewBooking.doctorId,

      patientId: user.id,

      patientEmail: user.email,

      rating,

      comment: comment.trim(),

      createdAt: new Date().toISOString(),
    });

    if (success) {
      setMessage("Thank you. Your review has been submitted.");

      setReviewBooking(null);

      setComment("");

      setRating(5);

      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("You have already reviewed this appointment.");
    }
  };

  const tabs: Tab[] = ["upcoming", "completed", "cancelled"];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7faf8]">
        <section className="border-b border-[var(--line)] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-[var(--brand)]">
              Patient Portal
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              My Appointments
            </h1>

            <p className="mt-3 text-sm text-[var(--muted)]">
              Manage upcoming visits and access completed appointment
              information.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {message && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {message}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold capitalize ${
                  tab === item
                    ? "bg-[var(--brand)] text-white"
                    : "border border-[var(--line)] bg-white text-[var(--muted)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {visible.length > 0 ? (
              visible.map((booking) => {
                const prescription = getPrescriptionByBookingId(booking.id);

                const review = getReviewByBookingId(booking.id);

                return (
                  <article
                    key={booking.id}
                    className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex gap-4">
                        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-[var(--brand)]">
                          <Stethoscope size={22} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold">
                              {booking.doctorName}
                            </h2>

                            <StatusBadge status={booking.status} />
                          </div>

                          <p className="mt-1 text-sm text-[var(--brand)]">
                            {booking.specialty}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={14} />

                              {formatAppointmentFullDate(booking.startsAt)}
                            </span>

                            <span>
                              {formatAppointmentTime(booking.startsAt)}
                            </span>

                            <span>
                              {booking.appointmentType ?? "In-person"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {booking.status === "completed" && (
                        <div className="flex flex-wrap gap-2">
                          {prescription ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPrescription(prescription)
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2.5 text-xs font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]"
                              >
                                <FileText size={15} />
                                View Prescription
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  downloadPrescription(booking, prescription)
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2.5 text-xs font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]"
                              >
                                <Download size={15} />
                                Download PDF
                              </button>
                            </>
                          ) : null}

                          {!review ? (
                            <button
                              type="button"
                              onClick={() => setReviewBooking(booking)}
                              className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2.5 text-xs font-semibold hover:border-amber-300 hover:text-amber-600"
                            >
                              <Star size={15} />
                              Review Doctor
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700">
                              <Star size={14} fill="currentColor" />
                              Reviewed
                            </span>
                          )}

                          <Link
                            href={`/booking/${booking.doctorId}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-3 py-2.5 text-xs font-semibold text-white"
                          >
                            <RefreshCcw size={15} />
                            Rebook
                          </Link>
                        </div>
                      )}
                    </div>

                    {booking.status === "completed" && (
                      <div
                        className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                          prescription
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-stone-200 bg-stone-50 text-stone-600"
                        }`}
                      >
                        {prescription
                          ? "✓ Prescription Available"
                          : "Prescription Not Available"}
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center">
                <CalendarDays size={28} className="mx-auto text-stone-300" />

                <p className="mt-4 font-semibold">No {tab} appointments</p>

                <p className="mt-2 text-sm text-[var(--muted)]">
                  Appointments matching this category will appear here.
                </p>

                {tab === "upcoming" && (
                  <Link
                    href="/doctors"
                    className="mt-5 inline-flex rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Find a doctor
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {selectedPrescription && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--brand)]">
                    Prescription
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    {selectedPrescription.doctorName}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPrescription(null)}
                  className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold"
                >
                  Close
                </button>
              </div>

              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="text-[var(--muted)]">Diagnosis</dt>

                  <dd className="mt-1 font-medium">
                    {selectedPrescription.diagnosis}
                  </dd>
                </div>

                <div>
                  <dt className="text-[var(--muted)]">Medications</dt>

                  <dd className="mt-2">
                    {selectedPrescription.medications.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedPrescription.medications.map(
                          (medicine, index) => (
                            <li
                              key={`${medicine}-${index}`}
                              className="rounded-lg bg-stone-50 px-3 py-2 font-medium"
                            >
                              {index + 1}. {medicine}
                            </li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <span className="text-[var(--muted)]">
                        No medications listed.
                      </span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-[var(--muted)]">Advice</dt>

                  <dd className="mt-1 font-medium">
                    {selectedPrescription.notes || "No additional advice."}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {reviewBooking && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-semibold">
                Review {reviewBooking.doctorName}
              </h2>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Share your experience from this completed appointment.
              </p>

              <div className="mt-6 flex gap-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRating(item)}
                    className="text-amber-400"
                  >
                    <Star
                      size={28}
                      fill={item <= rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Write your review..."
                className="mt-5 w-full resize-none rounded-xl border border-[var(--line)] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
              />

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submitReview}
                  className="rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
