"use client";

import Image from "next/image";
import partners from "@/data/partners.json";

const track = [...partners, ...partners];

export default function PartnersSlider({ forceLight = false }) {
  return (
    <section className={`relative py-20 ${forceLight ? "bg-white text-gray-900" : "bg-background text-foreground"} overflow-hidden`}>
      {/* Ambient centre glow */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[600px] rounded-full bg-secondary/15 blur-[100px]" />

      <div className="relative z-10">
        {/* ── Heading ── */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-12 space-y-4">
          <h2 className={`font-serif text-4xl sm:text-5xl font-bold ${forceLight ? "text-gray-900" : "text-foreground"} leading-tight`}>
            Companies{" "}
            <span className={`${forceLight ? "text-[#1E7CBC]" : "text-primary"} italic relative inline-block`}>
              Waiting for You
              <svg
                className="absolute -bottom-1 left-0 w-full overflow-visible"
                viewBox="0 0 120 8"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M0 6 Q30 0 60 6 Q90 12 120 6"
                  stroke="#d4c2fc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </div>

        <div className="relative">
          {/* Edge fade masks */}
          <div className={`pointer-events-none absolute left-0 inset-y-0 w-32 z-10 ${forceLight ? "bg-gradient-to-r from-white to-transparent" : "bg-linear-to-r from-background to-transparent"}`} />
          <div className={`pointer-events-none absolute right-0 inset-y-0 w-32 z-10 ${forceLight ? "bg-gradient-to-l from-white to-transparent" : "bg-linear-to-l from-background to-transparent"}`} />

          {/* Single row — scrolls left */}
          <div className="overflow-hidden py-4">
            <style>{`
                          @keyframes infiniteMarquee {
                              0% { transform: translateX(0%); }
                              100% { transform: translateX(-50%); }
                          }
                      `}</style>
            <div
              className="flex gap-5 w-max hover:[animation-play-state:paused]"
              style={{ animation: "infiniteMarquee 28s linear infinite" }}
            >
              {track.map((partner, idx) => (
                <div
                  key={`r1-${idx}`}
                  className={`group shrink-0 flex items-center justify-center w-44 h-20 rounded-2xl ${
                    forceLight
                      ? "border border-gray-200 bg-white hover:border-[#1E7CBC]/40 hover:bg-blue-50/30"
                      : "border border-border/40 bg-card hover:border-primary/40 hover:bg-primary/5"
                  } hover:scale-110 focus-within:scale-110 hover:shadow-lg transition-all duration-300 px-6 overflow-hidden outline-none`}
                >
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={250}
                    height={100}
                    className="object-contain max-h-13 w-auto opacity-80 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 rounded-[inherit]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
