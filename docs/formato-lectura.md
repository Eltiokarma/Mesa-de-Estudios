# Formato lectura

6 de noviembre de 2026 · Propuesta de diseño para la tarea pl4 de la hoja de ruta

Es el tercer formato de `docs/arquitectura.md`, junto a "escena" y "predicciones", y sirve para razonamiento verbal: textos con preguntas, donde cada alternativa incorrecta es un error con nombre. Los errores salen de `docs/investigacion/razonamiento-verbal-ideas-erroneas.md` (códigos RV1 a RV33).

**Es una propuesta.** No toca `nucleo/`, `app/` ni `catalogo/`: eso lo implementa la conversación principal (pedidos en la sección 8). Lo que sí queda fijo desde ahora es el **formato JSON del banco** (sección 5), porque los textos de `contenido/razonamiento-verbal/` se escriben con él.

## 1. Qué tiene que cumplir

Las seis reglas de `CLAUDE.md`, traducidas a lectura:

| Regla | En lectura |
| --- | --- |
| 1. El cálculo vive en el motor | No hay física, pero vale lo mismo: la respuesta correcta y el código de cada distractor los fija el banco, escrito y revisado a mano. Ningún modelo de lenguaje decide en la app qué alternativa es la correcta. |
| 2. Casos de prueba | El banco hace de `casos.json`. Una prueba (`contenido/razonamiento-verbal/banco.test.js`) valida cada texto con las reglas de la sección 5.5. Además, cada texto pasa una revisión independiente a ciegas, que se anota en el propio JSON. |
| 3. Predecir antes de ver | Cada texto tiene al menos un **paso previo** obligatorio antes de las alternativas (sección 3). Las alternativas no aparecen hasta responderlo. |
| 4. Un color por variable | La evidencia, el origen del distractor y la idea principal se pintan en el texto, cada uno con un color que se repite en su explicación (sección 4). |
| 5. Contenido propio | Textos escritos para la app. Cada texto declara su origen y las fuentes de los datos que menciona, para verificar los hechos, no para copiar el texto. |
| 6. Lápiz y papel | Del banco se genera un `papel.json` con el formato de siempre: texto, preguntas y alternativas como enunciado, y la clave como respuesta (sección 7). |

## 2. Cómo se ve (celular primero)

### Flujo de una sesión

Es el de `app/practica.js`, para que la medición se compare entre formatos, con dos diferencias: la unidad de trabajo es un texto y no un problema, y la prueba de salida se ofrece después de 3 textos y no de 5 problemas.

1. **Prueba de entrada:** el texto `entrada` del índice, con 3 preguntas, el mismo para todos. Va **sin paso previo y sin corrección**, y las alternativas se barajan con una semilla fija (`'entrada'`), igual para todos. Así la prueba mide lo mismo en cada alumno.
2. **Práctica:** texto por texto. Por cada texto: leer, paso previo, preguntas con explicación. Los textos salen en el orden del índice, filtrados por la unidad que el alumno abrió. Un texto hecho no se repite hasta que se acaben los demás.
3. **Prueba de salida:** el texto `salida`, paralelo al de entrada (los mismos tipos de pregunta, con dificultad parecida y otro tema). También sin paso previo y con semilla fija (`'salida'`).

### Pantalla de lectura

```
┌──────────────────────────────┐
│ ‹  Razonamiento verbal       │
│ El frío que conserva         │
│ Texto 4 · 3 preguntas        │
├──────────────────────────────┤
│ ① En las punas del sur       │
│ andino, las heladas de junio │
│ pueden arruinar…             │
│                              │
│ ② El resultado es el chuño…  │
│                              │
│ [ Ya lo leí: ir a las     ›  │
│   preguntas ]                │
└──────────────────────────────┘
```

