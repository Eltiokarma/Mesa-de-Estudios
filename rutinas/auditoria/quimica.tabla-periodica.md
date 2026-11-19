# Auditoría de contenido: «Tabla periódica» (quimica.tabla-periodica)

19 nov 2026. Auditor externo (fase 7 del método), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5.
Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-quimica.md` (§12, decisiones 1 a 28). Lo que
vio el lector en frío de esta ronda está en `rutinas/frio/quimica.tabla-periodica.md`; aquí se cita solo cuando el código
lo confirma o lo agrava. La unidad hermana, partida de esta, tiene su propio informe:
`rutinas/auditoria/quimica.propiedades-periodicas.md`.

**Qué se revisó.**
- La teoría `contenido/teoria/quimica/tabla-periodica.js` (v0.3.0, sin `calidad: 2`): las 4 ideas con sus 7 momentos, los
  60 ejemplos, «Ahora tú» y «Así se resuelve» (200 semillas de cada uno por idea), el glosario (20 términos) y la historia.
- Las piezas `quim-tira` (vistas tira, tabla, objetos y transición, la escalera y el probador) y lo que usa de
  `quim-molecula` (símbolo de Lewis).
- La práctica `plantillas/tabla-ubicacion/` (15 tipos en las 4 ideas, `casos.json` con 18 casos y `papel.json` con 8).
- La app a 390 px con `--entera`: los 28 momentos y los 60 ejemplos (servidor propio, puerto 4314).

**Cuentas.** Rehechas con un script propio
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-qui/cuentas.js`, compartido con
Propiedades periódicas). De la unidad y del generador solo lee el texto (pregunta, opciones, datos, resuelto). Lo demás lo
calcula aparte:
- el lugar de cada elemento sale de la tabla dibujada fila por fila;
- la configuración, por Madelung con el Cr, el Cu, la Ag y el Au;
- las clases, de listas de símbolos;
- las EI del NIST, en eV × 96,4853, para el carácter metálico.

Además evalúa toda igualdad numérica escrita («18 − (36 − 35) = 17», «2 + 8 + 5 = 15») en resueltos, `siFuera`, lecturas
del juego en toda su grilla, Mira, reglas, Lee y glosario.
- **Resultado (las dos unidades juntas): 14 851 comprobaciones antes de corregir, 108 fallas; después, 14 762 y 0.** En esta
  unidad cuadran todas las respuestas correctas:
  - «Ahora tú»: 800 casos (200 por idea), con la correcta, que ningún distractor sea la respuesta y cuatro opciones
    distintas. Los V/F, con una tabla de verdad escrita aparte para las 30 afirmaciones.
  - «Así se resuelve»: 800 casos, con el «justo encima» o «justo debajo» del paso final.
  - Los 60 ejemplos: los 20 de nivel 3 con su letra rehecha a mano, y cada alternativa con el error que dice su resuelto.
  - Las 4 predicciones con cada distractor rehecho:
    - rubidio: K, Kr y Fe;
    - yodo: 5 y 17, 4 y 17, 5 y 15, 7 y 5;
    - plata: 5 y 11, 4 y 11, 5 y 10, 5 y 1;
    - silicio: las cuatro conducciones.
  - Las 4 misiones en toda su grilla (6, 20, 10 y 6 casos): cada una se cumple con un solo caso (k = 8, Z = 16, Z = 28, el
    grafito) y ninguna al abrir.
  - La práctica: 800 problemas (200 por idea, con `{ idea }`), los 18 de `casos.json` y los 8 del papel.
- **Lo que la respuesta no ve, y sí vio el script:**
  - un `siFuera` que afirma una cuenta falsa en el 100 % de sus casos (A1);
  - dos distractores cuyo valor no sale del error que nombran (M1);
  - «Así se resuelve» con el mismo elemento que «Ahora tú» (M2);
  - tríos de carácter metálico que la EI del NIST contradice (M7).

