"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { users } from "@/lib/mock-data/users";
import { saveCurrentUser } from "@/lib/client-storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("patient@schedula.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const user = users.find((item) => item.email === email.trim().toLowerCase() && item.password === password);
    if (!user) {
      setError("Invalid demo credentials. Use the credentials shown below.");
      return;
    }

    setLoading(true);
    saveCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    router.push(user.role === "doctor" ? "/doctor-dashboard" : "/doctors");
  };

  return (
    <>
      <Navbar />
      <main className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white soft-shadow lg:grid-cols-[.9fr_1.1fr]">
          <section className="hidden bg-[var(--brand)] p-10 text-white lg:block">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">Schedula patient access</span>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight">Welcome back to simpler healthcare booking.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-emerald-50/80">This Day 1 login is intentionally mock-based. It demonstrates UI, validation, role handling and navigation without production authentication.</p>
            <div className="mt-10 space-y-4 text-sm">
              {["Discover doctors", "Select available slots", "Confirm appointments"].map((item) => (
                <div key={item} className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/10">✓</span>{item}</div>
              ))}
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">User login</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Sign in to Schedula</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">Use one of the demo accounts below.</p>

            <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
              <label className="block">
                <span className="text-sm font-medium">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-4 py-3 text-sm outline-none focus:border-[var(--brand)]"
                  placeholder="Minimum 6 characters"
                />
              </label>

              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              <button disabled={loading} type="submit" className="w-full rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:opacity-60">
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => { setEmail("patient@schedula.com"); setPassword("password123"); }} className="rounded-xl border border-[var(--line)] p-3 text-left text-xs hover:border-[var(--brand)]">
                <span className="font-semibold">Patient demo</span><span className="mt-1 block text-[var(--muted)]">patient@schedula.com</span>
              </button>
              <button type="button" onClick={() => { setEmail("doctor@schedula.com"); setPassword("password123"); }} className="rounded-xl border border-[var(--line)] p-3 text-left text-xs hover:border-[var(--brand)]">
                <span className="font-semibold">Doctor demo</span><span className="mt-1 block text-[var(--muted)]">doctor@schedula.com</span>
              </button>
            </div>

            <p className="mt-7 text-center text-xs text-[var(--muted)]"> <Link href="/" className="font-semibold text-[var(--brand)]">Back home</Link></p>
          </section>
        </div>
      </main>
    </>
  );
}
