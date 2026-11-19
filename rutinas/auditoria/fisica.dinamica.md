# Auditoría de contenido: «Dinámica» (fisica.dinamica)

19 nov 2026. Auditor externo con criterio delegado (`docs/metodo/unidad/cierre-delegado.md`; fases 7 y 8), que no
escribió la unidad. Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`, y las listas «Lo que encontraron los auditores» (Etapas 5 y 6) de
`docs/metodo/unidad/etapa-delegada.md`. Decisiones: `docs/etapa7/propuesta-fisica.md` (§9 y «Decisiones nuevas de las
fases 2 a 5»). Lo que vieron los dos lectores en frío está en `rutinas/frio/fisica.dinamica.md`; aquí se cita cuando el
código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/fisica/dinamica.js` (v0.3.0, sin `calidad: 2`): las 6 ideas con sus 7 momentos, los 90
  ejemplos, «Ahora tú» y «Así se resuelve» (400 semillas de cada uno por idea), el glosario (13 términos), las 3 mesas y
  la tabla de letras; su prueba `dinamica.test.js`.
- La pieza `nucleo/kit/piezas/fis-estatica.js`: el bloque de Dinámica es aditivo (`objetoDinamica` y seis nombres en
  `alt`); los objetos de Estática no cambian. No se tocó: lo que falla está en cómo la usa la unidad (`dclCaja`).
  `estatica.test.js`, `fis-estatica.test.js` y `fis-estatica-dinamica.test.js` en verde antes y después.
- La práctica `plantillas/fis-dinamica/` (19 tipos con `TIPOS_POR_IDEA`, sobre el motor de `plantillas/dinamica`), su
  `casos.json` y su `papel.json`; las reglas del papel con `calidad: 2` simulada en `fis-dinamica`, `dinamica` y
  `dinamica-fuerzas` (limpias).
- La app a 390 px con `--entera` (servidor propio en el puerto 4434): los 42 momentos y las 90 tarjetas, antes
  (`scratchpad/e7-cierre-dn/lector/`, ninguna repetida por md5) y después (`…/despues/`);
  `herramientas/ecuaciones-ancho.js` sobre la unidad (60 pantallas, 674 renglones: nada se sale ni se parte).

**Cuentas** (scripts propios en el scratchpad `e7-cierre-dn/`, que de la unidad solo leen el texto que ve el alumno y,
en la práctica, la respuesta; no usan las fórmulas de la unidad, ni `plantillas/dinamica/motor.js`, ni el generador):
- `cuentas.js`: un DCL por cuerpo, armado a mano con el signo de cada fuerza (piso con fuerzas a 0°, 180° y 37°; rampa
  de 37° con el rozamiento contra el movimiento; mesa con polea, máquina de Atwood, rampa con balde y tren de carritos con
  una ecuación por cuerpo y la misma aceleración; persona o bloque colgado con «arriba positivo»; loma, hondonada, rizo,
  columpio y balde con «hacia el centro positivo»), resuelto por eliminación de Gauss; la cinemática se integra paso a
  paso (sin v² = v₀² + 2ad); despejes por bisección. **4 800 casos** (400 semillas × 6 ideas × «Ahora tú» y «Así se
  resuelve»: cada aceleración, tensión, normal, lectura de balanza, fuerza hacia el centro, radio y μ mínimo) y **7 200
  distractores**, cada uno contra el valor del error que nombra su código. Cuadran todos los valores y todos los
  distractores. Además, cada situación se comprueba posible: la normal no sale negativa (piso con cuerda a 37°, loma,
  rizo), la cuerda no se afloja (T > 0 en mesas, Atwood y rampa), lo que «desliza» acelera hacia donde se dice, lo que
  «baja deslizando» tiene μk < tan 37°, lo que se levanta en la Luna sube y la plataforma pide μs ≤ 1: **ningún caso
  imposible**. Nada se arranca desde el reposo con rozamiento (todo lo que tiene μk ya desliza; la mesa del laboratorio
  dice «ya desliza» y se queda quieta con el estático cuando frena), así que no hace falta comparar con μs.
- `ejemplos.js`: los 90 ejemplos con el mismo DCL (el cuenco, con la normal hacia el centro de la esfera y el giro de
  radio R · sen 37°) y, en los 30 de nivel 3, las **96 alternativas incorrectas** contra el error que nombra el resuelto.
  Cuadran las 90 respuestas; tres explicaciones no dan su valor (M5).
