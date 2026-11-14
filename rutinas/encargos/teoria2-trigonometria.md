# Encargo, ronda 2: teoría de Trigonometría con gesto directo, llaves, laboratorio y tipografía (14 nov 2026, noche)

Eres una sesión paralela del proyecto Mesa de Estudios (repo Eltiokarma/mesa-de-estudios). Las 152 unidades ya tienen teoría (ronda 1). Gerson la vio y pidió:
1. **arrastrar la figura** en el juego;
2. **tipografía cuidada y legible**;
3. **llaves «}» giradas** bajo las ecuaciones para explicar los símbolos (con color solamente, se pierden);
4. **zoom** en los gráficos;
5. **más laboratorio** para que jueguen.

El molde ya hace 1 a 4 en el lector (`app/teoria.js`): falta aplicarlo a cada unidad y armar su laboratorio. Tú haces las 19 unidades de Trigonometría.

## Arranque
1. Trabaja en la rama `teoria2/trigonometria`, que sale de `claude/awesome-einstein-ch5g9a`. Si no estás en ella, créala desde esa rama. Sube solo a `teoria2/trigonometria` (`git push -u origin teoria2/trigonometria`); nunca a main ni a otra rama. No abras PR.
2. Lee `CLAUDE.md` y `docs/teoria.md`, **sobre todo la sección 4b** (gesto directo, llaves, lupa, tipografía y laboratorio). Después lee `docs/auditoria-teoria.md` y la unidad de referencia `contenido/teoria/fisica/movimiento-rectilineo.js`: sus ideas 1 a 3 tienen `arrastres`, sus reglas tienen llaves y trae `laboratorio`. Copia su forma.
3. Carga los tres skills antes de tocar nada: `anthropic-skills:diseno-y-animacion` (con `references/fisica-y-gestos.md` y `references/ensenanza.md`), `anthropic-skills:estructura-visual-motion` y `anthropic-skills:arte-generativo-svg`.

## Qué hacer en cada unidad de `contenido/teoria/trigonometria/`
1. **Gesto directo.** En cada `juega` donde la figura tenga algo natural que agarrar, agrega `arrastres`. Ejemplos: el vértice, el punto, la marca, el tramo de la gráfica, la ficha, el peso, la frase. La manija mueve la variable del fenómeno y el ojo ve la que responde. Los − y + se quedan como alternativa.
   - Usa la geometría que exporta la pieza (`geometria(datos)`, `escala`). Si una pieza de tu curso (prefijo propio) no la exporta, agrégasela, con su prueba.
   - Si de verdad una idea no tiene nada que agarrar, déjala con controles y anota la razón en el reporte.
   - Meta: al menos una idea con arrastre en cada unidad, y en casi todas las que tengan figura.
2. **Laboratorio.** Cada unidad trae `laboratorio` con 1 a 3 mesas propias.
   - Al menos una debe ser más rica que los juegos de las ideas: más controles, rangos más amplios, el caso raro que la idea no deja probar, o dos cosas juntas para comparar.
   - Con arrastres, siempre que se pueda. Sin preguntas.
   - El alumno guarda casos y los compara: diseña la lectura en vivo para que un caso guardado se entienda solo.
3. **Llaves.** En las reglas y en los pasos de «Mira» donde un símbolo necesita nombre, usa la parte `{ llave: [...], nota: 'qué es', color }`.
   - La nota tiene 3 palabras o menos. No pongas llave a todo: solo a los símbolos que el alumno tiene que nombrar.
   - Dos relaciones en una ecuación se separan con la parte `'   ·   '`; corrige las que estaban juntas con `' · '` o `'; '`.
4. **Tipografía.** Revisa en las capturas a 360 px que:
   - nada quede cortado ni partido a la mitad de una expresión;
   - ningún número quede separado de su unidad;
   - los exponentes vayan con `{ sup }` y nunca con «^»;
   - la lectura en vivo quepa.
   Las letras sueltas ya salen en cursiva solas.
5. **Auditoría, hallazgo 9.** Si el juego usa un dibujo y «Mira» otro, decide: o «Mira» empieza por el dibujo que el alumno movió, o explicas en un comentario por qué son dos representaciones.

## Reglas que no se rompen
- Las de `CLAUDE.md`:
  - regla 1: todo número lo calcula el código;
  - regla 3: se juega antes de cualquier pregunta;
  - regla 4: un color por variable;
  - regla 5: contenido propio.
- No toques `app/`, `nucleo/teoria.js`, `nucleo/ecuacion.js`, `nucleo/mascota.js` ni archivos de otros cursos. `app/datos/catalogo.json` se regenera con `npm run catalogo`; nunca se edita a mano.
- **Piezas comunes del kit** (sin prefijo): solo puedes tocar estas: ninguna (usa y mejora las trig-*). Y solo para **agregar** exports o datos opcionales, sin cambiar lo que ya dibujan, con prueba. Las demás piezas comunes se usan sin editarlas. Si necesitas algo de una que no es tuya, anótalo en el reporte.
- Si el molde no te alcanza (otro tipo de gesto, respuesta manipulable en «Ahora tú»), no lo inventes en `app/`. Anótalo en el reporte con el caso que lo pide.
- **Después de cada unidad:**
  - corre `npm run catalogo` y `node --test contenido/teoria/teoria.test.js nucleo/kit/piezas/`: el validador revisa que cada manija caiga en la figura, que esté donde dice su valor y que mueva controles reales;
  - con `npm run dev`, recorre en Playwright a 360 × 780 la idea con arrastre (arrastra de verdad con el mouse) y el laboratorio (`#/unidad/<id>/teoria/laboratorio`; guarda 2 casos);
  - mira las capturas.
  Para saltar la prueba de entrada, guarda antes en localStorage 'lab-v1' un alumno con `uni: 'unmsm'`, `grado: '4'` y `pruebas: { 'trigonometria': { enCurso: true } }`.
- Un commit por unidad, con un mensaje en español («Teoría de <unidad>: gesto, llaves y laboratorio»), y push después de cada commit. `npm test` completo en verde antes del último push.
- Habla con el usuario en español peruano informal. El contenido para alumnos va en español claro y neutro, con la voz de Mara (`docs/teoria/fuentes/guia-personajes.txt`).

## Al terminar
Deja `rutinas/teoria2-trigonometria.md`:
- cuántas ideas con arrastre y cuántas sin él, y por qué;
- las mesas de laboratorio por unidad;
- las piezas tocadas;
- los pedidos al molde;
- lo no verificado;
- el «Reporte de diseño» del skill.

Súbelo con el último commit. No integres a main: la sesión principal integra.
