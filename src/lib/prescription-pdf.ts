import { jsPDF } from "jspdf";

import type { Booking } from "@/types/booking";
import type { Prescription } from "@/types/prescription";
import {
  formatAppointmentFullDate,
  formatAppointmentTime,
} from "@/lib/appointment-utils";

const BRAND = [229, 72, 59] as const;
const BRAND_DEEP = [18, 16, 15] as const;
const INK = [18, 16, 15] as const;
const MUTED = [116, 110, 104] as const;
const LINE = [221, 215, 208] as const;
const SOFT = [247, 244, 239] as const;

export function createPrescriptionPdf(
  booking: Booking,
  prescription: Prescription,
) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const left = 16;
  const right = 194;
  const width = right - left;
  let y = 0;

  const footer = () => {
    pdf.setDrawColor(...LINE);
    pdf.line(left, 281, right, 281);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...MUTED);
    pdf.text("Generated securely by Schedula", left, 287);
    pdf.text(`Prescription ID: ${prescription.id}`, right, 287, { align: "right" });
  };

  const header = (continuation = false) => {
    pdf.setFillColor(...BRAND_DEEP);
    pdf.rect(0, 0, 210, continuation ? 25 : 39, "F");
    pdf.setFillColor(242, 194, 167);
    pdf.roundedRect(left, 9, 13, 13, 3, 3, "F");
    pdf.setTextColor(...BRAND_DEEP);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("S", left + 6.5, 17.5, { align: "center" });
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(17);
    pdf.text("Schedula", left + 18, 15);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(170, 163, 157);
    pdf.text("Care, clearly documented.", left + 18, 21);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text(continuation ? "PRESCRIPTION - CONTINUED" : "MEDICAL PRESCRIPTION", right, 14, { align: "right" });
    if (!continuation) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(170, 163, 157);
      pdf.text(`Issued ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(prescription.updatedAt ?? prescription.createdAt))}`, right, 21, { align: "right" });
    }
    y = continuation ? 34 : 49;
  };

  const nextPage = () => {
    footer();
    pdf.addPage();
    header(true);
  };

  const ensure = (height: number) => {
    if (y + height > 274) nextPage();
  };

  const sectionTitle = (title: string, subtitle?: string) => {
    ensure(subtitle ? 19 : 14);
    pdf.setFillColor(...BRAND);
    pdf.roundedRect(left, y, 3, 8, 1.5, 1.5, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10.5);
    pdf.setTextColor(...INK);
    pdf.text(title, left + 7, y + 5.5);
    if (subtitle) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(...MUTED);
      pdf.text(subtitle, left + 7, y + 10.5);
    }
    y += subtitle ? 16 : 12;
  };

  const infoCell = (x: number, top: number, cellWidth: number, label: string, value: string) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(...MUTED);
    pdf.text(label.toUpperCase(), x, top);
    pdf.setFontSize(9.5);
    pdf.setTextColor(...INK);
    const lines = pdf.splitTextToSize(value || "-", cellWidth);
    pdf.text(lines.slice(0, 2), x, top + 5);
  };

  header();

  pdf.setFillColor(...SOFT);
  pdf.setDrawColor(...LINE);
  pdf.roundedRect(left, y, width, 34, 4, 4, "FD");
  infoCell(left + 6, y + 9, 48, "Patient", booking.patientName);
  infoCell(left + 66, y + 9, 45, "Age", `${booking.patientAge} years`);
  infoCell(left + 116, y + 9, 55, "Appointment", formatAppointmentFullDate(booking.startsAt));
  infoCell(left + 6, y + 24, 48, "Doctor", booking.doctorName);
  infoCell(left + 66, y + 24, 45, "Specialty", booking.specialty);
  infoCell(left + 116, y + 24, 55, "Time", formatAppointmentTime(booking.startsAt));
  y += 43;

  sectionTitle("Clinical assessment", "Diagnosis recorded for this consultation");
  const diagnosisLines = pdf.splitTextToSize(prescription.diagnosis || "No diagnosis recorded.", width - 12);
  const diagnosisHeight = Math.max(17, diagnosisLines.length * 5 + 9);
  ensure(diagnosisHeight);
  pdf.setFillColor(247, 244, 239);
  pdf.roundedRect(left, y, width, diagnosisHeight, 3, 3, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(...BRAND_DEEP);
  pdf.text(diagnosisLines, left + 6, y + 8);
  y += diagnosisHeight + 9;

  sectionTitle("Rx - Medications", "Follow dosage, frequency, and duration exactly as advised");
  const medicines = prescription.medicines?.length
    ? prescription.medicines.map((medicine) =>
        [
          medicine.name,
          medicine.dosage && `Dosage: ${medicine.dosage}`,
          medicine.duration && `Duration: ${medicine.duration}`,
          medicine.instructions,
        ]
          .filter(Boolean)
          .join(" | "),
      )
    : prescription.medications.length
      ? prescription.medications
      : ["No medications prescribed."];
  medicines.forEach((medicine, index) => {
    const lines = pdf.splitTextToSize(medicine, width - 27);
    const rowHeight = Math.max(14, lines.length * 4.5 + 7);
    ensure(rowHeight + 3);
    pdf.setFillColor(...SOFT);
    pdf.setDrawColor(...LINE);
    pdf.roundedRect(left, y, width, rowHeight, 3, 3, "FD");
    pdf.setFillColor(...BRAND);
    pdf.circle(left + 8, y + rowHeight / 2, 4, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text(String(index + 1), left + 8, y + rowHeight / 2 + 1, { align: "center" });
    pdf.setTextColor(...INK);
    pdf.setFontSize(9.5);
    pdf.text(lines, left + 17, y + 7);
    y += rowHeight + 3;
  });
  y += 6;

  sectionTitle("Care instructions");
  const noteLines = pdf.splitTextToSize(prescription.notes || "No additional instructions.", width - 12);
  const noteHeight = Math.max(22, noteLines.length * 4.5 + 11);
  ensure(noteHeight + 5);
  pdf.setFillColor(247, 244, 239);
  pdf.setDrawColor(217, 107, 50);
  pdf.roundedRect(left, y, width, noteHeight, 3, 3, "FD");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...INK);
  pdf.text(noteLines, left + 6, y + 8);
  y += noteHeight + 10;

  y = Math.min(y, 262);
  pdf.setDrawColor(...LINE);
  pdf.line(left, y, right, y);
  y += 7;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...INK);
  pdf.text(booking.doctorName, right, y, { align: "right" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...MUTED);
  pdf.text("Treating physician", right, y + 5, { align: "right" });
  pdf.text("This digitally generated prescription is part of your Schedula appointment record.", left, y + 5);

  footer();
  return pdf;
}

export function downloadPrescriptionPdf(booking: Booking, prescription: Prescription) {
  const pdf = createPrescriptionPdf(booking, prescription);
  pdf.save(`Schedula-Prescription-${booking.id}.pdf`);
}
