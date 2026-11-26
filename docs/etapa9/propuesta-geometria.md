# Propuesta de ideas: «Puntos notables del triángulo»

`geometria.puntos-notables` · Etapa 9 del plan de calidad, séptima unidad de la rama «Geometría plana» (sigue a
«Segmentos y ángulos», «Triángulos y líneas notables», «Congruencia», «Polígonos y cuadriláteros», «Circunferencia» y
«Proporcionalidad y semejanza», las seis con `calidad: 2`; la siguen «Relaciones métricas» y «Polígonos regulares») ·
fases 1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 26 nov 2026

Gerson delegó el criterio: esta propuesta es el guion con el que se escribe la unidad, y la sección 9 trae **las decisiones
que tomé**, cada una con su motivo y la alternativa descartada. No hay ningún CONFLICTO CRÍTICO.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1-ideas,
2-ejemplos, 3-practica, reglas-validador, etapa-delegada), las decisiones de las etapas 2 a 8, la propuesta de
Proporcionalidad (`docs/etapa8/propuesta-geometria.md`) como modelo y lo que su auditoría corrigió (Menelao al revés,
triángulos que no existían, letras de Datos que chocaban con los puntos), la teoría actual
(`contenido/teoria/geometria/puntos-notables.js`, v0.2.0, tres ideas sin misión, leyenda, datos ni ejemplos), su ficha en
`catalogo/cursos/geometria.json`, sus tres plantillas (`triangulo-estira`, `geo-triangulos-notables`,
`geo-proporcionalidad`), la investigación de ChatGPT (`docs/investigacion/etapa9/geometria.puntos-notables.md`, que
manda, y `breve/`, para contrastar), las siete preguntas de San Marcos de `docs/datos/admision-unmsm.csv` que tocan la
unidad y, para no repetir ni adelantar, las vecinas: Triángulos (ideas 5 y 6), Congruencia (3, 4 y 5), Circunferencia (1,
2 y 4), Proporcionalidad (2) y Relaciones métricas.

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semanas 6 y 7; San Marcos, tema 7. Temario oficial de San Marcos 2025-II, apartado 8.4: los cinco centros,
excentro incluido (investigación, F06). CEPRE UNI 2023-2: centros con semejanza y Euler (F05).

**San Marcos, admisión real 2019-I a 2027-I** (del CSV; los enunciados no se copian, se rehacen):

| Qué piden | Periodo | Idea donde cae |
| --- | --- | --- |
| Ángulo entre bisectrices en el incentro, después de hallar un ángulo con el ortocentro | 2024-I Medicina (34) | 4, nivel examen (y 3) |
| Una canaleta: una ceviana es altura porque pasa por el ortocentro; Pitágoras | 2026-I (36) | 4, nivel examen |
| Ángulo entre el segmento de dos pies de altura y el circunradio (siempre 90°) | 2023-II (34) | 2, ejemplo de nivel 3 (el cuadrilátero inscriptible es de Circunferencia) |
| Distancia entre cortes de bisectrices con una altura (notables de 37°/2 y 53°/2) | 2026-II (35) | 3, ejemplo de nivel 3 |
| Incentro, excentro y el punto medio del arco: el segmento que va al excentro mide lo que va al incentro | 2022 (37) | 5, ejemplo de nivel 3 |
| Perímetro de un paralelogramo con el incentro de un isósceles y el teorema de la bisectriz | 2020-I (41) | 3, ejemplo de nivel 3 (la etapa 8 lo dejó aquí) |
| Coordenadas del baricentro de un banderín | 2023-I (37) | **Geometría analítica** (decisión 6) |

La investigación contó los 20 ejercicios del boletín CEPRE-UNMSM 2024-I, semana 7: circuncentro 6, incentro 5, excentro 4,
ortocentro 3, baricentro 2 (un ejercicio nombra varios). Eso no es frecuencia de admisión, y no se presenta como tal; pero
dice que el excentro pesa casi lo mismo que el incentro y justifica su idea propia.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Tres ideas** (`baricentro`, `centros`, `euler`) con «Lee», «Así se resuelve» y «Ahora tú», sin `aprendizaje`,
   `actividad`, `pregunta`, misión, leyenda, `datos` ni ejemplos (0 de 45). Tres mesas (`cuatro-centros`, `euler-libre`,
   `seis-areas`).
