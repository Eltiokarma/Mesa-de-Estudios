# Propuesta de ideas: «Nomenclatura inorgánica»

`quimica.nomenclatura-inorganica` · Etapa 7 del plan de calidad, última unidad de la rama «Materia y átomo» (sigue a
«Enlace químico» y «Geometría molecular y fuerzas intermoleculares», las dos con `calidad: 2`; la que sigue en el árbol
es «Mol, masa molar y composición») · fases 1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) ·
19 nov 2026

Gerson delegó el criterio: esta propuesta se ejecuta sin esperar su visto bueno. Lo que decidí está al final, en
«Decisiones tomadas (Gerson revisa después)», cada una con su motivo y la alternativa descartada. **No hay ningún
conflicto crítico.** La decisión más grande es **no partir** la unidad: el catálogo tiene ocho temas y salen seis ideas
(sección 3), juntando los dos caminos del hidrógeno (peróxidos, hidruros e hidrácidos) en una sola idea.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1 a 3,
`reglas-validador.md`, `etapa-delegada.md`), `docs/teoria.md` (4 a 4j y §5), las decisiones de las etapas 2 a 6,
`docs/etapa6/propuesta-quimica.md` (modelo de formato), las dos unidades anteriores de la rama (`enlace-quimico.js` y
`geometria-molecular.js`) con sus pruebas, sus auditorías y sus lectores en frío (qué se corrigió: figuras de Lewis que no
cuadraban, una explicación que decía «no da 0» de una fórmula que daba 0, plurales armados como «1 pares», un dato que
nombraba sola a la respuesta, distractores con un valor que no era el de su error, ángulos dibujados distintos de los
rotulados), la teoría de hoy (`contenido/teoria/quimica/nomenclatura-inorganica.js`, v0.1.0), su ficha en
`catalogo/cursos/quimica.json`, la escena `plantillas/nomenclatura-inorganica/` (motor de 724 líneas con 25 casos, papel
y el árbol que se arma solo), `quimica-conceptos` (sus V/F de nomenclatura), el informe
`docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md` (NO1 a NO4, la tabla «lo que no tiene
respaldo» y la propuesta de escena), `docs/temario-completo.md` (unidad 5), `catalogo/pruebas/quimica.json` (no tiene
ítems de esta unidad; las formas ya tienen 10 pares), las preguntas de San Marcos (`docs/datos/admision-unmsm.csv`,
`docs/clasificacion/trampas-admision-unmsm/quimica.md`, trampa 42) y la vecina siguiente, `mol-y-composicion.js`, para no
adelantar la masa molar.

---

## 0. Qué pregunta la admisión

La UNI la pone en la semana 7 y San Marcos en sus temas 4 y 5. En el banco Cuzcano hay unas 122 fichas: estados de
oxidación (23), óxidos, peróxidos e hidruros (23), sales oxisales y haloideas (15), funciones inorgánicas (14) y nombres de
iones (12). En la admisión real de San Marcos (2019-I a 2027-I) hay **10 preguntas** clasificadas aquí y unas 15 de
otras unidades que piden un estado de oxidación o un nombre (redox, estequiometría con sales, lluvia ácida):

| Periodo | Qué piden | Trampa que anota el solucionario | Idea |
| --- | --- | --- | --- |
| 2020-I n.º 107 | Fórmulas de tres oxisales a partir de su nombre | No juntar bien las cargas del catión y del anión poliatómico | 5 |
| 2021 n.º 96 | Nombre Stock de un hidróxido de un metal con dos estados | Mezclar la tradicional o la sistemática con la Stock | 2 y 4 |
| 2021 n.º 86 | Oxoaniones de un halógeno con sus prefijos y sufijos | Cambiar hipo por per, o ito por ato | 4 y 5 |
| 2023-I n.º 84 | V/F: fórmula de una sal y carácter de un óxido de no metal | Llamar básico al óxido de un no metal | 2 y 5 |
| 2023-II n.º 93 | Nombre tradicional del óxido del metal con su mayor estado | Dar el nombre de otro sistema, o el sufijo del menor | 2 |
| 2024-II n.º 93 | V/F sobre tipo de sal, enlace y disolución de una oxisal | — | 5 y 6 |
| 2025-II n.º 89 | Nombre tradicional de una sal de un metal noble | -oso para el mayor estado | 5 |
| 2026-I n.º 94 | Nombres tradicionales de óxidos y oxisales de un metal con dos estados | ato/ito del anión, oso/ico del metal | 2 y 5 |
| 2026-II n.º 94 | Moles de hidróxido e iones al disociarse | Contar solo los aniones | 4 (la parte de moles es de Mol y composición) |
| 2027-I n.º 86 | Nombres de un peróxido, un hidruro y una oxisal | **Confundir peróxido con dióxido**; nitrito con nitrato | 3 y 5 |

