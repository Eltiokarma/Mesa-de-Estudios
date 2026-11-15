# Ronda 4 (3D) · razonamiento matemático: reporte

**Fecha:** 15 nov 2026. **Rama:** `teoria4/razonamiento-matematico` (sale de `main` en 6cfbfa7). **Encargo:** `rutinas/encargos/teoria4-razonamiento-matematico.md`.

**Resumen.** Cuatro mesas 3D en tres unidades, todas sobre una sola pieza viva nueva, `rm-cubitos-3d`, y un motor nuevo, `plantillas/dados-caras/motor.js`. Ninguna mesa existente cambió de `id`. `npm test` completo en verde antes del último push.

## 1. Las 19 unidades

| Unidad | Clase | Razón | Qué se hizo |
| --- | --- | --- | --- |
| razonamiento-deductivo | Plano | Venn, cuadros de doble entrada y árboles de parentesco son relaciones lógicas: no tienen profundidad | Nada |
| trazos-y-perimetros | Plano | Trazos de un solo golpe, escaleras y arcos se dibujan y se miden en el plano | Nada |
| ordenamiento-de-informacion | Plano | Filas, mesas redondas y cuadradas: el orden se lee desde arriba | Nada |
| verdades-y-mentiras | Plano | Es lógica de frases: no hay figura que girar | Nada |
| traslados-y-puntos-cardinales | Plano (la torre de Hanói podría ser de contexto) | Rumbos y desplazamientos viven en el mapa; la torre se entiende de perfil, y en 3D solo adornaría | Nada (ver § 6) |
| arreglos-numericos | Plano | Cuadrados mágicos y polígonos con números | Nada |
| razonamiento-inductivo | **3D necesario** (solo en la inducción con figuras de cubitos) | En el cubo pintado, los cubitos interiores y los de las aristas no se ven sin girar ni separar el cubo | Mesa **«El cubo que crece»** (`cubo-que-crece`) |
| juegos-recreativos | **3D necesario** (dados) | Las caras tapadas de una pila de dados solo se ven si se gira y se separa la pila | Mesa **«Los dados que se separan»** (`dados-que-se-separan`) |
| cronometria-y-calendarios | Plano | Reloj y calendario son planos | Nada |
| certezas | Plano | Urnas y casilleros: se cuenta, no se mira en profundidad | Nada |
| frecuencia-de-sucesos | Plano | Rectas de tiempo y turnos | Nada |
| ruedas-poleas-engranajes | Plano | Engranajes y fajas se resuelven de frente; los ejes comunes se leen igual en el plano | Nada |
| maximos-y-minimos | Plano | Regiones, rectas y el reflejo del río son de plano | Nada |
| cortes-y-pesadas | Plano | Los cortes son de una varilla o una soga; las balanzas, de perfil | Nada |
| planteo-de-ecuaciones | Plano | Álgebra de enunciados | Nada |
| transformaciones-de-figuras | Plano | Isometrías, semejanza, rodamientos y áreas barridas pasan en el plano | Nada |
| rutas-y-visualizacion-espacial | **3D necesario** | Vistas de un sólido de cubitos y rutas por las aristas de una caja: la profundidad es la variable | Mesas **«La pila que gira»** (`pila-que-gira`) y **«La caja que gira»** (`caja-que-gira`) |
| tablas-graficos-y-suficiencia | Plano | Gráficos y tablas | Nada |
| diagramas-de-flujo | Plano | Diagramas y tablas de estados | Nada |

Orden de trabajo: el del curso (`catalogo/cursos/razonamiento-matematico.json`): inductivo, juegos, rutas. Un commit por unidad.

## 2. Las mesas

Todas son de exploración libre (excepción de la regla 3): sin predicciones, con consigna, controles con − y +, `lectura` de 12 palabras o menos y retos `{ texto, logrado, bien, pista }` comprobados con el mismo motor que dibuja. Cada una va primera en su laboratorio.

