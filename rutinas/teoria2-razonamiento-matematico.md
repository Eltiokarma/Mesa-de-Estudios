# Teoría de Razonamiento matemático, ronda 2: gesto, llaves, laboratorio y tipografía (14 nov 2026, noche)

Rama `teoria2/razonamiento-matematico`, que sale de `claude/awesome-einstein-ch5g9a`. Encargo: `rutinas/encargos/teoria2-razonamiento-matematico.md`.

**Cómo se hizo.**
- Verdades y mentiras se hizo a mano, como molde.
- Las otras 18 unidades se repartieron en cuatro sesiones en paralelo, cada una en su worktree, y sus commits se juntaron aquí uno por uno.
- Hay un commit por unidad, y un push después de cada uno.
- Todas las unidades quedan en la versión 0.2.0.

## Cifras

- **Ideas con arrastre:** 48 de 65. Las 19 unidades tienen al menos una.
- **Ideas sin arrastre:** 17. Sus razones están en la tabla de abajo.
- **Mesas de laboratorio:** 56, de 2 o 3 por unidad. 49 tienen arrastre.
- **Pruebas:**
  - `node --test contenido/teoria/teoria.test.js 'nucleo/kit/piezas/*.test.js'` quedó en verde después de cada unidad.
  - `npm test` completo, al final: 8493 de 8493 en verde.
- **Recorrido en Playwright a 360 × 780** en cada unidad:
  - se arrastró con el mouse cada manija de cada idea;
  - en cada mesa se guardaron 2 casos;
  - se miró la ficha con las llaves;
  - no hubo errores de página.

## Por unidad

En la columna de mesas, * marca las que tienen arrastre. La mesa más rica va primero o se describe.

| Unidad | Con arrastre | Sin arrastre y por qué | Mesas |
| --- | --- | --- | --- |
| Verdades y mentiras | 3 de 3: la casilla «Es» de cada persona se desliza como interruptor; se señala al sospechoso; el borde de los que aprobaron | — | `tres-que-hablan`* (la frase de Ciro se cambia: 0, 1 o varias suposiciones coherentes) · `quien-fue`* (con «solo uno miente» o «solo uno dice la verdad») · `seis-alumnos`* (cada frase junto a su negación) |
| Certezas | 3 de 3: la última ficha sacada, el último objeto del palomar, la esquina de la tabla de llaves | — | `urna-libre`* (el alumno arma la urna y elige entre 4 metas; incluye la meta imposible) · `palomar-libre`* · `llaves-libre`* |
| Juegos recreativos | 2 de 3: el último doble del dominó, la esquina de la cuadrícula de cerillas | Dados: elegir la cara de arriba no es un gesto espacial | `domino-marcado`* · `pila-dados`* · `rectangulo-cerillas`* |
| Cortes y pesadas | 2 de 4: el primer corte, el último del grupo | Las dos ideas con `balanza`: es una pieza común y no exporta geometría | `cortes-libre`* · `reparte-monedas`* · `pesas-libre` |
| Máximos y mínimos | 3 de 4: personas, precio, el punto del río | Regiones con rectas: trazar una recta no es arrastrar | `cuarta-recta`* (avisa de las paralelas, de tres rectas por un punto y del cruce fuera del dibujo) · `rio-libre`* · `precio-libre`* |
| Arreglos numéricos | 1 de 3: el final de la fila de 8 lugares | Cuadrado mágico y triángulo: se eligen conjuntos de números | `reparto-libre`* · `magico-libre` · `triangulo-libre` (con casos sin arreglo) |
| Cronometría y calendarios | 4 de 5: las puntas del minutero y del horario (con `rm-reloj.geometria().angulo`), la última campanada, la casilla del día | Bisiestos: el año es una elección entre casos | `reloj-libre`* · `reloj-que-gana`* (de −6 a +6 min por hora) · `calendario`* |
| Frecuencia de sucesos | 3 de 3 | — | `receta-libre`* (el caso raro: al final no hay toma) · `tres-ritmos`* (el MCM de tres) · `tramo-del-dia`* |
| Diagramas de flujo | 1 de 3: la última fila de la tabla de estados | La condición es una regla escrita; en el operador, a y b son datos sueltos | `bucle-libre`* · `umbral`* · `operadores-libres` |
| Tablas, gráficos y suficiencia | 1 de 3: el piso del eje | Liga: la tabla son solo conteos. Suficiencia: los casos son filas | `eje-libre`* (aumento real contra el dibujado) · `liga-libre` · `casos-en-el-plano`* |
| Ordenamiento de información | 2 de 3: girar la mesa redonda, Ana cambia de silla | Orden lineal: lo que cambia son las pistas, que son frases | `mesa-redonda`* (de 4 a 8 personas; con un número impar, nadie queda enfrente) · `mesa-cuadrada-libre`* · `pistas-a-elegir` |
| Planteo de ecuaciones | 4 de 4 | — | `veces-o-mas`* · `edades-libres`* · `corral`* |
| Razonamiento deductivo | 2 de 4: el borde de C en el Venn, el pariente en el árbol | «Si llueve…»: se elige una frase. Cuadro de doble entrada: cambia el número de pistas | `venn-libre`* (avisa cuando el dibujo no cumple «algún B es C») · `cualquier-pariente`* · `pistas-a-eleccion` |
| Razonamiento inductivo | 3 de 3 | — | `palitos-libres`* · `seis-puntos`* (el caso de 6 puntos, que rompe la duplicación) · `impares-desde`* |
| Ruedas, poleas y engranajes | 3 de 3: el borde de arriba de B o C | — | `tren-de-engranajes`* (el engranaje del medio no cambia las vueltas de C) · `faja-libre`* |
| Rutas y visualización espacial | 2 de 3 | Vistas: se elige entre pilas armadas; el gesto está en `arma-la-pila` | `dos-cierres`* · `caja-que-crece`* · `arma-la-pila`* (9 manijas, una por casilla) |
| Transformaciones de figuras | 4 de 4 | — | `dos-movimientos`* · `moneda-y-disco`* (discos de 1R a 4R) · `punto-fijo-movil`* |
| Traslados y puntos cardinales | 3 de 3 | — | `paseo-de-cuatro-tramos`* (puede volver a la salida) · `mudanza-paso-a-paso`* · `pasar-dos-numeros`* |
| Trazos y perímetros | 2 de 4 | Un solo trazo y recorrido mínimo: se elige una figura o un tramo entero; el gesto está en `lineas-sueltas` | `lineas-sueltas`* · `escalera-con-entrante`* · `arcos-arriba-y-abajo`* |

