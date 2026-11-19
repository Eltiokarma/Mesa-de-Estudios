# Auditoría de contenido: «Circunferencia y ángulos en ella» (geometria.circunferencia)

19 nov 2026. Auditor externo con criterio delegado (cierre de la Etapa 7, `docs/metodo/unidad/cierre-delegado.md`), que no
escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h, 4i y §5. Vara:
`docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md` y las listas «Lo que encontraron los
auditores» (Etapas 5 y 6) de `docs/metodo/unidad/etapa-delegada.md`. Decisiones: `docs/etapa7/propuesta-geometria.md` (§9 y
«Decisiones chicas»). Lo que vieron los dos lectores en frío está en `rutinas/frio/geometria.circunferencia.md`; aquí se cita
cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/geometria/circunferencia.js` (sin `calidad: 2`): 6 ideas con sus 7 momentos, los 90 ejemplos,
  «Ahora tú» (29 tipos) y «Así se resuelve», el glosario (21 términos), las 3 mesas.
- El bloque `redondo` de `nucleo/kit/piezas/geo-objeto.js` y sus muestras (`geo-objeto-redondo.muestras.json`).
- La práctica nueva `plantillas/geo-circunferencia/` (24 tipos en las 6 ideas, `casos.json` con 24 casos, `papel.json` con 8)
  y la escena `plantillas/angulo-inscrito/` (a «Más mesas del tema» con `"rehacer"`; papel p1 a p8 de esta unidad).
- La reserva ci-01 y ci-02 de `catalogo/pruebas/geometria.json` (formas A y B) y su verificador.
- La app a 390 px con `--entera --lector`: los 42 momentos y los 90 ejemplos (servidor propio en el puerto 4439). Capturas en
  `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-ci/lector/` (150, md5 sin repetidas
  fuera de las copias previstas de `lector/lector/`).

**Cuentas.** Rehechas con scripts propios en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-ci/aud/`. De la unidad y del generador
solo leen el texto (y, en `figuras.js`, las coordenadas de la figura).
- `ahora.js`: **4 800 casos** (400 semillas de «Ahora tú» y 400 de «Así se resuelve» por idea), resueltos desde el enunciado:
  cuerdas, tangentes y tuberías por Pitágoras; Pitot despejando el lado opuesto; el tramo tangente de un triángulo con el
  semiperímetro; Poncelet; la posición comparando d con r₁ + r₂ y |r₁ − r₂|; tres ruedas con el sistema de sumas; la faja con
  la resta de radios; central, inscrito (también desde el arco menor), semiinscrito, interior (semisuma) y exterior
  (semidiferencia, con el arco cercano como resto de la vuelta en dos tangentes); cuadrilátero inscrito y su recíproco. Por
  caso: que la situación exista (triángulos, cuadriláteros con cada lado menor que la suma de los otros, d > |r₁ − r₂| para la
  faja, arcos que suman menos de 360°, x positiva y entera), una sola correcta, ningún distractor que valga la respuesta,
  opciones distintas, toda igualdad «a op b = c» escrita (y las de comprobación) y cada frase de «Tiene sentido».
- `practica.js`: **9 600 problemas** de la práctica (400 por tipo; el inscrito y el semiinscrito con arcos de más de 180° en
  192 y 197 de 400), los 24 de `casos.json` y los 8 del papel, por el mismo camino.
- `figuras.js`: **1 600 figuras** (juegos en toda su grilla, Lee, Predice, revelar, Mira, regla, ejemplos, 400 semillas de
  «Así se resuelve» y «Ahora tú», y las 3 mesas): **323 tangentes** perpendiculares al radio (coseno < 10⁻⁶) y 11 pares de
  tangentes desde un punto iguales; **1 325 ángulos** contra su regla con los arcos medidos en los cortes de sus lados con la
  circunferencia (central = arco, inscrito y semiinscrito = mitad, interior = semisuma, exterior = semidiferencia con el arco
  restado siempre el de adentro); **785 arcos** contra el mapa (naranja el que abarca el ángulo pedido o el lejano, turquesa
  el otro); 81 cuadriláteros (opuestos 180° con los cuatro en el borde; más con D dentro, menos con D fuera); 52 lados de
  bandeja tangentes al plato; los incírculos de Poncelet (ángulo recto y distancia a los tres lados = r); la posición de las
  luces contra su lectura; las lecturas de los seis juegos medidas en la figura; los rótulos a escala; el «?» sin escala a 8° o
  más; y si una figura a escala deja medir lo pedido.
