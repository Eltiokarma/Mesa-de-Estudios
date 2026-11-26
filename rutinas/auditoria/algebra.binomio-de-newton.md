# Auditoría de contenido: «Binomio de Newton» (algebra.binomio-de-newton)

26 nov 2026. Auditor externo (cierre con criterio delegado, `docs/metodo/unidad/cierre-delegado.md`; encargo de
`docs/metodo/unidad/5-auditor.md`), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3. Vara:
`docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md`. Decisiones:
`docs/etapa9/propuesta-algebra.md`. Antes de mí pasó el redactor (`rutinas/redaccion/algebra.binomio-de-newton.md`), con
nueve notas para el auditor; aquí se resuelven todas. Lo que vieron los dos lectores en frío está en
`rutinas/frio/algebra.binomio-de-newton.md`.

**Qué se revisó.**
- La teoría `contenido/teoria/algebra/binomio-de-newton.js` (v0.3.0, sin `calidad: 2`, sin commit): las 6 ideas con sus
  7 momentos, los 90 ejemplos, «Ahora tú» y «Así se resuelve» en 400 semillas por idea, el glosario y el laboratorio.
- La pieza nueva `nucleo/kit/piezas/alg-cenefa.js` (sin commit).
- La práctica `plantillas/binomio-practica/` (24 tipos en las 6 ideas, `casos.json`, `papel.json`), 400 semillas por
  idea y los 8 del papel.
- La app a 390 px con `--entera --lector` (133 capturas), servidor propio en el puerto 4236.

**Cuentas.** Rehechas con scripts propios en
`/tmp/claude-0/-home-user-Mesa-de-Estudios/c6e6072f-61c1-5ae4-9fde-081abfdefa41/scratchpad/cierre-algebra/aud/`, sin el
código de la unidad ni el desarrollador de su prueba. `volcar.js` solo saca el texto que ve el alumno; `sym.py` lo lee
con un analizador propio (superíndices, C(n, k), factoriales, miles con espacio, coma decimal, producto implícito) y lo
pasa a sympy; `recalc.py` desarrolla cada binomio o trinomio con `sympy.expand` (y `sympy.series` para α no natural) y
rehace la respuesta de cada pregunta; `igualdades.py` comprueba cada igualdad con números o letras a los dos lados.
- **Teoría:** 4 800 preguntas («Ahora tú» y «Así se resuelve», 400 semillas por idea): la correcta vale lo que pide el
  enunciado y ningún distractor lo vale (0 fallas). Los 90 ejemplos: 52 rehechos por el script y los 38 restantes a mano
  (enunciados que no son «desarrolla y lee»: qué producto sale, la fila siguiente, cuál de estos desarrollos…); los 18
  de nivel 3, con sus cinco alternativas: una sola vale. Las 6 predicciones, con sus opciones.
- **Práctica:** 2 408 problemas (400 semillas por idea y el papel): 0 fallas. Los dos casos de `casos.json` que cambiaron
  (abajo) se rehicieron aparte.
