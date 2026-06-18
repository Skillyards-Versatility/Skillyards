import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "2it7abok",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  token: process.env.SANITY_TOKEN,
});
