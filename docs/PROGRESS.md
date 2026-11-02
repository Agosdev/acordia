# ACORDIA Progress

Task 01 scaffold complete. React+Vite+TS, Tonal, basic MVP.

Task 02: 8 unit tests pass, 1 E2E pass, build OK, diff check clean.

Task 03A: piano/guitar SVG visualizers added; build/test pass.

Task 03B: chromatic piano and guitar diagram updated; tests/E2E pass.

Task 03C: essential chord selector and verified voicing catalog expanded; tests/E2E pass.

03C closure: 12 voicings, missing-state UX with Ver en piano and optional related suggestion; 10 unit tests + 1 E2E pass.

Task 04A: Integración completa de audio acústico real (FreePats CC0 1.0).
- Upright Piano KW (26 muestras multi-región) y Spanish Classical Guitar (48 muestras cromáticas).
- Reemplazo de osciladores sintéticos por AudioBufferSourceNode y control de envolvente SFZ.
- Alturas reales para voicings de guitarra y rasgueo natural con retardo programado.
- Carga bajo demanda (lazy-loading) e independiente por instrumento con caché en memoria.
- Detención real (stop suave libre de clicks), control de voces y gestión de errores.
- Normalización web de nombres (# -> s) para compatibilidad RFC 3986 en Vite/HTTP.
- 55 pruebas unitarias y 3 pruebas E2E en Google Chrome pasando al 100%; build de producción verificado.
