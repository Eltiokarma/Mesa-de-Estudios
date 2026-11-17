# Propuesta: «Tema central e idea principal» (`razonamiento-verbal.tema-e-idea-principal`)

17 nov 2026 · Etapa 2 del plan de calidad · Para Gerson. Formato: `docs/metodo/unidad/1-ideas.md` §A. No hay código: nada
se escribe hasta tu visto bueno.

Leído: CLAUDE.md (regla 5), `docs/plan-calidad.md` §3, `docs/molde-unidad.md` (§11 fila de verbal), `docs/formato-lectura.md`,
`docs/teoria.md` 4e–4h, la teoría actual, el catálogo, `plantillas/lectura-verbal/`, los 21 textos del banco que preguntan
por esta unidad (miré a fondo t001, t014, t018 y t028), el informe de códigos RV y las 58 preguntas de San Marcos de tema
central, idea principal, título, resumen y propósito (`docs/datos/admision-unmsm.csv`).

**Lo que dice la admisión, en corto.** San Marcos pregunta **tema central** mucho más que idea principal: 47 en español y
16 en inglés, contra 6 y 14. De los 47 de tema central, 27 son de texto con gráfico (texto mixto) y 18 de textos A/B. El
título sale casi solo en inglés (6). El resumen (4) es de `resumen-y-sintesis` y el propósito (15) de `inferencias`: no
los meto aquí, solo los nombro en la idea 4 para que el alumno distinga qué pide cada pregunta. Las trampas que anotó la
clasificación se repiten casi en cada examen:
- un subtema o un dato del gráfico;
- un tema demasiado general;
- el contexto o la persona del comienzo tomados como tema;
- un tema que agrega aspectos que el texto no trata, o una propuesta cuando el texto solo describe;
- palabras absolutas («únicamente»);
- en texto con gráfico o en A/B, cubrir solo una de las dos partes.

---

## 0. Diagnóstico de la teoría actual contra el contrato

1. **Faltan los campos del contrato.** Sin `calidad: 2`, sin Lee, sin Así se resuelve, sin pestaña de Ejemplos, sin
   `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`. El glosario no trae `simple` ni 3 ejemplos (puntos 2, 3, 11 y 12).
2. **Punto 1: la primera pantalla es una lista numerada de oraciones**, sin soporte ni situación: no se sabe quién
   escribe, para quién ni dónde aparece ese texto. El juego 1 ofrece «Propuesta A, B, C, D»: el alumno no ve qué es A
   hasta tocarla (punto 2: la consigna explica botones).
3. **Punto 6: hay jerga sin presentar.** «Propuesta», «cubre», «Cubre 3 de 4», «dato aparte», «proposición», «enlace»;
   «cubrir» es la metáfora central y nadie la explica.
4. **Punto 5, colores.**
   - «Lo que queda fuera» se pinta en carmín, que en §5b es el color de los ángulos.
   - En la idea 1, el verde (tema) va junto al naranja (propuesta): con protanopía esa pareja da 0,011, es decir, el
     mismo color.
   - El verde significa «tema» en la idea 1 y «principal» en la idea 2.
5. **La lección central choca con el examen.** La idea 1 enseña que «La biblioteca del barrio» es el tema porque «cubre
   todo y no afirma nada». En San Marcos esa alternativa es la trampa de «demasiado general». La respuesta buena de tema
   central es una frase precisa: «El efecto del nuevo horario de la biblioteca en sus visitas».
6. **Códigos mal puestos.**
   - «El reciclaje», que solo nombra el tema, lleva RV2 (demasiado general).
   - En «Predice» de la idea 2 y en «Ahora tú» hay dos incorrectas con el mismo código (RV1, RV1; RV2, RV2; RV42, RV42).
   - RVM1 y RVM2 no existen en el informe ni en `codigos.json`.
7. **«Ahora tú» nunca llega a nivel de examen**: textos de 3 oraciones con la idea casi siempre en la primera. No hay
   ninguna pregunta de tema central ni ningún texto con gráfico.
8. **La predicción de la idea 2 se delata sola.** La correcta («La oración principal y las palabras clave de sus
   razones») es la más larga y la única que se justifica. Además, la pregunta es un consejo de estudio, no algo del texto.
9. **La idea 3 (mapa conceptual) no se pregunta en la admisión** (0 de 690 en San Marcos). Ningún ejercicio trae `datos`
   (punto 13). El orden y el `requiere: []` están bien.

---

## 1. Las ideas en orden

Son cuatro. Los ids `tema-e-idea` y `jerarquia` se quedan, porque guardan el avance de los alumnos. Hay dos ids nuevos:
`tema` y `alternativas`. Sobre `mapa-conceptual` hay una pregunta abajo (9.1).