- La práctica: **2 400 problemas** (400 semillas por idea) y los **19 casos** de `casos.json` con el mismo DCL; ningún
  error da la correcta. El papel (8), a mano: cuadra.
- Las 6 predicciones con sus distractores (izquierda; 2/12,5/0,32/1,25 m/s²; 4/2/8/16 m; 12/20/8/30 N; 400/600/500/100 N;
  13 200/6800/10 000/3200 N) y las 6 misiones: cada una con un solo caso de la grilla y ninguna al abrir.
- **Trabajo y energía:** ningún ejercicio, dato ni texto de la unidad o de la práctica pide un trabajo, una energía o una
  potencia (solo la cabecera dice que quedan para la unidad siguiente).
- **Aceleración centrípeta:** se usa como dato (en `datos` de toda la idea 6 y en la Predice, 3,2 m/s²), y «Lee» la
  recuerda en una tarjeta titulada «De Movimiento circular»; ningún momento la vuelve a deducir, el glosario no la define
  y la ficha pide `fisica.movimiento-circular`. La fuerza centrípeta es el nombre de la suma (glosario y regla): ningún
  DCL la dibuja.
- Validador con `calidad: 2` simulada (`Teoria.problemas`, 60 y 400 semillas): **0 problemas**, antes y después.
  Ninguna de las faltas de abajo la ve una regla de hoy.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 1, 5; DCL | `dclCaja` en la idea 6: ejemplos 6.6 y 6.15 (columpio), 6.10 (balde arriba), 6.11 (rizo); «Así se resuelve» impar (columpio); «Ahora tú» k = 3 (rizo); 6.7 y 6.14 (N = 0) | El DCL dibuja la tensión de las cadenas **horizontal** (debe ir hacia arriba), la del balde arriba **horizontal** (hacia abajo) y la normal del carrito de cabeza **hacia arriba** (la pista lo empuja hacia abajo, como dice el resuelto). Con «N = 0» dibuja igual una flecha N (lector B, tarjeta 18). El DCL contradice la cuenta de al lado. | Fuerzas verticales al lado del peso (`Tvert`, `Nabajo`) y «N = 0» escrito, sin flecha. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Repetición (Etapa 5, 8; Etapa 6, 15) | «Ahora tú» y «Así se resuelve» | Mi script, en 400 semillas: «Así se resuelve» de la idea 1 = ejemplo 1.6 (4 semillas) y de la idea 5 = ejemplo 5.6 (35); «Ahora tú» de la idea 2 k = 1 = la misión (5 kg en la Luna marcan 8 N: 6); idea 3 k = 3 = ejemplo 3.10 (19); idea 4 k = 0 = ejemplos 4.1 y 4.11 (27) y k = 3 = el sistema de 4.9 (3); idea 5 = ejemplos 5.2 y 5.11 (7). | Fuera de sus listas. |
