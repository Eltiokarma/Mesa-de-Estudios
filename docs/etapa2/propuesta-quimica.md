# Propuesta de ideas: `quimica.materia-y-energia` (etapa 2)

17 nov 2026 · Propuesta para que Gerson la apruebe antes de escribir (`docs/metodo/unidad/1-ideas.md` §A). No se tocó
ningún archivo del repo. Todo lo que dice «ya existe» o «hay» se comprobó leyendo el código; lo que dice «por
confirmar» no lo pude comprobar y no debe ir al alumno sin fuente.

---

## 0. Diagnóstico de la teoría actual (contra el contrato de 13 puntos)

`contenido/teoria/quimica/materia-y-energia.js` (v0.1.0, sin `calidad: 2`) tiene 4 ideas: `sustancia-mezcla`,
`fisico-quimico-nuclear`, `calor-sensible-latente` y `masa-energia`.

1. **Puntos 1 y 2:** ninguna idea abre con un objeto reconocible. Las dos primeras son cajas de partículas
   (`quim-particulas`), las dos últimas son ejes (`ejes`). Ningún «Juega» tiene `mision`: dos son selectores («elige una
   muestra») y dos se mueven solos («el calor entra solo», «Δm sube y baja sola»).
2. **Puntos 3 y 7:** no hay `leyenda`, `aprendizaje` ni `actividad`. La lectura de las ideas 1 y 2 empieza con
   «t = 3,2 s ·», el reloj de la animación, que no significa nada para el alumno.
3. **Regla 3 / predicción:** en la idea 3 el juego muestra la meseta de fusión y la predicción pregunta justo por esa
   meseta, así que ya la vio. En la idea 4 la predicción pide calcular E sin que se haya dado E = mc²: eso es memoria,
   no predicción. Además, una opción de la idea 3 trae la fórmula («24 °C, con Q = mcΔT»).
4. **Punto 13:** ningún ejercicio tiene `datos`; los valores van dentro del enunciado («(c = 4,18 J/g·°C)»,
   «(L = 334 J/g)»). «Así se resuelve» es el mismo generador que «Ahora tú» con otra semilla.
5. **Punto 9:** la idea 1 usa iones (Na⁺ + Cl⁻) y la idea 2 usa ecuaciones balanceadas (4 H₂ + 2 O₂ → 4 H₂O) antes de
   estructura atómica y de balance.
6. **§5b y §11 (colores):** los átomos se pintan con los tokens de variable (O carmín, H turquesa, Na naranja, Cl verde)
   en vez de con la paleta de `nucleo/elementos.js`. Las variables tampoco siguen §5b: m turquesa, Q naranja, T carmín
   (el color de los ángulos) y E verde (el «tercer dato»), cuando es lo que se pide. La escena `materia-energia` usa una
   tercera paleta propia (m mostaza, E magenta, T ámbar).
7. **Faltan temas que se preguntan:** propiedades intensivas y extensivas (Gerson lo pidió el 13 nov,
   `docs/pogil-v2-rive.md` §7.2), densidad, separación de mezclas y escalas de temperatura (San Marcos 2023-II). Las
   ramas de la química solo están en la práctica.
8. **Glosario:** 19 términos sin `simple` y con 0 o 1 ejemplo cada uno; el contrato pide 3 o más. La cabecera todavía
   dice «postulante de 3.º–5.º».

Lo que sirve y se conserva: el motor de partículas que se mueven (gas, líquido y sólido determinísticos), la curva de
calentamiento con su manija, las dos mesas del laboratorio con retos comprobados y el motor de la escena
`materia-energia` (clasificar, contar fases, fenómeno, balanza, separar, E = mc², propiedades, hervir). Ese motor
alcanza para casi todas las misiones de abajo.

---

## 1. Las ideas, en orden

