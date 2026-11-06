# Formato lectura

6 de noviembre de 2026 · Propuesta de diseño para la tarea pl4 de la hoja de ruta

Es el tercer formato de `docs/arquitectura.md`, junto a "escena" y "predicciones", y sirve para razonamiento verbal: textos con preguntas, donde cada alternativa incorrecta es un error con nombre. Los errores salen de `docs/investigacion/razonamiento-verbal-ideas-erroneas.md` (códigos RV1 a RV32).

**Es una propuesta.** No toca `nucleo/`, `app/` ni `catalogo/`: eso lo implementa la conversación principal. Lo que sí queda fijo desde ahora es el **formato JSON del banco** (sección 5), porque los textos de `contenido/razonamiento-verbal/` se escriben con él.

## 1. Qué tiene que cumplir

Las seis reglas de `CLAUDE.md`, traducidas a lectura:

| Regla | En lectura |
| --- | --- |
| 1. El cálculo vive en el motor | No hay física, pero vale lo mismo: la respuesta correcta y el código de cada distractor los fija el banco, escrito y revisado a mano. Ningún modelo de lenguaje decide en la app qué alternativa es la correcta. |
| 2. Casos de prueba | Una prueba (`banco.test.js`) valida cada texto: una sola correcta, códigos RV que existen en el informe, evidencia que apunta a oraciones reales, de 150 a 350 palabras. Además, cada texto pasa una revisión independiente que se anota en el propio JSON. |
| 3. Predecir antes de ver | Cada texto tiene al menos un **paso previo** obligatorio antes de las alternativas (sección 3). Las alternativas no se muestran hasta responderlo. |
| 4. Un color por variable | En la explicación, la idea principal, la evidencia y el origen del distractor se pintan en el texto con un color cada uno (sección 4). |
| 5. Contenido propio | Textos escritos para la app. Cada texto declara su origen y las fuentes de los datos que menciona, para verificar los hechos, no para copiar el texto. |
| 6. Lápiz y papel | El mismo banco se imprime como hoja de trabajo: texto, preguntas y alternativas, sin explicaciones; las respuestas van en otra hoja para el profesor. |

## 2. Cómo se ve (celular primero)

### Flujo de una sesión

Igual que en `app/practica.js`, para que la medición se compare entre formatos:

1. **Prueba de entrada:** un texto corto con 3 preguntas, el mismo para todos, sin corrección inmediata.
2. **Práctica:** texto por texto. Por cada texto: leer, paso previo, preguntas con explicación.
3. **Prueba de salida:** un texto paralelo al de entrada (mismo tipo de preguntas y dificultad parecida, con otro tema), cuando el alumno ya hizo al menos 3 textos.

Los textos de práctica salen en el orden del banco, filtrados por la unidad que el alumno abrió. Un texto ya hecho no se repite hasta que se acaben los demás.

### Pantalla de lectura

```
┌──────────────────────────────┐
│ ‹  Razonamiento verbal       │
│ El frío que conserva         │
│ Texto 4 · unos 2 minutos     │
├──────────────────────────────┤
│ ① En las punas del sur       │
│ andino, las heladas de junio │
│ pueden arruinar…             │
│                              │
│ ② El resultado es el chuño…  │
│                              │
│ [   Ya lo leí: ir a las      │
│     preguntas   ›   ]        │
└──────────────────────────────┘
```

- **El texto solo, primero.** Letra de 18 px, interlineado de 1,6 y a lo sumo 65 caracteres por línea. Los párrafos llevan su número en un círculo (①, ②), porque las explicaciones los citan ("en el párrafo 2…").
- **Ya lo leí.** El botón queda al final del texto. Se registra el tiempo de lectura (sección 6). No hay cronómetro visible: en un celular de gama baja, en el patio, la presión no ayuda.
- **Durante las preguntas, el texto no desaparece.** Queda plegado en una franja fija arriba, de unos 56 px, con el título y "Ver texto ▾". Al tocarla se abre una hoja que sube desde abajo y ocupa el 85 % de la pantalla, con el texto completo y desplazable. Se cierra deslizando hacia abajo o con "Volver a la pregunta". Así el alumno relee sin perder la pregunta, como en el examen de papel, donde el texto está siempre a la vista.
- **Una pregunta por pantalla**, con su número ("Pregunta 2 de 4") y los mismos botones `.alt` de la práctica (letra A–E, estados `ok` y `mal`).

