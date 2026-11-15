# Ronda 3 de teoría: glosario y retos comprobados en geometría (15 nov 2026)

Encargo: `rutinas/encargos/teoria3-geometria.md`. Rama `teoria3/geometria`. Las 18 unidades del curso tienen glosario y retos comprobados en todas sus mesas del laboratorio.

**Cómo se trabajó.** Seis subagentes trabajaron en paralelo, cada uno con tres unidades seguidas del curso y en un worktree aislado. La sesión principal juntó los archivos, resolvió los choques y escribió un commit por unidad.

**Regla de reparto de términos.** Cada término se define en la primera unidad del curso cuyo texto lo contiene, buscado con la misma búsqueda del lector. Hay una excepción a propósito: triángulo y altura se definen en «Triángulos», donde son el tema, aunque ya salen en «Segmentos y ángulos».

**Integración.** Se hizo con un solo commit, «Glosario de geometría: términos que estrena cada unidad…»:
- **Un choque resuelto:** «equivalente» estaba definido en áreas poligonales y también en prisma y pirámide. Se quedó en áreas, con una definición que cubre la misma área o el mismo volumen.
- **Diez términos que ningún lote había definido**, porque la unidad que los estrena era de otro lote:
  - arco (segmentos);
  - razón (congruencia);
  - circunscrita (circunferencia);
  - área, volumen e incentro (proporcionalidad);
  - número pi, con forma «π» (polígonos regulares);
  - sólido, cara y perpendicular al plano (simetría).
- **Cuarenta y un «Ver también» entre unidades de lotes distintos.** Por ejemplo: baricentro → mediana, sector circular → ángulo central, tres perpendiculares → perpendicular al plano.

## Términos por unidad

Propios: los que define la unidad. Heredados: los que se definen en otra unidad del curso y el lector igual marca aquí, según `app/datos/glosario/geometria.json`. En total son 253 términos y 233 retos.

| Unidad | Propios | Heredados | Retos por mesa |
|---|---|---|---|
| Segmentos y ángulos | 24 | 6 | 5 + 4 + 4 = 13 |
| Triángulos y líneas notables | 21 | 15 | 5 + 4 + 4 = 13 |
| Congruencia de triángulos | 22 | 22 | 5 + 4 + 4 = 13 |
| Polígonos y cuadriláteros | 15 | 20 | 5 + 5 + 5 = 15 |
| Circunferencia y ángulos en ella | 16 | 28 | 5 + 5 + 4 = 14 |
| Proporcionalidad y semejanza | 16 | 23 | 4 + 4 + 4 = 12 |
| Puntos notables del triángulo | 9 | 37 | 5 + 4 + 4 = 13 |
| Relaciones métricas | 9 | 40 | 5 + 5 + 3 = 13 |
| Polígonos regulares | 9 | 28 | 5 + 4 + 4 = 13 |
| Simetría en el plano y en el espacio | 17 | 14 | 4 + 4 + 3 = 11 |
| Áreas de regiones triangulares y cuadrangulares | 7 | 28 | 4 + 4 + 4 = 12 |
| Longitud de la circunferencia y áreas circulares | 10 | 27 | 4 + 4 + 4 = 12 |
| Rectas y planos en el espacio | 14 | 26 | 5 + 4 + 4 = 13 |
| Poliedros | 14 | 10 | 4 + 4 + 3 = 11 |
| Prisma y pirámide | 12 | 35 | 4 + 4 + 3 = 11 |
| Cilindro, cono y esfera | 14 | 25 | 4 + 4 + 4 = 12 |
| Geometría analítica | 15 | 17 | 4 + 5 + 5 = 14 |
| Razonamiento con figuras | 9 | 14 | 4 + 4 + 4 = 12 |

Las tres primeras unidades pasan de 15 términos (el tope duro es 24) porque estrenan el vocabulario básico del curso: punto, recta, ángulo, sus clases, las líneas del triángulo, los criterios, la circunferencia, el radio y el diámetro.

## Retos por unidad y de qué tipo

Tipos: E = extremo, X = caso exacto, F = forma o patrón, C = comparación entre dos casos guardados. Con ★ va el reto que toca la idea central.
Todo `logrado` usa funciones del motor de la mesa (en varias se factorizaron para que el dibujo, la lectura y el reto usen la misma). Los extremos se calculan recorriendo la grilla real de la mesa, no van escritos a mano.

- **Segmentos y ángulos**
  - secante-y-giro: naranjas iguales otra vez X★ · mayor diferencia E · secante en ángulo recto X · conjugados que suman 170° X · mismo giro con otra secante C.
  - punto-libre: rodeo cero X★ · B en la recta, fuera del tramo F · mayor rodeo E · mismo rodeo en dos lugares C.
  - quiebre: x = 90° X · quiebre más cerrado E · simétrico F · mismo x con otros a y b C.
