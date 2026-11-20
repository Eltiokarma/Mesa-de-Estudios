# Propuesta: «Conectores lógico-textuales» (`razonamiento-verbal.conectores`)

19 nov 2026 · Etapa 8 del plan de calidad · Primera unidad de la rama «Oraciones y orden», después de la rama
«Palabras» (Definiciones, Analogías y Sentido contextual, las tres con `calidad: 2`) y de Tema e idea principal.
Encargo: `docs/metodo/unidad/etapa-delegada.md` (criterio delegado: nada espera el visto bueno de Gerson; la última
sección dice qué se decidió y qué se descartó). Formato y profundidad: `docs/etapa7/propuesta-verbal.md`. Modelo de
unidad terminada: `sentido-contextual.js`, con su auditoría (`rutinas/auditoria/razonamiento-verbal.sentido-contextual.md`)
y su lector en frío; lo que ahí se corrigió está en la sección 9, para no repetirlo.

Leído: CLAUDE.md, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1 a 3 y
`reglas-validador.md`), las decisiones de las etapas 2 a 7, `docs/teoria.md` (4e a 4j y §5), la teoría actual de la
unidad (v0.2.0), su ficha del catálogo, la matriz (`docs/teoria/matriz/razonamiento-verbal.json`, unidad 4), el temario
(`docs/temario-completo.md`, §4 de verbal), el informe de códigos (RV23 a RV26 y RV35), los tres ejercicios sueltos de
conectores del formato lectura (e007 a e009), las preguntas de San Marcos (`docs/datos/admision-unmsm.csv`), Sentido
contextual entera (teoría, prueba, generador, auditoría y lector en frío), el glosario de todo el curso y las tres
unidades que siguen en la rama (Cohesión y coherencia, Plan de redacción y Eliminación de oraciones), para no
adelantarlas.

**Lo que pregunta la admisión, en corto.**
- **San Marcos: ninguna pregunta.** De 690 preguntas de verbal (2019-I a 2027-I), ninguna es de conectores: «Verbal es
  solo lectura» (`docs/clasificacion-unmsm-admision.md`, punto 5). La unidad no tiene modelo de San Marcos.
- **UNI.** El catálogo pone la unidad en la semana 5 del sílabo CEPRE-UNI 2026-2. En el repo no hay examen de verbal de
  la UNI (`fuentes/examenes/` está vacío). El formato que se usa, **un texto corto con uno, dos o tres espacios y cinco
  alternativas con un conector por espacio** («A) por eso – en cambio»), va **como hipótesis**, igual que en
  Definiciones, Analogías y Sentido contextual. Es el modelo de los ejemplos de nivel 3, de «Así se resuelve» y del tipo
  de examen de la práctica.
- **Errores con respaldo** (informe del curso): RV24 (lo contracausal leído como causal; Zunino 2016, McClure y
  Steffensen 1980: *because* < *and* < *but* < *even though*), RV25 (concesivos del registro escrito; Cain y Nash 2011,
  Zufferey y Gygax 2020) y RV23 (se completa por coherencia local); RV26 y RV35 son hipótesis. Los nuevos RVC1 a RVC6
  son hipótesis (sección 8).

---

## 0. Diagnóstico de la teoría actual (v0.2.0) contra el contrato

1. **Faltan los campos del contrato:** sin `calidad`, sin Ejemplos, sin `mision`, `leyenda`, `aprendizaje`,
   `actividad`, `pregunta`, `lee` ni `resuelve`; el glosario trae un ejemplo por término y ningún `simple`; ningún
   ejercicio trae `datos`.
2. **Punto 1: la primera pantalla es una tarjeta «Las dos ideas» sin soporte** (pieza `rv-texto`): no se sabe quién
   escribe ni para quién.
