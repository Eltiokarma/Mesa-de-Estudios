# la2: rendimiento en celular de gama baja y en una computadora vieja (medición, 7 nov 2026)

Aquí solo se mide; no se arregló nada. El repo no se tocó. Los scripts y los datos crudos están en esta misma carpeta:
`medir.js` (carga, FPS y toque por escena), `offline.js` (sin conexión), `perfilar.js` (perfil de CPU con CDP),
`frio3g.js` (escena abierta en frío por 3G), `tabla-md.js` (arma las tablas), `resultados-*.json`, `perfiles.txt`.

## Cómo se midió

- Chromium sin ventana (Playwright) con CDP. **Celular:** 360×740, dpr 2, táctil, `Emulation.setCPUThrottlingRate` ×6.
  **PC de laboratorio:** 1366×768, dpr 1, ratón, CPU ×4. Máquina de prueba: Xeon de 2,1 GHz y 4 núcleos.
- **Red «3G lenta»:** `Network.emulateNetworkConditions` con 400 kbps de bajada y de subida y 400 ms de latencia, para la primera carga de /app/.
- **Escenas:** las 54 de formato `escena` que tenía `app/datos/catalogo.json` al empezar la corrida. Mientras medía, otras sesiones
  subieron escenas nuevas; hoy son 58. Cada escena se abrió con `?desde=app`, servida por el service worker (caso normal tras la primera visita).
  - *Carga* = desde la navegación hasta que `#stepBody` tiene contenido y no quedan tareas largas (tiempo hasta interactivo aproximado).
  - *FPS:* se cuentan cuadros con `requestAnimationFrame` en tres ventanas: reposo (2 s), **paso a paso** (5 s después de tocar la primera
    opción de la primera predicción; antes se avanza con «Siguiente» hasta llegar a ella) y **explorador** (5 s después de tocar la primera opción
    de «¿Qué pasa si…?»). Una escena quieta da 60 FPS sin esfuerzo. Por eso el FPS de la tabla cuenta solo los cuadros en que la escena dibujó:
    los cuadros que faltan para llegar a 60 se cargan a esos cuadros activos.
  - *JS/cuadro:* tiempo medio por callback del rAF de la escena; se mide envolviendo `requestAnimationFrame`.
  - *Toque:* de `pointerdown` al cuadro siguiente al `click` (rAF y luego una tarea). Coincide, con ±20 ms, con la Event Timing API (`duration`).
- **Límites:** (1) sin GPU, Chromium sin ventana rasteriza el lienzo en software, así que el dibujo del lienzo pesa más que en un celular
  con GPU que funcione. En cambio, en celulares de gama baja con GPU en lista negra se parece bastante. (2) La regulación de CPU frena el
  hilo principal, no el ráster. (3) CDP no regula la red del service worker. El tiempo de la precarga se calcula como bytes ÷ ancho de banda.
  (4) El servidor local no comprime (no hay gzip) ni manda ETag; el hosting de la3 puede cambiar esos dos números.

## Números clave

### /app/

| | Celular (CPU ×6) | PC (CPU ×4) |
|---|---:|---:|
| Primera vez por 3G lenta, sin SW: DOMContentLoaded | 4,7 s | 4,7 s |
| Primera vez: primer pintado (FCP) | **8,7 s** | 8,7 s |
| Primera vez: interactivo | **9,0 s** | 8,9 s |
| Peso transferido para el primer pintado | 359 KB (sin comprimir), 15 archivos | igual |
| Segunda vez, desde la caché del SW: interactivo | **0,37 s** | 0,24 s |

Archivos más pesados de la primera carga: `datos/pruebas.json` 119 KB, `datos/catalogo.json` 113 KB, `app/lectura.js` 39 KB,
`app/app.js` 34 KB, `estilos.css` 26 KB y `nucleo/lectura.js` 23 KB.
La pantalla queda **en blanco hasta el segundo 8,7**. `app.js` pinta recién cuando llegaron *los dos* JSON (`cargarPruebas` y luego `render()`),
y los diez `<script>` del final del body son síncronos, entre ellos `lectura.js`, `prueba.js` y `practica.js`, que no se usan en el inicio.

