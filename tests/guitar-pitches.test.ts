import { describe, it, expect } from "vitest";
import { VOICINGS, voicingPitches, TUNING_MIDI } from "../src/music/guitar";

describe("guitar string pitch calculations", () => {
  it("defines standard guitar tuning in MIDI: E2(40), A2(45), D3(50), G3(55), B3(59), E4(64)", () => {
    expect(TUNING_MIDI).toEqual([40, 45, 50, 55, 59, 64]);
  });

  it("calculates real C major voicing pitches [x, 3, 2, 0, 1, 0] -> C3, E3, G3, C4, E4", () => {
    const cMajor = VOICINGS["C major"];
    expect(cMajor).toBeDefined();
    const pitches = voicingPitches(cMajor);
    expect(pitches).toEqual([
      45 + 3, // A2 + 3 = C3 (48)
      50 + 2, // D3 + 2 = E3 (52)
      55 + 0, // G3 + 0 = G3 (55)
      59 + 1, // B3 + 1 = C4 (60)
      64 + 0, // E4 + 0 = E4 (64)
    ]);
  });

  it("calculates real E minor voicing pitches [0, 2, 2, 0, 0, 0] -> E2, B2, E3, G3, B3, E4", () => {
    const em = VOICINGS["E minor"];
    const pitches = voicingPitches(em);
    expect(pitches).toEqual([40, 47, 52, 55, 59, 64]);
  });

  it("calculates real E major voicing pitches [0, 2, 2, 1, 0, 0] -> E2, B2, E3, G#3, B3, E4", () => {
    const eMaj = VOICINGS["E major"];
    const pitches = voicingPitches(eMaj);
    expect(pitches).toEqual([40, 47, 52, 56, 59, 64]);
  });

  it("calculates real D major voicing pitches [x, x, 0, 2, 3, 2] -> D3, A3, D4, F#4", () => {
    const dMaj = VOICINGS["D major"];
    const pitches = voicingPitches(dMaj);
    expect(pitches).toEqual([50, 57, 62, 66]);
  });

  it("calculates real F major barre voicing pitches [1, 3, 3, 2, 1, 1] -> F2, C3, F3, A3, C4, F4", () => {
    const fMaj = VOICINGS["F major"];
    const pitches = voicingPitches(fMaj);
    expect(pitches).toEqual([41, 48, 53, 57, 60, 65]);
  });

  it("ensures every voicing in VOICINGS produces valid MIDI notes within realistic guitar range", () => {
    for (const [name, pos] of Object.entries(VOICINGS)) {
      const pitches = voicingPitches(pos);
      expect(pitches.length).toBeGreaterThanOrEqual(3);
      for (const p of pitches) {
        expect(p).toBeGreaterThanOrEqual(40); // >= E2
        expect(p).toBeLessThanOrEqual(84); // <= C6
      }
    }
  });

  it("ignores muted strings (x) completely", () => {
    const pitches = voicingPitches(["x", "x", "x", 0, 1, 2]);
    expect(pitches).toEqual([55, 60, 66]);
  });
});
