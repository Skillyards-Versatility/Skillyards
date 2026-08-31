import { createClient } from "@sanity/client";
const c = createClient({ projectId:"2it7abok", dataset:"production", apiVersion:"2024-01-01", token: process.env.SANITY_TOKEN, useCdn:false });
const posts = await c.fetch(`*[_type=="post"]{ noIndex, "slug": slug.current, "coverImage": coverImage.asset->url, "bodyCount": count(content[_type=="image"]), "bodyImages": content[_type=="image"].asset->url[] }`);
let allBody=0, indexBody=0, idxAllCovers=0, idxBody=0;
const nix = [];
for(const p of posts){
  const body=(p.bodyImages||[]).filter(Boolean).length;
  allBody+=body;
  if(p.noIndex) nix.push(p.slug);
  else { indexBody+=body; if(p.coverImage) idxAllCovers++; idxBody+=(p.coverImage?1:0); }
}
console.log("total posts:", posts.length, "| noIndex posts:", nix);
console.log("body images ALL posts:", allBody, "| body images indexable:", indexBody);
console.log("indexable posts with cover:", idxAllCovers, "| total indexable blog imgs (cover+body):", idxBody+indexBody);
process.exit(0);
