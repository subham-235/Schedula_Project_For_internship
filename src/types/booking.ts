export type BookingAttachment = {
  name: string;

  type: string;

  size: number;

  dataUrl: string;
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled";

export type Booking = {
  id: string;

  doctorId: string;

  doctorName: string;

  specialty: string;

  doctorLocation?: string;

  slotId?: string;

  patientName: string;

  patientEmail: string;

  patientPhone: string;

  patientAge: number;

  reason: string;

  date: string;

  time: string;

  startsAt: string;

  fee: number;

  status: BookingStatus;

  createdAt: string;

  attachment?: BookingAttachment;
};