| # | id | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) | Por qué va ahí | Qué da por sabido |
| --- | --- | --- | --- | --- | --- |
| 1 | `tema` (nueva) | **El tema y su medida** | El tema dice de qué trata todo el texto: si deja fuera una parte, es muy estrecho; si sirve para otro texto, muy amplio. | Es lo que más pregunta San Marcos (63 de tema central contra 20 de idea principal) y la idea principal se arma sobre el tema. | Leer un texto corto. Nada de la unidad. |
| 2 | `tema-e-idea` | **Lo que el texto afirma** | La idea principal es el tema más lo que el texto entero afirma de él; a veces no está escrita en una sola oración. | Necesita el tema (idea 1). Es la pregunta de los 19 textos de práctica del banco. | El tema y su medida. |
| 3 | `jerarquia` | **Principal y secundarias** | Las secundarias le dan a la principal un porqué, un cómo o un ejemplo; la principal puede ir en cualquier lugar, no siempre primero. | Necesita «idea principal» (2). Da el método para hallarla en un texto largo, ataca RV4 y trae el subrayado. | Idea principal. |
| 4 | `alternativas` (nueva) | **Elegir en el examen** | Tema central y título piden una frase; idea principal, una oración. La buena cubre el texto y el gráfico sin agregar nada. | Junta las tres con la forma del examen: 5 alternativas, cada una con su error, y texto con gráfico (27 de los 47 de tema central). | Las ideas 1, 2 y 3. |

`pregunta` de cada idea, para el Resumen:
1. «¿Cómo se dice de qué trata un texto?»
2. «¿Qué le falta al tema para ser la idea principal?»
3. «¿Cómo se sabe qué oración manda en un texto?»
4. «¿Cómo se descarta una alternativa de tema central?»

`actividad` de cada idea (≤ 16 palabras):
1. «Vas a subir y bajar por una escalera de temas, de lo general a lo particular.»
2. «Vas a completar una frase sobre la totora y ver cuántas oraciones cubre.»
3. «Vas a subrayar una oración y tachar otra en una hoja de estudio.»
4. «Vas a tachar alternativas en una pregunta de simulacro hasta dejar una.»

---

## 2. La primera pantalla de cada idea

**Qué es el «objeto reconocible» en verbal.** Propongo que sea **el texto en su soporte y con su situación**: un aviso
clavado en el mural de corcho del colegio, un folleto del muelle, una hoja de cuaderno con resaltador y lápiz, una hoja
de simulacro. El alumno reconoce el papel antes de leer y sabe quién escribe y para quién. El marco se dibuja como objeto
de prueba (`data-prueba`); ver la pieza V2 en el punto 3. Todos los textos son propios y cortos (regla 5).

### Idea 1 · El tema y su medida

**Soporte:** el mural de corcho del colegio con dos avisos clavados con chinches. El que se estudia va grande; el «otro
aviso» va al lado en pantalla ancha y debajo en el celular (punto 4: lo que se compara se ve junto).

> **Aviso 1.**
> ① Desde el lunes, el comedor servirá el desayuno a las 7:15, antes de la primera hora.
> ② Así, quienes viajan desde Caracoto o Cabana ya no entrarán a clase sin comer.
> ③ Esa semana, los profesores de primera hora darán cinco minutos de tolerancia.
> ④ La dirección pide a los padres avisar si su hijo no tomará el desayuno.
>
> **Aviso 2.** ① El quiosco del patio venderá fruta picada y emoliente en el recreo. ② Cada porción costará un sol.

**Escalera de temas**, de lo general a lo particular:
1. La vida escolar
2. La comida en el colegio
3. **El nuevo horario del desayuno**
4. El desayuno de los que viajan desde lejos
5. La hora del desayuno: 7:15

**Consigna** (≤ 25): «En el mural del colegio hay dos avisos. Busca el tema del primero: el que dice de qué trata todo,
y solo eso.»

**Lee** (2 tarjetas): «Todo texto habla de algo: eso es su tema»; «Un tema se dice en una frase corta, como el título de
una carpeta». No dice nada de la medida: eso lo descubre el juego.

### Idea 2 · Lo que el texto afirma

**Soporte:** un folleto doblado en tres que se reparte en el muelle de Puno, con el dibujo de una balsa de totora (objeto
de prueba nuevo).

> ① Los uros del lago Titicaca usan la totora para casi todo.
> ② Con ella levantan las islas donde viven, capa sobre capa.
> ③ También hacen sus casas y sus balsas.
> ④ La parte blanca del tallo, el chullo, se come.
> ⑤ Por eso, cuando el lago baja y la totora se seca, la vida en las islas se complica.

Debajo va la tarjeta **«Tu idea»**: [La totora, para los uros,] + [ hueco ].

**Consigna:** «Este folleto se reparte en el muelle de Puno. Ya tienes el tema; falta lo que el texto dice de él.»

**Lee** (2 tarjetas): «Nombrar no es decir: “la totora” nombra; “la totora flota” dice algo»; «Lo que dice algo se puede
creer o negar».

### Idea 3 · Principal y secundarias

**Soporte:** una hoja de cuaderno cuadriculado con el texto copiado a mano, y al lado un resaltador y un lápiz (objetos de
prueba; son también las herramientas del juego).

> ① Las casas de adobe del altiplano están hechas para guardar el calor.
> ② El adobe absorbe el sol de día y lo suelta de noche.
> ③ Sus ventanas son chicas, y así se escapa menos calor.
> ④ Por ejemplo, en una casa de adobe de Ilave, la noche se siente menos fría que afuera.
> ⑤ En la costa, muchas casas antiguas también son de adobe.

**Consigna:** «Vas a estudiar este texto para un examen. Con el resaltador y el lápiz, deja a la vista solo lo que importa.»

**Lee** (2 tarjetas): «En un equipo hay uno que manda y otros que lo ayudan: en un texto, también»; «Subrayar todo es como
no subrayar nada».

### Idea 4 · Elegir en el examen

**Soporte:** una hoja de simulacro, con el encabezado «Simulacro · Razonamiento verbal», el número de pregunta y las
casillas A a E. Es un texto mixto: texto y gráfico.

