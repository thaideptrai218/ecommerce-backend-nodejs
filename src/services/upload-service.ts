import cloudinary from "../configs/cloudinary-config";
import fs from "fs";
import { s3, PutObjectCommand } from "../configs/s3-config";
import { getSignedUrl } from "aws-cloudfront-sign";

const uploadImageFromLocalS3 = async ({ file }) => {
    try {
        const imageName = `${Date.now()}-${file.originalname}`;
        const cloud_front_url = `https://d375ag36hjk2ti.cloudfront.net/${imageName}`;
        const Bucket = process.env.AWS_BUCKET_NAME;

        const putCommand = new PutObjectCommand({
            Bucket,
            Key: imageName,
            Body: file.buffer,
            ContentType: file.mimetype || "image/jpeg",
        });

        await s3.send(putCommand);

        const signedUrl = getSignedUrl(cloud_front_url, {
            keypairId: "K3PWDMWUR3P3T0",
            expireTime: Date.now() + 3600 * 1000,
            privateKeyString: process.env.AWS_BUCKET_PUBLIC_KEY_ID,
        });

        return {
            image_url: signedUrl,
            result: {
                // Return some relevant details from the put operation if needed, or just the signed URL
                Bucket,
                Key: imageName,
            },
        };
    } catch (error) {
        console.error(error);
    }
};

const uploadImageFromUrl = async () => {
    try {
        const urlImage =
            "https://scontent-hkg4-1.cdninstagram.com/v/t51.29350-15/470099763_893139816272550_3555965708903184822_n.jpg?stp=dst-jpg_e15_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InRocmVhZHMuRkVFRC5pbWFnZV91cmxnZW4uNzIweDUyNC5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UuYzIifQ&_nc_ht=scontent-hkg4-1.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2QGMzEPyVdVrFwkbWdmIXgcmvCUeb7O-g3U3yHzolfJ-HX23KfadN278gFKm_fUXTSfXXPOjn9e6ACxtusb_PrAH&_nc_ohc=-2ezvuDdpEkQ7kNvwHR-aIJ&_nc_gid=SXf6MZE2o8o_dUA0nAYFwg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzUyMTg3NTMxMTU4NTY2MTcyNA%3D%3D.3-ccb7-5&oh=00_Afj9BSXJ7R5xrvp0lxu6QK-LJXiuXyeLtWXiQKd7XQgZ1g&oe=6932B86A&_nc_sid=10d13b";
        const folderName = "product/8409";
        const newFileName = "testdemo";

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName,
        });
        return result;
    } catch (error) {
        console.error(error);
    }
};

const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: "thumb",
            folder: folderName,
        });

        return {
            image_url: result.secure_url,
            shopId: 8409,
        };
    } catch (error) {
        console.error(error);
    } finally {
        try {
            fs.unlinkSync(path);
        } catch (error) {
            console.error("Error deleting file", error);
        }
    }
};

const uploadImagesFromLocalFiles = async ({
    files,
    folderName = "product/8049",
}) => {
    try {
        console.log(`files`, files, folderName);
        if (!files.length) return [];

        const uploadPromises = files.map(async (file) => {
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: folderName,
                });

                return {
                    image_url: result.secure_url,
                    shopId: 8049,
                    thumb_url: cloudinary.url(result.public_id, {
                        height: 100,
                        width: 100,
                        fetch_format: "auto",
                        quality: "auto",
                    }),
                };
            } finally {
                try {
                    fs.unlinkSync(file.path);
                } catch (error) {
                    console.error("Error deleting file", error);
                }
            }
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        return uploadedUrls;
    } catch (error) {
        console.error(error);
    }
};

export {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImagesFromLocalFiles,
    uploadImageFromLocalS3,
};
