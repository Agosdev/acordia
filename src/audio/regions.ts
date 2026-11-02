export interface SampleRegion {
  lokey: number;
  hikey: number;
  pitchKeycenter: number;
  sample: string;
}

export type Instrument = "piano" | "guitar";

export const PIANO_RELEASE = 0.6;
export const GUITAR_RELEASE = 1.5;

export const PIANO_REGIONS: readonly SampleRegion[] = [
  { lokey: 21, hikey: 26, pitchKeycenter: 24, sample: "C1vH.wav" },
  { lokey: 27, hikey: 32, pitchKeycenter: 30, sample: "Fs1vH.wav" },
  { lokey: 33, hikey: 36, pitchKeycenter: 35, sample: "B1vH.wav" },
  { lokey: 37, hikey: 40, pitchKeycenter: 39, sample: "Ds2vH.wav" },
  { lokey: 41, hikey: 44, pitchKeycenter: 42, sample: "Fs2vH.wav" },
  { lokey: 45, hikey: 48, pitchKeycenter: 47, sample: "B2vH.wav" },
  { lokey: 49, hikey: 52, pitchKeycenter: 51, sample: "Ds3vH.wav" },
  { lokey: 53, hikey: 55, pitchKeycenter: 54, sample: "Fs3vH.wav" },
  { lokey: 56, hikey: 58, pitchKeycenter: 57, sample: "A3vH.wav" },
  { lokey: 59, hikey: 61, pitchKeycenter: 60, sample: "C4vH.wav" },
  { lokey: 62, hikey: 64, pitchKeycenter: 63, sample: "Ds4vH.wav" },
  { lokey: 65, hikey: 67, pitchKeycenter: 66, sample: "Fs4vH.wav" },
  { lokey: 68, hikey: 70, pitchKeycenter: 69, sample: "A4vH.wav" },
  { lokey: 71, hikey: 73, pitchKeycenter: 72, sample: "C5vH.wav" },
  { lokey: 74, hikey: 76, pitchKeycenter: 75, sample: "Ds5vH.wav" },
  { lokey: 77, hikey: 79, pitchKeycenter: 78, sample: "Fs5vH.wav" },
  { lokey: 80, hikey: 82, pitchKeycenter: 81, sample: "A5vH.wav" },
  { lokey: 83, hikey: 85, pitchKeycenter: 84, sample: "C6vH.wav" },
  { lokey: 86, hikey: 88, pitchKeycenter: 87, sample: "Ds6vH.wav" },
  { lokey: 89, hikey: 91, pitchKeycenter: 90, sample: "Fs6vH.wav" },
  { lokey: 92, hikey: 94, pitchKeycenter: 93, sample: "A6vH.wav" },
  { lokey: 95, hikey: 97, pitchKeycenter: 96, sample: "C7vH.wav" },
  { lokey: 98, hikey: 100, pitchKeycenter: 99, sample: "Ds7vH.wav" },
  { lokey: 101, hikey: 103, pitchKeycenter: 102, sample: "Fs7vH.wav" },
  { lokey: 104, hikey: 105, pitchKeycenter: 105, sample: "A7vH.wav" },
  { lokey: 106, hikey: 108, pitchKeycenter: 107, sample: "B7vH.wav" }
] as const;