**Precarga del service worker (install):** guarda 207 archivos y 7,6 MB al medir; hoy son 218 archivos y 8,2 MB.
- Por 3G lenta: **~164 s sin comprimir** y ~52 s con gzip (2,6 MB). Mientras dura, compite con lo que el alumno abre.
- Cada vez que se sube `VERSION` en `sw.js`, todo se baja otra vez (caché nueva, sin reutilizar la anterior). Durante esta medición `VERSION` pasó de **v55 a v69**.
- Además, stale-while-revalidate vuelve a pedir a la red cada archivo en cada visita. Sin ETag, la respuesta es un 200 completo: abrir una escena gasta ~125 KB de datos aunque se sirva de la caché.

**Escena abierta en frío por 3G (sin SW, por ejemplo si la precarga no terminó):**

| Escena | Listo (s) | load (s) | KB |
|---|---:|---:|---:|
| gases | 2,5 | 2,3 | 86 |
| cinetica | 3,2 | 3,3 | 132 |
| identidades-trig | 3,4 | 3,5 | 149 |
| optica-lente-delgada | 3,4 | **5,4** | 238 |

La escena promedio pesa 125 KB sin comprimir. El 84 % del `index.html` es JS en línea y el 13 %, CSS repetido en cada escena.

### Escenas (servidas por el SW)

- **Celular:** carga mediana de **0,49 s** (máx. 1,33 s, cinética). **Ninguna pasa de 3 s.** Toque: mediana de **100 ms**, máx. 207 ms (sólidos).
  **< 30 FPS: cinética** (19 FPS en el explorador y 30 en el paso a paso). Entre 30 y 50 FPS: líquidos y sólidos (32), ácidos y bases (43),
  probabilidad con dados (43) y gases (49).
- **PC:** carga mediana de **0,30 s** (máx. 0,99 s, la lente). Toque: mediana de **54 ms**, máx. 119 ms. Ninguna baja de 30 FPS. La peor es cinética (39 FPS); el resto da ≥ 59,6.

### Sin conexión

Primero se visitó /app/ una vez, se esperó al SW (con `controller`) y luego se usó `context.setOffline(true)`. Abrieron **65 de 65** visitas:
/app/, cursos, curso, papel, las 2 de práctica (predicciones), la lectura y las 58 escenas, entre ellas las 5 elegidas al azar
(acidos-bases, fracciones, electrostatica, angulo-inscrito y segmentos-angulos), recorriendo pasos y «¿Qué pasa si…?». No hubo errores de JS. Fallaron 2 archivos:

- `/nucleo/elementos.js` en **materia-energia**: no está en `CASCARA` de `sw.js` ni en los `archivos` de su `plantilla.json`.
  Hoy no se nota, porque la escena usa el bloque de CSS generado, pero es un fallo de red en cada apertura sin conexión.
- `https://fonts.googleapis.com/css2?...` en **optica-lente-delgada**: es la única escena que carga Google Fonts, con un `<link rel=stylesheet>`
  en el `<head>` que bloquea el pintado. Sin conexión falla rápido y la escena se ve con la letra del sistema. Por 3G frena el pintado
  (FCP de 1,6 s contra ~0,7 s de las demás) y lleva el `load` a 5,4 s.

### dpr: la causa común del lienzo lento

La misma corrida, solo cambiando el dpr, da estos FPS en la peor ventana:

| Escena | Lienzo con dpr 2 | FPS con dpr 2 | FPS con dpr 1 |
|---|---|---:|---:|
| gases | 612×1120 | 46 | **60** |
| acidos-bases (explorador) | 612×880 | 42 | **58** |
| atomo-y-tabla (explorador) | 612×853 | 51 | **60** |
| probabilidad-dados (explorador) | 612×340 | 36* | 49* |
| cinetica (explorador) | 612×876 | 17 | 24 |

\* En esa ventana, solo con los cuadros activos.

Ninguna de las 58 escenas limita `devicePixelRatio`: `cv.width = W*dpr` va tal cual. En los perfiles de CPU, entre el 57 % y el 88 % del tiempo
es «(program)», es decir, trabajo nativo de ráster y composición, no el JS de la escena.

## Las 5 peores (celular) y su causa probable

