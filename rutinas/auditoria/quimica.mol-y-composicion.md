# Auditoría de contenido: «Mol, masa molar y composición» (quimica.mol-y-composicion)

20 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md` y las lecciones de las Etapas 5 a 7 (`docs/metodo/unidad/etapa-delegada.md`).
Decisiones: `docs/etapa8/propuesta-quimica.md` (§11, §12 y «Decisiones tomadas al ejecutar»). Lo que vieron los dos
lectores en frío está en `rutinas/frio/quimica.mol-y-composicion.md`; aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/quimica/mol-y-composicion.js` (v0.2.0, sin `calidad: 2`): las 6 ideas con sus 7 momentos,
  los 90 ejemplos, «Ahora tú» y «Así se resuelve» en 400 semillas por idea, el glosario (19 términos), las 2 mesas del
  laboratorio y el juego de cada idea en toda su grilla.
- Las piezas `quim-mol` (nueva) y `balanza` (compartida: el «1» suelto), y lo que la unidad dibuja con `quim-particulas`
  y `quim-composicion`.
- La práctica `plantillas/mol-practica/`: 21 tipos en las 6 ideas, 400 semillas por idea, `casos.json` (21) y
  `papel.json` (8). La escena vieja (`mol-composicion`, `"rehacer": true`) solo como motor de la teoría.
- La prueba del curso: qui-23 (reserva), formas A y B.
- La app a 390 px con `--entera --lector` (servidor propio, puerto 4455): 42 momentos y 90 ejemplos; md5sum sin
  capturas repetidas (las 18 de `lector/` son copias a propósito).

**Las tablas, propias** (`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-mo/tablas.js`),
escritas sin abrir el motor, la teoría, el generador ni los scripts del autor:
- masas atómicas redondeadas del examen (las que declara la unidad: H 1, C 12, N 14, O 16, Na 23, Mg 24, Al 27, P 31,
  S 32, Cl 35,5, K 39, Ca 40, Cr 52, Mn 55, Fe 56, Cu 63,5, Zn 65, Ba 137…) y, al lado, los pesos atómicos estándar
  abreviados de la IUPAC (CIAAW 2021);
- un lector de fórmulas propio (recursivo: paréntesis anidados, «(NH₄)₃PO₄», hidratos «·10H₂O»);
- la empírica propia: moles, entre el menor, el menor factor de 1 a 6 que deja todo a menos de 0,1 de un entero (y la
  holgura que queda), con Nₐ = 6,02 × 10²³;
- un evaluador de igualdades propio: lee «a × b + c = d» con lo que se ve (coma decimal, miles con espacio, 10ⁿ,
  fracciones) y separa lo exacto, lo redondeado con «=» y lo falso.

**Contraste de las masas del examen con la IUPAC.** Todas las que dan los Datos (19 elementos) son las redondeadas de
siempre: la mayor diferencia es Zn 65 frente a 65,38, Ba 137 frente a 137,33 y Mg 24 frente a 24,305; Cl 35,5 frente a
35,45 y Cu 63,5 frente a 63,546. Ninguna respuesta depende de esa diferencia (el examen usa las mismas) y la tarjeta
«Convención del examen» de la idea 2 da las de la IUPAC (H 1,008; C 12,011; O 15,999; Cl 35,45: correctas). Los
isótopos y abundancias de los ejemplos (Cl, Li, Cu, Br, Ag, Si, K, Ga, Rb, Sb, Ir, Tl, Eu) coinciden con NIST; el neón
de «905, 3 y 92 de cada 1000» redondea 90,48/0,27/9,25 y da 20,19 con números de masa (la tabla, 20,180: está bien
porque el enunciado dice «con números de masa como masas»).

