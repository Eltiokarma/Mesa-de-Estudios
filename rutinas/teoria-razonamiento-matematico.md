# Reporte: teoría de razonamiento matemático (14 nov 2026)

Sesión paralela del encargo `rutinas/encargos/teoria-razonamiento-matematico.md`. Rama `teoria/razonamiento-matematico`, que sale de `claude/awesome-einstein-ch5g9a`. No se integró a `main`: la integración la hace la sesión principal.

## Unidades hechas

Son las 19 unidades del catálogo, todas de 3.º. Todas tienen `estado: 'completa'`: cada tema del catálogo está en una idea que lo enseña. En total son 66 ideas, y cada una recorre los cinco momentos.

| Unidad | Ideas | Piezas |
| --- | --- | --- |
| razonamiento-deductivo | 4: Venn, si-entonces, doble entrada, parentesco | rm-plano, rm-tablero |
| trazos-y-perimetros | 4: un trazo, recorrido mínimo, deslizar lados, arcos | rm-plano |
| ordenamiento-de-informacion | 3: lineal, mesa redonda, mesa cuadrada | rm-tablero, rm-plano |
| verdades-y-mentiras | 3: suposición, contradictorias, negación | rm-tablero |
| traslados-y-puntos-cardinales | 3: camino y flecha, torre que se muda, pasar un número | rm-plano, rm-fichas |
| arreglos-numericos | 3: suma mágica, vértices dos veces, reparto parejo | rm-tablero, rm-plano, rm-fichas |
| razonamiento-inductivo | 3: figuras que crecen, tres casos no prueban, impares y cuadrados | rm-plano, rm-tablero |
| juegos-recreativos | 3: dominó, dados, cerillas | rm-fichas, rm-plano |
| cronometria-y-calendarios | 5: agujas, adelantos, campanadas, bisiestos, día de la semana | rm-reloj, recta, rm-tablero |
| certezas | 3: peor caso, palomar, llaves | rm-fichas, rm-tablero |
| frecuencia-de-sucesos | 3: tomas, turnos con MCM, campanadas del día | recta, rm-tablero |
| ruedas-poleas-engranajes | 3: engranajes, faja, mismo eje | rm-plano |
| maximos-y-minimos | 4: mínimo de personas, precio óptimo, regiones, reflejo | rm-fichas, ejes, rm-plano |
| cortes-y-pesadas | 4: cortes, sustitución, pesas en dos platillos, mínimo de pesadas | rm-plano, balanza, rm-fichas |
| planteo-de-ecuaciones | 4: traducir, edades, cuadrática con contexto, cabezas y patas | rm-plano, rm-fichas |
| transformaciones-de-figuras | 4: isometrías, semejanza, rodamiento, área barrida | rm-plano |
| rutas-y-visualizacion-espacial | 3: rutas en el plano, rutas por aristas, vistas | rm-tablero, rm-plano |
| tablas-graficos-y-suficiencia | 3: escala del eje, puntos de una liga, suficiencia | rm-plano, rm-tablero |
| diagramas-de-flujo | 3: tabla de estados, contador y acumulador, operadores | rm-tablero |

Verificación:
- `node --test contenido/teoria/teoria.test.js`: 22 de 22 en verde, con 60 semillas por idea.
- `npm test` completo: 8221 de 8221 en verde.
- Cada unidad se recorrió en Playwright a 360 × 780, en los cinco momentos de cada idea, y se miró la tira de figuras. Las correcciones que salieron de esas capturas están en los commits.
- Se revisó una unidad en tema oscuro (ruedas) y otra en grises (relojes).

## Piezas nuevas del kit (`nucleo/kit/piezas/`)

Cada pieza trae su `.test.js`, es una función pura y tiene su afirmación escrita en el encabezado. Solo usa los tokens `o`, `i`, `h` y `d`; `--c-f` no está definido en `app/estilos.css`.

- **rm-tablero.** Cuadrícula de casillas con cabeceras, marcas ✓ y ✗, marcos de color y notas. Una casilla `null` no se dibuja. *Afirmación:* cada casilla es una combinación posible; una marca la descarta o la confirma.
- **rm-plano.** Lienzo con una sola escala: nodos y aristas, segmentos con flecha, polígonos, círculos, ruedas dentadas con su giro, cuadrícula y flecha del norte. *Afirmación:* lo que decide el problema son las uniones y las posiciones, dibujadas donde el dato dice.
- **rm-reloj.** Una o dos esferas. El horario avanza 0,5° por minuto. Dibuja el arco del ángulo menor y un horario fantasma para el error de dejarlo fijo. *Afirmación:* el horario nunca se queda quieto sobre la hora.
- **rm-fichas.** Filas de fichas: círculos y cuadrados con letra, dominó con puntos, dado y cerilla. Cada ficha puede ir hueca, tachada o resaltada. *Afirmación:* cada ficha es un objeto que se puede contar.

## Pedidos al molde (no se tocó `app/` ni `nucleo/teoria.js`)

1. **Error en la ruta de la idea.** En `app/teoria.js` (función `vista`), la línea `const [, , , sub] = location.hash.split('/')` toma el segmento 3, que siempre es `teoria`. Por eso `#/unidad/<id>/teoria/<idea>` y `…/teoria/ficha` no abren la idea pedida, sino la primera sin terminar.
   - Afecta al botón «Siguiente idea», a la ficha de repaso y a los chips de las ideas.
   - Arreglo propuesto: tomar el segmento 4 (`const sub = location.hash.split('/')[4]`).
   - Mi recorrido de Playwright lo esquivó marcando como hechas las ideas anteriores.
