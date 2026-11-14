# Formato lectura

6 de noviembre de 2026 · Propuesta de diseño para la tarea pl4 de la hoja de ruta

Es el tercer formato de `docs/arquitectura.md`, junto a "escena" y "predicciones", y sirve para razonamiento verbal: textos con preguntas, donde cada alternativa incorrecta es un error con nombre. Los errores salen de `docs/investigacion/razonamiento-verbal-ideas-erroneas.md` (códigos RV1 a RV63).

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

Es el de `app/practica.js`, para que la medición se compare entre formatos, con dos diferencias: la unidad de trabajo es un texto y no un problema, y la prueba de salida la abre el profesor con `?salida=razonamiento-verbal`, como en las pruebas por curso (cambio de la integración, 7 nov 2026; antes se ofrecía después de 3 textos).

1. **Prueba de entrada:** al entrar al curso, el texto `entrada` del índice, con 3 preguntas, el mismo para todos. Va **sin paso previo y sin corrección**, y las alternativas se barajan con una semilla fija (`'entrada'`), igual para todos. Así la prueba mide lo mismo en cada alumno.
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

- **El texto solo, primero.** Letra de 18 px, interlineado de 1,6 y a lo sumo 65 caracteres por línea. Los párrafos llevan su número en un círculo (①, ②), y cada oración un número pequeño y gris, seguido en todo el texto (o1 es la oración 1). Las explicaciones del banco citan las oraciones por ese número ("la oración 6 dice…").
- **"Ya lo leí"** queda al final del texto y registra el tiempo de lectura (sección 6). No hay cronómetro visible.
- **Paso previo de marcar una oración:** se hace en esta misma pantalla, con el texto completo. Cada oración se vuelve un bloque tocable, con un poco de aire entre una y otra para que un dedo no toque la vecina. Tocar una oración la selecciona (borde en el color de marca, `--brand`, porque es un estado; el verde `idea` queda solo para la corrección); hay que tocar **Confirmar** para seguir. Un toque accidental no graba nada.
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
| `relacion` | Conectores y oraciones incompletas donde las dos partes se oponen | Antes de ver los conectores, elige qué relación hay entre las dos partes | **Suma (y, además) · Oposición (pero, aunque, sin embargo) · Causa o consecuencia (porque, por eso)** |
| `relacion-analogia` | Analogías (ejercicios sueltos) | Elige la relación de la pareja base, con su sentido | Pares con dirección: "A produce B" / "B produce A" (vaca y leche); "A es parte de B" / "B es parte de A"; "A usa B" / "B usa A" (agente e instrumento); "A es un tipo de B" / "B es un tipo de A"; "A causa B" / "B causa A" (hechos: sequía y hambruna); y dos sin dirección: "son sinónimos" y "son contrarios" |
| `proposito` | Intención del autor | Elige qué busca el autor | **Explicar o informar · Convencer · Narrar** |

Decisiones que vienen de la revisión:

