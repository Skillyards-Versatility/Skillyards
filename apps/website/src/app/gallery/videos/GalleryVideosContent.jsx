"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import PageHero from "@/components/PageHero";
import { Play, MonitorPlay } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getVideoGallerySchema } from "@/lib/seo/schema/webPageSchema";
import videos from "@/data/videos.json";

/* ─── Laptop mockup ──────────────────────────────────────────────────────── */
function LaptopScreen({ videoId }) {
  return (
    <div className="w-full">
      {/* Lid */}
      <div
        className="relative rounded-t-2xl rounded-b-sm overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #2e2e32 0%, #1e1e22 60%, #141416 100%)",
          padding: "12px 12px 0 12px",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.07), 0 32px 64px rgba(0,0,0,0.35)",
        }}
      >
        {/* Webcam */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-10">
          <div className="w-2 h-2 rounded-full bg-[#1a1a1e] border border-[#383838] shadow-inner" />
        </div>

        {/* Bezel gap */}
        <div className="h-6" />

        {/* Screen */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "#000",
            borderRadius: "6px 6px 0 0",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Browser chrome bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#0f0f0f] border-b border-white/5">
            {/* macOS traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>

            {/* Fake address bar */}
            <div className="flex-1 mx-4 flex items-center gap-1.5 bg-[#1c1c1e] border border-white/8 rounded-md px-3 py-0.5">
              <svg
                className="w-3 h-3 text-white/30 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-[10px] text-white/30 truncate">
                youtube.com/watch
              </span>
            </div>

            {/* YouTube logo */}
            <svg
              viewBox="0 0 90 20"
              className="h-3.5 w-auto shrink-0"
              fill="none"
            >
              <path
                d="M27.97 3.12C27.64 1.89 26.68.93 25.45.6 23.22 0 14.29 0 14.29 0S5.35 0 3.12.6C1.89.93.93 1.89.6 3.12 0 5.35 0 10 0 10s0 4.65.6 6.88c.33 1.23 1.29 2.19 2.52 2.52C5.35 20 14.29 20 14.29 20s8.93 0 11.16-.6c1.23-.33 2.19-1.29 2.52-2.52C28.57 14.65 28.57 10 28.57 10s-.01-4.65-.6-6.88z"
                fill="#FF0000"
              />
              <path d="M11.43 14.29L18.86 10l-7.43-4.29v8.58z" fill="#fff" />
            </svg>
          </div>

          {/* Video */}
          <div className="aspect-video w-full bg-black">
            <iframe
              key={videoId}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="Featured video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Hinge */}
      <div
        className="h-2 w-full"
        style={{
          background: "linear-gradient(to bottom, #101012, #2a2a2e)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        }}
      />

      {/* Base */}
      <div
        className="relative h-10 rounded-b-2xl"
        style={{
          background: "linear-gradient(180deg, #242428 0%, #1a1a1c 100%)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <div className="absolute inset-x-10 top-2 flex flex-col gap-1 opacity-15">
          <div className="h-1 rounded-sm bg-white/40" />
          <div className="h-1 rounded-sm bg-white/40 mx-3" />
        </div>
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-md"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        />
      </div>

      {/* Shadow under base */}
      <div
        className="mx-8 h-3 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 75%)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}

export default function GalleryVideosContent() {
  const [featuredId, setFeaturedId] = useState(videos[0].id);
  const playerRef = useRef(null);

  const videoGallerySchema = getVideoGallerySchema({
    url: "/gallery/videos",
    name: "SkillYards Video Gallery",
    description:
      "Watch sessions, workshops, student stories, and real learning moments from SkillYards.",
  });

  return (
    <>
      <JsonLd data={videoGallerySchema} id="gallery-videos-schema" />
      <PageHero
        title="Video Gallery"
        description="Watch sessions, workshops, student stories, and real learning moments from SkillYards."
      />

      {/* ── Feature Section ──────────────────────────────────────────── */}
      <section
        ref={playerRef}
        className="relative overflow-hidden bg-background"
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-border" />

        {/* Soft primary glow behind laptop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-12">
          {/* Label */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2 border border-border bg-card rounded-full px-4 py-1.5 shadow-sm">
              <MonitorPlay size={13} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Featured Video
              </span>
            </div>
          </div>

          {/* Laptop */}
          <LaptopScreen videoId={featuredId} />
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
      </section>

      {/* ── All Videos Grid ───────────────────────────────────────────── */}
      <div className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-xl font-bold text-foreground">All Videos</h3>
            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              {videos.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => {
                  setFeaturedId(video.id);
                  playerRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={video.title}
                    fill
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.dataset.fallback = "1";
                        e.target.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 text-primary shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <Play size={22} className="ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Title row */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {video.title}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                    {video.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
