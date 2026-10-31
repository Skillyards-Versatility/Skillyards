"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  playDtmfTone,
  startRingbackTone,
  playCallConnectedChime,
  playCallEndedTone,
  startHoldMusic,
  playCarrierDialTone,
} from "@/lib/telephonyAudio";
import { crmApi } from "@/lib/api";

const TelephonyContext = createContext(null);

const DEFAULT_RECENT_CALLS = [
  {
    id: "call-1",
    leadId: "lead-101",
    name: "Aarav Sharma",
    phone: "+91 98765 43210",
    courseInterest: "Full Stack MERN",
    outcome: "connected",
    duration: 184, // 3m 4s
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    notes: "Discussed weekend batch timing; candidate will confirm fee structure with parents.",
  },
  {
    id: "call-2",
    leadId: "lead-102",
    name: "Rohan Patel",
    phone: "+91 98111 22233",
    courseInterest: "Data Science & AI",
    outcome: "counselling_booked",
    duration: 245, // 4m 5s
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    notes: "Scheduled 1-on-1 counseling session for tomorrow 4:00 PM.",
  },
  {
    id: "call-3",
    leadId: "lead-103",
    name: "Pooja Mehta",
    phone: "+91 99887 76655",
    courseInterest: "Cybersecurity Bootcamp",
    outcome: "busy",
    duration: 0,
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    notes: "Line busy; queued for auto-retry in 2 hours.",
  },
];

