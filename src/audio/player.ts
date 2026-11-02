import { type Instrument, PIANO_RELEASE, GUITAR_RELEASE } from "./regions";
import { loadSampleForMidi } from "./loader";

export interface PlaybackOptions {
  strum?: boolean;
  strumDelay?: number;
  duration?: number;
  volume?: number;
}

export interface ActiveVoice {
  source: AudioBufferSourceNode;
  gain: GainNode;
  startTime: number;
}

let ctx: AudioContext | null = null;
let activeVoices: ActiveVoice[] = [];
const MAX_POLYPHONY = 32;

export function getContext(): AudioContext {
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      throw new Error("Web Audio API no está disponible en este entorno");
    }
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch((err) => console.warn("AudioContext resume failed:", err));
  }
  return ctx;
}

export function setContext(customCtx: AudioContext | null): void {
  stop();
  ctx = customCtx;
}

export function getActiveVoices(): readonly ActiveVoice[] {
  return activeVoices;
}

export function stop(): void {
  if (!activeVoices.length) return;

  const currentCtx = ctx;
  const now = currentCtx ? currentCtx.currentTime : 0;
  const fadeTime = 0.04; // 40ms smooth fade to avoid clicks

  for (const voice of activeVoices) {
    try {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
      voice.gain.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
      voice.source.stop(now + fadeTime);
    } catch {
      // Source might have already ended
    }
  }

  activeVoices = [];
}

function enforcePolyphony(limit: number): void {
  while (activeVoices.length > limit) {
    const oldest = activeVoices.shift();
    if (oldest && ctx) {
      try {
        const now = ctx.currentTime;
        oldest.gain.gain.cancelScheduledValues(now);
        oldest.gain.gain.linearRampToValueAtTime(0.0001, now + 0.02);
        oldest.source.stop(now + 0.02);
      } catch {
        // already stopped
      }
    }
  }
}

export async function playMidi(
  notes: number[],
  instrument: Instrument = "piano",
  options: PlaybackOptions = {}
): Promise<void> {
  if (!notes || notes.length === 0) return;

  stop();

  const c = getContext();
  const now = c.currentTime;

  // Natural strum parameters
  const isGuitar = instrument === "guitar";
  const shouldStrum = options.strum ?? isGuitar;
  const strumDelay = options.strumDelay ?? (isGuitar ? 0.03 : 0);
  const releaseTime = isGuitar ? GUITAR_RELEASE : PIANO_RELEASE;
  const baseVolume = options.volume ?? 0.35;
  // Scaled per-note gain to prevent clipping when summing multiple voices
  const perNoteGain = Math.min(baseVolume, (baseVolume * 1.5) / Math.sqrt(notes.length));

  try {
    // 1. Load required sample buffers lazily for each note in parallel
    const sampleData = await Promise.all(
      notes.map((midi) => loadSampleForMidi(midi, instrument, c))
    );

    // 2. Schedule and play each note with AudioBufferSourceNode
    sampleData.forEach(({ buffer, playbackRate }, index) => {
      enforcePolyphony(MAX_POLYPHONY - 1);

      const source = c.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = playbackRate;

      const gainNode = c.createGain();
      const noteStartTime = now + (shouldStrum ? index * strumDelay : 0);

      // Natural ADSR curve
      gainNode.gain.setValueAtTime(0.0001, noteStartTime);
      gainNode.gain.linearRampToValueAtTime(perNoteGain, noteStartTime + 0.005);

      // Connect source -> gain -> destination
      source.connect(gainNode);
      gainNode.connect(c.destination);

      source.start(noteStartTime);

      // If duration is specified, apply envelope release fade
      if (options.duration && options.duration > 0) {
        const noteEndTime = noteStartTime + options.duration;
        gainNode.gain.setValueAtTime(perNoteGain, noteEndTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, noteEndTime + releaseTime);
        source.stop(noteEndTime + releaseTime);
      }

      const voice: ActiveVoice = { source, gain: gainNode, startTime: noteStartTime };
      activeVoices.push(voice);

      source.onended = () => {
        try {
          source.disconnect();
          gainNode.disconnect();
        } catch {
          // ignore disconnect errors
        }
        activeVoices = activeVoices.filter((v) => v !== voice);
      };
    });
  } catch (error) {
    console.error(`Error durante la reproducción de ${instrument}:`, error);
    stop();
    throw error;
  }
}