3. **Punto 2: los juegos no tienen meta.** «Cambia el resultado del examen y prueba conectores» describe los botones.
4. **Punto 5, colores.** La relación va en verde (`d`) y lo que no encaja en carmín (`h`): verde y naranja juntos dan
   0,011 en protanopía, y el carmín es de ángulos. No es la paleta de lectura del curso.
5. **La correcta se delata.** En la idea 2 las opciones traen la clase escrita («Contraste: pero», «Orden: luego»):
   basta leer la clase. En las tres ideas la correcta suele ser la más corta o la más larga.
6. **El orden adelanta:** la idea 1 usa «causa» y «consecuencia» y la 3 «concesión» sin presentarlas; la dirección de la
   causa («porque» contra «por eso»), que es el error más estudiado, no tiene idea propia.
7. **Lo previo delata:** el glosario de «contraste» trae de ejemplo «Llovió toda la noche; aun así, el partido se jugó»,
   que es la predicción de la idea 1 con otras palabras.
8. **No hay nada con forma de examen** (un texto con varios espacios y alternativas de varios conectores).
9. **La fuente de la historia no es la que dice:** el título es «Matriz de teoría…» y el enlace va al diccionario del
   CVC (la misma falla de Definiciones, Analogías y Sentido contextual). La matriz cita al Instituto Cervantes.
10. **Práctica:** solo `lectura-verbal` (tres ejercicios sueltos, e007 a e009), sin ningún ejercicio por idea.

Se queda: los tres `id` de idea (`relacion-primero`, `clases`, `locuciones`), el estudiar y aprobar o desaprobar (ahora
en las notas del mural), la quinua (ahora en un folleto con su receta), la lluvia que no impidió algo (ahora en la feria)
y la historia de los marcadores del discurso.

---

## 1. Las ideas en orden

Cinco. Los tres `id` de hoy se quedan (guardan el avance); dos son nuevos.

| # | id | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) | Por qué va ahí | Qué da por sabido |
| --- | --- | --- | --- | --- | --- |
| 1 | `relacion-primero` | **Primero la relación, después el conector** | Antes del conector se nombra la relación: si la segunda idea cumple lo esperado, resultado; si lo rompe, contraste; si suma otra cosa, adición. | Es la prueba que usan todas las demás: lo que la primera idea hace esperar. | Leer una oración y decir de qué trata. |
| 2 | `causa-consecuencia` (nueva) | **Causa o consecuencia: el orden** | «Porque» va delante de la causa y «por eso», delante de la consecuencia; si se cambia el orden de las ideas, cambia el conector. | El resultado de la idea 1, visto desde los dos lados; es el error más estudiado (RV24). | Idea 1. |
| 3 | `clases` | **Cada espacio pide una clase** | Los conectores se agrupan en clases por la relación que marcan; también hay ejemplificación, reformulación, orden en el tiempo y cierre. | Con la relación ya nombrada, el resto de las clases que pide el examen. | Ideas 1 y 2. |
| 4 | `locuciones` | **Varias palabras, un conector** | Una locución conjuntiva funciona como un conector y se clasifica igual; la concesión, como «aunque», va delante del obstáculo que no impidió lo dicho. | Las formas escritas largas (RV25) y dónde va «aunque». | Ideas 1 a 3. |
| 5 | `varios-espacios` (nueva) | **Varios espacios, una alternativa** | En un texto con varios espacios, cada uno pide su relación; se descarta toda alternativa que falle en uno, y sirve la que cumple en todos. | La forma del examen: todo lo anterior, espacio por espacio. | Todas. |

`pregunta` de cada idea (Resumen): 1. «¿Por qué «sin embargo» va en una nota y «por eso» en otra?» · 2. «¿«Porque» y
«por eso» dicen lo mismo?» · 3. «¿Cómo sé qué clase de conector pide un espacio?» · 4. «¿Por qué «si bien» puede
reemplazar a «aunque»?» · 5. «¿Basta con que una alternativa sirva en el primer espacio?».

