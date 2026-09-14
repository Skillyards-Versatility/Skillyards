export function calculateReadingTime(blocks) {
  if (!blocks) return 1;

  const words = blocks
    .filter((block) => block._type === "block")
    .map((block) => block.children.map((child) => child.text).join(" "))
    .join(" ")
    .split(/\s+/).length;

  const wordsPerMinute = 200;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
