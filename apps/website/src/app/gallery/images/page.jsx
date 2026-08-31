import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
import JsonLd from "@/components/JsonLd";
import { getImageGallerySchema } from "@/lib/seo/schema/webPageSchema";
import { getBreadcrumbSchema } from "@/lib/seo/schema/breadcrumbSchema";
import { getGalleryImages } from "@/lib/sanity/getGalleryImages";
import GalleryImagesContent from "./GalleryImagesContent";

export const revalidate = 3600; // Revalidate every hour

const galleryImageKeywords = [
    "SkillYards image gallery",
    "SkillYards photos",
    "IT training institute gallery",
    "SkillYards campus images",
    "Student training photos",
    "SkillYards events gallery",
];

export async function generateMetadata() {
    const ogImages = await getAllOgImages();
    return buildSEO({
        title: "SkillYards Image Gallery | Campus Life & Classroom Photos",
        description:
            "Explore the SkillYards image gallery featuring campus life, training sessions, workshops, events, and memorable moments from our learning community.",
        path: "/gallery/images",
        keywords: galleryImageKeywords,
        ogImage: resolveOgImage(ogImages, "gallery", "/images/opengraph/gallery-og.jpg"),
    });
}

export default async function GalleryImagesPage() {
    const images = await getGalleryImages();
    const indexableImages = images.filter((img) => !img.noindex && img.src);

    const gallerySchema = getImageGallerySchema({
        url: "/gallery/images",
        name: "SkillYards Image Gallery",
        description: "Explore the SkillYards image gallery featuring campus life, training sessions, and events.",
        keywords: galleryImageKeywords,
        images: indexableImages.map((img) => ({
            url: img.src,
            name: img.title,
            caption: img.title,
        })),
    });

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Gallery", url: "/gallery" },
        { name: "Images", url: "/gallery/images" },
    ]);

    const combinedSchema = [gallerySchema, breadcrumbSchema].filter(Boolean);

    return (
        <>
            <JsonLd data={combinedSchema} id="gallery-images-schema" />
            <GalleryImagesContent initialImages={images} />
        </>
    );
}