| Unidad | Mesa | Controles | Lectura (motor) | Retos |
| --- | --- | --- | --- | --- |
| razonamiento-inductivo (0.3.0, 4 mesas) | El cubo que crece | Lado n (2 a 6) · Separar (0 a 4) · Resaltar (todos, 3, 2, 1 o ninguna cara) | `MotorCubitos.pintado`: cuántos cubitos tienen 3, 2, 1 y 0 caras pintadas | 5: los interiores del cubo de 4 (idea central), 36 de dos caras, ningún cubito de dos caras, los de una cara le ganan a los de dos, y guardar n = 3 y n = 4 para comparar |
| juegos-recreativos (0.3.0, 4 mesas) | Los dados que se separan | Dados (1 a 4) · Arriba (1 a 6) · Giro de los de abajo (0 a 3) · Separar (0 a 2) | `MotorDados.pila`: suma de las caras tapadas, cara por cara | 4: separar una pila de 3 (idea central), tapadas = 20, la menor suma con 4 dados, y guardar dos pilas iguales con distinto giro (comparación) |
| rutas-y-visualizacion-espacial (0.3.0, 5 mesas) | La pila que gira | Pila (A a F, todas con frente 2, 3, 1 y lado 3, 2, 1) · Vistas en las paredes | Cubitos de `MotorCubitos.solido`; vistas de `vistaDe` (la de la idea 3) | 4: la de menos cubitos (6), la de más (14), una con hueco en el piso, y guardar dos con distinto número de cubitos (comparación) |
| rutas-y-visualizacion-espacial | La caja que gira | Ancho (1 a 3) · Alto (1 a 2) · Fondo (1 a 2) · Ruta (1 a 12) | Número de la ruta, total de rutas y sus pasos, de la lista `rutasDe` | 4: en el cubo, fondo-arriba-derecha (idea central: 3! órdenes), una caja de 30 rutas, una ruta que sube toda primero, y guardar dos rutas de la misma caja (comparación) |

**Glosario.** Dos términos nuevos en razonamiento inductivo: «cara pintada» y «cubito interior». Las demás mesas usan palabras que el curso ya define («dado común», «caras opuestas», «caras tapadas», «vista», «arista», «ruta mínima», «permutación con repetición»).

**La caja que gira, con más de 12 rutas:** el control «Ruta» salta repartido por toda la lista (por ejemplo, 12 de las 210 rutas de 3 × 2 × 2), para que no se vean solo las que empiezan igual. Al cargar la unidad, una comprobación verifica que la lista de rutas tenga, en todas las cajas de la mesa, el tamaño que da la fórmula de la regla (a + b + c)! / (a! · b! · c!); si no coincidiera, la unidad no se arma.

## 3. Piezas nuevas

**`nucleo/kit/piezas/rm-cubitos-3d.js`** (con `rm-cubitos-3d.test.js`, 7 pruebas). Es una sola pieza para todo lo espacial del curso, sobre `Kit.vivo3d.montar`. La usan las cuatro mesas.

- **Qué dibuja:** cubitos en los ejes de los motores (x a la derecha, y al fondo, z arriba), con:
  - un tono por cubito o por cara: cubo, pintada, sin pintar, base, dado, tenue, o el color suave de una variable (`c-i`, `c-h`…);
  - los puntos de un dado en cada cara;
  - separación desde el centro;
  - las vistas de frente y de lado en las paredes, con su rótulo HTML del color de la variable (turquesa `c-i` y verde `c-d`);
  - la cuadrícula del piso, una malla de alambre, una ruta gruesa por las aristas y rótulos HTML (A y B).
- **Respaldo plano:** las mismas caras proyectadas, dibujadas de atrás hacia adelante.
- **Pruebas:**
  - con los cubitos juntos, las caras dibujadas son las expuestas que cuenta el motor de cubitos pintados, y las pintadas son sus caras pintadas;
  - separados, se dibujan 6 caras por cubito;
  - un dado muestra en el respaldo tantos puntos como dicen sus caras visibles;
  - las paredes, la malla y la ruta salen en el respaldo;
  - girar conserva los largos.
