# Propuesta de ideas: «MCD y MCM» (`aritmetica.mcd-y-mcm`)

Etapa 7 del plan de calidad, rama «Números y operaciones» (la de entrada de Aritmética), la quinta unidad, después de
«Sistemas de numeración», «Las cuatro operaciones», «Divisibilidad» y «Números primos y divisores» · fases 1 a 5 con
criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta ya se ejecutó (es el guion de la unidad) y tú la revisas después. Por eso la
última sección no pregunta: dice qué se decidió, por qué y qué se descartó. **No hay ningún conflicto crítico.**

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4 a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y el encargo delegado), las decisiones
de las etapas 2 a 6, la propuesta de Números primos como modelo (`docs/etapa6/propuesta-aritmetica.md`), esa unidad
terminada (`numeros-primos-y-divisores.js`, calidad 2) con su auditoría y su lector en frío, la de Divisibilidad (que
mandó aquí los restos con varios divisores y la inclusión y exclusión), la teoría de antes (`mcd-y-mcm.js`, v0.2.0), su
ficha en `catalogo/cursos/aritmetica.json`, sus plantillas (`fracciones`, `fracciones-problemas`), el informe
`docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md` (AR13), la matriz `docs/teoria/matriz/aritmetica.json`
(unidad 15), `docs/temario-completo.md` §15, la prueba del curso y `docs/datos/admision-unmsm.csv`; y las vecinas
(`numeros-primos-y-divisores.js`, `divisibilidad.js` y `numeros-racionales.js`), para no repetir ni adelantar.

## Qué se pregunta en los exámenes

El catálogo pone la unidad en la semana 17 de la UNI y en el tema 7 de San Marcos. En el CSV hay **6 preguntas de San
Marcos** clasificadas en esta unidad y **9 de Divisibilidad que necesitan el MCM** (decisión 1 de la Etapa 5): 15 en
total. Las describo con el resumen del CSV.

| Periodo (pregunta) | Qué piden | Dónde queda |
| --- | --- | --- |
| 2019-II (37), 2023-I (31, dos formas), 2023-II (32, dos formas), 2023-II (33), 2024-II (31) | Un número que deja el mismo resto con varios divisores, acotado, a veces múltiplo de un tercero (trampa: el producto en vez del MCM) | idea 4 |
| 2026-II (32, área A) | Restos distintos que se homogeneizan («le falta uno») | idea 4 |
| 2026-II (32, área D) | Tachar los múltiplos de tres primos, uno tras otro (trampa: no quitar los ya tachados) | idea 5 |
| 2025-I (31), 2026-II (32) | Coincidencias periódicas: la tercera coincidencia y las tomas hasta ella (trampa: la de hoy) | idea 2 |
| 2024-II (34) | Cortar varillas de largos con decimales en trozos iguales máximos (trampa: no homogeneizar) | idea 1 |
| 2019-II (39) | Dos números con su diferencia y su MCM: cocientes PESI | idea 3 |
| 2027-I (33) | Reconstruir dos números desde los cocientes de Euclides | idea 6 |
| 2027-I (32) | Edades en progresión geométrica y el MCD de dos | **no entra** (decisión 9) |

El banco Cuzcano tiene unas 104 fichas: relación entre MCD y MCM (32), MCD y MCM por descomposición canónica (18),
Euclides (16), aplicaciones (13) y cifras desconocidas (12). Son de academia: dicen qué se pregunta, no se copian.

**Lo que más pesa en San Marcos es el mismo resto con varios divisores (7 de 15).** La fracción continua no salió en
San Marcos, pero está en el temario del catálogo: va dentro de la idea de Euclides.

---

## 0. Diagnóstico de la teoría de antes contra el contrato

`mcd-y-mcm.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tenía 5 ideas (`mcd-cintas`, `mcm-coinciden`,
`euclides`, `mcd-por-mcm`, `fraccion-continua`) y cinco mesas (dos 3D).

1. **Punto 1: ninguna primera pantalla tenía un objeto.** Tiras abstractas (`arit-tiras`), una recta y tablas; la
   vendedora de Juliaca solo estaba escrita.
2. **Puntos 2, 3 y 12: sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`**; consignas que describen
   botones.
3. **Punto 13: ningún ejercicio traía `datos`** y no había ejemplos resueltos (0 de 75). El glosario tenía 9 términos
   sin `simple` y con un solo ejemplo.
