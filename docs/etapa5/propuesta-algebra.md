# Propuesta de ideas: «Polinomios» (`algebra.polinomios`)

Etapa 5 del plan de calidad, rama «Expresiones algebraicas» (tercera unidad, después de «Exponentes y radicales» y
«Productos notables») · fases 1 y 2 de `docs/metodo/unidad/` · 19 nov 2026

Gerson: delegaste el criterio, así que esta propuesta ya está aplicada en su fase 2 (la unidad reordenada y la idea 1
completa). Lo que decidí sin ti está al final, en «Decisiones tomadas (Gerson revisa después)», cada punto con su motivo
y la alternativa que descarté. No encontré ningún conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md` entero, `docs/metodo/unidad/` (LEEME, 1-ideas,
2-ejemplos), las decisiones de las etapas 2, 3 y 4, la propuesta modelo (`docs/etapa3/propuesta-algebra-exponentes.md`),
las dos unidades de Álgebra con `calidad: 2` (`exponentes-y-productos-notables.js` y `productos-notables.js`, con su
auditoría y su lector en frío: `rutinas/auditoria/algebra.*.md`, `rutinas/frio/algebra.*.md`), la teoría actual
(`contenido/teoria/algebra/polinomios.js`), su ficha en `catalogo/cursos/algebra.json`, su plantilla
(`plantillas/polinomios/`: escena, 22 casos y papel), `docs/investigacion/algebra-funciones-ideas-erroneas.md` (AL1 a
AL7 y AL16), `rutinas/teoria-algebra.md` (códigos TAL-), `docs/temario-completo.md` §7, la matriz
`docs/teoria/matriz/algebra.json` (unidad 7), `docs/datos/admision-unmsm.csv`,
`docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md` (trampas 44 y 45), `catalogo/pruebas/algebra.json` y las
ideas de las unidades vecinas (`division-de-polinomios`, `factorizacion`, `ecuaciones-polinomiales`, `funciones`).

## Qué se pregunta en los exámenes

En `docs/datos/admision-unmsm.csv` hay **5 preguntas de San Marcos** clasificadas en esta unidad:

| Periodo (pregunta) | Qué piden | Idea |
| --- | --- | --- |
| 2023-I (40) | Reconstruir una cúbica con dos raíces, su término independiente y su suma de coeficientes. Trampa: confundir P(0) con P(1) | 2 (la parte de P(0) y P(1)); el resto es de Factorización (decisión 5) |
| 2024-II (36, áreas D y E) | Polinomio con un coeficiente desconocido y una raíz conocida: evaluar para hallarlo. Trampa: responder el coeficiente y no lo que se pide | 2 |
| 2025-II (39, áreas B y C) | Se da P con el argumento desplazado, P(x + a); piden término independiente y suma de coeficientes. Trampa: evaluar en 0 y en 1 sin despejar | 2 |
| 2026-I (40, áreas D y E) | Grado absoluto de un polinomio de dos variables con exponentes en función de un parámetro. Trampa: sumar los grados de todos los términos | 3 |
| 2026-II (42, área E) | Evaluar una cúbica factorizada en dos valores y sumar | 2 |

**Cuatro de las cinco son de valor numérico** y las cuatro traen un giro (P(0) contra P(1), un coeficiente por hallar,
el argumento desplazado, la forma factorizada). El valor numérico es además la base de lo más preguntado de la unidad
siguiente (teorema del resto). El banco Cuzcano trae unas 23 fichas, con otro reparto: polinomios homogéneos 7, grado
absoluto y relativo 5, completos y ordenados 4, reconocimiento de polinomios 3 e igualdad 3 (`docs/temario-completo.md`).
En el repo no hay preguntas de la UNI clasificadas (semana 5 de su sílabo). La prueba del curso
(`catalogo/pruebas/algebra.json`) no tiene **ningún** ítem de esta unidad.

---

## 0. Diagnóstico de la teoría actual contra el contrato

`polinomios.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tenía 5 ideas (`grados`, `valor-numerico`,
`completo-ordenado`, `igualdad`, `operaciones`) y tres mesas con retos comprobados. Cosas buenas que se quedan: el punto
que se arrastra por la curva de P, las casillas con el 0 que falta, «coinciden en x = 1, ¿son el mismo polinomio?» y la
cuadrícula del producto.

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Cuatro ideas juegan con una tabla (`alg-tabla`) y una con ejes.
   La feria de Juliaca y el reparto solo están escritos en «Lee».
