"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Menu, Stethoscope, X } from "lucide-react";
import { clearCurrentUser, getCurrentUser, type StoredUser } from "@/lib/client-storage";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Navbar() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setUser(getCurrentUser()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const logout = () => { clearCurrentUser(); setUser(null); setOpen(false); };

  return <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--background)]/95 backdrop-blur-xl"><div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-3"><span className="grid size-9 place-items-center bg-[var(--brand)] text-white"><Stethoscope size={18} /></span><span className="text-lg font-semibold tracking-[-0.04em]">Schedula</span></Link><nav className="hidden items-center gap-7 text-sm font-medium text-[var(--muted)] md:flex"><Link href="/doctors" className="hover:text-[var(--brand)]">Find doctors</Link>{user?.role === "patient" && <><Link href="/my-appointments" className="hover:text-[var(--brand)]">Appointments</Link><Link href="/profile" className="hover:text-[var(--brand)]">Profile</Link></>}{user?.role === "doctor" && <Link href="/doctor-dashboard" className="hover:text-[var(--brand)]">Clinical workspace</Link>}</nav><div className="flex items-center gap-2">{user?.role === "patient" && <NotificationBell user={user} />}{user ? <><span className="hidden text-xs text-[var(--muted)] sm:block">{user.name.split(" ")[0]}</span><button type="button" onClick={logout} aria-label="Log out" className="hidden size-9 place-items-center border border-[var(--line)] bg-[var(--card)] hover:border-[var(--brand)] hover:text-[var(--brand)] sm:grid"><LogOut size={16} /></button></> : <Link href="/login" className="hidden text-sm font-semibold hover:text-[var(--brand)] sm:block">Sign in</Link>}<Link href="/doctors" className="hidden bg-[var(--brand)] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[var(--brand-deep)] sm:block">Book appointment</Link><button type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)} className="grid size-9 place-items-center border border-[var(--line)] bg-[var(--card)] md:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button></div></div>{open && <nav className="border-t border-[var(--line)] bg-[var(--card)] px-4 py-4 md:hidden"><Link href="/doctors" className="block border-b border-[var(--line)] py-3 text-sm font-semibold">Find doctors</Link>{user?.role === "patient" && <><Link href="/my-appointments" className="block border-b border-[var(--line)] py-3 text-sm font-semibold">Appointments</Link><Link href="/profile" className="block py-3 text-sm font-semibold">Profile</Link></>}{user?.role === "doctor" && <Link href="/doctor-dashboard" className="block py-3 text-sm font-semibold">Clinical workspace</Link>}{user && <button type="button" onClick={logout} className="mt-3 w-full border border-[var(--line)] py-2.5 text-sm font-semibold">Log out</button>}</nav>}</header>;
}