Validador con `calidad: 2` simulada (`Teoria.problemas` con 200 semillas): **0 problemas, 0 pendientes**, antes y después.
Ninguna falta de abajo la ve una regla de hoy. Pruebas propias antes de corregir: unidad 14 de 14, `quim-tira` 7 de 7,
generador 8 de 8. `herramientas/ecuaciones-ancho.js quimica.tabla-periodica`: «todo cabe» (44 pantallas).

**Datos del mundo.** Mendeléiev 1869, galio 1875, germanio 1886, Moseley 1913, 118 elementos con el oganesón (IUPAC): una
fecha por hecho, bien. El estroncio rojo de los fuegos, el cobalto azul de los vidrios y el cromo de los aceros son de libro
y sin cifra. La moneda de un sol no se nombra (decisión 23), bien.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, 13 | Idea 2, «Ahora tú» tipo 4 (`casoFamilia2`, opción QM-D-VALENCIA) y práctica `par-familia` | La opción es [Ar] 4s² 3d^v (v = los de valencia del elemento dado) y su `siFuera` dice «Tiene v electrones después del gas noble, cierto». Tiene v + 2: «Tiene 7 electrones después del gas noble» para [Ar] 4s² 3d⁷. Pasa en los 40 de 40 casos del tipo; en la práctica, en 37 de 47, y con el Si sale el Cr (4s¹ 3d⁵), que ni siquiera tiene v electrones d. | Decir lo que sí es cierto: «Tiene 7 electrones d, como los de valencia del cloro, cierto. Pero termina en d: no es un grupo A». En la práctica, sin las excepciones como opción. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13 (distractor que no sale de su error) | Idea 2, `casoZ` (QM-SOLO-P) y `casoLewis` (QM-LEWIS-NIVEL); práctica `z-lugar` y `lewis` | QM-SOLO-P da Z − 2 y su `siFuera` dice «el romano cuenta los s y los p juntos». El que cree que VIA son 6 electrones p llega a Z + 2 (3p⁶, el argón), no a Z − 2. Pasa en 28 de 40 casos. Con el Al y el Ge, QM-LEWIS-NIVEL da «4 puntos» y dice «se cuentan sus electrones, no su número». Pero el número del nivel del Al es 3, que es la respuesta. | Z + 2 con «VIA no son 6 electrones p: son 6 entre los s y los p». QM-LEWIS-NIVEL solo cuando el nivel no es la respuesta. |
| M2 | Molde §2 (Así se resuelve ≠ Ahora tú) | Ideas 1, 2 y 3 | `resuelve-repite` mira el enunciado; aquí cambia la pregunta, pero no el elemento. En la idea 1, los 200 casos de «Así se resuelve» usan un Z que sale en «Ahora tú». En la idea 2 son 183 de 200; en la idea 3, 200. El lector tuvo el silicio en los dos momentos y respondió «sin pensar, porque ya lo vi». | Listas disjuntas por idea y una prueba que lo exija en 400 semillas. |
| M3 | 3 (Predice que no discrimina) | Predice de la idea 2 (el yodo) | Se pide «periodo y grupo» de [Kr] 5s² 4d¹⁰ 5p⁵. El que suma los 4d¹⁰ (el error que la idea quiere sacar a la luz) llega a 2 + 10 + 5 = 17: el mismo grupo. En los periodos 4 y 5 siempre pasa: 2 + 10 + n = 10 + 2 + n. El lector lo notó. | Preguntar el periodo y los electrones de valencia: 7 contra 17. |
| M4 | 3, 9 | Idea 3: Predice (plata), ejemplos del cobre, la plata y el oro y el cromo, «Ahora tú» y «Así se resuelve» con Cr, Cu, Ag o Au | La configuración real sale sin decir que rompe el orden de llenado que la misma idea trae en Datos. El lector, con 5s² 4d⁹ en la cabeza, dudó. La tarjeta del cromo dice «sumo con su configuración de verdad» y se titula «otra excepción» sin decir cuál. | En cada ejercicio con una de las cuatro: «es una excepción: un electrón del 5s pasó al 4d». En el cromo, qué daría el orden (4s² 3d⁴). Además, en la condición de la regla. |
| M5 | 12 | Regla de la idea 3 («Bloques y metales de transición») | La regla solo dice el bloque d. Lee 2 nombra los cuatro bloques, pero la regla, que es lo que queda, no; el lector creyó que la idea no los trae. | Los cuatro bloques con su lugar en la ecuación de la regla. |
| M6 | 13 (los Datos dicen la respuesta) | V/F de las ideas 1, 3 y 4 (Ahora tú y los ejemplos de nivel 3) | Los datos son la afirmación misma. «Desde 1913 se ordenan por número atómico» resuelve «La tabla ordena por número atómico»; también «Elementos por periodo: 2, 8, 8…», «Transición interna: los del bloque f», «Grupos B: … 8, 9 y 10, VIIIB», la lista de semimetales, «Carácter metálico: crece…» y «el mercurio es líquido». El V/F de nivel examen queda en leer el recuadro. | Datos que sirven para razonar y no son la afirmación: los Z de los gases nobles y «fila / columna»; el bloque, el llenado y lo que cabe; los lados de la escalera y los iones. |
| M7 | 10 | Idea 4, «Ahora tú» `casoCaracter` (tríos Al–Ga–In y Ca–As–Se) y práctica `mas-metalico` (Na–Mg–Al, K–Ca–Ga, Si–P–S, Al–Ga–In) | La unidad define el carácter metálico como «qué tan fácil pierde electrones». Con las EI del NIST que trae la unidad siguiente, el Ga (579) pierde más fácil que el Al (578)… por 1 kJ/mol. El Se (941) pierde más fácil que el As (944), el Al (578) que el Mg (738) y el S (1000) que el P (1012). El `siFuera` de la opción que llama «el menos metálico» al de la punta contradice esos datos. La correcta no cambia. | Tríos donde la EI sigue el orden de la tabla, con una prueba contra las EI del NIST. |
| M8 | 1, 8 | `quim-tira`, vista tabla con escalera (juego, Mira y regla de la idea 4) | El marco carmín del aluminio se dibuja encima de la línea gruesa y la tapa entre el Al y el Si. El lector creyó que el Al quedaba a la derecha. | Dibujar la escalera después de los marcos. |
| M9 | 13 | Ejemplos de la idea 4: «El germanio» (nivel 1), «Tres del periodo 3» (2) y «Un elemento del periodo 3» (3) | En los dos primeros, los Datos traen la lista de semimetales con el Ge y el Si: la respuesta se lee. El primer dato («a la derecha, los no metales») además deja al Ge como no metal. En el tercero falta cómo es un semimetal, que es lo que se pregunta, y sobra «dúctil». El lector vio iguales los niveles 1 y 2. | Nivel 1 por propiedades («brilla, pero conduce poco y se quiebra»); nivel 2 por el lugar («a la derecha de la escalera y tocándola»); nivel 3 con la línea «Semimetal: brilla, pero conduce poco…». |
| M10 | 3, 4f (glosario que da la clave) | Glosario «semimetal» (idea 4) | «Con propiedades intermedias entre metal y no metal» / «a medio camino entre metal y no metal» se abre antes de jugar y responde Predice: el foquito prende poco. `glosario-predice` no lo ve (no hay número). | Definirlo por su lugar en la escalera, con los seis símbolos; la conducción, en la regla. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 3 | Ejemplos de la idea 1 con tira o tabla | Las marcas ●▲■ salen sin leyenda (lector, tarjeta 01). | Figuras de los ejemplos sin marcas. |
| B2 | 9 | Regla y datos de la idea 1 | La lista de gases nobles termina en 86 y la tabla dibuja el Og 118 cerrando el periodo 7 (lector). | La lista llega al 118. |
| B3 | 13 | `casoFamilia`, opción «Gases nobles» | «Tiene un gas noble al lado en número» es falso para los que están a dos lugares (Be, Mg, O, S…). | «Está cerca de un gas noble, cierto. Pero la familia es la columna». |
| B4 | 5 | `opcionesD` | «Contaste los 1 electrones d» (Sc, Y). | «Contaste el electrón d». |
| B5 | 13 | Tarjetas 05 y 06 del lector (idea 2) | 05: falta «Z = electrones del átomo neutro». 06: «La A confunde periodo con grupo» no dice qué da; VIA → 16 sin «10 más» en Datos. | Dato del átomo neutro (también en `casoZ` y `z-lugar`); la A con sus periodos; `DU.numeros`. |
| B6 | 1 | Voz de «Ahora tú» de la idea 4 | «Ubica cada elemento respecto de la escalera» no sirve para Be, Mg y Ca (lector). | «Ubica cada casilla: su lado de la escalera, su fila y su columna». |
| B7 | 13 | Glosario «halógeno» (idea 1) | «El yodo (Z = 53), el de la sal yodada» da la familia del yodo de Predice 2 (con la pregunta de antes, su grupo). | Otro halógeno. |
| B8 | 12 | Regla de la idea 2 | El dibujo de Lewis del azufre no dice qué elemento es ni por qué 6 puntos; los puntos van 2-1-2-1 (lector). | Queda: es el dibujo de `quim-molecula` (compartido) y la regla no tiene palabras libres (tope 30). Para Gerson. |
| B9 | Molde §7 | `papel.json` de `tabla-ubicacion` | Ningún problema de la idea 1 (ley periódica): `papel-generador.js` toma las semillas sin mirar la idea. | Queda: la herramienta es compartida. Propuesta abajo. |