- **Igualdades:** todas las de las ecuaciones, pasos, soluciones y explicaciones. Antes de corregir salieron 62 cuentas distintas
  falsas tal como se leen (180 semillas), todas del mismo error (A1); después, ninguna.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 5, 13 | Ideas 3 y 4, solución de «Ahora tú» (`cuentaEc`, `cuentaEc3`, que usan `bloque()`): idea 3 (138 de 400 semillas: tipos 0 y 1, con a = x² o x³); idea 4, tipo 1 (42 de 400) | La potencia de una letra con exponente sale pegada: «C(8, 5) · x³³ · (−2/x)⁵ = −1 792x⁴» por (x³)³, «C(8, 4) · x²⁴ · (−2)⁴» por (x²)⁴. Se lee x elevado a 33: la igualdad es falsa tal como se ve (−1 792x²⁸). Nota 1 del redactor. | `bloque(m, p)`: con p > 1, toda letra con su propio exponente va entre paréntesis. Prueba que lee cada factor y rehace la cuenta. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 4f; reglas 8 y 15 de la etapa | «Ahora tú» y «Así se resuelve» de las 6 ideas; práctica | Repiten ejemplos y predicciones dichos con otras palabras: la prueba y el veto comparaban el enunciado exacto. Idea 1: 100 de 400 «Ahora tú» son el ejemplo 12 de nivel 3 (xⁿ⁻⁴y⁴ y xⁿ⁻⁶y⁶), 49 «Así se resuelve» son el ejemplo 7; idea 3: «(x + 2/x)⁶» es el ejemplo 7 con «del desarrollo de»; idea 5: «aproxima √1,1». En la práctica, 24 ejercicios de la teoría (el papel p1 era el ejemplo 3). Más grave que la nota 2 del redactor (p8 = ejemplo de nivel 3 de la idea 3), que es un caso de esto. | Comparar una «firma» (trozos de matemática y lo que se pide, sin orden ni redacción) en el veto de la unidad y en la práctica (`VETO_EJ`); pruebas en las dos. |
| M2 | 3, 5 | Datos de las ideas 1 a 3 y 5 (`tₖ₊₁ = C(n, k)aⁿ⁻ᵏbᵏ`, `(xᵐ)ⁿ = xᵐⁿ`, `xᵐ · xⁿ = xᵐ⁺ⁿ`, `xⁿ⁻ᵏyᵏ`, coeficiente de xᵏ), ecuaciones de las reglas 1, 2 y 6, Mira 3 | `nucleo/ecuacion.js` pinta como `<sup>` las cifras, ⁿ, ⁺ y ⁻, pero no ᵏ, ᵐ, ᵖ, ʳ ni los subíndices ₖ₊₁: «aⁿ⁻ᵏ» sale `a<sup>n−</sup>ᵏ`, mitad en una letra y mitad en otra, diminuta (lectores A y B). En la regla 6, «aᵖ bᑫ cʳ» mezclaba glifos. | Pasar esos exponentes e índices a nodos `{ sup }` y `{ sub }` (helper `ex()` en la unidad); en la regla 1, decirlo en palabras. |
| M3 | 13 | Idea 4, regla y su «Vale si»; idea 1, «Vale si» | La condición traía datos que no son condición (redactor, nota 6): «…S = 2ⁿ» y la simetría C(n, k) = C(n, n − k). La regla 4 decía «S = P(1)» sin decir qué es P y juntaba la suma y el término central en la ecuación (lector B). | La simetría y los lugares centrales al texto de la regla; la ecuación, solo S = P(1); P dicho («la suma S de los coeficientes del desarrollo P»); condiciones que son condición. |
| M4 | 6 | Idea 5: lectura del juego, misión y «Vale si» | «el factor 2 − 2 = 0», «(3 − 3)/4 = 0», «α − α = 0»: ninguna sale de la fórmula del nuevo factor, (α − k + 1)/k, que está al lado (lector B). | Mostrar el reemplazo: «α = 2, k = 3: (2 − 3 + 1)/3 = 0 → 3 términos». |
| M5 | 3 | Idea 4, Predice (tabla) y regla 3 (dibujo); lectura del juego 3; laboratorio | «sin x» en una tabla se lee seno de x (lector B); «x⁰: sin x» se ve «x°» (lector A). | «número solo», «exponente 0», «un número solo, sin ninguna x». |
| M6 | 13 | Ejemplo «Dos centrales» (idea 4, nivel 1) | Los Datos daban (n + 1)/2 y (n + 3)/2: con n = 7, la respuesta sale de copiar (lector B). | Datos: cuántos términos hay y que los centrales dejan los mismos a cada lado; el resuelto cuenta 3 + 2 + 3 = 8. |
| M7 | 13 | Ejemplo «¿Qué k anula?» (idea 3, nivel 1) | El enunciado daba el exponente 8 − 2k hecho (lector A). | El enunciado dice cuántas veces sale x y 1/x; Datos con x⁻¹ y la suma de exponentes; el resuelto arma 8 − 2k. |
| M8 | — | Ideas 4 (teoría y práctica) | El distractor pⁿ («solo el primer coeficiente») y bⁿ sin despejar llevaban el código TAL-BN-CERO, que es poner x = 0 (redactor, nota 8): la medición mezclaba tres errores. | TAL-BN-PRIMERO y TAL-BN-SIN-DESPEJAR, documentados en la cabecera de la idea. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 5 | Idea 3, «Ahora tú» tipo 3 (`casoNLugar`) | «2(n − 3) − 1 · 3» y «= 1 · 3» con q = 1 (redactor, nota 5). | Sin «1 ·». |
| B2 | 5 | Práctica, tipo `existe` | «k = 18/4» sin simplificar (redactor, nota 3). | `qTxt(Q(…))`: «k = 9/2». |
| B3 | — | Ejemplo «Suma con signos» (idea 6) | La A (−32) «cambia el signo del resultado» no dice qué error es (redactor, nota 7). | Modela poner las letras en −1: «(−2 + 1 − 1)⁵ = −32». |
| B4 | — | `generador.test.js` de la práctica | Exigía que cada explicación empezara por «Bien»: fuerza el molde «Bien X, pero Y». | Se quita la exigencia (se conservan valor, sin letra y 32 palabras). |
| B5 | 8 | Píldora de la idea 2; tarjetas 06, 09 y 12 | «El término de lugar k + / 1» partido; «C(n, / 3)» y «C(6, / 4)m⁴» partidos (lector A). | Título «El término general»; espacio duro dentro de todo C(…, …). |
| B6 | 3 | Juega 4 (leyenda), regla 6, tarjetas 09, 12, 17; pieza `alg-cenefa` | «× 4» en la leyenda con n = 3; C(n + 2, 2) sin decir qué es; «vale 0 con k = 4» sin 12 − 3k; k = lugar − 1 sin decir; «x dos veces, y una vez» con la y conjunción; el halo de `.kit-txt` hacía una mancha sobre «1/x» (lectores A y B). | Cada uno corregido en su sitio. |
| B7 | 5 | Práctica (Datos) | Los Datos de la práctica son texto plano y siguen con ᵏ, ᵐ (`D.general`, `D.potPot`). | Pendiente: depende de cómo pinta la app los Datos de una práctica (`app/`). |

