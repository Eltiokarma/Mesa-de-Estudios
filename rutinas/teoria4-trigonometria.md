# Ronda 4 del 3D: trigonometría (15 nov 2026)

Rama `teoria4/trigonometria`, desde `main`. Encargo: `rutinas/encargos/teoria4-trigonometria.md`. Molde: `docs/3d.md`.

## 1. Las 19 unidades

| # | Unidad | Clase | Razón | Qué se hizo |
| --- | --- | --- | --- | --- |
| 1 | angulo-trigonometrico | Plano | El giro, su signo y las conversiones viven en el plano. | Nada |
| 2 | longitud-de-arco-y-sector | 3D de contexto | Ruedas, fajas y engranajes son objetos reales, pero se miden en el plano. | Nada (siguiente candidata: una rueda que rueda con control `t`) |
| 3 | razones-trigonometricas-agudas | Plano | El triángulo rectángulo y sus razones son planos. | Nada |
| 4 | triangulos-rectangulos | **3D necesario** | La torre vista desde dos puntos no alineados con el pie: dos triángulos de pie y uno acostado en el piso. | Mesa «La torre y dos miradas» |
| 5 | recta-en-el-plano | Plano | Coordenadas en el plano cartesiano. | Nada |
| 6 | angulos-en-posicion-normal | Plano | Ángulos en el plano cartesiano. | Nada |
| 7 | reduccion-al-primer-cuadrante | Plano | Simetrías en la circunferencia. | Nada |
| 8 | circunferencia-trigonometrica | Plano | Las líneas trigonométricas son planas; la hélice de la unidad 13 ya muestra su lado 3D. | Nada |
| 9 | identidades-fundamentales | Plano | Álgebra con razones. | Nada |
| 10 | arcos-compuestos | Plano | Flechas en la circunferencia y ondas. | Nada |
| 11 | arcos-multiples | Plano | Identidades y gráficas. | Nada |
| 12 | transformaciones-trigonometricas | Plano | El rombo de dos flechas es plano. | Nada |
| 13 | funciones-trigonometricas | 3D de contexto | La onda seno es la hélice vista de costado; se aprende igual en 2D, pero girar la une con la circunferencia. | Mesa «La hélice y su sombra» |
| 14 | funciones-trigonometricas-inversas | Plano | Gráficas y reflejos en el plano. | Nada |
| 15 | ecuaciones-trigonometricas | Plano | Cortes con rectas horizontales en la circunferencia y en la gráfica. | Nada |
| 16 | triangulos-oblicuangulos | **3D necesario** | Rumbos con una torre: el ángulo en el pie sale de los rumbos y AB, de la ley de cosenos en el piso. | Mesa «Dos rumbos y la torre» |
| 17 | areas-y-lineas-notables | Plano | Áreas y cevianas de triángulos planos. | Nada |
| 18 | conicas | **3D necesario** | «Cónica» es el corte de un cono: la curva depende de comparar la inclinación del plano con la generatriz. | Mesa «El cono que se corta» |
| 19 | coordenadas-polares-y-complejos | Plano | Plano polar y plano complejo. | Nada |

Las tres «necesario» están hechas; de las dos «de contexto», la hélice.

## 2. Piezas nuevas (`nucleo/kit/piezas/`)

| Pieza | Qué dibuja | Unidades | Pruebas |
| --- | --- | --- | --- |
| `trig-campo-3d` | Torre en un piso con rosa N–E, observadores por rumbo y distancia, visuales, arcos de elevación, AB y el ángulo en el pie | triangulos-rectangulos, triangulos-oblicuangulos | `trig-campo-3d.test.js` (5) |
| `trig-cono-3d` | Cono doble, plano inclinado y la curva del corte (también degeneradas) | conicas | `trig-cono-3d.test.js` (4) |
| `trig-helice-3d` | Hélice, su sombra seno en la pared, la sombra coseno en el piso, P y la llave del periodo | funciones-trigonometricas | `trig-helice-3d.test.js` (5) |

Las tres tienen respaldo SVG, `alt` con los números del motor, «girar no cambia la figura» y `tocar` (la torre y los observadores dicen rumbo, distancia y elevación).

## 3. Motores

- **Nuevo:** `plantillas/trig-angulos-verticales/motor.js` (`window.MotorCampo`): `rumbo`, `punto`, `separacion`, `elevacion`, `campo`. AB sale por coordenadas y por la ley de cosenos, y la prueba compara las dos. `motor.test.js` con 5 pruebas; los 4 casos se calcularon aparte en Python con coordenadas y producto punto.
  - Lo puse en la plantilla de ángulos verticales porque el validador de `requiere` solo admite piezas, motores de plantilla o `nucleo/elementos.js`. Si la sesión principal prefiere `nucleo/campo.js`, hay que sumarlo a la `BASE` de `app/teoria.js`.
