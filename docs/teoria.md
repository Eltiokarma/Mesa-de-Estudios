# Teoría interactiva: el molde de las 152 unidades

14 de noviembre de 2026. Es el contrato común de la teoría. Lo leen todas las sesiones que escriben teoría antes de tocar código. Si algo de aquí choca con `CLAUDE.md`, manda `CLAUDE.md`. Complementa `docs/escena-viva.md` (topes de texto, kit, mascota) y la sección 0 de `docs/pogil-v2-rive.md`.

**Pedido de Gerson (14 nov):** hacer la teoría, y que sea interactiva, no una página para leer. Tiene que presentarse con los tres skills de diseño (`diseno-y-animacion`, `arte-generativo-svg` y `estructura-visual-motion`) y con el compañero de cada curso, como pide la guía de personajes.

## 1. Fuentes (ya investigadas: no se vuelve a investigar)

Todo está en `docs/teoria/`.

| Archivo | Qué trae | Cómo se usa |
| --- | --- | --- |
| `matriz/<curso>.json` | Una ficha por unidad: `teoria` (núcleos), `condiciones`, `prerrequisitos`, `desempeno`, `escena_propuesta`, `otra_representacion`, `error_objetivo`, `fuentes` e `historia` (`historia`, `puente_escena` y `ecuaciones` en LaTeX con su `lectura` y sus `condiciones`) | Es la fuente principal: cada idea sale de un núcleo de `teoria` y de sus `condiciones` |
| `fuentes/teoria-152-unidades.html` (y `.txt`) | El expediente completo: síntesis, las 152 fichas, las precisiones por curso y los guiones desarrollados (MRU, Geometría 6, Trigonometría 15, porcentajes, dividir por x) | Antes de escribir un curso: leer su sección de «Precisiones» y sus guiones |
| `fuentes/historia-ecuaciones-1.pdf` y `-2.pdf` (y `historia-ecuaciones.txt`) | Historia, ecuaciones compuestas y diagramas por unidad. Páginas: física 4–24, química 25–45, aritmética 46–56, álgebra 57–68, geometría 69–81, trigonometría 82–100, razonamiento matemático 101–111, verbal 112–121 | La historia de la unidad y las ecuaciones con sus condiciones. Los diagramas inspiran la figura; no se copian |
| `fuentes/guia-personajes.pdf` (y `.txt`) | Los ocho compañeros: personalidad, voz, frases de ejemplo, expresiones E0–E9, gestos G1–G5 y el error sin humillación | La voz de cada línea que dice el personaje |

Las cifras de investigación y las fuentes no van al alumno (regla 8 de `escena-viva.md`); van en el archivo, como comentario o en `historia.fuente`.

## 2. Dónde vive y cómo se ve

- **Una unidad de teoría = un archivo** `contenido/teoria/<curso>/<unidad>.js`. El nombre es el id del catálogo sin el curso: `fisica.movimiento-rectilineo` → `contenido/teoria/fisica/movimiento-rectilineo.js`.
- `npm run catalogo` lo descubre solo y le pone a la unidad `teoria: { archivo, requiere, ideas }`. La puerta «Teoría» de la unidad pasa de «En preparación» a «3 ideas para jugar y entender».
- El service worker guarda el archivo y sus piezas: la teoría abre sin conexión. No hace falta tocar `app/sw.js`, `app/app.js` ni `app/teoria.js` para agregar una unidad.
- **Rutas:**
  - `#/unidad/<id>/teoria` abre la primera idea sin terminar;
  - `#/unidad/<id>/teoria/<idea>` abre esa idea;
  - `#/unidad/<id>/teoria/ficha` abre la ficha de repaso.

**La pantalla** (celular de 360 px primero):
- una fila de ideas deslizable, con ✓ en las terminadas, y la «Ficha de repaso» al final;
- la tarjeta de la idea:
  - la barra de los cinco momentos;
  - la figura del kit, que se queda a la vista al bajar;
  - la lectura en vivo;
  - la zona del momento;
  - el compañero del curso en un lugar fijo, con su línea de texto;
  - la acción principal, siempre en el mismo sitio.
- «¿De dónde sale esta idea?» (la historia) va plegada sobre la primera idea.

## 3. La secuencia: cinco momentos por idea

Una unidad tiene de 2 a 6 **ideas**. Cada idea es una relación que se puede comprobar, y recorre siempre los mismos cinco momentos. Es la versión corta de los cinco tiempos de POGIL v2 (`pogil-v2-rive.md` §5.1) con la regla 3: jugar, después predecir, después ver.

