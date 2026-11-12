# Rutina rm-procesos: reporte

La rama `rutina/rm-procesos` sale de `claude/awesome-wozniak-5etl1n` y se le hizo merge de la principal el 12 nov 2026. Cubre razonamiento matemático, todas las familias menos las espaciales. Trabajo del 8 nov 2026, con una pausa por límite de uso, y del 12 nov 2026.

Se respetó la regla 5: el CSV y las trampas fueron solo un mapa. Ningún enunciado, número, figura ni solución sale de un libro o de un examen.

Cada generador pasó por las mismas cuatro manos:
1. **Constructor:** un subagente lo arma.
2. **Verificador ciego:** otro subagente recalcula sin ver el generador, solo con el enunciado y la descripción de la figura.
3. **Revisor de contenido:** relee los problemas como alumno y profesor.
4. **Correcciones:** se aplican con decisiones ya tomadas, y los casos que cambian se vuelven a verificar a ciegas.

## Qué se construyó

### 16 generadores de formato «predicciones», un commit cada uno

| Generador | Qué genera | Casos (verif. ciega) | Papel | Unidades |
| --- | --- | --- | --- | --- |
| `rm-trasvases` | Recipientes sin marcas (2, 3 o 4), estado por estado; barriles por divisibilidad | 22/22 | 8 | juegos-recreativos, traslados |
| `rm-movimientos` | Mínimo de movimientos por BFS: canoa (cupo o peso, quién rema), caballo, saltos, tubo con bocas, fichas de a dos | 27/27 | 8 | juegos-recreativos, traslados |
| `rm-diagramas-flujo` | Diagramas de flujo dibujados (bucles, contadores, primos, descuentos, cifras) y operadores | 20/20 | 9 | **diagramas-de-flujo (nueva)** |
| `rm-ciclos` | Ciclos con desfase, pista con marcas, fichas que coinciden, bloques de cifras, cifra de las unidades, series de figuras, espiral, avance y retroceso | 22/22 | 10 | frecuencia-de-sucesos, inductivo |
| `rm-certezas` | Peor caso: colores, pares, divisibilidad, sumas, consecutivos, palomar, llaves, cajas mal rotuladas (16 tipos) | 50/50 | 9 | certezas |
| `rm-cortes` | Cortes con apilado (con o sin tope de capas), cartulinas con piezas pedidas, tramos en progresión, estacas, esquinas | 26/26 | 8 | cortes-y-pesadas |
| `rm-balanzas` | Balanzas en desequilibrio con enteros, sustitución, mínimo de pesas, una pesada con los dos platillos | 24/24 | 7 | cortes-y-pesadas |
| `rm-rumbos` | Rumbos «N 37° E» con notables: distancia, regreso, dos móviles, rapidez, canchas, posición relativa | 22/22 | 8 | traslados |
| `rm-lectura-palabras` | Lecturas de una palabra en triángulo, rombo, palíndromo, cuadrícula, bloques y con casilla tapada (Pascal) | 24/24 | 7 | rutas-y-visualizacion |
| `rm-relojes` | Qué hora es, turnos, fracción del año, adelantos (MCM, creciente), mejor día de inicio, mentirosos de la semana | 42/42 | 9 | cronometria-y-calendarios |
| `rm-planteo` | Lotes, promociones y canjes, votos, progresión, pista circular, diana, torneo, fichas de dos caras, cortes y vértices | 29/29 | 10 | planteo, máximos, tablas |
| `rm-diofanticas` | Compras con gasto fijo, palitos, monedas, grupos, tres precios, dardos, alcanza/no alcanza, reparto, borrar cifras, expresión de mayor valor | 27/27 | 10 | máximos, planteo |
| `rm-parentesco` | Cadenas sobre un árbol, quién es (árbol dibujado), mínimo de personas, órdenes por sumas, sobres, edades | 18/18 | 8 | deductivo, ordenamiento |
| `rm-arreglos` | Mágico multiplicativo, vértices, pirámide, fila de vecinos, latino, filas crecientes, paridad, asientos | 22/22 | 9 | arreglos-numericos |
| `rm-fichas` | Semejanza con k² fichas, contorno, puntos medios, menor rectángulo, perímetro máximo, caja, tablero con tapadas, Fibonacci, malla | 26/26 | 10 | transformaciones, máximos, inductivo |
| `rm-deduccion` | Silogismos (Venn), «qué es siempre cierto», asignación con condicionales y contrafácticos | 15/15 | 8 | deductivo, certezas |

