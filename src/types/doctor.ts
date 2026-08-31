export type Doctor = {
  id: string;

  // Links the doctor profile with login account
  userId?: string;

  name: string;

  initials: string;

  image?: string;

  email?: string;

  phone?: string;

  registrationNumber?: string;

  specialty: string;

  experience: number;

  rating: number;

  reviews: number;

  location: string;

  fee: number;

  availability: string;

  bio: string;

  education: string[];

  languages: string[];

  /*
    Kept for compatibility with old mock doctors.

    These values are only used to seed initial
    dated availability once.
  */
  slots: string[];
};