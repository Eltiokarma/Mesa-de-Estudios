# Guía para profesores

Laboratorio de Admisión · versión de prueba para el colegio piloto · noviembre de 2026

## 1. Qué es

Es una aplicación gratuita para preparar el examen de admisión de la universidad. Funciona en el navegador del celular o de la computadora, y también sin internet después de abrirla una vez. Tiene ocho cursos: física, química, aritmética, álgebra, geometría, trigonometría, razonamiento matemático y razonamiento verbal.

Su idea central es **predecir antes de ver**. En cada actividad, el alumno responde primero qué cree que va a pasar y recién después ve la explicación. Hay tres tipos de actividad:

- **Escenas:** una simulación que se mueve con el dedo o el mouse. Por ejemplo, un auto en una pista con sus gráficas, o un circuito con sus focos. Cada dato tiene su color, el mismo en el enunciado, en el dibujo y en la fórmula.
- **Prácticas:** preguntas rápidas en las que cada alternativa incorrecta es un error típico de los postulantes, con su explicación.
- **Lectura** (razonamiento verbal): textos cortos con preguntas tipo examen. Antes de ver las alternativas, el alumno hace un paso previo; por ejemplo, tocar la oración que mejor resume el texto. Hay textos y ejercicios sueltos (analogías, conectores, plan de redacción y otros), y módulos aparte para tipología textual, resumen, textos con gráficos, texto y contexto, textos científicos y filosóficos, y lectura en inglés.

Muchas unidades traen además un botón **✎ Papel**, con problemas para resolver en el cuaderno, sin la escena. Se pueden imprimir. En razonamiento verbal, el papel trae los textos con sus preguntas; el alumno tapa las alternativas mientras responde el paso previo.

## 2. Antes de la primera clase

1. **La dirección de la app.** Se la da el equipo del proyecto. Mientras la app no esté publicada en internet, el equipo la instala en el laboratorio del colegio.
2. **Un código para su colegio.** Elijan una palabra corta, sin espacios, por ejemplo `ABC` o `SANJOSE`. Ese código va en todos los datos y sirve para separar su colegio de otros. No identifica a ningún alumno.
3. **El enlace para los alumnos.** Es la dirección de la app con el código al final: `…/app/?colegio=ABC`. Compártanlo por WhatsApp o en un código QR en la pizarra. El alumno también puede escribir el código después, en **Perfil → Código del colegio**.
4. **Ábranla una vez con internet** en cada equipo. Desde ahí queda guardada y funciona sin conexión; en Perfil aparece "Lista para usar sin internet". En algunos celulares aparece además el botón **Instalar en este celular**, que la deja como una app más (en el iPhone no aparece; ahí se usa desde el navegador).

## 3. Cómo entran los alumnos

La primera vez, la app pide el nombre (solo para saludar), la universidad a la que postula (por ahora, UNI o San Marcos) y el grado. El nombre **no se guarda en los datos de medición**: cada equipo recibe un código anónimo al azar, del tipo `a3f9c01b2e`.

Desde **Inicio**, el alumno ve el «Reto de hoy» y lo que le sigue. Desde **Cursos**, elige un curso y una unidad, y en ella abre la escena, la práctica o la lectura.

## 4. Pruebas de entrada y de salida

Sirven para saber cuánto avanza cada grupo. No son nota, y la app se lo dice así al alumno.

No se confundan con las **prácticas** de algunas unidades, que traen su propia mini prueba de 3 preguntas al empezar y al terminar. Esas las maneja el alumno solo y no necesitan ningún enlace. Lo que sigue es sobre la **prueba del curso**.

**Prueba de entrada.** Aparece sola la primera vez que el alumno entra a un curso. Los cursos de ciencias y matemática tienen 10 preguntas y toman de 15 a 17 minutos; razonamiento verbal usa un texto corto con 3 preguntas. En ciencias y matemática, el alumno puede tocar **Ahora no**, y la prueba vuelve a aparecer cuando cierre y vuelva a abrir el navegador. En razonamiento verbal no hay "Ahora no": la entrada aparece al abrir la primera lectura. **No se le dice qué acertó**, para no enseñarle las respuestas antes de la salida.

**La opción «No sé».** Cada pregunta de las pruebas de entrada y salida trae, al final y sin letra, un botón **No sé**. Sirve para separar lo que el alumno sabe de lo que adivina: con 4 o 5 alternativas, un alumno que no sabe nada acierta, por suerte, 1 de cada 4 o 5 preguntas, y eso se confunde con conocimiento. «No sé» no descuenta nada: cuenta igual que una respuesta equivocada en el puntaje, pero no se anota como un error típico. Con teclado, es la tecla **0** o la **N**.

Antes de la entrada, dígales algo así: *«Si no lo sabes, marca No sé: nos ayuda más que adivinar. No es nota y no te baja nada.»* Pídales que lo usen con honestidad: si dudan entre dos alternativas y tienen una razón para elegir una, que la elijan; si no tienen ninguna idea, que marquen «No sé». En la salida vale lo mismo.

