"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { Check } from "lucide-react";

import Navbar from "@/components/layout/Navbar";

import {
  users,
} from "@/lib/mock-data/users";

import {
  getRegisteredUsers,
  saveCurrentUser,
} from "@/lib/client-storage";


export default function LoginPage() {

  const router = useRouter();


  // -----------------------------
  // FORM STATES
  // -----------------------------

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [registered, setRegistered] =
    useState(false);


  // -----------------------------
  // CHECK IF USER CAME FROM SIGNUP
  // -----------------------------

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const registrationStatus =
      params.get("registered");

    if (
      registrationStatus === "true"
    ) {
      setRegistered(true);
    }

  }, []);


  // -----------------------------
  // LOGIN FUNCTION
  // -----------------------------

  const submit = (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setError("");


    // -----------------------------
    // 1. EMPTY FIELD VALIDATION
    // -----------------------------

    if (
      !email.trim() ||
      !password.trim()
    ) {

      setError(
        "Please fill in both email and password."
      );

      return;
    }


    // -----------------------------
    // 2. EMAIL VALIDATION
    // -----------------------------

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    const emailRegex =
      /^\S+@\S+\.\S+$/;


    if (
      !emailRegex.test(
        normalizedEmail
      )
    ) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }


    // -----------------------------
    // 3. PASSWORD VALIDATION
    // -----------------------------

    if (
      password.length < 6
    ) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    // -----------------------------
    // 4. GET SIGNUP USERS
    // -----------------------------

    const registeredUsers =
      getRegisteredUsers();


    // -----------------------------
    // 5. COMBINE USERS
    //
    // users =
    // users.json users
    //
    // registeredUsers =
    // users created from signup
    // -----------------------------

    const allUsers = [
      ...users,
      ...registeredUsers,
    ];


    // -----------------------------
    // 6. FIND MATCHING USER
    // -----------------------------

    const user =
      allUsers.find(
        (item) =>

          item.email
            .toLowerCase() ===
            normalizedEmail

          &&

          item.password ===
            password
      );


    // -----------------------------
    // 7. INVALID LOGIN
    // -----------------------------

    if (!user) {

      setError(
        "Invalid email or password."
      );

      return;
    }


    // -----------------------------
    // 8. LOGIN SUCCESS
    // -----------------------------

    setLoading(true);


    saveCurrentUser({

      id: user.id,

      name: user.name,

      email: user.email,

      role: user.role,

    });


    // -----------------------------
    // 9. ROLE BASED REDIRECT
    // -----------------------------

    if (
      user.role === "doctor"
    ) {

      router.push(
        "/doctor-dashboard"
      );

    } else {

      router.push(
        "/doctors"
      );

    }

  };


  // -----------------------------
  // UI
  // -----------------------------

  return (

    <>

      <Navbar />


      <main
        className="
          grid
          min-h-[calc(100vh-73px)]
          place-items-center
          px-4
          py-12
        "
      >


        <div
          className="
            grid
            w-full
            max-w-5xl
            overflow-hidden
            rounded-[18px]
            border
            border-[var(--line)]
            bg-white
            soft-shadow
            lg:grid-cols-[.9fr_1.1fr]
          "
        >


          {/* =========================
              LEFT SIDE
          ========================= */}


          <section
            className="
              hidden
              bg-[#12100F]
              p-10
              text-white
              lg:block
            "
          >


            <span
              className="
                inline-flex
                rounded-full
                bg-white/10
                px-3
                py-1.5
                text-xs
                font-semibold
              "
            >

              Schedula patient access

            </span>


            <h1
              className="
                mt-8
                font-editorial
                text-5xl
                tracking-[-0.045em]
              "
            >

              Welcome back to simpler
              healthcare booking.

            </h1>


            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-7
                text-[#F7F4EF]/80
              "
            >

              Sign in to discover doctors,
              choose available appointment
              slots and manage your healthcare
              bookings.

            </p>


            <div
              className="
                mt-10
                space-y-4
                text-sm
              "
            >

              {[
                "Discover doctors",
                "Select available slots",
                "Confirm appointments",
              ].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <span
                      className="
                        grid
                        size-7
                        place-items-center
                        rounded-full
                        bg-white/10
                      "
                    >

                      <Check size={14} />

                    </span>

                    {item}

                  </div>

                )
              )}

            </div>

          </section>


          {/* =========================
              RIGHT SIDE
          ========================= */}


          <section
            className="
              p-6
              sm:p-10
            "
          >


            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[var(--brand)]
              "
            >

              User login

            </p>


            <h2
              className="
                mt-2
                text-3xl
                font-semibold
                tracking-tight
              "
            >

              Sign in to Schedula

            </h2>


            <p
              className="
                mt-3
                text-sm
                text-[var(--muted)]
              "
            >

              Sign in using your account
              credentials or use one of the
              demo accounts.

            </p>


            {/* =========================
                SIGNUP SUCCESS MESSAGE
            ========================= */}


            {registered && (

              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-[#F2C2A7]
                  bg-[#F7F4EF]
                  px-4
                  py-3
                  text-sm
                  text-[#C9362D]
                "
              >

                <span
                  className="
                    font-semibold
                  "
                >

                  Account created successfully.

                </span>

                <span
                  className="
                    ml-1
                  "
                >

                  Please sign in using your
                  new credentials.

                </span>

              </div>

            )}


            {/* =========================
                LOGIN FORM
            ========================= */}


            <form

              onSubmit={submit}

              className="
                mt-8
                space-y-5
              "

              noValidate

            >


              {/* EMAIL */}


              <label
                className="block"
              >


                <span
                  className="
                    text-sm
                    font-medium
                  "
                >

                  Email address

                </span>


                <input

                  type="email"

                  value={email}

                  onChange={
                    (event) =>
                      setEmail(
                        event.target.value
                      )
                  }

                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-[var(--line)]
                    bg-[#FFFFFF]
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-[var(--brand)]
                  "

                  placeholder="
                    you@example.com
                  "

                />


              </label>


              {/* PASSWORD */}


              <label
                className="block"
              >


                <span
                  className="
                    text-sm
                    font-medium
                  "
                >

                  Password

                </span>


                <input

                  type="password"

                  value={password}

                  onChange={
                    (event) =>
                      setPassword(
                        event.target.value
                      )
                  }

                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-[var(--line)]
                    bg-[#FFFFFF]
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-[var(--brand)]
                  "

                  placeholder="
                    Minimum 6 characters
                  "

                />


              </label>


              {/* =========================
                  ERROR MESSAGE
              ========================= */}


              {error && (

                <div

                  role="alert"

                  className="
                    rounded-xl
                    border
                    border-[#F2C2A7]
                    bg-[#F7F4EF]
                    px-4
                    py-3
                    text-sm
                    text-[#C9362D]
                  "

                >

                  {error}

                </div>

              )}


              {/* =========================
                  LOGIN BUTTON
              ========================= */}


              <button

                disabled={loading}

                type="submit"

                className="
                  w-full
                  rounded-xl
                  bg-[var(--brand)]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-[var(--brand-deep)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "

              >

                {
                  loading
                    ? "Signing in..."
                    : "Sign in"
                }

              </button>


            </form>


            {/* =========================
                DEMO ACCOUNTS
            ========================= */}


            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
              "
            >


              {/* PATIENT */}


              <button

                type="button"

                onClick={() => {

                  setEmail(
                    "patient@schedula.com"
                  );

                  setPassword(
                    "password123"
                  );

                  setError("");

                }}

                className="
                  rounded-xl
                  border
                  border-[var(--line)]
                  p-3
                  text-left
                  text-xs
                  transition
                  hover:border-[var(--brand)]
                "

              >


                <span
                  className="
                    font-semibold
                  "
                >

                  Patient demo

                </span>


                <span
                  className="
                    mt-1
                    block
                    text-[var(--muted)]
                  "
                >

                  patient@schedula.com

                </span>


              </button>


              {/* DOCTOR */}


              <button

                type="button"

                onClick={() => {

                  setEmail(
                    "doctor@schedula.com"
                  );

                  setPassword(
                    "password123"
                  );

                  setError("");

                }}

                className="
                  rounded-xl
                  border
                  border-[var(--line)]
                  p-3
                  text-left
                  text-xs
                  transition
                  hover:border-[var(--brand)]
                "

              >


                <span
                  className="
                    font-semibold
                  "
                >

                  Doctor demo

                </span>


                <span
                  className="
                    mt-1
                    block
                    text-[var(--muted)]
                  "
                >

                  doctor@schedula.com

                </span>


              </button>


            </div>


            {/* =========================
                SIGNUP
            ========================= */}


            <div
              className="
                mt-7
                text-center
              "
            >


              <p
                className="
                  text-sm
                  text-[var(--muted)]
                "
              >

                Don&apos;t have an account?{" "}


                <Link

                  href="/signup"

                  className="
                    font-semibold
                    text-[var(--brand)]
                  "

                >

                  Create account

                </Link>


              </p>


              <p
                className="
                  mt-3
                  text-xs
                "
              >


                <Link

                  href="/"

                  className="
                    font-semibold
                    text-[var(--brand)]
                  "

                >

                  Back home

                </Link>


              </p>


            </div>


          </section>


        </div>


      </main>

    </>

  );

}
