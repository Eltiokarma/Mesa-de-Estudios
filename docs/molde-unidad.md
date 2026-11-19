# Molde de una unidad

Receta para rehacer cualquier unidad de cualquier curso con la calidad de «Magnitudes y unidades» y «Vectores» (16–17 nov
2026), las dos primeras que pasaron por el contrato completo, el lector en frío y una auditoría. Lo que dice aquí sale de
lo que funcionó y de los errores que encontraron los lectores y los auditores; cada regla dice de dónde viene.

Manda `docs/plan-calidad.md` (el contrato de 13 puntos y los tres filtros). Este documento dice **qué** debe cumplir
una unidad; `docs/metodo/unidad/` dice **cómo** se hace, fase por fase, con el encargo listo para copiar de cada
agente (ideas, ejemplos, práctica, lector en frío, auditor, correcciones) y las herramientas.
Formato de los campos: `docs/teoria.md`. Reglas del repo: `CLAUDE.md`.

## 0. Antes de escribir

1. Leer `docs/plan-calidad.md` §3, `docs/teoria.md` (4e, 4f, 4h y §5), este documento y los informes de la unidad
   anterior en `rutinas/frio/` y `rutinas/auditoria/` (los errores se repiten si no se leen).
2. Cargar los skills: `multimedia-learning`, `diseno-y-animacion`, `arte-generativo-svg` y `arte-vectorial` (este último
   para cualquier pieza SVG nueva).
3. Proponer a Gerson las ideas de la unidad, en orden, con una frase cada una (`aprendizaje`), antes de escribirlas.
   Ninguna idea usa algo que una idea posterior presenta (punto 9); lo que la unidad da por sabido va en `requiere`.
4. Hacer una **tabla de letras** de la unidad: cada letra con un solo significado (P no puede ser presión, potencia y
   peso). Si la notación del libro choca con otra cosa (T del período y T de la dimensión tiempo), se usa la del libro y
   se avisa (Gerson, 17 nov: péndulo).
5. Hacer un **mapa de colores** de la unidad con los papeles de §5b (primer dato, segundo dato o factor, lo que se pide,
   ángulo, tercer dato): el mismo en teoría, ejemplos, escena, generadores y glosario. Dos variables de un mismo problema
   nunca comparten color.

## 1. Archivos

| Qué | Dónde |
| --- | --- |
| La teoría (ideas, momentos, glosario, ejemplos) | `contenido/teoria/<curso>/<unidad>.js`, con `calidad: 2` |
| Dibujos de objetos reales | `nucleo/kit/piezas/<pieza>.js` + `.test.js` (p. ej. `fis-objeto`, `fis-fuerzas`) |
| Práctica | `plantillas/<id>/generador.js` + test + `casos.json` + `papel.json` |
| Lector en frío | `rutinas/frio/<unidad>.md` (momentos) y uno para los ejemplos |
| Auditoría del contrato | `rutinas/auditoria/<unidad>.md`, con su sección «Correcciones» |
| Catálogo | `npm run catalogo` después de tocar teoría, glosario o plantillas |

## 2. Cada idea

Momentos, en orden: Lee → Juega → Predice → Mira → La regla → Así se resuelve → Ahora tú (formato en `docs/teoria.md`).
El alumno puede volver al momento anterior con «‹ Atrás»; adelante solo con «Seguir» (Gerson, 17 nov).

- **Primera pantalla con un objeto reconocible** (punto 1): una plaza, una caja con dos cuerdas, una combi. El diagrama
  abstracto llega después o al lado. Falló en tres ideas de Vectores (auditoría, 17 nov).
- **Juega con misión** que el motor comprueba (punto 2). La consigna es contexto + misión, no la descripción de botones.
- **Leyenda**: cada símbolo de la figura y de la lectura, dicho en palabras (punto 3).
- **Lectura en vivo que enuncia una relación** («R = 6,73: menos que A + B = 10 y más que A − B = 2»), nunca un número
  suelto con un paréntesis. Un «·» no separa dos igualdades (se lee como una igualdad falsa).
- **Predice**: pregunta sobre algo que el juego no mostró; sus opciones las baraja la app. Lleva `datos` solo con
  equivalencias y valores, **nunca la fórmula**: se predice antes de aprender la regla (Gerson, 17 nov).