La trampa más repetida (trampa 42 del clasificador, unas 9 preguntas) es **el sufijo o el sistema equivocado**: -oso por
-ico, ito por ato, hipo por per, Stock mezclada con tradicional, peróxido por dióxido. Lo único medido del tema está en el
informe: subíndice contra coeficiente (NO1: 40 % de 79 escolares; Casado y Raviolo 2005), 36,8 % de ideas erróneas con
seguridad alta en nombres iónicos (NO2, estudio indonesio, solo el resumen) y la fórmula leída como etiqueta (NO3, Taskin y
Bernholt 2014). Todo lo demás son hipótesis, con código QM-.

---

## 1. Diagnóstico de la teoría actual

1. **Cinco ideas** (`estados-oxidacion`, `tres-nombres`, `arbol-funciones`, `sales`, `sales-acidas-basicas-hidratadas`),
   sin «Lee», sin «Así se resuelve», sin ejemplos (0 de 75) y con dos mesas. El motor de la escena
   (`plantillas/nomenclatura-inorganica/motor.js`) es bueno: estados de oxidación con fracciones, fórmulas por cargas,
   las tres nomenclaturas y los errores de cada una.
2. **Punto 1: ninguna primera pantalla tiene un objeto.** Abren con fichas o con un árbol.
3. **Punto 2: no hay misión.** Cuatro de los cinco juegos se mueven solos (el control «t» de la animación o un estado
   que «sube y baja solo»), el defecto que ya salió de las unidades anteriores. No hay `leyenda`, `aprendizaje`,
   `actividad`, `pregunta` ni `calidad: 2`. La cabecera dice «postulante de 3.º–5.º».
4. **La predicción de la idea 3 no se puede predecir**: el árbol del juego ya mostró el peróxido como caso aparte en la
   regla de la idea 1, que se lee antes («en peróxidos el O vale −1»).
5. **Punto 7: lecturas que encadenan con «·»** («suma +2 · carga de H₂SO₄ …»).
6. **Punto 13: ningún ejercicio trae `datos`**; el glosario tiene 15 términos sin `simple` y con un solo ejemplo.
7. **Notación inventada**: el estado de oxidación se escribe ω, que no usan los libros ni los exámenes (en el Perú se
   escribe E.O. o EO).
8. **Colores contra §5b**: el estado de oxidación en verde junto a la carga en carmín (rojo–verde 0,038 en deuteranopía).
9. **Falta contenido** que el examen pide: los peróxidos como idea (2027-I), los hidruros y los hidrácidos (solo hay una
   línea en el árbol), hipo- y per- en los oxácidos del cloro (2021 n.º 86) y la terminación del anión de un ácido -oso
   (2026-I, 2027-I).
10. **La práctica no es por idea.** `quimica-conceptos` trae V/F sueltos; la escena es un borrador con un papel sin «Datos».

---

## 2. Qué se queda, qué cambia y qué sale

**Se queda:** los cinco `id` de idea, el motor de la escena (la teoría lo pide en `requiere` y saca de él estados de
oxidación, fórmulas y nombres: regla 1), las dos mesas del laboratorio con sus `id` y la predicción del yeso (idea 6, con
los mismos `id` de opciones).