**Cuentas.** Scripts `cuentas.js` (teoría), `razones.js` (empíricas) y `practica.js` (práctica), en la misma carpeta.
- Teoría: 33 181 textos que ve el alumno (Lee, consigna, misión, leyenda, la lectura del juego en toda su grilla,
  Predice con sus `siFuera`, Mira, la regla, los 90 ejemplos, 12 de «Así se resuelve» y 400 de «Ahora tú» por idea, el
  glosario y el laboratorio). **2858 igualdades con «=» y 496 con «≈»** rehechas con lo que se ve.
- «Ahora tú», **2400 casos** (400 por idea, los 24 tipos), rehechos desde la pregunta: cada masa atómica promedio (dos y
  tres isótopos, la abundancia que falta, la comparación con el carbono-12), cada g ↔ mol ↔ entidades (también una sola
  molécula y las dosis en mg), cada mol de átomos o de iones en una fórmula (paréntesis, hidratos, iones poliatómicos),
  cada porcentaje en masa y masa de un elemento en una muestra, cada metal X de un óxido, cada empírica y molecular, y
  cada caso de Lavoisier (frasco cerrado y vaso abierto), Proust y Dalton. **Ninguna respuesta mal y ninguna pregunta con
  dos correctas.**
- **6768 distractores**: cada uno contra su modelo de error propio (promedio simple y cruzado, la masa del más común,
  la resta sin dividir, el subíndice olvidado, el paréntesis olvidado, n = m/M al revés, Nₐ que divide, átomos por
  moléculas, el porcentaje de átomos, el resto, la anhidra…): todos dan el valor que su error produce. Los «pesaría X
  g/mol» y «Con X, N sería Y %» de la idea 5, ciertos con mis tablas.
- «Así se resuelve», 2400 (400 por idea): todas las respuestas, y cada Proust con la razón real de su compuesto
  (MgO 6/10, FeS 14/22, CaO 10/14, CaF₂ 20/39; en «Ahora tú» y la práctica también ZnO, Al₂O₃, NH₃, SO₂, ZnS, Na₂O).
  Cada Lavoisier con una proporción posible (carbón 3 : 8 como en el CO₂; vinagre y bicarbonato: el gas no pasa de
  44/84 del bicarbonato). Cada Dalton con el dato de la otra fórmula rehecho con las masas de los dos óxidos.
- Empíricas: los cocientes que salen son 1,5 (×2), 2,5 y 3,5 (×2), 1,33 y 1,67 (×3); la holgura más grande con los
  porcentajes redondeados a una cifra es menor que 0,03 (ningún caso queda a dos factores). **El 1,334 del autor**: la
  magnetita da 1,3343, y «1 : 1,33» está bien redondeado; pero con los moles que se mostraban (1,29 y 1,73) el alumno
  obtenía 1,34 (ver B6). El 1,5 se duplica siempre (N₂O₃, Al₂O₃, Fe₂O₃…); nunca se redondea.
- Práctica: **2400 problemas** (400 por idea), los 21 de `casos.json` y los 8 del papel, rehechos con las mismas tablas:
  ninguna respuesta mal ni dos correctas; cada Lavoisier con la proporción de un compuesto real (CO₂, SO₂, MgO, H₂O, FeS).
- qui-23: A 0,5/180 · 4 = 11,11 mmol; B 0,4/206 · 13 = 25,24 mmol; los tres distractores de cada forma, rehechos.
- Los 90 ejemplos, rehechos a mano y con el script; todos cuadran.

