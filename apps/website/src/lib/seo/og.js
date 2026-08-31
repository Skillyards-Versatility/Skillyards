// Resolves a page's OG image: prefer a Sanity-uploaded one, fall back to the
// existing static asset. `ogImages` is the map returned by getAllOgImages().
export function resolveOgImage(ogImages = {}, pageKey, staticFallback) {
  const sanityUrl = ogImages[pageKey];
  return sanityUrl || staticFallback;
}
