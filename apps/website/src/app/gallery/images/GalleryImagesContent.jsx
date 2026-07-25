"use client";

import { useState, useEffect, useCallback } from "react";
import PageHero from "@/components/PageHero";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

export default function GalleryImagesContent({ initialImages = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  // 1. Get unique categories
  const categories = ["All", ...new Set(initialImages.map((img) => img.category).filter(Boolean))];

  // 2. Filter images based on selected category
  const filteredImages = selectedCategory === "All"
    ? initialImages
    : initialImages.filter((img) => img.category === selectedCategory);

  // 3. Handlers for Lightbox Navigation
  const handlePrev = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? filteredImages.length - 1 : prevIndex - 1
    );
  }, [activeImageIndex, filteredImages.length]);

  const handleNext = useCallback(() => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prevIndex) =>
      prevIndex === filteredImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [activeImageIndex, filteredImages.length]);

  const handleClose = useCallback(() => {
    setActiveImageIndex(null);
  }, []);

  // 4. Keyboard Navigation Events
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, handlePrev, handleNext, handleClose]);

  // 5. Prevent Body Scroll when Lightbox is active
  useEffect(() => {
    if (activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImageIndex]);

  return (
    <>
      <PageHero
        title="Image Gallery"
        description="Take an inside look at classrooms, workshops, events, and student interactions that define the SkillYards learning culture."
      />

      <div className="bg-background min-h-screen text-foreground transition-colors duration-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  handleClose(); // Close lightbox if switching category
                }}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider border transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Fallback for empty gallery */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-card">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted text-muted-foreground mb-4">
                <ImageIcon className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground text-sm">No images found in this category.</p>
            </div>
          ) : (
            /* Gallery Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredImages.map((img, index) => (
                <div
                  key={img.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Image wrapper with SEO Indexing handling */}
                  <div 
                    className="relative aspect-video w-full overflow-hidden bg-muted cursor-pointer"
                    onClick={() => setActiveImageIndex(index)}
                  >
                    {img.noindex ? (
                      /* CSS background rendering (Google Image Search ignores CSS background-image assets) */
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${img.src})` }}
                        role="img"
                        aria-label={img.title || "Life at SkillYards"}
                      />
                    ) : (
                      /* Standard responsive image (Fully indexable by Search Engines) */
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={img.src}
                        alt={img.title || "Life at SkillYards"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>

                  {/* Title & Tag Section */}
                  <div className="px-4 py-3.5 flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {img.title}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full shrink-0">
                      {img.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300">
          
          {/* Top Info and Close */}
          <div className="absolute top-4 inset-x-6 flex items-center justify-between text-white/70 text-sm z-50">
            <span className="font-medium tracking-wide">
              {activeImageIndex + 1} / {filteredImages.length}
            </span>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition p-2 bg-white/10 hover:bg-white/20 rounded-full focus:outline-none"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 text-white/75 hover:text-white transition p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-full focus:outline-none z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Image & Caption Display */}
          <div className="relative max-w-5xl max-h-[85vh] w-full px-4 flex flex-col items-center justify-center gap-4 z-40 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filteredImages[activeImageIndex].src}
              alt={filteredImages[activeImageIndex].title || "Gallery View"}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl animate-fade-in"
            />
            {filteredImages[activeImageIndex].title && (
              <p className="text-white/90 text-sm md:text-base text-center mt-2 font-medium max-w-2xl leading-relaxed">
                {filteredImages[activeImageIndex].title}
              </p>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 text-white/75 hover:text-white transition p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-full focus:outline-none z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      )}
    </>
  );
}