4. **Colores fuera del mapa**: el MCD en verde y el MCM en carmín, y a naranja y b turquesa (dos datos del mismo tipo
   con colores distintos).
5. **Notación**: «·» para multiplicar (la rama usa ×), a y b para los números (en la rama son cifras).
6. **Una sola respuesta**: la predicción de Euclides tenía dos correctas ((35, 21) y (91, 21) tienen el mismo MCD).
7. **«Ahora tú» no llegaba a examen** y «Así se resuelve» era el mismo tipo con la semilla + 900. Faltaban los restos
   con varios divisores, la inclusión y exclusión, la k-ésima coincidencia y los largos con decimales.
8. **Práctica**: la escena `fracciones` (compartida con Racionales y Estadística) y `fracciones-problemas`, que mezcla
   fracciones y periódicos (contenido de Números racionales) con tres tipos de esta unidad, sin `datos`.
9. La cabecera decía «postulante de 3.º a 5.º».

---

## 1. Las ideas, en orden

Son **seis**. Cuatro conservan su `id` (con otra Predice), dos son nuevas y `fraccion-continua` entra en `euclides`.
No hace falta `septimaIdea`; el avance se migra (bloque en `REHECHAS_E6` de `nucleo/avance.js`, decisión 11).

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `mcd-cintas` | MCD: el trozo más largo | El MCD es el mayor que divide exacto a dos números: el trozo más largo sin sobrante. Lleva los primos comunes con su menor exponente. |
| 2 | `mcm-coinciden` | MCM: la primera coincidencia | El MCM es el menor múltiplo de los dos números: el primer boleto con los dos premios. Lleva todos los primos con su mayor exponente. |
| 3 | `mcd-por-mcm` | MCD, MCM y los cocientes | A = MCD × p y B = MCD × q, con p y q PESI. El MCM es MCD × p × q, y MCD × MCM = A × B. |
| 4 | `mismo-resto` | El mismo resto con varios divisores | Si N deja el mismo resto con A y con B, N menos ese resto es múltiplo del MCM. |
| 5 | `multiplos-tramo` | Múltiplos de uno o de otro | Múltiplos de A o de B: los de A más los de B, menos los de los dos, que son los múltiplos del MCM. |
| 6 | `euclides` | Euclides y la fracción continua | Si al dividir A entre B sobra r, MCD(A, B) = MCD(B, r). Se sigue hasta resto 0; los cocientes dan la fracción continua. |

`pregunta` (Resumen): 1 «¿Qué trozo corta dos cintas sin que sobre nada?» · 2 «¿Cuándo vuelven a coincidir dos cosas
que se repiten?» · 3 «¿Qué tienen que ver el MCD y el MCM de dos números?» · 4 «¿Qué cantidad deja el mismo resto con
bolsitas de distinto tamaño?» · 5 «¿Cuántos boletos ganan al menos un premio?» · 6 «¿Cómo se halla el MCD sin
descomponer en primos?».

**Por qué va cada una ahí y qué da por sabido**

1. **MCD.** Da por sabidos divisor, múltiplo y resto (Las cuatro operaciones), la descomposición canónica y PESI
   (Números primos). Estrena: divisor común, máximo común divisor.
2. **MCM.** Es la pareja del MCD, con el mismo método de primos (mayor exponente). Incluye la k-ésima coincidencia
   contando la de partida (San Marcos 2025-I y 2026-II). Estrena: múltiplo común, mínimo común múltiplo.
3. **Relación.** Usa las dos anteriores; su clave son los cocientes PESI (de Números primos). La predicción es el error
   que nombra la matriz: extender MCD × MCM = A × B a tres números. Estrena: cocientes PESI, contraejemplo.
4. **El mismo resto.** Usa el MCM (idea 2) y el circulito de Divisibilidad (N = Å + r). Es la idea con más preguntas de
   San Marcos. Estrena: resto común, homogeneizar.
5. **Múltiplos de uno o de otro.** Usa el MCM (los múltiplos de los dos son los del MCM) y el conteo de múltiplos de
   Divisibilidad (el cociente entero). Estrena: inclusión y exclusión, tramo.
6. **Euclides y la fracción continua.** Va al final porque es otro camino para el MCD, para cuando factorizar cuesta,
   y nadie en la unidad lo necesita antes. Estrena: algoritmo de Euclides, fracción continua, término.

