require('dotenv').config();
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});
async function test() {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: "counselling/test", // this key won't exist but let's just see if we get NoSuchKey
    });
    const response = await s3Client.send(command);
    console.log(response.Body);
  } catch (err) {
    console.log(err.name);
  }
}
test();
