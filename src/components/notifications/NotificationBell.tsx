"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CalendarClock, CheckCheck, CircleCheck, FileText, RefreshCcw, XCircle } from "lucide-react";
import type { AppNotification, NotificationType } from "@/types/notification";
import type { StoredUser } from "@/lib/client-storage";
import { ensureAppointmentReminderNotifications, getNotificationsForUser, markAllNotificationsRead, markNotificationRead } from "@/lib/client-storage";

const icons = { booking: CalendarClock, confirmed: CircleCheck, rescheduled: RefreshCcw, cancelled: XCircle, reminder: Bell, missed: XCircle, completed: CircleCheck, prescription: FileText } satisfies Record<NotificationType, typeof Bell>;
const formatTime = (value: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function NotificationBell({ user }: { user: StoredUser }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const load = useCallback(() => { ensureAppointmentReminderNotifications(user.id, user.email); setNotifications(getNotificationsForUser(user.id, user.email)); }, [user.id, user.email]);
  useEffect(() => { const timer = window.setTimeout(load, 0); window.addEventListener("focus", load); window.addEventListener("storage", load); return () => { window.clearTimeout(timer); window.removeEventListener("focus", load); window.removeEventListener("storage", load); }; }, [load]);
  const unread = notifications.filter((item) => !item.read).length;
  const openNotification = (notification: AppNotification) => { markNotificationRead(notification.id); load(); setOpen(false); };
  const markAll = () => { markAllNotificationsRead(user.id, user.email); load(); };

  return <div className="relative"><motion.button type="button" whileTap={{ scale: 0.94 }} onClick={() => { setOpen((value) => !value); load(); }} className="relative grid size-9 place-items-center border border-[var(--line)] bg-[var(--card)] hover:border-[var(--brand)] hover:text-[var(--brand)]" aria-label="Notifications" aria-expanded={open}><Bell size={17} />{unread > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</motion.span>}</motion.button><AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.2 }} className="absolute right-0 top-12 z-50 w-[min(23rem,calc(100vw-2rem))] overflow-hidden border border-[var(--line)] bg-[var(--card)] shadow-[0_22px_60px_rgba(18,16,15,0.14)]"><header className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4"><div><p className="font-semibold">Notifications</p><p className="mt-0.5 text-xs text-[var(--muted)]">{unread ? `${unread} unread update${unread === 1 ? "" : "s"}` : "You're all caught up"}</p></div>{unread > 0 && <button type="button" onClick={markAll} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)]"><CheckCheck size={14} /> Mark all read</button>}</header><div className="warm-scrollbar max-h-[28rem] overflow-y-auto">{notifications.length ? notifications.slice(0, 10).map((notification) => { const Icon = icons[notification.type]; return <Link key={notification.id} href="/my-appointments" onClick={() => openNotification(notification)} className={`group grid grid-cols-[36px_1fr] gap-3 border-b border-[var(--line)] px-5 py-4 hover:bg-[var(--ivory)] ${notification.read ? "" : "bg-[var(--surface-soft)]"}`}><span className="grid size-9 place-items-center bg-[var(--brand-soft)] text-[var(--brand)]"><Icon size={16} /></span><span><span className="flex items-start justify-between gap-3"><strong className="text-sm font-semibold">{notification.title}</strong>{!notification.read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--coral)]" />}</span><span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{notification.message}</span><span className="mt-2 block text-[10px] text-[var(--muted)]">{formatTime(notification.createdAt)}</span></span></Link>; }) : <div className="px-6 py-12 text-center"><Bell size={22} className="mx-auto text-[var(--sand)]" /><p className="mt-3 text-sm font-semibold">No notifications yet</p><p className="mt-1 text-xs text-[var(--muted)]">Appointment updates will appear here.</p></div>}</div></motion.div>}</AnimatePresence></div>;
}
