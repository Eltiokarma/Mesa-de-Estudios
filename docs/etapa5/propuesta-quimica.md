# Propuesta de ideas: «Tabla periódica»

`quimica.tabla-periodica` · Etapa 5 del plan de calidad, tercera unidad de la rama «Materia y átomo» (sigue a «Materia
y energía» y «Estructura atómica», las dos con `calidad: 2`) · fase 1 (`docs/metodo/unidad/1-ideas.md` §A) · 19 nov 2026

Gerson delegó el criterio: esta propuesta ya se está ejecutando (la idea 1 se escribió con ella como guion). Lo que
decidí sin preguntar está al final, en «Decisiones tomadas (Gerson revisa después)», cada una con su motivo y la
alternativa que descarté. **No hay ningún conflicto crítico.** La decisión más grande es partir la unidad en dos
(sección 3): es la misma operación de Magnitudes/Vectores, Exponentes/Productos notables y MRU/MRUV.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1 a 3),
`docs/teoria.md` (4 a 4i y §5), las decisiones de las etapas 2, 3 y 4, `docs/etapa4/propuesta-quimica.md` (modelo), la
teoría de hoy (`contenido/teoria/quimica/tabla-periodica.js`, v0.1.0), su ficha en `catalogo/cursos/quimica.json`, las
tres plantillas que la nombran (`atomo-y-tabla`, `configuracion-ubicacion`, `quimica-conceptos`), el informe
`docs/investigacion/atomo-enlace-ideas-erroneas.md` (TP1 a TP8 y la sección del 18 nov), `docs/temario-completo.md`, la
matriz `docs/teoria/matriz/quimica.json` (unidad 3), `catalogo/pruebas/quimica.json` (no tiene ítems de esta unidad), las
preguntas de San Marcos (`docs/datos/admision-unmsm.csv`, `docs/clasificacion/trampas-admision-unmsm/quimica.md`), la
unidad modelo `estructura-atomica.js` con su prueba, su auditoría y su lector en frío (qué se corrigió), y las ideas de
las vecinas (`enlace-quimico.js`, `nomenclatura-inorganica.js`) para no adelantar nada.

---

## 0. Qué pregunta la admisión

La UNI la pone en la semana 3 y San Marcos en su tema 2. En el banco Cuzcano hay unas 101 fichas: ubicación de un
elemento (18), periodos, grupos y bloques (17), tendencias periódicas (15), metales, no metales y semimetales (14) y
energía de ionización y afinidad electrónica (11). En la admisión real de San Marcos (2019-I a 2027-I) hay **8 preguntas**
clasificadas aquí y otras 6 de unidades vecinas que piden algo de la tabla:

| Periodo | Qué piden | Trampa que anota el solucionario | Idea donde cae |
| --- | --- | --- | --- |
| 2019-I (n.º 110, día 1) | Que los elementos de un grupo comparten propiedades químicas | Confundir grupo (vertical) con periodo (horizontal) | A1 |
| 2019-I (n.º 110, día 2) | Propiedades comunes de los gases nobles | Confundir VIIIA con VIIIB; creer que todos tienen octeto (el helio no) | A1 (familia) y A2 (el helio) |
| 2019-II (n.º 84) | Radio, afinidad y electronegatividad a lo largo de un periodo | Darle a un periodo lo que comparte un grupo | B1, B3 y B4 |
| 2023-I (n.º 89) | Átomo e ion sodio: niveles y configuración | Confundir el átomo neutro con su catión | A2 (lo del ion ya está en Estructura atómica) |
| 2024-I (n.º 91) | Grupo y periodo de un halógeno desde su Z (Z > 36) | Tomar como periodo el subnivel de mayor energía | A2 |
| 2025-I (n.º 93) | Grupo, configuración anómala y carácter metálico de dos metales preciosos | Ignorar la anomalía; llamar transición interna a un metal del bloque d | A3 y A4 |
| 2026-I (n.º 90) | Grupo, periodo, anión y familia de un halógeno pesado | Intercambiar grupo y periodo | A1 y A2 |
| 2027-I (n.º 87) | Electronegatividad, radio, tipo de elemento y estado físico en el periodo 4 | Invertir la tendencia del radio y del carácter metálico | A4, B1 y B4 |
| vecinas | 2025-I n.º 87 y 2026-I n.º 86 (grupo de un metal de transición), 2025-II n.º 86 (periodo de un halógeno), 2025-II n.º 89 (bloque), 2026-II n.º 94 (radio del anión de un halógeno), 2025-II n.º 93 y 2021 n.º 88 (electronegatividad en un enlace) | «Ubicar mal el grupo», «tomar el periodo del grupo», «creer que el anión es más pequeño» | A2, A3, B2 y B4 |

Las dos trampas que más se repiten son **grupo contra periodo** (unas 5 preguntas, la n.º 26 del informe de trampas) e
**invertir una tendencia** (2). Son anotaciones del solucionario, no mediciones: ninguna tiene porcentaje. Lo único
medido de esta unidad es de energía de ionización y electronegatividad (TP1 a TP8, Singapur y Turquía).

---

## 1. Diagnóstico de la teoría actual

1. **Cinco ideas** (`periodos-grupos-bloques`, `ubicacion-lewis`, `radio-atomico-ionico`, `energia-ionizacion`,
   `electronegatividad`), con «Lee» y «Así se resuelve», y un laboratorio de dos mesas con retos comprobados. La base de
   datos sirve: radios de Clementi, energías del NIST y electronegatividades de Pauling (Allred), con su fuente.
