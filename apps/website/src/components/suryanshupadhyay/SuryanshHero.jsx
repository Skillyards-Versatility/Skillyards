"use client";
import Link from "next/link";
import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Linkedin, Twitter, Instagram, ArrowUpRight } from "lucide-react";

const socials = [
  {
    icon: Linkedin,
    url: "https://www.linkedin.com/in/suryansh-upadhyay-346a22347/",
    label: "LinkedIn",
  },
  { icon: Twitter, url: "https://x.com/SuryanshUpad", label: "Twitter" },
  {
    icon: Instagram,
    url: "https://www.instagram.com/suryanshupadhyay_official?igsh=MTZnaDg2Z2JyMWNneg==",
    label: "Instagram",
  },
];

export default function SuryanshHero() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16 px-6 py-16 md:py-20"
      >
        {/* Image */}
        <Link
          href="/suryanshupadhyay"
          aria-label="View Suryansh Upadhyay profile"
          className="relative z-10 group shrink-0 w-52 h-48 md:w-64 md:h-64 mt-6 md:mt-10 block"
        >
          {/* Glow ring */}
          <div className="absolute -inset-3 rounded-full bg-linear-to-br from-primary/30 via-secondary/20 to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Strict Circle Frame */}
          <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-primary/20 shadow-2xl bg-secondary/10">
            <Image
              src="/images/team/suryanshSir.webp"
              alt="Suryansh Upadhyay"
              fill
              sizes="(max-width: 768px) 208px, 256px"
              className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 text-center md:text-left max-w-xl">
          <m.p
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full mb-4"
          >
            Chief Executive Officer
          </m.p>

          <m.h3
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight"
          >
            Suryansh Upadhyay - CEO
          </m.h3>

          <m.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4 text-muted-foreground leading-relaxed"
          >
            Suryansh Upadhyay helped build SkillYards around the idea that
            students need practical skills, industry exposure, and structured
            mentorship alongside traditional education. His focus is on making
            learning more relevant, more practical, and more career-aware for
            students after 12th and graduates.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-6"
          >
            <Link
              href="/suryanshupadhyay"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-transform duration-300 hover:-translate-y-0.5"
            >
              View Profile
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </m.div>

          {/* Social Links */}
          {socials.length > 0 && (
            <m.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative z-20 mt-6 flex justify-center md:justify-start gap-3"
            >
              {socials.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="group/icon p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </m.div>
          )}
        </div>
      </m.div>
    </LazyMotion>
  );
}
