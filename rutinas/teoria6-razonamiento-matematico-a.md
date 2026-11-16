# Ronda 6: «Lee» y «Así se resuelve» en razonamiento matemático, parte A (16 nov 2026)

Encargo: `rutinas/encargos/teoria6-razonamiento-matematico-a.md`. Rama `teoria6/razonamiento-matematico-a`, que sale de `main`. Las 10 unidades tienen los dos momentos en **todas** sus ideas: 34 ideas.

`npm test` completo: 8788 de 8788 en verde antes del último push.

Cómo se hizo: cinco subagentes, cada uno con dos unidades en su propia copia del repo (worktree) y tocando solo los archivos de sus unidades. La sesión principal copió cada archivo a la rama, volvió a correr `npm run catalogo`, `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'` (764 en verde cada vez) y Playwright en una idea por unidad, e hizo un commit por unidad con push.

El recorrido en Playwright está en `rutinas/teoria6-razonamiento-matematico-a/pw.js`:
- uso: `PORT=… node rutinas/teoria6-razonamiento-matematico-a/pw.js <unidad-corta> [idea] [salida]`, con `CURSO=` para otro curso;
- qué comprueba, a 360 × 780 y con el alumno `{ uni: 'unmsm', grado: '5' }`:
  - la idea abre en «Lee» y el botón pasa de tarjeta en tarjeta hasta «Siguiente: Juega»;
  - «Ir directo a jugar» salta al juego;
  - con `momento: 'resuelve'`, el botón revela los pasos de a uno, sale la respuesta y «Otro ejemplo» cambia el enunciado;
  - no hay errores de consola y la página no pasa de 360 px.

Cada subagente lo pasó por **todas** las ideas de sus unidades, y todas dieron TODO BIEN. La sesión principal lo repitió en una idea por unidad.

En todas las ideas, «Así se resuelve» usa las mismas funciones que «Ahora tú» (regla 1), con `azar(s + 900)`. Donde «Ahora tú» tenía el generador dentro de su `generar`, se sacó a una función común y se comprobó que «Ahora tú» sigue dando lo mismo. En ordenamiento y verdades se compararon las semillas 0 a 39 y el JSON sale idéntico.

## Por unidad

### razonamiento-deductivo (4 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| conclusion-necesaria | Premisa y conclusión (los mototaxistas de Juliaca); un círculo por grupo; qué quiere decir «algunos»; qué mirar. No dice si A y C quedan amarrados | Un silogismo de «Ahora tú». Se dibujan las premisas sin agregar nada; en «¿Tiene sentido?» se prueba el distractor |
| si-entonces | El condicional, con p y q; los cuatro casos; el caso que la regla prohíbe; qué mirar. No resuelve «la pista está seca» | Regla y dato, con la misma tabla `tablaSi`. Se tachan filas hasta que queda una |
| doble-entrada | Qué es un reparto (6 sin pistas); filas y columnas; ✗ y ✓; qué mirar | El cuadro con las pistas de «Ahora tú». Dos pasos «Lo aplico»: primero las ✗, después el reparto único |
| parentesco | El árbol genealógico; subir y bajar; tíos y primos; qué mirar | Una relación de parentesco. El camino se dibuja por tramos y la comprobación es el parentesco al revés |

### certezas (3 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| peor-caso | Sacar sin mirar (la kermés); suerte o certeza; qué mirar | Las tres metas de «Ahora tú». La urna muestra la peor secuencia y la ficha que obliga |
| palomar | Objetos y casilleros; los cumpleaños como reparto; lo más parejo; qué mirar | `k(m − 1) + 1`, con la figura del palomar |
| llaves | Qué es identificar; qué es una prueba en el cuadro; qué mirar | `n(n − 1)/2`, con `pruebas()` y la tabla de llaves |

### trazos-y-perimetros (4 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| un-solo-trazo | El reto de la pizarra; qué es un vértice y su número par o impar de líneas; un cruce no es vértice; qué mirar | La figura al azar de «Ahora tú» (`FIG_AT`): se cuentan las líneas de cada punto y los impares, se revisa que la figura esté unida y se da el veredicto |
| recorrido-minimo | El vigilante que recorre las calles de un parque; qué es repetir un tramo (en naranja); qué mirar | El rectángulo con cruz: 3·(w + h) más lo que se repite, con lo repetido en naranja |
| deslizar-lados | Cercar un terreno (perímetro); figuras escalonadas; el rectángulo punteado; qué mirar | P = 2·(W + H) + 2·e. Se comprueba que no depende del número de escalones |
| arcos-que-suman | Bordes curvos y π; la semicircunferencia con un ejemplo de 10 cm (no 12, que se acercaría a la respuesta de «Predice»); dejar π escrito; qué mirar | El arco de arriba más los n de abajo. Se comprueba con π ≈ 3,14 |