**Validador con `calidad: 2` simulada** (`Teoria.problemas`, 400 semillas, temas del catálogo): **0 problemas** antes y
después. Pruebas propias antes de corregir: unidad 7 de 7, generador 7 de 7, `quim-mol` y `balanza` en verde.
`herramientas/ecuaciones-ancho.js`: «todo cabe» antes (60 pantallas). Regla del papel simulando la marca: sin fallas.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 3, 13; regla 6 de la Etapa 5 (una letra, un significado) | Datos de toda la unidad y de la práctica; la regla de la idea 2 | En un mismo recuadro, «Masas atómicas redondeadas: N = 14…» (el nitrógeno) y «N = n · Nₐ» (el número de moléculas): 19 recuadros distintos en «Así se resuelve» y «Ahora tú» de la idea 2 (NH₃, N₂O, paracetamol…), más los de la práctica (`moles-moleculas`, `dosis`). La regla escribe N = n · Nₐ sin decir qué es N (lector A). En la idea 3, «N(N) = …» para los átomos de nitrógeno. | Una sola salida: las masas atómicas sin «=» («N 14»), «N = n · Nₐ (N: número de entidades)» en cada Dato, la regla que lo dice, y «N(nitrógeno)» cuando se cuentan átomos de N. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 7; regla 1 de la Etapa 5 (redondeos con «≈») | Ideas 1, 2, 3 y 4 (ejemplos, Mira, «Así se resuelve» y «Ahora tú») y la práctica | **316 igualdades** (64 distintas) cuyo resultado está redondeado y va con «=»: «100 · 14/17 = 82,4 %» (lector B), «0,7576 × 34,969 = 26,49 u», «43,516 + 20,03 = 63,55», «(0,5/176) · 6,02 × 10²³ = 1,71 × 10²¹», «24 · 6,02 × 10²³ = 1,445 × 10²⁵». En la práctica, **80 falsas** con los números que se ven: «N(O) = 0,00852 · 6 · 6,02 × 10²³ = 3,078 × 10²²» (da 3,077). El validador las deja pasar (es como se escribe en el examen), pero la regla de la Etapa 5 pide «≈». | «=» solo si la cuenta da justo lo que se escribe; si no, «≈» (función `ig` en la teoría y el generador). |
| M2 | 3, 5 | Idea 2: Mira, la regla y «Así se resuelve» (lector A) | Nₐ se escribe «N_A» (A mayúscula, `{ sub: ['N','A'] }`) en las ecuaciones y «Nₐ» en el texto y los Datos; el glosario dice «N_A». | Una sola forma: Nₐ. |
| M3 | 13; regla 2 de la Etapa 5 | Idea 5: la regla y el Dato de la empírica (lector B), y la práctica | La regla solo dice «si sale 1,5, multiplica por 2» y el Dato «1,5, 1,33 o 1,25». Los casos dan cocientes de 2,5 (C₂H₅, el «Así se resuelve» del 82,8 % de C), 3,5 (Mn₂O₇) y 1,67 (C₃H₅): 36 de 200 empíricas de «Ahora tú» y 37 de la práctica. | Dato «Si un cociente termina en ,5, todo por 2; en ,33 o ,67, por 3; en ,25 o ,75, por 4»; la regla con ,5, ,33 y ,67. |
| M4 | 4; regla 5 de la Etapa 5 (figuras) | Idea 6, Predice (lector B) | La fila del CO₂ dibuja el tramo «O ?» a la misma escala que el del CO: mide justo el doble y da los 32 g. | Sin el tramo del O: «CO₂: 12 g de C con ¿cuánto O?». |
| M5 | 13; regla 4 de la Etapa 5 (lo previo no delata) | Idea 4, «Así se resuelve» (lector B) | La barra de masa del NH₄NO₃ da «O 60 %» y «H 5 %»: el N (35 %) sale de restar, sin la regla. Igual en las 6 semillas. | Con «?», los tramos solo llevan el símbolo. |
| M6 | 13; regla 4 de la Etapa 5 | Idea 6, el Resumen (`simple` de «proporciones múltiples») | «Dos compuestos de lo mismo: masas que van 1 a 2, 2 a 3…» se lee antes de Predice («con los mismos 12 g de C, ¿cuánto O en el CO₂?», respuesta 32 g = el doble). El validador no lo ve: busca el valor de la respuesta. | `simple` sin la razón: «Dos elementos que forman varios compuestos, como el agua y el agua oxigenada». |
| M7 | 1, 3 | Idea 2: la balanza de Juega, Predice y Mira (lectores A, propuesta §12, 24) | La pieza `balanza` dibuja un «1» gris arriba a la izquierda aunque haya una sola balanza; en Mira, los dos platillos de 18 g no dicen cuál es el agua y cuál el azúcar. | Opción `numeros: false` en la pieza (aditiva, no cambia otras unidades); rastro «izquierda: agua · derecha: azúcar». |
| M8 | 5 (la letra con serifa) | Idea 2, Juega | El rastro de la balanza dice «1,0 mol de NaCl» en la letra de la pieza, sin serifa: se lee «NaCI». | El rastro nombra la sustancia («1,0 mol de sal»); la fórmula queda en la lectura, con serifa. |
| M9 | 6, 10 | Ejemplo «El carbono de un flavonoide» (lector B) | «La quercetina … da color a la cebolla morada»: es falso. La quercetina es un flavonol amarillo; el morado de la cebolla roja es de las antocianinas. | «abunda en las capas de afuera de la cebolla». |
| M10 | 13 | Ejemplo «Proust al revés» (lector B) | La alternativa E, 65 g, «es la masa atómica del zinc», que la tarjeta no da en Datos. | E = 21 g, «suma 13 + 8» (un error que la tarjeta permite). |
| M11 | 9; regla 9 de la Etapa 5 (niveles) | Ejemplo «La plata de una medalla» (nivel 2) (lector B) | La misma cuenta que «El cobre de los cables» (nivel 1) con otros números. | Nivel 2 de verdad: falta la abundancia de la plata-109 (dos pasos). |
| M12 | 3, 12 | La regla de la idea 6 (lector B) | Dalton, «dos compuestos de lo mismo: enteros pequeños», no dice qué es el entero; el «Vale si» habla de la balanza, no de cuándo vale la ley. | La ecuación «O con 12 g de C: 16 : 32 = 1 : 2»; «Vale si»: «Lavoisier pide un sistema cerrado…». |
| M13 | 3 | Ejemplos «El agua de un hidrato» y «El fósforo de los huesos», «Verdadero o falso» de la idea 1 (lector B) | «cada una de las 5 aguas, 1: 9 O por unidad» se lee como la razón 1 : 9; «la E toma 2 mol de fosfato» no se entiende; «cada masa pesa lo mismo» no dice lo que quiere. | Frases reescritas. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 4 | Idea 1, Mira (lector A) | La lupa tiene 19 de 25 (76 %) y el texto dice 75,76 %, sin decir que la lupa redondea. | «75,76 de cada 100 son cloro-35; la lupa, con 25, muestra 19.» |
| B2 | 4 | Idea 1, Predice (lector A) | La barra del magnesio en orden 25, 24, 26. | 24, 25, 26. |
| B3 | 16 de la Etapa 6 | Idea 2, voz de Predice (lector A) | «Pesan lo mismo; …» repite la alternativa «Igual en los dos: pesan lo mismo». | «Piensa cuánto pesa una sola molécula de cada uno.» |
| B4 | 3 | Idea 2, la regla (lector A) | La fila «M» de la tarjeta de conteo cae en la columna «átomo». | La fila sin símbolo y «M:» en la columna del medio. |
| B5 | 3, 9 | Idea 3, «Vale si» (lector A) | «el agua de un hidrato» sin ejemplo (el hidrato es de Nomenclatura, que la unidad pide; el lector no lo recordaba). | «(CuSO₄·5H₂O: 5 aguas por unidad)». |
| B6 | 7 | Ejemplo «El óxido del imán» | Moles «≈ 1,29» y «≈ 1,73»: con ellos el cociente es 1,34, y el texto dice 1,33 (es el 1,334 de la nota del autor). | Moles con tres cifras: 1,293 y 1,725 (1,725/1,293 = 1,334 ≈ 1,33). |
| B7 | 7 | Idea 5, lectura del juego (lector B) | «C : H = 2 : 4» sin simplificar (la idea es que fórmulas con la misma razón dan el mismo análisis). | «C : H = 2 : 4 = 1 : 2» cuando se simplifica, sin cortar la razón entre renglones. |
| B8 | 7 de la Etapa 5 (renglones) | Idea 4, la regla (lector B) | «% = masa del elemento / M · 100»: el «· 100» bajaba solo a otro renglón. | «% de X = (100 · masa de X) / M», que cabe a 390 px (`ecuaciones-ancho.js`). |
| B9 | 7 | Ejemplos de la idea 1 (lector B) | Aportes con decimales disparejos («43,516 + 20,03»): el formato quita los ceros. | Tres decimales siempre en los aportes. |
| B10 | 8 | Idea 6, Juega (lector B) | Con 9 g, «H 1 g» y «O 8 g» quedan encimados. | El juego empieza en 18 g (la misión pide 36 g). |
| B11 | 3 | Idea 5, Lee (lector B) | «1 C por cada 2 H y cada O» se lee raro. | «2 H y 1 O por cada C». |
| B12 | 3 | Ejemplo «El oxígeno del agua» (lector B) | «de cada 9 g» sin decir que son 8 + 1. | «8 g de oxígeno y 1 g de hidrógeno forman 9 g de agua». |
| B13 | 7 de la Etapa 5 | Datos con masas (captura de después) | «N» al final de un renglón y «14» en el siguiente. | Espacio que no se corta entre el símbolo y su masa. |
| B14 | 10 | Laboratorio, mesa «Átomos contra masa» | Permite CH₁₄ (14 H por C) y el reto «la molécula con el mayor % de H» se logra con una molécula imposible; su `bien` dice «el hidrógeno apenas pasa la mitad de la masa» (53,8 % con CH₁₄; el CH₄, el real, da 25 %). | Pendiente: decisión de la mesa (ver abajo). |
| B15 | 8 | Idea 4, Juega (lector B) | «H 11,1 %» queda pegado al borde izquierdo de la tarjeta. | Pendiente: rótulos de `quim-composicion` (pieza compartida). |

