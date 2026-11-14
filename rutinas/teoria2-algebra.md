# Teoría de Álgebra, ronda 2: gesto directo, llaves, laboratorio y tipografía (14 nov 2026, noche)

Encargo: `rutinas/encargos/teoria2-algebra.md`. Rama `teoria2/algebra`, que sale de `claude/awesome-einstein-ch5g9a`. No se integró a main.

## Cómo se hizo

**Reparto.** Cinco subagentes trabajaron en paralelo en el mismo árbol, con 3 o 4 unidades cada uno:
- A: reales, inecuaciones, valor absoluto y lógica.
- B: ecuaciones, sistemas, programación lineal y matrices.
- C: exponentes, polinomios, división y factorización.
- D: funciones, tipos de funciones, exponenciales y sucesiones.
- E: complejos, ecuaciones polinomiales y binomio.

Cada uno leyó el encargo, `docs/teoria.md` §4b, la auditoría y la unidad de referencia. También cargó los tres skills.

**Piezas.** Cada pieza tuvo un solo dueño y las pruebas nuevas fueron a archivos propios:
- grupo A: `recta` y `alg-venn`;
- grupo B: `balanza`;
- grupo C: `alg-baldosas`.

**Integración.** El coordinador revisó las capturas, hizo un commit por unidad y subió después de cada tanda.

**Verificación de cada unidad:**
- el validador `Teoria.problemas`: la manija cae en la figura, está donde dice su valor y mueve controles reales;
- `node --test contenido/teoria/teoria.test.js nucleo/kit/piezas/*.test.js`;
- un recorrido en Playwright a 360 × 780 (`recorrer.js`, en el scratchpad de la sesión). El recorrido arrastra con el mouse cada manija de las ideas y de las mesas, avisa si una no cambia nada, guarda 2 casos por mesa y deja capturas. Al menos una unidad por grupo se recorrió también en tema oscuro.

Las reglas con llaves se miraron en la ficha de repaso a 360 px. Los grupos A, B, C y D lo hicieron con un script que marca las ideas como terminadas; el grupo E solo revisó las notas.

## Resumen

- Ideas con arrastre: **61 de 96**. Hay al menos una en cada unidad, y en 6 unidades todas sus ideas tienen arrastre.
- Laboratorio: **57 mesas**, 3 por unidad. 48 tienen arrastre, y en cada unidad al menos una es más rica que los juegos de sus ideas.
- Todas las unidades pasan de 0.1.0 a 0.2.0.

| Unidad | Con arrastre | Ideas sin arrastre | Mesas (* = con arrastre) |
| --- | --- | --- | --- |
| binomio-de-newton | 3/4 | potencia-trinomio | pascal-colores*, termino-libre*, serie-alfa* |
| division-de-polinomios | 1/5 | algoritmo, ruffini, divisor-k, cocientes-notables | resto-libre*, ruffini-libre, notable-con-mas |
| ecuaciones-lineales-y-cuadraticas | 4/5 | planteo | parabola-libre*, dos-lados*, raices-libres* |
| ecuaciones-polinomiales | 6/6 | — | cubica-libre*, sube-baja*, w-libre* |
| exponenciales-y-logaritmos | 4/6 | logaritmo, numero-e | base-libre*, carrera*, inecuacion* |
| exponentes-y-productos-notables | 1/5 | leyes-exponentes, radicales, radicales-dobles, racionalizar | rectangulo-x-p-q*, raiz-de-la-potencia*, exponentes-con-signo |
| factorizacion | 3/5 | aspa-doble, mcd-mcm | aspa-con-coeficientes*, raices-que-se-arrastran*, mcd-mcm-libre |
| funciones | 5/6 | composicion | trasladar*, parabola*, polinomio* |
| inecuaciones | 4/4 | — | tres-factores*, parabola-libre*, cociente* |
| logica-y-conjuntos | 3/6 | equivalencias, potencia, certezas | dos-formulas*, tres-conjuntos*, contraejemplo* |
| matrices-y-determinantes | 1/5 | fila-por-columna, tipos-traza-transpuesta, inversa-adjunta, rango | columnas-libres*, adjunta-inversa, rango-libre |
| numeros-complejos | 6/6 | — | dos-flechas*, espiral*, disco-libre* |
| numeros-reales | 4/4 | — | dos-intervalos*, supremo-infimo*, tabla-libre* |
| polinomios | 1/5 | grados, completo-ordenado, igualdad, operaciones | curva-cubica*, dos-curvas*, producto-libre |
| programacion-lineal | 2/4 | region-factible, casos-especiales | nivel-libre*, region-movil*, semiplano-libre* |
| sistemas-de-ecuaciones | 2/5 | gauss, cramer, rouche | rectas-libres*, parabola-recta*, rangos |
| sucesiones-y-series | 2/6 | progresiones, limite, recurrencia, gauss | banda*, razon*, aritmetica* |
| tipos-de-funciones-e-inversa | 5/5 | — | espejo*, recta-horizontal*, dos-tanques* |
| valor-absoluto-y-radicales | 4/4 | — | distancia-libre*, v-y-recta*, raiz-nivel* |