2. **Punto 1:** ninguna idea abre con un objeto: todas con `geo-figura` pelada.
3. **La idea `centros` junta cinco centros en un juego:** el alumno elige un centro de una lista y mira si queda dentro; la
   regla los lista en 30 palabras. Es la falla que el plan de calidad llama «caer en nada»: nombres sin de dónde agarrarse.
4. **Lo que repite a las vecinas:** ∠BIC = 90° + A/2 y el excentro con 90° − A/2 ya los enseña Triángulos (idea 6, «Ángulos
   entre bisectrices»); que la mediatriz y la bisectriz equidistan, Congruencia (idea 3); la mediana de la hipotenusa,
   Congruencia (idea 5); las tangentes iguales y Poncelet, Circunferencia (idea 2); central = 2 · inscrito, Circunferencia
   (idea 4); el teorema de la bisectriz, Proporcionalidad (idea 2). Aquí se **usan** (van como dato), no se vuelven a
   enseñar.
5. **Glosario:** las definiciones de hoy dicen la respuesta de las predicciones nuevas («queda fuera si es obtusángulo»,
   «parte cada una en razón 2 : 1», «recta que pasa por O, G y H»). Se reescriben sin la medida.

**Se queda:** los `id` `baricentro` y `euler`, las tres mesas (ajustadas a los colores del curso), la historia (nueve
puntos), el término «incentro» que llegó de Proporcionalidad. **Sale o cambia:** la idea `centros` se reparte en cuatro
ideas, una por centro (circuncentro, incentro, ortocentro, excentro); las predicciones de `baricentro` y `euler` cambian.

---

## 1. Las ideas, en orden

Propongo **seis**, el tope. No hace falta partir la unidad.

| # | `id` | Título | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `baricentro` | El baricentro y las medianas | Las tres medianas se cortan en el baricentro G, el punto de equilibrio de una lámina pareja; G parte cada mediana en 2 : 1 desde el vértice. |
| 2 | `circuncentro` | El circuncentro y la circunscrita | Las mediatrices se cortan en el circuncentro O, a la misma distancia R de los tres vértices; queda dentro, en la hipotenusa o fuera según el triángulo. |
| 3 | `incentro` | El incentro y la inscrita | Las bisectrices se cortan en el incentro I, a la misma distancia r de los tres lados; desde cada vértice las dos tangentes miden s − a, y S = r · s. |
| 4 | `ortocentro` | El ortocentro y las alturas | Las alturas, o sus prolongaciones, se cortan en el ortocentro H: dentro, en el vértice recto o fuera; en un acutángulo, m∠BHC = 180° − m∠A. |
| 5 | `excentro` | El excentro y la exinscrita | Una bisectriz interior y dos exteriores se cortan en un excentro, centro de una exinscrita; hay tres, siempre fuera, y la tangente desde A mide s. |
| 6 | `euler` | La recta de Euler | En un triángulo no equilátero, O, G y H están en una recta, con G entre ellos y GH = 2 · OG; la circunferencia de nueve puntos tiene radio R/2. |

Preguntas del Resumen (`pregunta`): 1 «¿Dónde se sostiene una cartulina triangular sin caerse?»; 2 «¿Dónde va un tanque a
igual distancia de tres casas?»; 3 «¿Dónde cabe la pileta más grande de un parque triangular?»; 4 «¿Dónde se cruzan los
caminos más cortos a cada carretera?»; 5 «¿Qué circunferencias tocan las tres avenidas por fuera?»; 6 «¿Qué centros de
un triángulo quedan en una recta?». Ninguna descarta una alternativa de su predicción.

**Por qué va cada una en su lugar y qué da por sabido**

1. **Baricentro.** La raíz: estrena «punto notable» y el cruce de tres líneas. Se prueba con la base media (Congruencia 4) y
   la semejanza con k = 1/2 (Proporcionalidad 3): MN ∥ AB y MN = AB/2, así GM = AG/2. Las seis áreas iguales salen de
   «bases iguales, misma altura». Nivel examen: la mediana de la hipotenusa (Congruencia 5) con el 2 : 1.
2. **Circuncentro.** Usa que todo punto de la mediatriz equidista de los extremos (Congruencia 3). Se pregunta dónde queda en
   un obtusángulo. La regla trae m∠BOC = 2 · m∠A, que es central e inscrito (Circunferencia 4) aplicado al circuncentro.
3. **Incentro.** Usa la bisectriz que equidista de los lados (Congruencia 3) y las tangentes iguales (Circunferencia 2). Estrena
   el semiperímetro s, la tangente s − a y el área S = r · s. El ángulo BIC no se vuelve a enseñar (Triángulos 6): va como
   dato en los ejercicios que lo necesitan.
