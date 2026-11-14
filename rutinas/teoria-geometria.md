# Reporte: teoría de Geometría (sesión paralela, 14 nov 2026)

Rama `teoria/geometria`, salida de `claude/awesome-einstein-ch5g9a`. Encargo: `rutinas/encargos/teoria-geometria.md`.
Compañera: Neri (nutria). Contrato: `docs/teoria.md`. No se tocó `app/` (salvo `app/datos/catalogo.json`, que
regenera `npm run catalogo`), `nucleo/teoria.js`, `nucleo/ecuacion.js`, `nucleo/mascota.js` ni archivos de otros cursos.

## Unidades hechas

Las 18 unidades de `catalogo/cursos/geometria.json`, todas en `estado: 'completa'` y con todos sus temas cubiertos.
Cada una pasó `node --test contenido/teoria/teoria.test.js` y un recorrido con Playwright a 360 × 780 por todas sus
ideas (juega con todos los controles, predicción, «Mira», regla y «Ahora tú»), sin errores de consola.

| Unidad | Grado | Ideas | Temas cubiertos | Commit |
| --- | --- | --- | --- | --- |
| segmentos-y-angulos | 3 | 5 | 6 de 6 | 6ce2e0a |
| triangulos | 3 | 4 | 5 de 5 | 9463251 |
| congruencia | 3 | 5 | 5 de 5 | bd756a3 |
| poligonos-y-cuadrilateros | 3 | 5 | 5 de 5 | 5151dda |
| circunferencia | 3 | 6 | 5 de 5 | 54cc049 |
| razonamiento-con-figuras | 3 | 6 | 4 de 4 | c40c15c |
| proporcionalidad-y-semejanza | 4 | 5 | 4 de 4 | ec3840f |
| puntos-notables | 4 | 3 | 3 de 3 | 4d9b57a |
| relaciones-metricas | 4 | 6 | 7 de 7 | bfcef1b |
| poligonos-regulares | 4 | 4 | 4 de 4 | 2ecbcb0 |
| simetria | 4 | 3 | 3 de 3 | 8289cb6 |
| areas-poligonales | 4 | 5 | 5 de 5 | f27c1b5 |
| longitud-y-areas-circulares | 4 | 5 | 5 de 5 | f2947c9 |
| geometria-del-espacio | 5 | 6 | 7 de 7 | 3fe7b8e |
| poliedros | 5 | 3 | 3 de 3 | db72586 |
| prisma-y-piramide | 5 | 6 | 7 de 7 | d23186f |
| solidos-de-revolucion | 5 | 6 | 6 de 6 | 4929fec |
| geometria-analitica | 5 | 6 | 6 de 6 | a43e4b8 |

Total: 89 ideas. El guion «Geometría 6» del expediente quedó en `proporcionalidad-y-semejanza` (idea
`area-y-escala`). Commit aparte 2ff1e7e: dieciocho condiciones reescritas para que lean bien después del «Vale si» que
antepone la app.

Cada archivo trae escrita la ficha de tarea (comentario de cabecera) y, sobre cada idea, sus cinco decisiones
(cambia · permanece · progresa · se reserva · debe verse).

## Pieza nueva

`nucleo/kit/piezas/geo-figura.js` (+ `geo-figura.test.js`), con prefijo del curso.

- **Afirmación:** lo que se dibuja mide lo que dice el problema; la relación que se enseña se ve pegada a su objeto, y lo
  que la hipótesis no garantiza se dibuja distinto (discontinuo o en otro color).
- Dibuja a escala, con una sola escala y marco fijo (`vista`), puntos, segmentos y rectas recortadas al marco, regiones
  (con `fondo` opaco para apilar cubos), circunferencias, arcos, ángulos (cuadradito en 90°, arcos múltiples y
  `rayita` de igualdad), rayitas de igualdad y puntas de paralelismo en segmentos, curvas (con `atras` para lo que queda
  detrás en 3D), rótulos y sólidos en proyección ortogonal (`tresD: { giro, alza }`) con aristas ocultas discontinuas.
  `desde`/`hasta` con `estado.corte` para la línea de tiempo. Trae `util` (polar, distancia, ángulo, pie de
  perpendicular, corte de rectas, área con signo, arcos muestreados) para que los archivos de teoría calculen sus datos
  (regla 1).
- Revisada renderizada a 340–360 px en claro, en grises (filtro) y en oscuro dentro de la app.
- Única excepción de color: `fill="var(--card)"` en las caras con `fondo`, para tapar lo que queda detrás. La prueba de
  la pieza la admite de forma explícita.

Herramientas que viven en los archivos de teoría de 5.º (no en la pieza, para no tocarla otra vez):

- `casco(puntos)`: casco convexo con caras orientadas hacia fuera (`poliedros`, `prisma-y-piramide`). Las cuentas de
  V, A y C salen del modelo, no del dibujo.