1. **cinetica**: 19 FPS en el explorador, 30 en el paso a paso y 33 en reposo; 32 ms de JS por cuadro; cuadros de hasta 150 ms; toque de 179 ms. En PC, 39 FPS.
   - Según el perfil, el 41 % del tiempo se va en `S.paso` (`motor.js:210`) y el 10 % en `radio`. Los choques se revisan por pares, O(N²),
     con 60 a 120 discos y **hasta 15 subpasos por cuadro** (`sub = ceil(dt/0.0035…)`, con dt de hasta 0,05). Cuanto más lento el cuadro,
     mayor el dt y más subpasos.
   - Además, el bucle único corre `avanzarTareas(12 o 16 ms)` **en cada cuadro** (`index.html:756`): por diseño gasta de 12 a 16 ms de reloj
     en las cuentas de fondo (`contar`). Con eso el cuadro nunca baja de 16,7 ms. Y el bucle nunca se detiene, ni siquiera en reposo.
2. **liquidos-y-solidos**: 32 FPS en el paso a paso; 5,9 ms de JS por cuadro; cuadros de hasta 100 ms.
   - El 80 % es ráster nativo: redibuja completo cada cuadro, con muchas moléculas, cada una con `save`/`globalAlpha`/arcos (`molecula`, línea 313),
     y texto ajustado con `measureText`. En PC va a 60, así que pesan el dpr 2 y la CPU.
3. **acidos-bases**: 43 FPS en el explorador; toque de 164 ms.
   - Las lupas con partículas que se mueven siempre, en un lienzo de 612×880 px reales. El bucle `loop` (línea 438) dibuja en cada cuadro
     aunque no cambie nada. Con dpr 1 sube a 58: es ráster, no JS (1,5 ms).
4. **probabilidad-dados**: 43 FPS en el explorador; con solo los cuadros activos, 36.
   - `dibTres` (línea 520) redibuja las 6 tablitas de 36 casillas (216 dados) en cada cuadro, con `save`/`restore` por dado
     (el 6 % del perfil es `save`), aunque solo cambie el resaltado.
5. **gases**: 49 a 52 FPS en todas las ventanas, también en reposo.
   - El lienzo más grande del celular, **612×1120 px reales** (alto de 560 px CSS con dpr 2). El bucle no se detiene nunca y cada una de las
     70 partículas lleva un `createLinearGradient` por cuadro para su estela (`particula`, línea 332). Con dpr 1 llega a 60.

Le siguen **atomo-y-tabla** (52 FPS en el explorador) y **limitante-particulas** (55). En átomo, el 8 % del tiempo es `measureText`: `dibujarPiezas`
baja la letra de 0,5 en 0,5 px, midiendo cada vez y cambiando `ctx.font`, en cada cuadro. El mismo patrón está en `balance-reacciones` y `mol-composicion`.
Problemas comunes a casi todas: `colores()` llama ~20 veces a `getComputedStyle(...).getPropertyValue` **en cada dibujo** (47 escenas).
Ocho escenas tienen un bucle de rAF que no para en reposo: acidos-bases, celda-galvanica, cinetica, circuitos-cc, equilibrio-quimico,
gases, liquidos-y-solidos y soluciones. Son justo las del toque más lento (148 a 179 ms), porque el toque espera a que termine un cuadro ocupado.
A eso se suma `E.compactar(false)` al responder, que redimensiona el lienzo (vuelve a reservar el mapa de bits).

## Propuestas concretas y chicas (en orden de rendimiento)

1. **Limitar el dpr a 1,5 en el celular** (por ejemplo, `Celular.dpr()` en `nucleo/celular.js`, que devuelva `Math.min(devicePixelRatio, 1.5)`,
   o 2 en pantallas grandes) y usarlo en el `crearLienzo` de cada escena. Es un cambio de una línea por escena y arregla de un golpe gases,
   ácidos, átomo y probabilidad (medido: de 42–51 a 58–60 FPS con dpr 1; con 1,5 debería quedar cerca). Con 1,5 el texto sigue nítido en 360 px.
2. **Cinética: sacar las cuentas de fondo del cuadro y acotar los subpasos.** Bajar `avanzarTareas` a ~3 ms, o pasarlo a `requestIdleCallback`
   o a `setTimeout` entre cuadros. Limitar `sub` a ~4 por cuadro y usar una grilla para los choques, o precalcular en el motor los conteos de
   `contar` (son con semilla). Apunta a pasar de 19 a 30 FPS y de 32 a menos de 12 ms de JS por cuadro.
3. **Primer pintado de /app/ sin esperar a `pruebas.json`.** Hoy son 8,7 s en blanco por 3G. Pintar con el catálogo y cargar el banco de pruebas
   después (ya es opcional en el código). Poner `defer` a los scripts y cargar `lectura.js`, `prueba.js` y `practica.js` solo al entrar a su ruta.
   Gana ~2,4 s (119 KB) más el JS que sobra. A eso se suma reducir `catalogo.json` (113 KB: separar lo que el inicio no usa).
