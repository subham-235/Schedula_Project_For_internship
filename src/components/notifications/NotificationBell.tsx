"use client";

import Link from "next/link";

import { useCallback, useEffect, useState } from "react";

import { Bell, CheckCheck } from "lucide-react";

import type { AppNotification } from "@/types/notification";

import type { StoredUser } from "@/lib/client-storage";

import {
  ensureAppointmentReminderNotifications,
  getNotificationsForUser,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/client-storage";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",

    timeStyle: "short",
  }).format(new Date(value));
}

export default function NotificationBell({ user }: { user: StoredUser }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const [open, setOpen] = useState(false);

  const load = useCallback(() => {
    ensureAppointmentReminderNotifications(user.id, user.email);

    setNotifications(getNotificationsForUser(user.id, user.email));
  }, [user.id, user.email]);

  useEffect(() => {
    load();

    window.addEventListener("focus", load);

    window.addEventListener("storage", load);

    return () => {
      window.removeEventListener("focus", load);

      window.removeEventListener("storage", load);
    };
  }, [load]);

  const unread = notifications.filter((item) => !item.read).length;

  const openNotification = (notification: AppNotification) => {
    markNotificationRead(notification.id);

    load();

    setOpen(false);
  };

  const markAll = () => {
    markAllNotificationsRead(user.id, user.email);

    load();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);

          load();
        }}
        className="relative grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-white text-[var(--foreground)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
        aria-label="Notifications"
      >
        <Bell size={18} />

        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
            <div>
              <p className="font-semibold">Notifications</p>

              <p className="text-xs text-[var(--muted)]">{unread} unread</p>
            </div>

            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)]"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[28rem] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map((notification) => (
                <Link
                  key={notification.id}
                  href="/my-appointments"
                  onClick={() => openNotification(notification)}
                  className={`block border-b border-[var(--line)] px-4 py-4 transition hover:bg-emerald-50/40 ${
                    !notification.read ? "bg-emerald-50/30" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`mt-1 size-2 shrink-0 rounded-full ${
                        notification.read ? "bg-stone-300" : "bg-[var(--brand)]"
                      }`}
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-[10px] text-[var(--muted)]">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell size={22} className="mx-auto text-stone-300" />

                <p className="mt-3 text-sm font-semibold">No notifications</p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Appointment updates will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
