# Propuesta de ideas: «Enlace químico»

`quimica.enlace-quimico` · Etapa 6 del plan de calidad, quinta unidad de la rama «Materia y átomo» (sigue a «Materia y
energía», «Estructura atómica», «Tabla periódica» y «Propiedades periódicas», las cuatro con `calidad: 2`) · fases 1 a 5
con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta se ejecuta sin esperar su visto bueno. Lo que decidí está al final, en
«Decisiones tomadas (Gerson revisa después)», cada una con su motivo y la alternativa descartada. **No hay ningún
conflicto crítico.** La decisión más grande es partir la unidad en dos (sección 3), como Tabla periódica / Propiedades
periódicas y MRU / MRUV: el tema de hoy tiene ocho temas en el catálogo y diez ideas naturales.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1 a 3,
`reglas-validador.md`, `etapa-delegada.md`), `docs/teoria.md` (4 a 4j y §5), las decisiones de las etapas 2 a 5,
`docs/etapa5/propuesta-quimica.md` (modelo de formato), la unidad modelo `propiedades-periodicas.js` con su prueba, su
auditoría y su lector en frío (qué se corrigió: una opción que también era correcta en un tercio de los casos, un Mira
dibujado con la vista equivocada, «dos bajadas por periodo» falso en los periodos 5 y 6, un par de carácter metálico que
contradecía la propia tabla de EI, figuras que traían los valores pedidos), la teoría de hoy
(`contenido/teoria/quimica/enlace-quimico.js`, v0.1.0), su ficha en `catalogo/cursos/quimica.json`, la plantilla
`plantillas/enlace/` (motor, casos y papel), `quimica-conceptos` (temas `hidruros` e `ionicos`), el informe
`docs/investigacion/atomo-enlace-ideas-erroneas.md` (EN1 a EN17 y sus hipótesis), `docs/temario-completo.md` (unidad 4),
`catalogo/pruebas/quimica.json` (qui-12 en la reserva), las preguntas de San Marcos (`docs/datos/admision-unmsm.csv` y
`docs/clasificacion/trampas-admision-unmsm/quimica.md`, trampas 28 a 31) y las vecinas: `tabla-periodica.js` (símbolo
de Lewis de un átomo, electrones de valencia), `propiedades-periodicas.js` (EN, ΔEN, par compartido, δ en el HCl),
`nomenclatura-inorganica.js` (estados de oxidación, nombres y funciones: no se adelantan), `liquidos-y-solidos.js` (red
cristalina, celda) e `hidrocarburos.js` (hibridación del carbono).

---

## 0. Qué pregunta la admisión

La UNI pone enlace en las semanas 5 y 6 (la 6 es hibridación, geometría y fuerzas) y San Marcos en su tema 3. En el banco
Cuzcano hay unas 155 fichas: enlace iónico (27), hibridación y geometría molecular (23), fuerzas intermoleculares (21),
tipos de enlace y propiedades (18) y polaridad (15). En la admisión real de San Marcos (2019-I a 2027-I) hay **13
preguntas** clasificadas en esta unidad y otras tantas de orgánica que piden hibridación, enlaces pi o fuerzas:

| Periodo | Qué piden | Trampa que anota el solucionario | Idea donde cae |
| --- | --- | --- | --- |
| 2019-I n.º 111 | Lewis de una molécula lineal de N y O | Contar mal pares libres; enlace múltiple entre iguales | A3 y A5 |
| 2019-II n.º 85 | Pares libres del central con octeto expandido | Suponer octeto cuando hay expansión | A4 y B1 |
| 2019-II n.º 86 | Enlaces polares y octeto en una molécula con azufre | «Todo átomo del periodo 3 cumple el octeto» | A1 y A4 |
| 2019-II n.º 113, 2020-I n.º 112 | Hibridación de carbonos (nitrilo, anillo) | sp² en un triple enlace | B2 |
| 2021 n.º 88 | Iónico, covalente o metálico por electronegatividades | (sin trampa anotada) | A1 |
| 2022 n.º 94 | Tipo de sólido por fusión, solubilidad y conducción | «El iónico conduce en estado sólido» | A1 y A2 |
| 2024-I n.º 86 | Enlace y pares libres de un hidruro de no metal | «El hidruro no tiene pares libres» | A3 |
| 2024-I n.º 87 | Molécula elemental contra compuesto (O₂) | Llamar compuesto al O₂ | A3 |
| 2024-II n.º 85 | Catión, pares libres del anión y fórmula de un compuesto iónico | No juntar las cargas en la fórmula | A2 |
| 2025-II n.º 93 | Pares libres, tipo de enlace y EN del N₂ y el O₂ | **Doble enlace en el N₂**; invertir la EN | A3 |
| 2025-II n.º 96 | La especie con un electrón desapareado (radical) | Confundir un ion con un radical | A4 |
| 2027-I n.º 93 | Propiedades de los sólidos iónicos | «Los aniones solo son monoatómicos» | A2 |
| orgánica | 2023-I n.º 90, 2024-I n.º 96, 2026-II n.º 96 y otras: hibridación y enlaces o electrones pi; 2024-II n.º 87: fuerzas de London en isómeros | sp² en el triple (trampa 29, ~12 veces); enlaces pi contra electrones pi (30, ~5); ramificación que sube la ebullición (34) | B2 y B4 |

