# Ronda 3 de la teoría: glosario por tema y retos comprobados en álgebra (15 nov 2026)

Rama `teoria3/algebra`, salida de `claude/awesome-einstein-ch5g9a`. Encargo: `rutinas/encargos/teoria3-algebra.md`.
Un commit por unidad, en el orden del catálogo, más tres de corrección (un reto de polinomios con 18 palabras que dejó una
prueba en rojo, y el ajuste final contra los falsos amigos). `npm test` completo en verde antes del último push.

## Resumen

- **19 de 19 unidades** con `glosario` y con retos comprobados en **todas** sus mesas: **190 términos** y **230 retos**
  (57 mesas, de 3 a 5 retos cada una).
- Ninguna mesa se amplió: todos los retos caben en los controles que ya tenían. No se cambió ningún `id` de mesa ni de control.
- Herramienta nueva: `rutinas/teoria3-algebra/pw.js` (Playwright, 360 × 780). Abre la primera idea y toca el primer término
  subrayado, abre `…/teoria/glosario` y busca una palabra, y en el laboratorio elige la mesa y el reto, mueve los controles
  (y guarda casos si se le pide) y comprueba que diga «✓ Lo lograste».

## Términos por unidad (propios y heredados, de `app/datos/glosario/algebra.json`)

| Unidad | Propios | Heredados que aparecen | Retos por mesa |
| --- | --- | --- | --- |
| Lógica, conjuntos y juegos lógicos | 21 | 2 | 4 + 4 + 4 = 12 |
| Números reales e intervalos | 15 | 9 | 4 + 4 + 4 = 12 |
| Exponentes, radicales y productos notables | 14 | 10 | 4 + 4 + 4 = 12 |
| Ecuaciones de primer y segundo grado | 11 | 13 | 4 + 4 + 5 = 13 |
| Inecuaciones | 8 | 15 | 4 + 4 + 4 = 12 |
| Valor absoluto y ecuaciones con radicales | 7 | 11 | 4 + 5 + 3 = 12 |
| Polinomios | 13 | 10 | 5 + 4 + 4 = 13 |
| División de polinomios y cocientes notables | 8 | 15 | 4 + 4 + 4 = 12 |
| Factorización | 10 | 20 | 4 + 4 + 4 = 12 |
| Ecuaciones polinomiales | 7 | 23 | 4 + 4 + 4 = 12 |
| Funciones y sus gráficas | 8 | 19 | 4 + 4 + 4 = 12 |
| Tipos de funciones y función inversa | 10 | 23 | 4 + 4 + 4 = 12 |
| Exponenciales y logaritmos | 6 | 19 | 4 + 4 + 4 = 12 |
| Números complejos | 7 | 20 | 4 + 4 + 4 = 12 |
| Matrices y determinantes | 12 | 4 | 5 + 4 + 4 = 13 |
| Sistemas de ecuaciones | 7 | 17 | 4 + 4 + 3 = 11 |
| Inecuaciones con dos variables y programación lineal | 9 | 11 | 4 + 4 + 4 = 12 |
| Sucesiones y series | 10 | 7 | 4 + 4 + 4 = 12 |
| Binomio de Newton | 7 | 15 | 4 + 4 + 4 = 12 |

«Heredados» cuenta lo que el índice ve en el texto, que incluye nombres internos (ver «Pedidos al molde», 2).
Lógica pasa de 15 términos (21) porque es la primera unidad del curso y estrena el vocabulario base (conjunto, unión,
intersección, dominio…); queda bajo el tope de 24.

## Retos: de qué tipo son

Cada mesa trae, en general, uno de cada tipo; al menos uno por unidad toca la idea central.

- **Extremo** (el mayor, el menor, el más…): uno en casi todas las mesas. Los valores extremos se calculan con el motor de
  la mesa al cargar el archivo (`MAX_CUBICA`, `MAX_RESTO`, `MIN_VERTICE`, `MAX_DET_COL`, `MIN_DET_INV`, `MAX_SUMA_GEO`,
  `MAX_DIST2`, `MIN_ESPIRAL`, `MAX_INDEP`, `MAX_D`, `MIN_PRODUCTO`, `MAX_R_SIN_CERO`…), nunca escritos a mano.
- **Caso exacto**: «la solución es [−4, 2]», «bˣ = 8», «el producto x³ − 8», «se cruzan en (1; 2)», «resto 32».
- **Forma o patrón**: «la recta solo toca la parábola», «el signo no cambia al cruzar r₂», «un hexágono con un vértice
  en 1», «una fila del triángulo sin ningún par», «el reflejo es función».
- **Comparación entre casos guardados** (`logrado(valores, guardados)`): en 36 de las 57 mesas. Por ejemplo: «misma A ∩ B
  con distinto A», «mismo supremo, con y sin máximo», «misma suma de raíces, distinto producto», «la misma recta, con dos
  cortes y sin ninguno», «la misma f con los dos dominios».

## Cambios de texto que pidió el glosario (regla: si el término no sale, el problema es el texto)

- Lógica: la consigna nombra el **cardinal**, la regla el **conjunto potencia** y «Mira» el **cuantificador**.
- Reales: la **densidad** y la **operación binaria**, en la condición y la regla.
- Exponentes: «son **productos notables**…» y «…deja una **diferencia de cuadrados**».
- Ecuaciones: la **incógnita** y la **ecuación cuadrática**, en las reglas.
- Valor absoluto: la **ecuación irracional**. División: el **dividendo** y el **teorema del resto**.
- Ecuaciones polinomiales: el **teorema fundamental del álgebra**, la **ecuación bicuadrada** y la **ecuación recíproca**
  (antes decía «recíproca» a secas, que el lector habría marcado con la recíproca de lógica).
