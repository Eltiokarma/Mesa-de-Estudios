# Rutina rm-espacial: razonamiento matemático visual y espacial

Rama `rutina/rm-espacial`, del 8 al 12 de noviembre de 2026, con una pausa por límite de uso del 8 al 12. La rama ya trae fusionada la principal del 12 nov.

## Resultado

Las nueve familias visuales y espaciales de razonamiento matemático de `docs/datos/admision-unmsm.csv` quedan cubiertas al 100 %.

| Familia | Antes, sin «si» | Después, sin «si» | Módulo nuevo |
| --- | --- | --- | --- |
| Cubos, sólidos y vistas | 26 | 0 | vistas-cubitos (14), cubitos-pintados (11), dados-domino (1) |
| Dados y dominó | 15 | 0 | dados-domino |
| Rutas y caminos mínimos | 18 | 0 | rutas-espacio |
| Rodamientos, ruedas y poleas | 20 | 0 | rodamientos (10), poleas-giros (6), dados-domino (4, dado que rueda) |
| Simetrías y giros | 10 | 0 | rodamientos (7), papel-doblado (3) |
| Perímetros, áreas y particiones | 7 | 0 | cuadricula-piezas |
| Papel doblado y cortado | 6 | 0 | papel-doblado |
| Conteo de figuras | 4 | 0 | cuadricula-piezas |
| Trazos de un solo golpe | 1 | 0 | rutas-espacio |
| **Total** | **107** | **0** | |

Solo cambié en el CSV las columnas `cobertura` y `modulo` de esas 107 filas. Las demás familias de RM no las toqué: son de rm-procesos. `docs/datos/admision-unmsm-tablas.md` y `docs/clasificacion-unmsm-admision.md` no se regeneraron; eso queda para la integración.

## Qué se construyó

Siete escenas. Cada una tiene motor, casos verificados a ciegas por un subagente aparte, revisión de contenido con las correcciones aplicadas, 10 problemas de papel, la pegatina y una prueba con Playwright a 390 y 1366 px, en claro y oscuro, que comprueba que la cabecera y el dibujo no revelan la respuesta. Todas están en estado borrador, versión 0.1.0.

- **vistas-cubitos**, «Los cubitos que giran: vistas y huecos»: sólido de cubitos en 3D con sus tres vistas. Cubre el volumen máximo y mínimo, las caras y los vértices (también con vistas acotadas o inclinadas), las caras pintadas al sumergirlo, elegir la vista de un isométrico, completar el cubo, la caja transparente, las copias que forman un cubo y los sólidos que tapan al anterior.
- **cubitos-pintados**, «El cubo que se pinta y se perfora»: cubitos con k caras pintadas (con mesa, pared o rincón), el total de caras, túneles, barras, el área de escaleras y pirámides en un término lejano, la disección con apilado y el mayor cubo con dos tamaños.
- **dados-domino**: dado 3D con sus caras ocultas en torres, filas y una L contra la pared con condiciones; el dado que rueda y en circuito; el cubo marcado; el dado espejo; el dominó (suma prima, cadenas); la deducción de puntajes.
- **rodamientos**, «La rueda, el camino y la lámina que gira»: el centro de una rueda por esquinas, escalones, rampas, arcos, lomas y por dentro de un marco; los toques del punto pintado; los vuelcos sobre una recta o sobre otro polígono; la arista de un prisma y la de un cubo; las regiones barridas; las láminas superpuestas; el giro en el plano; los giros en un marco.
- **rutas-espacio**, «La hormiga en el alambre»: alambres 3D con direcciones permitidas, rutas sin repetir punto o tramo, rutas hamiltonianas, rutas por tramos, la franja por inducción, los cilindros desarrollados (varias vueltas, por dentro, con tapa, latas tangentes) y el recorrido máximo.
- **papel-doblado**, «La hoja que se dobla, se corta y se voltea»: desdoblar, el perímetro al abrir, las piezas que quedan, el rectángulo con vértices opuestos que se juntan, la loseta reflejada en un vértice, y las cartas y vasos que se voltean (búsqueda en anchura y paridad).
- **cuadricula-piezas**, «El tablero que se parte en piezas»: piezas congruentes de perímetro máximo, parcelas, el rectángulo rearmado como cuadrado, el enchape de una escalera, semicircunferencias, puntos medios, las ubicaciones de una pieza, las casillas de borde, los triángulos con puntos y los cuadrados sin sombra.

Cuatro generadores de formato «predicciones», también con casos verificados a ciegas y recalculados aparte en 600 semillas:

- **poleas-giros**: sentido de giro en una cadena, poleas solidarias con bloques y coincidencias de marcas.
- **rutas-tramos**: redes por tramos con paso obligado o prohibido, y cuadrículas con un cruce cerrado.
- **cubitos-conteo**: caras pintadas, túneles, completar el cubo, ladrillos y área de escaleras.
- **dados-caras**: torres y filas de dados, contactos, producto y dominó.

En el catálogo, las once quedaron en las unidades `rutas-y-visualizacion-espacial`, `transformaciones-de-figuras`, `trazos-y-perimetros`, `juegos-recreativos` y `ruedas-poleas-engranajes`.

El informe de errores es `docs/investigacion/razonamiento-espacial-ideas-erroneas.md`. Todos sus códigos son hipótesis: RME1–45 de partida, y RME100–202 abiertos por las escenas y los generadores. Uso el prefijo RME para no chocar con los RM7 en adelante que pueda abrir rm-procesos. RME110, RME115 y RME145b no se usan.

## Cambios en núcleos compartidos

Ninguno. No toqué `nucleo/`, `app/` ni `herramientas/`. No subí `VERSION` y no hice commit de `app/datos/catalogo.json`: lo regeneré solo para correr las pruebas.

Aviso: `herramientas/pasada-celular.py` ignora el argumento y recorre todas las escenas. Con varias rutinas en paralelo conviene que acepte ids.

## Estado de las pruebas

`npm test` da 6658 de 6658 en verde, después de fusionar la principal y con `npm run catalogo` corrido en local.

## Lo que queda

- Integración:
  - correr `npm run catalogo`, subir `VERSION` y agregar los colores de las siete escenas a `docs/diseno.md`;
  - actualizar `docs/pendientes.md`, `CLAUDE.md` y la hoja de ruta;
  - regenerar las tablas de la clasificación de admisión;
  - rebalancear `catalogo/pruebas/razonamiento-matematico.json` si la prueba del banco lo exige: hasta ahora pasa.
- La rama tiene un commit «WIP: pausa por límite de uso» con las escenas a medias de ese momento. Los commits siguientes las terminan; si se integra con squash, no queda rastro.
- Mejoras que quedaron fuera:
  - un explorador «Vuelca tú» en rodamientos;
  - en dados-domino, cuatro tipos que solo están en papel: retirar un dado, sumas cuadrado o cubo, puntajes impares y fichas de pie;
  - con n = 7, los cubitos de cubitos-pintados salen chicos en el celular;
  - en papel-doblado, la variante «coseno del ángulo del doblez» (2024-I).
- Las hipótesis RME se confirman con los datos del colegio.
