import { ORGANIZATION_ID } from "./global.js";
import { absoluteAssetUrl, absoluteUrl } from "../core/url.js";

export const getPersonSchema = (person) => {
  if (!person) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    worksFor: {
      "@id": ORGANIZATION_ID,
    },
    ...(person.url && { url: absoluteUrl(person.url) }),
    ...(person.image && { image: absoluteAssetUrl(person.image) }),
    ...(person.description && { description: person.description }),
  };
};
