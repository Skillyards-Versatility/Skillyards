// Web Audio API Synthesizer for Telephony DTMF tones, Ringback & Call Chimes
// 100% in-browser synthesis - Zero external audio file dependency

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// ITU-T Standard DTMF Frequencies (Hz)
const DTMF_FREQS = {
  "1": [697, 1209],
  "2": [697, 1336],
  "3": [697, 1477],
  "4": [770, 1209],
  "5": [770, 1336],
  "6": [770, 1477],
  "7": [852, 1209],
  "8": [852, 1336],
  "9": [852, 1477],
  "*": [941, 1209],
  "0": [941, 1336],
  "#": [941, 1477],
};

/**
 * Play authentic dual-tone multi-frequency beep on dialpad press
 */
export function playDtmfTone(char) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = DTMF_FREQS[char] || [697, 1209];
    const now = ctx.currentTime;
    const duration = 0.12; // 120ms beep

    // Master gain node with smooth envelope
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.18, now + 0.01);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    masterGain.connect(ctx.destination);

    // Low & High frequency oscillators
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration);
    });
  } catch (err) {
    console.debug("DTMF tone error:", err);
  }
}

/**
 * Play standard telecom ringback tone loop (440Hz + 480Hz)
 * Returns a stop() function to cleanly silence the tone
 */
export function startRingbackTone() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return () => {};

    let isPlaying = true;
    let timerId = null;
    let currentOscs = [];

    const playBurst = () => {
      if (!isPlaying) return;

      const now = ctx.currentTime;
      const burstDuration = 1.2; // 1.2s ring burst

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.setValueAtTime(0.12, now + burstDuration - 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + burstDuration);
      gain.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(440, now);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(480, now);

      osc1.connect(gain);
      osc2.connect(gain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + burstDuration);
      osc2.stop(now + burstDuration);

      currentOscs = [osc1, osc2];

      // Schedule next ring burst after 2.2s silence
      timerId = setTimeout(() => {
        if (isPlaying) playBurst();
      }, 3400);
    };

    playBurst();

    return () => {
      isPlaying = false;
      if (timerId) clearTimeout(timerId);
      currentOscs.forEach((osc) => {
        try {
          osc.stop();
        } catch {}
      });
    };
  } catch (err) {
    console.debug("Ringback tone error:", err);
    return () => {};
  }
}

/**
 * Play pleasant rising harmonic chime when call connects
 */
export function playCallConnectedChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 triad
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const start = now + idx * 0.09;
      const duration = 0.22;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      gain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.connect(gain);
      osc.start(start);
      osc.stop(start + duration);
    });
  } catch (err) {
    console.debug("Call connect chime error:", err);
  }
}

/**
 * Play call hangup / ended tone
 */
export function playCallEndedTone() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.28;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + duration);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    console.debug("Call ended tone error:", err);
  }
}
