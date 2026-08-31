"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  jsPDF,
} from "jspdf";

import QRCode from "qrcode";

import Navbar from "@/components/layout/Navbar";

import type {
  Booking,
} from "@/types/booking";

import {
  getLatestBooking,
} from "@/lib/client-storage";


function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(
    bytes /
    1024
  ).toFixed(1)} KB`;
}


function displayDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle:
        "medium",
    }
  ).format(
    new Date(
      `${date}T00:00:00`
    )
  );
}


export default function BookingConfirmationPage() {
  const [
    booking,
    setBooking,
  ] =
    useState<
      Booking | null
    >(null);

  const [
    pdfLoading,
    setPdfLoading,
  ] =
    useState(false);


  useEffect(() => {
    setBooking(
      getLatestBooking()
    );
  }, []);


  const downloadConfirmationPdf =
    async () => {
      if (!booking) {
        return;
      }

      setPdfLoading(
        true
      );

      try {

        /*
          QR contains useful booking data.

          For a real medical production
          app, normally encode only an
          appointment ID or secure URL.
        */

        const qrDetails = [
          "SCHEDULA APPOINTMENT",
          "",
          `Appointment ID: ${booking.id}`,
          `Patient: ${booking.patientName}`,
          `Doctor: ${booking.doctorName}`,
          `Specialty: ${booking.specialty}`,
          `Date: ${displayDate(booking.date)}`,
          `Time: ${booking.time}`,
          `Status: CONFIRMED`,
        ].join("\n");


        const qrImage =
          await QRCode.toDataURL(
            qrDetails,
            {
              width: 500,
              margin: 1,
            }
          );


        const pdf =
          new jsPDF({
            orientation:
              "portrait",

            unit:
              "mm",

            format:
              "a4",
          });


        const PAGE_WIDTH =
          210;

        const LEFT =
          16;

        const RIGHT =
          194;


        /* HEADER */

        pdf.setFillColor(
          18,
          116,
          91
        );

        pdf.rect(
          0,
          0,
          PAGE_WIDTH,
          32,
          "F"
        );


        pdf.setTextColor(
          255,
          255,
          255
        );

        pdf.setFontSize(
          21
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "Schedula",
          LEFT,
          15
        );


        pdf.setFontSize(
          10
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.text(
          "Appointment Confirmation",
          LEFT,
          23
        );


        /* TITLE */

        pdf.setTextColor(
          25,
          45,
          40
        );

        pdf.setFontSize(
          18
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "Appointment Confirmed",
          LEFT,
          48
        );


        pdf.setFontSize(
          10
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setTextColor(
          90,
          105,
          100
        );

        pdf.text(
          "Please keep this confirmation for your records.",
          LEFT,
          55
        );


        /* QR CODE */

        pdf.addImage(
          qrImage,
          "PNG",
          151,
          39,
          42,
          42
        );


        pdf.setFontSize(
          7
        );

        pdf.text(
          "Scan for booking details",
          156,
          85
        );


        /* DIVIDER */

        pdf.setDrawColor(
          220,
          228,
          224
        );

        pdf.line(
          LEFT,
          92,
          RIGHT,
          92
        );


        let y =
          104;


        const addSectionTitle = (
          title: string
        ) => {
          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.setFontSize(
            11
          );

          pdf.setTextColor(
            18,
            116,
            91
          );

          pdf.text(
            title,
            LEFT,
            y
          );

          y += 8;
        };


        const addField = (
          label: string,
          value: string
        ) => {
          pdf.setFont(
            "helvetica",
            "normal"
          );

          pdf.setFontSize(
            8
          );

          pdf.setTextColor(
            110,
            120,
            116
          );

          pdf.text(
            label,
            LEFT,
            y
          );


          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.setFontSize(
            10
          );

          pdf.setTextColor(
            30,
            45,
            40
          );


          const lines =
            pdf.splitTextToSize(
              value,
              165
            );


          pdf.text(
            lines,
            LEFT,
            y + 5
          );


          y +=
            11 +
            Math.max(
              0,
              lines.length -
                1
            ) *
              4;
        };


        /* BOOKING */

        addSectionTitle(
          "Booking Details"
        );


        addField(
          "Appointment ID",
          booking.id
        );

        addField(
          "Status",
          "Confirmed"
        );

        addField(
          "Date",
          displayDate(
            booking.date
          )
        );

        addField(
          "Time",
          booking.time
        );


        /* DOCTOR */

        y += 3;

        addSectionTitle(
          "Doctor Details"
        );


        addField(
          "Doctor",
          booking.doctorName
        );

        addField(
          "Specialty",
          booking.specialty
        );

        addField(
          "Clinic / Location",
          booking.doctorLocation ??
            "Schedula Clinic"
        );

        addField(
          "Consultation Fee",
          `INR ${booking.fee}`
        );


        /* PATIENT */

        if (y > 230) {
          pdf.addPage();

          y = 20;
        }


        y += 3;

        addSectionTitle(
          "Patient Details"
        );


        addField(
          "Patient Name",
          booking.patientName
        );

        addField(
          "Age",
          `${booking.patientAge} years`
        );

        addField(
          "Email",
          booking.patientEmail
        );

        addField(
          "Phone",
          booking.patientPhone
        );


        addField(
          "Reason for Consultation",
          booking.reason
        );


        /* ATTACHMENT */

        if (
          booking.attachment
        ) {

          if (y > 240) {
            pdf.addPage();

            y = 20;
          }

          y += 3;

          addSectionTitle(
            "Medical Document"
          );


          addField(
            "Attachment Name",
            booking.attachment.name
          );


          addField(
            "File Type",
            booking.attachment.type
          );


          addField(
            "File Size",
            formatFileSize(
              booking.attachment.size
            )
          );

        }


        /* CREATED */

        if (y > 255) {
          pdf.addPage();

          y = 20;
        }


        y += 4;

        pdf.setDrawColor(
          220,
          228,
          224
        );

        pdf.line(
          LEFT,
          y,
          RIGHT,
          y
        );

        y += 8;


        pdf.setFontSize(
          8
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setTextColor(
          110,
          120,
          116
        );


        pdf.text(
          `Booking created: ${new Intl.DateTimeFormat(
            "en-IN",
            {
              dateStyle:
                "medium",

              timeStyle:
                "short",
            }
          ).format(
            new Date(
              booking.createdAt
            )
          )}`,
          LEFT,
          y
        );


        pdf.text(
          "Generated by Schedula - Mock appointment system",
          LEFT,
          y + 6
        );


        /* SAVE */

        pdf.save(
          `Schedula-${booking.id}.pdf`
        );

      } catch (
        error
      ) {
        console.error(
          "PDF generation failed:",
          error
        );

        alert(
          "Unable to generate confirmation PDF."
        );

      } finally {
        setPdfLoading(
          false
        );
      }
    };


  return (
    <>
      <Navbar />

      <main className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-12">

        <section className="w-full max-w-2xl rounded-[2rem] border border-[var(--line)] bg-white p-6 text-center soft-shadow sm:p-10">

          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--brand-soft)] text-2xl font-semibold text-[var(--brand)]">
            ✓
          </div>


          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
            Booking successful
          </p>


          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Appointment confirmed
          </h1>


          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
            Your appointment has been
            confirmed. Download your
            confirmation PDF and keep it
            for your records.
          </p>


          {booking ? (

            <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-[var(--line)] bg-[#fbfdfc] p-5 text-left">

              <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">

                <div>

                  <p className="font-semibold">
                    {
                      booking.doctorName
                    }
                  </p>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {
                      booking.specialty
                    }
                  </p>

                </div>


                <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)]">
                  Confirmed
                </span>

              </div>


              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">

                <div>

                  <dt className="text-[var(--muted)]">
                    Patient
                  </dt>

                  <dd className="mt-1 font-medium">
                    {
                      booking.patientName
                    }
                  </dd>

                </div>


                <div>

                  <dt className="text-[var(--muted)]">
                    Appointment ID
                  </dt>

                  <dd className="mt-1 font-medium">
                    {
                      booking.id
                    }
                  </dd>

                </div>


                <div>

                  <dt className="text-[var(--muted)]">
                    Date
                  </dt>

                  <dd className="mt-1 font-medium">
                    {
                      displayDate(
                        booking.date
                      )
                    }
                  </dd>

                </div>


                <div>

                  <dt className="text-[var(--muted)]">
                    Time
                  </dt>

                  <dd className="mt-1 font-medium">
                    {
                      booking.time
                    }
                  </dd>

                </div>


                <div>

                  <dt className="text-[var(--muted)]">
                    Fee
                  </dt>

                  <dd className="mt-1 font-medium">
                    ₹{
                      booking.fee
                    }
                  </dd>

                </div>


                <div>

                  <dt className="text-[var(--muted)]">
                    Email
                  </dt>

                  <dd className="mt-1 break-all font-medium">
                    {
                      booking.patientEmail
                    }
                  </dd>

                </div>

              </dl>


              {booking.attachment && (

                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Medical attachment
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    📄{" "}
                    {
                      booking.attachment.name
                    }
                  </p>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {
                      formatFileSize(
                        booking.attachment.size
                      )
                    }
                  </p>

                </div>

              )}

            </div>

          ) : (

            <div className="mx-auto mt-8 max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              No recent booking was found.
            </div>

          )}


          {booking && (

            <button
              type="button"

              onClick={
                downloadConfirmationPdf
              }

              disabled={
                pdfLoading
              }

              className="mt-7 w-full rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:opacity-60"
            >

              {pdfLoading
                ? "Generating PDF..."
                : "Download confirmation PDF"}

            </button>

          )}


          <div className="mt-4">

            <Link
              href="/doctors"
              className="text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              Book another appointment
            </Link>

          </div>

        </section>

      </main>
    </>
  );
}