4. **Ortocentro.** Las alturas de Triángulos (5), ahora las tres juntas. El caso obtusángulo (las alturas exteriores, error
   documentado D-EXT de Gutiérrez y Jaime) es la predicción. m∠BHC = 180° − m∠A sale del cuadrilátero con dos rectos.
5. **Excentro.** Después del incentro, porque se arma igual con dos bisectrices exteriores. Estrena la exinscrita, que haya
   tres y la tangente desde A igual a s. El ángulo BEC viene de Triángulos 6 (dato).
6. **Recta de Euler.** Al final, porque junta O, G y H (ideas 1, 2 y 4) y contrasta con I. La circunferencia de nueve puntos va
   en la regla y en «Ahora tú» (la pide la ficha: «Recta y circunferencia de Euler»).

---

## 2. Objeto de la primera pantalla

Todos son dibujos de prueba (`data-prueba`) en una escena nueva de `geo-objeto`, `notable` (bloque propio, aditivo), sobre
una figura de `geo-figura` a escala.

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Una cartulina triangular sobre la punta de un lápiz**, vista desde arriba (12 cm × 9 cm), con su sombra corrida hacia donde se cae | la cartulina = el triángulo; la punta = P, el punto que mueves |
| 2 | **Tres casas de una comunidad y un tanque de agua**, vistas desde arriba (B y C a 80 m) | las casas = los vértices; el tanque = P |
| 3 | **Un parque triangular con su pileta redonda** (lados de 12 m, 16 m y 20 m) | las veredas = los lados; la pileta = la circunferencia; su centro = P |
| 4 | **Tres pueblos unidos por tres carreteras rectas, y la trocha más corta de cada pueblo a la carretera de enfrente** | las carreteras = los lados (prolongados); las trochas = las alturas |
| 5 | **El mismo parque, ahora con sus tres avenidas largas, y una glorieta redonda afuera** | las avenidas = las rectas de los lados; la glorieta = la exinscrita |
| 6 | **La cartulina de la idea 1 con los centros marcados** (lápiz, tanque, pileta, trochas) | O, G, H e I, cada uno con su letra |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Controles (y arrastre) | Misión | Cuándo se cumple |
| --- | --- | --- | --- |
| 1 | la punta P, a lo ancho y a lo alto (de 1 en 1 cm) | Mueve la punta del lápiz hasta que la cartulina no se caiga. | P = (5, 3), el baricentro de A(3, 9), B(0, 0), C(12, 0) |
| 2 | el tanque P (de 10 en 10 m) | Lleva el tanque hasta que quede igual de lejos de las tres casas. | P = (40, 20), el circuncentro de A(20, 60), B(0, 0), C(80, 0) |
| 3 | el centro P de la pileta (de 1 en 1 m) y su radio (de 0,5 en 0,5 m) | Ubica y agranda la pileta hasta que toque las tres veredas. | P = (4, 4) y radio 4 m (incentro del parque 12-16-20) |
| 4 | el pueblo A, a lo ancho y a lo alto (siempre acutángulo o rectángulo) | Mueve el pueblo A hasta que el cruce H caiga en un pueblo. | A sobre B o sobre C (ángulo recto en B o en C) |
| 5 | el centro P de la glorieta y su radio | Pon la glorieta fuera, tocando la avenida BC y las otras dos. | P = (8, −8) y radio 8 m (excentro relativo a BC) |
| 6 | el vértice A, a lo ancho y a lo alto | Mueve A hasta que los cuatro centros queden en una sola recta. | AB = AC (A sobre la mediatriz de BC) |

Lecturas (12 palabras como máximo, cada una dice una relación): 1 «Se inclina hacia BC: de ese lado queda más cartulina» /
«No se cae: el peso queda parejo alrededor de P»; 2 «PA = 44,7 m, igual que PB y PC» o «más cerca de A que de B y C»;
3 «Toca AB y BC; a CA le faltan 0,8 m»; 4 «Tres ángulos agudos: H queda dentro» / «Ángulo recto en B: H cae en B»;
5 como la 3, con las rectas; 6 «AB = AC: los cuatro quedan en el eje» o «AB ≠ AC: escaleno».

---

## 4. La predicción de cada idea

La app baraja las opciones; los `datos` traen valores, nunca la fórmula. Ningún «Lee», glosario, leyenda ni misión la
responde. Errores: D-EXT y D-COIN están documentados en la investigación (Gutiérrez y Jaime 1996; Smith 2017); los demás son
hipótesis (GE-PN, anotados en el informe de geometría).

