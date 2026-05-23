// routes/uploadRoutes.js

import express from "express";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// single file upload
router.post(
  "/upload",
  upload.single("audio"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        file: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          mimeType: req.file.mimetype,
          size: req.file.size,
          path: req.file.path,
          url: `/public/${req.file.filename}`,
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  }
);

export default router;