4. **Que la precarga y las visitas no gasten datos de más.** En el hosting (la3): gzip o brotli (de 8,2 a 2,6 MB) y ETag o `Last-Modified`
   para que la revalidación sea un 304. En `sw.js`: al instalar una `VERSION` nueva, copiar de la caché anterior lo que ya estaba y bajar solo
   lo nuevo. Las escenas ya se renuevan solas por stale-while-revalidate. Hoy cada subida de versión (14 en esta sesión) cuesta 7,6 MB por celular.
5. **Bucles que se duermen y dibujo más barato por cuadro.** En las ocho escenas con rAF perpetuo, no dibujar si nada se mueve, o bajar a
   30 FPS en reposo, como ya hacen mol-composicion y átomo con `pedir()`. Guardar `colores()` en una variable y renovarla solo al cambiar el tema.
   Memorizar el tamaño de letra de `dibujarPiezas` (una medida y regla de tres, en vez del bucle de 0,5 px). En probabilidad con dados, dibujar las
   tablitas una vez en un lienzo fuera de pantalla y en cada cuadro pintar solo el resaltado.

Arreglos sueltos de un minuto: agregar `/nucleo/elementos.js` a `CASCARA` (o a los `archivos` de materia-energia), y quitar Google Fonts
de `optica-lente-delgada` (usar la letra del sistema, como las otras 57).

## Tabla completa: celular (360×740, dpr 2, CPU ×6), 54 escenas

FPS = el de los cuadros en que la escena dibujó. «Peor» es la peor de las ventanas (reposo, paso a paso, explorador). Toque = el mayor de los
dos toques medidos (paso a paso y explorador). Lienzo = el tamaño del mapa de bits del primer lienzo visible.

