"use client";

import Link from "next/link";

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Navbar from "@/components/layout/Navbar";

import {
  users,
} from "@/lib/mock-data/users";

import {
  specialties,
} from "@/lib/mock-data/doctors";

import {
  getRegisteredUsers,
  saveRegisteredDoctor,
  saveRegisteredUser,
} from "@/lib/client-storage";

import type {
  User,
  UserRole,
} from "@/types/user";

import type {
  Doctor,
} from "@/types/doctor";


export default function SignupPage() {
  const router =
    useRouter();

  const [
    role,
    setRole,
  ] =
    useState<UserRole>(
      "patient"
    );

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    specialty,
    setSpecialty,
  ] =
    useState("");

  const [
    registrationNumber,
    setRegistrationNumber,
  ] =
    useState("");

  const [
    qualification,
    setQualification,
  ] =
    useState("");

  const [
    experience,
    setExperience,
  ] =
    useState("");

  const [
    location,
    setLocation,
  ] =
    useState("");

  const [
    fee,
    setFee,
  ] =
    useState("");

  const [
    languages,
    setLanguages,
  ] =
    useState(
      "English"
    );

  const [
    bio,
    setBio,
  ] =
    useState("");

  const [
    image,
    setImage,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const generateInitials =
    (
      value:
        string
    ) =>
      value
        .split(" ")
        .filter(Boolean)
        .filter(
          (part) =>
            part
              .toLowerCase() !==
            "dr."
        )
        .slice(
          0,
          2
        )
        .map(
          (part) =>
            part[0]
              ?.toUpperCase()
        )
        .join("");


  const submit = (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !name.trim() ||
      !normalizedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please complete all required fields."
      );

      return;
    }

    if (
      !/^\S+@\S+\.\S+$/.test(
        normalizedEmail
      )
    ) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    if (
      password.length <
      6
    ) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    const registeredUsers =
      getRegisteredUsers();

    const duplicate =
      [
        ...users,
        ...registeredUsers,
      ].some(
        (user) =>
          user.email
            .toLowerCase() ===
          normalizedEmail
      );

    if (
      duplicate
    ) {
      setError(
        "An account with this email already exists."
      );

      return;
    }


    if (
      role === "doctor"
    ) {
      const cleanPhone =
        phone.replace(
          /\D/g,
          ""
        );

      if (
        !/^\d{10}$/.test(
          cleanPhone
        )
      ) {
        setError(
          "Please enter a valid 10-digit phone number."
        );

        return;
      }

      if (
        !specialty
      ) {
        setError(
          "Please select your medical specialty."
        );

        return;
      }

      if (
        !registrationNumber.trim()
      ) {
        setError(
          "Please enter your medical registration number."
        );

        return;
      }

      if (
        !qualification.trim()
      ) {
        setError(
          "Please enter your qualification."
        );

        return;
      }

      if (
        experience === "" ||
        Number(
          experience
        ) < 0
      ) {
        setError(
          "Please enter valid years of experience."
        );

        return;
      }

      if (
        !location.trim()
      ) {
        setError(
          "Please enter your clinic location."
        );

        return;
      }

      if (
        !fee ||
        Number(
          fee
        ) <= 0
      ) {
        setError(
          "Please enter a valid consultation fee."
        );

        return;
      }

      if (
        !bio.trim()
      ) {
        setError(
          "Please add a short professional bio."
        );

        return;
      }
    }


    const newId =
      role === "doctor"
        ? `doc-${Date.now()}`
        : `patient-${Date.now()}`;


    const newUser:
      User = {
      id:
        newId,

      name:
        name.trim(),

      email:
        normalizedEmail,

      password,

      role,

      ...(role ===
      "doctor"
        ? {
            specialty,

            registrationNumber:
              registrationNumber.trim(),
          }
        : {}),
    };


    setLoading(
      true
    );

    saveRegisteredUser(
      newUser
    );


    if (
      role === "doctor"
    ) {
      const doctorProfile:
        Doctor = {
        id:
          newId,

        userId:
          newId,

        name:
          name.trim(),

        initials:
          generateInitials(
            name
          ),

        image:
          image.trim() ||
          undefined,

        email:
          normalizedEmail,

        phone:
          phone.replace(
            /\D/g,
            ""
          ),

        registrationNumber:
          registrationNumber.trim(),

        specialty,

        experience:
          Number(
            experience
          ),

        rating:
          0,

        reviews:
          0,

        location:
          location.trim(),

        fee:
          Number(
            fee
          ),

        availability:
          "No slots published yet",

        bio:
          bio.trim(),

        education: [
          qualification.trim(),
        ],

        languages:
          languages
            .split(",")
            .map(
              (item) =>
                item.trim()
            )
            .filter(
              Boolean
            ),

        /*
          Doctor will create availability
          after login.
        */
        slots: [],
      };


      saveRegisteredDoctor(
        doctorProfile
      );
    }


    router.push(
      "/login?registered=true"
    );
  };


  const changeRole = (
    newRole:
      UserRole
  ) => {
    setRole(
      newRole
    );

    setError("");
  };


  return (
    <>
      <Navbar />

      <main className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-12">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white soft-shadow lg:grid-cols-[.9fr_1.1fr]">

          <section className="hidden bg-[var(--brand)] p-10 text-white lg:block">

            <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
              Join Schedula
            </span>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight">
              Healthcare scheduling,
              simplified.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-emerald-50/80">
              Patients can discover and
              book doctors while doctors
              manage their professional
              profile and availability.
            </p>

          </section>


          <section className="p-6 sm:p-10">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
              Create account
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              Sign up to Schedula
            </h2>


            <div className="mt-7 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  changeRole(
                    "patient"
                  )
                }
                className={`rounded-xl border p-4 text-left ${
                  role ===
                  "patient"
                    ? "border-[var(--brand)] bg-emerald-50"
                    : "border-[var(--line)]"
                }`}
              >
                👤

                <span className="mt-2 block font-semibold">
                  Patient
                </span>

                <span className="mt-1 block text-xs text-[var(--muted)]">
                  Find and book doctors
                </span>
              </button>


              <button
                type="button"
                onClick={() =>
                  changeRole(
                    "doctor"
                  )
                }
                className={`rounded-xl border p-4 text-left ${
                  role ===
                  "doctor"
                    ? "border-[var(--brand)] bg-emerald-50"
                    : "border-[var(--line)]"
                }`}
              >
                🩺

                <span className="mt-2 block font-semibold">
                  Doctor
                </span>

                <span className="mt-1 block text-xs text-[var(--muted)]">
                  Manage appointments
                </span>
              </button>

            </div>


            <form
              onSubmit={
                submit
              }
              className="mt-8 space-y-7"
              noValidate
            >

              <div>

                <h3 className="font-semibold">
                  Personal information
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <label>

                    <span className="text-sm font-medium">
                      Full name
                    </span>

                    <input
                      value={
                        name
                      }
                      onChange={(
                        event
                      ) =>
                        setName(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder={
                        role ===
                        "doctor"
                          ? "Dr. John Doe"
                          : "John Doe"
                      }
                      className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
                    />

                  </label>


                  <label>

                    <span className="text-sm font-medium">
                      Email
                    </span>

                    <input
                      type="email"
                      value={
                        email
                      }
                      onChange={(
                        event
                      ) =>
                        setEmail(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
                    />

                  </label>

                </div>

              </div>


              {role ===
                "doctor" && (

                <>
                  <div>

                    <h3 className="font-semibold">
                      Contact details
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">

                      <label>
                        <span className="text-sm font-medium">
                          Phone
                        </span>

                        <input
                          value={
                            phone
                          }
                          onChange={(
                            event
                          ) =>
                            setPhone(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="9876543210"
                          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none"
                        />
                      </label>

                      <label>
                        <span className="text-sm font-medium">
                          Clinic location
                        </span>

                        <input
                          value={
                            location
                          }
                          onChange={(
                            event
                          ) =>
                            setLocation(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="Salt Lake, Kolkata"
                          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none"
                        />
                      </label>

                    </div>

                  </div>


                  <div>

                    <h3 className="font-semibold">
                      Professional details
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">

                      <label>
                        <span className="text-sm font-medium">
                          Specialty
                        </span>

                        <select
                          value={
                            specialty
                          }
                          onChange={(
                            event
                          ) =>
                            setSpecialty(
                              event
                                .target
                                .value
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                        >
                          <option value="">
                            Select specialty
                          </option>

                          {specialties
                            .filter(
                              (
                                item
                              ) =>
                                item !==
                                "All"
                            )
                            .map(
                              (
                                item
                              ) => (
                                <option
                                  key={
                                    item
                                  }
                                  value={
                                    item
                                  }
                                >
                                  {
                                    item
                                  }
                                </option>
                              )
                            )}

                        </select>
                      </label>


                      <label>
                        <span className="text-sm font-medium">
                          Registration number
                        </span>

                        <input
                          value={
                            registrationNumber
                          }
                          onChange={(
                            event
                          ) =>
                            setRegistrationNumber(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="WBMC-12345"
                          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                        />
                      </label>


                      <label>
                        <span className="text-sm font-medium">
                          Qualification
                        </span>

                        <input
                          value={
                            qualification
                          }
                          onChange={(
                            event
                          ) =>
                            setQualification(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="MBBS, MD"
                          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                        />
                      </label>


                      <label>
                        <span className="text-sm font-medium">
                          Experience
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={
                            experience
                          }
                          onChange={(
                            event
                          ) =>
                            setExperience(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="5"
                          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                        />
                      </label>


                      <label>
                        <span className="text-sm font-medium">
                          Consultation fee
                        </span>

                        <input
                          type="number"
                          min="1"
                          value={
                            fee
                          }
                          onChange={(
                            event
                          ) =>
                            setFee(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="700"
                          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                        />
                      </label>


                      <label>
                        <span className="text-sm font-medium">
                          Languages
                        </span>

                        <input
                          value={
                            languages
                          }
                          onChange={(
                            event
                          ) =>
                            setLanguages(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="English, Bengali, Hindi"
                          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                        />
                      </label>


                      <label className="sm:col-span-2">

                        <span className="text-sm font-medium">
                          Profile image URL
                        </span>

                        <input
                          value={
                            image
                          }
                          onChange={(
                            event
                          ) =>
                            setImage(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="https://example.com/profile.jpg"
                          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                        />

                      </label>


                      <label className="sm:col-span-2">

                        <span className="text-sm font-medium">
                          Professional bio
                        </span>

                        <textarea
                          rows={
                            4
                          }
                          value={
                            bio
                          }
                          onChange={(
                            event
                          ) =>
                            setBio(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="Tell patients about your experience and practice."
                          className="mt-2 w-full resize-none rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                        />

                      </label>

                    </div>

                  </div>
                </>

              )}


              <div>

                <h3 className="font-semibold">
                  Account security
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <label>
                    <span className="text-sm font-medium">
                      Password
                    </span>

                    <input
                      type="password"
                      value={
                        password
                      }
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event
                            .target
                            .value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                    />
                  </label>

                  <label>
                    <span className="text-sm font-medium">
                      Confirm password
                    </span>

                    <input
                      type="password"
                      value={
                        confirmPassword
                      }
                      onChange={(
                        event
                      ) =>
                        setConfirmPassword(
                          event
                            .target
                            .value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm"
                    />
                  </label>

                </div>

              </div>


              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}


              <button
                type="submit"
                disabled={
                  loading
                }
                className="w-full rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : `Create ${role} account`}
              </button>

            </form>


            <p className="mt-7 text-center text-sm text-[var(--muted)]">
              Already have an account?{" "}

              <Link
                href="/login"
                className="font-semibold text-[var(--brand)]"
              >
                Sign in
              </Link>
            </p>

          </section>

        </div>

      </main>
    </>
  );
}