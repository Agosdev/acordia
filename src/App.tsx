import { useState } from "react";
import { ROOTS, CHORD_TYPES, chordNotes, chordMidi } from "./music/chords";
import { playMidi, stop } from "./audio/player";
import PianoKeyboard from "./components/PianoKeyboard";
import GuitarDiagram from "./components/GuitarDiagram";
import { VOICINGS } from "./music/guitar";
import "./styles/tokens.css";
export default function App() {
  const [root, setRoot] = useState<any>("C");
  const [type, setType] = useState("major");
  const [instrument, setInstrument] = useState<"piano"|"guitar">("piano");
  const notes = chordNotes(root, type);
  return (
    <main style={{ minHeight:"100vh", padding:24 }}>
      <header className="glass" style={{padding:12,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><h1 style={{margin:0}}>ACORDIA</h1><p style={{margin:0}}>Laboratorio de acordes</p></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setInstrument("piano")} aria-pressed={instrument==="piano"}>Piano</button>
          <button onClick={()=>setInstrument("guitar")} aria-pressed={instrument==="guitar"}>Guitarra</button>
        </div>
      </header>
      <section className="glass" style={{padding:16,display:"grid",gap:12}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <select value={root} onChange={e=>setRoot(e.target.value)}>{ROOTS.map(r=><option key={r}>{r}</option>)}</select>
          <select value={type} onChange={e=>setType(e.target.value)}>{CHORD_TYPES.map(t=><option key={t}>{t}</option>)}</select>
        </div>
        <div><strong>{root} {type}</strong> — {notes.join(" ")}</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>playMidi(chordMidi(root,type))}>Play</button>
          <button onClick={stop}>Stop</button>
        </div>
        {instrument==="piano" ? <PianoKeyboard root={root} type={type} /> : (
  VOICINGS[`${root} ${type === "minor" ? "minor" : "major"}`] ? <GuitarDiagram root={root} type={type} /> : (
    <div className="glass" style={{padding:12}}>
      <p>Sin digitación verificada para {root} {type}.</p>
      <p>Notas: {notes.join(" ")}</p>
      <button onClick={()=>setInstrument("piano")}>Ver en piano</button>
      {VOICINGS[`${root} major`] && type!=="major" && <button onClick={()=>setType("major")}>Ver acorde relacionado: {root} major</button>}
    </div>
  )
)}
      </section>
    </main>
  );
}