La trampa más repetida es la **hibridación mal asignada** (unas 12 preguntas, casi todas de orgánica, que usa lo que se
aprende aquí). Lo único medido de esta unidad está en el informe: el NaCl «hecho de moléculas» (EN1: 92 % de 102
escolares tailandeses), la geometría del NH₃ leída del papel (EN8: 44 % de acierto en 200 universitarios), la polaridad
del CH₂Cl₂ (EN10: 26 % antes del curso y 24 % después), el O–H «más fuerte» como razón de la ebullición del agua (EN14:
36 %), el puente de hidrógeno «con oxígeno» (EN15: 31–34 %) y la resonancia como moléculas que cambian de forma (EN6:
37,5 % de 88 universitarios).

---

## 1. Diagnóstico de la teoría actual

1. **Cinco ideas** (`tres-enlaces`, `lewis-octeto`, `resonancia`, `forma-polaridad`, `fuerzas-intermoleculares`), con
   «Lee», «Así se resuelve», tres mesas (una en 3D) y un motor bueno (`plantillas/enlace/motor.js`: Lewis de átomo central,
   VSEPR, hibridación, polaridad, ΔEN, resonancia y la red del NaCl, con 60 casos). Las predicciones de las ideas 1, 4 y 5
   ya salen de errores medidos (EN1, EN11, EN14).
2. **Punto 1: ninguna primera pantalla tiene un objeto.** Abren con cajas de partículas o estructuras.
3. **Punto 2: no hay misión.** Cuatro juegos tienen un control «t» en segundos que se mueve solo (el reloj de la
   animación, el defecto que ya salió de las cuatro unidades anteriores). No hay `leyenda`, `aprendizaje`, `actividad`,
   `pregunta` ni `calidad: 2`. La cabecera dice «postulante de 3.º–5.º».
4. **El juego de la idea 1 regala su predicción**: muestra la sal con la lupa (red de iones) y después pregunta qué hay
   dentro de un grano de sal.
5. **Punto 7: lecturas que encadenan con «·»** («t = 3,2 s · red de iones…»).
6. **Punto 13: ningún ejercicio trae `datos`**; no hay ejemplos resueltos (0 de 75); el glosario tiene 18 términos sin
   `simple` y con 0 o 1 ejemplo. Los casos de «Ahora tú» de la idea 1 son 10 fijos con un solo código (EN5) para todo.
7. **Nombres que adelantan Nomenclatura**: «bromuro de potasio», «óxido de magnesio», «fluoruro de calcio».
8. **Colores contra §5b.** N_val turquesa, carga carmín, ángulo verde, dipolo naranja; en la lupa, metal verde junto al
   catión naranja (0,010 en protanopía).
9. **Falta contenido** que el examen pide: el enlace iónico con su fórmula y sus propiedades, el enlace dativo, las tres
   excepciones al octeto (incompleto, expandido, impar), los enlaces sigma y pi, y las formas del octeto expandido.
10. **La práctica no es por idea.** `quimica-conceptos` tiene dos temas (`hidruros`, `ionicos`); la escena `enlace` es
    un borrador con un papel sin «Datos».

---

## 2. Qué se queda, qué cambia y qué sale

**Se queda:** los cinco `id` de idea, el motor de `plantillas/enlace/` (la teoría lo pide en `requiere` y saca de él
Lewis, formas, hibridación, polaridad y resonancia: regla 1), las tres mesas con sus `id`, las predicciones medidas
(EN1, EN6, EN14) y la pieza `quim-molecula-3d`.

**Cambia:**
- **La unidad se parte en dos** (sección 3): «Enlace químico» conserva el `id` y se queda con cómo se unen los átomos
  (tipos de enlace, iónico, Lewis, dativo y excepciones, resonancia); «Geometría molecular y fuerzas intermoleculares»
  (`quimica.geometria-molecular`, nueva) recibe la forma, la hibridación, la polaridad de la molécula y las fuerzas entre
  moléculas, con dos de las tres mesas.
- Seis ideas nuevas: `enlace-ionico` y `dativo-excepciones` en la primera; `forma-repulsion` y `hibridacion` en la
  segunda (las otras dos de la segunda son las de hoy, rehechas).
- Colores nuevos (sección 8), los de la rama donde la magnitud es la misma (Z naranja, electrones violeta, carga carmín).

**Sale:** el reloj «t» de los cuatro juegos; los nombres de compuestos («bromuro de potasio» pasa a «KBr»); la escena
`enlace` va a «Más mesas del tema» en las dos unidades (`"rehacer"`), con su papel marcado por unidad.

---

## 3. Las ideas, en orden

