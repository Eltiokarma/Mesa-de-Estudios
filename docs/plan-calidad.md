# Plan de calidad: cada idea se entiende sin profesor (16 nov 2026)

Este documento manda sobre la producción de teoría desde hoy. Lo lee quien vaya a ejecutar el trabajo, que no estuvo en la conversación donde se decidió. Reemplaza las rondas en paralelo (`docs/teoria.md`, sección 9) y deja en pausa lo que quedaba de la ronda 6.

## 1. Qué pasó

Gerson probó la app publicada y encontró tres pantallas de `fisica.magnitudes-y-vectores` que no se entienden sin un profesor al lado:

- **«Otra unidad, otro número».** El texto habla de un lápiz (después, de un elástico) y en la pantalla solo hay una barra naranja sobre una recta. Al cambiar de metro a centímetro, una regla reemplaza a la otra: no se pueden comparar, y comparar era la idea.
- **«Las dimensiones deben cuadrar».** «Fichas» y «huecas que dividen» son una metáfora inventada que nadie explica. El juego no tiene meta y la lectura dice cosas como «L⁻² T⁻¹: sin nombre en el SI».
- **«La resultante depende del ángulo».** A, B y R no llevan flecha de vector. No dice cuánto vale A, qué es θ ni qué es el semicírculo gris. La lectura «R = 8,72 (A + B = 10)» no trae unidades ni explica el paréntesis.

No son tres excepciones. Dos medidas sobre todo el contenido (`contenido/teoria/`, 16 nov):

- De 1083 consignas, **72 (7 %) tienen una pregunta**. El resto son órdenes: 237 empiezan con «Elige» y 130 con «Arrastra».
- Las piezas más usadas son ejes (213 usos), figura geométrica (149), plano trigonométrico (128), tablas y recta numérica (96). Casi todo es diagrama de libro; casi nada es un objeto que un alumno reconozca.

### Por qué se repite

1. **Se diseña desde la fórmula.** Se parte de la variable que se puede deslizar y se dibuja el diagrama del libro, no una situación del mundo.
2. **La consigna explica los botones, no el sentido.** «Cambia X, mira Y» no es una pregunta ni una meta.
3. **Los controles miden forma.** El validador cuenta palabras, colores, ids y semillas. Las capturas se miran para ver si algo se rompió. Nada pregunta si un alumno solo lo entiende.
4. **El autor se revisa a sí mismo.** `docs/auditoria-teoria.md` (14 nov) concluyó «¿Se entiende? Sí» sobre las mismas unidades que Gerson no entendió dos días después. Quien escribió la pantalla ya sabe qué quiso decir y no ve lo que falta.
5. **Se produjo a lo ancho.** Las 152 unidades salieron de rondas de hasta 16 sesiones en paralelo que copiaban un molde, antes de comprobar una sola unidad con una persona. El molde multiplicó el defecto.
6. **Una regla sirvió de excusa.** «Los vectores son de Gerson» (CLAUDE.md, 13 nov) dejó barras abstractas donde hacía falta un objeto.

## 2. Decisiones de Gerson (16 nov)

| Decisión | Qué cambia |
| --- | --- |
| La app es para **5.º de secundaria y preuniversitario**. | Ya no hay alumnos de 3.º y 4.º. La bienvenida no pregunta el grado como hoy, y las etiquetas «Tu grado», «Repaso» y «Adelanto» pierden sentido. Ver 6, M7. |
| La visión es **por ramas**: un conocimiento previo abre el siguiente. | El mapa del curso (`nucleo/mapa.js`, `ramas` y `requiere` en `catalogo/cursos`) pasa a ser la estructura de toda la app, no solo una vista. Falta decidir qué significa «abrir» (sección 9, decisión 1). |
| **Se hacen las 152 unidades**, pero una por una y en detalle, no en bloque. | Se acaban las rondas en paralelo por curso. El orden lo da el árbol (sección 7). |
| **Dibujos SVG de prueba, ya.** «No importa si es de prueba, ponlo.» El primero: un poste de luz medido con reglas de distintas escalas. | La sesión dibuja los objetos que hagan falta, marcados como de prueba. Gerson los reemplaza después si quiere. Cambia la regla «Vectores y Rive» de CLAUDE.md para los SVG; Rive de pago se sigue pidiendo. |

