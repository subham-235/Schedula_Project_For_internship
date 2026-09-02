"use client";

import {
  Download,
} from "lucide-react";

import type {
  Booking,
} from "@/types/booking";

import type {
  Prescription,
} from "@/types/prescription";

import {
  downloadPrescriptionPdf,
} from "@/lib/prescription-pdf";

export default function PrescriptionPdfButton({
  booking,
  prescription,
  className = "",
}: {
  booking: Booking;
  prescription: Prescription;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        downloadPrescriptionPdf(
          booking,
          prescription,
        )
      }
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] ${className}`}
    >
      <Download size={16} />
      Download prescription
    </button>
  );
}
