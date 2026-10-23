"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Headphones,
} from "lucide-react";

export function CallRecordingAudioPlayer({
  callId,
  leadName = "Candidate",
  durationSeconds = 120,
  transcript = "",
  sentiment = "positive", // "positive" | "neutral" | "objection"
  counsellorName = "Counsellor",
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const totalDuration = durationSeconds || 95;
  const timerRef = useRef(null);

  // Simulated synthetic audio playback with scrubber
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, totalDuration]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSeek = (e) => {
    const newPercent = parseFloat(e.target.value);
    setCurrentTime((newPercent / 100) * totalDuration);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  // 24 simulated waveform bar heights
  const waveformHeights = [
    30, 45, 60, 25, 80, 95, 70, 50, 40, 85, 90, 65,
    45, 75, 100, 85, 60, 40, 55, 70, 90, 65, 40, 25
  ];

  return (
    <div className="bg-[#0C1316] text-[#FAF6EE] rounded-xl border border-[rgba(98,146,158,0.3)] p-3 shadow-md space-y-2.5 my-1.5 animate-fadeIn">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5">
          <Headphones className="w-3.5 h-3.5 text-[#25D366]" />
          <span className="font-bold text-white tracking-wide">Call Recording</span>
          <span className="text-[#D97706]">• {leadName}</span>
        </div>

        {/* Sentiment Tag */}
        <div className="flex items-center gap-2">
          {sentiment === "positive" && (
            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30">
              🟢 High Closing Intent
            </span>
          )}
          {sentiment === "objection" && (
            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]/30">
              🟡 Fee / EMI Objection
            </span>
          )}
          {sentiment === "neutral" && (
            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30">
              ⚡ Discovery Phase
            </span>
          )}

          <button
            type="button"
            onClick={cycleSpeed}
            title="Change Playback Speed"
            className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-cyan-300 cursor-pointer border border-white/10 transition-colors"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Main Waveform & Controls Grid */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#1eb757] text-[#0C1316] flex items-center justify-center shrink-0 shadow-md shadow-[#25D366]/25 active:scale-95 transition-all cursor-pointer"
          title={isPlaying ? "Pause Recording" : "Play Recording"}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Interactive Waveform & Slider Track */}
        <div className="flex-1 relative flex flex-col justify-center">
          {/* Animated Waveform Visualization */}
          <div className="flex items-center gap-[3px] h-7 w-full overflow-hidden select-none mb-1">
            {waveformHeights.map((h, idx) => {
              const barPercent = (idx / waveformHeights.length) * 100;
              const isPlayed = barPercent <= progressPercent;
              return (
                <div
                  key={idx}
                  onClick={() => setCurrentTime((barPercent / 100) * totalDuration)}
                  style={{ height: `${h}%` }}
                  className={`flex-1 min-w-[2px] rounded-full transition-all cursor-pointer ${
                    isPlayed
                      ? "bg-[#25D366] shadow-[0_0_6px_rgba(37,211,102,0.4)]"
                      : "bg-white/20 hover:bg-white/40"
                  } ${isPlaying && isPlayed ? "animate-pulse" : ""}`}
                />
              );
            })}
          </div>

          {/* Time & Scrub Info */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8]">
            <span className="text-[#25D366] font-bold">{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Mute Toggle */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="p-1 rounded text-[#94a3b8] hover:text-white cursor-pointer"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Transcript Accordion Toggle */}
      {transcript && (
        <div className="pt-1.5 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center justify-between w-full text-[10px] font-medium text-[#D97706] hover:text-white cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#25D366]" />
              <span>AI Speech-to-Text Transcript snippet</span>
            </span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showTranscript && (
            <div className="mt-2 p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-[#e2e8f0] font-sans leading-relaxed space-y-1 animate-fadeIn">
              <p className="text-[10px] text-[#25D366] font-mono font-bold uppercase tracking-wider">
                {counsellorName} (Counsellor) & {leadName}
              </p>
              <p className="italic text-[#cbd5e1]">"{transcript}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
