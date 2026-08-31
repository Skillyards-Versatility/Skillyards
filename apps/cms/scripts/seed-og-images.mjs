/**
 * Seeds the Site Settings singleton's OG images from the static public directory
 * into Sanity. Only uploads keys whose field is currently empty, so it is safe to
 * re-run (existing Sanity-managed images are left untouched).
 *
 * Usage:
 *   SANITY_TOKEN=your-token node apps/cms/scripts/seed-og-images.mjs
 *
 * Environment variables:
 *   SANITY_TOKEN   (required for writes)
 *   SANITY_DATASET (default: production)
 */

import { createClient } from "@sanity/client";
import { createReadStream } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const projectId = "2it7abok";
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_TOKEN;

if (!token) {
  console.error(
    "ERROR: SANITY_TOKEN environment variable is required.\n" +
      "Create a token at https://www.sanity.io/manage → API → Tokens → Add token (editor role)."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Map Site Settings ogImages field name -> static file under public/images/opengraph
const OG_MAP = [
  { key: "home", file: "home-og.jpg" },
  { key: "about", file: "about-og.jpg" },
  { key: "contact", file: "contact-og.jpg" },
  { key: "blog", file: "blog-og.jpg" },
  { key: "gallery", file: "gallery-og.jpg" },
  { key: "programs", file: "programs-og.jpg" },
  { key: "careers", file: "careers-og.jpg" },
  { key: "faqs", file: "faqs-og.jpg" },
  { key: "testimonials", file: "testimonials-og.jpg" },
  { key: "successStories", file: "success-stories-og.jpg" },
  { key: "support", file: "support-og.jpg" },
  { key: "sitemapHtml", file: "sitemap-og.jpg" },
  { key: "privacy", file: "privacy-policy-og.jpg" },
  { key: "refund", file: "refund-policy-og.jpg" },
  { key: "terms", file: "terms-of-service-og.jpg" },
];

async function uploadImage(file) {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const fullPath = resolve(__dirname, "../../website/public/images/opengraph", file);

  try {
    const stream = createReadStream(fullPath);
    const asset = await client.assets.upload("image", stream, { filename: file });
    return asset;
  } catch (err) {
    console.error(`  ERROR uploading ${file}:`, err.message);
    return null;
  }
}

async function seed() {
  console.log(`Seeding Site Settings OG images into dataset "${dataset}"...\n`);

  const existing = await client.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0].ogImages`
  );

  let uploaded = 0;
  let skipped = 0;

  for (const { key, file } of OG_MAP) {
    const current = existing && existing[key];
    if (current && current.image) {
      console.log(`  SKIP  "${key}" (already set in Sanity)`);
      skipped++;
      continue;
    }

    console.log(`  UPLOAD ${file} -> ogImages.${key}...`);
    const asset = await uploadImage(file);
    if (!asset) {
      console.log(`  WARN  Skipping "${key}" due to upload failure.`);
      skipped++;
      continue;
    }

    const patch = {
      set: {
        [`ogImages.${key}`]: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
      },
    };

    await client
      .createIfNotExists({ _id: "siteSettings", _type: "siteSettings", title: "SkillYards Site Settings" })
      .then(() => client.patch("siteSettings").set(patch.set).commit())
      .then(() => {
        console.log(`  DONE  ogImages.${key}`);
        uploaded++;
      });
  }

  console.log(`\nDone. Uploaded: ${uploaded}, Skipped: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
