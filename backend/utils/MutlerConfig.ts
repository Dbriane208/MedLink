import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Set up the directory for storing local uploads. If the directory does not exist,
 * create it.
 */

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
   fs.mkdirSync(uploadDir);
}

/**
 * Configure the storage options for multer:
 * - `destination`: Stores files in the `uploads/` directory.
 * - `filename`: Sets the uploaded file's name to a timestamp followed by the original file extension.
 */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

/**
 * Filter for allowed image file types:
 * - Only accepts `.jpeg`, `.png`, and `.gif` formats.
 * - Calls callback with an error if the file type is not allowed.
 * 
 * @param req - Express request object.
 * @param file - The uploaded file.
 * @param cb - The multer callback function to signal acceptance or rejection of the file.
 */

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .png and .gif formats are allowed!'));
    }
};

/**
 * Middleware to handle single file uploads with multer:
 * - Uses `storage` settings to define file destination and naming.
 * - Uses `fileFilter` to restrict file types.
 * - Limits file size to 5 MB and allows only one file.
 */

export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 }
}).single('image');
