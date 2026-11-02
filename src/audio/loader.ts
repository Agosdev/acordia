import { type Instrument, type SampleRegion, PIANO_REGIONS, GUITAR_REGIONS } from "./regions";
import { findRegion, getSampleUrl, type MappedSample } from "./mapping";

const bufferCache = new Map<string, AudioBuffer>();
const pendingLoads = new Map<string, Promise<AudioBuffer>>();

export function clearAudioCache(): void {
  bufferCache.clear();
  pendingLoads.clear();
}

export function isSampleCached(url: string): boolean {
  return bufferCache.has(url);
}

export function getCachedSampleCount(): number {
  return bufferCache.size;
}

export async function loadAudioBuffer(url: string, ctx: AudioContext): Promise<AudioBuffer> {
  const cached = bufferCache.get(url);
  if (cached) {
    return cached;
  }

  const pending = pendingLoads.get(url);
  if (pending) {
    return pending;
  }

  const loadPromise = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al cargar muestra: ${url}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      // decodeAudioData consumes or detaches the arrayBuffer in some implementations,
      // so we use a copy if needed or pass directly.
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      bufferCache.set(url, audioBuffer);
      return audioBuffer;
    } finally {
      pendingLoads.delete(url);
    }
  })();

  pendingLoads.set(url, loadPromise);
  return loadPromise;
}

export async function loadSampleForMidi(
  midi: number,
  instrument: Instrument,
  ctx: AudioContext
): Promise<{ buffer: AudioBuffer; playbackRate: number; region: SampleRegion }> {
  const mapped: MappedSample = findRegion(midi, instrument);
  const url = getSampleUrl(instrument, mapped.region.sample);
  const buffer = await loadAudioBuffer(url, ctx);
  return {
    buffer,
    playbackRate: mapped.playbackRate,
    region: mapped.region,
  };
}

export async function preloadInstrument(instrument: Instrument, ctx: AudioContext): Promise<void> {
  const regions = instrument === "piano" ? PIANO_REGIONS : GUITAR_REGIONS;
  const uniqueSamples = Array.from(new Set(regions.map((r) => r.sample)));
  await Promise.all(
    uniqueSamples.map((sample) => loadAudioBuffer(getSampleUrl(instrument, sample), ctx))
  );
}
