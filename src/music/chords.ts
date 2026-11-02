import { Chord, Note } from "tonal";

export const ROOTS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;
export type Root = (typeof ROOTS)[number];

export const CHORD_TYPES = [
  "major","minor","7","maj7","m7","sus2","sus4","add9","6","m6","9","dim","aug","7sus4","5"
] as const;

export function chordNotes(root: Root, type: string): string[] {
  const c = Chord.get(`${root} ${type}`);
  return c.notes.length ? c.notes : [];
}

export function chordMidi(root: Root, type: string, baseOctave = 4): number[] {
  const rootMidi = Note.midi(`${root}${baseOctave}`)!;
  let previous = rootMidi - 1;
  return chordNotes(root, type).map((note) => {
    let midi = baseOctave * 12 + 12 + (Note.chroma(note) ?? 0);
    while (midi <= previous) midi += 12;
    previous = midi;
    return midi;
  });
}
