"use client";

import YouTubePlayer from "@/components/YoutubePlayer";

const videoIds = [
  "e2Rutd_ZIoA",
  "oKJ8kzPf_Ds",
  "vphzE_WqcPc",
  "fpmVzeoYyJQ",
  "F5Oom9g1oAQ",
];

export default function VideoTestimonials() {
  return (
    <section className="bg-muted/40 border-y border-border py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Watch & Listen
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
            In Their Own Words
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Watch SkillYards students talk about their experience, the training,
            and life after placement.
          </p>
        </div>

        {/* Video player */}
        <div className="mx-auto max-w-xs sm:max-w-sm">
          <div className="relative rounded-3xl p-1.5 bg-linear-to-b from-primary/40 via-primary/5 to-transparent shadow-xl ring-1 ring-border/50">
            <div className="absolute inset-x-10 -top-px h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
            <div className="rounded-[1.6rem] overflow-hidden bg-background">
              <YouTubePlayer
                autoPlay={false}
                videoIds={videoIds}
                height={480}
              />
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-5">
            {videoIds.length} video testimonials · Tap to play
          </p>
        </div>
      </div>
    </section>
  );
}