Se conservan los 4 `id` publicados (el avance se guarda con ellos) y se agrega uno nuevo, `propiedades`, en el
segundo lugar. Cambiar el orden no cambia ningún `id`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `sustancia-mezcla` (se queda) | ¿Sustancia pura o mezcla? | Para saber si algo es puro se cuentan las clases de partícula, no se mira el aspecto: una sola clase es una sustancia y varias son una mezcla. La mezcla es homogénea si forma una sola fase. |
| 2 | `propiedades` (**nueva**) | Lo que no cambia al partir | Al partir una muestra, la masa y el volumen se parten, pero la densidad y la temperatura de ebullición no cambian. Esas propiedades dicen qué sustancia es, y con ellas se separa una mezcla. |
| 3 | `fisico-quimico-nuclear` (se queda) | ¿Siguen siendo las mismas partículas? | El tipo de cambio se decide por las partículas de después. Si son las mismas, aunque cambie el estado, es físico. Si aparecen sustancias nuevas con los mismos átomos, es químico. Si cambia el elemento, es nuclear. |
| 4 | `calor-sensible-latente` (se queda) | Calor que no sube la temperatura | Mientras el agua hierve (o el hielo se funde), entra calor y la temperatura no sube: ese calor cambia el estado (Q = m·L). Sin cambio de estado, el calor sube la temperatura (Q = m·c·ΔT). |
| 5 | `masa-energia` (se queda) | Poca masa, muchísima energía | Cuando un proceso nuclear libera energía, lo que queda pesa un poco menos. Esa diferencia por c² es enorme (E = Δm·c²): un gramo equivale a unos 200 000 balones de gas. |

**Por qué cada una va en su lugar y qué da por sabido**

1. **Sustancia o mezcla.** Es la raíz de todo el curso: «especie» y «fase» se usan en las otras cuatro ideas. Da por
   sabido que la materia está hecha de partículas diminutas, lo que se ve en CTA de secundaria. «Lee» lo presenta con su
   dibujo (las bolitas son un modelo), junto con «qué estudia la química». No usa iones: la sal disuelta se dibuja como
   «partículas de sal» sin cargas (punto 9).
2. **Propiedades.** Va después de la 1 porque separar necesita «mezcla», y antes de la 3 porque la 3 usa «propiedad
   física» y aquí se mide. Es lo que pidió Gerson el 13 nov: las propiedades no se listan, salen de medir (§7.2). Da por
   sabido leer una balanza (g) y una probeta (cm³ = mL), y dividir. La conversión g/cm³ ↔ kg/m³ es de física; ver la
   pregunta 8.
3. **Cambios.** Necesita «especie» (idea 1) y «propiedad física» (idea 2). Aquí se estrena «propiedad química», que
   solo se ve al transformar la sustancia. Lo nuclear entra como tercer caso con un solo ejemplo (C-14 → N-14), sin
   partículas subatómicas. No escribe ecuaciones balanceadas: cuenta átomos antes y después en la lupa (balance es
   `quimica.reacciones-y-balance`).
4. **Calor.** Usa «estado» (idea 3) y «temperatura de ebullición» (idea 2). Da por sabido el termómetro en °C y la
   energía como «lo que entrega la cocina». Si Gerson lo aprueba (pregunta 1), aquí entran también las variaciones de
   temperatura en K y °F, porque San Marcos 2023-II las preguntó sobre una curva temperatura-tiempo.
5. **Masa y energía.** Va al final porque compara un cambio químico (idea 3, el gas que arde) con uno nuclear. Da por
   sabido pasar mg y g a kg y la notación científica; ver la pregunta 8.

---

## 2. El objeto de la primera pantalla

El kit no tiene objetos de química: `fis-objeto` trae botella, bloque (adobe, hielo), tanque y lago, pero no vaso,
olla, balón de gas ni balanza de cocina. Hay que dibujarlos como objetos de prueba (`data-prueba`, M4).

| Idea | Objeto (al lado, la lupa o la gráfica) |
| --- | --- |
| 1 | **Tres vasos iguales en una mesa:** agua hervida, agua con sal bien disuelta y agua con aceite. Los dos primeros se ven idénticos. Al lado, la lupa. |
| 2 | **Un anillo y un lingote dorados sobre una balanza de cocina, con una probeta con agua.** Uno es de oro y el otro, de un metal dorado más barato. El contexto de oro de Puno (La Rinconada) es opcional y lo decide Gerson. |
| 3 | **Una cocina de Juliaca:** la olla que hierve, la chicha de jora que fermenta, la ropa que se seca en el cordel, un clavo oxidado en el patio y la bosta que arde en el fogón. Cada uno se toca y abre su lupa de antes y después. |
| 4 | **Una olla con 1 L de agua en una cocina a gas de Juliaca, con un termómetro de cocina.** Al lado, la curva temperatura-calor que se dibuja mientras entra el calor. |
| 5 | **Un balón de gas de 10 kg junto a una balanza con un granito (unos mg).** Cuando el granito «desaparece», aparece una fila de balones de gas con la misma energía. |

