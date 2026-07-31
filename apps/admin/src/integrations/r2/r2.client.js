import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

function getBucket() {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) throw new Error("R2_BUCKET environment variable is not set");
  return bucket;
}

export async function getObjectFromR2({ key }) {
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });
  const response = await s3Client.send(command);
  return {
    body: response.Body,
    contentType: response.ContentType || "application/octet-stream",
    contentLength: response.ContentLength,
  };
}
