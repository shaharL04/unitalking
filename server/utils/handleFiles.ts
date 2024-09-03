import multer from "multer";
import path from "path";
import crypto from "crypto";


export const multerStorage = multer.diskStorage({
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