import { ORGANIZATION_ID, WEBSITE_ID } from "./global.js";
import { absoluteUrl, withFragment } from "../core/url.js";

export const getWebPageSchema = (page) => {
  if (!page) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": withFragment(absoluteUrl(page.url), "#webpage"),
    url: absoluteUrl(page.url),
    name: page.name,
    ...(page.description && { description: page.description }),
    ...(page.keywords && { keywords: page.keywords }),
    isPartOf: {
      "@id": WEBSITE_ID
    },
    about: {
      "@id": ORGANIZATION_ID
    }
  };
};

export const getAboutPageSchema = (page) => {
  if (!page) return null;
  return {
    ...getWebPageSchema(page),
    "@type": ["WebPage", "AboutPage"],
  };
};

export const getContactPageSchema = (page) => {
  if (!page) return null;
  return {
    ...getWebPageSchema(page),
    "@type": ["WebPage", "ContactPage"],
  };
};

export const getCollectionPageSchema = (page) => {
  if (!page) return null;
  return {
    ...getWebPageSchema(page),
    "@type": ["WebPage", "CollectionPage"]
  };
};

export const getImageGallerySchema = (page) => {
  if (!page) return null;
  return {
    ...getWebPageSchema(page),
    "@type": ["WebPage", "ImageGallery"],
    ...(page.images && page.images.length
      ? buildImageObjects(page.images, absoluteUrl(page.url))
      : {}),
  };
};

const buildImageObjects = (images, pageAbsUrl) => ({
  hasPart: images.map((img, i) => ({
    "@type": "ImageObject",
    "@id": `${pageAbsUrl}#image-${i}`,
    contentUrl: img.contentUrl || img.url || img.loc,
    ...(img.name && { name: img.name }),
    ...(img.title && { name: img.title }),
    ...(img.caption && { caption: img.caption }),
    ...(img.thumbnailUrl && { thumbnailUrl: img.thumbnailUrl }),
    ...(i === 0 ? { representativeOfPage: true } : {}),
  })),
});

export const getVideoGallerySchema = (page) => {
  if (!page) return null;
  return {
    ...getWebPageSchema(page),
    "@type": ["WebPage", "VideoGallery"]
  };
};
