import { s3Client } from "@/integrations/r2/r2.client";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  try {
    const bucket = process.env.R2_BUCKET;
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const s3Response = await s3Client.send(command);
    const audioBuffer = Buffer.from(await s3Response.Body.transformToByteArray());

    // Detect Content-Type based on file extension
    let contentType = "audio/mpeg";
    if (key.endsWith(".wav")) {
      contentType = "audio/wav";
    } else if (key.endsWith(".m4a")) {
      contentType = "audio/x-m4a";
    } else if (key.endsWith(".ogg")) {
      contentType = "audio/ogg";
    }

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": audioBuffer.length.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Playback streaming error:", error);
    return new Response("Audio file not found", { status: 404 });
  }
}
