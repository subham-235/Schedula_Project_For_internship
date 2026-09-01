export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "missed";

export type AppointmentType =
  | "In-person"
  | "Video consultation"
  | "Follow-up";

export type Appointment = {
  id: string;

  patient: {
    name: string;

    initials: string;

    age: number;
  };

  clinician: string;

  specialty: string;

  startsAt: string;

  durationMinutes: number;

  status: AppointmentStatus;

  appointmentType: AppointmentType;

  reason: string;

  room: string;
};