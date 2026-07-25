/**
 * Seeds gallery images from the static public directory into Sanity.
 *
 * Usage:
 *   SANITY_TOKEN=your-token node apps/cms/scripts/seed-gallery-images.mjs
 *
 * Environment variables:
 *   SANITY_TOKEN  (required for writes)
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

// ── Static gallery image data ──────────────────────────────────────────────

const galleryImages = [
  { path: "images/life/life-1.webp", title: "SkillYards Entrance and Campus Reception", category: "Campus Life", order: 1 },
  { path: "images/life/life-2.webp", title: "Mentorship and Doubt Solving Session", category: "Classrooms", order: 2 },
  { path: "images/life/life-3.webp", title: "Interactive Classroom Group Discussion", category: "Classrooms", order: 3 },
  { path: "images/life/life-4.webp", title: "Practical Programming Exercise Session", category: "Classrooms", order: 4 },
  { path: "images/life/life-5.webp", title: "SkillYards Campus Presentation Workshop", category: "Workshops", order: 5 },
  { path: "images/life/life-6.webp", title: "Student Peer Learning and Mentorship", category: "Campus Life", order: 6 },
  { path: "images/life/life-7.webp", title: "One-on-One Project Guidance", category: "Classrooms", order: 7 },
  { path: "images/life/life-8.webp", title: "SkillYards Core Interactive Workspace", category: "Campus Life", order: 8 },
  { path: "images/life/life-10.webp", title: "Mentor Demonstration and Code Review", category: "Classrooms", order: 9 },
  { path: "images/life/life-11.webp", title: "Special Technology Workshop Presentation", category: "Workshops", order: 10 },
  { path: "images/life/life-12.webp", title: "Collaborative Student Lab Session", category: "Classrooms", order: 11 },
  { path: "images/life/life-13.webp", title: "Interactive Student Career Seminars", category: "Events", order: 12 },
];

async function uploadImage(imagePath) {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const fullPath = resolve(__dirname, "../../website/public", imagePath);

  try {
    const stream = createReadStream(fullPath);
    const asset = await client.assets.upload("image", stream, {
      filename: imagePath.split("/").pop(),
    });
    return asset;
  } catch (err) {
    console.error(`  ERROR uploading image ${imagePath}:`, err.message);
    return null;
  }
}

async function seed() {
  console.log(`Seeding ${galleryImages.length} gallery images into dataset "${dataset}"...\n`);

  let created = 0;
  let skipped = 0;

  for (const imgData of galleryImages) {
    // Check if document already exists by checking the title
    const existing = await client.fetch(
      `*[_type == "galleryImage" && title == $title][0]{_id}`,
      { title: imgData.title }
    );

    if (existing) {
      console.log(`  SKIP  "${imgData.title}" (already exists)`);
      skipped++;
      continue;
    }

    console.log(`  UPLOADING ${imgData.path}...`);
    const imageAsset = await uploadImage(imgData.path);
    if (!imageAsset) {
      console.log(`  WARN  Skipping "${imgData.title}" due to image upload failure.`);
      skipped++;
      continue;
    }

    const doc = {
      _type: "galleryImage",
      title: imgData.title,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      },
      category: imgData.category,
      showInDome: true,
      noindex: false,
      order: imgData.order,
    };

    await client.create(doc);
    console.log(`  DONE  "${imgData.title}"`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
