# Propuesta de ideas: «Razonamiento inductivo» (`razonamiento-matematico.razonamiento-inductivo`)

19 nov 2026 · Etapa 8 del plan de calidad, rama «Números y patrones» de razonamiento matemático (primera unidad de la
rama; la rama «Lógica» ya está entera con `calidad: 2`: Razonamiento deductivo, Ordenamiento de información, Verdades y
mentiras, Certezas) · encargo con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`). Gerson delegó el criterio:
esta propuesta ya está aplicada en la unidad (sin `calidad: 2`). Las dudas van al final, en «Decisiones tomadas (Gerson
revisa después)», con lo elegido, el motivo y lo descartado. **No hay ningún conflicto crítico.**

Leído: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4e a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1, 2, 3, reglas-validador, etapa-delegada), las decisiones de las etapas 2 a 7, la
propuesta modelo (`docs/etapa7/propuesta-razonamiento-matematico.md`), la unidad modelo (Certezas, v0.3.1, con su
auditoría: qué se corrigió), la teoría actual de esta unidad (v0.3.0, tres ideas), su ficha en
`catalogo/cursos/razonamiento-matematico.json`, sus tres plantillas (`sucesiones`, `rm-ciclos`, `rm-fichas`), la fila de
la unidad en `nucleo/repaso-tipos.js`, `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md` (RM2) y
`docs/investigacion/codigos-rm-procesos.md` (RMP1, RMP26 a RMP28, RMP86), la matriz
`docs/teoria/matriz/razonamiento-matematico.json` (unidad 7), `docs/temario-completo.md` §4.7, la prueba del curso y las
26 preguntas de San Marcos de esta unidad en `docs/datos/admision-unmsm.csv`. Revisadas para no repetir ni adelantar: las
dos «Sucesiones y series» (Aritmética y Álgebra), Arreglos numéricos, Planteo de ecuaciones, Máximos y mínimos,
Frecuencia de sucesos, Divisibilidad (restos potenciales) y Rutas (`rm-lectura-palabras`).

**Ojo:** la unidad entra solo en San Marcos (tema 7). No hay datos de la UNI ni de la UNA Puno, ni cifras de estos errores
en alumnos: RM2 es «parcial» en el informe (Stacey 1989) y los demás distractores salen de las trampas anotadas en los
solucionarios (RMP86, «suponer crecimiento lineal») o son hipótesis nuevas (§7).

## Qué se pregunta en San Marcos (2019-I a 2027-I)

26 preguntas clasificadas en esta unidad. **La trampa más anotada es suponer que la figura crece siempre lo mismo
(«crecimiento lineal», 4 de las 26)**; las demás piden casi siempre una figura o una fila lejana.

| Qué piden | Cuántas | Periodos (pregunta) | Idea |
| --- | --- | --- | --- |
| Figura lejana que crece igual en cada paso (fichas de un color, círculos con cifra final) | 3 | 2019-II (33), 2024-I (21), 2026-II (25) | 1 |
| Figura lejana que crece cada vez más (discos triangulares, tangencias, pentágonos y círculos, ángulos, áreas) | 6 | 2022 (22), 2024-I (27), 2025-I (22, 23), 2026-I (29), 2021 (27) | 3 |
| Fila lejana de un arreglo triangular (suma, último término, potencias de dos, matriz que crece) | 6 | 2019-I (33), 2021 (23 ×2), 2023-I (29, 30), 2024-II (21), 2023-II (17) | 4 |
| Suma de impares por semanas, copas en filas | 3 | 2021 (17, 23 ×2) | 4 (nivel examen) y práctica |
| Bloque de cifras que se repite; cifra de las unidades que se repite | 2 | 2024-II (25, 30) | 6 |
| Espiral numérica (valor y perímetro) | 2 | 2026-I (26), 2027-I (21) | práctica (`rm-ciclos`) |
| Sólidos de cubos (área), malla triangular, cuadrados de todo tamaño | 4 | 2025-II (26), 2027-I (26), 2023-II (21), 2026-II (26) | laboratorio 3D y práctica (`rm-fichas`, `razonamiento-figuras`) |

Banco Cuzcano: unas 45 fichas (inducción numérica 20, con figuras 14, arreglos 11). La prueba del curso tiene dos ítems
de esta unidad en sus formas (líneas 683 y 753 de `catalogo/pruebas/razonamiento-matematico.json`). Las preguntas de
«cuentas largas» (suma de cifras de 99…9², 33…3²) no salen en las 26 de San Marcos, pero son la mitad de las fichas de
inducción numérica del banco: van en la idea 5.

---

## 0. Diagnóstico de la teoría actual contra el contrato

Tres ideas (`figuras-que-crecen`, `tres-casos-no-prueban`, `impares-y-cuadrados`), cuatro mesas y 14 términos. La base
sirve: «la regla sale de cómo se construye la figura» y «tres casos no prueban» están bien dichas, y las dos primeras
predicciones (61 palitos, 31 regiones) son buenas.

1. **Punto 1:** ninguna primera pantalla tiene un objeto: palitos sueltos y cuerdas en un círculo abstracto (`rm-plano`),
   y un tablero de casillas (`rm-tablero`).
2. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`; glosario sin `simple` ni tres
   ejemplos; no declara `calidad: 2`; la consigna describe el control («Agrega cuadrados»).