- **El texto solo, primero.** Letra de 18 px, interlineado de 1,6 y a lo sumo 65 caracteres por línea. Los párrafos llevan su número en un círculo (①, ②), porque las explicaciones los citan ("en el párrafo 2…").
- **"Ya lo leí"** queda al final del texto y registra el tiempo de lectura (sección 6). No hay cronómetro visible.
- **Paso previo de marcar una oración:** se hace en esta misma pantalla, con el texto completo. Cada oración se vuelve un bloque tocable, con un poco de aire entre una y otra para que un dedo no toque la vecina. Tocar una oración la selecciona (borde en el color `idea`); hay que tocar **Confirmar** para seguir. Un toque accidental no graba nada.
- **Durante las preguntas, el texto no desaparece.** Queda plegado en una franja fija arriba, de unos 56 px, con el título y "Ver texto ▾". Al tocarla se abre una hoja que sube desde abajo y ocupa el 85 % de la pantalla, con el texto completo y desplazable. Se cierra deslizando hacia abajo o con "Volver a la pregunta". Así el alumno relee sin perder la pregunta, como en el examen de papel.
- **Una pregunta por pantalla**, con su número ("Pregunta 2 de 3") y los mismos botones `.alt` de la práctica (letra A–E, estados `ok` y `mal`).

### Pantalla grande (laboratorio de cómputo, desde 900 px)

- **Dos columnas.** El texto va a la izquierda, fijo y con su propio desplazamiento (unos 480 px). A la derecha, la pregunta, el paso previo y la explicación (unos 520 px). No hace falta la hoja que sube.
- **Teclado.** A–E o 1–5 eligen y Enter sigue, como en la práctica, pero con un oyente propio para la ruta `#/lectura` (el de `practica.js` solo actúa en `#/practica`). Al marcar una oración, ↑ y ↓ recorren las oraciones y Enter confirma. Las oraciones son botones enfocables, así que también funciona con lector de pantalla.

## 3. Predecir antes de ver: el paso previo

Antes de ver las alternativas, el alumno se compromete con una respuesta propia, sin pistas. Es lo que distingue este formato de un banco de preguntas común: el error se mide **sin que una alternativa lo sugiera**. Si el alumno marca un detalle como idea principal en el paso previo, es RV1 de verdad, y no un eco de la alternativa (RV5).

Cada texto de práctica tiene **al menos un paso previo**; el recomendado es el de la idea principal. Los demás son opcionales, para no alargar cada texto.

El paso previo **no se corrige en el momento**. Se guarda la respuesta y se pasa a las alternativas; la corrección aparece en la explicación final, junto a la de la pregunta ("Antes marcaste la oración 5: es un paso del procedimiento, no la idea que lo junta todo"). Así no se revela la respuesta antes de elegir.

### Los cinco tipos

Cada tipo trae en el JSON **la respuesta aceptada y un código RV por cada respuesta incorrecta**. Así, la calificación es una búsqueda en una tabla y no una regla que la app tenga que adivinar. El esquema exacto de cada uno está en la sección 5.3.

| Tipo | Para qué preguntas | Qué hace el alumno | Opciones |
| --- | --- | --- | --- |
| `marcar-oracion` | Idea principal, tema central, eliminación de oraciones | Toca una oración y confirma. En idea principal hay además un botón "Ninguna la dice completa". | Las oraciones del texto (y "ninguna") |
| `clasificar` | Inferencia, compatibilidad, extrapolación | Ve una afirmación (la "sonda") y dice qué relación tiene con el texto | **Lo dice el texto · Se deduce del texto · El texto no lo dice ni se deduce · Lo contradice** |
| `relacion` | Conectores, oraciones incompletas | Antes de ver los conectores, elige qué relación hay entre las dos partes | **Suma (y, además) · Oposición (pero, aunque, sin embargo) · Causa (porque) · Consecuencia (por eso) · Ejemplo (por ejemplo)** |
| `relacion-analogia` | Analogías (ejercicios sueltos) | Elige la relación de la pareja base, con su sentido | Una lista con dirección: "A produce B", "B produce A", "A es parte de B", "A usa B", "A es un tipo de B", "A causa B", "A es lo contrario de B" |
| `proposito` | Intención del autor | Elige qué busca el autor | **Explicar o informar · Convencer · Narrar** |

Decisiones que vienen de la revisión:

- **Oposición junta contraste y concesión.** Ante un "aunque", las dos son defendibles, y la diferencia entre ambas no es lo que se quiere medir. El error que importa es leer como causa o como suma lo que se opone (RV24 y RV26).
- **Proposito tiene tres opciones.** "Criticar" es una forma de convencer, e "informar" y "explicar" no se distinguen bien en textos cortos.
- **En el previo de analogías no se puede medir RV15** (la asociación con la palabra C), porque el alumno todavía no ve C. Lo que mide es si identificó la relación (RV17) y su sentido (RV16).
- **`clasificar`:** el límite entre "Lo dice" y "Se deduce" ante una paráfrasis es discutible. Por eso la sonda debe ser una paráfrasis clara (se deduce) o una cita casi literal (lo dice), y el revisor la clasifica a ciegas antes de publicarla. Si duda, se cambia la sonda.

