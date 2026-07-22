const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "https://api.skillyards.in";
export const API = rawApiUrl.startsWith("http") ? rawApiUrl : `https://${rawApiUrl}`;
