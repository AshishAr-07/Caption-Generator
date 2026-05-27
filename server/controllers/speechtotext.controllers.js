import { DeepgramClient } from '@deepgram/sdk';
import fs from "fs";
import Transcript from "../models/speechtotext.models.js";

const deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY);

export const transcribeAudioController = async (req, res) => {
  try {
    //  Validation: Ensure a file was actually uploaded by multer
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No audio file uploaded." 
      });
    }

    const filePath = req.file.path;

    // Read the local file buffer to stream to Deepgram
    const audioBuffer = fs.readFileSync(filePath);

    // Send the binary audio data to Deepgram for Speech-to-Text conversion
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        mimetype: req.file.mimetype,
        model: "nova-2",      
        smart_format: true,
      }
    );

    if (error) {
      throw new Error(`Deepgram API Error: ${error.message}`);
    }


    const transcriptionText = result?.results?.channels[0]?.alternatives[0]?.transcript;

    if (transcriptionText === undefined || transcriptionText === null) {
      throw new Error("Could not extract transcript text from Deepgram response.");
    }

 
    const newTranscript = await Transcript.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      text: transcriptionText,
      duration: result?.metadata?.duration || 0,
      user: req.user._id,                        
    });

    // Cleanup: Delete the audio file from local server storage immediately after saving data
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Temporary file cleanup failed for path: ${filePath}`, err);
    });

    // Return the complete document back to frontend
    return res.status(201).json({
      success: true,
      message: "Audio processed and transcription saved successfully.",
      data: newTranscript,
    });

  } catch (error) {
    console.error("Transcription Controller Error:", error);

    // CRITICAL: Cleanup files on server crash or execution failure so disk storage doesn't overflow
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {
        console.log("Safely cleaned up temporary local media file after handling error.");
      });
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
    const history = await Transcript.find({ user: req.user._id }).sort({ createdAt: -1 });

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