**Cambia:**
- Una idea nueva, `peroxidos-hidruros`, en el tercer lugar.
- El estado de oxidación se escribe **EO** (como EN en la rama) y va en violeta: es lo que casi siempre se pide, y cuenta
  los electrones que el átomo cedería o ganaría (los electrones son violetas en toda la rama).
- La predicción de la idea 1 pasa al Fe₂O₃ (la del informe: el subíndice leído como estado), la del agua oxigenada se va,
  y la del peróxido pasa a la idea 3 con otra pregunta (BaO₂ contra PbO₂). La idea 4 predice el nombre de un oxácido del
  cloro y la 5, el de una sal de un ácido -oso.
- Ningún juego se mueve solo.

**Sale:** el control «t» y el estado que rebota; ω; la escena `nomenclatura-inorganica` va a «Más mesas del tema»
(`"rehacer": true`): su árbol se arma solo y sus nombres de oxácido llevan la forma de academia con «oxo» que esta unidad
no enseña. Su motor sigue siendo el de la teoría.

---

## 3. Las ideas, en orden

Seis ideas. El catálogo tiene ocho temas; «Peróxidos» y la mitad de «Óxidos e hidruros» y de «Ácidos oxácidos e
hidrácidos» van juntos en la idea 3, porque los tres son los compuestos donde el O o el H no valen lo de siempre, o donde
el H se une sin oxígeno.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `estados-oxidacion` | Estados de oxidación | Los estados de oxidación de todos los átomos, cada uno por su número de átomos, suman la carga de la especie: 0 si es neutra; así sale el que falta. |
| 2 | `tres-nombres` | Óxidos y sus tres nombres | Un metal con oxígeno da un óxido básico y un no metal, un óxido ácido. Se nombra contando átomos, con el EO en romanos o con -oso e -ico. |
| 3 | `peroxidos-hidruros` (nueva) | Peróxidos, hidruros e hidrácidos | En un peróxido dos O unidos valen −1 y no se simplifican. El H vale −1 junto a un metal (hidruro); HCl y H₂S disueltos en agua son hidrácidos. |
| 4 | `arbol-funciones` | Hidróxidos y oxácidos | Óxido básico con agua da un hidróxido (un OH⁻ por cada unidad de EO); óxido ácido con agua da un oxácido. Su nombre lleva hipo-, -oso, -ico o per-. |
| 5 | `sales` | Sales haloideas y oxisales | La sal junta un catión con el anión de un ácido hasta carga cero. El anión cambia la terminación: -hídrico a -uro, -oso a -ito, -ico a -ato. |
| 6 | `sales-acidas-basicas-hidratadas` | Sales ácidas, básicas e hidratadas | Una sal ácida conserva H en su anión, una básica lleva OH⁻ y una hidratada trae moléculas de agua enteras, sin carga, tras el punto. |

**Por qué va cada una en su lugar y qué da por sabido**

- **1.** Da por sabido ion, catión y anión (Estructura atómica), metal, no metal y grupo (Tabla periódica) y que un
  compuesto iónico tiene carga total cero (Enlace químico, idea 2). Aquí entran el EO, los valores que casi no cambian
  (O −2, H +1 con no metales, grupo 1 +1, grupo 2 +2, F −1, sustancia simple 0) y la suma Σ n · EO = carga. Nivel de
  examen: K₂Cr₂O₇, NH₄⁺ y «¿en cuál el S tiene +6?».
- **2.** Usa la idea 1 (el EO del metal sale de la fórmula, o la fórmula sale del EO). Óxido básico y ácido, las tres
  nomenclaturas y cuándo se omite el romano. La tradicional del óxido de un no metal, «anhídrido», va con la tarjeta
  «Convención del examen».
- **3.** Usa 1 y 2. Peróxido (O₂²⁻, no se simplifica; dióxido contra peróxido), hidruro de metal (H −1), los compuestos del
  H con no metales y los hidrácidos (ácido clorhídrico, sulfhídrico).