## Lo que está bien y hay que copiar al molde

- **Contar desde el gas noble** (decisión 4): una sola herramienta para periodo, grupo, familia y «el de abajo». Las 400
  semillas cuadran con una tabla escrita aparte.
- **Misiones de un solo caso en toda la grilla**, con una prueba que lo exige, y una reserva clara de lo que se predice. El
  juego llega a Z = 20 y Predice pregunta por el rubidio; el juego del periodo 4 no muestra la plata.
- **`incognitas` y `ocultos` en la pieza**: la tarjeta pedida va con «?», sin número ni símbolo (decisión 18).
- **Una letra por alternativa, repartida 4 y 4** en los 20 de nivel 3, y cada distractor explicado con su cuenta («La D suma
  el número del grupo: 54 + 16»).
- **El generador con su tabla propia** y la prueba que recalcula desde `_datos` con otra tabla escrita fila por fila.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Un `siFuera` o una explicación con una cuenta («Tiene 7 electrones…», «ese es su nivel») dice la cuenta de su opción** (A1, M1). | Parcial: en química, un comprobador que lea configuraciones (como `cuentas.js`) lo hace en 200 semillas. En general hace falta el motor del error. |
| **«Así se resuelve» no usa el mismo caso que «Ahora tú»**: el mismo Z o el mismo elemento, aunque cambie la pregunta (M2). | Sí: extraer «Z = n» y los nombres de elemento de los dos enunciados en 400 semillas. Esta unidad ya lo prueba. |
| **En los V/F, ningún dato es una de las afirmaciones ni su razón** (M6). | Sí: comparar cada línea de datos con las afirmaciones del banco (palabras de contenido en común). |
| **Una configuración que rompe el orden de llenado lleva «excepción» en el mismo ejercicio** (M4). | Sí, en química: s¹ con d⁵ o d¹⁰ en el texto exige la palabra. |
| **Un orden o una tendencia escritos (A > B, «el menos metálico») no los contradice la tabla de datos de la unidad ni la de su vecina**, en todas las semillas (M7). | Sí, si la unidad declara sus tablas (aquí, las EI y EN de Propiedades periódicas). |
| **Predice discrimina: el error que la idea quiere ver da otra respuesta que la correcta** (M3). | No: lo ve el auditor rehaciendo cada distractor. |
| **El papel de un generador por idea tiene al menos un problema de cada idea** (B9). | Sí: `papel-generador.js` puede elegir las semillas con `{ idea }` cuando el generador trae `TIPOS_POR_IDEA`. |

