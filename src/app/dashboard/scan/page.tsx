"use client";

import { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  CheckCircle2,
  Leaf,
  Recycle,
  Zap,
  Volume2,
  VolumeX,
  RefreshCw,
  Star,
  ChevronRight,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScanResult {
  detected_item: string;
  category: "plastic" | "can" | "paper" | "glass" | "general" | "energy" | "water" | "other";
  recycling_steps: string[];
  sustainable_actions: { action: string; points: number }[];
  energy_tips: string[];
  confidence: number;
}

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  plastic:  { label: "Plastic",   color: "text-blue-400",   bg: "bg-blue-500/10",   emoji: "♻️" },
  can:      { label: "Metal Can", color: "text-gray-400",   bg: "bg-gray-500/10",   emoji: "🥫" },
  paper:    { label: "Paper",     color: "text-amber-400",  bg: "bg-amber-500/10",  emoji: "📄" },
  glass:    { label: "Glass",     color: "text-cyan-400",   bg: "bg-cyan-500/10",   emoji: "🍶" },
  energy:   { label: "Energy",    color: "text-yellow-400", bg: "bg-yellow-500/10", emoji: "⚡" },
  water:    { label: "Water",     color: "text-sky-400",    bg: "bg-sky-500/10",    emoji: "💧" },
  general:  { label: "General",   color: "text-accent",     bg: "bg-accent/10",     emoji: "🌱" },
  other:    { label: "Other",     color: "text-accent",     bg: "bg-accent/10",     emoji: "🌿" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildSpeechText(result: ScanResult): string {
  const steps = result.recycling_steps.slice(0, 3).join(". ");
  const tip = result.energy_tips[0] ?? "";
  return (
    `I can see ${result.detected_item}. ` +
    `Here is how to handle it sustainably: ${steps}. ` +
    (tip ? `Pro tip: ${tip}` : "")
  );
}

async function speakWithElevenLabs(text: string): Promise<boolean> {
  try {
    const res = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return false;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    return true;
  } catch {
    return false;
  }
}

function speakWithBrowser(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme] = useState("hajj");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Image handling ────────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // ── Analysis ──────────────────────────────────────────────────────────────

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, theme }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data: ScanResult = await res.json();
      setResult(data);
    } catch {
      setError("Could not analyse the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Voice readout (ElevenLabs → browser TTS fallback) ─────────────────────

  const handleSpeak = async () => {
    if (!result) return;
    setSpeaking(true);
    const text = buildSpeechText(result);
    const ok = await speakWithElevenLabs(text);
    if (!ok) speakWithBrowser(text);
    setSpeaking(false);
  };

  const handleStopSpeak = () => {
    setSpeaking(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setSpeaking(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────────────────────────────────

  const cat = result ? (CATEGORY_CONFIG[result.category] ?? CATEGORY_CONFIG.other) : null;
  const totalPoints = result
    ? result.sustainable_actions.reduce((s, a) => s + a.points, 0)
    : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Recycle className="h-4 w-4 text-accent" />
            </div>
            <h1 className="text-2xl font-black">EcoScan</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-semibold">
              LIVE
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload or photograph any item — get instant sustainability guidance read aloud by Zaid.
          </p>
        </div>
        {(image || result) && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            New scan
          </button>
        )}
      </div>

      {/* ── Upload / Camera zone ────────────────────────────────────── */}
      {!image ? (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative border-2 border-dashed border-border/50 rounded-2xl p-12 text-center hover:border-accent/50 transition-colors group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Camera className="h-8 w-8 text-accent" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Drop a photo here</p>
              <p className="text-sm text-muted-foreground">or choose an option below</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload photo
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Try: plastic bottles, food packaging, paper, cans, electronics…
            </p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        </div>
      ) : (
        /* ── Preview ──────────────────────────────────────────────── */
        <div className="rounded-2xl overflow-hidden border border-border/50 bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Scanned item"
            className="w-full max-h-72 object-contain bg-black/20"
          />
          {!result && !loading && (
            <div className="p-4 flex gap-3">
              <button
                onClick={analyze}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
              >
                <Leaf className="h-4 w-4" />
                Analyse sustainability
              </button>
              <button
                onClick={reset}
                className="px-4 py-3 rounded-xl bg-card border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Loading ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-accent/20 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <Leaf className="absolute inset-0 m-auto h-6 w-6 text-accent" />
          </div>
          <div className="text-center">
            <p className="font-semibold">Zaid is analysing your photo…</p>
            <p className="text-sm text-muted-foreground mt-1">Identifying sustainable opportunities</p>
          </div>
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────────── */}
      {result && cat && (
        <div className="space-y-4">
          {/* Item identity card */}
          <div className={`p-5 rounded-2xl border ${cat.bg} border-border/30`}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{cat.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-xl font-black truncate">{result.detected_item}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cat.bg} ${cat.color} border border-border/20`}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(result.confidence * 100)}% confidence
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">
                    Earn up to {totalPoints} eco-points
                  </span>
                </div>
              </div>
              {/* ElevenLabs voice button */}
              <button
                onClick={speaking ? handleStopSpeak : handleSpeak}
                className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                  speaking
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-accent/10 border-accent/20 text-accent hover:bg-accent/20"
                }`}
                title={speaking ? "Stop" : "Hear Zaid read this aloud (ElevenLabs)"}
              >
                {speaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>

            {speaking && (
              <div className="mt-3 flex items-center gap-2 text-xs text-accent">
                <div className="flex gap-0.5 items-end h-5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-accent animate-bounce"
                      style={{ height: `${8 + i * 3}px`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                Zaid is speaking…
              </div>
            )}
          </div>

          {/* Recycling steps */}
          <div className="p-5 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Recycle className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">How to dispose sustainably</h3>
            </div>
            <ol className="space-y-3">
              {result.recycling_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Eco actions */}
          <div className="p-5 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <h3 className="font-semibold">Eco actions you can take</h3>
            </div>
            <div className="space-y-2">
              {result.sustainable_actions.map((action, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/10">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-accent" />
                    <span className="text-sm">{action.action}</span>
                  </div>
                  <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    +{action.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Energy / water tips */}
          {result.energy_tips.length > 0 && (
            <div className="p-5 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <h3 className="font-semibold">Tips from Zaid</h3>
              </div>
              <ul className="space-y-2">
                {result.energy_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA: ask Zaid more */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-card border border-accent/20 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Volume2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold">Want to know more?</p>
              <p className="text-xs text-muted-foreground">
                Ask Zaid — your AI sustainability guide — using the chat widget ↘
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