2. **Punto 1: ninguna primera pantalla tiene un objeto.** Las cinco abren con la tabla (`quim-tabla`) o con un símbolo de
   Lewis. Los objetos solo están escritos (el cobre de Toquepala, la sal de Maras).
3. **Punto 2: no hay misión.** Las consignas describen controles y casi todo se mueve solo («La casilla recorre la tabla
   sola», «Z sube y baja solo», «Un marco baja solo»). Tres ideas tienen un control «t» en segundos, el reloj de la
   animación (el defecto que ya se sacó de las dos unidades anteriores). No hay `leyenda`, `aprendizaje`, `actividad`,
   `pregunta` ni `calidad: 2`. La cabecera dice «postulante de 3.º–5.º».
4. **Punto 7: las lecturas encadenan con «·»** («Na: periodo 3 · grupo 1 · bloque s · metal») y no enuncian nada.
5. **La predicción de la idea 1 no es una predicción**: pregunta qué pasó con los huecos de Mendeléiev (historia que se
   sabe o no se sabe), y dos de sus tres opciones llevan el mismo código (QM-HUECOS).
6. **La tabla llega solo a Z = 36 y esconde el bloque d** en una casilla («Sc–Zn»). San Marcos pregunta halógenos con
   Z > 36 (2024-I, 2026-I) y metales de transición con su grupo (2025-I dos veces, 2026-I): justo lo que la figura no
   puede mostrar. La regla de la idea 2 despacha a los de transición en la condición («el grupo cuenta también los d»).
7. **Punto 13: ningún ejercicio trae `datos`**; «Así se resuelve» es el generador de «Ahora tú» con la semilla s + 900;
   no hay ejemplos resueltos (0 de 75); el glosario tiene 15 términos sin `simple` y con 0 o 1 ejemplo.
8. **Colores contra §5b.** Z va en carmín, la energía de ionización en naranja y la electronegatividad en verde: en la
   mesa de las tres propiedades quedan juntos naranja y verde (0,010 en protanopía). En Estructura atómica Z es naranja.
9. **Falta contenido**: los nombres de las familias (alcalinos, halógenos, gases nobles: el examen los usa siempre), la
   numeración IA…VIIIA y IB…VIIIB del examen, cuántos elementos tiene cada periodo, el carácter metálico, la serie
   isoelectrónica (que salió de Estructura atómica para venir aquí), las energías de ionización sucesivas y la afinidad
   electrónica más allá de su definición.
10. **La práctica no es por idea.** `configuracion-ubicacion` le da a esta unidad `ubicar` y `familia`, los dos por
    configuración y con `datos` en una sola línea larga; `quimica-conceptos` solo tiene el tema `ion-sodio`; el papel de
    `atomo-y-tabla` (p5 a p9) no trae «Datos». No hay nada de radio, ionización ni electronegatividad en generadores.

---

## 2. Qué se queda, qué cambia y qué sale

**Se queda:** los cinco `id` de idea y los de sus controles (`z`, `g`, `p`, `k`), las dos mesas con sus `id`, las tablas
de datos con su fuente, la historia de Mendeléiev (con Moseley, que hoy falta) y la pieza `quim-tabla` para las ideas
que comparan valores.

**Cambia:**
- **La unidad se parte en dos** (sección 3): «Tabla periódica» conserva el `id` y se queda con lo que se *ubica*
  (periodo, grupo, familia, bloque, metal o no metal); «Propiedades periódicas» (`quimica.propiedades-periodicas`, nueva)
  recibe lo que se *compara* (radio, ionización, afinidad, electronegatividad), con sus dos mesas.
- Tres ideas nuevas: `bloques-transicion` y `metales-no-metales` en la primera; `radio-ionico` en la segunda.
- La idea 1 deja de ser «leer casillas» y pasa a ser la ley periódica: por qué la tabla tiene esa forma.
- La tabla crece: periodos 1 a 7 en las figuras de ubicación, y el bloque d abierto en la idea de los de transición.
- Colores nuevos (sección 8), los de Estructura atómica donde la magnitud es la misma.

**Sale:** el reloj «t» de las tres ideas y los automáticos; «Leer una configuración» y «Los de valencia» de «Lee» de la
idea 2 (ya son de Estructura atómica, que estrenó «capa de valencia»: aquí se recuerda en una línea); la escena
`atomo-y-tabla` pasa a «Más mesas del tema» en las dos unidades (`"rehacer"`), como ya está en Estructura atómica.

---

## 3. Las ideas, en orden

Son **ocho**. No caben en una unidad (tope de 6, o 7 con `septimaIdea`), y tienen una costura natural: ubicar y
comparar. Por eso van en dos unidades de cuatro ideas, como en las academias («Tabla periódica» y «Propiedades
periódicas»).

### A. «Tabla periódica» (`quimica.tabla-periodica`, conserva el `id`)

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| A1 | `periodos-grupos-bloques` | Ley periódica: periodos y grupos | Ordenados por Z, los elementos repiten sus propiedades cada cierto número: cada fila es un periodo y cada columna, un grupo de elementos parecidos. |
| A2 | `ubicacion-lewis` | Ubicación y notación de Lewis | El periodo es el mayor nivel con electrones. En los grupos A, los electrones de ese nivel dan el grupo y los puntos del símbolo de Lewis. |
| A3 | `bloques-transicion` (nueva) | Bloques y metales de transición | El bloque es el subnivel donde cae el último electrón. En el bloque d, el periodo es el mayor n y el grupo suma los electrones ns y (n − 1)d. |
| A4 | `metales-no-metales` (nueva) | Metales, no metales y semimetales | Los metales, a la izquierda y abajo, conducen la corriente y pierden electrones; los no metales, arriba a la derecha, los ganan; los semimetales bordean la escalera. |

