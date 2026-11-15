# Encargo, ronda 3: glosario por tema y retos comprobados en razonamiento matemático (15 nov 2026)

Eres una sesión paralela del proyecto Mesa de Estudios (repo Eltiokarma/mesa-de-estudios). Las 152 unidades ya tienen teoría (ronda 1) y gesto directo, llaves y laboratorio (ronda 2). Gerson pidió dos cosas más:

1. **Un glosario por tema.** En sus palabras: «Palabras nuevas, términos repetidos, todo para que el alumno no se encuentre con algo "en chino"».
2. **Retos en el laboratorio que de verdad se comprueben.** El alumno juega, el motor ve si lo logró y se lo dice.

El molde ya lo hace en el lector (`app/teoria.js`) y en el validador (`nucleo/teoria.js`, `nucleo/glosario.js`). Falta escribirlo en cada unidad. Tú haces las 19 unidades de razonamiento matemático.

## Arranque
1. Trabaja en la rama `teoria3/razonamiento-matematico`, que sale de `claude/awesome-einstein-ch5g9a`. Si no estás en ella, créala desde esa rama.
   - Sube solo a `teoria3/razonamiento-matematico` (`git push -u origin teoria3/razonamiento-matematico`); nunca a main ni a otra rama.
   - No abras PR.
2. Lee `CLAUDE.md` y `docs/teoria.md`, **sobre todo la sección 4d** (retos comprobados y glosario por tema).
3. Lee la unidad de referencia `contenido/teoria/fisica/movimiento-rectilineo.js`. Busca `glosario:` (12 términos) y las `invitaciones` de la mesa `pista-libre`: 4 retos, cada uno con su `logrado`, que usa las mismas funciones del motor que dibujan. Copia su forma, no sus temas.
4. Carga el skill `anthropic-skills:diseno-y-animacion` (con `references/ensenanza.md`) antes de escribir. Lo usarás para los retos (metas claras, retroalimentación inmediata) y para revisar las capturas.

## Qué hacer en cada unidad de `contenido/teoria/razonamiento-matematico/`, en el orden del curso
**El orden** es el de `catalogo/cursos/razonamiento-matematico.json`. Importa porque cada término se define una sola vez por curso, en la unidad que lo estrena; las demás unidades lo heredan solas.

### 1. Glosario (`glosario`)
- **Cantidad:** de 6 a 15 términos por unidad. Son las palabras que esa unidad estrena en el curso:
  - magnitudes y conceptos;
  - nombres de leyes, propiedades, figuras, funciones o recursos;
  - siglas;
  - palabras comunes con sentido técnico.
  - No van las palabras de la escena (carrito, caja, pelota).
- **Qué ya existe:** antes de escribir, corre `node herramientas/palabras-glosario.js <unidad>`.
  - Lista las candidatas que ningún glosario del curso cubre todavía. Es una ayuda: decides tú.
  - Si un término ya se definió en una unidad anterior del curso, **no lo repitas**: el lector lo marca solo y dice «Lo viste en…». La prueba falla si se define dos veces.
- **Cómo se escribe cada definición:**
  - de 20 palabras o menos;
  - sin usar la palabra que define;
  - en español claro, para un alumno de 3.º de secundaria;
  - que diga **qué es** y, si cabe, **para qué sirve**. «Cuánto cambia la velocidad en cada segundo» sirve; «Magnitud vectorial derivada» no.
  - Tiene que ser correcta: nada de simplificar hasta decir algo falso.
- **Campos:**
  - `simbolo` y `medida`, cuando existen;
  - `ejemplo`: uno concreto y corto, con números calculados de verdad (regla 1);
  - `ver`: términos relacionados del curso;
  - `formas`: cuando el texto lo dice de otra manera («distancia» por «distancia recorrida»). El plural simple ya viene solo.
- **Que aparezca en el texto:** cada término tiene que salir en la teoría de la unidad, y el validador lo revisa. Si una palabra clave del tema no sale en ningún texto, el problema es el texto: corrígelo (la consigna, un paso de «Mira», la regla).
- **En razonamiento verbal** los términos son los del análisis del texto: tesis, argumento, conector, analogía, hipérbaton, etc. No van las palabras de los textos de lectura.