## 4. La explicación: que se vea en el texto (regla 4)

Después de elegir, la pantalla muestra:

1. **El veredicto**, igual que en la práctica: "¡Bien! …" o "Elegiste la B. La correcta es la D: …". Los botones usan los estados de siempre (`ok` y `mal`), que son de bien y mal, no variables, y siempre van con texto.
2. **Por qué falla la que eligió**: su explicación y, en una línea aparte, qué error es, en lenguaje de alumno y sin el código ("Elegiste un detalle verdadero, pero el texto habla de algo más amplio").
3. **El texto se pinta**, en la hoja o en la columna de la izquierda, y cada explicación lleva una marquita del mismo color que su parte del texto:
   - **evidencia**: las oraciones que prueban la correcta;
   - **distractor**: la oración de donde sale lo que eligió el alumno (su `origen`), si la tiene;
   - **idea**: en la corrección del paso previo, la oración aceptada.
4. **"Ver las demás alternativas"**, plegado: la explicación de cada una.

**Colores.** Se usan tres de la familia de variables que ya están en `app/estilos.css`, con sus versiones de modo oscuro. No se usan `--ok` ni `--warn`, que son de estado:

| Rol | Token | Por qué |
| --- | --- | --- |
| `evidencia` | `--c-i` turquesa | Lo que prueba la correcta |
| `distractor` | `--c-o` naranja | De dónde sale lo elegido; la marquita de su explicación va en el mismo naranja |
| `idea` | `--c-d` verde | La oración aceptada en el paso previo |

Las tres se muestran **como en `.var.c-*`: la letra en tinta, un subrayado de 3 px del color y un fondo del 12 %**. Así se siguen leyendo con contraste AA. Si una oración es a la vez evidencia e idea, gana `evidencia`, porque la corrección del paso previo y la de la pregunta no se muestran a la vez. La distancia de color entre los tres y el contraste en los dos modos los fija `docs/diseno.md` (pedido en la sección 8).

**Regla de redacción:** las explicaciones nunca nombran letras ("la B es incorrecta"), porque las alternativas se barajan para cada alumno. Se refieren al contenido ("decir que el chuño es el más nutritivo…").

## 5. El banco: formato JSON

### 5.1 Dónde vive

```
contenido/razonamiento-verbal/
  indice.json          lista de textos y ejercicios, en orden; marca los de entrada y salida
  codigos.json         RV1… con su respaldo normalizado; se genera del informe (sección 7)
  textos/t001.json     un archivo por texto (así se revisa y se corrige uno por uno)
  ejercicios/e001.json ítems sueltos: analogías, conectores, plan de redacción…
  banco.test.js        valida todo el banco con npm test
  LEEME.md             cómo escribir un texto nuevo (resumen de esta sección)
```

`indice.json`:

```json
{
  "entrada": "t000a",
  "salida": "t000b",
  "textos": ["t001", "t002", "t003"],
  "ejercicios": []
}
```

### 5.2 Un texto

Ejemplo completo, propio. Muestra el formato; si pasa la revisión de la pieza 3, entra al banco como el primer texto.

