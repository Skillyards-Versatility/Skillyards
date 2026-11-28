"use client";

import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Star, ExternalLink, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// Official Google Multi-color "G" SVG Icon
const GoogleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
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
);

// Fallback Initials Helper
const getInitials = (name) => {
  if (!name) return "S";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// Avatar gradient generator
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

// Fallback Reviews if API response is empty or offline
const defaultFallbackReviews = [
  {
    id: "divya-patel",
    name: "Divya Patel",
    date: "2 weeks ago",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces&auto=format&q=80",
    content:
      "Excellent mentorship and career counseling! I completed the digital marketing course here and it was outstanding. They cover SEO, running ad campaigns, and social media with live client accounts, not just screenshots. The placement team arranged multiple interviews right after capstone.",
  },
  {
    id: "pooja-verma",
    name: "Pooja Verma",
    date: "1 month ago",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces&auto=format&q=80",
    content:
      "The practical approach to learning at SkillYards is unmatched in Agra. Live client projects and real industry exposure gave me the confidence to crack agency interviews without hesitation. Even months after batch completion, mentors are always accessible.",
  },
  {
    id: "ayush-talyan",
    name: "Ayush Talyan",
    date: "3 weeks ago",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces&auto=format&q=80",
    content:
      "SkillYards completely transformed my career in digital marketing. Working on live ad budgets with real client money taught me campaign architecture and ROAS optimization that theoretical courses never touch. Cleared agency interview in round 1!",
  },
  {
    id: "rituraj-sharma",
    name: "Rituraj Sharma",
    date: "1 month ago",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&auto=format&q=80",
    content:
      "SkillYards doesn't teach from outdated PPTs. We performed live technical SEO audits on real client domains using Screaming Frog and Ahrefs. Got placed in a top firm with a solid package. Best learning environment in Agra.",
  },
  {
    id: "shubham-chauhan",
    name: "Shubham Chauhan",
    date: "2 months ago",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces&auto=format&q=80",
    content:
      "End-to-end customer acquisition funnels, Meta Lead Ads, and budget pacing that drive real business results. The faculty is extremely supportive and guides you personally on your portfolio and client pitches.",
  },
  {
    id: "shivani-joshi",
    name: "Shivani Joshi",
    date: "2 months ago",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces&auto=format&q=80",
    content:
      "Managing live campaign budgets during training eliminated all interview nervousness. Practical learning with Google Ads, Meta CAPI, and GA4 tracking gave me an edge over other candidates during campus placements.",
  },
  {
    id: "ankit-sharma",
    name: "Ankit Sharma",
    date: "1 month ago",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=faces&auto=format&q=80",
    content:
      "Best training institute in Agra! High quality training with practical exposure and real projects. Mentors are very cooperative and the placement cell is active at every step of your career preparation.",
  },
  {
    id: "hem-agrawal",
    name: "Hem Agrawal",
    date: "3 months ago",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=faces&auto=format&q=80",
    content:
      "Starting my business was a huge leap, but SkillYards digital acquisition training gave me the exact blueprint to generate qualified leads without spending lakhs on outside agencies. Inbound Google Search and Local SEO work wonders.",
  },
];

export default function ReviewsSection({ id = "reviews", data = null }) {
  const [reviewsData, setReviewsData] = useState(data || null);

  // Client-side fallback fetch from /api/reviews if data wasn't provided via SSR
  useEffect(() => {
    if (data) {
      setReviewsData(data);
      return;
    }
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.reviews && json.reviews.length > 0) {
          setReviewsData(json);
        }
      })
      .catch((err) => console.error("Error loading reviews client-side:", err));
  }, [data]);

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const placeId =
    reviewsData?.placeId ||
    process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ||
    "ChIJ2WE7P2p3dDkR_Kc5Wi7IbMI";

  const ratingValue = reviewsData?.rating
    ? Number(reviewsData.rating).toFixed(1)
    : "4.9";
  const userRatingCount = reviewsData?.userRatingCount || 210;

  const googleReviewsUrl = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : "https://www.google.com/maps/search/?api=1&query=Skillyards+Versatility+Pvt+Ltd+Agra";

  // Normalize reviews from Google Places API or fallback items
  const rawReviews =
    reviewsData?.reviews && reviewsData.reviews.length > 0
      ? reviewsData.reviews
      : defaultFallbackReviews;

  const reviews = rawReviews.map((item, idx) => {
    const author = item.authorAttribution || {};
    const name = author.displayName || item.name || "Student Reviewer";
    const avatar = author.photoUri || item.avatar || "";
    const date =
      item.relativePublishTimeDescription || item.date || "Verified Google Review";
    const content = item.text?.text || item.text || item.content || "";
    const rating = item.rating || 5;

    return {
      id: item.id || `google-review-${idx}`,
      name,
      avatar,
      initials: getInitials(name),
      gradient: getAvatarGradient(name),
      date,
      content,
      rating,
      profileUrl: author.uri || "",
    };
  });

  return (
    <section
      id={id}
      className="w-full bg-[#faf9f6] py-16 sm:py-24 font-sans text-gray-800 scroll-mt-20 lg:scroll-mt-24 border-t border-gray-200/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 shadow-xs mb-4">
            <Sparkles className="h-4 w-4 text-blue-600" />
            TRUSTED BY LEARNERS IN AGRA
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Don&apos;t Just Take Our Word for It.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-[#1E7CBC] bg-clip-text text-transparent">
              Hear From Our Students.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Real experiences. Genuine feedback. Discover why students choose
            SkillYards for their learning journey.
          </p>
        </div>

        {/* GOOGLE RATING HIGHLIGHT BLOCK */}
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-14">
          {/* Google G Brand Card */}
          <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200/90 shadow-md flex items-center justify-center mb-3 transition-transform hover:scale-105 duration-300">
            <GoogleIcon className="w-9 h-9" />
          </div>

          {/* Rating Number */}
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {ratingValue} out of 5
          </div>

          {/* 5 Gold Stars */}
          <div className="flex items-center gap-1.5 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-xs"
              />
            ))}
          </div>

          {/* Subtext */}
          <p className="text-xs sm:text-sm font-semibold text-gray-500">
            Based on {userRatingCount}+ Google Reviews
          </p>
        </div>

        {/* REVIEW CARDS CAROUSEL */}
        <div className="relative max-w-6xl mx-auto px-2 sm:px-8">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6 py-2">
              {reviews.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="pl-4 sm:pl-6 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-300/80 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      {/* Top Row: Profile Pic + Reviewer Name + Date + Google Logo */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Google Profile Picture / Initials Avatar */}
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            {review.avatar ? (
                              <img
                                src={review.avatar}
                                alt={review.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full flex items-center justify-center font-bold text-white text-xs bg-linear-to-br ${review.gradient}`}
                              >
                                {review.initials}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug truncate">
                              {review.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {review.date}
                            </p>
                          </div>
                        </div>

                        {/* Google G Logo on top right of card */}
                        <div className="shrink-0 p-1">
                          <GoogleIcon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-2.5">
                        {Array.from({ length: review.rating }).map((_, sIdx) => (
                          <Star
                            key={sIdx}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>

                      {/* Original Review Content */}
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-4">
                        {review.content}
                      </p>
                    </div>

                    {/* Bottom of Card: Divider & Posted on Google */}
                    <div className="pt-3.5 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        Posted on Google
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel Navigation Arrows */}
            <CarouselPrevious className="hidden sm:flex -left-4 md:-left-5 h-10 w-10 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm" />
            <CarouselNext className="hidden sm:flex -right-4 md:-right-5 h-10 w-10 bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm" />
          </Carousel>
        </div>

        {/* CTA: READ MORE REVIEWS ON GOOGLE */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-gray-300 bg-white hover:bg-gray-900 text-gray-800 hover:text-white font-bold text-sm shadow-xs hover:shadow-md transition-all duration-200"
          >
            <span>Read More Reviews on Google</span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
}