### B. «Propiedades periódicas» (`quimica.propiedades-periodicas`, unidad nueva)

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| B1 | `radio-atomico-ionico` | Radio atómico | El radio crece al bajar por un grupo, porque hay un nivel más, y baja hacia la derecha en un periodo, porque más protones jalan el mismo nivel. |
| B2 | `radio-ionico` (nueva) | Radio de iones e isoelectrónicos | Un catión es menor que su átomo y un anión, mayor. Con los mismos electrones, es más pequeña la especie con más protones. |
| B3 | `energia-ionizacion` | Energía de ionización y afinidad electrónica | Arrancar un electrón siempre cuesta energía: más hacia la derecha y hacia arriba, con saltos (Be–B, N–O). La afinidad es la energía al ganar uno. |
| B4 | `electronegatividad` | Electronegatividad y carácter metálico | La electronegatividad dice quién jala más el par compartido de un enlace; crece hacia el flúor. El carácter metálico crece al revés. |

**Por qué va cada una en su lugar y qué da por sabido**

- **A1.** Da por sabido, de Estructura atómica, qué es Z. No usa la configuración: primero el hecho (las propiedades se
  repiten y por eso hay filas y columnas), después la causa (A2). Aquí entran los 7 periodos y los 18 grupos, cuántos
  elementos tiene cada periodo (2, 8, 8, 18, 18, 32, 32), que cada periodo termina en un gas noble (Z = 2, 10, 18, 36,
  54, 86), los nombres de las familias que el examen usa (alcalinos, alcalinotérreos, anfígenos, halógenos, gases
  nobles) y la doble numeración (grupo 17 o VIIA). Su nivel de examen: verdadero o falso de la ley periódica, «¿qué par
  es de la misma familia?» y dónde iría un elemento todavía no descubierto.
- **A2.** Usa la configuración y la capa de valencia de Estructura atómica (ideas 4 y 5) y explica A1: los de una
  columna tienen los mismos electrones en su último nivel. Elementos representativos (grupos A) hasta Z = 86 (San Marcos
  pregunta el yodo y el astato), el helio como excepción y el símbolo de Lewis de un átomo. Lewis de moléculas y el
  octeto no entran: son de Enlace.
- **A3.** Necesita A2. Bloques s, p, d y f; el grupo B (IIIB a IIB) con ns + (n − 1)d; VIIIB son tres columnas; el Cr,
  el Cu, la Ag y el Au caen donde su suma dice (4s¹ 3d⁵ sigue siendo grupo 6); bloque f = transición interna.
- **A4.** Necesita el mapa de A1 a A3. Qué es un metal por lo que hace (conduce, brilla, se deja laminar, pierde
  electrones), la escalera, los semimetales (B, Si, Ge, As, Sb, Te), el estado físico a temperatura ambiente (Hg y Br
  líquidos) y hacia dónde crece el carácter metálico, solo como mapa (el porqué, en B4).
- **B1.** Necesita periodo y grupo. La definición de radio y sus dos tendencias con la carga nuclear y los niveles.
- **B2.** Necesita B1 y los iones e isoelectrónicos de Estructura atómica (ideas 1 y 5). Aquí llega la comparación de
  radios de los isoelectrónicos (decisión del 18 nov).
- **B3.** Necesita B1 (más cerca del núcleo, más cuesta) y Hund (el 2p apareado del oxígeno). Energías sucesivas: el
  salto grande dice el grupo. Afinidad electrónica como proceso aparte, con su convención de signo en `datos`.
- **B4.** Necesita «par compartido», que se presenta en «Lee» con el agua (el enlace se estudia después). Cierra con las
  flechas de todas las tendencias juntas, que es como San Marcos las pregunta (2019-II, 2027-I).

Qué **no** entra en ninguna de las dos: estados de oxidación y óxidos ácidos o básicos (Nomenclatura), el octeto y las
estructuras de Lewis de moléculas (Enlace), tipo de enlace por diferencia de electronegatividad (Enlace), carga nuclear
efectiva con reglas de Slater (no se pregunta), Bohr con números (Física moderna).

---

## 4. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| A1 | **Un globo con helio, un letrero de neón y un foco con argón**, cada uno con la tarjeta de su elemento debajo; después, la tira de tarjetas de los primeros 20 elementos | los tres objetos = tres gases que casi no reaccionan; la tarjeta = el elemento con su símbolo y su Z; la marca de la tarjeta (●, ▲, ■) = cómo se porta |
| A2 | **La bolsa de sal yodada de la cocina** (lleva yodo, Z = 53) junto al hotel del electrón del yodo, con su último piso marcado | la bolsa = dónde está ese elemento; el hotel = su configuración (el mismo de Estructura atómica) |
| A3 | **Una moneda de un sol** (cobre, cinc y níquel) y un anillo de plata, junto a la tabla con el bloque d abierto | la moneda y el anillo = metales de transición de todos los días; la franja del medio de la tabla = el bloque d |
| A4 | **Un probador casero: pila, foquito y dos cables** que se cierran con un alambre de cobre, papel aluminio, una barrita de azufre, la mina de un lápiz o un trozo de silicio | el foquito = prende si el material conduce; cada material = un elemento con su casilla |
| B1 | **Un cristal de sal de Maras bajo la lupa**: dos núcleos vecinos y la distancia entre ellos | la mitad de esa distancia = el radio; el círculo de cada casilla = el radio a escala |
| B2 | **El salero** (Na⁺ y Cl⁻), con el átomo y su ion lado a lado, a la misma escala | círculo = tamaño; el número de adentro = protones; los puntos de afuera = electrones |
| B3 | **Una romana de mercado** (la balanza de resorte) que jala el electrón de afuera de un átomo: una analogía que «Lee» presenta con su dibujo | cuánto marca la romana = la energía para arrancarlo (kJ/mol) |
| B4 | **Dos personas que jalan una soga** con un nudo al medio (el par compartido), junto a la molécula | cada persona = un átomo; el nudo = el par de electrones; hacia quién se corre = el más electronegativo |

