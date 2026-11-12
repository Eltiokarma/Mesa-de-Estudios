# Brief del revisor a ciegas (rutina verbal-mas, 12 nov 2026)

Eres el revisor de textos de lectura de Mesa de Estudios (app para postulantes a universidades peruanas). Trabajas en `/home/user/Mesa-de-Estudios`. No hagas commit ni push.

## Fase 1: a ciegas

Lee SOLO el archivo de lectura a ciegas que se te indica (`rutinas/verbal-mas/ciego-tandaN.md`). **No abras** `contenido/razonamiento-verbal/textos/`, `ciego-claves.json` ni ningún otro archivo de la rutina hasta que se te pase a la fase 2.

Para cada texto y cada pregunta, resuelve como lo haría un buen postulante:
- cada paso previo: responde con la opción (`A`, `B`, `ambos`, `ninguno`; `lo-dice`, `se-deduce`, `no-se-sabe`, `lo-contradice`; `explicar`, `convencer`, `narrar`; o el número de oración);
- cada pregunta: la letra.

Escribe tus respuestas en `rutinas/verbal-mas/respuestas-tandaN.json` con esta forma:

```json
{ "t134": { "p1": "C", "p2.previo": "A", "p2": "B" } }
```

Y devuelve, además, una lista corta de dudas: cada ítem donde dos opciones te parecieron defendibles, o donde ninguna te convenció, con el porqué en una línea. Sé exigente: una duda fuerte cuenta como fallo.

## Fase 2: con las claves (solo cuando se te pida)

Se te dirán las discrepancias. Entonces abre los JSON de la tanda y, para cada texto:
1. Si fallaste un ítem o tuviste una duda fuerte, **reescríbelo** (enunciado, alternativas o previo) hasta que la clave sea única e indiscutible; no basta justificarlo.
2. Comprueba que ningún distractor sea defendible con el texto, que cada código RV describa el error (`contenido/razonamiento-verbal/frases.json`), que las explicaciones citen bien las oraciones y no nombren letras.
3. Verifica los `hechos`: si un dato es dudoso, ablándalo en el texto o quítalo, y corrige la fuente. Puedes buscar en la web. Anota en `revision.notas` qué confirmaste con fuente y qué de memoria.
4. Que nada se parezca a un texto de academia o de examen.
5. Si cambiaste una pregunta, deja `version` en 1 (los textos son nuevos).
6. Llena `revision`: `{ "por": "subagente (revisor a ciegas, rutina verbal-mas)", "fecha": "2026-11-12", "veredicto": "aprobado", "notas": "…" }`, con el resultado a ciegas (cuántas coincidieron) y los cambios.

Al final corre `node --test contenido/razonamiento-verbal/banco.test.js` y `node --test herramientas/alternativas.test.js`, arregla lo que sea de tus textos, y devuelve un resumen corto de los cambios.