- Misiones (fuerza bruta en su grilla): tanque solo h = 20 (la otra altura de 80 cm de superficie, 80 cm, no está en el
  control); bandeja solo d = 26; luces solo d = 20; fotógrafo arco 130° en cualquier lugar; veredas a + b = 150 (siete
  maneras, a propósito); cordel solo A en 200°.
- A mano: **los 90 ejemplos** con sus 30 de nivel 3 y la explicación de cada alternativa, **las 6 predicciones con cada
  distractor** (60 = simetría; 540 = 9 · 60, 140 = 60 + 80; 36 = 38 + 30 − 32, 40 = 38 + 32 − 30; 20 < d < 80; 50 = 100 ÷ 2;
  40 = (110 − 30) ÷ 2, 70, 80 y 55; D dentro abre el ángulo), ci-01 y ci-02 en sus dos formas (34, 40, 105 y 75, con cada
  distractor) y el papel de `angulo-inscrito` (68°, 140°, 90° y 55°, x = 30, 56° y 124°, 70° y 110°, 50°, 130° y 230°).
- Validador con `calidad: 2` simulada (`Teoria.problemas`, 400 semillas): 0 problemas, 0 pendientes.
  `herramientas/ecuaciones-ancho.js`: **20 ecuaciones partidas en mal sitio** (ver M9). Pruebas propias: unidad 16 de 16,
  generador 10 de 10, `geo-objeto` y `angulo-inscrito` en verde.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, regla 1 de la Etapa 5 | Idea 5, «Así se resuelve», semillas impares (200 de 400) | «Tiene sentido: 127° queda entre la mitad del arco chico, 41°, y la del grande, 86°.» Es falso siempre: la semisuma es mayor que las dos mitades. | «La semisuma es el promedio de los dos arcos, y 127° queda entre 82° y 172°»; prueba en 400 semillas. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 1, 4 | Idea 2, Juega (`figEsquina`) | La bandeja se cierra con un borde que cruza el plato en toda la grilla (distancia al centro de 0,23 a 1,78 con r = 2): la «franja gris» por la que el plato «se sale» (lector A). La consigna dice «el plato se corre» y el control mueve la esquina, que se abre y se cierra. | La bandeja se cierra fuera de la vista; consigna «El control aleja A, y la esquina se cierra»; misión «Aleja la esquina A…». |
