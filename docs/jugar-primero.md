# Jugar antes de preguntar: cómo se corrige una escena

14 de noviembre de 2026. Regla 3 de `CLAUDE.md` (decisión 20 de Gerson): **antes de cualquier pregunta, también de una predicción, el alumno juega con la simulación.** Las 99 escenas de hoy preguntan antes de dejar jugar. Este es el encargo para corregirlas; el molde ya construido es `plantillas/mruv/v2.html`.

## Las herramientas

- `nucleo/jugar.js` (`JugarPrimero.montar`): vela y deja inertes las preguntas hasta que el alumno juega, muestra la consigna y, cuando ya jugó, el botón «Ya jugué: seguir». Cuenta toques, arrastres, deslizadores y teclas dentro de la zona de juego.
- `herramientas/jugar-primero-pendientes.json`: las escenas que todavía no cumplen. `herramientas/jugar-primero.test.js` exige que toda escena fuera de la lista cargue `nucleo/jugar.js` y monte `JugarPrimero`, y que la lista solo tenga escenas que todavía no cumplen. **Al corregir una escena, se saca de la lista.**

## Cómo se corrige una escena

Todas comparten el armado: modo 1 «Paso a paso» (`#m1`, con la figura en `.bench` y los pasos con sus predicciones en `.guide`) y, en casi todas, modo 2 «¿Qué pasa si…?» (`#m2`).

1. **Decide con qué se juega.** Tiene que ser la simulación de la unidad, no un botón «Siguiente».
   - Si la figura del modo 1 ya se arrastra o tiene un control propio (un deslizador junto a la figura), esa es la zona de juego.
   - Si no (pasa en unas 72 de las 99), la escena abre primero en un juego libre: el explorador del modo 2 sin sus preguntas, o un control nuevo sobre la figura del modo 1 (arrastrar el objeto en vez de jalar un deslizador; sección 5.2 de `docs/pogil-v2-rive.md`). El juego no muestra lo que después se pregunta: si se pregunta hacia dónde apunta algo, el juego no dibuja esa flecha.
2. **Monta `JugarPrimero` antes de la primera pregunta de cada modo**, con la zona de juego en `escena` y lo que pregunta en `preguntas` (por lo general, la guía del modo 1, o el cuerpo de la guía del modo 2 sin la botonera de experimentos, para que se pueda elegir y jugar). Consigna de 14 palabras como máximo, en tono neutro (`docs/escena-viva.md`, reglas 1 y 10). Mínimo de interacciones: 2, salvo razón escrita.
3. **No rompas lo que ya hay:** la medición (`registrarPrediccion`), el celular (`nucleo/celular.js`), la accesibilidad (todo se puede con teclado) y el tema oscuro.
4. **Verifica con Playwright a 360 × 720 px:** al cargar, ninguna opción de predicción se puede tocar ni enfocar; después de jugar y pulsar «Ya jugué: seguir», la escena se recorre hasta el final; sin errores de consola; con movimiento reducido. Si un modo se abre directo por su ancla (`#que-pasa-si`), tampoco pregunta antes de jugar.
5. **Saca la escena de la lista,** corre `npm test` y haz un commit por escena (o por dos o tres escenas parecidas).

## Lo que no se hace aquí

El rediseño completo (formato, gesto y utilería de la sección 9 de la auditoría) va después, unidad por unidad. Aquí solo se cumple la regla 3 con lo que la escena ya tiene, más el control mínimo para poder jugar cuando no lo tenga.
