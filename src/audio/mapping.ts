import {
  type Instrument,
  type SampleRegion,
  PIANO_REGIONS,
  GUITAR_REGIONS,
} from "./regions";

export interface MappedSample {
  region: SampleRegion;
  playbackRate: number;
}

export function findRegion(midi: number, instrument: Instrument): MappedSample {
  const regions = instrument === "piano" ? PIANO_REGIONS : GUITAR_REGIONS;
  if (!regions.length) {
    throw new Error(`No regions defined for instrument: ${instrument}`);
  }

  // Exact or bounded match
  const match = regions.find((r) => midi >= r.lokey && midi <= r.hikey);
  if (match) {
    const semitoneDiff = midi - match.pitchKeycenter;
    const playbackRate = Math.pow(2, semitoneDiff / 12);
    return { region: match, playbackRate };
  }

  // Clamp to closest region if outside nominal range
  if (midi < regions[0].lokey) {
    const lowest = regions[0];
    const semitoneDiff = midi - lowest.pitchKeycenter;
    const playbackRate = Math.pow(2, semitoneDiff / 12);
    return { region: lowest, playbackRate };
  }

  const highest = regions[regions.length - 1];
  const semitoneDiff = midi - highest.pitchKeycenter;
  const playbackRate = Math.pow(2, semitoneDiff / 12);
  return { region: highest, playbackRate };
}

export function getSampleUrl(instrument: Instrument, sampleFileName: string): string {
  // Respect the deployment subdirectory while retaining local development URLs.
  return `${import.meta.env.BASE_URL}audio/${instrument}/${sampleFileName}`;
}
