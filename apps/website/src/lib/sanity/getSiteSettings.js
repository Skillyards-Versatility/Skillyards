import { cache } from "react";
import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

export const getAllOgImages = cache(async () => {
  try {
    const settings = await sanityClient.fetch(
      `*[_type == "siteSettings" && _id == "siteSettings"][0]{
        ogImages
      }`,
      {},
      { next: { revalidate: 3600 } }
    );

    const ogImages = settings?.ogImages || {};
    const result = {};
    for (const [key, value] of Object.entries(ogImages)) {
      if (value && value.asset) {
        result[key] = urlFor(value).width(1200).url();
      }
    }
    return result;
  } catch (error) {
    console.error("Failed to fetch site settings OG images:", error);
    return {};
  }
});

export const getBlogOgImages = cache(async () => {
  try {
    const settings = await sanityClient.fetch(
      `*[_type == "siteSettings" && _id == "siteSettings"][0]{
        "blogOgs": blogOgImages[]{
          "slug": post->slug.current,
          ogImage
        }
      }`,
      {},
      { next: { revalidate: 3600 } }
    );

    const result = {};
    for (const entry of settings?.blogOgs || []) {
      if (entry?.slug && entry?.ogImage?.asset) {
        result[entry.slug] = urlFor(entry.ogImage).width(1200).url();
      }
    }
    return result;
  } catch (error) {
    console.error("Failed to fetch blog OG images:", error);
    return {};
  }
});
