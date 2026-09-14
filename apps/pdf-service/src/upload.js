import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

export async function uploadToR2({ key, buffer }) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: "application/pdf",
  });

  await s3Client.send(command);
  return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${key}`;
}

export async function checkReceiptExists(key) {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (err) {
    if (err.name === "NotFound") return false;
    throw err;
  }
}
