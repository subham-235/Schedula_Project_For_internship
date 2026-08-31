import type {
  Booking,
} from "@/types/booking";

import type {
  Doctor,
} from "@/types/doctor";

import type {
  DoctorSlot,
} from "@/types/availability";

import type {
  User,
  UserRole,
} from "@/types/user";


const BOOKINGS_KEY =
  "schedula-bookings";

const USER_KEY =
  "schedula-user";

const REGISTERED_USERS_KEY =
  "schedula-registered-users";

const REGISTERED_DOCTORS_KEY =
  "schedula-registered-doctors";

const DOCTOR_SLOTS_KEY =
  "schedula-doctor-slots";

const SEEDED_DOCTORS_KEY =
  "schedula-seeded-slot-doctors";

const LATEST_BOOKING_ID_KEY =
  "schedula-latest-booking-id";


export type StoredUser = {
  id: string;

  name: string;

  email: string;

  role: UserRole;
};


/* =========================================
   CURRENT USER
========================================= */

export function getCurrentUser():
  StoredUser | null {

  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  try {
    const value =
      localStorage.getItem(
        USER_KEY
      );

    return value
      ? JSON.parse(value) as StoredUser
      : null;

  } catch {
    return null;
  }
}


export function saveCurrentUser(
  user: StoredUser
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}


export function clearCurrentUser() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    USER_KEY
  );
}


/* =========================================
   REGISTERED USERS
========================================= */

export function getRegisteredUsers():
  User[] {

  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const value =
      localStorage.getItem(
        REGISTERED_USERS_KEY
      );

    return value
      ? JSON.parse(value) as User[]
      : [];

  } catch {
    return [];
  }
}


export function saveRegisteredUser(
  user: User
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  const users =
    getRegisteredUsers();

  const existingIndex =
    users.findIndex(
      (item) =>
        item.id === user.id
    );

  if (
    existingIndex >= 0
  ) {
    users[existingIndex] =
      user;
  } else {
    users.push(user);
  }

  localStorage.setItem(
    REGISTERED_USERS_KEY,
    JSON.stringify(users)
  );
}


/* =========================================
   REGISTERED / UPDATED DOCTORS
========================================= */

export function getRegisteredDoctors():
  Doctor[] {

  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const value =
      localStorage.getItem(
        REGISTERED_DOCTORS_KEY
      );

    return value
      ? JSON.parse(value) as Doctor[]
      : [];

  } catch {
    return [];
  }
}


export function saveRegisteredDoctor(
  doctor: Doctor
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  const doctors =
    getRegisteredDoctors();

  const index =
    doctors.findIndex(
      (item) =>
        item.id === doctor.id
    );

  if (
    index >= 0
  ) {
    doctors[index] =
      doctor;
  } else {
    doctors.push(
      doctor
    );
  }

  localStorage.setItem(
    REGISTERED_DOCTORS_KEY,
    JSON.stringify(doctors)
  );
}


/*
  Static doctors.json + doctors saved/updated
  through localStorage.

  localStorage version overrides static doctor.
*/

export function mergeDoctorProfiles(
  baseDoctors: Doctor[],
  storedDoctors:
    Doctor[] =
      getRegisteredDoctors()
): Doctor[] {

  const map =
    new Map<string, Doctor>();

  baseDoctors.forEach(
    (doctor) => {
      map.set(
        doctor.id,
        doctor
      );
    }
  );

  storedDoctors.forEach(
    (doctor) => {

      const oldDoctor =
        map.get(
          doctor.id
        );

      map.set(
        doctor.id,
        oldDoctor
          ? {
              ...oldDoctor,
              ...doctor,
            }
          : doctor
      );
    }
  );

  return Array.from(
    map.values()
  );
}


/* =========================================
   BOOKINGS
========================================= */

export function getBookings():
  Booking[] {

  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const value =
      localStorage.getItem(
        BOOKINGS_KEY
      );

    return value
      ? JSON.parse(value) as Booking[]
      : [];

  } catch {
    return [];
  }
}


export function saveBooking(
  booking: Booking
): boolean {

  if (
    typeof window === "undefined"
  ) {
    return false;
  }

  try {
    const bookings =
      getBookings();

    localStorage.setItem(
      BOOKINGS_KEY,
      JSON.stringify([
        booking,
        ...bookings,
      ])
    );

    return true;

  } catch (
    error
  ) {
    console.error(
      "Unable to save booking:",
      error
    );

    return false;
  }
}


