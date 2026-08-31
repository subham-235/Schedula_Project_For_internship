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