| Momento | Qué hace el alumno | Qué bloquea | Personaje |
| --- | --- | --- | --- |
| 1. **Juega** | Mueve la figura con controles (− y + o barra; nunca solo arrastre). Ve la lectura en vivo. Debe probar `minimo` casos distintos | «Ya probé, sigo» explica cuántos casos faltan; no se deshabilita | E1 `señala` → E0 `reposo` al primer toque |
| 2. **Predice** | Una pregunta neutra sobre algo que el juego **no** mostró, con el error típico entre las opciones | Sí: es el único bloqueo. Al comprobar, la figura muestra lo que pasa (`revelar`) | E3 `espera`; coincide E7 `celebra`; no coincide E5 `acompaña` |
| 3. **Mira** | Recorre la explicación como línea de tiempo de la figura (▶, cursor, ← →). Cada paso deja rastro | No | E4 `reposo` |
| 4. **La regla** | Lee la regla, su ecuación con el hilo de color y **la condición que la hace verdadera** | No | E6 `reposo` |
| 5. **Ahora tú** | Resuelve un caso nuevo (semilla), sin el juego. «No sé» abre la solución. «Otro caso» da otro | La idea queda terminada con un acierto | E7 `celebra` / E8 `acompaña` / `ayuda`; al terminar la unidad, `hito` |

El estado se guarda en `est.teoria[unidad].ideas[idea]`. Si el alumno ya predijo, no vuelve a predecir desde cero. La medición recibe eventos `{ tipo: 'teoria', unidad, idea, momento: 'juego' | 'prediccion' | 'ahora-tu' | 'fin', opcion, correcta, error, nose, ms }`.

**Rutas del plan (`pogil-v2-rive.md` §5.3) dentro del molde.** Los cinco momentos sirven a las cinco rutas; lo que cambia es qué se juega:
- **D · Descubrir:** se juega con la variable del fenómeno.
- **E · Seguir un ejemplo:** el juego recorre un ejemplo resuelto; los controles eligen el caso, y la predicción es «¿qué paso sigue?».
- **C · Comparar:** se juega deformando hasta que deja de cumplir; la predicción es «¿este caso cumple?».
- **R · Recordar:** el juego es tocar y ver; el «Ahora tú» se hace rápido y vuelve en el repaso.
- **A · Argumentar** (verbal): el juego es marcar la evidencia en el texto, con un control de opciones o una pieza propia; la predicción es elegir la lectura sostenible.

## 4. El formato del archivo

Se copia la forma de `contenido/teoria/fisica/movimiento-rectilineo.js`: es la unidad de referencia. Es UMD: en el navegador llama a `Teoria.unidad(def)` y en Node exporta `def`.

```js
{
  unidad: 'fisica.movimiento-rectilineo', version: '0.1.0',
  estado: 'borrador' | 'completa',     // completa = cubre todos los temas del catálogo
  requiere: ['/nucleo/kit/piezas/ejes.js'],   // solo piezas del kit
  historia: { texto (≤ 70 palabras), pregunta (≤ 16), fuente: { titulo, url } },   // la fuente no se muestra
  ideas: [{
    id, titulo (≤ 6 palabras), temas: ['<tema exacto del catálogo>', …], pieza: '<id del kit>',
    juega:   { consigna (≤ 25), voz (≤ 16), minimo,
               controles: [{ id, etiqueta, min, max, paso, inicio, unidad, decimales, color: 'c-o' }
                          | { id, etiqueta, opciones: [{ valor, texto }] }],
               dibujo: valores => ({ datos, estado }), lectura: valores => partes (≤ 12 palabras),
               montar?(contenedor, { valores, pintar }) },   // solo si la pieza trae un gesto propio
    predice: { pregunta (≤ 40), voz, opciones: [{ id, texto (≤ 14), correcta } | { id, texto, error, siFuera (≤ 20) }],
               dibujo: { datos, estado }, revelar: { datos, estado }, coincide, noCoincide },
    mira:    { pieza?, datos, base?, voz, pasos: [{ estado, texto (≤ 14), ecuacion }] },   // de 2 a 7 pasos
    regla:   { texto (≤ 30), ecuacion, condicion (≤ 22), voz },
    ahoraTu: { pieza?, voz, generar: semilla => ({ pregunta (≤ 40), dibujo?, opciones, solucion: { texto (≤ 20), ecuacion, dibujo? } }) },
  }],
}
```

- **Textos y ecuaciones** son listas de partes de `nucleo/ecuacion.js`:
  - `'texto'`;
  - `{ v: 'c-o', t: 'v' }` (variable con su color);
  - `{ frac: [num, den] }`, `{ sup: [base, exp] }`, `{ sub: [base, índice] }`;
  - `{ raiz }`, `{ vec }`, `{ abs }` y `{ par }`.
  Dos relaciones en una misma ecuación se separan con la parte `'   ·   '` (tres espacios a cada lado): en la regla grande cada una va en su línea.
  Un color por variable en toda la unidad, el mismo en el control, la figura, el texto y la ecuación (regla 4). Los colores de figura de las piezas son los mismos tokens sin `c-` (`'o'`, `'i'`, `'h'`, `'d'`).
