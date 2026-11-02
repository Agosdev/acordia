import { chordNotes, chordMidi, type Root } from "../music/chords";
import { noteLabel, type NotationMode } from "../music/notation";
import { getPianoFingering } from "../music/piano";

const SEMITONES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export interface PianoKeyboardProps {
  root: string;
  type: string;
  notation?: NotationMode;
  guideMode?: boolean;
}

export default function PianoKeyboard({
  root,
  type,
  notation = "both",
  guideMode = false,
}: PianoKeyboardProps) {
  const cNotes = chordNotes(root as any, type);
  const midiNotes = chordMidi(root as Root, type);
  const pcs = new Set(midiNotes);
  const fingerings = guideMode ? getPianoFingering(type, cNotes.length) : null;

  // Map each pitch class to its finger number if fingering exists
  const pcToFinger: Record<string, number> = {};
  if (fingerings) {
    cNotes.forEach((_, idx) => {
      if (fingerings[idx]) {
        pcToFinger[String(midiNotes[idx])] = fingerings[idx];
      }
    });
  }

  const start = 60; // C4: root-position chord matches playback
  const keys = Array.from({ length: Math.max(24, Math.ceil((Math.max(...midiNotes) - start + 1) / 12) * 12) }, (_, i) => start + i);
  const isBlack = (m: number) => [1, 3, 6, 8, 10].includes(m % 12);

  // 14 white keys total in 2 octaves (48 to 71)
  const whiteKeyWidth = 30;
  const totalSvgWidth = keys.filter(m => !isBlack(m)).length * whiteKeyWidth; // 420px
  const svgHeight = 180;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ width: "100%", maxWidth: 640, margin: "0 auto", display: "flex", justifyContent: "center" }}>
        <svg
          viewBox={`0 0 ${totalSvgWidth} ${svgHeight}`}
          width="100%"
          style={{ maxHeight: 220, display: "block" }}
          role="img"
          aria-label="Piano"
        >
          {/* White keys */}
          {keys
            .filter((m) => !isBlack(m))
            .map((m) => {
              const idx = m - start;
              const whiteIndex = keys.slice(0, idx + 1).filter((x) => !isBlack(x)).length - 1;
              const x = whiteIndex * whiteKeyWidth;
              const name = SEMITONES[m % 12];
              const active = pcs.has(m);
              const finger = active && guideMode ? pcToFinger[String(m)] : undefined;

              return (
                <g key={m}>
                  <rect
                    x={x}
                    y={0}
                    width={whiteKeyWidth - 2}
                    height={svgHeight}
                    rx={3}
                    fill={active ? "#6482ff" : "#f0f2f5"}
                    stroke="#1a1c24"
                    strokeWidth={1.5}
                  />

                  {/* Finger number badge if active and in guide mode */}
                  {typeof finger === "number" && (
                    <g>
                      <circle cx={x + whiteKeyWidth / 2 - 1} cy={118} r={9} fill="#ffffff" stroke="#1a1c24" strokeWidth={1} />
                      <text
                        x={x + whiteKeyWidth / 2 - 1}
                        y={122}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#0b1026"
                      >
                        {finger}
                      </text>
                    </g>
                  )}

                  {/* Key Labels */}
                  {notation === "both" ? (
                    <>
                      <text x={x + whiteKeyWidth / 2 - 1} y={150} textAnchor="middle" fontSize="9" fontWeight="600" fill={active ? "#fff" : "#222"}>
                        {name}
                      </text>
                      <text x={x + whiteKeyWidth / 2 - 1} y={165} textAnchor="middle" fontSize="8" fill={active ? "#e0e6ff" : "#555"}>
                        {noteLabel(name, "latin").replace(/[♯♭]/g, (m) => m)}
                      </text>
                    </>
                  ) : (
                    <text x={x + whiteKeyWidth / 2 - 1} y={160} textAnchor="middle" fontSize="10" fontWeight="600" fill={active ? "#fff" : "#222"}>
                      {noteLabel(name, notation)}
                    </text>
                  )}
                </g>
              );
            })}

          {/* Black keys */}
          {keys
            .filter((m) => isBlack(m))
            .map((m) => {
              const idx = m - start;
              const whiteBefore = keys.slice(0, idx).filter((x) => !isBlack(x)).length;
              const x = whiteBefore * whiteKeyWidth - 9;
              const active = pcs.has(m);
              const finger = active && guideMode ? pcToFinger[String(m)] : undefined;

              return (
                <g key={m}>
                  <rect
                    x={x}
                    y={0}
                    width={18}
                    height={110}
                    rx={2}
                    fill={active ? "#ff5252" : "#1a1c23"}
                    stroke="#000"
                    strokeWidth={1}
                  />

                  {/* Finger number badge if active and in guide mode */}
                  {typeof finger === "number" && (
                    <g>
                      <circle cx={x + 9} cy={75} r={8} fill="#ffffff" stroke="#111" strokeWidth={1} />
                      <text
                        x={x + 9}
                        y={79}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#0b1026"
                      >
                        {finger}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
        </svg>
      </div>

      {guideMode && fingerings && (
        <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.75)", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ fontWeight: 600, color: "#8aa4ff" }}>Sugerencia M.D. · posición fundamental:</span>
          <span>1 pulgar</span>
          <span>•</span>
          <span>2 índice</span>
          <span>•</span>
          <span>3 medio</span>
          <span>•</span>
          <span>4 anular</span>
          <span>•</span>
          <span>5 meñique</span>
        </div>
      )}
      {guideMode && !fingerings && (
        <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          Posición libre (sin digitación convencional cerrada)
        </div>
      )}
    </div>
  );
}