## Lo que está bien y hay que copiar al molde

- Una cuenta de «Así se resuelve» y «Ahora tú» con el término armado factor por factor y sus colores (`cuentaEc`): se
  lee como en el cuaderno. Con A1 corregido, cada factor se puede comprobar.
- El veto por semilla (`+ 7996 · k`, que no cambia el tipo) para no repetir ejemplos ni predicciones; con la firma,
  también lo que cambia de redacción.
- La prueba propia de la unidad rehace la correcta con un desarrollador de polinomios propio y la serie de (1 + x)^α por
  su recurrencia: bien pensada; le faltaba leer la ecuación de la solución (ahora la lee).
- Exponentes fraccionarios en palabras («elevado a 1/2»): ningún lector se equivocó con ellos.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una potencia de algo con su propio exponente lleva paréntesis** (A1): «x³³» no; (x³)³ sí. Ya está en `igualdad-falsa` para números («(2π)²»), no para letras. | Sí, en general: en una ecuación, una letra seguida de dos o más superíndices que no son el exponente del término final. Por unidad, la prueba nueva lee cada factor. |
| **«Ahora tú» no repite un ejemplo ni una predicción con otras palabras** (M1): la regla `resuelve-repite` y las pruebas comparan el texto exacto. | Sí, en general: comparar una firma (binomios, monomios y números, más lo que se pide). |
| **Nada de ᵏ, ᵐ, ᵖ, ʳ, ₖ, ₊ en un texto que pinta `nucleo/ecuacion.js`** (M2): no se convierten a `<sup>`. | Sí, en general: buscarlos en Datos, ecuaciones y opciones; o que `ecuacion.js` los convierta como hace con las cifras (decisión de núcleo). |
| **Un código de error dice un solo error** (M8). | Semi: la misma clave con dos `siFuera` que no comparten idea. |

