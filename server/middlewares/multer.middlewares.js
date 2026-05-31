import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Force an absolute path calculation based on the project's root folder
    const uploadDir = path.resolve(process.cwd(), "public");

    // Dynamically check and create the folder if production stripped it out
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

export const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/ogg",
      "audio/mp4",
      "audio/x-m4a",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid audio file type"), false);
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