**Llaves.**
- Están en las reglas de todas las ideas donde un símbolo necesita nombre, y en algunos pasos de «Mira». Las notas tienen 3 palabras o menos.
- Las relaciones que iban juntas con `' · '` o `'; '` ahora se separan con `'   ·   '`, también en las lecturas y las soluciones.
- Los exponentes van con `{ sup }` y los subíndices con `{ sub }`.
- Se dejaron sin llave la regla de k² y θ/360° (transformaciones) y las raíces de máximos y mínimos: la llave partía mal la ecuación.

**Hallazgo 9.** Se dejó comentado dónde el juego y «Mira» usan dibujos distintos a propósito:
- en verdades y mentiras, la tabla de suposiciones contra la cadena «supón → sale»;
- en la mesa cuadrada, contra la mesa redonda;
- en los dados, uno contra la pila;
- en la rueda, la recta contra las monedas.

## Piezas tocadas

Las cuatro `rm-*` exportan ahora `geometria`, con su prueba. No cambia lo que dibujan.
- **`rm-plano`:** `X`, `Y`, `k`, `alto`.
- **`rm-tablero`:** `centro(f, c)`, `casilla(x, y)`, `altoFila`.
- **`rm-reloj`:** las esferas, `punta(k, ángulo, fracción)` y `angulo(k, x, y)`.
- **`rm-fichas`:** dónde cae cada ficha visible, también cuando la fila se junta.

Las piezas comunes no se tocaron.

## Pedidos al molde

1. **Tocar para alternar o elegir.** Hoy, tocar una manija sin moverla no hace nada. Quedaron sin gesto por esto:
   - la frase o la pista en orden lineal, la condición del contador, las pistas del cuadro;
   - la cara del dado y elegir figura, tramo o pila.

   En verdades y mentiras se resolvió con un interruptor que se desliza dentro de la casilla, pero tocar sería más natural.
2. **Intercambiar fichas** soltando una sobre otra. Lo piden el cuadrado mágico y el triángulo numérico.
3. **`balanza` con `geometria`** (platillos y figuras), para arrastrar pesas. Es una pieza común: le toca a su dueño.
4. **Respuesta manipulable en «Ahora tú»:** poner el culpable o el número de pesadas en la figura. Sin cambios por ahora.

## No verificado

- El celular real, el toque real, el lector de pantalla y el tema oscuro.
- Los momentos Predice, Mira y Ahora tú de cada idea en el navegador. Las ideas de la ronda 1 no cambiaron ahí, salvo llaves y separadores, y la ficha se miró.
- **Corrimiento horizontal en las capturas.** Después de arrastrar, algunas capturas salían corridas. Se comprobó que es un efecto de `scrollIntoView` en el script de recorrido: sin él, ningún contenedor de la figura es más ancho que la pantalla.
- **El palomar** (certezas): la manija se coloca en la casilla más cercana, en las dos direcciones, así que un arrastre en diagonal salta varios objetos de golpe. Es coherente con la figura, pero hay que mirarlo con alumnos.
- **Lo que tapa la lupa:**
  - la cabecera «Queda» (deductivo, idea 3);
  - la esquina de la tabla de 6 × 6 (mesa de impares);
  - el rótulo «Lado» (vistas).

  Viene del lector.
- **Rótulos apretados:**
  - en `turnos-mcm` y `tres-ritmos`;
  - los engranajes de 10 dientes del tren, que se ven chicos (radio de unos 12 px);
  - en «mismo eje», el rótulo B roza el borde de la rueda.

## Reporte de diseño

```
Ficha de tarea: el postulante de 3.º a 5.º, en un celular de gama baja a 360 px, mueve con el dedo lo que el problema pide mover (la ficha, la aguja, el borde, el sospechoso) y compara casos guardados en el laboratorio sin preguntas.
Sistema: existente (kit, piezas rm-*, lector de app/teoria.js). Decisiones nuevas: geometria pública en rm-plano, rm-tablero, rm-reloj y rm-fichas; interruptor deslizable dentro de una casilla para elegir entre dos estados.
Carácter: ágil y juguetón en dosis pequeñas (Faro) · firma: el hilo de color y la manija del color de la variable que mueve.
Movimientos: arrastre directo sin animación propia (la figura se repinta con el dedo; los casos se cuentan al soltar), sin movimiento que avance solo.
Verificación: validador de arrastres en verde en las 19 unidades; recorrido en Playwright a 360 × 780 con arrastre real y 2 casos guardados por mesa; capturas revisadas; la ficha con las llaves revisada.
No verificado: celular real, lector de pantalla, tema oscuro, alumnos.
Hipótesis: con el gesto directo sube el número de casos probados por juego y baja el tiempo hasta el primer toque (medible con los eventos «teoria»: casos y ms).
Conflictos: ninguno con CLAUDE.md. Las ideas sin gesto quedan con − y + por falta de «tocar para elegir» en el molde (pedido 1).
```
