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
- Modos de comparacion: mixto, mismo denominador, mismo numerador y multiplicacion en cruz.
- Tecnicas especificas en multiplicacion y division, con niveles guiado, practica y desafio.
- Pistas y explicacion inmediata.
- Marcador de aciertos y racha.
- Logros y progresion guiada.
- Visualizacion tipo pizza para representar fracciones.

## Decisiones importantes

- Mantener la app simple, sin framework y sin dependencias.
- Mantener una experiencia clara para un nino: dos opciones grandes, feedback inmediato y explicaciones cortas.
- Tras responder, la pregunta queda fija; se avanza solo con el boton `Nueva pregunta`.
- La identidad publica preferida es `Mathias Garcia | Fracciones`, con tono medianamente serio y compartible.
- La version mobile separada se creo en otro directorio: `/Users/luis.quiroga/Documents/lg/training/mb_math`.

## Notas de mantenimiento

- Si cambian assets cacheados, actualizar `CACHE_NAME` en `service-worker.js` para evitar cache viejo.
- Evitar introducir tooling pesado si no es necesario.
- Si se agregan ejercicios, mantener explicaciones en espanol claro y orientadas a aprendizaje visual.
- La estructura actual ya actua como laboratorio base, asi que las futuras ampliaciones deberian entrar como nuevas actividades o niveles, no como parches aislados.
