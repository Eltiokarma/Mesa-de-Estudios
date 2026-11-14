# Teoría de razonamiento verbal — reporte (en curso)

Sesión paralela del 14 nov 2026, rama `teoria/razonamiento-verbal`. Encargo: `rutinas/encargos/teoria-razonamiento-verbal.md`.

## Unidades hechas

| Unidad | Ideas | Estado |
| --- | --- | --- |
| definiciones | genero-diferencia, rasgo-necesario | completa |
| analogias | relacion-no-tema, clase-y-causa, sinonimo-antonimo | completa |
| sentido-contextual | acepcion, denota-connota, palabra-precisa, inferir-significado | completa |
| conectores | relacion-primero, clases, locuciones | completa |
| eliminacion-de-oraciones | redundancia, impertinencia, incompatibilidad | completa |
| plan-de-redaccion | abre-y-retoma, tiempo-y-causa, analizar-comparar | completa |
| cohesion-y-coherencia | referente, repetir-sustituir-callar, conocido-y-nuevo, no-contradiccion | completa |
| tipologia-textual | proposito, normas-textualidad, niveles | completa |
| tema-e-idea-principal | tema-e-idea, jerarquia, mapa-conceptual | completa |

(Se completa al terminar.)

## Pieza nueva

`nucleo/kit/piezas/rv-texto.js` (con `rv-texto.test.js`). Afirmación: «la respuesta se sostiene en palabras concretas del texto, y se ven marcadas en su lugar».

## Bug encontrado en el lector (no se tocó `app/`)

`app/teoria.js`, función `vista`: `const [, , , sub] = location.hash.split('/')` toma el elemento 3 de `#/unidad/<id>/teoria/<idea>`, que es siempre `teoria`. Resultado: los enlaces de la fila de ideas y de la «Ficha de repaso» abren siempre la primera idea pendiente; la ficha nunca se abre. Arreglo propuesto: `const [, , , , sub] = …` (índice 4). Afecta a todos los cursos.