```json
{
  "id": "t001",
  "version": 1,
  "titulo": "El frío que conserva",
  "tema": "Perú andino · tecnología tradicional",
  "grado": 3,
  "dificultad": 1,
  "tipo_texto": "expositivo",
  "parrafos": [
    [
      { "id": "o1", "rol": "contraste", "t": "En las punas del sur andino, las heladas de junio pueden arruinar una chacra de papa en una sola noche." },
      { "id": "o2", "rol": "apoyo", "t": "Sin embargo, las familias aymaras y quechuas convirtieron ese mismo frío en una herramienta." },
      { "id": "o3", "rol": "detalle", "t": "Desde hace siglos, extienden las papas sobre el pasto para que se congelen de noche y se descongelen con el sol del día." },
      { "id": "o4", "rol": "detalle", "t": "Cada ciclo de congelar y descongelar rompe las células del tubérculo, y el agua sale con más facilidad." },
      { "id": "o5", "rol": "detalle", "t": "Después, pisan las papas para exprimirles el agua que les queda y las dejan secar al sol." }
    ],
    [
      { "id": "o6", "rol": "detalle", "t": "El resultado es el chuño negro, un alimento liviano que puede guardarse varios años sin echarse a perder." },
      { "id": "o7", "rol": "detalle", "t": "Como ha perdido casi toda su agua, pesa mucho menos que la papa fresca y se lleva con facilidad en viajes largos." },
      { "id": "o8", "rol": "detalle", "t": "Por eso, en los años de mala cosecha, el chuño guardado ha servido como reserva contra el hambre." },
      { "id": "o9", "rol": "principal", "t": "Así, la misma helada que amenaza la chacra se vuelve, en manos de estas familias, la forma de conservar la papa como chuño." }
    ]
  ],
  "preguntas": [
    {
      "id": "p1",
      "tipo": "idea-principal",
      "unidad": "razonamiento-verbal.tema-e-idea-principal",
      "previo": {
        "tipo": "marcar-oracion",
        "pide": "Antes de ver las alternativas, toca la oración que mejor resume todo el texto.",
        "aceptadas": ["o9", "o2"],
        "ninguna": "RV3",
        "codigos": { "o1": "RV4" }
      },
      "enunciado": "¿Cuál es la idea principal del texto?",
      "alternativas": [
        { "t": "Las comunidades andinas aprovechan la helada, que daña los cultivos, para conservar la papa como chuño.",
          "correcta": true, "evidencia": ["o2", "o9"],
          "explicacion": "Junta las dos partes del texto: la helada como amenaza para la chacra y como medio para conservar la papa." },
        { "t": "Después de congelarlas durante varias noches, las familias pisan las papas para sacarles el agua que les queda.",
          "codigo": "RV1", "origen": "o5",
          "explicacion": "Es verdad, pero es un paso del procedimiento. El texto lo cuenta para explicar algo más amplio." },
        { "t": "La agricultura de las punas andinas depende de las heladas y del clima.",
          "codigo": "RV2",
          "explicacion": "Es demasiado general: el texto no habla de toda la agricultura, sino de la helada y de la papa." },
        { "t": "Las heladas de junio pueden arruinar en una sola noche una chacra de papa.",
          "codigo": "RV3", "origen": "o1",
          "explicacion": "Se queda con la mitad del texto. Falta lo principal: que ese mismo frío sirve para conservar." },
        { "t": "El chuño es el alimento más nutritivo que se produce en los Andes.",
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
        { "t": "un oficio que se aprende.", "codigo": "RV19",
          "explicacion": "\"Oficio\" es del mismo campo que \"herramienta\" (el trabajo), pero no significa lo mismo, y el texto no habla de un oficio." },
        { "t": "una forma de evitar las heladas.", "codigo": "RV7",
          "explicacion": "El texto no dice que las familias eviten la helada: dice que la usan. Esta lectura va más allá de lo que el texto afirma." }
      ]
    },
    {
      "id": "p3",
      "tipo": "intencion",
      "unidad": "razonamiento-verbal.inferencias",
      "previo": {
        "tipo": "proposito",
        "pide": "Antes de ver las alternativas: ¿qué busca sobre todo el autor?",
        "aceptada": "explicar",
        "codigos": { "convencer": "RV33", "narrar": "RV13" }
      },
      "enunciado": "¿Cuál es la intención principal del autor?",
      "alternativas": [
        { "t": "Explicar cómo las familias andinas aprovechan la helada para conservar la papa.", "correcta": true, "evidencia": ["o2", "o9"],
          "explicacion": "El texto expone un procedimiento y su resultado, sin tomar partido: explica." },
        { "t": "Narrar la vida diaria de las familias aymaras y quechuas.", "codigo": "RV13",
          "explicacion": "El texto no cuenta una historia ni sigue a personas: describe un procedimiento." },
        { "t": "Describir el chuño negro: cuánto pesa, cuánto tiempo dura y por qué se lleva con facilidad en los viajes.", "codigo": "RV14", "origen": "o6",
          "explicacion": "El chuño aparece, pero el texto lo usa para mostrar cómo la helada pasa de amenaza a recurso, y eso esta alternativa lo deja fuera." },
        { "t": "Convencer al lector de que el chuño es mejor que la papa fresca.", "codigo": "RV33",
          "explicacion": "El texto no compara cuál es mejor ni intenta convencer: dice en qué se diferencian el chuño y la papa fresca (el peso, cuánto dura)." },
        { "t": "Informar sobre el clima de las punas del sur andino.", "codigo": "RV2", "origen": "o1",
          "explicacion": "El clima es el punto de partida, pero el texto trata de cómo se aprovecha la helada, no del clima en general." }
      ]
    }
  ],
  "origen": "propio",
  "fecha": "2026-11-06",
  "hechos": [
    { "afirmacion": "El chuño negro se hace congelando la papa de noche, descongelándola de día, pisándola y secándola al sol.", "fuente": "Por citar en la pieza 3" },
    { "afirmacion": "El chuño se conserva varios años.", "fuente": "Por citar en la pieza 3" }
  ],
  "revision": null
}
```