Son **diez**. No caben en una unidad (tope de 6, o 7 con `septimaIdea`) y tienen la costura que usan la UNI (semanas 5
y 6) y las academias («Enlace químico» y «Geometría molecular»): cómo se unen los átomos, y qué forma y qué atracciones
tiene lo que se forma.

### A. «Enlace químico» (`quimica.enlace-quimico`, conserva el `id`)

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| A1 | `tres-enlaces` | Iónico, covalente y metálico | Metal con no metal forma iones que se atraen; dos no metales comparten pares; un metal suelta electrones a un mar común. Cada tipo tiene sus propiedades. |
| A2 | `enlace-ionico` (nueva) | Enlace iónico: iones y fórmula | El metal pierde y el no metal gana electrones hasta quedar como un gas noble; la fórmula junta los iones con carga total cero. |
| A3 | `lewis-octeto` | Estructuras de Lewis y octeto | Se suman los electrones de valencia (con la carga del ion), se ponen los enlaces y se completan octetos con pares libres; a veces hace falta un enlace doble o triple. |
| A4 | `dativo-excepciones` (nueva) | Enlace dativo y excepciones al octeto | En un enlace dativo un átomo pone los dos electrones. El boro queda con 6, el P o el S pueden tener 10 o 12, y una especie impar es un radical. |
| A5 | `resonancia` | Resonancia | Si una estructura se puede dibujar de varias maneras que solo mueven pares, la especie real es el promedio: enlaces iguales, de orden intermedio. |

### B. «Geometría molecular y fuerzas intermoleculares» (`quimica.geometria-molecular`, unidad nueva)

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| B1 | `forma-repulsion` (nueva) | Forma por repulsión de pares | Las regiones de electrones del átomo central se alejan lo más posible; la forma se nombra por los átomos, pero los pares libres también empujan. |
| B2 | `hibridacion` (nueva) | Hibridación y enlaces sigma y pi | El número de regiones da la hibridación (2 sp, 3 sp², 4 sp³). Todo enlace tiene un sigma; el doble suma un pi y el triple, dos. |
| B3 | `forma-polaridad` | Polaridad de la molécula | Una molécula es polar si sus enlaces son polares y la forma no anula sus dipolos; en 3D, no en el papel. |
| B4 | `fuerzas-intermoleculares` | Fuerzas entre moléculas | Al hervir se separan moléculas, no átomos. Hierve más alto la de más atracción: puente de hidrógeno, dipolo-dipolo y, siempre, London. |

**Por qué va cada una en su lugar y qué da por sabido**

- **A1.** Da por sabido metal y no metal (Tabla periódica, idea 4), catión y anión (Estructura atómica) y la ΔEN con el
  par que se corre (Propiedades periódicas, idea 4). Aquí entran los tres tipos, el covalente polar y apolar, la ΔEN como
  guía (≥ 1,7 suele ser iónico, con la excepción del HF) y las propiedades que deciden el tipo: el sólido iónico no
  conduce y fundido o disuelto sí; el metal conduce sólido; el molecular funde bajo. Su nivel de examen: San Marcos 2021
  n.º 88 y 2022 n.º 94.
- **A2.** Usa A1 y los electrones de valencia. El octeto entra aquí por primera vez, con los iones («queda como el neón»).
  Lewis de un compuesto iónico ([Na]⁺ [:Cl:]⁻), la fórmula por la carga total cero (MgCl₂, Al₂O₃) y la red sin moléculas.
  **Sin nombres de compuestos ni funciones**: se dicen por su fórmula («el compuesto KBr»); lo de óxidos, hidróxidos y
  sales es de Nomenclatura.
- **A3.** Usa A2 (octeto). Electrones de valencia totales con la carga del ion, enlaces simples, dobles y triples, pares
  libres, molécula de un elemento (O₂, N₂: San Marcos 2024-I n.º 87 y 2025-II n.º 93).
- **A4.** Necesita A3. Dativo (NH₄⁺, H₃O⁺), octeto incompleto (BeCl₂, BF₃), expandido (PCl₅, SF₆) y especies impares
  (NO, NO₂: radicales). El electrón desapareado viene de Estructura atómica.
- **A5.** Necesita A3. Híbrido, orden de enlace promedio (O₃: 1,5; NO₃⁻ y CO₃²⁻: 4/3), número de estructuras. La carga
  formal entra como dato de un caso de nivel 3, no como regla aparte.
- **B1.** Requiere A. Regiones de electrones (un enlace doble cuenta como una), AXₙEₘ, las cinco formas de 2 a 4 regiones y
  las del octeto expandido (bipirámide, balancín, T, octaedro, pirámide cuadrada, cuadrada plana), ángulos ideales y que
  los pares libres los cierran.
- **B2.** Necesita B1 y los orbitales s y p de Estructura atómica. sp, sp², sp³ (sp³d y sp³d² en el octeto expandido) y
  el conteo de sigma y pi. El carbono de orgánica entra como ejemplo (etano, eteno, etino), sin nombres de familias.