> ① En las zonas altas de Puno, las heladas llegan cada año entre mayo y agosto.
> ② Muchas familias crían alpacas, y las crías son las primeras en enfermarse con el frío.
> ③ Por eso, algunas comunidades construyen cobertizos: techos bajos donde las crías pasan la noche.
> ④ El gráfico compara una comunidad antes y después de tener cobertizos.
>
> *Gráfico de barras* (pieza `rv-barras`): «Crías muertas por el frío en un año». Sin cobertizo: 40. Con cobertizo: 12.
> Nota: «Datos inventados para el ejercicio.» No se nombra una comunidad real.
>
> **¿Cuál es el tema central del texto?**
> - El uso de cobertizos para proteger del frío a las crías de alpaca
> - Las heladas en las zonas altas de Puno
> - La crianza de camélidos en los Andes
> - Las 40 crías que murieron sin cobertizo
> - Los cobertizos como única defensa contra todas las heladas

**Consigna:** «Así se ve una pregunta de simulacro con texto y gráfico. Cada alternativa equivocada falla por algo.»

**Lee** (2 tarjetas):
- Las palabras de la pregunta: «tema central», «el texto gira en torno a», «de qué da cuenta» y «título» piden una frase;
  «idea principal» y «tesis» piden una oración. Esto es vocabulario, no la regla de descarte.
- «En un texto mixto, el gráfico también es texto.»

---

## 3. La misión de «Juega» y lo que hay que construir

Cada misión cabe en 16 palabras o menos, el motor la comprueba con `logrado(val)` y no está cumplida al abrir. La lectura
en vivo (≤ 12 palabras) dice la relación del caso actual, no un número suelto.

| Idea | Controles (gesto) | Misión | `logrado` | Lectura en vivo (ejemplos) |
| --- | --- | --- | --- | --- |
| 1 | `n`: peldaño 1–5 (− / +, o arrastrar el marcador por la escalera) | «Mueve la escalera hasta el tema que cubra las 4 oraciones y no el otro aviso.» | `val.n === 3` | 1: «Cubre los dos avisos y cualquier otro: muy amplio.» · 2: «Cubre los dos avisos: muy amplio.» · 3: «Cubre las 4 y no el otro aviso: justo.» · 4: «Cubre 2 de 4: muy estrecho.» · 5: «Cubre 1 de 4: muy estrecho.» |
| 2 | `a`: lo que afirma: (nada) · se come · sirve para hacer islas, casas y balsas · es la base de su vida en el lago · se vende a los turistas | «Elige lo que el texto afirma de la totora hasta cubrir las 5 oraciones.» | `val.a === 'base'` | (nada): «Solo nombra el tema: todavía no dice nada.» · se come: «Cubre 1 de 5: es un detalle.» · islas…: «Cubre 3 de 5: falta el chullo y el riesgo.» · base: «Cubre las 5: tema más lo que afirma.» · turistas: «No cubre ninguna: el texto no dice eso.» |
| 3 | Herramienta [resaltador · lápiz] + tocar la oración. `s`: subrayada (1–5); `t`: tachada (ninguna, 1–5) | «Subraya la oración principal y tacha la que no la sostiene.» | `val.s === 1 && val.t === 5` | s = 1: «Con la 1 arriba, la 2 y la 3 dicen cómo.» · s = 2: «Si manda la 2, ¿a qué responde la 1?» · s = 4: «Si manda el ejemplo, ¿de qué es ejemplo?» · t = 5: «Sin la 5, el texto dice lo mismo.» · t = 3: «Sin la 3 se pierde un cómo: sí la sostenía.» |
| 4 | Cinco interruptores, uno por alternativa (tocar = tachar o destachar) | «Tacha las alternativas que fallan hasta que quede una sola.» | tachadas exactamente las 4 incorrectas | Heladas: «Es solo el marco: deja fuera los cobertizos.» · Camélidos: «Muy amplio: le sirve a otro texto.» · 40 crías: «Es un dato del gráfico: muy estrecho.» · Única: «Dice más que el texto: “única” y “todas”.» · Si tacha la correcta: «Tachaste la que cubre el texto y el gráfico.» |

**Mensajes `bien`:**
1. «Listo: cubre las 4 y no le sirve al aviso del quiosco.»
2. «Tema más lo que afirma: esa es la idea principal.»
3. «La 2 y la 3 dicen cómo; la 4 es un ejemplo; la 5 sobraba.»
4. «Queda la única que cubre el texto y el gráfico sin agregar.»

`minimo` (casos distintos antes de seguir): 4, 4, 3 y 3.

**Riesgo conocido: probar a ciegas.** Con 5, 5, 30 y 32 combinaciones, se puede cumplir la misión tocando todo. No lo
tapo con bloqueos, porque la regla 3 solo bloquea la predicción. Lo que enseña es la lectura de cada toque, que dice por
qué ese caso falla, y el lector en frío comprueba que eso se entienda. En las ideas 3 y 4 la misión pide dos o cuatro
decisiones juntas, así que adivinarla cuesta más que leer.

### Piezas e interacciones que hay que construir (se agregan como opciones; las de hoy no cambian)