| M2 | DCL (Estática A4) | Figuras de la idea 4 (`figMesa`, `figAtwood`): Predice, revelar y regla, Mira, juego, 4.1, 4.2, 4.5, 4.6, 4.9, 4.11, 4.15, «Ahora tú» y «Así se resuelve» | El costal nunca lleva su peso ni la normal; en 4.9 la caja solo tiene el rozamiento hacia atrás y nada que la jale (lector: «nadie jala»); en la Atwood que pide a solo están los pesos. | Si la figura dibuja alguna fuerza, todas las de cada cuerpo. |
| M3 | 3, 5 (notación) | Datos de toda la idea 6 («a_c = v² / r = ω² · r»), resuelto de 3.14 («μ_k»), pasos de «Así se resuelve» de las ideas 3 y 6 («f_k = …», «a_c = …»), `siFuera` de la Predice 6, `aprendizaje` de la idea 3 | La app escribe esos campos como texto plano: sale «a_c» y «μ_k» con guion bajo (los dos lectores). ω aparece en los Datos de la loma y del balde sin decir qué es (lector B). | Fichas `{ sub }`; `a_c = v²/r` donde se usa v y `a_c = ω² · r` (con ω dicha) donde se usa ω. |
| M4 | 7; igualdad falsa | Lectura del juego 6 y de la mesa «loma» | Con el control en marcha (`auto`), la rapidez vale 6,03 y se escribe «6»: «A 6 m/s: 8 174,97 N» cuando a 6 m/s son 8200 N (lector B). | La lectura y el dibujo usan la rapidez que se muestra (una cifra decimal). |
| M5 | Distractores (Etapa 5, 2) | 1.14 E («20 m/s², suma el lanzamiento»), 4.12 C («divide 2 · 1 entre 2»), 6.11 E («olvida el cuadrado de v» da ΣF = 400 N, pero la normal saldría −1600 N); `DC-SIN-CUADRADO` en «Ahora tú» y en la práctica | La explicación no rehace el valor de la alternativa. | 1.14 E pasa a 50 m/s² (5 · 10 en vez de 5 ÷ 0,5); 4.12 C, la velocidad media (1 m en 1 s); 6.11 E y `DC-SIN-CUADRADO`, «sin el cuadrado y sin el peso». |
| M6 | 10 (creíble) | «Ahora tú» de la idea 1 (k = 3) y `reposo` de la práctica; ejemplo 1.7 | Una caja empujada a mano llega a 30, 40 y 50 m/s (180 km/h); el carrito del mercado, a 15 m/s. | Hasta 12 m/s; 1.7 con 16 N (6 m/s). |
| M7 | Retroalimentación | «Ahora tú» de la idea 1, k = 2, la caja a velocidad constante | Las tres explicaciones son las de las otras situaciones: la de «Hacia la izquierda, como el rozamiento» dice «si su velocidad cambia, hay aceleración», y aquí no cambia. | Explicaciones propias de esa situación. |
| M9 | Prueba del curso | `catalogo/pruebas/fisica.json`, fis-29 y fis-30 (reserva) | Las cuatro formas son casos de los ejemplos resueltos: 8 kg con 2 kg (4.6), 6 kg con 4 kg (4.11), 60 kg que sube frenando 2 m/s² (los 480 N de 5.11) y 70 kg que baja y frena 3 m/s² (5.6). Quien vio la tarjeta recuerda el número. | Otros casos, del mismo tipo y con los mismos errores. |
| M8 | Figuras (rótulos) | `figLoma`, `figRizo`; la a⃗ horizontal de `dclCaja` | «v = 6 m/sN = ?» y «v = 10 m/sDCL arriba» pegados; la a⃗ punteada tapa «P = 200 N», «a = ?» y «m/s²» (los dos lectores). La prueba de rótulos no los ve porque solo se tocan. | v⃗ más a la izquierda; a⃗ más abajo y su rótulo al lado de la punta. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | Repetición | Práctica `fis-dinamica` | Repite los casos de 1.6 (`neta`), 4.1 y 4.11 (`mesa`), 4.9 (`aspera`), 5.2 y 5.6 (`balanza`). | Fuera de sus listas. |
| B2 | Objetos | 2.5 «un perro» dibujado como una caja; 4.2 «jalada solo por una cuerda» con un balde dibujado; 6.10 el balde sobre una pista rayada y derecho arriba; 6.6 la niña de pie en el columpio | | Quedan (no traban). |
| B3 | DCL | 3.8 dibuja un rozamiento que el problema no da (lector B) | | Sin f; «en un piso liso». |
| B4 | Credibilidad | «Ahora tú» de la plataforma: hasta 8 m del eje (la práctica corta en 4 m) | | Queda. |
| B5 | Ambigüedad | «Ahora tú» de la idea 1, el trineo que baja por la duna y se jala «hacia la izquierda» | La aceleración va a lo largo de la duna; «hacia la izquierda» es aproximado. | Queda. |

**Lo que el lector en frío vio y el código confirma** (arriba): A1 (tarjeta 18), M2 (4.9), M3, M4, M8; y los que se
corrigen como del lector en `rutinas/frio/fisica.dinamica.md`.

## Lo que está bien y hay que copiar al molde

- **Las cuentas**: 4 800 casos, 7 200 distractores, 90 ejemplos, 96 alternativas de examen, 2 400 problemas de práctica y
  los 19 casos cuadran por otro camino, con un DCL por cuerpo; ningún caso imposible.
- **Un color por clase de fuerza**, el de Estática, con su prueba por el campo `m` de cada ficha; la aceleración y la
  fuerza neta en tinta, con la a⃗ punteada fuera del cuerpo.
