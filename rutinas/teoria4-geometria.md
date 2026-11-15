# Ronda 4, geometría: el 3D con three.js (15 nov 2026)

Rama `teoria4/geometria`, desde `main`. Encargo: `rutinas/encargos/teoria4-geometria.md`. Molde: `docs/3d.md`.

Resultado: seis mesas 3D nuevas en seis unidades, cinco piezas vivas `geo-` nuevas más una de refuerzo, y un motor común con pruebas (`nucleo/solidos3d.js`). Todas son exploración libre (excepción de la regla 3): no piden predicciones. Cada mesa tiene controles con − y +, una `lectura` calculada por el motor y de 4 a 5 retos con `logrado`, `bien` y, donde hace falta, `pista`. Un commit por unidad.

## 1. Las 18 unidades

| # | Unidad | Clase | Razón (una línea) | Qué se hizo |
| --- | --- | --- | --- | --- |
| 1 | segmentos-y-angulos | plano | Rectas, ángulos y paralelas viven en un plano; girar no agrega nada. | Nada. |
| 2 | triangulos | plano | El triángulo y sus líneas son planos; las mesas SVG ya arrastran vértices. | Nada. |
| 3 | congruencia | plano | Los criterios se arman con compás y regla en el plano. | Nada. |
| 4 | poligonos-y-cuadrilateros | plano | Cóncavo, cruzado o convexo se decide en el plano. | Nada. |
| 5 | circunferencia | plano | Arcos, cuerdas y tangentes son planos. | Nada. |
| 6 | proporcionalidad-y-semejanza | plano | Thales y la bisectriz son planos; k³ del volumen ya está en «Escala al cubo» (prisma y pirámide). | Nada. |
| 7 | puntos-notables | plano | Los cuatro centros y la recta de Euler están en el plano del triángulo. | Nada. |
| 8 | relaciones-metricas | plano | Potencia, Euclides y Ptolomeo son relaciones planas. | Nada. |
| 9 | poligonos-regulares | plano | Inscritos y apotema, en el plano. | Nada. |
| 10 | simetria | **3D necesario** | La idea 3 (planos de simetría de sólidos) no se entiende sin girar el sólido. | Mesa «Planos que parten el sólido» (`planos-3d`), primera. |
| 11 | areas-poligonales | plano | Áreas de regiones planas. | Nada. |
| 12 | longitud-y-areas-circulares | plano | Sectores, coronas y lúnulas son planos. | Nada. |
| 13 | geometria-del-espacio | **3D necesario** | El ángulo con el plano y el diedro se miden en el espacio, no en el dibujo. | Mesa «La varilla y el diedro» (`varilla-diedro-3d`), primera. |
| 14 | poliedros | **3D necesario** | Contar lo oculto y ver cómo el desarrollo cierra el sólido pide girarlo. | Mesa «El desarrollo que se pliega» (`desarrollo-3d`), primera. |
| 15 | prisma-y-piramide | **3D necesario** | Secciones y volúmenes de sólidos. Ya tenía «El prisma que se corta». | Segunda mesa 3D: «Tres pirámides llenan la caja» (`tres-piramides-3d`). La del corte sigue primera. |
| 16 | solidos-de-revolucion | **3D necesario** | Una región que gira y barre un sólido: el giro es la idea. | Mesa «La región que gira» (`region-gira-3d`), primera. |
| 17 | geometria-analitica | plano | Plano cartesiano: rectas, reparto y elipse en dos dimensiones. | Nada. |
| 18 | razonamiento-con-figuras | **3D necesario** (solo la idea 6) | Los cubitos ocultos del cubo pintado solo se ven abriéndolo. Muescas, series y rutas son planas. | Mesa «El cubo pintado que se abre» (`cubo-abierto-3d`), primera. |

**3D de contexto:** ninguna unidad de geometría. Donde el 3D no es la idea, la figura es plana y el 3D solo adornaría.

No se cambió el `id` de ninguna mesa que ya existía. Ninguna unidad pasa de 5 mesas: las seis tocadas quedan con 4, salvo prisma y pirámide, que queda con 5.

## 2. Piezas nuevas (`nucleo/kit/piezas/`, todas sobre `Kit.vivo3d.montar`)