| M2 | 3, 5b | Idea 2, La regla | «PT = PS» con letras que no están; el dibujo es el triángulo de Poncelet con A, B y C, y AB (la hipotenusa, en tinta) sale naranja en la fórmula de Pitot (lector A). | Sin «PT = PS» en la fórmula (queda en el texto); el triángulo sin letras en los vértices, con a, b, c y r. |
| M3 | 3, molde §2 | Reglas de las ideas 1, 2, 5 y 6 | Dos relaciones unidas por «·»: «AM = MB · OT ⟂ tangente», «m∠B + m∠D = 180° · m∠A + m∠C», «… ÷ 2 · fuera: …». Se lee como un producto; la propuesta ya lo había prohibido en las lecturas. | «y» (`Y`) en las cuatro; prueba: ninguna regla lleva «·». |
| M4 | 3, 9 | Idea 5: Predice, revelar, Mira y la regla | Afuera, el arco lejano era AD y el cercano BC, mientras Juega y la fórmula de la regla («arco AB + arco CD») usan AB y CD; Mira usa la cuerda BD y la regla quedaba bajo ese dibujo, con la cuerda sin explicar (lector B). | Las veredas son QDA y QCB: lejano AB (naranja), cercano CD (turquesa); Mira con la cuerda AC (ACB y CAD); la regla con su propio dibujo y «fuera: (arco AB − arco CD) ÷ 2». |
| M5 | 4h, regla 5 | Idea 5, revelar y Mira | Dibujadas con arcos de 130° y 70° y rotuladas 110° y 30°, con «40°» en un ángulo que mide 30°, sin `sinEscala` ni aviso. | A escala: arcos de 110° y 30°, Q de 40°. |
| M6 | regla 5 de la Etapa 5 | Idea 4, Predice | A escala, el ángulo entre la tangente y la cuerda mide 50°, la respuesta, y el arco dibujado mide 100°. | Sin escala, con aviso: arco dibujado de 140° (el ángulo, 70°) rotulado 100°. Voz sin «P llegó» (no hay P en el dibujo; lector B). |
| M7 | regla 5 | Idea 2, ejemplo 3 «El radio de la escuadra» | A escala, con 6, 8 y 10 escritos, el radio se mide: 2 cm. | Sin escala (dibujado de catetos 12 y 5), con aviso. |
| M8 | 3, 4h | Idea 1, «Ahora tú» de la cuerda (`figCuerda`) | «15 cm» de la distancia, al lado de la perpendicular y pegado a la cuerda, se lee como AM (lector A). | El pie se llama M (como en los resueltos) y el rótulo dice «OM = 15 cm»; la forma se elige entre seis para que quepa. |
| M9 | regla 7 de la Etapa 5 | 20 ecuaciones (`ecuaciones-ancho.js`) | Cadenas con dos «→» o con «= ⏎ 4 cm» a 390 px: ejemplos 6, 9, 11, 12, 13 y 15 y Mira 4 de la idea 1; 2, 3, 11, 14 y 15 de la 2; Mira 4, ejemplo 14 y el caso con x de la 4; 8 y 14 de la 5; 7 de la 6; «Así se resuelve» de Poncelet; el dato de Pitágoras y la comprobación. | Cada cadena en dos pasos o más corta; Pitágoras dicho en palabras. Después: «Ninguna ecuación se corta». |
| M10 | 13 | Datos | «¿Se puede inscribir?» con «no» (ejemplo 8, «Así se resuelve», «Ahora tú» y la práctica): el dato solo dice «si suman 180°, caben» (lector B, tarjeta 17). Ejemplos 8 y 14 de la idea 4: el ángulo que ve el diámetro mide 90° sin el dato de la media circunferencia (tarjetas 11 y 12). | «…; si no, no caben» en la teoría y la práctica; `D_VUELTA` en los dos ejemplos; fuera los 360° que no se usaban en el 8 de la idea 6. |
| M11 | 3, molde §3 | Idea 2, ejemplo 14 «Tercera tangente desde lejos» | El más difícil, sin dibujo, y el resuelto salta de «PT = 12» a «el perímetro es PT + PS» sin las tangentes desde M y N (lector B, tarjeta 06). | Dibujo sin escala (`figTercera`, tangentes comprobadas por coordenadas) y el paso «desde M salen MT y MQ, que miden igual…». |
| M12 | 10 | Idea 3, ejemplo 14 «Una dentro, otra fuera» | Con el centro de 6 cm al medio, la de 2 cm toca a la de 6 justo donde esta toca a la de 15: las tres se tocan en un mismo punto (lector B, tarjeta 09). | Otro caso: 20, 6 y 4 cm, con la chica entre los dos centros (respuesta 4 cm; las tangencias en 20 y en 8). |
| M13 | 10, regla 12 | Idea 3: ejemplos 2, 8 y 12, «Ahora tú» y la práctica (`monedas`) | «Monedas» de 7, 10 y hasta 14 cm de radio (lector B, tarjeta 08). | Ruedas (ejemplos 2 y 12, «Ahora tú», práctica) y platos (ejemplo 8). |
| M14 | 3 | Idea 3, Mira y la regla (`figLuces`) | «d = 80 cm» sobre la luz llena, que está a 50; «d = 20 cm» bajo la grande; los centros de las punteadas sin marcar (lector A). | Cada copia en su dirección, con su centro y su recta punteada desde O₁, y el rótulo en su punta lejana; la llena con «d = 50 cm». |
| M15 | regla 2 de la Etapa 5 | Práctica, `poncelet` (GE-PON5) | «El radio inscrito es área ÷ semiperímetro»: una fórmula que la unidad no da. | GE-PON6 con el mismo valor (parte 2r dos veces), explicado con Poncelet; anotado en el informe de geometría. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 2 | Juegos de las ideas 4 y 6 y la mesa libre | «dónde está P = 90°» no dice desde dónde (lector B). | «dónde está P (grados de vuelta desde la derecha)». |
| B2 | 3 | Idea 6, Juega | La leyenda llama «(un arco)» a la marca del ángulo, en el tema de los arcos (lector B). | «(marca simple)», «(marca doble)». |
| B3 | 3 | Idea 6, Mira y la regla | Los dos arcos sin número (lector B). | 140° y 220°, corridos de los faroles. |
| B4 | 3 | Idea 1, La regla y Juega | La tangente no se nombra en el dibujo; h no se ve (lector A). | «tangente» sobre el piso; la regla del costado marca h (salvo h = 5, donde no cabe). |
| B5 | 3 | Idea 3, La regla | «r₁ − r₂» partido entre dos renglones (lector A). | El texto en palabras (la suma y la resta de los radios); la fórmula debajo. |
| B6 | 3 | Idea 4, «Así se resuelve» y ejemplo 6 | «P está en el arco que no abarca AOB» (lector B); «ve los faroles» en un problema sin faroles. | «P está en el arco mayor AB, del otro lado de la cuerda AB»; «ve A y B». |
| B7 | 3 | Idea 5, ejemplos 8 y 14 | El 310° sin color; «6x + 40 = 8x + 10» pierde los grados (tarjetas 14 y 15). | 310° naranja; «6x + 40° = 8x + 10°». |
| B8 | letras | La mesa libre del fotógrafo | Las dos excepciones que dejó el autor: con P a 10° de un farol (arcos de 80°, 120° y 160°), sus letras se tocan (6 estados). | **Se arreglan**: la letra de P se corre 40° hacia el lado contrario; prueba en toda la grilla. |
| B9 | 3 | ci-02, forma B | «Dos cuerdas tensas»: en esta unidad «cuerda» es otra cosa. | «Dos sogas tensas». |
| B10 | 2 | Datos de nivel 1 (tarjetas 07, 10 y 16) | El dato es la regla que se aplica (lector B). | Se deja: el nivel 1 aplica un dato, como en Polígonos. Decidido por la sesión. |
| B11 | 2 | Idea 1, ejemplo 4; idea 6, Predice | A escala: el radio y el piso forman 90° (la propiedad); D dentro se ve. | Se dejan: el primero es la propiedad (como B11 de Polígonos); el segundo, la situación de la predicción, que es cualitativa. |
| B12 | 5b | Idea 4, Mira | El central de 100° en el mismo carmín que el inscrito de Juega (lector B). | Se deja: la regla del curso pone todo ángulo dado en carmín. Decidido por la sesión. |
| B13 | 5b | Mira de las ideas 5 y 6 | Los inscritos auxiliares (CAD, el de D) abarcan el arco turquesa: el mapa colorea por el ángulo de la idea, no por el auxiliar. | Se deja: es el mapa de la propuesta (§6). |

