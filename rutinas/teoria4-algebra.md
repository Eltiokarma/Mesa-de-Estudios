# Ronda 4 del 3D: álgebra (15 nov 2026)

Rama `teoria4/algebra`, salida de `main` (6cfbfa7). Encargo: `rutinas/encargos/teoria4-algebra.md`. Molde: `docs/3d.md`.

Resultado: **cinco mesas 3D en cinco unidades, con cuatro piezas vivas nuevas.** Las tres de «3D necesario» (productos notables, matrices y sistemas) y dos de contexto (binomio de Newton y programación lineal). Cada mesa va primera en su laboratorio, sin tocar el `id` de las mesas que ya había, y ningún laboratorio pasa de 4 mesas.

## 1. Las 19 unidades

Orden de `catalogo/cursos/algebra.json`. Leí cada unidad y su escena en `plantillas/` antes de clasificar.

| # | Unidad | Clase | Razón | Qué se hizo |
| --- | --- | --- | --- | --- |
| 1 | Lógica, conjuntos y juegos lógicos | Plano | Tablas de verdad y diagramas de Venn: el 3D no agrega una relación | — |
| 2 | Números reales e intervalos | Plano | Todo vive en la recta numérica | — |
| 3 | Exponentes, radicales y productos notables | **3D necesario** | (a + b)³ es un volumen: sin girar el cubo, los tres a²b y los tres ab² no se ven | Mesa «El cubo que se abre» (`alg-cubo-3d`) |
| 4 | Ecuaciones de primer y segundo grado | Plano | La parábola y sus cortes son de dos dimensiones | — |
| 5 | Inecuaciones | Plano | Signos en la recta y la parábola | — |
| 6 | Valor absoluto y radicales | Plano | Distancias en la recta y la V | — |
| 7 | Polinomios | Plano | Grados, casillas y gráficas en el plano | — |
| 8 | División de polinomios | Plano | Ruffini es una tabla; el resto es una altura en la curva | — |
| 9 | Factorización | Plano | Aspas y áreas de rectángulos; la unidad no trae suma ni diferencia de cubos | — |
| 10 | Ecuaciones polinomiales | Plano | Las raíces complejas viven en el plano complejo | — |
| 11 | Funciones | Plano | Gráficas de una variable | — |
| 12 | Tipos de funciones e inversa | Plano | Simetrías y reflejo en y = x, en el plano | — |
| 13 | Exponenciales y logaritmos | Plano | Curvas de una variable | — |
| 14 | Números complejos | Plano | El plano complejo es el argumento: girar estorba | — |
| 15 | Matrices y determinantes | **3D necesario** | El det de 3 × 3 es el volumen con signo de la caja de las columnas; su signo y su cero se ven al girar | Mesa «La caja de las tres columnas» (`alg-columnas-3d`) |
| 16 | Sistemas de ecuaciones | **3D necesario** | Tres incógnitas son tres planos: punto, recta o nada solo se distinguen girando | Mesa «Tres planos» (`alg-planos-3d`) |
| 17 | Programación lineal | 3D de contexto | Se resuelve en el plano, pero Z como altura vuelve evidente por qué el óptimo es un vértice | Mesa «El techo de Z» (`alg-techo-3d`) |
| 18 | Sucesiones y series | Plano | Términos en una recta o una gráfica | — |
| 19 | Binomio de Newton | 3D de contexto | Los coeficientes 1, 3, 3, 1 son las piezas del cubo contadas por tipo; el cálculo general es una tabla | Mesa «Las piezas que se eligen» (reusa `alg-cubo-3d`) |

Gran parte del curso es plano, como se esperaba: 14 de 19.

## 2. Piezas nuevas

Todas sobre `Kit.vivo3d.montar`, con respaldo SVG, `alt` con sus números, `tocar` y pruebas en Node (`*.test.js` al lado).

