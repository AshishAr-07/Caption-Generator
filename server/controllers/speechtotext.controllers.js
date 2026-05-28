import { DeepgramClient } from "@deepgram/sdk";
import fs from "fs";
import Transcript from "../models/speechtotext.models.js";
import dotenv from "dotenv";
dotenv.config();

const deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY);

export const transcribeAudioController = async (req, res) => {
  const filePath = req.file?.path;

  try {
    // Validation: Ensure a file was actually uploaded by multer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded.",
      });
    }

    // --- FIX: Pass a native readable stream instead of a raw disconnected buffer ---
    // This allows Deepgram's internal parser to evaluate file headers (.m4a, .webm, etc.) perfectly
    const audioStream = fs.createReadStream(filePath);

    const { result, error } = await deepgram.listen.v1.media.transcribeFile(
      audioStream,
      {
        model: "nova-2",
        language: "en-US",
        smart_format: true,
      },
    );

    if (error) {
      throw new Error(`Deepgram API Error: ${error.message}`);
    }

    // --- SAFELY EXTRACT TRANSCRIPT FROM DEEPGRAM SHAPES ---
    let transcriptionText = "";

    if (result?.results?.channels?.[0]?.alternatives?.[0]) {
      transcriptionText = result.results.channels[0].alternatives[0].transcript;
    } else if (result?.channel?.alternatives?.[0]) {
      transcriptionText = result.channel.alternatives[0].transcript;
    }

    // Fallback if audio file is readable but contains absolute silent voids
    if (!transcriptionText || transcriptionText.trim() === "") {
      transcriptionText = "[No clear speech or audio detected]";
    }

    // Create the database record safely
    const newTranscript = await Transcript.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      text: transcriptionText,
      duration: result?.metadata?.duration || 0,
      user: req.user._id,
    });

    // Cleanup: Remove the file from disk space after successful execution
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(201).json({
      success: true,
      message: "Audio processed and transcription saved successfully.",
      data: newTranscript,
    });
  } catch (error) {
    console.error("Transcription Controller Error:", error);

    // CRITICAL: Cleanup file records on processing error crashes
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(
          "Safely cleaned up temporary local media file after handling error.",
        );
      } catch (unlinkErr) {
        console.error(
          "Failed to delete file during error catch block:",
          unlinkErr,
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during transcription processing.",
      error: error.message,
    });
  }
};

export const getUserTranscriptsController = async (req, res) => {
  try {
    // Fetch records belonging to the active user, sorted from newest to oldest
    const history = await Transcript.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Get History Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve history records.",
      error: error.message,
    });
  }
};
