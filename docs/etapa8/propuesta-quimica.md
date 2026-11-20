# Propuesta de ideas: «Mol, masa molar y composición»

`quimica.mol-y-composicion` · Etapa 8 del plan de calidad, primera unidad de la rama «Cálculos químicos» (la rama
«Materia y átomo» está completa con `calidad: 2`; la siguen «Reacciones químicas y balance», «Estequiometría» y «Estado
gaseoso») · fases 1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta se ejecuta sin esperar su visto bueno. Lo que decidí está al final, en
«Decisiones tomadas (Gerson revisa después)», cada una con su motivo y la alternativa descartada. **No hay ningún
conflicto crítico.** La decisión más grande es **no partir** la unidad: el catálogo tiene siete temas y salen seis ideas
(sección 3), con «Número de Avogadro y mol» y «Masa molar» juntos en una idea («contar» y «pesar» se enseñan uno frente
al otro, que es lo que separa el error ES3).

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1 a 3,
`reglas-validador.md`, `etapa-delegada.md`), `docs/teoria.md` (4 a 4j y §5), las decisiones de las etapas 2 a 7,
`docs/etapa7/propuesta-quimica.md` (modelo de formato), la unidad modelo `nomenclatura-inorganica.js` con su prueba, su
auditoría y sus dos lectores en frío (qué se corrigió: una alternativa que también era correcta con los Datos dados, una
explicación que contaba mal los EO de su lista, listas con «y … y …», igualdades químicas que no cuadraban contando
átomos, Datos que faltaban o que regalaban la respuesta, un guion de terminación partido al final del renglón, el papel
que no cubría todas las ideas), la teoría de hoy (`contenido/teoria/quimica/mol-y-composicion.js`, v0.1.0), su ficha en
`catalogo/cursos/quimica.json`, la escena `plantillas/mol-composicion/` (motor de 179 líneas, 16 casos y papel), el
informe `docs/investigacion/estequiometria-ideas-erroneas.md` (ES1 a ES19 y «Lo que no tiene respaldo»),
`docs/temario-completo.md` (unidad 6), `catalogo/pruebas/quimica.json` (no tiene ítems de esta unidad; las formas ya
tienen 10 pares; qui-22 es el último de la reserva), las preguntas de San Marcos (`docs/datos/admision-unmsm.csv`,
`docs/clasificacion/trampas-admision-unmsm/quimica.md`, trampas 2 y 3) y las vecinas: `estructura-atomica.js` (isótopos,
A = Z + N, N para los neutrones), `nomenclatura-inorganica.js` (fórmulas, subíndice, iones, hidratos),
`reacciones-y-balance.js`, `estequiometria.js` y `gases.js` (para no adelantar balance, reactivo limitante ni volumen
molar).

---

## 0. Qué pregunta la admisión

La UNI la pone en las semanas 8 y 9 y San Marcos en sus temas 4 y 5 («unidades químicas de masa»). En el banco Cuzcano hay
unas 115 fichas: número de Avogadro y mol (50), relaciones molares en una fórmula (32), composición centesimal (12),
fórmula empírica y molecular (12) y masa atómica promedio (6). En la admisión real de San Marcos (2019-I a 2027-I) hay
**13 preguntas** clasificadas aquí:

