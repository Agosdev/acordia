import { describe, it, expect } from "vitest";
import {
  noteLabel,
  chordQualityLabel,
  formatChordTitle,
  CHORD_QUALITY_TRANSLATIONS,
} from "../src/music/notation";

describe("notation & i18n", () => {
  it("formats note labels correctly in american, latin, and both modes", () => {
    expect(noteLabel("C", "american")).toBe("C");
    expect(noteLabel("C", "latin")).toBe("Do");
    expect(noteLabel("C", "both")).toBe("C (Do)");

    expect(noteLabel("F#", "american")).toBe("F#");
    expect(noteLabel("F#", "latin")).toBe("Fa♯");
    expect(noteLabel("F#", "both")).toBe("F# (Fa♯)");

    expect(noteLabel("Bb", "latin")).toBe("Si♭");
  });

  it("translates chord quality to Spanish and English", () => {
    expect(chordQualityLabel("major", "es")).toBe("mayor");
    expect(chordQualityLabel("major", "en")).toBe("major");

    expect(chordQualityLabel("minor", "es")).toBe("menor");
    expect(chordQualityLabel("minor", "en")).toBe("minor");

    expect(chordQualityLabel("dim", "es")).toBe("disminuido");
    expect(chordQualityLabel("dim", "en")).toBe("diminished");

    expect(chordQualityLabel("aug", "es")).toBe("aumentado");
    expect(chordQualityLabel("aug", "en")).toBe("augmented");

    expect(chordQualityLabel("sus4", "es")).toBe("suspendido 4");
    expect(chordQualityLabel("sus4", "en")).toBe("suspended 4th");
  });

  it("provides short Spanish label for dropdowns and compact chips", () => {
    expect(chordQualityLabel("major", "es", true)).toBe("mayor");
    expect(chordQualityLabel("minor", "es", true)).toBe("menor");
    expect(chordQualityLabel("7", "es", true)).toBe("7");
    expect(chordQualityLabel("dim", "es", true)).toBe("dim");
  });

  it("formats chord title with combined note and quality preferences", () => {
    expect(formatChordTitle("C", "major", "american", "en")).toBe("C major");
    expect(formatChordTitle("C", "major", "latin", "es")).toBe("Do mayor");
    expect(formatChordTitle("C", "major", "both", "es")).toBe("C (Do) mayor");
    expect(formatChordTitle("E", "minor", "both", "es")).toBe("E (Mi) menor");
    expect(formatChordTitle("B", "7", "american", "es")).toBe("B séptima dominante");
  });

  it("has translations for all standard chord types", () => {
    expect(Object.keys(CHORD_QUALITY_TRANSLATIONS).length).toBeGreaterThanOrEqual(14);
  });
});