- **La regla** dice todo lo que los ejercicios van a pedir (si un tercio de los casos pregunta por una suma, la regla
  dice qué pasa en una suma; auditoría de Magnitudes).
- **Así se resuelve** no es la misma pregunta que «Ahora tú».
- **Ahora tú** practica cada parte de la regla (no solo la más fácil) y su caso más difícil llega a nivel de examen.
  Cada opción incorrecta sale de un error real y su `siFuera` empieza por lo que el alumno hizo bien.
- **Glosario**: de 2 a 4 términos que estrena la idea, cada uno con `simple` (aproximación de todos los días) y 3
  ejemplos o más. El `simple` nunca afirma lo que un distractor de la idea afirma («constante: un número como k» contra
  la predicción de la dimensión de k; auditoría de Magnitudes).

## 3. Ejemplos resueltos (pestaña «Ejemplos»)

15 por idea: 5 de nivel 1 (un paso), 5 de nivel 2 (dos pasos o unidades compuestas), 5 de nivel 3 (tipo examen).

- **Los niveles suben de verdad**: el nivel 2 no repite la cuenta del nivel 1 con otros números; el nivel 3 es un
  problema de examen (varios pasos, el error típico, unidades mezcladas), no la multiplicación del nivel 1 con otro
  nombre (auditorías, 17 nov).
- **La figura muestra el planteamiento, no la respuesta.** Nada del resultado en el dibujo («R = 13», «120°», «No
  cuadra»): el alumno lo leía antes del resuelto (lector en frío, 17 nov; 23 de 60 en Vectores).
- **El dibujo es el objeto que nombra el texto** (un auto no se dibuja como combi) y no trae cosas que el resuelto no
  usa (paralelogramos, proyecciones).
- **Si el resuelto usa algo, está en los datos o en el glosario**: el ÷ 3,6, los corchetes de dimensión, î y ĵ,
  «módulo», «u», el «·». Lo que el resuelto dice que hace, se ve hecho (si dice «se tachan», se tachan).
- **La respuesta lleva color**, el de su variable en el mapa de colores.
- **La letra de una alternativa va en negrita** cuando el resuelto la nombra («**A** le serviría a cualquier texto»,
  «Respuesta: **C**»), para que se distinga del texto (Gerson, mesa de revisión, 17 nov).
- **Ninguna figura de Predice ni de un ejemplo delata la respuesta por su color**: lo que se pide va con «?» o en tinta
  hasta comprobar, nunca en violeta antes (trigonometría, idea 1, 17 nov).
- **Qué muestra el dibujo de un ejemplo** (Gerson, mesa, 18 nov): lo que cada dato marca por sí solo (la primera línea
  del resuelto: la × de una pista, el aro de una premisa, el tramo dado), nunca lo que sale de juntarlos (la ✓ deducida,
  el reparto que queda, la medida pedida). Si la pregunta es justo dónde va la marca, el dibujo va sin ella. Una
  figura vacía mientras el resuelto habla de marcas confunde (lector en frío, dos rondas de Razonamiento deductivo).
- **Una marca de igualdad no se puede leer como otro tramo**: en geometría va sobre una llave que une las dos puntas de
  su tramo (Segmentos y ángulos, 18 nov), y un rótulo nunca toca una línea, punteada incluida.
- Cuentas comprobadas con un **script aparte que no usa el código de la unidad**; el comentario de la constante dice
  qué cuentas se revisaron.

## 4. Datos (punto 13: criterio, no memoria)

Todo ejercicio (ejemplos, «Así se resuelve», «Ahora tú», prueba del tema, práctica y papel) da lo que necesita en el
campo `datos`, una línea por dato, que se ve en un recuadro «Datos» aparte del enunciado. El validador rechaza un «Dato:»
dentro del enunciado y, en `calidad: 2`, un ejercicio sin `datos`.

**Entra**: equivalencias (1 h = 3600 s), valores de academia (cos 37° = 4/5), constantes, unidades de lo que no se pide
(«g se mide en m/s²»), definiciones y **la fórmula** (W = F·d·cos θ).