**Qué no entra** (y adónde va): el MCD de fracciones con fórmula (Números racionales; aquí los largos con decimales se
pasan a centímetros), las fracciones irreductibles y equivalentes (Números racionales), la división por exceso en
Euclides (San Marcos 2027-I la usa; aquí todo es por defecto, decisión 9), las progresiones geométricas (Sucesiones),
las cifras desconocidas con MCD y MCM (sumarían la dificultad de Divisibilidad) y el MCD y MCM de polinomios (Álgebra).

---

## 2. Objeto de la primera pantalla

Sigue el mundo de la rama: **la promoción** (sus rollos de cinta para los moños de la fiesta y su rifa) y **el puesto
de doña Juana** (el paquete de caramelos).

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | Dos rollos de cinta cortados en trozos iguales | el trozo que entra en los dos = un divisor común; lo que sobra, naranja punteado |
| 2 | La plancha de la rifa con dos premios: caramelo (círculo) y gaseosa (cuadrito) | los boletos con los dos premios = los múltiplos comunes, en violeta |
| 3 | Los rollos cortados con su MCD y la cinta del MCM medida con cada rollo | p y q trozos del MCD; el MCM = q rollos A = p rollos B |
| 4 | El paquete de doña Juana empacado en bolsitas de 4 y de 6 | los sueltos de cada forma; sin ellos, un múltiplo común |
| 5 | La plancha de la rifa con dos premios, del 1 al 60 | los de los dos premios están en las dos cuentas |
| 6 | Un rollo medido con otro, después con lo que sobró, fila por fila | la última pieza que mide sin sobrante = el MCD |

Piezas (dibujos de prueba, `data-prueba`, con su prueba numérica de encuadre y rótulos; molde §6):
- **`arit-cintas`** (nueva): rollos de cinta a una sola escala, cortados en trozos iguales con lo que sobra punteado;
  filas compactas para Euclides; la cinta de un múltiplo común con contorno violeta.
- **`arit-reparto`** (nueva): el paquete de caramelos empacado en bolsitas de varios tamaños, una fila por tamaño; con
  el paquete cerrado, una bolsita y «× ?» (no dibuja cantidades que el problema no da).
- **`arit-boletos`** (de Divisibilidad, compartida): **un bloque nuevo, `premios: [A, B]`** con `marcarPremios`
  (todos, ninguno, solo los de los dos, solo los de uno). No cambia nada de lo que dibuja si no se pide.
- `arit-tabla` para la tabla de exponentes de la idea 3; `recta` y `ari-cubitos-3d` en el laboratorio.

---

## 3. Misión de «Juega» (meta que el motor comprueba; una sola manera en la grilla)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «La promoción corta dos rollos…» **Con los rollos de 18 m y 30 m, busca el trozo más largo sin sobrante.** | par (16-40, 18-30, 20-28), trozo 1–12 | 18-30 y 6 | «Trozos de 4 m: sobran 2 m y 2 m» | «6 m: 3 trozos en un rollo y 5 en el otro. Ninguno más largo sirve.» |
| 2 | «En la rifa, los múltiplos de un número ganan caramelo…» **Elige los premios para que el primer boleto con los dos sea el 20.** | caramelo 3–6, gaseosa 7, 8, 10, 15 | MCM = 20 (solo 4 y 10) | «Los dos premios: 21 y 42 (cada 21)» | «4 y 10: primero el 20. El 40, que es 4 × 10, llega después.» |
| 3 | «Arriba, los dos rollos cortados con su MCD…» **Elige dos rollos cuyo MCD sea 4 y su MCM, 48.** | A 12, 18, 20; B 8, 15, 16, 30 | solo 12 y 16 | «4 × 24 = 96 = 12 × 8» | «12 y 16: MCD 4 y MCM 48. Mira: 4 × 48 = 192, y 12 × 16 = 192.» |
| 4 | «Doña Juana empaca los mismos caramelos de dos formas…» **Busca entre 40 y 55 caramelos una cantidad que deje 1 suelto en las dos formas.** | N 10–60 | solo 49 | «N = 30: sobran 2 con 4 y 0 con 6» | «49: sobra 1 con 4 y con 6. Sin ese suelto, 48 se empaca justo.» |
| 5 | «La plancha va del 1 al 60…» **Elige los premios para que exactamente 24 boletos ganen algún premio.** | caramelo 3, 4, 5; gaseosa 6, 10, 15 | solo 3 y 10 | «20 caramelos, 10 gaseosas, 10 con los dos: ganan 20» | «3 y 10: 20 + 6, menos el 30 y el 60, que estaban dos veces.» |
| 6 | «La promoción mide un rollo con otro…» **Busca los dos rollos que necesitan seis mediciones.** | largo 48, 60, 84, 90; corto 24, 26, 35, 38 | solo 60 y 38 | «Pieza exacta: 2 m, en 3 mediciones» | «60 y 38: seis mediciones. La última pieza, de 2 m, entra exacto en todas.» |