| Pieza | Qué dibuja | Motor | Unidades |
| --- | --- | --- | --- |
| `alg-cubo-3d` | Cubo de arista a + b en sus ocho piezas; control «Abrir» y un tipo de pieza a la vista (`solo`) | `plantillas/cuadrado-crece/motor.js` (`piezasCubo`) | productos notables, binomio de Newton |
| `alg-columnas-3d` | Columnas u, v y w como flechas, el paralelepípedo y el piso z = 0 | `plantillas/matrices/motor.js` (`det3`) | matrices y determinantes |
| `alg-planos-3d` | Tres planos recortados a un cubo, rectas de dos en dos, recta común o punto | `plantillas/matrices/motor.js` (`tresPlanos`, `recortarRecta`) y `nucleo/geometria3d.js` (`seccion`) | sistemas de ecuaciones |
| `alg-techo-3d` | Región factible en el piso, postes de altura Z, el techo y el plano de nivel k | `plantillas/programacion-lineal/motor.js` (`optimizar`) | programación lineal |

Presupuesto (docs/3d.md §2.3): la más pesada es `alg-planos-3d`, con 3 pedazos de plano, hasta 4 barras de cilindro y una esfera: menos de 20 objetos y menos de 1000 triángulos. `alg-cubo-3d` usa 8 cajas y 8 bordes (96 triángulos). Sin sombras, sin texturas, sin modelos descargados y sin animación continua: «Abrir» y k son controles.

## 3. Motores y pruebas

- **`plantillas/matrices/motor.js`** gana `tresPlanos({ planos })` y `recortarRecta({ punto, dir, lado })`. `tresPlanos` da los rangos de A y de la ampliada (exactos, con fracciones), el tipo (`punto`, `recta`, `plano`, `ninguna`, `todo`), el caso sin solución (`paralelos`, `prisma` o `imposible`), el punto, la recta común y las rectas de dos en dos.
  - `plantillas/matrices/casos-planos.json`: 11 casos **verificados aparte** con `rutinas/teoria4-algebra/verif-planos.py` (fracciones en Python, rango por menores y no por eliminación, punto por la adjunta y comprobado en las tres ecuaciones). El «caso» de los sistemas sin solución lo decidí a mano mirando las normales.
  - `plantillas/matrices/planos.test.js`: los 11 casos, 600 sistemas al azar (el punto y la recta común están en los tres planos, cada recta de dos en dos está en sus dos planos), el prisma con tres rectas paralelas, el recorte al cubo y las entradas mal formadas.
  - No toqué `casos.json` de matrices: su prueba exige de 15 a 22 casos y ya tiene 21.
- No hice módulos nuevos en `nucleo/`. Los otros dos cálculos ya existían con pruebas: `piezasCubo` y `optimizar`.

`npm test` completo, antes del último push: **8610 pruebas, 8610 en verde.**

## 4. Pedidos a la base y a la app

1. **Ninguna mesa necesita un módulo nuevo de `nucleo/` en la app.** `alg-planos-3d` usa `nucleo/geometria3d.js`, que ya está en `BASE` de `app/teoria.js`. Los motores de plantilla van en `requiere`, como permite el validador.
2. **`requiere` carga en paralelo** (`Promise.all` en `cargarUnidad`). Por eso las cuatro piezas buscan su motor al usarlo (`() => M || root.MotorX`) y no al cargar. Funciona, pero se repetirá en todas las piezas que usen motores de plantilla. Pedido: cargar `requiere` en orden, o documentar este patrón en `docs/3d.md`. Caso: `alg-cubo-3d`, que lee `root.MotorCuadrado`.
3. **Rótulos sobre objetos del mismo color** (`h.etiqueta` en `vivo3d.js`): el rótulo «ab²» (c-f) sobre su propia pieza morada, y «ec. 3» (c-d) sobre su plano verde, se leen con poco contraste, porque el fondo del rótulo es translúcido. Pedido: una opción `{ fondo: true }` con fondo sólido de la superficie. Caso: `alg-cubo-3d` con el cubo abierto.
4. **`node --test nucleo/` falla en Node 22** (toma la carpeta como archivo: «not ok 1 - nucleo»). El encargo y `docs/3d.md` §4 lo piden así; yo corrí `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`. Pedido: corregir el comando en `docs/3d.md` y en los encargos.
5. No hizo falta ninguna clase nueva de three.js: `BoxGeometry`, `EdgesGeometry`, `BufferGeometry`, `SphereGeometry` y las ayudas `h.barra`, `h.flecha` y `h.etiqueta` alcanzaron.

## 5. Cómo se comprobó

