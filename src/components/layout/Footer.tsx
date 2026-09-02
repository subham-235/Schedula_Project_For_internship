import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function Footer() {
  return <footer className="mt-auto border-t border-[var(--line)] bg-[var(--ivory)]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid size-8 place-items-center bg-[var(--brand)] text-white"><Stethoscope size={15} /></span>Schedula</Link><div className="flex flex-wrap gap-5 text-xs text-[var(--muted)]"><Link href="/doctors">Find doctors</Link><Link href="/my-appointments">Appointments</Link><Link href="/login">Sign in</Link></div><p className="text-xs text-[var(--muted)]">Healthcare, thoughtfully arranged.</p></div></footer>;
}
