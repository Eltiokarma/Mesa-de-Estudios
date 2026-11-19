# Propuesta: «Analogías» (`razonamiento-verbal.analogias`)

19 nov 2026 · Etapa 6 del plan de calidad · Segunda unidad de la rama «Palabras», después de Definiciones (calidad 2) y
antes de Sentido contextual. Encargo: `docs/metodo/unidad/etapa-delegada.md` (criterio delegado: nada espera el visto
bueno de Gerson; la última sección dice qué se decidió y qué se descartó). Formato y profundidad: `docs/etapa5/propuesta-verbal.md`.
Modelos de unidad terminada: `definiciones.js` y `tema-e-idea-principal.js`, con sus auditorías y sus lectores en frío.

Leído: CLAUDE.md, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1 a 3 y
`reglas-validador.md`), las decisiones de las etapas 2 a 5, `docs/teoria.md` (4e a 4j y §5), la teoría actual de
Analogías (v0.2.0), su ficha del catálogo, la matriz (`docs/teoria/matriz/razonamiento-verbal.json`), el temario, el
informe de códigos (RV15, RV16, RV17 y RV21), los seis ejercicios sueltos de analogía del banco de lectura (e001 a e003 y
e019 a e021), las 690 preguntas de verbal de San Marcos (`docs/datos/admision-unmsm.csv`), Definiciones entera (teoría,
prueba, generador, auditoría y lector en frío) y la teoría actual de Sentido contextual, para no adelantarle nada.

**Lo que pregunta la admisión, en corto.**
- **UNI.** «Analogías» es la semana 2 del sílabo CEPRE-UNI 2026-2 (así está en el catálogo). La pregunta da un par base
  en mayúsculas («CARPINTERO : SERRUCHO ::») y cinco pares, y pide el que guarda la misma relación. **El formato lo digo
  de memoria y de los manuales que conocemos: en el repo no hay ningún examen de verbal de la UNI (`fuentes/examenes`
  está vacío). Va como hipótesis de formato, igual que en Definiciones.**
- **San Marcos.** 1 de 690 preguntas es una analogía, y va dentro de la lectura: 2025-I, área A, pregunta 12, «analogía
  entre componentes de dos tipos de sistema circulatorio», clave C, con la trampa «par con un término de la misma red
  semántica pero otra relación» (RV17). Es el modelo de nivel de la idea 5 y de la práctica de examen; no se copia su
  texto (es de un autor) ni el de la academia que lo resolvió.
- **UNA Puno, UNSA y UNSAAC:** sin material.
- **Trampas que se repiten** (informe de verbal, con estudios de otra población: niños y adultos que no son
  postulantes): el par del mismo tema sin la relación (RV15, el error mejor respaldado: Sternberg y Nigro 1980; Johnson
  y otros 2025), el par al revés (RV16), otra relación del mismo campo (RV17) y, en antónimos, el contrario de otro
  rasgo (RV21). Las demás son hipótesis de esta unidad (RVA1 a RVA8, sección 10).

---

## 0. Diagnóstico de la teoría actual contra el contrato

1. **Faltan los campos del contrato:** sin `calidad: 2`, sin Ejemplos, sin `mision`, `leyenda`, `aprendizaje`,
   `actividad`, `pregunta` ni `lee`/`resuelve`; el glosario trae un ejemplo por término y ningún `simple`; ningún
   ejercicio trae `datos`.
2. **Punto 1: la primera pantalla es una tarjeta «Par base» sin soporte.** No se sabe quién escribe el par ni para qué.
3. **Punto 2: los juegos no tienen meta.** «Pon otro par en la oración puente y mira» describe el botón.
4. **Punto 5, colores.** La relación va en verde y lo que no se cumple en rojo carmín: verde y naranja juntos dan 0,011
   en protanopía (molde §5b) y el carmín es de ángulos. No es la paleta de lectura del curso.
5. **La correcta se delata.** En los 18 «Ahora tú» la correcta es **la única alternativa que no repite una palabra del
   par base** (base «pintor : pincel»; distractores «pintor : cuadro», «pincel : pintor», «pintor : museo»). Se elige
   sin leer.
6. **Orden de las ideas (punto 9).** La idea 1 ya enseña el par al revés («serrucho : carpintero, está al revés») y la
   predicción usa «mano : dedo», que es el tema de la idea 2.
