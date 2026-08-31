import { createClient } from "@sanity/client";
import { readdirSync } from "fs";
import { createImageUrlBuilder } from "@sanity/image-url";
const c = createClient({ projectId:"2it7abok", dataset:"production", apiVersion:"2024-01-01", token: process.env.SANITY_TOKEN, useCdn:false });
const builder = createImageUrlBuilder(c);

const posts = await c.fetch(`*[_type=="post" && !noIndex && defined(slug.current)]{ "slug": slug.current, "coverImage": coverImage.asset->url, "bodyImages": content[_type=="image"].asset->url[], "clippingImage": clippingImage.asset->url }`);
const gallery = await c.fetch(`*[_type=="galleryImage"]{ title, image, noindex, showInDome }`);
const team = await c.fetch(`*[_type=="teamMember" && !noindex && defined(image.asset)]{ name, role, image }`);
const teamWithImg = team;

let blogImgs = 0, blogURLs = 0;
for (const p of posts) {
  const bodyUrls = (p.bodyImages||[]).filter(Boolean);
  const n = (p.coverImage?1:0)+bodyUrls.length+(p.clippingImage?1:0);
  blogImgs += n; if(n) blogURLs++;
}
const galleryImg = gallery.filter(g=>!g.noindex && g.image);
const domeImg = gallery.filter(g=>!g.noindex && g.showInDome && g.image);
const teamImgs = teamWithImg.filter(m=>m.image).map(m=>builder.image(m.image).url());

const staticLife = readdirSync("public/images/life").filter(f=>/\.(webp|jpe?g|png|avif)$/i.test(f));
const staticTeam = readdirSync("public/images/team").filter(f=>/\.(webp|jpe?g|png|avif)$/i.test(f)).filter(f=>!f.endsWith('.png')||true);

const aboutImgs = domeImg.length + staticLife.length + teamImgs.length;
const teamImgsURL = teamImgs.length + staticTeam.length;

console.log("Blog: indexable posts:", posts.length, "| posts w/ images:", blogURLs, "| total blog images:", blogImgs);
console.log("Gallery: total:", gallery.length, "| indexable:", galleryImg.length, "| dome:", domeImg.length);
console.log("Team (Sanity): total:", teamWithImg.length, "| with image:", teamImgs.length);
console.log("Static life:", staticLife.length, "| static team:", staticTeam.length);
console.log("=== TOTAL unique image entries ===");
const total = blogImgs + galleryImg.length + teamImgs.length + staticLife.length + staticTeam.length;
console.log("Total image entries:", total);
console.log("about images:", aboutImgs, "| team page images:", teamImgsURL, "| gallery page:", galleryImg.length);
process.exit(0);