## Qué se arrastra (por unidad)

- **Números reales:** los puntos a, b y c·b en la recta; el inicio de B; el extremo de S; la casilla de la tabla de operación. En los intervalos, la manija va media fila abajo para no tapar si el extremo es lleno o hueco.
- **Inecuaciones:** el punto de prueba x, que se pinta según cumpla; las dos raíces en el eje; el punto t; los ceros de la fracción, con la recta fija de −5 a 5.
- **Valor absoluto y radicales:** el centro a y el punto a + r; la recta, por su corte con el eje y; el valor de prueba sobre y = x; la recta y = k.
- **Lógica y conjuntos:** la fila de la tabla (da p y q); la ficha de un número que se lleva de región en región en el Venn; el testigo en la recta.
- **Ecuaciones lineales y cuadráticas:** la caja x y las pesas de cada platillo; el candidato en la recta; el corte con el eje y y el vértice de la parábola; las dos raíces.
- **Sistemas:** la recta, por su corte con el eje y y por su punto en x = 1 (la inclina), en `dos-rectas` y `no-lineal`.
- **Programación lineal:** el borde del semiplano (mueve c); la recta de nivel, que se desliza.
- **Matrices:** las puntas de las columnas (a, c) y (b, d); el determinante es el área.
- **Exponentes y productos notables:** las dos esquinas del cuadrado (a + b)².
- **Polinomios y división:** el punto (a; P(a)) a lo largo de la curva.
- **Factorización:** los bordes del rectángulo del factor común (k y m); la esquina del rectángulo (x + p)(x + q); el punto en la curva del teorema del factor.
- **Funciones:** el punto de inicio (h; k); el vértice; el punto (x; f(x)) de las especiales; el punto seguido en la traslación; las tres raíces de la polinomial.
- **Tipos de funciones e inversa:** el punto en x = a para la paridad; los bordes del intervalo de monotonía; la recta y = c para la inyectividad; el corte y el punto en x = 1 de f, mientras su reflejo responde; el inicio y el punto de vaciado del tanque.
- **Exponenciales y logaritmos:** el punto (x; bˣ) y el punto (1; b), que elige la base; el punto (b; 1) del logaritmo; la recta y = c; el corte (c; bᶜ).
- **Sucesiones y series:** la última fila de la telescópica; el punto S₂ = 1 + r, que elige la razón.
- **Números complejos:** la punta de z (a y b, o r y θ); la raíz vecina; el borde de la región.
- **Ecuaciones polinomiales:** el corte con el eje y; las raíces en el eje (Vieta en vivo); la candidata p/q, que salta a la más cercana; la raíz que choca con su pareja y sale del eje como conjugada; u₁ y u₂; la raíz vecina de zⁿ = w.
- **Binomio:** la fila de Pascal (n); la fila marcada (k); el punto de la curva exacta.

## Ideas sin arrastre, y por qué

- **Tablas que no representan una cantidad en el plano.** Una fila o columna de `alg-tabla` cuyo ancho cambia con el texto no tiene un lugar fijo que agarrar. Pasa en:
  - las leyes de exponentes, radicales, radicales dobles y racionalizar;
  - grados, completo y ordenado, igualdad y operaciones;
  - algoritmo, Ruffini, divisor k y cocientes notables;
  - aspa doble y MCD/MCM;
  - Gauss, Cramer y Rouché;
  - las cuatro de matrices que no son del determinante;
  - planteo, composición, logaritmo, recurrencia y potencia-trinomio.
- **Controles que eligen entre opciones, no mueven una cantidad:**
  - región factible y casos especiales;
  - límite y número e;
  - equivalencias y certezas.