7. **Parte y clase mezcladas.** La regla de la idea 2 junta clase y causa; parte y todo está escondida en la idea 1 y
   nunca se distingue de la clase ni del grupo (oveja : rebaño), que es justo lo que confunde en el examen.
8. **No hay nada con forma de examen:** ni la hoja con cinco alternativas, ni el caso en que dos pares pasan una oración
   puente vaga.
9. **La fuente de la historia no es la que dice:** el título es «Matriz de teoría…» y el enlace va al diccionario del CVC
   (la misma falla que se corrigió en Definiciones).
10. **Práctica:** solo seis ejercicios sueltos en `lectura-verbal` (tres de causa sin índice). Ninguno por idea.

Se queda: los tres `id` de idea (`relacion-no-tema`, `clase-y-causa`, `sinonimo-antonimo`), la oración puente como
herramienta central, los ejemplos del carpintero, el lunes que no produce el martes y «cansado» que no es lo contrario
de «alegre», y la mesa «El taller de la oración puente» (pasada a la paleta de lectura).

---

## 1. Las ideas en orden

Cinco. Los tres `id` de hoy se quedan, porque guardan el avance; dos son nuevos.

| # | id | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) | Por qué va ahí | Qué da por sabido |
| --- | --- | --- | --- | --- | --- |
| 1 | `relacion-no-tema` | **La relación, no el tema** | Un par es análogo si cumple la misma oración puente que el par base; hablar del mismo tema no basta. | Es la prueba que usan todas las demás. | Definiciones: clase y rasgo. |
| 2 | `parte-o-clase` (nueva) | **Clase o parte** | Si todo cóndor es un ave, el ave es su clase; si el pétalo es una pieza de la flor, es su parte. Muchos iguales forman un grupo. | Las tres relaciones de «estar dentro» son las que más se confunden. | Idea 1; Definiciones: clase (género próximo). |
| 3 | `clase-y-causa` | **El orden de la relación** | La relación tiene dirección: el par análogo va en el orden del par base, aunque ponga el efecto primero. Venir después no es ser efecto. | Recién aquí entra el par al revés (RV16). | Ideas 1 y 2. |
| 4 | `sinonimo-antonimo` | **Sinónimos y antónimos en un rasgo** | Los sinónimos dicen casi lo mismo de un rasgo y los antónimos lo opuesto del mismo rasgo; si una dice más, es intensidad. | Las relaciones entre palabras sueltas, fuera de una oración. | Ideas 1 y 3 (orden). |
| 5 | `puente-justa` (nueva) | **La oración puente justa** | Si dos pares cumplen la oración puente, es muy amplia: se le agrega un rasgo del par base, como el lugar o la clase de palabra. | Es la pregunta de examen entera, y usa la medida de Definiciones (muy amplia, justa). | Todas. |

`pregunta` de cada idea (Resumen): 1. «¿Basta que dos pares hablen de lo mismo?» · 2. «¿El dedo es un tipo de mano o una
parte de ella?» · 3. «¿Da lo mismo «humo : fuego» que «fuego : humo»?» · 4. «¿«Cansado» es lo contrario de «alegre»?» ·
5. «¿Qué hago si dos pares cumplen mi oración puente?».

`actividad` (≤ 16 palabras): 1. «Tachar en una hoja de simulacro los pares que no cumplen la oración puente.» · 2. «Ponerle
a cada par del cuaderno de Mateo su oración puente: tipo o parte.» · 3. «Dar vuelta las fichas que quedaron al revés y
tachar la que no es de causa.» · 4. «Ponerle a cada par del cuaderno de Rosa su relación con «alegre».» · 5. «Armar la
oración puente de un par base hasta que deje pasar un solo par.»

**Límites con las unidades vecinas.**
- **Definiciones** (antes) enseñó clase, rasgo, muy amplia, muy estrecha, necesario y suficiente. Aquí se usan para
  **nombrar la relación**: la oración puente es la definición de la relación del par base (su clase, «trabaja con»; su
  rasgo, «como herramienta»), y es muy amplia si deja pasar a dos pares. «Clase» se usa con el sentido de Definiciones
  (género próximo); por eso la clase de palabra se dice «categoría gramatical».
- **Sentido contextual** (después) se queda con la acepción que elige la oración, los sinónimos y antónimos **en
  contexto**, la connotación, la precisión léxica y lo que se infiere de pistas. Aquí las palabras van sueltas, con su
  sentido más común; ningún par depende de una oración que elija el sentido, y no se nombran «acepción», «polisemia»,
  «connotación» ni «precisión».

