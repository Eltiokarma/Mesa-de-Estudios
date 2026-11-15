# Ronda 4 (el 3D con three.js): aritmética

**Fecha:** 15 nov 2026. **Rama:** `teoria4/aritmetica`, salida de `main`. **Encargo:** `rutinas/encargos/teoria4-aritmetica.md`.

**Resumen:** siete mesas 3D en seis unidades, todas sobre una sola pieza nueva (`ari-cubitos-3d`). Tres unidades son «3D necesario», tres son «de contexto» y en sucesiones el 3D es necesario solo para la suma de cuadrados. Las otras doce unidades quedan planas. Ningún cálculo vive en la pieza: los hacen cuatro funciones nuevas en motores de `plantillas/`, cada una con su prueba de fuerza bruta, y tres funciones que ya existían.

## 1. Las 19 unidades

En el orden de `catalogo/cursos/aritmetica.json`.

| # | Unidad | Clase | Razón | Qué se hizo |
| --- | --- | --- | --- | --- |
| 1 | Lógica proposicional | Plano | Tablas de verdad y conectivos: no hay nada con profundidad. | Nada |
| 2 | Conjuntos | Plano | Venn y Carroll son regiones del plano; el producto cartesiano es una tabla. | Nada |
| 3 | Razones y proporciones | Plano | Se compara en tiras y en la recta. | Nada |
| 4 | Magnitudes proporcionales | Plano | Gráficas y repartos en tiras. La unidad no trata unidades de volumen (la pista del encargo no aplica); poner la regla de tres compuesta en una caja sería forzar el 3D. | Nada |
| 5 | Porcentajes | Plano | Barras. | Nada |
| 6 | Interés y descuento | Plano | El tiempo es una recta. | Nada |
| 7 | Mezclas y aleaciones | Plano | Balanza y recta del precio medio. | Nada |
| 8 | Estadística | Plano | Un gráfico estadístico en 3D deforma las proporciones. | Nada |
| 9 | Análisis combinatorio | Contexto | Con tres tiempos, el principio de multiplicación es una caja. Con dos ya alcanza la tabla. | Mesa «El menú con postre» |
| 10 | Probabilidades | Contexto | El espacio muestral de tres dados es una caja de 6 × 6 × 6 (con dos dados, una capa). | Mesa «Tres dados en una caja» |
| 11 | Numeración | Contexto | En los bloques de base b, el tercer orden (b³) ya es un cubo. | Mesa «Bloques de base b» |
| 12 | Cuatro operaciones | Plano | Multiplicar por partes es un área; las llevadas, un tablero. | Nada |
| 13 | Divisibilidad | Plano | Filas, sobrantes y restos. | Nada |
| 14 | Números primos y divisores | **Necesario** | Con tres primos, los divisores llenan una caja de (a + 1)(b + 1)(c + 1) cubitos. El plano solo muestra dos primos. | Mesa «La caja de los divisores» |
| 15 | MCD y MCM | **Necesario** | El cubo más grande que llena una caja a × b × c (MCD de tres lados) y el cubo más chico hecho con ladrillos (MCM) son problemas de examen en el espacio. | Mesas «La caja que se llena» y «Ladrillos que arman un cubo» |
| 16 | Números racionales | Plano | Tiras y recta. | Nada |
| 17 | Potenciación y radicación | **Necesario** | k³ y la raíz cúbica con residuo; la cáscara de 3k² + 3k + 1 cubitos que lleva a (k + 1)³. | Mesa «El cubo de cubitos» |
| 18 | Sucesiones y series | **Necesario** (solo la suma de cuadrados) | La unidad dice que 1² + … + n² «no sale del rectángulo»: es el volumen de una pirámide escalonada. El resto de la unidad es plano. | Mesa «La pirámide de cuadrados» |
| 19 | Razonamiento numérico | Plano | Planteo, edades y móviles: tiras y recta. | Nada |

Cada mesa 3D va primera en su laboratorio. Ningún `id` de mesa existente cambió. Ningún laboratorio pasa de 5 mesas (MCD y MCM llega justo a 5).

### Las mesas

Todas cumplen lo mismo:
- son exploración libre (excepción de la regla 3);
- usan controles con − y +;
- traen una `lectura` en vivo de 12 palabras o menos;
- traen de 4 a 5 retos con `logrado`, `bien` y `pista`, comprobados con el mismo motor que dibuja;
- al menos un reto toca la idea central y al menos uno compara dos casos guardados.