| Periodo | Qué piden | Trampa que anota el solucionario | Idea |
| --- | --- | --- | --- |
| 2019-II n.º 111 | Moles y moléculas de agua a partir de un porcentaje de la masa corporal | No aplicar el porcentaje; potencia de diez | 2 y 4 |
| 2023-I n.º 85 y n.º 92 | Moles de átomos de O (o de H) en la dosis de un medicamento | **Contar moles de moléculas sin multiplicar por los átomos** | 3 |
| 2023-II n.º 89 | Moles de un fármaco en el volumen de una dosis | — | 2 |
| 2024-I n.º 93 | Un conteo de células pasado a micromoles con Nₐ | Olvidar el prefijo micro | 2 |
| 2024-I n.º 85 | Moles de iones, de átomos y masa de un elemento en un mol de una sal | Contar un solo tipo de ion | 3 |
| 2025-I n.º 88 | Milimoles de un fármaco y átomos de oxígeno ingeridos en un día | Contar moléculas en vez de átomos | 2 y 3 |
| 2025-I n.º 93 | Moles y porcentaje de carbono de un flavonoide | Calcular mal el % de C | 4 |
| 2025-II n.º 88 | Moléculas de un alcaloide al día a partir de la masa por taza | mg → g | 2 |
| 2025-II n.º 89 | Fórmula empírica de un hidrocarburo por su composición | **Quedarse con una razón no entera sin multiplicar** | 5 |
| 2026-II n.º 95 | Porcentaje de un elemento en la sal anhidra que deja un hidrato | Usar la masa molar del hidrato | 4 |
| 2027-I n.º 89 | Porcentaje de oxígeno en un alcohol cíclico dado por su estructura | Contar mal los H | 4 |
| 2027-I n.º 94 | Afirmación correcta sobre volumen molar, Nₐ y masa molar | 22,4 L fuera de condiciones normales | 2 (el volumen molar es de «Estado gaseoso») |

Las dos trampas más repetidas de toda la química de San Marcos tocan esta unidad: **contar moles de moléculas en vez de
moles de átomos** (trampa 2, unas 11 preguntas; ES18 y ES6) y **los errores de unidades** (trampa 3, unas 10: mg ↔ g,
potencias de diez). Lo medido del tema está en el informe: el mol como masa (ES3: solo 33,0 % de 97 razonó bien que 1 mol
de O₂ y 1 de H₂O tienen las mismas moléculas), «a igual masa, igual número de partículas» (ES4: 13 de 28), invertir
n = m/M (ES7: 21,9 % de 32 con confianza alta), la fórmula empírica como razón de masas (ES16: 15,6 a 25,0 %), la empírica
como «la de menos átomos» (ES17: 15,6 %), olvidar el subíndice (ES18: 18,8 %) y la proporción de masas tomada como de
moléculas (ES19). Lo demás son hipótesis, con código QM-.

---

## 1. Diagnóstico de la teoría actual

1. **Cinco ideas** (`masa-atomica-promedio`, `mol-masa-molar`, `relaciones-en-formula`,
   `composicion-formula-empirica`, `leyes-ponderales`), sin «Lee», sin «Así se resuelve», sin ejemplos (0 de 75) y con
   dos mesas. La idea 4 junta composición centesimal y fórmula empírica y molecular: dos destrezas que el examen pide por
   separado y que son una la inversa de la otra.
2. **Punto 1: ninguna primera pantalla tiene un objeto.** Abren con una lupa, una balanza vacía o una barra.
3. **Punto 2: no hay misión.** Los cinco juegos se mueven solos (abundancia que rebota, moles que suben y bajan, el reloj
   «t» de la barra que se llena): el defecto que ya salió de las unidades anteriores. No hay `leyenda`, `aprendizaje`,
   `actividad`, `pregunta` ni `calidad: 2`. La cabecera dice «postulante de 4.º–5.º».
4. **La predicción de la idea 1 no se puede predecir**: el juego muestra la lupa con dos clases de átomos y la lectura
   del promedio; la pregunta «¿hay átomos que pesen 35,45 u?» ya la respondió la lupa. **La de la idea 2** («1 mol de
   agua y 1 mol de azúcar, ¿dónde hay más moléculas?») la responde la definición de mol que el alumno lee antes.
5. **Punto 7: lecturas que encadenan con «·»** («C 40 % · H 6,7 % · O 53,3 %») y una ecuación de la regla con dos
   relaciones separadas por «·» dentro de una llave.
6. **Punto 13: ningún ejercicio trae `datos`**; las masas atómicas van escondidas en el enunciado («(C = 12)»). El
   glosario tiene 13 términos sin `simple` y con un solo ejemplo.
7. **Colores contra §5b**: M en verde junto a n en naranja (naranja–verde 0,010 en protanopía); los elementos pintados
   con tokens de variable (H turquesa, O rojo) en la misma barra que lleva la masa: partículas y variables mezcladas.