3. **Repite Aritmética:** la idea 3 («Impares que arman cuadrados», 1 + 3 + … + (2n − 1) = n²) es una suma notable de
   `aritmetica.sucesiones-y-series` (idea «La suma es medio rectángulo»). Sale.
4. **§5b, colores:** verde para n, naranja, turquesa y carmín en una misma figura (rojo y verde, naranja y verde: los pares
   que el molde prohíbe); la mesa de impares pinta las L con los cuatro colores.
5. **Punto 13:** ningún ejercicio trae `datos`; no hay ejemplos resueltos (0 de 45).
6. **Lo previo delata:** el glosario dice «con n = 20, 61 palitos» (la respuesta de la predicción 1) y «6 puntos dan 31
   regiones» (la de la 2); la Mira de la idea 2 adelanta una fórmula de cuerdas y cruces que es de Máximos y mínimos
   («Cada recta nueva, más regiones»).
7. **«Así se resuelve» es el mismo generador que «Ahora tú»** con la semilla + 900; el RM2 de «Ahora tú» redondea
   («Math.round»): el valor no es el de ningún error.
8. **«Ahora tú» no llega al examen:** no hay figuras que crecen cada vez más, ni arreglos triangulares, ni cifras que se
   repiten (16 de las 26).
9. **Códigos RMT-IND-1 a 11** sin informe. La cabecera dice «postulante de 3.º a 5.º».
10. **Práctica:** `rm-ciclos` y `rm-fichas` son compartidas y no separan sus tipos por unidad (la práctica de esta unidad
    pide canciones y fichas de semejanza); sus 20 problemas de papel no dicen de qué unidad son ni traen Datos
    (lección 18); la escena `sucesiones` es de Aritmética y Álgebra (progresiones, Gauss, series).

---

## 1. Las ideas, en orden

**Seis** (el tope). Las dos primeras conservan su `id` y su predicción; `impares-y-cuadrados` sale (es de Aritmética) y
entran `cada-caso-con-su-lugar`, `arreglo-triangular`, `cuenta-larga` y `lo-que-se-repite`.

| # | `id` | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) |
| --- | --- | --- | --- |
| 1 | `figuras-que-crecen` | La figura que crece | La figura n se cuenta por cómo se arma: lo que tiene la primera más lo que agrega cada paso, por los n − 1 pasos. |
| 2 | `tres-casos-no-prueban` | Tres casos no prueban | Un patrón visto en unos casos es una hipótesis: vale si se explica por cómo se arma; un solo contraejemplo la descarta. |
| 3 | `cada-caso-con-su-lugar` | Cada caso con su lugar | Si lo que agrega cada paso cambia, no se suma siempre lo mismo: cada caso se escribe como una cuenta con su lugar. |
| 4 | `arreglo-triangular` | Filas de un triángulo de números | En un arreglo por filas se calculan las filas chicas, se escribe cada resultado con su número de fila y se prueba en otra. |
| 5 | `cuenta-larga` | Casos chicos de una cuenta larga | Una cuenta de muchas cifras repetidas se resuelve con sus casos chicos: se ve qué cambia de uno a otro y se prueba en uno más. |
| 6 | `lo-que-se-repite` | Lo que se repite | Si una lista se repite en un ciclo, el lugar pedido se divide entre el largo del ciclo y el residuo dice qué toca. |

