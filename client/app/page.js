import { ArrowRight, AudioWaveform, CheckCircle, Code, Copy, Cpu, Download, FileText, Globe, History, Lock, Upload, Zap } from "lucide-react";

const features = [
  { icon: <Zap size={15} strokeWidth={1.5} />, title: "Fast transcription", desc: "Most files done in under 30 seconds, regardless of length." },
  { icon: <Globe size={15} strokeWidth={1.5} />, title: "50+ languages", desc: "Auto-detects language or choose manually before uploading." },
  { icon: <History size={15} strokeWidth={1.5} />, title: "Full history", desc: "Every transcript saved and searchable from your dashboard." },
  { icon: <Download size={15} strokeWidth={1.5} />, title: "Export anywhere", desc: "Download as TXT, SRT, VTT, or copy to clipboard." },
  { icon: <Lock size={15} strokeWidth={1.5} />, title: "Private & secure", desc: "Files encrypted in transit and deleted after processing." },
  { icon: <Code size={15} strokeWidth={1.5} />, title: "API access", desc: "Integrate transcription into your app with our REST API." },
];

const steps = [
  { icon: <Upload size={13} strokeWidth={1.5} />, title: "Upload your file", desc: "Drag and drop any audio file — MP3, WAV, M4A, OGG, FLAC, and more. Up to 500 MB per file." },
  { icon: <Cpu size={13} strokeWidth={1.5} />, title: "We process it", desc: "Our AI model transcribes your audio with speaker detection and punctuation included." },
  { icon: <FileText size={13} strokeWidth={1.5} />, title: "Read, copy, export", desc: "Your transcript appears instantly. Copy to clipboard or export to your preferred format." },
];

const formats = ["MP3","WAV","M4A","OGG","FLAC","WEBM","AAC","OPUS","MP4","MOV","AVI","MKV"];
const waveBars = [6,10,18,14,24,20,16,30,22,18,12,26,20,14,22,16,10,20,24,14,18,12,22,16,10,14,18,22,12,16];

export default function HomePage() {
  return (
    <div className="max-w-5xl md:max-w-7xl mx-auto px-6 lg:px-0 py-10">

      {/* Hero */}
      <div className="min-h-screen bg-white">   
      <section className=" px-6 py-20 text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 border border-gray-200 rounded-full px-3 py-1.5 mb-10">
          <Zap size={11} strokeWidth={2} />
          Powered by Whisper AI
        </div>

        <h1 className="text-[44px] font-medium text-gray-900 leading-[1.08] tracking-[-0.04em] mb-5">
          Audio to text,<br />in seconds
        </h1>

        <p className="text-[15px] text-gray-500 max-w-[340px] mx-auto mb-10 leading-relaxed">
          Upload any audio file and get an accurate, readable transcript instantly.
        </p>

   

        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-left shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[12px] text-gray-400">
              <AudioWaveform size={13} strokeWidth={1.5} />
              interview-final.mp3
            </div>
            <span className="text-[10px] flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-medium">
              <CheckCircle size={10} strokeWidth={2.5} /> Done
            </span>
          </div>

          <div className="flex items-center gap-[3px] h-7 mb-4">
            {waveBars.slice(0, 32).map((h, i) => (
              <span key={i} className="block rounded-sm bg-gray-200" style={{ width: 2, height: h }} />
            ))}
          </div>

          <p className="text-[13px] text-gray-600 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed mb-4">
            "Welcome back everyone. Today we're talking about the future of human-computer interaction — and what that means for the next generation of software developers..."
          </p>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">2:34 · English · 98% accurate</span>
            <div className="flex gap-2">
              <button className="text-[10px] flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors font-medium">
                <Copy size={10} strokeWidth={2} /> Copy
              </button>
              <button className="text-[10px] flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors font-medium">
                <Download size={10} strokeWidth={2} /> Export
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden mb-14">
        {[["98%", "Accuracy rate"], ["50+", "Languages"], ["< 30s", "Avg. turnaround"]].map(([n, l]) => (
          <div key={l} className="text-center py-5">
            <p className="text-4xl font-medium text-gray-900 tracking-tight mb-1">{n}</p>
            <p className="text-[11px] text-gray-400">{l}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="mb-14">
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 text-center mb-6">Features</p>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          {[0, 2, 4].map((start) => (
            <div key={start} className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100 last:border-b-0">
              {features.slice(start, start + 2).map(({ icon, title, desc }) => (
                <div key={title} className="p-5">
                  <div className="w-7.5 h-7.5 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 mb-3">
                    {icon}
                  </div>
                  <h3 className="text-[13px] font-medium text-gray-800 mb-1">{title}</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mb-14">
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 text-center mb-6">How it works</p>
        <div className="border-y border-gray-100">
          {steps.map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3.5 py-5 border-b border-gray-100 last:border-b-0">
              <div className="w-6.5 h-6.5 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
                {icon}
              </div>
              <div>
                <h3 className="text-[13px] font-medium text-gray-800 mb-1">{title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="mb-14">
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 text-center mb-5">Supported formats</p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {formats.map((f) => (
            <span key={f} className="text-[11px] px-3 py-1.5 border border-gray-200 rounded-full text-gray-400">{f}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 border border-gray-100 rounded-2xl px-8 py-12 text-center mb-12">
        <h2 className="text-[22px] font-medium text-gray-900 tracking-tight mb-2">Ready to transcribe?</h2>
        <p className="text-[13px] text-gray-500 mb-7">No credit card required. Free for your first 60 minutes.</p>
        <a href="/signup" className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-[13px] font-medium hover:bg-gray-800 transition-colors">
          Start for free <ArrowRight size={13} strokeWidth={2} />
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] text-gray-400">
          <AudioWaveform size={13} strokeWidth={1.5} />
          © 2026 Transcribe
        </div>
        <div className="flex gap-5">
          {["Privacy", "Terms", "API", "Contact"].map((l) => (
            <a key={l} href="#" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">{l}</a>
          ))}
        </div>
      </footer>

    </div>
  );
}