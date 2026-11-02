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

## Recuperación y cierre 04B por Codex — 2026-11-02

### Recuperado de Antigravity
- Se conservaron los cambios sin commit en App.tsx, PianoKeyboard, GuitarDiagram,
  index.css, tokens.css y notation.ts. App.css no tenía cambios pendientes.
- Se recuperaron los módulos nuevos piano.ts/progressions.ts y sus tres archivos
  de tests. Se mantuvieron glassmorphism, controles, guía y presets existentes.
- El commit 44e4e98 está disponible y es antecesor de HEAD. Los bancos, licencias,
  loader y reproductor de 04A permanecen sin cambios.

### Completado por Codex
- B7 usa su voicing y digitación reales x21202 (dedos x21304), también en audio.
  Las calidades sin voicing ya no se sustituyen silenciosamente por mayor.
- Entrada Em → Am → B7 → Em, navegación y selección del acorde actual verificadas.
  Editar reinicia el índice; entrada inválida muestra aviso y no reproduce otro acorde.
  Sufijos desconocidos se rechazan; M/M7 conservan su significado mayor.
- Piano: posición fundamental ascendente, enarmonías correctas, una sola posición
  de dedos y mismas alturas que playback. Rango ampliable para extensiones.
  Digitación presentada como sugerencia de mano derecha, dependiente de comodidad,
  mano y tonalidad; no se afirma que sea universal.
- Preferencias de notación e idioma persistentes; afinación de guitarra localizada.
- Centrado y ausencia de desborde horizontal comprobados a 390 y 1280 px;
  capturas en test-results/acordia-*.png. Ajustes mínimos de límites de controles
  móviles y fondo de documento; sin rediseño del glassmorphism.

### Validación y fallos encontrados
- npm test: los 70 tests recuperados pasaron con Node 22; regresiones nuevas
  de teoría/voicings/parser elevan la suite a 73 pruebas.
- npm run build: aprobado.
- npm run test:e2e: 4 pruebas aprobadas en Chrome instalado, incluyendo 74 WAV
  FreePats decodificados, carga bajo demanda piano/guitarra y progresiones B7.
- Fallos intermedios: Node antiguo sin util.styleText; servidor bloqueado por
  sandbox (EPERM); selector sin nombre accesible explícito en el test nuevo.
  Resueltos con Node 22 existente, permiso para servidor/Chrome y aria-label.
  No se actualizaron dependencias ni se relajaron expectativas musicales.
- git diff --check: aprobado.

### Pendientes y continuación
- Falta revisión visual y escucha subjetiva de la usuaria. Validar musicalmente
  los WAV no reemplaza esa escucha. Sin otros bloqueos funcionales conocidos.
- No se hizo commit ni push y no se tocó Ritmia.
- Si se interrumpe otra vez: leer este documento, git status y git diff antes de
  editar. Conservar archivos nuevos sin seguimiento y el diseño actual.
- Usar PATH=/Users/agostina/.nvm/versions/node/v22.23.4/bin:$PATH antes de npm test,
  npm run build y npm run test:e2e; luego git diff --check. Playwright ya usa
  channel: chrome; no descargar navegadores ni actualizar dependencias.

## Ajuste final UX y glassmorphism — 2026-11-02
- Se eliminó el subtítulo del encabezado y toda referencia a canciones en presets;
  Rock, Blues, Pop, Balada y cadencia andaluza mantienen sus acordes originales.
- Preferencias con labels Notación / Idioma y opciones de idioma Español / Inglés.
- El mismo botón y estado de modo guía controla piano y guitarra; en guitarra
  oculta números, colores de dedos y leyenda, conservando las posiciones del acorde.
- Fondo local public/images/glass-bg.webp con blur, difusión y overlay nocturno;
  paneles translúcidos, reflejos discretos, controles coherentes, foco visible y
  fallback opaco sin backdrop-filter. Sin librerías ni cambios musicales o de audio.
- Responsive: preferencias en columnas compactas en móvil y límites de ancho;
  visualizadores siguen centrados. E2E ampliado para guía compartida y textos.
- Sin commit ni push; queda pendiente aprobación visual de la usuaria.
- Validación final del ajuste: build aprobado, 73 tests unitarios y 4 E2E
  aprobados en Chrome; 74 muestras acústicas decodificadas. Capturas móvil/escritorio
  revisadas en test-results/acordia-*.png. git diff --check limpio.