En las prácticas con problemas que se generan solos también está «No sé»: al tocarlo, el alumno ve la respuesta y la solución paso a paso, sin que se le marque error. En las escenas **no** hay «No sé», a propósito: ahí la idea es comprometerse con una predicción antes de ver qué pasa.

**Prueba de salida.** Solo aparece cuando **usted la abre**, con un enlace que reparte en clase, en cada equipo:

| Para abrir | Enlace |
| --- | --- |
| La salida de un curso | `…/app/?salida=fisica` |
| La salida de varios cursos | `…/app/?salida=fisica,quimica` |
| La salida de todos los cursos | `…/app/?salida=todas` |
| La revisión de soluciones de un curso (qué acertó y por qué) | `…/app/?soluciones=fisica` (no existe todavía en razonamiento verbal: ahí solo se ve el puntaje) |

Los nombres de los cursos para estos enlaces son: `fisica`, `quimica`, `aritmetica`, `algebra`, `geometria`, `trigonometria`, `razonamiento-matematico` y `razonamiento-verbal`.

Detalles importantes:

- La salida tiene preguntas **parecidas** a las de la entrada, no las mismas. Hay dos formas, A y B, y la app reparte el orden: la mitad de los alumnos empieza con la A y la otra mitad con la B. Así se puede comparar sin que nadie repita preguntas.
- Al terminar la salida, el alumno ve cuántas acertó antes y ahora. La revisión pregunta por pregunta aparece **solo si usted abrió `?soluciones=`**. Conviene abrirla después de que todo el grupo terminó la salida, para que las respuestas no circulen.
- Si un alumno no hizo la entrada, el enlace de salida lo lleva primero a la entrada.
- **La salida no se puede hacer el mismo día que la entrada.** Sin clases de por medio, el par no mide aprendizaje, y el análisis deja fuera esos pares. El alumno que hizo la entrada hoy ve «La prueba de salida se hace otro día».
- Cada prueba se hace **una sola vez**. "Borrar mi avance" no borra las pruebas de ningún curso.
- Lo que se abre con el enlace queda guardado en ese navegador, aunque cambie el alumno. No hay contraseña: el control es que el enlace lo reparte usted.

## 5. En el laboratorio de cómputo: «Otro alumno en esta PC»

Si varios alumnos usan la misma computadora en turnos, al terminar cada uno toca **Otro alumno en esta PC**. Está en Inicio (arriba a la derecha, en pantalla grande) y en Perfil.

1. Si hay registros sin descargar, la app ofrece **Descargar y cambiar**: baja el archivo de datos y deja la PC lista para el siguiente.
2. El siguiente alumno empieza desde cero, con otro código anónimo y sus propias pruebas de entrada y salida.
3. Se conservan el código del colegio y lo que usted abrió (salida y soluciones).

Si se cambia sin descargar, los datos del alumno anterior **siguen guardados en esa PC** y salen en la próxima descarga: el archivo de una PC trae los datos de todos los alumnos que la usaron, aunque su nombre lleve el código de uno solo. Pero si se borran los datos del navegador, se pierden, y cada navegador guarda como máximo 5000 registros (al pasarse, borra los más antiguos). **Descarguen al final de cada clase.**

## 6. Una clase de 45 minutos con una escena

Ejemplo con física, unidad de movimiento rectilíneo (escena de MRUV con sus gráficas). Sirve igual para cualquier escena.

| Minutos | Qué se hace |
| --- | --- |
| 0 a 5 | Plantee en la pizarra el problema de la escena, sin resolverlo. Pida a cada uno que escriba en el cuaderno qué cree que pasará. |
| 5 a 20 | Los alumnos abren la escena y siguen el **Paso a paso**. Cada predicción bloquea el avance hasta que se responde: déjelos equivocarse, porque la explicación del error es lo que enseña. |
| 20 a 30 | Ponga en común la pregunta en que más se equivocaron. Pregunte "¿por qué alguien elegiría esa opción?" antes de dar la respuesta. |
| 30 a 40 | **¿Qué pasa si…?** en parejas: cambian un dato, predicen y comprueban arrastrando. |
| 40 a 45 | Un problema del botón **✎ Papel**, en el cuaderno. |

Cuando terminen el curso, reserven unos 20 minutos de una clase para la prueba de salida (`?salida=fisica`).

Con una sola computadora y un proyector, la escena se usa igual: el grupo vota la predicción con la mano y un alumno la marca.

## 7. Cómo recoger los datos

1. En cada equipo: **Perfil → Datos para el profesor → Descargar datos para el profesor**. Se baja un archivo de datos con un nombre como `laboratorio-ABC-a3f9c01b2e-2026-12-09.json`. También se puede bajar en CSV, que se abre en Excel, pero ese archivo no sirve para el análisis: siempre hay que bajar el de datos.
2. Junten todos los archivos en una carpeta (por USB, correo o WhatsApp). Si un mismo registro se descargó dos veces, no se cuenta doble.
3. **Envíen la carpeta al equipo del proyecto**, que les devuelve un informe del grupo. Si alguien del colegio sabe usar Node.js, puede hacerlo él mismo (ver el recuadro).