- **4.** Usa 2 (el óxido) y 3 (qué es un ácido sin oxígeno). Hidróxidos con su paréntesis, oxácidos por óxido + agua con su
  simplificación, el P y el B con tres aguas, y los nombres hipo-…-oso, -oso, -ico, per-…-ico.
- **5.** Usa 3 y 4 (de qué ácido sale cada anión). Aniones, fórmula por cargas con paréntesis, nombre con el EO del metal.
- **6.** Usa 5. Sales ácidas (hidrogenocarbonato o bicarbonato), básicas, hidratadas, y cuántos átomos lleva un hidrato.

Qué **no** entra: masa molar, moles y porcentaje de agua de un hidrato (Mol y composición), reacciones y su balance
(Reacciones y balance), fuerza de los ácidos y pH (Ácidos y bases), la forma de academia con «oxo» («tetraoxosulfato (VI)
de hidrógeno»), sales dobles y oxácidos meta y piro.

---

## 4. Objeto de la primera pantalla

| Idea | Objeto (tarjeta 1 de «Lee») | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El frasco de permanganato de la farmacia** (KMnO₄, se disuelve para desinfectar) | cada letra = un átomo; cada átomo «aporta» su EO |
| 2 | **Un clavo oxidado** (la herrumbre es un óxido de hierro) | el polvo rojizo = un óxido básico |
| 3 | **El frasco de agua oxigenada** (H₂O₂) | dos oxígenos unidos |
| 4 | **El frasco de leche de magnesia** (Mg(OH)₂) | el ion OH⁻ que va entero |
| 5 | **El salero** (NaCl) y un **saco de abono** (nitrato de amonio) | catión + anión de un ácido |
| 6 | **La caja de bicarbonato de la cocina** (NaHCO₃) | el H que se quedó en el anión |

Todo se dibuja como prueba (`data-prueba`) en una pieza nueva, **`quim-nomenclatura`**, que también trae la tarjeta de
nombres (la fórmula arriba, con el catión en naranja y el anión en turquesa, y debajo los nombres de cada sistema, con el
romano en violeta). Las cargas van en `quim-fichas` y el árbol en `quim-cadena` (ya existen; a `quim-fichas` solo se le
agrega la opción de escribir los símbolos en la letra con serifa, sin cambiar lo de siempre).

---

## 5. Misión de «Juega»

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «Cada átomo aporta cuadritos: llenos si su EO es positivo, huecos si es negativo.» **Encuentra el EO del nitrógeno en el ion amonio, NH₄⁺.** | especie (H₂SO₄, HNO₃, KMnO₄, CO₃²⁻, ClO₄⁻, NH₄⁺), EO del átomo que falta (−4 a +8, de 1 en 1, quieto) y arrastre de los cuadritos | `k === 'NH4' && eo === −3` | «Suma de EO: −1; la carga del NH₄⁺ es +1.» |
| 2 | «Un elemento con su EO y el oxígeno con −2 forman un óxido.» **Arma el óxido cuyo nombre tradicional termina en -oso y lleva dos átomos del metal.** | elemento con su EO: Na +1, Ca +2, Al +3, Fe +2, Fe +3, Cu +1, Cu +2, C +4, S +4, S +6 | Cu₂O | «Cu₂O: óxido básico; el cobre con EO +1.» |
| 3 | «El hidrógeno se une a metales y a no metales.» **Busca un compuesto donde el hidrógeno tenga EO −1.** | NaH, CaH₂, NH₃, CH₄, H₂O, H₂S, HCl | NaH o CaH₂ | «CaH₂: cada H con −1, junto a un metal.» |
| 4 | «Cada óxido, con agua, da otro compuesto.» **Arma un oxácido que tenga un solo hidrógeno.** | Na +1, Ca +2, Al +3, Fe +3, C +4, S +4, S +6, N +3, N +5 | N +3 o N +5 | «N₂O₅ + H₂O da HNO₃: ácido nítrico.» |
| 5 | «La sal junta cationes y aniones enteros.» **Arma la sal del aluminio con el sulfato sin carga suelta.** | catión (Na⁺, Ca²⁺, Al³⁺), anión (Cl⁻, S²⁻, CO₃²⁻, SO₄²⁻, PO₄³⁻), fichas de cada uno (1 a 4) y arrastre | Al₂(SO₄)₃ | «2 Al³⁺ y 3 SO₄²⁻: carga 0; sulfato de aluminio.» |
| 6 | «Algunas sales traen algo más que un catión y un anión.» **Encuentra la sal que lleva un ion hidróxido, OH⁻.** | NaHCO₃, KHSO₄, Mg(OH)Cl, Na₂CO₃, CaCO₃ | Mg(OH)Cl | «KHSO₄: el anión HSO₄⁻ conserva un H.» |