Lo que no cambia: las seis reglas de CLAUDE.md. El cálculo sigue en el motor, se juega antes de predecir, hay un color por variable y el contenido es propio.

## 3. El contrato: qué es «se entiende sin profesor»

Una idea está bien cuando un alumno de 5.º, solo y con el celular, puede responder estas preguntas mirando la pantalla. Cada punto nombra el defecto que evita.

1. **¿Qué es esto que veo?** Hay un objeto o una situación reconocible dibujada: un poste, dos personas jalando una caja, una combi. El diagrama abstracto (ejes, flechas sueltas) llega después del objeto o al lado, nunca solo en la primera pantalla de la idea.
2. **¿Qué tengo que lograr?** «Juega» trae una **misión** que se puede cumplir y que el motor comprueba: «Haz que R mida exactamente 10 N. ¿Cuánto vale el ángulo?». La consigna es una frase de contexto más la misión. No describe los botones.
3. **¿Qué significa cada símbolo?** Todo símbolo que aparece en la figura o en la lectura se dice en palabras la primera vez, en la misma pantalla: «θ: el ángulo entre A y B», «A = 6 N». Todo número lleva su unidad.
4. **¿Qué cambió?** Lo que se compara se ve junto: lado a lado, o el caso anterior queda como rastro. Nunca un dibujo que reemplaza a otro si la idea es compararlos.
5. **¿Está bien escrito?** Los vectores llevan flecha y su módulo no. Los ángulos llevan «°» y, en un reemplazo numérico, conservan su función: `25 · cos 53° = 25 · 0,6`. Un color por variable.
6. **¿Hay algo inventado?** Ninguna metáfora propia sin presentar («fichas huecas»). Si hace falta una, «Lee» la presenta con su dibujo antes del juego.
7. **¿La lectura dice algo?** La lectura en vivo enuncia la relación («2,5 m = 25 dm = 250 cm»), no repite un dato ni muestra una combinación sin sentido.
8. **¿La pantalla está bien usada?** Ningún cuadro ocupa más espacio que su texto. La figura es lo más grande. En pantalla ancha, el espacio libre se usa para comparar dos casos.
9. **¿El orden es el correcto?** Ninguna idea usa un concepto que una idea posterior presenta. Lo mismo entre unidades: lo que la unidad da por sabido está en su `requiere`.
10. **¿Es creíble?** Las medidas y las situaciones son posibles (un lápiz de 2,5 m no lo es).
11. **¿Sé de qué idea es cada cosa?** Cada mesa del laboratorio dice qué idea practica, y cada término del glosario trae 3 ejemplos o más (Gerson, 16 nov).
12. **¿El Resumen me da de dónde agarrarme?** Cada idea dice qué voy a hacer en el juego y estrena de 2 a 4 palabras con una aproximación de todos los días, no la definición técnica (Gerson, 16 nov: «se sienten que caen en nada»). La figura lleva su leyenda.

El público es 5.º y preuniversitario. La unidad parte de la base, porque muchos llegan con huecos, pero «Así se resuelve» y «Ahora tú» terminan en el nivel de un examen de admisión.

## 4. Cómo se comprueba: tres filtros

Ningún filtro lo aplica solo quien escribió la unidad.

### Filtro 1: el validador (automático)

Lo que una máquina puede comprobar entra en `nucleo/teoria.js` y corre con `npm test`:

