import { Chord, Note } from "tonal";

export const ROOTS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;
export type Root = (typeof ROOTS)[number];

export const CHORD_TYPES = [
  "major","minor","dim","aug","maj7","m7","7","m7b5","dim7","sus2","sus4","add9","6","m6","9","m9","maj9","11","13","m11","m13"
] as const;

export function chordNotes(root: Root, type: string): string[] {
  const c = Chord.get(`${root} ${type}`);
  return c.notes.length ? c.notes : [];
}

export function chordMidi(root: Root, type: string, baseOctave = 4): number[] {
  return chordNotes(root, type).map((n, i) => Note.midi(`${n}${baseOctave + (i > 6 ? 1 : 0)}`) ?? 60);
}