**No entra** (las tres fallas de la primera pasada):
- **El paso ya hecho.** Si el signo es lo que se practica, va el valor del ángulo de referencia y la regla de signos, no
  «cos 217° = −4/5». Si la idea enseña a elevar la equivalencia, no se da ya elevada. Si se pide la dimensión de F, se
  dan F = m·a y las unidades de m y a, no [F].
- **El atajo.** Va la fórmula general (AP⃗ = m/(m + n)·AB⃗), no el atajo memorizado (pesos cruzados).
- **El consejo.** «Los movimientos son independientes» no es un dato. Una línea es equivalencia, valor, constante,
  definición o fórmula.

Si el ejercicio practica **elegir**, van las fórmulas entre las que se elige (producto escalar y vectorial juntos).

**Datos del mundo**: un dato puntual (el volumen del Titicaca, la lluvia de febrero en Juliaca) es real y lleva `fuente`
comprobable (ILEC, SENAMHI, BIPM). Un valor de libro (sonido a 340 m/s, hielo a 0,92 g/cm³) va con «unos» y sin fuente.
Nada imposible: un río de la sierra no corre a 9 m/s ni el Ucayali mide 24 m de ancho (auditoría de Vectores).

## 5. Notación

- Vector con flecha (`{ vec: 'A' }` o «A⃗») en todo texto visible: enunciados, datos, rótulos, glosario y generadores.
  Módulo sin flecha, escrito de una sola manera en toda la unidad.
- Subíndices de verdad: `{ sub: ['A', 'y'] }` en ecuaciones; «A_y» en el texto de un generador (la app lo muestra como
  subíndice); `<tspan>` en un rótulo SVG. Nunca «ᵧ»: es una gamma griega.
- Ángulos con «°» y, en un reemplazo, con su función a la vista: `25 · cos 53° = 25 · 0,6`.
- Una fórmula que el alumno conoce distinta en el colegio se aclara (la ley de cosenos con «+»: θ es el ángulo entre A⃗
  y B⃗ cola con cola; la del colegio usa el ángulo del triángulo, 180° − θ).

## 5b. Colores (auditoría con el skill `teoria-del-color`, 17 nov)

**Un color fijo por magnitud en cada unidad** (Gerson, mesa de revisión, 17 nov; reemplaza «un color por papel en cada
ejercicio»). Cada magnitud o lado tiene un solo color en toda la unidad: en el juego, el eje, la figura, la fórmula, los
ejemplos y la práctica. Ese color se elige por el papel que la magnitud cumple casi siempre (tabla de abajo), y la
unidad lo escribe en su comentario de cabecera con una prueba que lo compruebe. La respuesta lleva el color de su
magnitud y el recuadro de respuesta. Por qué: los lectores en frío de química y trigonometría se perdieron cuando la
misma cosa cambiaba de color de un ejercicio a otro (la escalera naranja en uno y verde en otro; Q naranja en el juego y
violeta en la fórmula). Ejemplos: química, Q violeta, m naranja, cₑ y L turquesa, temperatura y ΔT verde; trigonometría,
el lado lleva el color de su nombre desde el ángulo (CO naranja, CA turquesa, H en tinta). La letra o el rótulo dice
cuál variable es (el color guía, no identifica: WCAG 1.4.1). El violeta queda para lo que el alumno busca casi siempre
en esa unidad; el subrayado del glosario es gris de tinta, no violeta (17 nov). Física (Magnitudes y Vectores) se
ajusta a esta regla en una pasada aparte.

| Token | Claro | Oscuro | Papel más común de la magnitud | Ejemplos |
| --- | --- | --- | --- | --- |
| `o` naranja | `#a95300` | `#f0a04a` | el primer dato | A⃗; la cantidad que te dan |
| `i` turquesa | `#07746e` | `#3dcdc3` | el segundo dato o el factor | B⃗; el factor de conversión |
| `f` violeta | `#6b3dbd` | `#ab8cf2` | lo que se pide y su resultado | R⃗; la cantidad convertida; la incógnita (x, [k]) |
| `h` rojo carmín | `#c02a5c` | `#f17384` | ángulos | θ, α |
| `d` verde | `#3d6b0c` | `#a3d65e` | un tercer dato, poco frecuente | C⃗; un tercer tramo |

