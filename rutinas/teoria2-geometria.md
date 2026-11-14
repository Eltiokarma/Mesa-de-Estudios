# Ronda 2 de la teoría de Geometría: gesto, llaves, laboratorio y tipografía (14 nov 2026)

Rama `teoria2/geometria`. Encargo: `rutinas/encargos/teoria2-geometria.md`. Las 18 unidades pasan a 0.2.0, con un commit por unidad. Triángulos se hizo primero, como modelo. Las otras 17 las hicieron cinco subagentes en paralelo con un brief común, y la sesión principal revisó y subió cada una.

## Cifras

- **Ideas con arrastre: 76 de 87.** Hay al menos una por unidad.
- **Laboratorio:** 3 mesas por unidad (54 en total). En cada unidad, al menos una mesa es más rica que sus juegos.
- **Validador:** `problemas()` sale vacío en las 18 unidades. `npm test`: 8490 de 8490 en verde.

| Unidad | Arrastre | Mesas del laboratorio |
| --- | --- | --- |
| triangulos | 4/4 | triangulo-libre (A y C libres; elegir línea notable), bisagra-libre (los dos lados libres), bisectrices |
| segmentos-y-angulos | 5/5 | secante-y-giro (también gira la recta de arriba), punto-libre (B fuera de la recta), quiebre |
| congruencia | 4/5 | compas-lla (0, 1 o 2 triángulos), c-libre (C dentro y fuera del círculo), base-libre |
| proporcionalidad-y-semejanza | 5/5 | corte-libre (corte inclinado), bisectriz-libre, estirar (kx ≠ ky: no semejante) |
| puntos-notables | 3/3 | cuatro-centros (O, H, G e I a la vez), euler-libre (obtusángulos), seis-areas |
| relaciones-metricas | 6/6 | potencia-libre (P dentro, sobre o fuera), euclides-libre (m con signo), ptolomeo-libre (D fuera: «<») |
| poligonos-y-cuadrilateros | 4/5 | cuadrilatero-libre (cóncavo o cruzado), paralelogramo-libre, trapecio-libre |
| poligonos-regulares | 1/4 | poligono-libre (n hasta 24, P/2R → π), inscritos-con-radio, corte-libre (los dos puntos áureos) |
| circunferencia | 6/6 | dos-libres, inscrito-libre (semiinscrito), cuadrilatero-libre (D dentro, sobre o fuera) |
| longitud-y-areas-circulares | 4/5 | sector-y-segmento (α hasta 350°), corona-y-trapecio, lunulas-libres |
| areas-poligonales | 5/5 | triangulo-libre, puntos-medios-libres (cóncavo), punto-p-libre (P fuera) |
| geometria-analitica | 5/6 | reparto-libre, recta-y-punto (vertical, P sobre la recta), elipse-libre (b > a, a = b) |
| simetria | 3/3 | espejo-que-gira (eje oblicuo), dos-espejos (traslación 2d o giro 2θ), reflejo-plano |
| razonamiento-con-figuras | 2/6 | muesca-libre, rutas-con-cierre (calle cerrada), cubo-pintado (por clases) |
| geometria-del-espacio | 5/6 | sombra-libre, tres-perpendiculares-libre (AB = 0), diedro-abierto (hasta 165°) |
| poliedros | 2/3 | familias (prisma, pirámide o bipirámide; n hasta 12), vertice, cinco-regulares |
| prisma-y-piramide | 6/6 | piramide-en-prisma (cúspide oblicua, mismo volumen), tronco-libre (la base chica llega a 0 o iguala a la grande), escala |
| solidos-de-revolucion | 6/6 | cono-libre, pappus-libre (avisa si cruza el eje), zona-libre (llega al polo) |

**Ideas sin arrastre (11) y por qué:**
- **El control cuenta, y ningún punto guarda ese número:**
  - suma de ángulos de polígonos;
  - central-y-apotema y dos-n-lados (regulares);
  - área del círculo (n sectores);
  - regulares de poliedros (q);
  - perímetro de escalones;
  - conteo de triángulos.
- **El control es de opciones:**
  - inscritos-notables;
  - distancia-y-division (analítica);
  - rectas-cruzadas (espacio);
  - distribución (razonamiento).
- **Las reglas no tienen posición:** series-y-analogias.
- **El marco se ajusta a k y los vértices no se mueven en pantalla:** notables de congruencia.

En los casos de control de opciones, el radio u otro objeto sí se arrastra en el laboratorio.

## Llaves, separadores y tipografía

- **Llaves** en las reglas de las 18 unidades y en algunos pasos de «Mira». Notas de 3 palabras o menos; las revisó un script.
- **Separadores:** las relaciones que estaban pegadas con `' · '` o `'; '` en reglas y en «Mira» pasaron a la parte `'   ·   '`.
- **Exponentes:** los «²» y «³» de las ecuaciones nuevas o tocadas van con `{ sup }`. No queda ningún «^».
- **Otros arreglos:**
  - el rótulo de Menelao, que salía cortado;
  - el control «AP … de AB», que se cortaba;
  - la lectura de trapezoides, que era fija y ahora se mide;
  - la lectura del inscrito, que ahora se calcula.