- `escuadra` y `arco3`: el ángulo recto y los ángulos en 3D se dibujan en su propio plano (se ven como rombos y arcos
  elípticos), porque la marca de ángulo plana de la pieza mide la proyección (`geometria-del-espacio`,
  `prisma-y-piramide`).
- `tangente(y0, ya, r)`: silueta exacta del cono y del tronco de cono en la proyección (`solidos-de-revolucion`).

## Pedidos al molde

1. **Enlace directo a una idea.** En `app/teoria.js`, `const [, , , sub] = location.hash.split('/')` toma `teoria` y no
   el id de la idea: `#/unidad/<id>/teoria/<idea>` abre la primera idea pendiente. El recorrido de prueba tuvo que
   avanzar en orden con «Siguiente idea».
2. **Quinto color de variable.** `nucleo/ecuacion.js` acepta `c-f`, pero la app solo define `--c-o`, `--c-i`, `--c-h` y
   `--c-d`. Con cuatro colores, el «un color por variable» se cumple dentro de cada idea, no en toda la unidad (por
   ejemplo, naranja es el radio en una idea y la base en otra).
3. **Recorte del SVG.** La pieza no recorta lo que sale de `vista` (se ve fuera del marco). Hoy cada archivo recorta a
   mano (rectas de analítica, vistas más amplias). Un `clipPath` en la pieza lo resolvería de una vez.
4. **«Ahora tú» solo con alternativas.** No hay respuesta manipulada (arrastrar un punto, marcar una región). En
   geometría sería natural pedir «marca el centro» o «arrastra P hasta…».
5. **Marca de ángulo en 3D.** La pieza mide los ángulos en la proyección; para 3D haría falta que `angulos` acepte
   puntos con z y dibuje el arco en el plano real (hoy lo hacen `escuadra`/`arco3` en cada archivo).
6. **Condición con «Vale si».** El texto fijo obliga a redactar cada condición como subordinada. Para reglas que no
   tienen hipótesis (solo una aclaración) convendría otra etiqueta, por ejemplo «Ojo».

## Códigos de error nuevos (hipótesis)

Se usan los códigos existentes GE1–GE23 de `docs/investigacion/geometria-ideas-erroneas.md` donde corresponden
(GE1, GE2, GE13, GE14, GE19, GE20, GE21 en 4.º y 5.º). Todos los demás son **hipótesis** sacadas del temario y de la
práctica de academia; no tienen datos de alumnos y se confirman con la medición del piloto. Cada uno lleva su
`siFuera` en el archivo de la unidad.

| Familia | Unidad | Qué recogen |
| --- | --- | --- |
| GE-SEG1–5, GE-ANG1–3, GE-CS1–4, GE-BIS1–3, GE-QB1–2 | segmentos-y-angulos | sumar tramos sin colinealidad, complemento/suplemento cruzados, bisectrices, quiebre entre paralelas |
| GE-TRI1–3, GE-DT1–3, GE-BIS4–5 | triangulos | suma de ángulos, desigualdad triangular, ángulo entre bisectrices |
| GE-CON1–3, GE-CON6–15 | congruencia | LLA, AAA, correspondencia de lados, base media, mediana a la hipotenusa, notables |
| GE-POL1–5, GE-TRP1–2, GE-VAR1–2 | poligonos-y-cuadrilateros | diagonales, ángulos interiores y exteriores, trapecios, Varignon |
| GE-TAN1–2, GE-POS1–2, GE-CIC1–2, GE-PON1–3 | circunferencia | tangentes, posiciones relativas, cuadrilátero inscrito, Poncelet y Pitot |
| GE-PER1–2, GE-SER1–2, GE-DIS1, GE-CNT1–2, GE-RUT1–2, GE-CUB1 | razonamiento-con-figuras | perímetros por traslación, series, conteo de triángulos, rutas, cubos pintados |
| GE-THA1–3, GE-CEV1–3, GE-SEM1 | proporcionalidad-y-semejanza | Thales y bisectriz, Ceva y Menelao, emparejar lados semejantes |
| GE-PN1–4, GE-EU1–2 | puntos-notables | baricentro 2 : 1, centros dentro o fuera, recta de Euler |
| GE-EUC1–2, GE-MED1–3, GE-HER1–2, GE-POT1–3, GE-PTO1–2 | relaciones-metricas | proyecciones, Euclides, Stewart, Herón, potencia, Ptolomeo |
| GE-REG1–7, GE-AUR1–2 | poligonos-regulares | apotema y radio, lado de inscritos, sección áurea |
| GE-SIM1–5 | simetria | simétrico axial, central y por un plano; planos de simetría |
| GE-AR1–5 | areas-poligonales | base y altura, razón de áreas, rombo, trapecio |
| GE-CIR1–5 | longitud-y-areas-circulares | avance de la rueda, π en la razón, (R − r)² en la corona, sector sin restar el triángulo, lúnulas |
| GE-ESP1–8 | geometria-del-espacio | perpendicular a una sola recta, seno por coseno, proyección más larga, distancia al plano por distancia a la recta, distancia a la arista, rectas cruzadas, triedro con suma ≥ 360°, desigualdad de caras |
| GE-POLI1–4 | poliedros | contar solo lo visible, Euler sin el 2, no dividir entre 2, «hexaedro» por hexágonos |
| GE-PP1–4 | prisma-y-piramide | sombra de la arista como altura, una cara por todas, diagonal de cara o suma, tronco como promedio |
| GE-REV1–5 | solidos-de-revolucion | tronco de cilindro con la generatriz mayor, área lateral por total, tronco de cono sin Rr y Pappus con πd, desarrollo con g/r, esfera y zonas |
| GE-AN1–5 | geometria-analitica | pesos sin cruzar, pendiente de la vertical, distancia sin valor absoluto, centro con el signo del paréntesis, foco a 4p o c² = a² + b² |

