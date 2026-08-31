export type DoctorSlotStatus =
  | "available"
  | "booked";

export type DoctorSlot = {
  id: string;

  doctorId: string;

  date: string;

  time: string;

  status: DoctorSlotStatus;

  bookingId?: string;

  recurringGroupId?: string;

  createdAt: string;
};