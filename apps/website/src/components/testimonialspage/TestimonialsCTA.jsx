import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function TestimonialsCTA() {
  return (
    <section className="bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={20}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
          Ready to write your own story?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          Join thousands of students who chose SkillYards to build real skills,
          real projects, and real careers. Your review could be next.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/programs"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-7 py-3.5 rounded-full hover:bg-primary/90 hover:gap-3 transition-all duration-200 group"
          >
            Explore Programs
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-border bg-background text-foreground font-semibold text-sm px-7 py-3.5 rounded-full hover:border-primary/40 hover:text-primary transition-all duration-200"
          >
            Talk to a Counsellor
          </Link>
        </div>
      </div>
    </section>
  );
}
