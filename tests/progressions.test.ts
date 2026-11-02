import { describe, it, expect } from "vitest";
import {
  parseChordToken,
  parseProgression,
  PROGRESSION_PRESETS,
} from "../src/music/progressions";

describe("progression parsing and presets", () => {
  it("parses single chord tokens correctly", () => {
    expect(parseChordToken("C")).toEqual({ root: "C", type: "major", raw: "C" });
    expect(parseChordToken("Em")).toEqual({ root: "E", type: "minor", raw: "Em" });
    expect(parseChordToken("Am")).toEqual({ root: "A", type: "minor", raw: "Am" });
    expect(parseChordToken("B7")).toEqual({ root: "B", type: "7", raw: "B7" });
    expect(parseChordToken("F#m")).toEqual({ root: "F#", type: "minor", raw: "F#m" });
    expect(parseChordToken("Bb")).toEqual({ root: "A#", type: "major", raw: "Bb" });
    expect(parseChordToken("Csus4")).toEqual({ root: "C", type: "sus4", raw: "Csus4" });
    expect(parseChordToken("Gmaj7")).toEqual({ root: "G", type: "maj7", raw: "Gmaj7" });
    expect(parseChordToken("D minor")).toEqual({ root: "D", type: "minor", raw: "D minor" });
  });

  it("returns null for invalid chord tokens", () => {
    expect(parseChordToken("XYZ")).toBeNull();
    expect(parseChordToken("123")).toBeNull();
    expect(parseChordToken("")).toBeNull();
  });

  it("parses progression strings with various delimiters (-, commas, pipes, spaces)", () => {
    const p1 = parseProgression("Em - Am - B7 - Em");
    expect(p1.map((c) => `${c.root} ${c.type}`)).toEqual([
      "E minor",
      "A minor",
      "B 7",
      "E minor",
    ]);

    const p2 = parseProgression("C, G, Am, F");
    expect(p2.map((c) => `${c.root} ${c.type}`)).toEqual([
      "C major",
      "G major",
      "A minor",
      "F major",
    ]);

    const p3 = parseProgression("Dm | G7 | C");
    expect(p3.map((c) => `${c.root} ${c.type}`)).toEqual([
      "D minor",
      "G 7",
      "C major",
    ]);
  });

  it("verifies all progression presets contain valid, non-empty chord sequences", () => {
    expect(PROGRESSION_PRESETS.length).toBeGreaterThanOrEqual(5);

    for (const preset of PROGRESSION_PRESETS) {
      expect(preset.id).toBeDefined();
      expect(preset.name).toBeDefined();
      expect(preset.chordStrings.length).toBeGreaterThanOrEqual(3);

      const parsed = parseProgression(preset.chordStrings.join(" - "));
      expect(parsed.length).toBe(preset.chordStrings.length);
      for (const chord of parsed) {
        expect(chord.root).toBeDefined();
        expect(chord.type).toBeDefined();
      }
    }
  });
});