La romana y la soga son analogías (punto 6 del contrato): «Lee» las presenta con su dibujo y dice su límite. Todo se
dibuja como prueba (`data-prueba`). Para A1 hice una pieza nueva, `quim-tira` (los tres objetos, la tira que se corta
en filas y la tabla que queda); las demás se deciden al escribir cada idea (los objetos sueltos pueden ir a
`quim-objeto`; `quim-tabla` necesita los periodos 5 a 7 y el bloque d abierto, como opción).

---

## 5. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) |
| --- | --- | --- | --- | --- |
| A1 | «Aquí están los primeros 20 elementos, en orden de Z. La tira se corta en filas iguales.» **Corta la tira para que el litio, el sodio y el potasio queden en una columna.** | `k`, tarjetas por fila: de 5 a 10 (empieza en 10) | `v.k === 8` | Con 7: «Filas de 7: bajo el litio (metal blando) queda el neón (gas).» Con 8: «Filas de 8: Li, Na y K, metales blandos, en una columna.» |
| A2 | «El hotel del electrón de cada elemento, hasta el calcio.» **Encuentra el elemento del periodo 3 que tiene 6 electrones en su último nivel.** | `z` de 1 a 20 | `v.z === 16` | «Azufre: último nivel 3, con 2 + 4 = 6 electrones: periodo 3, grupo 16 (VIA).» |
| A3 | «La moneda de un sol tiene tres metales vecinos de la fila 4.» **Encuentra el metal del periodo 4 cuyo grupo sale de 4s² 3d⁸.** | `z` de 19 a 36 (casilla que se arrastra por la fila 4, con el bloque d abierto) | `v.z === 28` | «Níquel: [Ar] 4s² 3d⁸, bloque d; grupo 2 + 8 = 10.» |
| A4 | «El foquito prende si el material deja pasar la corriente.» **Prende el foquito con un elemento que no sea metal.** | `m`, el material: cobre, aluminio, hierro, azufre, grafito, silicio, yodo | `v.m === 'grafito'` | «Azufre: no metal, a la derecha de la escalera: el foquito no prende.» |
| B1 | «En la sal, los núcleos vecinos están a una distancia fija.» **Encuentra el átomo más grande del periodo 3.** | `z` (casilla arrastrable, grupos principales hasta el periodo 4) | `v.z === 11` | «Na: 190 pm, el mayor de su fila; a su derecha, el Mg mide 145 pm.» |
| B2 | «En el salero, el sodio y el cloro están como iones.» **Deja al cloro más grande que el potasio neutro.** | `z` de una lista de 8 elementos y `q`, la carga (de −2 a +2, solo las que existen) | radio del ion del cloro > radio del K | «Cl⁻: 181 pm, más que el Cl (un electrón más, mismos 17 protones).» |
| B3 | «La romana marca cuánto cuesta arrancar el electrón de afuera.» **Encuentra, en el periodo 2, un elemento que cueste menos que su vecino de la izquierda.** | `z` de 3 a 10 | `EI[z] < EI[z − 1]` (B u O) | «B: 801 kJ/mol, menos que el Be (900): su 2p está más lejos.» |
| B4 | «Dos átomos comparten un par: jala más el de mayor electronegatividad.» **Arma el enlace con la mayor diferencia que puedas.** | `a` y `b`, dos casillas | la diferencia máxima de la tabla (el motor la calcula) | «H–Cl: 3,16 − 2,20 = 0,96; el par se corre hacia el Cl.» |

Notas: ningún juego se mueve solo. En A1 el juego llega solo a Z = 20, para que la fila de 18 (y el rubidio) no se haya
visto antes de la predicción. En B3 el juego recorre el periodo 2 y la predicción es del periodo 3.

---

## 6. La predicción de cada idea

La app baraja las opciones; los `datos` traen solo valores, nunca la regla. Lo que se pide va con «?» en tinta.

**A1.** «Bajo el potasio, en su misma columna, está el rubidio (Z = 37). Casi nadie lo ha tenido en la mano. ¿Cómo
esperas que sea?» Datos: kriptón (Z = 36), gas que casi no reacciona; hierro (Z = 26), metal duro.

| Opción | Qué mide |
| --- | --- |
| Un metal blando que reacciona con el agua, como el potasio | Correcta |
| Un gas que casi no reacciona, como el kriptón, su vecino | Le da a la fila lo que es de la columna (QM-FILA-COLUMNA, nuevo; es la trampa de San Marcos 2019-I y 2019-II) |
| Un metal duro como el hierro: los dos tienen muchos protones | Cree que la masa o el tamaño de Z decide cómo se porta (QM-PROPIEDAD-Z, nuevo; hipótesis) |
| No se puede saber sin tenerlo en la mano | No cree que la tabla sirva para predecir (QM-SIN-LEY, nuevo; reemplaza al QM-HUECOS de hoy; hipótesis) |

**A2.** «El yodo de la sal yodada tiene Z = 53 y su configuración es [Kr] 5s² 4d¹⁰ 5p⁵. ¿En qué periodo y grupo está?»
Datos: [Kr] son los 36 electrones del kriptón.

