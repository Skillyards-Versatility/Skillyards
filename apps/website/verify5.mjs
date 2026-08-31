import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { readdirSync } from "fs";
const c = createClient({ projectId:"2it7abok", dataset:"production", apiVersion:"2024-01-01", token: process.env.SANITY_TOKEN, useCdn:false });
const builder = createImageUrlBuilder(c);
const posts = await c.fetch(`*[_type=="post" && !noIndex && defined(slug.current)]{ "slug": slug.current, "coverImage": coverImage.asset->url, "bodyImages": content[_type=="image"].asset->url, "clippingImage": clippingImage.asset->url }`);
const gallery = await c.fetch(`*[_type=="galleryImage"]{ title, image, noindex, showInDome }`);
const team = await c.fetch(`*[_type=="teamMember" && !noindex && defined(image.asset)]{ name, role, image }`);

let blogImgs=0, blogURLs=0;
for(const p of posts){ const n=(p.coverImage?1:0)+((p.bodyImages||[]).filter(Boolean).length)+(p.clippingImage?1:0); blogImgs+=n; if(n)blogURLs++; }
const galleryImg=gallery.filter(g=>!g.noindex&&g.image);
const domeImg=gallery.filter(g=>!g.noindex&&g.showInDome&&g.image);
const teamImgs=team.filter(m=>m.image).map(m=>builder.image(m.image).url());
const life=readdirSync("public/images/life").filter(f=>/\.(webp|jpe?g|png|avif)$/i.test(f));
const st=readdirSync("public/images/team").filter(f=>/\.(webp|jpe?g|png)$/i.test(f));
console.log("Blog imgs:", blogImgs, "| posts w/ imgs:", blogURLs);
console.log("Gallery indexable:", galleryImg.length, "| dome:", domeImg.length);
console.log("Team sanity:", teamImgs.length, "| static life:", life.length, "| static team:", st.length);
console.log("TOTAL:", blogImgs+galleryImg.length+teamImgs.length+life.length+st.length);
process.exit(0);
