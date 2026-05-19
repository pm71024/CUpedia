import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export async function uploadFile(file: Buffer, filename: string, contentType: string) {
  const ext = filename.split(".").pop();
  const key = `${randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET!,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return `${process.env.MINIO_PUBLIC_URL}/${key}`;
}