`pregunta` de cada idea, para el Resumen: 1. «¿Cómo se cuenta una figura sin dibujarla?» · 2. «Si una regla funciona en
cinco casos, ¿ya está probada?» · 3. «¿Qué haces si cada figura agrega más que la anterior?» · 4. «¿Cómo se suma una fila
lejana sin escribir las anteriores?» · 5. «¿Cómo se calcula una cuenta que no cabe en la calculadora?» · 6. «¿Cómo sabes
qué toca en el lugar 50 de una lista que se repite?»

**Por qué cada una va ahí y qué da por sabido**

1. **La figura que crece.** La raíz: casos chicos y la regla que sale de construir. Estrena «sucesión», «patrón» y
   «término general». Solo suma y multiplica.
2. **Tres casos no prueban.** Antes de seguir buscando reglas, qué vale una regla vista: hipótesis, contraejemplo y
   «una lista corta admite varias reglas». Usa la idea 1 como lo que sí prueba (la construcción). Es la «inducción
   verbal» del catálogo: decir la regla con palabras y saber cuándo está probada.
3. **Cada caso con su lugar.** La trampa del examen (RMP86): lo que agrega cada paso cambia. La técnica es escribir cada
   caso como una cuenta con su número de figura (1 × 2, 2 × 3, 3 × 4) y comprobar con un caso más (idea 2).
4. **Filas de un triángulo de números.** La misma técnica sobre filas de números (1, 8, 27, 64 → n × n × n), con el
   porqué (la fila n tiene n números que promedian n × n). Cuando hace falta contar cuántos números hay antes de una
   fila, la suma 1 + 2 + … + n va en `datos` (es de Aritmética: no se enseña aquí).
5. **Casos chicos de una cuenta larga.** La inducción numérica con cuentas que no caben en la calculadora (99…9², 33…3²,
   11…1²): mirar qué cambia de un caso al siguiente y explicarlo (n − 1 nueves, un 8, ceros y un 1).
6. **Lo que se repite.** Escribir casos hasta que uno vuelve a salir: el ciclo y el residuo. Va al final porque usa la
   división con residuo y lo que antecede al ciclo (2024-II, 30).

**Qué no entra:** la progresión aritmética con a₁ y r, las sumas notables, la progresión geométrica, las diferencias
sucesivas y las sumas infinitas (Aritmética y Álgebra, «Sucesiones y series»); las regiones con rectas o cuerdas contadas
con fórmula (Máximos y mínimos); los cuadrados mágicos y las sumas por lado (Arreglos numéricos); la lectura de palabras
en un triángulo de letras (Rutas, `rm-lectura-palabras`); los restos de potencias (Divisibilidad); la inducción
matemática como demostración formal (solo se nombra en la historia).

---

## 2. Objeto de la primera pantalla

Pieza nueva `rm-patrones`, dibujada por la sesión como prueba (`data-prueba`), con su prueba numérica de encuadre y
rótulos (las comunes de `rm-pruebas.js`).