---

## 2. La primera pantalla de cada idea

En verbal el objeto reconocible es el texto en su soporte, con quién lo escribe y para quién (contrato, punto 1).

| Idea | Soporte (pieza) | Quién lo escribe y para quién |
| --- | --- | --- |
| 1 | Hoja de simulacro, pregunta 7: «CARPINTERO : SERRUCHO ::», cinco pares A–E y, debajo, la tarjeta «Oración puente: «El carpintero trabaja con el serrucho como herramienta».» (`rv-soporte`, simulacro con `frase`) | La academia, para el postulante |
| 2 | Cuaderno de Mateo, «Tarea: ¿tipo o parte?», con cinco pares y la oración puente que les puso (`rv-soporte`, cuaderno) | Mateo, para la práctica de Comunicación |
| 3 | Mural de la feria de ciencias, «Causas y efectos», con la ficha base «SISMO : DERRUMBE» y cinco fichas que el viento desordenó (`rv-soporte`, mural con `frase`) | 3.º B, para los visitantes |
| 4 | Cuaderno de Rosa, «Palabras para «alegre»», con cuatro pares (`rv-soporte`, cuaderno) | Rosa, para la práctica de Comunicación |
| 5 | Hoja de simulacro, pregunta 41: «MINERO : MINA ::»; debajo, la ficha de la oración puente (clase y rasgo, como en Definiciones) y la tabla de los cinco pares (`rv-definicion`) | La academia, para el postulante |

Las hojas, cuadernos y murales son inventados; ningún texto cita un examen. La hoja dice «Simulacro», nunca «UNI».

---

## 3. La misión de «Juega» y lo que hay que construir

Cada misión cabe en 16 palabras, la comprueba el código con `logrado(val)` y no está cumplida al abrir. En las cinco,
**una sola combinación de toda la grilla la cumple** (prueba propia). Todos los juegos se juegan **tocando la hoja**
(`data-toque`, Gerson, 17 nov): tocar un par lo tacha o le cambia la oración puente; los botones siguen debajo.

| Idea | Controles (toque) | Misión | `logrado` | Lectura en vivo (≤ 12 palabras) |
| --- | --- | --- | --- | --- |
| 1 | `a` a `e`: dejar · tachar, uno por par | «Toca en la hoja los pares que no cumplen la oración puente, hasta dejar uno.» | tachados los cuatro que no son persona y herramienta de su oficio | «Taller: es el lugar donde trabaja, no su herramienta» · «Queda cirujano : bisturí: cumple la oración puente» |
| 2 | `p1` a `p5`: ¿? · es un tipo de · es una parte de | «Ponle a cada par la oración puente que lo hace verdadero.» | las cinco bien | «La 2: el pétalo no es una flor» · «Justo: tres tipos y dos partes» |
| 3 | `f1` a `f5`: así · al revés · tachada | «Pon cada ficha en el orden del par base y tacha la que no es de causa.» | cuatro en su orden y el lunes tachado | «El moretón no produce el golpe: está al revés» · «El lunes no produce el martes: solo viene antes» |
| 4 | `w1` a `w4`: ¿? · sinónimos · antónimos · otro rasgo | «Ponle a cada par su relación: sinónimos, antónimos u otro rasgo.» | las cuatro bien | «Cansado habla de la energía, no del ánimo» |
| 5 | `g`: clase («tiene que ver con» · «trabaja en»); `r`: rasgo «que es un lugar» (sí · no), en la ficha | «Arma la oración puente que deje pasar a un solo par de la hoja.» | «trabaja en» y el rasgo | «Muy amplia: pasan 2 pares» · «Justa: pasa solo profesor : colegio» |

**Regla 1 en verbal:** lo que se cumple, se cuela o queda fuera lo calcula el código con un mundo chico (cada par con
sus rasgos: si es persona, si el segundo es su herramienta, su lugar o su obra; si el primero es un tipo o una pieza del
segundo; qué produce a qué; de qué rasgo habla cada palabra y hacia qué lado; si el segundo es un lugar y si el primero
trabaja ahí).