**Idea 1.** «En otra cartulina se traza la mediana AM, de 12 cm. El punto de equilibrio está sobre ella. ¿A qué distancia de A
queda?» Datos: AM = 12 cm; M es el punto medio de BC.

| Opción | Qué mide |
| --- | --- |
| 8 cm | Correcta: AG = 2/3 de AM |
| 6 cm | Lo pone en la mitad de la mediana (GE-PN2, H-RAZ) |
| 4 cm | Invierte la razón: el tramo largo junto al lado (GE-PN3) |
| 9 cm | Usa 3 : 1, por las tres medianas (GE-PN4) |

**Idea 2.** «Ahora las tres casas forman un triángulo con un ángulo obtuso en A. ¿Dónde queda el punto que está a la misma
distancia de las tres?» Datos: B y C a 80 m; A a 20 m de la recta BC, a 20 m de la vertical de B.

| Opción | Qué mide |
| --- | --- |
| Fuera del triángulo, al otro lado de BC | Correcta |
| Dentro del triángulo, como antes | Todo «centro» está adentro (H-CEN) |
| En el punto medio de BC, el lado más largo | Toma el caso del rectángulo (GE-PN5) |
| No hay ningún punto así | Rechaza un centro que sale (H-EXIST) |

**Idea 3.** «En otro parque, AB = 7 m, AC = 8 m y BC = 9 m. La pileta más grande toca AB en F y AC en K. ¿Cuánto mide AF?»
Datos: AB = 7 m, AC = 8 m, BC = 9 m.

| Opción | Qué mide |
| --- | --- |
| 3 m | Correcta: 12 − 9, el semiperímetro menos el lado de enfrente |
| 3,5 m | La mitad de AB: cree que la pileta toca en el punto medio (GE-PN6) |
| 4,5 m | La mitad de BC, el lado de enfrente (GE-PN6) |
| 4 m | La mitad de AC (GE-PN6) |

**Idea 4.** «Ahora el pueblo A queda más allá de B: el ángulo en B es obtuso. Las trochas de A y de C caen en la prolongación
de las carreteras. Prolongadas las tres, ¿dónde se cruzan?»

| Opción | Qué mide |
| --- | --- |
| Fuera del triángulo, más allá de B | Correcta |
| Dentro, como antes | H-CEN |
| En el pueblo B, el del ángulo obtuso | Lleva el caso recto al obtuso (H-RECT) |
| No se cruzan: dos trochas caen fuera | No prolonga las alturas (D-EXT, documentado) |

**Idea 5.** «La pileta toca las tres veredas por dentro y la glorieta toca las tres avenidas por fuera. Contando las dos,
¿cuántas circunferencias tocan las tres avenidas a la vez?»

| Opción | Qué mide |
| --- | --- |
| 4 | Correcta: la inscrita y una exinscrita frente a cada lado |
| 2 | Solo las dos que vio (GE-PN7) |
| 6 | Dos por cada lado (GE-PN7) |
| Infinitas | La glorieta se puede correr sin dejar de tocar (GE-PN7, H-EXC) |

**Idea 6.** «En un triángulo escaleno, ¿cuáles tres centros quedan siempre en una misma recta?»

| Opción | Qué mide |
| --- | --- |
| O, G y H | Correcta |
| O, G e I | Cambia H por I (H-EUL) |
| G, H e I | Cambia O por I (H-EUL) |
| Los cuatro, O, G, H e I | Generaliza el isósceles del juego (D-COIN, documentado) |

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| A, B, C | Los vértices | Chocan con las alternativas A–E: ningún resuelto nombra una alternativa por su letra |
| a, b, c | Los lados BC, CA y AB | Solo en las ideas 3 y 5 |
| M, N | M, punto medio de BC; N, de AC | — |
| G, O, I, H, E | Baricentro, circuncentro, incentro, ortocentro, excentro (relativo a BC) | E solo es excentro; Triángulos usó E para un cruce que también es un excentro |
| P | El punto que mueves en el juego (punta del lápiz, tanque, centro de la pileta o la glorieta) | — |
| D, F, K | Donde la inscrita toca BC, AB y AC | — |
| T | Donde la exinscrita toca la prolongación de AB | — |
| R, r | El circunradio y el inradio | — |
| s, S | El semiperímetro y el área del triángulo | — |
| k | La medida de una parte (AG = 2k, GM = k) | — |
| x | Lo que se pide, un número | — |