| Opción | Qué mide |
| --- | --- |
| Periodo 5, grupo 17 (VIIA) | Correcta |
| Periodo 4, grupo 17 (VIIA) | Toma el periodo del gas noble o del 4d (QM-PERIODO-ANTERIOR; vecina de la trampa de San Marcos 2024-I) |
| Periodo 5, grupo 15 (VA) | Cuenta solo los 5p (QM-SOLO-P, ya existe) |
| Periodo 7, grupo 5 (VB) | Intercambia periodo y grupo (QM-PERIODO-GRUPO; la trampa de San Marcos 2026-I) |

**A3.** «El hierro de un clavo termina en 4s² 3d⁶. ¿En qué periodo y grupo está?» Datos: hierro, Z = 26.

| Opción | Qué mide |
| --- | --- |
| Periodo 4, grupo 8 (VIIIB) | Correcta |
| Periodo 3, grupo 8 (VIIIB) | Toma el periodo del 3d, el último subnivel (QM-PERIODO-D; trampa de San Marcos 2024-I) |
| Periodo 4, grupo 6 (VIB) | Cuenta solo los 3d (QM-GRUPO-SOLO-D) |
| Periodo 4, grupo 2 (IIA) | Cuenta solo los 4s, como en un representativo (QM-GRUPO-SOLO-S) |

**A4.** «El silicio de un chip está pegado a la escalera de la tabla. Si cierras el probador con un trozo de silicio,
¿qué hace el foquito?» Datos: con cobre prende fuerte; con azufre no prende.

| Opción | Qué mide |
| --- | --- |
| Prende muy poco: conduce más que el azufre y mucho menos que el cobre | Correcta |
| Prende igual que con el cobre: el silicio brilla como un metal | Clasifica por el brillo (QM-METAL-BRILLO, nuevo) |
| No prende nada: lo que no es metal no conduce | Solo dos clases, sin semimetales (QM-DOS-CLASES, nuevo) |
| Prende más que con el cobre, por eso se usa en los chips | El uso por la propiedad (QM-CHIP, nuevo) |

**B1.** «Del sodio al cloro, en el periodo 3, cada átomo tiene un protón y un electrón más que el anterior. ¿Qué pasa con
el radio?» Correcta: baja. Distractores: «sube, porque hay más electrones» (TP4, 50 % en Tan y otros 2005, ítem 2: es
respaldo vecino), «no cambia: todos tienen tres niveles» (QM-RADIO-NIVEL), «sube y después baja» (QM-RADIO-MITAD, nuevo).

**B2.** «El O²⁻, el F⁻, el Na⁺ y el Mg²⁺ tienen los mismos 10 electrones. ¿Cuál es el más grande?» Datos: Z de cada uno.
Correcta: el O²⁻ (8 protones para los mismos 10 electrones). Distractores: «el Mg²⁺: tiene más protones» (QM-ISO-ORDEN),
«los cuatro miden igual» (QM-ISO-RADIO), «el Na⁺: los cationes son más grandes que los aniones» (QM-ION-RADIO; San Marcos
2026-II anota «creer que el anión es más pequeño»).

**B3.** «¿Cuál necesita más energía para perder un electrón: el fósforo (3s² 3p³) o el azufre (3s² 3p⁴)?» Es el ítem 9 de
Tan y otros (2005), el único con dato: correcta con su razón, 32,1 %.

| Opción | Qué mide |
| --- | --- |
| El fósforo: en el azufre sale un electrón apareado, que se repele con su pareja | Correcta |
| El azufre: tiene más protones | Un solo factor (10 %) |
| El azufre: está más a la derecha y la energía siempre sube | La flecha como ley (QM-FLECHA; el error objetivo de la matriz) |
| Los dos igual: están en el mismo periodo | TP7 (en parte) |

La razón «el 3p semilleno del fósforo es estable» (TP6, 20 %) da el orden correcto y es la que enseñan las academias: va
en «Mira» como «también lo vas a oír así», sin castigarla (advertencia del informe).

**B4.** «El flúor es el elemento más electronegativo. ¿Qué dice eso de un átomo de flúor solo, sin enlaces?» Se queda la
de hoy, con sus códigos separados: «que tiene carga negativa» (TP8, 25 % de 88 universitarios), «que tiene más
electrones que protones» (TP8-E, nuevo: parte el código), «que libera energía al ganar un electrón» (QM-EN-AFINIDAD).

---

## 7. Tabla de letras y símbolos

| Símbolo | Un solo significado | Aviso |
| --- | --- | --- |
| Z | número atómico: los protones | Como en Estructura atómica |
| 1 … 18 | número de grupo (columna) | — |
| IA … VIIIA, IB … VIIIB | el mismo grupo, como lo escribe el examen | **La A de «VIIA» no es el número de masa ni la alternativa A.** Va siempre pegada al romano y la primera vez se escribe con su número: «grupo 17 (VIIA)». La letra de una alternativa va en negrita y en tinta |
| periodo 1 … 7 | fila | En física, «periodo» es el tiempo de una vuelta: el glosario es por curso |
| n | nivel; «ns¹» es el s del último nivel, sea cual sea | La n genérica se presenta en A2 («3s¹, 4s¹…: ns¹») |
| s, p, d, f | bloques (y subniveles) | — |
| e⁻ | electrones (de valencia) | — |
| ●, ▲, ■ | marcas de las tarjetas de A1: gas que casi no reacciona, metal blando que reacciona con el agua, no metal que forma sales | Formas, no colores: se distinguen sin color y la leyenda las dice |
| X, Q, R | elementos sin nombre de un problema | **No uso Y ni W**, que son el itrio y el wolframio, **ni E**, que se confunde con la alternativa E |
| • | un electrón de valencia en el símbolo de Lewis | — |
| r | radio atómico o iónico, en pm | r también es el radio de una circunferencia; aquí siempre «radio atómico» |
| EI, AE, EN | energía de ionización, afinidad electrónica, electronegatividad | Siglas de los libros; «EN» no es «en». ΔEN es la diferencia |
| kJ/mol, pm | kilojulios por mol de átomos; picómetros | El mol se presenta en una línea (se estudia después, en Mol y composición) |
| δ+, δ− | carga parcial | Solo en B4 |