### arreglos-numericos (3 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| suma-magica | Qué es un cuadrado mágico; la suma mágica; los números seguidos y su total; qué mirar | Un 3 × 3 con números en progresión: pide S = T ÷ 3 o el centro, con 4S = T + 3c. Al final se dibuja el tablero |
| vertices-dos-veces | El acertijo del triángulo; esquinas y lados; anotar el total y la suma de las esquinas; qué mirar | 3S = T + V, con la misma búsqueda `arregloTri`. Se comprueba sumando un lado del dibujo |
| reparto-parejo | Dos hermanos se reparten sacos de papa en la feria de Juliaca; el total y la mitad; par e impar (con 9, no con 15); qué mirar | Tres casos, con la misma `particion`: sale el reparto, el total es impar, o el total es par y aun así no sale |

### ordenamiento-de-informacion (3 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| orden-lineal | La foto de la promoción; los puestos 1.º a 4.º; qué es un orden (24 sin pistas); qué mirar | «¿Quién está en el puesto k?». En «Lo aplico», el tablero muestra los órdenes que quedan |
| orden-circular | El almuerzo familiar en Puno; derecha e izquierda mirando al centro; «junto a» y «frente a»; qué mirar | «¿Quién está a la derecha de X?», con la mesa resuelta. Si quedan varias mesas, no nombra a nadie |
| mesa-cuadrada | Las carpetas juntadas en un compartir; numerar primero; en el juego la mesa todavía es redonda | «Frente a» o «comparte lado», según la semilla. Se compara con la mesa redonda |

### verdades-y-mentiras (3 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| suposicion | Veraces y mentirosos; las dos cosas de cada frase; suponer como un detective; qué mirar | 6 pasos: 8 suposiciones, se descarta la más cercana mostrando en qué fila choca y se confirma la buena |
| contradictorias | Cuatro sospechosos; suponer un culpable; de qué habla cada frase; qué mirar | Cuántas frases son falsas con cada culpable. Si hay un par contradictorio, sirve de atajo |
| negar-bien | «Todos», «ninguno» y «alguno»; qué es negar; qué mirar | Los 4 tipos de frase de «Ahora tú», cada uno con su regla y su comprobación. No lleva dibujo, como «Ahora tú» |

### traslados-y-puntos-cardinales (3 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| camino-y-flecha | Las calles de Juliaca en cuadrícula; los cuatro rumbos; camino (naranja) y distancia d (turquesa); qué mirar. No dice que este y oeste se anulan | Un paseo de tres tramos: netos, hipotenusa, y d no pasa de lo caminado. La flecha se dibuja en las cuentas |
| torre-que-se-muda | La torre de Hanói (Lucas, 1883); sus reglas; qué es el mínimo de movimientos; comparar con la torre de un disco menos | El mínimo con `minMov`, por 2·T(n − 1) + 1, comprobado con 2ⁿ − 1. Solo se dibuja hasta 5 discos |
| pasar-un-numero | La suma de cada grupo; la diferencia D; lo que sale de A entra en B | D − 2x = 0, así que x = D/2. La figura muestra los grupos después del pase |

### razonamiento-inductivo (3 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| figuras-que-crecen | Figuras de palitos; sucesión y término general; qué palitos son nuevos | P = primera + agrega·(k − 1), en tres formas de figura. Se comprueba con la figura 3 |
| tres-casos-no-prueban | Inducción e hipótesis; cuerda y región; qué mirar. No adelanta lo que pasa con 6 puntos | Las regiones con 1 + cuerdas + cruces (el doble falla), o el cuarto término con la regla que fija el enunciado |
| impares-y-cuadrados | El impar n es 2n − 1; el impar como una L de casillas; qué forma arman | Cuántos términos hay, la suma k², y la comprobación con el promedio, que es k |

