"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

import Navbar from "@/components/layout/Navbar";

import type { Booking, BookingStatus } from "@/types/booking";

import { getLatestBooking } from "@/lib/client-storage";

/* =========================================
   FILE SIZE
========================================= */

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/* =========================================
   DATE
========================================= */

function displayDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(`${date}T00:00:00`));
}

/* =========================================
   DATE + TIME
========================================= */

function displayDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

/* =========================================
   STATUS LABEL
========================================= */

function getStatusLabel(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "Pending";

    case "confirmed":
      return "Confirmed";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "missed":
      return "Missed";

    default:
      return status;
  }
}

/* =========================================
   STATUS STYLE
========================================= */

function getStatusStyle(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "confirmed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "completed":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    case "missed":
      return "border-stone-200 bg-stone-100 text-stone-600";

    default:
      return "border-stone-200 bg-stone-100 text-stone-600";
  }
}

/* =========================================
   PAGE CONTENT
========================================= */

function getPageContent(status: BookingStatus) {
  switch (status) {
    case "pending":
      return {
        icon: "⌛",

        eyebrow: "Appointment request submitted",

        title: "Waiting for doctor confirmation",

        description:
          "Your appointment request has been submitted successfully. The selected slot is reserved while the doctor reviews your request.",

        pdfTitle: "Appointment Request Receipt",

        pdfSubtitle:
          "This appointment request is currently awaiting confirmation from the doctor.",

        button: "Download booking receipt",
      };

    case "confirmed":
      return {
        icon: "✓",

        eyebrow: "Booking confirmed",

        title: "Appointment confirmed",

        description:
          "Your doctor has confirmed the appointment. Please keep your appointment information for your records.",

        pdfTitle: "Appointment Confirmation",

        pdfSubtitle: "Your appointment has been confirmed by the doctor.",

        button: "Download confirmation PDF",
      };

    case "completed":
      return {
        icon: "✓",

        eyebrow: "Appointment completed",

        title: "Consultation completed",

        description:
          "Your consultation has been completed. You can continue to My Appointments to check your prescription, review the doctor or book another visit.",

        pdfTitle: "Completed Appointment Record",

        pdfSubtitle: "This consultation has been completed.",

        button: "Download appointment record",
      };

    case "cancelled":
      return {
        icon: "✕",

        eyebrow: "Appointment cancelled",

        title: "Appointment cancelled",

        description:
          "This appointment has been cancelled. The reserved slot has been released and you may book another available appointment.",

        pdfTitle: "Cancelled Appointment Record",

        pdfSubtitle: "This appointment has been cancelled.",

        button: "Download appointment record",
      };

    case "missed":
      return {
        icon: "!",

        eyebrow: "Appointment missed",

        title: "Appointment marked as missed",

        description:
          "This appointment has been marked as missed. You can book another available slot with the doctor.",

        pdfTitle: "Missed Appointment Record",

        pdfSubtitle: "This appointment has been marked as missed.",

        button: "Download appointment record",
      };
  }
}

/* =========================================
   PAGE
========================================= */

