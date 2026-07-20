import { createProtectedRoute } from "@/lib/middleware";
import crypto from "crypto";

function hmac(key, string) {
  return crypto.createHmac("sha256", key).update(string).digest();
}

function hmacHex(key, string) {
  return crypto.createHmac("sha256", key).update(string).digest("hex");
}

function sha256Hex(string) {
  return crypto.createHash("sha256").update(string).digest("hex");
}

function getPresignedPutUrl({ bucket, key, accessKeyId, secretAccessKey, endpoint, expiresIn = 3600 }) {
  const baseUrl = endpoint.replace(/\/$/, "");
  const url = new URL(baseUrl);
  const host = url.host;
  
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]/g, "").split(".")[0] + "Z";
  const dateStamp = amzDate.substring(0, 8);
  
  const region = "auto";
  const service = "s3";
  
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  
  const queryParams = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": expiresIn.toString(),
    "X-Amz-SignedHeaders": "host"
  };
  
  const sortedQueryString = Object.keys(queryParams)
    .sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
    .join("&");
    
  const path = `/${bucket}/${key}`;
  
  const canonicalHeaders = `host:${host}\n`;
  const canonicalRequest = [
    "PUT",
    path,
    sortedQueryString,
    canonicalHeaders,
    "host",
    "UNSIGNED-PAYLOAD"
  ].join("\n");
  
  const hashedCanonicalRequest = sha256Hex(canonicalRequest);
  
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hashedCanonicalRequest
  ].join("\n");
  
  const kDate = hmac("AWS4" + secretAccessKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  
  const signature = hmacHex(kSigning, stringToSign);
  
  return `${baseUrl}${path}?${sortedQueryString}&X-Amz-Signature=${signature}`;
}

async function getHandler(req, { ctx }) {
  const secret = req.headers.get("x-app-secret");
  const expectedSecret = process.env.CALL_TRACKER_SECRET || "skillyards_call_tracker_secret_default";

  if (!secret || secret !== expectedSecret) {
    ctx.warn("CALL_TRACKER_AUTH_FAILURE", { secretProvided: !!secret });
    return Response.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const telecallerId = searchParams.get("telecaller_id");
  const toNumber = searchParams.get("to_number");
  const ext = searchParams.get("recording_ext") || "mp3";
  const isTraining = searchParams.get("is_training") === "true";

  if (!telecallerId || !toNumber) {
    return Response.json(
      { success: false, message: "Missing required fields (telecaller_id, to_number)" },
      { status: 400 }
    );
  }

  const cleanPhone = toNumber.replace(/\D/g, "").slice(-10);
  const keyPrefix = isTraining ? "trainings" : "recordings";
  const key = `${keyPrefix}/${telecallerId}/${cleanPhone}_${Date.now()}.${ext}`;

  try {
    const uploadUrl = getPresignedPutUrl({
      bucket: process.env.R2_BUCKET,
      key,
      accessKeyId: process.env.R2_ACCESS_KEY,
      secretAccessKey: process.env.R2_SECRET_KEY,
      endpoint: process.env.R2_ENDPOINT,
      expiresIn: 3600 // 1 hour
    });

    return Response.json({
      success: true,
      uploadUrl,
      key
    });
  } catch (error) {
    ctx.error("PRESIGNED_URL_GENERATION_FAILED", { error: error.message });
    return Response.json(
      { success: false, message: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}

export const GET = createProtectedRoute(getHandler, {
  isPublic: true,
  policy: () => ({ authorized: true }),
});