`actividad` (≤ 16 palabras): 1. «Poner en tres notas del mural el conector que une cada par de ideas.» · 2. «Poner
«porque», «por eso» o «pero» en el comunicado según qué idea es la razón.» · 3. «Completar el folleto de la quinua con un
conector de la clase que pide cada espacio.» · 4. «Poner en el periódico mural la locución que une cada par de ideas.» ·
5. «Tachar en una hoja de simulacro las alternativas que fallan en algún espacio.»

**Límites con las unidades vecinas.**
- **Sentido contextual** (antes) dejó aquí «el hueco que se llena por el conector» (RV23). Aquí el espacio es siempre el
  del conector, o el de la idea que el conector anuncia (idea 1). La unidad no usa «pista» ni «contexto» (términos de
  Sentido contextual con otro sentido): dice «lo que decide» y «lo esperado».
- **Cohesión y coherencia** (sigue) estrena «cohesión», «coherencia», «referente» y los pronombres. Aquí no se nombran:
  el conector une dos ideas y eso basta.
- **Plan de redacción** (después) estrena «marcador de tiempo» y el orden de varias oraciones. Aquí el orden en el tiempo
  es solo una clase de conector entre dos oraciones («después»), sin ordenar un texto.
- **Eliminación de oraciones** (después): nada de redundancia ni impertinencia.
- **Inferencias** (Comprensión de lectura) estrena «conclusión». Aquí la clase se llama **cierre** («en resumen»).

---

## 2. La primera pantalla de cada idea

| Idea | Soporte (pieza `rv-soporte`) | Quién lo escribe y para quién |
| --- | --- | --- |
| 1 | Mural del colegio, «Notas del simulacro»: Ana estudió toda la semana y el examen le pareció fácil; Luis estudió toda la semana y le pareció difícil; para el próximo simulacro, trae tu DNI y dos lápices | 5.º B, para todo el colegio |
| 2 | Puerta de la municipalidad de Ilave, «Comunicado»: el río creció y por eso cerraron el puente; lo cerraron porque el agua podía llevarse las tablas; estará cerrado, pero la feria va | la municipalidad, para los vecinos |
| 3 | Folleto de la feria de Cabana, «Quinua graneada»: muchas formas de prepararla (un caso), la saponina (otras palabras), lavar y después hervir (otro paso) | la cooperativa de Cabana, para los visitantes |
| 4 | Periódico mural de 5.º A, «La feria del sábado»: si bien llovió, la feria se hizo en la plaza; dado que llovió, los puestos se pasaron al coliseo; llovió, de modo que la plaza amaneció con charcos | el equipo de prensa, para todo el colegio |
| 5 | Hoja de simulacro, pregunta 20: la sequía, la papa y la quinua, con dos espacios y cinco alternativas | el examen, para el postulante |

El espacio del conector es **«¿…?», en negrita y en tinta** (el único hueco de la unidad, lección B1 de Sentido
contextual); en un texto con varios espacios, «¿…? (1)», «¿…? (2)». Se toca dentro de su renglón con las oraciones en
trozos de `rv-soporte` (bloque de la etapa 7, sin cambios en la pieza).

---

## 3. La misión de «Juega»

Cada misión cabe en 16 palabras, la comprueba el código y no está cumplida al abrir; **una sola combinación de toda la
grilla la cumple** (prueba propia). Los cinco juegos se juegan **tocando el soporte** (`toques`, Gerson, 17 nov); los
botones siguen debajo y numeran igual que la figura.