| Idea | Objeto | Qué es qué |
| --- | --- | --- |
| 1 | **Fósforos sobre la mesa**: filas de cuadrados (y triángulos, casitas, dos pisos) | cada fósforo con su cabeza; los del primer cuadrado y los que agrega cada uno nuevo |
| 2 | **La torta del cumpleaños** vista desde arriba, con velitas en el borde | cortes rectos de cada velita a cada otra; se cuentan los pedazos |
| 3 | **Chapitas** (tapas de gaseosa) ordenadas en rectángulos | filas y columnas; las que agregó el último paso |
| 4 | **La pirámide de latas** de la bodega, cada lata con su número | la fila elegida; las latas en orden, de arriba abajo |
| 5 | **La calculadora del salón** (pantalla de 10 cifras) | la cuenta, el resultado y la cinta con los casos anteriores |
| 6 | **La pulsera de mostacillas** de la feria de Puno | cada mostacilla con la letra de su color; el ciclo con su llave |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Control | `logrado` | Lectura en vivo (enuncia una relación) |
| --- | --- | --- | --- | --- |
| 1 | Fila de cuadrados de fósforos. **Arma la fila que usa justo 19 fósforos.** | cuántos cuadrados (1 a 7) | 6 cuadrados | «4 del primero y 3 × 5 nuevos: 19 fósforos» |
| 2 | La torta se corta entre cada par de velitas. **Pon las velitas que dejan la torta en 8 pedazos.** | velitas (1 a 5) | 4 velitas | «Velitas 1 a 4: 1, 2, 4 y 8 pedazos» |
| 3 | Chapitas en filas iguales. **Arma la figura que tiene 30 chapitas.** | figura (1 a 6) | figura 5 | «Figura 4: 4 filas de 5 chapitas, 20 en total» |
| 4 | Pirámide de latas con impares. **Busca la fila cuyas latas suman 64.** | fila (1 a 5) | fila 4 | «Fila 3: 7 + 9 + 11 = 27» |
| 5 | Un número de puros nueves por sí mismo. **Busca cuántos nueves dan una suma de cifras de 36.** | nueves (1 a 5) | 4 nueves | «Con 2 nueves, las cifras suman 18» (y la cinta con los casos) |
| 6 | La pulsera repite roja, verde, negra, blanca. **Busca un lugar mayor que 20 con mostacilla blanca.** | lugar (1 a 30) | 24 o 28 | «Lugar 23: 5 ciclos de 4 y sobran 3: negra» |

Cuentas rehechas aparte (scratchpad `e8-rm/verificar.py`): 4 + 3 × 5 = 19; 1, 2, 4, 8 pedazos con 1 a 4 velitas (conteo
de regiones con los cruces de la figura); 5 × 6 = 30; 13 + 15 + 17 + 19 = 64; 9999² = 99 980 001 (suma 36); 24 y 28 son
los únicos lugares de 21 a 30 con resto 0 entre 4. Ninguna misión está cumplida al abrir.

---

## 4. La predicción de cada idea

Ninguna pregunta por lo que el juego mostró: cada una es un caso lejano. Los `datos` traen valores, nunca la regla.

**Idea 1** (la de hoy, se queda con sus ids). «Con la misma regla, ¿cuántos fósforos tiene la fila de 20 cuadrados?» →
**61** · 80 (RMP1, cada cuadrado con sus 4) · 64 (RM2, objeto entero: 4 veces la fila de 5) · 60 (RMP160, 3 por
cuadrado, sin el primero).

**Idea 2** (la de hoy, se queda con sus ids; cambia el objeto). «Con 1, 2, 3, 4 y 5 velitas salen 1, 2, 4, 8 y 16
pedazos. ¿Cuántos salen con 6 velitas?» → **31** · 32 (RMP162, la hipótesis «se duplica» tomada como regla) · 24 (RMP163,
sumar lo mismo que el último paso).

**Idea 3.** «Con la misma regla, ¿cuántas chapitas tiene la figura 10?» → **110** · 38 (RMP86, sumar siempre 4) · 100
(RMP166, el lugar por sí mismo) · 60 (RM2, el doble de la figura 5).

**Idea 4.** «¿Cuánto suman las latas de la fila 10?» → **1000** · 100 (RMP168, los 10 primeros impares, como si la fila
empezara en 1) · 250 (RM2, el doble de la fila 5) · 160 (RMP86, sumar 19 cada fila).

**Idea 5.** «¿Cuánto suman las cifras del resultado de 99…9 × 99…9, con 25 nueves cada uno?» → **225** · 216 (RMP170,
contar solo los nueves del resultado) · 9 (RMP169, quedarse con el primer caso) · 2025 (RM2, 25 veces el resultado del
caso 1).

**Idea 6.** «En la misma pulsera, ¿de qué color es la mostacilla del lugar 50?» → **verde** · blanca (RMP171, mirar el
cociente y no el residuo) · negra (RMP27, contar desde la siguiente) · roja (RMP26, empezar el ciclo en 0).

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| n | el número del caso: la figura n, la fila n, el número con n nueves, el lugar n de la lista | se dice en Lee de la idea 1 |
| R, V, N, B (en una mostacilla) | roja, verde, negra, blanca | solo en la figura; el texto dice el color con su nombre |
| ⇏, ≠ | «no lleva a», «no es igual a» (idea 2) | dichos en el paso donde aparecen |
| A–E | solo las alternativas de un ejemplo de nivel 3 | **los resueltos nombran cada alternativa por su valor** (las mostacillas tienen letras; decisión de la Etapa 3) |