- cada «Juega» tiene `mision` con `logrado`, y un testigo la cumple;
- cada idea declara `aprendizaje`: una frase con lo que el alumno debe poder decir al terminar el juego (la usa el filtro 2; no se muestra);
- cada idea declara `actividad` (qué va a hacer en el juego) y estrena de 2 a 4 términos del glosario con `simple` (su aproximación de todos los días); el Resumen los muestra;
- cada símbolo de la lectura y de la figura está en la `leyenda` de la idea;
- en física, las magnitudes declaradas como vector se escriben con `{ vec }` en ecuaciones y rótulos;
- la figura de la primera pantalla incluye al menos un objeto del kit de objetos (M4), o la idea declara `sinObjeto` con el motivo (por ejemplo, lógica proposicional).

Esto solo evita que el contrato se olvide. No prueba que se entienda.

### Filtro 2: el lector en frío

Un agente nuevo, sin contexto, hace de alumno de 5.º. Recibe **solo las capturas** de cada momento (360 × 780 y 1280 × 860): ni el código, ni el archivo de la unidad, ni la frase de `aprendizaje`. Responde por escrito, pantalla por pantalla:

1. ¿Qué ves? Nombra cada cosa del dibujo.
2. ¿Qué te piden hacer?
3. ¿Qué significa cada letra o símbolo?
4. Después de jugar: ¿qué aprendiste, en una frase?
5. ¿Qué no entendiste o te hizo dudar?

Quien integra compara la respuesta 4 con `aprendizaje`. La idea no pasa si no coinciden, si la respuesta 1 o la 3 tienen un «no sé», o si la 5 señala algo. Se corrige y se vuelve a pasar con un lector nuevo, porque uno que ya vio la pantalla anterior deja de servir. Las respuestas quedan en `rutinas/frio/<unidad>.md`.

Límite conocido: un modelo lee mejor que un alumno de 16 años. Si el lector en frío no entiende, el alumno tampoco. Si entiende, todavía no se sabe. Por eso existe el filtro 3.

### Filtro 3: personas

- **Gerson** revisa una galería de antes y después por unidad: una página con las capturas de cada idea, que se abre en el celular. Aprueba o comenta idea por idea. En la etapa 3 revisa por rama, no por unidad, para no volverse el cuello de botella.
- **Alumnos reales**, apenas se pueda: dos o tres chicos de 5.º o de academia recorren las unidades del molde sin ayuda, y alguien anota dónde se traban. Es la única prueba de verdad (sección 9, decisión 4).

## 5. Qué entrega cada unidad

- La unidad rehecha contra el contrato, con «Lee» y «Así se resuelve» en todas sus ideas. Las 59 unidades que la ronda 6 dejó sin esos momentos los reciben aquí, cuando les toque su turno.
- Los ángulos y vectores de sus ejercicios de práctica (`plantillas/` de la unidad) revisados con las mismas reglas del punto 5 del contrato.
- `rutinas/frio/<unidad>.md` con el lector en frío aprobado.
- La galería de antes y después.
- `npm test` en verde. Un commit por unidad, a `main` y a la rama de trabajo.

## 6. Lo que hay que construir en el molde

Se construye mientras se rehace la primera unidad (etapa 1), con un caso real que lo pida. No antes ni en abstracto.