8. **Falta contenido** que el examen pide: dosis en mg y mmol (2023-II, 2024-I, 2025-I, 2025-II), moles de iones de una sal
   (2024-I), la razón 1,5 que hay que multiplicar (2025-II), el porcentaje en un hidrato (2026-II), la masa de una
   molécula en gramos y el paso de u a g.
9. **La práctica no es por idea.** Solo existe la escena `mol-composicion` (borrador, un control que se arrastra y un
   papel sin «Datos»).

---

## 2. Qué se queda, qué cambia y qué sale

**Se queda:** los cinco `id` de idea; el motor de la escena (`plantillas/mol-composicion/motor.js`: masa molar,
composición, empírica y molecular), que la teoría pide en `requiere` y del que saca masas molares, porcentajes y fórmulas
(regla 1); las dos mesas del laboratorio con sus `id`; la predicción de la idea 3 (moles de O en 2 mol de Al₂(SO₄)₃), la
de la idea 4 (el CH₄) y la de la idea 6 (CO y CO₂), con los mismos `id` de opciones.

**Cambia:**
- Una idea nueva, `formula-empirica-molecular`, en el quinto lugar. `composicion-formula-empirica` conserva su `id` y su
  predicción del CH₄, y queda solo con la composición centesimal.
- La predicción de la idea 1 pasa al magnesio, con tres isótopos que el juego no muestra; la de la idea 2, a 18 g de agua
  contra 18 g de azúcar (igual masa, distinto número: ES4).
- Masas atómicas como en el examen (redondeadas) en `datos`, con la tarjeta «Convención del examen» que da las de la
  IUPAC.
- Ningún juego se mueve solo.

**Sale:** el control «t» y los controles que rebotan; la escena `mol-composicion` va a «Más mesas del tema»
(`"rehacer": true`): se mueve sola y su papel no trae «Datos». Su motor sigue siendo el de la teoría. Sale también el
22,4 L/mol (es de «Estado gaseoso»).

---

## 3. Las ideas, en orden

Seis ideas, una por tema del catálogo, salvo «Número de Avogadro y mol» y «Masa molar», que van juntas en la idea 2.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `masa-atomica-promedio` | Masa atómica promedio | La masa atómica de la tabla es el promedio de las masas de los isótopos, cada una pesada por su abundancia; ningún átomo pesa ese promedio. |
| 2 | `mol-masa-molar` | Mol y masa molar | Un mol son 6,02 × 10²³ entidades y la masa molar es lo que pesa un mol: n = m/M y N = n · Nₐ. A igual masa, más moles de lo más liviano. |
| 3 | `relaciones-en-formula` | Moles de átomos en una fórmula | Los subíndices cuentan los átomos de cada elemento en una unidad; los moles de un elemento son los del compuesto por su subíndice. |
| 4 | `composicion-formula-empirica` | Composición centesimal | El porcentaje en masa de un elemento es su masa en un mol del compuesto entre la masa molar: pesa cuánto pesa cada átomo, no solo cuántos hay. |
| 5 | `formula-empirica-molecular` (nueva) | Fórmula empírica y molecular | La empírica sale de pasar cada masa a moles y dividir entre el menor; la molecular es k veces la empírica, con k = M / M(empírica). |
| 6 | `leyes-ponderales` | Leyes ponderales | En un sistema cerrado la masa se conserva; un compuesto tiene siempre la misma razón de masas; dos compuestos de los mismos elementos, razones de enteros pequeños. |

**Por qué va cada una en su lugar y qué da por sabido**

- **1.** Da por sabido isótopo, número de masa A y neutrón (Estructura atómica). Aquí entran la unidad u (la doceava parte
  de un carbono-12), la masa de un isótopo («casi su A») y el promedio pesado. Nivel de examen: tres isótopos y el
  problema al revés (la abundancia que da una masa atómica).
- **2.** Usa la idea 1 (la masa de la fórmula en u). Mol como «una docena enorme», Nₐ, masa molar como suma de masas
  atómicas por sus subíndices, n = m/M, N = n · Nₐ, la masa de una molécula en gramos (M/Nₐ) y las dosis en mg y mmol.