`letras: { n: 'el número de la figura, de la fila o del caso' }`.

---

## 6. Colores (molde §5b, por papel; sin carmín ni verde)

| Token | Papel | En esta unidad |
| --- | --- | --- |
| tinta | lo que amarra | los objetos, lo que ya estaba, los números de las latas y de la calculadora |
| `o` naranja | el primer dato | lo que tiene la figura 1; el caso que se elige (la fila, el lugar) |
| `i` turquesa | el segundo dato o lo que se repite | lo que agrega cada paso; el ciclo; el contraejemplo que se cuenta |
| `f` violeta | lo pedido, ya comprobado | el total de la figura n, la suma de la fila, el color del lugar: solo al resolver |

No hay ángulos (carmín) ni tercer dato (verde, que no puede ir junto al naranja). La pieza fija los papeles (`PAPELES`) y
la prueba de la unidad falla si aparece verde o carmín, o si una figura que se ve antes de responder trae violeta.

---

## 7. Práctica: qué existe y qué falta por idea

**Qué existe:** `rm-ciclos` (compartida con Frecuencia de sucesos: ocho tipos, sin separar por unidad, sin `datos`),
`rm-fichas` (compartida con Transformaciones y Máximos: trece tipos, sin separar, sin `datos`), la escena `sucesiones`
(de Aritmética y Álgebra) y la mesa 3D del cubo pintado.

**Qué se hace:**
- **Generador nuevo `rm-induccion`**, de esta unidad sola, con `TIPOS_POR_IDEA` (seis ideas, 18 tipos), `datos` por línea
  en todos, distractores con el valor de su error y casos verificados aparte (`casos.json`), papel con
  `papel-generador.js`.
- **`rm-ciclos` y `rm-fichas`: un bloque propio** (`TIPOS_POR_UNIDAD` de esta unidad, con `datos`): desde esta unidad,
  `rm-ciclos` da solo `figuras`, `espiral`, `unidades` y `bloque`, y `rm-fichas` solo `medios`, `fibonacci` y `malla`.
  Sin unidad, nada cambia (los casos de siempre siguen iguales). Su papel dice de qué unidad es cada problema
  (`"unidades"`) y los de esta unidad traen `datos` (lección 18).
- **`sucesiones`** pasa a «Más mesas del tema» en esta unidad (`"rehacer": ["razonamiento-matematico.razonamiento-inductivo"]`);
  su papel dice de qué unidad es cada problema.

| Idea | Tipos de `rm-induccion` |
| --- | --- |
| 1 La figura que crece | `fosforos`, `fosforos-inverso`, `fosforos-diferencia` |
| 2 Tres casos no prueban | `contraejemplo`, `primer-fallo`, `dos-reglas` |
| 3 Cada caso con su lugar | `rectangulo`, `rectangulo-inverso`, `triangular` |
| 4 Filas de un triángulo | `fila-impares`, `ultimo-impares`, `fila-pascal` |
| 5 Casos chicos | `cifras-cuadrado`, `cifras-cantidad`, `unos-cuadrado` |
| 6 Lo que se repite | `pulsera`, `bloque`, `unidades` |

**Códigos.** Los RMT-IND de la teoría de hoy pasan a RM2, RMP1, RMP86 y RMP160 a RMP171. Nuevos, todos hipótesis,
anotados en `codigos-rm-procesos.md`:

| Código | Error |
| --- | --- |
| RMP160 | Contar solo lo que agrega cada paso, sin lo que trae la primera figura |
| RMP161 | Correr el lugar: dar la figura (o la fila) siguiente o la anterior |
| RMP162 | Tomar un patrón visto en unos casos como regla probada |
| RMP163 | Seguir sumando lo que creció el último paso |
| RMP164 | Usar otra regla que también encaja con los primeros casos, no la que fija el enunciado |
| RMP165 | Confundir «no está probada» con «es falsa» |
| RMP166 | Escribir mal el caso con su lugar: n × n en vez de n × (n + 1) |
| RMP167 | Olvidar lo que se resta o se suma al final de la cuenta del caso (el − 1 del último impar) |
| RMP168 | Empezar la fila donde no empieza (sumar los primeros impares) |
| RMP169 | Quedarse con el primer caso: creer que siempre da lo mismo |
| RMP170 | Contar solo una parte de las cifras del resultado (los nueves, sin el 8 y el 1) |
| RMP171 | Mirar el cociente y no el residuo al buscar el lugar en un ciclo |