El chuño (se congela de noche y se seca al sol) es muy reconocible, pero no lo propongo para la idea 3: su
elaboración no es solo física (al pisarlo y remojarlo pierde sustancias) y no tengo una fuente que lo aclare. Podría
servir en la idea 2 o 4 como «el agua se va y la papa queda», si Gerson consigue fuente.

---

## 3. La misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Cómo la comprueba el motor |
| --- | --- | --- |
| 1 | «En la bandeja hay agua, sal, azúcar, aceite y arena. **Arma un vaso que se vea igual que el agua pura pero que sea una mezcla.**» El juego no trae hielo, para no regalar la predicción. | `MotorMateria.clasificarCaja(vaso)` da mezcla homogénea, con una sola fase líquida. |
| 2 | «Se ven iguales, pero solo uno es de oro (el oro tiene unos 19,3 g/cm³). **Pésalos, mídelos en la probeta y encuentra el de oro.**» El de oro es el más chico, para que la masa sola engañe. Hay un botón «partir» que corta la muestra en mitades. | El alumno marca un objeto y su densidad es 19,3 g/cm³. La lectura en vivo enuncia la relación: «m = 96,5 g y V = 5 cm³: 96,5 g en 5 cm³ son 19,3 g por cada cm³, lo mismo que el lingote entero». |
| 3 | «En la cocina pasan cinco cosas. **Encuentra una en la que la lupa muestre, después, partículas que antes no había.**» | `MotorMateria.cambio(antes, despues).tipo === 'quimico'` en el proceso elegido. Un segundo reto, opcional: «encuentra el que cambia el elemento» (nuclear). |
| 4 | «La cocina le da calor a 1 L de agua que empieza a 10 °C. **Deja hervida la mitad del agua. ¿Cuánto subió el termómetro mientras hervía?**» | La fracción vaporizada queda entre 0,45 y 0,55 (la misma lógica que el reto «media meseta» de la mesa `hielo-a-vapor`). |
| 5 | «Un balón de gas de 10 kg da unos 4,6 × 10⁸ J al quemarse. **Encuentra la masa que, si desaparece, da tanta energía como 1000 balones.**» | `balones(mg) ≥ 1000` y `balones(mg − paso) < 1000`. Con 4,6 × 10⁸ J por balón, se logra en unos 5,1 mg. El control va en mg con paso de 0,1. |

Las cuentas de la misión 5 (comprobadas a mano): 1000 × 4,6 × 10⁸ J = 4,6 × 10¹¹ J; 4,6 × 10¹¹ / 9 × 10¹⁶ =
5,1 × 10⁻⁶ kg = 5,1 mg. Las de la misión 4, en el modelo de la idea: subir 1000 g de 10 °C a 87 °C pide 1000 · 4,18 · 77 ≈
322 kJ (77 000 cal); hervir 500 g pide 500 · 2260 ≈ 1130 kJ (270 000 cal), unas 3,5 veces más sin que el termómetro se
mueva.

---

## 4. La predicción de cada idea

Ninguna pregunta por lo que ya mostró el juego. `datos` lleva solo valores y equivalencias, nunca la fórmula. La app
baraja las opciones.

**Idea 1.** «Un vaso con agua y varios cubitos de hielo flotando. Con la lupa, ¿qué es?»
- **Una sola sustancia en dos fases** (correcta).
- Mezcla heterogénea: se ven dos partes. → **MA10** (clasificar por la vista; Sanger 2000, sin porcentaje).
- Dos sustancias, el hielo y el agua. → **MA9** (Stains y Talanquer 2007, sin porcentaje).
- Mezcla homogénea, porque todo es agua. → **QM-HOMO** (hipótesis; el código ya existe en la teoría).

