/**
 * Seeds team members from the static teamData.js into Sanity.
 *
 * Usage:
 *   SANITY_TOKEN=your-token node apps/cms/scripts/seed-team-members.mjs
 *
 * Environment variables:
 *   SANITY_TOKEN  (required for writes)
 *   SANITY_DATASET (default: production)
 */

import { createClient } from "@sanity/client";

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

// ── Static source data ─────────────────────────────────────────────────────

const members = [
  {
    name: "Rahul Singh",
    slug: "rahulsingh",
    role: "COO",
    bio: "Focused on operations, curriculum coordination, student support, and creating smoother learning experiences that help students stay consistent and career-focused.",
    specialization: "",
    imagePath: "images/team/rahul-singh.webp",
    imageClassName: "object-top scale-[1.15] group-hover:scale-[1.25] md:group-hover:scale-[1.25]",
    badge: "Leadership",
    socials: {
      linkedin: "https://www.linkedin.com/in/rahul-singh-a90ab630/",
      instagram: "https://www.instagram.com/rahul_rs0310?igsh=bmpqejlqZXdsbHN5&utm_source=qr",
      twitter: "https://x.com/rsrsrahul444?s=11",
    },
    groups: ["leadership"],
    order: 0,
    noindex: false,
  },
  {
    name: "Suryansh Upadhyay",
    slug: "suryanshupadhyay",
    role: "CEO",
    bio: "Focused on building SkillYards around practical skills, structured mentorship, and career-focused learning for students after 12th and graduates.",
    specialization: "",
    imagePath: "images/team/suryanshSir.webp",
    imageClassName: "",
    badge: "Leadership",
    socials: {
      linkedin: "https://www.linkedin.com/in/suryansh-upadhyay-346a22347/",
      instagram: "https://www.instagram.com/suryanshupadhyay_official?igsh=MTZnaDg2Z2JyMWNneg==",
      twitter: "https://x.com/SuryanshUpad",
    },
    groups: ["leadership"],
    order: 1,
    noindex: false,
  },
  {
    name: "Mrigesh Deshpande",
    slug: "mrigesh-deshpande",
    role: "Sr. Full Stack Developer",
    bio: "Full Stack Engineer focused on backend scalability, system design, and building robust real-world production systems.",
    specialization: "Backend & Systems Design",
    imagePath: "images/team/Mrigesh-Deshpande.webp",
    imageClassName: "object-center scale-[1.25] group-hover:scale-[1.35] md:group-hover:scale-[1.35]",
    badge: "Core",
    socials: {},
    groups: ["engineering", "carousel", "bcaEducators", "fsdEducators"],
    order: 2,
    noindex: true,
  },
  {
    name: "Chakresh Chakshu",
    slug: "chakresh-chakshu",
    role: "Jr. Full Stack Developer",
    bio: "React & Next.js developer obsessed with high performance, fluid motion animations, and delivering clean UX.",
    specialization: "Next.js & Frontend Architecture",
    imagePath: "images/team/Chakresh-Chakshu.webp",
    imageClassName: "object-center scale-[1.1] group-hover:scale-[1.2] md:group-hover:scale-[1.2]",
    badge: "",
    socials: {},
    groups: ["engineering", "carousel", "bcaEducators", "fsdEducators"],
    order: 3,
    noindex: false,
  },
  {
    name: "Neeraj Dang",
    slug: "neeraj-dang",
    role: "SEO & PPC Specialist",
    bio: "An SEO & PPC Specialist known for data analysis and strategic execution.",
    specialization: "Digital Marketing Strategy",
    imagePath: "images/team/Neeraj.webp",
    imageClassName: "",
    badge: "",
    socials: { linkedin: "https://www.linkedin.com/in/neeraj-dang-70350824a" },
    groups: ["engineering", "carousel", "bbaEducators", "dgmEducators"],
    order: 4,
    noindex: false,
  },
  {
    name: "Kaushal Parihar",
    slug: "kaushal-parihar",
    role: "Field Sales Executive",
    bio: "Supports student outreach and helps learners understand programs, batches, and admissions.",
    specialization: "",
    imagePath: "images/team/KaushalSIr.webp",
    imageClassName: "",
    badge: "Ops",
    socials: { linkedin: "https://linkedin.com" },
    groups: ["operations", "carousel"],
    order: 5,
    noindex: false,
  },
  {
    name: "Khushali Gupta",
    slug: "khushali-gupta",
    role: "Business Development Executive",
    bio: "Where words meet results. Spearheads outbound campaigns and deepens community engagement pipelines.",
    specialization: "",
    imagePath: "images/team/khushali.webp",
    imageClassName: "",
    badge: "",
    socials: { linkedin: "https://linkedin.com" },
    groups: ["operations", "carousel"],
    order: 6,
    noindex: false,
  },
  {
    name: "Bhanu Sharma",
    slug: "bhanu-sharma",
    role: "Administrative Head",
    bio: "Behind the scenes leader: orchestrating systems, managing people, and laying the groundwork for success.",
    specialization: "",
    imagePath: "images/team/Bhanu.webp",
    imageClassName: "",
    badge: "",
    socials: { linkedin: "https://linkedin.com" },
    groups: ["operations", "carousel"],
    order: 7,
    noindex: false,
  },
  {
    name: "Karan Singh Tomar",
    slug: "karan-singh-tomar",
    role: "Business Development Associate",
    bio: "Crafts stories that drive sales and cultivates long-term relationships with institutional partners.",
    specialization: "",
    imagePath: "images/team/Karan.webp",
    imageClassName: "",
    badge: "",
    socials: { linkedin: "https://linkedin.com" },
    groups: ["operations", "carousel"],
    order: 8,
    noindex: false,
  },
  {
    name: "Saurabh Verma",
    slug: "saurabh-verma",
    role: "Business Development Associate",
    bio: "Helps students choose the right program based on goals, background, and career interests.",
    specialization: "",
    imagePath: "images/team/Saurav.webp",
    imageClassName: "",
    badge: "",
    socials: { linkedin: "https://linkedin.com" },
    groups: ["operations", "carousel"],
    order: 9,
    noindex: false,
  },
  {
    name: "Narendra Singh",
    slug: "narendra-singh",
    role: "Digital Marketing Program Director",
    bio: "Leading the Digital Marketing Program with years of industry experience to guide students toward success.",
    specialization: "Program Direction & Strategy",
    imagePath: "images/team/Narendra-Singh.jpeg",
    imageClassName: "object-center scale-[1.2] group-hover:scale-[1.3] md:group-hover:scale-[1.3]",
    badge: "",
    socials: { linkedin: "https://www.linkedin.com/in/narendra-s-singh-51522725" },
    groups: ["engineering", "carousel", "bbaEducators", "dgmEducators"],
    order: 10,
    noindex: false,
  },
];

