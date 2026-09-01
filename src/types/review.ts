export type DoctorReview = {
  id: string;

  bookingId: string;

  doctorId: string;

  patientId?: string;

  patientEmail: string;

  rating: number;

  comment: string;

  createdAt: string;
};