import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import SpecialtySection from "@/components/home/SpecialtySection";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SpecialtySection />
        <FeaturedDoctors />
        <HowItWorks />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-[var(--brand)] px-6 py-10 text-white sm:px-10 md:flex md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-100">Ready when you are</p>
              <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">Find a doctor and reserve a time that fits your day.</h2>
            </div>
            <a href="/doctors" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)] hover:bg-emerald-50 md:mt-0">Find a doctor</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
