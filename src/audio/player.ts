let ctx: AudioContext | null = null;
let nodes: AudioNode[] = [];

export function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function stop() {
  nodes.forEach((n) => { try { (n as any).stop?.(); } catch {} });
  nodes = [];
}

export function playMidi(notes: number[]) {
  stop();
  const c = getContext();
  const gain = c.createGain();
  gain.gain.value = 0.15;
  gain.connect(c.destination);
  nodes.push(gain);
  notes.forEach((m) => {
    const o = c.createOscillator();
    o.type = "triangle";
    o.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
    o.connect(gain);
    o.start();
    o.stop(c.currentTime + 1.2);
    nodes.push(o);
  });
}
