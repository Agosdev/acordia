import { noteLabel, type NotationMode } from "../music/notation";
import { VOICINGS, FINGERINGS, TUNING, guitarVoicingKey } from "../music/guitar";

const COLORS: Record<number, string> = {
  1: "#5DDCF3",
  2: "#FF9588",
  3: "#F9C86A",
  4: "#BCA5FF",
};

export interface GuitarDiagramProps {
  root: string;
  type: string;
  notation?: NotationMode;
  guideMode?: boolean;
}

export default function GuitarDiagram({ root, type, notation = "both", guideMode = false }: GuitarDiagramProps) {
  const key = guitarVoicingKey(root, type);
  const pos = VOICINGS[key];
  const fingers = guideMode ? FINGERINGS[key] : undefined;

  if (!pos) {
    return <p style={{ margin: "16px 0", color: "rgba(255,255,255,0.7)" }}>Sin digitación verificada.</p>;
  }

  const startX = 35;
  const stringGap = 28;
  const fretCount = 5;
  const fretGap = 32;
  const topY = 36;
  const bottomY = topY + fretCount * fretGap;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <svg
        viewBox="0 0 210 240"
        width="220"
        style={{ display: "block", margin: "0 auto" }}
        role="img"
        aria-label={`Guitarra ${root} ${type}`}
      >
        {/* Nut (cejuela) */}
        <line
          x1={startX - 1}
          y1={topY}
          x2={startX + 5 * stringGap + 1}
          y2={topY}
          stroke="#ffffff"
          strokeWidth={4.5}
          strokeLinecap="round"
        />

        {/* Fret lines */}
        {Array.from({ length: fretCount }).map((_, f) => {
          const y = topY + (f + 1) * fretGap;
          return (
            <line
              key={"fret" + f}
              x1={startX}
              y1={y}
              x2={startX + 5 * stringGap}
              y2={y}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Strings (6th low E to 1st high E) with realistic gauge gradation */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = startX + i * stringGap;
          const strokeWidth = 2.4 - i * 0.28; // 6th string thickest
          return (
            <line
              key={"string" + i}
              x1={x}
              y1={topY}
              x2={x}
              y2={bottomY}
              stroke="rgba(255,255,255,0.65)"
              strokeWidth={strokeWidth}
            />
          );
        })}

        {/* Position markers & open/mute indicators */}
        {pos.map((f, i) => {
          const x = startX + i * stringGap;

          if (f === "x") {
            // Muted string (✕)
            return (
              <text
                key={"mute" + i}
                x={x}
                y={22}
                textAnchor="middle"
                fill="#ff6b6b"
                fontSize="14"
                fontWeight="bold"
              >
                ✕
              </text>
            );
          }

          if (f === 0) {
            // Open string (○)
            return (
              <circle
                key={"open" + i}
                cx={x}
                cy={20}
                r={5.5}
                fill="none"
                stroke="#5ddcf3"
                strokeWidth={2}
              />
            );
          }

          // Fretted note
          const y = topY + (f as number) * fretGap - fretGap / 2;
          const finger = fingers?.[i];
          const color = typeof finger === "number" ? COLORS[finger] || "#8aa4ff" : "#8aa4ff";

          return (
            <g key={"fret-note" + i}>
              <circle
                cx={x}
                cy={y}
                r={10.5}
                fill={color}
                stroke="#0b1026"
                strokeWidth={1.5}
              />
              {typeof finger === "number" && (
                <text
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                  fill="#000"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {finger}
                </text>
              )}
            </g>
          );
        })}

        {/* String Tuning Labels at bottom */}
        {TUNING.map((t, i) => {
          const x = startX + i * stringGap;
          return (
            <text
              key={"tune" + i}
              x={x}
              y={bottomY + 16}
              textAnchor="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize={notation === "both" ? "7" : "9"}
              fontFamily="monospace"
            >
              {noteLabel(t.replace(/\d/, ""), notation)}
            </text>
          );
        })}
      </svg>

      {/* Finger Legend */}
      {guideMode && <div
        style={{
          display: "flex",
          gap: 12,
          fontSize: 11,
          marginTop: 6,
          flexWrap: "wrap",
          justifyContent: "center",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[1], display: "inline-block" }} />
          1 índice
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[2], display: "inline-block" }} />
          2 medio
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[3], display: "inline-block" }} />
          3 anular
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[4], display: "inline-block" }} />
          4 meñique
        </span>
      </div>}
    </div>
  );
}
