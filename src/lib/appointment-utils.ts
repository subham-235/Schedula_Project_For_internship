import type {
  Booking,
} from "@/types/booking";

export function isAppointmentPast(
  booking: Booking
) {
  return (
    new Date(
      booking.startsAt
    ).getTime() <= Date.now()
  );
}

export function isAppointmentFuture(
  booking: Booking
) {
  return (
    new Date(
      booking.startsAt
    ).getTime() > Date.now()
  );
}

export function isUpcomingAppointment(
  booking: Booking
) {
  return (
    booking.status === "confirmed" &&
    isAppointmentFuture(booking)
  );
}

export function isDashboardUpcoming(
  booking: Booking
) {
  return (
    (
      booking.status === "pending" ||
      booking.status === "confirmed"
    ) &&
    isAppointmentFuture(booking)
  );
}

export function canConfirmAppointment(
  booking: Booking
) {
  return booking.status === "pending";
}

export function canRescheduleAppointment(
  booking: Booking
) {
  return (
    booking.status === "confirmed" &&
    isAppointmentFuture(booking)
  );
}

export function canCancelAppointment(
  booking: Booking
) {
  return (
    booking.status === "confirmed" &&
    isAppointmentFuture(booking)
  );
}

export function canCompleteAppointment(
  booking: Booking
) {
  return (
    booking.status === "confirmed" &&
    isAppointmentPast(booking)
  );
}

export function canMarkMissed(
  booking: Booking
) {
  return (
    booking.status === "confirmed" &&
    isAppointmentPast(booking)
  );
}

export function formatAppointmentDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );
}

export function formatAppointmentFullDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );
}

export function formatAppointmentTime(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(
    new Date(value)
  );
}