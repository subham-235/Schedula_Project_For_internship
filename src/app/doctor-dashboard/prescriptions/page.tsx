"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CircleUserRound,
  FileText,
  LayoutDashboard,
  ListChecks,
  Pencil,
  Pill,
  Plus,
  Search,
  Save,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";

import PrescriptionPdfButton from "@/components/prescriptions/PrescriptionPdfButton";
import PrescriptionView from "@/components/prescriptions/PrescriptionView";
import {
  getBookingById,
  getBookingsForDoctor,
  getCurrentUser,
  getPrescriptions,
  getRegisteredDoctors,
  mergeDoctorProfiles,
  savePrescription,
} from "@/lib/client-storage";
import { doctors } from "@/lib/mock-data/doctors";
import type { Booking } from "@/types/booking";
import type { Doctor } from "@/types/doctor";
import type { Prescription, PrescriptionMedicine } from "@/types/prescription";

type PrescriptionRecord = {
  prescription: Prescription;
  booking: Booking;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function emptyMedicine(): PrescriptionMedicine {
  return {
    id: `medicine-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    dosage: "",
    duration: "",
    instructions: "",
  };
}

export default function DoctorPrescriptionsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Doctor | null>(null);
  const [records, setRecords] = useState<PrescriptionRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formBookingId, setFormBookingId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [instructions, setInstructions] = useState("");
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([emptyMedicine()]);
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "doctor") {
      router.replace("/login");
      return;
    }
    const profiles = mergeDoctorProfiles(doctors, getRegisteredDoctors());
    const doctor = profiles.find((item) => item.userId === user.id) ??
      profiles.find((item) => item.id === user.id) ??
      profiles.find((item) => normalize(item.name) === normalize(user.name));
    if (!doctor) {
      router.replace("/doctor-dashboard");
      return;
    }
    const items = getPrescriptions()
      .filter((item) => item.doctorId === doctor.id || normalize(item.doctorName) === normalize(doctor.name))
      .map((prescription) => {
        const booking = getBookingById(prescription.bookingId);
        return booking ? { prescription, booking } : null;
      })
      .filter((item): item is PrescriptionRecord => item !== null)
      .sort((a, b) => new Date(b.prescription.updatedAt ?? b.prescription.createdAt).getTime() - new Date(a.prescription.updatedAt ?? a.prescription.createdAt).getTime());
    setCompletedBookings(
      getBookingsForDoctor(doctor.id, doctor.name).filter(
        (booking) => booking.status === "completed",
      ),
    );
    setProfile(doctor);
    setRecords(items);
    setSelectedId(items[0]?.prescription.id ?? "");
    setLoading(false);
  }, [router]);

  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return records;
    return records.filter(({ booking, prescription }) =>
      booking.patientName.toLowerCase().includes(search) ||
      prescription.diagnosis.toLowerCase().includes(search) ||
      prescription.medications.some((medicine) => medicine.toLowerCase().includes(search)),
    );
  }, [query, records]);

  const selected = records.find((item) => item.prescription.id === selectedId) ?? visible[0] ?? null;

  const refreshRecords = () => {
    if (!profile) return;
    const items = getPrescriptions()
      .filter((item) => item.doctorId === profile.id || normalize(item.doctorName) === normalize(profile.name))
      .map((prescription) => {
        const booking = getBookingById(prescription.bookingId);
        return booking ? { prescription, booking } : null;
      })
      .filter((item): item is PrescriptionRecord => item !== null)
      .sort((a, b) => new Date(b.prescription.updatedAt ?? b.prescription.createdAt).getTime() - new Date(a.prescription.updatedAt ?? a.prescription.createdAt).getTime());
    setRecords(items);
    return items;
  };

  const openCreate = () => {
    const withoutPrescription = completedBookings.find(
      (booking) => !records.some((item) => item.booking.id === booking.id),
    );
    setEditingId("");
    setFormBookingId(withoutPrescription?.id ?? completedBookings[0]?.id ?? "");
    setDiagnosis("");
    setInstructions("");
    setMedicines([emptyMedicine()]);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (record: PrescriptionRecord) => {
    const existingMedicines = record.prescription.medicines?.length
      ? record.prescription.medicines
      : record.prescription.medications.map((name, index) => ({
          id: `legacy-${index}`,
          name,
          dosage: "",
          duration: "",
          instructions: "",
        }));
    setEditingId(record.prescription.id);
    setFormBookingId(record.booking.id);
    setDiagnosis(record.prescription.diagnosis);
    setInstructions(record.prescription.notes);
    setMedicines(existingMedicines.length ? existingMedicines : [emptyMedicine()]);
    setFormError("");
    setFormOpen(true);
  };

  const updateMedicine = (
    id: string,
    field: keyof Omit<PrescriptionMedicine, "id">,
    value: string,
  ) => {
    setMedicines((current) =>
      current.map((medicine) =>
        medicine.id === id ? { ...medicine, [field]: value } : medicine,
      ),
    );
  };

  const saveForm = () => {
    if (!profile) return;
    const booking = completedBookings.find((item) => item.id === formBookingId);
    if (!booking) {
      setFormError("Select a completed appointment.");
      return;
    }
    if (!diagnosis.trim()) {
      setFormError("Diagnosis is required.");
      return;
    }
    const cleanedMedicines = medicines
      .map((medicine) => ({
        ...medicine,
        name: medicine.name.trim(),
        dosage: medicine.dosage.trim(),
        duration: medicine.duration.trim(),
        instructions: medicine.instructions.trim(),
      }))
      .filter((medicine) => medicine.name);
    if (!cleanedMedicines.length) {
      setFormError("Add at least one medicine.");
      return;
    }
    if (cleanedMedicines.some((medicine) => !medicine.dosage || !medicine.duration)) {
      setFormError("Dosage and duration are required for every medicine.");
      return;
    }
    const existing = editingId
      ? records.find((item) => item.prescription.id === editingId)?.prescription
      : undefined;
    const now = new Date().toISOString();
    const prescription: Prescription = {
      id: existing?.id ?? `prescription-${Date.now()}`,
      bookingId: booking.id,
      doctorId: profile.id,
      doctorName: profile.name,
      patientName: booking.patientName,
      diagnosis: diagnosis.trim(),
      medicines: cleanedMedicines,
      medications: cleanedMedicines.map((medicine) =>
        [medicine.name, medicine.dosage, medicine.duration, medicine.instructions]
          .filter(Boolean)
          .join(" - "),
      ),
      notes: instructions.trim(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    if (!savePrescription(prescription)) {
      setFormError("Unable to save the prescription. Please try again.");
      return;
    }
    const updated = refreshRecords();
    setSelectedId(prescription.id);
    setFormOpen(false);
    setMessage(existing ? "Prescription updated. The patient record is now synchronized." : "Prescription created. It is now available to the patient.");
    if (!updated?.length) setRecords([{ prescription, booking }]);
    window.setTimeout(() => setMessage(""), 4000);
  };

  if (loading || !profile) {
    return <main className="grid min-h-screen place-items-center bg-[#f3f7f5] text-sm text-[var(--muted)]">Loading prescriptions...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f3f7f5] text-[#17352d] lg:pl-[17.5rem]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17.5rem] flex-col bg-[#123d34] px-4 text-white lg:flex">
        <Link href="/" className="flex h-20 items-center gap-3 border-b border-white/10 px-2">
          <div className="grid size-10 place-items-center rounded-xl bg-[#b9efcf] text-[#123d34]"><Stethoscope size={21} /></div>
          <div><p className="text-lg font-bold">Schedula</p><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">Doctor workspace</p></div>
        </Link>
        <nav className="mt-7 space-y-1.5" aria-label="Doctor workspace navigation">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100/40">Workspace</p>
          <Link href="/doctor-dashboard" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-emerald-50/70 hover:bg-white/10 hover:text-white"><LayoutDashboard size={18} />Overview</Link>
          <Link href="/doctor-dashboard/appointments" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-emerald-50/70 hover:bg-white/10 hover:text-white"><ListChecks size={18} />Appointments</Link>
          <Link href="/doctor-dashboard/calendar" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-emerald-50/70 hover:bg-white/10 hover:text-white"><CalendarDays size={18} />Calendar</Link>
          <Link href="/doctor-dashboard/prescriptions" className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-3 text-sm font-semibold text-[#123d34] shadow-sm"><Pill size={18} />Prescriptions</Link>
          <Link href="/doctor-dashboard/profile" className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-emerald-50/70 hover:bg-white/10 hover:text-white"><CircleUserRound size={18} />Profile</Link>
        </nav>
        <div className="mt-auto mb-4 rounded-2xl border border-white/10 bg-white/7 p-4">
          <p className="truncate text-sm font-semibold">{profile.name}</p>
          <p className="mt-1 truncate text-xs text-emerald-100/55">{profile.specialty}</p>
        </div>
      </aside>

      <div className="mx-auto max-w-[94rem] px-4 py-6 sm:px-7 xl:px-10">
        <section className="relative overflow-hidden rounded-3xl bg-[#176b55] p-6 text-white shadow-[0_18px_50px_rgba(19,82,65,0.16)] sm:p-8">
          <div className="absolute -right-20 -top-28 size-72 rounded-full border-[44px] border-white/6" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/75">Clinical records</p>
          <h1 className="relative mt-2 text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="relative mt-2 max-w-2xl text-sm leading-6 text-emerald-50/75">Review issued prescriptions, find a patient record, and download a polished copy for your files.</p>
        </section>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#71837c]">
            Prescriptions can only be created for completed appointments.
          </p>
          <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123d34] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d4f3d]">
            <Plus size={16} /> New prescription
          </button>
        </div>

        {message && (
          <div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {message}
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-[#dce7e2] bg-white p-4"><p className="text-xs font-semibold text-[#71837c]">Issued records</p><p className="mt-1 text-2xl font-bold">{records.length}</p></article>
          <article className="rounded-2xl border border-[#dce7e2] bg-white p-4"><p className="text-xs font-semibold text-[#71837c]">Patients covered</p><p className="mt-1 text-2xl font-bold">{new Set(records.map((item) => item.booking.patientEmail)).size}</p></article>
          <article className="rounded-2xl border border-[#dce7e2] bg-white p-4"><p className="text-xs font-semibold text-[#71837c]">Latest issued</p><p className="mt-1 text-sm font-bold">{records[0] ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(records[0].prescription.updatedAt ?? records[0].prescription.createdAt)) : "No records yet"}</p></article>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <section className="h-fit overflow-hidden rounded-2xl border border-[#dce7e2] bg-white shadow-[0_8px_24px_rgba(27,68,56,0.04)]">
            <div className="border-b border-[#e1eae6] p-4">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82918c]" size={16} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patient or diagnosis" className="w-full rounded-xl border border-[#dce7e2] bg-[#f8faf9] py-3 pl-10 pr-3 text-sm outline-none focus:border-[var(--brand)]" />
              </label>
            </div>
            {visible.length ? (
              <div className="max-h-[42rem] divide-y divide-[#e8efec] overflow-y-auto">
                {visible.map(({ prescription, booking }) => (
                  <button key={prescription.id} type="button" onClick={() => setSelectedId(prescription.id)} className={`w-full p-4 text-left transition ${selected?.prescription.id === prescription.id ? "bg-[#edf7f2] shadow-[inset_3px_0_0_#176b55]" : "hover:bg-[#f8faf9]"}`}>
                    <div className="flex items-start gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e7f5ef] text-[var(--brand)]"><FileText size={17} /></div>
                      <div className="min-w-0"><p className="truncate text-sm font-bold">{booking.patientName}</p><p className="mt-1 line-clamp-1 text-xs text-[#71837c]">{prescription.diagnosis}</p><p className="mt-2 text-[10px] font-semibold text-[var(--brand)]">{prescription.medications.length} medication{prescription.medications.length === 1 ? "" : "s"}</p></div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center"><Pill className="mx-auto text-stone-300" size={24} /><p className="mt-3 text-sm font-bold">No prescriptions found</p><p className="mt-1 text-xs text-[#71837c]">Completed appointment prescriptions will appear here.</p></div>
            )}
          </section>

          <section className="min-w-0">
            {selected ? (
              <>
                <div className="mb-4 flex flex-wrap justify-end gap-2">
                  <button type="button" onClick={() => openEdit(selected)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#b9d3c8] bg-white px-4 py-3 text-sm font-semibold text-[var(--brand)] hover:bg-[#edf7f2]">
                    <Pencil size={16} /> Edit prescription
                  </button>
                  <PrescriptionPdfButton booking={selected.booking} prescription={selected.prescription} />
                </div>
                <PrescriptionView booking={selected.booking} prescription={selected.prescription} />
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#ccdcd5] bg-white p-12 text-center"><Pill className="mx-auto text-stone-300" size={28} /><p className="mt-4 font-bold">Select a prescription</p><p className="mt-1 text-sm text-[#71837c]">Choose a patient record to review it here.</p></div>
            )}
          </section>
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b231e]/60 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="prescription-form-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#dce7e2] bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">Prescription editor</p>
                <h2 id="prescription-form-title" className="mt-1 text-xl font-bold">{editingId ? "Update prescription" : "Create prescription"}</h2>
                <p className="mt-1 text-xs text-[#71837c]">Changes are immediately reflected in the patient’s completed appointment.</p>
              </div>
              <button type="button" aria-label="Close prescription editor" onClick={() => setFormOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f2f6f4] text-[#657970] hover:bg-[#e7efeb]"><X size={18} /></button>
            </header>

            <div className="space-y-5 p-5 sm:p-6">
              {formError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{formError}</div>}

              <label className="block">
                <span className="text-sm font-semibold">Completed appointment</span>
                <select value={formBookingId} disabled={Boolean(editingId)} onChange={(event) => setFormBookingId(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce7e2] bg-[#f8faf9] px-4 py-3 text-sm outline-none focus:border-[var(--brand)] disabled:opacity-65">
                  <option value="">Select patient appointment</option>
                  {completedBookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>{booking.patientName} - {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(booking.startsAt))}</option>
                  ))}
                </select>
                {!completedBookings.length && <p className="mt-2 text-xs text-amber-700">No completed appointments are available yet.</p>}
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Diagnosis</span>
                <textarea rows={3} value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} placeholder="Enter the clinical diagnosis" className="mt-2 w-full resize-none rounded-xl border border-[#dce7e2] bg-[#f8faf9] px-4 py-3 text-sm leading-6 outline-none focus:border-[var(--brand)]" />
              </label>

              <section>
                <div className="flex items-center justify-between gap-3">
                  <div><h3 className="text-sm font-semibold">Medicines</h3><p className="mt-1 text-xs text-[#71837c]">Include dosage, duration, and patient-facing directions.</p></div>
                  <button type="button" onClick={() => setMedicines((current) => [...current, emptyMedicine()])} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#b9d3c8] px-3 py-2 text-xs font-semibold text-[var(--brand)]"><Plus size={14} /> Add medicine</button>
                </div>

                <div className="mt-3 space-y-3">
                  {medicines.map((medicine, index) => (
                    <div key={medicine.id} className="rounded-2xl border border-[#dce7e2] bg-[#fbfdfc] p-4">
                      <div className="flex items-center justify-between"><p className="text-xs font-bold text-[var(--brand)]">Medicine {index + 1}</p><button type="button" aria-label={`Remove medicine ${index + 1}`} disabled={medicines.length === 1} onClick={() => setMedicines((current) => current.filter((item) => item.id !== medicine.id))} className="grid size-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-30"><Trash2 size={15} /></button></div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <label className="text-xs font-semibold text-[#657970]">Medicine name<input value={medicine.name} onChange={(event) => updateMedicine(medicine.id, "name", event.target.value)} placeholder="e.g. Paracetamol 500 mg" className="mt-1.5 w-full rounded-xl border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17352d] outline-none focus:border-[var(--brand)]" /></label>
                        <label className="text-xs font-semibold text-[#657970]">Dosage<input value={medicine.dosage} onChange={(event) => updateMedicine(medicine.id, "dosage", event.target.value)} placeholder="e.g. 1 tablet twice daily" className="mt-1.5 w-full rounded-xl border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17352d] outline-none focus:border-[var(--brand)]" /></label>
                        <label className="text-xs font-semibold text-[#657970]">Duration<input value={medicine.duration} onChange={(event) => updateMedicine(medicine.id, "duration", event.target.value)} placeholder="e.g. 5 days" className="mt-1.5 w-full rounded-xl border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17352d] outline-none focus:border-[var(--brand)]" /></label>
                        <label className="text-xs font-semibold text-[#657970]">Medicine instructions<input value={medicine.instructions} onChange={(event) => updateMedicine(medicine.id, "instructions", event.target.value)} placeholder="e.g. Take after food" className="mt-1.5 w-full rounded-xl border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17352d] outline-none focus:border-[var(--brand)]" /></label>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <label className="block">
                <span className="text-sm font-semibold">General instructions</span>
                <textarea rows={4} value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Diet, activity, follow-up, warning signs, or other care instructions" className="mt-2 w-full resize-none rounded-xl border border-[#dce7e2] bg-[#f8faf9] px-4 py-3 text-sm leading-6 outline-none focus:border-[var(--brand)]" />
              </label>

              <div className="flex flex-col-reverse gap-2 border-t border-[#e1eae6] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border border-[#dce7e2] px-5 py-3 text-sm font-semibold">Cancel</button>
                <button type="button" onClick={saveForm} disabled={!completedBookings.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-50"><Save size={16} />{editingId ? "Update prescription" : "Save prescription"}</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