- **Presupuesto:**
  - el peor caso es el cubo de lado 6 separado: 1296 caras, 2592 triángulos, más los bordes en líneas;
  - 4 dados: 84 puntos, unos 1000 triángulos;
  - menos de 20 mallas en cualquier mesa: una por tono, una con todos los puntos, dos de líneas, dos paredes y hasta 7 barras de ruta;
  - sin sombras ni texturas, y sin animación continua: separar y girar los dados son controles.

## 4. Motores y módulos

- **Nuevo:** `plantillas/dados-caras/motor.js`, en el navegador `window.MotorDados`.
  - Funciones: las 24 orientaciones del dado común, `orientar(arriba, frente)`, `frentes`, `girarVertical` y `pila(k, arriba, giro)`.
  - `pila` suma las caras tapadas y las visibles cara por cara, sin la fórmula.
  - `motor.test.js` trae 9 pruebas:
    - las mismas 24 orientaciones que el generador `dados-caras`;
    - la quiralidad, con un producto vectorial;
    - 5 casos verificados aparte;
    - en toda la grilla: ocultas = 7k − arriba y ocultas + visibles = 21k.
  - `plantilla.json` de `dados-caras` no se tocó: sigue siendo de formato «predicciones». El motor se carga como `/plantillas/dados-caras/motor.js` en `requiere`. Si la sesión principal quiere que la ficha lo nombre, se agrega `"motor": "motor.js"`.
- **Reusado:** `plantillas/cubitos-pintados/motor.js` (`window.MotorCubitos`): `pintado` y `solido`. Lo cargan con `requiere` razonamiento inductivo y rutas y visualización espacial.
- **Sin cambios:** `nucleo/geometria3d.js` no hizo falta, y no se tocó ningún módulo de `nucleo/` fuera del kit de piezas.

## 5. Pedidos a la base o a la app

1. **La lupa corta el 3D a los costados en celular.**
   - Caso: «El cubo que crece» en la lupa, a 360 × 780. Con el cuadro alto y angosto, la cámara (fov vertical fijo de 35°) deja ver unas 2,6 unidades de ancho, y el cubo de 3 se sale por los lados.
   - Por ahora el alumno lo arregla alejando con − o con el pellizco.
   - Propuesta en `vivo3d.js`: si el aspecto es menor que 1, dividir la distancia por el aspecto, o ajustar el fov horizontal.
2. **La pieza cambia `grupo.scale` en `construir`, para que cualquier pila o caja quepa en el cuadro.**
   - Funciona porque la base solo toca la rotación del grupo y `limpiar` crea un grupo nuevo en cada cambio.
   - Si la base empieza a tocar la escala, hay que avisar.
   - Sería más limpio un `spec.escala(datos)` de la base.
3. **Motores de plantilla en el navegador.**
   - `requiere` ya acepta `/plantillas/<id>/motor.js`, así que no hace falta sumar nada a `BASE` de `app/teoria.js`.
   - Hay que cuidar el orden: en `requiere`, el motor va antes que la pieza. `cargar` usa `async = false`, que respeta el orden de inserción.
   - Si algún día las piezas se cargan aparte de los motores, `rm-cubitos-3d` no los necesita: recibe todo ya calculado. Las unidades sí los necesitan.

## 6. Lo que no se hizo, y por qué

- **Ninguna mesa de «3D de contexto».** En este curso, el único candidato era la torre de Hanói de traslados, y de perfil se ve todo lo que importa. Hacerla en 3D solo adornaría, y `docs/3d.md` pide no hacer 3D que solo adorne.
- **Más mesas en rutas y visualización espacial.** El laboratorio llegó al tope de 5, así que el cubo pintado se fue a razonamiento inductivo, donde es inducción con figuras.
- **Vistas acotadas, cubos perforados y barras.** El motor de cubitos pintados ya los tiene; quedan para otra ronda.

