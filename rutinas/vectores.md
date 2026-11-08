# Rutina de vectores (8 nov 2026)

Rama `rutina/vectores`, creada desde `claude/awesome-wozniak-5etl1n`. Encargo: generadores G1 a G3, vectores 0.2.0 y la decisión de núcleo para G4 a G7. Mapa: `docs/clasificacion/compendio-vectores.md` (regla 5: no se abrió ningún PDF; todo enunciado y número es propio).

## Tarea 1: generadores G1 a G3 (formato «predicciones»)

Los tres están enganchados a `fisica.magnitudes-y-vectores`, después de la escena `vectores`, igual que porcentajes sucesivos. Corrí `npm run catalogo`. Mis G1, G2 y G3 son el G1, el G2 y el G7 del mapa.

| Módulo | Tipos | Respuesta |
| --- | --- | --- |
| `plantillas/vectores-ley-cosenos/` (G1, T8) | \|A + B\| y \|A − B\| (directo); el ángulo a partir de \|A + B\| o de A + B + C = 0; el ángulo con módulos iguales y \|A + B\| = k·\|A − B\| (o al revés), con k = 2, 3 o √3; R para un ángulo dado a partir del máximo y el mínimo | entero o a√b, o un ángulo |
| `plantillas/vectores-componentes/` (G2, T7, T9 y T11) | módulo de la resultante de 2 a 4 vectores, también como fuerza que equilibra un anillo o como desplazamiento con puntos cardinales (norte = +y); módulo de una combinación como 2A − B + C; ángulo de la resultante con +x (0° a 360°) | entero o k√n (n = 2, 3, 5), o un ángulo |
| `plantillas/vectores-productos/` (G3, T13) | A·B en 2D y 3D; ángulo entre A y B con coseno notable; m para que A ⊥ B; c en A × B = c·k; \|A × B\| a partir de \|A\|, \|B\| y A·B; área de un triángulo de vértices enteros | entero con signo, a√b, ángulo o u² |

**Convención de academia sin miedo.** sen 37° = 3/5 y cos 37° = 4/5. En G2, cada problema usa una sola familia de ángulos (37°/53°, 45°, 30° o 60°) con módulos que dan componentes exactas. Así R² sale entero y la resultante es «de academia»: entera o k√2, k√3, k√5.

**Distractores.** Cada uno tiene código, explicación y respaldo. Solo entran los que se escriben igual que la correcta: si la correcta es a√b, no se mezcla con un decimal que la delataría. Hay pruebas para eso.
- Parciales (E8 y M2 de `docs/investigacion/`): `VE-suma-modulos` y `VE-resta-modulos`.
- Del mapa y de la escena, como hipótesis: `VE-coseno-con-menos`, `VE-pitagoras-siempre`, `VE-sen-cos-cambiados`, `VE-angulo-complementario`, `VE-maximo-minimo-como-modulos`, `VE-tangente-invertida`, `VE-angulo-de-referencia`, `VE-sentido-opuesto`, `VE-recorrido-vs-desplazamiento`, `VE-escalar-por-vectorial`, `VE-mano-derecha-invertida` y `VE-area-sin-mitad`.
- Nuevos (hipótesis):
  - en G1: `VE-diferencia-con-mas`, `VE-sin-raiz`, `VE-angulo-interior` (el ángulo interior del triángulo de tres vectores que se anulan), `VE-razon-invertida`, `VE-diagonales-perpendiculares`, `VE-angulo-con-resultante` (θ/2) y `VE-promedio-max-min`;
  - en G2: `VE-signo-por-cuadrante`, `VE-componentes-sumadas`, `VE-resta-como-suma` y `VE-coeficiente-olvidado`;
  - en G3: `VE-escalar-sin-signos`, `VE-escalar-cruzado`, `VE-escalar-como-suma`, `VE-escalar-signo-final`, `VE-signo-del-escalar`, `VE-perpendicular-sin-escalar-cero`, `VE-despeje-signo`, `VE-despeje-multiplica`, `VE-despeje-sin-coeficiente`, `VE-escalar-uno`, `VE-signo-determinante`, `VE-vectorial-modulos`, `VE-producto-modulos`, `VE-identidad-con-mas` y `VE-vertices-sin-restar`.