- **Oposición junta contraste y concesión, y causa junta consecuencia.** Ante un "aunque", contraste y concesión son defendibles las dos, y la diferencia no es lo que se quiere medir. El error que importa es leer como causa o como suma lo que se opone (RV24 y RV26). Por eso, **por ahora, el previo `relacion` solo se usa cuando la relación aceptada es la oposición**: para el error contrario (ver oposición donde hay causa o suma) el informe no tiene código.
- **Proposito tiene tres opciones.** "Criticar" es una forma de convencer, e "informar" y "explicar" no se distinguen bien en textos cortos.
- **En el previo de analogías no se puede medir RV15** (la asociación con la palabra C), porque el alumno todavía no ve C. Lo que mide es si identificó la relación (RV17) y su sentido (RV16). "Produce" es para un ser y lo que da (vaca y leche); "causa", para hechos (sequía y hambruna).
- **`clasificar`: la frontera entre "Lo dice" y "Se deduce"** (regla del 13 nov 2026, decisión de Gerson; afinada el mismo día con los marcos del Minedu y de PISA: `docs/investigacion/verificacion-pogil-v2.md`, bloque D). Lo que decide **no** es si la sonda repite las palabras del texto, **ni cuántas oraciones hay que mirar**. Decide una sola pregunta: **¿la sonda afirma una relación o una conclusión que el texto no expresa?**
  - **Lo dice el texto:** todo lo que afirma la sonda está expresado en el texto, con las mismas palabras o con otras. Vale la cita, vale la paráfrasis y vale juntar u ordenar información que el texto da en más de un lugar, siempre que la sonda no agregue nada entre esos datos. *Prueba:* se puede señalar dónde está dicho cada trozo de la sonda, y no queda ninguno sin señalar.
  - **Se deduce del texto:** la sonda afirma algo que el texto no expresa pero sí sostiene: una cuenta, una comparación, una causa o una consecuencia, una intención, o una regla sacada de casos. Puede salir de varias oraciones o de una sola. *Prueba:* se puede decir qué agrega la sonda y por qué el texto la sostiene.
  - **El texto no lo dice ni se deduce:** para sostener la sonda haría falta una premisa que el texto no da. No cuenta como premisa de fuera el conocimiento corriente que hace falta para entender cualquier texto (qué quiere decir una palabra, que marzo viene antes de abril).
  - **Lo contradice:** es incompatible con algo que el texto dice o con algo que se deduce de él.
  - **Ejemplos**, con el texto de los talleres de verano:
    - «El taller de fútbol volvió a ser el más concurrido» es *lo dice*: reformula «El fútbol fue otra vez el taller con más inscritos».
    - «El fútbol fue el taller con más inscritos y para 2027 se piensa abrir otro grupo de ajedrez» es *lo dice*, aunque junta dos oraciones: no agrega nada entre ellas.
    - «En 2026 se inscribieron en fútbol 30 chicos más que en 2025» es *se deduce*: el gráfico da los dos números y la resta la pone el lector.
    - «Hoy hay un solo grupo de ajedrez» es *se deduce*, aunque sale de una sola oración («piensa abrir un segundo grupo»): el texto lo sostiene pero no lo dice.
  - **Cuando el cambio de palabras agrega o quita información** (la sonda es más general, más fuerte o más precisa que el pasaje), ya no es una paráfrasis: se clasifica por lo que agrega.
  - **Cómo se escriben las sondas.** Una sonda *lo dice* va como paráfrasis, no como cita: con la cita, el alumno acierta buscando palabras iguales. Una sonda *se deduce* anota en `explicacion` qué agrega y qué parte del texto la sostiene. El revisor la clasifica a ciegas con la pregunta de arriba; si duda entre dos clases, se cambia la sonda.
  - **Los códigos no cambian de sentido.** RV58 es marcar «lo dice» ante una conclusión que el texto no expresa; RV34 es marcar «no lo dice ni se deduce» ante algo que sí se deduce.
  - **Quedan sin efecto dos reglas anteriores:** «paráfrasis clara, se deduce; cita casi literal, lo dice» (le ponía RV58 a quien reconocía bien una paráfrasis) y la prueba de «una oración contra dos datos», que duró unas horas el 13 nov: hay información explícita repartida en varias oraciones e inferencias que salen de una sola.
  - **Otro marco, que aquí no se sigue:** PIRLS clasifica la paráfrasis de oraciones como inferencia directa. Es un marco para 4.º de primaria; el del Minedu para secundaria y el de PISA (15 años) cuentan la paráfrasis como información explícita.
  - **Revisadas el 14 nov 2026** las 56 sondas ya publicadas, en 54 textos: ninguna cambia de clase, y se reescribieron 29 explicaciones que razonaban con la regla vieja (`docs/investigacion/revision-sondas-clasificar.md`). Las explicaciones de una sonda nombran lo que agrega, no las palabras que faltan.

## 4. La explicación: que se vea en el texto (regla 4)

Después de elegir, la pantalla muestra:

1. **El veredicto**, igual que en la práctica: "¡Bien! …" o "Elegiste la B. La correcta es la D: …". Los botones usan los estados de siempre (`ok` y `mal`), que son de bien y mal, no variables, y siempre van con texto.
2. **Por qué falla la que eligió**: su explicación y, en una línea aparte, qué error es, en lenguaje de alumno y sin el código ("Elegiste un detalle verdadero, pero el texto habla de algo más amplio"). Esa frase sale de `frases.json` (sección 5.1), una por código.
3. **La corrección del paso previo**, si lo hubo: la `explicacion` del previo (por qué la respuesta aceptada es la buena) y, si el alumno falló, la explicación de lo que eligió, o la frase de su código si el previo no trae una.
4. **El texto se pinta**, en la hoja o en la columna de la izquierda, y cada explicación lleva una marquita del mismo color que su parte del texto:
   - **evidencia**: las oraciones que prueban la correcta;
   - **distractor**: la oración de donde sale lo que eligió el alumno (su `origen`), si la tiene;
   - **idea**: en la corrección del paso previo, la oración aceptada.
5. **"Ver las demás alternativas"**, plegado: la explicación de cada una.

**Colores.** Se usan tres de la familia de variables que ya están en `app/estilos.css`, con sus versiones de modo oscuro. No se usan `--ok` ni `--warn`, que son de estado:

| Rol | Token | Por qué |
| --- | --- | --- |
| `evidencia` | `--c-i` turquesa | Lo que prueba la correcta |
| `distractor` | `--c-o` naranja | De dónde sale lo elegido; la marquita de su explicación va en el mismo naranja |
| `idea` | `--c-d` verde | La oración aceptada en el paso previo |

Las tres se muestran **como en `.var.c-*`: la letra en tinta, un subrayado de 3 px del color y un fondo del 12 %**. Así se siguen leyendo con contraste AA. `idea` se pinta solo en la corrección del paso previo y `evidencia` solo en la de la pregunta; se muestran una debajo de otra, cada una con su propio texto pintado, así que una oración nunca lleva dos colores a la vez. La distancia de color entre los tres y el contraste en los dos modos los fija `docs/diseno.md` (pedido en la sección 8).

**Regla de redacción:** las explicaciones nunca nombran letras ("la B es incorrecta"), porque las alternativas se barajan para cada alumno. Se refieren al contenido ("decir que el chuño es el más nutritivo…").

## 5. El banco: formato JSON

### 5.1 Dónde vive

```
contenido/razonamiento-verbal/
  indice.json          lista de textos y ejercicios, en orden; marca los de entrada y salida
  codigos.json         RV1… con su respaldo normalizado; se genera del informe (sección 7)
  frases.json          una frase para el alumno por código ("Elegiste un detalle…"); se escribe a mano
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

En el índice solo entran textos con revisión aprobada (regla 9); el ejemplo de abajo, con `revision: null`, todavía no podría.

### 5.2 Un texto

Ejemplo completo, propio. La versión que vale es la del banco, `contenido/razonamiento-verbal/textos/t001.json`, que pasó la revisión de la pieza 3 con más cambios (hechos y fuentes).

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
      { "id": "o1", "rol": "contraste", "t": "En las punas del sur andino, una helada fuera de temporada puede arruinar una chacra de papa en una sola noche." },
      { "id": "o2", "rol": "principal", "t": "Sin embargo, las familias aymaras y quechuas convirtieron ese mismo frío en una herramienta." },
      { "id": "o3", "rol": "detalle", "t": "Desde hace siglos, en junio, cuando la papa ya se cosechó y las heladas son más fuertes, extienden las papas sobre el pasto para que se congelen de noche y se descongelen con el sol del día." },
      { "id": "o4", "rol": "detalle", "t": "Cada ciclo de congelar y descongelar rompe las células del tubérculo, y el agua sale con más facilidad." },
      { "id": "o5", "rol": "detalle", "t": "Después, pisan las papas para exprimirles el agua que les queda y las dejan secar al sol." }
    ],
    [
      { "id": "o6", "rol": "detalle", "t": "El resultado es el chuño negro, un alimento liviano que puede guardarse varios años sin echarse a perder." },
      { "id": "o7", "rol": "detalle", "t": "Como ha perdido casi toda su agua, pesa mucho menos que la papa fresca y se lleva con facilidad en viajes largos." },
      { "id": "o8", "rol": "detalle", "t": "Por eso, en los años de mala cosecha, el chuño guardado ha servido como reserva contra el hambre." },
      { "id": "o9", "rol": "principal", "t": "Así, la misma helada que amenaza la chacra se vuelve, en manos de estas familias, la forma de conservar la papa." }
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
        "aceptadas": ["o2", "o9"],
        "ninguna": "RV3",
        "codigos": { "o1": "RV4" },
        "explicacion": "La oración 2 anuncia la idea y la 9 la completa: el mismo frío que amenaza la chacra sirve para conservar la papa. Las demás cuentan cómo se hace o qué se logra.",
        "explicaciones": { "o1": "La primera oración presenta el problema, pero el texto va más allá: dice cómo ese problema se vuelve útil." }
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
        { "t": "Una helada puede arruinar en una sola noche una chacra de papa.",
          "codigo": "RV3", "origen": "o1",
          "explicacion": "Se queda con la mitad del texto. Falta lo principal: que ese mismo frío sirve para conservar." },
        { "t": "El chuño también se prepara en el altiplano de Bolivia y en el norte de Chile.",
          "codigo": "RV8",
          "explicacion": "Puede ser cierto, pero el texto no lo dice. La idea principal sale de lo que se leyó, no de lo que se sabe por otro lado." }
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
        { "t": "un frío que arruina la chacra.", "codigo": "RV5", "origen": "o1",
          "explicacion": "Repite palabras de la primera oración, pero el \"Sin embargo\" de la oración 2 dice lo contrario: ese frío ahora se usa a favor." }
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
        "codigos": { "convencer": "RV33", "narrar": "RV13" },
        "explicacion": "El texto cuenta cómo se hace el chuño y para qué sirve, sin defender una postura ni contar una historia."
      },
      "enunciado": "¿Cuál es la intención principal del autor?",
      "alternativas": [
        { "t": "Explicar cómo las familias andinas aprovechan la helada para conservar la papa.", "correcta": true, "evidencia": ["o2", "o9"],
          "explicacion": "El texto expone un procedimiento y su resultado, sin tomar partido: explica." },
        { "t": "Narrar la vida diaria de las familias aymaras y quechuas.", "codigo": "RV13",
          "explicacion": "El texto no cuenta una historia ni sigue a personas: describe un procedimiento." },
        { "t": "Describir el chuño negro: cuánto pesa, cuánto tiempo dura y por qué se lleva con facilidad en los viajes.", "codigo": "RV3", "origen": "o6",
          "explicacion": "El chuño aparece, pero el texto lo usa para mostrar cómo la helada pasa de amenaza a recurso, y eso esta alternativa lo deja fuera." },
        { "t": "Convencer al lector de que el chuño es mejor que la papa fresca.", "codigo": "RV33",
          "explicacion": "El texto no dice cuál es mejor ni intenta convencer: solo dice que el chuño pesa menos que la papa fresca y que se guarda varios años." },
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
| `rol` | `principal` (dice la idea principal, entera o en parte), `apoyo` (la prepara o la sostiene), `detalle`, `ejemplo`, `general` (más amplia que el texto), `contraste` (lo que el texto supera o contradice; en t001, la helada como amenaza) o `cita`. Da el código por defecto del paso previo de idea principal (sección 5.3). |
| `preguntas` | De 3 a 5. |
| `hechos` | Los datos del mundo que menciona el texto, con una fuente que los respalde. El revisor los verifica. |
| `revision` | La anota el revisor: `{ "por": "subagente", "fecha": "…", "veredicto": "aprobado", "notas": "…" }`. |

**Campos de una pregunta:** `id` (`p1`, `p2`…); `tipo` (`idea-principal`, `inferencia`, `compatibilidad`, `incompatibilidad`, `extrapolacion`, `intencion`, `sentido-contextual`, `referente`, `conector`); `unidad` (una unidad del catálogo); `previo` (opcional); `enunciado`; `alternativas`.

**Campos de una alternativa:** `t`; `correcta: true` con `evidencia` (lista de oraciones), o `codigo` (un RV); `origen` (opcional, la oración de donde sale el distractor); `explicacion`.

### 5.3 El paso previo en el JSON

| `previo.tipo` | Campos | Cómo se califica |
| --- | --- | --- |
| `marcar-oracion` | `pide`, `aceptadas` (una o más oraciones), `ninguna` (solo en idea principal: el código si el alumno toca "Ninguna la dice completa", o `"correcta"` si la idea es implícita), `codigos` (código por oración), `explicacion`, `explicaciones` (opcional, por oración) | Correcta si la oración está en `aceptadas`. **En idea principal**, `aceptadas` son justo las oraciones con rol `principal`, y el código de las demás sale, en este orden: de `codigos`; RV4 si es la primera oración del texto (`o1`); y si no, del rol: `detalle`, `ejemplo` y `cita` → RV1; `general` → RV2; `apoyo` y `contraste` → RV3. **En eliminación**, no hay roles: `codigos` es obligatorio para cada oración no aceptada (RV30, RV31 o RV32). |
| `clasificar` | `pide`, `sonda` (la afirmación), `clase` (`lo-dice`, `se-deduce`, `no-se-sabe` o `lo-contradice`), `codigos` (un código o `null` por cada una de las otras tres clases; "no se sabe" ante algo que se deduce es RV34, y "lo dice" es RV58, nunca RV6 ni RV5), `explicacion` | Correcta si coincide con `clase`. Si no, el código de esa clase. |
| `relacion` | `pide`, `aceptada` (por ahora, siempre `oposicion`), `codigos` (`{ "suma": "RV26", "causa": "RV24" }`), `explicacion` | Igual |
| `relacion-analogia` | `pide`, `aceptada` (`a-produce-b`, `b-produce-a`, `a-parte-de-b`, `b-parte-de-a`, `a-usa-b`, `b-usa-a`, `a-tipo-de-b`, `b-tipo-de-a`, `a-causa-b`, `b-causa-a`, `sinonimos`, `contrarios`), `explicacion` | Correcta si coincide. Si no, el código lo fija la regla, sin tabla: la inversa de la aceptada → RV16; cualquier otra → RV17. |
| `proposito` | `pide`, `aceptada` (`explicar`, `convencer` o `narrar`), `codigos`, `explicacion` | Igual |
| `ordenar` | `pide`, `aceptada` (el orden, por ejemplo `["III", "I", "IV", "II", "V"]`), `explicacion` | Solo en plan de redacción. Correcto si coincide. Si no: RV28 si alguna oración con `retoma` quedó antes de la que retoma; si no, RV29. |

En idea principal, `aceptadas` puede tener más de una oración cuando dos resumen el texto casi igual de bien (en el ejemplo, la tesis anunciada en o2 y la conclusión de o9). Es mejor aceptar dos que castigar una respuesta defendible.

En plan de redacción, el previo `ordenar` se hace arrastrando tarjetas. Una oración lleva `"retoma": "II"` cuando empieza con un "este", un "dicho" o algo parecido que se refiere a la oración II. Con eso solo se detecta la parte de RV28 que es el orden de la información vieja y la nueva; un contraste roto cae en RV29. La regla de RV4 (primera oración) no se aplica en los ejercicios.

### 5.4 Ejercicios sueltos

Analogías, término excluido, oraciones incompletas, conectores, plan de redacción y eliminación de oraciones no tienen un texto largo: el enunciado es el ítem. Van en `ejercicios/`, con el formato de pregunta y un campo `cuerpo` según el tipo:

| `tipo` | `cuerpo` | Paso previo recomendado |
| --- | --- | --- |
| `analogia` | `{ "base": ["VACA", "LECHE"] }` | `relacion-analogia` |
| `termino-excluido` | `{ "terminos": ["chaquitaclla", "lampa", "pico", "surco", "hoz"] }` | Ninguno; la pregunta ya es una predicción |
| `oracion-incompleta` y `conector` | `{ "oracion": "Aunque la cosecha fue abundante, los precios ___ en la feria." }` | `relacion` |
| `plan-de-redaccion` | `{ "oraciones": [ { "n": "I", "t": "…" }, { "n": "II", "t": "…", "retoma": "I" } ] }` | `ordenar` (sección 5.3) |
| `eliminacion` | `{ "oraciones": [ … ] }` | `marcar-oracion` (tocar la que sobra) |

El banco de la pieza 3 empieza por los textos. Los ejercicios sueltos vienen después, con el mismo validador. Antes hacen falta unidades para término excluido y oraciones incompletas, que el catálogo no tiene (pedido en la sección 8).

### 5.5 Reglas que comprueba `banco.test.js`

1. Cada texto tiene de **150 a 350 palabras** y de **3 a 5 preguntas**. Cada pregunta tiene **4 o 5 alternativas**. La UNI usa 5 (A–E); se aceptan 4 para no forzar un distractor malo.
2. **Una sola alternativa con `correcta: true`**, con al menos una oración en `evidencia`.
3. Cada incorrecta tiene un `codigo` que existe en `codigos.json` y una `explicacion` no vacía. En `previo`, cada respuesta incorrecta lleva un código que existe o `null` cuando el informe no tiene un error para esa respuesta (por ejemplo, decir "lo contradice" ante algo que se deduce); con `null` se registra el error sin código.
4. **Dos incorrectas de la misma pregunta no llevan el mismo código**, para que la medición distinga un error del otro.
5. `evidencia`, `origen` y `aceptadas` apuntan a oraciones que existen en el texto. Los `id` de oración no se repiten.
6. Cada `unidad` existe en `catalogo/cursos/razonamiento-verbal.json`.
7. Cada texto de práctica tiene al menos una pregunta con `previo`, y cada `previo` tiene los campos de su tipo (sección 5.3), con un código para cada respuesta incorrecta posible. Los textos de entrada y salida no llevan `previo`.
8. Las explicaciones no nombran letras: el test rechaza `/\b(la|alternativa|opción) [A-E]\b/i`.
9. **Todo lo que está en `indice.json` tiene `revision.veredicto === "aprobado"`.** Un texto sin revisión puede estar en `textos/`, pero no en el índice.
10. **La correcta no es siempre la más larga.** En todo el banco, la correcta es la alternativa más larga en a lo sumo el 40 % de las preguntas. Un alumno con práctica elige por la longitud sin leer.
11. `codigos.json` coincide con lo que dice el informe (el test lo regenera en memoria y compara), así no hay dos fuentes de verdad. Cada código usado en el banco tiene su frase en `frases.json`.
12. En idea principal, `aceptadas` coincide con las oraciones de rol `principal`. En eliminación, cada oración no aceptada tiene código en `codigos`.

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

### 5.7 Un índice por módulo, figuras e idioma (rutina verbal B, 7 nov 2026)

**Un índice por módulo.** `indice.json` es el de `lectura-verbal` (con la entrada y la salida). Cada módulo más tiene `indice-<módulo>.json` en la misma carpeta, y su ficha apunta a él con `"banco"`. Todos usan `textos/`. `banco.test.js` valida todos los índices: un texto va en un solo módulo, y la entrada y la salida solo en `indice.json`. Los seis módulos de esta rutina son `tipologia-textual`, `resumen-sintesis`, `textos-discontinuos`, `texto-contexto`, `textos-filosoficos-cientificos` y `lectura-ingles`, uno por unidad.

**Tipos de pregunta nuevos:** `tipo-de-texto` (con previo `proposito`), `estructura` (organización o función de un párrafo), `resumen` y `titulo` (los dos admiten el previo `marcar-oracion`, igual que `idea-principal`), `dato` (leer o comparar un valor de una figura) y `contexto` (emisor, destinatario, situación).

**Figuras (textos discontinuos).** Un texto con `"tipo_texto": "discontinuo"`, y solo él, lleva `figuras`:

```json
"figuras": [
  { "id": "f1", "tipo": "tabla", "despues": 1, "titulo": "…", "columnas": ["Grado", "Agosto"], "filas": [{ "id": "f1a", "celdas": ["3.º", "42"] }], "nota": "Datos inventados para el ejercicio." },
  { "id": "f2", "tipo": "barras", "despues": 1, "titulo": "…", "unidad": "inscritos", "barras": [{ "id": "f2a", "etiqueta": "Fútbol 2025", "valor": 120 }] },
  { "id": "f3", "tipo": "recuadros", "despues": 0, "titulo": "…", "recuadros": [{ "id": "f3a", "titulo": "Antes", "t": "…" }] }
]
```

- `despues`: cuántos párrafos van antes de la figura (0, arriba de todo).
- Cada fila, barra o recuadro tiene su id, y `evidencia` y `origen` pueden apuntar a él o a la figura entera; la app los pinta con los mismos colores que las oraciones (borde y fondo) y los cita debajo de la explicación («la fila «4.º» de la tabla»).
- Las barras son horizontales y empiezan en 0. Con datos inventados, la nota lo dice y no se nombra un lugar ni una institución real.
- El largo mínimo de un discontinuo es 120 palabras, contando celdas, títulos y nota.
- Lo valida `validar` de `nucleo/lectura.js` (`figuras`, `elementos`, `referencias`, `etiquetaRef`, `citas`), con pruebas en `nucleo/lectura.test.js`.

**Idioma.** `"idioma": "en"` marca un texto en inglés (unidad `lectura-en-ingles`): la app pone `lang="en"` al texto y a sus citas, y el largo mínimo baja a 100 palabras. Las preguntas, los pasos previos y las explicaciones van en español.

### 5.8 Pares de textos A/B y preguntas en inglés (rutina verbal A/B, 8 nov 2026)

Desde 2019 cada examen de San Marcos trae un par de textos de dos autores que debaten o se complementan, y sus preguntas juegan con atribuir bien cada postura (240 preguntas de 690 en `docs/datos/admision-unmsm.csv`). Para eso, un texto puede llevar dos autores.

**Dos textos en un ítem.** Un texto con `"autores"` es un par A/B:

```json
"tipo_texto": "argumentativo",
"autores": [
  { "id": "A", "desde": 0 },
  { "id": "B", "desde": 1, "firma": "Una profesora de secundaria" }
],
"parrafos": [ [ …texto A… ], [ …texto B… ] ]
```

- `desde` es el primer párrafo de cada texto, contado desde 0: el A empieza en el 0 y el B en uno de 1 al último. `titulo` es opcional (por defecto, «Texto A» y «Texto B»), y `firma` es una descripción genérica, nunca una persona real.
- Las oraciones se numeran de corrido en los dos textos (el B sigue la numeración del A), así que las explicaciones citan igual que siempre. `oraciones()` le pone a cada una su `autor`.
- La app pone un rótulo («Texto A», con la firma) antes del primer párrafo de cada uno; el papel, también.
- Los pares van en su propio módulo, `textos-dialecticos` (`indice-textos-dialecticos.json`), con la unidad `textos-argumentativos-y-dialecticos`.

**Paso previo `atribuir`.** Es la predicción propia de los pares: el alumno lee una afirmación (`sonda`, una paráfrasis, nunca una cita) y dice quién la sostiene, antes de ver las alternativas.

| Opción | Lo que ve el alumno |
| --- | --- |
| `A` | El autor del texto A |
| `B` | El autor del texto B |
| `ambos` | Los dos autores |
| `ninguno` | Ninguno de los dos |

Campos: `pide`, `sonda`, `aceptada`, `codigos` (uno o `null` por cada una de las otras tres), `explicacion` y `explicaciones`. Se califica con la tabla, como `clasificar`. `banco.test.js` fija los códigos que dicen lo mismo en todos los textos:

- si `aceptada` es `A` o `B`: el otro autor es **RV59** (atribuir a un autor la postura del otro) y `ambos` es **RV60** (dar como de los dos lo que dice uno);
- si `aceptada` es `ambos`: `A` y `B` son **RV61** (no ver la coincidencia);
- `ninguno`, y todo lo de una `aceptada` `ninguno`, lo elige quien escribe el texto.

Un par lleva al menos un previo `atribuir`, y puede llevar también `clasificar` o `proposito`. `atribuir` solo vale en un texto con `autores`.

**Tipos de pregunta de los pares:** `controversia` (el tema en controversia o el eje del debate), `postura` (qué sostiene uno de los autores), `coincidencia`, `discrepancia`, `dialogo` (qué le objetaría o diría un autor al otro) y `sintesis` (lo que integra los dos textos). Solo van en un par. Además, los de siempre: `sentido-contextual`, `inferencia`, `compatibilidad`, `incompatibilidad` y `extrapolacion`.

**Códigos nuevos** (hipótesis, en el informe): RV59 a RV61, los del previo; **RV62**, la pareja con una sola mitad correcta («A defiende…; B propone…», o dos respuestas a la vez); y **RV63**, la extrapolación con un condicional contrario al texto que vuelve a confirmar lo que se negó.

**Preguntas en inglés.** En el examen, las preguntas del texto en inglés van en inglés. Una pregunta con `"idioma": "en"` (solo dentro de un texto con el mismo idioma) tiene el enunciado y las alternativas en inglés, y la app les pone `lang="en"`. Las explicaciones, los `pide` de los previos y sus explicaciones siguen en español. El tipo nuevo `antonimo` sirve para el antónimo contextual; el distractor de siempre es el sinónimo.

## 6. Medición

Se usa `nucleo/medicion.js` y sus columnas. Hay dos tipos de evento nuevos, que `resumir` hoy no cuenta (solo suma al alumno) y el CSV exporta con las mismas columnas. Así **el paso previo no se mezcla con el acierto de las preguntas**:

| Momento | Evento |
| --- | --- |
| El alumno toca "Ya lo leí" | `{ tipo: 'lectura', modulo, unidad, problema: 't001v1', ms }` |
| Confirma el paso previo | `{ tipo: 'previo', modulo, unidad, problema: 't001v1.p1', opcion: 'o5', correcta: false, error: 'RV1', respaldo, ms }`. En `opcion` va la oración (`o5`), `ninguna`, la clase, la relación o el orden (`III-I-IV-II-V`). |
| Elige una alternativa | `{ tipo: 'prediccion', modulo, unidad, problema: 't001v1.p1', opcion: '2', correcta, error: 'RV1', respaldo, ms }`. En `opcion` va **la posición de la alternativa en el banco** (1 a 5), no la letra que vio el alumno: como se barajan, la letra no se compara entre alumnos. |
| Prueba de entrada o salida | `{ tipo: 'prueba', fase, modulo, unidad, aciertos, total, respuestas, ms }`, como hoy. En `respuestas` van las posiciones en el banco, una por pregunta (`"215"`), no las letras. Hoy `respuestas` sale en el JSON exportado pero no en el CSV, porque no está en `COLUMNAS`. |

El `problema` lleva la versión del texto (`t001v1`), para que una corrección del texto no mezcle los datos viejos con los nuevos. Ojo: en la columna `opcion`, `practica.js` guarda la letra y lectura guarda la posición. Se distinguen por el `modulo`; quien analice los datos no debe mezclarlas.

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

   Con rutas relativas, la comprobación de `catalogo.test.js` (`existe('plantillas/' + d + '/' + f[campo])`) funciona sin un caso aparte (`path.join` las normaliza): basta `REQUERIDOS.lectura = ['banco', 'pruebas']`. Conviene que el test compruebe además que la ruta resuelta quede dentro de `contenido/`. **La ficha no debe entrar antes que la rama del paso 2**: sin ella, `construir-catalogo.js` armaría la dirección `#/practica/lectura-verbal` y archivos `undefined`. Cada unidad de la lista tiene que nombrar `lectura-verbal` en sus `plantillas`, porque el test comprueba el enlace en los dos sentidos.