**Campos del texto**

| Campo | Qué es |
| --- | --- |
| `id` | `t` y tres cifras. Los de la prueba de entrada y salida terminan en `a` y `b`. |
| `version` | Entero. Sube cada vez que cambia una pregunta o una alternativa, para que la medición no mezcle versiones (sección 6). |
| `titulo`, `tema` | El título lo ve el alumno. El tema sirve para que el banco no repita temas seguidos. |
| `grado` | 3, 4 o 5, como `grado` en el catálogo: desde qué grado se puede usar. |
| `dificultad` | 1 (de colegio), 2 (de academia) o 3 (tipo UNI). |
| `tipo_texto` | `expositivo`, `argumentativo`, `narrativo`, `descriptivo` o `discontinuo`, como en la unidad `tipologia-textual`. |
| `parrafos` | Lista de párrafos; cada uno, una lista de oraciones con `id` (único en el texto: `o1`, `o2`…), `rol` y `t`. |
| `rol` | `principal`, `apoyo`, `detalle`, `ejemplo`, `general`, `contraste` o `cita`. Es información para el autor y el revisor, y da el código por defecto del paso previo (sección 5.3). |
| `preguntas` | De 3 a 5. |
| `hechos` | Los datos del mundo que menciona el texto, con una fuente que los respalde. El revisor los verifica. |
| `revision` | La anota el revisor: `{ "por": "subagente", "fecha": "…", "veredicto": "aprobado", "notas": "…" }`. |

**Campos de una pregunta:** `id` (`p1`, `p2`…); `tipo` (`idea-principal`, `inferencia`, `compatibilidad`, `incompatibilidad`, `extrapolacion`, `intencion`, `sentido-contextual`, `referente`, `conector`); `unidad` (una unidad del catálogo); `previo` (opcional); `enunciado`; `alternativas`.

**Campos de una alternativa:** `t`; `correcta: true` con `evidencia` (lista de oraciones), o `codigo` (un RV); `origen` (opcional, la oración de donde sale el distractor); `explicacion`.

### 5.3 El paso previo en el JSON

| `previo.tipo` | Campos | Cómo se califica |
| --- | --- | --- |
| `marcar-oracion` | `pide`, `aceptadas` (una o más oraciones), `ninguna` (el código si el alumno toca "Ninguna la dice completa", o `"correcta"` si la idea es implícita), `codigos` (opcional: código por oración) | Correcta si la oración está en `aceptadas`. Si no, el código sale, en este orden: de `codigos`; RV4 si es la primera oración del texto; y si no, del rol: `detalle`, `ejemplo` y `cita` → RV1; `general` → RV2; `apoyo` y `contraste` → RV3. |
| `clasificar` | `pide`, `sonda` (la afirmación), `clase` (`lo-dice`, `se-deduce`, `no-se-sabe` o `lo-contradice`), `codigos` (un código por cada una de las otras tres clases) | Correcta si coincide con `clase`. Si no, el código de esa clase. |
| `relacion` | `pide`, `aceptada` (`suma`, `oposicion`, `causa`, `consecuencia` o `ejemplo`), `codigos` (uno por cada una de las otras) | Igual |
| `relacion-analogia` | `pide`, `aceptada` (`a-produce-b`, `b-produce-a`, `a-parte-de-b`, `a-usa-b`, `a-tipo-de-b`, `a-causa-b`, `a-contrario-b`), `codigos` | Igual. La inversa de la aceptada lleva RV16; las demás, RV17. |
| `proposito` | `pide`, `aceptada` (`explicar`, `convencer` o `narrar`), `codigos` | Igual |

