"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Pill,
  Plus,
  Stethoscope,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import type { Booking } from "@/types/booking";
import type { Doctor } from "@/types/doctor";
import {
  clearCurrentUser,
  getBookingsForDoctor,
  getCurrentUser,
  getRegisteredDoctors,
  mergeDoctorProfiles,
  type StoredUser,
} from "@/lib/client-storage";
import { doctors } from "@/lib/mock-data/doctors";
import {
  formatAppointmentDate,
  formatAppointmentTime,
  isDashboardUpcoming,
} from "@/lib/appointment-utils";
import StatusBadge from "@/components/appointments/StatusBadge";

const navigation = [
  { label: "Overview", href: "/doctor-dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/doctor-dashboard/appointments", icon: ListChecks },
  { label: "Calendar", href: "/doctor-dashboard/calendar", icon: CalendarDays },
  { label: "Prescriptions", href: "/doctor-dashboard/prescriptions", icon: Pill },
  { label: "Profile", href: "/doctor-dashboard/profile", icon: CircleUserRound },
] as const;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function findDoctorProfile(user: StoredUser): Doctor | undefined {
  const allDoctors = mergeDoctorProfiles(doctors, getRegisteredDoctors());
  return (
    allDoctors.find((doctor) => doctor.id === user.id) ??
    allDoctors.find((doctor) => normalize(doctor.name) === normalize(user.name))
  );
}

