require('dotenv').config({ path: 'apps/admin/.env.local' });
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
      Key: "counselling/2dcd32b1-5428-4ab2-bf1d-43b3815ec5e8-1785477626837.jpeg",
    });
    const response = await s3Client.send(command);
    console.log("Has transformToWebStream:", typeof response.Body.transformToWebStream);
    if (typeof response.Body.transformToWebStream === "function") {
      const webStream = response.Body.transformToWebStream();
      console.log("Got webStream:", typeof webStream);
      // Try to read one chunk
      const reader = webStream.getReader();
      console.log("Reading first chunk...");
      const { done, value } = await reader.read();
      console.log("Read done:", done, "value length:", value?.length);
    }
  } catch (err) {
    console.log("Error:", err);
  }
}
test();
