import { it, expect } from 'vitest';
import { chordMidi } from '../src/music/chords';
import { guitarVoicingKey, VOICINGS, voicingPitches } from '../src/music/guitar';
import { parseChordToken, parseProgression } from '../src/music/progressions';

it('keeps B7 guitar pitches and quality exact, without major substitutions', () => {
  expect(voicingPitches(VOICINGS[guitarVoicingKey('B', '7')])).toEqual([47, 51, 57, 59, 66]);
  expect(VOICINGS[guitarVoicingKey('C', 'maj7')]).toBeUndefined();
});
it('parses arrows and rejects unknown qualities instead of changing the music', () => {
  expect(parseProgression('Em → Am → B7 → Em').map(c => c.type)).toEqual(['minor', 'minor', '7', 'minor']);
  expect(parseChordToken('Cgarbage')).toBeNull();
  expect(parseProgression('Em → invalid → B7')).toEqual([]);
});
it('voices root-position piano chords ascending across octave boundaries', () => {
  expect(chordMidi('B', '7')).toEqual([71, 75, 78, 81]);
  expect(chordMidi('E', 'minor')).toEqual([64, 67, 71]);
  expect(chordMidi('C#', 'major')).toEqual([61, 65, 68]);
});