### juegos-recreativos (3 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| domino | El dominó en las reuniones de Juliaca; «doble n»; la ficha doble; qué mirar. No dice cuántas veces sale cada número | Las fichas o los puntos de un dominó doble n: parejas más dobles, o (n + 2)·(0 + … + n). Solo se dibuja con n ≤ 6 |
| dados | Las caras opuestas suman 7; qué es una cara tapada; qué mirar | En una pila de k dados, las caras tapadas suman 7k − a. Se comprueba que dan 7k con la de arriba |
| cerillas | Los acertijos de fósforos; cuadrados de todo tamaño; contar por tamaños | Las cerillas, 2n(n + 1), o los cuadrados, como suma de cuadrados. Solo se dibuja con n ≤ 4 |

### cronometria-y-calendarios (5 ideas)

| Idea | Qué cuenta «Lee» | Qué resuelve |
|---|---|---|
| angulo-agujas | Minutero y horario con sus colores; 30° entre dos números; el ángulo menor; qué mirar («¿la aguja corta se queda quieta?»). No da el 0,5° por minuto | H = 30h + 0,5m y M = 6m; si pasa de 180°, se toma 360° menos |
| adelantos | Relojes que fallan; hora real y hora marcada; qué mirar. No da la razón 63 a 60 | Las dos formas de «Ahora tú»: marcada = real ± g·t, o real = marcada · 60/(60 ± g). Con los dos relojes |
| campanadas | Los relojes de torre; «cada punto rojo es una campanada»; la duración va de la primera a la última | τ = T₁/(n₁ − 1) y duración = (n₂ − 1)·τ. La recta pasa a n₂ campanadas |
| bisiestos | El cuarto de día que sobra; el 29 de febrero; qué es «divisible», con 2024 y 2026. No adelanta lo de los años en 00 | Se prueba entre 4, 100 y 400, en orden. Este no lleva paso «¿Qué tengo?»: el dato es solo el año |
| dia-de-la-semana | La semana que se repite (la feria del domingo); las columnas del calendario; el residuo, con 23 = 7·3 + 2 (no usa el 17 ni el 3 de «Predice») | N = d₂ − d₁ = 7q + r, y se avanzan r días. El calendario se dibuja antes y después |

**Glosario nuevo:**
- «reparto» en razonamiento deductivo;
- «identificar» en certezas;
- otras palabras de «Lee» (vértice, tramo, hipótesis, cuerda…) ya estaban en el glosario o lo regeneró `npm run catalogo`.

## Semillas revisadas a mano

Cada subagente imprimió con node las semillas 0, 1 y 2 (en algunas ideas también la 3 o la 4) y resolvió cada caso por su cuenta. Todas cuadran.

- **Deductivo:**
  - conclusion-necesaria:
    - s0: los «todos» en cadena dan «todos los nadadores son cantantes»;
    - s1: con «algunos», nada es seguro;
    - s2: «ningún ciclista es músico».
  - si-entonces:
    - s0: q no da nada seguro;
    - s1: «no q» da «no p»;
    - s2: q no da nada seguro.
  - doble-entrada: los tres repartos son únicos (Eva toca bombo, Fito viste verde, Eva juega vóley).
  - parentesco:
    - s0: sobrina, y al revés, tía;
    - s1: bisnieta;
    - s2: bisabuelo.
- **Certezas:**
  - peor-caso:
    - s0: 2 + 2 + 2 + 1 = 7;
    - s1: 7 + 3 + 1 + 1 = 12;
    - s2: 8 + 7 + 1 = 16;
    - s4: 7 + 4 + 2 + 1 = 14.
  - palomar:
    - s0: 12·2 + 1 = 25;
    - s1: 7·3 + 1 = 22;
    - s2: 5·4 + 1 = 21;
    - s4: 12·3 + 1 = 37.
  - llaves:
    - s0: 36;
    - s1: 66;
    - s2: 91.
- **Trazos:**
  - un-solo-trazo:
    - s0: líneas por punto 1, 4, 2, 1, 2, 2 → 2 impares, sale;
    - s1: 4 impares, no sale;
    - s2: 2 impares, sale.
  - recorrido-minimo:
    - s0: 8×8 → 48 + 16 = 64;
    - s1: 10×4 → 42 + 4 = 46;
    - s2: 12×4 → 64.
  - deslizar-lados:
    - s0: 32;
    - s1: 34;
    - s2: 36.
  - arcos-que-suman:
    - s0: 12π ≈ 37,7;
    - s1: 8π ≈ 25,1;
    - s2: 10π ≈ 31,4.
