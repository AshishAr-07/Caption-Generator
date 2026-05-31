"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

// Sub-component to manage copy state individually for each transcript card
function TranscriptItem({ item }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 relative group">
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-sm font-medium text-gray-800 truncate">
          {item.originalName || item.filename}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
              copied
                ? "bg-green-50 text-green-600 border border-green-100"
                : "text-gray-500 hover:bg-gray-100 border border-transparent"
            }`}
            title="Copy transcription"
          >
            {copied ? (
              <>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376A8.965 8.965 0 0012 12.75c-.497 0-.982.04-1.455.12l-.179.032m7.374.738a8.951 8.951 0 01-.738 3.374m1.74-3.374a8.954 8.954 0 00-2.288-4.064M13.5 8.25v10.5m0-10.5h1.125c.621 0 1.125.504 1.125 1.125v1.125m-2.25-2.25h-1.5m1.5 13.5a9.06 9.06 0 01-1.5-.124m0 0a8.965 8.965 0 01-2.288-4.064M13.5 18.75h-1.5m-3 0a1.125 1.125 0 01-1.125-1.125V16.5m0-3.75V9"
                  />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
          <span className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed whitespace-pre-wrap">
        {item.transcription}
      </p>
    </div>
  );
}

export default function SpeechToTextPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transcribe/history`,
        { withCredentials: true },
      );
      if (data.success) setTranscripts(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectFile = (f) => {
    if (f?.type.startsWith("audio/")) setFile(f);
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("audio", file);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transcribe/audio`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (data.success) {
        setTranscripts((prev) => [data.data, ...prev]);
        clearFile();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to transcribe audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl md:max-w-7xl mx-auto px-6 py-10 flex gap-10 items-start">
      {/* ── Left column — sticky upload panel ── */}
      <aside className="w-72 shrink-0 sticky top-10">
        <h1 className="text-xl font-medium text-gray-900 mb-1">
          Speech to text
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Transcribe any audio file instantly
        </p>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            selectFile(e.dataTransfer.files?.[0]);
          }}
          className={`
            rounded-xl border border-dashed cursor-pointer text-center px-5 py-8 transition-colors
            ${
              dragging
                ? "border-gray-400 bg-white"
                : "border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => selectFile(e.target.files?.[0])}
          />
          <svg
            className="mx-auto mb-3 text-gray-300"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <p className="text-sm font-medium text-gray-700">Drop file here</p>
          <p className="text-xs text-gray-400 mt-1">MP3, WAV, M4A, OGG</p>
        </div>

        {/* File pill */}
        {file && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-700 max-w-full">
              <svg
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                className="shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19V6l12-3v13M9 19c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2z"
                />
              </svg>
              <span className="truncate">{file.name}</span>
              <button
                onClick={clearFile}
                className="text-gray-400 hover:text-gray-600 leading-none shrink-0"
                aria-label="Remove"
              >
                ✕
              </button>
            </span>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-35 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Transcribing…
            </>
          ) : (
            "Transcribe"
          )}
        </button>
      </aside>

      {/* ── Right column — history ── */}
      <main className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
          History{transcripts.length > 0 && ` · ${transcripts.length}`}
        </p>

        {transcripts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-sm">No transcripts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transcripts.map((item) => (
              <TranscriptItem key={item._id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
