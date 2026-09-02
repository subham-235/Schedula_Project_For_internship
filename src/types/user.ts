export type UserRole = "patient" | "doctor";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;

  // Doctor-specific fields
  specialty?: string;
  registrationNumber?: string;
};

// Keeps compatibility with the original project
export type MockUser = User;

export type PatientProfile = {
  userId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  heightCm: string;
  weightKg: string;
  medicalConditions: string;
  allergies: string;
  currentMedications: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceExpiry: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  updatedAt: string;
};