**Piezas.** No hace falta ninguna nueva: `rv-soporte` (simulacro, cuaderno y mural, con `toques`, `tachar`, `marcas` y
la tarjeta `frase` para la oración puente) y `rv-definicion` (la ficha de la idea 5). La mesa del taller sigue en
`rv-texto`, pasada a la paleta de lectura.

---

## 4. La predicción de cada idea

Opciones sin justificación; dos incorrectas de una misma predicción nunca comparten código; la correcta no es la más
larga ni la más corta; ninguna repite la trampa que el juego ya mostró. Con letras en la hoja, `orden: 'fijo'`.

| Idea | Pregunta | Correcta | Incorrectas (código) | Qué trae de nuevo |
| --- | --- | --- | --- | --- |
| 1 | Par base «PESCADOR : RED», sin oración puente escrita | tejedora : telar | tejedora : chompa (RV17, su obra) · trucha : lago (RV15, del tema) · cliente : mesa (RVA5, «usa», pero no como herramienta de un oficio) | La oración puente la arma el alumno; aparece la oración vaga («usa»). |
| 2 | Par base «ÁRBOL : BOSQUE» | oveja : rebaño | pino : árbol (RVA2, clase) · rama : árbol (RVA6, parte) · leñador : bosque (RV15) | El grupo de iguales: no es clase ni parte, y el juego solo tenía esas dos. |
| 3 | Par base «HUMO : FUEGO» | barro : lluvia | lluvia : barro (RV16) · noche : día (RVA1) · humo : chimenea (RV15) | El par base pone **el efecto primero**: manda su orden, no «la causa primero». |
| 4 | Par base «TIBIO : CALIENTE» | llovizna : aguacero | frío : caliente (RVA3, opuestos) · aguacero : llovizna (RV16) · agua caliente : ducha (RV15) | La intensidad: el mismo rasgo, de menos a más. El juego solo tenía sinónimos, antónimos y otro rasgo. |
| 5 | Par base «CANTANTE : CANTAR» | pescador : pescar | bailarín : baile (RVA4, otra categoría gramatical) · correr : corredor (RV16) · guitarrista : guitarra (RV17) | La categoría gramatical: el que hace el baile pasa una oración vaga, pero «baile» no es una acción. |

`datos` de Predice: solo glosas de palabras poco comunes (telar), nunca la relación que se predice.

---

## 5. Qué es «dato» en esta unidad y qué no se da

**Entra en `datos`** (una línea por dato, ≤ 22 palabras): el criterio de la idea y las glosas.

| Idea | Líneas (las mismas en teoría y práctica) |
| --- | --- |
| 1 | «Oración puente: frase corta que dice cómo se une el par base; vale también para el otro par.» · «Agente e instrumento: una persona y la herramienta con que hace su trabajo.» · «Mismo tema no basta: …» · los nombres de cada falla que el resuelto use («otra relación», «sin persona», «oración muy amplia») |
| 2 | «Clase: todo lo que nombra la primera palabra es lo que nombra la segunda.» · «Parte: la primera es una pieza que, con otras distintas, forma la segunda.» · «Grupo: la segunda nombra muchos iguales a la primera, juntos.» (desde «Mira») |
| 3 | «Causa y efecto: una cosa produce la otra.» · «Mismo orden: …» · «Sucesión: una cosa viene después de otra sin que la primera la produzca.» |
| 4 | «Sinónimos: dicen casi lo mismo del mismo rasgo.» · «Antónimos: dicen lo opuesto del mismo rasgo.» · «Otro rasgo: …» · «Intensidad: …» |
| 5 | «Oración puente justa: vale para el par base y para un solo par.» · «Muy amplia: deja pasar a más de un par.» · «Categoría gramatical: sustantivo, verbo o adjetivo.» |

Cada falla que nombra un resuelto está en sus Datos (`completar`, como en Definiciones; lección M8 de su auditoría).

**No se da:** la relación del par base que se pregunta, la oración puente ya escrita (salvo en el juego y en «Así se
resuelve» de la idea 1, donde es el objeto que se aprende a usar), atajos («descarta los que repiten una palabra», «la
correcta es la de otro tema») ni consejos.

---

## 6. Colores y símbolos

### Paleta de lectura (papel fijo en todo verbal)

