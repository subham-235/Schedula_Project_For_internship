"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCurrentUser, getCurrentUser, type StoredUser } from "@/lib/client-storage";

export default function Navbar() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[#f7faf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] font-serif text-xl text-white">
            S
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">Schedula</span>
            <span className="hidden text-xs text-[var(--muted)] sm:block">Care, without the waiting.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--muted)] md:flex">
          <Link href="/doctors" className="hover:text-[var(--brand)]">Find doctors</Link>
          <Link href="/#specialties" className="hover:text-[var(--brand)]">Specialties</Link>
          <Link href="/#how-it-works" className="hover:text-[var(--brand)]">How it works</Link>
          {/* <Link href="/doctor-dashboard" className="hover:text-[var(--brand)]">Doctor dashboard</Link> */}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-[var(--muted)] sm:block">Hi, {user.name.split(" ")[0]}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              Login
            </Link>
          )}
          <Link
            href="/doctors"
            className="hidden rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] sm:inline-flex"
          >
            Book appointment
          </Link>
        </div>
      </div>
    </header>
  );
}
