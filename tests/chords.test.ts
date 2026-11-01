import { describe, it, expect } from "vitest";
import { chordNotes } from "../src/music/chords";

describe("chords", () => {
  const cases: [string,string,string[]][] = [
    ["C","major",["C","E","G"]],
    ["C","minor",["C","Eb","G"]],
    ["F","minor",["F","Ab","C"]],
    ["D","7",["D","F#","A","C"]],
    ["C","maj7",["C","E","G","B"]],
    ["B","7",["B","D#","F#","A"]],
    ["B","dim",["B","D","F"]],
    ["C","sus4",["C","F","G"]],
  ];
  for (const [r,t,exp] of cases) {
    it(`${r} ${t}`, () => expect(chordNotes(r as any, t)).toEqual(exp));
  }
});
