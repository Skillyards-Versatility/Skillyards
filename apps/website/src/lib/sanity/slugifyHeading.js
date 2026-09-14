/**
 * slugifyHeading.js
 *
 * Converts a Portable Text block node into a URL-safe slug
 * that can be used as an HTML `id` attribute.
 *
 * Works for both extraction (server) and rendering (client).
 *
 * @param {object} block  - A Portable Text block object
 * @returns {string}      - e.g. "essential-skills"
 */
export function slugifyHeading(block) {
  // Extract raw text from all children spans
  const text = (block.children ?? []).map((child) => child.text ?? "").join("");

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // strip non-word chars (keep hyphens)
    .replace(/[\s_]+/g, "-") // spaces / underscores → hyphen
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}

export function getHeadingId(block) {
  const slug = slugifyHeading(block);
  if (!slug) return "";

  return block?._key ? `${slug}-${block._key}` : slug;
}

/**
 * extractHeadings
 *
 * Walks a Portable Text content array and returns only the
 * h2 / h3 blocks as a flat list for the sidebar TOC.
 *
 * @param {Array}  blocks  - post.content (Portable Text array)
 * @returns {Array<{ id: string, text: string, level: "h2"|"h3" }>}
 */
export function extractHeadings(blocks = []) {
  return blocks
    .filter(
      (block) => block._type === "block" && ["h2", "h3"].includes(block.style),
    )
    .map((block) => ({
      id: getHeadingId(block),
      text: (block.children ?? []).map((c) => c.text ?? "").join(""),
      level: block.style, // "h2" | "h3"
    }))
    .filter((h) => h.id && h.text); // skip empty headings
}