2. **El catálogo.** `herramientas/construir-catalogo.js` le da la dirección `#/lectura/lectura-verbal`. Lee `indice.json` y pone en `archivos`, ya normalizados (`/contenido/razonamiento-verbal/…`), el índice, `codigos.json`, `frases.json` y todos los textos, incluidos los de entrada y salida: unos 5 KB por texto, unos 150 KB para 30.
3. **Sin conexión.** El `fetch` de `app/sw.js` hoy solo sirve desde la caché lo que empieza por `/app/`, `/nucleo/` o `/plantillas/`. Hay que agregar `contenido` a esa expresión: si no, el banco se guarda al instalar pero no se sirve sin red. También hay que agregar `/nucleo/lectura.js` y `/app/lectura.js` a `CASCARA` y subir `VERSION`.
4. **Un núcleo sin DOM**, `nucleo/lectura.js`, que sirva en el navegador y en Node, con funciones puras:
   - `validar(texto, codigos, unidades)`, que usa `banco.test.js`;
   - `preparar(texto, rng)`: baraja las alternativas con `nucleo/azar.js`, les pone letra y guarda su posición en el banco;
   - `calificarPrevio(previo, respuesta, texto)`: devuelve `{ correcta, error }` con las reglas de la sección 5.3;
   - `respaldo(codigo, codigos)`.