**Idea 2.** «En la misma cocina de Juliaca hierven dos ollas destapadas: una con 1 L de agua y otra con 3 L. ¿Qué
marcan sus termómetros?»
- **Lo mismo** (correcta).
- Más la de 3 L. → **Q4** (34 %).
- Más la de 1 L. → **Q4** (26 %).
- Depende de cuánto tiempo lleva hirviendo. → hipótesis nueva.

Cifras de Q4: solo el 26 % de 241 futuros profesores de Panamá dijo «igual» (Rodríguez y Díaz-Higson 2012,
`docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md`). Es el error mejor medido de la unidad para una
propiedad intensiva.

**Idea 3.** «Sacas del refrigerador una botella de agua cerrada y seca. En unos minutos se llena de gotitas por fuera.
¿De dónde salen?»
- **Del vapor de agua del aire, que se enfría y se vuelve líquido** (correcta).
- Del oxígeno y el hidrógeno del aire, que se juntaron. → **MA1 / AT3**: 32,8 % antes y 34,9 % después del curso, en 358
  universitarios (Salame y Casino 2021, ítem 3). Es la única cifra de la unidad que viene del mismo ítem.
- Del agua de adentro, que atraviesa el vidrio. → hipótesis nueva (QM-ATRAVIESA).
- El frío se convierte en agua. → hipótesis nueva.

Cambia la predicción actual (las burbujas, EN13) por esta, que tiene el dato del ítem exacto. Las burbujas pueden pasar
a «Ahora tú».

**Idea 4.** «En un vaso hay agua con cubitos de hielo que se están derritiendo. ¿Qué marca el termómetro mientras
queda hielo?»
- **0 °C todo el tiempo** (correcta).
- Va subiendo poco a poco mientras se derrite. → **MA6 / Q7**: entre 30 % y 48 % según el grupo (Georgiou y Sharma 2010).
- Menos de 0 °C, porque el hielo está bajo cero. → hipótesis.
- La temperatura de la cocina. → hipótesis.

Respaldo vecino: Q8, «el agua no puede estar a 0 °C», 25 % a 32 %. Como el juego mostró la meseta de hervir, esta es
una transferencia a la otra meseta. Se reusa el vaso de la predicción 1.

**Idea 5.** «En el Sol, cuatro núcleos de hidrógeno se juntan y forman uno de helio, y sale mucha luz y calor. ¿Cuánto
pesa el helio que se formó, comparado con los cuatro hidrógenos?»
- **Un poquito menos** (correcta: cerca de 0,7 % menos).
- Exactamente lo mismo: la masa siempre se conserva. → **QM-MASA-IGUAL**, hipótesis nueva. Sale de la idea documentada
  sin cifra de Taber y de Riggs (2023), en la tabla «Lo que no tiene respaldo» del informe de materia.
- Nada: toda la masa se volvió luz. → **QM-TODA-MASA**, hipótesis nueva de la misma fila (aplicar E = mc² a la masa
  total).
- Más, porque el helio es un núcleo más grande. → hipótesis nueva.

El 0,7 % sale de masas de libro, H ≈ 1,0078 u y He-4 ≈ 4,0026 u: (4,0312 − 4,0026) / 4,0312 ≈ 0,71 %. Va en «Mira», no en
la pregunta.

Nota: el informe no tiene ningún dato peruano en estas unidades. Todo lo que dice «hipótesis» se confirma con los
datos del colegio piloto.

---

## 5. Tabla de letras y símbolos

