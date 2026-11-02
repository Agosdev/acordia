import { describe, it, expect } from "vitest";
import { findRegion, getSampleUrl } from "../src/audio/mapping";
import { PIANO_REGIONS, GUITAR_REGIONS } from "../src/audio/regions";

describe("audio mapping", () => {
  describe("Piano SFZ mapping", () => {
    it("maps middle C (MIDI 60) exactly to C4vH.wav with rate 1.0", () => {
      const match = findRegion(60, "piano");
      expect(match.region.sample).toBe("C4vH.wav");
      expect(match.playbackRate).toBeCloseTo(1.0, 5);
    });

    it("maps B3 (MIDI 59) to C4vH.wav with -1 semitone shift", () => {
      const match = findRegion(59, "piano");
      expect(match.region.sample).toBe("C4vH.wav");
      expect(match.playbackRate).toBeCloseTo(Math.pow(2, -1 / 12), 5);
    });

    it("maps C#4 (MIDI 61) to C4vH.wav with +1 semitone shift", () => {
      const match = findRegion(61, "piano");
      expect(match.region.sample).toBe("C4vH.wav");
      expect(match.playbackRate).toBeCloseTo(Math.pow(2, 1 / 12), 5);
    });

    it("maps lowest piano note A0 (MIDI 21) to C1vH.wav", () => {
      const match = findRegion(21, "piano");
      expect(match.region.sample).toBe("C1vH.wav");
      expect(match.playbackRate).toBeCloseTo(Math.pow(2, -3 / 12), 5);
    });

    it("maps highest piano note C8 (MIDI 108) to B7vH.wav", () => {
      const match = findRegion(108, "piano");
      expect(match.region.sample).toBe("B7vH.wav");
      expect(match.playbackRate).toBeCloseTo(Math.pow(2, 1 / 12), 5);
    });

    it("clamps notes below MIDI 21 without failing", () => {
      const match = findRegion(15, "piano");
      expect(match.region.sample).toBe("C1vH.wav");
    });

    it("clamps notes above MIDI 108 without failing", () => {
      const match = findRegion(115, "piano");
      expect(match.region.sample).toBe("B7vH.wav");
    });

    it("maps F#3 (MIDI 54) to web-safe Fs3vH.wav with rate 1.0", () => {
      const match = findRegion(54, "piano");
      expect(match.region.sample).toBe("Fs3vH.wav");
      expect(match.playbackRate).toBeCloseTo(1.0, 5);
    });

    it("covers all 26 piano regions without gaps", () => {
      expect(PIANO_REGIONS.length).toBe(26);
      for (let i = 0; i < PIANO_REGIONS.length - 1; i++) {
        expect(PIANO_REGIONS[i + 1].lokey).toBe(PIANO_REGIONS[i].hikey + 1);
      }
    });
  });

  describe("Guitar SFZ mapping", () => {
    it("maps open 6th string E2 (MIDI 40) exactly to E2.wav with rate 1.0", () => {
      const match = findRegion(40, "guitar");
      expect(match.region.sample).toBe("E2.wav");
      expect(match.playbackRate).toBeCloseTo(1.0, 5);
    });

    it("maps open 5th string A2 (MIDI 45) to A2.wav with rate 1.0", () => {
      const match = findRegion(45, "guitar");
      expect(match.region.sample).toBe("A2.wav");
      expect(match.playbackRate).toBeCloseTo(1.0, 5);
    });

    it("maps open 4th string D3 (MIDI 50) to D3.wav with rate 1.0", () => {
      const match = findRegion(50, "guitar");
      expect(match.region.sample).toBe("D3.wav");
      expect(match.playbackRate).toBeCloseTo(1.0, 5);
    });

    it("maps open 3rd string G3 (MIDI 55) to G3.wav with rate 1.0", () => {
      const match = findRegion(55, "guitar");
      expect(match.region.sample).toBe("G3.wav");
      expect(match.playbackRate).toBeCloseTo(1.0, 5);
    });

    it("maps open 2nd string B3 (MIDI 59) to B3.wav with rate 1.0", () => {
      const match = findRegion(59, "guitar");
      expect(match.region.sample).toBe("B3.wav");
      expect(match.playbackRate).toBeCloseTo(1.0, 5);
    });

    it("maps open 1st string E4 (MIDI 64) to E4.wav with rate 1.0", () => {
      const match = findRegion(64, "guitar");
      expect(match.region.sample).toBe("E4.wav");
      expect(match.playbackRate).toBeCloseTo(1.0, 5);
    });

    it("maps F#3 (MIDI 54) on guitar to web-safe Fs3.wav with rate 1.0", () => {
      const match = findRegion(54, "guitar");
      expect(match.region.sample).toBe("Fs3.wav");
      expect(match.playbackRate).toBeCloseTo(1.0, 5);
    });

    it("has 48 guitar regions covering MIDI 29 to 88", () => {
      expect(GUITAR_REGIONS.length).toBe(48);
      expect(GUITAR_REGIONS[0].lokey).toBe(29);
      expect(GUITAR_REGIONS[GUITAR_REGIONS.length - 1].hikey).toBe(88);
    });
  });

  describe("Sample URLs", () => {
    it("returns correct local asset URLs", () => {
      expect(getSampleUrl("piano", "C4vH.wav")).toBe("/audio/piano/C4vH.wav");
      expect(getSampleUrl("guitar", "E2.wav")).toBe("/audio/guitar/E2.wav");
    });
  });
});
