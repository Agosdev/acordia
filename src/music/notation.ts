export type NotationMode = "american" | "latin" | "both";
const LATIN: Record<string,string> = { C:"Do",D:"Re",E:"Mi",F:"Fa",G:"Sol",A:"La",B:"Si" };
export function noteLabel(note: string, mode: NotationMode): string {
  const m = note.match(/^([A-G])([#b]?)/);
  if (!m) return note;
  const lat = LATIN[m[1]] + (m[2]==="#"?"♯":m[2]==="b"?"♭":"");
  if (mode === "american") return note;
  if (mode === "latin") return lat;
  return `${note} (${lat})`;
}
export function loadNotation(): NotationMode {
  const v = localStorage.getItem("acordia-notation");
  return v === "american" || v === "latin" || v === "both" ? v : "both";
}