## Lo que está bien y hay que copiar al molde

- **Las respuestas**: 14 400 casos de teoría y práctica rehechos aparte sin una falla de valor, y una prueba propia que ya
  rehace cada «Ahora tú» y «Así se resuelve» desde el enunciado.
- **Fidelidad de las figuras**: tangentes perpendiculares, cuadriláteros circunscritos construidos desde sus tramos, incírculos
  de verdad, ángulos que cumplen su regla con los arcos medidos; ninguna figura miente salvo los rótulos sin aviso de M5.
- **El mapa de arcos** (naranja el que abarca, turquesa el otro) se cumple en 785 de 785 arcos de ángulos pedidos.
- **Misiones con una sola solución** donde la propuesta lo pide, y la del tanque limitada a h = 20 por el control.
- **El glosario no regala**: ninguna definición, `simple` ni ejemplo dice una medida ni la respuesta de una predicción.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Toda frase de «Tiene sentido» o «Comprobación» con números es cierta** (A1): «queda entre X y Y», «X < Y», «X es menos que Y». | Sí: patrones comparativos sobre 400 semillas. |
| **En una regla, «·» solo multiplica**: dos relaciones van con «y» (M3). | Sí: «·» entre dos relaciones (= o ⟂ a cada lado). |
| **Una figura de revelar, Mira o la regla con rótulos de medida va a escala o con `sinEscala`** (M5). | Sí: rótulos de ángulo y de arco contra lo dibujado. |
| **Una misma letra nombra lo mismo en Juega, Predice, Mira y la regla de una idea** (M4: el arco AB). | Parcial: arcos y segmentos con nombre por su color. |
| **Una bandeja, un terreno o un objeto relleno no cruza la figura que contiene** (M1). | Sí: polígono del objeto contra los círculos de la figura. |
| **La explicación de un distractor no usa fórmulas de otra unidad** (M15: área ÷ semiperímetro). | Parcial: lista de palabras de unidades posteriores (área, π, semejanza). |

## Correcciones (19 nov)