- **V1. Tocar la oración.** Hoy `rv-texto` solo tiene botones y un marcador que se arrastra. Falta un `tocables` en el
  juego: tocar un fragmento fija el valor de un control. Si hay herramienta activa (resaltador o lápiz), el toque
  subraya o tacha.
  - Zonas de toque de 44 px o más: una oración de una línea mide 25 px, así que hace falta interlineado de «modo tocable».
  - Mientras no se confirma, la oración tocada se muestra con el borde de marca (`--brand`), como el paso previo de
    `app/lectura.js`, porque es un estado.
  - Se puede probar en la grilla del validador como cualquier control.
- **V2. Soportes de prueba** en `nucleo/kit/objetos/`: mural de corcho con chinches, folleto en tres partes, hoja de
  cuaderno cuadriculado, hoja de simulacro con casillas A a E, cartel de feria y papel pegado en una puerta. Además,
  resaltador, lápiz y balsa de totora. Cada uno lleva `prueba: true` y va a la lista de `docs/encargo-vectores.md`.
- **V3. Escalera de temas:** una sección nueva de `rv-texto` (`modo: 'escalera'`) con el marcador arrastrable. Con dos
  secciones de texto, en pantalla ancha van lado a lado.
- **V4. Marca «tenue»** (gris, sin raya) para lo que una frase deja fuera. Hoy solo hay `tachar` (que sugiere borrar) o la
  marca `h` en carmín.
- **V5. Árbol de jerarquía** para «Mira» de la idea 3: la principal arriba y cada secundaria colgando con su pregunta
  («¿cómo?», «¿por qué?», «¿por ejemplo?»). Es el diagrama que llega después del objeto.
- **V6. Texto con gráfico en una sola figura:** `rv-texto` con una sección de barras o tabla, o una pieza compuesta. Lo
  piden la idea 4 y los ejemplos de nivel 3.
- **V7. Ejemplos resueltos con figura en la solución.** El formato de 4h (`solucion: [{ texto, ecuacion }]`) no deja
  pintar la evidencia en el resuelto sin pintarla también en el enunciado. Propongo `solucion[k].figura`, o
  `figuraResuelta`. Además, las alternativas van en la figura, porque 5 alternativas no caben en las 40 palabras del
  enunciado.
- **V8. Validador.** Para verbal, el soporte del kit cuenta como el objeto de la primera pantalla (sin `sinObjeto`). Lo
  propongo como cambio al contrato, no como excepción callada (plan §7, etapa 2): «En razonamiento verbal, el objeto
  reconocible es el texto en su soporte (mural, folleto, cuaderno, hoja de examen), con quién lo escribe y para quién».

---

## 4. La predicción de cada idea

Las opciones van sin justificación, para que la correcta no se delate (`herramientas/alternativas.test.js`). Dos
incorrectas de una misma predicción nunca comparten código. La app las baraja.

### Idea 1

**Pregunta:** «Este cartel de la feria empieza nombrando a una vendedora. ¿Cuál es su tema?»

> ① Doña Rufina vende queso en la feria de los domingos.
> ② Desde este mes, la feria pide que cada queso lleve una etiqueta con la fecha en que se hizo.
> ③ Así, quien compra sabe cuántos días tiene el queso.
> ④ Doña Rufina ya encargó sus etiquetas en una imprenta.

| Opción | Código | `siFuera` (empieza por lo que hizo bien) |
| --- | --- | --- |
| **La etiqueta con fecha que ahora deben llevar los quesos** | correcta | — |
| Doña Rufina, la vendedora de queso | RV4 (y RV64 propuesto, 9.5) | «Ella abre el cartel y vuelve al final, pero el cartel trata de la etiqueta.» |
| Los alimentos que se venden en las ferias | RV2 | «Es del mismo asunto, pero le serviría a cualquier cartel de feria.» |
| La imprenta donde se hacen etiquetas | RV1 | «Sale en la oración 4, pero es un detalle.» |

- **Datos:** ninguno. «Feria» y «etiqueta» se conocen.
- **Es algo que el juego no mostró:** allí los temas venían escritos en la escalera; aquí la primera oración trae una
  persona que no es el tema.
- **Revelar:** la escalera aplicada al cartel. **Coincide:** «La vendedora abre el texto, pero el texto trata de la etiqueta.»

### Idea 2

**Pregunta:** «En este texto, ninguna oración dice sola la idea principal. ¿Cuál es?» (Es el texto de la teoría actual,
propio.)

> ① En Juliaca, el agua hierve a unos 87 °C.
> ② En Lima, a orillas del mar, hierve a unos 100 °C.
> ③ Arriba hay menos aire que empuje sobre el agua.
> ④ Por eso, en la altura los fideos tardan más en cocinarse.

| Opción | Código |
| --- | --- |
| **En la altura el agua hierve a menos grados, y los fideos tardan más** | correcta |
| En Juliaca el agua hierve a unos 87 °C | RV4 |
| Los fideos tardan más en cocinarse en la altura | RV3 (solo la consecuencia) |
| El agua es necesaria para cocinar | RV2 |

- **Datos:** «°C: grado Celsius, la unidad del termómetro».
- **Es nuevo frente al juego:** en el juego la idea se armaba con una frase dada; aquí no hay ninguna oración que la diga.
- **Coincide:** «No está en una oración: se arma uniendo las cuatro.»

### Idea 3

**Pregunta:** «Este texto empieza con lo que mucha gente cree. ¿Qué oración subrayarías como la principal?»