| Idea | Controles (toque) | Misión | Se cumple con | Lectura en vivo (≤ 12 palabras) |
| --- | --- | --- | --- | --- |
| 1 | `n1` a `n3`: ¿…? · por eso · sin embargo · además | «Pon en cada nota el conector que marca cómo se une la segunda idea.» | por eso, sin embargo, además | «Por eso»: marca resultado; la nota 2 rompe lo esperado |
| 2 | `o1` a `o3`: ¿…? · porque · por eso · pero | «Pon en cada oración del comunicado el conector que dice qué lleva a qué.» | por eso, porque, pero | «Porque»: diría que cerrar el puente hizo crecer el río |
| 3 | `o1` a `o3`: ¿…? · por ejemplo · es decir · después | «Pon en cada espacio del folleto un conector de la clase que pide.» | por ejemplo, es decir, después | «Es decir»: repetiría lo mismo; la oración 1 da un caso |
| 4 | `o1` a `o3`: ¿…? · si bien · dado que · de modo que | «Pon en cada oración la locución que marca cómo se unen sus dos ideas.» | si bien, dado que, de modo que | «Dado que» = porque; la lluvia no explica la plaza |
| 5 | `a` a `e` (las alternativas): ¿…? · sirve · no sirve | «Tacha las alternativas que fallan en algún espacio y marca la que sirve en los dos.» | B sirve; A, C, D y E no | C: «además» falla en el espacio 2 |

**Regla 1 en verbal:** qué relación pide cada espacio y qué relación marca cada conector lo calcula el código con un
mundo chico (cada espacio con la relación que pide; cada conector con la que marca; una alternativa de varios espacios
sirve si sirve en todos).

---

## 4. La predicción de cada idea

Opciones sin justificación; dos incorrectas de una misma predicción nunca comparten código; la correcta no es la más
larga ni la más corta; ninguna repite lo que el juego ya mostró. Sin letras en la figura (la app baraja).

| Idea | Pregunta | Correcta | Incorrectas (código) | Qué trae de nuevo |
| --- | --- | --- | --- | --- |
| 1 | «La cosecha de papa fue abundante; sin embargo, ¿…?». ¿Qué parte completa la nota? | los precios subieron | los precios bajaron (RV23) · también hubo muchas habas (RV26) · se recogió mucha papa (RV35) | Al revés: el conector ya está y anuncia lo que viene. |
| 2 | «El colegio se quedó sin luz; por eso suspendieron las clases». ¿Qué oración dice lo mismo? | Suspendieron las clases porque el colegio se quedó sin luz | … sin luz porque suspendieron las clases (RVC1) · …, pero suspendieron (RVC2) · … y además suspendieron (RVC5) | Pasar de «por eso» a «porque» cambiando el orden. |
| 3 | El folleto cierra con «¿…?, la quinua se cocina de muchas formas y es fácil de preparar». ¿Qué conector va? | en resumen | por ejemplo (RV35) · sin embargo (RVC2) · por eso (RVC6) | La clase de cierre: el juego tenía caso, otras palabras y otro paso. |
| 4 | «Rosa tenía fiebre; aun así, fue al colegio». ¿Qué oración con «aunque» dice lo mismo? | Aunque tenía fiebre, Rosa fue al colegio | Aunque fue al colegio, Rosa tenía fiebre (RVC3) · Como tenía fiebre, … (RV24) · … y además fue (RV26) | Dónde va «aunque»: el juego solo cambiaba la locución. |
| 5 | Otra hoja con tres espacios. ¿Qué alternativa completa los tres? | en cambio – además – porque | en cambio – además – por eso (RVC4) · por eso – además – porque (RV24) · en cambio – es decir – porque (RV35) | Tres espacios, y una trampa que sirve en dos. |

`datos` de Predice: ninguno; nunca la relación que se predice.

---

## 5. Qué es «dato» en esta unidad y qué no se da

**Entra en `datos`** (una línea por dato, ≤ 22 palabras): **la definición de cada relación entre las que se elige, con
sus conectores entre paréntesis** («Contraste: la segunda idea rompe lo que la primera hacía esperar (pero, sin
embargo, aun así)»). Es la tabla entre la que se elige (contrato, punto 13: «si el ejercicio practica elegir, van las
fórmulas entre las que se elige»): el alumno decide la relación, que es lo que la unidad enseña, y no memoriza la lista.