/* =========================================
   LATEST BOOKING
========================================= */

export function saveLatestBookingId(
  bookingId: string
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    LATEST_BOOKING_ID_KEY,
    bookingId
  );
}


export function getLatestBooking():
  Booking | null {

  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  try {
    const id =
      localStorage.getItem(
        LATEST_BOOKING_ID_KEY
      );

    if (!id) {
      return null;
    }

    return (
      getBookings().find(
        (booking) =>
          booking.id === id
      ) ?? null
    );

  } catch {
    return null;
  }
}


/* =========================================
   DOCTOR SLOT HELPERS
========================================= */

function toDateKey(
  date: Date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}


function timeTo24Hour(
  value: string
) {
  if (
    !value.includes(
      " "
    )
  ) {
    return value;
  }

  const [
    clock,
    period,
  ] =
    value.split(" ");

  let [
    hours,
    minutes,
  ] =
    clock
      .split(":")
      .map(Number);

  if (
    period === "PM" &&
    hours !== 12
  ) {
    hours += 12;
  }

  if (
    period === "AM" &&
    hours === 12
  ) {
    hours = 0;
  }

  return `${String(
    hours
  ).padStart(
    2,
    "0"
  )}:${String(
    minutes
  ).padStart(
    2,
    "0"
  )}`;
}


function slotTimestamp(
  slot: DoctorSlot
) {
  return new Date(
    `${slot.date}T${timeTo24Hour(
      slot.time
    )}:00`
  ).getTime();
}


/* =========================================
   GET SLOTS
========================================= */

export function getDoctorSlots(
  doctorId?: string
): DoctorSlot[] {

  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const value =
      localStorage.getItem(
        DOCTOR_SLOTS_KEY
      );

    const slots =
      value
        ? JSON.parse(
            value
          ) as DoctorSlot[]
        : [];

    const filtered =
      doctorId
        ? slots.filter(
            (slot) =>
              slot.doctorId ===
              doctorId
          )
        : slots;

    return filtered.sort(
      (a, b) =>
        slotTimestamp(a) -
        slotTimestamp(b)
    );

  } catch {
    return [];
  }
}


/* =========================================
   ADD SINGLE SLOT
========================================= */

export function saveDoctorSlot(
  slot: DoctorSlot
): boolean {

  if (
    typeof window === "undefined"
  ) {
    return false;
  }

  const slots =
    getDoctorSlots();

  const duplicate =
    slots.some(
      (item) =>
        item.doctorId ===
          slot.doctorId &&
        item.date ===
          slot.date &&
        item.time ===
          slot.time
    );

  if (
    duplicate
  ) {
    return false;
  }

  try {
    localStorage.setItem(
      DOCTOR_SLOTS_KEY,
      JSON.stringify([
        ...slots,
        slot,
      ])
    );

    return true;

  } catch {
    return false;
  }
}


/* =========================================
   ADD MULTIPLE / RECURRING SLOTS
========================================= */

export function saveDoctorSlots(
  newSlots: DoctorSlot[]
): number {

  if (
    typeof window === "undefined"
  ) {
    return 0;
  }

  const existing =
    getDoctorSlots();

  const keys =
    new Set(
      existing.map(
        (slot) =>
          `${slot.doctorId}|${slot.date}|${slot.time}`
      )
    );

  const accepted:
    DoctorSlot[] =
      [];

  newSlots.forEach(
    (slot) => {

      const key =
        `${slot.doctorId}|${slot.date}|${slot.time}`;

      if (
        keys.has(key)
      ) {
        return;
      }

      keys.add(key);

      accepted.push(
        slot
      );
    }
  );

  if (
    accepted.length === 0
  ) {
    return 0;
  }

  try {
    localStorage.setItem(
      DOCTOR_SLOTS_KEY,
      JSON.stringify([
        ...existing,
        ...accepted,
      ])
    );

    return accepted.length;

  } catch {
    return 0;
  }
}


/* =========================================
   DELETE SLOT
========================================= */

