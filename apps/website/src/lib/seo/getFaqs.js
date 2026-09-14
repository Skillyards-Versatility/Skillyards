import { sanityClient } from "@/lib/sanity/client";
import {
  FAQS_BY_CATEGORY_QUERY,
  ALL_FAQ_CATEGORIES_QUERY,
} from "@/lib/sanity/queries";
import { faqCategories } from "@/data/faqs";

const CACHE_TAGS = { next: { tags: ["faqs"] } };

export async function getPageFaqs(categorySlug, limit = 4) {
  try {
    const category = await sanityClient.fetch(
      FAQS_BY_CATEGORY_QUERY,
      { slug: categorySlug },
      CACHE_TAGS,
    );
    if (category?.faqs && category.faqs.length > 0) {
      return category.faqs.slice(0, limit);
    }
  } catch (error) {
    console.error(
      `Failed to fetch FAQs for slug "${categorySlug}" from Sanity:`,
      error,
    );
  }

  // Fallback to local static faqs if Sanity returns empty or fails
  const localCategory = faqCategories[categorySlug];
  if (localCategory && localCategory.faqs) {
    return localCategory.faqs.slice(0, limit);
  }

  return [];
}

export async function getAllFaqCategories() {
  return sanityClient.fetch(ALL_FAQ_CATEGORIES_QUERY, {}, CACHE_TAGS);
}

export async function getMergedFaqsForSchema(categorySlugs = []) {
  if (!categorySlugs.length) return [];

  const results = await Promise.all(
    categorySlugs.map((slug) => getPageFaqs(slug, 999)),
  );

  return results.flat();
}
