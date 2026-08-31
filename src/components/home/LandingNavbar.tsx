"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Stethoscope,
  X,
} from "lucide-react";

import {
  clearCurrentUser,
  getCurrentUser,
  type StoredUser,
} from "@/lib/client-storage";

export default function LandingNavbar() {
  const [user, setUser] =
    useState<StoredUser | null>(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const logout = () => {
    clearCurrentUser();

    setUser(null);

    setMobileOpen(false);
  };

  const dashboardHref =
    user?.role === "doctor"
      ? "/doctor-dashboard"
      : "/doctors";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/70 bg-white/85 shadow-[0_12px_40px_rgba(12,65,52,0.08)] backdrop-blur-2xl">

        <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">

          {/* LOGO */}

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="grid size-11 place-items-center rounded-[14px] bg-[#087f69] shadow-lg shadow-emerald-900/10 transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <Stethoscope
                size={22}
                strokeWidth={2.2}
                className="text-white"
              />
            </div>

            <div>
              <p className="text-[19px] font-extrabold tracking-[-0.03em] text-[#0d2d27]">
                Schedula
              </p>

              <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
                Healthcare, on your schedule.
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex">

            <Link
              href="/doctors"
              className="transition hover:text-[#087f69]"
            >
              Find Doctors
            </Link>

            <Link
              href="/#specialties"
              className="transition hover:text-[#087f69]"
            >
              Specialties
            </Link>

            <Link
              href="/#how-it-works"
              className="transition hover:text-[#087f69]"
            >
              How it works
            </Link>

            <Link
              href="/#for-everyone"
              className="transition hover:text-[#087f69]"
            >
              For doctors
            </Link>

          </nav>

          {/* ACTIONS */}

          <div className="hidden items-center gap-2 lg:flex">

            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-[#087f69]"
                >
                  <LayoutDashboard size={16} />

                  {user.role === "doctor"
                    ? "Dashboard"
                    : "Doctors"}
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-[#087f69]"
              >
                Sign in
              </Link>
            )}

            <Link
              href="/doctors"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#087f69] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#066b59]"
            >
              Book appointment

              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>

          </div>

          {/* MOBILE */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (current) => !current
              )
            }
            className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white lg:hidden"
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 p-4 lg:hidden">

            <nav className="grid gap-1 text-sm font-semibold text-slate-700">

              <Link
                href="/doctors"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="rounded-xl px-4 py-3 hover:bg-emerald-50"
              >
                Find Doctors
              </Link>

              <Link
                href="/#specialties"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="rounded-xl px-4 py-3 hover:bg-emerald-50"
              >
                Specialties
              </Link>

              <Link
                href="/#how-it-works"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="rounded-xl px-4 py-3 hover:bg-emerald-50"
              >
                How it works
              </Link>

              <Link
                href="/#for-everyone"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="rounded-xl px-4 py-3 hover:bg-emerald-50"
              >
                For Doctors
              </Link>

            </nav>

            <div className="mt-4 grid gap-2">

              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <button
                    onClick={logout}
                    type="button"
                    className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold"
                >
                  Sign in
                </Link>
              )}

              <Link
                href="/doctors"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087f69] px-4 py-3 text-sm font-bold text-white"
              >
                <CalendarDays size={17} />
                Book appointment
              </Link>

            </div>

          </div>
        )}

      </div>
    </header>
  );
}