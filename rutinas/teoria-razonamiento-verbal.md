# Teoría de razonamiento verbal — reporte

Sesión paralela del 14 nov 2026, rama `teoria/razonamiento-verbal` (sale de `claude/awesome-einstein-ch5g9a`). Encargo: `rutinas/encargos/teoria-razonamiento-verbal.md`. No se integró a `main` ni se tocaron `app/`, `nucleo/teoria.js`, `nucleo/ecuacion.js` ni `nucleo/mascota.js`.

## Unidades hechas: las 18, todas `estado: 'completa'`

Cada archivo es `contenido/teoria/razonamiento-verbal/<unidad>.js`, con la ficha de tarea al inicio, las cinco decisiones sobre cada idea y los códigos de error. Todas pasan `contenido/teoria/teoria.test.js` (topes, piezas puras, 5 o más casos de «Ahora tú» por idea en 60 semillas, todos los temas del catálogo cubiertos) y se recorrieron en Playwright a 360 × 780.

| # | Unidad | Ideas (id) | Temas cubiertos |
| --- | --- | --- | --- |
| 1 | definiciones | genero-diferencia, rasgo-necesario | 3 de 3 |
| 2 | analogias | relacion-no-tema, clase-y-causa, sinonimo-antonimo | 5 de 5 |
| 3 | sentido-contextual | acepcion, denota-connota, palabra-precisa, inferir-significado | 5 de 5 |
| 4 | conectores | relacion-primero, clases, locuciones | 3 de 3 |
| 5 | eliminacion-de-oraciones | redundancia, impertinencia, incompatibilidad | 3 de 3 |
| 6 | plan-de-redaccion | abre-y-retoma, tiempo-y-causa, analizar-comparar | 4 de 4 |
| 7 | cohesion-y-coherencia | referente, repetir-sustituir-callar, conocido-y-nuevo, no-contradiccion | 5 de 5 |
| 8 | tipologia-textual | proposito, normas-textualidad, niveles | 5 de 5 |
| 9 | tema-e-idea-principal | tema-e-idea, jerarquia, mapa-conceptual | 5 de 5 |
| 10 | resumen-y-sintesis | alcance, parafrasis, sintesis | 4 de 4 |
| 11 | textos-discontinuos | tabla, escala, texto-y-grafico | 4 de 4 |
| 12 | inferencias | necesaria-probable, implicito, intencion-global | 4 de 4 |
| 13 | compatibilidad | cuatro-casillas, idea-principal | 3 de 3 |
| 14 | extrapolacion | caso-nuevo, condicional, mundos-posibles | 3 de 3 |
| 15 | textos-argumentativos-y-dialecticos | tesis-razones, cuestion-y-posturas, tesis-antitesis-sintesis | 4 de 4 |
| 16 | texto-y-contexto | deicticos, emisor-destinatario, misma-frase | 3 de 3 |
| 17 | textos-filosoficos-y-cientificos | texto-cientifico, texto-filosofico | 2 de 2 |
| 18 | lectura-en-ingles | palabras-que-enganan, main-idea, stated-or-not | 4 de 4 |

Precisiones del expediente que se respetaron: la idea principal puede estar implícita (predicción de la unidad 9: el texto del agua que hierve en Juliaca) y parafrasear no es inferir (idea propia en la unidad 10, y en inferencias se separa lo dicho de lo deducido).

**Colores, iguales en todo el curso (regla 4):** `i` turquesa = lo que el texto dice (evidencia); `o` naranja = la opción o afirmación que se prueba; `d` verde = la relación, el tema o lo que queda abierto; `h` rojo = lo que choca, sobra o se inventa. Cada unidad declara en su cabecera qué es cada color en su caso.

**Regla 1:** en textos discontinuos, todo porcentaje, diferencia y razón se calcula en el archivo, y «Ahora tú» genera los datos con semilla. En plan de redacción, los órdenes de las opciones se calculan desde el orden correcto y la vista. En texto y contexto, las fechas de «mañana» se calculan. En el resto, «Ahora tú» elige casos de bancos de 5 o 6 textos propios con la semilla, y baraja los distractores.

## Piezas nuevas del kit