Lo que se reserva para predecir: en 1, ninguna especie con dos átomos del elemento que falta; en 2, el plomo; en 3, los
peróxidos; en 4, el cloro; en 5, los ácidos -oso (nitrito, sulfito); en 6, los hidratos.

---

## 6. La predicción de cada idea

La app baraja las opciones; los `datos` traen solo valores, nunca la regla. Lo que se pide va con «?».

**1.** «La herrumbre es Fe₂O₃. ¿Qué EO tiene cada hierro?» Datos: «EO del O: −2», «Fe₂O₃ es neutro». Correcta +3.
Distractores: +2 (el subíndice como EO: QM-OX-SUBINDICE, la hipótesis del informe, de NO1 y NO3), +6 (lo de los dos
juntos: QM-OX-TOTAL), −3 (el signo al revés: QM-OX-SIGNO).

**2.** Se queda la de hoy con sus `id`: «“Óxido de plomo(IV)” y “dióxido de plomo”, ¿nombran la misma sustancia?»
Sí (PbO₂) · No, el IV cuenta plomos (QM-ROMANO) · No, sistemas distintos (NO3) · y una nueva: No, el IV cuenta
oxígenos (QM-ROMANO-O).

**3.** «El BaO₂ y el PbO₂ se escriben igual: un metal y dos oxígenos. ¿Cuál es un peróxido?» Datos: «Bario: solo EO +2»,
«Plomo: EO +2 y +4», «EO del O: −2 en un óxido». Correcta: el BaO₂. Distractores: el PbO₂ (QM-PEROX-DIOXIDO: todo «MO₂» es
peróxido), los dos (QM-PEROX-FORMA), ninguno (QM-OX-O: el O siempre −2). Es la trampa de 2027-I.

**4.** «El cloro forma oxácidos con EO +1, +3, +5 y +7. El HClO₃, con +5, es el ácido clórico. ¿Cómo se llama el HClO₄,
con +7?» Correcta: ácido perclórico. Distractores: hipoclórico (QM-HIPO-PER), cloroso (QM-OSO-ICO: -oso al mayor), clórico
como el otro (QM-UN-NOMBRE). Es la trampa de 2021 n.º 86.

**5.** «Del ácido nitroso, HNO₂, sale el anión NO₂⁻. ¿Cómo se llama la sal KNO₂?» Correcta: nitrito de potasio.
Distractores: nitrato (QM-ITO-ATO), nitruro (QM-URO), «nitroso de potasio» (QM-SIN-CAMBIO). Es la trampa de 2027-I.

**6.** Se queda la de hoy (el yeso, CaSO₄·2H₂O), con sus `id`.

---

## 7. Tabla de letras y símbolos

| Símbolo | Un solo significado | Aviso |
| --- | --- | --- |
| EO | estado de oxidación de un átomo | Como EN en la rama; se dice siempre de qué átomo: «EO del S» |
| z | carga de la especie (0 si es neutra) | Solo en la regla y en las cuentas; en el texto, «carga» |
| n | número de átomos de un elemento en la fórmula (su subíndice) | En la regla: Σ n · EO = carga |
| I a VII | el EO en números romanos (Stock) | Nunca cuenta átomos |
| ·nH₂O | moléculas de agua por unidad del hidrato | Solo en la idea 6 |
| (ac) | disuelto en agua | HCl(ac) es el ácido; HCl, el gas |
| X, Q, R | elementos sin nombre | Nunca E (la alternativa E) ni A |

