import { validatePressMentions } from "./validatePressMentions.js";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isAbsoluteHttpUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateOrgData(orgData) {
  if (!orgData || typeof orgData !== "object") {
    throw new Error("orgData must be an object");
  }

  if (!isNonEmptyString(orgData.name))
    throw new Error("orgData.name is required");
  if (!isAbsoluteHttpUrl(orgData.url))
    throw new Error("orgData.url must be absolute http(s)");
  if (!isNonEmptyString(orgData.description))
    throw new Error("orgData.description is required");

  if (orgData.founders && !Array.isArray(orgData.founders)) {
    throw new Error("orgData.founders must be an array if provided");
  }
  if (Array.isArray(orgData.founders)) {
    orgData.founders.forEach((founder, index) => {
      if (!founder || typeof founder !== "object") {
        throw new Error(`founders[${index}] must be an object`);
      }
      if (!isNonEmptyString(founder.name)) {
        throw new Error(`founders[${index}].name is required`);
      }
    });
  }

  if (orgData.media?.logo?.url && !isAbsoluteHttpUrl(orgData.media.logo.url)) {
    throw new Error("orgData.media.logo.url must be absolute http(s)");
  }
  if (
    orgData.media?.defaultOgImage?.url &&
    !isAbsoluteHttpUrl(orgData.media.defaultOgImage.url)
  ) {
    throw new Error(
      "orgData.media.defaultOgImage.url must be absolute http(s)",
    );
  }

  if (orgData.press) validatePressMentions(orgData.press);
}
