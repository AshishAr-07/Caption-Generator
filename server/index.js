import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/dbconfig.js";
import uploadRoutes from "./routers/upload.routes.js";
import authRoutes from "./routers/auth.routes.js";
import speechToTextRoutes from "./routers/speechtotext.routes.js";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
connectDB().then(() => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error, "Mongodb Connection Failed");
  }
});

app.use("/api/v1", uploadRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/transcribe", speechToTextRoutes);
