import { createClient } from "@sanity/client";
const c = createClient({ projectId:"2it7abok", dataset:"production", apiVersion:"2024-01-01", token: process.env.SANITY_TOKEN, useCdn:false });
const posts = await c.fetch(`*[_type=="post"]{ "slug": slug.current, "bodyImages": content[_type=="image"].asset->url }`);
let total=0, postsWith=0;
for(const p of posts){ const n=(p.bodyImages||[]).filter(Boolean).length; total+=n; if(n)postsWith++; }
console.log("posts with body imgs:", postsWith, "| total body image urls:", total);
process.exit(0);