- **Arreglos:**
  - suma-magica:
    - s0: 117 ÷ 3 = 39;
    - s1: S 39, centro 13;
    - s2: 45;
    - s3: S 42, centro 14.
  - vertices-dos-veces:
    - s0: 3S = 48, S = 16;
    - s1: 20;
    - s2: 22;
    - s3: 21. Cada uno se comprobó con un lado del dibujo.
  - reparto-parejo:
    - s0: 34 → 1 + 7 + 9 y 2 + 15;
    - s1: 33, impar;
    - s2: 41, impar;
    - s3: 52 → 7 + 8 + 11 y 1 + 5 + 20.
- **Ordenamiento y verdades:** las semillas 0, 1 y 2 de las 6 ideas, resueltas aparte; en orden-lineal también la 3, que deja 2 órdenes. Las 18 cuadran.
- **Traslados:**
  - camino-y-flecha:
    - s0: d = 5;
    - s1: √13 ≈ 3,6;
    - s2: √37 ≈ 6,1.
  - Hanói:
    - s0: 31;
    - s1: 255;
    - s2: 511.
  - pasar-un-numero:
    - s0: x = 5;
    - s1: 7;
    - s2: 9.
- **Inductivo:**
  - figuras-que-crecen:
    - s0: 67;
    - s1: 65;
    - s2: 187.
  - regiones y cuarto término:
    - s0: 7 puntos → 1 + 21 + 35 = 57;
    - s1: 32;
    - s2: 35.
  - impares-y-cuadrados:
    - s0: 289;
    - s1: 576;
    - s2: 784.
- **Juegos:**
  - domino:
    - s0: 21 fichas;
    - s1: 360 puntos;
    - s2: 55 fichas.
  - dados:
    - s0: 17;
    - s1: 27;
    - s2: 34.
  - cerillas:
    - s0: 30 cuadrados;
    - s1: 60 cerillas;
    - s2: 91 cuadrados.
- **Cronometría:**
  - angulo-agujas:
    - s0: 5:36 → 48°;
    - s1: 9:06 → 123°;
    - s2: 11:02 → 41°;
    - s3: 10:10 → 115°.
  - adelantos:
    - s0: 12:16;
    - s1: real 11:00;
    - s2: 1:42;
    - s3: real 11:00.
  - campanadas:
    - s0: 24 s;
    - s1: 10 s;
    - s2: 12 s.
  - bisiestos:
    - s0: 2200 no;
    - s1: 2112 sí;
    - s2: 2162 no;
    - s3: 2700 no.
  - dia-de-la-semana:
    - s0: 18 miércoles;
    - s1: 18 martes;
    - s2: 27 viernes.
  - Además se compararon 40 semillas con un cálculo aparte: el día de la semana y los bisiestos con `Date` de JS, y el ángulo con su fórmula. Coinciden 40 de 40.

## Objetos que la figura no dibuja (corregidos)

| Unidad, idea | Decía | Ahora dice |
|---|---|---|
| trazos, recorrido-minimo (Predice) | «el lápiz debe volver al punto donde empezó» | «el recorrido debe volver…» |
| trazos, un-solo-trazo (Ahora tú) y glosario «un solo trazo» | «sin levantar el lápiz» | «sin cortarlo» |
| trazos, recorrido-minimo (consigna y Ahora tú) | «Ventana de 6 × 4 cm»: no se dibuja ninguna ventana, y una de 6 × 4 cm no es creíble | «Rectángulo de 6 × 4 cm con cruz». También se cambió el ejemplo del glosario «tramo» |
| verdades, contradictorias (consigna, Ahora tú y título de la mesa `quien-fue`) | «rompió el vaso» | «es el culpable» |
| ordenamiento, orden-lineal (consigna, Predice y `siFuera`) | «fila de cuatro asientos», «entre cinco asientos» | «cuatro puestos: las columnas del tablero», «en una fila de cinco puestos» |
| juegos, cerillas (consigna) | «Una cuadrícula de n × n hecha con cerillas» | «Cada línea roja es una cerilla de una cuadrícula de n × n…» |
| juegos, dados (pie de la pila, que también sale en Mira y Ahora tú) | «dados apilados sobre la mesa» | «k dados apilados» |
| cronometría, campanadas (consigna) | «Un reloj da campanadas…», sobre una recta | «Cada punto rojo de la recta es una campanada…» |