- **Escala que no deja seguir al dedo:**
  - progresiones: la escala cambia hasta 80 veces entre suma y producto;
  - Gauss: la columna se corre unos 10 px por paso;
  - potencia de conjuntos: la tabla crece al doble.
- **Opción descartada a propósito:** la manija de «veces por i» en complejos. Con k = 0 o k = 4 caería encima de la de z.

## Llaves, separadores y tipografía

- **Llaves:** se pusieron en las reglas de las 19 unidades y en algunos pasos de «Mira». Las notas tienen 3 palabras o menos.
  - Se quitaron donde partían la ecuación a 360 px: regla 2 de programación lineal, regla del logaritmo y dos de las tres del cuadrado de una suma.
- **Separadores:** donde dos relaciones iban juntas con `' · '`, `'; '` o `'   ;   '`, ahora van con `'   ·   '`.
  - Además, el coordinador corrió una pasada mecánica en las 19 unidades. El separador tiene que ser una parte suelta de la lista: pegado a otro texto, `nucleo/ecuacion.js` no lo reconoce y no lo pasa a otra línea. Se corrigieron 39 casos.
- **«^» visible:** se quitó en los textos que ve el alumno. Por ejemplo: `z·i^k`, `i^50`, `r·e^(iθ)` y `(1 + x)^½`.
- **Espacios duros** dentro de factores y lecturas, para que no se partan a mitad de expresión: «(nx / + q)», «grado(P·Q)» y los cuantificadores.

## Hallazgo 9 (juego y «Mira» con dibujos distintos)

- **Resuelto en la figura:**
  - `factorizacion/aspa-simple`: ahora «Mira» empieza por el rectángulo de baldosas que el alumno movió. Muestra que las dos piezas verdes son los productos en cruz, y termina en el aspa con un negativo.
  - `ecuaciones-lineales/suma-producto`: «Mira» pasó de la tabla a la parábola del juego.
- **Dos representaciones a propósito, con un comentario sobre la idea que lo explica:**
  - `exponentes/radicales`;
  - `polinomios/igualdad`;
  - `factorizacion/factor-comun` y `teorema-factor`;
  - `funciones/especiales`;
  - `exponenciales/exponencial` y `ecuaciones`;
  - `matrices/fila-por-columna`;
  - `ecuaciones-polinomiales/viete` y `raices-racionales`: el juego pasó a la gráfica; «Mira» sigue en la tabla;
  - `binomio/pascal-elecciones` y `exponente-no-natural`;
  - `logica/potencia`.

## Piezas tocadas

Las cuatro solo agregan exports o datos opcionales, sin cambiar lo que ya dibujaban. Cada una tiene su prueba.

| Pieza | Qué se agregó | Prueba |
| --- | --- | --- |
| `recta` (común) | `geometria(d).v(px)`, la inversa de `x` | `alg-grupo-a.test.js` |
| `alg-venn` | `ficha(d, cod)`: dónde va la ficha de cada región, con 2 y 3 conjuntos | `alg-grupo-a.test.js` |
| `balanza` (común) | `geometria` y `platillos(d, { vista \| balanza })`, que dan el centro de cada platillo, el punto de giro y los grados | `alg-grupo-b.test.js` |
| `alg-baldosas` | `datos.escala` opcional (px por unidad, con tope); `geometria` devuelve también `x0`, `y0`, `xs` e `ys` | `alg-grupo-c.test.js`. Sin escala, el SVG sale idéntico al de antes |

No se tocaron `alg-tabla`, `ejes`, `flechas` ni nada de `app/` o del núcleo.

**Un cambio de color en integración.** En la mesa `tres-conjuntos`, C pasó de verde a violeta (`f`). El verde ya es «cumple» en lógica (regla 4).

## Pedidos al molde

1. **Arrastrar en `alg-tabla`.** Hace falta una opción de ancho de columna fijo, o una manija por celda que suba o baje un número. Lo piden Ruffini, la tabla de leyes, Gauss, Cramer, Rouché, la inversa y el rango.
2. **Tocar para alternar o elegir.** Un gesto que no sea arrastrar, para:
   - prender o apagar una restricción tocando su borde (región factible);
   - elegir un caso (casos especiales, tipos de matriz);
   - elegir una fila de la tabla de verdad o una región del Venn.

   Hoy se resuelve arrastrando una manija hasta la fila o la región.
