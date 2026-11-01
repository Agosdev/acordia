import { useState } from "react";
import { ROOTS, CHORD_TYPES, chordNotes, chordMidi } from "./music/chords";
import { playMidi, stop } from "./audio/player";

export default function App() {
  const [root, setRoot] = useState<(typeof ROOTS)[number]>("C");
  const [type, setType] = useState<string>("major");
  const notes = chordNotes(root, type);
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0b1026,#1a1f4a)", color: "#fff", padding: 24, fontFamily: "system-ui" }}>
      <h1>ACORDIA</h1>
      <p>Laboratorio de acordes</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <select value={root} onChange={(e) => setRoot(e.target.value as any)}>
          {ROOTS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {CHORD_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <button onClick={() => playMidi(chordMidi(root, type))}>Escuchar</button>
        <button onClick={stop}>Detener</button>
      </div>
      <p>Notas: {notes.join(" ")}</p>
    </main>
  );
}