- **Triángulos**
  - triangulo-libre: C obtuso y altura afuera F★ · recto en B X · líneas notables que coinciden F · mayor A E · acutángulo y obtusángulo suman 180° C★.
  - bisagra-libre: x en un extremo de la desigualdad X · mayor x E · isósceles F · mismos lados con otro ángulo C.
  - bisectrices: BIC = 120° X · mayor BIC E · B = C F · mismo A con otros B y C C.
- **Congruencia**
  - compas-lla: ningún triángulo F · tangente, un solo triángulo X★ · BC más corto que da dos triángulos E · A obtuso F · mismo ∠A con distinto número de triángulos C★.
  - c-libre: CM = 5 X · agudo, afuera F · C más abierto E · uno adentro y otro afuera C.
  - base-libre: MN = 3 X · MN más larga E · A más allá de C F · misma BC C.
- **Polígonos y cuadriláteros**
  - cuadrilatero-libre: cóncavo F · cruzado F · rombo adentro X · rectángulo adentro X · convexo contra cruzado C★.
  - paralelogramo-libre: diagonales iguales sin cuadrado X · cruce de 90° X · cuadrado X★ · AC más larga E · ∠A suplementarios C.
  - trapecio-libre: MN = 8 X · PQ más corto E · isósceles F · C más allá de B F · misma MN con otra altura C★.
- **Circunferencia**
  - dos-libres: tangentes exteriores X · tangentes interiores X · interiores F · mayor d que todavía corta E · dos tangentes exteriores C.
  - inscrito-libre: 90° X · P sobre el arco F · semiinscrito X · mayor ángulo con P afuera E · mismo arco, mismo ángulo C★.
  - cuadrilatero-libre: ∠B + ∠D = 180° X★ · suma mínima E · suma máxima E · D adentro y afuera C.
- **Proporcionalidad y semejanza**
  - corte-libre: DE paralela X★ · AD/DB = 4 X · razones lo más distintas E · dos cortes paralelos C.
  - bisectriz-libre: D en el punto medio X · BD = 2·DC X · mayor razón E · mismos lados con otro ∠A C★.
  - estirar: área por 4 X★ · semejante más chica F · mayor factor sin semejanza E · dos no semejantes con el mismo factor C.
- **Puntos notables**
  - cuatro-centros: O sobre BC X · O y H afuera F★ · A más bajo con H adentro E · cuatro centros alineados F · acutángulo contra obtusángulo C.
  - euler-libre: H en un vértice X · menor radio de la circunferencia de nueve puntos E · recta de Euler vertical F · mismo R/2 C★.
  - seis-areas: triangulito de 1,5 X · obtusángulo y seis áreas iguales F★ · mayor área E · igual triangulito C.
- **Relaciones métricas**
  - potencia-libre: P sobre la circunferencia X · tangente F · PT = 4 X · mayor PA·PB E · mismo producto C★.
  - euclides-libre: B recto X · proyección más allá de B F★ · C recto X · b más largo E · mismo b con B agudo y obtuso C.
  - ptolomeo-libre: producto = suma X★ · D afuera F · BD más larga E.
- **Polígonos regulares**
  - poligono-libre: P/2R cerca de π E★ · lado = 2·apotema X · apotema = R/2 X · apotema > 99 % de R F · mismo n con otro R C.
  - inscritos-con-radio: lado 4 X · apotema 2 X · mayor apotema E · triángulo y hexágono C.
  - corte-libre: razones iguales (φ) X★ · razón 1,5 X · mayor que 2 F · máximo E.
- **Simetría**
  - espejo-que-gira: P′ sobre P X · solo cambia el signo de x F★ · mayor PP′ E · ejes perpendiculares C.
  - dos-espejos: avanza 4 X · media vuelta F★ · menor giro E · separación doble C.
  - reflejo-plano: mayor PP′ E · PP′ = 2 X · misma H con otra altura C.
- **Áreas poligonales**
  - triangulo-libre: área 12 con la altura afuera X★ · mayor área E · rectángulo de área 8 F · misma área adentro y afuera C.
  - puntos-medios-libres: cóncavo y sigue la mitad F★ · área 40 X · paralelogramo rectángulo F · igual área C.
  - punto-p-libre: PAB = PCD X · un triángulo desaparece E · P fuera de la franja F · misma altura con otro ancho C.
- **Longitud y áreas circulares**
  - sector-y-segmento: sector 4π X · mayor segmento E · segmento = medio círculo F · radio doble, área cuádruple C★.
  - corona-y-trapecio: trapecio 6π X · donde (R − r)² queda más corto E★ · un tercio de la corona F · dos coronas iguales C.
  - lunulas-libres: lúnulas de 12 X · catetos iguales F · lúnulas mínimas E · lúnulas iguales C.
