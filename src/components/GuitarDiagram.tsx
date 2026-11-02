import { VOICINGS, FINGERINGS } from "../music/guitar";
const COLORS: Record<number,string> = {1:"#5DDCF3",2:"#FF9588",3:"#F9C86A",4:"#BCA5FF"};
export default function GuitarDiagram({ root, type }: { root: string; type: string; notation?: any }) {
  const key = `${root} ${type === "minor" ? "minor" : "major"}`;
  const pos = VOICINGS[key];
  const fingers = FINGERINGS[key];
  if (!pos) return <p>Sin digitación verificada.</p>;
  return (
    <div>
      <svg viewBox="0 0 220 260" width="240" role="img" aria-label="Guitarra">
        {Array.from({length:6}).map((_,i)=>(
          <line key={"s"+i} x1={30+i*28} y1={30} x2={30+i*28} y2={30+5*30} stroke="#aaa" />
        ))}
        {Array.from({length:6}).map((_,f)=>(
          <line key={"f"+f} x1={30} y1={30+f*30} x2={30+5*28} y2={30+f*30} stroke="#aaa" />
        ))}
        {pos.map((f,i)=>{
          const x=30+i*28;
          if (f==="x") return <text key={i} x={x} y={22} textAnchor="middle" fill="#fff">x</text>;
          if (f===0) return <text key={i} x={x} y={22} textAnchor="middle" fill="#fff">o</text>;
          const y=30+(f as number)*30-15;
          const finger = fingers?.[i];
          const color = typeof finger === "number" ? COLORS[finger] || "#7c8cff" : "#7c8cff";
          return <g key={i}>
            <circle cx={x} cy={y} r={10} fill={color}/>
            {typeof finger === "number" && <text x={x} y={y+4} textAnchor="middle" fill="#000" fontSize="10">{finger}</text>}
          </g>;
        })}
      </svg>
      <div style={{display:"flex",gap:8,fontSize:12}}>
        <span style={{color:COLORS[1]}}>1 índice</span>
        <span style={{color:COLORS[2]}}>2 medio</span>
        <span style={{color:COLORS[3]}}>3 anular</span>
        <span style={{color:COLORS[4]}}>4 meñique</span>
      </div>
    </div>
  );
}
