import { describe, it, expect } from "vitest";
import { VOICINGS } from "../src/music/guitar";
describe("guitar", () => {
  it("has Em", () => expect(VOICINGS["E minor"]).toEqual([0,2,2,0,0,0]));
  it("missing returns undefined", () => expect(VOICINGS["C minor"]).toBeUndefined());
});
