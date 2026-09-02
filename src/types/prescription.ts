export type PrescriptionMedicine = {
  id: string;
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
};

export type Prescription = {
  id: string;

  bookingId: string;

  doctorId: string;

  doctorName: string;

  patientName: string;

  diagnosis: string;

  medications: string[];

  // Structured medicine details used by the Day 4 prescription workflow.
  // The legacy medications array is retained for existing saved records.
  medicines?: PrescriptionMedicine[];

  notes: string;

  createdAt: string;

  updatedAt?: string;
};