- **Predicciones que atacan el error con datos** (D1 en la idea 1, la masa que no cambia en la Luna, la masa que se
  cancela en la frenada, la tensión que no es el peso, el ascensor que sube frenando, la hondonada contra la loma).
- **La aceleración centrípeta como dato** y la «fuerza centrípeta» como nombre de una suma, sin flecha propia.
- **Valores exactos** con `exacto()` y `elegir()`, y `opciones()` que marca `repiteCorrecta` (lo que pidió Estática).

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **La dirección de cada fuerza del DCL es la de la situación**: la tensión y la normal en una curva vertical apuntan como en el resuelto (arriba, abajo); «N = 0» sin flecha. | Semi (en la prueba de la unidad, por el ángulo de cada flecha según su color; hecho aquí). |
| **Ningún «_» en un texto plano**: `datos`, `solucion.texto`, `pasos.texto`, `siFuera`, `aprendizaje` son texto que la app no convierte; un subíndice va como ficha `{ sub }`. | Sí (en `Teoria.problemas`: una letra seguida de «_» y una minúscula o cifra fuera de las figuras). |
| **Una lectura con un control `auto` habla del valor que se muestra**: si el control anima, la lectura no puede mezclar el valor redondeado de la pantalla con el de la animación. | Sí (evaluar la lectura en valores intermedios de la grilla y comparar sus números con los del valor redondeado). |
| **«Así se resuelve» tampoco repite un ejemplo** (hoy `resuelve-repite` solo mira «Ahora tú»). | Semi (comparar el enunciado sin números y sus números con los de los ejemplos del mismo tipo). |
| **Dos separados por «·» en una ecuación** («ΣF⃗ = m · a⃗ · a = ΣF/m» se lee «m · a · a»). | Sí (tres o más espacios alrededor de «·» entre dos igualdades). |

## Correcciones (19 nov)

Hechas por el mismo auditor (fase 8), con las notas de los dos lectores en frío de la ronda 1 (anotadas aparte en
`rutinas/frio/fisica.dinamica.md`). Archivos tocados: `contenido/teoria/fisica/dinamica.js` y su `.test.js`;
`plantillas/fis-dinamica/generador.js`, `generador.test.js` y `casos.json` (la semilla 21); `catalogo/pruebas/fisica.json`
(fis-29 y fis-30, compartido). `papel.json` se regeneró y no cambió. No toqué la pieza, `app/`, `nucleo/`, el catálogo ni otras unidades.

**Pruebas.** Ocho pruebas nuevas en `dinamica.test.js` («auditoría A1» a «M7» y «lector en frío») y una en
`generador.test.js`; las nueve fallan con la versión de antes (copias en `scratchpad/e7-cierre-dn/prueba-antes/` y
`prueba-antes-gen/`) y pasan con la nueva. En verde: la unidad (15), el generador (28), la pieza y su bloque de Dinámica,
`estatica.test.js` (la pieza compartida no se tocó). El validador común (`teoria.test.js`) falla solo en otras unidades
(`aritmetica/mcd-y-mcm.js`) y en `app/datos/glosario/algebra.json` sin regenerar (sesiones paralelas). Validador con
`calidad: 2` simulada: 0 problemas. Cuentas otra vez por mi camino: 4 800 casos y 7 200 distractores, 90 ejemplos y 96
alternativas, 2 400 problemas de práctica y los 19 casos: todo cuadra, nada imposible, nada repite un ejemplo, la misión
ni la predicción. Ecuaciones a 390 px, después: 60 pantallas y 679 renglones, nada se corta ni se parte mal (dos
partidas que aparecieron al pasar a fichas, el dato de a_c con paréntesis y el resuelto de 3.14, se rehicieron). La
regla de la idea 4 queda con la fórmula del sistema; la del bloque está en su texto. Capturas de después:
`scratchpad/e7-cierre-dn/despues/`.

### Alta

- **A1.** Hecho: `dclCaja` dibuja las fuerzas verticales al lado del peso (`Tvert: 1` en el columpio, `Tvert: −1` en el
  balde, `Nabajo` en lo alto del rizo) y escribe «N = 0» sobre la caja, sin flecha (6.7 y 6.14). Prueba «auditoría A1»
  (el ángulo de cada flecha por su color en los ejemplos y en 400 semillas).

