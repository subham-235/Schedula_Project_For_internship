export type Prescription = {
  id: string;

  bookingId: string;

  doctorId: string;

  doctorName: string;

  patientName: string;

  diagnosis: string;

  medications: string[];

  notes: string;

  createdAt: string;

  updatedAt?: string;
};