import mongoose from "mongoose";

const transcriptSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,

      default: "[No clear speech or audio detected]",
    },
    duration: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Transcript = mongoose.model("Transcript", transcriptSchema);

export default Transcript;