export function TelephonyProvider({ children }) {
  // Call state: 'IDLE' | 'DIALING' | 'RINGING' | 'CONNECTED' | 'ENDED' | 'DISPOSITION'
  const [callState, setCallState] = useState("IDLE");
  const [activeCall, setActiveCall] = useState(null);
  const [callDuration, setCallDuration] = useState(0); // in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isSoftphoneOpen, setIsSoftphoneOpen] = useState(false);
  const [recentCalls, setRecentCalls] = useState(DEFAULT_RECENT_CALLS);
  const [audioBars, setAudioBars] = useState([25, 45, 60, 85, 95, 70, 50, 80, 65, 40, 55, 30]);
  const [hasMicPermission, setHasMicPermission] = useState(null);
  const [quickNotes, setQuickNotes] = useState("");

  const ringbackStopperRef = useRef(null);
  const holdMusicStopperRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const stateTimeoutRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Load recent calls from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("skillyards_telephony_recent_calls");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentCalls(parsed);
        }
      }
    } catch {}
  }, []);

  // Timer runner when CONNECTED and not on hold
  useEffect(() => {
    if (callState === "CONNECTED" && !isOnHold) {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callState, isOnHold]);

  // Audio spectrum & microphone stream processing
  useEffect(() => {
    if (callState !== "CONNECTED") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    let isSubscribed = true;

    // Try to acquire real microphone stream for true WebRTC realism
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (!isSubscribed) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          micStreamRef.current = stream;
          setHasMicPermission(true);

          try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.8;
            source.connect(analyser);
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVisualizer = () => {
              if (!isSubscribed || callState !== "CONNECTED") return;
              if (isOnHold) {
                // Dimmed rhythm when on hold
                setAudioBars([15, 20, 25, 20, 15, 20, 25, 20, 15, 20, 15, 10]);
              } else if (isMuted) {
                // Flatline when muted
                setAudioBars([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
              } else {
                analyser.getByteFrequencyData(dataArray);
                // Sample 12 frequency bins and scale from 15% to 100%
                const samples = [];
                for (let i = 0; i < 12; i++) {
                  const val = dataArray[i * 2] || 0;
                  const pct = Math.min(100, Math.max(12, Math.round((val / 255) * 100)));
                  samples.push(pct);
                }
                setAudioBars(samples);
              }
              animationFrameRef.current = requestAnimationFrame(updateVisualizer);
            };

            animationFrameRef.current = requestAnimationFrame(updateVisualizer);
          } catch (e) {
            console.debug("Web Audio Analyser fallback:", e);
          }
        })
        .catch((err) => {
          setHasMicPermission(false);
          console.debug("Mic access denied or unavailable, using simulated voice stream:", err.message);

          // Simulated organic voice activity
          const simInterval = setInterval(() => {
            if (!isSubscribed || callState !== "CONNECTED") {
              clearInterval(simInterval);
              return;
            }
            if (isOnHold) {
              setAudioBars([15, 20, 25, 20, 15, 20, 25, 20, 15, 20, 15, 10]);
            } else if (isMuted) {
              setAudioBars([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
            } else {
              setAudioBars((prev) =>
                prev.map(() => Math.floor(Math.random() * 75) + 20)
              );
            }
          }, 140);

          return () => clearInterval(simInterval);
        });
    }

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [callState, isOnHold, isMuted]);

  // Clean up audio & timeouts on unmount
  useEffect(() => {
    return () => {
      if (ringbackStopperRef.current) ringbackStopperRef.current();
      if (holdMusicStopperRef.current) holdMusicStopperRef.current();
      if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  /**
   * Start an outbound call to a lead with 1-click
   */
  const startCall = ({
    leadId = null,
    name = "Prospect",
    phone = "",
    courseInterest = "Career Acceleration",
    avatar = null,
  }) => {
    if (!phone) return;

    // Stop any existing call or tones
    if (ringbackStopperRef.current) ringbackStopperRef.current();
    if (holdMusicStopperRef.current) holdMusicStopperRef.current();
    if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }

    setActiveCall({
      leadId: leadId || `prospect-${Date.now()}`,
      name: name || "Prospect",
      phone,
      courseInterest: courseInterest || "Career Acceleration",
      avatar,
      startedAt: new Date().toISOString(),
    });

    setCallDuration(0);
    setIsMuted(false);
    setIsOnHold(false);
    setIsSoftphoneOpen(true);
    setQuickNotes("");
    setCallState("DIALING");

    // Play subtle carrier connection tone
    playCarrierDialTone();

    // After 600ms transition to RINGING with standard telecom ringback audio
    stateTimeoutRef.current = setTimeout(() => {
      setCallState("RINGING");
      ringbackStopperRef.current = startRingbackTone();

      // Simulate student answering after 2.8 seconds
      stateTimeoutRef.current = setTimeout(() => {
        if (ringbackStopperRef.current) {
          ringbackStopperRef.current();
          ringbackStopperRef.current = null;
        }
        playCallConnectedChime();
        setCallState("CONNECTED");
      }, 2800);
    }, 600);
  };

  /**
   * Hang up the active call
   */
  const hangupCall = () => {
    if (ringbackStopperRef.current) {
      ringbackStopperRef.current();
      ringbackStopperRef.current = null;
    }
    if (holdMusicStopperRef.current) {
      holdMusicStopperRef.current();
      holdMusicStopperRef.current = null;
    }
    if (stateTimeoutRef.current) {
      clearTimeout(stateTimeoutRef.current);
      stateTimeoutRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }

    playCallEndedTone();
    setCallState("ENDED");

    // Transition to disposition modal so outcome & notes can be logged
    setTimeout(() => {
      setCallState("DISPOSITION");
    }, 450);
  };

  /**
   * Submit call outcome, notes, and callback if scheduled
   */
  const submitDisposition = ({ outcome, notes = "", callbackAt = null }) => {
    if (!activeCall) return;

    const completedCall = {
      id: `call-${Date.now()}`,
      leadId: activeCall.leadId,
      name: activeCall.name,
      phone: activeCall.phone,
      courseInterest: activeCall.courseInterest,
      outcome: outcome || "connected",
      duration: callDuration,
      timestamp: new Date().toISOString(),
      notes: notes || "No additional notes recorded.",
    };

    // Update in-memory and localStorage recent calls
    const updatedCalls = [completedCall, ...recentCalls].slice(0, 30);
    setRecentCalls(updatedCalls);
    try {
      localStorage.setItem("skillyards_telephony_recent_calls", JSON.stringify(updatedCalls));
    } catch {}

    // Dispatch to Backend API
    if (activeCall.leadId) {
      try {
        crmApi.logCall(activeCall.leadId, {
          outcome: outcome || "connected",
          duration: callDuration,
          notes: notes || "No additional notes recorded.",
          callbackAt: callbackAt || undefined,
        }).catch((err) => {
          console.warn("Backend call log sync offline, logged to local context:", err.message);
        });
      } catch (err) {
        console.warn("Could not dispatch call log to backend:", err);
      }
    }

    // Auto-attribute to Daily EOD actuals
    try {
      const storedEod = localStorage.getItem("skillyards_eod_attributables");
      let eod = storedEod ? JSON.parse(storedEod) : { dials: 24, connects: 14, talkTimeSeconds: 4320 };
      eod.dials = (eod.dials || 0) + 1;
      if (callDuration >= 15) {
        eod.connects = (eod.connects || 0) + 1;
      }
      eod.talkTimeSeconds = (eod.talkTimeSeconds || 0) + callDuration;
      localStorage.setItem("skillyards_eod_attributables", JSON.stringify(eod));
    } catch {}

    // If callback requested, append to follow-up tasks
    if (outcome === "callback_requested" && callbackAt) {
      try {
        const storedTasks = localStorage.getItem("skillyards_custom_followups");
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];
        tasks.unshift({
          id: `task-${Date.now()}`,
          leadId: activeCall.leadId,
          leadName: activeCall.name,
          phone: activeCall.phone,
          course: activeCall.courseInterest,
          dueAt: callbackAt,
          status: "pending",
          priority: "high",
          assignedTo: "Self",
          notes,
        });
        localStorage.setItem("skillyards_custom_followups", JSON.stringify(tasks));
      } catch {}
    }

    // Save to lead-specific call history timeline
    try {
      const leadKey = `skillyards_lead_call_history_${activeCall.leadId}`;
      const existingHistory = JSON.parse(localStorage.getItem(leadKey) || "[]");
      existingHistory.unshift(completedCall);
      localStorage.setItem(leadKey, JSON.stringify(existingHistory));
    } catch {}

    // Reset call state back to IDLE
    setCallState("IDLE");
    setActiveCall(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsOnHold(false);
    setQuickNotes("");
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (micStreamRef.current) {
        micStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = !next;
        });
      }
      return next;
    });
  };

  const toggleHold = () => {
    setIsOnHold((prev) => {
      const next = !prev;
      if (next) {
        if (holdMusicStopperRef.current) holdMusicStopperRef.current();
        holdMusicStopperRef.current = startHoldMusic();
      } else {
        if (holdMusicStopperRef.current) {
          holdMusicStopperRef.current();
          holdMusicStopperRef.current = null;
        }
      }
      return next;
    });
  };

  const openSoftphone = () => setIsSoftphoneOpen(true);
  const closeSoftphone = () => {
    if (callState === "IDLE") {
      setIsSoftphoneOpen(false);
    }
  };

  return (
    <TelephonyContext.Provider
      value={{
        callState,
        activeCall,
        callDuration,
        isMuted,
        isOnHold,
        isSoftphoneOpen,
        recentCalls,
        audioBars,
        hasMicPermission,
        quickNotes,
        setQuickNotes,
        startCall,
        hangupCall,
        submitDisposition,
        toggleMute,
        toggleHold,
        openSoftphone,
        closeSoftphone,
        setIsSoftphoneOpen,
      }}
    >
      {children}
    </TelephonyContext.Provider>
  );
}

export function useTelephony() {
  const context = useContext(TelephonyContext);
  if (!context) {
    throw new Error("useTelephony must be used within a TelephonyProvider");
  }
  return context;
}
