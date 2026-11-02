import { describe, it, expect } from "vitest";
import { getPianoFingering, PIANO_FINGER_NAMES } from "../src/music/piano";

describe("piano fingering guide", () => {
  it("provides standard 1-3-5 fingering for root position triads", () => {
    expect(getPianoFingering("major", 3)).toEqual([1, 3, 5]);
    expect(getPianoFingering("minor", 3)).toEqual([1, 3, 5]);
    expect(getPianoFingering("dim", 3)).toEqual([1, 3, 5]);
    expect(getPianoFingering("aug", 3)).toEqual([1, 3, 5]);
  });

  it("provides standard 1-2-3-5 fingering for root position 7th chords", () => {
    expect(getPianoFingering("7", 4)).toEqual([1, 2, 3, 5]);
    expect(getPianoFingering("maj7", 4)).toEqual([1, 2, 3, 5]);
    expect(getPianoFingering("m7", 4)).toEqual([1, 2, 3, 5]);
  });

  it("provides conventional fingering for sus4 and sus2", () => {
    expect(getPianoFingering("sus4", 3)).toEqual([1, 4, 5]);
    expect(getPianoFingering("sus2", 3)).toEqual([1, 2, 5]);
  });

  it("provides 1-5 for power chords (fifth)", () => {
    expect(getPianoFingering("5", 2)).toEqual([1, 5]);
  });

  it("returns null without inventing dubious fingerings for complex tensions", () => {
    expect(getPianoFingering("add9", 4)).toBeNull();
    expect(getPianoFingering("9", 5)).toBeNull();
    expect(getPianoFingering("7sus4", 4)).toBeNull();
  });

  it("defines standard Spanish and English finger names", () => {
    expect(PIANO_FINGER_NAMES[1].es).toBe("1 pulgar");
    expect(PIANO_FINGER_NAMES[1].en).toBe("1 thumb");
    expect(PIANO_FINGER_NAMES[5].es).toBe("5 meñique");
  });
});
