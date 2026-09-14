"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@sanity/client";

// Sanity Client setup
const sanityClient = createClient({
  projectId: "2it7abok",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const DEFAULT_PHOTOS = [
  {
    id: 1,
    src: "/gallery/photo-1.jpg",
    alt: "Students working on a group project",
  },
  {
    id: 2,
    src: "/gallery/photo-2.jpg",
    alt: "Classroom training session",
  },
  {
    id: 3,
    src: "/gallery/photo-3.jpg",
    alt: "Graduation day celebration",
  },
  {
    id: 4,
    src: "/gallery/photo-4.jpg",
    alt: "Campus event",
  },
];

function PhotoTile({ photo, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full h-full overflow-hidden rounded-[2rem] p-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-indigo-500/5 hover:from-white/25 focus:outline-none ${className}`}
    >
      <div className="relative w-full h-full rounded-[calc(2rem-1px)] overflow-hidden bg-[#0d0c11]/85">
        {photo.src ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-[#0d0c11]/85 flex items-center justify-center p-4">
            <span className="text-white/80 text-xs sm:text-sm font-medium text-center">
              {photo.alt}
            </span>
          </div>
        )}

        {/* Sleek Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
          <span className="text-white text-xs sm:text-sm font-semibold tracking-wide truncate w-full text-left">
            {photo.alt}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const query = `*[_type == "galleryImage" && showInDome == true] | order(order asc, _createdAt desc)`;
        const data = await sanityClient.fetch(query);

        const mappedPhotos = data
          .map((doc, idx) => {
            let src = "";
            if (doc.image && doc.image.asset && doc.image.asset._ref) {
              const ref = doc.image.asset._ref;
              const parts = ref.split("-");
              const id = parts[1];
              const dimensions = parts[2];
              const extension = parts[3];
              src = `https://cdn.sanity.io/images/2it7abok/production/${id}-${dimensions}.${extension}`;
            }
            return {
              id: doc._id || idx,
              src,
              alt: doc.title || "Campus Photo",
            };
          })
          .filter((p) => p.src);

        setPhotos(mappedPhotos.length > 0 ? mappedPhotos : DEFAULT_PHOTOS);
      } catch (err) {
        console.error("Failed to fetch gallery images from Sanity:", err);
        setPhotos(DEFAULT_PHOTOS);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  if (loading) {
    return (
      <section className="w-full bg-slate-950 dark:bg-[#050505] py-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-10 w-48 bg-white/10 rounded-full mx-auto mb-12 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 sm:gap-4 h-[420px] sm:h-[480px]">
            <div className="col-span-2 md:col-span-2 row-span-2 bg-white/5 rounded-[2rem] animate-pulse" />
            <div className="col-span-1 row-span-1 bg-white/5 rounded-[2rem] animate-pulse" />
            <div className="col-span-1 row-span-1 bg-white/5 rounded-[2rem] animate-pulse" />
            <div className="col-span-2 md:col-span-2 row-span-1 bg-white/5 rounded-[2rem] animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  // Ensure we have at least 4 photos for the Bento grid, even if they are placeholders
  const displayPhotos = [...photos];
  while (displayPhotos.length < 4) {
    displayPhotos.push({
      id: `placeholder-${displayPhotos.length}`,
      src: "",
      alt: "Campus Photo Coming Soon",
    });
  }

  return (
    <section className="relative overflow-hidden w-full bg-slate-950 dark:bg-[#050505] transition-colors duration-300 py-24 px-4 sm:px-6 md:px-8">
      {/* Background Mesh Glows */}
      <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#00AEEF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-purple-400 mb-4 border border-purple-500/20">
            CAMPUS SHOTS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Our Gallery
          </h2>
        </div>

        {/* Bento-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[420px] sm:h-[480px]">
          <PhotoTile
            photo={displayPhotos[0]}
            className="col-span-2 md:col-span-2 row-span-2"
            onClick={() => setActiveIndex(0)}
          />
          <PhotoTile
            photo={displayPhotos[1]}
            className="col-span-1 row-span-1"
            onClick={() => setActiveIndex(1)}
          />
          <PhotoTile
            photo={displayPhotos[2]}
            className="col-span-1 row-span-1"
            onClick={() => setActiveIndex(2)}
          />
          <PhotoTile
            photo={displayPhotos[3]}
            className="col-span-2 md:col-span-2 row-span-1"
            onClick={() => setActiveIndex(3)}
          />
        </div>

        {/* Lightbox */}
        {activeIndex !== null && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center px-4 transition-all duration-300"
            onClick={() => setActiveIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-all duration-300 active:scale-95"
            >
              ×
            </button>

            {/* Image Container with Double Bezel */}
            <div
              className="relative w-full max-w-4xl aspect-[4/3] max-h-[80vh] rounded-[2rem] p-[1px] bg-gradient-to-b from-white/20 to-transparent shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full rounded-[calc(2rem-1px)] overflow-hidden bg-black/80">
                {photos[activeIndex]?.src ? (
                  <Image
                    src={photos[activeIndex].src}
                    alt={photos[activeIndex].alt}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 text-center text-gray-400">
                    {photos[activeIndex]?.alt}
                  </div>
                )}
                {/* Description bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 to-transparent p-6 text-center">
                  <p className="text-white text-sm sm:text-base font-semibold tracking-wide">
                    {photos[activeIndex]?.alt}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(
                  (activeIndex - 1 + photos.length) % photos.length,
                );
              }}
              aria-label="Previous photo"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-all duration-300 active:scale-95"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((activeIndex + 1) % photos.length);
              }}
              aria-label="Next photo"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-all duration-300 active:scale-95"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