export function deleteDoctorSlot(
  slotId: string
): boolean {

  if (
    typeof window === "undefined"
  ) {
    return false;
  }

  const slots =
    getDoctorSlots();

  const slot =
    slots.find(
      (item) =>
        item.id === slotId
    );

  if (
    !slot ||
    slot.status === "booked"
  ) {
    return false;
  }

  try {
    localStorage.setItem(
      DOCTOR_SLOTS_KEY,
      JSON.stringify(
        slots.filter(
          (item) =>
            item.id !== slotId
        )
      )
    );

    return true;

  } catch {
    return false;
  }
}


/* =========================================
   AVAILABLE SLOTS
========================================= */

export function getAvailableSlotsForDoctor(
  doctorId: string
): DoctorSlot[] {

  const now =
    Date.now();

  return getDoctorSlots(
    doctorId
  ).filter(
    (slot) =>
      slot.status ===
        "available" &&
      slotTimestamp(
        slot
      ) > now
  );
}


/* =========================================
   BOOK SLOT
========================================= */

export function markDoctorSlotBooked(
  slotId: string,
  bookingId: string
): boolean {

  if (
    typeof window === "undefined"
  ) {
    return false;
  }

  const slots =
    getDoctorSlots();

  const index =
    slots.findIndex(
      (slot) =>
        slot.id === slotId
    );

  if (
    index < 0 ||
    slots[index].status !==
      "available"
  ) {
    return false;
  }

  slots[index] = {
    ...slots[index],

    status:
      "booked",

    bookingId,
  };

  try {
    localStorage.setItem(
      DOCTOR_SLOTS_KEY,
      JSON.stringify(slots)
    );

    return true;

  } catch {
    return false;
  }
}


/* =========================================
   SAVE BOOKING + LOCK SLOT
========================================= */

export function saveBookingWithSlot(
  booking: Booking,
  slotId: string
): boolean {

  if (
    typeof window === "undefined"
  ) {
    return false;
  }

  const slots =
    getDoctorSlots();

  const slotIndex =
    slots.findIndex(
      (slot) =>
        slot.id === slotId
    );

  if (
    slotIndex < 0 ||
    slots[
      slotIndex
    ].status !==
      "available"
  ) {
    return false;
  }

  const bookings =
    getBookings();

  slots[
    slotIndex
  ] = {
    ...slots[
      slotIndex
    ],

    status:
      "booked",

    bookingId:
      booking.id,
  };

  try {
    localStorage.setItem(
      DOCTOR_SLOTS_KEY,
      JSON.stringify(
        slots
      )
    );

    localStorage.setItem(
      BOOKINGS_KEY,
      JSON.stringify([
        booking,
        ...bookings,
      ])
    );

    return true;

  } catch (
    error
  ) {
    console.error(
      error
    );

    return false;
  }
}


/* =========================================
   INITIAL LEGACY SLOT SEED

   Converts doctors.json times into real
   dated slots once.
========================================= */

export function ensureDoctorSlotsSeeded(
  doctorId: string,
  legacyTimes: string[],
  days = 5
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  let seededDoctors:
    string[] =
      [];

  try {
    seededDoctors =
      JSON.parse(
        localStorage.getItem(
          SEEDED_DOCTORS_KEY
        ) ?? "[]"
      ) as string[];

  } catch {
    seededDoctors =
      [];
  }

  if (
    seededDoctors.includes(
      doctorId
    )
  ) {
    return;
  }

  const now =
    new Date();

  const generated:
    DoctorSlot[] =
      [];

  for (
    let day = 0;
    day < days;
    day++
  ) {
    const date =
      new Date(now);

    date.setDate(
      now.getDate() +
        day
    );

    const dateKey =
      toDateKey(date);

    legacyTimes.forEach(
      (
        slotTime,
        index
      ) => {

        generated.push({
          id:
            `slot-${doctorId}-${dateKey}-${index}-${Date.now()}`,

          doctorId,

          date:
            dateKey,

          time:
            slotTime,

          status:
            "available",

          createdAt:
            new Date()
              .toISOString(),
        });
      }
    );
  }

  saveDoctorSlots(
    generated
  );

  localStorage.setItem(
    SEEDED_DOCTORS_KEY,
    JSON.stringify([
      ...seededDoctors,
      doctorId,
    ])
  );
}