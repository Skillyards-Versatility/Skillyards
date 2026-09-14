export function validateSEO({ title, description, path }) {
  if (!title) {
    console.warn("SEO ERROR: Missing title");
  }

  if (!description) {
    console.warn("SEO ERROR: Missing description");
  }

  if (!path) {
    console.warn("SEO ERROR: Missing path (required for canonical)");
  }
}