Va en el campo `letras` de la unidad. ∥, ⟂, △, m∠ ya los definió la rama.

---

## 6. Mapa de colores (§5b y las reglas del curso)

Reglas del curso: ángulos dados en carmín; lo pedido con «?» en tinta; el violeta solo en el resuelto y en la respuesta; sin
verde. En esta unidad, **un color por magnitud**:

| Magnitud | Color | Por qué |
| --- | --- | --- |
| El tramo largo de una razón 2 : 1 (AG, GH) y las tangentes desde un vértice (AF, AT) | naranja | el primer dato |
| El tramo corto (GM, OG) y los radios (R, r, el de la exinscrita) | turquesa | el segundo dato |
| Los ángulos dados | carmín | ángulos |
| Lo que se pide y su resultado | violeta (solo en el texto) | lo que se busca |
| La mediana entera, los lados, las circunferencias, los centros y P | tinta (P con su manija naranja) | estructura |

La prueba de la unidad comprueba la regla en todas las figuras (sin violeta ni verde; «?» en tinta).

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

- **Plantilla nueva `geo-puntos-notables`** (formato `predicciones`, sin figura, como `geo-semejanza`): cuatro tipos por idea
  (`TIPOS_POR_IDEA`), `datos` por línea con prueba en 400 semillas, `casos.json` (18 casos) verificado aparte y papel de 8
  problemas (las seis ideas).
- **`geo-triangulos-notables`** (generador compartido con Relaciones métricas, sin `datos`): va a «Más mesas del tema» de esta
  unidad (`"rehacer": ["geometria.puntos-notables"]`) y su papel dice de qué unidad es cada problema (lección 18).
- **`triangulo-estira`** y **`geo-proporcionalidad`** ya llevan `"rehacer"` para esta unidad; se comprueba que sus papeles
  digan `unidades`.
- **Mesas:** las tres de antes conservan su `id`, con los colores del curso: `seis-areas` (idea 1), `cuatro-centros` (ideas 2
  y 4) y `euler-libre` (idea 6).
- **Prueba del curso:** las formas ya tienen 10 pares; dos ítems nuevos a la reserva, pn-01 (el 2 : 1 del baricentro) y pn-02
  (la tangente s − a).

### 7b. Datos del mundo

Ninguno puntual: la cartulina (12 cm × 9 cm cabe en una de 50 × 65 cm, la presentación escolar que cita la investigación),
casas a decenas de metros, un parque de 12 m × 16 m. Todo con «unos» si hace falta; nada atribuido a un lugar real.

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Da por sabido:** Triángulos (alturas, medianas, bisectrices, mediatriz, ∠BIC y los cruces de bisectrices exteriores),
Congruencia (equidistancia de mediatriz y bisectriz, base media, mediana de la hipotenusa, notables), Circunferencia
(tangentes iguales, Poncelet, central e inscrito), Proporcionalidad (semejanza, teorema de la bisectriz).
**Cambio en la ficha:** `requiere` pasa a `geometria.circunferencia` y `geometria.proporcionalidad-y-semejanza` (las dos ya
piden Congruencia). **Nada de después:** ni Stewart, ni Herón, ni relaciones métricas: las áreas van como dato (base por altura
entre dos) y los lados de los ejercicios de r = S/s son de triángulos rectángulos o con el área dada.

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, una por centro y Euler al final.** Motivo: la idea `centros` de hoy junta cinco centros en un juego y deja al
   alumno «cayendo en nada»; el excentro pesa casi lo mismo que el incentro en el boletín CEPRE (4 contra 5). *Descartado:* la
   versión breve de la investigación (cuatro ideas, sin excentro ni Euler como idea), porque la ficha pide los dos.
2. **Los ángulos entre bisectrices no se vuelven a enseñar** (son de Triángulos 6): van como dato en los ejercicios del
   incentro y del excentro. Las predicciones son otras: la tangente s − a (idea 3) y las cuatro circunferencias (idea 5).
   *Descartado:* la predicción de la investigación «el ángulo BIC siempre es obtuso», que ya se respondió en Triángulos.
3. **Avance:** `baricentro` y `euler` conservan su `id` con otra Predice; `centros` se va y entran cuatro ideas: la unidad va a
   `REHECHAS_E6` en `nucleo/avance.js` (marcas `prediccionPN` y `estudiadaPN`), y quien terminó las tres de antes conserva
   «Ya la estudié».
