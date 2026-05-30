"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SpeechToTextPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcripts, setTranscripts] = useState([]);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transcribe/history`,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setTranscripts(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an audio file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("audio", file);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transcribe/audio`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        setTranscripts((prev) => [data.data, ...prev]);
        setFile(null);
      }
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to transcribe audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Speech To Text</h1>

      {/* Upload Section */}
      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border rounded p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Transcribing..." : "Upload & Transcribe"}
          </button>
        </form>
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Transcript History</h2>

        {transcripts.length === 0 ? (
          <div className="border rounded-lg p-6 text-center">
            No transcripts found
          </div>
        ) : (
          <div className="space-y-4">
            {transcripts.map((item) => (
              <div key={item._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">
                    {item.originalName || item.filename}
                  </h3>

                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p>{item.transcription}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
