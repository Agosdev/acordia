export const PIANO_FINGER_NAMES: Record<number, { es: string; en: string }> = {
  1: { es: "1 pulgar", en: "1 thumb" },
  2: { es: "2 índice", en: "2 index" },
  3: { es: "3 medio", en: "3 middle" },
  4: { es: "4 anular", en: "4 ring" },
  5: { es: "5 meñique", en: "5 pinky" },
};

/**
 * Retorna la sugerencia pedagógica para mano derecha (M.D.)
 * en posición fundamental para acordes esenciales.
 * La comodidad depende de la mano y la tonalidad; no es una regla universal.
 */
export function getPianoFingering(type: string, notesCount: number): number[] | null {
  // Tríadas estándar en posición fundamental (mayor, menor, dim, aug)
  if (["major", "minor", "dim", "aug"].includes(type) && notesCount === 3) {
    return [1, 3, 5]; // Pulgar, Medio, Meñique
  }

  // Cuatreadas de séptima en posición fundamental
  if (["7", "maj7", "m7"].includes(type) && notesCount === 4) {
    return [1, 2, 3, 5]; // Pulgar, Índice, Medio, Meñique
  }

  // Suspendidos estándar
  if (type === "sus4" && notesCount === 3) {
    return [1, 4, 5];
  }
  if (type === "sus2" && notesCount === 3) {
    return [1, 2, 5];
  }

  // Acorde de quinta (power chord)
  if (type === "5" && notesCount === 2) {
    return [1, 5];
  }

  // Para acordes complejos o extendidos sin estándar cerrado, no inventar
  return null;
}