- **B3.** Necesita B1 y la polaridad del enlace (A1). Dipolos que se suman en 3D: CO₂ y CCl₄ apolares con enlaces
  polares, H₂O, NH₃ y CH₂Cl₂ polares.
- **B4.** Necesita B3. London, dipolo-dipolo, puente de hidrógeno (H unido a N, O o F), el agua que se sale de su grupo,
  la cadena larga que hierve más que la ramificada y «hervir no rompe enlaces».

Qué **no** entra en ninguna de las dos: estados de oxidación, nombres y funciones (Nomenclatura), la celda unitaria y
los tipos de sólido cristalino (Líquidos y sólidos), orbitales moleculares, momento dipolar en debye con cuentas,
aromaticidad (Hidrocarburos).

---

## 4. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| A1 | **Un probador de foquito con un vaso**: pila, foquito y dos cables que tocan lo que hay en el vaso (un cable de cobre, un grano de sal, agua con sal, agua con azúcar, agua destilada) | el foquito = prende si algo lleva carga por el vaso |
| A2 | **La sal de Maras en la palma de la mano** y, al lado, el sodio y el cloro como símbolos de Lewis | el grano = un compuesto iónico; los puntos = electrones de valencia |
| A3 | **El aire que respiras**: una ventana con una nube de moléculas N₂ y O₂ | cada par de bolitas = una molécula de un solo elemento |
| A4 | **Un frasco de limpiador con amoníaco** | el limpiador = NH₃ disuelto en agua; ahí se forma NH₄⁺ |
| A5 | **Una tiza de la pizarra** (lleva el ion CO₃²⁻) | la tiza = dónde está el ion; los tres dibujos = un solo ion real |
| B1 | **Globos amarrados por el nudo**: dos, tres y cuatro se acomodan lo más lejos posible | cada globo = una región de electrones; el nudo = el átomo central (analogía que «Lee» presenta con su límite) |
| B2 | **La llama de un soplete de soldar** (gas acetileno, H–C≡C–H) junto al balón de gas | la llama = el gas de carbono e hidrógeno; los palitos = enlaces sigma y pi |
| B3 | **El chorrito de agua que se dobla junto a un peine frotado** | el chorro = moléculas polares que el peine atrae; el aceite no se dobla |
| B4 | **La olla con agua que hierve en Juliaca** (unos 87 °C) | las burbujas = moléculas de agua separadas, enteras |

Todo se dibuja como prueba (`data-prueba`) en una pieza nueva, **`quim-enlace`** (mía: los objetos, el probador y el
vaso), con su prueba numérica de encuadre y rótulos. Las estructuras van en `quim-molecula` y las formas en
`quim-molecula-3d` (ya existen). Así no toco `quim-tira` ni `quim-objeto`, que usan unidades con calidad 2.

---

## 5. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| A1 | «El foquito prende si algo lleva carga eléctrica por el vaso.» **Prende el foquito con algo que no sea un metal.** | `m`: cobre, grano de sal, agua con sal, agua con azúcar, agua destilada | `m === 'agua-sal'` | «Agua con sal: el foquito prende; con agua destilada, no.» |
| A2 | «Cada átomo del metal entrega electrones; cada átomo del no metal los recibe.» **Arma un compuesto con dos átomos del metal por cada tres del no metal.** | `a` metal (Na, K, Mg, Ca, Al) y `b` no metal (F, Cl, O, S) | `a === 'Al' && (b === 'O' \|\| b === 'S')` | «Al³⁺ y O²⁻: 2 · (+3) + 3 · (−2) = 0: Al₂O₃.» |
| A3 | «Cada raya es un par compartido; cada par de puntos, un par libre.» **Busca la molécula que tiene más pares libres en total.** | `k`: H₂, Cl₂, HCl, H₂O, NH₃, CH₄, O₂, CO₂ | `k === 'Cl2'` | «Cl₂: 14 electrones = 1 enlace (2) + 6 pares libres (12).» |
| A4 | «Alrededor del átomo central no siempre quedan 8.» **Encuentra la especie con un electrón sin pareja.** | `k`: BeCl₂, BF₃, NH₃, PCl₅, SF₆, NO | `k === 'NO'` | «PCl₅: el P queda con 10 electrones, más de 8.» |
| A5 | «En la tiza, el ion CO₃²⁻ se dibuja con un enlace doble y dos simples.» **Lleva el doble enlace a cada uno de los tres oxígenos.** | `k`: posición del doble (arriba, izquierda, derecha); la misión mira los tres vistos (`testigo`) | los tres | «Doble arriba: 24 electrones, igual que en los otros dos dibujos.» |
| B1 | «Cada globo es una región de electrones.» **Arma la forma donde los ángulos miden 120°.** | `n`: regiones de 2 a 6, todas enlaces | `n === 3` | «4 regiones: tetraédrica, 109,5° entre enlaces.» |
| B2 | «Cada carbono del eteno tiene tres regiones.» **Encuentra la molécula con dos enlaces pi.** | `k`: CH₄, C₂H₆, C₂H₄, CH₂O, CO₂ | `k === 'CO2'` | «C₂H₄: 5 sigma y 1 pi; cada C, sp².» |
| B3 | «Cada flecha es un enlace polar.» **Encuentra una molécula con enlaces polares que en total sea apolar.** | `k`: H₂O, NH₃, CO₂, BF₃, CH₄, CCl₄, CHCl₃, HCl (3D, con dipolos) | `BF₃`, `CO₂`, `CCl₄` (encuentra una) | «CO₂: lineal; las dos flechas se anulan.» |
| B4 | «Sube la temperatura hasta que las moléculas se separen.» **Haz hervir el metanol.** | `k` sustancia y `T` (de −180 a 120 °C, de 5 en 5, sin moverse solo) | `k === 'metanol' && T ≥ 65` | «Metanol a 70 °C: ya pasó su ebullición, 65 °C.» |

