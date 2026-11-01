import { chordNotes } from "../music/chords";
import { Note } from "tonal";

const SEMITONES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
function pc(n: string) { return Note.pitchClass(n); }

import { noteLabel, type NotationMode } from "../music/notation";
export default function PianoKeyboard({ root, type, notation="both" }: { root: string; type: string; notation?: NotationMode }) {
  const pcs = new Set(chordNotes(root as any, type).map(pc));
  const start = 48; // C3
  const keys = Array.from({ length: 24 }, (_, i) => start + i);
  const isBlack = (m: number) => [1,3,6,8,10].includes(m % 12);
  return (
    <svg viewBox="0 0 720 180" width="100%" role="img" aria-label="Piano">
      {keys.filter(m=>!isBlack(m)).map(m => {
        const idx = m - start;
        const whiteIndex = keys.slice(0, idx+1).filter(x=>!isBlack(x)).length - 1;
        const w = 30;
        const x = whiteIndex * w;
        const name = SEMITONES[m % 12];
        const active = pcs.has(name);
        return <g key={m}>
          <rect x={x} y={0} width={w-2} height={180} fill={active?"#7c8cff":"#f5f5f5"} stroke="#222" />
          <text x={x+w/2-1} y={165} textAnchor="middle" fontSize="10" fill="#222">{noteLabel(name,notation)}</text>
        </g>;
      })}
      {keys.filter(m=>isBlack(m)).map(m => {
        const idx = m - start;
        const whiteBefore = keys.slice(0, idx).filter(x=>!isBlack(x)).length;
        const w = 30;
        const x = whiteBefore * w - 9;
        const name = SEMITONES[m % 12];
        const active = pcs.has(name);
        return <rect key={m} x={x} y={0} width={18} height={110} fill={active?"#ff6b6b":"#111"} stroke="#000" />;
      })}
    </svg>
  );
}
