import Link from "next/link";

const groups = [
  { title: "Patients", links: [["Find doctors", "/doctors"], ["Appointments", "/my-appointments"], ["Profile", "/profile"]] },
  { title: "Doctors", links: [["Doctor login", "/login"], ["Register", "/signup"], ["Workspace", "/doctor-dashboard"]] },
  { title: "Company", links: [["Specialties", "/#specialties"], ["How it works", "/#how-it-works"], ["About", "#"]] },
  { title: "Legal", links: [["Privacy", "#"], ["Terms", "#"], ["Accessibility", "#"]] },
];

export default function LandingFooter() {
  return <footer className="bg-[var(--charcoal-deep)] text-white"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><Link href="/" className="font-editorial text-6xl tracking-[-0.065em] sm:text-8xl">Schedula<span className="text-[var(--brand)]">.</span></Link><div className="mt-12 grid gap-12 border-t border-white/15 pt-10 lg:grid-cols-[1.1fr_1.9fr]"><p className="max-w-xs text-sm leading-7 text-white/50">A more human way to discover doctors, arrange appointments, and continue care.</p><div className="grid grid-cols-2 gap-8 sm:grid-cols-4">{groups.map((group) => <div key={group.title}><h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{group.title}</h3><div className="mt-5 space-y-3">{group.links.map(([label, href]) => <Link key={label} href={href} className="block text-sm text-white/65 hover:text-white">{label}</Link>)}</div></div>)}</div></div><div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Schedula. Thoughtful healthcare coordination.</p><p>Kolkata / India</p></div></div></footer>;
}