---

## 8. Datos del mundo

Ninguno hace falta. Las cantidades son de problema y deben ser posibles (una fila de 40 cuadrados de fósforos: 121
fósforos, unas tres cajas; una pirámide de 10 filas de latas: 55 latas). Que la calculadora muestra 10 cifras es la de
una científica escolar y va como «la calculadora del salón muestra hasta 10 cifras», sin marca. La historia de Hume ya
trae fuente (Stanford Encyclopedia of Philosophy) y se queda; se le agrega el polinomio de Euler (n × n + n + 41 es primo
de 0 a 39 y falla en 40), que el alumno comprueba él mismo en la idea 2 (no es un dato del mundo: es una cuenta).

---

## 9. Riesgos de orden (`requiere`)

- `requiere: []` se queda: es la primera unidad de la rama. «Residuo» (idea 6) se marca con el glosario del curso («Se
  explica en Cronometría y calendarios»); la división con residuo es de primaria.
- **Nada de Aritmética ni Álgebra:** ni a₁, ni r, ni la fórmula de la progresión, ni sumas notables con nombre. Cuando un
  ejercicio de nivel examen necesita 1 + 2 + … + n, va en `datos` como herramienta.
- **Nada de la rama que sigue:** las sumas por lado y los cuadrados mágicos (Arreglos numéricos), las ecuaciones de planteo
  (el caso inverso de la idea 1 se resuelve probando o «quitando lo de la primera», sin ecuación con letra), y las
  regiones con rectas (Máximos y mínimos: la torta se cuenta en el dibujo, sin fórmula de cuerdas y cruces).
- Dentro de la unidad: la 2 usa la construcción de la 1; la 3, la hipótesis y la prueba con un caso más de la 2; la 4 y
  la 5, «cada caso con su lugar» de la 3; la 6 es aparte (residuo).
- Temas del catálogo, sin agregar ninguno: «Inducción con figuras» (ideas 1 y 3), «Inducción verbal» (idea 2) e
  «Inducción numérica» (ideas 2, 4, 5 y 6).

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas; sale `impares-y-cuadrados`.** Elegido: figura lineal, hipótesis y contraejemplo, figura que crece cada vez
   más, arreglo triangular, cuentas largas y ciclos. Motivo: 16 de las 26 preguntas (figuras cuadráticas, arreglos,
   ciclos) no tenían idea, y la suma de impares es una suma notable de Aritmética (la nota de la sesión: no repetirla).
   Descartado: conservar la idea con otro nombre.
2. **«Inducción verbal» es la idea 2** (decir la regla con palabras y saber si está probada), como hoy. Motivo: San Marcos
   no pregunta otra cosa con ese nombre y la lectura de palabras en un triángulo de letras ya es de Rutas
   (`rm-lectura-palabras`). Descartado: una idea de «¿de cuántas maneras se lee…?».
3. **La torta reemplaza al círculo de cuerdas**, y la idea 2 no da la fórmula «1 + cuerdas + cruces»: los pedazos se
   cuentan en el dibujo. Motivo: el objeto (punto 1) y no adelantar las regiones de Máximos y mínimos. La predicción (31)
   y sus ids se quedan.
4. **El polinomio de Euler y 2ⁿ − 1** como contraejemplos en «Ahora tú» de la idea 2. Motivo: son los contraejemplos
   clásicos, con números que el alumno puede probar. Descartado: inventar reglas que fallan.
5. **Alternativas por su valor en toda la unidad** (las mostacillas llevan letras R, V, N, B). Descartado: nombrar por letra.
6. **Generador nuevo `rm-induccion`** por idea, en vez de rehacer por dentro `rm-ciclos` y `rm-fichas`. Motivo: son
   compartidas con otras tres unidades; aquí solo se les agrega un bloque propio por unidad. Descartado: sacarlas de la
   ficha (cubren la espiral, la malla y los cuadrados de puntos medios de San Marcos).
