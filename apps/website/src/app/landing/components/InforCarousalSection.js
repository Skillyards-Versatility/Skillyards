"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// ---- Replace with your real business info ----
const BUSINESS = {
  name: "Skillyards Versatility Pvt. Ltd.",
  locationTag: "Skillyards Versatility Pvt. Ltd.",
  address: [
    "A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra Puri, New Agra Colony, Agra, Uttar Pradesh 282005",
  ],
  phone: "+9170601 00562",
  phoneDisplay: "+91 70601 00562",
  // timingStatus: "Monday to Saturday 9 am-8pm"<br/> "Sunday-Close",
  timingStatus: "Mon–Sat, 9:00 AM–8:00 PM", // e.g. "Open Now" / "Opening Soon" / "Closed"
  features: ["Classroom Training", "Placement Support"],
  mapsUrl:
    "https://www.google.com/maps/place/Skillyards+Versatility+Pvt.+Ltd./@27.211412,78.0053434,17z/data=!3m1!4b1!4m6!3m5!1s0x3974776a3f3b61d9:0xc26cc82e5a39a7fc!8m2!3d27.211412!4d78.0053434!16s%2Fg%2F11y3ff92hf?entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D",
};

// ---- Replace with your real promo/banner images ----
// Place your images in `seolandingpage/public/carousel/`
const SLIDES = [
  {
    id: 1,
    src: "/carousel/InfoCarousal1.webp",
    alt: "BCA & BBA programs with live project training",
  },
  {
    id: 2,
    src: "/carousel/InfoCarousal2.webp",
    alt: "100% Placement Support - Get interview-ready",
  },
  {
    id: 3,
    src: "/carousel/InfoCarousal3.webp",
    alt: "Full-Stack Development - Hands-on projects",
  },
  {
    id: 4,
    src: "/carousel/InfoCarousal4.webp",
    alt: "Full-Stack Development - Hands-on projects",
  },
  {
    id: 5,
    src: "/carousel/InfoCarousal5.webp",
    alt: "Full-Stack Development - Hands-on projects",
  }
];

export default function InfoCarouselSection() {
  const [slide, setSlide] = useState(0);

  const next = useCallback(() => {
    setSlide((s) => (s + 1) % SLIDES.length);
  }, []);

  const prev = () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length);

  // autoplay
  useEffect(() => {
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="bg-[#f3f3f3] px-4 pt-32 pb-10 sm:pt-36 sm:px-6 lg:pt-40 lg:px-10 dark:bg-[#1c1a21] transition-colors duration-300">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight text-center mb-12 max-w-5xl mx-auto">
           Best Digital Marketing & IT Training Institute in Agra
      </h1>
      <div className="mx-auto grid max-w-6xl gap-0 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground lg:grid-cols-[minmax(0,1fr)_1.4fr] font-sans transition-colors duration-300 shadow-sm">
        {/* ---------- Left: business info ---------- */}
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {BUSINESS.name}
          </h2>

          <p className="border-t border-border pt-4 text-sm font-bold tracking-wide text-primary transition-colors duration-300">
            {BUSINESS.locationTag}
          </p>

          {/* Address */}
          <div className="flex gap-2">
            <PinIcon />
            <div>
              <p className="text-xs font-bold tracking-wide text-primary transition-colors duration-300">
                ADDRESS
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground transition-colors duration-300">
                {BUSINESS.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-2">
            <PhoneIcon />
            <div>
              <p className="text-xs font-bold tracking-wide text-primary transition-colors duration-300">
                PHONE NUMBER
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground transition-colors duration-300">
                {BUSINESS.phoneDisplay}
              </p>
            </div>
          </div>

          {/* Timing */}
          <div className="flex gap-2">
            <ClockIcon />
            <div>
              <p className="text-xs font-bold tracking-wide text-primary transition-colors duration-300">
                TIMING
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground transition-colors duration-300">
                <span>{BUSINESS.timingLabel}</span>
                <span className="text-xs font-semibold text-primary transition-colors duration-300">
                  {BUSINESS.timingStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Feature strip */}
          <div className="mt-2 flex overflow-hidden rounded-xl bg-primary text-primary-foreground">
            {BUSINESS.features.map((f, i) => (
              <div
                key={f}
                className={`flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-semibold sm:text-sm ${
                  i !== 0 ? "border-l border-white/15" : ""
                }`}
              >
                <CheckIcon />
                {f}
              </div>
            ))}
          </div>

          {/* Call / Navigation — mobile only */}
          <div className="mt-2 grid grid-cols-2 gap-4 lg:hidden">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border py-4 text-primary font-bold transition-colors hover:bg-accent"
            >
              <PhoneFilledIcon />
              <span className="text-xs font-bold tracking-wide">CALL</span>
            </a>
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border py-4 text-primary font-bold transition-colors hover:bg-accent"
            >
              <NavigationIcon />
              <span className="text-xs font-bold tracking-wide">
                NAVIGATION
              </span>
            </a>
          </div>
        </div>

        {/* ---------- Right: carousel ---------- */}
        <div className="relative min-h-[280px] bg-[#161433] sm:min-h-[340px] lg:min-h-full overflow-hidden">
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === slide ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {s.src ? (
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={i === 0}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#4C3AE3] to-[#161433] flex items-center justify-center p-4">
                  <span className="text-white/80 text-sm font-medium text-center">
                    {s.alt}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Prev / next arrows */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#161433] shadow transition-colors hover:bg-white"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#161433] shadow transition-colors hover:bg-white"
          >
            <ChevronIcon direction="right" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === slide ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- icons ---------------- */

function PinIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#030e5a] dark:text-[#d4c2fc] transition-colors duration-300" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-6.2-7-11.4A7 7 0 0119 9.6C19 14.8 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="9.6" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#030e5a] dark:text-[#d4c2fc] transition-colors duration-300" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneFilledIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#030e5a] dark:text-[#d4c2fc] transition-colors duration-300" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7v5l3.5 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.5 12.5l2.5 2.5 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavigationIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l3 14-3-2-3 2 3-14z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ChevronIcon({ direction }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}