| Símbolo | Significado en la unidad | Unidad | ¿Choca con algo? |
| --- | --- | --- | --- |
| m | masa | g, kg, mg | Es la misma letra que el metro (unidad) en física; se resuelve como en Magnitudes, porque la unidad va siempre después del número. |
| V | volumen | cm³, mL, L | En física, V es el potencial y la diferencia de potencial (circuitos), y v minúscula es la rapidez. No hay choque dentro de la unidad. |
| ρ | densidad | g/cm³, kg/m³ | Física usa la misma ρ en fluidos. Más adelante, ρ es la resistividad (circuitos). Se avisa en esa unidad, no aquí. |
| T | temperatura | °C, K, °F | **Avisar.** En `fisica.magnitudes-y-vectores`, T es la dimensión tiempo; en MAS es el período. Es la notación de libro y no se cambia. |
| ΔT | variación de temperatura | °C, K, °F | — |
| Q | calor | J o cal (pregunta 2) | Más adelante, Q es la carga eléctrica en física. |
| c | rapidez de la luz (E = Δm·c²) | m/s | **Choca dentro de la unidad** con la c del calor específico (Q = m·c·ΔT). La regla de §0.4 pide un solo significado por letra. Propuesta: c solo para la luz y **cₑ** para el calor específico. Me parece que los libros de academia peruanos escriben «Ce», pero **está por confirmar con los libros de `fuentes/`**; no encontré «Ce» en el repo. Si no se confirma, que Gerson decida (pregunta 3). |
| cₑ (o c) | calor específico | J/(g·°C) o cal/(g·°C) | Ver la fila anterior. |
| L | calor latente | J/g o cal/g | **Avisar.** En física, L es el largo (dilatación, en `temperatura-y-calor`) y la dimensión longitud (Magnitudes). Es la notación de libro y se queda. |
| E | energía | J | Más adelante, E es el campo eléctrico en física. |
| Δm | masa que desaparece (defecto de masa) | mg, g, kg | — |
| Δ | «variación de» o «lo que cambia» | — | — |
| u | unidad de masa atómica | — | Solo en «Mira» de la idea 5. Si complica, se dice «veces la masa de un hidrógeno». |
| H, O, C, N, Na, Cl, Au… | símbolos de elementos, no variables | — | **N** es el newton en física: no usar N como «número de balones» (se escribe «balones»). **n** no se usa: en química será el número de moles (`mol-y-composicion`). |
| t | el reloj de la animación | s | **Se quita de la lectura.** No es una variable de la idea. |

Fórmulas, con la notación de los exámenes: ρ = m/V, Q = m·cₑ·ΔT, Q = m·L, E = Δm·c². En una variación, ΔK = Δ°C y
Δ°F = 1,8·Δ°C; en una lectura, K = °C + 273 y °F = 1,8·°C + 32 (las convenciones de `conversiones-quimica` y de
`calor-escalas`).

---

## 6. Mapa de colores por papel (§5b) y cómo convive con los elementos

**Variables (solo en las ideas 2, 4 y 5, las que tienen cuentas):**

| Idea | Naranja `o` (primer dato) | Turquesa `i` (segundo dato o factor) | Violeta `f` (lo que se pide) | Verde `d` (tercer dato) | Carmín `h` |
| --- | --- | --- | --- | --- | --- |
| 1 | — | — | la clasificación (texto de la respuesta) | — | no se usa |
| 2 | m | V | ρ | — | no se usa |
| 2, separación | — | — | el método | — | no se usa |
| 3 | — | — | el tipo de cambio | — | no se usa |
| 4, juego (curva) | Q que entregas | — | T que responde | — | no se usa |
| 4, Q = m·L | m | L | Q | — | no se usa |
| 4, Q = m·cₑ·ΔT | m | ΔT | Q | cₑ | no se usa |
| 4, variación de escala | ΔT en °C | 1,8 (el factor) | ΔT en °F o K | — | no se usa |
| 5 | Δm | c² | E | la energía de un balón | no se usa |

Si se pide otra cosa (m a partir de Q), el color sigue al papel: lo pedido va en violeta. El carmín de los ángulos queda
libre en química. Esto cambia la teoría actual (T carmín, E verde, m turquesa) y no coincide con la escena
`materia-energia` ni con la física `temperatura-y-calor` (T carmín, Q naranja). Las dos se corrigen cuando les toque.

**Por qué no pueden ir juntos en un mismo dibujo.** Calculé ΔE00 con `Elementos.deltaE00`, el menor entre claro y
oscuro, contra los tokens de §5b:

| Elemento | Se parece a | ΔE00 |
| --- | --- | --- |
| O | carmín `h` | 0,0 (es el mismo tono) |
| Cl | verde `d` | 0,0 |
| H | turquesa `i` | 1,1 |
| S | violeta `f` | 5,8 |
| He | carmín `h` | 6,6 |
| Cu | naranja `o` | 9,1 |
| Au | naranja `o` y verde `d` | 18,9 y 18,1 (bajo el umbral de 20 que usa `elementos.js`) |

