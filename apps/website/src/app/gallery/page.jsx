import { buildSEO } from "@/lib/seo/buildSEO";
import Link from "next/link";
import { Image, Video, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { getCollectionPageSchema } from "@/lib/seo/schema/webPageSchema";
import { getBreadcrumbSchema } from "@/lib/seo/schema/breadcrumbSchema";

export const revalidate = 86400;

const galleryKeywords = [
  "SkillYards gallery",
  "SkillYards campus gallery",
  "IT training institute gallery",
  "SkillYards events photos and videos",
  "Student learning moments",
  "SkillYards classroom gallery",
];

export const metadata = buildSEO({
  title: "SkillYards Gallery | Campus & Learning Showcase",
  description:
    "Explore the SkillYards gallery featuring photos and videos from our campus, training sessions, workshops, events, and student learning experiences.",
  path: "/gallery",
  keywords: galleryKeywords,
  ogImage: "/images/opengraph/gallery-og.jpg",
});

export default function GalleryPage() {
  const collectionSchema = getCollectionPageSchema({
    url: "/gallery",
    name: "SkillYards Gallery",
    description: "Explore the SkillYards gallery featuring photos and videos from our campus, training sessions, workshops, and events.",
    keywords: galleryKeywords
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Gallery", url: "/gallery" },
  ]);

  const combinedSchema = [collectionSchema, breadcrumbSchema].filter(Boolean);

  return (
    <>
      <JsonLd data={combinedSchema} id="gallery-schema" />
      
      <PageHero
        title="SkillYards Gallery"
        description="Take an inside look at our campus life, classroom discussions, mentor sessions, student events, and video testimonials."
      />

      <div className="bg-background text-foreground transition-colors duration-500 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Images */}
            <Link
              href="/gallery/images"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary hover:-translate-y-1"
            >
              {/* Top Accent Gradient */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div>
                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary mb-6 transition-all duration-300 group-hover:scale-110">
                  <Image className="h-6 w-6" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                  Image Gallery
                  <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Browse classroom activities, coding lab sessions, one-on-one mentorship moments, seminars, and workshop events capturing campus life at SkillYards.
                </p>
              </div>
              
              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-primary">
                <span>View Campus Photos</span>
                <span className="text-lg">→</span>
              </div>
            </Link>

            {/* Card 2: Videos */}
            <Link
              href="/gallery/videos"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary hover:-translate-y-1"
            >
              {/* Top Accent Gradient */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div>
                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary mb-6 transition-all duration-300 group-hover:scale-110">
                  <Video className="h-6 w-6" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                  Video Gallery
                  <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Watch learning sessions in action, expert panels, technology workshops, campus life reviews, and heartfelt student testimonials and placement success stories.
                </p>
              </div>
              
              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-primary">
                <span>Watch Video Showcase</span>
                <span className="text-lg">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}