Cada pieza trae su respaldo plano SVG (puro), su `alt` con los números del motor y su `*.test.js`. Las pruebas cubren lo que muestran el respaldo y el `alt`, y que girar la vista no cambia lo que dice la figura.

| Pieza | Qué dibuja | Unidad | Pruebas |
| --- | --- | --- | --- |
| `geo-simetria-3d` | Sólido, plano por su centro y el reflejo (discontinuo, encima); con «todos», todos sus planos de simetría | simetria | 5 |
| `geo-espacio-3d` | Varilla con sombra, perpendicular, ángulo y ángulo recto en su plano; diedro que se abre con P, su pie H y la prolongación del piso | geometria-del-espacio | 5 |
| `geo-poliedro-3d` | Desarrollo plano que se pliega con `t`; vértices en una sola `InstancedMesh` | poliedros | 5 |
| `geo-revolucion-3d` | Región en su lugar y donde llegó, superficie barrida (`LatheGeometry`), camino del centroide y eje | solidos-de-revolucion | 5 |
| `geo-cubitos-3d` | Cubo de lado n que se abre; cada cubito del color de su clase, fuerte en sus caras pintadas y pálido en las demás | razonamiento-con-figuras | 5 |
| `geo-piramides-3d` | Caja partida en tres pirámides de cúspide común que se separan | prisma-y-piramide | 4 |

**Presupuesto, medido en el código:**
- Mallas: lo máximo es «todos los planos» del cubo, con 21; lo demás va de 3 a 12.
- Triángulos: lo máximo es la región que gira con el círculo, unos 4100; el cubo de lado 5 tiene 1500.
- Sin sombras, sin texturas y sin modelos: todo se arma con código. Lo que se mueve en el tiempo (plegar, girar la región, abrir, separar) es un control.

## 3. Motor nuevo: `nucleo/solidos3d.js` (window.Solidos3D)

**Qué trae:**
- Poliedros: catálogo de 16 sólidos, con las caras sacadas del casco convexo. `conteo`, `aristas`, `apoyar` y `volumen`.
- Simetría: `normalDe`, `reflejar`, `esPlanoSimetria` y `planosSimetria`.
- Desarrollo: `desarrollo(poli, t)`, con un árbol de caras y bisagras giradas por Rodrigues.
- Revolución: `region` y `revolucion`, con el área, el centroide y Pappus.
- Cubo pintado: `cubitos` y `porClase`.
- Rectas y planos: `varilla` y `diedro`.
- Dibujo: `tresPiramides` y `proyectar`, para los respaldos.

**Pruebas:** `nucleo/solidos3d.test.js`, 13 en total. Los valores esperados salen de fórmulas de libro o de otro motor, no de este:
- C, V y A de los 14 sólidos, y Euler.
- Planos de simetría: cubo 9, tetraedro 6, prisma hexagonal 7, icosaedro 15, entre otros. Se contrastan con `plantillas/simetria/motor.js` (`planos`), que arma sus sólidos con otras medidas.
- Desarrollo:
  - armado en t = 1 y plano en t = 0;
  - aristas sin estirar a cualquier t;
  - caras que no se enciman en los diez sólidos de la mesa.
- Volúmenes de cilindro, cono, esfera, cilindro hueco, toro y un cuarto de cilindro.
- Área y centroide de cada región, comprobados con la fórmula de la lazada sobre el perfil.
- Cubo pintado: 8, 12(n − 2), 6(n − 2)² y (n − 2)³, contados uno por uno para n de 2 a 6.
- Varilla y diedro: la sombra es L · cos a y PH es p · sen φ.
- Las tres pirámides valen abc/3 cada una en tres cajas.

## 4. Pedidos a la sesión principal (base, app y pruebas)

1. **Cargar `nucleo/solidos3d.js` en la app.**
   - Hoy va en `requiere` de cada unidad, antes de su pieza. `app/teoria.js` carga los `requiere` en orden (`async = false`), así que funciona.
   - Para eso cambié **una línea de `contenido/teoria/teoria.test.js`**: la expresión de `requiere` ahora acepta un motor 3D de `nucleo/` (`nucleo/[a-z0-9-]+3d.js`), además de las piezas, los motores de plantilla y `nucleo/elementos.js`.
   - Si prefieren sumarlo a `BASE` de `app/teoria.js` y a la precarga de `app/sw.js`, como `nucleo/geometria3d.js`, se quita de los `requiere` y se revierte esa línea. Hoy no está en `sw.js`: la teoría de esas unidades sin conexión depende de lo que la app guarde al abrirlas.