7. **La mesa de impares sale del laboratorio** (su idea se fue) y entran la pirámide de latas y la pulsera. La mesa 3D del
   cubo pintado se queda, en la idea 3 (los grupos crecen 8, 12 × (n − 2), 6 × (n − 2)²…).
8. **`REHECHAS_E6`:** la unidad suma ideas y pierde una; ninguna predicción cambia de respuesta ni de ids, así que no se
   borra ninguna; quien terminó las tres de antes conserva «Ya la estudié» (marca `estudiadaRI`).
9. **Prueba del curso:** dos ítems nuevos a la reserva (las formas ya tienen 10 pares): rm-26 (baldosas en rectángulos que
   crecen cada vez más) y rm-27 (carpetas pintadas en un ciclo de colores), verificados en `catalogo/pruebas/verificar.js`
   (las baldosas, contadas casilla por casilla; el ciclo, con el `calc` de `rm-induccion`). Su contexto no es el de la
   práctica: la prueba del curso no repite problemas de su generador.

---

## 11. Fases 2 a 5 (19 nov): lo que cambió al escribir

Decisiones tomadas al escribir (Gerson revisa después), además de las de §10:

1. **Pieza nueva `rm-patrones`** (fósforos, torta, chapitas, latas, calculadora y pulsera o tira de fichas), con su prueba
   numérica de encuadre y rótulos, los papeles de color fijos (`PAPELES`) y una prueba de la torta: con los ángulos de las
   velitas ningún punto junta tres cortes, y 1 + cortes + cruces da 1, 2, 4, 8, 16, 31 y 57 pedazos. Todo dibujo es de
   prueba (`data-prueba`).
2. **Notas de la sesión sobre la idea 1** (19 nov): las figuras 1 a 3 van una debajo de otra, alineadas a la izquierda (se
   ve lo que agrega cada paso y la figura llena el marco); la captura de Juega se toma de página entera.
3. **La regla de la idea 1** se escribe con «figura 1 + paso × (n − 1)» y llaves («lo que tiene», «lo que agrega»); la de la
   idea 6, «lugar ÷ largo ⇒ residuo». Las cuatro reglas que `ecuaciones-ancho.js` partía en mal sitio van en dos renglones
   (`'   ·   '`) o más cortas: todo cabe a 390 px.
4. **Idea 2:** «Así se resuelve» usa 6 × n − 1 y 2 × n × n + 11 (primo de 0 a 10, falla en 11), y la lista 2, 5, 11; así no
   repite ningún ejemplo (n × n + n + 5, 6 × n + 1, 1, 3, 7). «Ahora tú» usa n × n + n + 11, 17 y 41 (el primer fallo de
   41 solo como contraejemplo entre opciones: el «primer n» de 41 es el ejemplo 11).
5. **Idea 5:** las cuentas se hacen con BigInt; cuando el resultado no cabe en la pantalla (más de 10 cifras), la
   calculadora dice «Error», y en los ejercicios la pantalla muestra «?» (nunca el resultado).
6. **Glosario (16 términos):** sucesión, término general, inducción, hipótesis, contraejemplo, crecimiento lineal, número
   triangular, arreglo triangular, al cubo, patrón, suma de cifras, caso de prueba, ciclo, cifra de las unidades, cara
   pintada y cubito interior. Salen fórmula, argumento, demostración, inducción matemática, cuerda y región (o no se usan,
   o adelantaban Máximos y mínimos). «Número primo» y «residuo» se marcan desde Certezas y Cronometría.
7. **Laboratorio:** el cubo pintado (idea 3, n en naranja en vez de verde), cuatro formas de fósforos (idea 1), la torta
   hasta 7 velitas (idea 2), tres pirámides de latas (idea 4) y pulseras de otros ciclos (idea 6). Los ids de las mesas
   que ya existían no cambian (`palitos-libres`, `seis-puntos`, `cubo-que-crece`).
8. **Práctica:** `rm-induccion` 0.1.0 (18 tipos, 18 casos resueltos aparte, 8 de papel). En `rm-ciclos` y `rm-fichas`, el
   bloque propio de la unidad (`tiposPorUnidad`); `nucleo/repaso-tipos.js` suma `bloque` (rm-ciclos) y `malla` (rm-fichas)
   a la unidad. Los tres papeles compartidos dicen de qué unidad es cada problema; los de esta unidad traen `datos`.