En idea principal, `aceptadas` puede tener más de una oración cuando dos resumen el texto casi igual de bien (en el ejemplo, la tesis anunciada en o2 y la conclusión de o9). Es mejor aceptar dos que castigar una respuesta defendible.

Para el previo de plan de redacción se ordenan tarjetas arrastrándolas. Se registra el orden propuesto: si una oración que retoma algo (`"retoma": "II"`, por un "este" o un "dicho") queda antes de la oración que retoma, el código es RV28; cualquier otro orden equivocado, RV29.

### 5.4 Ejercicios sueltos

Analogías, término excluido, oraciones incompletas, conectores, plan de redacción y eliminación de oraciones no tienen un texto largo: el enunciado es el ítem. Van en `ejercicios/`, con el formato de pregunta y un campo `cuerpo` según el tipo:

| `tipo` | `cuerpo` | Paso previo recomendado |
| --- | --- | --- |
| `analogia` | `{ "base": ["VACA", "LECHE"] }` | `relacion-analogia` |
| `termino-excluido` | `{ "terminos": ["chaquitaclla", "lampa", "pico", "surco", "hoz"] }` | Ninguno; la pregunta ya es una predicción |
| `oracion-incompleta` y `conector` | `{ "oracion": "Aunque la cosecha fue abundante, los precios ___ en la feria." }` | `relacion` |
| `plan-de-redaccion` | `{ "oraciones": [ { "n": "I", "t": "…" }, { "n": "II", "t": "…", "retoma": "I" } ] }` | Ordenar arrastrando (sección 5.3) |
| `eliminacion` | `{ "oraciones": [ … ] }` | `marcar-oracion` (tocar la que sobra) |

El banco de la pieza 3 empieza por los textos. Los ejercicios sueltos vienen después, con el mismo validador. Antes hacen falta unidades para término excluido y oraciones incompletas, que el catálogo no tiene (pedido en la sección 8).

### 5.5 Reglas que comprueba `banco.test.js`

1. Cada texto tiene de **150 a 350 palabras** y de **3 a 5 preguntas**. Cada pregunta tiene **4 o 5 alternativas**. La UNI usa 5 (A–E); se aceptan 4 para no forzar un distractor malo.
2. **Una sola alternativa con `correcta: true`**, con al menos una oración en `evidencia`.
3. Cada incorrecta tiene un `codigo` que existe en `codigos.json` y una `explicacion` no vacía. Lo mismo para cada código de `previo`.
4. **Dos incorrectas de la misma pregunta no llevan el mismo código**, para que la medición distinga un error del otro.
5. `evidencia`, `origen` y `aceptadas` apuntan a oraciones que existen en el texto. Los `id` de oración no se repiten.
6. Cada `unidad` existe en `catalogo/cursos/razonamiento-verbal.json`.
7. Cada texto de práctica tiene al menos una pregunta con `previo`, y cada `previo` tiene los campos de su tipo (sección 5.3), con un código para cada respuesta incorrecta posible. Los textos de entrada y salida no llevan `previo`.
8. Las explicaciones no nombran letras: el test rechaza `/\b(la|alternativa|opción) [A-E]\b/`.
9. **Todo lo que está en `indice.json` tiene `revision.veredicto === "aprobado"`.** Un texto sin revisión puede estar en `textos/`, pero no en el índice.
10. **La correcta no es siempre la más larga.** En todo el banco, la correcta es la alternativa más larga en a lo sumo el 40 % de las preguntas. Un alumno con práctica elige por la longitud sin leer.
11. `codigos.json` coincide con lo que dice el informe (el test lo regenera en memoria y compara), así no hay dos fuentes de verdad.

El `respaldo` no se escribe en el banco: se toma de `codigos.json` por el código. Así, cuando un error pase de "hipótesis" a "parcial" o a "documentado", se cambia solo en el informe.

### 5.6 Cómo se escribe y se revisa un texto

1. **Se escribe** el texto con sus oraciones, roles, preguntas, pasos previos y `hechos`.
2. **Un revisor aparte** (un subagente que no ve el razonamiento del autor) resuelve las preguntas y los pasos previos **sin ver las claves**, y luego compara. Además comprueba:
   - que la correcta sea única e indiscutible;
   - que ningún distractor sea defendible con el texto;
   - que cada código RV describa de verdad el error del distractor;
   - que los hechos estén bien;
   - que nada se parezca a un texto de academia o de examen.