**Pruebas.** Cada `generador.test.js` incluye:
- `probarGenerador` sobre 600 semillas: una sola correcta, 4 o 5 opciones distintas, todos los errores con código y respaldo;
- un recálculo independiente en cada semilla, por otro camino: componentes en vez de ley de cosenos, polarización para A·B, determinante 3 × 3 y Herón para el área;
- los `casos.json`: 29 casos (7, 14 y 8), con una semilla por tipo y familia más `entrada-1` y `salida-1`. Los verificó un subagente a ciegas, sin ver los generadores, con aritmética exacta en Q(√2, √3). Cuadraron todos.

**Cambio chico en el núcleo** (`nucleo/predicciones.js`, compatible hacia atrás, con pruebas nuevas en `nucleo/predicciones.test.js`):
- `armar` acepta `negativos: true`, para respuestas con signo como A·B, m o c;
- `armar` acepta `texto: fn`, para escribir y comparar las opciones como las ve el alumno;
- hay un `radical(x)` nuevo que escribe 5√3, √26/2 o −2√2.

Lo pedía el mapa («convendría además una opción para aceptar respuestas negativas»). No es `armarTexto` (ver la tarea 3).

**Colores.** Los generadores usan la paleta de la app (`c-o`, `c-i`, `c-h`, `c-d`): A naranja, B turquesa, θ rojo, R verde. No hay colores nuevos.

Playwright: los tres módulos funcionan a 390 y 1366 px, sin errores de consola ni desbordes.

## Tarea 2: vectores 0.2.0 (`plantillas/vectores/`)

La hicieron cuatro manos:
- un constructor (subagente);
- un verificador a ciegas, que leyó solo la cabecera del motor (líneas 1 a 81) y recalculó los casos 19 a 33 con fracciones exactas y otros métodos, sin discrepancias;
- un revisor de contenido, que no encontró nada grave y sí 5 hallazgos medios, ya corregidos (respuestas que se veían antes de responder en C1b y C2b, un título que descartaba dos distractores, un color con tres usos en el experimento 7 y un texto sobre una perilla que no aparecía);
- yo: integración, las pruebas, Playwright a 390 px y los commits.

**Lo nuevo**
- **Pestaña «Figuras»**, con 4 pasos:
  - seis flechas entre P y Q, que se reducen a k·c, con los caminos que se sombrean;
  - el cubo que se suma, y la caja con el botón «Ahora, una caja». Gira, ilumina las aristas paralelas, muestra las coordenadas y dibuja a trazos las aristas ocultas;
  - el punto que se desliza (pesos cruzados en m:n);
  - el baricentro (2/3 de la mediana) y el trapecio (semidiferencia de las bases).
- **Pestaña «Componentes»**, con 3 pasos:
  - la resultante sobre el eje: dos raíces y, después, la condición de sentido;
  - el vector de largo dado y el unitario de 2a;
  - girar los ejes: el módulo no cambia y las componentes sí, y el ángulo vuelve a ser notable con los ejes girados.
- **Dos experimentos nuevos en «¿Qué pasa si…?»**:
  - 6, el ángulo escondido: |A + B| = 2·|A − B| da 53°, y se ve el rombo;
  - 7, la sombra y el área: escalar contra vectorial a 90°, y el triángulo con el sentido de a × b.
