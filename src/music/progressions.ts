import { type Root, ROOTS, CHORD_TYPES } from "./chords";

export interface ParsedChord {
  root: Root;
  type: string;
  raw: string;
}

export interface ProgressionPreset {
  id: string;
  name: string;
  description: string;
  chordStrings: string[];
}

export const PROGRESSION_PRESETS: readonly ProgressionPreset[] = [
  {
    id: "rock",
    name: "Rock",
    description: "Em – Am – B7 – Em",
    chordStrings: ["Em", "Am", "B7", "Em"],
  },
  {
    id: "pop-4-chords",
    name: "Pop",
    description: "C – G – Am – F",
    chordStrings: ["C", "G", "Am", "F"],
  },
  {
    id: "cadence-2-5-1",
    name: "Cadencia ii–V–I",
    description: "Dm – G – C",
    chordStrings: ["Dm", "G", "C"],
  },
  {
    id: "blues-rock",
    name: "Blues",
    description: "E – A – B7 – E",
    chordStrings: ["E", "A", "B7", "E"],
  },
  {
    id: "ballad-50s",
    name: "Balada",
    description: "C – Am – F – G",
    chordStrings: ["C", "Am", "F", "G"],
  },
  {
    id: "andalusian",
    name: "Flamenco · cadencia andaluza",
    description: "Am – G – F – E",
    chordStrings: ["Am", "G", "F", "E"],
  },
] as const;

export function parseChordToken(token: string): ParsedChord | null {
  const clean = token.trim();
  if (!clean) return null;

  // Match root note: C, C#, Db, D, D#, Eb, etc.
  const match = clean.match(/^([A-G][#b]?)(.*)$/i);
  if (!match) return null;

  let rootRaw = match[1].toUpperCase();
  // Normalize flats to sharps where needed (Db -> C#, Eb -> D#, etc.)
  const flatToSharp: Record<string, string> = {
    DB: "C#",
    EB: "D#",
    GB: "F#",
    AB: "G#",
    BB: "A#",
  };
  if (flatToSharp[rootRaw]) {
    rootRaw = flatToSharp[rootRaw];
  }

  const root = ROOTS.find((r) => r.toUpperCase() === rootRaw);
  if (!root) return null;

  const suffix = match[2].trim();
  const qualRaw = suffix === "M" ? "major" : suffix === "M7" ? "maj7" : suffix.toLowerCase();

  let type: string = "major";
  if (!qualRaw || qualRaw === "m" || qualRaw === "min" || qualRaw === "minor" || qualRaw === "-") {
    type = qualRaw ? "minor" : "major";
  } else if (qualRaw === "7" || qualRaw === "dom7") {
    type = "7";
  } else if (qualRaw === "maj7" || qualRaw === "m7" || qualRaw === "sus2" || qualRaw === "sus4" || qualRaw === "dim" || qualRaw === "aug" || qualRaw === "5") {
    type = qualRaw;
  } else if (qualRaw === "major" || qualRaw === "maj") {
    type = "major";
  } else {
    // Check if it matches any CHORD_TYPES directly
    const found = CHORD_TYPES.find((t) => t.toLowerCase() === qualRaw);
    if (found) {
      type = found;
    } else {
      return null;
    }
  }

  return { root, type, raw: clean };
}

export function parseProgression(input: string): ParsedChord[] {
  if (!input.trim()) return [];
  // Split by dashes, commas, pipes or whitespace
  const tokens = input.split(/[-–—→,|/\s]+/).filter(Boolean);
  const result: ParsedChord[] = [];
  for (const token of tokens) {
    const parsed = parseChordToken(token);
    if (!parsed) return [];
    result.push(parsed);
  }
  return result;
}