function DoctorSidebar({
  profile,
  onLogout,
  mobile = false,
  onNavigate,
}: {
  profile: Doctor;
  onLogout: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={`flex h-full flex-col bg-[#12100F] text-white ${mobile ? "w-[18rem]" : "w-[17.5rem]"}`}>
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="grid size-10 place-items-center rounded-xl bg-[#F2C2A7] text-[#12100F] shadow-lg shadow-black/10">
          <Stethoscope size={21} strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-lg font-bold tracking-tight">Schedula</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F2C2A7]/55">Doctor workspace</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-7" aria-label="Doctor dashboard navigation">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F2C2A7]/40">Workspace</p>
        <div className="mt-3 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${active ? "bg-white text-[#12100F] shadow-sm" : "text-[#F7F4EF]/70 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {active && <ChevronRight className="ml-auto" size={16} />}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="m-4 rounded-xl border border-white/10 bg-white/7 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#F2C2A7] text-sm font-bold text-[#12100F]">{profile.initials}</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{profile.name}</p>
            <p className="truncate text-xs text-[#F2C2A7]/55">{profile.specialty}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-[#F7F4EF]/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [profile, setProfile] = useState<Doctor | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const loadDashboard = useCallback((doctorProfile: Doctor) => {
    setLoading(true);
    setBookings(getBookingsForDoctor(doctorProfile.id, doctorProfile.name));
    setLoading(false);
  }, []);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (currentUser.role !== "doctor") {
      router.replace("/doctors");
      return;
    }
    const doctorProfile = findDoctorProfile(currentUser);
    if (!doctorProfile) {
      router.replace("/doctors");
      return;
    }
    setUser(currentUser);
    setProfile(doctorProfile);
    loadDashboard(doctorProfile);
  }, [router, loadDashboard]);

  useEffect(() => {
    if (!profile) return;
    const handleFocus = () => loadDashboard(profile);
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [profile, loadDashboard]);

  const upcoming = useMemo(
    () =>
      bookings
        .filter(isDashboardUpcoming)
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    [bookings],
  );

  const pending = upcoming.filter((booking) => booking.status === "pending").length;
  const confirmed = upcoming.filter((booking) => booking.status === "confirmed").length;
  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = upcoming.filter((booking) => booking.date === today);
  const nextAppointment = upcoming[0];
  const firstName = profile?.name.replace(/^Dr\.?\s*/i, "").split(" ")[0];
  const formattedToday = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const logout = () => {
    clearCurrentUser();
    router.push("/login");
  };

  if (!user || !profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F7F4EF]">
        <div className="flex items-center gap-3 text-sm font-medium text-[var(--muted)]">
          <span className="size-4 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--brand)]" />
          Preparing your workspace...
        </div>
      </main>
    );
  }

  const stats = [
    { label: "Today's appointments", value: todayBookings.length, note: "visits scheduled", icon: CalendarDays, tone: "bg-[#F2C2A7] text-[#E5483B]" },
    { label: "Upcoming patients", value: upcoming.length, note: "across your schedule", icon: UsersRound, tone: "bg-[#F7F4EF] text-[#D96B32]" },
    { label: "Pending requests", value: pending, note: pending ? "need your attention" : "all caught up", icon: Clock3, tone: "bg-[#F2C2A7] text-[#D96B32]" },
    { label: "Confirmed", value: confirmed, note: "appointments ready", icon: CheckCircle2, tone: "bg-[#F2C2A7] text-[#E5483B]" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#12100F] lg:flex">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <DoctorSidebar profile={profile} onLogout={logout} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-[#12100F]/55 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <div className="relative h-full w-fit shadow-2xl">
            <DoctorSidebar profile={profile} onLogout={logout} mobile onNavigate={() => setMobileNavOpen(false)} />
            <button type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="absolute right-4 top-5 grid size-10 place-items-center rounded-xl text-white hover:bg-white/10">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 lg:ml-[17.5rem]">
        <header className="sticky top-0 z-20 border-b border-[#DDD7D0] bg-[#F7F4EF]/90 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-7 xl:px-10">
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)} className="grid size-10 place-items-center rounded-xl border border-[#DDD7D0] bg-white lg:hidden">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-sm font-semibold">Overview</p>
                <p className="hidden text-xs text-[#746E68] sm:block">{formattedToday}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" aria-label="Notifications" className="relative grid size-10 place-items-center rounded-xl border border-[#DDD7D0] bg-white text-[#746E68] hover:border-[#DDD7D0]">
                <Bell size={18} />
                {pending > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-[#E5483B] ring-2 ring-white" />}
              </button>
              <div className="hidden h-8 w-px bg-[#DDD7D0] sm:block" />
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{profile.name}</p>
                <p className="text-xs text-[#746E68]">{profile.specialty}</p>
              </div>
              <div className="grid size-10 place-items-center rounded-xl bg-[#F2C2A7] text-sm font-bold text-[#E5483B]">{profile.initials}</div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[94rem] px-4 py-6 sm:px-7 sm:py-8 xl:px-10">
          <section className="relative overflow-hidden bg-[#12100F] px-6 py-8 text-white sm:px-8 sm:py-10">
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E5483B]">Your clinical day</p>
                <h1 className="font-editorial mt-3 text-3xl tracking-[-0.04em] sm:text-5xl">Good afternoon,<br />Dr. {firstName}.</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#F7F4EF]/75">
                  {todayBookings.length > 0
                    ? `You have ${todayBookings.length} appointment${todayBookings.length === 1 ? "" : "s"} today. Your next patient details are ready below.`
                    : "Your schedule is clear today. Review upcoming requests or update your availability."}
                </p>
              </div>
              <Link href="/doctor-dashboard/calendar" className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#E5483B] shadow-sm hover:bg-[#F7F4EF]">
                <CalendarDays size={17} /> View full schedule
              </Link>
            </div>
          </section>

          <section className="mt-6 grid border-y border-[#DDD7D0] bg-white sm:grid-cols-2 2xl:grid-cols-4" aria-label="Schedule summary">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.label} className="border-b border-[#DDD7D0] p-5 sm:border-r 2xl:border-b-0 2xl:last:border-r-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[#746E68]">{stat.label}</p>
                      <p className="font-editorial mt-2 text-4xl tracking-tight">{stat.value}</p>
                      <p className="mt-1 text-xs text-[#746E68]">{stat.note}</p>
                    </div>
                    <div className={`grid size-10 place-items-center ${stat.tone}`}><Icon size={19} /></div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.75fr)]">
            <div className="overflow-hidden rounded-xl border border-[#DDD7D0] bg-white shadow-[0_8px_24px_rgba(18,16,15,0.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#DDD7D0] px-5 py-5 sm:px-6">
                <div>
                  <h2 className="text-base font-bold">Upcoming appointments</h2>
                  <p className="mt-1 text-xs text-[#746E68]">Your next confirmed visits and patient requests</p>
                </div>
                <Link href="/doctor-dashboard/appointments" className="inline-flex items-center gap-1 text-xs font-bold text-[#E5483B] hover:text-[#12100F]">
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              {loading ? (
                <div className="p-10 text-center text-sm text-[#746E68]">Loading appointments...</div>
              ) : upcoming.length > 0 ? (
                <div className="divide-y divide-[#DDD7D0]">
                  {upcoming.slice(0, 5).map((booking, index) => (
                    <Link key={booking.id} href="/doctor-dashboard/appointments" className="group grid gap-4 px-5 py-4 hover:bg-[#F7F4EF] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-[#F7F4EF] text-sm font-bold text-[#E5483B]">
                          {booking.patientName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                          {index === 0 && <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-[#D96B32] ring-2 ring-white" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-bold">{booking.patientName}</p>
                            <StatusBadge status={booking.status} />
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#746E68]">
                            <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />{formatAppointmentDate(booking.startsAt)}</span>
                            <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{formatAppointmentTime(booking.startsAt)}</span>
                            <span className="inline-flex items-center gap-1.5"><Stethoscope size={13} />{booking.appointmentType ?? "In-person"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 pl-[3.75rem] sm:justify-end sm:pl-0">
                        <span className="max-w-36 truncate text-xs text-[#746E68]">{booking.reason}</span>
                        <span className="grid size-8 place-items-center rounded-lg border border-[#DDD7D0] text-[#746E68] transition group-hover:border-[#E5483B] group-hover:bg-[#E5483B] group-hover:text-white"><ChevronRight size={15} /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-14 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-xl bg-[#F7F4EF] text-[#E5483B]"><CalendarDays size={22} /></div>
                  <p className="mt-4 text-sm font-bold">Your schedule is clear</p>
                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#746E68]">New patient bookings will appear here as soon as they are requested.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <article className="rounded-xl border border-[#DDD7D0] bg-white p-5 shadow-[0_8px_24px_rgba(18,16,15,0.04)] sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#746E68]">Up next</p>
                    <h2 className="mt-1 text-base font-bold">Next appointment</h2>
                  </div>
                  <div className="grid size-10 place-items-center rounded-xl bg-[#F2C2A7] text-[#E5483B]"><Clock3 size={18} /></div>
                </div>
                {nextAppointment ? (
                  <div className="mt-5">
                    <div className="flex items-center gap-3">
                      <div className="grid size-12 place-items-center rounded-xl bg-[#12100F] text-sm font-bold text-white">
                        {nextAppointment.patientName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{nextAppointment.patientName}</p>
                        <p className="mt-1 text-xs text-[#746E68]">{nextAppointment.patientAge} years · {nextAppointment.appointmentType}</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3 rounded-xl bg-[#F7F4EF] p-4 text-xs text-[#746E68]">
                      <p className="flex items-center gap-2.5"><CalendarDays size={15} className="text-[#E5483B]" />{formatAppointmentDate(nextAppointment.startsAt)} at {formatAppointmentTime(nextAppointment.startsAt)}</p>
                      <p className="flex items-start gap-2.5"><Stethoscope size={15} className="mt-0.5 shrink-0 text-[#E5483B]" /><span className="line-clamp-2">{nextAppointment.reason}</span></p>
                    </div>
                    <Link href="/doctor-dashboard/appointments" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E5483B] px-4 py-3 text-xs font-bold text-white hover:bg-[#12100F]">
                      View patient details <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-dashed border-[#DDD7D0] px-4 py-7 text-center">
                    <p className="text-sm font-semibold">No appointment queued</p>
                    <p className="mt-1 text-xs text-[#746E68]">Enjoy the quiet moment.</p>
                  </div>
                )}
              </article>

              <article className="rounded-xl border border-[#DDD7D0] bg-white p-5 shadow-[0_8px_24px_rgba(18,16,15,0.04)] sm:p-6">
                <h2 className="text-base font-bold">Quick actions</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link href="/doctor-dashboard/profile" className="rounded-xl border border-[#DDD7D0] p-3.5 hover:border-[#DDD7D0] hover:bg-[#F7F4EF]">
                    <div className="grid size-9 place-items-center rounded-lg bg-[#F2C2A7] text-[#E5483B]"><Plus size={17} /></div>
                    <p className="mt-3 text-xs font-bold">Add slots</p>
                    <p className="mt-1 text-[11px] text-[#746E68]">Set availability</p>
                  </Link>
                  <Link href="/doctor-dashboard/appointments" className="rounded-xl border border-[#DDD7D0] p-3.5 hover:border-[#DDD7D0] hover:bg-[#F7F4EF]">
                    <div className="grid size-9 place-items-center rounded-lg bg-[#F7F4EF] text-[#D96B32]"><UserRound size={17} /></div>
                    <p className="mt-3 text-xs font-bold">Patients</p>
                    <p className="mt-1 text-[11px] text-[#746E68]">Review details</p>
                  </Link>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