| Escena | Carga (ms) | Lienzo (px reales) | FPS paso a paso | FPS explorador | FPS peor | JS/cuadro máx (ms) | Peor cuadro (ms) | Toque (ms) | Marca |
|---|---:|---|---:|---:|---:|---:|---:|---:|---|
| cinetica | 1330 | 612x876 | 30.2 | 19.2 | 19.2 | 32.2 | 133 | 179 | < 30 FPS |
| liquidos-y-solidos | 662 | 612x552 | 31.6 | 59.4 | 31.6 | 5.88 | 100 | 107 |  |
| acidos-bases | 661 | 612x880 | 59.8 | 42.9 | 42.9 | 1.54 | 83 | 164 |  |
| probabilidad-dados | 500 | 612x340 | 58.2 | 43.1 | 43.1 | 4.12 | 50 | 92 |  |
| gases | 748 | 612x1120 | 52.1 | 52.6 | 49.4 | 1.18 | 34 | 95 |  |
| atomo-y-tabla | 557 | 612x853 | 58.5 | 52.1 | 52.1 | 5.07 | 100 | 136 |  |
| limitante-particulas | 483 | 612x1120 | 60.2 | 55.1 | 55.1 | 2.46 | 33 | 76 |  |
| balance-reacciones | 637 | 612x804 | 58.4 | 60.2 | 58.4 | 3.94 | 67 | 126 |  |
| mruv | 469 | 612x1000 | 60.1 | 58.6 | 58.6 | 3.16 | 33 | 76 |  |
| polinomios | 426 | 612x320 | 58.7 | 60 | 58.7 | 1.43 | 67 | 69 |  |
| interes | 452 | 628x440 | 60 | 58.8 | 58.8 | 3.08 | 33 | 97 |  |
| orden-informacion | 479 | 628x488 | 58.9 | 58.9 | 58.9 | 1.41 | 50 | 102 |  |
| energia | 482 | 612x880 | 60.2 | 59.1 | 59.1 | 3.98 | 33 | 98 |  |
| caso-ambiguo | 468 | 612x494 | 59.2 | 60 | 59.2 | 2.11 | 33 | 136 |  |
| regla-de-tres | 487 | 628x440 | 59.2 | 60 | 59.2 | 1.82 | 34 | 87 |  |
| mol-composicion | 603 | 612x926 | 59.3 | 59.7 | 59.3 | 11 | 67 | 79 |  |
| grafica-perillas | 499 | 612x612 | 59.6 | 59.3 | 59.3 | 2.19 | 33 | 108 |  |
| enlace | 392 | 612x354 | 60.2 | 59.3 | 59.3 | 1.67 | 33 | 109 |  |
| calorimetria | 556 | 612x880 | 60.2 | 59.4 | 59.4 | 2.37 | 33 | 88 |  |
| funciones-trig-inversas | 448 | 628x440 | 59.4 | 60 | 59.4 | 2.12 | 33 | 100 |  |
| poligonos | 488 | 628x440 | 59.4 | 60 | 59.4 | 1.49 | 33 | 85 |  |
| solidos | 543 | 612x564 | 59.5 | 60 | 59.5 | 2.47 | 33 | 207 |  |
| equilibrio-quimico | 545 | 612x1288 | 59.8 | 59.5 | 59.5 | 1.85 | 50 | 103 |  |
| numeracion | 477 | 612x620 | 59.5 | 60 | 59.5 | 1.74 | 33 | 110 |  |
| circuitos-cc | 533 | 612x410 | 60 | 59.6 | 59.6 | 2.94 | 33 | 153 |  |
| maximos-minimos | 479 | 628x480 | 59.6 | 60 | 59.6 | 1.73 | 33 | 84 |  |
| identidades-trig | 497 | 612x620 | 60 | 59.6 | 59.6 | 0.65 | 33 | 92 |  |
| celda-galvanica | 686 | 612x960 | 59.7 | 60 | 59.7 | 1.71 | 33 | 148 |  |
| relojes-calendarios | 489 | 628x480 | 60 | 59.8 | 59.8 | 1.97 | 33 | 104 |  |
| materia-energia | 484 | 612x600 | 60 | 60 | 60 | 5.8 | 33 | 120 |  |
| estatica | 382 | 612x660 | 60 | 60 | 60 | 2.09 | 17 | 123 |  |
| choques | 515 | 612x680 | 60.1 | 60 | 60 | 1.76 | 17 | 119 |  |
| circunferencia-trig | 432 | 628x480 | 60 | 60 | 60 | 1.76 | 17 | 86 |  |
| sucesiones | 538 | 628x440 | 60 | 60 | 60 | 1.72 | 17 | 123 |  |
| electrostatica | 506 | 628x440 | 60 | 60 | 60 | 1.52 | 33 | 105 |  |
| cinta-radio | 473 | 612x612 | 60 | 60 | 60 | 1.5 | 17 | 89 |  |
| cuadrado-crece | 566 | 612x340 | 60 | 60 | 60 | 1.37 | 17 | 79 |  |
| dinamica | 392 | 612x640 | 60 | 60 | 60 | 1.26 | 17 | 59 |  |
| exponenciales-logaritmos | 488 | 612x440 | 60 | 60 | 60 | 1.25 | 17 | 93 |  |
| tiro-parabolico | 443 | 612x460 | 60 | 60 | 60 | 1.15 | 17 | 90 |  |
| triangulo-estira | 430 | 612x500 | 60 | 60.1 | 60 | 1.12 | 17 | 44 |  |
| congruencia | 428 | 628x480 | 60 | 60 | 60 | 1.09 | 17 | 105 |  |
| ampliadora | 530 | 612x600 | 60 | 60 | 60 | 1.08 | 17 | 52 |  |
| angulo-inscrito | 490 | 612x612 | 60 | 60.1 | 60 | 1.07 | 17 | 88 |  |
| fluidos | 481 | 612x660 | 60 | 60 | 60 | 1.03 | 17 | 119 |  |
| geometria-analitica | 391 | 628x440 | 60 | 60 | 60 | 0.95 | 17 | 119 |  |
| vectores | 406 | 612x472 | 60 | 60 | 60 | 0.85 | 17 | 78 |  |
| soluciones | 603 | 612x1080 | 60 | 60 | 60 | 0.69 | 17 | 148 |  |
| fracciones | 404 | 628x440 | 60 | 60.1 | 60 | 0.68 | 17 | 100 |  |
| traductor-enunciados | 528 | 612x660 | 60 | 60 | 60 | 0.68 | 17 | 94 |  |
| optica-espejo-esferico | 415 | 612x520 | 60.1 | 60.1 | 60.1 | 0 | 17 | 98 |  |
| segmentos-angulos | 415 | 628x400 | 60.3 | 60.1 | 60.1 | 0 | 17 | 81 |  |
| divisores | 451 | 628x480 | 60.2 | 60.2 | 60.2 | 0 | 17 | 139 |  |
| optica-lente-delgada | 1092 | 612x480 | 60.2 | 60.6 | 60.2 | 0 | 17 | 64 |  |