2. **Puntos 2, 3 y 12: no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`.** Las consignas describen
   controles («Cambia los exponentes del primer término y mira…»).
3. **Punto 13: ningún ejercicio trae `datos`.** No hay ejemplos resueltos (0 de 75). El glosario trae 13 términos sin
   `simple` y con un ejemplo o ninguno.
4. **Punto 9: el orden falla desde el principio.** «Término semejante», la base de toda la unidad y el error objetivo de
   la matriz («sumar coeficientes de términos no semejantes»), se presenta recién en la última idea. Las cuatro
   anteriores ya operan con términos.
5. **Regla 3: dos predicciones ya se vieron en el juego.** En `grados` la lectura del juego da GA en vivo y la predicción
   pide un GA; en `operaciones` la lectura da el producto entero y la predicción pide uno de sus coeficientes.
6. **Códigos repetidos:** la predicción de `operaciones` trae dos incorrectas con TAL-SEMEJANTE; «Ahora tú» de
   `igualdad`, tres con TAL-COEF.
7. **Punto 7:** las lecturas y los pasos de «Mira» separan igualdades con «   ·   » («GR(x) = 2 · GR(y) = 3 · GA = 4»),
   que en álgebra se lee como una multiplicación.
8. **§5b: colores viejos.** El grado, el valor y el resultado van en verde junto al naranja de x (protanopía: 0,010) y
   «lo que falta» va en carmín.
9. **«Así se resuelve» es el generador de «Ahora tú» con la semilla + 900** en las cinco ideas, y «Ahora tú» no llega
   a examen: no hay coeficiente desconocido, argumento desplazado, forma factorizada ni exponentes con parámetro, que es
   justo lo que San Marcos pregunta.
10. Detalles: la cabecera dice «3.º de secundaria»; la ficha dice `potencial_visual: bajo` e `investigacion: null`.

---

## 1. Las ideas, en orden

**Seis ideas.** Las cinco de hoy conservan su `id` y entra una nueva al inicio. No hace falta partir la unidad ni
declarar `septimaIdea` (decisión 3).

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `terminos-semejantes` (nueva) | Términos semejantes | Solo se juntan los términos semejantes, los de la misma parte literal: se suman los coeficientes y la parte literal queda igual. |
| 2 | `valor-numerico` | Valor numérico | Evaluar P(a) es cambiar cada x por a y operar; P(1) es la suma de los coeficientes y P(0), el término independiente. |
| 3 | `grados` | Grado absoluto y relativo | El grado de un término es la suma de sus exponentes; el grado absoluto es el mayor de esos grados y el relativo a x, el mayor exponente de x. |
| 4 | `completo-ordenado` | Completo, ordenado y homogéneo | Un polinomio completo de grado n tiene n + 1 términos, contando los de coeficiente 0; es homogéneo si todos sus términos tienen el mismo grado. |
| 5 | `igualdad` | Polinomios idénticos | Dos polinomios son idénticos si tienen el mismo coeficiente en cada potencia; coincidir en un valor de x no basta. |
| 6 | `operaciones` | Multiplicar polinomios | Multiplicar es cada término de uno por cada término del otro, y después juntar los semejantes; el grado del producto es la suma de los grados. |

`pregunta` (Resumen): 1 «¿Qué términos de un polinomio se pueden juntar en uno solo?» · 2 «¿Cuánto vale un polinomio
cuando x vale 3?» · 3 «¿Cómo se halla el grado de un polinomio con dos letras?» · 4 «¿Cuántos términos tiene un
polinomio completo?» · 5 «¿Cuándo dos polinomios son el mismo polinomio?» · 6 «¿Cómo se multiplican dos polinomios sin
perder ningún término?».

`actividad`: 1 «Juntar dos pedidos de losetas y contar las piezas de cada forma.» · 2 «Cambiar el tamaño de la loseta y
ver cuánto cubre el pedido.» · 3 «Armar piezas multiplicando medidas y contar cuántas se multiplican.» · 4 «Acomodar un
pedido en un casillero con una casilla por potencia.» · 5 «Ajustar un pedido hasta que sea igual a otro, casilla por
casilla.» · 6 «Armar un piso rectangular y contar las piezas que salen.»

**Por qué va cada una ahí y qué da por sabido**

1. **Términos semejantes (nueva).** Es la base: las otras cinco operan con términos. Presenta polinomio, término,
   coeficiente y parte literal, y hace la suma y la resta de polinomios (tema «Operaciones con polinomios»). Ataca el
   error objetivo de la matriz (3x + 2x² = 5x³) y la falta de cierre (AL7: 8x + 14 = 22x). Da por sabido la potencia
   (Exponentes y radicales, que es su `requiere`) y las cuatro operaciones con enteros. Estrena: polinomio, término,
   parte literal, semejante.
2. **Valor numérico.** Sube al segundo lugar porque continúa el objeto de la idea 1 (el mismo pedido, con otra loseta)
   y porque es lo que más pregunta San Marcos. Su nivel examen trae las cuatro preguntas reales: P(0) contra P(1), el
   coeficiente desconocido con P(a) dado, la forma factorizada y el argumento desplazado P(x + a). Estrena: evaluar,
   valor numérico, variable.
3. **Grados.** Necesita la potencia y el término (idea 1). Su nivel examen trae exponentes con parámetro (San Marcos
   2026-I) y «para qué n es un polinomio» (reconocimiento, 3 fichas del banco). Estrena: grado, grado absoluto, grado
   relativo.
4. **Completo, ordenado y homogéneo.** Necesita el grado (idea 3). Es lo que la unidad siguiente da por sabido: Ruffini
   y Horner piden el polinomio completo y ordenado, con sus ceros. Estrena: completo, ordenado, homogéneo.
5. **Idénticos.** Necesita las casillas de la idea 4 y el valor numérico de la idea 2 (coincidir en un punto). Trae el
   polinomio idénticamente nulo en la regla. Estrena: idéntico, idénticamente nulo.
6. **Multiplicar.** Al final, porque junta todo: términos semejantes (1), grado (3) y, en su nivel examen, igualdad (5)
   y valor numérico (suma de coeficientes de un producto). Estrena: producto de polinomios (el término), monomio.

**Qué no entra** (es de otra unidad): dividir, Ruffini y el teorema del resto (División de polinomios); «si P(a) = 0,
x − a es factor» y reconstruir un polinomio por sus raíces (Factorización, `teorema-factor`); raíces y su número
(Ecuaciones polinomiales); la gráfica de un polinomio (Funciones, `polinomial`). Aquí «P(2) = 0» es solo un valor
numérico que vale cero.

---

## 2. Objeto de la primera pantalla

El hilo de la unidad es **el pedido de losetas del maestro Rubén**, un albañil que enchapa un patio en Juliaca. La
tienda vende tres piezas: la **loseta** cuadrada, de x dm de lado; la **tira**, de x dm por 1 dm; y el **cuadradito**,
de 1 dm por 1 dm. La loseta viene en varios tamaños (2, 3, 4, 5 o 6 dm: las medidas comerciales de 20 a 60 cm), por eso
su lado se llama x. Un pedido de 2 losetas, 3 tiras y 4 cuadraditos cubre 2x² + 3x + 4 dm². Continúa el hilo de
Productos notables (áreas de piezas que se arman) y la «loseta» de Exponentes y radicales.

La letra es siempre **un número** (el lado, en dm), nunca la pieza: 2x² es «lo que cubren 2 losetas», no «2 losetas».
Es a propósito, contra AL3 (letra como objeto: «3a + 2p son 3 manzanas y 2 peras»).

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Dos pedidos de losetas, tiras y cuadraditos**, uno encima del otro, y debajo los dos juntos | coeficiente = cuántas piezas; parte literal = qué pieza (x², x o nada); semejantes = piezas de la misma forma |
| 2 | **El mismo pedido con losetas de otro tamaño**: la loseta y la tira crecen, el cuadradito no | x = el lado elegido; P(x) = los dm² que cubre; con x = 1 cada pieza cubre 1 dm² |
| 3 | **Las piezas del depósito de Rubén con dos medidas**, x e y: una varilla (x), una plancha (x por y), un bloque (x por x por y) | grado de un término = cuántas medidas se multiplican |
| 4 | **El casillero de la tienda**, con una casilla por potencia (bloque x³, loseta x², tira x, cuadradito) | completo = ninguna casilla sin número; casilla vacía = 0 |
| 5 | **Dos pedidos en el casillero, uno debajo del otro** | idénticos = el mismo número en cada casilla |
| 6 | **Un piso rectangular de (2x + 1) por (x + 3) dm**, partido en tramos | cada tramo de un lado por cada tramo del otro = una pieza |

Pieza nueva del kit: **`alg-losetas`** (dibujo de prueba, `data-prueba`), con su prueba numérica de encuadre y rótulos.
En la fase 2 trae los objetos de la idea 1 (`piezas`, `pedido`, `giro` y `lote`, el terreno de un ejemplo); los de las
ideas 2 a 6 se le agregan en la fase 3. `alg-tabla`, `ejes` y `alg-baldosas` quedan para «Mira», los ejemplos y el laboratorio, al lado del objeto.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «Rubén junta dos pedidos de piezas para el mismo patio.» **Completa el pedido 2 para que los dos juntos cubran 3x² + 7x + 5.** | `l`, `t`, `c`: losetas (0–2), tiras (0–4) y cuadraditos (0–4) del pedido 2; el pedido 1 es fijo, 2x² + 3x + 1 | `l === 1 && t === 4 && c === 4` | «(2x² + 3x + 1) + (x² + 4x + 4) = 3x² + 7x + 5» | «Listo: losetas con losetas y tiras con tiras. Ningún montón se mezcla con otro.» |
| 2 | «El pedido de Rubén es 2x² + 3x + 4. La loseta viene en cinco tamaños.» **Elige el lado de la loseta para que el pedido cubra exactamente 48 dm².** | `a` (lado, 2–6 dm; existe como control `a`) | `a === 4` | «P(4) = 2 · 4² + 3 · 4 + 4 = 32 + 12 + 4 = 48 dm²» | «Listo: cada x se cambió por 4. El 4 de los cuadraditos no cambió.» |
| 3 | «P = 3xᵃyᵇ − 2xy³ + 5x². Cada exponente dice cuántas veces se multiplica esa letra.» **Lleva el primer término a grado 8 sin que el exponente de y pase de 3.** | `a`, `b`, 0–5 (existen) | `a === 5 && b === 3` | «3x⁵y³: 5 + 3 = 8 letras multiplicadas; GR(x) = 5 y GR(y) = 3» | «Listo: el grado del término suma sus exponentes; el relativo mira una sola letra.» |
| 4 | «Rubén apunta su pedido en desorden: 4x + x³ − 2 + 3x².» **Acomódalo en el casillero, de la potencia mayor a la menor.** | `p` (el polinomio; existe) y `o`, el orden en que se escribe (nuevo) | `p` el de la misión y `o === 'baja'` | «x³ + 3x² + 4x − 2: 4 casillas, de x³ a x⁰, y ninguna vacía» | «Listo: ordenado y completo. Mira otro pedido: ¿le queda alguna casilla vacía?» |
| 5 | «P = ax² + (b − 1)x + 3 y Q = 2x² + 5x + 3.» **Ajusta a y b hasta que P y Q coincidan en las tres casillas.** | `a`, `b` (existen) | `a === 2 && b === 6` | «Coinciden 3 de 3 casillas: P ≡ Q» | «Listo: mismo coeficiente en cada potencia. Son el mismo polinomio.» |
| 6 | «El piso mide (x + a) por (x² + bx + 2).» **Elige a y b para que el producto sea x³ + 3x² + 4x + 4.** | `a`, `b`, −3 a 3 (existen) | `a === 2 && b === 1` | «(x + 2)(x² + x + 2) = x³ + 3x² + 4x + 4: 6 productos, 4 términos» | «Listo: seis productos, y los que tienen la misma potencia se juntaron.» |

Para que la predicción quede fuera de lo jugado: el juego 1 solo tiene una letra; el 2 va de 2 a 6 dm (nunca 1 ni 0);
el 3 muestra el grado de cada término y los relativos, **no el absoluto** (hoy lo muestra); el 4 llega a grado 3; el 5
nunca evalúa; el 6 multiplica grado 1 por grado 2. Ningún `bien` dice la respuesta de su predicción.

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias, nunca la fórmula. **No hay datos peruanos ni
porcentajes por ítem.** Respaldo: AL3 y AL7 son parciales (Küchemann 1981; Booth 1984); los PO son hipótesis del
proyecto (`plantillas/polinomios/`); las trampas 44 y 45 salen de las alternativas de San Marcos. Todo TAL- es hipótesis
de diseño y va a `rutinas/teoria-algebra.md` al cerrar la unidad. Ninguna predicción repite un código.

**Idea 1.** «En otro pedido hay piezas rectangulares de x dm por y dm. Rubén apunta 2 de ellas como 2xy; su ayudante
apunta otras 3, giradas, como 3yx. ¿A qué es igual 2xy + 3yx?» Datos: cada pieza es un rectángulo de x dm por y dm; xy
quiere decir x · y.

| Opción | Qué mide |
| --- | --- |
| 5xy | Correcta: girada, la pieza cubre lo mismo; y · x = x · y |
| «No se pueden juntar» | El orden de las letras cambia la parte literal (TAL-ORDEN, hipótesis nueva) |
| 5x²y² | Al sumar, también «suma» las letras: confunde sumar con multiplicar (TAL-SUMA-POT, hipótesis nueva; el mismo error de 3x + 2x = 5x²) |
| 6xy | Multiplica los coeficientes (TAL-SUMA-MULT, hipótesis nueva) |

**Idea 2.** «Si las losetas midieran 1 dm de lado, ¿cuántos dm² cubriría el pedido 2x² + 3x + 4?» Datos: 1² = 1.

| Opción | Qué mide |
| --- | --- |
| 9 dm² | Correcta: cada pieza cubre 1 dm²; es la suma de los coeficientes |
| 4 dm² | Se queda con el término independiente: confunde P(1) con P(0) (PO12; trampa 44 de San Marcos) |
| 5 dm² | Suma solo los términos con x y deja fuera el 4 (TAL-INDEP-FUERA, hipótesis nueva) |
| 2 dm² | Se queda con el coeficiente principal (PO20) |

**Idea 3.** «Los términos de 3x²y − 2xy³ + 1 tienen grados 3, 4 y 0. ¿Cuál es el grado absoluto del polinomio?» Datos:
los grados de sus tres términos.

| Opción | Qué mide |
| --- | --- |
| 4 | Correcta: el mayor de los grados |
| 7 | Suma los grados de todos los términos (PO11; trampa 45 de San Marcos 2026-I) |
| 3 | Toma el grado del primer término, o cuenta los términos (PO9) |
| 5 | Suma los dos grados relativos, que salen de términos distintos (PO28) |

**Idea 4.** (la de hoy) «Si x⁵ − 3x² + 1 se escribe completo y ordenado, ¿cuántos términos tiene?» Datos: los términos
que faltan se escriben con coeficiente 0.

| Opción | Qué mide |
| --- | --- |
| 6 | Correcta: de x⁵ a x⁰ |
| 3 | Cuenta solo los escritos (PO1) |
| 5 | Olvida la casilla de x⁰ (PO9) |
| 4 | Agrega un solo término (TAL-COMPLETO, hipótesis) |

**Idea 5.** (la de hoy, con el objeto) «Con losetas de 1 dm, los pedidos x² + 1 y 2x cubren lo mismo: 2 dm². ¿Son el
mismo polinomio?» Datos: 1² + 1 = 2; 2 · 1 = 2.

| Opción | Qué mide |
| --- | --- |
| No: con otra loseta cubren distinto | Correcta |
| Sí: valen lo mismo cuando x = 1 | Un valor común basta (TAL-UNVALOR, hipótesis) |
| Sí: los dos tienen dos términos | Compara la cantidad de términos y no los coeficientes (TAL-CUENTA-TERM, hipótesis nueva) |
| No se sabe sin probar más valores | No ve que los coeficientes ya deciden (TAL-COEF, hipótesis) |

**Idea 6.** «P tiene grado 2 y Q tiene grado 3. ¿Qué grado tiene P · Q?» Datos: x² · x³ = x⁵ no se da (es la respuesta);
solo «el grado es el mayor exponente de x».

| Opción | Qué mide |
| --- | --- |
| 5 | Correcta: los exponentes se suman |
| 6 | Multiplica los grados (PO5) |
| 3 | Se queda con el mayor, como en una suma (PO23) |
| 1 | Resta los grados, como en una división (TAL-GRADO-RESTA, hipótesis) |

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| x, y | las variables: números que pueden cambiar. En las ideas 1 y 2, x es el lado de la loseta en dm | Nunca son «la loseta» ni «la papa»: la leyenda dice «x: lado de la loseta, en dm» |
| P, Q | nombres de polinomios; P(x) se lee «P de x» y P(3), «P de 3» | **Aviso en «Lee» de la idea 2:** P(3) no es «P por 3» |
| a, b, c, d | coeficientes de una forma general (ax² + bx + c) y, en una regla, dos coeficientes cualesquiera (axⁿ + bxⁿ) | Como en Productos notables: a naranja y b turquesa cuando son los dos que se operan |
| m, n, k | números por hallar: en un exponente (xᵐ⁺²), en un coeficiente ((m − 2)x²) o sueltos (k) | **Choca con «m» de metro:** donde hay m o n por hallar, las medidas van en dm; n es además «grado n → n + 1 términos» en la idea 4: se avisa en su regla |
| GA, GR(x) | grado absoluto; grado relativo a x | La escritura de academia («G.A.», «G.R.ₓ») se nombra una vez en la regla de la idea 3 |
| ≡ | idéntico: igual para todo valor de x | Se presenta en «Lee» de la idea 5; antes de esa idea no se usa |
| · | multiplicar; entre un número y una letra no va nada (3x, xy) | **Sale el separador «   ·   » entre igualdades** de lecturas y de «Mira»; solo queda en la regla grande, donde cada igualdad va en su línea |
| xⁿ con n = 0 | x⁰ = 1: el término independiente es el de x⁰ | Viene de Exponentes y radicales; se recuerda en «Lee» de la idea 4 |

---

## 6. Mapa de colores por magnitud (§5b)

Sigue a las dos unidades anteriores de la rama: **lo primero naranja, lo segundo turquesa, la base en tinta y violeta
para el resultado y para lo que se olvida.** Sin verde (iría junto al naranja) ni carmín (es de los ángulos).

| Token | Magnitud |
| --- | --- |
| `o` naranja | el primer polinomio de una suma, una resta, una comparación o un producto, y sus términos (el pedido 1, P); el exponente de x (ideas 3 y 4); el número que entra en lugar de x (idea 2) |
| `i` turquesa | el segundo polinomio y sus términos (el pedido 2, Q); el exponente de y; el número que entra en lugar de y |
| `f` violeta | el resultado, que es lo que casi siempre se pide: el polinomio reducido, P(a), el grado, el número por hallar; y lo que se olvida: los 0 de las casillas vacías (idea 4) y las casillas que dan la misma potencia en un producto (idea 6) |
| tinta | las letras x e y (la «base»), los nombres P y Q, los términos de un polinomio que está solo, lo que se pide con «?» |
| `h` carmín, `d` verde | **no se usan** |

Pares que van juntos: naranja–turquesa 0,114, naranja–violeta 0,189, turquesa–violeta 0,101 (molde §5b).

Avisos:
- Dos magnitudes de un mismo problema nunca comparten color. Si un problema junta dos polinomios y además un valor de
  x o exponentes con parámetro, los colores son de los polinomios y lo demás va en tinta.
- En «Predice» y en las figuras de los ejemplos, lo pedido va con «?» en tinta; el violeta aparece recién en el
  resuelto.
- En el objeto, las piezas llevan el color de su pedido (naranja o turquesa) y se distinguen por su **forma**, no por
  su color: el color no dice qué pieza es (WCAG 1.4.1).
- Las ideas 2 a 6 conservan sus colores viejos (verde y carmín) hasta que se reescriban en la fase 3; la prueba propia
  de la unidad comprueba hoy solo la idea 1.

---

## 7. Práctica: qué existe y qué falta por idea

**Lo que existe hoy:**
- **Escena `polinomios`** («La máquina de Ruffini», borrador 0.1.0, tres unidades, 22 casos verificados aparte). Casi
  toda es de División de polinomios. De esta unidad tiene los tipos del motor `valorEnCero`, `valorEnUno`, `grados`,
  `gradoProducto`, `gradoPotencia`, `terminosCompleto` y cuatro problemas de papel (p1 a p4, sin `datos`).
- Tres mesas del laboratorio y los generadores de «Ahora tú» dentro de la teoría. Ningún generador de práctica
  (formato `predicciones`) y ningún ítem en la prueba del curso.

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Términos semejantes | nada | tipos «reducir», «sumar dos polinomios», «restar con signos», «dos letras», «exponentes por hallar para que sean semejantes», «signos de agrupación», «perímetro»; papel |
| 2 Valor numérico | mesa `curva-cubica`; tipos del motor de la escena; papel p1 | tipos «evaluar con negativo», «P(0) y P(1)», «forma factorizada» (2026-II), «coeficiente desconocido» (2024-II), «argumento desplazado» (2025-II); papel con datos |
| 3 Grados | tipo `grados` del motor; papel p2 | tipos «GA y GR», «exponentes con parámetro» (2026-I), «¿para qué n es polinomio?», «GA y GR dados: halla m y n»; papel |
| 4 Completo, ordenado y homogéneo | tipo `terminosCompleto`; papel p4 | tipos «n + 1 términos», «los ceros que faltan», «homogéneo: halla m», «completo y ordenado con parámetros»; una mesa; papel |
| 5 Idénticos | mesa `dos-curvas` | tipos «m y n por igualdad», «coeficientes indeterminados», «idénticamente nulo»; papel |
| 6 Multiplicar | mesa `producto-libre`; tipos `gradoProducto` y `gradoPotencia`; papel p3 | tipos «coeficiente de xᵏ», «grado de un producto y de una potencia», «suma de coeficientes de un producto», «producto por igualdad»; papel |

Propuesta: una plantilla nueva de formato `predicciones`, **`plantillas/polinomios-practica/`**, con los tipos separados
por idea (`TIPOS_POR_IDEA`), prueba en 400 semillas, `casos.json` verificado aparte y papel de 5 a 10 por idea con sus
datos; el modelo es `plantillas/productos-notables/`. La escena `polinomios` pasa a «Más mesas del tema» en esta unidad
(`"rehacer": true`), como `cuadrado-crece`, y sigue sirviendo a División hasta que esa unidad se rehaga. Faltan dos
ítems de la unidad en la prueba del curso (uno de valor numérico y uno de grados).

---

## 8. Datos del mundo

La unidad casi no los necesita: son objetos de todos los días con medidas de problema.

| Dato | ¿Fuente? |
| --- | --- |
| Losetas de 2 a 6 dm de lado, tiras de 1 dm de ancho y cuadraditos de 1 dm; el patio, el depósito y el casillero | Valores de problema, posibles (hay losetas comerciales de 20 a 60 cm) y sin fuente. No se afirma ningún precio ni medida real |
| Perímetro y área de un rectángulo (ejemplos de nivel 3) | Relaciones de geometría: van en `datos`, sin fuente |
| Historia: Viète y las letras para cantidades conocidas y desconocidas (1591) | Ya está en la unidad con su fuente (MacTutor, biografía de Viète). Se queda; se vuelve a leer la fuente al cerrar la unidad (decisión 10) |

---

## 9. Riesgos de orden (`requiere`)

- **`requiere` no cambia:** `algebra.exponentes-y-productos-notables` (la potencia, x⁰ = 1, xᵃ · xᵇ = xᵃ⁺ᵇ) y
  `aritmetica.cuatro-operaciones` (de otro curso: solo aconseja). Productos notables va antes en la rama, pero la
  unidad no lo exige: la distributiva se recuerda en «Lee» de la idea 6 y el glosario la marca «Se explica en
  Productos notables».
- **«Binomio»** se define en Binomio de Newton y **«valor absoluto»** en Valor absoluto y radicales (decisiones
  escritas): aquí no se definen. «Binomio» casi no hace falta («polinomio de dos términos»).
- **«Coeficiente» y «término independiente»** están definidos hoy en `ecuaciones-lineales-y-cuadraticas`, de otra
  rama. Aquí se usan desde la idea 1, dichos en palabras en «Lee» y en la leyenda (decisión 6).
- **No se adelanta** nada de División ni de Factorización: «P(2) = 0» se trata como un valor numérico, sin «raíz»,
  «factor» ni «resto».
- La idea 5 usa en su predicción el valor numérico (idea 2) y en su juego las casillas (idea 4); la idea 6 usa la
  igualdad (idea 5) solo en su nivel examen. Ninguna idea usa algo posterior.
- Las unidades que piden esta (`division-de-polinomios`) no cambian: los `id` de las cinco ideas viejas se conservan y
  no hay avance que migrar (la idea nueva no reemplaza a ninguna).

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Entra una idea nueva al inicio, `terminos-semejantes`, y la unidad queda en seis.** Motivo: es la base de las
   otras cinco y hoy se presentaba al final. Descartado: dejar los semejantes dentro de `operaciones`, como hoy.
2. **El hilo de la unidad es el pedido de losetas del maestro Rubén** (loseta de x por x, tira de x por 1, cuadradito
   de 1 por 1). Motivo: la letra es una medida que cambia y no una cosa (AL3); con x = 1 y x = 0 explica solo por qué
   P(1) es la suma de coeficientes y P(0) el término independiente; y continúa las piezas de Productos notables.
   Descartado: los precios de la feria (x: el kilo de papa), que no dan sentido a x² ni a xy.
3. **El argumento desplazado, P(x + a), y el coeficiente desconocido van como nivel examen de `valor-numerico`, no
   como séptima idea.** Motivo: son un paso más sobre evaluar, la unidad se queda dentro del tope de seis y la regla
   los dice en una línea. Descartado: una idea propia con `septimaIdea`; se retoma si el lector en frío se pierde ahí.
4. **Colores:** primer polinomio naranja, segundo turquesa, resultado y lo que se olvida en violeta, letras y nombres
   en tinta; fuera el verde y el carmín de hoy. Motivo: es el mismo esquema de las dos unidades anteriores de la rama.
   Descartado: un color por potencia (x² naranja, x turquesa), que choca con «un color por magnitud» en las ideas con
   dos polinomios.
5. **San Marcos 2023-I (40), reconstruir una cúbica por sus raíces, pasa a Factorización** (`teorema-factor`) cuando
   esa unidad se rehaga; aquí queda solo su mitad de P(0) y P(1). Motivo: necesita «si a es raíz, x − a es factor», que
   no se debe adelantar. Descartado: resolverla aquí con un sistema de ecuaciones.
6. **«Coeficiente» y «término independiente» se quedan definidos donde están** (Ecuaciones lineales y cuadráticas) y
   aquí salen como «Se explica en…». Motivo: no tocar otra unidad en esta fase, y la idea 1 ya estrena cuatro palabras
   (el tope). Descartado: mudarlas a Polinomios, que sería su casa natural; se puede hacer al cerrar la unidad.
7. **La predicción de la idea 1 es 2xy + 3yx.** Motivo: es algo que el juego no muestra (dos letras) y se revela
   girando la pieza. Descartado: «¿3x + 2x² se puede juntar?», porque el juego ya lo deja a la vista.
8. **Cambian las predicciones de `grados` y `operaciones`** (el juego ya mostraba la respuesta) y la de `igualdad` se
   cuenta con losetas. Descartado: dejarlas y quitar la lectura del juego.
9. **Pieza nueva `alg-losetas`, aparte de `alg-objeto`.** Motivo: `alg-objeto` ya tiene ocho objetos de las otras dos
   unidades y 839 líneas; así ninguna unidad publicada cambia. Descartado: agregar los objetos a `alg-objeto`.
10. **La historia de Viète se queda**, con su fuente (MacTutor). Motivo: ya estaba publicada con fuente. Pendiente:
    releer la fuente al cerrar la unidad; si no confirma la fecha, la unidad queda sin historia, como Exponentes.
11. **Práctica:** plantilla nueva `polinomios-practica` (formato `predicciones`) por idea, y la escena `polinomios` a
    «Más mesas del tema» en esta unidad. Descartado: repartir los tipos del motor de la escena, que no leen la idea.
12. **Ficha del catálogo (al cerrar la unidad):** `potencial_visual: alto`, `investigacion` apuntando a
    `docs/investigacion/algebra-funciones-ideas-erroneas.md` (AL3 y AL7) y `grado: 3` sin tocar (es informativo).
13. **Títulos con el nombre del tema** («Valor numérico», «Polinomios idénticos»), como en la etapa 4; los `id` no
    cambian.

---

## Cambios (19 nov)

Al escribir las ideas 2 a 6 (fase 3) cambié lo siguiente respecto de lo propuesto arriba. Ninguno toca a otra unidad.

1. **Idea 5, Predice:** la opción «Sí: los dos tienen dos términos» era falsa tal como estaba escrita (2x tiene un solo
   término). Pasa a «Sí: los dos tienen 2 piezas» (TAL-CUENTA-PIEZAS): una loseta y un cuadradito contra dos tiras, que
   sí es un error de contar piezas y no formas.
2. **Idea 6, Juega:** el objeto de la primera pantalla tiene que estar en el juego, y un factor de grado 2 no se puede
   dibujar como lado de un piso. El juego es el piso de (2x + a) por (x + b) dm, con la misión «que cubra 2x² + 7x + 3»
   (a = 1, b = 3; el otro orden da 2x² + 5x + 3, así que hay un solo caso). La cuadrícula de grado 1 por grado 2 queda
   en «Mira» y en los ejemplos (alg-tabla), y la predicción (grado 2 por grado 3) sigue fuera de lo jugado.
3. **Idea 4, Juega:** el control nuevo `o` ordena las columnas del casillero («Como lo apuntó», «De mayor a menor», «De
   menor a mayor»); el casillero siempre tiene una casilla por potencia, así que «ordenado» y «completo» se ven a la vez.
   Cuatro pedidos de grado 2 o 3.
4. **Idea 3, objeto:** las piezas del depósito (varilla, plancha y bloque) solo llegan a grado 3 y el juego llega a
   grado 8. El depósito queda en «Lee»; el juego, Predice y «Mira» usan las **fichas de letras** (una ficha naranja por
   cada x y una turquesa por cada y que se multiplica), en la misma pieza.
5. **Letras de las reglas:** la regla de la idea 2 evalúa en k (P(k)), no en a, porque a es un coeficiente en la tabla
   de letras; la de la idea 5 compara a₂, a₁, a₀ con b₂, b₁, b₀, porque m y n son números por hallar. La tabla de
   letras va también en el campo `letras` de la unidad (validador, `letras-datos`).
6. **Glosario:** la idea 2 estrena «variable» (que ya estaba, ahora con `simple` y tres ejemplos), «evaluar» y «valor
   numérico»; la idea 5, «idéntico» e «idénticamente nulo»; la 6, «monomio» y «producto de polinomios». Ninguna
   definición dice la respuesta de su Predice.
7. **Prueba del curso:** las formas de álgebra ya tienen 10 pares, así que los dos ítems de la unidad (pp-01, valor
   numérico con P(1) y P(0); pp-02, grado absoluto con exponentes que dependen de n) van a la **reserva**, con su
   verificador.
8. **Escena vieja:** `plantillas/polinomios/` lleva `"rehacer": ["algebra.polinomios"]` (la lista y no `true`): va a
   «Más mesas del tema» solo en esta unidad y sigue como escena principal en División de polinomios y en Ecuaciones
   polinomiales.