Un O junto a una variable carmín, o un H junto a la V turquesa, se leen como la misma cosa.

**Regla de convivencia que propongo:**
1. **Un dibujo es de partículas o de variables, nunca de los dos.** La lupa pinta los átomos solo con `--el-<Símbolo>`
   y conserva el relleno (lleno, hueco, con punto) y la letra del átomo, para la visión en grises y el daltonismo. Las
   ideas 1 y 3 no tienen variables con color, así que ahí no hay choque.
2. En las ideas con variables (2, 4 y 5), la lupa no aparece en la misma figura. Si aparece, como en «hasta el fondo»
   de la idea 2 con átomos de Au, va en un panel aparte con sus átomos en tinta o en su color de elemento, y las
   variables se quedan en la lectura y la ecuación.
3. En el texto corrido, las fórmulas químicas (H₂O, CO₂) van en tinta y no en color de elemento cuando hay variables en
   la pantalla.
4. **Hay que migrar la pieza `quim-particulas`.** Hoy pinta con tokens de variable (`color: 'h'` para el O). Necesita
   una opción para usar `--el-*`, sin cambiar el comportamiento de las unidades que ya la usan (riesgo del plan §10).
   Las vistas nuevas van a `Elementos.VISTAS` y a su prueba.
5. **Pares de elementos que no pueden ir juntos** (`Elementos.CERCANOS`): **N–Fe** (ΔE 4), el clavo oxidado al aire
   con N₂; **C–Na** (9,5), sal con azúcar o con aceite en el mismo vaso; y **He–O** (10,8). O se evitan esas
   combinaciones en la idea 1 y en el clavo de la idea 3, o se separan esos colores en `nucleo/elementos.js`.
6. Faltan colores de elemento para U, Ra y Rn. Si la idea 5 o el nuclear de la idea 3 los dibujan, hay que agregarlos.
   Con C-14 → N-14 no hace falta.

---

## 7. Práctica: qué hay y qué falta, por idea

Las plantillas con esta unidad en `unidades` son `materia-energia` (escena), `quimica-conceptos`,
`conversiones-quimica` y `configuracion-ubicacion`. **Ningún generador separa sus tipos por unidad**: no leen
`opts.unidad`, aunque `app/practica.js` se la pasa. El molde §7 lo pide, porque hoy la práctica de esta unidad sale con
configuración electrónica y vida media.

| Plantilla | Lo que de verdad es de esta unidad | Lo que no |
| --- | --- | --- |
| `materia-energia` (escena, borrador 0.1.0, 24 casos, 10 de papel) | Todo. El motor ya tiene `clasificarCaja`, `material`, `contarSistema`, `cambio`/`FENOMENOS`, `burbujas`, `evaporar`/`quemarMetal` (balanza), `separar`/`metodoPara`, `propiedad`/`clasificarPropiedades`, `energia`/`masaDeEnergia`/`defectoMasa` y `hervir`. **Es una escena, no un generador**: sirve de motor para las misiones y los generadores nuevos. | Tiene su propia paleta (pregunta 11). |
| `quimica-conceptos` (V/F) | 19 proposiciones: tema `sustancias` (11; MA9, MA10, AQ-compuesto-suma) → idea 1; tema `ramas` (8) → sin idea (pregunta 4). | Las otras 14 unidades. Además, `datos: ''` en todos sus problemas. |
| `conversiones-quimica` | En 400 semillas, unas 180 de 400 (45 %) son de aquí. `densidad` masa y volumen (49) → idea 2. `delta` y `lectura`, las escalas (131) → idea 4, si se aprueba la pregunta 1. | `densidad:longitud` (Å, nm, pm: 52) es de estructura atómica. `latente` (84) usa ΔH molar en kJ/mol con M = 18 g/mol, o sea moles antes de `mol-y-composicion` (punto 9): va en líquidos y sólidos. `vida` (84) es radiactividad (pregunta 5). Los tipos `delta` y `lectura` no traen `datos`. |
| `configuracion-ubicacion` | Nada, salvo `vida-media`, si la radiactividad se queda aquí (pregunta 5). Está en la lista por una pregunta de San Marcos 2023-II (ubicar un elemento y leer su vida media) que se clasificó en esta unidad. | Todo lo demás es de estructura atómica y tabla periódica. Propongo sacar esta unidad de su lista. |