Ningún juego se mueve solo. En A1 el juego es solo de afuera (el foquito); la lupa llega en «Mira», después de predecir.
En A3 no hay ninguna molécula con triple enlace (el N₂ es la predicción); en A4 no hay dativos (son la predicción); en B1
no hay pares libres (el NH₃ es la predicción); en B2 no hay triple enlace (el etino es la predicción); en B3 no está el
CH₂Cl₂ (es la predicción).

---

## 6. La predicción de cada idea

La app baraja las opciones; los `datos` traen solo valores, nunca la regla. Lo que se pide va con «?» en tinta.

**A1.** «La sal sólida no prende el foquito; disuelta en agua, sí. ¿Qué hay dentro de un grano de sal?» Datos: sodio,
metal del grupo 1; cloro, no metal del grupo 17.

| Opción | Qué mide |
| --- | --- |
| Iones Na⁺ y Cl⁻ en filas, cada uno rodeado de los del otro | Correcta |
| Moléculas de NaCl: cada sodio unido a un cloro | EN1 (92 % en Kumpha y otros 2014; 39 % el «par iónico») |
| Átomos de sodio y cloro que comparten electrones | EN5 (clasificar al revés; Ünal y otros 2010) |
| Átomos neutros de sodio y cloro, mezclados | EN2 (la transferencia como el enlace; Coll y Treagust 2003) |

**A2.** «El magnesio forma Mg²⁺ y el nitrógeno, N³⁻. ¿Cuál es la fórmula del compuesto que forman?» Datos: las dos
cargas. Correcta: Mg₃N₂. Distractores: MgN («uno de cada»: QM-FORM-UNO, hipótesis), Mg₂N₃ (las cargas cruzadas al revés:
QM-FORM-INVERSA, hipótesis), MgN₂ (iguala electrones de un solo átomo: QM-FORM-MITAD, hipótesis). El juego no trae el
nitrógeno.

**A3.** «En el N₂ del aire, cada nitrógeno aporta 5 electrones de valencia. ¿Cómo quedan unidos?» Es la trampa de San
Marcos 2025-II n.º 93.

| Opción | Qué mide |
| --- | --- |
| Con un triple enlace y un par libre en cada N | Correcta |
| Con un doble enlace y dos pares libres en cada N | QM-N2-DOBLE (la trampa del solucionario) |
| Con un enlace simple y tres pares libres en cada N | QM-OCTETO-FALTA (no revisa el octeto; hipótesis) |
| No se unen: cada N ya tiene sus electrones completos | QM-SIN-ENLACE (hipótesis, vecina de TP2) |

**A4.** «El NH₃ del limpiador tiene un par libre en el N. Se le acerca un H⁺, que no trae electrones. ¿Cómo se unen?»
Correcta: el N pone los dos electrones del enlace (dativo). Distractores: «el H⁺ trae uno y el N otro» (QM-DATIVO-UNO,
hipótesis), «no se unen: el N ya tiene su octeto» (EN3), «el H⁺ le quita un electrón al N» (QM-DATIVO-QUITA, hipótesis).

**A5.** «En el ion NO₃⁻ se puede dibujar el doble enlace en cualquiera de sus tres oxígenos. ¿Cómo son los tres enlaces
N–O del ion real?» Se queda la de hoy: «iguales, de largo intermedio» (correcta), «uno corto y dos largos»
(QM-RES-UNO), «el doble salta de un O a otro» (EN6, 37,5 %), «tres dobles» (QM-RES-TODOS, nuevo). El juego es el CO₃²⁻.

**B1.** NH₃ (Karonen y otros 2021): «trigonal plana, como en el dibujo» (EN8, 51 % de error), «piramidal» (correcta),
«tetraédrica, porque hay 4 regiones» (QM-FORMA-DOMINIOS, hipótesis), «angular: el par libre la dobla» (EN9).

**B2.** «En el acetileno del soplete, H–C≡C–H, ¿qué hibridación tiene cada carbono?» Correcta: sp. Distractores: sp²
(la trampa 29 de San Marcos, ~12 veces), sp³ («cuatro enlaces», QM-HIB-ENLACES), sp³d («cuenta cinco enlaces con el
triple», QM-HIB-TRIPLE). Datos: cada C tiene un enlace simple con H y uno triple con el otro C.