En deductivo, certezas, arreglos, traslados e inductivo no se encontraron objetos sin dibujar. Lo que se nombra aparece rotulado: círculos, tabla, árbol, urna, casilleros, palitos, grupos. Las historias de las tarjetas de «Lee» (mototaxistas, sacos de papa, el vigilante del parque) son contexto, como «Ana tiene 12 años» en la unidad de referencia, y ninguna dice que esas cosas estén en la figura. Los enunciados de «Predice», «Ahora tú» y «Así se resuelve» que nombran un reloj o una mesa como parte del problema se dejaron igual.

## Pedidos de vectores para Gerson

Ninguno bloquea: los textos ya dicen lo que se ve. Son para recuperar la historia, si se quiere.

| Unidad | Idea | Objeto | Para qué |
|---|---|---|---|
| trazos-y-perimetros | un-solo-trazo | lápiz o tiza que recorra el trazo | que se vea qué es «un solo trazo» |
| trazos-y-perimetros | recorrido-minimo | ventana o reja a escala de una casa | volver a la historia de la ventana |
| verdades-y-mentiras | contradictorias | vaso roto, u otra cosa que alguien rompió | volver a la historia del culpable |
| ordenamiento-de-informacion | orden-lineal | fila de cuatro asientos con siluetas | que el tablero se lea como una fila de personas |
| juegos-recreativos | cerillas | cerilla, un palito con cabeza, para la pieza `rm-plano` | que la cuadrícula se vea hecha de fósforos |
| juegos-recreativos | dados | mesa bajo la pila y dados dibujados de verdad (los de abajo hoy salen como cuadros punteados) | que se vean las «caras que tocan la mesa» |
| cronometria-y-calendarios | campanadas | campana o reloj de torre junto a la recta del tiempo | unir cada punto con un golpe |

## Cambios fuera de lo nuevo (revisar)

- **razonamiento-deductivo, conclusion-necesaria, figura de la solución de «Ahora tú».** En la forma «Algunos a son b; todos los b son c», el círculo A no tocaba a B, así que el dibujo contradecía la premisa. Se movió A de x = 3,6 a x = 4,1. Es una línea; si no se quiere, se revierte. «Así se resuelve» usa el mismo dibujo.
- **verdades-y-mentiras, negar-bien, «Ahora tú».** Se arregló la concordancia: «Todos las cajas están llenas» pasó a «Todas…», y «al menos uno no está llena», a «una». La misma frase sale en «Así se resuelve».
- **razonamiento-deductivo, doble-entrada, «Así se resuelve».** Las columnas van más anchas (`ancho: 76`) para que «Charango» no se monte sobre la vecina.
- **cronometría.** En el texto nuevo no se usa la palabra «algunos», porque el glosario de deductivo la subraya con su sentido lógico.

## Lo que no se pudo, y pendientes vistos que no se tocaron

- **Figuras que no admiten casos grandes.**
  - Hanói con 6 a 9 discos;
  - regiones con 7 u 8 puntos;
  - dominó con n > 6;
  - cerillas con n > 4.

  En esos casos «Así se resuelve» va sin dibujo, porque la pieza no los dibuja.
- **verdades-y-mentiras, negar-bien, tipo 3.** El distractor «A no aprobó y B sí» trae el `siFuera` «Es un caso posible», pero es imposible: haría cierta la frase del mentiroso. Es contenido de «Ahora tú» y no se tocó. **Conviene corregirlo.**
- **razonamiento-deductivo.**
  - doble-entrada: en el juego y en «Ahora tú», los encabezados del cuadro se montan, y «Ahora tú» escribe «vive en puno» con minúscula.
  - parentesco: «Ahora tú» puede decir «Carmen es el padre…», con el nombre en otro género que el parentesco. «Así se resuelve» usa el mismo motor y lo arrastra.
- **cronometria-y-calendarios, adelantos.** «Ahora tú» escribe «las 1:00».
- **certezas, palomar.** La semilla 0 de «Así se resuelve» cae justo en el caso de «Mira» (12 meses, 3 personas, 25). «Otro ejemplo» lo cambia.

## Lo no verificado

- **Capturas.** No se miraron una por una las de las 34 ideas; cada subagente miró entre 3 y 6 (lee-1 y resuelve-fin), y en el resto se confió en lo que imprime `pw.js`.
- **Semillas.** Del 3 al 11, solo las revisa el validador.
- **Arrastres.** No se probaron los arrastres del juego, porque no se tocaron.
- **Lector de pantalla.** No se probó.
- **Celular real.** No se probó en uno; solo a 360 × 780 en Chromium.