Detalles comunes a los 16:
- Cada generador trae `generador.test.js`: corre las pruebas comunes en 600 semillas y recalcula la respuesta por otro camino (fuerza bruta, BFS, simulación o enumeración). Suma pruebas de propiedades: que el mínimo es mínimo, que el peor caso falla con uno menos y que la solución es única.
- Las semillas de entrada y salida son paralelas por tipo.
- Los títulos no regalan la respuesta.
- Todo distractor sale de un error con nombre.
- El revisor encontró ocho hallazgos graves, todos corregidos:
  - el contrafáctico ambiguo en deducción;
  - una afirmación falsa en la solución de trasvases;
  - el reparto con dos respuestas en diofánticas;
  - la figura de la pista en planteo;
  - el alt de lecturas, que decía «filas centradas»;
  - el dicho en primera persona con la respuesta «ella misma» en parentesco;
  - el «exactamente» que contradecía la solución en parentesco;
  - el distractor del bisiesto en relojes.

### Unidad nueva en el catálogo

`razonamiento-matematico.diagramas-de-flujo`, «Diagramas de flujo y operadores». El temario CEPRE no la trae; sale de la admisión real. Va con `unmsm.temas: [1]` porque el campo es obligatorio. Revísalo si prefieres otro tema.

### Códigos de error

Están en `docs/investigacion/codigos-rm-procesos.md`, un archivo propio para no chocar con las otras rutinas:
- **RMP1 y RMP2,** compartidos: puntos contra intervalos, y quedarse con la primera solución.
- **RMP10 a RMP86,** por bloques de generadores. Todos son hipótesis.
- **Códigos del informe:** se usan RM6, AR1, AR5, AR7, AR13, AR17, AR18 y RM2, con el respaldo que les da el informe. En la duda se bajó un escalón: varios AR18, AR11 y RM2 «lineal» que no eran ese error pasaron a códigos propios.

## Cobertura de mis familias en `docs/datos/admision-unmsm.csv`

«Antes» es el estado del CSV al empezar (commit e17b44f); «ahora», el de la rama. Solo se tocaron las columnas `cobertura` y `modulo`, en filas de razonamiento matemático y de mis familias. No regeneré `docs/datos/admision-unmsm-tablas.md`.

| Familia | Preguntas | «si» antes | «si» ahora | Siguen sin «si» |
| --- | --- | --- | --- | --- |
| Planteo y otros | 41 | 17 | 40 | 1 |
| Certezas | 31 | 10 | 29 | 2 |
| Traslados de fichas y juegos | 24 | 3 | 16 | 8 |
| Rumbos y desplazamientos | 16 | 1 | 14 | 2 |
| Lectura de palabras en arreglos | 14 | 0 | 12 | 2 |
| Trasvases | 13 | 0 | 13 | 0 |
| Diagramas de flujo | 12 | 0 | 10 | 2 |
| Máximos y mínimos | 19 | 8 | 18 | 1 |
| Cortes y estacas | 20 | 9 | 18 | 2 |
| Relojes | 40 | 30 | 38 | 2 |
| Inducción y series | 21 | 13 | 21 | 0 |
| Arreglos numéricos | 28 | 21 | 28 | 0 |
| Frecuencia de sucesos | 18 | 12 | 18 | 0 |
| Ordenamiento y parentesco | 26 | 20 | 26 | 0 |
| Balanzas y pesadas | 31 | 25 | 30 | 1 |
| Cuadro de doble entrada | 20 | 17 | 19 | 1 |
| Calendarios | 27 | 25 | 27 | 0 |
| Situaciones deportivas | 22 | 20 | 22 | 0 |
| Verdades y mentiras | 26 | 25 | 25 | 1 |
| **Total** | **449** | **256** | **424** | **25** |

De 193 preguntas sin «si» se pasó a 25: el 94 % de las familias queda en «si».

## Cambios en núcleos compartidos (mínimos y compatibles)

