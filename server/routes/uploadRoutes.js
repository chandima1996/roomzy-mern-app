import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

// This endpoint will receive an image, upload it to Cloudinary, and return the URL
router.post("/", upload.single("image"), (req, res) => {
  res.status(200).json({ imageUrl: req.file.path });
});

export default router;