---

## 8. Mapa de colores (un color fijo por magnitud, §5b)

| Magnitud o papel | Token | Por qué |
| --- | --- | --- |
| el catión, el metal (lo que va primero en la fórmula) | `o` naranja | el primer dato; la ficha positiva |
| el anión, el no metal, el oxígeno del óxido | `i` turquesa | el segundo dato; la ficha negativa |
| el estado de oxidación (EO) y su romano | `f` violeta | lo que se pide casi siempre; los electrones son violetas en la rama |
| la carga de la especie o del ion | `h` carmín | como en Estructura atómica y Enlace químico |
| nombres, fórmulas enteras, agua de hidratación, subíndices | tinta | no son magnitudes |
| `d` verde | no se usa | naranja–verde 0,010 y rojo–verde 0,038 |

Pares (molde §5b): naranja–turquesa 0,114; naranja–violeta 0,189; turquesa–violeta 0,101; violeta–carmín 0,167;
turquesa–carmín 0,077; naranja–carmín 0,062 (la carga de un catión va escrita en su ficha, con su signo).

---

## 9. Práctica: qué existe y qué se hace

Lo que hay: la escena `nomenclatura-inorganica` (borrador, motor con 25 casos y 10 problemas de papel) y
`quimica-conceptos` (V/F, sirve a 15 unidades).

**Generador nuevo `nomenclatura-practica`**, con `TIPOS_POR_IDEA`:

| Idea | Tipos |
| --- | --- |
| 1 | EO en un compuesto (1) · EO en un ion (2) · EO con dos átomos del elemento (2) · cuál tiene tal EO (3) |
| 2 | nombre Stock de un óxido (1) · nombre tradicional (2) · fórmula desde el nombre (2) · básico o ácido (1) |
| 3 | cuál es peróxido (2) · fórmula de un peróxido (1) · nombre del hidrácido (1) · fórmula de un hidruro de metal (2) |
| 4 | fórmula del hidróxido (1) · fórmula del oxácido (2) · nombre del oxácido (3) |
| 5 | nombre del anión (1) · fórmula de la sal (2) · nombre de la sal (3) |
| 6 | clase de sal (1) · anión de la sal ácida (2) · átomos de un hidrato (3) |

Con `casos.json` (18 casos o más, verificados aparte: el nombre con OPSIN y la fórmula con una cuenta de cargas propia),
`papel.json` y `plantilla.json`. La escena vieja va a «Más mesas del tema» (`"rehacer": true`). Prueba del curso: un par
nuevo a la reserva (qui-22, EO con dos átomos del elemento, el Cr del K₂Cr₂O₇ y el S del Na₂S₂O₃… con el recálculo en
`catalogo/pruebas/verificar.js`).

---

## 10. Datos del mundo y comprobación de los nombres

| Dato | ¿Fuente? |
| --- | --- |
| Cada nombre que ve el alumno | Se traduce palabra por palabra al inglés (hierro(III) → iron(III), sulfato → sulfate, férrico → ferric) y **OPSIN 2.8.0** (Lowe y otros, Universidad de Cambridge; el programa de los nombres polifuncionales de la etapa de admisión) da su fórmula, que se compara con la de la unidad. Lo que OPSIN no lee (peróxidos, algunos hidruros) se compara con la tabla del motor y con las Recomendaciones de la IUPAC de 2005 (en español: Ciriano y Román Polo, *Nomenclatura de Química Inorgánica*, Prensas Universitarias de Zaragoza, 2007), que no pude abrir desde la sesión: queda dicho en la cabecera. |
| Estados de oxidación de academia (Fe +2 y +3, Cu +1 y +2, Pb y Sn +2 y +4…) | La tabla del motor (convenciones de academia, cabecera del motor) |
| Permanganato en la farmacia, agua oxigenada, leche de magnesia, herrumbre, bicarbonato, yeso | Hechos de todos los días, sin cifra |