3. **Respuesta manipulable en «Ahora tú».** Por ejemplo, marcar el intervalo solución en la recta o arrastrar la raíz.
4. **La lupa tapa la esquina superior derecha de la figura.** Se ve en el encabezado de la última columna de `alg-tabla` (en la mesa `dos-formulas` corta «~q → ~p») y en la «U» del Venn. Varios grupos movieron manijas y rótulos para esquivarla.
5. **El validador no revisa dos cosas:**
   - que las notas de las llaves tengan 3 palabras o menos;
   - que una manija de un control de opciones esté donde dice su valor (en esos controles se salta la prueba de «quieto»).
6. **El validador no avisa del separador pegado a otro texto.** Una ecuación con el separador dentro de otro string pasa la prueba y no se parte en la regla grande.
7. **Una nota más ancha que su símbolo abre un hueco en la ecuación.** Pasa con «a / común» y «d / independiente». Conviene que la nota pueda desbordar a los lados.
8. **El valor de un control con unidad larga se corta a 360 px.** «40 L/min» deja la «n» suelta (`tipos-de-funciones/modelacion` y la mesa `dos-tanques`). Es CSS de `app/`.
9. **Dos manijas en el mismo punto no se distinguen.** Por eso se evitó la de «veces por i» en complejos.

Lo que algunos grupos reportaron como «la lectura queda detrás de la figura y hay una banda vacía» en el laboratorio no es un error. Es un efecto de la captura de página completa con la figura fija (pasa igual en la unidad de referencia de física).

## No verificado

- Celular real, lector de pantalla real y alumnos.
- Los pasos de «Mira» y «Ahora tú», uno por uno, en la app: se recorrieron los juegos, el laboratorio y las reglas en la ficha.
- El tema oscuro en todas las unidades: hay una por grupo, como mínimo.
- Las reglas con llaves del grupo E (complejos, ecuaciones polinomiales y binomio) en vivo a 360 px. Solo se revisó que las notas fueran cortas. La regla del producto de complejos es la más larga y conviene mirarla.
- **Superposiciones menores que quedan:**
  - una manija tapa a medias el rótulo «cb» en `orden`, el «−3/4» en `v-y-recta` y el «6» de la región 110 del Venn de tres;
  - el rótulo «P(1) = −1» se monta sobre la curva en `valor-numerico`;
  - algunas reglas largas se parten tras «=» o entre palabras, nunca dentro de un paréntesis.

## Reporte de diseño

```
Ficha de tarea: postulante de 3.º a 5.º, celular de 360 px; agarra sobre la figura lo que el fenómeno mueve (extremo, raíz, vértice, recta, columna, ficha, punta de z) y ve responder la variable antes de predecir; en el laboratorio guarda casos que se entienden solos por su lectura.
Sistema: existente (kit, tokens, docs/teoria.md §4b). Decisiones nuevas, escritas en el encabezado de cada pieza: recta.v, alg-venn.ficha, balanza.platillos y alg-baldosas.escala. El separador de relaciones va como parte suelta (anotado en este reporte, en pedidos al molde).
Carácter: acogedora, viva y precisa · firma: el hilo de color. La manija lleva el color de la variable que mueve.
Movimientos: gesto directo: sigue al dedo 1:1, sin curva; el lector ajusta al paso al soltar. No hay animaciones nuevas; con movimiento reducido no cambia nada.
Verificación: el validador revisa las manijas en el inicio y en los extremos (el grupo A, en todas las combinaciones, hasta 20 000 por juego). En Playwright se arrastraron con el mouse todas las manijas de ideas y mesas, sin ninguna «sin cambio» y sin errores de página; se guardaron 2 casos por mesa. Los ejes de los juegos con arrastre tienen rango fijo, para que la manija no se escape. Las reglas se miraron en la ficha a 360 px. npm test completo: 8500 en verde.
No verificado: celular real, lector de pantalla, alumnos; «Mira» y «Ahora tú» paso a paso.
Hipótesis: arrastrar el vértice, la raíz o el extremo, en vez de usar − y +, baja los errores de signo y de traslación (TAL-HK-CRUCE, AL28 y AL8). Se mide en el piloto con la tasa de esas opciones en la predicción, comparando ideas con y sin arrastre.
Conflictos: ninguno con CLAUDE.md. Con el skill: la lupa del lector compite por la esquina superior derecha (pedido 4).
```
