export type Fret = number | "x";
export const TUNING = ["E2","A2","D3","G3","B3","E4"] as const; // 6..1

export const VOICINGS: Record<string, Fret[]> = {
  "E minor": [0,2,2,0,0,0],
  "A minor": ["x",0,2,2,1,0],
  "C major": ["x",3,2,0,1,0],
  "G major": [3,2,0,0,0,3],
  "D major": ["x","x",0,2,3,2],
  "B7": ["x",2,1,2,0,2],
};

export function voicingKey(root: string, type: string) {
  const name = type === "minor" ? "minor" : type === "major" ? "major" : type;
  return `${root} ${name}`;
}