| Papel en esta unidad | Token | Trazo | Cuándo se ve |
| --- | --- | --- | --- |
| El par base, su oración puente y lo que la cumple (evidencia) | `i` turquesa | continuo | Juego, «Mira», solución |
| El par que se prueba o se descarta, con su motivo (distractor) | `o` naranja | a trazos | Juego y resuelto |
| El par que guarda la relación, la oración justa y la respuesta | `f` violeta | punteado | Con la misión cumplida, en «revelar», en el último paso y en la respuesta |
| Lo tachado o descartado | gris (tenue) y raya de tinta | — | Siempre |

- Sin verde ni carmín (prueba propia). La letra de una alternativa en negrita: naranja si se descarta, violeta si es la
  correcta.
- Antes de responder, ninguna figura trae marcas ni colores (la tarjeta de la oración puente solo aparece en el juego,
  en «Mira» y en la solución, porque su borde siempre lleva color).

### Símbolos (en lugar de la tabla de letras: la unidad no usa letras de fórmula)

| Símbolo | Qué es | Leyenda (≤ 8 palabras) |
| --- | --- | --- |
| `:` | entre las dos palabras de un par | «se relaciona con» |
| `::` | después del par base | «así como»: une el par base con otro |
| MAYÚSCULAS | el par base | «el par base, el que manda» |
| A–E | las alternativas de la hoja | «los cinco pares de la hoja» |
| tachado | lo descartado | «par que descartaste» |

Ninguna oración puente usa «A» y «B» como variables: chocarían con las letras de las alternativas. Se dice «el
primero» y «el segundo».

---

## 7. Ejemplos resueltos (15 por idea)

**Forma.** Figura: el soporte sin marcas (cuaderno, mural, mensaje, hoja de simulacro). Nivel 1: decir la relación de un
par con su oración puente, o si un par la cumple. Nivel 2: elegir entre tres pares de una lista, con dos fallas
distintas. Nivel 3: hoja de simulacro con el par base y cinco alternativas A–E; en cada idea las correctas son A, B,
C, D y E una vez (25 en la unidad, cinco de cada letra). Solución de 1 a 4 líneas: lo que cumple en turquesa, lo que se
descarta en naranja, la respuesta en violeta; cada alternativa incorrecta se nombra con su letra en negrita y su motivo.

**Lo que se mide en cada hoja y lista** (prueba propia y script aparte): la correcta no es la más larga ni la más corta;
no es la única escrita dentro de otra; no es la única que no repite palabras del par base; ninguna alternativa de una
hoja de examen repite una palabra del par base; la correcta cambia de letra.

**Cómo se recalcula en verbal** (lo que en física son las cuentas): un script aparte
(`<SCRATCH>/e6-rv/revisa.js`), con un léxico propio escrito sin mirar la unidad, da a cada par su relación (agente e
instrumento, lugar, obra, material, clase, parte, grupo, causa con su sentido, sucesión, sinónimo, antónimo, intensidad,
otro rasgo, categoría de cada palabra). Con eso comprueba, alternativa por alternativa, que **solo una** cumple la
relación del par base en su orden y con su categoría, que cada distractor falla por el motivo que dice su explicación, y
las medidas de arriba.

---

## 8. Práctica: qué existe y qué falta; datos del mundo

**Qué existe:** `lectura-verbal` trae e001 a e003 y e019 a e021 (analogías con paso previo de relación). Pasa a «Más
mesas del tema» con `rehacer` (cambio mínimo en `plantillas/lectura-verbal/plantilla.json`, archivo compartido).

**Qué falta:** generador propio `plantillas/analogias/` (formato «predicciones», como `definiciones`), dos tipos por idea
(`TIPOS_POR_IDEA`), cuatro alternativas en el de nivel 2 y cinco en el de examen, con un banco de pares con su mundo
chico. El generador elige como correcta la única alternativa con la misma relación, el mismo sentido y la misma
categoría que el par base, y arma la explicación de cada incorrecta con lo que su relación tiene de distinto; si el banco
no cuadra, lanza un error. `casos.json` calculado con un léxico aparte; `papel.json` de 8 problemas con
`herramientas/papel-generador.js`.

**Datos del mundo:** ninguno con cifra. Los pares usan saberes de todos los días (el telar sirve para tejer, el huaico
baja después de lluvias intensas, la vicuña es silvestre). La historia (Aristóteles, *Poética*, XXI) va con su fuente
corregida. **Prueba del curso:** verbal no tiene banco en `catalogo/pruebas/` (su entrada y salida son los textos t000a y
t000b), así que no se agregan ítems, igual que en Definiciones.

---

## 9. Riesgos de orden (`requiere`)