### Pantalla grande (laboratorio de cómputo, desde 900 px)

- **Dos columnas.** El texto va a la izquierda, fijo y desplazable por su cuenta (unos 480 px). A la derecha, la pregunta, el paso previo y la explicación (unos 520 px). No hace falta la hoja que sube.
- **Teclado.** Como en la práctica: A–E o 1–5 eligen, Enter sigue. En el paso de marcar una oración, las flechas ↑ y ↓ recorren las oraciones y Enter elige. Las oraciones son botones enfocables, así que también funciona con lector de pantalla.

## 3. Predecir antes de ver: el paso previo

Antes de ver las alternativas, el alumno se compromete con una respuesta propia, sin pistas. Es lo que distingue este formato de un banco de preguntas común: el error se mide **sin que una alternativa lo sugiera**. Si el alumno marca un detalle como idea principal en el paso previo, es RV1 de verdad, y no un eco de la alternativa (RV5).

Cada texto tiene **al menos un paso previo**. Los recomendados son los de la idea principal y los conectores. Los demás son opcionales, para no alargar demasiado cada texto. Los tipos:

| Tipo | Cuándo | Qué hace el alumno | Cómo se califica | Error si falla |
| --- | --- | --- | --- | --- |
| `marcar-oracion` | Idea principal o tema central | Toca la oración que mejor resume el texto. Si la idea no está dicha en ninguna, toca "Ninguna la dice completa". | Cada oración del texto lleva un `rol` en el JSON. La respuesta es correcta si el rol es `principal` o, cuando el texto dice `idea_implicita: true`, si elige "Ninguna". | Rol `detalle` o `ejemplo` → RV1; `general` → RV2; la primera oración sin ser principal → RV4; otra cosa → el código que diga el rol |
| `clasificar` | Inferencia, compatibilidad, extrapolación | Ve una afirmación (la "sonda", escrita en el banco) y elige: **Lo dice el texto · Se deduce · No se puede saber · Lo contradice**. | La sonda trae su clase correcta y un código por cada clase incorrecta. | Por ejemplo, "Lo dice" cuando se deduce → RV6; "Se deduce" cuando no se puede saber → RV7 u RV8 |
| `relacion` | Conectores, oraciones incompletas, plan de redacción | Antes de ver los conectores, elige la relación entre las dos partes: **suma · contraste · causa · consecuencia · concesión · ejemplo**. | La relación correcta y un código para cada relación incorrecta. | "Consecuencia" donde hay contraste → RV24; "suma" donde hay contraste → RV26 |
| `relacion-analogia` | Analogías (ejercicios sueltos, sección 5.3) | Elige la relación de la pareja base: **sinónimo · antónimo · parte y todo · especie y género · causa y efecto · agente e instrumento · producto y productor · lugar**. | Igual que `relacion`. | Elegir una relación de la palabra C con la opción, y no la de la pareja → RV15 |
| `proposito` | Intención del autor | Elige **informar · explicar · convencer · narrar · criticar**. | Igual que `relacion`. | "Narrar" cuando la anécdota es un medio → RV13 |

El paso previo **no se corrige en el momento**: se guarda la respuesta y se pasa a las alternativas. La corrección aparece en la explicación final, junto a la de la pregunta ("Antes marcaste la oración 3: es un detalle del procedimiento, no la idea que lo junta todo"). Así no se le revela la respuesta antes de que elija entre las alternativas.

## 4. La explicación: que se vea en el texto (regla 4)

Después de elegir, la pantalla muestra:

1. **El veredicto**, igual que en la práctica: "¡Bien! …" o "Elegiste la B. La correcta es la D: …". Siempre con texto, nunca solo con el color.
2. **Por qué falla la que eligió**: la explicación de ese distractor y, en una línea aparte, qué error es, en lenguaje de alumno y sin el código ("Elegiste un detalle verdadero, pero el texto habla de algo más amplio").
3. **El texto se pinta**, abierto en la hoja o en la columna de la izquierda:
   - las oraciones de la **evidencia** de la correcta, subrayadas en el color de la correcta;
   - la oración de donde sale el distractor elegido (su `origen`), si la tiene, en el color del distractor;
   - en idea principal, la oración principal o las oraciones que se juntan para armarla.