- **Rectas y planos en el espacio**
  - sombra-libre: sombra = AB/2 X · sombra punto E · sombra = altura F · misma sombra con otro ángulo C★ · otra cámara C★.
  - tres-perpendiculares-libre: PB = 5 X · PB más corta E · catetos iguales F · misma PB C.
  - diedro-abierto: PH = 2 X · P más lejos E★ · H sobre la cara F · diedros suplementarios C.
- **Poliedros**
  - familias: 20 aristas X · más caras E · C = V F · mismas aristas C★.
  - vertice: 360° X · más lados que hace punta E · más triángulos E · mismo polígono con dos q C★.
  - cinco-regulares: 4 caras por vértice X · más vértices E · duales C.
- **Prisma y pirámide**
  - piramide-en-prisma: volumen 12 X · cúspide en una esquina F★ · mayor pirámide E · igual volumen C.
  - tronco-libre: el promedio acierta F · otro tronco de 56 X · mayor fallo E · tronco a pirámide F.
  - escala: 1/8 X · corte más cerca de la punta E · k doble, volumen por 8 C★.
- **Cilindro, cono y esfera**
  - cono-libre: generatriz 6,5 X · sector < 90° E · menor radio con V > 20π E · igual volumen C.
  - pappus-libre: toca el eje sin cruzarlo X★ · dos cuadrados C · cuadrado contra círculo C · mayor toro E.
  - zona-libre: casquete F · zona de 30π X · mayor casquete E · polo contra ecuador C★.
- **Geometría analítica**
  - reparto-libre: P en el origen X · P en un cruce F · P lo más cerca de A E★ · AB más largo E.
  - recta-y-punto: recta vertical F★ · P a 5 X · mayor pendiente E · P sobre la recta X · dos paralelas C.
  - elipse-libre: circunferencia F · focos a 3 X · focos verticales F · más achatada E · mismos focos C.
- **Razonamiento con figuras**
  - muesca-libre: mayor perímetro E · quitar área sin cambiar el perímetro X★ · perímetro < 20 F · adentro y afuera C.
  - rutas-con-cierre: cerrar la calle más transitada E · cortar la mitad X · 15 rutas X · volteada C.
  - cubo-pintado: 27 sin pintar X · empate de 1 y 2 caras X · ninguno sin pintar E · solo esquinas C.

## Mesas ampliadas

- **Ninguna mesa cambió de id ni de controles.** Una sola cambió el orden de sus controles: en `bisectriz-libre` (proporcionalidad), ∠A va primero, para que el validador pueda comprobar el reto «mismos lados con otro ∠A», que guarda dos casos (ver pedido 1). En pantalla cambia el orden de los controles.
- **Arreglos del motor que salieron al escribir los retos:**
  - Varignon (áreas): la detección de lados cruzados pasó a `seCruza`, y ya no queda en null si las rectas no se cortan.
  - Circunferencia: la lectura y los retos usan la misma `sumaBD`.
  - Longitud: la lectura y los retos usan las mismas `medSeg`, `medTrap` y `lunDe`.
- **Cambios de texto para que un término aparezca donde se estrena:**
  - consigna de `euclides-libre`: «en el teorema de Euclides»;
  - reglas de simetría: «eje de simetría» y «simetría central»;
  - regla 1 de áreas: «ángulo comprendido»;
  - regla 5 de áreas: «paralelogramo de Varignon»;
  - paso del triedro: «Al plegar el desarrollo…»;
  - poliedros: «6 caras laterales»;
  - condición de la regla del prisma: «prisma recto»;
  - consigna de Pappus: «sólido de revolución»;
  - consigna de reparto: «plano cartesiano»;
  - regla de rutas: «número combinatorio»;
  - circunferencia: «El ángulo inscrito…»;
  - segmentos: «se mide en diagonal» pasó a «se mide inclinado», para que «diagonal» se estrene con su sentido de segmento entre vértices.

## Palabras que se dudaron

- **Fuera porque son de la escena o demasiado comunes:** compás, lado, abertura, medida, quiebre, centro, sombra, polo, ecuador, anillo, cuadra, cubito, capa, escalón, franja, pentágono y radio del polígono.
- **Fuera porque su forma suelta marcaría otra cosa:**
  - «recto» suelto: se define solo «ángulo recto», para que no marque «prisma recto»;
  - «cuadrado»: marcaría «los cuadrados de los catetos»;
  - «exterior» suelto;
  - «notable»: marcaría «puntos notables»;
  - «convexo» suelto: segmentos dice «ángulo no convexo», así que el término es «polígono convexo»;
  - «cruzados»: marcaría «pesos cruzados»;
  - «inscrito» y «central» sueltos;
  - «Euler» suelto: el término es «teorema de Euler», para que no marque la recta de Euler ni Königsberg;
  - «segmento» a secas, en longitud y áreas circulares.