**B3.** CH₂Cl₂ (EN10: 56 % antes y 71 % después elige «apolar: en el dibujo los Cl se anulan»): las cuatro opciones del
informe (EN10, EN11 «tetraédrica como el CH₄», correcta en 3D, EN11 «átomos distintos»).

**B4.** Se queda la de hoy (H₂O contra H₂S; EN14, EN16 y QM-GRUPO-EB), con la razón medida en la opción del O–H.

---

## 7. Tabla de letras y símbolos

| Símbolo | Un solo significado | Aviso |
| --- | --- | --- |
| Z | número atómico | Como en la rama |
| EN, ΔEN | electronegatividad (Pauling) y su diferencia, el mayor menos el menor | De Propiedades periódicas; «EN» no es «en» |
| δ+, δ− | carga parcial | Siempre con «δ»; la carga de un ion va sin δ (Na⁺) |
| e⁻ | electrón | — |
| — , =, ≡ | enlace simple, doble y triple (en las estructuras) | El «=» de una cuenta va con espacios; el doble enlace, pegado (O=C=O) |
| •• | par libre; • electrón de valencia (símbolo de Lewis) | — |
| → | flecha de dativo, del átomo que pone el par | En A4; en B, la flecha gruesa es el dipolo |
| [ ]⁺, [ ]⁻ | ion de un compuesto iónico en su Lewis | — |
| X, Q, R | elementos sin nombre de un problema | Nunca Y, W ni E (son elementos o la alternativa E), como en las unidades anteriores |
| A, X, E (en AXₙEₘ) | átomo central, átomos unidos, pares libres | Solo en B1 y B2: **«A» no es el número de masa ni la alternativa A**; va siempre como «AX₃E» o con su frase |
| σ, π | enlace sigma y pi | Solo en B2 |
| sp, sp², sp³ | hibridación | Superíndice de verdad |
| μ | dipolo (flecha) | Sin debye con cuentas; solo en B3 como flecha |
| T | temperatura, en °C | Solo en B4 |

---

## 8. Mapa de colores (un color fijo por magnitud en cada unidad, §5b)

**A. Enlace químico**

| Magnitud | Token | Por qué |
| --- | --- | --- |
| Z, los protones | `o` naranja | como en la rama |
| EN y ΔEN | `i` turquesa | en Propiedades periódicas era violeta, pero aquí el violeta es de los electrones, que es lo que más se cuenta |
| electrones (de valencia, pares, puntos, los que se ceden) | `f` violeta | como en Estructura atómica y Tabla periódica |
| carga (del ion, parcial δ, formal) | `h` carmín | como en Estructura atómica |
| tipos de enlace, fórmulas, símbolos | tinta | no son magnitudes |
| `d` verde | no se usa | naranja–verde 0,010 |

**B. Geometría molecular y fuerzas intermoleculares**

| Magnitud | Token |
| --- | --- |
| dipolo (flecha) | `o` naranja (lo dibujan así `quim-molecula` y `quim-molecula-3d`) |
| ángulo | `i` turquesa |
| pares libres, electrones | `f` violeta |
| carga parcial δ | `h` carmín |
| temperatura de ebullición (B4) | `h` carmín (no va junto a δ en ningún ejercicio de B4) — ver decisión 9 |
| EN, ΔEN | tinta (en B solo es un dato) |

Pares (molde §5b): naranja–turquesa 0,114; naranja–violeta 0,189; turquesa–violeta 0,101; violeta–carmín 0,167;
turquesa–carmín 0,077; naranja–carmín 0,062, el más justo: en B solo se ven juntos la flecha del dipolo y la δ, que
siempre llevan su forma (flecha con cruz) y su letra.

---

## 9. Práctica: qué existe y cómo se rehace por idea

Lo que hay: la escena `enlace` (borrador, con motor y 10 problemas de papel sin «Datos») y `quimica-conceptos` (temas
`hidruros` e `ionicos`).

| Unidad | Generador nuevo | Tipos por idea (`TIPOS_POR_IDEA`) |
| --- | --- | --- |
| A | **`enlace-lewis`** | A1: tipo por los elementos, por la ΔEN, por las propiedades, polar o apolar · A2: carga del ion, fórmula por cargas, electrones que se transfieren, propiedades V/F · A3: electrones de valencia totales (con carga), pares libres del central, enlaces múltiples, cuántos pares compartidos · A4: electrones alrededor del central, cuál es la excepción, dativos, radical · A5: estructuras de resonancia, orden de enlace promedio, cuál tiene resonancia |
| B | **`geometria-fuerzas`** | B1: forma por AXₙEₘ, regiones y pares libres, ángulo · B2: hibridación del central, sigma y pi, hibridación de cada carbono · B3: polar o apolar, cuál es polar de una lista · B4: fuerza entre moléculas, cuál hierve más, puente de hidrógeno sí o no |

