import express from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import {
  getUserTranscriptsController,
  transcribeAudioController,
} from "../controllers/speechtotext.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.post(
  "/transcribe",
  verifyJwt,
  upload.single("audio"),
  transcribeAudioController,
);

router.get("/history", verifyJwt, getUserTranscriptsController);

export default router;