4. **La idea 1 juega a equilibrar, sin medianas**, como propone la investigación: así la razón 2 : 1 queda para la predicción.
   La lectura dice hacia dónde se cae, no dónde está el punto. *Descartado:* el juego de hoy (mover A y leer AG y GM), que
   muestra la razón antes de predecirla.
5. **Circunferencia de nueve puntos dentro de la idea 6**, con su radio R/2 en la regla y en «Ahora tú». Motivo: la ficha la
   nombra y la CEPRE UNI también. *Descartado:* una séptima idea.
6. **Coordenadas del baricentro, fuera:** la pregunta 2023-I (37) está clasificada en Geometría analítica. *Descartado:* una
   variante con coordenadas aquí (pediría el plano cartesiano, que llega después).
7. **Letras:** E es solo el excentro relativo a BC; los puntos de contacto de la inscrita son D, F y K (no D, E, F, que
   chocaría con E); P es siempre el punto que mueve el juego. *Descartado:* I_A, I_B, I_C (subíndices pesados en el celular;
   los exámenes peruanos usan E).
8. **El incentro con el teorema de la bisectriz** (AI/ID = (b + c)/a, que la etapa 8 mandó aquí) va como ejemplo de nivel 3,
   con el teorema de la bisectriz en sus Datos; no entra en la regla (la regla de la idea 3 ya trae tangentes y área).
9. **Escena nueva `notable` en `geo-objeto`** (bloque propio, aditivo, con su prueba) para la cartulina, las casas, el parque,
   los pueblos y las avenidas. *Descartado:* una pieza nueva aparte, que repetiría el armado de rótulos de `geo-objeto`.
10. **Práctica nueva `geo-puntos-notables`**; `geo-triangulos-notables` a «Más mesas del tema» solo aquí.
11. **Prueba del curso:** pn-01 y pn-02 a la reserva.
12. **Códigos:** GE8 se queda; GE-PN1 a GE-PN4 de hoy se renumeran por idea (GE-PN para baricentro, GE-CC circuncentro, GE-IN
    incentro, GE-OR ortocentro, GE-EX excentro, GE-EU Euler), todos hipótesis salvo D-EXT y D-COIN (documentados en la
    investigación, sin medir en postulantes peruanos).

### Decisiones chicas al escribir (fases 2 a 5)

- **Notas de la sesión a la idea 1 (aplicadas):** el rótulo de la predicción va al costado de AM («12 cm», sin pisar líneas);
  las cuatro opciones tienen la misma forma («A 6 cm de A», sin comentario); las seis áreas iguales se quedan en la regla
  porque su dibujo sombrea los seis triángulos y la idea las usa (ejemplos 4, 8 y 12, «Ahora tú» y «Así se resuelve»).
- **Mira de la idea 1 sin rótulos de medida:** con las tres medianas y la base media no cabían «8 cm» y «4 cm»; los tramos
  van en sus colores y las medidas, en la ecuación del paso.
- **Marcas del avance `prediccionPNT` y `estudiadaPNT`:** `prediccionPN` ya era de Ángulos en posición normal.
- **Toda figura de ejemplo con «?» lleva «El dibujo no está a escala.»** (se agrega sola al armar la unidad), y la
  predicción del incentro se dibuja con otras proporciones (AF/AB dibujado ≠ 3/7; su prueba lo comprueba).
- **Figuras sin lo que estorba:** tres ejemplos quedaron sin figura (uno del baricentro, uno del circuncentro y uno de Euler) porque sus
  rótulos no cabían sin pisar un lado; los ejercicios del ángulo BEC se dibujan sin la exinscrita ni la bisectriz de A
  (pasaba justo por el rótulo del ángulo A).
- **Rótulos de lado que se acomodan solos** (`acomodarRotulos` en la unidad): si uno pisa algo, se prueban el otro costado,
  otra altura del lado y otra distancia, hasta que todos caben (escenaCabe).
- **geo-objeto:** escena nueva `notable` en un bloque propio y una línea `ESCENAS.notable = notable` después de la tabla de
  escenas; el bloque de Proporcionalidad no se tocó.
- **Papeles viejos:** `triangulo-estira` y `geo-triangulos-notables` dicen de qué unidad es cada problema (lección 18);
  `geo-triangulos-notables` pasa a «Más mesas del tema» de esta unidad (`"rehacer"`).
- **Lo que encontró la prueba propia al escribir:** «Así se resuelve» del excentro sacaba m∠BIC menor que 90° (imposible);
  ahora va de 92° a 160°.
