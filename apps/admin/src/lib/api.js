const defaultApiUrl = process.env.NODE_ENV === "production" ? "https://api.skillyards.in" : "http://localhost:3000";
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || defaultApiUrl;
export const API = rawApiUrl.startsWith("http") ? rawApiUrl : `https://${rawApiUrl}`;