- **`nucleo/kit/piezas/rv-texto.js`** (+ `rv-texto.test.js`, 6 pruebas). Afirmación: «la respuesta se sostiene en palabras concretas del texto, y se ven marcadas en su lugar». Texto propio en secciones (`parrafo`, `lista` numerada, `tarjeta`) con marcas de evidencia: fondo tenue y subrayado de 3 px con **trazo distinto por color** (continuo, discontinuo, punteado), para que el color no sea la única señal. Además: tachar, tapar (conserva el lugar), huecos con o sin recuadro, sellos en la cabecera y `junto` para seguir en el renglón de una lista. El ancho de cada trozo se fija con `textLength`, así las marcas caen exactas en cualquier fuente; el alto depende solo de los datos. El texto alternativo es el texto completo.
- **`nucleo/kit/piezas/rv-barras.js`** (+ `rv-barras.test.js`, 3 pruebas). Afirmación: «el largo de la barra solo es fiel al dato si la escala empieza en cero». Barras horizontales con título, párrafo opcional (infografía), escala que puede no empezar en cero (con corte rojo en el eje) y fuente.

Las dos se revisaron renderizadas a 360 px, en grises y en tema oscuro.

## Pedidos al molde (no se tocó `app/`)

1. **Bug en `app/teoria.js` (afecta a todos los cursos).** En `vista`, `const [, , , sub] = location.hash.split('/')` toma el elemento 3 de `#/unidad/<id>/teoria/<idea>`, que siempre es `teoria`. Resultado: los botones de la fila de ideas y la «Ficha de repaso» abren siempre la primera idea pendiente, y la ficha no se abre nunca. Arreglo: `const [, , , , sub] = …`. Para recorrer las unidades en Playwright se marcaron como hechas las ideas anteriores en `localStorage`.
2. **`.var` no parte línea** (`white-space: nowrap`). Un trozo de color largo en la lectura en vivo o en una ecuación se sale de la tarjeta a 360 px. En verbal, donde la lectura es una frase, se resolvió dentro de cada archivo con `corto()`: solo la cabeza va en color. Pedido: que una parte de ecuación pueda pedir `largo: true` (la clase `.var.largo` ya existe en el CSS).
3. **Marcar tocando el texto.** En verbal, el juego natural es tocar la frase en la figura. Hoy se marca con botones de opciones (funciona con teclado y con − / +, pero obliga a nombrar la frase por su número o sus primeras palabras). Pedido: un control `marcar` en el que la pieza declare zonas tocables por id de fragmento.
4. **Respuesta manipulable en «Ahora tú»:** marcar la frase que sostiene la respuesta, en lugar de elegir entre opciones.
5. **`alt(datos)` no recibe el estado:** el lector de pantalla oye el texto, pero no qué está marcado. La lectura en vivo lo dice en parte. Pedido: `alt(datos, estado)`.
6. **Conteo de casos distintos de «Ahora tú»:** solo mira pregunta y opciones, no la figura. En eliminación de oraciones hubo que poner el tema en la pregunta para que dos textos distintos contaran como casos distintos.

## Códigos de error nuevos (hipótesis, sin datos de alumnos)

Además de los RV1–RV63 que ya existen en `docs/investigacion/razonamiento-verbal-ideas-erroneas.md`:

| Código | Unidad | Idea errónea |
| --- | --- | --- |
| RVD1 | definiciones | Toma un rasgo frecuente por necesario («ave: animal que vuela») |
| RVD2 | definiciones | Definición demasiado amplia: clase lejana o falta de diferencia |
| RVD3 | definiciones | Toma un rasgo necesario por suficiente («pone huevos») |
| RVD4 | definiciones | (reservado: definición demasiado estrecha; no se usó) |
| RVA1 | analogías | Toma la sucesión por causa (lunes : martes) |
| RVL1 | sentido contextual | Cree que cambiar la connotación cambia lo que se describe |
| RVL2 | sentido contextual | Cree que dos sinónimos conservan siempre la valoración |
| RVL3 | sentido contextual | Prefiere el verbo comodín (hacer, ver) al preciso |
| RVL4 | sentido contextual | Deduce el significado por asociación con una palabra vecina y no por la pista |
| RVE1 | eliminación | Toma un contraste («sin embargo») por contradicción |
| RVP1 | plan de redacción | Fuerza «de lo general a lo particular» donde manda otra relación |
| RVC1 | cohesión | No reconoce la catáfora o la elipsis (cree que la oración está mal) |
| RVC2 | cohesión | Asigna el referente o el recurso a otro elemento de la oración |
| RVC3 | cohesión | Toma cohesión (conectores, pronombres) por coherencia |
| RVT1 | tipología | Cree que el largo o la forma deciden si algo es un texto |
| RVT2 | tipología | Clasifica el nivel de una pregunta por su dificultad y no por dónde está la respuesta |
| RVM1 | tema e idea | Hace el mapa conceptual como lista de palabras sin enlaces |
| RVM2 | tema e idea | Invierte el enlace de una proposición del mapa |
| RVR1 | resumen y síntesis | La síntesis inventa un acuerdo y borra un desacuerdo |
| RVG1 | textos discontinuos | Compara largos de barra con la escala truncada |
| RVI1 | inferencias | Toma una inferencia probable (inductiva) por necesaria |
| RVX1 | extrapolación | Lleva una relación fuera del alcance que el texto declara |
| RVX2 | extrapolación | Niega el antecedente o afirma el consecuente («si no llueve, se juega») |
| RVD5 | argumentativos | Exige que todo debate termine en síntesis |
| RVK1 | texto y contexto | Toma el momento de lectura por el momento del enunciado |