2. **Base (`vivo3d.js`): rótulos que no se salgan del lienzo.**
   - Caso: el rótulo «plano» de `geo-simetria-3d` quedaba cortado en el borde izquierdo a 360 px. Lo acerqué a mano (0,7 del cuadro).
   - Pedido: que `h.etiqueta` se acomode dentro del lienzo, o una opción `{ dentro: true }`.
3. **Base: rótulo tapado por su objeto.**
   - Caso: en `geo-piramides-3d`, con la caja cerrada y vista de frente, el rótulo «V = 2,67» de la pirámide verde cae sobre su propia cara verde y se lee con poco contraste.
   - Pedido: un fondo opaco para `.kit-3d-etq`, o una opción para ocultar el rótulo cuando su punto queda detrás de una cara.
4. **Base: encuadre que cambia con los datos.**
   - Casos: el desarrollo abierto, el cubo abierto y el toro alejado ocupan mucho más que el sólido cerrado. Hoy cada pieza reescala su contenido para que quepa (`geo-poliedro-3d`, `geo-cubitos-3d`).
   - Pedido: un `spec.radio(datos)` que ajuste la distancia de la cámara.
5. **Recorte local (`renderer.localClippingEnabled`).**
   - Caso: en simetría, pintar de otro tono la mitad del sólido a cada lado del plano.
   - No hizo falta: el reflejo discontinuo ya cuenta la idea. Si se agrega a la base, `geo-simetria-3d` lo aprovecharía.
6. **three.js:** no faltó ninguna clase. Usé `InstancedMesh`, `LatheGeometry`, `ShapeGeometry`, `TubeGeometry`, `CatmullRomCurve3`, `LineDashedMaterial`, `Shape` y `Matrix4`, todas del paquete.

## 5. Comprobación

- `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`: 672 pruebas en verde.
  - El validador busca cada reto en la grilla de los controles.
  - Uno, «Guarda las tres pirámides del ladrillo», pide tres casos guardados: lleva `testigo`.
- `npm test` completo: 8608 pruebas, todas en verde.
- **Playwright, a 360 × 780, con swiftshader**, por cada mesa. Script en el scratchpad de la sesión, no versionado:
  - el lienzo aparece;
  - girar cambia la figura: entre 9 % y 35 % de píxeles distintos;
  - «Vista inicial» la deja igual: 0 % de diferencia;
  - la lupa abre con el lienzo vivo;
  - «Pista» y «Muéstrame» resuelven el primer reto;
  - «Guardar este caso» deja la miniatura SVG;
  - ningún error en la consola.

  Miré las capturas de cada mesa y de un caso límite por mesa:
  - icosaedro a medio plegar y dodecaedro casi cerrado;
  - toro a 240°;
  - cubo de lado 5 abierto;
  - diedro de 135°;
  - ladrillo con las pirámides separadas.
- **Arreglos que salieron de mirar las capturas:**
  - la varilla apuntaba a la cámara: cambié la vista de partida;
  - el cubo de lado 5 abierto se salía del cuadro: ahora los cubitos se achican al abrir;
  - el interior verde pálido se veía gris: el pálido quedó menos lavado;
  - la lectura de poliedros encadenaba signos =: ahora dice «20 caras + 12 vértices = 30 aristas + 2»;
  - los rótulos «plano», «centroide» y «V =» se movieron.

## 6. No verificado

- El rendimiento en el Redmi 15C de Gerson. La emulación con swiftshader no mide fps reales.
- El tema oscuro y el modo ahorro de las seis mesas: no los recorrí, solo el tema claro.
- El corte del 3D por Android («Volver al 3D»): es de la base y no lo forcé.
- Los lectores de pantalla: los `aria-label` están, pero no se probaron con TalkBack.
- Las miniaturas del cubo de lado 5 abierto pesan unos 59 KB de SVG cada una (cuatro por mesa, como máximo). Funcionan, pero no medí cuánto tardan en un celular lento.
- El rótulo de la pirámide verde (pedido 3).
- **Las ideas erróneas detrás de cada reto son hipótesis.** Ejemplos: «los planos del cubo son solo 3» y «el volumen se dobla si se dobla la distancia al eje». No hay datos de alumnos.

