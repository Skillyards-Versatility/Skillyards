import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { GALLERY_IMAGES_QUERY } from "@/lib/sanity/queries";

export async function getGalleryImages() {
  try {
    const images = await sanityClient.fetch(
      GALLERY_IMAGES_QUERY,
      {},
      { next: { revalidate: 3600 } }
    );
    return (images || []).map((img) => ({
      id: img._id,
      title: img.title,
      src: img.image ? urlFor(img.image).url() : "",
      category: img.category || "Campus Life",
      showInDome: img.showInDome ?? true,
      noindex: img.noindex ?? false,
      order: img.order ?? 0,
    }));
  } catch (error) {
    console.error("Failed to fetch gallery images from Sanity:", error);
    return [];
  }
}
