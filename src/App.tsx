import { useState, useEffect } from "react";
import { ROOTS, CHORD_TYPES, chordNotes, chordMidi, type Root } from "./music/chords";
import { playMidi, stop } from "./audio/player";
import PianoKeyboard from "./components/PianoKeyboard";
import GuitarDiagram from "./components/GuitarDiagram";
import { VOICINGS, voicingPitches, guitarVoicingKey } from "./music/guitar";
import "./styles/tokens.css";
import {
  noteLabel,
  loadNotation,
  loadChordLanguage,
  chordQualityLabel,
  formatChordTitle,
  type NotationMode,
  type ChordLanguage,
} from "./music/notation";
import {
  PROGRESSION_PRESETS,
  parseProgression,
  type ParsedChord,
} from "./music/progressions";

export default function App() {
  // Navigation mode
  const [appMode, setAppMode] = useState<"chord" | "progression">("chord");

  // Chord exploration state
  const [root, setRoot] = useState<Root>("C");
  const [type, setType] = useState<string>("major");
  const [instrument, setInstrument] = useState<"piano" | "guitar">("piano");
  const [guideMode, setGuideMode] = useState(true);

  // Internationalization / notation state
  const [notation, setNotation] = useState<NotationMode>(loadNotation());
  const [chordLang, setChordLang] = useState<ChordLanguage>(loadChordLanguage());

  // Audio feedback state
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  // Progression mode state
  const [selectedPresetId, setSelectedPresetId] = useState<string>("rock");
  const [customInput, setCustomInput] = useState<string>("Em - Am - B7 - Em");
  const [progressionChords, setProgressionChords] = useState<ParsedChord[]>(() =>
    parseProgression("Em - Am - B7 - Em")
  );
  const [progressionIndex, setProgressionIndex] = useState<number>(0);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem("acordia-notation", notation);
  }, [notation]);

  useEffect(() => {
    localStorage.setItem("acordia-chord-lang", chordLang);
  }, [chordLang]);

  // When preset changes, update progression chords
  useEffect(() => {
    if (selectedPresetId === "custom") {
      setProgressionChords(parseProgression(customInput));
    } else {
      const preset = PROGRESSION_PRESETS.find((p) => p.id === selectedPresetId);
      if (preset) {
        setProgressionChords(parseProgression(preset.chordStrings.join(" - ")));
        setProgressionIndex(0);
      }
    }
  }, [selectedPresetId]);

  // Keep progression index within bounds
  useEffect(() => {
    if (progressionIndex >= progressionChords.length && progressionChords.length > 0) {
      setProgressionIndex(0);
    }
  }, [progressionChords, progressionIndex]);

  // Active chord depends on current app mode
  const activeRoot: Root =
    appMode === "progression" && progressionChords[progressionIndex]
      ? progressionChords[progressionIndex].root
      : root;

  const activeType: string =
    appMode === "progression" && progressionChords[progressionIndex]
      ? progressionChords[progressionIndex].type
      : type;

  const notes = chordNotes(activeRoot, activeType);

  const handleInstrumentChange = (newInst: "piano" | "guitar") => {
    stop();
    setInstrument(newInst);
  };

  const handlePlayChord = async (chordRoot: Root, chordType: string) => {
    setPlaybackError(null);
    try {
      if (instrument === "guitar") {
        const voicingKey = guitarVoicingKey(chordRoot, chordType);
        const voicing = VOICINGS[voicingKey];
        if (voicing) {
          const pitches = voicingPitches(voicing);
          await playMidi(pitches, "guitar", { strum: true, strumDelay: 0.032 });
        } else {
          await playMidi(chordMidi(chordRoot, chordType, 3), "guitar", {
            strum: true,
            strumDelay: 0.032,
          });
        }
      } else {
        await playMidi(chordMidi(chordRoot, chordType), "piano");
      }
    } catch (err) {
      setPlaybackError(err instanceof Error ? err.message : "Error al reproducir audio");
    }
  };

  const handleResetChord = () => {
    stop();
    setRoot("C");
    setType("major");
    setPlaybackError(null);
  };

  // Progression navigation
  const handlePrevProgressionChord = () => {
    if (progressionChords.length === 0) return;
    stop();
    const nextIdx = (progressionIndex - 1 + progressionChords.length) % progressionChords.length;
    setProgressionIndex(nextIdx);
  };

  const handleNextProgressionChord = () => {
    if (progressionChords.length === 0) return;
    stop();
    const nextIdx = (progressionIndex + 1) % progressionChords.length;
    setProgressionIndex(nextIdx);
  };

  return (
    <main style={{ minHeight: "100vh", padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      {/* HEADER */}
      <header
        className="glass"
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>ACORDIA</h1>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Instrument Toggle */}
          <div style={{ display: "inline-flex", background: "rgba(0,0,0,0.25)", padding: 3, borderRadius: 10, border: "1px solid var(--border)" }}>
            <button
              onClick={() => handleInstrumentChange("piano")}
              aria-pressed={instrument === "piano"}
              style={{ padding: "6px 14px", border: "none", background: instrument === "piano" ? "var(--surface-active)" : "transparent" }}
            >
              Piano
            </button>
            <button
              onClick={() => handleInstrumentChange("guitar")}
              aria-pressed={instrument === "guitar"}
              style={{ padding: "6px 14px", border: "none", background: instrument === "guitar" ? "var(--surface-active)" : "transparent" }}
            >
              Guitarra
            </button>
          </div>

          {/* Notation Preferences */}
          <label className="preference">Notación
          <select
            value={notation}
            onChange={(e) => setNotation(e.target.value as NotationMode)}
            aria-label="Notación"
            title="Notación de notas"
          >
            <option value="both">Ambas</option>
            <option value="american">Anglosajona</option>
            <option value="latin">Latina</option>
          </select>
          </label>

          <label className="preference">Idioma
          <select
            value={chordLang}
            onChange={(e) => setChordLang(e.target.value as ChordLanguage)}
            aria-label="Idioma"
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
          </label>
        </div>
      </header>

      {/* MODE TABS */}
      <nav style={{ display: "flex", gap: 8, justifyContent: "flex-start" }}>
        <button
          className={appMode === "chord" ? "active" : ""}
          onClick={() => {
            stop();
            setAppMode("chord");
          }}
          style={{ padding: "8px 18px", borderRadius: 10 }}
        >
          Explorar Acorde
        </button>
        <button
          className={appMode === "progression" ? "active" : ""}
          onClick={() => {
            stop();
            setAppMode("progression");
          }}
          style={{ padding: "8px 18px", borderRadius: 10 }}
        >
          Practicar Progresiones
        </button>
      </nav>

      {/* CHORD EXPLORER CONTROLS (when appMode === 'chord') */}
      {appMode === "chord" && (
        <section className="glass" style={{ padding: "18px 20px", display: "grid", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <label style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
                Tónica:
                <select
                  value={root}
                  onChange={(e) => setRoot(e.target.value as Root)}
                  style={{ marginLeft: 8 }}
                >
                  {ROOTS.map((r) => (
                    <option key={r} value={r}>
                      {noteLabel(r, notation)}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
                Especie:
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ marginLeft: 8 }}
                >
                  {CHORD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {chordQualityLabel(t, chordLang, true)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button onClick={handleResetChord} style={{ fontSize: 12, padding: "6px 12px", opacity: 0.8 }} title="Restablecer a C mayor">
              Restablecer
            </button>
          </div>
        </section>
      )}

      {/* PROGRESSIONS CONTROLS (when appMode === 'progression') */}
      {appMode === "progression" && (
        <section className="glass" style={{ padding: "18px 20px", display: "grid", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", width: "100%", maxWidth: 600 }}>
              <label style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
                Progresión:
                <select
                  aria-label="Progresión"
                  value={selectedPresetId}
                  onChange={(e) => setSelectedPresetId(e.target.value)}
                  style={{ marginLeft: 8 }}
                >
                  {PROGRESSION_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.description})
                    </option>
                  ))}
                  <option value="custom">Personalizada (escribir...)</option>
                </select>
              </label>

              {selectedPresetId === "custom" && (
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    setProgressionChords(parseProgression(e.target.value));
                    setProgressionIndex(0);
                    stop();
                  }}
                  placeholder="Ej: Em - Am - B7 - Em"
                  style={{ flex: 1, minWidth: 200 }}
                  aria-label="Progresión personalizada"
                />
              )}
            </div>

            {progressionChords.length > 0 && (
              <span style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "monospace" }}>
                Acorde {progressionIndex + 1} de {progressionChords.length}
              </span>
            )}
          </div>

          {/* Sequence Chips Bar */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", overflowX: "auto", paddingBottom: 4 }}>
            {progressionChords.map((pc, idx) => {
              const isCurrent = idx === progressionIndex;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    stop();
                    setProgressionIndex(idx);
                  }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: isCurrent ? 700 : 500,
                    background: isCurrent ? "var(--surface-active)" : "var(--surface)",
                    borderColor: isCurrent ? "var(--accent)" : "var(--border)",
                    boxShadow: isCurrent ? "0 0 12px var(--accent-glow)" : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ opacity: 0.6, fontSize: 11, marginRight: 4 }}>{idx + 1}.</span>
                  {noteLabel(pc.root, notation)} {chordQualityLabel(pc.type, chordLang, true)}
                </button>
              );
            })}
          </div>

          {/* Stepper Navigation Buttons */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={handlePrevProgressionChord} disabled={progressionChords.length <= 1}>
              ◀ Anterior
            </button>
            <button onClick={handleNextProgressionChord} disabled={progressionChords.length <= 1}>
              Siguiente ▶
            </button>
          </div>
        </section>
      )}

      {appMode === "progression" && progressionChords.length === 0 && <p role="alert">Ingresá una progresión válida, por ejemplo Em → Am → B7 → Em.</p>}
      {/* UNIFIED VISUALIZER & PLAYBACK CARD */}
      <section hidden={appMode === "progression" && progressionChords.length === 0} className="glass" style={{ padding: "24px 20px", display: appMode === "progression" && progressionChords.length === 0 ? "none" : "grid", gap: 18 }}>
        {/* Chord Title & Notes */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent)", fontWeight: 600, marginBottom: 4 }}>
              {appMode === "progression" ? `Progresión: Acorde ${progressionIndex + 1} de ${progressionChords.length}` : "Acorde Seleccionado"}
            </div>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
              {formatChordTitle(activeRoot, activeType, notation, chordLang)}
            </h2>
          </div>

          {/* Note Chips */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 4 }}>Notas:</span>
            {notes.map((n) => (
              <span
                key={n}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 12,
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              >
                {noteLabel(n, notation)}
              </span>
            ))}
          </div>
        </div>

        {/* Playback Controls & Mode Options */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="primary"
              disabled={appMode === "progression" && progressionChords.length === 0}
              onClick={() => handlePlayChord(activeRoot, activeType)}
              style={{ padding: "9px 20px", fontSize: 14 }}
            >
              Play
            </button>
            <button onClick={stop} style={{ padding: "9px 18px", fontSize: 14 }}>
              Stop
            </button>

            {playbackError && (
              <span role="alert" style={{ color: "var(--danger)", fontSize: 12, marginLeft: 8 }}>
                {playbackError}
              </span>
            )}
          </div>

          {(
            <button
              onClick={() => setGuideMode(!guideMode)}
              aria-pressed={guideMode}
              style={{ fontSize: 12, padding: "6px 12px" }}
              title="Mostrar u ocultar sugerencias de dedos"
            >
              {guideMode ? "Modo guía: Dedos activos" : "Modo simple: Dedos ocultos"}
            </button>
          )}
        </div>

        {/* Visualizer Container (Piano or Guitar) */}
        <div
          className="glass-card"
          style={{
            padding: "24px 16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 250,
            overflowX: "auto",
          }}
        >
          {instrument === "piano" ? (
            <PianoKeyboard
              root={activeRoot}
              type={activeType}
              notation={notation}
              guideMode={guideMode}
            />
          ) : VOICINGS[guitarVoicingKey(activeRoot, activeType)] ? (
            <GuitarDiagram root={activeRoot} type={activeType} notation={notation} guideMode={guideMode} />
          ) : (
            <div style={{ textAlign: "center", padding: "16px 20px", maxWidth: 420 }}>
              <p style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                Sin digitación verificada para {noteLabel(activeRoot, notation)} {chordQualityLabel(activeType, chordLang, true)}.
              </p>
              <p style={{ margin: "0 0 16px 0", fontSize: 13, color: "var(--text-muted)" }}>
                Notas del acorde: {notes.map((n) => noteLabel(n, notation)).join(" ")}
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => handleInstrumentChange("piano")}>Ver en piano</button>
                {appMode === "chord" && VOICINGS[`${activeRoot} major`] && activeType !== "major" && (
                  <button
                    onClick={() => {
                      if (appMode === "chord") setType("major");
                    }}
                  >
                    Ver acorde relacionado: {noteLabel(activeRoot, notation)} mayor
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