## 7. Reporte de diseño

**Ficha de tarea (común a las seis mesas):**
- Promesa: girar un sólido y mover una sola cosa a la vez (el plano, el pliegue, el giro, la abertura) hasta ver la relación que la unidad enseña.
- Persona y condiciones: postulante de 3.º a 5.º, celular a 360 px, sin audio y quizás sin conexión, en el peor equipo que haya.
- Resultado observable: lograr los retos con el motor como juez, y comparar dos casos guardados.
- Orden de atención:
  1. el sólido y su rótulo de color;
  2. la lectura;
  3. el reto.
  - La acción es mover un control con − y +.
  - En segundo plano va Neri.
- Estados:
  - cargando: el respaldo SVG;
  - sin WebGL 2: el plano con su aviso;
  - en vivo;
  - reto pendiente, con pista, mostrado o logrado;
  - caso guardado.
- Duda que resuelve: «¿lo que veo en el dibujo es lo que se mide?». La medida sale del motor, no del dibujo.

**Sistema:** el del proyecto. Se usaron los colores por variable de cada unidad, tal como los declara su encabezado:
- simetría: sólido c-i, reflejo c-o, plano c-d;
- espacio: lo dado c-o, la perpendicular c-i, la proyección c-d, el ángulo c-h;
- poliedros: vértices c-o, aristas c-i, caras c-d;
- revolución: región c-o, eje c-i, superficie c-d, centroide c-h;
- cubitos: las cuatro clases de la mesa plana.

Son decisiones nuevas, escritas en el encabezado de cada pieza:
- **Tres pirámides:** una por color (c-o, c-i y c-d), con la cúspide común en c-h. Ahí la variable es «qué pirámide».
- **Cubo pintado, fuerte y pálido:** fuerte es una cara pintada; pálido, una sin pintar. El color nombra la clase.

**Carácter:** el de la app, sin cambios. La firma es el reflejo naranja discontinuo que «cae encima», y el mismo gesto se repite: una cosa se aleja o se cierra con un control, nunca sola.

**Movimientos:**

| Movimiento | Oficio | Tokens | Recorrido | Variante reducida |
| --- | --- | --- | --- | --- |
| Plegar, girar la región, abrir el cubo, separar las pirámides | Explicación | Ninguno: lo maneja el alumno con un control discreto (pasos de 10 % a 25 %, o de 30°) | — | Igual: no hay animación |
| Girar la vista | Gesto | El de la base, que sigue al dedo 1:1 | — | Igual |

- Nada se mueve solo.
- Como los cambios son discretos, cada paso deja una imagen fija que se puede comparar, y guardarlo deja evidencia.

**Verificación:**
- Puntos en «no» que quedan:
  - contraste del rótulo verde sobre la cara verde (pedido 3);
  - tema oscuro sin recorrer.
- El contraste de los rótulos HTML no se midió con herramienta: usan las clases `var c-*` de la app, que ya están medidas.
- Mediciones hechas:
  - diferencia de píxeles entre girar y volver (`dif.py` con numpy);
  - peso de los SVG de respaldo: de 2,3 a 5,1 KB, salvo los cubitos abiertos, con 59 KB;
  - mallas y triángulos, contados en el código.

**Hipótesis:**
- Ver el reflejo caer encima ayuda a contar planos por clases mejor que la imagen fija de la idea.
- Plegar paso a paso ayuda a contar las aristas sin duplicar.

Se comprobaría en el piloto con la medición de retos (`momento: 'invitacion'`) y con los errores GE-SIM5, GE-POLI y GE-CUB en las pruebas de salida.

**Conflictos:**
- Con el repo, ninguno. El cambio de una línea en `teoria.test.js` está declarado arriba.
- Con el skill: la escala de tiempos no aplica, porque no hay animaciones; todo cambio lo dispara el alumno.
