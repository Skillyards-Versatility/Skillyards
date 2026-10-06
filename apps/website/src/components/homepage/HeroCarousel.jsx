"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import dynamic from "next/dynamic";

const HeroParticlesWrapper = dynamic(
  () => import("@/components/homepage/HeroParticlesWrapper"),
  { ssr: false }
);

import slides from "@/data/home-slides.json";
import { useTheme } from "@/app/context/ThemeContext";

const AUTOPLAY_DELAY = 6000;

export default function HeroCarousel() {
  const [activeSlides, setActiveSlides] = React.useState(() => [slides[0]]);
  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(0);
  const [progressKey, setProgressKey] = React.useState(0);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const { theme } = useTheme();

  // Lazy load slides 2-3 after initial paint to maximize mobile LCP
  React.useEffect(() => {
    const loadRemaining = () => {
      setActiveSlides(slides);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(loadRemaining, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(loadRemaining, 1000);
      return () => clearTimeout(id);
    }
  }, []);

  // Re-init Embla when lazy slides mount
  React.useEffect(() => {
    if (api && activeSlides.length > 1) {
      api.reInit();
    }
  }, [api, activeSlides]);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const particleColor = theme === "light" ? "#14248a" : "#d4c2fc";
  const bgColor = "bg-background text-foreground";

  const autoplay = React.useRef(null);
  if (!autoplay.current) {
    autoplay.current = Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setProgressKey((k) => k + 1);
    };

    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  return (
    <section
      className={`relative w-full min-h-[100dvh] sm:min-h-[100dvh] md:min-h-0 md:h-[65vh] lg:h-[80vh] overflow-hidden ${bgColor} transition-colors duration-500 flex flex-col justify-center`}
    >
      {/* Mobile mesh background - pure CSS, no JS, no images */}
      <div className="absolute inset-0 z-0 md:hidden overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-20 w-[70vw] h-[70vw] rounded-full bg-violet-500/30 dark:bg-violet-500/40 blur-3xl transform-gpu will-change-transform" />
        <div className="absolute -bottom-32 -right-16 w-[65vw] h-[65vw] rounded-full bg-blue-500/25 dark:bg-blue-500/35 blur-3xl transform-gpu will-change-transform" />
        <div className="absolute top-1/3 -right-32 w-[55vw] h-[55vw] rounded-full bg-pink-500/15 dark:bg-fuchsia-500/25 blur-3xl transform-gpu will-change-transform" />
          <div
            className="absolute inset-0 text-foreground opacity-[0.06] dark:opacity-[0.1]"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        {/* Background Particles layer - desktop only */}
        {isDesktop && <HeroParticlesWrapper particleColor={particleColor} />}

        <div
          className={`absolute inset-0 z-0 hidden md:block bg-linear-to-r from-background/50 to-transparent pointer-events-none`}
        />

        <Carousel
          setApi={setApi}
          plugins={[autoplay.current]}
          opts={{ loop: true }}
          className="relative z-10 h-full w-full pointer-events-none"
        >
          <CarouselContent className="h-full ml-0 pt-12 sm:pt-4 md:pt-8">
            {activeSlides.map((slide, index) => (
              <CarouselItem
                key={index}
                className="pl-0 min-h-[100dvh] sm:min-h-[100dvh] md:min-h-0 md:h-[65vh] lg:h-[70vh] flex flex-col justify-center"
              >
                <div className="relative h-full w-full">
                  {/* Content */}
                  <div className="relative z-10 flex h-full items-center justify-center text-center">
                    <div className="mx-auto w-full max-w-7xl px-6 sm:px-12 md:px-24">
                      <div className="max-w-3xl mx-auto flex flex-col items-center">
                        <span
                          className={`badge-text mb-4 inline-block rounded-full ${theme === "light" ? "bg-primary/10 text-primary border border-primary/20" : "bg-primary/20 text-primary border border-primary/30"} px-5 py-1.5 text-sm font-semibold tracking-wide backdrop-blur pointer-events-auto`}
                        >
                          {slide.subtitle?.trim()}
                        </span>

                        {index === 0 ? (
                          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground pointer-events-auto leading-tight">
                            Best IT &amp; Digital Marketing Training Institute
                            in Agra With Degree &amp; Placement
                          </h1>
                        ) : (
                          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground pointer-events-auto leading-tight">
                            {slide.title}
                          </h2>
                        )}

                        <p
                          className={`mt-3 sm:mt-6 text-base md:text-lg text-muted-foreground pointer-events-auto font-medium max-w-2xl leading-relaxed px-2 sm:px-0`}
                        >
                          {slide.description}
                        </p>

                        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pointer-events-auto w-full sm:w-auto px-4 sm:px-0">
                          <div className="relative p-0.5 rounded-full bg-linear-to-r from-violet-500 via-primary to-blue-500 transition-transform duration-300 hover:scale-105 w-full sm:w-auto">
                            <Link
                              href={slide.ctaHref}
                              className="flex items-center justify-center rounded-full bg-background px-8 sm:px-10 py-2.5 sm:py-3 text-base sm:text-lg font-semibold text-foreground"
                            >
                              {slide.cta}
                            </Link>
                          </div>

                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className={`rounded-full backdrop-blur border-border/50 bg-background/50 px-8 sm:px-10 py-3 sm:py-6 text-base sm:text-lg font-semibold text-foreground hover:bg-muted transition-transform hover:scale-105 w-full sm:w-auto`}
                          >
                            <Link href="/contact">
                              Book Free Career Counselling
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex left-6 bg-background/80 hover:bg-background text-foreground border-border shadow-md pointer-events-auto" />
          <CarouselNext className="hidden md:flex right-6 bg-background/80 hover:bg-background text-foreground border-border shadow-md pointer-events-auto" />
        </Carousel>

        <div
          className={`absolute bottom-0 left-0 z-30 h-[3px] w-full bg-muted overflow-hidden`}
        >
          {activeSlides.length > 1 && (
            <div
              key={progressKey}
              className="h-full w-full origin-left bg-primary animate-carousel-progress"
            />
          )}
        </div>

        {/* Bullets */}
        <div
          className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center pointer-events-auto"
          aria-label="Slide navigation"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              className="flex h-11 min-w-11 items-center justify-center p-2 focus:outline-none"
            >
              <span
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === index
                    ? "w-8 bg-primary"
                    : `w-2.5 bg-muted hover:bg-muted-foreground/50`
                }`}
              />
            </button>
          ))}
        </div>
      </section>
  );
}
