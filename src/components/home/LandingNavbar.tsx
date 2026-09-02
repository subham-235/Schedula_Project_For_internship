"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, LogOut, Menu, X } from "lucide-react";

import { clearCurrentUser, getCurrentUser, type StoredUser } from "@/lib/client-storage";

const navItems = [
  { label: "Doctors", href: "/doctors" },
  { label: "Specialties", href: "/#specialties" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "For doctors", href: "/#for-everyone" },
];

export default function LandingNavbar() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setUser(getCurrentUser()), 0);
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const logout = () => {
    clearCurrentUser();
    setUser(null);
    setMobileOpen(false);
  };

  const portalHref = user?.role === "doctor" ? "/doctor-dashboard" : "/my-appointments";

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-[var(--line)] bg-[var(--background)]/95 shadow-[0_8px_28px_rgba(18,16,15,0.06)] backdrop-blur-xl" : "border-transparent bg-transparent"}`}
      animate={{ paddingTop: scrolled ? 0 : 8 }}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all sm:px-6 lg:px-8 ${scrolled ? "h-16" : "h-20"}`}>
        <Link href="/" className="group flex items-center gap-3" aria-label="Schedula home">
          <span className="size-2.5 bg-[var(--brand)] transition-transform group-hover:rotate-45" />
          <span className="font-editorial text-2xl tracking-[-0.055em]">Schedula</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--muted)] md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="group relative py-2 hover:text-[var(--foreground)]">
              {item.label}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--brand)] transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href={portalHref} className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--brand)]">
                {user.role === "doctor" ? "Doctor portal" : "My appointments"}
              </Link>
              <button type="button" onClick={logout} aria-label="Log out" className="grid size-10 place-items-center border border-[var(--line)] bg-[var(--card)] hover:border-[var(--brand)] hover:text-[var(--brand)]">
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-semibold hover:text-[var(--brand)]">Sign in</Link>
          )}
          <Link href="/doctors" className="inline-flex items-center gap-2 bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]">
            Book appointment <ArrowUpRight size={16} />
          </Link>
        </div>

        <button type="button" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={mobileOpen} className="grid size-10 place-items-center border border-[var(--line)] bg-[var(--card)] md:hidden">
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-[var(--line)] bg-[var(--card)] md:hidden">
            <nav className="space-y-1 px-4 py-5" aria-label="Mobile navigation">
              {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block border-b border-[var(--line)] px-2 py-3 text-sm font-semibold">{item.label}</Link>)}
              {user && <Link href={portalHref} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-2 py-3 text-sm font-semibold"><CalendarDays size={17} /> Open portal</Link>}
              {!user && <Link href="/login" className="block px-2 py-3 text-sm font-semibold">Sign in</Link>}
              <Link href="/doctors" className="mt-3 block bg-[var(--brand)] px-4 py-3 text-center text-sm font-semibold text-white">Book appointment</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