## 7. Lo no verificado

- **Rendimiento:** no se probó en el Redmi 15C ni en otro celular real. La emulación con swiftshader va fluida en las cuatro mesas.
- **Tema oscuro del 3D:** los tonos fijos tienen su variante oscura en el código, pero no se miraron en capturas.
- **Lector de pantalla:** no se probó; el `aria-label` del lienzo es el `alt`, con los números del motor.
- **Contraste:** el de las caras sin pintar (#ddd5cf) frente al fondo crema es bajo, a propósito: es «madera cruda». La lectura y los bordes de tinta llevan la información.

**Recorrido con Playwright** (360 × 780, swiftshader) en las cuatro mesas:
- aparece el lienzo, sin errores de consola;
- arrastrar cambia la figura y «Vista inicial» la deja como al inicio (la captura del lienzo es idéntica);
- la lupa abre;
- «Pista» y después «Muéstrame» resuelven el primer reto;
- «Guardar este caso» deja una miniatura SVG.

Capturas revisadas: el cubo de lado 4 separado con los 8 interiores resaltados, la pila de 3 dados separada con las tapadas en rojo suave, la pila mínima con las dos paredes, y la caja de 3 × 2 × 2 con la ruta 88 de 210.

## Reporte de diseño

- **Ficha de tarea.**
  - Promesa: girar y separar sólidos de cubitos para ver lo que el dibujo plano esconde (interiores, caras tapadas, cubitos detrás de una torre, la profundidad de una ruta).
  - Persona: postulante de 3.º a 5.º, en un celular de gama baja y sin conexión.
  - Resultado observable: cuenta los cubitos de cada clase de un cubo pintado y explica por qué crecen distinto; explica por qué las tapadas de una pila suman 7k − arriba; reconoce que dos vistas admiten varios sólidos; lee una ruta como una permutación de pasos.
  - Orden de atención: 1.º el sólido · 2.º la lectura · 3.º el reto.
  - Estados: carga (respaldo plano), 3D en vivo, sin WebGL 2 (plano con aviso), 3D cortado por Android (plano con «Volver al 3D»), reto logrado y con ayuda.
  - Duda que resuelve: «¿qué hay detrás o adentro?».
- **Sistema:** el existente (`docs/diseno.md`, colores de variable `--c-*`). No hay decisiones nuevas de sistema. Los tonos propios de la pieza (sin pintar #ddd5cf, base #b3a8a0, cara de dado #fffdf9) están escritos en su encabezado y en `TONOS`.
- **Carácter:** el del proyecto. Firma: la tinta de los bordes y los rótulos HTML en el color de su variable, igual que en las piezas planas.
- **Movimientos:** ninguno propio. Girar y acercar son de la base; separar es un control con pasos, sin animación continua (regla 4 de `docs/3d.md`).
- **Verificación:**
  - un solo lienzo 3D por pantalla, y lo resaltado se lee primero (los cubitos tenues llevan bordes al 16 %);
  - el color nunca es la única señal: la lectura da los números, y los puntos del dado son forma;
  - los retos piden algo que se ve (separar del todo, resaltar un grupo, una caja de 30 rutas);
  - las zonas táctiles son los controles de la app.
- **No verificado:** personas reales, el celular de Gerson, el tema oscuro en capturas y el lector de pantalla.
- **Hipótesis, y cómo se comprueba:**
  - Separar el cubo debería bajar el error RME4 (contar las esquinas entre los de dos caras). Se comprueba con el «Ahora tú» de cubitos pintados, antes y después de usar la mesa.
  - La pila de dados separada debería bajar RME11 (contar también la cara de arriba). Se comprueba con la pregunta de la idea 2 de juegos recreativos.
- **Conflictos:** ninguno con el repo. La lupa angosta va en «Pedidos».