## Correcciones (19 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`), junto con las notas del lector en frío (ver
`rutinas/frio/quimica.tabla-periodica.md`, «Correcciones de la ronda 1»). La teoría pasa a v0.3.1. Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-qui/antes/`. Capturas de después en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-qui/despues-tp/`.

Las pruebas nuevas van al final de `tabla-periodica.test.js` (8), de `quim-tira.test.js` (1) y de
`plantillas/tabla-ubicacion/generador.test.js` (1). Las 10 fallan con los archivos de antes; se comprobó copiándolos a
`.../e5-cierre-qui/viejo/` y corriendo ahí las pruebas nuevas. Después:
- unidad 22 de 22, `quim-tira` 8 de 8, generador 9 de 9;
- validador con `calidad: 2` simulada: 0 problemas;
- `cuentas.js` 14 762 de 14 762;
- `ecuaciones-ancho.js`: «todo cabe»;
- `contenido/teoria/teoria.test.js`: esta unidad en verde (falla solo `razonamiento-verbal/definiciones.js`, de otra
  sesión);
- `papel-generador.js --revisar`: al día.

No se corrió `npm test` completo (otras sesiones trabajando). `npm run catalogo`: de estas dos unidades cambia solo
`app/datos/glosario/quimica.json`.

| # | Qué se hizo |
|---|---|
| A1 | El `siFuera` dice «Tiene 7 electrones d, como los de valencia del cloro, cierto. Pero termina en d: no es un grupo A». `casoFamilia2` sale del Al, el P y el Cl (sin el Si, que daba el Cr). En `par-familia`, la opción no puede ser una excepción. Pruebas: el número del `siFuera` es el exponente d de la opción, en 400 semillas de la teoría y de la práctica. |
| M1 | QM-SOLO-P da Z + 2: «Pero VIA no son 6 electrones p: son 6 entre los s y los p». En `z-lugar`, solo con más de 3 de valencia. QM-LEWIS-NIVEL ya no sale cuando el nivel es la respuesta (el Al y el Ge). Pruebas en la teoría y en el generador. |
| M2 | Idea 1: «Así se resuelve» usa Te, I, Cs, Ba, Po, At, Fr y Ra, y «Ahora tú» los quitó de sus listas. Idea 2: B, C, O, Si, S, Ge y Se solo en «Así se resuelve». Idea 3: Sc, Cr, Cu, Y y Ag solo en «Así se resuelve» (el oro queda como excepción de «Ahora tú»). Prueba: ningún Z de 200 casos de «Así se resuelve» sale en 400 de «Ahora tú». |
| M3 | Predice 2 pregunta «¿En qué periodo está y cuántos electrones de valencia tiene?». Opciones: 5 y 7 (correcta), 4 y 7 (QM-PERIODO-ANTERIOR), 5 y 5 (QM-SOLO-P), 5 y 17 (QM-D-VALENCIA, nueva en Predice). Sale QM-PERIODO-GRUPO, que sigue en «Ahora tú». Coincide y noCoincide dicen que los 4d¹⁰ son del nivel 4. Prueba: la opción que suma los 4d dice 17 y la correcta no. **Decidido por la sesión, Gerson revisa después.** |
| M4 | Predice 3, Mira 3 (paso 1), los ejemplos del cobre, la plata y el oro y el cromo, `casoUbicarD`, «Así se resuelve» y la lectura del juego dicen «es una excepción: un electrón del 5s pasó al 4d». El cromo trae «El orden de llenado daría [Ar] 4s² 3d⁴» y se titula «El cromo, una excepción». La condición de la regla dice «Con el Cr, el Cu, la Ag y el Au (excepciones), se suma su configuración real». Prueba: todo texto de la idea con s¹ y d⁵ o d¹⁰ dice «excepción». |
| M5 | La ecuación de la regla trae «bloque s: columnas 1 y 2 · p: 13 a 18 · d: 3 a 12 · f: las dos filas de abajo», y el texto «Bloque: el subnivel del último electrón (s, p, d o f)». Prueba. |
| M6 | V/F de la idea 1: los gases nobles y «Periodo: una fila. Grupo: una columna»; el ejemplo de nivel 3 cuenta los dos primeros periodos con ellos. Idea 3: bloque, llenado y «caben». Idea 4: lados de la escalera e iones. Prueba: ningún dato de un V/F trae esas líneas. |
| M7 | Teoría: Al–Ga–In → Mg–Ca–Sr y Ca–As–Se → N–P–As. Práctica: Na–Mg–Al → Na–Mg–Si, K–Ca–Ga → K–Ca–Ge, Si–P–S → Si–P–Cl y Al–Ga–In → P–As–Sb. Se rehízo `casos.json` semilla 0 («El sodio», trío 14, 11, 12; recalculado por `cuentas.js`). Pruebas: en los tríos, el más metálico tiene la EI menor y el «menos metálico» la mayor, con las EI del NIST escritas en la prueba. |
| M8 | `quim-tira` dibuja la escalera después de los marcos. Prueba de la pieza. Captura `despues-tp/claro-cel-metales-no-metales-2-juega.png`. |
| M9 | «El germanio»: por propiedades, con `semiProp` y `clases`. «Tres del periodo 3»: `toca` («a la derecha de la escalera y la toca»), sin la lista. «Un elemento del periodo 3»: `semiProp`, `clases` y la lista (pide elegir el elemento). Prueba. |
| M10 | «semimetal»: «Elemento cuya casilla está a la derecha de la escalera y la toca: boro, silicio…»; simple, «Un elemento de la orilla de la escalera de la tabla». Prueba: ni el simple ni la definición hablan de conducir. |
| B1–B7 | B1: las figuras de los ejemplos de la idea 1 van con `marcas: {}`. B2: «Z = 2, 10, 18, 36, 54, 86 y 118» en los datos y la llave de la regla. B3–B6: como en la tabla de arriba, con «Átomo neutro: Z = número de electrones» en el ejemplo 8, `casoZ` y `z-lugar`. B7: «El bromo (Z = 35), un líquido rojizo»; el ejemplo de «electrones de valencia» pasa del cloro al azufre. También el 119: «Va un lugar después del oganesón, que es del grupo 18». |
| B8, B9 | No se tocaron (ver la tabla). |

### Pendiente

- **Para Gerson (dibujos de prueba):** el símbolo de Lewis de la regla 2 sin rótulo (`quim-molecula`, compartida). La
  escalera: el polonio la toca por la derecha y la unidad lo cuenta como metal (convención de academia; no se pregunta).
- **Decidido por la sesión, Gerson revisa después:** la Predice nueva de la idea 2 (M3) y las listas de «Así se resuelve»
  con elementos pesados (M2).
- **Herramienta compartida:** `herramientas/papel-generador.js` debería tomar un problema por idea cuando el generador
  trae `TIPOS_POR_IDEA` (B9). No se cambió: dejaría desactualizado el papel de otras unidades.
- De la propuesta (decisión 22), para quien integra: `docs/datos/admision-unmsm.csv` y `docs/teoria/matriz/quimica.json`.