- **Hallazgo 9:** cada idea lleva un comentario.
  - Cuando juego y «Mira» usan el mismo dibujo, se dice.
  - Cuando son dos representaciones a propósito, se explica por qué y qué mesa del laboratorio las junta. Ejemplos: Pitot y Poncelet; potencia con P dentro y P fuera; π con polígonos y con la rueda.

## Piezas tocadas

- **`nucleo/kit/piezas/geo-figura.js`** (de este curso): se agregaron exports, sin cambiar el dibujo, con su prueba:
  - `aPantalla(datos, p)` → la manija;
  - `aPlano(datos, pt)` → coordenadas del problema, en 2D;
  - `sobreRecta(datos, A, B, pt)` → t sobre una recta proyectada, que sirve en 3D (aristas, alturas, radios, generatrices).
- **`triangulo`** (pieza común): no se tocó.
- **Ajustes dentro de las unidades:**
  - paso de D de 20 a 10 en el cuadrilátero inscrito;
  - marco fijo en los juegos de sector y corona;
  - el control k de semejanza de sólidos pasó a c-o, el color de su regla;
  - control nuevo «girar el sólido» en poliedros.

## Pedidos al molde (no se tocó `app/` ni `nucleo/teoria.js`)

1. **El separador no se distingue fuera de la regla grande.**
   - `'   ·   '` solo separa como parte suelta y solo en la regla grande.
   - En lecturas y pasos de «Mira» sale « · », igual que un producto: «h² = 18,75 · p · q = 18,75».
   - Pedido: que `.ec-sep` se distinga también fuera de `.te-ec-grande`.
2. **El ajuste no respeta el min.** Cuenta el paso desde 0, así que un control con min 230 y paso 20 no cae en su cuadrícula. Pedido: que el validador avise cuando min o inicio no son múltiplos del paso.
3. **Faltan avisos del validador sobre las llaves:**
   - una llave dentro de `raiz`, o con `arriba` dentro de `frac`, rompe el renglón;
   - el validador no pone tope a la nota.
4. **La llave ensancha la ecuación según su nota.** Pedido: que la nota pueda salir de su trozo. La regla de Ptolomeo se parte después del «=» a 360 px.
5. **Gestos que faltan:**
   - «elegir un objeto de la figura» (tocar el vértice de partida de las diagonales; hoy la manija salta al vértice más cercano);
   - «contar» (tocar para sumar o quitar un escalón, un rayo o un lado);
   - «girar el sólido» arrastrando toda la figura, no una manija en un vértice.
6. **Manijas que dependen de una opción.** Un `visible: v => …` por manija; en «Dos espejos» una sola manija cambia de significado según el modo.
7. **La ficha se ensancha.** Con todas las ideas terminadas, la página se ensancha en horizontal (fila de chips). Pasa también en triángulos y no se investigó.

## No verificado

- **Dispositivos y personas:** celular táctil real, lector de pantalla y alumnos. Los arrastres se probaron con el mouse en Playwright a 360 × 780, en un solo sentido por manija.
- **«Mira» y las reglas:** en varias unidades solo las revisó el validador, o se vieron en una página de prueba con `estilos.css`, sin recorrer la app. Algunas notas largas («cuatro círculos máximos», «camino del centro») se parten en dos líneas.
- **Rótulos que se tocan en casos extremos:**
  - triángulo libre muy chico;
  - cuadrilátero libre con D en 240°;
  - dos-libres con d chico;
  - pappus-libre con el tamaño mínimo;
  - el ortocentro fuera del marco en obtusángulos muy abiertos (se oculta o se recorta).
- **Parábola:** con p = 0,5 y x = 4, P sale del marco (rango que ya venía de antes).
- **Tema oscuro:** se revisó una vez por unidad, sobre todo en el laboratorio.
- **Servidor de desarrollo:** se cayó a mitad de la ronda. Los subagentes verificaron con servidores propios en otros puertos sobre el mismo árbol.

## Reporte de diseño

```
Ficha de tarea: el postulante de 3.º a 5.º, en celular de 360 px, agarra el objeto de la figura (vértice, punto, radio, arista) en vez de mover un deslizador, y en el laboratorio prueba el caso raro que la idea no deja.
Sistema: existente (docs/teoria.md §4b, kit, tokens). Decisión nueva: geo-figura exporta aPantalla, aPlano y sobreRecta; quedó escrita en su encabezado y en su prueba.
Carácter: acogedora, viva y precisa · firma: el hilo de color; la manija lleva el color de la variable que mueve (sin color si es cámara, como girar el sólido).
Movimientos: arrastre — gesto — sigue al dedo uno a uno, sin curva (lo hace el lector) — sin traslado al soltar; nada nuevo animado en las unidades.
Verificación: validador de manijas (cae en la figura, está donde dice su valor, mueve controles reales) en verde en las 18 unidades; arrastre real con el mouse y 2 casos guardados por mesa en Playwright a 360 × 780; capturas revisadas a ojo; npm test en verde.
No verificado: celular real, lector de pantalla, alumnos, pasos de «Mira» recorridos en la app en todas las unidades.
Hipótesis: agarrar el vértice sube los casos distintos probados por idea frente a − y + (medible con los eventos teoria: casos al pasar a «Predice»).
Conflictos: ninguno con CLAUDE.md. Con el skill: las 11 ideas sin arrastre quedan solo con − y +, con la razón anotada.
```
