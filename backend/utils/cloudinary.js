import { v2 as cloudinary, v2 } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError.js";
import asyncHandler from "./asyncHandler.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return;

        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            folder: "Products",
            resource_type: "auto",
        });

        fs.unlinkSync(localFilePath);
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteFromCloudinary = async (publicId, type) => {
    try {
        if (!publicId) {
            throw new ApiError(404, "Invalid public id or public id incorrect");
        }
        const deleteResult = await v2.uploader.destroy(publicId, {
            resource_type: type,
        });
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while deleting image from cloudinary"
        );
    }
};


export { uploadOnCloudinary, deleteFromCloudinary };