- Después de cada unidad: `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`, en verde. El validador recorre la grilla de cada reto.
- Playwright a 360 × 780 con swiftshader: `node rutinas/teoria4-algebra/pw3d.js <unidad> <mesa>`, con el alumno de prueba del encargo en `lab-v1`. En las cinco mesas se cumplieron los seis pasos de docs/3d.md §4:
  1. el lienzo aparece;
  2. girar cambia la figura;
  3. «Vista inicial» la deja igual que al inicio (comparación de píxeles del lienzo);
  4. la lupa abre con el mismo lienzo;
  5. «Muéstrame» resuelve un reto;
  6. el caso guardado tiene miniatura.

  También: sin desborde horizontal y sin errores de consola.
- Miré las capturas de cada mesa (inicio, girada, lupa, «Muéstrame» y caso). Correcciones que salieron de mirarlas:
  - **Cubo:** los rótulos de las piezas solo aparecen con el cubo abierto, porque con el cubo cerrado caían sobre piezas escondidas.
  - **Columnas:** la caja era chica, así que subí la escala y le agregué el piso z = 0, para que se vea cuándo w lo cruza.
  - **Planos:** los tres rótulos se apilaban en el caso de la recta común; ahora se reparten.
  - **Techo:** subí la escena y moví el rótulo de k.
- Primer falso negativo: «Vista inicial» parecía fallar porque la barra de navegación fija tapaba el borde del lienzo. El script ahora centra el lienzo antes de comparar.

## 6. No verificado

- El Redmi 15C de Gerson. swiftshader es pesimista, pero no reemplaza un celular real.
- El modo ahorro y el tema oscuro: los colores salen de `--c-*`, pero no miré capturas en oscuro.
- El respaldo cuando Android corta el 3D: es de la base y no lo forcé.
- Alumnos reales: si la mesa del techo hace más claro por qué el óptimo es un vértice es una **hipótesis**.
- El contraste de los rótulos sobre su propio objeto: lo vi a ojo y no lo medí (pedido 3).

## 7. Reporte de diseño

```
## Reporte de diseño
Ficha de tarea: el alumno gira y mueve una figura 3D que hace visible una relación de álgebra que en el plano se
  pierde ((a + b)³ ≠ a³ + b³; det = volumen con signo; un sistema 3 × 3 como tres planos; el óptimo como esquina más
  alta). Celular de gama baja, 360 px, sin conexión. Exploración libre: no hay predicción ni bloqueo; los retos son
  invitaciones (excepción de la regla 3). Estados: cargando (respaldo plano), en vivo, sin WebGL 2 (plano con aviso),
  reto logrado, visto con ayuda.
Sistema: existente (docs/diseno.md, kit, vivo3d.js). Sin decisiones nuevas de sistema.
Carácter: el del proyecto. Firma: el color de cada variable igual en el control, el rótulo HTML, el objeto 3D y la
  lectura (a en c-o, b en c-i; a²b en c-d y ab² en c-f, de la escena cuadrado-crece; u, v, w en c-o, c-i, c-d;
  ecuaciones 1, 2, 3 en c-o, c-i, c-d; Z y k en c-h, la región en c-d, como en la unidad).
Constantes / progresión / excepción: constantes: el cubo de referencia o el piso, la vista de partida y los colores.
  Progresa la variable de la mesa («Abrir», la altura de w, la tercera ecuación, el plano k). Excepción reservada: lo
  común a los tres planos y la esquina más alta van en tinta gruesa o con esfera; nada más es grueso.
Movimientos: ninguno automático. El giro sigue al dedo y lo hace la base. «Abrir» y k son controles del modelo
  (reloj del alumno), con − y +. No hay animación continua ni celebración nueva.
Verificación: Playwright, seis pasos en cinco mesas, todos en sí; capturas revisadas y corregidas (sección 5).
  Ningún texto cambia mientras algo se mueve; las lecturas son lecturas en vivo. Cada control tiene − y +; el giro
  tiene teclado (base).
No verificado: teléfono real, tema oscuro, lector de pantalla real, personas.
Hipótesis: la mesa de tres planos reduce la confusión entre «sin solución» y «planos paralelos» (el prisma no tiene
  paralelos); se comprobaría con el reto 2 de esa mesa: cuántos lo logran sin «Muéstrame».
Conflictos: ninguno con el repo. Del skill, «el contraste se calcula, no se estima»: el de los rótulos sobre su objeto
  no lo calculé (pedido 3).
```