Por qué así (cálculo con las funciones del skill; distancias OKLab, peor caso entre visión normal y protan/deutan/tritan
simulados, Machado 2009):
- **El verde no puede ir junto al naranja ni al rojo**: naranja–verde cae a 0,010 en protanopía y rojo–verde a 0,038 en
  deuteranopía. Antes eran justo los pares de A⃗–R⃗ y dato–factor. Oscurecer o aclarar no lo salva: el texto tiene que
  ser oscuro para leerse (4,5:1), así que no queda claro-oscuro que separe. Por eso el verde quedó para el tercer dato.
- Los pares que sí van juntos quedan en ≥ 0,08 (naranja–turquesa 0,114; naranja–violeta 0,189; turquesa–violeta 0,101;
  violeta–carmín 0,167; turquesa–carmín 0,077), salvo naranja–carmín (A⃗–θ) en 0,062: el ángulo siempre lleva su arco y su
  letra.
- **Contraste**: el texto de una variable sobre su resaltado (8 % del color sobre la tarjeta) da 4,64 a 5,93:1 en claro y
  4,57 a 6,93:1 en oscuro (antes el naranja daba 3,85:1 sobre el resaltado del 12 %). Como línea, ≥ 5:1 contra la tarjeta.
- Los cinco tienen claridad parecida a propósito (paleta cualitativa: no sugiere orden).
- Una escena usa estos mismos tokens para los mismos papeles; si necesita más colores (ejes, componentes), los agrega
  aparte y comprueba sus pares con el script de la auditoría.

## 6. Dibujos

- Piezas puras (sin azar, ids ni reloj), solo `currentColor` y `var(--c-*)`, ancho 320.
- Objetos dibujados por la sesión como prueba (`data-prueba`); Gerson decide después cuáles reemplaza.
- La prueba de cada pieza comprueba **con números** (no a ojo) que todo queda dentro del lienzo con 4 de margen y que
  ningún rótulo pisa a otro ni al piso (skill `arte-vectorial`). Las flechas de una figura comparten escala.
- Revisar cada figura a 390 px en el celular y en pantalla ancha.

## 7. Práctica

- Cada idea tiene práctica (generador) y papel. Un generador que sirve a dos unidades separa sus tipos por unidad: la
  práctica de Vectores no puede pedir cantidad de movimiento (auditoría, 17 nov).
- `datos` del generador como lista de líneas, con prueba en 400 semillas (lista no vacía, ≤ 22 palabras, sin la
  respuesta, con la fórmula de cada tipo). El papel lleva esos datos al final del enunciado (`herramientas/papel-generador.js`).
- Las opciones incorrectas muestran el valor que produce su error.

## 8. Comprobación (en este orden)

1. `npm test` en verde (validador de la teoría, piezas, generadores, papel al día).
   Con `calidad: 2` corren además las reglas que salieron de las auditorías y los lectores de las 15 primeras unidades
   (19 nov): léelas antes de poner la marca, en `docs/metodo/unidad/reglas-validador.md`. La tabla de letras de §0.4
   va también como dato, en el campo `letras` de la unidad.
2. Cuentas rehechas con un script aparte.
   Y el ancho de las ecuaciones a 390 px (19 nov): con el servidor local arriba, `node herramientas/ecuaciones-ancho.js
   <unidad>` lista cada fórmula que se corta o se sale en «Mira», «La regla», «Así se resuelve» y «Ejemplos» (sin
   unidad, recorre todas las de `calidad: 2`; tarda minutos y por eso no está en `npm test`). La app parte sola el
   renglón que no cabe después de un signo; lo que la herramienta sigue listando se arregla en el contenido.
3. **Lector en frío de los momentos**: un agente nuevo, solo con capturas (360 × 780 y 1280 × 860), responde las cinco
   preguntas de `docs/plan-calidad.md` §4. Se corrige y se pasa con un lector nuevo.
4. **Lector en frío de los ejemplos**: 3 tarjetas por idea (una por nivel) con su recuadro «Datos»: ¿tiene todo?,
   ¿dónde se pierde?, ¿el dibujo regala la respuesta?, ¿suben los niveles?