| Idea | Líneas (las mismas en teoría y práctica) |
| --- | --- |
| 1 | Lo esperado · Adición · Contraste · Resultado |
| 2 | Causa · Consecuencia · El orden («A; por eso B» dice lo mismo que «B porque A»), y las de la idea 1 que usa el caso |
| 3 | Ejemplificación · Reformulación · Orden en el tiempo · Cierre · Clase de conector, y las de las ideas 1 y 2 que usa |
| 4 | Locución conjuntiva · Concesión · Causa y Consecuencia con sus locuciones |
| 5 | Varios espacios · y las relaciones que piden sus espacios |

**No se da:** la relación que pide el espacio, qué alternativa cumple en un espacio, atajos («descarta la más larga»,
«la correcta lleva coma») ni consejos. En los niveles 2 y 3, «Así se resuelve» y «Ahora tú», **ningún nombre de trampa**
(lección M1 de Sentido contextual): las trampas («al revés», «solo un espacio») las explica el resuelto en su línea.

---

## 6. Colores y símbolos

### Paleta de lectura (papel fijo en todo verbal)

| Papel en esta unidad | Token | Trazo | Cuándo se ve |
| --- | --- | --- | --- |
| Lo que decide la relación (la parte que cumple, rompe o suma; la razón) | `i` turquesa | continuo | Juego, «Mira», «Así se resuelve» y solución |
| El conector que se prueba y marca otra relación, con su motivo (distractor) | `o` naranja | a trazos | Juego, «Mira» y resuelto |
| El conector que marca la relación, y la respuesta | `f` violeta | punteado | Con la misión cumplida, en «revelar», en el último paso y en la respuesta |
| Lo descartado | gris (tenue) y raya de tinta | — | Siempre |
| El espacio «¿…?» o el conector por el que se pregunta | negrita, en tinta | — | Siempre (no es una marca: no delata nada) |

- Sin verde ni carmín (prueba propia). La letra de una alternativa en negrita: naranja si se descarta, violeta si es la
  correcta.
- Antes de responder, ninguna figura trae colores ni marcas.

### Símbolos

La unidad no usa letras de fórmula (`letras: {}`). En los textos con varios espacios, el número del espacio va entre
paréntesis junto al hueco: «¿…? (1)».

---

## 7. Ejemplos resueltos (15 por idea)

**Forma.** Figura: el texto en su soporte (mensaje, aviso, cartel, mural, comunicado), sin marcas, con el espacio o el
conector en negrita. Nivel 1: una pregunta de un paso (qué relación marca un conector, si la segunda idea cumple o rompe
lo esperado, si un conector sirve). Nivel 2: elegir entre tres conectores o tres finales de una lista (el lugar de la
correcta repartido en la unidad: 9, 8 y 8). Nivel 3: hoja de simulacro con un texto de dos o tres oraciones y cinco
alternativas A–E (formato UNI como hipótesis); en cada idea las correctas son A, B, C, D y E una vez. Solución de 1 a 4
líneas: lo que decide en turquesa, el conector que falla en naranja, la respuesta en violeta; cada alternativa
incorrecta nombrada con su letra en negrita y su motivo.

**Cómo se recalcula en verbal:** un script aparte (`<SCRATCH>/rev/revisa.js`) con un léxico propio, escrito sin mirar
las etiquetas de la unidad: para cada conector, la relación que marca; para cada espacio, la relación que pide, escrita
leyendo el texto que extrae `extrae.js`. Con eso comprueba, alternativa por alternativa, que **solo una** cumple en todos
los espacios, que cada explicación nombra la relación que su conector marca de verdad, que la correcta no es la más
larga ni la más corta ni la única escrita dentro de otra, y que la letra y el lugar se reparten.

---

## 8. Práctica, códigos y datos del mundo