3. **Si el revisor falló un ítem a ciegas**, ese ítem se reescribe, no solo se justifica.
4. Se anota `revision` y recién entonces el texto entra al índice.

## 6. Medición

Se usa `nucleo/medicion.js` y sus columnas. Hay dos tipos de evento nuevos, que `resumir` hoy no cuenta (solo suma al alumno) y el CSV exporta con las mismas columnas. Así **el paso previo no se mezcla con el acierto de las preguntas**:

| Momento | Evento |
| --- | --- |
| El alumno toca "Ya lo leí" | `{ tipo: 'lectura', modulo, unidad, problema: 't001v1', ms }` |
| Confirma el paso previo | `{ tipo: 'previo', modulo, unidad, problema: 't001v1.p1', opcion: 'o5', correcta: false, error: 'RV1', respaldo, ms }`. En `opcion` va la oración, la clase o la relación elegida. |
| Elige una alternativa | `{ tipo: 'prediccion', modulo, unidad, problema: 't001v1.p1', opcion: '2', correcta, error: 'RV1', respaldo, ms }`. En `opcion` va **la posición de la alternativa en el banco** (1 a 5), no la letra que vio el alumno: como se barajan, la letra no se compara entre alumnos. |
| Prueba de entrada o salida | `{ tipo: 'prueba', fase, modulo, unidad, aciertos, total, respuestas, ms }`, como hoy. Como la semilla es fija, `respuestas` sí se compara entre alumnos; aun así conviene guardar las posiciones en el banco, no las letras. |

El `problema` lleva la versión del texto (`t001v1`), para que una corrección del texto no mezcle los datos viejos con los nuevos.

Con esto, `herramientas/analizar-medicion.js` ya da, sin cambios, el acierto por módulo y cuántas veces se eligió cada código RV en las preguntas. La clave con que junta los archivos (`alumno|t|tipo|modulo|problema|fase`) no confunde el paso previo con la pregunta, porque tienen distinto `tipo`. Para el paso previo hace falta un agregado (sección 8): una tabla aparte, con la misma forma, de los errores elegidos **sin alternativas a la vista**. Comparar las dos tablas dice si un error aparece por sí solo o porque la alternativa lo sugiere.

**Lo que no se mide:** lo que el alumno subraya por su cuenta, el tiempo por párrafo ni nada que lo identifique. Igual que en el resto de la app.

## 7. Cómo lo cargaría un módulo

Por partes, con pruebas en cada una:

1. **La ficha.** `plantillas/lectura-verbal/plantilla.json`:

   ```json
   {
     "id": "lectura-verbal",
     "titulo": "Lectura y razonamiento verbal",
     "formato": "lectura",
     "unidades": ["razonamiento-verbal.tema-e-idea-principal", "razonamiento-verbal.inferencias", "…"],
     "estado": "borrador",
     "version": "0.1.0",
     "banco": "../../contenido/razonamiento-verbal/indice.json",
     "pruebas": "../../contenido/razonamiento-verbal/banco.test.js",
     "papel": "papel.json"
   }
   ```

   Con rutas relativas, la comprobación de `catalogo.test.js` (`existe('plantillas/' + d + '/' + f[campo])`) funciona sin un caso aparte: basta `REQUERIDOS.lectura = ['banco', 'pruebas']`. Cada unidad de la lista tiene que nombrar `lectura-verbal` en sus `plantillas`, porque el test comprueba el enlace en los dos sentidos.
2. **El catálogo.** `herramientas/construir-catalogo.js` le da la dirección `#/lectura/lectura-verbal`. Lee `indice.json` y pone en `archivos`, ya normalizados (`/contenido/razonamiento-verbal/…`), el índice, `codigos.json` y todos los textos: unos 5 KB por texto, unos 150 KB para 30.
3. **Sin conexión.** El `fetch` de `app/sw.js` hoy solo sirve desde la caché lo que empieza por `/app/`, `/nucleo/` o `/plantillas/`. Hay que agregar `contenido` a esa expresión: si no, el banco se guarda al instalar pero no se sirve sin red. También hay que agregar `/nucleo/lectura.js` y `/app/lectura.js` a `CASCARA` y subir `VERSION`.
4. **Un núcleo sin DOM**, `nucleo/lectura.js`, que sirva en el navegador y en Node, con funciones puras:
   - `validar(texto, codigos, unidades)`, que usa `banco.test.js`;
   - `preparar(texto, rng)`: baraja las alternativas con `nucleo/azar.js`, les pone letra y guarda su posición en el banco;
   - `calificarPrevio(previo, respuesta, texto)`: devuelve `{ correcta, error }` con las reglas de la sección 5.3;
   - `respaldo(codigo, codigos)`.
