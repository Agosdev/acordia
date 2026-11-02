import { test, expect } from "@playwright/test";
import { PIANO_REGIONS, GUITAR_REGIONS } from "../src/audio/regions";

test.describe("Real acoustic audio integration", () => {
  test("loads real piano and guitar samples in Chrome on demand without errors", async ({ page }) => {
    const pageErrors: Error[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const requestedWavs: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (url.endsWith(".wav")) {
        requestedWavs.push(url);
      }
    });

    await page.goto("/");
    await expect(page.getByText("ACORDIA")).toBeVisible();

    // Verify no audio samples loaded before interaction
    expect(requestedWavs.length).toBe(0);

    const playBtn = page.getByRole("button", { name: "Play" });
    const pianoBtn = page.getByRole("button", { name: "Piano" });
    await expect(pianoBtn).toHaveAttribute("aria-pressed", "true");

    // 1. Play Piano C major (wrap click and waitForResponse to avoid race)
    await Promise.all([
      page.waitForResponse((res) => res.url().includes("/audio/piano/") && res.status() === 200),
      playBtn.click(),
    ]);

    expect(requestedWavs.some((u) => u.includes("/audio/piano/"))).toBe(true);
    expect(requestedWavs.some((u) => u.includes("/audio/guitar/"))).toBe(false);

    // 2. Stop playback
    const stopBtn = page.getByRole("button", { name: "Stop" });
    await stopBtn.click();

    // 3. Switch to Guitar
    const guitarBtn = page.getByRole("button", { name: "Guitarra" });
    await guitarBtn.click();
    await expect(guitarBtn).toHaveAttribute("aria-pressed", "true");

    // Click Play to trigger guitar audio loading
    await Promise.all([
      page.waitForResponse((res) => res.url().includes("/audio/guitar/") && res.status() === 200),
      playBtn.click(),
    ]);

    expect(requestedWavs.some((u) => u.includes("/audio/guitar/"))).toBe(true);

    // 4. Verify all audio requests were strictly local (same origin)
    for (const url of requestedWavs) {
      expect(url.startsWith("http://127.0.0.1:5173/audio/")).toBe(true);
    }

    // 5. Verify no console errors or page errors occurred during playback
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test("verifies all 74 piano and guitar samples decode cleanly in Chrome via Web Audio API", async ({ page }) => {
    await page.goto("/");

    const pianoSamples = Array.from(new Set(PIANO_REGIONS.map((r) => r.sample)));
    const guitarSamples = Array.from(new Set(GUITAR_REGIONS.map((r) => r.sample)));

    const failures = await page.evaluate(
      async ({ pianoSamples, guitarSamples }) => {
        const audioCtx = new AudioContext();
        const errs: { sample: string; error: string }[] = [];

        for (const s of pianoSamples) {
          try {
            const res = await fetch(`/audio/piano/${s}`);
            const buf = await res.arrayBuffer();
            await audioCtx.decodeAudioData(buf);
          } catch (err: any) {
            errs.push({ sample: `piano/${s}`, error: err.name + ": " + err.message });
          }
        }

        for (const s of guitarSamples) {
          try {
            const res = await fetch(`/audio/guitar/${s}`);
            const buf = await res.arrayBuffer();
            await audioCtx.decodeAudioData(buf);
          } catch (err: any) {
            errs.push({ sample: `guitar/${s}`, error: err.name + ": " + err.message });
          }
        }

        return errs;
      },
      { pianoSamples, guitarSamples }
    );

    expect(failures).toEqual([]);
  });
});