- **Motor**: `division`, `baricentro`, `trapecio`, `reduccion`, `caja`, `cubo`, `tetraedro`, `sumaSolido`, `inversoSumaDiferencia`, `girarEjes`, `proyeccion`, `area`, `unitarioConModulo`, `dosSentidos` y `radical`. Son 34 casos (15 nuevos, verificados) y 67 pruebas. El papel sigue con 10 problemas, renumerados de p1 a p10 por dificultad; entraron los de división 1:3, la caja y la resultante sobre el eje.
- **Códigos nuevos** (hipótesis): `VE-cuenta-repetido`, `VE-faltan-datos`, `VE-solido-plano`, `VE-sin-profundidad`, `VE-pesos-derechos`, `VE-pesos-mitades`, `VE-pesos-sin-dividir`, `VE-baricentro-invertido`, `VE-baricentro-mitad`, `VE-baricentro-tres-cuartos`, `VE-semisuma-por-semidiferencia`, `VE-sin-mitad`, `VE-una-sola-solucion`, `VE-raiz-que-no-cumple`, `VE-sin-solucion`, `VE-olvida-componente`, `VE-despeje-signo`, `VE-unitario-sin-escalar`, `VE-unitario-escalado`, `VE-componente-vs-modulo`, `VE-componentes-fijas`, `VE-modulo-depende-de-ejes`, `VE-angulo-en-otros-ejes`, `VE-diagonales-perpendiculares`, `VE-angulo-con-resultante`, `VE-perpendicular-todo-cero`, `VE-perpendicular-todo-maximo`, `VE-mano-derecha-invertida`, `VE-area-sin-mitad` y `VE-escalar-por-vectorial`.
- **Comprobado**:
  - La cabecera, las pestañas, `plantilla.json` y los títulos de los pasos bloqueados no sueltan respuestas; los pasos bloqueados se leen «Paso N, bloqueado».
  - Playwright a 390×844 y 1366×768, en claro y en oscuro, con y sin movimiento reducido: sin errores ni desbordes.
  - `pasada-celular.py` no dice QUEDA.
  - `npm test`: 4489 en verde.
- **Decisiones del constructor** que la principal puede revisar:
  - Con el 3-4-5, la lectura de θ dice «θ ≈ 53°» (antes decía 53,1°, lo que chocaba con la respuesta de academia), también en los modos viejos.
  - En el experimento 7, θ va en tinta, porque con θ en verde la sombra y el área no llegaban a ΔE00 de 20 contra a y b.
- **Pendiente:**
  - No se probó a mano el arrastre con el dedo (lo resuelve `Celular.arrastre`, como en las otras escenas).
  - Falta subir `VERSION` de `app/sw.js` (no me toca) y actualizar `docs/pendientes.md`, `CLAUDE.md` y la hoja de ruta al integrar.

### Colores nuevos de la escena (para `docs/diseno.md`)

| Clave | Qué es | Claro | Oscuro |
| --- | --- | --- | --- |
| c | vector marcado (Figuras 1) | #775403 | #f9b924 |
| z | aristas verticales del sólido | #654115 | #fcc37e |
| g | AG del baricentro | #107293 | #24c4f9 |
| k | MN del trapecio | #475223 | #cbff1f |
| w | vector de largo dado | #950487 | #fb74ee |
| D | diferencia a − b | #1d494e | #1fe9ff |
| sb | sombra de b sobre a (proyección) | #6e6e0c | #fbfb56 |
| ar | paralelogramo y a × b | #c7058d | #fa38c0 |

Mediciones del revisor:
- ΔE00 mínimo entre los colores que salen juntos: 22,6 en claro y 20,4 en oscuro.
- Contraste: todos pasan AA; el más justo es `ar` en oscuro, con 4,57 sobre el chip.
- Las aristas en x y en y del sólido reusan los colores x e y; el triángulo del experimento 7 va en tinta.

## Tarea 3: decisión de núcleo para G4 a G7 (propuesta, sin implementar)

**Recomiendo `armarTexto`. No recomiendo preguntar un escalar resumen** («halle m + n») como camino principal.