- **Regla 1:** todo número que se ve lo calcula el archivo con código. Ningún resultado se escribe a mano si sale de una cuenta. Los casos de «Ahora tú» salen de `generar(semilla)` y dan al menos 5 casos distintos.
- **Las opciones incorrectas** llevan `error` (código de la idea errónea, el mismo de `docs/investigacion/` si existe; si no, uno nuevo marcado como hipótesis) y `siFuera`. `siFuera` empieza por lo que el alumno pensó bien y en qué caso sería cierto (regla 10 de `escena-viva.md`). Nunca «Incorrecto», «Elegiste…» ni «La correcta es…».
- **La figura:**
  - es una pieza del kit (`nucleo/kit/piezas/`): una función pura `dibujar(datos, estado) → SVG` con `alt(datos)`;
  - si ninguna sirve, se agrega una pieza nueva al kit con su `.test.js`, siguiendo el formato de las que hay (`ejes.js` es el modelo);
  - nunca se dibuja a mano dentro del archivo de teoría.
  Una pieza nueva:
  - lleva trazo del kit (`nucleo/kit/trazo.js`) y los tokens de variable;
  - no usa el color de marca ni el del curso;
  - tiene su afirmación escrita en el encabezado.
- **Cobertura:**
  - `temas` usa los textos exactos del catálogo;
  - una unidad `completa` cubre todos sus temas;
  - un tema puede repartirse en varias ideas, o una idea cubrir varios temas, si de verdad los enseña;
  - si una unidad necesita más de 6 ideas, se parte en dos archivos de lección.

  Esto último todavía no está soportado: se anota en pendientes y se pide.

## 5. Topes de texto (los vigila `contenido/teoria/teoria.test.js`)

| Campo | Palabras |
| --- | --- |
| Título de la idea | 6 |
| Consigna del juego | 25 |
| Línea del personaje (`voz`) | 16 |
| Lectura en vivo | 12 |
| Pregunta de predicción o de «Ahora tú» | 40 |
| Opción | 14 |
| `siFuera` | 20 |
| Paso de «Mira» | 14, más su ecuación |
| Regla | 30, más su ecuación |
| Condición | 22 |
| Historia | 70 |
| Solución de «Ahora tú» | 20, más su ecuación |

Como en `escena-viva.md`: el tope no se cumple a costa de entender. Si no cabe con frases completas, la figura carga más o la idea se parte en dos. En razonamiento verbal, el texto de lectura es el objeto de estudio y no cuenta para el tope; sí cuentan la consigna, las preguntas y las opciones.

## 6. Los tres skills: qué se le pide a cada uno

Antes de escribir un curso se cargan los tres skills, y se dejan a la vista sus pasos.

| Skill | Qué aporta a la teoría | Qué se entrega |
| --- | --- | --- |
| `diseno-y-animacion` (con `references/ensenanza.md`) | La ficha de tarea por idea, las nueve preguntas de Mayer, la escala de tiempo (`micro` 120 · `corto` 200 · `medio` 320 · `largo` 480 · `paso` 900) y la lista F de verificación (contraste, 44 px, movimiento reducido, nada que avance solo) | Una ficha de tarea de 6 líneas por unidad, como comentario al inicio del archivo, y el «Reporte de diseño» en la entrega |
| `estructura-visual-motion` | El método de cinco decisiones por idea: qué cambia, qué permanece, qué progresa, qué se reserva y qué debe verse. Ordena los pasos de «Mira» como progresión con una sola excepción reservada | Las cinco decisiones de cada idea, como comentario sobre la idea |
| `arte-generativo-svg` | La afirmación de cada figura (≤ 25 palabras) y la revisión a tamaño real: render a PNG, 360 px, en grises. Para los personajes: esqueleto, masas, auditoría de puntos y hoja de jerarquía | La afirmación en el encabezado de cada pieza nueva y las capturas revisadas |

**Ficha de tarea mínima por unidad** (comentario al inicio del archivo):
```
Promesa · Persona y condiciones · Resultado observable · Orden de atención · Estados · Duda que resuelve
```
**Cinco decisiones por idea** (comentario sobre cada idea):
```
Cambia: … · Permanece: … · Progresa: … · Se reserva: … · Debe verse: …
```

## 7. Los compañeros (guía de personajes)

