# Apertura de cada unidad con Entrada PISA (Gerson, 27 nov 2026)

Gerson: «a todas las unidades vamos a añadirles una introducción con el skill Entrada PISA, esto ayudará a aperturar
cada y todas las unidades dando un entendimiento del curso aplicado a la vida diaria. Se ubicará en la cara inicial del
curso, a la derecha quedarán los botones orientados en columnas. Esa introducción debe ir acompañada de una imagen y de
ecuaciones con colores si es que es necesario.»

El criterio de escritura es el skill, copiado en `docs/metodo/entrada-pisa.md` (manda sobre este documento en lo que
toca al texto). Se llama **apertura** en el código, porque `entrada` ya es la «Prueba del tema» (`est.temas[id].entrada`).

## Dónde va

En la portada de la unidad (`#/unidad/<id>`, la pantalla con Teoría, Laboratorio, Ejercicios, Exámenes, Prueba del tema
y Dejar una pregunta):

- **Pantalla ancha** (≥ 900 px): dos columnas. A la izquierda, la apertura (título en pregunta, párrafos, imagen de dos
  paneles, ecuación a color si hace falta y la pregunta «Antes de seguir»). A la derecha, los botones de la unidad
  apilados en una columna.
- **Celular**: la apertura arriba, plegable después de la primera visita (se abre entera la primera vez; luego queda el
  título y «Leer la introducción»), y los botones debajo, como hoy.
- La cabecera de la unidad (ícono, título, temas, «La estudié») no cambia.

## Formato

Un archivo por unidad, aparte de la teoría (para no chocar con quien edita la teoría):
`contenido/aperturas/<curso>/<unidad>.js`, módulo que sirve en el navegador y en Node, como las unidades de teoría.

```js
{
  unidad: 'fisica.vectores',
  titulo: '¿Por qué dos personas que jalan con 100 N no le dan 200 N a la caja?',
  parrafos: [ ... ],          // 3 o 4; cada uno, texto o lista de piezas con nodos de ecuación y colores de la unidad
  figura: { antes: 2, pieza: '<pieza del kit>', datos: {...} } // o { svg: '<svg …>' } de dos paneles
                              // «Lo que predice» y «Lo que se mide»; `antes` = después de qué párrafo va
  ecuacion: [...],            // opcional, nodos de nucleo/ecuacion.js con los colores de la unidad
  pregunta: '…',              // «Antes de seguir»: no se responde aquí
  ficha: { alcance, choque, atajo, porVerificar } // para Gerson; la app no la muestra
}
```

## Reglas que se comprueban (prueba común `contenido/aperturas/aperturas.test.js`)

- Título en pregunta (termina en «?»), 3 o 4 párrafos, oraciones de al menos 10 palabras, coma decimal, sin raya.
- La figura tiene dos paneles con sus rótulos «Lo que predice» y «Lo que se mide» y pasa por la pieza o el SVG sin NaN.
- No delata: la apertura no contiene la respuesta de ninguna Predice ni misión de la unidad (misma comprobación que el
  glosario y Lee).
- La ficha está completa; `porVerificar` lista los datos de memoria.
- Sin `ficha` visible en la app.

## Piloto

Tres unidades antes de las 158: `aritmetica.magnitudes-proporcionales` y `quimica.geometria-molecular` (los dos
ejemplos aprobados del skill: magnitudes proporcionales e hibridación, adaptados a lo que la unidad enseña) y
`fisica.vectores` (el caso de prueba de la tabla del atajo). Capturas a 390 y 1280 px para Gerson; si las aprueba, se
escribe una por unidad, curso por curso.