**Por qué.** El escalar resumen borra justo las trampas que queremos medir:
- En G5 (punto que divide m:n), los pesos cruzados (n/(m+n), m/(m+n)) y los derechos (m/(m+n), n/(m+n)) suman 1 los dos. Con «halle p + q», `VE-pesos-derechos` da la misma alternativa que la correcta y no se puede medir.
- Pasa lo mismo con «m y n cambiados» en G4 (m + n no cambia) y con la semisuma contra la semidiferencia cuando se pregunta p + q.
- El sentido opuesto (−v) a veces sobrevive al resumen y a veces no, según el resumen que se elija.

Con un escalar, el distractor existe en el papel, pero `armar` lo descarta por repetido. La medición, que es la única fuente de datos del colegio, nunca lo vería. El resumen sirve como formato secundario, para imitar la forma del examen («halle α − β») solo donde no colapsa errores.

**Propuesta de API** (compatible con lo que hay; `app/practica.js` no cambia, porque solo usa `texto`, `letra`, `correcta` y `error`):

```js
// nucleo/predicciones.js
armarTexto({ correcta: { clave, texto }, errores: [{ id, clave, texto, explicacion, respaldo, fuente }], rng, total = 5 })
// clave: forma canónica comparable, p. ej. '2/3|1/3' para (2/3)A + (1/3)B o '3|-4|0' para (3; −4; 0).
// Se compara por clave (no por texto): así dos formas equivalentes no salen como dos opciones,
// y un mismo texto con otra clave falla una prueba.
// Devuelve el mismo formato que armar; valor = clave.
```

Y en `nucleo/probar-generador.js`, una opción `igual(a, b)` para comparar `respuesta.valor` con el recálculo independiente cuando no es un número. Por defecto queda `|a − b| < 1e-9`.

**Lo que costaría:** unas 30 líneas en el núcleo, más sus pruebas. Además, un ayudante para escribir expresiones con fracciones («⅔A + ⅓B», «(3; −4)»), que conviene que viva en el núcleo para que G4, G5 y G7 escriban igual.

**Variante, si la principal prefiere no tocar el núcleo:** G4 a G7 preguntan solo escalares, y se aceptan solo los tipos en los que el resumen no colapsa los errores; se quedan fuera los de pesos derechos y los de m y n cambiados. Es posible, pero se pierde lo más frecuente del libro (T4: 26 de 200).

**Espero la aprobación de la principal antes de implementar nada de esto.**

## Tarea 4: `armarTexto` y generadores G4 a G7 (aprobado por la principal)

La principal aprobó `armarTexto` con cuatro condiciones. Se cumplieron todas:
1. Es compatible hacia atrás y tiene sus pruebas.
2. Se agregó la opción `igual` en `probarGenerador`.
3. Convive con `formato: 'pi'`: primero hice merge de la principal.
4. Hay un commit para el núcleo y otro por generador.

**Núcleo** (`nucleo/predicciones.js` y `nucleo/probar-generador.js`):
- `frac` y `textoFraccion`.
- `combinacion(coefs, nombres)`, que da `{ clave, texto }` en forma de academia: «(2a + b)/3», «(2b − a)/2», «−(u + w)/6» o «3B − 2A».
- `vector(comps)`, que escribe «(3/5; −4/5)».
- `armarTexto`: compara por clave canónica, así que dos formas equivalentes no salen como dos opciones, y falla si dos claves distintas se escriben igual.
- `probarGenerador(gen, { igual })`.
- Pruebas en `nucleo/predicciones.test.js`.

Los G4 a G7 de esta rutina son los G3 a G6 del mapa; el G7 del mapa (productos) es el G3 de la tarea 1.

| Módulo | Tipos | Respuesta |
| --- | --- | --- |
| `vectores-unitario` (G4, T12) | unitario de un vector 2D o 3D; vector de módulo dado paralelo o antiparalelo; constante c > 0; unitario de A + B; unitario de y = mx + b hacia x creciente | vector con fracciones o número |
| `vectores-combinacion` (G5, T5 y T10) | C en función de A y B (cuadrícula o componentes); A o B a partir de A + B y A − B; parámetro de paralelismo | expresión, vector o número |
| `vectores-division` (G6, T4) | punto que divide m:n desde O; baricentro (AG, GM, AM); trapecio (diagonales y lados no paralelos); paralelogramo con punto medio o 1:2 | expresión en a y b, o en u y w |
| `vectores-poligono` (G7, T1a) | desde un vértice a los demás (n = 3, 4, 6); n − 1 lados consecutivos (n de 3 a 8); del centro a todos los vértices menos uno | entero o k√n (con `armar`) |