export const GUITAR_REGIONS: readonly SampleRegion[] = [
  { lokey: 29, hikey: 31, pitchKeycenter: 31, sample: "G1.wav" },
  { lokey: 32, hikey: 32, pitchKeycenter: 32, sample: "Gs1.wav" },
  { lokey: 33, hikey: 33, pitchKeycenter: 33, sample: "A1.wav" },
  { lokey: 34, hikey: 34, pitchKeycenter: 34, sample: "As1.wav" },
  { lokey: 35, hikey: 35, pitchKeycenter: 35, sample: "B1.wav" },
  { lokey: 36, hikey: 36, pitchKeycenter: 36, sample: "C2.wav" },
  { lokey: 37, hikey: 37, pitchKeycenter: 37, sample: "Cs2.wav" },
  { lokey: 38, hikey: 38, pitchKeycenter: 38, sample: "D2.wav" },
  { lokey: 39, hikey: 39, pitchKeycenter: 39, sample: "Ds2.wav" },
  { lokey: 40, hikey: 40, pitchKeycenter: 40, sample: "E2.wav" },
  { lokey: 41, hikey: 41, pitchKeycenter: 41, sample: "F2.wav" },
  { lokey: 42, hikey: 43, pitchKeycenter: 43, sample: "G2.wav" },
  { lokey: 44, hikey: 45, pitchKeycenter: 45, sample: "A2.wav" },
  { lokey: 46, hikey: 47, pitchKeycenter: 47, sample: "B2.wav" },
  { lokey: 48, hikey: 48, pitchKeycenter: 48, sample: "C3.wav" },
  { lokey: 49, hikey: 50, pitchKeycenter: 50, sample: "D3.wav" },
  { lokey: 51, hikey: 52, pitchKeycenter: 52, sample: "E3.wav" },
  { lokey: 53, hikey: 53, pitchKeycenter: 53, sample: "F3.wav" },
  { lokey: 54, hikey: 54, pitchKeycenter: 54, sample: "Fs3.wav" },
  { lokey: 55, hikey: 55, pitchKeycenter: 55, sample: "G3.wav" },
  { lokey: 56, hikey: 56, pitchKeycenter: 56, sample: "Gs3.wav" },
  { lokey: 57, hikey: 57, pitchKeycenter: 57, sample: "A3.wav" },
  { lokey: 58, hikey: 58, pitchKeycenter: 58, sample: "As3.wav" },
  { lokey: 59, hikey: 59, pitchKeycenter: 59, sample: "B3.wav" },
  { lokey: 60, hikey: 60, pitchKeycenter: 60, sample: "C4.wav" },
  { lokey: 61, hikey: 61, pitchKeycenter: 61, sample: "Cs4.wav" },
  { lokey: 62, hikey: 62, pitchKeycenter: 62, sample: "D4.wav" },
  { lokey: 63, hikey: 63, pitchKeycenter: 63, sample: "Ds4.wav" },
  { lokey: 64, hikey: 64, pitchKeycenter: 64, sample: "E4.wav" },
  { lokey: 65, hikey: 65, pitchKeycenter: 65, sample: "F4.wav" },
  { lokey: 66, hikey: 66, pitchKeycenter: 66, sample: "Fs4.wav" },
  { lokey: 67, hikey: 67, pitchKeycenter: 67, sample: "G4.wav" },
  { lokey: 68, hikey: 69, pitchKeycenter: 69, sample: "A4.wav" },
  { lokey: 70, hikey: 70, pitchKeycenter: 70, sample: "As4.wav" },
  { lokey: 71, hikey: 71, pitchKeycenter: 71, sample: "B4.wav" },
  { lokey: 72, hikey: 72, pitchKeycenter: 72, sample: "C5.wav" },
  { lokey: 73, hikey: 73, pitchKeycenter: 73, sample: "Cs5.wav" },
  { lokey: 74, hikey: 74, pitchKeycenter: 74, sample: "D5.wav" },
  { lokey: 75, hikey: 75, pitchKeycenter: 75, sample: "Ds5.wav" },
  { lokey: 76, hikey: 76, pitchKeycenter: 76, sample: "E5.wav" },
  { lokey: 77, hikey: 77, pitchKeycenter: 77, sample: "F5.wav" },
  { lokey: 78, hikey: 78, pitchKeycenter: 78, sample: "Fs5.wav" },
  { lokey: 79, hikey: 79, pitchKeycenter: 79, sample: "G5.wav" },
  { lokey: 80, hikey: 80, pitchKeycenter: 80, sample: "Gs5.wav" },
  { lokey: 81, hikey: 81, pitchKeycenter: 81, sample: "A5.wav" },
  { lokey: 82, hikey: 82, pitchKeycenter: 82, sample: "As5.wav" },
  { lokey: 83, hikey: 83, pitchKeycenter: 83, sample: "B5.wav" },
  { lokey: 84, hikey: 88, pitchKeycenter: 84, sample: "C6.wav" }
] as const;