export default function BookingConfirmationPage() {
  const [booking, setBooking] = useState<Booking | null>(null);

  const [loading, setLoading] = useState(true);

  const [pdfLoading, setPdfLoading] = useState(false);

  /* =========================================
     REFRESH BOOKING
  ========================================= */

  const refreshBooking = useCallback(() => {
    const latest = getLatestBooking();

    setBooking(latest);

    setLoading(false);
  }, []);

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    refreshBooking();
  }, [refreshBooking]);

  /* =========================================
     REFRESH WHEN WINDOW RETURNS TO FOCUS

     Example:
     Doctor confirms in another tab →
     patient returns here →
     status becomes Confirmed.
  ========================================= */

  useEffect(() => {
    const handleFocus = () => {
      refreshBooking();
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === "schedula-bookings" ||
        event.key === "schedula-latest-booking-id"
      ) {
        refreshBooking();
      }
    };

    window.addEventListener("focus", handleFocus);

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);

      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshBooking]);

  /* =========================================
     PDF
  ========================================= */

  const downloadConfirmationPdf = async () => {
    if (!booking) {
      return;
    }

    setPdfLoading(true);

    try {
      const statusLabel = getStatusLabel(booking.status);

      const pageContent = getPageContent(booking.status);

      /* =====================================
           QR DATA
        ===================================== */

      const qrDetails = [
        "SCHEDULA APPOINTMENT",

        "",

        `Appointment ID: ${booking.id}`,

        `Status: ${statusLabel.toUpperCase()}`,

        `Patient: ${booking.patientName}`,

        `Patient Email: ${booking.patientEmail}`,

        `Patient Phone: ${booking.patientPhone}`,

        `Doctor: ${booking.doctorName}`,

        `Specialty: ${booking.specialty}`,

        `Appointment Type: ${booking.appointmentType ?? "In-person"}`,

        `Date: ${displayDate(booking.date)}`,

        `Time: ${booking.time}`,

        `Location: ${booking.doctorLocation ?? "Schedula Clinic"}`,

        `Consultation Fee: INR ${booking.fee}`,

        `Reason: ${booking.reason}`,
      ].join("\n");

      const qrImage = await QRCode.toDataURL(qrDetails, {
        width: 500,

        margin: 1,
      });

      /* =====================================
           CREATE PDF
        ===================================== */

      const pdf = new jsPDF({
        orientation: "portrait",

        unit: "mm",

        format: "a4",
      });

      const PAGE_WIDTH = 210;

      const LEFT = 16;

      const RIGHT = 194;

      /* =====================================
           HEADER
        ===================================== */

      pdf.setFillColor(18, 116, 91);

      pdf.rect(0, 0, PAGE_WIDTH, 32, "F");

      pdf.setTextColor(255, 255, 255);

      pdf.setFontSize(21);

      pdf.setFont("helvetica", "bold");

      pdf.text("Schedula", LEFT, 15);

      pdf.setFontSize(10);

      pdf.setFont("helvetica", "normal");

      pdf.text(pageContent.pdfTitle, LEFT, 23);

      /* =====================================
           TITLE
        ===================================== */

      pdf.setTextColor(25, 45, 40);

      pdf.setFontSize(18);

      pdf.setFont("helvetica", "bold");

      pdf.text(pageContent.pdfTitle, LEFT, 48);

      pdf.setFontSize(10);

      pdf.setFont("helvetica", "normal");

      pdf.setTextColor(90, 105, 100);

      const subtitleLines = pdf.splitTextToSize(pageContent.pdfSubtitle, 120);

      pdf.text(subtitleLines, LEFT, 55);

      /* =====================================
           QR CODE
        ===================================== */

      pdf.addImage(qrImage, "PNG", 151, 39, 42, 42);

      pdf.setFontSize(7);

      pdf.setTextColor(90, 105, 100);

      pdf.text("Scan for appointment details", 154, 85);

      /* =====================================
           DIVIDER
        ===================================== */

      pdf.setDrawColor(220, 228, 224);

      pdf.line(LEFT, 92, RIGHT, 92);

      let y = 104;

      /* =====================================
           PDF HELPERS
        ===================================== */

      const checkPage = (requiredSpace = 25) => {
        if (y + requiredSpace > 280) {
          pdf.addPage();

          y = 20;
        }
      };

      const addSectionTitle = (title: string) => {
        checkPage(15);

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(11);

        pdf.setTextColor(18, 116, 91);

        pdf.text(title, LEFT, y);

        y += 8;
      };

      const addField = (label: string, value: string) => {
        checkPage(18);

        pdf.setFont("helvetica", "normal");

        pdf.setFontSize(8);

        pdf.setTextColor(110, 120, 116);

        pdf.text(label, LEFT, y);

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(10);

        pdf.setTextColor(30, 45, 40);

        const lines = pdf.splitTextToSize(value, 165);

        pdf.text(lines, LEFT, y + 5);

        y += 11 + Math.max(0, lines.length - 1) * 4;
      };

      /* =====================================
           BOOKING DETAILS
        ===================================== */

      addSectionTitle("Booking Details");

      addField("Appointment ID", booking.id);

      addField("Current Status", statusLabel);

      addField("Appointment Type", booking.appointmentType ?? "In-person");

      addField("Date", displayDate(booking.date));

      addField("Time", booking.time);

      /* =====================================
           DOCTOR
        ===================================== */

      y += 3;

      addSectionTitle("Doctor Details");

      addField("Doctor", booking.doctorName);

      addField("Specialty", booking.specialty);

      addField(
        "Clinic / Location",
        booking.doctorLocation ?? "Schedula Clinic",
      );

      addField("Consultation Fee", `INR ${booking.fee}`);

      /* =====================================
           PATIENT
        ===================================== */

      y += 3;

      addSectionTitle("Patient Details");

      addField("Patient Name", booking.patientName);

      addField("Age", `${booking.patientAge} years`);

      addField("Email", booking.patientEmail);

      addField("Phone", booking.patientPhone);

      addField("Reason for Consultation", booking.reason);

      /* =====================================
           RESCHEDULE INFORMATION
        ===================================== */

      if (booking.rescheduledAt) {
        y += 3;

        addSectionTitle("Rescheduling Information");

        if (booking.originalStartsAt) {
          addField(
            "Original Appointment",
            displayDateTime(booking.originalStartsAt),
          );
        }

        addField(
          "Current Appointment",
          `${displayDate(booking.date)} at ${booking.time}`,
        );

        addField("Rescheduled On", displayDateTime(booking.rescheduledAt));
      }

      /* =====================================
           MEDICAL DOCUMENT
        ===================================== */

      if (booking.attachment) {
        y += 3;

        addSectionTitle("Medical Document");

        addField("Attachment Name", booking.attachment.name);

        addField("File Type", booking.attachment.type);

        addField("File Size", formatFileSize(booking.attachment.size));
      }

      /* =====================================
           RECORD INFORMATION
        ===================================== */

      y += 3;

      addSectionTitle("Record Information");

      addField("Booking Created", displayDateTime(booking.createdAt));

      addField("Current Status", statusLabel);

      /* =====================================
           FOOTER
        ===================================== */

      checkPage(25);

      y += 4;

      pdf.setDrawColor(220, 228, 224);

      pdf.line(LEFT, y, RIGHT, y);

      y += 8;

      pdf.setFont("helvetica", "normal");

      pdf.setFontSize(8);

      pdf.setTextColor(110, 120, 116);

      pdf.text("Generated by Schedula", LEFT, y);

      pdf.text("Keep this document for your appointment records.", LEFT, y + 6);

      /* =====================================
           SAVE
        ===================================== */

      let filePrefix = "Schedula-Appointment";

      if (booking.status === "confirmed") {
        filePrefix = "Schedula-Confirmation";
      }

      if (booking.status === "pending") {
        filePrefix = "Schedula-Booking-Request";
      }

      pdf.save(`${filePrefix}-${booking.id}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);

      alert("Unable to generate appointment PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  /* =========================================
     PAGE CONTENT
  ========================================= */

  const pageContent = booking ? getPageContent(booking.status) : null;

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="grid min-h-[calc(100vh-73px)] place-items-center px-4">
          <div className="text-center">
            <div className="mx-auto size-10 animate-spin rounded-full border-4 border-emerald-100 border-t-[var(--brand)]" />

            <p className="mt-4 text-sm text-[var(--muted)]">
              Loading appointment...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-12">
        <section className="w-full max-w-2xl rounded-[2rem] border border-[var(--line)] bg-white p-6 text-center soft-shadow sm:p-10">
          {booking && pageContent && (
            <>
              {/* STATUS ICON */}

              <div
                className={`mx-auto grid size-16 place-items-center rounded-full border text-2xl font-semibold ${getStatusStyle(
                  booking.status,
                )}`}
              >
                {pageContent.icon}
              </div>

              {/* HEADER */}

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
                {pageContent.eyebrow}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                {pageContent.title}
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
                {pageContent.description}
              </p>

              {/* PENDING MESSAGE */}

              {booking.status === "pending" && (
                <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-left">
                  <p className="text-sm font-semibold text-amber-800">
                    What happens next?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-amber-700">
                    Your selected appointment slot has been reserved. The doctor
                    can now confirm or decline the request.
                  </p>
                </div>
              )}

              {/* CONFIRMED MESSAGE */}

              {booking.status === "confirmed" && (
                <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-left">
                  <p className="text-sm font-semibold text-emerald-800">
                    Appointment ready
                  </p>

                  <p className="mt-2 text-sm leading-6 text-emerald-700">
                    Your doctor has accepted the appointment request. Please
                    arrive on time and keep your confirmation record.
                  </p>
                </div>
              )}

              {/* BOOKING CARD */}

              <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-[var(--line)] bg-[#fbfdfc] p-5 text-left">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
                  <div>
                    <p className="font-semibold">{booking.doctorName}</p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {booking.specialty}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[var(--brand)]">
                      {booking.appointmentType ?? "In-person"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                      booking.status,
                    )}`}
                  >
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-[var(--muted)]">Patient</dt>

                    <dd className="mt-1 font-medium">{booking.patientName}</dd>
                  </div>

                  <div>
                    <dt className="text-[var(--muted)]">Appointment ID</dt>

                    <dd className="mt-1 break-all font-medium">{booking.id}</dd>
                  </div>

                  <div>
                    <dt className="text-[var(--muted)]">Date</dt>

                    <dd className="mt-1 font-medium">
                      {displayDate(booking.date)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[var(--muted)]">Time</dt>

                    <dd className="mt-1 font-medium">{booking.time}</dd>
                  </div>

                  <div>
                    <dt className="text-[var(--muted)]">Appointment type</dt>

                    <dd className="mt-1 font-medium">
                      {booking.appointmentType ?? "In-person"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[var(--muted)]">Fee</dt>

                    <dd className="mt-1 font-medium">₹{booking.fee}</dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-[var(--muted)]">Clinic / Location</dt>

                    <dd className="mt-1 font-medium">
                      {booking.doctorLocation ?? "Schedula Clinic"}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-[var(--muted)]">
                      Reason for consultation
                    </dt>

                    <dd className="mt-1 font-medium">{booking.reason}</dd>
                  </div>
                </dl>

                {/* RESCHEDULED */}

                {booking.rescheduledAt && (
                  <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Appointment rescheduled
                    </p>

                    <p className="mt-2 text-sm text-blue-800">
                      Your current appointment is scheduled for{" "}
                      <span className="font-semibold">
                        {displayDate(booking.date)} at {booking.time}
                      </span>
                      .
                    </p>

                    {booking.originalStartsAt && (
                      <p className="mt-2 text-xs text-blue-700">
                        Original: {displayDateTime(booking.originalStartsAt)}
                      </p>
                    )}
                  </div>
                )}

                {/* ATTACHMENT */}

                {booking.attachment && (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Medical attachment
                    </p>

                    <p className="mt-2 break-all text-sm font-semibold">
                      📄 {booking.attachment.name}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {formatFileSize(booking.attachment.size)}

                      {" · "}

                      {booking.attachment.type}
                    </p>
                  </div>
                )}
              </div>

              {/* PDF BUTTON */}

              <button
                type="button"
                onClick={downloadConfirmationPdf}
                disabled={pdfLoading}
                className="mt-7 w-full rounded-xl bg-[var(--brand)] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pdfLoading ? "Generating PDF..." : pageContent.button}
              </button>

              {/* NAVIGATION */}

              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/my-appointments"
                  className="rounded-xl border border-[var(--line)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  My Appointments
                </Link>

                <Link
                  href="/doctors"
                  className="rounded-xl border border-[var(--line)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  Find Doctors
                </Link>
              </div>
            </>
          )}

          {/* NO BOOKING */}

          {!booking && (
            <>
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-amber-50 text-2xl">
                !
              </div>

              <h1 className="mt-6 text-2xl font-semibold">
                No recent booking found
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
                We could not find a recently created appointment in this
                browser.
              </p>

              <Link
                href="/doctors"
                className="mt-7 inline-flex rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white"
              >
                Find a Doctor
              </Link>
            </>
          )}
        </section>
      </main>
    </>
  );
}