---

## 8. Mapa de colores (un color fijo por magnitud en cada unidad, §5b)

**A. Tabla periódica**

| Magnitud | Token | Por qué |
| --- | --- | --- |
| Z | `o` naranja | el dato casi siempre; igual que en Estructura atómica |
| periodo (la fila) | `i` turquesa | lo que se pide, primera parte |
| grupo (la columna, la familia) | `h` carmín | lo que se pide, segunda parte; los mismos tres que ya usa el generador `ubicar` |
| electrones de valencia, puntos de Lewis, los ns y (n − 1)d que se suman | `f` violeta | los electrones son violeta en Estructura atómica |
| símbolos, nombres de familia, bloques, marcas ●▲■ | tinta | no son magnitudes |
| `d` verde | no se usa | naranja–verde 0,010 |

Pares (molde §5b): naranja–turquesa 0,114; naranja–violeta 0,159; turquesa–violeta 0,101; carmín–violeta 0,164;
turquesa–carmín 0,077; naranja–carmín 0,062, el más justo: Z lleva siempre «Z =» y el grupo, la palabra «grupo». La
respuesta lleva el color de su magnitud («periodo 5» en turquesa, «grupo 17» en carmín); nada se pinta antes de
comprobar. Los fondos de bloque de `quim-tabla` (hoy naranja, turquesa y verde) pasan a tramas en tinta.

**B. Propiedades periódicas**

| Magnitud | Token |
| --- | --- |
| Z, los protones que jalan | `o` naranja |
| radio | `i` turquesa |
| energía (de ionización y afinidad) | `h` carmín |
| electronegatividad | `f` violeta |
| carga del ion, electrones | tinta, con su signo |

Hoy la ionización es naranja y la electronegatividad verde; se cambian al rehacer la unidad B (fase 3), con su prueba.

---

## 9. Práctica: qué existe y cómo se rehace por idea (no se escribe todavía)

Lo que hay: `configuracion-ubicacion` (tipos `ubicar` y `familia`, los dos por configuración, Z hasta 86, `datos` en una
línea), `quimica-conceptos` (tema `ion-sodio`), la escena `atomo-y-tabla` (borrador; papel p5 a p9) y las dos mesas.

| Idea | Hay | Propuesta |
| --- | --- | --- |
| A1 | `familia` (resuelve por configuración: es de A2) | Generador nuevo **`tabla-familias`**: familia de un Z contando desde su gas noble, el elemento de abajo, el periodo de un Z, cuántos elementos tiene un periodo, el par de la misma familia y V/F de la ley periódica. Datos en lista (gases nobles, familias o largo de los periodos, según el tipo) |
| A2 | `ubicar` (bloque p) | Generador nuevo **`ubicacion-tabla`**, con `TIPOS_POR_IDEA`: representativos (periodo y grupo desde Z o desde la terminación), Z desde la ubicación, puntos de Lewis, «¿qué par es de la misma familia?» por configuración |
| A3 | `ubicar` (bloque d) | En `ubicacion-tabla`: periodo y grupo de un metal de transición, bloque de un elemento, grupo con anomalía (Cr, Cu, Ag, Au), A contra B (Mg y Zn no son familia) |
| A4 | nada | Generador nuevo **`metales-no-metales`**: clasificar por su lugar, por sus propiedades, estado físico, mayor carácter metálico de un trío; V/F en `quimica-conceptos` (tema nuevo) |
| B1 y B2 | papel p6 y p8 | Generador nuevo **`radios-tabla`**: mayor de un par, ordenar tres o cuatro, ion contra átomo, serie isoelectrónica |
| B3 | papel p7 y p9 | Generador nuevo **`ionizacion-afinidad`**: mayor de un par (con los saltos), ordenar, energías sucesivas → grupo, afinidad |
| B4 | nada | Generador nuevo **`electronegatividad`**: ΔEN, hacia quién se corre el par, ordenar, todas las flechas juntas |

`configuracion-ubicacion` se queda solo con Estructura atómica cuando `ubicacion-tabla` exista (sus tipos `ubicar` y
`familia` se mudan con sus códigos AQ-). `atomo-y-tabla` va a «Más mesas del tema» en las dos unidades; su papel p5 se
queda en A y p6 a p9 pasan a B, con «Datos». Mesa nueva para A1 («Arma la tabla»: la tira hasta Z = 54 con cortes
libres). `nucleo/repaso-tipos.js` y la prueba del curso (un par nuevo por unidad) se actualizan con lo mismo.

---

