import { useState } from "react";
import { ROOTS, CHORD_TYPES, chordNotes, chordMidi } from "./music/chords";
import { playMidi, stop } from "./audio/player";
import "./styles/tokens.css";
export default function App() {
  const [root, setRoot] = useState<any>("C");
  const [type, setType] = useState("major");
  const [instrument, setInstrument] = useState<"piano"|"guitar">("piano");
  const notes = chordNotes(root, type);
  return (
    <main style={{ minHeight:"100vh", padding:24 }}>
      <header className="glass" style={{padding:16,marginBottom:16}}>
        <h1>ACORDIA</h1><p>Laboratorio de acordes</p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setInstrument("piano")}>Piano</button>
          <button onClick={()=>setInstrument("guitar")}>Guitarra</button>
        </div>
      </header>
      <section className="glass" style={{padding:16,display:"grid",gap:12}}>
        <select value={root} onChange={e=>setRoot(e.target.value)}>{ROOTS.map(r=><option key={r}>{r}</option>)}</select>
        <select value={type} onChange={e=>setType(e.target.value)}>{CHORD_TYPES.map(t=><option key={t}>{t}</option>)}</select>
        <div>{root} {type} — {notes.join(" ")}</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>playMidi(chordMidi(root,type))}>Play</button>
          <button onClick={stop}>Stop</button>
        </div>
        {instrument==="guitar" && <div>Guitarra: diagrama pendiente</div>}
      </section>
    </main>
  );
}
