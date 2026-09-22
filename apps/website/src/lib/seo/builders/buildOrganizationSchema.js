import {
  ORGANIZATION_ID,
  PRIMARY_LOCATION_ID,
  WEBSITE_ID,
} from "../constants/ids.js";

export function buildOrganizationSchema(data) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORGANIZATION_ID,

    name: data.name,
    url: data.url,
    description: data.description,
    foundingDate: data.foundingDate,

    founder: (data.founders || []).map((founder) => ({
      "@type": "Person",
      name: founder.name,
      ...(founder.jobTitle && { jobTitle: founder.jobTitle }),
    })),

    knowsAbout: data.knowsAbout,

    areaServed: (data.areaServed || []).map((area) => ({
      "@type": area.type,
      name: area.name,
    })),

    logo: {
      "@type": "ImageObject",
      url: data.media?.logo?.url,
      width: data.media?.logo?.width,
      height: data.media?.logo?.height,
    },

    image: {
      "@type": "ImageObject",
      url: data.media?.defaultOgImage?.url,
      width: data.media?.defaultOgImage?.width,
      height: data.media?.defaultOgImage?.height,
    },

    // Canonical location entity (referenced by other schemas via @id).
    location: {
      "@id": PRIMARY_LOCATION_ID,
    },

    address: {
      "@type": "PostalAddress",
      ...data.location?.address,
    },

    contactPoint: {
      "@type": "ContactPoint",
      ...data.contact,
    },

    sameAs: data.socials,

    ...((data.press?.length || data.socialMentions?.length)
      ? {
          subjectOf: [
            ...(data.press || []),
            ...(data.socialMentions || []),
          ].map((item) => ({
            "@type": item.type || "CreativeWork",
            name: item.title,
            ...(item.publishedAt && { datePublished: item.publishedAt }),
            publisher: {
              "@type": "Organization",
              name: item.publisher,
            },
            url: item.url,
          })),
        }
      : {}),
  };
}

export function buildWebsiteSchema(data) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,

    url: data.url,
    name: data.name,

    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
}

export function buildPrimaryLocationSchema(data) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": PRIMARY_LOCATION_ID,
    name: data.location?.name || data.name,
    address: {
      "@type": "PostalAddress",
      ...data.location?.address,
    },
  };
}
