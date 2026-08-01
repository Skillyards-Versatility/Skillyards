import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

/**
 * Upload a PDF document directly to R2
 * @param {Object} params
 * @param {string} params.key - R2 storage destination path
 * @param {Buffer} params.buffer - PDF binary buffer
 */
export async function uploadPdfToR2({ key, buffer }) {
  const command = new PutObjectCommand({
    Bucket: getBucket(),
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
    Bucket: getBucket(),
    Key: key,
    Body: buffer,
    ContentType: contentType || "audio/mpeg",
  });

  await s3Client.send(command);
  return key;
}

/**
 * Upload an image file to R2
 * @param {Object} params
 * @param {string} params.key - R2 storage destination path
 * @param {Buffer} params.buffer - Image binary buffer
 * @param {string} params.contentType - Image mime type
 */
export async function uploadImageToR2({ key, buffer, contentType }) {
  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    Body: buffer,
    ContentType: contentType || "image/png",
  });

  await s3Client.send(command);
  return key;
}

/**
 * Delete an object from R2 by key.
 * @param {Object} params
 * @param {string} params.key - R2 storage key
 */
export async function deleteObjectFromR2({ key }) {
  const command = new DeleteObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });
  await s3Client.send(command);
  return key;
}

/**
 * Get an object from R2 by key.
 * @param {Object} params
 * @param {string} params.key - R2 storage key
 * @returns {Promise<{ body: ReadableStream, contentType: string }>}
 */
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