2. **Las opciones de «Predice» no se barajan.** Hoy la correcta queda donde la escribe el autor. Yo varié su posición a mano. Propuesta: barajarlas con `T.barajar`, como en «Ahora tú».
3. **Ninguna pieza dibuja arcos.** Los arcos (semicírculos, sectores) se aproximaron con polilíneas de `rm-plano`. Si otros cursos los piden, conviene agregar `arcos` a una pieza.

## Códigos de error nuevos (hipótesis, sin datos de alumnos)

Prefijo `RMT-<tema>-<n>`. Cada uno está en la opción que lo usa, con su `siFuera`. Por grupo:

| Grupo | Tema | Códigos |
| --- | --- | --- |
| DED | deducción | 14 |
| TRA | trazos | 18 |
| ORD | orden | 10 |
| VYM | verdades y mentiras | 7 |
| TRS | traslados | 9 |
| ARR | arreglos | 10 |
| IND | inducción | 11 |
| REC | recreativos | 14 |
| REL | relojes | 14 |
| CER | certezas | 8 |
| FRE | frecuencia | 9 |
| RUE | ruedas | 3 |
| MAX | máximos | 16 |
| COR | cortes | 12 |
| PLA | planteo | 10 |
| TRF | transformaciones | 9 |
| RUT | rutas | 8 |
| TAB | tablas | 10 |
| FLU | flujo | 10 |

Ejemplos:
- RMT-DED-1: tomar un dibujo posible como conclusión necesaria.
- RMT-DED-11: contar papeles como personas.
- RMT-TRA-10: creer que un entrante no agrega perímetro.
- RMT-REL-1: dejar el horario fijo sobre la hora.
- RMT-FLU-1: usar el valor ya actualizado.

Códigos existentes que se reusaron: RM1, RM2, RM3, RM5, RM6, RME5, RME10, RME11, RME12, RME20, RME21, RME23 a RME28, RME30, RME32, RME43 y RMP1.

## No verificado

- No hubo cálculo independiente para cada respuesta (no hay `casos.json` de teoría): las cuentas salen del mismo código que arma las opciones. Revisé a mano unos 30 casos: varias predicciones y semillas de deducción, verdades y mentiras, máximos y rutas.
- Ninguna persona ha usado la teoría. Tampoco se probó en un celular real ni con lector de pantalla.
- El contraste del texto SVG en tema oscuro se miró a ojo, no se calculó.
- La guía de personajes se leyó en su `.txt`. El dibujo de Faro es de la sesión de personajes; hoy se ve el respaldo del gato.

## Reporte de diseño

**Ficha de tarea.** Va una por unidad, como comentario al inicio de cada archivo (promesa, persona y condiciones, resultado observable, orden de atención, estados y duda que resuelve). Las cinco decisiones (cambia, permanece, progresa, se reserva, debe verse) van comentadas sobre cada idea.

**Sistema.** Se usa el que ya existe: tokens de variable, trazo del kit y escala de tiempo del lector.
- Decisión nueva: en razonamiento matemático, el turquesa marca la referencia o lo que se elige; el naranja, lo que se pide u optimiza; el verde, lo seguro o la coincidencia; el rojo, lo descartado.
- Esa convención está escrita en el encabezado de cada unidad. No se tocó `docs/diseno.md`, porque otras sesiones lo editan en paralelo. **Pendiente: la sesión principal debe copiar la convención a `docs/diseno.md`.**

**Carácter.** Acogedora, viva y precisa, que son los adjetivos del proyecto. La firma es el hilo de color: la variable lleva el mismo color en el control, la figura, la lectura y la ecuación.

**Movimientos.** No hay movimientos propios.
- Las figuras se redibujan por estado: oficio de explicación con `paso` del kit, y `.kit-aparece` y `.kit-fantasma` de `kit.css`.
- Con movimiento reducido rigen las reglas de `kit.css`.
- El color nunca es la única señal: las fichas llevan letra, las agujas tienen grosores distintos y las marcas usan ✓ y ✗.

**Verificación.**
- Topes de texto, purezas, NaN y casos distintos: por pruebas.
- Revisión visual a 360 px de las 66 ideas: se corrigieron rótulos encimados (barras, reloj, faja, engranajes), pies que se cortaban, figuras fuera del lienzo (reflejo, moneda) y textos de nota.
- Las piezas nuevas tienen un alto fijo por cada conjunto de datos, así que nada salta entre estados.

**Hipótesis.** Ver en dos dibujos posibles que la conclusión no es segura, o en la tabla de estados que el orden importa, debería bajar los errores de «una disposición es la solución». Se comprueba con los eventos `teoria` (momento `prediccion` contra `ahora-tu`) del piloto.

**Conflictos.** El skill pide que el primario no se deshabilite y que la acción no se mueva; eso depende del lector, que no se tocó. Tres pantallas de «Ahora tú» no tienen figura (verdades: negación; relojes: día de la semana; semejanza): el lector deja ahí el hueco reservado vacío.

## Lo que sigue

- La sesión principal integra: `npm run catalogo` (regenera `app/datos/catalogo.json`) y `npm test`.
- Arreglar la ruta de la idea en `app/teoria.js` (pedido 1).
- Copiar a `docs/diseno.md` la convención de colores de razonamiento matemático.
