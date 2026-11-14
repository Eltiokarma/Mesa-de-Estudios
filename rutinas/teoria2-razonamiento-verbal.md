# Ronda 2 de la teoría: razonamiento verbal (14 nov 2026, noche)

Encargo: `rutinas/encargos/teoria2-razonamiento-verbal.md`, en la rama `teoria2/razonamiento-verbal`. Las 18 unidades
de `contenido/teoria/razonamiento-verbal/` traen ahora gesto directo, llaves, laboratorio propio y tipografía
revisada a 360 px. Todas pasaron de la versión 0.1.0 a la 0.2.0.

**Cómo se hizo.**
- La compatibilidad la hizo la sesión principal y quedó de molde.
- Las otras 17 unidades se repartieron entre cuatro sesiones paralelas, cada una en su propio worktree. Sus commits se
  integraron con cherry-pick, uno por unidad.
- Al final, la sesión principal pasó por las 18 unidades a la vez: arregló los sellos que tapaba la lupa, los trozos de
  color de las lecturas y los «↛».

**Pruebas.**
- `npm test`: 8492 de 8492 en verde.
- Validador (`contenido/teoria/teoria.test.js` y `nucleo/kit/piezas/*.test.js`): 363 en verde.

## El gesto de verbal

En verbal no hay ejes ni pistas: la figura es el texto (`rv-texto`). El gesto natural es **llevar el marcador a la
frase**:
- La manija va sobre el número de la oración en las listas, y sobre el subrayado en los párrafos.
- Al soltarla, salta a la frase más cercana al dedo.
- Mueve un control de opciones («Frase», «Oración», «Parte»…) que sigue teniendo sus botones como alternativa.

Las piezas exportan dos funciones para esto, con su prueba: `rv-texto.ancla(datos, id)` y
`rv-texto.cercana(datos, punto, ids)`.

Variantes que salieron en las unidades:
- **Banco de fichas:** palabras, pares, conectores o rasgos bajo el texto; la ficha que se arrastra entra al hueco
  (analogías, conectores, definiciones, sentido contextual, inferencias).
- **Cinta que tapa una oración:** eliminación de oraciones e inferencias.
- **Cuatro manijas para reordenar un plan:** plan de redacción.
- **Punta de la barra y comienzo del eje:** en `rv-barras`, textos discontinuos.

**Recorrido.** Script en `rutinas/teoria2-razonamiento-verbal/pw.js` (con `PORT=…` para otro puerto).
- Guarda el alumno de prueba antes de que cargue la app. Además de lo que pide el encargo, hace falta
  `practica['lectura-verbal'].entrada`, porque la entrada de lectura vive ahí.
- Arrastra la manija con el mouse y guarda 2 casos por mesa.
- Mide el ancho de la página y junta los errores de consola.

El grupo C dejó además `ficha.js`, que captura la ficha y cuenta las llaves.

## Ideas con arrastre y sin él

**45 ideas con arrastre y 8 sin arrastre** (53 en total). Todas las unidades tienen al menos una idea con arrastre.

| Unidad | Con arrastre | Sin arrastre y por qué |
|---|---|---|
| analogías | 3/3 | — |
| cohesión y coherencia | 4/4 | — (en la idea 1 el pronombre sigue con botones: «Él» y «lo» van pegados y dos manijas se pisarían) |
| compatibilidad | 2/2 | — |
| conectores | 3/3 | — |
| definiciones | 2/2 | — |
| eliminación de oraciones | 3/3 | — |
| extrapolación | 3/3 | — |
| inferencias | 3/3 | — |
| lectura en inglés | 3/3 | — |
| plan de redacción | 1/3 | tiempo-y-causa y analizar-comparar comparan tres planes fijos (A, B, C): no hay nada que agarrar. El reordenamiento libre está en el laboratorio |
| resumen y síntesis | 3/3 | — |
| sentido contextual | 4/4 | — |
| tema e idea principal | 1/3 | tema-e-idea: la cobertura se ve entera de una vez y las propuestas no están en el texto (su arrastre está en la mesa `propuestas`). mapa-conceptual: los enlaces que se prueban no están en la figura |
| texto y contexto | 2/3 | misma-frase: las situaciones que cambian no están dibujadas |
| textos argumentativos y dialécticos | 2/3 | tesis-antítesis-síntesis: lo que cambia es la tarjeta de síntesis entera |
| textos discontinuos | 2/3 | texto-y-gráfico: las afirmaciones que se prueban no están en la figura |
| textos filosóficos y científicos | 2/2 | — |
| tipología textual | 2/3 | niveles: lo que cambia es la pregunta; llevar el marcador a la evidencia sería responder por el alumno |

