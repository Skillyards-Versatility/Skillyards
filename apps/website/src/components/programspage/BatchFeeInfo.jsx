"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  CreditCard,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";

export default function BatchFeeInfo({ batches = [], variant = "programs" }) {
  if (!batches || batches.length === 0) return null;

  const isHome = variant === "home";
  const eyebrow = isHome ? "Upcoming Batches" : "Batch & Fee Info";
  const title = isHome
    ? "Upcoming Batches - Enroll Now"
    : "Next Batches Are Filling Fast.";
  const sectionSubheading = isHome
    ? "Pick Cohort. Claim Seat. Start Fast."
    : null;
  const subtitle = isHome
    ? "Reserve your seat now. See batch timings, fees, available seats, and program details upfront - no surprises."
    : "Seats stay intentionally limited. Each batch card gives you timing, fee clarity, and seat urgency at one glance.";

  return (
    <section className={isHome ? "bg-background py-20" : "bg-card/20 py-20"}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <Sparkles size={13} />
            {eyebrow}
          </motion.div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {isHome ? (
              <>
                Upcoming Batches{" "}
                <span className="italic text-primary">- Enroll Now</span>
              </>
            ) : (
              title
            )}
          </h2>
          {sectionSubheading ? (
            <p className="section-subheading mx-auto mt-3 max-w-2xl text-base font-semibold text-foreground/80">
              {sectionSubheading}
            </p>
          ) : null}
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {batches.map((batch, index) => {
            const imageUrl = batch.image
              ? urlFor(batch.image).width(900).height(700).url()
              : null;

            return (
              <motion.article
                key={`${batch.program}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative flex flex-col gap-4 rounded-sm border border-black/[0.08] bg-white p-[10px] pb-4 shadow-[2px_3px_10px_rgba(0,0,0,0.10)] dark:border-white/[0.08] dark:bg-[#1c1c1a] dark:shadow-[2px_3px_16px_rgba(0,0,0,0.45)]"
              >
                <div
                  aria-hidden="true"
                  className="absolute -top-[9px] left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-[#E24B4A] shadow-md dark:border-[#1c1c1a]"
                />

                {imageUrl ? (
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1px] bg-[#e5e3dc] dark:bg-[#2c2c2a]">
                    <Image
                      src={imageUrl}
                      alt={batch.program || "Batch image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 30vw"
                    />

                    <div className="absolute top-[10px] -left-2 z-[5] h-[18px] w-12 -rotate-12 border border-[rgba(200,180,100,0.25)] bg-[rgba(255,240,180,0.55)] dark:bg-[rgba(255,240,180,0.2)]" />

                    <div className="absolute bottom-[10px] right-[10px] z-[5] rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold uppercase text-[#2c2c2a] backdrop-blur-sm dark:bg-[#1c1c1a]/80 dark:text-[#d3d1c7]">
                      {batch.seatsLeft <= 10
                        ? `${batch.seatsLeft} seats left`
                        : "Open admissions"}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 px-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#888780] dark:text-[#5f5e5a]">
                        {batch.nextBatch}
                      </p>
                      <h3 className="mt-1.5 text-xl font-semibold leading-snug text-[#2c2c2a] dark:text-[#d3d1c7]">
                        {batch.program}
                      </h3>
                    </div>

                    <div className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#5f5e5a] dark:border-white/10 dark:bg-black/20 dark:text-[#b7b3a7]">
                      {batch.emiAvailable ? "EMI" : "No EMI"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-[#5f5e5a] dark:text-[#a8a59b]">
                    <div className="rounded-[14px] border border-black/8 bg-[#faf8f1] px-3 py-2 dark:border-white/8 dark:bg-[#242422]">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] text-[11px] text-[#888780] dark:text-[#6e6c65]">
                        <CalendarDays size={12} />
                        Start
                      </div>
                      <p className="text-base font-medium text-[#2c2c2a] dark:text-[#d3d1c7]">
                        {batch.nextBatch}
                      </p>
                    </div>

                    <div className="rounded-[14px] border border-black/8 bg-[#faf8f1] px-3 py-2 dark:border-white/8 dark:bg-[#242422]">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] text-[11px] text-[#888780] dark:text-[#6e6c65]">
                        <Clock3 size={12} />
                        Duration
                      </div>
                      <p className="text-base font-medium text-[#2c2c2a] dark:text-[#d3d1c7]">
                        {batch.duration || "Contact us"}
                      </p>
                    </div>

                    <div className="rounded-[14px] border border-black/8 bg-[#faf8f1] px-3 py-2 dark:border-white/8 dark:bg-[#242422]">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] text-[11px] text-[#888780] dark:text-[#6e6c65]">
                        <CreditCard size={12} />
                        Fee
                      </div>
                      <p className="text-base font-medium text-[#2c2c2a] dark:text-[#d3d1c7]">
                        {batch.fee}
                      </p>
                    </div>

                    <div className="rounded-[14px] border border-black/8 bg-[#faf8f1] px-3 py-2 dark:border-white/8 dark:bg-[#242422]">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] text-[11px] text-[#888780] dark:text-[#6e6c65]">
                        <Users size={12} />
                        Seats
                      </div>
                      <p
                        className={`text-base font-medium ${batch.seatsLeft <= 10 ? "text-[#d14b45] dark:text-[#ff8f88]" : "text-[#2c2c2a] dark:text-[#d3d1c7]"}`}
                      >
                        {batch.seatsLeft} remaining
                      </p>
                    </div>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    className="mt-1 rounded-full bg-[#23211c] text-base font-semibold text-white hover:bg-[#111111] dark:bg-[#f2efe6] dark:text-[#1c1c1a] dark:hover:bg-white"
                  >
                    <Link
                      href={batch.ctaLink || "/contact"}
                      className="inline-flex items-center justify-center gap-2"
                    >
                      Reserve My Seat
                      <ArrowUpRight size={15} />
                    </Link>
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Questions about fees or batches?{" "}
          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary underline underline-offset-4 hover:opacity-80"
          >
            WhatsApp our counsellors now
          </Link>
        </p>
      </div>
    </section>
  );
}