- `requiere: ['razonamiento-verbal.definiciones']` se queda: la unidad usa clase, rasgo, género próximo y «muy amplia».
- Dentro de la unidad: ninguna idea antes de la 3 tiene un par al revés; ninguna antes de la 4 compara sinónimos,
  antónimos o grados; la categoría gramatical recién aparece en la idea 5.
- Sentido contextual pide Definiciones, no Analogías; usa «sinónimo» y «antónimo», que siguen definidos aquí.
- El catálogo suma tres temas: «Elemento y conjunto» (idea 2), «Intensidad» (idea 4) y «Rasgos de la relación» (idea 5).
- `grado: 3` es solo informativo; propongo `grado: 5` al cerrar, como en Razones trigonométricas.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas, con dos nuevas (`parte-o-clase` y `puente-justa`) y los tres `id` de hoy conservados.** Motivo: la
   unidad de hoy mezclaba clase con causa y nunca separaba parte, clase y grupo; no tenía nada con forma de examen.
   Descartado: seis ideas (una para agente e instrumento y otra para el orden de cualquier relación), que repetían el
   mismo juego.
2. **`clase-y-causa` pasa a «El orden de la relación»** (causa y efecto y el par al revés); el género y especie se muda a
   la idea 2. Motivo: el `id` guarda el avance y el juego viejo ya era sobre la dirección. Descartado: un `id` nuevo.
3. **El formato UNI va como hipótesis** (como en Definiciones): no hay examen de verbal de la UNI en el repo. La única
   analogía de San Marcos (2025-I, A, 12) es el modelo de nivel de la trampa RV17; no se copia su texto.
4. **El par al revés recién en la idea 3.** Motivo: punto 9 (la idea 1 de hoy lo usaba antes de enseñarlo).
   Descartado: dejarlo como distractor desde la idea 1.
5. **El grupo de iguales (oveja : rebaño) entra en la idea 2 como lo nuevo de la predicción**, y su término del
   glosario va sin `simple` (no sale en «Palabras de esta idea» antes de jugar). Motivo: es la confusión más frecuente
   con parte y todo. Descartado: dejarlo fuera porque no estaba en el catálogo (se agrega el tema).
6. **La intensidad (tibio : caliente) entra en la idea 4 como lo nuevo de la predicción**, también sin `simple`.
   Descartado: tratarla como sinonimia.
7. **«Categoría gramatical» y no «clase de palabra»**, para no chocar con la «clase» de Definiciones (género próximo).
8. **Códigos nuevos RVA1 a RVA8, como hipótesis** (en el informe y en `codigos.json`; `herramientas/codigos-verbal.js`
   lee ahora también las filas RVA, cambio mínimo en archivo compartido): RVA1 sucesión tomada por causa; RVA2 se lee
   «es un tipo de» donde es parte o grupo; RVA3 un grado tomado por el opuesto; RVA4 otra categoría gramatical; RVA5
   oración puente muy amplia («usa», «tiene que ver»); RVA6 se lee «es una pieza de» donde es clase o grupo; RVA7 se lee
   «es uno del grupo» donde es clase o parte; RVA8 el par tiene la herramienta, pero no a la persona que la usa. Motivo:
   cada incorrecta con un código distinto en cada pregunta. Descartado: repetir RV17 para todo lo que es «otra relación».
9. **Ninguna alternativa de una hoja de examen repite una palabra del par base**, y la correcta nunca es la única que
   no la repite en el juego. Motivo: diagnóstico 5.
10. **El taller de la oración puente se queda como mesa**, pasado a la paleta de lectura; las mesas viejas «En los dos
    sentidos» y «Sinónimos y antónimos» salen (repetían los juegos de hoy con verde y carmín) y entran las mesas de los
    juegos nuevos de las ideas 2 a 5.
11. **La historia sigue siendo la de Aristóteles (*Poética*, XXI: «la vejez es a la vida lo que la tarde al día»)**,
    con la fuente que cita la matriz (Internet Classics Archive, MIT). No se pudo abrir en esta sesión (la red la
    rechaza); el pasaje es conocido y la cita está en la matriz.
12. **Práctica propia `plantillas/analogias/`** y `lectura-verbal` a «Más mesas del tema» (`rehacer`) para esta unidad.

---

## 11. Fase 2 a 5 (19 nov): lo que cambió al escribir