- **3.** Usa 2. Moles y número de átomos de cada elemento, el paréntesis y el hidrato, los iones de una sal y el camino
  gramos → moles del compuesto → moles del elemento.
- **4.** Usa 2 y 3 (la masa de un elemento en un mol). Porcentaje en masa, la masa de un elemento en una muestra, el
  agua de un hidrato y el problema al revés (la masa atómica que da un porcentaje).
- **5.** Usa 4 (al revés: de porcentajes a fórmula). Empírica con la razón 1,5 que se multiplica, molecular con la masa
  molar.
- **6.** Usa 2 a 5 (la razón de masas de un compuesto). Lavoisier en frasco cerrado y abierto, Proust y Dalton.

Qué **no** entra: balance de ecuaciones (Reacciones y balance), reactivo limitante y en exceso, rendimiento y pureza
(Estequiometría), volumen molar y 22,4 L (Estado gaseoso), equivalentes (Estequiometría), la ley de Richter (las
academias la ponen, San Marcos no la pregunta en los 13 ítems) y la combustión de una muestra para su análisis (pide
masas de CO₂ y H₂O que salen de una reacción).

---

## 4. Objeto de la primera pantalla

| Idea | Objeto (tarjeta 1 de «Lee») | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El cuadro del cloro en la tabla periódica de la pared del aula** («Cl 35,45») | el decimal que no es la masa de ningún átomo |
| 2 | **Una balanza de cocina con un vaso de agua** | pesar en vez de contar |
| 3 | **Una tiza** (casi todo CaCO₃) | cada unidad trae un Ca, un C y tres O |
| 4 | **Un paquete de sal de cocina con su tabla de nutrición** (dice «sodio») | la sal no es toda sodio: una parte de su masa es cloro |
| 5 | **Una botella de vinagre** (ácido acético, C₂H₄O₂) | dos fórmulas distintas con la misma proporción de átomos |
| 6 | **Un frasco cerrado sobre una balanza** | lo que pesa antes y después |

Todo se dibuja como prueba (`data-prueba`) en una pieza nueva, **`quim-mol`**, que también trae la **tarjeta de conteo**:
la fórmula arriba, en la letra con serifa (el Cl no se lee «CI»), y debajo una fila por elemento con sus átomos por
unidad, el «× n» y lo que se pide con «?». Las partículas van en `quim-particulas` con la paleta de elementos
(`el`, con `/nucleo/elementos.js` en `requiere`), la balanza en `balanza` y las barras en `quim-composicion`.

---

## 5. Misión de «Juega»

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «La lupa tiene 25 átomos de cloro de dos clases.» **Arma la mezcla que da 35,45 u, la masa de la tabla.** | átomos de cloro-35 (0 a 25) | 19 de cloro-35 | «76 % de cloro-35 → masa promedio 35,45 u» |
| 2 | «En un platillo va la sustancia; en el otro, una pesa de 90 g.» **Equilibra la pesa con agua.** | sustancia (agua, sal, tiza, alcohol, azúcar) y moles (0,5 a 6, de 0,5 en 0,5) | 5 mol de agua | «3 mol de H₂O: m = 3 · 18 = 54 g; la pesa, 90 g» |
| 3 | «Abajo de la lupa se cuentan los átomos de cada elemento.» **Junta 8 átomos de oxígeno con solo 2 moléculas.** | sustancia (H₂O, CO₂, NH₃, CH₄, H₂SO₄, C₂H₆O) y moléculas (1 a 6) | 2 de H₂SO₄ | «2 H₂SO₄: 2 × 4 = 8 átomos de O» |
| 4 | «Arriba se cuentan los átomos; abajo se reparte la masa.» **Encuentra el compuesto con la mitad de su masa en oxígeno.** | compuesto (H₂O, NH₃, CO₂, SO₂, SO₃, NaCl, CaCO₃, glucosa) | SO₂ | «SO₂: O es el 50 % de la masa; 2 de 3 átomos» |
| 5 | «Arma un hidrocarburo CₓHᵧ y mira su análisis.» **Arma la fórmula más simple que da 80 % de C y 20 % de H.** | x (1 a 6) e y (1 a 14) | CH₃ | «C₂H₆: C 80 % y H 20 %; C : H = 1 : 3» |
| 6 | «Tres muestras de agua de lugares distintos.» **Estira la barra hasta que el agua tenga 4 g de hidrógeno.** | masa de agua (9 a 72 g, de 9 en 9) y arrastre del extremo | 36 g | «36 g de agua: 32 g de O y 4 g de H; 8 : 1» |