5. **La pantalla.** `app/lectura.js`, hermana de `app/practica.js`, con el flujo de la sección 2, su propio oyente de teclado y el registro de la sección 6. En `app/app.js`: la rama `lectura` en `render`, con la ruta `#/lectura/<id>/<unidad>` para filtrar por unidad; `'lectura'` en la lista que marca "Cursos" en la navegación; el texto del botón ("Leer") donde hoy dice "Abrir escena" o "Practicar"; y la etiqueta `<script>` en `app/index.html`.
6. **Papel.** Hecho (rutina verbal C, 7 nov 2026): `herramientas/papel-lectura.js` arma el `papel.json` de cada módulo de lectura, y `npm run catalogo` lo corre. Cada texto o ejercicio es un problema con el formato de siempre (`enunciado`, `respuesta`, `pasos`) y dos campos más: `texto` (título, oraciones numeradas por párrafo, figuras e idioma; o `lineas` en un ejercicio) y `preguntas` (cada una con su paso previo como consigna «Antes de mirar las alternativas…», enunciado y alternativas con letra). Las alternativas se barajan con la semilla fija `'papel'`. La `respuesta` es la clave de todas las preguntas y los `pasos`, la respuesta del previo y la explicación de cada correcta. No van la entrada ni la salida. Un módulo de verbal B lleva todos sus textos (4 o 5, de 13 a 20 preguntas); `lectura-verbal` lleva 10 ítems elegidos para cubrir sus 12 unidades. `vPapel` de `app/app.js` dibuja el texto, las figuras y las preguntas. `herramientas/papel-lectura.test.js` comprueba que cada `papel.json` esté al día y conserve la clave del banco.
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
- `herramientas/papel-lectura.js` y `herramientas/codigos-verbal.js` (secciones 7.6 y 7.7), y el ajuste de `vPapel` en `app/app.js` para enunciados con varios párrafos.
- `nucleo/medicion.js`: agregar `respuestas` a `COLUMNAS` si se quiere en el CSV. El segundo lo puede escribir esta rutina en la pieza 3 si se le amplía el alcance a ese archivo.
- `docs/diseno.md`: confirmar los tres roles de color de la sección 4 (`--c-i`, `--c-o` y `--c-d`), su distancia de color y la hoja que sube con el texto.

## 9. Lo que queda abierto

- **¿4 o 5 alternativas en San Marcos?** La UNI usa 5; lo de San Marcos no lo confirmé. El formato acepta las dos cantidades.
- **Lectura en inglés** (unidad `lectura-en-ingles`): el formato sirve igual, pero el informe no tiene sus errores. Queda fuera del banco por ahora.
- **Textos discontinuos** (tablas, gráficos, infografías): necesitan una tabla o una imagen dentro del texto. Se puede agregar un tipo de bloque (`{ "id": "g1", "tabla": … }`) cuando haga falta; no se diseña ahora.
- **Tiempo de examen.** No se muestra cronómetro. Si un profesor lo pide para simulacros, sería un modo aparte.
- **"Ninguna la dice completa"** cuando la idea sí está en una oración se registra como RV3 en el ejemplo, porque lo más probable es que el alumno vea solo una parte. Es una hipótesis más; los datos dirán si conviene un código propio.
