import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { PIANO_REGIONS, GUITAR_REGIONS } from "../src/audio/regions";
import { getSampleUrl } from "../src/audio/mapping";

describe("ausencia de dependencias externas de audio en producción", () => {
  const publicDir = path.resolve(__dirname, "../public");
  const pianoDir = path.join(publicDir, "audio", "piano");
  const guitarDir = path.join(publicDir, "audio", "guitar");

  it("verifies public/audio directories exist", () => {
    expect(fs.existsSync(pianoDir)).toBe(true);
    expect(fs.existsSync(guitarDir)).toBe(true);
  });

  it("verifies every single piano sample file exists locally in public/audio/piano", () => {
    expect(PIANO_REGIONS.length).toBe(26);
    for (const region of PIANO_REGIONS) {
      const filePath = path.join(pianoDir, region.sample);
      expect(fs.existsSync(filePath), `Falta muestra local de piano: ${region.sample}`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(1000); // Valid audio file size
    }
  });

  it("verifies every single guitar sample file exists locally in public/audio/guitar", () => {
    expect(GUITAR_REGIONS.length).toBe(48);
    for (const region of GUITAR_REGIONS) {
      const filePath = path.join(guitarDir, region.sample);
      expect(fs.existsSync(filePath), `Falta muestra local de guitarra: ${region.sample}`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(1000); // Valid audio file size
    }
  });

  it("verifies getSampleUrl always produces local relative paths, never external URLs", () => {
    for (const region of PIANO_REGIONS) {
      const url = getSampleUrl("piano", region.sample);
      expect(url.startsWith("/audio/piano/")).toBe(true);
      expect(url).not.toMatch(/^https?:\/\//);
      expect(url).not.toMatch(/^\/\//);
    }
    for (const region of GUITAR_REGIONS) {
      const url = getSampleUrl("guitar", region.sample);
      expect(url.startsWith("/audio/guitar/")).toBe(true);
      expect(url).not.toMatch(/^https?:\/\//);
      expect(url).not.toMatch(/^\/\//);
    }
  });

  it("verifies audio source code contains no hardcoded external domains or audio CDN URLs", () => {
    const audioSrcDir = path.resolve(__dirname, "../src/audio");
    const files = fs.readdirSync(audioSrcDir).filter((f) => f.endsWith(".ts"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(audioSrcDir, file), "utf-8");
      // Check for remote URL patterns in fetch calls
      const matches = content.match(/https?:\/\/[^\s"']+/g) || [];
      expect(matches, `Found unexpected external URL in ${file}: ${matches.join(", ")}`).toEqual([]);
    }
  });
});
