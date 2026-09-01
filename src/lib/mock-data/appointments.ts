import type {
  Appointment,
} from "@/types/appointment";

export const appointments:
  Appointment[] = [
  {
    id:
      "apt-1042",

    patient: {
      name:
        "Maya Patel",

      initials:
        "MP",

      age:
        34,
    },

    clinician:
      "Dr. Anika Rao",

    specialty:
      "General Medicine",

    startsAt:
      "2026-09-02T09:00:00",

    durationMinutes:
      30,

    status:
      "confirmed",

    appointmentType:
      "In-person",

    reason:
      "Follow-up consultation",

    room:
      "Room 04",
  },

  {
    id:
      "apt-1043",

    patient: {
      name:
        "Ethan Brooks",

      initials:
        "EB",

      age:
        41,
    },

    clinician:
      "Dr. Anika Rao",

    specialty:
      "General Medicine",

    startsAt:
      "2026-09-03T10:00:00",

    durationMinutes:
      45,

    status:
      "pending",

    appointmentType:
      "Video consultation",

    reason:
      "Annual wellness visit",

    room:
      "Online",
  },

  {
    id:
      "apt-1044",

    patient: {
      name:
        "Sofia Chen",

      initials:
        "SC",

      age:
        28,
    },

    clinician:
      "Dr. Martin Cole",

    specialty:
      "Dermatology",

    startsAt:
      "2026-08-28T11:15:00",

    durationMinutes:
      30,

    status:
      "completed",

    appointmentType:
      "Follow-up",

    reason:
      "Skin consultation",

    room:
      "Room 12",
  },

  {
    id:
      "apt-1045",

    patient: {
      name:
        "Noah Williams",

      initials:
        "NW",

      age:
        52,
    },

    clinician:
      "Dr. Anika Rao",

    specialty:
      "General Medicine",

    startsAt:
      "2026-08-28T14:00:00",

    durationMinutes:
      30,

    status:
      "cancelled",

    appointmentType:
      "In-person",

    reason:
      "Blood pressure review",

    room:
      "Room 04",
  },
];