Cada uno con `casos.json` (18 casos verificados aparte, sin usar el generador), `papel.json` y `plantilla.json`. La
escena `enlace` va a «Más mesas del tema» en las dos unidades (`"rehacer"`) y su papel se reparte con `"unidades"`.
Prueba del curso: un par nuevo por unidad a la reserva (qui-20 y qui-21): las formas ya tienen 10 pares.

---

## 10. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Electronegatividades de Pauling (Allred 1961), las mismas de Propiedades periódicas (y Xe 2,60, I 2,66 del motor) | Tabla del CRC, la misma fuente de la unidad anterior |
| Ángulos y formas por VSEPR (H₂O 104,5°, NH₃ 107°, CH₄ 109,5°, BF₃ 120°, CO₂ 180°) | OpenStax, *Chemistry 2e*, §7.6 |
| Puntos de ebullición a 1 atm (H₂O 100, H₂S −60, H₂Se −41, H₂Te −2, NH₃ −33, PH₃ −88, HF 20, HCl −85, CH₃OH 65, CH₄ −162, etanol 78, CH₃OCH₃ −24, Cl₂ −34, Br₂ 59, n-pentano 36, neopentano 10 °C) | CRC Handbook / NIST WebBook (los mismos de la teoría de hoy) |
| El agua hierve en Juliaca a unos 87 °C | Decisión de la etapa 2 («unos 87 °C», sin medición) |
| Sal de Maras, tiza, limpiador con amoníaco, acetileno del soplete, aire con N₂ y O₂ | Hechos de todos los días, sin cifra |
| El aire tiene unas 78 partes de N₂ y 21 de O₂ por cada 100 | Valor de libro («unas»), OpenStax §9 |
| Puntos de fusión de libro (NaCl unos 801 °C, azúcar se descompone, hielo 0 °C) | Valores de libro con «unos» |

---

## 11. Riesgos de orden con otras unidades (`requiere`)

- **A requiere `quimica.propiedades-periodicas`** (EN, ΔEN, par compartido; por su cadena, metal, no metal, electrones
  de valencia, catión y anión). **B requiere A.** Nomenclatura sigue pidiendo A (los iones y las fórmulas). **Hidrocarburos
  y Líquidos y sólidos pasan a pedir B** (hibridación del carbono y fuerzas entre moléculas): son dos líneas de su ficha
  en el catálogo de mi curso, sin tocar su teoría.
- **Palabras que ya existen en el curso**: «par compartido» (Propiedades periódicas), «electrones de valencia» y «símbolo
  de Lewis» (Tabla periódica), «catión», «anión», «ion» y «electrón desapareado» (Estructura atómica), «metal» y «no
  metal» (Tabla periódica), «red cristalina» (Líquidos y sólidos, después): aquí no se definen. «Red» se dice «red de
  iones» con su propio término y `glosarioSin: ['red cristalina']`, para no mandar al alumno a una unidad posterior.
- **«hibridación»** la define hoy Hidrocarburos, que viene después: se muda a B (estrena el término) y se borra de su
  glosario (una entrada, sin tocar nada más de esa unidad).
- **Lo que no puede aparecer aquí** porque llega después: nombres de compuestos (cloruro, óxido, hidróxido, sal
  oxisal…), estado de oxidación, mol, celda unitaria, aromático.
- **El avance.** Al partir, las ideas `forma-polaridad` y `fuerzas-intermoleculares`, las mesas `molecula-gira` y
  `dos-dipolos` y sus palabras pasan a la unidad nueva (`Avance.migrar`, partición `partidoEN`, bloque propio con su
  prueba). Las ideas que conservan el `id` con otra predicción (`tres-enlaces`, `lewis-octeto`, `forma-polaridad`)
  pierden una vez la predicción guardada sin huella (`prediccionEN`). Quien había terminado las cinco ideas de antes
  conserva «Ya la estudié» en las dos (`estudiadaEN`).

---

## 12. Decisiones tomadas (Gerson revisa después)

1. **La unidad se parte en dos: «Enlace químico» (5 ideas, conserva el `id`) y «Geometría molecular y fuerzas
   intermoleculares» (4 ideas, `quimica.geometria-molecular`).** Motivo: son nueve ideas que el examen pregunta por
   separado, y hay una costura natural (cómo se unen / qué forma y qué atracciones tiene lo que se forma), la de la UNI
   (semanas 5 y 6). Descartado: una sola unidad de 7 ideas con `septimaIdea`, que dejaba la hibridación dentro de la
   forma y la polaridad del enlace sin idea.
2. **La polaridad del enlace (ΔEN, δ+ y δ−) va dentro de A1, no en una idea propia.** Motivo: la ΔEN y el par que se
   corre ya los enseñó Propiedades periódicas (idea 4, con el δ del HCl en su «Mira»); aquí falta solo la escala de tres
   tipos. Descartado: una idea «Enlace polar y apolar», cuya predicción ya se había visto.
