"use client";

import { useEffect, useState } from "react";
import {
  Star,
  ExternalLink,
  MessageSquarePlus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Helper to get user initials for fallback avatar
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// Helper to get a beautiful random gradient for initials avatar
const getAvatarBg = (name) => {
  const colors = [
    "from-indigo-500 to-purple-600",
    "from-pink-500 to-rose-500",
    "from-blue-500 to-cyan-600",
    "from-teal-500 to-emerald-600",
    "from-amber-500 to-orange-600",
  ];
  if (!name) return colors[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

export default function GoogleReviews() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [placeId, setPlaceId] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const json = await res.json();
      setData(json);

      // Store placeId if available to construct accurate Google Maps URLs
      if (json.placeId) {
        setPlaceId(json.placeId);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Dynamically build maps urls depending on whether we got a Place ID
  const mapSearchUrl =
    "https://www.google.com/maps/search/?api=1&query=Skillyards+Versatility+Pvt+Ltd+Agra";
  const writeReviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : mapSearchUrl;
  const viewReviewsUrl = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : mapSearchUrl;

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20 transition-all duration-300">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-4" />
          <div className="h-8 w-64 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-[#1c1a21] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col h-[220px]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-3 w-full bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
              <div className="h-3 w-4/6 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mt-auto" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-8 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Unable to load reviews
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            There was a problem loading ratings from Google.
          </p>
          <button
            onClick={fetchReviews}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24 transition-all duration-300">
      {/* Top Header Badge & Intro */}
      <div className="flex flex-col items-center text-center mb-12">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wider uppercase mb-4">
          Google Business Profile
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-4">
          Highly Rated Digital Marketing &amp; Full Stack Institute in Agra
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
          200+ students have rated SkillYards on Google - for BBA Digital
          Marketing, BCA Full Stack and our short skill programs.
        </p>
      </div>

      {/* Main Aggregator Card & Action buttons */}
      <div className="bg-card border border-border text-card-foreground rounded-3xl p-6 sm:p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Big Number Badge */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex flex-col items-center justify-center shadow-lg transform -rotate-1">
            <span className="text-4xl sm:text-5xl font-black">
              {data.rating.toFixed(1)}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">
              OUT OF 5
            </span>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-6 h-6 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Google &amp; Justdial Ratings
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Based on{" "}
              <span className="font-bold text-foreground">
                200+ student reviews
              </span>
            </p>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <a
            id="btn-write-google-review"
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5 text-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Write a Review
          </a>
          <a
            id="btn-view-google-reviews"
            href={viewReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-background hover:bg-accent border border-border text-foreground font-bold rounded-xl transition-all shadow-sm hover:-translate-y-0.5 text-sm"
          >
            <span>View on Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.reviews.map((review, i) => {
          const author = review.authorAttribution;
          const initials = getInitials(author.displayName);
          const gradient = getAvatarBg(author.displayName);

          return (
            <div
              key={i}
              className="bg-card border border-border text-card-foreground rounded-2xl shadow-sm hover:shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Google Watermark in background */}
              <span className="absolute -right-3 -top-3 text-[80px] font-black text-foreground/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                G
              </span>

              <div>
                {/* Header: Avatar & Name */}
                <div className="flex items-center gap-4 mb-4">
                  {author.photoUri ? (
                    <img
                      src={author.photoUri}
                      alt={author.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-border"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-extrabold text-sm shadow-inner`}
                    >
                      {initials}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-foreground leading-tight">
                        {author.displayName}
                      </h4>
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-500 fill-emerald-500/10"
                        title="Verified Reviewer"
                      />
                    </div>
                    <span className="text-[11px] text-primary font-bold uppercase tracking-wider">
                      Google Reviewer
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted/40"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                  &ldquo;{review.text.text}&rdquo;
                </p>
              </div>

              {/* Footer: Date & External Profile link */}
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>{review.relativePublishTimeDescription}</span>
                {author.uri && (
                  <a
                    href={author.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
