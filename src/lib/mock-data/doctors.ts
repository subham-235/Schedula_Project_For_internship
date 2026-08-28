import doctorsJson from "./doctors.json";
import type { Doctor } from "@/types/doctor";

export const doctors = doctorsJson as Doctor[];

export const specialties = [
  "All",
  "General Medicine",
  "Dermatology",
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
] as const;