5. **La pantalla.** `app/lectura.js`, hermana de `app/practica.js`, con el flujo de la sección 2, su propio oyente de teclado y el registro de la sección 6. En `app/app.js`: la rama `lectura` en `render`, con la ruta `#/lectura/<id>/<unidad>` para filtrar por unidad; `'lectura'` en la lista que marca "Cursos" en la navegación; el texto del botón ("Leer") donde hoy dice "Abrir escena" o "Practicar"; y la etiqueta `<script>` en `app/index.html`.
6. **Papel.** Un guion, `herramientas/papel-lectura.js`, arma `plantillas/lectura-verbal/papel.json` con el formato que ya muestra `#/papel/<id>`. Cada texto es un problema: el `enunciado` es el texto con sus preguntas y alternativas, la `respuesta` es la clave de cada pregunta y los `pasos`, las explicaciones de las correctas. No hace falta tocar la vista de papel.
7. **Los códigos.** Un guion, `herramientas/codigos-verbal.js`, lee las filas `| RVn |` del informe y escribe `contenido/razonamiento-verbal/codigos.json` (`{ "RV1": { "nombre": "…", "respaldo": "parcial", "por_verificar": true } }`). El respaldo se normaliza a `documentado`, `parcial` o `hipotesis` (sin tilde, como en `predicciones.js`); lo que va entre paréntesis ("por verificar", "con contexto indirecto") pasa a `por_verificar` o se descarta. La app no lee Markdown.

## 8. Pedidos para la integración

Para la conversación principal; esta rutina no los toca:

- `catalogo/LEEME.md` y `catalogo/catalogo.test.js`: aceptar `formato: "lectura"` con `banco` y `pruebas` (sección 7.1).
- `catalogo/cursos/razonamiento-verbal.json`: unidades (o temas dentro de una unidad) para término excluido, oraciones incompletas y referentes, y que las unidades con textos nombren `lectura-verbal` en `plantillas`. Hoy, la intención del autor entra en `inferencias` ("Inferencia de la intención").
- `herramientas/construir-catalogo.js`: la rama de lectura (sección 7.2).
- `app/sw.js`: `contenido` en la expresión del `fetch`, los dos archivos nuevos en `CASCARA` y `VERSION` (sección 7.3).
- `nucleo/lectura.js`, `app/lectura.js` y los cambios en `app/app.js` y `app/index.html` (secciones 7.4 y 7.5).
- `nucleo/predicciones.js` dice que el respaldo es `documentado` o `hipotesis`: conviene aceptar `parcial` en todos los formatos.
- `nucleo/medicion.js` y `herramientas/analizar-medicion.js`: resumir los eventos `previo` en una tabla aparte (sección 6).
- `herramientas/papel-lectura.js` y `herramientas/codigos-verbal.js` (secciones 7.6 y 7.7). El segundo lo puede escribir esta rutina en la pieza 3 si se le amplía el alcance a ese archivo.
- `docs/diseno.md`: confirmar los tres roles de color de la sección 4 (`--c-i`, `--c-o` y `--c-d`), su distancia de color y la hoja que sube con el texto.

## 9. Lo que queda abierto

- **¿4 o 5 alternativas en San Marcos?** La UNI usa 5; lo de San Marcos no lo confirmé. El formato acepta las dos cantidades.
- **Lectura en inglés** (unidad `lectura-en-ingles`): el formato sirve igual, pero el informe no tiene sus errores. Queda fuera del banco por ahora.
- **Textos discontinuos** (tablas, gráficos, infografías): necesitan una tabla o una imagen dentro del texto. Se puede agregar un tipo de bloque (`{ "id": "g1", "tabla": … }`) cuando haga falta; no se diseña ahora.
- **Tiempo de examen.** No se muestra cronómetro. Si un profesor lo pide para simulacros, sería un modo aparte.
- **"Ninguna la dice completa"** cuando la idea sí está en una oración se registra como RV3 en el ejemplo, porque lo más probable es que el alumno vea solo una parte. Es una hipótesis más; los datos dirán si conviene un código propio.