Ningún `bien` dice la respuesta de su predicción, y ningún juego llega a ella: la idea 1 no tiene 24 y 36; la 2, ni 12
ni 18; la 3 trabaja con dos números; en la 4, el juego llega a 60 y la predicción es 61; en la 5, la plancha llega a 60
y la predicción es de 120; la 6 no tiene 91 ni 35.

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores, nunca la fórmula. AR13 (MCD por MCM) tiene respaldo parcial;
los AT son hipótesis (tabla «MCD y MCM (19 nov)» del informe de aritmética). Ninguna predicción repite un código, y
cada distractor da el valor de su error (la prueba de la unidad los rehace).

**Idea 1.** «Otros dos rollos miden 24 m y 36 m. Se cortan en trozos iguales, lo más largos posible, sin que sobre
nada. ¿Cuánto mide cada trozo?» — **12 m** · 72 m (AR13, el MCM) · 6 m (AT-NOMAX, un divisor común que no es el mayor) ·
24 m (AT-MENOR, el rollo menor).

**Idea 2.** «En la rifa grande, de 300 boletos, ganan caramelo los múltiplos de 12 y gaseosa los múltiplos de 18. ¿Cuál
es el primer boleto que gana los dos premios?» — **36** · 6 (AR13) · 216 (AT-PRODUCTO) · 30 (AT-SUMA).

**Idea 3.** «Con dos rollos, MCD × MCM da el producto de los dos largos. Con tres números, 4, 6 y 10, ¿cuánto da
MCD × MCM?» — **120** · 240 (AT-TRES: extiende la regla de dos números; el error de la matriz) · 480 (AT-MCM-PRODUCTO) ·
24 (AT-OLVIDA-TERCERO).

**Idea 4.** «Doña Juana prueba ahora con bolsitas de 4, de 6 y de 10, y en las tres le sobra 1 caramelo. El paquete
tiene más de 10. ¿Cuál es la menor cantidad que puede tener?» — **61** · 241 (AT-RESTO-PRODUCTO, la trampa de San
Marcos 2024-II) · 13 (AT-RESTO-DOS) · 60 (AT-RESTO-OLVIDA).

**Idea 5.** «La rifa grande tiene 120 boletos. Ganan caramelo los múltiplos de 4 y gaseosa los múltiplos de 6. ¿Cuántos
boletos ganan al menos un premio?» — **40** · 50 (AT-IE-SUMA, la trampa de San Marcos 2026-II) · 30 (AT-IE-DOBLE) · 10
(AT-IE-SOLO-AMBOS).

**Idea 6.** «Al medir un rollo de 91 m con uno de 35 m, entra 2 veces y sobran 21 m. Sin hacer más cuentas, ¿qué se
puede decir del MCD de 91 y 35, y del de 35 y 21?» — **Son iguales** · «El de 91 y 35 es el doble» (AT-EUC-COCIENTE) ·
«El de 35 y 21 es más chico» (AT-EUC-ACHICA) · «No se sabe sin calcular los dos» (AT-EUC-NOSE). Reemplaza a la de
antes, que tenía dos respuestas.

Ningún ejemplo del glosario ni de «Lee» usa los números de estas predicciones ni de las misiones (la prueba lo mira).

---

## 5. Lo que tiene que decir cada regla y adónde llega «Ahora tú»

