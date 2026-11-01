export type Fret = number | "x";
export const TUNING = ["E2","A2","D3","G3","B3","E4"] as const;

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