---

## 11. Riesgos de orden con otras unidades (`requiere`)

- **Requiere `quimica.enlace-quimico`** (como hoy): iones, carga total cero, compuesto iónico. Por su cadena: ion, catión,
  anión, metal, no metal, grupo, halógeno. **Geometría molecular** no hace falta. **Mol y composición** sigue pidiendo
  esta unidad.
- **Palabras que define otra unidad posterior**: «ácido» (Ácidos y bases) se define aquí como `local` (en agua suelta
  iones H⁺); «subíndice» (Reacciones y balance) se muda aquí, que es donde se usa primero (una entrada, sin tocar nada más
  de esa unidad); «IUPAC» (Funciones orgánicas) no se marca aquí (`glosarioSin`). Nunca la palabra «oxidación» sola
  (Reacciones y balance): siempre «estado de oxidación».
- **Lo que no puede aparecer aquí**: masa molar, mol, balance de ecuaciones, pH, fuerza de un ácido.
- **El avance**: las ideas 1, 4 y 5 conservan su `id` con otra Predice; la unidad suma una idea. Entra en `REHECHAS_E6`
  de `nucleo/avance.js` (una línea): la predicción guardada sin huella se vuelve a preguntar una vez y quien terminó las
  cinco ideas de antes conserva «Ya la estudié». La idea 2 cambia sus datos pero conserva su pregunta y sus `id`; la 3
  (`arbol-funciones`, ahora la 4) cambia su Predice.

---

## 12. Decisiones tomadas (Gerson revisa después)

1. **No se parte la unidad: seis ideas.** Motivo: ocho temas, pero los peróxidos, los hidruros y los hidrácidos tienen un
   mismo hilo (el O o el H fuera de lo de siempre, o el H sin oxígeno) y caben en una idea. Descartado: partir en
   «Nomenclatura inorgánica» y «Ácidos y sales» (dos unidades de cuatro ideas, otra migración del avance y un nombre que se
   confunde con «Ácidos y bases»).
2. **El estado de oxidación se escribe EO y va en violeta.** Motivo: es la notación de las academias (E.O.) y de la rama
   (EN); ω no la usa nadie. Violeta porque es lo que se pide y cuenta electrones. Descartado: ω en verde (inventada y
   junto al carmín de la carga, 0,038 en deuteranopía).
3. **Tarjeta «Convención del examen» nueva, `nomenclatura-examen`** (en `nucleo/convencion.js`, bloque propio), en «Lee»
   de la idea 2 y en la práctica: el examen acepta los tres sistemas y pregunta por uno; «anhídrido» para el óxido de un
   no metal; -oso e -ico para un metal con dos EO. En la universidad: las recomendaciones de la IUPAC de 2005 ya no
   recomiendan -oso e -ico para los metales, no usan «anhídrido» y conservan «ácido sulfúrico» y «sulfato». Descartado:
   enseñar solo la IUPAC de 2005 (el examen de San Marcos pide la tradicional en 2023-II y 2026-I).
4. **Los oxácidos y las sales se nombran solo por la tradicional** (ácido sulfúrico, sulfato de cobre(II)); la forma de
   academia con «oxo» («tetraoxosulfato (VI) de hidrógeno») no entra. Motivo: San Marcos no la pregunta en los diez
   ítems, y no es la de la IUPAC de 2005. Descartado: los tres sistemas también en los oxácidos (el motor los tiene).
5. **La tradicional de los metales solo con dos EO** (Fe, Cu, Pb, Sn, Co, Ni, Au, Hg). Con un solo EO, «óxido de sodio».
   Los no metales con cuatro (Cl, Br, I) llevan hipo y per en sus oxácidos; el N y el S, solo dos (+3 y +5; +4 y +6).
   Descartado: hipo- con el N +1 y el S +2 (compuestos que casi no existen).