Hay que llevarlos a `docs/investigacion/razonamiento-verbal-ideas-erroneas.md` y a `contenido/razonamiento-verbal/codigos.json` si la sesión principal los acepta. RVD5 comparte prefijo con los de definiciones; se puede renombrar al integrar.

## No verificado

- Celular real, lector de pantalla real y alumnos reales: nada se probó con personas. Que la regla se entienda sin la animación se juzgó mirando capturas del paso final.
- Las animaciones `kit-nuevo` de «Mira» (marcas y sellos que aparecen) se vieron solo en capturas tomadas a 250 ms, a veces a mitad de la animación; no se congeló una tira de cuadros.
- Fuente real del celular: el ancho del texto se fija con `textLength` usando la medida del kit; con fuentes mucho más anchas, las letras se juntan un poco. Se midió en Chromium con Inter (±10 %).
- La mascota es el gato de respaldo hasta que llegue Iris de la sesión de personajes.
- La historia de cada unidad sale de la matriz; no se verificaron las fuentes en la web.

## Reporte de diseño

```
Ficha de tarea: una por unidad, en la cabecera de cada archivo (promesa, persona, resultado, orden de atención, estados, duda).
Sistema: existente (tokens --c-o/i/h/d, kit.css, trazo.js, lector app/teoria.js). Decisión nueva escrita en las piezas y en este reporte:
  significado de los cuatro colores en verbal (i evidencia, o lo que se prueba, d relación o abierto, h choque) y un trazo de
  subrayado por color (continuo, discontinuo, punteado) para no depender solo del color.
Carácter: acogedora, viva, precisa (docs/escena-viva.md) · firma: el hilo de color, que aquí une la frase marcada del texto con su
  rótulo en la lectura, la opción y la ecuación de la regla.
Movimientos: sin movimiento nuevo. Las marcas, tachas y sellos de «Mira» usan kit-nuevo + kit-aparece (corto 200 ms tras 480 ms, de kit.css);
  el texto nunca se mueve. Variante reducida: la de kit.css (solo fundido).
Verificación:
  · Contraste (calculado, WCAG): tinta sobre resaltado ≥ 10,2:1 en claro y ≥ 9,2:1 en oscuro; texto en color (huecos) ≥ 4,5:1;
    subrayado de 3 px contra su resaltado ≥ 3,8:1 (claro) y ≥ 3,8:1 (oscuro).
  · Grises: las cuatro marcas se distinguen por el trazo; la barra marcada, por su contorno de 3 px.
  · 360 px: recorridos en Playwright de las 18 unidades, los cinco momentos de cada idea; tema oscuro en textos discontinuos.
  · Topes de texto, piezas puras y casos de «Ahora tú»: contenido/teoria/teoria.test.js en verde.
  · «Sí» pendiente: nada avanza solo (lo garantiza el lector, no se tocó).
No verificado: ver arriba.
Hipótesis: marcar la evidencia en el texto (en vez de solo elegir opciones) debería bajar las respuestas por eco literal (RV5) y por
  «no lo dice» (RV36); se comprobaría con la medición de la teoría (eventos 'teoria', error por opción) en el colegio piloto.
Conflictos: el contrato pide que el juego sea «tocar y marcar»; con el molde de hoy se marca con botones (pedido 3). La lectura en vivo
  de verbal es una frase, no una cifra: choca con .var sin salto de línea (pedido 2).
```