| | Pieza | Qué es |
| --- | --- | --- |
| M1 | Misión en «Juega» | Campo `juego.mision { texto, logrado, bien, testigo }`. Reusa el mecanismo de los retos del laboratorio (`mesa.invitaciones`, `docs/teoria.md` 4d). El lector la muestra como meta con su marca de logrado. «Ya probé, sigo» no se bloquea (regla 3: el único bloqueo es la predicción). Evento de medición aparte. |
| M2 | Leyenda | Los símbolos de la idea con su nombre en palabras, visibles junto a la figura la primera vez. |
| M3 | Comparar | La pieza `recta` con varias reglas a la vez; el caso anterior como rastro; en pantalla ancha, dos casos lado a lado. |
| M4 | Objetos SVG de prueba | `nucleo/kit/objetos/`: poste de luz, regla graduada, persona, caja, soga, combi y lo que pida cada unidad. Se dibujan con el skill `arte-generativo-svg`. Cada uno marcado `prueba: true`, y la lista vive en `docs/encargo-vectores.md` para que Gerson decida cuáles reemplaza. |
| M5 | Notación de vectores | Rótulos con flecha en la pieza de flechas. `{ vec }` ya existe en `nucleo/ecuacion.js`. |
| M6 | Pantalla | La consigna ocupa lo que mide su texto; la figura crece; pantalla ancha. Se revisa con el skill `diseno-y-animacion`. |
| M7 | Mapa como estructura | Quitar la pregunta del grado y sus etiquetas (hoy en bienvenida, perfil, mapa y cola de «Lo que sigue»). La regla de «abrir» según la decisión 1. «Lo que sigue» del inicio usa el árbol. El campo `grado` se queda en el catálogo como dato y la prueba de requisitos lo sigue usando. |
| M8 | Lector en frío | `herramientas/lector-frio.js`: saca las capturas de todos los momentos de una unidad a una carpeta, sin texto de ayuda. Más el encargo fijo del lector (las cinco preguntas) y la plantilla de la galería. |

## 7. Orden de trabajo

### Etapa 0: dejar las decisiones escritas

- Gerson respondió las decisiones 1 y 2 de la sección 9 (16 nov).
- Se actualizan `CLAUDE.md` (público, regla de los SVG de prueba), `docs/teoria.md` (el contrato de la sección 3 pasa a ser parte del formato) y `docs/vision-futura.md` (3.º y 4.º pasan ahí).

### Etapa 1: una unidad de punta a punta

`fisica.magnitudes-y-vectores`, la raíz de física y donde Gerson encontró los tres casos.

1. **Primero una sola idea:** «Otra unidad, otro número», con el poste de luz y tres reglas en SVG a la vez (metro, decímetro, centímetro), misión, leyenda y lectura que diga la relación. Pasa los filtros 1 y 2. Gerson la ve y aprueba o corrige. **Nada más avanza hasta ese visto bueno.**
2. **Propuesta de orden de las ideas** de la unidad, para que Gerson la apruebe antes de escribirlas. Él ya señaló que el vector unitario va antes que el resto de vectores. La unidad junta hoy unidades de medida, análisis dimensional y vectores; hay que decidir si eso es una unidad o dos. Los `id` publicados no se cambian: si se parte, se agrega una unidad nueva.
3. **El resto de las ideas**, una por una. Las dimensiones, como una balanza entre los dos lados de una fórmula real. La resultante, con dos personas jalando una caja, vectores con flecha y la comparación de R con A + B y A − B a la vista.
4. Filtro 3 completo: galería y visto bueno de Gerson a la unidad.

Al cerrar la etapa se anota cuánto costó la unidad en tiempo y en uso. Con ese número se estima el resto; antes no hay base para prometer fechas.

### Etapa 2: probar que el molde no es solo de física

Tres unidades más, de tipos distintos, elegidas porque están al inicio del árbol:

- `trigonometria.razones-trigonometricas-agudas`: figura matemática, y requisito directo de vectores.
- `quimica.materia-y-energia`: raíz de química; partículas y clasificación, sin fórmulas.
- `razonamiento-verbal.tema-e-idea-principal`: texto. Aquí «objeto reconocible» y «misión» significan otra cosa, y hay que definirlo.

Lo que el contrato no cubra en estos tres casos se corrige en el contrato, no con excepciones calladas. Si se consiguen alumnos, se prueban estas cuatro unidades con ellos antes de seguir.

### Etapa 3: las 148 restantes, por el árbol

- **Orden:** rama por rama, del primer piso hacia abajo. Primero la rama de entrada de cada curso (Mecánica, Materia y átomo, Números y operaciones, Geometría plana, Ángulos y razones, Expresiones algebraicas, Lógica, Palabras), para que quien entre a cualquier curso empiece bien. Después las ramas que se apoyan en esas.
- **Ritmo:** una unidad a la vez por sesión. Como máximo dos sesiones en simultáneo, cada una en una rama distinta, y solo si la etapa 2 salió bien. Nunca más rondas de 16.
- **Revisión:** cada unidad pasa los filtros 1 y 2. Gerson revisa la galería de cada rama al cerrarla y abre al azar una unidad completa. Si una rama sale mal, se detiene todo y se corrige el contrato antes de seguir.
- **Requisitos:** al rehacer cada unidad se confirma o corrige su `requiere`, que hoy es una estimación.