- **`app/practica.js` y `app/estilos.css`:** un problema generado puede traer `figura` y `figuraSolucion` (`{ svg, alt }`). La app las muestra antes de la pregunta y después de la solución. El SVG escala al ancho y llega hasta el 75 % de la pantalla de alto. Los generadores que ya existían no cambian. Hay que subir `VERSION` en `app/sw.js` al integrar.
- **`nucleo/predicciones.js`:** `P.xml(texto)` escapa los textos que van dentro de la figura. Tiene su prueba.
- **`nucleo/probar-generador.js`:** si hay figura, comprueba que traiga `<svg viewBox>` y un alt de más de 10 caracteres, y que no tenga código (`script`, `on…=`, `foreignObject`) ni colores fijos. Los colores van con `var(--c-*)` y `currentColor`, así sirven en claro y en oscuro.

## Comprobado

- `npm test`: 5788 en verde el 12 nov 2026, con el catálogo regenerado solo para correr las pruebas. No subí `app/datos/catalogo.json`, como se pidió, así que en la rama tal cual falla una sola prueba, «catalogo.json está al día». Al integrar, corre `npm run catalogo` y sube `VERSION`.
- `herramientas/alternativas.test.js` en verde: la correcta no se delata por largo ni por letra.
- Playwright pasa práctica y entrada de los 16 generadores a 390×844 en oscuro y a 1366×768 en claro. No hay errores de consola ni desbordes, y la cabecera no trae la respuesta.
- `pasada-pegatina.py` no tiene nada que cambiar; los generadores no tienen `index.html`.

## Lo que queda: 25 preguntas en «medio»

| Pregunta | Tema | Por qué |
| --- | --- | --- |
| 2024-I a#26, 2025-II d-e#21 | Tubo con tres o varias bocas | Sin la figura original no se sabe qué hace la boca del medio; hay tubos de una y dos bocas |
| 2026-I d-e#22, 2026-I a#28 | Latas que se derriban | Modelo de qué cae con cada golpe; no se construyó |
| 2025-I a#30 | Áreas por traslado de regiones | Es geométrica: va mejor con `ampliadora` o con la rutina espacial |
| 2025-II med#25 | Conteo de fichas congruentes con giros | Es de conteo de figuras (rutina espacial) |
| 2025-I med#23 | Fichas de 5 cuadraditos en un tablero | `rm-fichas` hace las de 3; la búsqueda sirve igual |
| 2023-I 10-15#25 | Caras opuestas de fichas a partir de lanzamientos | Daba enunciados ambiguos; solo está la variante de sumas posibles |
| 2021-09-04#25 | Empaquetamiento de círculos | No se intentó |
| 2021-09-04#23 | Longitud de piezas de una cometa | No se intentó |
| 2020-I 09-14#39 | Rumbos con varios tramos por móvil | `rm-rumbos` da un tramo por móvil |
| 2024-I b-c#25 | Rumbos: dirección final vista desde el inicio | Sale solo como distractor del «regreso» |
| 2024-I b-c#28, 2025-II med#29 | Lectura común; ida y vuelta dentro de una lectura | Cubierto a medias en el palíndromo |
| 2023-I 12-10#29, 2026-I d-e#24 | Diagrama con suma de lo impreso; con potencias | Repartido entre tipos, sin uno propio |
| 2019-II 10#30, 2024-II b-c#18 | Hora con retraso; relación de cifras entre horas | Sin tipo propio |
| 2023-I 12-10#28 | Certezas: distinto color con suma dada | Falta la condición de color |
| 2024-II b-c#21 | Palomar: «mínimo adicional» | Se pregunta el total |
| 2025-II med#30 | Cajas mal rotuladas: cuántas abrir | Solo de cuál sacar y qué contiene |
| 2024-II med#23 | Sierra de largo limitado con triángulos | Otro modelo de corte |
| 2027-I a-salud#25 | Rejilla de alambre | No salió limpio |
| 2024-I d-e#20 | Balanzas: peso combinado | Se pregunta el peso de una figura |
| 2019-II 03-09#17 | Cuadro de dados de colores con pistas | Faltan distractores limpios |

### Pendientes menores conocidos

- En `rm-planteo`, `AR17-partidos` nunca sale: el filtro lo descarta siempre.
- En `rm-arreglos`, `RMP66-mitad` sale dos veces en paridad, una redondeando hacia abajo y otra hacia arriba, con ids distintos.
- En `rm-fichas`, la forma «L» del contorno nunca sale, porque tiene el mismo perímetro que el rectángulo que la encierra.
- Los colores de variable son los 4 de la app (`o`, `i`, `h`, `d`); no hay colores nuevos para `docs/diseno.md`.
- Falta tocar `CLAUDE.md`, `docs/pendientes.md` y la hoja de ruta: lo hace la integración.
