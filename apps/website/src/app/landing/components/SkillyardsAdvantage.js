"use client";
import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import features from "../data/features.json";

function FeatureImageCard({ feature }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-card">
      <Image
        src={feature.image}
        alt={feature.title}
        fill
        sizes="(max-width: 1024px) 100vw, 480px"
        className="object-cover"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}

function buildContent() {
  return features.map((feature) => ({
    title: feature.title,
    content: <FeatureImageCard feature={feature} />,
  }));
}

const content = buildContent();

export default function FeaturesSection() {
  const [api, setApi] = React.useState(null);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="py-20 sm:py-28 bg-[#f3f3f3] dark:bg-[#1c1a21] relative transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 sm:mb-20 px-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-4">
            The SkillYards{" "}
            <span className="text-primary italic font-serif">Advantage</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Here&apos;s why students trust us to launch their careers in tech
            and business.
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-full relative z-10">
        <StickyScroll content={content} />
      </div>

      {/* Mobile */}
      <div className="lg:hidden max-w-6xl mx-auto relative z-10 px-6">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="mx-auto w-full max-w-md"
        >
          <CarouselContent className="-ml-0">
            {features.map((feature) => (
              <CarouselItem key={feature.title} className="pl-0">
                <div className="relative w-full overflow-hidden rounded-3xl shadow-md">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 28rem"
                      className="object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-5 flex justify-center gap-2">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to feature slide ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-muted hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
