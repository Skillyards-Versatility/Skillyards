import Link from "next/link";
import { CheckCircle2, Home, BookOpen, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Thank You — SkillYards",
  description:
    "Thanks for reaching out to SkillYards. Our team will get in touch with you shortly.",
  alternates: { canonical: "/thank-you-contact" },
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 relative selection:bg-primary/30 min-h-screen z-0 overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_40%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none z-[-1]" />

      <div className="absolute top-0 left-[20%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60 pointer-events-none z-[-1]" />
      <div className="absolute top-[20%] right-[15%] w-[350px] h-[350px] bg-secondary/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50 pointer-events-none z-[-1]" />

      <section className="relative pt-32 sm:pt-36 pb-16 sm:pb-24 md:pt-44 md:pb-32 px-4 sm:px-6 z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30">
              <CheckCircle2
                className="w-12 h-12 sm:w-14 sm:h-14 text-primary-foreground"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <span className="px-4 py-1.5 text-sm font-semibold tracking-wide bg-primary/10 text-accent-foreground rounded-full border border-primary/20 backdrop-blur-md shadow-sm mb-6">
            Message Received
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight font-playfair mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400">
            Thank You!
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
            Your enquiry has reached us. A member of the SkillYards team will
            reach out within
            <span className="font-semibold text-primary"> 24 hours </span>
            to help you take the next step in your career journey.
          </p>

          <div className="mt-10 flex justify-center">
            <Breadcrumbs />
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            <Link
              href="/"
              className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Back to Home
              </span>
            </Link>

            <Link
              href="/bca-training-program-in-agra"
              className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Explore Programs
              </span>
            </Link>

            <Link
              href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
              className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Call Us Now
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