5. **Auditor del contrato**: un agente con acceso al código revisa los 13 puntos con evidencia y rehace cuentas; deja
   hallazgos por gravedad, lo que hay que copiar y las reglas que faltan.
6. Correcciones, y el informe del auditor con su sección «Correcciones».
7. Gerson: galería de capturas en el celular.

## 9. Entrega

`npm run catalogo` → `npm test` → subir `VERSION` en `app/sw.js` si cambió la cáscara → un commit por cambio → push a
`main` y a la rama de trabajo → comprobar que `https://mesa-de-estudios.vercel.app/app/sw.js` sirve la versión nueva.

## 10. Lista de verificación de una unidad terminada

- [ ] Ideas aprobadas por Gerson, en orden, con `aprendizaje`; tabla de letras y mapa de colores escritos.
- [ ] Cada idea: objeto en la primera pantalla, misión, leyenda, lectura que enuncia una relación, predicción con datos
      sin fórmula, regla completa, «Así se resuelve» distinto de «Ahora tú», «Ahora tú» que llega a nivel de examen.
- [ ] Glosario: 2–4 términos por idea con `simple` y 3 ejemplos; ningún `simple` contradice una predicción.
- [ ] 15 ejemplos por idea que suben de nivel, figura sin respuesta, respuesta con color, todo lo usado está en datos.
- [ ] Punto 13 en todo ejercicio, también práctica y papel: herramientas, no el paso hecho; sin atajos ni consejos.
- [ ] Datos del mundo reales con fuente; valores de libro con «unos»; nada imposible.
- [ ] Notación: flechas, un solo módulo, subíndices de verdad, «°».
- [ ] Piezas con prueba numérica de encuadre y rótulos.
- [ ] Práctica por idea, tipos de la unidad, papel con datos.
- [ ] `npm test`, cuentas aparte, lector en frío (momentos y ejemplos), auditor, correcciones, galería para Gerson.

## 11. Otros cursos: qué cambia y qué no

Lo que no cambia en ningún curso: objeto reconocible en la primera pantalla, misión, predicción antes de ver, datos en
todo ejercicio (herramientas, no el paso hecho), ejemplos que suben de nivel con la figura sin la respuesta, colores
por papel, práctica por idea, lector en frío y auditor. Lo que se adapta:

| Curso | Qué es «dato» | Objeto de la primera pantalla | Notas de color y notación |
| --- | --- | --- | --- |
| Física | equivalencias, constantes (g, c), valores de academia (37°, 53°), fórmula | poste, combi, caja con cuerdas, plaza de Juliaca | §5b tal cual; vectores con flecha |
| Química | masas atómicas, R, Nₐ, condiciones normales, la fórmula (n = m/M) | frasco, balanza, olla, chompa mojada | los elementos tienen su paleta propia (`nucleo/elementos.js`); las variables usan §5b y no se mezclan con los colores de elemento en el mismo dibujo |
| Trigonometría y geometría | valores notables (sen 37° = 3/5), la definición de la razón, áreas y teoremas que se usan | escalera en la pared, poste y su sombra, rampa, terreno | los ángulos en carmín; los lados por papel (dato, dato, lo que se pide) |
| Álgebra y aritmética | la propiedad o fórmula que se usa (productos notables, regla de tres), equivalencias | balanza, fichas, precios del mercado | lo que se pide en violeta; los datos por papel |
| Razonamiento matemático | las reglas del problema escritas, sin el atajo | relojes, calendarios, fichas, mapas de cuadras | el papel de cada cantidad, igual que en física |
| Razonamiento verbal | la definición o el criterio que se aplica («idea principal: lo que el texto entero afirma del tema») | el texto mismo, corto y propio, con su contexto | tiene paleta propia de lectura (evidencia turquesa, distractor naranja, idea violeta; `docs/diseno.md`); los ejemplos resueltos son preguntas sobre textos breves con la evidencia marcada |

Etapa 2 del plan (`docs/plan-calidad.md` §7): `trigonometria.razones-trigonometricas-agudas`, `quimica.materia-y-energia`
y `razonamiento-verbal.tema-e-idea-principal`. Las tres ya tienen teoría de rondas anteriores (sin el contrato
completo) y práctica; se rehacen con `docs/metodo/unidad/`, empezando por la propuesta de ideas para Gerson.