- **Ampliado:** `plantillas/conicas/motor.js` con `corte3d` (puntos 3D de la curva, tipo, hojas que toca, degeneradas con altura 0). La prueba nueva comprueba que cada punto esté en el cono y en el plano, que el tipo coincida con `cono()`, y los extremos de la elipse (30°, 60°, altura 1), calculados aparte en Python.
- **Ampliado:** `plantillas/circunferencia-trig/motor.js` con `helice` (periodo, vueltas, P y sus sombras). La prueba nueva usa 3 casos calculados en Python y comprueba el cilindro y el periodo.

Cada unidad carga su motor por `requiere`, antes de la pieza: no hace falta tocar `app/` (el service worker ya precarga los `requiere` de la teoría).

## 4. Pedidos a la base o a la app

1. **«Muéstrame» con grillas de más de 20 000 casos.** En la primera versión de la torre (h, dA y dB de 1 en 1: unos 80 000 casos), «Muéstrame» cambió dos controles cuando bastaba uno: la muestra de `T.grilla` no traía el caso más cercano. Lo resolví con pasos de 2 (11 700 casos). Para la base, propongo buscar primero los casos que cambian un solo control y después la muestra.
2. **Colores de la pieza y de la unidad.** En `triangulos-oblicuangulos`, la unidad usa c-h para el rumbo θ y c-d para el lado c. La pieza `trig-campo-3d` usa c-h para la altura h y c-d para las visuales. En la mesa no salen juntos (θ solo va en la lectura, como texto; h no se rotula en la lectura), pero un `datos.colores` en la pieza lo evitaría. No lo agregué para no inventar una convención de la base.
3. No faltó ninguna clase de three.js: `TubeGeometry`, `CatmullRomCurve3`, `ConeGeometry`, `TorusGeometry`, `PlaneGeometry` y `LineDashedMaterial` ya están en el paquete.

## 5. Lo no verificado

- Rendimiento real en el Redmi 15C. Solo corrí la emulación con swiftshader, que es pesimista. Los tubos de la hélice suman unos 9000 triángulos y el resto de la escena, menos de 3000; ninguna escena pasa de 20 mallas.
- Modo oscuro y modo ahorro: el código los atiende (`h.oscuro`, `h.SEG`), pero no los capturé.
- La lupa: abrió en las cuatro mesas, pero no probé pellizcar ni Ctrl + rueda dentro de ella.
- Los textos de Mara (`bien` y `pista`) no pasaron por una revisión a ciegas.

## 6. Reporte de diseño

**Ficha de tarea (las cuatro mesas):**
- Persona: postulante de 3.º a 5.º, celular de 360 px, exploración libre.
- Promesa: ver en 3D lo que el papel aplana.
- Resultado observable: logra los retos moviendo controles y girando.
- Orden de atención: 1.º la figura, 2.º la lectura y 3.º el reto.
- Estados: inicio, girado, «Vista inicial», reto con pista, reto mostrado, caso guardado.

**Cinco decisiones por mesa:**
- **Torre:**
  - cambian h, las distancias y el ángulo en el pie;
  - permanecen la torre vertical y el piso;
  - progresa del triángulo de pie al del piso;
  - se reserva la comparación con la torre al doble;
  - debe verse que el rumbo no cambia la elevación.
- **Rumbos:** igual que la torre, con el énfasis en el triángulo del piso. Su vista de partida está más inclinada (40°) para leerlo.
- **Cono:**
  - cambian φ, g y la altura del plano;
  - permanecen el cono y su eje;
  - progresa de circunferencia a elipse, parábola e hipérbola;
  - se reservan las degeneradas, por el vértice;
  - debe verse que manda φ frente a g.
  - La vista de partida es de 30° y 30°, porque de costado la elipse se veía como una raya.
- **Hélice:**
  - cambian A, B y la x de P;
  - permanecen la pared y el eje;
  - progresa de una vuelta a un periodo;
  - se reserva «A no cambia el periodo»;
  - debe verse que la onda es la sombra de la hélice.

**Lista F:**
- Rótulos HTML del color de su variable, legibles a 360 px.
- Controles con − y + (de la app).
- Nada avanza solo: P se mueve con el control x, sin animación.
- La lectura tiene 12 palabras o menos.
- La tarjeta del reto no tapa la figura.

**Revisión a 360 × 780 con swiftshader** (capturas en el scratchpad de la sesión; no se suben):
- en las cuatro mesas aparece el lienzo;
- girar cambia la figura y «Vista inicial» la devuelve igual (comparé píxeles);
- la lupa abre;
- «Muéstrame» resuelve el primer reto;
- el caso guardado deja su miniatura;
- no hay errores en la consola.

**Ajustes que salieron de mirar las capturas:**
- el campo se salía del lienzo: alejé la cámara y achiqué el radio;
- el rótulo «16 m» chocaba con α: moví las distancias hacia el pie y las α y β, más arriba;
- en la hélice, el rótulo de la onda quedaba fuera: ahora va dentro de la pared.

**Lo que queda flojo:**
- con distancias cortas, el rótulo AB todavía puede pisar el de una distancia;
- en el cono, el nombre de la curva puede caer sobre la hoja cuando la curva es chica.