| Idea | La regla dice | «Así se resuelve» (distinto de «Ahora tú») | «Ahora tú», hasta nivel examen |
| --- | --- | --- | --- |
| 1 | El MCD de dos (o tres) números es el mayor que divide a todos; con primos, los comunes con su menor exponente; PESI → 1; si A divide a B → A | cuántas bolsitas arma doña Juana con dos sabores | el trozo más largo; cuántos trozos; tres rollos; el MCD en primos; **largos con decimales (San Marcos 2024-II)**; **parcelas cuadradas** |
| 2 | El MCM es el menor múltiplo de los dos; con primos, todos con su mayor exponente; los demás comunes son múltiplos del MCM; la de partida es la primera vez | el cuadrado más pequeño con losetas | el primer boleto con los dos premios; dos alarmas; tres pastillas; el MCM en primos; **la tercera coincidencia (San Marcos 2026-II)**; **las tomas hasta la tercera (2025-I)** |
| 3 | A = MCD × p, B = MCD × q con p y q PESI; MCM = MCD × p × q; MCD × MCM = A × B solo con dos (4, 6 y 10 son un contraejemplo) | la suma de dos números con su MCD y su MCM | el otro número; el MCM desde el producto; el MCD o el MCM de k × A y k × B; **la suma desde la diferencia y el MCM (San Marcos 2019-II)**; **cuántos pares** |
| 4 | Mismo resto r con A y B → N − r múltiplo del MCM; si falta lo mismo, rₑ, N + rₑ lo es (homogeneizar) | el mayor de dos cifras con el mismo resto | el menor con el mismo resto; **restos distintos que se homogeneizan (2026-II)**; **el menor de tres cifras (2024-II)**; **el mayor de tres cifras**; **y múltiplo de un tercero (2023-I)** |
| 5 | de A o de B = de A + de B − de MCM; hasta L, el cociente entero; ninguno = total − (de A o de B); con tres, cada uno − cada par + los tres | cuántos no son de A ni de B | los de los dos a la vez; de uno o de otro; sin premio; un solo premio; **un tramo que no empieza en 1**; **tachar con tres primos (2026-II)** |
| 6 | MCD(A, B) = MCD(B, r); se divide hasta resto 0; los cocientes son los términos de la fracción continua | el MCD de dos rollos grandes y su fracción continua | el MCD con divisiones; la división que sigue; la fracción continua; el valor de [a; b, c]; **los números desde los cocientes y el MCD (San Marcos 2027-I)** |

---

## 6. Tabla de letras y símbolos (`def.letras`)

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| A, B, C | los números que se dan: un largo, un periodo, una bolsita | En mayúscula: en la rama, a, b y c son cifras |
| N | el número que se busca (los caramelos del paquete) | Como en Divisibilidad |
| k | un entero | Como en la rama |
| r, rₑ | el resto (lo que sobra) y lo que falta para otro grupo | Como en Divisibilidad y Las cuatro operaciones |
| p, q | los cocientes A ÷ MCD y B ÷ MCD, que son PESI | **Aviso**: en Números primos eran dos primos; aquí no tienen que serlo (la regla lo dice) |
| L | hasta dónde se cuenta en un tramo | Solo en la idea 5 |
| MCD(A, B), MCM(A, B) | máximo común divisor y mínimo común múltiplo | Como en el examen; en el glosario con su símbolo |
| Å | «múltiplo de A» (el circulito, `{ mult }`) | Con su glosa en los Datos de cada ejercicio que lo usa (`conMu`) |
| [2; 1, 3] | la fracción continua, con la parte entera primero | En los Datos de cada ejercicio que la usa |
| × | multiplicar | Nunca «·» (el «   ·   » solo separa dos relaciones en una regla) |

---

## 7. Mapa de colores por magnitud (§5b)

El criterio de la rama (el envase turquesa, lo que sobra naranja, lo que se busca violeta), leído para separar lo que
el alumno confunde (AR13): un color fijo por magnitud en las seis ideas, con su prueba en `mcd-y-mcm.test.js`
(`def.colores = { divisor: 'i', multiplo: 'f', sobra: 'o' }`).

| Token | Magnitud | Dónde se ve |
| --- | --- | --- |
| `i` turquesa, «divisor» | el MCD y los divisores comunes: lo que entra exacto en todos | el trozo de cinta, la pieza exacta de Euclides, el MCD en las cuentas y en la respuesta |
| `f` violeta, «multiplo» | el MCM y los múltiplos comunes: donde todos entran exacto | el boleto con los dos premios, la cinta del MCM, la hora en que coinciden |
| `o` naranja, «sobra» | lo que sobra y lo que falta | el pedazo de cinta, los caramelos sueltos, los restos de Euclides |
| tinta | A, B, C y N, los cocientes, los exponentes, k, cuántos, «?» | — |
| verde, carmín | **no se usan** | antes, el MCD iba en verde y el MCM en carmín; también en las mesas 3D |

