# AI-Powered Speech-to-Text Application

A full-stack MERN (MongoDB, Express, React, Node) application that allows users to record raw audio directly via their web browser or upload pre-recorded audio files, convert them into text using advanced Speech-to-Text models, and securely view their transcription history.


## 🏗️ System Architecture & Data Flow

The layout below illustrates how data seamlessly traverses the stack, safely processing the audio through external pipelines before wiping transient files from disk storage.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Axios, HTML5 MediaRecorder API
- **Backend:** Node.js, Express.js, Multer (Disk Storage setup)
- **Speech-to-Text Engine:** Deepgram SDK (`nova-2` intelligence model)
- **Database:** MongoDB & Mongoose ODM

---

## ✨ Core Features

- **Dual-Input Modality:** Users can upload audio files up to 10MB or record straight from their microphone.
- **Robust Storage Safeguards:** Features a deterministic storage policy where temporary server audio files are automatically wiped out (`fs.unlink`) inside a `finally` block, ensuring no disk bloating even if the transcription engine hits an error.
- **Persistent User History:** Automatically logs transcripts into MongoDB and renders past data dynamically on individual dashboard cards.

---