**Lo que falta, por idea** (cada generador con `datos` por línea, prueba en 400 semillas y papel, molde §7):

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 | V/F de `sustancias`; papel: clasificar materiales y contar fases y componentes | Un generador de **clasificar y contar** sobre el motor: `material` y `contarSistema` (fases, componentes, elementos y átomos). Cubre lo de San Marcos 2019-I (el aire como mezcla de elementos y compuestos) y 2021 (contar elementos, compuestos y mezclas en un texto). |
| 2 | `conversiones-quimica`, densidad (metales, cm³/L/m³) | **Intensivas o extensivas** (`clasificarPropiedades`; AT1/MA11), **identificar por densidad** y **separación de mezclas** (`separar`/`metodoPara`; métodos equivocados como distractores). |
| 3 | Papel: fenómenos I–V y tres de balanza | Un generador de **físico, químico o nuclear** (`FENOMENOS`; MA1, MA2, MA3, EN13), **propiedad física o química** y, si se aprueba, la **balanza en frasco cerrado o abierto** (`evaporar`, `quemarMetal`; MA4, MA5). |
| 4 | Escalas en `conversiones-quimica`; en física, `calor-escalas` y la escena `calorimetria` | Un generador de **Q por tramos**: sensible, latente, la curva entera y «¿alcanza el calor?». En física existe como escena, no como generador de química. Debe usar la unidad que se elija (J o cal). |
| 5 | Papel: dos problemas | Un generador de **E = Δm·c²** (mg o g → kg; c²; el inverso; el defecto de masa; comparar con la combustión). Distractores: QM-G-KG, QM-MC y c en km/s (en el informe, hipótesis). |

Banco Cuzcano: esta unidad tiene **0 fichas** (`docs/pendientes.md`, punto 18). Los ejercicios de nivel 3 salen de
los exámenes oficiales de San Marcos: hay 6 preguntas clasificadas en `docs/datos/admision-unmsm.csv`, y la regla 5
permite usarlas citando universidad y periodo.

---

## 8. Datos del mundo

| Dato | Dónde está hoy | ¿Fuente? | Propuesta |
| --- | --- | --- | --- |
| Agua que hierve a unos **87 °C en Juliaca** | Regla de la idea 3 actual; `plantillas/calorimetria` (caso del modelo: 87,271 °C a 3825 m con 63 059 Pa); `materia-energia` (experimento 4); `liquidos-y-solidos.js` («0,62 atm ≈ 63 kPa → ≈ 87 °C», curva de presión de vapor del CRC Handbook) | **No medido.** Sale de un modelo: la atmósfera estándar más Antoine o el CRC. El texto de calorimetría dice «cerca de lo que se mide», sin cita. | O se cita la presión media medida en la estación de Juliaca (SENAMHI) con la tabla de presión de vapor (CRC o NIST), o se escribe «unos 87 °C» con la `fuente` del modelo. Es un dato puntual del mundo: el punto 13 pide fuente (pregunta 9). |
| Juliaca a **3825 m** | `calorimetria`, `materia-energia` | Sin fuente en el repo | Citar INEI o IGN si se muestra la altura. |
| La olla a presión a 3800 m | — | — | No la propongo aquí. Es presión de vapor, de `quimica.liquidos-y-solidos` (punto 9), que ya trae 200 kPa → 120 °C. Su sobrepresión real depende del fabricante y no la invento. |
| Sales disueltas del agua del Titicaca | — | — | Solo si Gerson la quiere para la idea 1 («el agua del lago es una mezcla»): pide fuente (ILEC o ALT). No di cifra. |
| Densidades: oro 19,3; cobre 8,9; agua 1 g/mL; hielo 0,92 g/cm³ | `conversiones-quimica` (metales); física (hielo) | Valores de libro | Con «unos», sin fuente. Si se usa el metal dorado barato (latón o pirita), su densidad está **por confirmar** en un libro. |
| Calor del agua: 4,18 J/(g·°C), 334 J/g y 2260 J/g; en academia, 1 cal/(g·°C), 80 cal/g y 540 cal/g | Teoría actual (J); física y su papel (cal) | Valores de libro | Con «unos». Elegir una sola unidad (pregunta 2). Ojo: `calor-escalas` usa 1 cal = 4,2 J y la teoría usa 4,18. |
| c = 3 × 10⁸ m/s | Teoría y motor | Valor de academia (NIST: 299 792 458 m/s, ya citado en la cabecera) | Va en `datos`. |
| Un balón de gas de 10 kg da unos 4,6 × 10⁸ J | — (nuevo) | Poder calorífico del GLP, unos 46 MJ/kg: **valor de libro por confirmar** | Con «unos». Si Gerson prefiere el carbón, la teoría ya usa unos 3,3 × 10⁷ J/kg. |
| H ≈ 1,0078 u; He-4 ≈ 4,0026 u | He-4 en los casos de `materia-energia` | Valores de libro | Con «unos». |
| Fisión de 1 kg de U-235: unos 8,2 × 10¹³ J | Mira de la idea 4 actual | Valor de libro | Se puede quedar con «unos», o salir si la idea 5 usa el Sol y el balón. |

