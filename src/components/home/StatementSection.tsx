import AnimatedSection from "@/components/ui/AnimatedSection";

export default function StatementSection() {
  return <AnimatedSection className="relative overflow-hidden bg-[var(--charcoal-deep)] py-24 text-[var(--background)] sm:py-36"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><span className="block h-1 w-16 bg-[var(--brand)]" /><p className="font-editorial mt-10 max-w-5xl text-5xl leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-8xl">A better appointment<br />should feel effortless.</p><div className="mt-14 grid gap-5 border-t border-white/15 pt-6 text-sm text-white/55 sm:grid-cols-3"><p>Less time waiting on calls.</p><p>More clarity at every step.</p><p>One continuous care record.</p></div></div></AnimatedSection>;
}