Lo que se reserva para predecir: en 1, el magnesio y los tres isótopos; en 2, la comparación a igual masa (el juego
siempre pone moles); en 3, el paréntesis (ninguna fórmula del juego lo tiene); en 4, el metano; en 5, los hidrocarburos de
razón 1 : 1; en 6, el CO y el CO₂ (dos compuestos de los mismos elementos).

---

## 6. La predicción de cada idea

La app baraja las opciones; los `datos` traen solo valores, nunca la regla. Lo que se pide va con «?».

**1.** «El magnesio tiene tres isótopos: de cada 100 átomos, 79 son ²⁴Mg, 10 son ²⁵Mg y 11 son ²⁶Mg. ¿Cuál es su masa
atómica?» Datos: la masa de cada isótopo, casi su número de masa (24, 25 y 26 u). Correcta: unas 24,3 u (la tabla dice
24,305 u). Distractores: 25 u (promedio simple: QM-PROMEDIO-SIMPLE), 24 u (la del más abundante: AT4), unas 25,7 u (las
abundancias al revés: QM-PROMEDIO-CRUZADO).

**2.** «Un vaso tiene 18 g de agua y otro, 18 g de azúcar. ¿Dónde hay más moléculas?» Datos: M(H₂O) = 18 g/mol, M(azúcar,
C₁₂H₂₂O₁₁) = 342 g/mol. Correcta: en el agua, unas 19 veces más. Distractores: igual, porque pesan lo mismo (ES4); en el
azúcar, porque su molécula tiene más átomos (ES6); no se puede saber sin contarlas (ES3: el mol como masa).

**3.** Se queda la de hoy con sus `id`: «¿Cuántos moles de átomos de oxígeno hay en 2 mol de Al₂(SO₄)₃?» Correcta 24 mol;
8 mol (el paréntesis olvidado: ES18), 12 mol (una sola unidad: QM-POR-N), 7 mol (suma subíndices sueltos: ES11).

**4.** Se queda la de hoy con sus `id`: «En el metano, CH₄, hay 4 átomos de H por cada C. ¿Qué porcentaje de su masa es
hidrógeno?» Correcta 25 %; 80 % (el porcentaje de átomos: ES19), 75 % (el del carbono), 4 % (4 de 100).

**5.** «Un hidrocarburo tiene 92,3 % de C y 7,7 % de H en masa. ¿Cuál es su fórmula empírica?» Correcta CH. Distractores:
C₁₂H (la razón de masas: ES16), CH₁₂ (la razón de masas puesta al revés: QM-EMP-INVERTIDA), C₆H₆ (una molecular con esa
proporción, que sin la masa molar no se puede saber: ES17).

**6.** Se queda la de hoy con sus `id`: «Con 12 g de carbono, el CO lleva 16 g de oxígeno. En el CO₂, ¿cuánto oxígeno se
une a los mismos 12 g de carbono?» Correcta 32 g; 16 g (el mismo compuesto), 44 g (todo el CO₂), 24 g.

---

## 7. Tabla de letras y símbolos

| Símbolo | Un solo significado | Aviso |
| --- | --- | --- |
| n | cantidad de sustancia, en mol | En Nomenclatura, n era el número de átomos de la fórmula; aquí eso se dice «átomos por unidad» o «subíndice» |
| m | masa de una muestra, en g | |
| M | masa molar, en g/mol | M(H₂O) se lee «la masa molar del agua» |
| N | número de entidades (moléculas, átomos o iones) | **En Estructura atómica, N es el número de neutrones**: aquí los neutrones se dicen con su palabra y el aviso va en «Lee» de las ideas 1 y 2 |
| Nₐ | número de Avogadro, 6,02 × 10²³ mol⁻¹ | |
| u | unidad de masa atómica (la academia dice «uma») | Es una unidad, no una letra |
| k | veces que la empírica cabe en la molecular (un entero) | Solo en la idea 5 |
| x, y | átomos de C y de H en CₓHᵧ | Solo en la idea 5 |

