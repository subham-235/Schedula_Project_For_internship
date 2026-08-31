import Link from "next/link";

import {
  HeartPulse,
  Stethoscope,
} from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-[#0b2722] text-white">

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">

          <div>

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="grid size-11 place-items-center rounded-2xl bg-[#087f69]">
                <Stethoscope size={21} />
              </div>

              <div>
                <p className="text-lg font-extrabold">
                  Schedula
                </p>

                <p className="text-[11px] font-medium text-emerald-50/40">
                  Healthcare, on your schedule.
                </p>
              </div>
            </Link>


            <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-emerald-50/50">
              A simpler way for patients to
              discover doctors and book available
              appointments while giving doctors
              control over their schedule.
            </p>

          </div>


          <div>

            <p className="text-sm font-extrabold">
              Patients
            </p>

            <div className="mt-5 space-y-3 text-sm font-medium text-emerald-50/50">

              <Link
                href="/doctors"
                className="block transition hover:text-white"
              >
                Find doctors
              </Link>

              <Link
                href="/login"
                className="block transition hover:text-white"
              >
                Patient login
              </Link>

              <Link
                href="/signup"
                className="block transition hover:text-white"
              >
                Create account
              </Link>

            </div>

          </div>


          <div>

            <p className="text-sm font-extrabold">
              Doctors
            </p>

            <div className="mt-5 space-y-3 text-sm font-medium text-emerald-50/50">

              <Link
                href="/signup"
                className="block transition hover:text-white"
              >
                Doctor registration
              </Link>

              <Link
                href="/login"
                className="block transition hover:text-white"
              >
                Doctor login
              </Link>

              <Link
                href="/doctor-dashboard"
                className="block transition hover:text-white"
              >
                Doctor portal
              </Link>

            </div>

          </div>


          <div>

            <p className="text-sm font-extrabold">
              Platform
            </p>

            <div className="mt-5 space-y-3 text-sm font-medium text-emerald-50/50">

              <Link
                href="/#specialties"
                className="block transition hover:text-white"
              >
                Specialties
              </Link>

              <Link
                href="/#how-it-works"
                className="block transition hover:text-white"
              >
                How it works
              </Link>

              <span className="block">
                Internship project
              </span>

            </div>

          </div>

        </div>


        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs font-medium text-emerald-50/35 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 Schedula. Internship demonstration project.
          </p>

          <p className="flex items-center gap-1.5">
            Built around better healthcare scheduling

            <HeartPulse
              size={14}
              className="text-emerald-400"
            />
          </p>

        </div>

      </div>

    </footer>
  );
}