Pares que van juntos (medidos en §5b): naranja–turquesa 0,114, naranja–violeta 0,189 y turquesa–violeta 0,101.

---

## 8. Práctica: qué existía y qué se hizo

**Antes:** la escena `fracciones` (borrador 0.1.0, compartida con Racionales y Estadística) y `fracciones-problemas`
(tipos `pesi`, `euclides` y `pg-mcd` de esta unidad, mezclados con fracciones y periódicos de Números racionales, sin
`datos`). La prueba del curso tenía un par de esta unidad (fr-02) en la reserva.

**Ahora:** **`plantillas/mcd-mcm/`** («Los rollos y la rifa», formato `predicciones`), primera en la ficha, con
`TIPOS_POR_IDEA` (25 tipos, de nivel 1 a examen, 9 de ellos con forma de San Marcos), prueba en 400 a 3000 semillas,
`casos.json` con un caso por tipo verificado aparte en Python y papel de 8 problemas (uno por idea y dos de examen de
San Marcos, 2026-II y 2024-II). `fracciones-problemas` deja de servir a esta unidad (decisión 7). La escena `fracciones`
pasa a «Más mesas del tema» (`"rehacer": ["aritmetica.mcd-y-mcm"]`), y su papel dice de qué unidad es cada problema.
Dos ítems nuevos para la prueba del curso, en la reserva (decisión 12).

---

## 9. Datos del mundo

La unidad no los necesita: los rollos, la rifa, el paquete, las alarmas, los camiones y las medicinas son situaciones
de problema, sin fuente. Medidas creíbles: rollos de 12 a 56 m, tablas de 2,4 a 4,2 m, losetas de 10 a 20 cm, ladrillos
de 6 a 12 cm. La historia (Euclides, *Elementos* VII.2, edición de D. E. Joyce) ya tenía fuente; se queda.

---

## 10. Riesgos de orden con otras unidades (`requiere`)

- **`requiere: ['aritmetica.numeros-primos-y-divisores']` es correcto y basta.** De ahí se usan la descomposición
  canónica y PESI; de Divisibilidad (que esa pide), el circulito y el conteo de múltiplos con el cociente entero.
- **Números racionales** (la siguiente): no se adelanta nada. Los largos con decimales se pasan a centímetros (sin
  MCD de fracciones), y no hay fracciones irreductibles ni equivalentes. La fracción continua usa fracciones de la
  primaria y es de esta unidad en el catálogo.
- **«máximo común divisor»** se mudó aquí desde Divisibilidad (19 nov). **«término»** se queda en este glosario porque
  Sucesiones y series lo nombra («ver»). Salen «convergente» y «aproximación» (ninguna otra unidad las nombra).
- **`arit-boletos`** es de Divisibilidad: el bloque `premios` es aparte, con su prueba, y no cambia ningún dibujo de
  Divisibilidad ni de Números primos.

---

## 11. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, con dos nuevas (`mismo-resto` y `multiplos-tramo`) y la fracción continua dentro de Euclides.** Motivo:
   lo que vino de Divisibilidad es 9 de las 15 preguntas de San Marcos y merece ideas propias; la fracción continua (0
   preguntas) se arma con los mismos cocientes. Descartado: siete ideas con `septimaIdea` (105 ejemplos, una idea
   entera para un tema que no sale en San Marcos). **Es la que más conviene que mires.**
2. **Colores: el MCD turquesa, el MCM violeta y lo que sobra naranja, siempre; los números dados y las cantidades en
   tinta.** Motivo: la confusión de la unidad es MCD contra MCM (AR13), y un color fijo para cada uno la separa en todas
   las ideas. Consecuencia: una respuesta que es una cantidad (cuántos trozos, cuántos boletos, N) va en tinta, no en
   violeta como en el resto de la rama. Descartado: el violeta para «lo que se busca» (como en Primos), que pintaba del
   mismo color el MCM y el N que se busca en un mismo problema.
3. **Letras A y B (mayúsculas) para los números y p, q para los cocientes PESI, con aviso.** Motivo: es la notación del
   examen («A = d·p, B = d·q») y en la rama a, b, c son cifras. Descartado: m y n (n es la base en la rama).