| Unidad | Mesa (`id`) | Controles | Qué se ve | Retos |
| --- | --- | --- | --- | --- |
| Primos y divisores | `caja-divisores` | exponentes de 2, 3 y 5; qué se resalta (pares, impares, cuadrados perfectos, múltiplos de 15) | un cubito por divisor; ejes ×2, ×3, ×5 | 12 divisores con los tres primos · caja cúbica de 27 · 8 cuadrados perfectos · la capa apagada de los impares · misma cantidad con cajas de distinta forma (guardados) |
| MCD y MCM | `caja-que-se-llena` | lados a, b, c; lado del cubo | la caja punteada y los cubos que caben (verdes solo si llenan justo) | el MCD de 12, 8 y 6 · una caja de MCD 4 · llenar con solo dos cubos · hueco en un solo lado · MCD contra un divisor común menor (guardados, con `testigo`) |
| MCD y MCM | `ladrillos-cubo` | largo, ancho y alto del ladrillo; lado del cubo | el cubo punteado en rojo y los ladrillos de cada lado, en el color de su medida, con ×n | el cubo de 2 × 3 × 4 · un múltiplo común que no es el menor · un ladrillo de MCM 60 · un solo lado que no cierra · dos ladrillos con el mismo MCM (guardados) |
| Potenciación | `cubo-de-cubitos` | N de 1 a 250; cáscara pegada o aparte | k³ en turquesa, el residuo en rojo sobre la cáscara (caras, aristas, esquina) y (k + 1)³ punteado | cubo perfecto de más de 100 · las tres caras justas · falta un cubito · cuadrado y cubo a la vez (64) · misma raíz, distinto residuo (guardados) |
| Probabilidades | `tres-dados` | dos o tres dados; evento (suma igual, suma al menos, al menos un 6, ningún 6); suma | un cubito por resultado; los del evento en verde, los otros tenues | la suma más probable con tres · una suma de una sola manera · P = 1/2 · la suma 7 con dos y con tres dados (guardados) · un evento y su complemento (guardados) |
| Numeración | `bloques-base` | b; cubos, placas, barras y unidades | barra = b cubitos, placa = b barras, cubo = b placas; las clases con b piezas o más, en naranja | 23 en base 4 sin canjes pendientes · (444)₅ · 13 en base 2 · base 10 copia la cantidad · la misma cantidad canjeada y sin canjear (guardados, con `testigo`) |
| Combinatorio | `menu-con-postre` | entradas, segundos, postres; qué plato se fija | un cubito por menú; los del plato fijo en verde | 24 menús · el máximo con 9 platos (27) · fijar una entrada en 3 × 3 × 3 · mismos menús con cajas distintas (guardados) |
| Sucesiones | `piramide-cuadrados` | n de 1 a 10; con o sin el cubo n³ | pirámide escalonada: capas verdes y la última, n², en rojo | 55 cubitos · la capa de abajo gana a las de arriba · menos del 40 % del cubo · n y 2n (guardados) |

**Glosario:** las mesas no estrenan palabras técnicas. «Divisor», «cuadrado perfecto», «cubo perfecto», «raíz cúbica», «residuo», «múltiplo común», «divisor común», «numeral», «cifra», «base de numeración», «espacio muestral» y «evento» ya están en el glosario del curso. `herramientas/palabras-glosario.js` no marcó candidatas nuevas. «Cáscara», «caja», «capa» y «ladrillo» son palabras de la escena y no entran (docs/teoria.md §4d).

## 2. Pieza nueva

**`nucleo/kit/piezas/ari-cubitos-3d.js`** (pruebas en `ari-cubitos-3d.test.js`). Dibuja bloques en una cuadrícula del espacio, agrupados por color, sobre `Kit.vivo3d.montar`.

- **Datos:** `{ bloques: [{ x, y, z, w?, h?, d?, g }], grupos: [{ nombre, color?, rotulo?, rotuloEn?, dice? }], marco?, marcas?, hueco?, vista?, alt? }`.
  - Los bloques pueden medir distinto de 1: así caben ladrillos, placas y cubos de bloques.
- **Escena:**
  - una `InstancedMesh` por grupo y una sola malla de aristas;
  - el marco punteado (`LineDashedMaterial`) con un velo tenue;
  - los rótulos HTML en el color de su grupo o de su marca (regla 4);
  - al tocar un grupo se lee su `dice`.
- **Escala:** sale de la diagonal de la figura, para que quepa al girarla desde cualquier lado.
- **Respaldo plano:** las caras visibles proyectadas de atrás hacia adelante. Las caras tapadas por un cubito vecino no se dibujan: la caja de 24 divisores dibuja 26 caras, no 72.
- **Presupuesto:** hasta 1200 bloques (14 400 triángulos); como mucho 5 grupos, más las aristas y el marco. Sin sombras, sin texturas, sin animación continua.
- **Quién la usa:** las 7 mesas de arriba (6 unidades).

## 3. Motores: lo nuevo y sus pruebas