---

## 8. Mapa de colores (un color fijo por magnitud, §5b)

| Magnitud o papel | Token | Por qué |
| --- | --- | --- |
| m, la masa de la muestra (y la masa de un elemento en gramos) | `o` naranja | el primer dato casi siempre |
| M, la masa molar, y la masa atómica (u) | `i` turquesa | el factor; la masa atómica es la masa molar de un átomo, el mismo número |
| n, los moles | `f` violeta | lo que se pide casi siempre y el paso por donde pasa todo |
| N, el número de entidades | `h` carmín | lo que se cuenta |
| %, el porcentaje (abundancia y porcentaje en masa) | `h` carmín | nunca va con N en un mismo ejercicio |
| Nₐ, fórmulas, subíndices, nombres | tinta | constantes y etiquetas, no magnitudes |
| `d` verde | no se usa | naranja–verde 0,010 en protanopía |

Pares (molde §5b): naranja–turquesa 0,114; naranja–violeta 0,189; turquesa–violeta 0,101; violeta–carmín 0,167;
turquesa–carmín 0,077; naranja–carmín 0,062 (N y % llevan siempre su letra o su signo). Las partículas van con la paleta
de elementos y nunca en la misma figura que un color de variable.

---

## 9. Práctica: qué existe y qué se hace

Lo que hay: la escena `mol-composicion` (borrador, motor con 16 casos y 10 problemas de papel sin «Datos»).

**Generador nuevo `mol-practica`**, con `TIPOS_POR_IDEA`, sin el motor de la escena (tablas propias, como
`nomenclatura-practica`):

| Idea | Tipos |
| --- | --- |
| 1 | promedio de dos isótopos (1) · promedio de tres (2) · abundancia desde la masa atómica (3) |
| 2 | moles desde gramos (1) · moléculas desde moles (1) · moléculas desde gramos (2) · dosis en mg (3) |
| 3 | moles de un elemento (1) · moles de un elemento desde gramos (2) · moles de iones (2) · átomos de un elemento en una dosis (3) |
| 4 | porcentaje de un elemento (1) · masa de un elemento en una muestra (2) · porcentaje de agua de un hidrato (3) |
| 5 | empírica con razón entera (1) · molecular desde la empírica (2) · empírica con razón 1,5 (3) |
| 6 | Lavoisier en frasco cerrado (1) · gas que escapa en un vaso abierto (2) · Proust en otra muestra (2) · Dalton (3) |

Con `casos.json` (18 casos o más, verificados aparte con un script que no usa el generador), `papel.json` (las seis
ideas) y `plantilla.json`. La escena vieja va a «Más mesas del tema» (`"rehacer": true`). Prueba del curso: un par nuevo
a la reserva (qui-23, moles de átomos de un elemento en una masa de compuesto, la trampa 2 de San Marcos), con su
recálculo en `catalogo/pruebas/verificar.js`.

---

## 10. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Masas de los isótopos y abundancias (³⁵Cl 34,969 u y 75,76 %; ³⁷Cl 36,966 u y 24,24 %; ²⁴Mg, ²⁵Mg, ²⁶Mg; ¹⁰B y ¹¹B; ⁶³Cu y ⁶⁵Cu; ⁶Li y ⁷Li; ⁷⁹Br y ⁸¹Br; ¹⁰⁷Ag y ¹⁰⁹Ag; ⁶⁹Ga y ⁷¹Ga) | NIST, *Atomic Weights and Isotopic Compositions for All Elements* (campo `fuente`) |
| Masas atómicas de la tabla (H 1,008; C 12,011; N 14,007; O 15,999; Na 22,990; Mg 24,305; Cl 35,45…) | IUPAC/CIAAW, pesos atómicos estándar abreviados (tarjeta «Convención del examen») |
| Masas atómicas redondeadas del examen (H 1, C 12, N 14, O 16, Na 23, Cl 35,5…) | Convención de academia y del examen: van en `datos` como «masas atómicas redondeadas» |
| Nₐ = 6,02 × 10²³ mol⁻¹ (exacto 6,02214076 × 10²³) y 1 u ≈ 1,66 × 10⁻²⁴ g | BIPM, SI 2019 (historia y convención) |
| La urea, abono con unos 46 % de nitrógeno; tabletas de 500 mg de paracetamol; unos 95 mg de cafeína en una taza de café | Valores de etiqueta y de libro, con «unos» y sin fuente |
| Tiza (CaCO₃), sal, vinagre, glucosa del suero | Hechos de todos los días, sin cifra |

