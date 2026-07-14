import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET;

/**
 * Upload a PDF document directly to R2
 * @param {Object} params
 * @param {string} params.key - R2 storage destination path
 * @param {Buffer} params.buffer - PDF binary buffer
 */
export async function uploadPdfToR2({ key, buffer }) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: "application/pdf",
  });

  await s3Client.send(command);
  return key;
}

/**
 * Upload an audio file to R2
 * @param {Object} params
 * @param {string} params.key - R2 storage destination path
 * @param {Buffer} params.buffer - Audio binary buffer
 * @param {string} params.contentType - Audio mime type
 */
export async function uploadAudioToR2({ key, buffer, contentType }) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType || "audio/mpeg",
  });

  await s3Client.send(command);
  return key;
}