**Qué existe:** `lectura-verbal` (e007 a e009: un conector en una oración, y uno con dos espacios). Pasa a «Más mesas
del tema» con `rehacer` (cambio mínimo en `plantillas/lectura-verbal/plantilla.json`, compartido).

**Qué falta:** generador propio `plantillas/conectores/` (formato «predicciones», como `sentido-contextual`), dos tipos
por idea (`TIPOS_POR_IDEA`): el de nivel 2 con cuatro alternativas y el de examen con cinco. Un banco de textos, cada uno
con la relación que pide cada espacio y cada alternativa con su conector; el generador busca en una tabla propia la
relación que marca cada conector, elige como correcta la única que cumple en todos los espacios y arma el código y la
explicación de cada incorrecta. Si el banco no cuadra, lanza un error. `casos.json` calculado con un léxico aparte;
`papel.json` de 8 problemas con `herramientas/papel-generador.js`.

**Códigos nuevos, como hipótesis** (informe del curso, sección «Conectores (códigos RVC, etapa 8)»; la herramienta
`codigos-verbal.js` lee ahora también las filas RVC, cambio mínimo en archivo compartido):

| Código | Error |
| --- | --- |
| RVC1 | La causa y la consecuencia al revés: «porque» delante del resultado o «por eso» delante de la razón |
| RVC2 | Se marca un contraste donde nada se opone: la segunda idea cumple lo esperado o solo suma |
| RVC3 | «Aunque» delante de lo que pasó igual y no del obstáculo: cambia lo que se afirma |
| RVC4 | Se elige la alternativa por un solo espacio, sin probar los demás |
| RVC5 | Se suma («además») donde la segunda idea sale de la primera: su resultado, su razón, su caso o su resumen |
| RVC6 | Se lee causa o consecuencia donde las ideas solo se suman, se repiten o se siguen en el tiempo |

Se usan junto con RV23, RV24, RV25, RV26 y RV35. Dos incorrectas de una misma pregunta nunca comparten código.

**Datos del mundo:** uno, la saponina (la capa amarga del grano de quinua, que se quita lavándolo), que es de libro y va
sin cifra. Los textos son propios y de todos los días (Puno, Ilave, Juliaca, Cabana, una posta, una feria). La historia
(los marcadores del discurso; Portolés 1998, Martín Zorraquino y Portolés 1999) va con la fuente que cita la matriz
(Instituto Cervantes, Diccionario de términos clave de ELE).

**Prueba del curso:** verbal no tiene banco en `catalogo/pruebas/` (su entrada y salida son los textos t000a y t000b):
no se agregan ítems, igual que en Definiciones, Analogías y Sentido contextual. **Prueba propia de la unidad:**
`contenido/teoria/razonamiento-verbal/conectores.test.js`.

---

## 9. Lo que se corrigió en Sentido contextual y aquí se evita desde el principio

- **Datos sin nombres de trampas** en los niveles 2 y 3, «Así se resuelve» y «Ahora tú» (M1).
- **Una palabra clave del curso no se usa con otro sentido** (M3): fuera «pista» y «contexto» en todo texto de esta
  unidad (son términos de Sentido contextual).
- **La explicación dice el motivo real** (M4): cada distractor se explica con la relación que su conector marca, y esa
  relación la comprueba el script aparte.
- **Una sola respuesta** (M5): ningún final ambiguo. Fuera los casos donde una causa al revés es creíble («vende más
  barato porque tiene mucha cola») o donde «además» o «sin embargo» se pueden defender.
