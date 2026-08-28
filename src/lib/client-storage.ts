import type { Booking } from "@/types/booking";

const BOOKINGS_KEY = "schedula-bookings";
const USER_KEY = "schedula-user";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor";
};

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) ?? "[]") as Booking[];
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking) {
  const existing = getBookings();
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...existing]));
}

export function getCurrentUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: StoredUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_KEY);
}