Lo que se revisó y está bien (sin hallazgo): nada adelanta Reacciones y balance ni Estequiometría (ni «coeficiente»,
«reactivo», «limitante», «en exceso», 22,4 L, rendimiento ni una reacción escrita con «+» y «→»; «todo reacciona» en
cada Lavoisier); la N de entidades no se confunde con la de los neutrones (Lee de la idea 2 lo avisa; en la idea 1 los
neutrones se dicen en palabras); los símbolos de las figuras de la unidad van con serifa (`quim-mol`: la celda del cloro,
la fórmula y la columna «átomo»); ninguna misión ni ícono regala una predicción; ningún ejemplo trae la respuesta en su
figura; la letra de nivel 3 repartida (6 de cada una); las seis misiones se cumplen solo como dicen.

## Lo que está bien y hay que copiar al molde

- **Cada `siFuera` calcula su valor** con la misma cuenta del error (promedio cruzado, subíndice olvidado, Nₐ que divide):
  en 6768 distractores no hubo uno mal.
- **La empírica de «Ahora tú» solo se usa si los porcentajes redondeados vuelven a dar la fórmula**, y las moleculares
  usan factores de moléculas que existen (decisión 16 de la propuesta). Por eso ninguna razón quedó a medio camino.
- **El generador no usa el motor ni la teoría**, y su prueba rehace la respuesta con otras tablas.
- **La pieza `quim-mol`**: los símbolos en la letra con serifa (Cl no se lee «CI») y la prueba numérica de encuadre.
- **Los Proust y Lavoisier con proporciones de compuestos reales** (ZnO 13 : 3,2; CO₂ 3 : 8; el gas del bicarbonato
  0,52 de su masa): nada es imposible.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una letra no cambia de significado dentro de un recuadro de Datos** (A1): «N = 14» y «N = n · Nₐ», «M = 24» (magnesio) y «M = m / n». | Sí, en química: un símbolo de elemento que se iguala a un número no puede ser también la letra de una fórmula del mismo recuadro. |
