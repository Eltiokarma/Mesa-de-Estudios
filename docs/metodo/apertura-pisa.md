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
- La ficha está completa (`seLleva` incluido); `porVerificar` lista los datos de memoria.
- Sin `ficha` visible en la app.

## Lo que el alumno se lleva (Gerson, 27 nov, después del piloto)

Gerson leyó el piloto: «al leer la introducción, el estudiante debe llevarse algo a casa; de geometría molecular no se
llevarían nada»; el choque de la hibridación («el s y el p fallan») no quedaba claro; «la pregunta guía también debe
de ser muy clara»; y los ejemplos del skill eran ejemplos, no textos para poner. Por eso, además del skill:

1. **Algo para llevarse.** Al terminar la apertura, el alumno puede decir en una oración propia qué aprendió del mundo,
   aunque todavía no sepa el tema: «la forma de una molécula decide si se mezcla con el agua», «la regla de tres solo
   sirve si las dos cantidades crecen juntas a la par». Esa oración va en la ficha como `seLleva` y el texto la deja
   clara sin enunciar la regla de la unidad.
2. **Un choque que un alumno de 5.º entienda solo.** Con cosas que ve o que ya estudió en el colegio, no con un modelo
   que todavía no tiene (orbitales, hibridación). Si para ver el choque hay que saber el tema, el choque está mal elegido.
3. **La pregunta guía es clara y se puede pensar.** Una sola pregunta, de una línea o dos, sobre algo del texto o de la
   imagen, que el alumno pueda intentar responder con lo que sabe (aunque se equivoque). Nada de preguntas que solo
   entiende quien ya leyó la teoría.
4. **Texto propio.** Los ejemplos del skill (la talla del niño, el metano) muestran el método; no se copian ni se
   adaptan. Cada apertura busca su propio hecho cotidiano.

## Revisión del Escribidor Escribano (Gerson, 27 nov)

Toda apertura pasa, después de escrita, por una revisión aparte con la skill `anthropic-skills:escribidor-escribano`,
hecha por un agente que no la escribió: coherencia entre párrafos (cada uno sigue del anterior y el choque se entiende
sin releer), que el título, la imagen y la pregunta hablen del mismo choque, y las reglas de la casa (oraciones de al
menos 10 palabras, sin raya, coma decimal, de tú, nada telegráfico). Esa revisión no cambia datos medidos ni el choque:
si ve un problema de contenido, lo anota en la ficha. Sin esa revisión, la apertura no se publica.

## Piloto

Tres unidades antes de las 158: `aritmetica.magnitudes-proporcionales`, `quimica.geometria-molecular` y
`fisica.vectores`. La primera versión (27 nov) partió de los ejemplos del skill y Gerson la rechazó por lo de arriba;
la segunda se escribe desde cero con los cuatro puntos. Capturas a 390 y 1280 px para Gerson; si las aprueba, se
escribe una por unidad, curso por curso.