- **Dentro, aunque solo salen en la historia:** proposición, axioma, recíproco, perspectiva, planta, alzado y papiro Rhind.
- **Fuera porque solo salen en `temas` o en `ahoraTu.generar`:** «consecutivos», «relación métrica», «teorema de la mediana» y «ortoedro».
- **«eje» suelto:** sin definir. Los usos están repartidos (eje de simetría, eje de giro, ejes x e y) y cada compuesto tiene su propio término.
- **Mismo término con otro sentido:**
  - «ángulo interior» y «ángulo exterior» se definen en triángulos, pero en circunferencia nombran ángulos con el vértice dentro o fuera del círculo;
  - LAL y LLL se estrenan como criterios de congruencia y se usan también para la semejanza.

## Pedidos al molde

1. **Retos con dos casos guardados.** `revisarInvitacion` prueba un `logrado(v, guardados)` solo con los primeros 160 casos de la grilla, donde el primer control varía y los demás quedan fijos. Si la grilla pasa de 20 000 casos, los toma de una muestra al azar donde casi nunca se repite una medida. Por eso no entraron estos retos:
   - «dos casos paralelos» (secante-y-giro);
   - «los dos cortes áureos» (corte-libre);
   - «dos giros con el mismo P» (potencia-libre);
   - «distinta base, misma área» (triangulo-libre de áreas);
   - «mismos lados adentro con distinto tipo» (cuadrilatero-libre);
   - las comparaciones de `reparto-libre`.

   En `bisectriz-libre` hubo que reordenar los controles. Se pide muestrear los pares repartidos por toda la grilla, o dejar que el reto declare los casos que lo prueban.
2. **Texto que el glosario no ve.** El texto de `ahoraTu.generar(s)` y el de `temas` no cuentan como «aparece en la teoría». Al revés, el `alt` de las figuras sí cuenta, aunque el lector nunca lo marca. Por eso varios términos obligaron a tocar consignas y pasos.
3. **Formas que cambian de sentido según la unidad** («recto», «cuadrado», «exterior», «notable»). Se pide alguna exclusión por contexto, o una forma que solo valga en ciertas unidades.
4. **Un ayudante común que dé la grilla de una mesa**, para calcular los extremos de los retos. Hoy cada unidad repite su `valoresDe` o `extremoMesa`, copiando el redondeo de `ajustar`.
5. **Retos de extremo que cumple un solo caso**, como «mayor PP′» en espejo-que-gira. Sería útil poder declarar una tolerancia.

## Lo no verificado

- **Definiciones:** las escribieron los subagentes y revisó topes y choques la sesión principal. Nadie las revisó a ciegas contra un libro.
- **Datos que no salen del motor:** «hace unos 3500 años» del papiro Rhind (c. 1550 a. C.) y la atribución del paralelogramo de los puntos medios a Varignon, que es la convención habitual.
- **Tolerancias del motor que el reto hereda:**
  - el isósceles de `bisagra-libre` usa la tolerancia de 0,05 de `nombreLad`;
  - en `ptolomeo-libre`, la lectura acepta D hasta a 0,09 de la circunferencia, por eso el reto dice «cerca de 3».
- **Lector:** no se miró si marca los términos dentro de la historia, ni cómo marca términos que se solapan («ángulo plano» frente a «ángulo plano del diedro»).
- **Recorrido:** se hizo con Playwright a 360 × 780, en Chromium y sin dispositivo real. Ver «Recorrido» abajo.

## Recorrido (Playwright, 360 × 780, `npm run dev`)

Se recorrieron las 18 unidades, con el alumno guardado en `lab-v1` (unmsm, 4.º) y la prueba de cada tema ya rendida. En cada unidad:
- **Idea 1:** se tocó el primer término subrayado y se abrió su hoja (de 4 a 14 términos marcados por idea).
- **Glosario** (`#/unidad/<id>/teoria/glosario`): mostró de 23 a 49 fichas; se buscó una palabra y salió su definición.
- **Laboratorio:** en las 54 mesas se cumplió el primer reto de un argumento, moviendo los controles al caso que da el motor. Todas dijeron «✓ Lo lograste».

No hubo errores de página. En las capturas, la hoja dice «Se explica en «Segmentos y ángulos»» para un término heredado, y los controles con color mantienen el de su variable.

**Pruebas:**
- `node --test contenido/teoria/teoria.test.js nucleo/glosario.test.js`: 161 en verde.
- `npm test`: 8549 en verde.
