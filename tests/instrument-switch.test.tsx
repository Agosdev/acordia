import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import App from "../src/App";
import * as player from "../src/audio/player";
import { clearAudioCache } from "../src/audio/loader";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../src/audio/player", async () => {
  const actual = await vi.importActual<typeof player>("../src/audio/player");
  return {
    ...actual,
    playMidi: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn(),
  };
});

describe("instrument switching & UI audio interaction", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    clearAudioCache();
    localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  const renderApp = async () => {
    await act(async () => {
      root.render(<App />);
    });
  };

  it("renders with Piano selected by default and plays piano notes on Play", async () => {
    await renderApp();

    const buttons = Array.from(container.querySelectorAll("button"));
    const pianoBtn = buttons.find((b) => b.textContent === "Piano");
    const guitarBtn = buttons.find((b) => b.textContent === "Guitarra");
    const playBtn = buttons.find((b) => b.textContent === "Play");

    expect(pianoBtn?.getAttribute("aria-pressed")).toBe("true");
    expect(guitarBtn?.getAttribute("aria-pressed")).toBe("false");

    await act(async () => {
      playBtn?.click();
    });

    expect(player.playMidi).toHaveBeenCalledWith(
      [60, 64, 67], // C4, E4, G4
      "piano"
    );
  });

  it("switches to Guitar, calls stop(), and plays guitar voicing pitches on Play", async () => {
    await renderApp();

    const buttons = Array.from(container.querySelectorAll("button"));
    const guitarBtn = buttons.find((b) => b.textContent === "Guitarra");
    const playBtn = buttons.find((b) => b.textContent === "Play");

    await act(async () => {
      guitarBtn?.click();
    });

    // Switching instrument must call stop()
    expect(player.stop).toHaveBeenCalled();
    expect(guitarBtn?.getAttribute("aria-pressed")).toBe("true");

    await act(async () => {
      playBtn?.click();
    });

    expect(player.playMidi).toHaveBeenCalledWith(
      [48, 52, 55, 60, 64], // C3, E3, G3, C4, E4
      "guitar",
      expect.objectContaining({ strum: true, strumDelay: 0.032 })
    );
  });

  it("stops playback when Stop button is clicked", async () => {
    await renderApp();

    const buttons = Array.from(container.querySelectorAll("button"));
    const stopBtn = buttons.find((b) => b.textContent === "Stop");

    await act(async () => {
      stopBtn?.click();
    });

    expect(player.stop).toHaveBeenCalled();
  });

  it("displays inline accessible alert if audio playback encounters an error", async () => {
    vi.mocked(player.playMidi).mockRejectedValueOnce(
      new Error("Error HTTP 404 al cargar muestra")
    );

    await renderApp();

    const buttons = Array.from(container.querySelectorAll("button"));
    const playBtn = buttons.find((b) => b.textContent === "Play");

    await act(async () => {
      playBtn?.click();
    });

    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain("Error HTTP 404 al cargar muestra");
  });
});
