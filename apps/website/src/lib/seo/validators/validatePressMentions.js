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

function isIsoDate(value) {
  if (!isNonEmptyString(value)) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function validatePressMentions(pressMentions) {
  if (!Array.isArray(pressMentions)) {
    throw new Error("orgData.press must be an array");
  }

  pressMentions.forEach((mention, index) => {
    if (!mention || typeof mention !== "object") {
      throw new Error(`press[${index}] must be an object`);
    }
    if (!isNonEmptyString(mention.title)) {
      throw new Error(`press[${index}].title is required`);
    }
    if (!isNonEmptyString(mention.publisher)) {
      throw new Error(`press[${index}].publisher is required`);
    }
    if (!isAbsoluteHttpUrl(mention.url)) {
      throw new Error(`press[${index}].url must be an absolute http(s) URL`);
    }
    if (mention.publishedAt != null && !isIsoDate(mention.publishedAt)) {
      throw new Error(
        `press[${index}].publishedAt must be YYYY-MM-DD if provided`,
      );
    }
    if (mention.type != null && !isNonEmptyString(mention.type)) {
      throw new Error(
        `press[${index}].type must be a non-empty string if provided`,
      );
    }
  });
}
