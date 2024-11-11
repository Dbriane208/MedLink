import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/PrismaClient";
import AppError from "../utils/AppError";
import cloudinary from "../utils/CloudinaryConfig";
import fs from 'fs';

/**
 * Helper function to delete a local file.
 * 
 * @param path - The path to the local file to be deleted.
 */

export const deleteLocalFile = (path: string) => {
    fs.unlink(path, (err) => {
        if (err) console.error('Error deleting local file:', err);
    });
};

/**
 * Deletes an existing user image from Cloudinary.
 * 
 * @param url - The URL of the image on Cloudinary. Extracts the public ID and deletes the image.
 */

export const deleteCloudinaryImage = async (url: string) => {
    const publicId = url.split('/').pop()?.split('.')[0];
    if (publicId) await cloudinary.api.delete_resources([`profile_pictures/${publicId}`], { type: 'upload', resource_type: 'image' });
};

/**
 * Uploads a new profile picture for a user. If the user has an existing profile picture,
 * deletes it from Cloudinary before uploading the new image. Also deletes the local file after upload.
 * 
 * @param req - Express request object, expects a file upload and user ID in params.
 * @param res - Express response object, used to send JSON response with status and profile data.
 * @param next - Express next function, used for error handling.
 */

export const uploadUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, profilePic: true }
        });

        if (!user) return next(new AppError("User not found", 400));
        if (!req.file) return next(new AppError("No file uploaded", 400));

        if (user.profilePic) await deleteCloudinaryImage(user.profilePic);

        const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile_pictures',
            transformation: [{ width: 500, height: 500, crop: "fill" }, { quality: "auto" }, { fetch_format: "auto" }]
        });

        const profile = await prisma.user.update({
            where: { id: userId },
            data: { profilePic: secure_url },
            select: { id: true, name: true, profilePic: true }
        });

        deleteLocalFile(req.file.path);

        res.status(200).json({
            status: 'success',
            message: 'Profile picture updated successfully',
            data: profile
        });
    } catch (err) {
        if (req.file) deleteLocalFile(req.file.path);
        next(new AppError("Uploading a profile picture failed", 500));
    }
};