**Trampas que ahora sí se miden**, porque con un escalar resumen se perdían: `VE-pesos-derechos`, `VE-coeficientes-cambiados`, `VE-semisuma-por-semidiferencia`, `VE-baricentro-invertido`, `VE-suma-de-unitarios`, `VE-pendiente-a-direccion`, `VE-unitario-sin-escalar` y `VE-sentido-opuesto`, entre otras.

**Códigos nuevos** (hipótesis):
- `VE-unitario-sin-raiz`, `VE-modulo-entre`, `VE-constante-invertida`, `VE-unitario-de-la-resta`, `VE-pendiente-signo` y `VE-ordenada-en-direccion`;
- `VE-signo-de-un-coeficiente`, `VE-componentes-como-coeficientes`, `VE-confunde-A-con-B`, `VE-suma-por-diferencia`, `VE-proporcion-invertida`, `VE-perpendicular-por-paralelo` y `VE-diferencia-constante`;
- `VE-vector-equivocado`, `VE-baricentro-sin-mitad`, `VE-diferencia-por-suma`, `VE-mitad-de-una-base` y `VE-mitad-equivocada`;
- `VE-perimetro`, `VE-lado-por-radio` y `VE-diametro`.

**Pruebas:**
- Cada generador corre 600 semillas con un recálculo independiente: módulo entero por tanteo, Cramer, fórmulas de academia y el radio L/√3, L/√2 o L.
- Hay 39 casos verificados a ciegas, con coordenadas concretas, Cramer y trigonometría. Coinciden todos, también en la forma escrita.
- `npm test`: 4609 en verde.
- Playwright de los cuatro en la app, a 390 y 1366 px: sin errores ni desbordes.

**Ojo con el historial:** los commits de G4, G5 y G6 no traen todavía el catálogo, que entró con el de G7. En esos tres commits intermedios fallaría la prueba de catálogo; en la punta de la rama está todo en verde.

## Cierre: lo que queda del mapa

La principal integró todo (sw v137). Lo que todavía vale la pena, en orden:

1. **Barniol y Zavala (2014)**, *Test of understanding of vectors*. Es lo más valioso que queda: hoy casi todos los códigos `VE-…` son hipótesis, y este test mide justo suma de módulos, componentes, unitario, producto escalar y producto vectorial. Con él varios pasarían a parcial o documentado. Hay que conseguirlo; habría que sumarlo a `fuentes/por-conseguir.md`.
2. **T6, proyección y cambio de ejes (6 de 200).** Sería un generador chico: la componente de A sobre B (A·B/|B|), la perpendicular, ejes girados un ángulo notable y la distancia de un punto a una recta. Trampas: `VE-componente-vs-modulo` y `VE-proyecciones-invertidas`, ya listas como códigos.
3. **T8 inverso que falta en G1**, el rango del ángulo: «¿para qué θ, R está entre tal y tal?». Pide respuestas como intervalo (texto), y con `armarTexto` ya se puede.
4. **T3 y T1b, cuadrícula y figuras irregulares (18 de 200).** Piden dibujo; conviene hacerlos como pasos de la escena, no como generador.
5. **Notables extendidos** (16°/74° con 7-24-25, «medio 53°»). Hoy no están en el motor; sumarlos daría más variedad a G1 y G2, marcados como aproximados, igual que el 3-4-5.

No recomiendo más generadores en vectores antes de tener los datos del colegio: con 8 módulos más la escena, la unidad está bien cubierta. Lo que falta es saber cuáles distractores eligen de verdad los alumnos.