| **Redondeo con «≈»** (M1): hoy `igualdad-falsa` acepta media unidad de la última cifra con «=». | Sí: cambiar una línea de la regla (el documento de reglas ya lo anticipa); en las 25 unidades con calidad 2 saldrían 76 casos. |
| **La misma constante se escribe igual en toda la unidad** (M2): N_A y Nₐ. | Sí: comparar `{ sub }` de las ecuaciones con el texto. |
| **El Dato del método cubre los casos** (M3): si el ejercicio pide multiplicar por 3, el Dato dice cuándo. | Parcial: en química, comparar los cocientes de la empírica con los que nombra el Dato. |
| **Una figura con «?» no deja medir lo pedido** (M4, M5): a la misma escala que un dato, el tramo que falta da la respuesta; tampoco van los demás porcentajes si el pedido es el resto. | Parcial: en `quim-composicion`, un tramo `tenue` u oculto con `escala: 'comun'` no puede tener el valor de la respuesta. |
| **El `simple` del glosario no dice la relación de Predice** (M6): `glosario-predice` busca el valor; aquí estaba la razón «1 a 2». | Parcial: buscar en el `simple` la razón (a : b, «a a b») que da la opción correcta. |
| **Las fórmulas en la letra sin serifa**: un rótulo SVG con «Cl», «Al», «I» fuera de una pieza que la pone en serifa (M8). | Sí: buscar símbolos con l/I en los `<text>` sin `font-family` serif. |
| **Un dato del mundo con su fuente** también en el enunciado de un ejemplo (M9: «da color a la cebolla morada»). | No: lo revisa el auditor. |

