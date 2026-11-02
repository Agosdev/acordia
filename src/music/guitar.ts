export type Fret = number | "x";
export const TUNING = ["E2","A2","D3","G3","B3","E4"] as const;
export const TUNING_MIDI = [40, 45, 50, 55, 59, 64] as const;

export function voicingPitches(positions: Fret[]): number[] {
  const pitches: number[] = [];
  for (let i = 0; i < positions.length && i < TUNING_MIDI.length; i++) {
    const fret = positions[i];
    if (typeof fret === "number" && fret >= 0) {
      pitches.push(TUNING_MIDI[i] + fret);
    }
  }
  return pitches;
}

export const VOICINGS: Record<string, Fret[]> = {
  "A major": ["x",0,2,2,2,0],
  "C major": ["x",3,2,0,1,0],
  "D major": ["x","x",0,2,3,2],
  "E major": [0,2,2,1,0,0],
  "G major": [3,2,0,0,0,3],
  "A minor": ["x",0,2,2,1,0],
  "D minor": ["x","x",0,2,3,1],
  "E minor": [0,2,2,0,0,0],
  "F major": [1,3,3,2,1,1],
  "B minor": ["x",2,4,4,3,2],
  "F# minor": [2,4,4,2,2,2],
  "B7": ["x",2,1,2,0,2],
};

export const FINGERINGS: Record<string, (number | "x" | 0)[]> = {
  "E major": [0,2,3,1,0,0],
  "A major": ["x",0,1,2,3,0],
  "D major": ["x","x",0,1,3,2],
  "G major": [2,1,0,0,0,3],
  "C major": ["x",3,2,0,1,0],
  "A minor": ["x",0,2,3,1,0],
  "D minor": ["x","x",0,2,3,1],
  "E minor": [0,2,3,0,0,0],
  "F major": [1,3,4,2,1,1],
  "B minor": ["x",1,3,4,2,1],
  "F# minor": [1,3,4,1,1,1],
  "B7": ["x",2,1,3,0,4],
};

/** Exact catalog key: never substitute a different chord quality. */
export function guitarVoicingKey(root: string, type: string): string {
  return type === "7" ? `${root}7` : `${root} ${type}`;
}