## Tabla: PC de laboratorio (1366×768, dpr 1, CPU ×4), 54 escenas

| Escena | Carga (ms) | FPS peor | JS/cuadro máx (ms) | Toque (ms) |
|---|---:|---:|---:|---:|
| cinetica | 677 | 39.4 | 18.5 | 79 |
| polinomios | 249 | 59.6 | 1.74 | 63 |
| atomo-y-tabla | 296 | 59.7 | 3.59 | 103 |
| liquidos-y-solidos | 363 | 59.8 | 3.26 | 86 |
| probabilidad-dados | 360 | 59.9 | 2.65 | 72 |
| mruv | 352 | 59.9 | 2.2 | 73 |
| energia | 341 | 60 | 2.77 | 77 |
| balance-reacciones | 376 | 60 | 2.58 | 66 |
| circuitos-cc | 336 | 60 | 2.25 | 44 |
| interes | 323 | 60 | 2.02 | 53 |
| solidos | 355 | 60 | 1.71 | 119 |
| limitante-particulas | 304 | 60 | 1.57 | 109 |
| grafica-perillas | 333 | 60 | 1.49 | 33 |
| calorimetria | 275 | 60 | 1.32 | 60 |
| sucesiones | 314 | 60 | 1.32 | 54 |
| circunferencia-trig | 348 | 60 | 1.28 | 28 |
| maximos-minimos | 299 | 60 | 1.22 | 85 |
| equilibrio-quimico | 353 | 60 | 1.21 | 80 |
| regla-de-tres | 279 | 60 | 1.19 | 33 |
| enlace | 256 | 60 | 1.18 | 52 |
| relojes-calendarios | 279 | 60 | 1.17 | 70 |
| estatica | 263 | 60 | 1.13 | 91 |
| funciones-trig-inversas | 299 | 60 | 1.13 | 49 |
| celda-galvanica | 320 | 60 | 1.06 | 45 |
| cinta-radio | 272 | 60 | 1.06 | 56 |
| numeracion | 340 | 60 | 1.04 | 68 |
| cuadrado-crece | 349 | 60 | 1.03 | 48 |
| caso-ambiguo | 283 | 60 | 1 | 51 |
| poligonos | 284 | 60 | 0.99 | 41 |
| tiro-parabolico | 284 | 60 | 0.93 | 41 |
| electrostatica | 331 | 60 | 0.9 | 69 |
| materia-energia | 284 | 60 | 0.9 | 52 |
| choques | 288 | 60 | 0.87 | 43 |
| acidos-bases | 345 | 60 | 0.86 | 63 |
| fluidos | 268 | 60 | 0.86 | 68 |
| dinamica | 261 | 60 | 0.85 | 55 |
| exponenciales-logaritmos | 304 | 60 | 0.84 | 37 |
| orden-informacion | 313 | 60 | 0.79 | 68 |
| congruencia | 307 | 60 | 0.76 | 71 |
| gases | 379 | 60 | 0.7 | 46 |
| geometria-analitica | 276 | 60 | 0.69 | 65 |
| ampliadora | 253 | 60 | 0.61 | 37 |
| vectores | 264 | 60 | 0.61 | 44 |
| angulo-inscrito | 279 | 60 | 0.59 | 39 |
| triangulo-estira | 284 | 60 | 0.59 | 34 |
| fracciones | 261 | 60 | 0.47 | 49 |
| identidades-trig | 302 | 60 | 0.47 | 40 |
| soluciones | 363 | 60 | 0.41 | 34 |
| traductor-enunciados | 284 | 60 | 0.41 | 60 |
| mol-composicion | 352 | 60 | 0 | 81 |
| segmentos-angulos | 311 | 60 | 0 | 37 |
| optica-espejo-esferico | 267 | 60.1 | 0 | 31 |
| optica-lente-delgada | 994 | 60.1 | 0 | 16 |
| divisores | 287 | 60.3 | 0 | 45 |

Ninguna escena pasa de 3 s de carga, en ningún perfil, si la sirve el SW. Por 3G en frío, sin SW, la lente (5,4 s de load), identidades-trig y cinética pasan de 3 s.