---

## 9. Preguntas para Gerson

1. **Escalas de temperatura.** ¿Van aquí, en la idea 4, como variaciones (ΔK = Δ°C, Δ°F = 1,8·Δ°C) sobre la misma curva,
   como lo preguntó San Marcos 2023-II, o solo en física (`temperatura-y-calor`)? Recomiendo las variaciones aquí y las
   lecturas punto a punto en física.
2. **Calor en química.** San Marcos lo pone en el tema 1 de química; la UNI, en física. ¿Se queda la idea 4? Y si se
   queda, ¿joules o calorías? Física usa calorías (academia) y esta unidad usa joules. Recomiendo calorías con
   1 cal ≈ 4,18 J en `datos`, y unificar el 4,2 de `calor-escalas`.
3. **La letra del calor específico.** Choca con la c de la luz en la misma unidad. ¿Usamos **cₑ (Ce)**? Lo confirmo con
   un libro de academia antes de escribir.
4. **Ramas de la química** (8 V/F y una pregunta de San Marcos 2022). ¿Las dejo como una tarjeta de «Lee» en la idea 1
   con su práctica, o salen de la práctica de la unidad? El contrato pide que cada práctica diga qué idea practica.
5. **Radiactividad y vida media.** Las de `conversiones-quimica` y `configuracion-ubicacion` hoy salen en esta unidad.
   Recomiendo que la idea 5 sea solo E = Δm·c² y que la vida media vaya a estructura atómica (isótopos) o tenga su lugar
   propio, porque el catálogo no tiene un tema de radiactividad.
6. **Separación de mezclas.** ¿Dentro de la idea 2, como uso de las propiedades intensivas (mi propuesta), o como sexta
   idea? Con seis nos pasamos del tope de 5.
7. **Conservación de la masa** (la balanza en frasco cerrado y abierto; MA4 y MA5, con el 38 % de 79 escolares). ¿La
   pongo en «Mira» y en el laboratorio de la idea 3, o la dejo para `reacciones-y-balance`?
8. **Requisito de otro curso.** ¿Agrego `fisica.magnitudes-y-vectores` al `requiere` como consejo? Sirve para g/cm³ ↔
   kg/m³ y mg → kg. Según la decisión 1, no cierra nada, solo muestra «Antes: …».
9. **87 °C en Juliaca.** ¿Buscamos la presión medida de SENAMHI para citarla, o basta «unos 87 °C» con el modelo citado?
10. **Objetos.** ¿Te sirven el oro de Puno (La Rinconada) para la densidad, la chicha de jora y la bosta en la cocina, y
    el balón de gas en vez del carbón? ¿Agua hervida o agua de la llave en la idea 1?
11. **Paletas.** ¿Apruebas la regla «un dibujo es de partículas o de variables, nunca de los dos» y migrar
    `quim-particulas` a la paleta de elementos? Y para los pares N–Fe y C–Na, ¿los separo en `nucleo/elementos.js` o evito
    esas combinaciones? La escena `materia-energia`, con su paleta propia, se rehace después, cuando le toque su turno.
