import { createClient } from "@sanity/client";
const c = createClient({ projectId:"2it7abok", dataset:"production", apiVersion:"2024-01-01", token: process.env.SANITY_TOKEN, useCdn:false });
const posts = await c.fetch(`*[_type=="post"]{ "slug": slug.current, "imgs": content[_type=="image"].asset -> { _id }, "assetRefs": content[_type=="image"].asset._ref }`);
let withAsset=0, assetRefs=0;
for(const p of posts){ const n=(p.assetRefs||[]).filter(Boolean).length; assetRefs+=n; if(n)withAsset++; }
console.log("posts:", posts.length, "| posts with body image assetRefs:", withAsset, "| total body assetRefs:", assetRefs);
process.exit(0);