La unidad quedó escrita entera (`contenido/teoria/razonamiento-verbal/analogias.js`, versión 0.3.0, **sin** `calidad: 2`)
con su prueba propia (`analogias.test.js`) y su práctica (`plantillas/analogias/`).

**Las cinco ideas, en una línea cada una (título · objeto · misión · predicción):**
1. La relación, no el tema · hoja de simulacro «CARPINTERO : SERRUCHO» con la tarjeta de su oración puente · tachar los
   pares que no la cumplen (taller, mesa, madera, árbol) hasta dejar «cirujano : bisturí» · «PESCADOR : RED», sin la
   oración escrita: «tejedora : telar» (RV17 la chompa, RV15 trucha y lago, RVA5 el cliente que usa la mesa).
2. Clase o parte · cuaderno de Mateo con cinco pares · ponerle a cada uno «es un tipo de» o «es una parte de» ·
   «ÁRBOL : BOSQUE»: «abeja : enjambre» (el grupo, que el juego no tenía).
3. El orden de la relación · mural de la feria de 3.º B con la ficha base «SISMO : DERRUMBE» · dar vuelta las fichas al
   revés y tachar «lunes : martes» · «HUMO : FUEGO»: «barro : lluvia» (manda el orden del par base, efecto primero).
4. Sinónimos y antónimos en un rasgo · cuaderno de Rosa con cuatro palabras junto a «alegre» · ponerle a cada par su
   relación (sinónimos, antónimos u otro rasgo) · «TIBIO : CALIENTE»: «llovizna : aguacero» (la intensidad).
5. La oración puente justa · hoja «MINERO : MINA» con la ficha de su oración puente (clase y rasgo) y la tabla de cinco
   pares · armar la oración que deja pasar un solo par («trabaja en» + «que es un lugar») · «CANTANTE : CANTAR»:
   «pescador : pescar» (la categoría gramatical: «bailarín : baile» pasa una oración vaga).

**Cambios respecto del guion (decisiones nuevas, Gerson revisa después):**
13. **El par base no se marca en turquesa.** La pieza mide mal las mayúsculas (el kit cuenta todas las letras como
    minúsculas) y la raya quedaba corta bajo «CARPINTERO : SERRUCHO ::». Se usa el recuadro de tinta del número (`senal`)
    en «Mira» y la tarjeta de la oración puente lleva el turquesa. Descartado: tocar `nucleo/kit/trazo.js` (compartido).
14. **La leyenda del juego de la idea 1 quedó en cinco líneas** (nota de la sesión): sin «A–E» ni el naranja, que repetía
    lo de «tachado».
15. **Las voces de Predice, Mira y La regla son propias** (la voz por defecto decía «lo comprobamos en el texto», y en
    analogías no hay texto): «después lo comprobamos con la oración puente», «volvamos a la hoja, par por par».
16. **La ecuación de la regla de la idea 1 es «puente = clase + rasgo»** (nota de la sesión: «oración puente =» se partía
    a 390 px).
17. **Mesas del laboratorio:** el taller (convertido a la paleta de lectura; va con la idea 1, aunque junta seis relaciones), el cuaderno de
    Mateo, las fichas de la feria, las palabras de Rosa y la ficha de la oración puente. Salen «En los dos sentidos» y
    «Sinónimos y antónimos».
18. **Práctica:** `plantillas/analogias/` con 10 tipos (2 por idea; nivel 2 con cuatro alternativas y nivel 3 con cinco),
    un banco de 30 ítems con la relación de cada par (mundo chico) y 4 incorrectas de código distinto por ítem; 8
    problemas de papel. `lectura-verbal` pasa a «Más mesas del tema» con `rehacer`.
19. **El glosario de causa y efecto y de sucesión no usa pares de la idea** (se cambiaron dos ejemplos que nombraban
    distractores de «Así se resuelve»).

**Lo que se comprobó aparte:** `<SCRATCH>/e6-rv/revisa.js` (léxico propio de unos 400 pares) revisa 105 preguntas con
alternativas de la teoría: una sola correcta, cada distractor con el motivo que dice su explicación, la correcta ni la
más larga ni la más corta ni la única dentro de otra ni la única sin palabras del par base: 0 fallas.
`<SCRATCH>/e6-rv/casos-gen.js` (otro léxico, para el banco de la práctica) arma `casos.json` y revisa los 30 ítems: 0
fallas.