4. **El mundo: los rollos de la promoción (ideas 1, 3 y 6), la rifa con dos premios (2 y 5) y el paquete de doña Juana
   (4).** Piezas de prueba nuevas `arit-cintas` y `arit-reparto`, y el bloque `premios` de `arit-boletos`. Descartado:
   seguir con `arit-tiras` y la recta (sin objeto) y las combis de la recta como objeto (fuera del hilo de la rama;
   quedan en el laboratorio).
5. **La predicción de la idea 3 es el error de la matriz: MCD × MCM con tres números**, y pide el valor (120), no un
   sí o no. Descartado: la de antes, en Sí/No con la cuenta escrita en la opción correcta.
6. **La predicción de Euclides pregunta qué pasa con el MCD de los dos pares**, con una sola respuesta. Descartado: «¿qué
   par tiene el mismo MCD?», que tenía dos correctas.
7. **`fracciones-problemas` sale de esta unidad** (su fila del repaso, `nucleo/repaso-tipos.js`, se borra porque ya no
   es mixto). Motivo: mezcla fracciones y periódicos de Números racionales; sus tres tipos de esta unidad se rehicieron,
   por idea y con `datos`, en `mcd-mcm`. Descartado: separar sus tipos por unidad (habría que darle `datos` a un
   generador que sirve a otra unidad).
8. **Los largos con decimales se pasan a centímetros** (San Marcos 2024-II), sin la fórmula del MCD de fracciones.
   Motivo: no adelantar Números racionales. La trampa del examen (no igualar las unidades) queda como distractor.
9. **No entran la división por exceso en Euclides ni las progresiones geométricas** (San Marcos 2027-I, preguntas 33 y
   32). Motivo: el exceso es una segunda dificultad sobre una idea nueva, y las progresiones son de Sucesiones. Euclides
   se reconstruye solo con divisiones por defecto.
10. **Los ejemplos de nivel 3 llevan cinco alternativas, A a E**, con la letra correcta repartida (6 de cada una en 30).
11. **Avance:** `mcd-cintas`, `mcm-coinciden`, `mcd-por-mcm` y `euclides` conservan su id con otra Predice: una
    predicción sin huella se vuelve a preguntar (marca `prediccionMM`). Quien terminó las cinco ideas de antes conserva
    «Ya la estudié» (`estudiadaMM`); las dos nuevas le quedan por hacer. Entrada en `REHECHAS_E6` de `nucleo/avance.js`,
    con su prueba.
12. **Prueba del curso: sin cambios en las formas** (ya tienen diez pares). ari-35 (el mismo resto con dos divisores) y
    ari-36 (múltiplos de uno o de otro) quedan en la reserva, con su verificador en `catalogo/pruebas/verificar.js`.
13. **Ficha del catálogo:** dos temas nuevos, «Restos con varios divisores» y «Conteo de múltiplos»; `plantillas`:
    `mcd-mcm` y `fracciones`; `requiere` y `grado` sin tocar.
14. **Las mesas del laboratorio se quedan** con sus `id` y los de sus controles (por la colección); cambian sus colores
    (sin verde ni carmín) y «Cintas de cualquier largo» pasa a los rollos (`arit-cintas`).
15. **El ícono de la unidad (`app/dibujos/aritmetica.js`) pierde el «12»** (nota de la sesión): era la respuesta de la
    predicción de la idea 1 y se veía antes de predecir.

---

## 12. Fases 2 a 5 (19 nov): lo que se hizo

Las seis ideas quedaron escritas con sus 15 ejemplos y su prueba propia (`contenido/teoria/aritmetica/mcd-y-mcm.test.js`,
15 pruebas: colores por magnitud, misión única en la grilla, predicciones con cada distractor rehecho, «Ahora tú» en 400
semillas recalculado por fuerza bruta sin la unidad, «Así se resuelve» en 100, toda igualdad escrita comprobada en 400
semillas, los 90 ejemplos contra cuentas aparte, cada trampa de nivel 3 rehecha, el circulito glosado, la letra
repartida y las figuras de las piezas nuevas sin solapes). El validador con `calidad: 2` simulada no marca nada en 200
semillas; la unidad sigue sin la marca. `herramientas/ecuaciones-ancho.js`: todo cabe a 390 px. Cuentas aparte en Python
(scratchpad de la sesión, `e7-aritmetica/cuentas.py`, 84 comprobaciones; `casos.py`, 25 casos).
