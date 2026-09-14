import { getFaqAnchorId } from "../faqUtils";

/**
 * Generate FAQPage JSON-LD structured data.
 *
 * @param {Array} faqs - List of FAQ items (each with question/answer or q/a)
 * @param {string} [baseUrl=""] - Absolute URL of the page for per-FAQ anchor links
 * @returns {Object|null} FAQPage schema or null if no valid FAQs
 */
export const getFAQSchema = (faqs = [], baseUrl = "") => {
  const validFaqs = faqs
    .filter((faq) => (faq?.question || faq?.q) && (faq?.answer || faq?.a))
    .map((faq) => {
      const anchorId = getFaqAnchorId(faq);
      return {
        "@type": "Question",
        name: (faq.question || faq.q).trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: (faq.answer || faq.a).replace(/<[^>]*>/g, "").trim(),
        },
        ...(baseUrl && anchorId ? { url: `${baseUrl}#${anchorId}` } : {}),
      };
    });

  if (!validFaqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs,
  };
};