> ① Mucha gente piensa que el cuy se cría solo para la fiesta.
> ② Sin embargo, en muchas familias de Puno el cuy es una forma de ahorro.
> ③ Cuando hace falta plata para útiles o una medicina, se venden algunos en la feria.
> ④ Además, se reproducen rápido y comen hierba y cáscaras de la cocina.

| Opción | Código |
| --- | --- |
| La 1 | RV4 |
| **La 2** | correcta |
| La 3 | RV1 |
| Las cuatro: todas importan | RV43 (lista sin jerarquía) |

- **Datos:** ninguno.
- **Es nuevo frente al juego:** en el juego la principal era la primera.
- **Coincide:** «La 1 es lo que el texto corrige; la 3 y la 4 responden ¿cómo? a la 2.»

### Idea 4

**Pregunta:** «Para este mismo texto de las alpacas, ¿qué título le queda mejor?»

| Opción | Código |
| --- | --- |
| **Cobertizos contra la helada** | correcta |
| La vida en Puno | RV2 |
| Cuarenta crías en un año | RV1 (dato del gráfico) |
| El techo que salva a todas las crías | RV11 (agrega y es absoluto) |

- **Datos:** «Título: el nombre que se le pone a un texto». No dice que tiene la medida del tema: eso es lo que se predice.
- **Coincide:** «El título tiene la misma medida que el tema: ni más ni menos.»

---

## 5. Qué es «dato» en esta unidad y qué no se da

**Entra en `datos`** (una línea por dato, ≤ 22 palabras). Es lo que en física sería la equivalencia o la fórmula: el
criterio que se aplica y las palabras que el alumno no tiene por qué conocer.

| Tipo | Línea |
| --- | --- |
| Definición o criterio (idea 1) | «Tema: de qué trata todo el texto. Si deja fuera una parte, es muy estrecho; si sirve para otro texto, muy amplio.» |
| Definición (idea 2) | «Idea principal: lo que el texto entero afirma de su tema.» |
| Definición (idea 3) | «Idea secundaria: da un porqué, un cómo o un ejemplo de la principal.» |
| Definiciones (idea 4) | «Título: el nombre del texto.» · «Tesis: lo que defiende el autor de un texto que opina.» · «Texto mixto: texto y gráfico que se leen juntos.» |
| Palabra poco común | «Cobertizo: techo bajo donde duermen los animales.» · «Chullo: parte blanca y tierna del tallo de la totora.» |
| Dato del mundo | Real y con `fuente`. Si el valor es de libro, con «unos». Lo inventado, con la nota «Datos inventados para el ejercicio». |

Si el ejercicio practica **elegir** (idea 4), van las definiciones de cada falla («muy amplia», «muy estrecha»,
«agrega»), como en física van las dos fórmulas entre las que se elige. Lo que no va es cuál alternativa cae en cuál.

**No se da** (sería el paso hecho, el atajo o el consejo):
- **La respuesta marcada.** Ninguna oración resaltada, ningún rol escrito («la 4 es un ejemplo»), ninguna evidencia
  pintada en el enunciado ni en la figura del ejemplo (molde §3: la figura muestra el planteamiento).
- **Atajos de posición:** «la idea suele ir al final» (en el banco es cierto en 17 de 21 textos: ver el punto 8) o «la
  primera nunca es».
- **Atajos de examen:** «descarta las que dicen “siempre”» o «la correcta es la más larga». El criterio de «agrega algo
  que el texto no dice» cubre los absolutos sin el truco.
- **Consejos de lectura:** «fíjate en el “sin embargo”», o el significado de un conector cuando detectarlo es el paso.
  Los conectores son otra unidad que no está en `requiere`, y el texto mismo debe bastar.
- **En «Predice», tampoco el criterio de la idea que se está por aprender.** Solo glosas de palabras y, desde la idea 2,
  las definiciones de ideas anteriores (en la idea 2 se puede dar «tema»; nunca «idea principal»).

---

## 6. Colores y símbolos

### La paleta de lectura en la teoría (la de `docs/formato-lectura.md` §4, con un papel fijo en todo verbal)

| Papel en verbal | Token | Trazo en `rv-texto` | Cuándo se ve |
| --- | --- | --- | --- |
| Lo que el texto dice y sostiene la frase: lo que «cubre» (evidencia) | `i` turquesa | continuo | En el juego, en «Mira» y en la solución |
| Tu propuesta: la frase o alternativa que se pone a prueba, o de dónde sale el distractor | `o` naranja | discontinuo | Mientras se prueba |
| La idea (o el tema) aceptada | `d` verde (ver 9.4) | punteado | Solo después del ✓ de la misión, en el último paso de «Mira», en «revelar» y en la respuesta del ejemplo |
| Lo que queda fuera | sin color: gris tenue (V4) o tachado de lápiz | — | En todo momento |
| Oración tocada sin confirmar | `--brand` (es un estado) | borde | Al tocar |

- No se usan el violeta (`f`) ni el carmín (`h`, que es de ángulos). La teoría actual usa el carmín para «fuera»: se va.
- **Cómo convive con §5b.** Son los mismos tokens y los mismos pares que ya se midieron; cambia el nombre del papel, que
  es fijo en todo el curso de verbal y se dice en la leyenda de cada figura.
- **Si una idea usa los dos sistemas** (un gráfico con números, como en la idea 4): las barras son datos del texto, no
  variables. Llevan turquesa solo cuando son evidencia; si no, van en tinta. No hay cuentas, así que no entra ningún
  papel de §5b además del de lectura. Si algún día una pregunta pide calcular (eso es de `textos-discontinuos`), se usa
  §5b y la paleta de lectura no se mezcla en esa figura.