- Funciones: la **composición**. Tipos de funciones: «una **función par**» y «una **función impar**» (con «par» a secas
  se habría marcado «multiplicidad par» e «índice par»).
- Complejos: la **unidad imaginaria**. Matrices: la **matriz simétrica** y la **matriz identidad**. Sistemas: **compatible**.
  Programación lineal: la **función objetivo**. Sucesiones: la **progresión geométrica** y la **suma telescópica**.
  Binomio: el **binomio de Newton**.
- Falsos amigos (commit «Afina el glosario…»): «sin límite» → «sin fin» o «sin parar», «con un límite:» → «con una
  salvedad:» (historias), «por completo» → «del todo», «traza un aspa» → «dibuja un aspa», «¿qué número e cumple…?» (el
  neutro) → «¿qué elemento e cumple…?», nota «índices al revés» → «subíndices al revés».

## Arreglo de paso

- Programación lineal, figura del semiplano: con `<` o `>` y c = 0, el punto de prueba (0; 0) salía como «cumple»
  aunque la lectura decía «falso». Ahora la figura usa el mismo comparador estricto (`CMP`) que la lectura y los retos.

## Palabras que dudé

- **Homónimos dentro del curso.** El molde da una sola definición por término y por curso, y el lector la usa en todas las
  unidades. Resolví así:
  - «raíz» (solución de P(x) = 0 y resultado de √), «rango» (de una función y de una matriz), «vértice» (de una parábola y
    de un polígono) y «argumento» (del logaritmo y ángulo del complejo): **una definición con los dos sentidos**.
  - «recíproca», «identidad», «simétrica», «par», «geométrica»: **término más largo** («ecuación recíproca», «matriz
    identidad», «matriz simétrica», «función par», «progresión geométrica») y texto que lo dice entero.
  - «extremo», «centro», «borde» y «sentido»: **definición general** que vale en todos sus usos, con el caso técnico en la
    definición o en el ejemplo.
- «valor absoluto» sale primero en exponentes (√(x²) = |x|), pero lo definí en su unidad (valor absoluto y radicales);
  en exponentes el lector dice «Se explica en…».
- «término general» se iba a definir en división de polinomios, pero el texto no lo dice ahí; quedó en binomio de Newton.
- «límite» sigue saliendo en usos sueltos que no cambié porque son correctos («Ese límite se llama e»).
- Dejé fuera palabras básicas que el molde permitiría: «fila», «columna», «signo», «cero», «entrada», «salida»,
  «diferencia» y «razón» a secas (las dos últimas solo dentro de las progresiones).
- «proposición» sale en la historia de factorización (la proposición II.4 de Euclides): es un sentido cercano y lo dejé.

## Pedidos al molde

1. **Sentido por unidad.** Un término con dos sentidos en el mismo curso (raíz, rango, vértice, argumento) hoy necesita
   una definición doble. Pedido: que una unidad pueda dar una definición local (`{ termino, def, local: true }`) que
   gane sobre la del curso solo en esa unidad, sin contar como repetida.
2. **Qué cuenta como texto.** `nucleo/glosario.js` → `texto()` recorre también `tipo` (por ejemplo `'intervalo'` de las
   piezas), `valor` de las opciones y `error` (códigos como `TAL-INVERSA`). Por eso «intervalo», «inversa» e «identidad»
   aparecen como «Vienen de otros temas» en lógica, reales y matrices, aunque el alumno no los lee ahí. Pedido: sumar
   `tipo`, `valor` y `error` a `NO_TEXTO`.
3. **Retos que comparan casos.** El validador busca pares solo entre los primeros 160 casos de la grilla
   (`casos.slice(0, 160)`), que varían casi solo los primeros controles. Un reto como «Guarda dos casos con los mismos
   números y distinto resultado, cambiando solo los extremos» (reales, control `ext`) no se puede validar aunque se pueda
   lograr. Lo reemplacé por otro que varía los primeros controles. Pedido: que la búsqueda de pares tome una muestra de
   toda la grilla.
4. La página del glosario muestra «Vienen de otros temas» con todo término que aparezca en cualquier campo de la unidad,
   también en opciones y figuras, que no se marcan. No es un error, pero infla la lista (Ecuaciones polinomiales: 23).

## Verificación

- Cada unidad pasó `npm run catalogo` y `node --test contenido/teoria/teoria.test.js nucleo/glosario.test.js` antes de su
  commit (salvo el de polinomios, corregido en el commit siguiente). `npm test` completo al final: 8549 de 8549 en verde.
- Playwright a 360 × 780 (`rutinas/teoria3-algebra/pw.js`), un reto por unidad en las 19, tres de ellos de
  comparación con casos guardados: todos dijeron «✓ Lo lograste» con la línea de Nox, sin errores de consola y sin
  desborde horizontal. Miré las capturas de la hoja del término (lógica), del glosario del tema (lógica y matrices) y del
  laboratorio (tres conjuntos).

## No verificado

- No toqué un término subrayado en todas las unidades: en cuatro ideas de entrada (funciones, complejos, matrices y
  sistemas) el primer momento no tiene ninguno a la vista; la hoja se probó en las demás.
- No se probó con alumnos si las definiciones se entienden a la primera, ni si los retos son demasiado fáciles o difíciles
  (hipótesis: los de comparación son los más difíciles; se vería en `momento: 'invitacion'` de la medición).
- Los retos con `Math.abs(… ) < 1e-9` (complejos, exponenciales, series) dependen del redondeo de los controles con paso
  decimal; el validador los encontró logrables, pero no se probaron en todos los navegadores.
- Los ejemplos del glosario con números fijos (p. ej. «√(5 + 2√6) = √3 + √2») los verifiqué a mano, no con código.