## Laboratorio

Cada unidad trae 3 mesas. La primera es la más rica; las otras dos son los juegos de sus ideas. Las mesas marcadas con
* tienen arrastre. En todas, la casilla, el conteo o el veredicto los calcula el código (regla 1).

| Unidad | Mesa rica | Qué tiene de más |
|---|---|---|
| analogías | `taller`* | 6 relaciones × 8 fichas, con el par invertido y la sucesión sin causa. Lectura: «se cumple / solo al revés / no se cumple» y «cumplen n de 8» |
| cohesión y coherencia | `concordar-no-basta`* | 3 pronombres × 4 candidatos, dos manijas. La concordancia se calcula por género y número. «Concuerda, sin sentido» (lo → un burro) |
| compatibilidad | `cuantificadores`* | Todas, al menos una, alguna no y ninguna, todas contra todas. La casilla sale de los mundos posibles. Es el caso «al menos una» que la idea reserva |
| conectores | `tablero`* | 3 huecos × 8 conectores de 6 clases, con «encajan n de 8»; «por eso» no encaja en ninguno |
| definiciones | `dos-rasgos`* | Dos rasgos a la vez y el ornitorrinco como caso raro; cuenta las aves que entran y las que se cuelan |
| eliminación de oraciones | `tres-cintas`* | Tres cintas a la vez sobre un texto con dos gemelas. Tapar las dos gemelas sí pierde información |
| extrapolación | `varios-cambios`* | Tres cambios juntos (bus, escuela, comedor); la casilla de cada oración sale de sus dependencias |
| inferencias | `tapa-premisa`* | Se tapa una premisa y se recalcula la fuerza de cada conclusión |
| lectura en inglés | `cuantificadores`* | All, some, not all y no contra todas; casillas «True: stated / it follows / False / Not stated» por mundos posibles |
| plan de redacción | `ordena-tu`* | Tres textos con cuatro oraciones libres (24 órdenes) y cuatro manijas |
| resumen y síntesis | `arma-resumen`* | Cuantificador × relación × marcador por el original, con «fiel en n de 5» |
| sentido contextual | `dos-palabras`* | «Fría» y «dura» en tres oraciones cada una, con tres controles; más `escala`* (del elogio a la crítica) |
| tema e idea principal | `propuestas`* | Tres textos (uno con la idea principal repartida) × cuatro clases de propuesta |
| texto y contexto | `calendario`* | Día de 1 a 31, cuatro meses y cuatro palabras de tiempo; los saltos de fin de mes y de año se calculan en código |
| textos argumentativos y dialécticos | `debate-armado`* | B acepta o niega el dato y propone lo mismo u otra cosa; se calcula qué se discute |
| textos discontinuos | `eje-libre`* | Dos manijas: la punta de Puno mueve el inicio del eje (0 a 80 t) y la de Juliaca mueve la venta. Lectura: «eje desde · se ve n veces · es n % más» |
| textos filosóficos y científicos | `cuanto-dice` | Método × palabra × alcance, con tres fallas posibles. Sin arrastre: cada control cambia una parte del informe |
| tipología textual | `mezcla` | 3 oraciones × 4 secuencias; el tipo dominante sale de una jerarquía tomada de Adam. Sin arrastre: lo que se elige es la secuencia, no un lugar del texto |

