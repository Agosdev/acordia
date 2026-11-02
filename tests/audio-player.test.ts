import { describe, it, expect, vi, beforeEach } from "vitest";
import { playMidi, stop, setContext, getActiveVoices } from "../src/audio/player";
import { clearAudioCache } from "../src/audio/loader";

interface MockSourceNode {
  buffer: AudioBuffer | null;
  playbackRate: { value: number };
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  onended: (() => void) | null;
}

interface MockGainNode {
  gain: {
    value: number;
    setValueAtTime: ReturnType<typeof vi.fn>;
    linearRampToValueAtTime: ReturnType<typeof vi.fn>;
    exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
    cancelScheduledValues: ReturnType<typeof vi.fn>;
  };
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

function createMockAudioContext() {
  const sources: MockSourceNode[] = [];
  const gains: MockGainNode[] = [];

  const ctx = {
    currentTime: 10.0,
    state: "running",
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    decodeAudioData: vi.fn().mockImplementation(async () => ({
      duration: 3.0,
      length: 132300,
      numberOfChannels: 1,
      sampleRate: 44100,
    })),
    createBufferSource: vi.fn().mockImplementation(() => {
      const src: MockSourceNode = {
        buffer: null,
        playbackRate: { value: 1.0 },
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        onended: null,
      };
      sources.push(src);
      return src;
    }),
    createGain: vi.fn().mockImplementation(() => {
      const g: MockGainNode = {
        gain: {
          value: 1.0,
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
          cancelScheduledValues: vi.fn(),
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
      };
      gains.push(g);
      return g;
    }),
    _sources: sources,
    _gains: gains,
  };

  return ctx as unknown as AudioContext & { _sources: MockSourceNode[]; _gains: MockGainNode[] };
}

describe("audio player", () => {
  let mockCtx: ReturnType<typeof createMockAudioContext>;

  beforeEach(() => {
    clearAudioCache();
    vi.restoreAllMocks();
    mockCtx = createMockAudioContext();
    setContext(mockCtx);

    // Mock fetch for samples
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: async () => new ArrayBuffer(512),
    });
  });

  it("plays piano chord with AudioBufferSourceNode without strum delay", async () => {
    // C4, E4, G4 (MIDI 60, 64, 67)
    await playMidi([60, 64, 67], "piano");

    expect(mockCtx.createBufferSource).toHaveBeenCalledTimes(3);
    expect(mockCtx.createGain).toHaveBeenCalledTimes(3);
    expect(getActiveVoices().length).toBe(3);

    // All sources start at exactly ctx.currentTime (no strum delay on piano)
    for (const src of mockCtx._sources) {
      expect(src.start).toHaveBeenCalledWith(10.0);
    }
  });

  it("plays guitar chord with natural strumming (scheduled delay between strings)", async () => {
    // C major voicing pitches: C3(48), E3(52), G3(55), C4(60), E4(64)
    const pitches = [48, 52, 55, 60, 64];
    await playMidi(pitches, "guitar", { strum: true, strumDelay: 0.03 });

    expect(mockCtx.createBufferSource).toHaveBeenCalledTimes(5);
    expect(getActiveVoices().length).toBe(5);

    // Strum delay: 0.03s per string
    mockCtx._sources.forEach((src, index) => {
      const expectedTime = 10.0 + index * 0.03;
      expect(src.start).toHaveBeenCalledWith(expectedTime);
    });
  });

  it("stops all active voices smoothly on stop()", async () => {
    await playMidi([60, 64, 67], "piano");
    expect(getActiveVoices().length).toBe(3);

    stop();

    // Active voices array should now be cleared
    expect(getActiveVoices().length).toBe(0);

    // Each gain was ramped down to prevent clicks, and each source stopped
    for (const g of mockCtx._gains) {
      expect(g.gain.cancelScheduledValues).toHaveBeenCalledWith(10.0);
      expect(g.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.0001, 10.0 + 0.04);
    }
    for (const src of mockCtx._sources) {
      expect(src.stop).toHaveBeenCalledWith(10.0 + 0.04);
    }
  });

  it("automatically cleans up nodes when source.onended fires", async () => {
    await playMidi([60], "piano");
    expect(getActiveVoices().length).toBe(1);

    const src = mockCtx._sources[0];
    const gain = mockCtx._gains[0];
    expect(src.onended).toBeDefined();

    // Trigger onended callback
    src.onended!();

    expect(src.disconnect).toHaveBeenCalled();
    expect(gain.disconnect).toHaveBeenCalled();
    expect(getActiveVoices().length).toBe(0);
  });

  it("handles errors during sample loading by cleaning up and rethrowing", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(playMidi([60, 64], "piano")).rejects.toThrow();
    expect(getActiveVoices().length).toBe(0);
  });
});