4. **"Ver las demás alternativas"**, plegado: la explicación de cada una. Sirve para el profesor y para el alumno que quiere entender todo el ítem.

**Colores (propuesta, la decide `docs/diseno.md`):** se necesitan tres roles, que nunca aparecen como decoración.

| Rol | Uso | Propuesta |
| --- | --- | --- |
| `evidencia` | Lo que prueba la correcta | Verde de `--ok`, como subrayado grueso, no como fondo, para que no se confunda con "bien" |
| `distractor` | De dónde sale lo que eligió el alumno | Naranja `--c-o` |
| `idea` | La idea principal en el paso previo | Turquesa `--c-i` |

Los tres van como subrayado de 3 px y un fondo muy suave, para que el texto se siga leyendo bien. Pasan el contraste AA porque la letra queda en tinta.

**Regla de redacción:** las explicaciones nunca nombran letras ("la B es incorrecta"), porque las alternativas se barajan para cada alumno. Se refieren al contenido ("decir que el chuño es el más nutritivo…").

## 5. El banco: formato JSON

### 5.1 Dónde vive

```
contenido/razonamiento-verbal/
  indice.json          lista de textos y ejercicios, en orden; marca los de entrada y salida
  textos/t001.json     un archivo por texto (así se revisa y se corrige uno por uno)
  textos/t002.json
  …
  ejercicios/e001.json ítems sueltos: analogías, conectores, plan de redacción…
  banco.test.js        valida todo el banco con npm test
  LEEME.md             cómo escribir un texto nuevo (resumen de esta sección)
```

`indice.json`:

```json
{
  "version": "0.1.0",
  "entrada": "t000a",
  "salida": "t000b",
  "textos": ["t001", "t002", "t003"],
  "ejercicios": []
}
```

### 5.2 Un texto

Ejemplo completo, propio. Sirve para mostrar el formato; si pasa la revisión, puede entrar al banco como el primer texto.