| Curso | Personaje | Voz (de la guía) |
| --- | --- | --- |
| Aritmética | Luma, tortuga | Precisa, tranquila y concreta: «esta unidad», «comprueba». Nunca «es fácil» |
| Álgebra | Nox, cuervo | Breve, reflexiva y directa: «creo que…» seguido de una comprobación. Nunca oráculo |
| Física | Tilo, gato bicolor | Curiosa, concreta y algo seca; el humor es sobre la situación, nunca sobre la persona |
| Química | Bruna, castora | Resolutiva y cálida: instrucciones cortas que dejan margen a la predicción |
| Geometría | Neri, nutria | Activa y clara: verbos de acción y pausas para razonar. Nunca «se ve» en lugar de demostrar |
| Trigonometría | Mara, coneja | Cercana y rigurosa: «conservemos el origen y el sentido del ángulo». Sin diminutivos |
| Razonamiento matemático | Faro, zorro | Ágil, franca y juguetona en dosis pequeñas. Nunca «truco», «obvio» ni «te pillé» |
| Razonamiento verbal | Iris, lechuza | Reflexiva, llana y respetuosa: «señala qué frase permite sostenerla» |

- La asignación vive en `Teoria.PERSONAJES` (`nucleo/teoria.js`).
- Si una idea no trae su `voz`, el compañero dice su línea por defecto (`Teoria.PERSONAJES[curso].voces`, diez por compañero, escritas con su voz de la guía).
- Cada `voz` del archivo se escribe con la voz del compañero y respeta las reglas de la guía:
  - sin vergüenza ni sarcasmo;
  - el error se trata como «esta relación merece revisión»;
  - la pausa es legítima.
- Lo que dice el personaje va siempre en texto. La información para resolver nunca depende de él.

Hoy el respaldo dibujado de los ocho es el gato de siempre (`app/mascotas/gato/`). Los ocho respaldos SVG los hace una sola sesión, para que parezcan de la misma mano (sección 9). Se registran en `app/mascotas/registro.json` sin tocar la teoría. `app/teoria.js` ya pone la expresión de la guía en `data-expresion` (E0–E9, `Teoria.ACTUACION`) para el `.riv` futuro, y la pose del contrato actual de `nucleo/mascota.js`.

## 8. Cómo se trabaja una unidad

1. Leer la ficha de la unidad en `docs/teoria/matriz/<curso>.json`, su historia en el PDF y las «Precisiones» de su curso en el expediente HTML.
2. Repartir los núcleos de `teoria` en ideas (de 2 a 6). Cada una con sus cinco decisiones.
3. Elegir la pieza del kit de cada idea o hacer una nueva con sus pruebas.
4. Escribir el archivo copiando la forma del de referencia.
5. Correr `npm run catalogo` y `node --test contenido/teoria/teoria.test.js nucleo/kit/piezas/`. Deben quedar en verde.
6. Mirarla en el celular:
   - `npm run dev` y abrir `http://localhost:4173/app/#/unidad/<id>/teoria`;
   - recorrer los cinco momentos de cada idea con Playwright a 360 × 780;
   - mirar las capturas: ¿la figura se lee?, ¿la regla se entiende sin haber visto la animación?;
   - revisar también en tema oscuro.
7. `npm test` completo en verde. Un commit por unidad.

## 9. Producción en paralelo (14 nov)

- **Una sesión por curso.** Cada una trabaja en su rama, sale de la rama del molde y solo agrega archivos en:
  - `contenido/teoria/<su curso>/`;
  - piezas nuevas en `nucleo/kit/piezas/`, con nombre propio para no chocar.
  - No toca `app/`, `nucleo/teoria.js` ni `nucleo/ecuacion.js`. Si necesita un cambio ahí (un control nuevo, otro tipo de respuesta), lo pide en su reporte con el caso que lo justifica.
- **El orden dentro de cada curso:** primero las unidades de 3.º (las del piloto), después 4.º y 5.º.
- **Una sesión de personajes** hace los ocho respaldos SVG con el skill de arte, desde la guía.
- **Al integrar:** se juntan las ramas, se corre `npm run catalogo` (el `catalogo.json` siempre choca: se regenera, no se edita a mano), `npm test` y una pasada visual.

## 10. Lo que falta del molde (pendiente)

- Lecciones de más de 6 ideas (partir una unidad en varios archivos).
- Gesto propio de una pieza en el juego (hoy: controles y `montar`).
- Respuesta que se manipula en «Ahora tú» (hoy: opciones).
- La teoría en el resumen de la medición (`nucleo/medicion.js`) y en el panel del profesor.
- Que el servidor de cuentas guarde `est.teoria` (comprobar la unión del estado en `docs/cuentas.md`).
- Probar en el celular real de Gerson.