## Correcciones (26 nov)

Paso 3 del cierre, junto con las notas de los dos lectores en frío (`rutinas/frio/algebra.binomio-de-newton.md`,
«Correcciones de la ronda 1»). Pruebas nuevas, cada una falla con la versión anterior:
`contenido/teoria/algebra/binomio-de-newton.test.js` (3: «la cuenta del término se cumple tal como se lee», «sin «1 ·»
… TAL-BN-CERO solo para poner las letras en 0», «ningún «Ahora tú» ni «Así se resuelve» es un ejemplo o una predicción
dicho de otra manera») y `plantillas/binomio-practica/generador.test.js` (2: «no repite el ejemplo «El número que
falta», k simplificado y códigos con su error» y «la práctica no repite un ejemplo ni una predicción de la teoría»).

- **A1.** `bloque(m, p)` pone paréntesis a una letra con exponente cuando se eleva; las tres cuentas (`cuentaTer`,
  `cuentaEc`, `cuentaEc3`) le pasan el exponente. Comprobado: la prueba nueva falla con el `bloque()` de antes
  («C(8, 5) · x³³ · (−2/x)⁵ = −1 792x⁴») y pasa ahora; el script de igualdades ya no encuentra ninguna.
- **M1.** Firma en el veto de la unidad (el texto exacto se cambió por la firma) y `VETO_EJ` en la práctica, con las 24
  firmas que sus tipos podían sacar. El papel cambió (p1 y p8 ya no son ejemplos) y se regeneró; en `casos.json`
  cambiaron dos casos (cenefas, semilla 1: 10; indep, semilla 0: (x + 3/x²)³ da 9), rehechos con sympy.
- **M2.** Helper `ex()`: los exponentes e índices con letra van como nodos `{ sup }` / `{ sub }` con espacio duro; las
  cifras sueltas siguen en Unicode. Ecuaciones de las reglas 1, 2 y 6 y de Mira 3 con nodos; «e₁ · (n − k) + e₂ · k».
  La regla 1 dice el coeficiente en palabras («Si b sale k veces, el coeficiente C(n, k) cuenta…»).
- **M3.** Reglas 1 y 4 reescritas dentro del tope de 45 palabras; la voz de la regla 1 lleva ahora el triángulo de Pascal.
- **M4 a M7, B1 a B6.** Como dice la tabla. Los códigos nuevos están en la cabecera de la idea 4.
- **Validador con `calidad: 2` simulada:** limpio con 60 y con 200 semillas. `node herramientas/ecuaciones-ancho.js`:
  ninguna ecuación se corta (58 pantallas, 696 renglones). Pruebas: unidad 10/10, práctica 38/38, `alg-cenefa` 3/3,
  `herramientas/papel-reglas.test.js` 6/6. `contenido/teoria/teoria.test.js`: 163/164; la que falla es
  `quimica/nomenclatura-inorganica.js`, otra unidad en curso. `npm run catalogo` corrido.

### Pendiente

- **Decidido por la sesión, Gerson revisa después:** α entero con superíndice («(1 + x)⁻¹») y fraccionario en palabras
  («elevado a 1/2»), como en los libros; el lector B lo notó pero lo leyó bien. Se deja.
- B7 (Datos de la práctica con ᵏ y ᵐ) y la nota 4 del redactor (`herramientas/papel-generador.js` no pone punto tras una
  línea que termina en «k!»): fuera del alcance (`app/` y una herramienta común).
- Las tarjetas de ejemplos no traen dibujo (lector A); el molde no lo exige en álgebra. Se deja a Gerson.
