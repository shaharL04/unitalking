import multer from "multer";
import path from "path";
import crypto from "crypto";

// Multer storage for chat photos
export const multerChatStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "photos/chatPhotos/"); 
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExt);
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const newFileName = `${uniqueSuffix}_${baseName}${fileExt}`;
    cb(null, newFileName);
  },
});

// Multer storage for user profile photos
export const multerUserStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "photos/usersPhotos/"); 
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExt);
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const newFileName = `${uniqueSuffix}_${baseName}${fileExt}`;
    cb(null, newFileName);
  },
});
