import { Manrope } from "next/font/google";

import LandingNavbar from "@/components/home/LandingNavbar";
import Hero from "@/components/home/Hero";
import SpecialtySection from "@/components/home/SpecialtySection";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import HowItWorks from "@/components/home/HowItWorks";
import ForEveryone from "@/components/home/ForEveryone";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import LandingFooter from "@/components/home/LandingFooter";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <div
      className={`${manrope.className} min-h-screen overflow-x-hidden bg-[#f7fbf9] text-[#102b26]`}
    >
      <LandingNavbar />

      <main>
        <Hero />

        <SpecialtySection />

        <FeaturedDoctors />

        <HowItWorks />

        <ForEveryone />

        <Testimonials />

        <FinalCTA />
      </main>

      <LandingFooter />
    </div>
  );
}