### Media

- **M1.** Hecho: cada caso fuera de su lista (idea 1, sin 10 kg con 70 y 30 N; idea 2, sin 5 kg en la Luna; idea 3, lo
  que baja sin μk = 0,5; idea 4, sin 6 kg con 2 o 4 kg ni 5 y 3 kg con 0,2; idea 5, sin 70 kg que baja y frena 3 m/s², 60
  kg que sube y acelera 2 m/s² ni 480 N con 60 kg). Prueba «auditoría M1».
- **M2.** Hecho: `figMesa` dibuja, si dibuja alguna fuerza, el peso, la normal y la cuerda del costal (y su rozamiento) y
  la cuerda y el peso del balde; `figAtwood`, la cuerda de cada bloque con su peso. El balde sube 10 px para que su peso
  no toque el piso. Prueba «auditoría M2».
- **M3.** Hecho: `a_c` y `f_k` y `μ_k` como fichas en Datos, pasos y resuelto; dos datos de la centrípeta: `D.ac`
  (a_c = v²/r, con v y r dichas) y `D.acw` (a_c = ω² · r, con ω dicha) solo donde hay ω (6.8, 6.12, 6.13 y la plataforma de
  «Ahora tú»). Prueba «auditoría M3».
- **M4.** Hecho: `vVista` (una cifra decimal) en la lectura, el dibujo y el `alt` del juego 6 y de la mesa «loma».
  Prueba «auditoría M4».
- **M5.** Hecho: 1.14 E = 50 m/s² («calcula 5 · 10 en vez de 5 ÷ 0,5»); 4.12 C «da la velocidad media, 1 m en 1 s»;
  6.11 E y `DC-SIN-CUADRADO` (teoría y práctica) «sin el cuadrado y, además, sin el peso». Las letras correctas no
  cambian. Prueba «auditoría M5 y M6».
- **M6.** Hecho: «Ahora tú» k = 3 y `reposo` hasta 12 m/s; 1.7 con 16 N (2 m/s², 6 m/s); `casos.json`, la semilla 21
  pasa a 5 kg, 4 N y 5 s (4 m/s), rehecha con `cuentas.js`. Pruebas «auditoría M5 y M6» y la del generador.
- **M7.** Hecho: la caja a velocidad constante trae sus tres explicaciones (D1, DN-UNA, W5). Prueba «auditoría M7».
- **M9.** Hecho: fis-29 A con 12 kg y 3 kg (24 N; 30, 120 y 6 N), B con 7 kg y 3 kg (21 N; 9, 70 y 30 N); fis-30 A con
  65 kg (520 N; 780, 130 y 650 N), B con 80 kg (1040 N; 800, 240 y 560 N). Rehechos con `cuentas.js`;
  `catalogo/pruebas/pruebas.test.js` (que los verifica con el motor) en verde. Es un archivo compartido: solo cambian
  esos dos pares.
- **M8.** Hecho: la v⃗ de la loma y del rizo 30 px más a la izquierda; la a⃗ horizontal del DCL 10 px más abajo con el
  rótulo al lado de la punta, y la vertical con el rótulo sobre o bajo la punta; «sin escala» 6 px más abajo.

### Baja

- B1 y B3: hechos (B1 con su prueba en `generador.test.js`; B3 en la prueba «lector en frío»). B2, B4 y B5: quedan (no
  traban la lectura ni la cuenta).

### Decidido por la sesión, Gerson revisa después

1. La Predice de «Masa y peso» deja el dato «en la Tierra, con esos 40 N, acelera 2 m/s²» (lector A: casi daba la
   respuesta) y pregunta por «una caja de 20 kg con 40 N» en la Luna: la respuesta sale de la masa, no de comparar con
   la Tierra. Los ids, las opciones y los errores no cambian, así que `prediccionDN` no se toca.
2. Toda figura de bloques que dibuja una fuerza dibuja todas las de cada cuerpo, aunque se cancelen (el peso y la normal
   del costal en la mesa lisa): un DCL a medias se lee como un cuerpo sin equilibrar.
3. Las dos igualdades de una misma línea se separan con «;» (antes, con «·», que se leía «m · a · a»): 20 ecuaciones.
