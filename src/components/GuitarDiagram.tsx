import { VOICINGS } from "../music/guitar";
import { type NotationMode } from "../music/notation";
export default function GuitarDiagram({ root, type, notation="both" }: { root: string; type: string; notation?: NotationMode }) {
  void notation;
  const key = `${root} ${type === "minor" ? "minor" : "major"}`;
  const pos = VOICINGS[key];
  if (!pos) return <p>Sin digitación verificada.</p>;
  const strings = 6, frets = 5;
  return (
    <svg viewBox="0 0 220 260" width="240" role="img" aria-label="Guitarra">
      {Array.from({length:strings}).map((_,i)=>(
        <line key={"s"+i} x1={30+i*28} y1={30} x2={30+i*28} y2={30+frets*30} stroke="#aaa" />
      ))}
      {Array.from({length:frets+1}).map((_,f)=>(
        <line key={"f"+f} x1={30} y1={30+f*30} x2={30+(strings-1)*28} y2={30+f*30} stroke="#aaa" />
      ))}
      {pos.map((f,i)=>{
        const x=30+i*28;
        if (f==="x") return <text key={i} x={x} y={22} textAnchor="middle" fill="#fff">x</text>;
        if (f===0) return <text key={i} x={x} y={22} textAnchor="middle" fill="#fff">o</text>;
        const y=30+(f as number)*30-15;
        return <g key={i}><circle cx={x} cy={y} r={10} fill="#7c8cff"/></g>;
      })}
    </svg>
  );
}