// ── Upload image & create member ────────────────────────────────────────────

async function uploadImage(imagePath) {
  const { createReadStream } = await import("fs");
  const { resolve } = await import("path");
  const { fileURLToPath } = await import("url");

  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  const fullPath = resolve(__dirname, "../../website/public", imagePath);

  try {
    const stream = createReadStream(fullPath);
    const asset = await client.assets.upload("image", stream, {
      filename: imagePath.split("/").pop(),
    });
    return asset;
  } catch (err) {
    return null;
  }
}

async function seed() {
  console.log(`Seeding ${members.length} team members into dataset "${dataset}"...\n`);

  let created = 0;
  let skipped = 0;

  for (const member of members) {
    const existing = await client.fetch(
      `*[_type == "teamMember" && slug.current == $slug][0]{_id}`,
      { slug: member.slug }
    );

    if (existing) {
      console.log(`  SKIP  ${member.name} (already exists)`);
      skipped++;
      continue;
    }

    let imageAsset = null;
    if (member.imagePath) {
      imageAsset = await uploadImage(member.imagePath);
      if (imageAsset) {
        console.log(`  IMAGE ${member.name} → ${imageAsset._id}`);
      } else {
        console.log(`  WARN  ${member.name} — image not found at ${member.imagePath}`);
      }
    }

    const doc = {
      _type: "teamMember",
      name: member.name,
      slug: { _type: "slug", current: member.slug },
      role: member.role,
      bio: member.bio,
      specialization: member.specialization || undefined,
      imageClassName: member.imageClassName || undefined,
      badge: member.badge || undefined,
      socials: Object.keys(member.socials).length > 0 ? member.socials : undefined,
      groups: member.groups,
      order: member.order,
      noindex: member.noindex,
    };

    if (imageAsset) {
      doc.image = {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      };
    }

    await client.create(doc);
    console.log(`  DONE  ${member.name} (${member.slug})`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
