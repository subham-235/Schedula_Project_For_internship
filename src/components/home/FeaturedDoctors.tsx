import Link from "next/link";
import { doctors } from "@/lib/mock-data/doctors";
import DoctorCard from "@/components/doctors/DoctorCard";

export default function FeaturedDoctors() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Trusted care</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Featured doctors</h2>
        </div>
        <Link href="/doctors" className="text-sm font-semibold text-[var(--brand)] hover:underline">View all doctors →</Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.slice(0, 3).map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
      </div>
    </section>
  );
}