- **El cuaderno de Mira** sin numerar junta la oración y las palabras (M7), y ninguna oración termina en «:», «;» o «,».
- **El turquesa es siempre lo que decide** (M8), y lo que el resuelto pinta en turquesa es lo que la figura marca (M9).
- **Un solo hueco, «¿…?»**, y ningún botón inicial dice «vacío» (B1).
- **El lugar de la correcta también se reparte en «Así se resuelve»** (B4): las 20 hojas van con A, B, C, D y E cuatro
  veces cada una.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas: los tres `id` de hoy y dos nuevas (`causa-consecuencia` y `varios-espacios`).** Motivo: la dirección
   de la causa es el error con más respaldo de la unidad (RV24) y el texto con varios espacios es la forma del examen.
   Descartado: una idea propia para la concesión (seis ideas): va en la idea de las locuciones, porque «si bien», «aun
   cuando» y «a pesar de que» son casi todas concesivas.
2. **La idea 1 dice «resultado» y no «consecuencia».** La idea 2 presenta causa y consecuencia juntas, con su dirección;
   así cada idea estrena sus palabras. Descartado: nombrar la consecuencia en la idea 1 (el glosario la asignaría ahí y
   la idea 2 quedaría sin qué estrenar).
3. **Datos con la definición de cada relación y sus conectores entre paréntesis.** Es la tabla entre la que se elige: el
   alumno decide la relación. Descartado: sin la lista (premia la memoria, contra el contrato) y con la relación de cada
   espacio (es el paso hecho).
4. **Códigos nuevos RVC1 a RVC6, como hipótesis**, en el informe y en `codigos.json`. Descartado: forzar RV24 y RV35
   para todo (dos incorrectas de una misma pregunta compartirían código).
5. **«Cierre» y no «conclusión»** para «en resumen»: «conclusión» la estrena Inferencias con otro sentido (lo que se
   afirma a partir de premisas).
6. **El formato UNI va como hipótesis** (texto con espacios y alternativas de varios conectores). San Marcos no pregunta
   conectores.
7. **El espacio «¿…?» va en negrita y en tinta** en todas las figuras, también antes de responder; en varios espacios,
   «¿…? (1)».
8. **Las mesas viejas cambian de dibujo** y conservan su `id` (`relacion`, `tablero`, `locuciones`): las de los juegos
   nuevos, con sus retos; entran `comunicado` y `simulacro`.
9. **Práctica propia `plantillas/conectores/`**, y `lectura-verbal` a «Más mesas del tema» (`rehacer`) para esta unidad.
10. **El avance:** las tres ideas que conservan su `id` cambian de Predice, y la unidad suma dos: entra en `REHECHAS_E6`
    de `nucleo/avance.js` (marcas `prediccionCN` y `estudiadaCN`, con su prueba).
11. **`requiere` se queda vacío.** La unidad no usa términos de Sentido contextual ni de Analogías. Descartado: pedir
    Sentido contextual (cerraría la unidad a quien empieza la rama «Oraciones y orden»).

---

## 11. Fases 2 a 5 (19 nov): lo que cambió al escribir

La unidad quedó escrita entera (`contenido/teoria/razonamiento-verbal/conectores.js`, versión 0.3.0, **sin**
`calidad: 2`) con su prueba propia (`conectores.test.js`, 57 pruebas) y su práctica (`plantillas/conectores/`).

**Las cinco ideas, en una línea cada una (título · objeto · misión · predicción):**
1. Primero la relación, después el conector · mural del colegio, «Notas del simulacro» · poner en cada nota el conector
   (por eso, sin embargo, además) · «Mateo practicó el baile todos los días; sin embargo, ¿…?»: «se equivocó en varios pasos».
2. Causa o consecuencia: el orden · comunicado en la puerta de la municipalidad de Lampa · poner en cada oración el conector
   que dice qué lleva a qué (por eso, porque, pero) · «sin luz; por eso suspendieron»: «Suspendieron las clases porque…».
3. Cada espacio pide una clase · folleto de la feria de la quinua de Cabana · un conector de la clase que pide cada espacio
   (por ejemplo, es decir, después) · el cierre del folleto: «en resumen».
