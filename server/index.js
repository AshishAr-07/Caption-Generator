import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/dbconfig.js";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
connectDB().then(()=>{
    try {
        app.listen(PORT, ()=> {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error, "Mongodb Connection Failed")
    }
})

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
