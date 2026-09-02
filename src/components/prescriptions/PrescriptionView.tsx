import {
  CalendarDays,
  ClipboardPlus,
  Clock3,
  Pill,
  Stethoscope,
  UserRound,
} from "lucide-react";

import type {
  Booking,
} from "@/types/booking";

import type {
  Prescription,
} from "@/types/prescription";

import {
  formatAppointmentFullDate,
  formatAppointmentTime,
} from "@/lib/appointment-utils";

export default function PrescriptionView({
  booking,
  prescription,
}: {
  booking: Booking;
  prescription: Prescription;
}) {
  const medicines = prescription.medicines?.length
    ? prescription.medicines
    : prescription.medications.map((medicine, index) => ({
        id: `legacy-${index}`,
        name: medicine,
        dosage: "",
        duration: "",
        instructions: "",
      }));

  return (
    <article className="overflow-hidden rounded-3xl border border-[#dce7e2] bg-white shadow-[0_12px_35px_rgba(27,68,56,0.06)]">
      <header className="bg-[#123d34] px-5 py-5 text-white sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-[#b9efcf] text-[#123d34]">
              <ClipboardPlus size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/60">
                Medical prescription
              </p>
              <h2 className="mt-1 text-lg font-bold">Schedula care record</h2>
            </div>
          </div>
          <p className="text-xs text-emerald-100/65">
            Issued {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(prescription.updatedAt ?? prescription.createdAt))}
          </p>
        </div>
      </header>

      <div className="p-5 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#f5f8f7] p-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7d8d87]">
              <UserRound size={14} /> Patient
            </p>
            <p className="mt-2 font-bold">{booking.patientName}</p>
            <p className="mt-1 text-xs text-[#71837c]">Age {booking.patientAge}</p>
          </div>
          <div className="rounded-2xl bg-[#f5f8f7] p-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7d8d87]">
              <Stethoscope size={14} /> Prescriber
            </p>
            <p className="mt-2 font-bold">{booking.doctorName}</p>
            <p className="mt-1 text-xs text-[#71837c]">{booking.specialty}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 rounded-2xl border border-[#e1eae6] px-4 py-3 text-xs font-medium text-[#657970]">
          <span className="inline-flex items-center gap-2"><CalendarDays size={14} />{formatAppointmentFullDate(booking.startsAt)}</span>
          <span className="inline-flex items-center gap-2"><Clock3 size={14} />{formatAppointmentTime(booking.startsAt)}</span>
        </div>

        <section className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">Clinical assessment</p>
          <div className="mt-2 rounded-2xl bg-[#e8f6ef] p-4 text-sm font-semibold leading-6 text-[#123d34]">
            {prescription.diagnosis}
          </div>
        </section>

        <section className="mt-6">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
            <Pill size={14} /> Rx - Medications
          </p>
          <div className="mt-3 space-y-2">
            {medicines.length ? (
              medicines.map((medicine, index) => (
                <div key={medicine.id} className="flex gap-3 rounded-2xl border border-[#e1eae6] bg-[#fbfdfc] p-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">{index + 1}</span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-bold leading-5">{medicine.name}</p>
                    {(medicine.dosage || medicine.duration) && (
                      <p className="mt-1 text-xs font-semibold text-[var(--brand)]">
                        {[medicine.dosage, medicine.duration].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {medicine.instructions && <p className="mt-1 text-xs leading-5 text-[#71837c]">{medicine.instructions}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-[#d4e1dc] p-4 text-sm text-[#71837c]">No medications prescribed.</p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Care instructions</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-amber-950">{prescription.notes || "No additional instructions."}</p>
        </section>
      </div>
    </article>
  );
}