## 10. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Globos con helio, letreros de neón, focos de filamento con argón | Hechos de todos los días, sin cifra |
| Litio, sodio y potasio: metales blandos que reaccionan con el agua; flúor y cloro: gases que forman sales con los metales | Valores cualitativos de libro (OpenStax, *Chemistry 2e*, §2.5 y §18) |
| Mendeléiev, 1869; el galio (1875) y el germanio (1886) llenaron dos de sus huecos; Moseley, 1913, ordena por Z | Historia: OpenStax §2.5 y NIST (Moseley), la fuente de la matriz. Una fecha por hecho, con su prueba (lección de la auditoría de Estructura atómica) |
| 118 elementos; el oganesón (Z = 118) cierra el periodo 7 | IUPAC, tabla periódica de los elementos (`fuente` en el ejemplo que lo usa) |
| Elementos por periodo: 2, 8, 8, 18, 18, 32, 32; gases nobles: Z = 2, 10, 18, 36, 54, 86 | Cuentas sobre la tabla, no datos del mundo |
| La sal de mesa del Perú es yodada | Hecho de todos los días, sin cifra ni norma citada |
| La moneda de un sol es de alpaca (cobre, cinc y níquel) | **Por confirmar** en el BCRP antes de escribir A3; si no, «una moneda» sin decir de qué |
| Radios (Clementi y otros, 1967), energías de ionización (NIST), electronegatividad (Pauling, Allred 1961), radios iónicos (Shannon, 1976) | Ya están en la unidad con su fuente; cada valor sale de la tabla del archivo |
| El mercurio y el bromo son líquidos a temperatura ambiente | Valor de libro |

---

## 11. Riesgos de orden con otras unidades (`requiere`)

- **A requiere `quimica.estructura-atomica`** (Z, configuración, capa de valencia, ion). **B requiere A.** **Enlace pasa
  a requerir B** (usa la electronegatividad y los electrones de valencia); antes requería esta unidad.
- **«Capa de valencia»** se estrenó en Estructura atómica; aquí A2 estrena «electrones de valencia» y la recuerda.
- **«Metal»** lo usan antes Materia y energía (aleaciones) y Estructura atómica (metal de transición) como palabra de
  todos los días; se define aquí (A4). Para A1 basta «metal blando», que se dice en la leyenda.
- **Lewis**: aquí solo el símbolo de un átomo; la estructura de una molécula es de Enlace (ya lo define así).
- **Lo que no puede aparecer aquí** porque llega después: octeto, enlace iónico o covalente, estado de oxidación, mol
  (solo como «por cada mol de átomos» en la unidad kJ/mol, con su línea en `datos`).
- **El avance.** Al partir, las ideas `radio-atomico-ionico`, `energia-ionizacion` y `electronegatividad`, las dos mesas
  y las palabras de esas ideas pasan a la unidad nueva (`Avance.migrar`, partición `partidoTP`). Quien había terminado
  las cinco ideas de antes conserva «Ya la estudié». La predicción vieja de la idea 1 (otra pregunta) se borra una vez.

---

## 12. Decisiones tomadas (Gerson revisa después)

1. **La unidad se parte en dos: «Tabla periódica» (4 ideas, conserva el `id`) y «Propiedades periódicas» (4 ideas,
   `quimica.propiedades-periodicas`).** Motivo: son 8 ideas y hay una costura natural (ubicar / comparar), como en MRU y
   MRUV. Descartado: una sola unidad de 7 ideas con `septimaIdea`, juntando el radio atómico y el iónico en una idea con
   tres reglas y una sola predicción.
2. **`bloques-transicion` es idea propia.** Motivo: San Marcos pregunta el grupo de un metal de transición más que el de
   un representativo (2025-I dos veces, 2026-I) y su trampa es otra. Descartado: dejarlo en la condición de la regla de
   A2, como hoy.
3. **`radio-ionico` es idea propia, y ahí llega la serie isoelectrónica** que salió de Estructura atómica. Motivo: tiene
   su propia trampa anotada (2026-II) y su propia predicción. Descartado: una línea en «Mira» del radio atómico (hoy).
4. **A1 no usa la configuración: enseña a contar desde el gas noble** (el que sigue a un gas noble es un alcalino; el
   anterior, un halógeno). Motivo: primero el hecho, después la causa; y es un camino rápido que el examen premia.
   Descartado: empezar por «periodo = mayor n», que deja la ley periódica como un dato suelto.
5. **Doble numeración de los grupos: «grupo 17 (VIIA)».** Motivo: el examen usa romanos y la IUPAC, números; el generador
   de hoy ya escribe los dos. Descartado: solo romanos (no es la tabla que el alumno tiene en el salón).
6. **Familias con nombre en A1: alcalinos, alcalinotérreos, anfígenos, halógenos y gases nobles**; térreos, carbonoides
   y nitrogenoides solo en `datos` cuando un ejercicio los pide. Motivo: son los cinco que el examen pregunta. Se dice
   «anfígenos», el nombre de las academias, con «calcógenos» en el glosario.
7. **La predicción de A1 cambia**: del «¿qué pasó con los huecos de Mendeléiev?» a predecir cómo es el rubidio por su
   columna. Motivo: la de hoy es un dato de historia; la nueva usa la ley como la usó Mendeléiev y tiene la trampa
   grupo/periodo entre sus opciones. Los huecos pasan a «Mira».
8. **Colores: Z naranja, periodo turquesa, grupo carmín, electrones violeta; en B, radio turquesa, energía carmín,
   electronegatividad violeta; sin verde.** Motivo: Z y los electrones conservan el color de Estructura atómica.
   Descartado: dejar la electronegatividad en verde (queda junto al naranja en la mesa de las tres propiedades).
9. **X, Q y R para los elementos sin nombre**, nunca Y ni W (son símbolos de elementos reales) ni E (se confunde con
   la alternativa E en un resuelto).
10. **Objetos y analogías** (sección 4): globo, letrero y foco; sal yodada; moneda de un sol; probador con foquito;
    cristal de sal; salero; la romana y la soga como analogías presentadas en «Lee». Si la romana no convence, la otra
    opción es una barra por casilla sin objeto, que es lo de hoy.
11. **La predicción de B3 pasa del par N–O al par P–S**, el ítem medido (Tan y otros, 2005), y la razón de academia
    («semilleno es estable») se nombra sin castigarla. Descartado: dejar N–O, que el juego nuevo (periodo 2) ya muestra.
