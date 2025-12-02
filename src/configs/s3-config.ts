import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Config = {
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
    },
};

if (!process.env.AWS_BUCKET_ACCESS_KEY || !process.env.AWS_BUCKET_SECRET_KEY) {
    console.error("Missing AWS S3 credentials in environment variables.");
}

const s3 = new S3Client(s3Config);

export { s3, PutObjectCommand };