```json
{
  "id": "t001",
  "titulo": "El frío que conserva",
  "tema": "Perú andino · tecnología tradicional",
  "nivel": 1,
  "tipo_texto": "expositivo",
  "idea_implicita": false,
  "parrafos": [
    [
      { "id": "o1", "rol": "contraste", "t": "En las punas del sur andino, las heladas de junio pueden arruinar una chacra de papa en una sola noche." },
      { "id": "o2", "rol": "apoyo", "t": "Sin embargo, las familias aymaras y quechuas convirtieron ese mismo frío en una herramienta." },
      { "id": "o3", "rol": "detalle", "t": "Desde hace siglos, extienden las papas sobre el pasto para que se congelen de noche y se descongelen con el sol del día." },
      { "id": "o4", "rol": "detalle", "t": "Cada ciclo de congelar y descongelar rompe las células del tubérculo, y el agua sale con más facilidad." },
      { "id": "o5", "rol": "detalle", "t": "Después, pisan las papas para exprimirles el agua que les queda." }
    ],
    [
      { "id": "o6", "rol": "detalle", "t": "El resultado es el chuño, un alimento liviano que puede guardarse varios años sin malograrse." },
      { "id": "o7", "rol": "detalle", "t": "Como ha perdido casi toda su agua, pesa mucho menos que la papa fresca y se lleva con facilidad en largos viajes." },
      { "id": "o8", "rol": "detalle", "t": "Por eso, en los años de mala cosecha, el chuño guardado ha servido como reserva contra el hambre." },
      { "id": "o9", "rol": "principal", "t": "Lo que para una planta en la chacra es una amenaza, para la papa ya cosechada se vuelve una forma de conservarla." }
    ]
  ],
  "preguntas": [
    {
      "id": "p1",
      "tipo": "idea-principal",
      "unidad": "razonamiento-verbal.tema-e-idea-principal",
      "previo": { "tipo": "marcar-oracion", "pide": "Antes de ver las alternativas, toca la oración que mejor resume todo el texto." },
      "enunciado": "¿Cuál es la idea principal del texto?",
      "alternativas": [
        { "t": "Las comunidades andinas aprovechan la helada, que daña los cultivos, para conservar la papa como chuño.",
          "correcta": true, "evidencia": ["o2", "o9"],
          "explicacion": "Junta las dos partes del texto: la helada como amenaza para la chacra y como medio para conservar la papa." },
        { "t": "Las papas se pisan para sacarles el agua que les queda.",
          "codigo": "RV1", "origen": "o5",
          "explicacion": "Es verdad, pero es un paso del procedimiento. El texto lo cuenta para explicar algo más amplio." },
        { "t": "La agricultura andina depende del clima.",
          "codigo": "RV2",
          "explicacion": "Es demasiado general: el texto no habla de toda la agricultura, sino de la helada y de la papa." },
        { "t": "Las heladas de junio pueden arruinar una chacra de papa.",
          "codigo": "RV3", "origen": "o1",
          "explicacion": "Se queda con la mitad del texto. Falta lo principal: que ese mismo frío sirve para conservar." },
        { "t": "El chuño es el alimento más nutritivo de los Andes.",
          "codigo": "RV8",
          "explicacion": "El texto no dice nada sobre lo nutritivo que es el chuño. Responde con algo que se cree, no con lo que se leyó." }
      ]
    },
    {
      "id": "p2",
      "tipo": "sentido-contextual",
      "unidad": "razonamiento-verbal.sentido-contextual",
      "enunciado": "En el texto, la palabra HERRAMIENTA significa",
      "alternativas": [
        { "t": "un recurso que se aprovecha.", "correcta": true, "evidencia": ["o2", "o3"],
          "explicacion": "El frío no es un objeto: es algo que las familias usan a su favor para conservar la papa." },
        { "t": "un instrumento para labrar la tierra.", "codigo": "RV18", "origen": "o2",
          "explicacion": "Es el sentido más común de la palabra, pero aquí no se habla de un objeto, sino del frío." },
        { "t": "una costumbre de los antepasados.", "codigo": "RV19",
          "explicacion": "El texto dice que la práctica es antigua, pero \"herramienta\" no significa costumbre: nombra algo que se usa para lograr un fin." },
        { "t": "un peligro para la chacra.", "codigo": "RV24", "origen": "o1",
          "explicacion": "Es lo contrario: el \"Sin embargo\" de la oración 2 anuncia que el frío, que era un peligro, ahora se usa a favor." }
      ]
    }
  ],
  "origen": "propio",
  "autor": "rutina de razonamiento verbal",
  "fecha": "2026-11-06",
  "hechos": [
    { "afirmacion": "El chuño se elabora congelando de noche y descongelando de día, y luego pisando las papas.", "fuente": "Por citar en la pieza 3 (fuente de divulgación o académica)" },
    { "afirmacion": "El chuño se conserva varios años.", "fuente": "Por citar en la pieza 3" }
  ],
  "revision": null
}
```

**Campos del texto**

| Campo | Qué es |
| --- | --- |
| `id` | `t` y tres cifras. Los de la prueba de entrada y salida terminan en `a` y `b`. |
| `titulo`, `tema` | El título lo ve el alumno. El tema sirve para que el banco no repita temas seguidos. |
| `nivel` | 1 (3.º de secundaria), 2 (4.º y 5.º) o 3 (tipo UNI). |
| `tipo_texto` | `expositivo`, `argumentativo`, `narrativo`, `descriptivo` o `discontinuo`, como en la unidad `tipologia-textual`. |
| `idea_implicita` | `true` si ninguna oración dice la idea principal y hay que armarla. Cambia la calificación de `marcar-oracion`. |
| `parrafos` | Lista de párrafos; cada uno, una lista de oraciones con `id` (único en el texto, `o1`, `o2`…), `rol` y `t`. |
| `rol` | `principal`, `apoyo` (prepara o sostiene la principal), `detalle`, `ejemplo`, `general` (más amplia que el texto), `contraste` (lo que el texto contradice o supera) o `cita`. Solo lo usa el paso previo y la explicación. |
| `preguntas` | De 3 a 5 (sección 5.4). |
| `hechos` | Los datos del mundo que menciona el texto, con una fuente que los respalde. El revisor los verifica. |
| `revision` | La anota el revisor: `{ "por": "subagente", "fecha": "…", "veredicto": "aprobado", "notas": "…" }`. Un texto con `revision: null` no se publica. |

### 5.3 Ejercicios sueltos

Analogías, término excluido, oraciones incompletas, conectores, plan de redacción y eliminación de oraciones no tienen un texto largo: el enunciado es el ítem. Van en `ejercicios/` con el mismo formato de pregunta y un campo `cuerpo` que depende del tipo:

