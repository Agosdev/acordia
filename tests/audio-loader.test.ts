import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  loadAudioBuffer,
  loadSampleForMidi,
  clearAudioCache,
  isSampleCached,
  getCachedSampleCount,
} from "../src/audio/loader";

function createMockAudioContext() {
  return {
    decodeAudioData: vi.fn().mockImplementation(async (buffer: ArrayBuffer) => {
      return {
        duration: 2.5,
        length: 110250,
        numberOfChannels: 1,
        sampleRate: 44100,
      } as unknown as AudioBuffer;
    }),
  } as unknown as AudioContext;
}

describe("audio loader", () => {
  let mockCtx: AudioContext;

  beforeEach(() => {
    clearAudioCache();
    vi.restoreAllMocks();
    mockCtx = createMockAudioContext();
  });

  it("fetches, decodes, and caches audio buffer", async () => {
    const fakeArrayBuffer = new ArrayBuffer(1024);
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: async () => fakeArrayBuffer,
    });

    const url = "/audio/piano/C4vH.wav";
    expect(isSampleCached(url)).toBe(false);

    const buffer = await loadAudioBuffer(url, mockCtx);
    expect(buffer).toBeDefined();
    expect(isSampleCached(url)).toBe(true);
    expect(getCachedSampleCount()).toBe(1);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // Second call should return from cache without re-fetching
    const buffer2 = await loadAudioBuffer(url, mockCtx);
    expect(buffer2).toBe(buffer);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("loads only the required sample for a given MIDI note (lazy loading)", async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => new ArrayBuffer(512),
    }));

    // Piano C4 (MIDI 60) -> C4vH.wav
    const result = await loadSampleForMidi(60, "piano", mockCtx);
    expect(result.region.sample).toBe("C4vH.wav");
    expect(result.playbackRate).toBe(1);
    expect(globalThis.fetch).toHaveBeenCalledWith("/audio/piano/C4vH.wav");
    // Verify NO guitar samples were requested
    const calledUrls = vi.mocked(globalThis.fetch).mock.calls.map((call) => call[0]);
    expect(calledUrls.some((u) => String(u).includes("guitar"))).toBe(false);
  });

  it("deduplicates concurrent requests for the same sample URL", async () => {
    let fetchCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount++;
      await new Promise((r) => setTimeout(r, 10));
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () => new ArrayBuffer(256),
      };
    });

    const [b1, b2] = await Promise.all([
      loadAudioBuffer("/audio/piano/A4vH.wav", mockCtx),
      loadAudioBuffer("/audio/piano/A4vH.wav", mockCtx),
    ]);

    expect(b1).toBe(b2);
    expect(fetchCount).toBe(1);
  });

  it("throws explicit error when fetch returns HTTP error (e.g. 404)", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(loadAudioBuffer("/audio/piano/missing.wav", mockCtx)).rejects.toThrow(
      /Error HTTP 404 al cargar muestra/
    );
    expect(isSampleCached("/audio/piano/missing.wav")).toBe(false);
  });

  it("propagates error when decodeAudioData fails on corrupt audio", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: async () => new ArrayBuffer(64),
    });

    const badCtx = {
      decodeAudioData: vi.fn().mockRejectedValue(new Error("Unable to decode audio data")),
    } as unknown as AudioContext;

    await expect(loadAudioBuffer("/audio/piano/corrupt.wav", badCtx)).rejects.toThrow(
      "Unable to decode audio data"
    );
  });
});
