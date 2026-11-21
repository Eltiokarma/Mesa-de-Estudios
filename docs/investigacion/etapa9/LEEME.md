# Investigación para la Etapa 9 (ChatGPT, 21 nov 2026)

Propuestas de teoría que Gerson encargó a ChatGPT con el encargo de investigación (una conversación por unidad). Son
**insumo por verificar**, no decisiones: ChatGPT no vio el repo ni lo publicado en la app.

| Unidad | Archivo |
| --- | --- |
| Álgebra · Binomio de Newton | `algebra.binomio-de-newton.md` |
| Aritmética · Potenciación y radicación | `aritmetica.potenciacion-y-radicacion.md` |
| Física · Impulso, cantidad de movimiento y choques | `fisica.impulso-y-choques.md` |
| Geometría · Puntos notables del triángulo | `geometria.puntos-notables.md` |
| Química · Reacciones químicas y balance | `quimica.reacciones-y-balance.md` |
| Razonamiento matemático · Arreglos numéricos y cuadrados mágicos | `razonamiento-matematico.arreglos-numericos.md` |
| Razonamiento verbal · Cohesión y coherencia textual | `razonamiento-verbal.cohesion-y-coherencia.md` |
| Trigonometría · Reducción al primer cuadrante | `trigonometria.reduccion-al-primer-cuadrante.md` |

Están las ocho unidades de la etapa.

Cada archivo trae las mismas secciones: resumen, qué se pregunta en los exámenes, errores típicos (con su estado:
documentado, de segunda mano o hipótesis), lo que se da por sabido, las ideas con sus siete momentos, tabla de letras,
otras formas de explicarla, datos del mundo, dudas y decisiones, y fuentes. Pesan entre 70 y 85 KB: se lee la sección que
toca (`grep -n '^#'` da el índice).

**Cómo se usa en la Etapa 9.** El agente de cada unidad lee su archivo en la fase 1 junto con lo de siempre
(`docs/metodo/unidad/etapa-delegada.md`) y lo contrasta con el molde, lo publicado y las unidades vecinas. La propuesta
final la escribe el agente; de aquí toma lo que sirva y dice qué descartó y por qué. Las reglas no cambian:

- Toda cuenta y toda opción se rehacen aparte; ninguna respuesta se copia de aquí.
- Un error marcado como hipótesis sigue siendo hipótesis, y una cita «de segunda mano» no se presenta como dato.
- Los enlaces a copias en Scribd de material de academia o del centro preuniversitario sirven para saber qué se
  pregunta; no se copia nada de ellos (regla 5 de `CLAUDE.md`). Las preguntas oficiales de admisión se pueden usar
  citando universidad y periodo.

`breve/` trae una segunda versión, más corta (unos 11 KB), de las mismas ocho unidades: sale del documento de ChatGPT
de las 32 unidades (`docs/investigacion/etapas-9-12/`), hecho en otra conversación. Manda la versión larga de esta
carpeta; la breve sirve para contrastar (dos investigaciones independientes que coinciden pesan más, y donde difieren
hay que mirar la fuente).

`originales/` guarda los HTML tal como llegaron (los `.md` de aquí salen de ellos con pandoc, sin estilos). No hace
falta leerlos.
