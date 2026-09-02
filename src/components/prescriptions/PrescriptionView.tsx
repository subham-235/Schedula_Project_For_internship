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
    <article className="overflow-hidden rounded-[18px] border border-[#DDD7D0] bg-white shadow-[0_12px_35px_rgba(18,16,15,0.06)]">
      <header className="bg-[#12100F] px-5 py-5 text-white sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-[#F2C2A7] text-[#12100F]">
              <ClipboardPlus size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F2C2A7]/60">
                Medical prescription
              </p>
              <h2 className="mt-1 text-lg font-bold">Schedula care record</h2>
            </div>
          </div>
          <p className="text-xs text-[#F2C2A7]/65">
            Issued {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(prescription.updatedAt ?? prescription.createdAt))}
          </p>
        </div>
      </header>

      <div className="p-5 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#F7F4EF] p-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#746E68]">
              <UserRound size={14} /> Patient
            </p>
            <p className="mt-2 font-bold">{booking.patientName}</p>
            <p className="mt-1 text-xs text-[#746E68]">Age {booking.patientAge}</p>
          </div>
          <div className="rounded-xl bg-[#F7F4EF] p-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#746E68]">
              <Stethoscope size={14} /> Prescriber
            </p>
            <p className="mt-2 font-bold">{booking.doctorName}</p>
            <p className="mt-1 text-xs text-[#746E68]">{booking.specialty}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 rounded-xl border border-[#DDD7D0] px-4 py-3 text-xs font-medium text-[#746E68]">
          <span className="inline-flex items-center gap-2"><CalendarDays size={14} />{formatAppointmentFullDate(booking.startsAt)}</span>
          <span className="inline-flex items-center gap-2"><Clock3 size={14} />{formatAppointmentTime(booking.startsAt)}</span>
        </div>

        <section className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">Clinical assessment</p>
          <div className="mt-2 rounded-xl bg-[#F2C2A7] p-4 text-sm font-semibold leading-6 text-[#12100F]">
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
                <div key={medicine.id} className="flex gap-3 rounded-xl border border-[#DDD7D0] bg-[#FFFFFF] p-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">{index + 1}</span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-bold leading-5">{medicine.name}</p>
                    {(medicine.dosage || medicine.duration) && (
                      <p className="mt-1 text-xs font-semibold text-[var(--brand)]">
                        {[medicine.dosage, medicine.duration].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {medicine.instructions && <p className="mt-1 text-xs leading-5 text-[#746E68]">{medicine.instructions}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-[#DDD7D0] p-4 text-sm text-[#746E68]">No medications prescribed.</p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-[#F2C2A7] bg-[#F7F4EF] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D96B32]">Care instructions</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#12100F]">{prescription.notes || "No additional instructions."}</p>
        </section>
      </div>
    </article>
  );
}
