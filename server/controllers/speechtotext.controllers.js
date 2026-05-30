import { DeepgramClient } from "@deepgram/sdk";
import fs from "fs";
import Transcript from "../models/speechtotext.models.js";
import dotenv from "dotenv";
dotenv.config();

const deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY);

export const transcribeAudioController = async (req, res) => {
  const filePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded.",
      });
    }
    const audio = fs.readFileSync(filePath);

    const response = await deepgram.listen.v1.media.transcribeFile(audio, {
      punctuate: true,
      model: "nova-2",
      language: "en-US",
      smart_format: true,
      mimetype: req.file.mimetype,
    });

    const text = response.results.channels[0].alternatives[0].transcript;

    const savedTranscript = await Transcript.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      transcription: text,
      user: req.user._id,
    });

    if (savedTranscript) {
      return res.status(200).json({
        success: true,
        data: savedTranscript,
      });
    }
  } catch (error) {
    console.error("Transcription Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to transcribe audio.",
      error: error.message,
    });
  } finally {
    // file cleanup //
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err)
          console.error(`Failed to delete temporary file at ${filePath}:`, err);
        else console.log(`Successfully cleaned up temporary file: ${filePath}`);
      });
    }
  }
};

export const getUserTranscriptsController = async (req, res) => {
  try {
    const trancriptions = await Transcript.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      data: trancriptions,
    });
  } catch (error) {
    console.log("Get Transcriptions Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transcriptions.",
      error: error.message,
    });
  }
};
