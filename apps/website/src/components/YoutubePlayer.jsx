"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function YouTubePlayer({
  videoIds,
  width = "100%",
  height = 480,
  controls = true,
  autoPlay = false,
}) {
  const videoArray = Array.isArray(videoIds) ? videoIds : [videoIds];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activated, setActivated] = useState(autoPlay);

  const playerRef = useRef(null);

  const handleVideoEnd = useCallback(() => {
    if (videoArray.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % videoArray.length);
    }
  }, [videoArray.length]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://www.youtube-nocookie.com") return;
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onStateChange" && data?.info === 0)
          handleVideoEnd();
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleVideoEnd]);

  const navigateNext = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videoArray.length);
    setActivated(true);
  };

  const navigatePrev = () => {
    setCurrentVideoIndex((prev) =>
      prev === 0 ? videoArray.length - 1 : prev - 1,
    );
    setActivated(true);
  };

  const thumbUrl = `https://i.ytimg.com/vi/${videoArray[currentVideoIndex]}/hqdefault.jpg`;

  return (
    <Card className="relative overflow-hidden shadow-lg group py-0">
      <div
        className="relative"
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
        }}
      >
        {!activated ? (
          <button
            type="button"
            className="absolute inset-0 w-full h-full group/thumb"
            aria-label="Play video"
            onClick={() => setActivated(true)}
          >
            <Image
              src={thumbUrl}
              alt="Video thumbnail"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
            <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/30 transition" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl group-hover/thumb:scale-110 transition-transform">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
            </div>
          </button>
        ) : (
          <iframe
            ref={playerRef}
            key={currentVideoIndex}
            src={`https://www.youtube.com/embed/${videoArray[currentVideoIndex]}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=${controls ? 1 : 0}&enablejsapi=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}

        {videoArray.length > 1 && (
          <>
            <button
              type="button"
              onClick={navigatePrev}
              aria-label="Previous video"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="text-white" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={navigateNext}
              aria-label="Next video"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="text-white" aria-hidden="true" />
            </button>
          </>
        )}

        {!controls && activated && (
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => setIsMuted((p) => !p)}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition"
            >
              {isMuted ? (
                <VolumeX className="text-white" />
              ) : (
                <Volume2 className="text-white" />
              )}
            </button>
          </div>
        )}

        {videoArray.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm z-10">
            {currentVideoIndex + 1} / {videoArray.length}
          </div>
        )}
      </div>
    </Card>
  );
}