6. **La predicción del peróxido es BaO₂ contra PbO₂** (no el agua oxigenada): la trampa del examen es peróxido contra
   dióxido, y la del agua oxigenada se responde con la regla de la idea 1.
7. **La escena `nomenclatura-inorganica` va a «Más mesas del tema»** con `"rehacer": true`; su motor sigue como el cálculo
   de la teoría. Descartado: dejarla como mesa de una idea (se mueve sola y nombra con «oxo»).
8. **Objetos de prueba** en la pieza nueva `quim-nomenclatura` (permanganato, clavo oxidado, agua oxigenada, leche de
   magnesia, salero con saco de abono, bicarbonato), con su prueba numérica.
9. **«ácido» local** (en agua suelta H⁺; la definición de Brønsted es de Ácidos y bases) y **«subíndice» se muda** a esta
   unidad, que lo usa antes.
10. **Bicarbonato y hidrogenocarbonato**: la regla da los dos («hidrogenocarbonato, que en la cocina se llama
    bicarbonato»); las sales básicas se clasifican pero no se piden por su nombre (las academias no se ponen de acuerdo:
    hidroxicloruro, cloruro básico).
11. **Práctica**: un generador nuevo con `TIPOS_POR_IDEA`; `quimica-conceptos` sigue como práctica extra.
12. **No toco** `docs/datos/admision-unmsm.csv` ni `docs/teoria/matriz/quimica.json`: son compartidos.

### Decisiones tomadas al ejecutar (fases 2 a 5, 19 nov)

13. **El ícono de la unidad** (`app/dibujos/quimica.js`, cabecera y mapa) mostraba «Fe³⁺, O²⁻ → Fe₂O₃»: la respuesta de la
    Predice de la idea 1. Pasa a letras genéricas (M²⁺, X⁻ → MX₂); nota de la sesión sobre la idea 1.
14. **La leyenda de los cuadritos va en un solo renglón** («lleno: +1 de EO; hueco: −1 de EO»): en dos columnas se leía
    cruzada (nota de la sesión). `quim-fichas` gana dos opciones compatibles: `serif` (los símbolos en la letra de las
    ecuaciones) y `oculta` por ficha (un «?» bajo la ficha en vez de su carga: antes salía «0» bajo «Fe ?»).
15. **La tarjeta «Convención del examen» va dos veces en «Lee»** (ideas 2 y 6), como en Estructura atómica, y entra en
    `nucleo/convencion.js` como `nomenclatura-examen` para la práctica (bloque propio y su línea en la prueba).
16. **«EO» no entra en `letras`**: la tabla solo acepta letras sueltas; «EO» queda como `simbolo` del glosario.
17. **«subíndice» se mudó** de Reacciones y balance a esta unidad (una entrada; allá quedó un comentario).
18. **La Ahora tú de la idea 2 no usa el cloro ni el bromo con +7 ni el cloro con +1**: su nombre tradicional
    («anhídrido perclórico», «hipocloroso») adelantaba la Predice de la idea 4. Tampoco ningún texto de las ideas 1 a 4
    dice «nitrito» (la Predice de la idea 5): el ejemplo «El nitrógeno del nitrito» pasó a «Un ion del nitrógeno».
19. **Los nombres de las tarjetas se dibujan con un `<tspan>` por parte**: con un `<text>` por parte el romano se montaba
    sobre la última letra («plomc(IV)»).
20. **Práctica `nomenclatura-practica` sin el motor de la escena** (tablas propias, como `enlace-lewis`): en el navegador la
    práctica carga solo el generador. Con 18 tipos en 6 ideas y la selección de distractores que evita que la correcta sea
    la «central» (la misma medida que `nucleo/probar-generador.js`).
21. **Prueba del curso**: qui-22 (EO de un elemento con dos átomos: Cr del K₂Cr₂O₇ y P del H₄P₂O₇) a la reserva, con su
    recálculo en `catalogo/pruebas/verificar.js`.
22. **Papel de `quimica-conceptos`**: el p5 (V/F de nombres, de esta unidad) ganó su `datos`.