| `tipo` | `cuerpo` | Paso previo recomendado |
| --- | --- | --- |
| `analogia` | `{ "base": ["VACA", "LECHE"] }` | `relacion-analogia` |
| `termino-excluido` | `{ "terminos": ["chaquitaclla", "lampa", "pico", "surco", "hoz"] }` | Ninguno; la pregunta ya es una predicción |
| `oracion-incompleta` y `conector` | `{ "oracion": "Aunque la cosecha fue abundante, los precios ___ en la feria." }` | `relacion` |
| `plan-de-redaccion` | `{ "oraciones": [ { "n": "I", "t": "…" }, … ] }` | **Ordenar arrastrando** las tarjetas de las oraciones antes de ver las alternativas. Se registra el orden propuesto; si rompe un "este" o un "dicho" que retoma algo, es RV28. |
| `eliminacion` | `{ "oraciones": [ … ] }` | `marcar-oracion` (tocar la que sobra) |

El banco de la pieza 3 empieza por los textos. Los ejercicios sueltos vienen después, con el mismo validador.

### 5.4 Reglas de las preguntas

Son las que comprueba `banco.test.js`:

1. Cada texto tiene de **150 a 350 palabras** y de **3 a 5 preguntas**. Cada pregunta tiene **4 o 5 alternativas**. El examen de la UNI usa 5 (A–E); la app acepta 4 para no forzar un distractor malo.
2. **Una sola alternativa con `correcta: true`**, con al menos una oración en `evidencia`.
3. Cada incorrecta tiene un `codigo` que existe en el informe (RV1 a RV32; el test lo lee del propio informe) y una `explicacion`.
4. **Dos incorrectas de la misma pregunta no llevan el mismo código.** Si no, la medición no distingue un error del otro.
5. `evidencia` y `origen` apuntan a oraciones que existen en el texto.
6. Cada pregunta dice su `unidad`, y la unidad existe en `catalogo/cursos/razonamiento-verbal.json`.
7. Al menos una pregunta por texto tiene `previo`. Si es `marcar-oracion`, el texto tiene una oración `principal` o `idea_implicita: true`.
8. Las explicaciones no nombran letras: el test rechaza "la A", "la B" y parecidos.
9. Ningún texto se publica sin `revision` aprobada.

El `respaldo` no se escribe en el banco: se lee del informe por el código. Así, cuando un error pase de "hipótesis" a "parcial" o a "documentado", se cambia en un solo lugar. El módulo arma una tabla `codigo → respaldo` al construirse (sección 7).

### 5.5 Cómo se escribe y se revisa un texto

1. **Se escribe** el texto con sus oraciones, roles, preguntas y la lista de `hechos`.
2. **Un revisor aparte** (subagente, sin ver el razonamiento del autor) responde las preguntas sin ver las claves y compara. Además comprueba:
   - que la correcta sea única e indiscutible;
   - que ningún distractor sea defendible con el texto;
   - que cada código RV describa de verdad el error del distractor;
   - que los hechos estén bien;
   - que nada se parezca a un texto de academia o de examen.
3. **Se corrige** lo que encuentre el revisor y se anota `revision`.
4. **Si el revisor acertó menos del 100 %** en su resolución a ciegas, el ítem en el que falló se reescribe, no solo se justifica.

## 6. Medición

Se usa el mismo `nucleo/medicion.js`, sin cambiarlo. Los eventos de lectura usan los campos que ya existen:

| Momento | Evento |
| --- | --- |
| El alumno toca "Ya lo leí" | `{ tipo: 'lectura', modulo, unidad, problema: 't001', ms }`. Es un tipo nuevo: `resumir` lo ignora sin romperse y el CSV lo exporta con las mismas columnas. |
| Responde el paso previo | `{ tipo: 'prediccion', modulo, unidad, problema: 't001.p1.previo', opcion: 'o5', correcta: false, error: 'RV1', respaldo, ms }`. En `opcion` va la oración elegida o la clase. |
| Elige una alternativa | `{ tipo: 'prediccion', modulo, unidad, problema: 't001.p1', opcion: 'C', correcta, error: 'RV3', respaldo, ms }` |
| Prueba de entrada o salida | `{ tipo: 'prueba', fase, modulo, unidad, aciertos, total, respuestas, ms }`, igual que hoy |