**Lectura y casos guardados.**
- En la lectura en vivo, solo va de color la cabeza corta del mensaje, de 14 letras o menos. Así el caso guardado se
  entiende solo y cabe en su miniatura.
- Los sellos de la figura quedan visibles en la miniatura.

## Llaves y tipografía

**Llaves.**
- Hay llaves en todas las reglas. En «Mira» van solo donde un símbolo pedía nombre.
- Las notas tienen 3 palabras o menos («compatible», «niega todo», «par base», «mira atrás», «lo que defiende»…).
- Los `' · '`, `' | '` y `'pero'` que separaban dos relaciones pasaron a `'   ·   '`: compatibilidad, lectura en
  inglés, argumentativos, discontinuos, extrapolación, analogías y cohesión.

**Tipografía.**
- **Lecturas anchas.** Antes, el trozo de color de una lectura podía tener hasta 26 letras. Como no se parte,
  desbordaba la miniatura del caso guardado: la página llegaba a 369, 366, 372, 373 y 378 px a 360. Ahora el tope es
  de 14 letras en las 18 unidades. El barrido final dio 360 px en las 54 mesas.
- **«↛».** La serif lo pintaba como «→/». Se cambió por palabras: «no asegura» y «no decide el tipo».
- **Reglas.** Se acortaron las reglas que se partían a mitad de expresión (texto y contexto, tema e idea principal,
  discontinuos, resumen) y una oración que `textLength` estiraba letra por letra (analogías).
- **Exponentes y unidades.** No hay «^» en verbal; los números con unidad («82 t», «n %») van juntos.

**Hallazgo 9.** En casi todas las unidades, «Mira» ya usaba el mismo `rv-texto` que el juego.
- Donde el juego agregó un banco de fichas, «Mira» usa la misma figura con el banco o sin él.
- Es el mismo texto: el banco es la herramienta, no otra representación.
- En texto y contexto, «Mira» de la idea 2 pasó a la figura del juego.

## Piezas tocadas

**`nucleo/kit/piezas/rv-texto.js`.** Solo se agregó; sin los datos nuevos, dibuja igual. Prueba en `rv-texto.test.js`.
- `ancla(datos, id)` y `cercana(datos, punto, ids)`: la manija de una frase y la frase más cercana al dedo.
- `datos.esquinaLibre`: la primera sección pone su sello en un renglón propio, a la izquierda, bajo su cabecera. El
  renglón se reserva siempre, así el alto sigue dependiendo solo de los datos.
  - Motivo: el botón de lupa del lector (`.te-zoom`, 44 px arriba a la derecha) tapaba ese sello en 11 unidades:
    analogías, cohesión, conectores, eliminación, inferencias, inglés, plan, sentido contextual, argumentativos,
    filosóficos y tipología.
  - Esas unidades lo usan; las otras siete ya habían bajado sus sellos a secciones inferiores.

**`nucleo/kit/piezas/rv-barras.js`** (grupo C). Se agregaron `extremo`, `valorEn` y `BAR` en las constantes, con
prueba en `rv-barras.test.js`.

No se tocaron `app/`, `nucleo/teoria.js`, `nucleo/ecuacion.js`, `nucleo/mascota.js` ni otros cursos.

## Pedidos al molde

1. **La lupa tapa la esquina superior derecha de toda figura.** En verbal lo esquivamos con `esquinaLibre`, pero las
   piezas de otros cursos que pongan rótulos ahí van a tener el mismo choque. Lo limpio sería que el lector ponga el
   botón fuera de la figura o le reserve su espacio.
2. **Trozos de color que no se parten.** `.te-caso figcaption` podría permitir el corte dentro de un trozo de color.
   Hoy la única defensa es un tope de largo en cada unidad.
3. **Controles de opciones que no aplican.** El lector no tiene cómo atenuar una opción que no aplica al caso elegido,
   como «Oración 4» en un texto de 3 oraciones; hoy se recorta en el código de la unidad.
