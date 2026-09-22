"use client";

import React, { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Star,
  ExternalLink,
  MessageSquarePlus,
  CheckCircle2,
  ShieldCheck,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

// Helper for initials fallback avatar
const getInitials = (name) => {
  if (!name) return "S";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// Distinct avatar gradients
const getAvatarGradient = (name) => {
  const gradients = [
    "from-violet-500 to-indigo-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-purple-500 to-pink-600",
  ];
  if (!name) return gradients[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
};

export default function GoogleReviewsSection({ data }) {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const reviewsData = data || {
    placeId: "ChIJ2WE7P2p3dDkR_Kc5Wi7IbMI",
    rating: 4.9,
    userRatingCount: 210,
    reviews: [],
  };

  const placeId = reviewsData.placeId || "ChIJ2WE7P2p3dDkR_Kc5Wi7IbMI";
  const mapSearchUrl =
    "https://www.google.com/maps/search/?api=1&query=Skillyards+Versatility+Pvt+Ltd+Agra";
  const writeReviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : mapSearchUrl;
  const viewReviewsUrl = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : mapSearchUrl;

  const reviews = reviewsData.reviews || [];

  // Autoplay plugin configuration (pauses on hover and interaction)
  const autoplay = useRef(null);
  if (!autoplay.current) {
    autoplay.current = Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section
      id="google-reviews"
      aria-label="Google Student Reviews"
      className="relative py-16 sm:py-24 bg-muted/20 border-y border-border/40 overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wider uppercase mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Google Reviews
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Loved by Students. Proven by Results.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            See what real students have to say about their journey at SkillYards,
            from hands-on IT coding labs and digital marketing to DBRAU degree
            and 100% placement support.
          </p>
        </div>

        {/* Bento Trust Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Fixed Trust Scorecard (4 cols on lg) */}
          <div className="lg:col-span-4 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between gap-6">
            <div>
              {/* Google Brand Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-tight">
                      Google Rating
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      SkillYards Agra Campus
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>

              {/* Big Score Display */}
              <div className="py-6 flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black text-foreground tracking-tight">
                  {reviewsData.rating.toFixed(1)}
                </span>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                    Based on{" "}
                    <span className="font-bold text-foreground">
                      {reviewsData.userRatingCount}+ reviews
                    </span>
                  </p>
                </div>
              </div>

              {/* Trust Highlights */}
              <div className="space-y-3 pt-2 pb-6 border-y border-border/60">
                <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <span>Agra&apos;s #1 Practical IT Institute</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>100% Placement Support Guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Taught by Industry Developers</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <a
                id="btn-google-reviews-write"
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl transition-all shadow hover:shadow-md text-sm"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Write a Review on Google
              </a>

              <a
                id="btn-google-reviews-view"
                href={viewReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-background hover:bg-muted border border-border text-foreground font-semibold rounded-xl transition-all text-sm"
              >
                <span>Read all on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Right Column: Responsive Carousel Slider (8 cols on lg) */}
          <div className="lg:col-span-8 w-full min-w-0">
            <Carousel
              setApi={setApi}
              plugins={[autoplay.current]}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              {/* Carousel Top Navigation Bar */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Student Stories
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    {current + 1} / {count || reviews.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-border/80 bg-card hover:bg-muted text-foreground transition-transform hover:scale-105"
                    onClick={() => api?.scrollPrev()}
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-border/80 bg-card hover:bg-muted text-foreground transition-transform hover:scale-105"
                    onClick={() => api?.scrollNext()}
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Carousel Items: Equal Height Cards */}
              <CarouselContent className="-ml-4 items-stretch">
                {reviews.map((review, idx) => {
                  const author = review.authorAttribution || {};
                  const initials = getInitials(author.displayName);
                  const gradient = getAvatarGradient(author.displayName);
                  const text = review.text?.text || "";
                  const isLong = text.length > 180;
                  const isExpanded = expandedIndex === idx;

                  return (
                    <CarouselItem
                      key={idx}
                      className="pl-4 basis-full sm:basis-1/2 flex flex-col h-auto"
                    >
                      <div className="h-full min-h-[300px] bg-card border border-border/80 text-card-foreground rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group overflow-hidden">
                        {/* Background G watermark */}
                        <div className="absolute -top-3 -right-2 text-7xl font-black text-foreground/[0.03] dark:text-foreground/[0.05] select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                          G
                        </div>

                        <div>
                          {/* Reviewer Header */}
                          <div className="flex items-center gap-3.5 mb-4">
                            {author.photoUri ? (
                              <img
                                src={author.photoUri}
                                alt={author.displayName || "Google Reviewer"}
                                className="w-11 h-11 rounded-full object-cover border border-border/80 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div
                                className={`w-11 h-11 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center text-white font-extrabold text-sm shadow-xs shrink-0`}
                              >
                                {initials}
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-foreground text-sm truncate">
                                  {author.displayName || "Verified Student"}
                                </h4>
                                <CheckCircle2
                                  className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                                  title="Verified Google Review"
                                />
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                                <span>Google Reviewer</span>
                                <span>•</span>
                                <span>
                                  {review.relativePublishTimeDescription}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>

                          {/* Review Text with smart clamping */}
                          <p
                            className={`text-foreground/85 text-sm leading-relaxed italic ${
                              !isExpanded && isLong ? "line-clamp-4" : ""
                            }`}
                          >
                            &ldquo;{text}&rdquo;
                          </p>

                          {isLong && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedIndex(isExpanded ? null : idx)
                              }
                              className="mt-1 text-xs font-semibold text-primary hover:underline"
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>
                          )}
                        </div>

                        {/* Card Bottom Meta */}
                        <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Verified Experience
                          </span>
                          {author.uri ? (
                            <a
                              href={author.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
                            >
                              Profile
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span>Agra Campus</span>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {/* Bottom Pagination Dots */}
              <div
                className="flex justify-center items-center gap-1.5 mt-6"
                aria-label="Carousel pagination"
              >
                {Array.from({ length: count || reviews.length }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => api?.scrollTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      current === i
                        ? "w-6 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