## Correcciones (20 nov)

Hechas en el mismo cierre, junto con las notas de los dos lectores en frío (ver `rutinas/frio/quimica.mol-y-composicion.md`,
«Correcciones de la ronda 1»). Se mantiene la v0.2.0 (la unidad no se publicó con esta versión).
- Copias de antes: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-mo/antes/`.
- Capturas de después: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-mo/despues/`.
- Los guiones de correcciones: `.../e8-cierre-mo/corregir.py`, `corregir2.py` y `corregir-gen.py`.

**Pruebas nuevas.** Todas fallan con los archivos de antes (comprobado en `.../e8-cierre-mo/viejo/`, `viejo-g/` y
`viejo-b/`):
- al final de `mol-y-composicion.test.js`, 6: A1 y M2 (la N y Nₐ), M1 y B9 (redondeos con «≈», con un evaluador propio en
  todas las ecuaciones de 400 semillas), M7, M8, B3 y B4 (la balanza y la regla de la idea 2), M4, M5, M6 y B2 (figuras y
  Resumen), M3, M12, B1, B5, B7, B8 y B10 (lo que dice cada regla), M9 a M13, B6 y B12 (las tarjetas);
- al final de `generador.test.js`, 1: A1, M1 y M3 en la práctica;
- al final de `balanza.test.js`, 1: `numeros: false` no dibuja el número; por omisión, sí.

**Después:**
- unidad 13 de 13; generador 8 de 8; `balanza` 9 de 9; `quim-mol` en verde (no cambió);
- validador con `calidad: 2` simulada y 400 semillas: 0 problemas;
- `cuentas.js` y `practica.js`: sin fallas (0 igualdades redondeadas con «=», una sola forma de Nₐ, ningún recuadro con
  las dos N; queda un falso positivo de mi lector de «M(…)» en «M(H₂) = 2 g/mol y M(O₂) = 32 g/mol»);
- `ecuaciones-ancho.js`: «todo cabe» (60 pantallas, 328 renglones);
- `contenido/teoria/teoria.test.js`: esta unidad en verde (fallan `aritmetica/numeros-racionales` y
  `trigonometria/angulos-en-posicion-normal`, de otros agentes);
- el papel, regenerado con `herramientas/papel-generador.js mol-practica` (`--revisar`: al día); la regla del papel
  simulando la marca: sin fallas;
- capturas de después (132, md5sum sin repetidas).

