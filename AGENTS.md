# AGENTS.md

Contexto para futuros agentes trabajando en este repo.

## Proyecto

Mini app web/PWA para practicar fracciones como laboratorio base de matematicas, pensada para Mathias Garcia.

Nombre publico actual: `Mathias Garcia | Fracciones`.

Objetivo: que un nino practique de forma visual, simple y rapida actividades de fracciones como comparar, multiplicar y dividir.

## Stack

- HTML, CSS y JavaScript vanilla.
- Servidor local Node.js sin dependencias.
- PWA ligera con `manifest.webmanifest` y `service-worker.js`.
- Despliegue estatico con GitHub Pages mediante GitHub Actions.

## Comandos

```bash
npm start
```

Abre `http://localhost:3000`.

No hay build ni test suite configurados.

## Archivos clave

- `index.html` - estructura de la app, controles, marcador y registro del service worker.
- `app.js` - logica del laboratorio: actividades, generacion de retos, comparacion, multiplicacion, division, feedback, simplificacion, logros y pizzas SVG.
- `styles.css` - estilos responsive y visual de tarjetas/pizzas.
- `server.js` - servidor estatico Node.js.
- `manifest.webmanifest` - configuracion instalable de la PWA.
- `service-worker.js` - cache offline de assets principales.
- `.github/workflows/deploy-pages.yml` - despliegue automatico a GitHub Pages.
- `icons/` - iconos SVG de la PWA.

## Funcionalidad actual

- Actividad de comparacion.
- Actividad de multiplicacion.
- Actividad de division.
- Actividad de suma.
- Actividad de resta.
- Modos de comparacion: mixto, mismo denominador, mismo numerador y multiplicacion en cruz.
- Tecnicas especificas en multiplicacion y division, con niveles guiado, practica y desafio.
- Tecnicas guiadas de suma y resta con mismo denominador, distinto denominador e igualacion de denominadores.
- Pistas y explicacion inmediata.
- Marcador de aciertos y racha.
- Logros y progresion guiada.
- Progresion de largo recorrido: XP, 8 rangos y 10 trofeos con 4 grados (bronce/plata/oro/diamante).
- Progreso persistente en `localStorage` (clave `mgFracciones.v1`): aciertos, racha, mejor racha, medallas y estadisticas por actividad.
- Auto-actualizacion del sitio desplegado mediante `version.txt` generado en CI.
- Visualizacion tipo pizza para representar fracciones.

## Decisiones importantes

- Mantener la app simple, sin framework y sin dependencias.
- Mantener una experiencia clara para un nino: dos opciones grandes, feedback inmediato y explicaciones cortas.
- Tras responder, la pregunta queda fija; se avanza solo con el boton `Nueva pregunta`.
- La identidad publica preferida es `Mathias Garcia | Fracciones`, con tono medianamente serio y compartible.
- La version mobile separada se creo en otro directorio: `/Users/luis.quiroga/Documents/lg/training/mb_math`.

## Notas de mantenimiento

- Si cambian assets cacheados, actualizar `CACHE_NAME` en `service-worker.js` para evitar cache viejo.
- Las medallas se guardan por `id` estable (mapa `ACHIEVEMENTS` en `app.js`), no por su texto visible. Cambiar el texto no debe borrar progreso; cambiar el `id` si.
- La curva de XP (`XP_BASE_NEED=40`, `XP_GROWTH=1.08`) esta validada por simulacion. Si se toca, volver a simular: con base pequena el redondeo a multiplos de 5 la degenera en lineal y los rangos se agotan.
- Las medallas son CSS puro (cinta + disco + estrellas), tematizadas por la clase `t0..t4` y variables `--light/--dark/--glow/--ribbon`. Para revisar el diseno sin jugar, generar un `preview-medallas.html` temporal que extraiga el CSS real y `buildTrophyMarkup`, y borrarlo antes del commit.
- Al editar CSS por programa, validar balance de llaves y ausencia de caracteres no-ASCII antes de dar por bueno el cambio.
- El stat `Nivel` del marcador es `progressionStep` (Guiado/Practica/Desafio); el nivel de XP se muestra como `Rango`. No mezclarlos.
- El service worker es network-first para el shell (`.html/.css/.js`) y cache-first para iconos/manifest.
- Evitar introducir tooling pesado si no es necesario.
- Si se agregan ejercicios, mantener explicaciones en espanol claro y orientadas a aprendizaje visual.
- La estructura actual ya actua como laboratorio base, asi que las futuras ampliaciones deberian entrar como nuevas actividades o niveles, no como parches aislados.