4. **Manija en párrafo.** `rv-texto.ancla` la pone al centro del subrayado y puede tapar palabras cortas; cohesión y
   conectores usan un ancla local, al inicio del subrayado. Convendría una opción de la pieza para ponerla al margen.
   Dos manijas sobre palabras vecinas se pisan.
5. **Figura fija.** Al desplazar la página, la figura fija del juego y del laboratorio tapa la consigna. Se ve en las
   capturas a 360 × 780.
6. **Ancho de la ficha.** A 360 px, la ficha mide de 430 a 670 px de ancho por la fila de chips de ideas y un
   `span.lector`. Es de la app, no de las unidades.

## No verificado

- Celular real con dedo, lector de pantalla y teclado sobre las manijas.
- Personas reales: no sabemos si arrastrar el marcador a la frase se entiende sin la pista «Arrastra los círculos».
- «Mira», «Predice» y «Ahora tú» paso a paso dentro del flujo: se vieron sobre todo en la ficha y el validador los
  dibuja todos, pero no se miraron captura por captura.
- **Cifras escritas a mano en textos de «Mira»** que vienen de la ronda 1 (por ejemplo, «→ 3 mal ubicados» en
  definiciones): no se recalcularon.
- **Voz de Iris.** No se revisó si suenan a Iris los textos propios nuevos del laboratorio (la llama, «fría» y «dura»,
  la escala de conductas, el calendario, los cuantificadores).
- **Animación del sello.** Al soltar la manija, el sello se anima con `kit-nuevo`; ese lapso no se congeló cuadro a
  cuadro.

## Reporte de diseño

**Ficha de tarea.**
- **Promesa:** en cada unidad de verbal, el alumno lleva el marcador a las palabras que deciden la respuesta y ve la
  casilla o el veredicto en su sitio.
- **Persona:** postulante de 3.º a 5.º, en un celular de gama baja a 360 px, sin audio.
- **Resultado:** señala la evidencia, no solo elige una opción.
- **Orden de atención:** el texto, luego la frase marcada, luego el sello y después la lectura.
- **Estados:** sin tocar, arrastrando, suelto en una frase que decide, suelto en una que no decide, y caso guardado.

**Sistema.** Es el existente: la manija, la lupa y los colores i, o, d, h del curso. Decisión nueva: `esquinaLibre` en
`rv-texto`, escrita en el encabezado de la pieza.

**Carácter.** Se quedó la firma del curso: el subrayado con un trazo distinto por color, el sello y la cinta que tapa.
El marcador es la misma marca del subrayado, ahora movible.

**Movimientos.** Arrastre del marcador. Oficio: respuesta. Mientras se arrastra, la manija salta de frase en frase (es
discreto: cada frase es un estado). Al soltar, el sello aparece con la clase `kit-nuevo` del kit. Con movimiento
reducido, el sello aparece sin animación (lo resuelve el kit). Si se quita, se pierde el vínculo entre la frase y la
casilla.

**Verificación.**
- 54 mesas recorridas en Playwright a 360 × 780, con arrastre real y 2 casos guardados en cada una: ancho de 360 px y
  sin errores de consola.
- En cada grupo se probó al menos una idea con arrastre de verdad.
- El color nunca es la única señal: cada marca tiene su trazo (continuo, discontinuo, punteado) y el sello dice su
  casilla con palabras.
- Todo arrastre tiene botones como alternativa; el validador lo exige.

**No verificado.** Ver la sección anterior.

**Hipótesis.** Arrastrar el marcador a la evidencia debería bajar el error «lo no mencionado es incompatible» (RV36) y
«se da por dicho lo que solo se deduce» (RV58) frente a elegir solo la casilla. Se comprobaría comparando esos códigos
en la práctica de alumnos que pasaron por la teoría nueva con los de la ronda 1.

**Conflictos.** El encargo permite tocar solo piezas rv-* y solo para agregar. `esquinaLibre` agrega un dato opcional
sin cambiar el dibujo por defecto, así que cumple, pero tapa en la pieza un problema que es del lector (pedido 1).