## 8. Qué no se hace mientras tanto

- No se relanza la ronda 6 ni ninguna ronda en bloque.
- No se agregan funciones nuevas (más 3D, Rive, ejercicios masivos) hasta cerrar la etapa 2.
- No se cambian los `id` de unidades, ideas ni controles: el avance de los alumnos se guarda con ellos.
- No se declara «se entiende» por una revisión del propio autor.

## 9. Decisiones de Gerson sobre el plan (16 nov, «vamos con lo que recomiendas»)

1. **Un conocimiento abre el siguiente.** Un tema se abre cuando su requisito **del mismo curso** está hecho: terminó su teoría (o la marcó como estudiada) **o** aprobó su prueba del tema con 80 % o más («ya me lo sé»). Así un preuniversitario que ya sabe vectores no queda encerrado, y el que no sabe tiene un camino claro.
   - Los requisitos de **otro curso** no cierran nada: se muestran como consejo («Antes: …»). Si cerraran, toda la física quedaría detrás de trigonometría.
   - Las raíces de cada curso están siempre abiertas.
   - Lo que el alumno ya empezó (abrió, estudió o probó) no se le vuelve a cerrar.
   - Un tema cerrado no se esconde: se ve en el mapa con su candado, y al tocarlo dice qué falta, con dos caminos («Estudiar…» o «Ya lo sé: dar la prueba de…»).
   - Esto reemplaza, solo para el mapa, la decisión del 15 nov de que nada bloquea. La prueba del tema sigue siendo opcional y nunca se impone.
2. **La bienvenida ya no pregunta el grado.** Pregunta «5.º de secundaria» o «Academia o egresado». Sirve solo para la medición; no cambia lo que se ve. Las etiquetas «Tu grado», «Repaso» y «Adelanto» se van.
3. **Magnitudes y vectores se parte en dos unidades** (16 nov):
   - **«Magnitudes y unidades»** conserva el id `fisica.magnitudes-y-vectores`, porque el avance se guarda con él. Sus ideas: cambiar de unidad (hecha), áreas y volúmenes (nueva) y dimensiones.
   - **«Vectores»** es una unidad nueva, `fisica.vectores`. Sus ideas: escalar o vector (nueva), unitario y componentes, resultante y productos.
   - En el mapa quedan Magnitudes → Vectores → Movimiento rectilíneo y Estática. Vectores pide las razones trigonométricas; Magnitudes ya no pide nada.
   - `Avance.migrar` pasa a la unidad nueva lo que el alumno ya había hecho en las ideas y mesas de vectores, su visita y su «Ya la estudié».
   - El catálogo tiene ahora 153 unidades.
4. **Alumnos para probar:** sin respuesta todavía. Mientras tanto valen el lector en frío y Gerson.

## 10. Riesgos

- **El lector en frío no es un alumno.** Filtra lo que está claramente mal; lo demás solo lo dicen personas.
- **Costo.** Rehacer en detalle es más lento que una ronda. El número real sale de la etapa 1. El límite semanal de uso se repone el 19 nov a las 9:00 UTC; hasta entonces trabaja una sola sesión.
- **Rehacer piezas del kit puede romper unidades que ya las usan.** Las piezas nuevas (reglas múltiples, objetos) se agregan como opciones; las existentes no cambian su comportamiento. `npm test` (8794 pruebas) corre antes de cada envío.
- **Vercel no publicó dos envíos a `main` el 16 nov** y hubo que desplegar a mano. Después de cada envío se comprueba la versión publicada (`VERSION` en `/app/sw.js`).