12. **Práctica por idea con seis generadores nuevos** (sección 9) y `configuracion-ubicacion` solo para Estructura
    atómica. No se escribió nada todavía: es de la fase 5.
13. **Títulos con el nombre del tema** (`docs/teoria.md` 4f); los `id` no cambian. `radio-atomico-ionico` conserva su
    `id` aunque su título pase a «Radio atómico».
14. **La escena `atomo-y-tabla` va a «Más mesas del tema»** en las dos unidades, hasta que se rehaga.

### Decisiones chicas tomadas al escribir la idea 1 (fase 2, 19 nov)

15. **La respuesta correcta de Predice no repite las palabras de la leyenda.** El validador rechaza que «Lee» o la
    leyenda traigan la frase de la respuesta («metal blando que reacciona con el agua» es justo lo que significa ▲).
    Las cuatro opciones quedaron con la misma forma: «Como el potasio, que está encima: blando y muy reactivo», «Como
    el kriptón, su vecino de número: un gas poco reactivo», etc. Descartado: quitar la marca ▲ de la leyenda.
16. **El kriptón es «vecino de número» del rubidio, no «vecino de fila»** (cierra el periodo 4 y el rubidio abre el 5).
    Los textos lo dicen así; el código del error se queda en QM-FILA-COLUMNA.
17. **El juego va de 5 a 10 tarjetas por fila y arranca en 10** (el corte «de diez en diez» es el que uno probaría
    primero). Con filas de 10 el símbolo baja a 14 px para que «Mg» no toque el borde.
18. **En un ejemplo que pide un número atómico, la tarjeta va con «?» y sin número** (`incognitas` en `quim-tira`): la
    primera versión mostraba «11 ?» y regalaba la respuesta.
19. **La palabra «orden» no se marca en esta unidad** (`glosarioSin`): el glosario del curso la tiene como «orden de
    reacción», de Cinética.
20. **«Metal» y «no metal» quedan definidos desde la idea 1** (la leyenda dice «metal blando»), con 3 ejemplos y sin
    `simple`; la idea 4 estrenará «semimetal», «carácter metálico» y lo que haga falta.
21. **La unidad nueva nace con el contenido viejo**: sus ideas 1, 3 y 4 son las de antes, tal cual (con sus colores
    viejos y sus títulos de tema; la 4 se llama por ahora «Electronegatividad», porque todavía no enseña el carácter
    metálico), y la 2 (`radio-ionico`) es un esqueleto sin cifras. En Tabla periódica, la idea 3 es la idea 1 vieja con
    la predicción del hierro y la 4 es un esqueleto con la escalera.
22. **No toqué** `docs/datos/admision-unmsm.csv` (2019-II n.º 84 y 2027-I n.º 87 deberían pasar a la unidad nueva) ni
    `docs/teoria/matriz/quimica.json` (falta la entrada de la unidad nueva): son archivos que otras sesiones pueden
    estar editando; quedan para quien integra.

### Decisiones tomadas en la fase 3 (19 nov)

23. **La moneda de un sol no se nombra.** No encontré la composición en una fuente del BCRP a mano; A3 abre con un clavo
    de hierro, un cable de cobre y un anillo de plata (la prueba de la unidad revisa que «moneda» y «alpaca» no aparezcan).
24. **El juego de B1 recorre columnas y la predicción pregunta la fila** (del sodio al cloro). La misión de la propuesta
    («el átomo más grande del periodo 3») daba la respuesta de Predice; quedó «la columna donde está el átomo más grande
    de toda la tabla» (el grupo 1, por el potasio). Descartado: la misión de la propuesta.
25. **Átomo e ion vienen de tablas distintas** (radios calculados de Clementi para los átomos, de Shannon para los
    iones). B2 compara los números solo entre iones; el átomo con su ion, solo en cuál es mayor, y la leyenda lo dice
    («radios de dos tablas distintas»). El juego de B2 pone cada átomo junto a su ion (Li, Na, Mg, K, Ca, S, Cl, Br): no
    sale la serie del neón entera, que es la de Predice. Misión: el ion más grande de la lista (Br⁻). Descartado: la
    misión de la propuesta («deja al cloro más grande que el potasio neutro»), que mezclaba las dos tablas.
26. **Dos piezas nuevas dentro de `quim-tira`, no piezas aparte:** la vista `esferas` (átomos e iones a escala, con
    protones y electrones) y la vista `barras` (barras grandes, todas a la misma escala, con su valor), más un probador
    chico dentro de la tabla de A4 para que el foquito se vea en el juego. La tabla de la unidad B sigue en `quim-tabla`
    (periodos 1 a 4: los datos llegan al kriptón); su bloque d resumido basta para comparar propiedades.
27. **La EN se escribe siempre con dos decimales** («1,00», no «1»), en la teoría y en la práctica.
28. **Práctica: dos generadores nuevos, uno por unidad, con `TIPOS_POR_IDEA`**, en vez de los seis de §9:
    `tabla-ubicacion` (15 tipos, las cuatro ideas de A) y `propiedades-tabla` (16 tipos, las cuatro de B). Motivo: los seis
    temas de §9 caben como tipos de dos generadores y así cada unidad tiene una sola ficha de práctica por idea.
    `configuracion-ubicacion` sigue en la ficha de Tabla periódica como práctica extra (ubicar hasta Z = 86): sacarla
    tocaba su prueba y la de Estructura atómica, que ya tiene calidad 2. Los dos ítems de la prueba del curso (qui-18 y
    qui-19) van a la reserva: los diez pares están ocupados.
