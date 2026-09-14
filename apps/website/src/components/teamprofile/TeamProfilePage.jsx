"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Award,
  Linkedin,
  ArrowRight,
  CheckCircle2,
  Target,
  ShieldCheck,
  Rocket,
  Globe,
  Instagram,
  Twitter,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function TeamProfilePage({ profile }) {
  return (
    <LazyMotion features={domAnimation}>
      <main className="bg-background text-foreground min-h-screen overflow-x-hidden selection:bg-primary/30 selection:text-primary">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <m.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.12, 0.2, 0.12],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-[8%] h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[120px]"
          />
          <m.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.12, 0.18, 0.12],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute right-[6%] top-[18%] h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-[120px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_60%,transparent_100%)]" />
        </div>

        <section className="relative px-4 pb-16 pt-28 sm:px-6 sm:pt-32 md:pt-40 lg:pb-24">
          <div className="mx-auto max-w-7xl">
            <m.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 flex justify-center md:justify-start"
            >
              <Breadcrumbs currentLabel={profile.name} />
            </m.div>

            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <m.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="order-2 lg:order-1"
              >
                <m.span
                  variants={fadeIn}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  <Award className="h-3.5 w-3.5" />
                  {profile.badge}
                </m.span>

                <m.h1
                  variants={fadeIn}
                  className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-7xl leading-[1.1]"
                >
                  {profile.name}
                </m.h1>

                <m.p
                  variants={fadeIn}
                  className="mt-4 text-lg font-bold uppercase tracking-[0.25em] text-primary/80"
                >
                  {profile.role}
                </m.p>

                {profile.headline ? (
                  <m.p
                    variants={fadeIn}
                    className="mt-6 max-w-3xl text-base font-medium leading-relaxed text-foreground/90 sm:text-lg italic border-l-2 border-primary/30 pl-6"
                  >
                    "{profile.headline}"
                  </m.p>
                ) : null}

                <m.p
                  variants={fadeIn}
                  className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg"
                >
                  {profile.intro}
                </m.p>

                <m.div
                  variants={fadeIn}
                  className="mt-8 grid gap-4 sm:grid-cols-3"
                >
                  <ProfileStat
                    icon={<Briefcase className="h-4 w-4" />}
                    label="Role"
                    value={profile.shortRole}
                  />
                  <ProfileStat
                    icon={<MapPin className="h-4 w-4" />}
                    label="Base"
                    value={profile.location}
                  />
                  <ProfileStat
                    icon={<Target className="h-4 w-4" />}
                    label="Focus"
                    value={profile.experienceLabel}
                  />
                </m.div>

                <m.div variants={fadeIn} className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/team"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95"
                  >
                    <span>View Team</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-full border border-border bg-card/50 px-8 py-4 text-sm font-bold text-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:text-primary"
                  >
                    Contact SkillYards
                  </Link>
                  {profile.linkedin ? (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-card/50 p-4 text-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:text-primary"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  ) : null}
                  {profile.twitter ? (
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-card/50 p-4 text-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:text-primary"
                      aria-label="Twitter Profile"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  ) : null}
                  {profile.instagram ? (
                    <a
                      href={profile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-card/50 p-4 text-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:text-primary"
                      aria-label="Instagram Profile"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  ) : null}
                </m.div>
              </m.div>

              <m.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="order-1 lg:order-2"
              >
                <div className="group relative mx-auto aspect-[4/5] w-full max-w-md">
                  <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 to-secondary/20 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-card shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      fill
                      priority
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                </div>
              </m.div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:pb-28">
          <m.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <ContentCard
              icon={<Globe className="h-5 w-5" />}
              eyebrow="Overview"
              title={`About ${profile.name.split(" ")[0]}`}
              body={profile.bio}
              items={profile.highlights}
            />

            <ContentCard
              icon={<Target className="h-5 w-5" />}
              eyebrow="Focus Areas"
              title="Current Working Themes"
              body="Core areas of leadership focus across strategy, execution, growth, and organizational development."
              items={profile.focusAreas}
            />

            <ContentCard
              icon={<ShieldCheck className="h-5 w-5" />}
              eyebrow="Leadership Principles"
              title="Operating Beliefs"
              items={profile.principles}
            />

            <ContentCard
              icon={<Rocket className="h-5 w-5" />}
              eyebrow="Mission"
              title="Leadership Direction"
              body={profile.mission}
              items={
                profile.company
                  ? [`Current organization: ${profile.company}`]
                  : []
              }
            />
          </m.div>
        </section>

        {profile.experience?.length ? (
          <section className="px-4 pb-24 sm:px-6 lg:pb-32">
            <div className="mx-auto max-w-7xl">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
                  Experience
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-5xl">
                  Professional Journey
                </h2>
              </m.div>

              <m.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid gap-6"
              >
                {profile.experience.map((item, idx) => (
                  <ExperienceCard
                    key={`${item.title}-${item.organization}-${item.period}`}
                    item={item}
                    index={idx}
                  />
                ))}
              </m.div>
            </div>
          </section>
        ) : null}
      </main>
    </LazyMotion>
  );
}

function ProfileStat({ icon, label, value }) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-card/60">
      <div className="flex items-center gap-3 text-primary">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
          {label}
        </p>
      </div>
      <p className="mt-2 text-sm font-bold leading-6 text-foreground/90">
        {value}
      </p>
      <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

function ContentCard({ icon, eyebrow, title, body, items = [] }) {
  return (
    <m.div
      variants={fadeIn}
      className="group relative rounded-[2.5rem] border border-white/10 bg-card/50 p-8 shadow-xl shadow-primary/5 backdrop-blur-md transition-all hover:border-primary/20 hover:shadow-primary/10"
    >
      <div className="flex items-center gap-3 text-primary mb-4">
        <div className="rounded-xl bg-primary/10 p-2">{icon}</div>
        <p className="text-xs font-bold uppercase tracking-[0.25em]">
          {eyebrow}
        </p>
      </div>

      <h2 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
        {title}
      </h2>

      {body ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {body}
        </p>
      ) : null}

      {items.length ? (
        <ul className="mt-8 space-y-4">
          {items.map((item) => (
            <li key={item} className="flex gap-4">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary/60" />
              <span className="text-sm font-medium leading-6 text-muted-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon && React.cloneElement(icon, { size: 80 })}
      </div>
    </m.div>
  );
}

function ExperienceCard({ item, index }) {
  return (
    <m.div
      variants={fadeIn}
      className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-card/40 p-8 shadow-lg backdrop-blur-md transition-all hover:border-primary/20 hover:bg-card/60"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between relative z-10">
        <div className="flex gap-6">
          <div className="hidden sm:flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Award className="h-6 w-6" />
            </div>
            <div className="w-px h-full bg-gradient-to-b from-primary/20 to-transparent" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
              {item.organization}
            </p>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {item.title}
            </h3>

            {item.points?.length ? (
              <ul className="mt-6 space-y-3">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary/40" />
                    <span className="text-sm font-medium leading-7 text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 text-sm font-bold tracking-wider text-primary/60 md:text-right flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 border border-primary/10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {item.period}
          </div>
          <p className="px-4 text-[10px] uppercase opacity-60">
            {item.location}
          </p>
        </div>
      </div>
    </m.div>
  );
}
