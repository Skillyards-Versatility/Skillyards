"use client";

import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Navigation,
  Bus,
  TrainFront,
  Map,
} from "lucide-react";
import SocialLinks from "@/components/SocialLinks";

export default function ContactPageInfoCard() {
  return (
    <div className="flex flex-col gap-5 sm:gap-6 h-full">
      {/* Primary Info Card */}
      <div className="bg-white/80 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-800 shadow-2xl rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative overflow-hidden group flex-1">
        {/* Accent glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-700" />

        <h3 className="text-2xl sm:text-3xl font-playfair font-semibold tracking-tight mb-2 relative z-10">
          SkillYards Head Office
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 relative z-10">
          Drop by for a cup of coffee and explore how we can accelerate your
          learning journey.
        </p>

        <div className="space-y-6 relative z-10">
          {process.env.NEXT_PUBLIC_EMAIL && (
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
              className="group/item flex items-center gap-4 p-3 -mx-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover/item:scale-110 group-hover/item:shadow-lg transition-all duration-300">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-0.5">
                  Email Us
                </p>
                <p className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                  {process.env.NEXT_PUBLIC_EMAIL}
                </p>
              </div>
            </a>
          )}

          {process.env.NEXT_PUBLIC_PHONE && (
            <a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE.replace(/\s+/g, "")}`}
              className="group/item flex items-center gap-4 p-3 -mx-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 group-hover/item:scale-110 group-hover/item:shadow-lg transition-all duration-300">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-0.5">
                  Call Us
                </p>
                <p className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                  {process.env.NEXT_PUBLIC_PHONE}
                </p>
              </div>
            </a>
          )}

          <div className="flex items-start gap-4 p-3 -mx-3 rounded-2xl">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground shadow-sm">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Corporate Address
              </p>
              <address className="not-italic text-base font-medium text-neutral-900 dark:text-neutral-100 leading-relaxed">
                A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra Puri,
                New Agra Colony, Agra, Uttar Pradesh 282005
              </address>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 relative z-10">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 text-center sm:text-left">
            Connect With Us
          </h4>
          <SocialLinks
            showLabel={false}
            className="justify-center sm:justify-start gap-3 md:gap-4"
          />
        </div>
      </div>

      {/* Distances Section */}
      <div className="bg-primary/95 dark:bg-primary/20 overflow-hidden text-primary-foreground dark:text-white shadow-2xl rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative group border border-transparent dark:border-primary/30">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute -bottom-10 -right-10 text-white/10 dark:text-primary/10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ease-out">
          <Map className="w-64 h-64" strokeWidth={1} />
        </div>

        <div className="relative z-10">
          <h3 className="text-2xl font-playfair font-bold mb-6 flex items-center gap-3">
            <Navigation className="w-6 h-6 text-white/80 dark:text-primary/80" />
            Nearby Locations
          </h3>

          <ul className="space-y-5">
            <li className="flex items-center justify-between border-b border-white/10 dark:border-primary/20 pb-3">
              <span className="flex items-center gap-3 text-white/90 dark:text-neutral-200">
                <MapPin className="w-5 h-5 text-white/60 dark:text-primary/60" />
                Bhagwan Talkies Crossing
              </span>
              <span className="font-semibold bg-white/10 dark:bg-primary/20 px-3 py-1 rounded-full text-sm">
                0.2 km
              </span>
            </li>
            <li className="flex items-center justify-between border-b border-white/10 dark:border-primary/20 pb-3">
              <span className="flex items-center gap-3 text-white/90 dark:text-neutral-200">
                <Bus className="w-5 h-5 text-white/60 dark:text-primary/60" />
                ISBT Agra
              </span>
              <span className="font-semibold bg-white/10 dark:bg-primary/20 px-3 py-1 rounded-full text-sm">
                1.5 km
              </span>
            </li>
            <li className="flex items-center justify-between border-b border-white/10 dark:border-primary/20 pb-3">
              <span className="flex items-center gap-3 text-white/90 dark:text-neutral-200">
                <TrainFront className="w-5 h-5 text-white/60 dark:text-primary/60" />
                Raja Ki Mandi Stn.
              </span>
              <span className="font-semibold bg-white/10 dark:bg-primary/20 px-3 py-1 rounded-full text-sm">
                2.5 km
              </span>
            </li>
            <li className="flex items-center justify-between pb-1">
              <span className="flex items-center gap-3 text-white/90 dark:text-neutral-200">
                <TrainFront className="w-5 h-5 text-white/60 dark:text-primary/60" />
                Agra Cantt Stn.
              </span>
              <span className="font-semibold bg-white/10 dark:bg-primary/20 px-3 py-1 rounded-full text-sm">
                7.0 km
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