3. **Cortes de ΔEN como guía, con la tarjeta «Convención del examen»**: ≥ 1,7 suele ser iónico, < 1,7 covalente polar y
   0 (o muy chica) apolar; el HF (1,78) es covalente polar porque son dos no metales. Ningún ejercicio pide decidir con
   el corte de 0,4 (las academias no se ponen de acuerdo: unas dicen apolar solo con ΔEN = 0). La pregunta por el tipo
   se responde primero por la clase de elementos; la ΔEN confirma.
4. **El juego de A1 es el probador, sin lupa.** Motivo: el juego de hoy mostraba la red de la sal y después la
   preguntaba. Ahora el foquito da la pista (disuelta conduce) y la lupa llega en «Mira». Descartado: dejar la lupa con
   la sal escondida.
5. **Nada de nombres de compuestos ni funciones**: KBr, MgO, CaF₂ por su fórmula. Motivo: la nota de la sesión y que
   Nomenclatura es la unidad que sigue. «Sal de mesa» y «sal de Maras» quedan como palabras de todos los días.
6. **El octeto se estrena en A2 (con los iones)** y no en A3. Motivo: el ion que queda como el gas noble es el primer
   uso; A3 lo extiende a compartir.
7. **El dativo y las excepciones son idea propia (A4)**, con la especie impar como radical (San Marcos 2025-II n.º 96).
   Descartado: dejarlos en la condición de la regla de Lewis, como hoy (el BF₃ en «Lee»).
8. **B1 y B2 separadas**: la forma por regiones y la hibridación con sigma y pi. Motivo: la trampa más repetida del
   examen (sp² en el triple, ~12 veces) y la de sigma contra pi (~5) son de B2 y tienen su propia predicción.
9. **Colores**: en A, EN turquesa (en Propiedades periódicas era violeta) porque el violeta es de los electrones, lo que
   más se cuenta aquí. En B, dipolo naranja (las piezas lo dibujan así), ángulo turquesa, pares violeta, δ carmín; la
   temperatura de B4 en carmín porque ahí no hay δ. Descartado: ángulo carmín (chocaba con δ en el agua).
10. **Objetos de prueba** (sección 4), en una pieza nueva `quim-enlace`. Los globos de B1 son una analogía que «Lee»
    presenta con su límite (los globos no tienen carga).
11. **«hibridación» se muda de Hidrocarburos a B**, con `simple` y tres ejemplos. Descartado: definirla `local` en B y
    dejar la de Hidrocarburos, que el alumno vería después.
12. **Práctica: dos generadores nuevos, uno por unidad, con `TIPOS_POR_IDEA`** (`enlace-lewis` y `geometria-fuerzas`),
    como en la etapa 5. `quimica-conceptos` sigue como práctica extra de A (sus temas `hidruros` e `ionicos`).
13. **Títulos con el nombre del tema**; los `id` de siempre no cambian.
14. **No toco** `docs/datos/admision-unmsm.csv` (2019-II n.º 85 pasa a B; las de hibridación y London de orgánica pueden
    citar B) ni `docs/teoria/matriz/quimica.json`: son compartidos; quedan para quien integra.

### Decisiones tomadas al ejecutar (fases 2 a 5, 19 nov)

15. **La predicción de A4 cambió**: de «¿quién pone los electrones del enlace nuevo?» a «ya formado el NH₄⁺, ¿cómo son sus
    cuatro enlaces N–H?» (iguales). Motivo: el glosario de la idea (que se lee antes) define «enlace dativo» justo con la
    respuesta de la pregunta anterior; el validador lo marcó (`glosario-predice`). La pregunta de quién pone el par pasó a
    «Ahora tú». Descartado: dejar el dativo sin definir en el glosario.
16. **Probador agrandado × 1,3** y foquito encendido con halo, rayos y filamento grueso (nota de la sesión sobre la idea
    1); sin lupa de partículas junto al vaso, porque delataría la respuesta de Predice.
17. **Pares libres en violeta**: `quim-molecula` acepta ahora `color` en cada par (cambio mínimo y compatible: sin
    color, tinta como antes).
18. **El juego de A5 tiene misión de un solo valor** («deja sin carga al oxígeno de la izquierda»): la de la propuesta
    (llevar el doble a los tres oxígenos) necesitaba recordar estados y `logrado` solo ve el valor actual.
19. **El papel viejo de la escena `enlace`** perdió sus nombres de compuestos (H₃O⁺, CO₃²⁻, SF₄, NaCl por su fórmula) y
    cada problema dice su unidad. El p7 de `quimica-conceptos` (de esta unidad) ganó su `datos`.
20. **Prueba del curso**: qui-20 (electrones que pasan en un compuesto iónico) y qui-21 (regiones del central con octeto
    expandido) a la reserva, con su recálculo en `catalogo/pruebas/verificar.js`.
21. **Pendiente de herramienta compartida**: `herramientas/papel-generador.js` toma 8 semillas al azar y el papel de
    `enlace-lewis` salió con tres problemas de resonancia y ninguno de las ideas 2 y 3 (el mismo hallazgo B6 de la etapa 5:
    falta el papel por idea).
