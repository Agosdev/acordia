# Integración de Audio Acústico Real — ACORDIA

Documentación técnica de bancos de sonido, fuentes, licencias, mapeo musical y conversiones.

---

## 1. Fuentes Verificadas y Licencias

Ambos bancos de instrumentos acústicos son distribuidos por el proyecto [FreePats](https://freepats.zenvoid.org/) bajo la dedicación de dominio público **Creative Commons CC0 1.0 Universal**.

### Piano: Upright Piano KW (Small Size)
- **Instrumento**: Piano vertical Kawai.
- **Grabación**: Grabado en enero de 2017 por Gonzalo (<humanogonzalo@gmail.com>) y Roberto (<roberto@zenvoid.org>) con grabadora portátil Zoom H1 montada sobre trípode a la altura del ejecutante.
- **Edición y procesamiento**: Roberto, mediante herramientas de software libre.
- **Versión**: 2019-07-03 (SFZ WAV, small size).
- **Página oficial**: [FreePats — Upright Piano KW](https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html#UprightKW)
- **Licencia**: [Creative Commons CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) (Dominio Público).

### Guitarra: Spanish Classical Guitar
- **Instrumento**: Guitarra clásica española.
- **Grabación**: Roberto (<roberto@zenvoid.org>) para el proyecto FreePats en 2008 utilizando micrófono AKG Perception 120.
- **Edición y filtros**: Procesado con software libre; filtros aplicados para reducción de ruido.
- **Versión**: 2019-06-18 (SFZ WAV).
- **Página oficial**: [FreePats — Acoustic Classical Guitar](https://freepats.zenvoid.org/Guitar/acoustic-guitar.html)
- **Licencia**: [Creative Commons CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) (Dominio Público).

---

## 2. Definiciones SFZ e Inspección Musical

### Piano (`UprightPianoKW-small-20190703.sfz`)
- **Regiones**: 26 regiones multi-muestra cubriendo el registro completo del piano (A0 = MIDI 21 hasta C8 = MIDI 108).
- **Envolvente**: `ampeg_release = 0.6s`.
- **Afinación**: Afinación de concierto estándar A440 sin desafinaciones artificiales.
- **Dinámica**: Capa de velocidad `vH` (velocidad alta optimizada).
- **Muestras**: Muestras individuales en formato WAV PCM 16 bits, 44.1 kHz mono.

### Guitarra Clásica (`SpanishClassicalGuitar-20190618.sfz`)
- **Regiones**: 48 regiones multi-muestra cubriendo desde G1 (MIDI 29) hasta C6 (MIDI 84-88).
- **Envolvente**: `ampeg_release = 1.5s`.
- **Modo de bucle**: `no_loop` (desvanecimiento acústico natural).
- **Afinación**: Afinación de concierto estándar A440.
- **Muestras**: Muestras cromáticas individuales en formato WAV PCM 16 bits, 44.1 kHz mono.

---

## 3. Conversión de Nomenclatura para Compatibilidad Web (RFC 3986)

### Causa Técnica
En las definiciones SFZ originales, las muestras con notas alteradas utilizaban el carácter `#` en su nombre de archivo (por ejemplo, `F#1vH.wav`, `C#2.wav`).
En el estándar web de URIs ([RFC 3986](https://www.ietf.org/rfc/rfc3986.txt)) y servidores HTTP (incluyendo el middleware de estáticos de Vite y navegadores como Chrome), el carácter `#` está reservado como **delimitador de fragmento URL** (`hash fragment`). Al solicitar `/audio/piano/F#1vH.wav`, el navegador trunca la ruta en el `#`, enviando una petición de `/audio/piano/F`, lo que provocaba que Vite entregara la página de fallback SPA (`index.html`, MIME `text/html`) y la Web Audio API fallara con `EncodingError: Unable to decode audio data`.

### Solución Implementada
- Se renombraron las muestras sustituyendo el símbolo `#` por `s` (de *sharp*):
  - Piano: 13 archivos (ej. `F#1vH.wav` → `Fs1vH.wav`, `D#4vH.wav` → `Ds4vH.wav`).
  - Guitarra: 16 archivos (ej. `C#2.wav` → `Cs2.wav`, `F#3.wav` → `Fs3.wav`).
- Los 74 archivos conservan 100% su contenido de audio binario intacto (WAV PCM 16-bit 44.1kHz mono sin recompresión destructiva).
- El mapeo en `src/audio/regions.ts` y las pruebas verifican la decodificación exitosa del 100% de las 74 muestras en Google Chrome.

---

## 4. Arquitectura de Reproducción

1. **Reemplazo de Sintetizador por Samples Reales**:
   - Se eliminaron los osciladores sintéticos triangulares de `src/audio/player.ts`.
   - Se utilizan instancias de `AudioBufferSourceNode` conectadas a `GainNode` para cada nota ejecutada.
2. **Carga Perezosa por Instrumento (Lazy Loading)**:
   - Las muestras se cargan bajo demanda únicamente para el instrumento y las notas que se van a reproducir.
   - Se mantiene una caché en memoria de `AudioBuffer` decodificados (`bufferCache`) para que notas recurrentes suenen al instante sin peticiones de red repetidas.
3. **Alturas Reales y Rasgueo en Guitarra**:
   - En guitarra, se interpretan las alturas reales de cada cuerda pulsada según la digitación verificada (`src/music/guitar.ts`: `voicingPitches`).
   - Se aplica rasgueo natural (*strumming*): un desfase temporal hardware-preciso de 32 ms entre cuerda y cuerda mediante el reloj `AudioContext.currentTime`.
4. **Detención Real (`stop`) y Control de Voces**:
   - `stop()` aplica un desvanecimiento suave de 40 ms (`linearRampToValueAtTime`) para evitar chasquidos acústicos (*clicks/pops*) antes de detener los nodos y liberar recursos.
   - Límite de polifonía de 32 voces simultáneas con recolección de voces terminadas en el evento `onended`.
5. **Autonomía Total**:
   - Todas las muestras se sirven desde `public/audio/piano/` y `public/audio/guitar/`.
   - No existe ninguna dependencia con servicios externos o CDNs en producción.