---

## 11. Riesgos de orden con otras unidades (`requiere`)

- **Requiere `quimica.estructura-atomica` y `quimica.nomenclatura-inorganica`** (como hoy): isótopo, A, ion, fórmula,
  subíndice, paréntesis, hidrato. Por su cadena, todo lo de la rama «Materia y átomo».
- **Lo que no puede aparecer aquí**: «coeficiente», ecuaciones balanceadas, «reactivo limitante», «en exceso», «sobra»,
  22,4 L, rendimiento. Lavoisier se enseña con masas antes y después, sin escribir la ecuación; las combinaciones de la
  idea 6 dicen «todo reacciona» para no pedir el limitante.
- **Palabras que define otra unidad posterior**: «reactivo» y «producto» (Reacciones y balance) no se usan; se dice
  «lo de antes» y «lo que se forma». «Condiciones normales» y «volumen molar» no salen.
- **El avance**: la unidad suma una idea y las ideas 1 y 2 cambian su Predice. Entra en `REHECHAS_E6` de
  `nucleo/avance.js` (una línea, con su prueba): la predicción guardada sin huella de esas dos se vuelve a preguntar una
  vez y quien terminó las cinco ideas de antes conserva «Ya la estudié». Las ideas 3, 4 y 6 conservan su pregunta y sus
  `id` de opciones.

---

## 12. Decisiones tomadas (Gerson revisa después)

1. **No se parte la unidad: seis ideas.** Motivo: siete temas, pero «Número de Avogadro y mol» y «Masa molar» se enseñan
   mejor juntos (contar frente a pesar es lo que separa ES3 y ES4). Descartado: siete ideas con `septimaIdea` (hoy solo la
   usa Las cuatro operaciones) o partir la unidad (otra migración y una unidad de tres ideas).
2. **La composición centesimal y la fórmula empírica van en ideas distintas**, y `composicion-formula-empirica` conserva
   su `id` con la composición (y su predicción del CH₄). Motivo: así el avance de esa idea no se pierde. Descartado: un
   `id` nuevo para las dos (dos predicciones viejas sin dueño).
3. **Masas atómicas redondeadas, como en el examen**, en `datos` («masas atómicas redondeadas: C = 12, H = 1»), con una
   tarjeta «Convención del examen» en «Lee» de la idea 2 que da las de la IUPAC. Nₐ = 6,02 × 10²³ en toda la unidad.
   Descartado: las masas de cuatro cifras (las cuentas del examen no las usan y las respuestas no calzarían).
4. **N para el número de entidades**, con aviso: en Estructura atómica N son los neutrones. Motivo: es la notación de los
   libros (N = n · Nₐ). Descartado: escribir «número de moléculas» en palabras en cada ecuación (largo a 390 px).
5. **Colores**: m naranja, M y masa atómica turquesa, n violeta, N y porcentajes carmín, sin verde. Motivo: n es el
   paso por donde pasa toda cuenta y lo que se pide casi siempre; la masa atómica es la masa molar de un átomo.
   Descartado: el mapa de hoy (n naranja, M verde: naranja–verde 0,010).
6. **Predicciones nuevas en las ideas 1 y 2** (magnesio con tres isótopos; 18 g de agua contra 18 g de azúcar); las de las
   ideas 3, 4 y 6 se quedan con sus `id`. Motivo: las dos viejas ya las respondía lo que se ve antes (diagnóstico, punto 4).