**Pares medidos** (OKLab, peor caso entre visión normal, protan, deutan y tritan; el mismo cálculo de §5b, script en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/etapa2/color.py`):

| Par | Claro | Oscuro | Peor visión |
| --- | --- | --- | --- |
| naranja–turquesa (propuesta–evidencia) | 0,114 | 0,153 | — |
| naranja–verde (propuesta–idea) | **0,011** | 0,041 | protan (claro), deutan (oscuro) |
| turquesa–verde (evidencia–idea) | **0,056** | 0,101 | tritan |
| turquesa–violeta | 0,102 | 0,126 | — |
| naranja–violeta | 0,189 | 0,159 | — |

**Reglas que salen de ahí** (si se queda el verde):
- **El verde nunca va junto al naranja.** Cuando una propuesta se acepta, deja de ser naranja y pasa a ser la idea: cambia
  el trazo (de discontinuo a punteado), aparece el sello en palabras («✓ Idea principal») y el naranja desaparece del cuadro.
- **El verde junto al turquesa solo con trazos distintos**, porque en tema claro queda bajo 0,08.
- Ningún cambio se apoya solo en el tono (WCAG 1.4.1).

### Símbolos (en lugar de la tabla de letras)

| Símbolo | Qué es | Leyenda (≤ 8 palabras) |
| --- | --- | --- |
| ① ② ③ o 1, 2, 3 en gris | número de la oración; las explicaciones citan «la oración 3» | «1, 2, 3: número de cada oración» |
| A–E | alternativas. En «Predice» y en «Ahora tú» la app las baraja, así que ninguna explicación nombra letras | «A–E: las alternativas» |
| Subrayado turquesa | lo que la frase cubre | «turquesa: oración que la frase cubre» |
| Gris tenue | lo que deja fuera | «gris: oración que queda fuera» |
| Tachado de lápiz | lo descartado | «tachado: lo que no sostiene la idea» |
| «Cubre 3 de 5» | cuántas oraciones cubre la frase | se presenta en «Lee» de la idea 1 |
| ✓ | misión lograda | — |

Notación: los textos van entre comillas latinas «», las palabras citadas del texto también, y los números con su unidad
(87 °C, 40 crías).

---

## 7. Ejemplos resueltos en verbal

**Forma.** El molde pide 15 por idea (5 de cada nivel). Cada ejemplo lleva:
- **Figura:** el texto breve en su soporte (V2), sin ninguna marca; las alternativas van en la figura (V7).
- **Enunciado:** la pregunta, como en el examen.
- **`datos`:** el criterio y las glosas.
- **Solución:** los pasos de `resuelve` (¿Qué me piden? · ¿Qué tengo? · ¿Qué regla uso? · Lo aplico · ¿Tiene sentido?).
  En «Lo aplico» va la figura con la evidencia en turquesa y cada alternativa descartada con su falla (V7).
- **Respuesta:** la frase en el color de la idea.

**Los tres niveles en verbal:**

| Nivel | Texto | Qué lo hace subir | Pasos |
| --- | --- | --- | --- |
| 1, base | 3 o 4 oraciones, un solo asunto; la idea dicha en una oración, **también en la primera** (el banco casi no lo tiene) | 3 alternativas o «¿qué oración…?» | Uno: aplicar el criterio |
| 2, intermedio | 5 o 6 oraciones con una trampa de estructura: una creencia o un contraste al inicio, la idea al final o repartida en dos oraciones, un ejemplo largo | Dos errores cercanos a la vez (parcial y amplia) | Dos: ubicar y comprobar que cubre todo |
| 3, examen | Tipo San Marcos: texto con gráfico o tabla, un relato con la idea implícita, o un texto de 120 a 180 palabras | 5 alternativas con 4 errores distintos, incluido el que agrega o el absoluto, y la redacción del examen («gira en torno a», «da cuenta principalmente de») | Varios: descartar cada una por su falla |

Reparto propuesto por idea (5 + 5 + 5):
1. Tema: nivel 1, avisos; nivel 2, la persona o el lugar del comienzo; nivel 3, tema central de texto mixto.
2. Idea principal: nivel 1, oración explícita; nivel 2, repartida; nivel 3, relato con enseñanza implícita, como t014 y t028.
3. Jerarquía: nivel 1, «¿qué papel cumple la oración N?»; nivel 2, creencia y corrección; nivel 3, eliminar la que no sostiene en 6 oraciones parecidas.
4. Alternativas: nivel 1, frase u oración según la pregunta; nivel 2, título; nivel 3, tema central, idea principal o tesis con 5 alternativas.

### Nivel 1 (idea 1): «De qué trata el aviso»

**Figura:** un papel pegado en la puerta de la posta.
> ① La posta vacunará contra la influenza del 2 al 6 de junio. ② Pueden ir niños, adultos mayores y personas con asma.
> ③ La vacuna es gratis. ④ Hay que llevar el DNI.

**Enunciado:** «¿De qué trata el aviso: de la salud de las familias, de la vacunación contra la influenza en la posta o
del DNI de los vecinos?»

**Datos:** «Tema: de qué trata todo el texto. Si deja fuera una parte, es muy estrecho; si sirve para otro texto, muy amplio.»

**Resuelto:**
1. **¿Qué me piden?** El tema: una frase.
2. **Lo aplico.**
   - «La salud de las familias» también le serviría al aviso del dentista: muy amplio.
   - «El DNI» cubre solo la ④.
   - «La vacunación contra la influenza en la posta» cubre ①–④ (las cuatro en turquesa en la figura de la solución).
3. **¿Tiene sentido?** No le sirve a otro aviso.

**Respuesta** (en el color de la idea): «La vacunación contra la influenza en la posta».

### Nivel 2 (idea 3): «El chuño no es lo que se dice»

**Figura:** una hoja de cuaderno.
> ① Se suele decir que el chuño es comida de pobres. ② En realidad, es una forma muy antigua y segura de guardar papa en
> los Andes. ③ Una papa fresca se malogra en semanas; el chuño dura años. ④ Además, pesa poco y se lleva fácil en viajes
> largos. ⑤ Por eso, en los años de mala cosecha, fue la reserva de muchas familias.

**Enunciado:** «¿Qué oración dice la idea principal, y qué hacen con ella las demás?»

**Datos:** «Idea principal: lo que el texto entero afirma de su tema.» · «Idea secundaria: da un porqué, un cómo o un
ejemplo de la principal.»

**Resuelto:**
1. **Paso 1.** La ① es lo que «se suele decir»; la ② lo corrige. Es la candidata.
2. **Paso 2.** La ③, la ④ y la ⑤ responden «¿por qué es segura?» a la ②. En la figura de la solución cuelgan de ella con
   su pregunta (V5), en turquesa.
3. **¿Tiene sentido?** Si tapo la ①, el texto sigue diciendo lo mismo; si tapo la ②, las demás quedan sueltas.

**Respuesta:** «La oración 2; las demás dan razones».

### Nivel 3 (idea 4): «La quinua que se vende», texto mixto como el de San Marcos

**Figura:** una hoja de simulacro.
> ① Hace veinte años, la quinua se comía sobre todo en los hogares del altiplano. ② Hoy aparece también en menús de
> colegios y restaurantes de otras regiones. ③ Ese cambio subió su precio, y algunas familias productoras ganan más que
> antes. ④ Pero otras, que antes la comían a diario, ahora prefieren venderla y comprar fideos o arroz. ⑤ La tabla
> muestra cuánta quinua vende y cuánta come una familia de ejemplo.
>
> *Tabla:*
>
> | Año | Vende | Come |
> | --- | --- | --- |
> | 2005 | 200 kg | 150 kg |
> | 2025 | 500 kg | 50 kg |
>
> Nota: «Datos inventados para el ejercicio.»
>
> **Alternativas:**
> - A. El auge de la quinua y cómo cambió el consumo de quienes la cultivan
> - B. La quinua como alimento de los hogares del altiplano
> - C. Los cultivos andinos y el comercio en el Perú
> - D. Los 500 kilos que vende hoy una familia
> - E. Cómo la quinua hizo ricas a todas las familias del altiplano

**Enunciado:** «El texto y la tabla giran, principalmente, en torno a»

**Datos:** la línea de «Tema» de arriba y «Texto mixto: texto y tabla que se leen juntos».

**Resuelto:**
1. **¿Qué me piden?** «Giran en torno a» pide el tema central: una frase con la medida del texto y de la tabla.
2. **Lo aplico.** Cada descartada queda tachada con su falla:
   - B cubre solo la ①: es el antes, el marco.
   - C le sirve a otro texto.
   - D es una celda de la tabla.
   - E dice «ricas» y «todas», que el texto no dice, y la ④ lo contradice.
   - A cubre ②–④ y las dos filas (turquesa).
3. **¿Tiene sentido?** Si tapo la tabla, A sigue cubriendo el texto; si tapo el texto, A explica la tabla.

**Respuesta:** «El auge de la quinua y cómo cambió el consumo de quienes la cultivan».

Códigos de este ejemplo: B, RV3 (RV64 si lo apruebas); C, RV2; D, RV1; E, RV11.

**Lector en frío de los ejemplos** (molde §8.4): además de lo de siempre, preguntar si la figura del enunciado delata la
respuesta. En verbal el riesgo es distinto: una alternativa más larga o una oración en negrita.

---

## 8. Práctica: qué existe y qué falta, por idea

**Qué existe:**
- `lectura-verbal` tiene 21 textos que preguntan por esta unidad: t000a y t000b (entrada y salida) y 19 de práctica.
  - Todas las preguntas son del tipo `idea-principal` y todas las de práctica llevan el previo `marcar-oracion`.
  - Son 11 expositivos, 6 argumentativos y 4 narrativos, de 151 a 199 palabras.
  - Dificultad: 12 de nivel 1, 8 de nivel 2 y 1 de nivel 3 (t018).
- El papel de `lectura-verbal` trae 2 ítems de idea principal (t007 y t008) de 10.
- La teoría tiene «Ahora tú» con 5 casos de 3 oraciones por idea y tres mesas de laboratorio.

**Dos sesgos del banco que hay que corregir**, porque enseñan un atajo:
- La principal está en la última oración en 17 de 21 textos, y **en ninguno está en la primera**. El previo pone RV4 de
  oficio a quien toca la ①, así que un alumno aprende «nunca es la primera» y «casi siempre es la última».
- Las alternativas de RV4 solo aparecen en el previo, nunca entre las 5 alternativas.

| Idea | Qué hay | Qué falta |
| --- | --- | --- |
| 1 · Tema | Nada: el banco no tiene un tipo `tema-central` (hoy no existe en `banco.test.js`) | El tipo `tema-central` y un previo nuevo **`medida`**: el alumno ve una frase y dice si es muy amplia, justa o muy estrecha (amplia → RV2, estrecha → RV1 o RV3). Unos 6 textos nuevos, 3 de ellos mixtos (texto con tabla o barras, con la nota de datos inventados), y 2 o 3 preguntas de tema central sobre textos que ya están (un texto puede tener 3 a 5 preguntas). |
| 2 · Idea principal | 19 textos con previo | 3 o 4 textos con la idea en la ① y 2 con la idea en el medio. Alternativas con RV4 y con «solo nombra el tema» (RV65 propuesto). Más de nivel 3: hoy hay uno. |
| 3 · Jerarquía | 0 preguntas de función de una oración en esta unidad (hay 5 de `estructura` en tipología) | Preguntas `estructura` («¿qué papel cumple la oración 4?») en 4 o 5 textos, y un previo `marcar-oracion` de «la que no sostiene la idea». Ojo con pisar `eliminacion-de-oraciones`, que pide esta unidad: aquí se pregunta el papel, allá se elimina. |
| 4 · Alternativas | Las 5 alternativas de cada pregunta de idea principal ya practican el descarte | Tema central de texto mixto, título (hoy solo en `resumen-y-sintesis`, 5) y tesis («¿cuál es la tesis del autor?» está en t009, t012 y t017, de otras unidades). Alternativas con RV11 y con «agrega lo no tratado» (RV66 propuesto). |
| Todas | — | La práctica de verbal no sabe a qué idea sirve cada pregunta. Propongo un campo `idea` en la pregunta (o asignarla por `tipo`: tema-central → 1, idea-principal → 2, estructura → 3, título y tesis → 4). El papel de esta unidad llega a 5–10 ítems con `herramientas/papel-lectura.js` (regla 6). «Ahora tú» de cada idea se rehace con textos de 4 a 6 oraciones, y su último caso a nivel de examen. «Así se resuelve» se escribe de cero, con otras semillas que «Ahora tú». |

Cada texto nuevo pasa la revisión a ciegas de `docs/formato-lectura.md` §5.6 antes de entrar al índice. Son textos
propios; nada copiado ni parafraseado de los fragmentos de autores de los exámenes (regla 5).

---

## 9. Preguntas para Gerson

1. **¿Sale el mapa conceptual?** San Marcos no lo pregunta (0 de 690); viene del sílabo de la UNI. Recomiendo quitar la
   idea `mapa-conceptual` y dejar su mesa en «Más mesas del tema» (`laboratorioIdeas: []`), con `Avance.migrar` para quien
   ya la hizo. La otra salida es pasarla a `resumen-y-sintesis`. Con ella se irían del glosario «enlace» y «proposición».
2. **¿El título entra aquí, en la idea 4?** Recomiendo que sí, porque es el tema con otro nombre, y que se quede también en
   `resumen-y-sintesis`. El resumen y el propósito siguen en sus unidades.
3. **¿Apruebas el cambio al contrato para verbal** (punto 1 y validador): «el objeto reconocible es el texto en su
   soporte, con quién lo escribe y para quién»? ¿Y los soportes de prueba de V2?
4. **¿El color de la idea sigue verde o pasa a violeta?** Con el verde, la idea aceptada y la propuesta (naranja) son el
   mismo color para un protanope (0,011), y la evidencia (turquesa) queda en 0,056 en tritan. Con violeta, los dos pares
   dan 0,102 y 0,189, y además coincide con §5b («lo que se pide y su resultado»). Cambiarlo toca `.pinta-idea` de
   `app/lectura.js` y `docs/diseno.md` (de `--c-d` a `--c-f`). Mi recomendación es violeta en la teoría y en la lectura a
   la vez; si prefieres no tocar la lectura ahora, sigo con verde y las reglas del punto 6.
5. **¿Agregamos tres códigos al informe, como hipótesis**, sacados de las trampas de San Marcos?
   - **RV64:** el contexto, el marco o la persona del comienzo como tema («elegir el contexto (zoonosis)», «persona citada»).
   - **RV65:** se responde con el tema cuando se pide la idea principal: nombra, no afirma. Hoy se codifica mal como RV2.
   - **RV66:** el tema o la idea agregan un aspecto que el texto no trata («curación, prevención», «una propuesta cuando
     solo describe»). Hoy cae entre RV8 y RV33.

   RVM1 y RVM2 se van con el mapa.
6. **¿Tipo de pregunta `tema-central` y previo `medida` en el banco**, más los textos nuevos del punto 8 (unos 15)? Es el
   trabajo más grande de la unidad, junto con los 60 ejemplos.
7. **¿15 ejemplos por idea también en verbal?** Son 60 textos breves propios. Lo puedo hacer, pero cada uno es un texto
   nuevo que se revisa a ciegas. Otra opción es 9 por idea (3 por nivel) en esta unidad, y medir con el lector en frío si
   alcanzan.
8. **¿El nivel 3 de los ejemplos puede tener texto con gráfico de unas 120 palabras en la pestaña?** En el celular es una
   figura larga que se desplaza.
9. **Ids:** `tema` y `alternativas` nuevos; `tema-e-idea` y `jerarquia` se quedan con su avance. ¿De acuerdo con ese orden
   (tema → idea → jerarquía → examen)?