> **Para el equipo técnico.** Con una copia del proyecto: `node herramientas/analizar-medicion.js carpeta/*.json`. Con `--csv todo.csv` antes de los archivos se obtiene además un CSV con todos los registros.

**Ejemplo del informe** (fragmento simplificado, con datos inventados de 3 alumnos de 4.º en física):

| Curso | Entrada | Salida | Alumnos con las dos pruebas | Ganancia normalizada ⟨g⟩ |
| --- | --- | --- | --- | --- |
| Física | 30 % | 67 % | 3 | 0,52 |

| Error típico | Alumnos que lo cometieron en la entrada | En la salida |
| --- | --- | --- |
| Divide la altura del punto entre el tiempo, como si la recta pasara por el origen | 3 | 1 |
| Toma la altura de la gráfica como si fuera la pendiente | 2 | 2 |

Cómo leerlo:

- **Solo cuentan los alumnos que hicieron las dos pruebas.** Así no se comparan grupos distintos.
- **La ganancia normalizada ⟨g⟩** (de Hake) es la parte de lo que les faltaba que aprendieron: (salida − entrada) / (1 − entrada). Si un grupo pasa del 30 % al 67 %, aprendió 0,52 (algo más de la mitad) de lo que le faltaba. Como referencia, Hake (1998) midió 0,23 en cursos tradicionales de física y 0,48 en cursos con participación activa.
- **«No sé» entrada / salida** es el porcentaje de preguntas que marcaron «No sé». Lo esperable es que baje de la entrada a la salida.
- **La confianza calibrada** es cuántas acertaron de las que sí intentaron (sin contar los «No sé»). Si el acierto sube poco pero la confianza calibrada sube mucho, el grupo adivina menos y sabe mejor cuándo sabe. En la ganancia ⟨g⟩, «No sé» cuenta como no acierto.
- **La tabla de errores** dice cuántos alumnos cometieron cada error típico antes y después. En el ejemplo, el primer error bajó y el segundo no: ese es el tema para reforzar en clase.
- El informe completo trae más columnas (por ejemplo, el resultado de cada forma de la prueba, A y B). Para razonamiento verbal trae otra tabla: los errores de lectura con su código (por ejemplo, RV1 "elegir un detalle como idea principal"), contados en el paso previo y en la respuesta.
- **Con pocos alumnos, las diferencias pueden ser azar.** Para sacar conclusiones, sirven más los datos de todo el grado que los de una sección.

## 8. Qué mide y qué no guarda

**Mide**, en cada equipo:

- cada predicción y cada respuesta de práctica, con el error elegido;
- los pasos previos de lectura y el tiempo que se tardó en leer;
- las pruebas de entrada y salida, pregunta por pregunta (incluido cuándo marcó «No sé»);
- cuándo usted abrió la salida o las soluciones.

**No guarda** el nombre del alumno ni ningún dato personal: solo el código anónimo del equipo, el grado y el código del colegio. **No envía sus respuestas ni ningún dato por internet**: los datos se quedan en el equipo hasta que alguien toca "Descargar".

## 9. Lo que la app no hace

- **No pone notas** ni reemplaza la evaluación del profesor. Las pruebas miden al grupo.
- **No corrige con inteligencia artificial.** Cada respuesta correcta está calculada y revisada antes de entrar a la app, y cada error tiene su explicación escrita.
- **No reemplaza la clase.** Funciona mejor cuando el profesor pone en común los errores (sección 6).
- **No guarda los datos en ningún servidor.** Si se borra el navegador o se pierde el celular antes de descargar, esos datos se pierden.
- **No controla quién abre la salida.** Si un alumno consigue el enlace `?salida=`, puede abrirla antes de tiempo. Por eso conviene repartirlo en el momento, en el aula.
- **Todavía no tiene todo el temario.** Algunas unidades aún no tienen actividad; las que sí, se ven marcadas en la lista del curso.

## 10. Problemas frecuentes

| Problema | Qué hacer |
| --- | --- |
| "No se pudieron cargar los problemas" | Abrir esa pantalla una vez con internet; después funciona sin conexión. |
| La prueba de entrada aparece cada vez | Es a propósito, hasta que el alumno la haga. "Ahora no" la pospone hasta que se cierre el navegador. |
| El alumno no ve la prueba de salida | Abrir en ese equipo el enlace `…/app/?salida=<curso>`. |
| Dos alumnos se mezclaron en una PC | Desde ahora, "Otro alumno en esta PC" al cambiar de turno. Lo anterior no se puede separar. |
| Un archivo se llama `laboratorio-sin-colegio-…` | Ese equipo no tenía el código: escribirlo en Perfil → Código del colegio. Los registros anteriores quedan sin código, pero igual entran al informe. |