7. **La escena `mol-composicion` va a «Más mesas del tema»** con `"rehacer": true`; su motor sigue como el cálculo de la
   teoría. Descartado: dejarla como mesa de una idea (se mueve sola y su papel no trae «Datos»).
8. **Objetos de prueba** en la pieza nueva `quim-mol` (cuadro de la tabla, balanza de cocina, tiza, paquete de sal,
   vinagre, frasco cerrado) y la tarjeta de conteo, con su prueba numérica.
9. **Fuera de la unidad**: 22,4 L/mol (Estado gaseoso), Richter y la combustión para el análisis. Motivo: no adelantar
   unidades y no pedir una reacción sin balance.
10. **Práctica**: un generador nuevo `mol-practica` con `TIPOS_POR_IDEA` y tablas propias; un par a la reserva de la
    prueba (qui-23).
11. **No toco** `docs/datos/admision-unmsm.csv` ni `docs/teoria/matriz/quimica.json`: son compartidos.

### Decisiones tomadas al ejecutar (fases 2 a 5, 20 nov)

12. **La regla de la idea 1 no usa Σ** (nota de la sesión): «masa atómica = aporte₁ + aporte₂ + …» y «aporte = masa × %/100»,
    en dos renglones; las cuentas de los ejemplos dan el aporte de cada isótopo y después la suma (a 390 px la suma entera
    se partía después de «+»). El «Vale si» solo dice que las abundancias suman 100 %; «la masa de un isótopo es casi su
    número de masa» va en Datos de cada ejercicio que lo usa.
13. **El metal desconocido se llama X**, no M (M es la masa molar en toda la unidad): «un óxido XO, de un metal X».
14. **El ícono de la unidad no se tocó**: escribe «mol», y la misión de la idea 2 decía «5 mol de agua» en su `bien`; el
    `bien` pasó a «cinco veces 18 g son 90 g de agua» (regla `icono-respuesta`).
15. **«Moléculas» solo de sustancias moleculares**: en «Ahora tú» de la idea 2 y en la práctica, los iónicos (KOH, Na₂CO₃,
    Ca(OH)₂…) se usan para moles y gramos, nunca para contar moléculas.
16. **La molecular desde la empírica usa factores k de moléculas que existen** (CH × 2, 4, 8; CH₂ × 2 a 6; NO₂ × 2; C₂H₅ ×
    2…): al azar salían fórmulas imposibles como C₆H₁₅. La prueba de la unidad lo revisa.
17. **«porcentaje en masa» es `local`**: Soluciones ya lo define (el de un soluto); aquí es el de un elemento en un
    compuesto. No toqué Soluciones.
18. **Las empíricas de «Ahora tú» no son de razón 1 : 1**: con 1 : 1, la razón de masas y la razón al revés daban la misma
    fórmula y quedaban dos alternativas.
19. **Predice de la idea 3 sin Datos** (la pregunta ya trae todo; un dato con los grupos SO₄ adelantaba el paréntesis).
20. **La lupa de la idea 3 al 160 %**: las moléculas se veían diminutas a 390 px.
21. **`quim-mol` acepta fichas de ecuación** en la fórmula de la tarjeta de conteo (el «2 mol» en violeta). Pieza nueva,
    de esta unidad.
22. **Las masas molares van en el texto del paso** y la ecuación solo da el resultado («M(NH₄NO₃) = 80 g/mol»): la cuenta
    entera dejaba el resultado solo en el renglón de abajo (`ecuaciones-ancho.js`: ahora «todo cabe»).
23. **Prueba del curso**: qui-23 (milimoles de átomos de un elemento en una dosis: O del ácido acetilsalicílico y C del
    ibuprofeno) a la reserva, con su recálculo en `catalogo/pruebas/verificar.js` y tres códigos nuevos en el banco
    (ES14-moles-de-moleculas, ES6-todos-los-atomos, ES7-invertida).
24. **Pendiente que no es de la unidad**: la pieza `balanza` dibuja un «1» arriba a la izquierda aunque haya una sola
    balanza (se ve en Juega y Predice de la idea 2).
