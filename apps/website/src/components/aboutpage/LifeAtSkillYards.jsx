"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageIcon, VideoIcon } from "lucide-react";
import DomeGallery from "@/components/ui/Domegallery";

const allImages = [
  { src: "/images/life/life-1.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-2.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-3.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-4.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-5.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-6.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-7.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-8.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-10.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-11.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-12.webp", alt: "Life at SkillYards" },
  { src: "/images/life/life-13.webp", alt: "Life at SkillYards" },
];

export default function LifeAtSkillYards({ images }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const displayImages = images && images.length > 0
    ? images.map(img => ({ src: img.src, alt: img.title || "Life at SkillYards" }))
    : allImages;

  return (
    <section className="bg-background py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Life at SkillYards
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A look at the classrooms, mentor interactions, student energy, and everyday learning environment
              that make SkillYards feel structured, practical, and human.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/gallery/images"
              className="inline-flex items-center gap-2 rounded-xl border border-primary dark:border-foreground
              px-4 py-2 text-sm font-medium transition text-accent-foreground hover:bg-accent"
            >
              <ImageIcon className="h-4 w-4" />
              Image Gallery
            </Link>

            <Link
              href="/gallery/videos"
              className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-2
              text-sm font-medium text-primary hover:text-foreground transition"
            >
              <VideoIcon className="h-4 w-4" />
              Video Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* Dome Gallery */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: isMobile 
  ? "clamp(450px, 75vh, 800px)" 
  : "clamp(550px, 75vh, 900px)", 
        }}
      >
        <DomeGallery
          images={displayImages}
          fit={isMobile ? 0.9 : 0.8}
          minRadius={isMobile ? 200 : 240}
          maxVerticalRotationDeg={6}
          segments={isMobile ? 16 : 20}                    
          dragDampening={1}
          grayscale={false}
          overlayBlurColor="transparent"
          autoRotate={true}
        />

        {/* Mobile — top/bottom solid masks to hide globe poles */}
        <div
          className="md:hidden pointer-events-none"
          style={{ position: "absolute", inset: 0, zIndex: 20 }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "18%",
            background: "linear-gradient(to bottom, var(--background) 55%, transparent 10%)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "18%",
            background: "linear-gradient(to top, var(--background) 55%, transparent 100%)",
          }} />
        </div>

        
        <div
          className="opacity-0 dark:opacity-100 pointer-events-none"
          style={{ position: "absolute", inset: 0, zIndex: 9 }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to bottom, var(--background), transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, var(--background), transparent)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "15%", background: "linear-gradient(to right, var(--background), transparent)" }} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "15%", background: "linear-gradient(to left, var(--background), transparent)" }} />
        </div>
      </div>
    </section>
  );
}