| # | Qué se hizo |
|---|---|
| A1 | `masasTxt` (teoría y generador) sin «=» y con espacio que no se corta («N 14»); `D_NN` y `D.NN` con «(N: número de entidades)»; la regla de la idea 2: «N, el número de entidades, es n por Nₐ»; `casoNumero` y `atomosDosis` escriben «N(nitrógeno)». |
| M1 | `ig(exacto, texto)` en la teoría y el generador: «=» solo si lo escrito es exacto. Aplicado a `ecPct`, `sumaAportes`, `aporteTxt`, Mira de la idea 1, el neón, una molécula de agua, `casoUnaMolecula`, `casoDosis`, `casoNumero`, `casoMasaEn`, `casoHidrato` y a las soluciones de 9 tipos de la práctica (la de `atomos-dosis` con «≈» a los dos lados). |
| M2 | `NA = { sub: ['N', 'a'] }` y el glosario con `simbolo: 'Nₐ'`. |
| M3 | `D_EMP2` + `D_EMP3` (y `D.emp3` en el generador): «Si un cociente termina en ,5, todo por 2; en ,33 o ,67, por 3; en ,25 o ,75, por 4»; la regla de la idea 5 con ,5, ,33 y ,67. |
| M4 | `barrasCO(…, true)`: la fila del CO₂ sin el tramo del O. |
| M5 | `barras4(…, oculto)`: los tramos de masa solo con el símbolo; el `alt` sin porcentajes. |
| M6 | `simple` de «proporciones múltiples» sin la razón. |
| M7 | `balanza.js`: `datos.numeros === false` no dibuja el número (bloque propio, aditivo; por omisión se numera como antes). La unidad lo usa en Juega, Predice y Mira; rastros «izquierda: agua · derecha: azúcar». |
| M8 | Rastro del juego con el nombre de la sustancia. |
| M9 | La quercetina «abunda en las capas de afuera de la cebolla». |
| M10 | Alternativa E = 21 g («suma 13 + 8»). |
| M11 | La plata de nivel 2 con la abundancia que falta (48,16 % sale de restar). |
| M12 | Regla de la idea 6 más corta y con «como en la figura», ecuación «m antes = m después · O con 12 g de C: 16 : 32 = 1 : 2», «Vale si»: «Lavoisier pide un sistema cerrado…». |
| M13 | Tres frases reescritas. |
| B1–B13 | Todas hechas. |

### Pendiente

- **B14, la mesa «Átomos contra masa»** deja armar moléculas imposibles (CH₁₄). Propuesta: tope de H en 2·C + 2 y el reto
  del mayor % de H con su `bien` («el CH₄: 25 %»). No lo cambié: cambia los retos de una mesa sin preguntas; lo decide
  la sesión.
- **B15, el «H 11,1 %» pegado al borde** y el «H» que cae debajo de su tramo cuando es angosto: lo resuelve la colocación
  de rótulos de `quim-composicion`, pieza compartida con otras unidades.
- **La letra de la app** (botones, Datos, enunciados) sigue sin serifa: «NaCl», «HCl» se leen «NaCI», «HCI» fuera de las
  figuras (lo mismo que dejó pendiente Nomenclatura). Un arreglo para toda la app lo decide la sesión o Gerson.
- **Para Gerson** (decidido por la sesión, Gerson revisa después): la N del número de entidades se queda (es la de los
  libros, propuesta §12, 4) y lo que cambia son las masas atómicas de Datos, que van sin «=» («Masas atómicas
  redondeadas: N 14; H 1»). Descartado: otra letra para las entidades (no es la del examen) o separar en recuadros
  distintos (los ejercicios necesitan las dos líneas).
- **La balanza con un solo platillo numerado**: elegí la opción aditiva (`numeros: false`, solo esta unidad). Otras
  unidades con una sola balanza siguen con su «1» (Materia y energía, Cortes y pesadas…); si se quiere quitar en todas,
  basta con numerar solo cuando hay más de una balanza (una línea de `balanza.js`), pero cambia sus capturas.