## No verificado

- Celular real, gama baja y pantallas táctiles: todo se vio en Chromium de escritorio emulando 360 × 780.
- Lectores de pantalla: los `alt` cuentan la relación, pero no se escucharon con NVDA, VoiceOver ni TalkBack.
- Grises: solo con filtro CSS, no con daltonismo simulado por tipo.
- Otros navegadores (Safari, Firefox).
- Alumnos reales: ninguna predicción ni distractor se probó con postulantes; los códigos nuevos son hipótesis.
- Datos históricos: tomados de las fuentes citadas en cada unidad (MacTutor, Joyce, OpenStax); no se contrastaron con
  fuentes primarias. En el papiro de Moscú se dice solo lo que la fuente sostiene (el procedimiento, no cómo se obtuvo).
- Exactitud fina de lo oculto en 3D: la pieza decide «detrás» por la profundidad del punto; en el borde de la base de un
  cono el tramo discontinuo puede diferir unos grados del tramo realmente oculto.

## Reporte de diseño

**Ficha.** Promesa por unidad en la cabecera de cada archivo. Persona: postulante de 3.º a 5.º de secundaria, celular a
360 px, sin audio, quizás sin conexión. Resultado observable: resolver los tipos de pregunta del temario de la unidad.
Orden de atención: figura y lectura → pregunta → «Comprobar» → Neri. Estados: los seis del molde.

**Sistema.** Se usaron solo los tokens existentes: cuatro colores de variable (`c-o`, `c-i`, `c-h`, `c-d`), grosores
de la pieza (`variable`, `contorno`, `fino`), discontinuo para lo que la hipótesis no garantiza o lo oculto, y la
tipografía del kit (rótulos de 14 px o más). Convención de color por idea: dato naranja, auxiliar turquesa, curva o
base verde, lo pedido rojo. Coordenadas escritas «(x; y)» para no chocar con la coma decimal, como en el resto del repo.

**Carácter.** Figuras de lápiz y regla: trazo limpio, cuadrícula fina, sin sombras ni degradados. La firma de la pieza
son las marcas de igualdad (rayitas, arcos repetidos, puntas de paralelismo) y el cuadradito del ángulo recto, que en
3D se dibuja en su plano real.

**Movimientos.** Solo la línea de tiempo de «Mira» (`desde`/`hasta` con `corte`): cada paso agrega una pieza y la
anterior queda a la vista. Nada se mueve solo; el alumno mueve los controles en «Juega». Oficio: explicación.

**Verificación.** Hoja de todos los estados de cada idea renderizada a 360 px (claro y grises) y mirada una por una;
recorrido de cada unidad en la app con Playwright a 360 × 780 y capturas revisadas; `npm test` completo en verde antes
del último push. Correcciones típicas tras mirar: rótulos encimados, vistas que cortaban la figura, figuras 3D vistas
de canto (diedro, tronco de prisma), rectas que salían del marco.

**No verificado.** Lo de la sección anterior.

**Hipótesis.** Que ver el ángulo recto 3D como rombo ayuda a no medir el dibujo (GE-ESP); que la fila de sectores
convence del área del círculo; que la cámara que gira en «proyección y ángulo» separa ángulo dibujado de ángulo real.
Se comprobarían con las predicciones del piloto (tasa de acierto antes y después de esas ideas).

**Conflictos.** El molde fija un «Vale si» que obliga a redactar las aclaraciones como condición (pedido 6). Cuatro
colores obligan a repetir colores entre ideas de una misma unidad (pedido 2). Sin recorte en la pieza, cada archivo
cuida su marco (pedido 3).