Con eso, `herramientas/analizar-medicion.js` ya da, sin cambios, el acierto por módulo y **cuántas veces se eligió cada código RV**. Es justo lo que hace falta para pasar un error de "hipótesis" a "documentado" con datos del colegio. Dos agregados serían útiles, y los pide la sección 8:

- **Separar el paso previo de la pregunta** en el resumen (los `problema` que terminan en `.previo`). Así se ve si el error aparece igual sin alternativas que lo sugieran.
- **Errores por código para todo el curso**, sumando los módulos, porque un mismo RV aparece en varias unidades.

**Lo que no se mide:** el texto que el alumno subraya por su cuenta, el tiempo por párrafo ni nada que identifique al alumno. Igual que en el resto de la app.

## 7. Cómo lo cargaría un módulo

Hay que agregar a la app, por partes y con pruebas en cada una:

1. **La ficha.** `plantillas/lectura-verbal/plantilla.json`, con `"formato": "lectura"`, las unidades que cubre y `"banco": "/contenido/razonamiento-verbal/indice.json"`. `catalogo/catalogo.test.js` tendría que aceptar el formato con `REQUERIDOS.lectura = ['banco', 'pruebas']`, con el banco como ruta desde la raíz del repo.
2. **El catálogo.** `herramientas/construir-catalogo.js` le da la dirección `#/lectura/<id>` y pone en `archivos` el índice y todos los textos, para que `sw.js` los guarde y funcionen sin conexión (unos 4 KB por texto; 30 textos son unos 120 KB).
3. **Un núcleo sin DOM**, `nucleo/lectura.js`, que sirva en el navegador y en Node, con funciones puras:
   - `validar(texto, codigos, unidades)`: lo que usa `banco.test.js`;
   - `preparar(texto, rng)`: baraja las alternativas con `nucleo/azar.js` y les pone letra;
   - `calificarPrevio(pregunta, respuesta, texto)`: devuelve `{ correcta, error }`;
   - `respaldo(codigo)`: lee la tabla que sale del informe.
4. **La pantalla.** `app/lectura.js`, hermana de `app/practica.js`, con el flujo de la sección 2 y el registro de la sección 6.
5. **Papel.** `#/papel/lectura-verbal` imprime los textos sin explicaciones, y una hoja aparte con las claves y el código de cada distractor para el profesor.

La tabla `codigo → respaldo` puede salir del informe con un guion en `herramientas/` que lea las filas `| RVn |` y su columna de respaldo, y la escriba en `contenido/razonamiento-verbal/codigos.json`. Así la app no lee Markdown.

## 8. Pedidos para la integración

Para la conversación principal; esta rutina no los toca:

- `catalogo/LEEME.md` y `catalogo/catalogo.test.js`: aceptar `formato: "lectura"` con `banco` y `pruebas`.
- `herramientas/construir-catalogo.js`: la dirección `#/lectura/<id>` y los archivos del banco.
- `nucleo/lectura.js` y `app/lectura.js`, según la sección 7.
- `nucleo/predicciones.js` dice que el respaldo es `documentado` o `hipotesis`. El informe de verbal usa además `parcial`: conviene aceptarlo en todos los formatos.
- `herramientas/analizar-medicion.js`: separar los pasos previos y sumar los códigos por curso (sección 6).
- `docs/diseno.md`: fijar los tres colores de la sección 4 (`evidencia`, `distractor` e `idea`) y la hoja que sube con el texto.
- `app/sw.js`: subir `VERSION` cuando entre `app/lectura.js`.

## 9. Lo que queda abierto

- **¿4 o 5 alternativas?** La UNI usa 5. Para San Marcos no lo confirmé en esta sesión. El formato acepta las dos cantidades; el banco escribe 5 cuando hay un quinto distractor bueno y 4 cuando no.
- **Lectura en inglés** (unidad `lectura-en-ingles`): el formato sirve igual, pero el informe no tiene sus errores. Queda fuera del banco por ahora.
- **Textos discontinuos** (tablas, gráficos, infografías): necesitan una imagen o una tabla dentro del texto. Se puede agregar un tipo de oración `{ "id": "g1", "tabla": … }` cuando haga falta; no se diseña ahora.
- **Tiempo de examen.** Hay un tiempo de referencia por texto (unos 2 minutos por pregunta, como en el examen), pero no se muestra un cronómetro. Si el profesor lo pide para simulacros, sería un modo aparte.