| Función | Motor | Pruebas (cálculo independiente) |
| --- | --- | --- |
| `cajaDivisores(exps, primos, filtro)` | `plantillas/divisores/motor.js` | `plantillas/divisores/caja3d.test.js`: en toda la grilla de la mesa (5 · 4 · 4 exponentes × 5 filtros), contra recorrer 1..n y clasificar cada divisor a mano. Más 7 casos fijos contados a mano. |
| `llenarCaja(a, b, c, m)` | `plantillas/fracciones/motor.js` | `plantillas/fracciones/caja3d.test.js`: toda la grilla de la mesa, contra buscar el MCD probando uno por uno y contar los cubos por capas. |
| `cuboDeLadrillos(a, b, c, L)` | `plantillas/fracciones/motor.js` | El mismo archivo: toda la grilla, contra buscar el MCM probando uno por uno; el volumen cuadra (ladrillos · abc = L³). |
| `cuboConResto(N, separar)` | `plantillas/potenciacion/motor.js` | `plantillas/potenciacion/cubo3d.test.js`: N de 1 a 250, contra la raíz cúbica buscada subiendo k de uno en uno. Sin cubitos repetidos; el residuo llena caras, después aristas, después la esquina. |

**Ya existían y se reutilizan:**
- `MotorDados.probabilidad` y `MotorDados.multiplicacion` (`plantillas/probabilidad-dados`);
- `MotorNumeracion.estado` (`plantillas/numeracion`);
- `MotorSucesiones.sumaNotable` (`plantillas/sucesiones`).

**Cómo llegan los motores a la unidad:** van en `requiere` como `/plantillas/<tema>/motor.js`, antes de la pieza, y la unidad los recibe como segundo argumento de su fábrica (como `quimica/enlace-quimico.js`). **No hace falta sumar nada de `nucleo/` a la app:** ninguna mesa usa `nucleo/geometria3d.js` ni un módulo nuevo de `nucleo/`.
- `MotorDados` solo pide `Azar` para simular; contar casos funciona sin cargarlo.

**Pruebas:**
- `npm test` completo: 8584 de 8584 en verde antes del último push;
- `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`, en verde después de cada unidad.
- Con Node 22, `node --test nucleo/` (la carpeta como argumento) falla también en `main`: hay que pasarle el patrón de archivos.

## 4. Pedidos a la base y a la app

1. **App, «Muéstrame» con grillas grandes (`app/teoria.js`).** Con más de 20 000 casos, «Muéstrame» busca en la muestra fija de `Teoria.grilla` y no usa el `testigo` del reto.
   - **El caso:** la mesa `bloques-base` tenía 79 092 casos, y «Muéstrame» del reto «23 en base 4» no encontraba nada (el botón no hacía nada).
   - **Cómo lo resolví sin tocar la app:** bajé los topes de la mesa a 19 683 casos.
   - **El pedido:** que «Muéstrame» pruebe primero el `testigo` cuando lo hay.
2. **Base, rótulos fuera del lienzo (`nucleo/kit/vivo3d.js`, `kit.css`).** Un rótulo HTML que cae fuera del lienzo ensancha la página.
   - **El caso:** en la caja de divisores, con la caja girada, la página llegó a 419 px a 360. Lo arreglé en la pieza, achicando la escala.
   - **El pedido:** `overflow: hidden` en `.kit-3d-etiquetas`, o esconder el rótulo que sale del lienzo.
3. **Base, lupa en vertical.** En la lupa, el lienzo es alto y angosto. La cámara fija el ángulo vertical, así que la figura se corta a los lados.
   - **El caso:** «El cubo de cubitos» en la lupa a 360 × 780; también debería pasar con el prisma y la molécula.
   - **El pedido:** si el aspecto es menor que 1, alejar la cámara en proporción.
4. **three.js:** nada que pedir. La pieza usa solo clases del paquete (`InstancedMesh`, `LineDashedMaterial`, `EdgesGeometry`, `BufferGeometry`).

## 5. Lo no verificado

- **Equipo real:** no se probó en el Redmi 15C ni en un navegador de fábrica; la emulación con swiftshader es pesimista.
- **Tocar un grupo:** el rayo contra `InstancedMesh` y el texto `dice` no se comprobaron con Playwright; solo se leyó el código de la base.
- **Tema oscuro y modo ahorro:** no se miraron. El neutro oscuro de la pieza (`#5a5068`) no se vio en pantalla.
- **Contraste de los rótulos:** no se calculó sobre los cubitos. Los de la base tienen fondo propio, y a ojo se leen.
- **Ubicación de los rótulos de los ejes:** en «Tres dados» y en «El menú con postre», desde la vista inicial, algunos caen sobre una cara de la caja. Se leen, pero no quedan fuera de la figura.
- **«Vista inicial»:** el script la marcó como «no vuelve», pero solo porque la barra de navegación tapaba otra parte del lienzo. Comparadas a mano, la vista es la misma.
- **Lector de pantalla:** no se probó.

