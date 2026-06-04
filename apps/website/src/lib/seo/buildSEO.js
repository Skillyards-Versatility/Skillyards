import { SEO_CONFIG } from "./seo.config";
import { validateSEO } from "./validateSEO";

function normalizePath(path) {
  if (!path) return "/";

  let normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

export function buildSEO({
  title,
  description,
  path,
  keywords = [],
  ogType = "website",
  ogImage,
  noindex = false,
}) {
  validateSEO({ title, description, path });

  const safePath = normalizePath(path);

  const absoluteUrl = `${SEO_CONFIG.baseUrl}${safePath}`;

  const finalImage = ogImage || SEO_CONFIG.defaultOGImage;

  return {
    metadataBase: new URL(SEO_CONFIG.baseUrl),

    title: {
      default: title,
      template: SEO_CONFIG.titleTemplate,
    },

    description,

    keywords,

    alternates: {
      canonical: absoluteUrl, 
    },

    openGraph: {
      type: ogType,
      title,
      description,
      url: absoluteUrl, 
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: `${title} | ${SEO_CONFIG.siteName}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [finalImage],
    },

    robots: {
      index: !noindex,
      follow: !noindex,
    },
  };
}
