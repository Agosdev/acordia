import { useState, useEffect } from "react";
import { ROOTS, CHORD_TYPES, chordNotes, chordMidi } from "./music/chords";
import { playMidi, stop } from "./audio/player";
import PianoKeyboard from "./components/PianoKeyboard";
import GuitarDiagram from "./components/GuitarDiagram";
import { VOICINGS, voicingPitches } from "./music/guitar";
import "./styles/tokens.css";
import { noteLabel, loadNotation, type NotationMode } from "./music/notation";

export default function App() {
  const [root, setRoot] = useState<any>("C");
  const [type, setType] = useState("major");
  const [instrument, setInstrument] = useState<"piano"|"guitar">("piano");
  const [notation, setNotation] = useState<NotationMode>(loadNotation());
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(()=>{ localStorage.setItem("acordia-notation", notation); },[notation]);
  const notes = chordNotes(root, type);

  const handleInstrumentChange = (newInst: "piano" | "guitar") => {
    stop();
    setInstrument(newInst);
  };

  const handlePlay = async () => {
    setPlaybackError(null);
    try {
      if (instrument === "guitar") {
        const voicingKey = `${root} ${type === "minor" ? "minor" : "major"}`;
        const voicing = VOICINGS[voicingKey];
        if (voicing) {
          const pitches = voicingPitches(voicing);
          await playMidi(pitches, "guitar", { strum: true, strumDelay: 0.032 });
        } else {
          await playMidi(chordMidi(root, type, 3), "guitar", { strum: true, strumDelay: 0.032 });
        }
      } else {
        await playMidi(chordMidi(root, type), "piano");
      }
    } catch (err) {
      setPlaybackError(err instanceof Error ? err.message : "Error al reproducir audio");
    }
  };

  return (
    <main style={{ minHeight:"100vh", padding:24 }}>
      <header className="glass" style={{padding:12,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><h1 style={{margin:0}}>ACORDIA</h1><p style={{margin:0}}>Laboratorio de acordes</p></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>handleInstrumentChange("piano")} aria-pressed={instrument==="piano"}>Piano</button>
          <button onClick={()=>handleInstrumentChange("guitar")} aria-pressed={instrument==="guitar"}>Guitarra</button>
          <select value={notation} onChange={e=>setNotation(e.target.value as NotationMode)} aria-label="Notación"><option value="american">Americana</option><option value="latin">Latina</option><option value="both">Ambas</option></select>
        </div>
      </header>
      <section className="glass" style={{padding:16,display:"grid",gap:12}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <select value={root} onChange={e=>setRoot(e.target.value)}>{ROOTS.map(r=><option key={r} value={r}>{noteLabel(r,notation)}</option>)}</select>
          <select value={type} onChange={e=>setType(e.target.value)}>{CHORD_TYPES.map(t=><option key={t}>{t}</option>)}</select>
        </div>
        <div><strong>{noteLabel(root,notation)} {type}</strong> — {notes.map(n=>noteLabel(n,notation)).join(" ")}</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={handlePlay}>Play</button>
          <button onClick={stop}>Stop</button>
          {playbackError && <span role="alert" style={{color:"#ff6b6b",fontSize:13}}>{playbackError}</span>}
        </div>
        {instrument==="piano" ? <PianoKeyboard root={root} type={type} notation={notation} /> : (
  VOICINGS[`${root} ${type === "minor" ? "minor" : "major"}`] ? <GuitarDiagram root={root} type={type} notation={notation} /> : (
    <div className="glass" style={{padding:12}}>
      <p>Sin digitación verificada para {root} {type}.</p>
      <p>Notas: {notes.join(" ")}</p>
      <button onClick={()=>handleInstrumentChange("piano")}>Ver en piano</button>
      {VOICINGS[`${root} major`] && type!=="major" && <button onClick={()=>setType("major")}>Ver acorde relacionado: {root} major</button>}
    </div>
  )
)}
      </section>
    </main>
  );
}