### 2. Retos del laboratorio (`invitaciones` en las mesas de `laboratorio`)
- **Cuántos:** cada unidad trae al menos una mesa con 3 a 6 retos, y lo ideal es que los traigan todas sus mesas propias.
  - En las mesas que reusan el juego de una idea (`Object.assign({ id, titulo, pieza }, idea.juega)`), agrega `invitaciones` en el primer objeto.
- **La forma:** cada reto es `{ texto, logrado, bien }`:
  - `texto` (de 16 palabras o menos): una meta que se ve en la figura y no se responde de memoria. Por ejemplo: «Haz que…», «Busca el menor…», «Consigue que dos… sean iguales», «Guarda dos casos que…».
  - `logrado(valores, guardados)`: devuelve `true` solo si el reto se cumplió, **calculado con las mismas funciones del motor que dibujan**. No uses un número escrito a mano si el motor lo puede calcular. Si mira los casos guardados, declara los dos argumentos.
  - `bien` (de 16 palabras o menos, con la voz de Faro): no repite «¡Bien!». Dice qué se descubrió o abre la siguiente pregunta («¿Qué pasa si…?»).
- **De varios tipos:**
  - un extremo (el menor, el mayor, el primero que…);
  - un caso exacto;
  - una forma o un patrón que se ve;
  - una comparación entre dos casos guardados.
  - Al menos uno por unidad tiene que tocar la idea central del tema, no un detalle.
- **Qué revisa el validador:**
  - que el reto se pueda lograr con los controles reales;
  - que no esté ya cumplido al abrir la mesa;
  - que `logrado` no falle.
  - Mantén `logrado` barato: se evalúa en toda la grilla.
- **Si un reto bueno pide algo que la mesa no tiene** (otro control, más rango), puedes ampliar la mesa. Pero **no cambies el `id` de una mesa ni el de sus controles**: la colección guardada de los alumnos depende de ellos (docs/teoria.md, 4c).

## Reglas que no se rompen
- **Las de `CLAUDE.md`:**
  - regla 1: todo número lo calcula el código;
  - regla 3: se juega antes de cualquier pregunta;
  - regla 4: un color por variable;
  - regla 5: contenido propio. Las definiciones se escriben, no se copian de libros ni de academias.
- **Qué no se toca:**
  - `app/`, `nucleo/teoria.js`, `nucleo/glosario.js`, `nucleo/ecuacion.js`;
  - las piezas comunes del kit;
  - los archivos de otros cursos.
  - `app/datos/` se regenera con `npm run catalogo`; nunca se edita a mano.
- **Si el molde no te alcanza** (un reto que no se puede expresar, un término que el lector marca mal), no lo inventes en `app/`. Anótalo en el reporte con el caso que lo pide.
- **Después de cada unidad:**
  - corre `npm run catalogo` y `node --test contenido/teoria/teoria.test.js nucleo/glosario.test.js`;
  - cada 4 o 5 unidades, recórrelas con Playwright a 360 × 780, con `npm run dev`:
    - abre una idea y toca un término subrayado; mira la hoja;
    - abre `#/unidad/<id>/teoria/glosario` y busca una palabra;
    - en el laboratorio, cumple un reto moviendo los controles y comprueba que diga «✓ Lo lograste»;
    - mira las capturas.
  - Para saltar la prueba del tema, guarda antes en localStorage `'lab-v1'` un alumno con `uni: 'unmsm'`, `grado: '4'` y, por cada unidad que abras, `temas: { '<unidad>': { entrada: { fecha: '2026-11-15', aciertos: 0, total: 5, nose: 0, sabidas: [], expuesto: [] } } }`.
- **Commits:** uno por unidad, con un mensaje en español («Glosario y retos de <unidad>»), y push después de cada commit. `npm test` completo en verde antes del último push.
- **Idioma:** habla con el usuario en español peruano informal. El contenido para alumnos va en español claro y neutro; los `bien`, con la voz de Faro (`docs/teoria/fuentes/guia-personajes.txt`).

## Al terminar
Deja `rutinas/teoria3-razonamiento-matematico.md` con:
- los términos por unidad: cuántos propios y cuántos heredados (los da `app/datos/glosario/razonamiento-matematico.json`);
- los retos por unidad y de qué tipo;
- las mesas que ampliaste;
- las palabras que dudaste si iban o no;
- los pedidos al molde;
- lo no verificado.

Súbelo con el último commit. No integres a main: la sesión principal integra.
