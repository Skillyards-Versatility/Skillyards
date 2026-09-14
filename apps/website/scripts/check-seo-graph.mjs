import { orgData } from "../src/lib/seo/data/orgData.js";
import {
  organizationSchema,
  primaryLocationSchema,
  websiteSchema,
} from "../src/lib/seo/schema/global.js";
import { validateOrgData } from "../src/lib/seo/validators/validateOrgData.js";

function isAbsoluteHttpUrl(value) {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function collectIds(node, ids = []) {
  if (!node) return ids;
  if (Array.isArray(node)) {
    node.forEach((item) => collectIds(item, ids));
    return ids;
  }
  if (typeof node !== "object") return ids;

  if (typeof node["@id"] === "string") ids.push(node["@id"]);

  Object.values(node).forEach((value) => collectIds(value, ids));
  return ids;
}

function collectUrlLikeStrings(node, urls = []) {
  if (!node) return urls;
  if (Array.isArray(node)) {
    node.forEach((item) => collectUrlLikeStrings(item, urls));
    return urls;
  }
  if (typeof node !== "object") return urls;

  for (const [key, value] of Object.entries(node)) {
    if (typeof value === "string" && (key === "url" || key === "image")) {
      urls.push({ key, value });
    } else {
      collectUrlLikeStrings(value, urls);
    }
  }
  return urls;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function checkGraph(graph) {
  assert(
    Array.isArray(graph) && graph.length > 0,
    "graph must be a non-empty array",
  );

  const topLevelIds = graph.map((node) => node?.["@id"]).filter(Boolean);
  assert(
    topLevelIds.length === graph.length,
    "every top-level node must have an @id",
  );

  const idCounts = new Map();
  topLevelIds.forEach((id) => idCounts.set(id, (idCounts.get(id) || 0) + 1));
  const duplicates = [...idCounts.entries()].filter(([, count]) => count > 1);
  if (duplicates.length > 0) {
    throw new Error(`duplicate top-level @id: ${duplicates[0][0]}`);
  }

  topLevelIds.forEach((id) => {
    assert(isAbsoluteHttpUrl(id), `@id must be absolute http(s): ${id}`);
  });

  // Internal reference resolution: any @id that points to one of our canonical nodes should exist.
  const allIds = collectIds(graph);
  const definedIds = new Set(topLevelIds);
  const unresolved = [];
  allIds.forEach((id) => {
    if (typeof id !== "string") return;
    if (id.includes("#") && id.startsWith("http") && !definedIds.has(id)) {
      // Allow external fragment IDs, but flag if it looks like it should be local.
      // Heuristic: same origin as our orgData.url.
      if (orgData?.url && id.startsWith(orgData.url)) unresolved.push(id);
    }
  });
  if (unresolved.length > 0) {
    throw new Error(`unresolved internal @id reference: ${unresolved[0]}`);
  }

  // URL-like fields should be absolute.
  const urlFields = collectUrlLikeStrings(graph);
  urlFields.forEach(({ key, value }) => {
    assert(
      isAbsoluteHttpUrl(value),
      `${key} must be absolute http(s): ${value}`,
    );
  });
}

function main() {
  validateOrgData(orgData);

  const graph = [organizationSchema, websiteSchema, primaryLocationSchema];
  checkGraph(graph);

  process.stdout.write("SEO graph check: OK\n");
}

try {
  main();
} catch (error) {
  process.stderr.write(`SEO graph check: FAIL\n${error?.message || error}\n`);
  process.exit(1);
}