4. Varias palabras, un conector · periódico mural de 5.º A, la feria con lluvia · la locución de cada oración (si bien,
   dado que, de modo que) · «Rosa tenía fiebre; aun así, fue»: «Aunque tenía fiebre, Rosa fue al colegio».
5. Varios espacios, una alternativa · hoja de simulacro con dos espacios · tachar las que fallan y marcar la que sirve
   (B) · tres espacios: «en cambio – además – porque».

**Cambios respecto del guion (decisiones nuevas, Gerson revisa después):**
12. **Notas de la sesión sobre la idea 1** (aplicadas): la predicción ya no depende de saber economía (la cosecha y los
    precios): «Mateo practicó el baile todos los días; sin embargo, ¿…?», donde lo esperado lo ve cualquiera; Ilave pasa a
    Lampa en toda la unidad (en esta letra la I mayúscula se lee «llave»); la ecuación de la regla nombra las tres
    relaciones con su conector de muestra; lo que avisa el conector pasa al texto de la regla, y el «Vale si» queda como
    condición («las dos ideas hablan de lo mismo, y la segunda se mide con lo que hace esperar la primera»); la consigna
    dice «en turquesa, la segunda idea de cada nota: decide qué conector va».
13. **En los textos con varios espacios, la correcta no es la «central».** Al armar las alternativas cambiando un espacio
    por vez alrededor de la correcta, la correcta era la que más se repetía en cada lugar (la detectó `probarFugas` en
    la práctica: 79 a 83 %). Ahora cada pregunta lleva una que falla solo en el último espacio (RVC4), otra que falla
    solo en el primero y otras que fallan en los dos, de modo que en algún lugar el conector más repetido no es el de
    la correcta. Prueba propia en la teoría y `probarFugas` en la práctica.
14. **Código de una alternativa de varios espacios:** RVC4 si falla solo en el último; si no, el de la relación del
    primer espacio en que falla.
15. **«Pero», «sin embargo», «aun así», «no obstante» y «en cambio» van todos como contraste**, y «aunque», «si bien»,
    «aun cuando» y «a pesar de que» como concesión (van delante del obstáculo). La práctica no pide distinguir «en cambio»
    de «sin embargo».
16. **Práctica:** `plantillas/conectores/` con 10 tipos (2 por idea), un banco de 30 textos; el examen (cinco
    alternativas) usa solo los ítems con cuatro incorrectas de código distinto (contraste, adición y reformulación quedan
    en el nivel 2, porque no tienen cuatro errores distintos sin una alternativa que también pueda servir).
17. **Mesas:** `relacion`, `tablero` y `locuciones` conservan su id con los juegos nuevos; entran `comunicado` y
    `simulacro`.

**Lo que se comprobó aparte:** `<SCRATCH>/rev/revisa.js` (léxico propio, `<SCRATCH>/rev/lexico.js`: la relación de cada
conector y lo que pide cada espacio, escrito leyendo el listado de los textos) revisa las 105 preguntas con alternativas
de la teoría (5 predicciones, 30 «Ahora tú», 20 «Así se resuelve», 25 hojas de nivel 3 y 25 listas de nivel 2): una sola
cumple en todos los espacios y es la que marca la unidad; cada explicación de un «Ahora tú» o una predicción nombra la
relación que marca su conector (o el espacio en que falla); en los resueltos de varios espacios, cada letra con el espacio
en que falla; la correcta ni la más larga ni la más corta ni escrita dentro de otra. Resultado final: 0 fallas (en la
primera pasada, 9 explicaciones que no nombraban la relación, 4 correctas en un extremo de largo y una letra con el espacio
equivocado). Letras: nivel 3, A–E una vez por idea; «Así se resuelve», cada letra cuatro veces; listas de nivel 2, 9, 8 y
8. `<SCRATCH>/gen/casos-gen.js` (el mismo léxico y lo que pide cada texto del banco leído aparte) arma `casos.json` (20).
