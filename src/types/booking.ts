export type Booking = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  reason: string;
  date: string;
  time: string;
  startsAt: string;
  fee: number;
  status: "confirmed";
  createdAt: string;
};
