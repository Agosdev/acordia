export type NotationMode = "american" | "latin" | "both";
export type ChordLanguage = "es" | "en";

const LATIN: Record<string, string> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};

export const CHORD_QUALITY_TRANSLATIONS: Record<string, { en: string; es: string; shortEs: string }> = {
  major: { en: "major", es: "mayor", shortEs: "mayor" },
  minor: { en: "minor", es: "menor", shortEs: "menor" },
  "7": { en: "dominant 7th", es: "séptima dominante", shortEs: "7" },
  maj7: { en: "major 7th", es: "séptima mayor", shortEs: "maj7" },
  m7: { en: "minor 7th", es: "séptima menor", shortEs: "m7" },
  sus2: { en: "suspended 2nd", es: "suspendido 2", shortEs: "sus2" },
  sus4: { en: "suspended 4th", es: "suspendido 4", shortEs: "sus4" },
  add9: { en: "added 9th", es: "novena añadida", shortEs: "add9" },
  "6": { en: "sixth", es: "sexta", shortEs: "6" },
  m6: { en: "minor 6th", es: "sexta menor", shortEs: "m6" },
  "9": { en: "ninth", es: "novena", shortEs: "9" },
  dim: { en: "diminished", es: "disminuido", shortEs: "dim" },
  aug: { en: "augmented", es: "aumentado", shortEs: "aum" },
  "7sus4": { en: "7th suspended 4th", es: "séptima suspendido 4", shortEs: "7sus4" },
  "5": { en: "fifth (power chord)", es: "quinta (power chord)", shortEs: "5" },
};

export function noteLabel(note: string, mode: NotationMode): string {
  const m = note.match(/^([A-G])([#b]?)/);
  if (!m) return note;
  const lat = LATIN[m[1]] + (m[2] === "#" ? "♯" : m[2] === "b" ? "♭" : "");
  if (mode === "american") return note;
  if (mode === "latin") return lat;
  return `${note} (${lat})`;
}

export function chordQualityLabel(quality: string, lang: ChordLanguage, short = false): string {
  const item = CHORD_QUALITY_TRANSLATIONS[quality];
  if (!item) return quality;
  if (lang === "en") return item.en;
  return short ? item.shortEs : item.es;
}

export function formatChordTitle(
  root: string,
  quality: string,
  mode: NotationMode,
  lang: ChordLanguage
): string {
  const rootStr = noteLabel(root, mode);
  const qualStr = chordQualityLabel(quality, lang, false);
  return `${rootStr} ${qualStr}`;
}

export function loadNotation(): NotationMode {
  const v = localStorage.getItem("acordia-notation");
  return v === "american" || v === "latin" || v === "both" ? v : "both";
}

export function loadChordLanguage(): ChordLanguage {
  const v = localStorage.getItem("acordia-chord-lang");
  return v === "es" || v === "en" ? v : "es";
}
