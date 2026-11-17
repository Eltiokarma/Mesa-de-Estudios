# Cómo se rehace una unidad (método del 16–17 nov 2026)

Así se hicieron «Magnitudes y unidades» y «Vectores», las dos primeras unidades que pasaron el contrato completo
(`docs/plan-calidad.md` §3), el lector en frío y una auditoría. Este método repite ese recorrido para cualquier unidad
de cualquier curso. Las reglas de contenido están en `docs/molde-unidad.md` (léelo antes). Aquí está **el orden de
trabajo, quién hace cada paso y qué entrega**, y en esta carpeta, el encargo listo para copiar de cada paso.

Reemplaza en los encargos: `<UNIDAD>` (p. ej. `trigonometria.razones-trigonometricas-agudas`), `<ARCHIVO>`
(`contenido/teoria/<curso>/<unidad>.js`), `<CURSO>`, `<IDEAS>` (ids de las ideas) y `<SCRATCH>` (carpeta temporal de
la sesión para capturas y scripts).

## Las fases

| # | Fase | Quién | En paralelo | Entrega | Encargo |
| --- | --- | --- | --- | --- | --- |
| 0 | Preparar | la sesión | — | lectura de la unidad actual, temario, plantillas y huecos | (abajo) |
| 1 | Propuesta de ideas | la sesión → **Gerson aprueba** | no | ideas en orden con su frase, tabla de letras, mapa de colores | `1-ideas.md` §A |
| 2 | Primera idea completa | la sesión | no | una idea con todos sus momentos → **Gerson aprueba** antes de seguir | `1-ideas.md` §B |
| 3 | Resto de las ideas | la sesión o un agente por idea | sí, si las ideas no comparten archivo | ideas completas, glosario, piezas SVG | `1-ideas.md` §B |
| 4 | Ejemplos resueltos | un agente por unidad (o por dos ideas) | sí | 15 por idea, con piezas de objetos | `2-ejemplos.md` |
| 5 | Práctica | un agente | sí | generadores por idea, casos, papel | `3-practica.md` |
| 6 | Lector en frío | agentes nuevos, sin código | sí (momentos y ejemplos) | `rutinas/frio/<UNIDAD>.md` | `4-lector-frio.md` |
| 7 | Auditor del contrato | un agente con código | sí (uno por unidad) | `rutinas/auditoria/<UNIDAD>.md` | `5-auditor.md` |
| 8 | Correcciones | un agente por unidad | sí | sección «Correcciones» en el informe del auditor | `6-correcciones.md` |
| 9 | Colores | la sesión con el skill `teoria-del-color` | — | pares medidos con `herramientas/auditar-colores.py` | molde §5b |
| 10 | Entrega | la sesión | — | `npm test`, catálogo, `VERSION`, commits, `main`, Vercel, galería a Gerson | molde §9 |

Reglas de la orquestación (aprendidas en estas dos unidades):
- **Nada se escribe en paralelo sobre el mismo archivo.** Cada agente tiene su alcance de archivos; quien integra corre
  `npm run catalogo` y `npm test` al final.
- **Los agentes no hacen commits.** La sesión revisa, corre todo y hace un commit por cambio.
- **El lector en frío nunca es quien escribió la unidad**, y uno que ya vio la pantalla no vuelve a servir.
- **Gerson decide** las ideas, la primera idea y lo que los informes marcan como «decisión de Gerson». La sesión no
  inventa datos del mundo: los busca con fuente o los presenta como aproximados.
- Antes de cada encargo de dibujo, se cargan los skills `arte-generativo-svg` y `arte-vectorial`; para colores,
  `teoria-del-color`; para pantallas, `diseno-y-animacion` y `multimedia-learning`.

## Fase 0: preparar (la sesión)

1. `npm test` en verde y servidor local (`node herramientas/servidor.js`).
2. Leer `<ARCHIVO>` si existe, la entrada de la unidad en `catalogo/cursos/<CURSO>.json`, sus plantillas
   (`plantillas/*/plantilla.json` con `<UNIDAD>` en `unidades`) y `docs/investigacion/` del tema (errores típicos).
3. Capturas del estado actual: `node herramientas/capturas-teoria.js <UNIDAD> <SCRATCH>/antes --oscuro`.
4. Anotar qué falta contra la lista de verificación de `docs/molde-unidad.md` §10.

## Herramientas

| Para qué | Comando |
| --- | --- |
| Capturas de momentos, ejemplos, glosario y laboratorio | `node herramientas/capturas-teoria.js <UNIDAD> <carpeta> [partes] [--oscuro] [--ancha] [--lector]` |
| Selección para el lector en frío de ejemplos (n.º 3, 8 y 14 por idea) | la misma con `--lector` → `<carpeta>/lector/` |
| Auditoría de colores (contraste y daltonismo) | `python3 herramientas/auditar-colores.py` (funciones `contraste`, `dist`, `simular`) |
| Papel de los generadores | `node herramientas/papel-generador.js` y `--revisar` |
| Validador de la teoría | `node --test contenido/teoria/teoria.test.js` |
