import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-20 bg-linear-to-r from-primary to-secondary text-primary-foreground">
      <div />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold">
          Start Building Practical Skills With SkillYards
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-primary-foreground">
          Explore SkillYards programs and discover practical, AI-integrated
          learning pathways designed for students after 12th, graduates, and
          career-focused learners.
        </p>
        <p className="mt-3 text-sm font-medium text-primary-foreground/90">
          Next batch starting soon - contact us for the upcoming schedule.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center ">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="shadow-lg shadow-primary"
          >
            <Link href="/programs">Explore Programs</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-foreground text-foreground bg-primary-foreground shadow-lg shadow-primary"
          >
            <Link href="/contact">Book Career Counselling</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