## 6. Recorrido con Playwright

Hecho en las 7 mesas, a 360 × 780 y con swiftshader, con la prueba del tema guardada en `lab-v1`.

| Comprobación | Resultado |
| --- | --- |
| El lienzo aparece | Sí, en las 7 |
| Girar cambia la figura | Sí, en las 7 |
| «Vista inicial» la deja como al inicio | Sí, comparada a mano (ver § 5) |
| La lupa abre | Sí |
| «Muéstrame» resuelve el reto 1 | Sí; en `bloques-base`, después de achicar la grilla |
| «Guardar este caso» deja miniatura | Sí, con el respaldo plano |
| Errores de consola | Ninguno |

**Capturas que se miraron:** la inicial, la girada, la de «Muéstrame», la cáscara aparte con N = 63 y la lupa. Se corrigieron tres cosas:
- la escala, para que la caja quepa girada;
- los rótulos que tapaban cubitos del mismo color;
- los márgenes de los rótulos de los ejes.

## Reporte de diseño

**Ficha de tarea:**
- **Promesa:** ver como volumen lo que en aritmética es el producto de tres factores:
  - divisores (a + 1)(b + 1)(c + 1);
  - MCD y MCM de tres lados;
  - k³ y su residuo;
  - menús e · s · p;
  - 6³ resultados;
  - b³;
  - la suma de cuadrados.
- **Persona y condiciones:** postulante de 3.º a 5.º, celular de 360 px, a veces sin conexión ni WebGL 2.
- **Resultado observable:** cuenta en la figura lo que calcula la fórmula y lo cumple en un reto.
- **Orden de atención:** 1.º la figura y su grupo de color · 2.º la lectura · acción: los − y +.
- **Estados:**
  - mesa sin tocar;
  - girada;
  - en la lupa;
  - reto, pista, «Muéstrame» y logrado;
  - vista plana, sin WebGL 2 o con el 3D cortado.
- **Duda que resuelve:** ¿por qué se multiplica y no se suma?

**Sistema:**
- **Existente:** tokens `--c-o`, `--c-i`, `--c-h`, `--c-d`, `--c-f`, el kit y la base 3D.
- **Decisión nueva:** el neutro de los bloques sin variable (`#cfc6bd`, translúcido). Se usa para los cubitos que no cumplen y deja ver los verdes de adentro. Quedó escrito en el encabezado de la pieza, no en `docs/diseno.md`; la sesión principal decide si sube al sistema.

**Carácter:** sin cambios.
- **Firma:** el cubito con un hueco entre vecinos. Se repite en las 7 mesas, y así cada unidad se puede contar a ojo.

**Movimientos:** ninguno nuevo. Girar, acercar y «Vista inicial» son de la base, y nada se anima solo (regla 4 de docs/3d.md).

**Verificación:**
- **Colores:** un color por variable, y el mismo en el control, en el rótulo HTML y en el cubito (regla 4). Cada unidad usa los colores ya declarados en su encabezado; donde faltaba un tercer lado o eje, se usó violeta (`c-f`) y se anotó en el encabezado (MCD y MCM).
- **El color no es la única señal:**
  - en la caja de divisores, la lectura da la cantidad;
  - en los bloques de base b, el naranja va con la lectura «aún se puede canjear»;
  - el residuo va con el rótulo «r = …».
- **Alternativas al gesto:** el giro tiene teclado y botón. Todo control tiene − y +.
- **Cinco decisiones** (cambia, permanece, progresa, se reserva, debe verse): escritas como comentario sobre cada mesa.
- **Presupuesto:** a lo sumo 1200 bloques (14 400 triángulos), con el tope comprobado en la pieza. Cuántas mallas hay se calculó por código, no se midió en pantalla.

**No verificado:** ver § 5.

**Hipótesis:**
- Ver la caja hace que el alumno elija multiplicar y no sumar en problemas de tres factores (divisores, menús, ladrillos).
- **Cómo se comprobaría:** los errores AT-* de esas unidades en la prueba del tema, antes y después de usar el laboratorio, y los eventos `explora` e `invitacion` de la medición.

**Conflictos:**
- **Con el encargo:** pedía el prefijo `ari-`, pero las piezas planas del curso usan `arit-`. Se siguió el encargo y `docs/3d.md` (`ari-`).
- **Con la app:** «Muéstrame» limita el tamaño de las grillas (pedido 1).

## Cómo quedó

- **Commits:** uno por unidad, en la rama `teoria4/aritmetica`, más el de este reporte.
- **`npm test` completo:** 8584 de 8584 en verde.
- **Integración:** no se integró a `main`; la integra la sesión principal.