Fase 8 (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/geometria.circunferencia.md`, «Correcciones de la ronda 1»). Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-ci/antes/`.

**Archivos.** `contenido/teoria/geometria/circunferencia.js` y `circunferencia.test.js`;
`plantillas/geo-circunferencia/generador.js`, `generador.test.js`, `casos.json` (el enunciado del caso de las ruedas) y
`papel.json` (regenerado: el dato de Pitágoras); `catalogo/pruebas/geometria.json` (ci-02 B, compartido: una frase);
`docs/investigacion/geometria-ideas-erroneas.md` (compartido: la fila GE-PON1 a GE-PON6). **No se tocó** el bloque `redondo`
de `geo-objeto` (todo se arregló desde la teoría), `app/` ni `nucleo/`.

**Pruebas.** 17 nuevas en `circunferencia.test.js` («auditoría …» y «lector …») y 3 en `generador.test.js`. Con los archivos de
antes fallan las 20 (árbol aparte en `scratchpad/e7-cierre-ci/antes-arbol/`). Después: unidad 32 de 32, generador 13 de 13,
`geo-objeto`, `angulo-inscrito`, `catalogo/pruebas`, `catalogo`, `nucleo/avance` y `contenido/teoria/teoria.test.js` en verde
(261). Validador con `calidad: 2` simulada, 400 semillas: 0 problemas, 0 pendientes. `ecuaciones-ancho.js`: todo cabe (56
pantallas). Recuentos aparte después de corregir: `ahora.js` 4 800, `practica.js` 9 632, 0 fallas; `figuras.js` sin rótulos
falsos a escala ni respuestas medibles; las letras de los juegos y las mesas no se tocan (819 figuras).

| # | Qué se hizo |
|---|---|
| A1 | «Tiene sentido: la semisuma es el promedio de los dos arcos, y X queda entre b° y a°». Prueba. |
| M1 | La bandeja del juego sigue sus bordes fuera de la vista y se cierra allá; consigna y misión dicen que se aleja la esquina. Prueba. |
| M2 | Fórmula «AB + CD = BC + DA y a + b = c + 2r»; el triángulo sin letras de vértice y con r; «Vale si» corto. Prueba. |
| M3 | `Y` en las cuatro reglas. Prueba. |
| M4, M5 | `figExterior` reescrita (QDA y QCB, lejano AB, cercano CD); revelar, Mira y la regla a escala (C y D de costado, el 40° más afuera, el 30° de Mira adentro); Mira con la cuerda AC. Prueba. |
| M6 | Predice de la idea 4 sin escala (arco dibujado de 140°) y voz «El fotógrafo llegó al farol A». Prueba. |
| M7 | `figPoncelet` acepta `dib` y `sinEscala`; el ejemplo 3, con aviso. Prueba. |
| M8 | `figCuerda`: M con letra, «OM = …», seis formas (la más lejos de la de verdad a 0,08 o más) y alto 300 cuando hay distancia. Prueba en 400 semillas. |
| M9 | Las 20 en dos pasos o más cortas; Pitágoras en palabras (también en la práctica). `ecuaciones-ancho.js`: todo cabe. |
| M10 | `D_INSCR` con «si no, no caben» (teoría y práctica); `D_VUELTA` en los ejemplos 8 y 14 de la idea 4. Prueba. |
| M11 | `figTercera` y el paso de las tangentes desde M y N (también en la solución de «Ahora tú»). Prueba. |
| M12 | Ejemplo nuevo (20, 6 y 4 cm; respuesta 4 cm, alternativas 24, 16, 14, 10 y 4 rehechas aparte). Prueba. |
| M13 | Ruedas y platos (teoría, práctica y `casos.json`). Pruebas en las dos. |
| M14 | `figLuces` con `dir` en cada copia y `textoChica`; Mira y revelar con d = 20 hacia 130° y d = 80 hacia −30°. Prueba. |
| M15 | GE-PON6 (prueba: ninguna explicación habla de área o perímetro); fila del informe de geometría. |
| B1 a B9 | Hechos (B4 y B8 con prueba; B1, B2 y B3 en una). |
| B10 a B13 | Se dejan (decidido por la sesión, Gerson revisa después). |

### Pendiente

- **Fuera de mi alcance, para la sesión:** en el árbol de trabajo, `catalogo/pruebas/verificar.js` borra los verificadores
  ari-19 a ari-26 (cambio de otra sesión, no de esta unidad); la prueba del banco pasa igual.
- **Decidido por la sesión, Gerson revisa después:** B10, B11, B12 y B13; las tarjetas 07, 10 y 16 (el dato de nivel 1 es la
  regla); que «Así se resuelve» de la idea 5 traiga tangentes desde Q sin dibujo (el enunciado basta); el «?» del semiinscrito
  sin número en la regla de la idea 4 (decisión chica 3 del autor: no hay lugar); que los Datos de «Ahora tú» de posiciones
  traigan la tabla entera (el alumno elige la fila).
