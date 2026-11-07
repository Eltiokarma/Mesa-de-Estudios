# Rutina de aritmética: reporte

Sesión paralela a la conversación principal, en la rama `rutina/aritmetica` (salió de `claude/awesome-wozniak-5etl1n` en bf4b67b). Lista, en orden: numeración, cuatro operaciones, potenciación y radicación, mezclas y aleaciones, conjuntos y lógica proposicional, razonamiento numérico. Cada plantilla pasa por cuatro manos con subagentes (`docs/metodo/LEEME.md`): constructor, verificador independiente, revisor de contenido y correcciones devueltas al mismo constructor.

## 7 nov 2026 · Las fichas que se agrupan (`plantillas/numeracion/`)

**Qué hice.**

- **`motor.js`** (UMD, `window.MotorNumeracion`, sin DOM). Por dentro cuenta con BigInt y lanza un error si algo pasa de 2⁵³ − 1. Tiene:
  - fichas y animación: `agrupar` (cada etapa es una división sucesiva), `desagrupar` (Horner), `normalizar` (las llevadas en cadena), `cuadro(plan, t)` y `reagrupar(N, b1, b2)`;
  - cambio de base: `aBase`, `aDecimal`/`valor`, `cambiarBase` y `agruparCifras` (base 2 a 4 u 8);
  - validez y comparación: `valido`, `validos`, `baseMinima`, `comparar`, `baseDesconocida` y `leerEnBases`;
  - operaciones y conteo: `sumarUno`, `porLaBase`, `numerales`, `capicuas`, `cifrasPaginas` y `paginasConCifras`.

  Cada respuesta trae `errores`; un error que daría la correcta u otro error ya ofrecido no aparece.
- **`casos.json`:** 19 casos, verificados aparte.
- **`motor.test.js`:** 37 pruebas, con semilla fija:
  - ida y vuelta contra `toString`/`parseInt` en bases 2 a 36;
  - agrupar, desagrupar, normalizar y cada cuadro de la animación conservan las fichas;
  - capicúas, cifras de páginas y numerales de k cifras, contados uno por uno;
  - ningún error coincide con la respuesta ni con otro error;
  - bordes: N = 0, b = 2, b = 10 y BigInt grande.

  También valida `papel.json`.
- **`papel.json`:** 10 problemas propios, entre ellos conteo de cifras, el problema inverso (192 cifras → 100 páginas) y capicúas con raya encima.
- **Notación de academia:** la base va entre paréntesis en subíndice, 213₍₅₎. Los numerales con letras van con raya encima (a̅m̅a̅).
- **Paso a paso** (8 pasos, 6 predicciones que bloquean; todos los distractores son hipótesis):

  | Paso | Pregunta | Correcta | Distractores |
  | --- | --- | --- | --- |
  | 1 | Exploración: 23 fichas → 43₍₅₎, reagrupadas con animación en otras bases | — | — |
  | 2 | 75 en base 4 | 1023₍₄₎ | 3201₍₄₎ `restos-leidos-al-reves`, 123₍₄₎ `omite-el-cero`, 23₍₄₎ `olvida-el-ultimo-cociente` |
  | 3 | 213₍₅₎ en base 10 | 58 | 290 `potencias-corridas`, 30 `suma-cifras-por-la-base`, 213 `lee-como-decimal` |
  | 4 | ¿Cuántos de cinco numerales están bien escritos en base 6? | 3 | 1 `cifras-de-1-a-b`, 4 `cifra-igual-a-la-base`, 5 `cualquier-cifra-decimal-sirve` |
  | 5 | Ana (44₍₅₎) contra Beto (30₍₈₎) | Tienen lo mismo (24) | `compara-cifras-sin-base`, `base-mayor-da-mas`, `no-se-comparan-bases-distintas` |
  | 6 | 23₍b₎ = 17 | b = 7 | 4 `base-minima-como-respuesta`, 6 `resta-los-numerales`, 14 `resta-las-unidades-y-no-divide` |
  | 7 | Capicúas de 3 cifras en base 6 | 30 | 25 `olvida-el-cero-en-el-medio`, 36 `cuenta-el-cero-al-inicio`, 180 `cuenta-todos-los-de-3-cifras` |
  | 8 | Explorador: N con ±1 y ±10, con la llevada en cadena; base de 2 a 10 | — | — |

- **«¿Qué pasa si…?»** (5 experimentos, con la regla de Gerson de bloqueo):

  | N.º | Pregunta | Correcta | Distractores |
  | --- | --- | --- | --- |
  | 1 | 44₍₅₎ + 1 | 100₍₅₎ (y el mayor de 3 cifras es b³ − 1) | 45₍₅₎ `cifra-igual-a-la-base`, 50₍₅₎ `lleva-solo-una-vez`, 40₍₅₎ `pone-cero-sin-llevar` |
  | 2 | 121 leído en base 3, 4, 5… | siempre es un cuadrado perfecto, (b + 1)², dibujado como un cuadrado | `el-valor-no-depende-de-la-base`, `crece-igual-que-la-base`, `se-duplica-con-la-base` |
  | 3 | Cifras para numerar 120 páginas | 252 | 120 `cuenta-paginas-no-cifras`, 249 `olvida-el-mas-uno`, 360 `todas-con-tres-cifras` |
  | 4 | 324₍₅₎ · 5 | 3240₍₅₎ (animado con 5 copias que se normalizan) | 1620₍₅₎ `multiplica-como-en-base-10`, 334₍₅₎ `suma-la-base`, 32400₍₅₎ `agrega-dos-ceros` |
  | 5 | 1011010₍₂₎ a base 8 | 132₍₈₎ | 121₍₈₎ `suma-las-cifras-del-grupo`, 550₍₈₎ `agrupa-desde-la-izquierda`, 1122 `agrupa-de-a-dos` |

- No hay nada que arrastrar: N y la base se manejan con botones, que también funcionan con teclado. Por eso no se usa `Celular.arrastre`; sí `compactar`, `alto` y `alResponder`.

**Pruebas.** `npm test`: 1963 pruebas, pasan 1961. Fallan solo las 2 de catálogo, que fallan hasta que la principal integre:
- `app/datos/catalogo.json está al día`;
- `cada plantilla tiene ficha válida y está en el catálogo`.

Playwright corrió con constructor y revisor, a 1366 × 768 y 390 × 844, en claro y en oscuro, con y sin movimiento reducido. Resultados:
- sin errores de consola ni desbordes;
- en el celular, el dibujo queda fijo arriba y visible al responder;
- el dedo desplaza la página sobre el dibujo.

**Subagentes.**

- **Verificador independiente** (no leyó el motor, solo su cabecera). Recalculó en Python con enteros exactos y métodos distintos: potencias restadas, suma posicional, conteo directo de cifras y capicúas, búsqueda de bases. Resultado: **0 discrepancias** en los 19 casos y en los 10 problemas de papel.

  Los dos campos que se agregaron después de la revisión los comprobé a mano: `omiteCeros` = 123 y `olvidaUltimoCociente` = 23 = 75 mod 16.
- **Revisor de contenido:** nada grave y ningún número malo. Corregido:
  - **Paso 2:** el enunciado traía las divisiones, así que la pregunta quedaba en elegir entre dos opciones. Ahora solo pregunta, y los cuatro numerales existen en base 4.
  - **Regla 4:**
    - en el capicúa, la misma «a» salía en dos colores; ahora el color va por orden, con raya encima y la nota «la última cifra copia a la primera»;
    - en el cuadrado de 121, b salía en el color de un orden;
    - la letra b nombraba también una cifra, en el experimento 3 y en p6.
  - **Lector de pantalla:** pegaba la base al numeral y leía «435»; ahora dice «43 en base 5».
  - **Notación de academia:** base entre paréntesis y devoluciones siempre con su base.
  - **Pistas antes de responder:** en los experimentos 1 y 4 el tablero ya mostraba la columna vacía; ahora siempre tiene 4 columnas. El borde rojo de «no existe» pasó a tinta.
  - **Detalles:** singular y plural («se forma 1 cajón»), los 5 en color de la base en Horner, la frase de p5, «bien escritos», Ana y Beto en el paso 5.
  - **Experimento 4:** la animación ya muestra las 5 copias que se juntan, como dice el texto.

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| N (base 10) | #1f5fbf | #7cb0ff |
| base b | #a10fbf | #cf6bfa |
| unidades (orden 0) | #0f766e | #5ed9c8 |
| paquetes de b (orden 1) | #a05200 | #f0a04a |
| cajas de b² (orden 2) | #466d14 | #a3d65e |
| cajones de b³ (orden 3) | #b02c41 | #f17384 |

- **ΔE00:** mínimo 23,6 en claro y 25,3 en oscuro, entre unidades y cajas. N contra b: 27,1 y 29,3.
- **Contraste:** todo ≥ 4,5. Mínimo en claro: 4,53, unidades sobre la opción marcada. Mínimo en oscuro: 4,63, b sobre la correcta.
- **Rojo de aviso:** el de cajones queda a ΔE00 7,6 (claro) y 5,0 (oscuro). Siempre va con texto, y el borde de «no existe» ya está en tinta.
- Los conteos (capicúas, cifras, páginas) van en tinta.

**Pendiente.**

- Ningún error de numeración tiene dato: todos son hipótesis. Conviene medirlos en la prueba de entrada.
- Sin ítems en el banco de aritmética, que ya está en 10 con 2 por plantilla.
- En el motor y no en la escena: conteo de numerales de k cifras con condiciones, `paginasConCifras` (está en p8) y bases mayores que 10.

**Pedidos para la integración.**

- **Catálogo:** agregar `numeracion` a la unidad `aritmetica.numeracion` de `catalogo/cursos/aritmetica.json`, correr `npm run catalogo` y subir `VERSION` en `app/sw.js`.
- **`docs/diseno.md`:** la tabla de colores de arriba, con la regla «un color por orden: unidades, b, b², b³, igual en cifra, pieza y término».
- **`docs/pendientes.md`** (línea en «Detalles»): «**Numeración** (`plantillas/numeracion/`, rutina de aritmética, 7 nov 2026): las fichas que se agrupan (cambio de base con divisiones sucesivas como rondas de agrupar, descomposición polinómica como abrir piezas, cifras válidas, comparar bases, base desconocida, capicúas, conteo de cifras de páginas, la llevada en cadena y bases potencia); 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todos los errores son hipótesis. Notación 213₍₅₎. Sin ítems en el banco de aritmética.» En la fila ma4, quitar «numeración» de «Faltan».
- **`CLAUDE.md`:** sumar «las fichas que se agrupan» a la lista de plantillas, y una línea en Historia: «Numeración (7 nov 2026, rutina de aritmética): `plantillas/numeracion/` (las fichas que se agrupan: cambio de base, descomposición polinómica, cifras válidas, base desconocida, capicúas y cifras de páginas; 19 casos verificados aparte).»

### Numeración, segunda tanda (7 nov 2026, regla nueva del título y los pasos)

El revisor de cuatro operaciones revisó numeración con la regla nueva y encontró un **grave**: la leyenda del paso 3 («cajas de 25 / paquetes de 5 / sueltas») ya daba 2·25 + 1·5 + 3. Corregido en feaa966:
- **Leyendas neutras antes de responder** («cifra de la izquierda / del medio / de la derecha / la base») en los pasos 3, 5 y 7. La leyenda con las piezas aparece después de responder.
- **Paso 3:** el enunciado quedó en «El numeral 213₍₅₎ está en base 5.».
- **Paso 1:** salió «ninguna cifra llega a 5», que descartaba el error del paso 4.
- **Experimento 5:** ya no dice «3 cifras de base 2 por cada una de base 8», que descartaba juntar de a dos.
- **Papel:** la indicación ya no trae las reglas.

**Pedido para la integración:** volver a hacer merge de `plantillas/numeracion/` (sin cambios de motor, casos ni colores).

## 7 nov 2026 · El tablero de las llevadas (`plantillas/cuatro-operaciones/`)

**Qué hice.**

- **`motor.js`** (UMD, `window.MotorCuatroOperaciones`, sin DOM):
  - suma, resta y multiplicación por una cifra en columnas y en cualquier base, con la llevada y el préstamo por columna, y los cuadros de animación (`cuadroColumnas`, `cuadroResta`);
  - complemento aritmético con la regla «a 9 todas, a 10 la última significativa»;
  - cifras que faltan y criptoaritmética por fuerza bruta, con unicidad;
  - número menos su reverso (siempre 99·(a − c)) y división entera por defecto y por exceso (r + rₑ = d);
  - sumatorias de academia y cantidad de cifras de un producto.

  Cada respuesta trae `errores`. La cabecera documenta cómo se forma cada error del reverso y las convenciones de la animación.
- **`casos.json`:** 19 casos, verificados aparte.
- **`motor.test.js`:** 41 pruebas, con miles de casos al azar con semilla fija:
  - columnas contra la aritmética directa en bases 2 a 16;
  - CA(N) + N = bᵏ;
  - D = dq + r;
  - unicidad de las criptos de la escena;
  - ningún error da la correcta ni coincide con otro, y todos existen en su base.
- **`papel.json`:** 10 problemas propios.
- **Colores por orden:** los mismos de numeración, para que la llevada se lea como «un paquete que sube».
- **Paso a paso** (8 pasos, 6 predicciones; todas hipótesis):

  | Paso | Pregunta | Correcta | Distractores |
  | --- | --- | --- | --- |
  | 2 | CA(4073) | 5927 | 5926 `complemento-todas-a-nueve`, 5027 `complemento-deja-el-cero`, 95 927 `complemento-potencia-de-mas` |
  | 3 | 5003 − 1478 | 3525 | 4475 `resta-el-menor-del-mayor`, 4635 `presta-sin-descontar`, 3635 `ceros-que-prestan-quedan-en-10` |
  | 4 | ☐85 + 6☐☐ = 1282, suma de las que faltan | 21 | 13 `deduce-sin-llevadas`, 22 `olvida-la-segunda-llevada`, 15 `suma-la-llevada-al-deducir` |
  | 5 | 2 + 4 + … + 60 | 930 | 899 `cuenta-terminos-sin-el-mas-uno`, 1830 `usa-el-ultimo-como-n`, 1860 `gauss-sin-dividir-entre-dos` |
  | 6 | Residuo por exceso de 47 ÷ 9 | 7 | 2 `residuo-por-exceso-igual-al-por-defecto`, 6 `resta-desde-el-residuo-maximo`, 11 `suma-el-divisor-al-residuo` |
  | 7 | XY + YX = 132: X + Y | 12 | 6 `suma-las-cifras-del-resultado`, 13 `olvida-la-llevada-de-las-unidades`, 66 `trata-la-suma-como-un-doble` |

- **«¿Qué pasa si…?»** (5 experimentos con bloqueo):

  | Experimento | Pregunta | Correcta | Distractores |
  | --- | --- | --- | --- |
  | Ceros | CA(5800) | 4200 | 4199, 4190, 42 |
  | Reverso | Número menos su reverso que da una diferencia que empieza con 4 (la última cifra no es 0) | 495 | 404 `resta-el-menor-del-mayor`, 496 `descuenta-solo-el-primer-prestamo`, 406 `presta-sin-descontar` |
  | Producto | Cifras de (4 cifras) × (3 cifras) | 6 o 7 | — |
  | Residuos | El residuo por defecto y el por exceso con d = 14 | son iguales solo con r = 7 | — |
  | Base 5 | 34₍₅₎ · 3 | 212₍₅₎ | 102₍₅₎, 142₍₅₎, 42₍₅₎ |

- No hay nada que arrastrar: todo se maneja con botones y teclado, y el lienzo lleva `pan-y`.

**Pruebas.** `npm test`: 2538 pruebas, pasan todas menos las 2 de catálogo, que se esperaban. Playwright corrió en las 8 combinaciones (1366 y 390, claro y oscuro, con y sin movimiento reducido): sin errores ni desbordes. En el celular, el dibujo queda arriba y visible al responder.

**Subagentes.**

- **Verificador independiente.** Recalculó con conversión de bases y columnas simuladas, y comprobó por fuerza bruta propia la unicidad de ?85 + 6?? = 1282, de las criptos y del p5. Coinciden todos los valores matemáticos.
  - No pudo reconstruir los errores del reverso (404, 405, 406). Ahora la cabecera documenta cada uno con 551 − 155.
  - El 405 no salía de ninguna resta concreta: pasó a 496 (descontar solo el primer préstamo), que comprobé a mano.
  - Documenté las convenciones de animación.
  - Corregí el nombre del caso 3 («el 4, en la posición 2»).
- **Revisor de contenido:** nada grave. Corregido:
  - el título del experimento 4, «Los dos residuos iguales», descartaba «Nunca»; ahora es «El residuo por defecto y el por exceso»;
  - la indicación del papel regalaba la regla del préstamo y la de los ceros;
  - la leyenda de las tarjetas del reverso pasó a unidades, decenas y centenas;
  - el enunciado del paso 4 pinta las cifras por orden, igual que el dibujo;
  - «la última cifra no es 0» en el reverso (antes faltaba 891 en la lista);
  - «faltaban 5, 9 y 7» unificado;
  - los chips de `.eq` ya no se parten;
  - aria-label «102 en base 5»;
  - nota «rₑ» en el paso 6.
- **La misma cifra en dos colores** en las tarjetas: el revisor concluyó que **no** viola la regla 4. La variable es el orden, no el valor, y el color es el mismo en tablero, cuenta y ecuación.

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| unidades / b / b² / b³ y base | los de numeración | |
| X | #1430b8 | #8892fc |
| Y | #76195f | #fdb9fd |
| divisor d | #c70576 | #fb56b6 |
| cociente q | #766619 | #f9d524 |
| residuo por defecto r | #630b03 | #fdc3af |
| residuo por exceso rₑ | #194d2b | #c8f9d1 |
| suma S | #5c330a | #fde7b9 |
| cantidad de términos n | #1d5a87 | #06a6f9 |

El dividendo D y la caja de 10 000 van en tinta.

- **ΔE00 mínimo dentro de cada vista** (claro / oscuro):

  | Vista | Claro | Oscuro |
  | --- | --- | --- |
  | Columnas | 23,6 | 25,3 |
  | Letras X–Y | 23,0 | 24,4 |
  | División | 25,1 | 28,7 |
  | Sumatoria | 38,8 | 50,1 |

- **Pares bajo 20 entre vistas que nunca comparten pantalla:** cajones–d 14,6, r–S 14,8, X–n 15,4. El revisor lo comprobó vista por vista.
- **Contraste:** ≥ 4,53 en claro y ≥ 4,62 en oscuro.

**Pendiente.**

- **Arrastre:** CLAUDE.md pide arrastrar como interacción principal. Aquí y en numeración todo va con botones. Propuesta: en el explorador, arrastrar una pieza para abrirla o juntarla.
- **En papel y no en la escena:** la suma de los números de 3 cifras (su error de contar 899 términos no da un entero).
- **Banco:** sin ítems en el de aritmética.
- **Decidido (Gerson, 7 nov 2026):** el residuo por exceso se escribe rₑ; cambiado en escena, motor y casos. En el celular, el tablero sube a un tope de 340 px con predicción pendiente.

**Pedidos para la integración.**

- **Catálogo:** agregar `cuatro-operaciones` a `aritmetica.cuatro-operaciones`, correr `npm run catalogo` y subir `VERSION`.
- **`docs/diseno.md`:** la tabla de colores de arriba (el orden se hereda de numeración).
- **`docs/pendientes.md`** (Detalles): «**Cuatro operaciones** (`plantillas/cuatro-operaciones/`, rutina de aritmética, 7 nov 2026): el tablero de las llevadas (columnas con la llevada como paquete que sube y el préstamo como paquete que se abre, también en base b; complemento aritmético, resta con ceros, cifras que faltan, sumatorias, división por defecto y por exceso, criptoaritmética, número menos su reverso y cifras de un producto); 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todo hipótesis. Falta el arrastre. Sin ítems en el banco de aritmética.» En ma4, quitar «cuatro operaciones» de «Faltan».
- **`CLAUDE.md`:** sumar «el tablero de las llevadas» a la lista y una línea en Historia: «Cuatro operaciones (7 nov 2026, rutina de aritmética): `plantillas/cuatro-operaciones/` (el tablero de las llevadas: complemento aritmético, préstamos, cifras que faltan, sumatorias, división por defecto y por exceso y criptoaritmética; 19 casos verificados aparte).»

### Arrastre en numeración y cuatro operaciones (7 nov 2026, pedido de la principal)

- **Numeración** (e397267). En el paso 8 se arrastra una pieza a la columna de la derecha para abrirla en b piezas, o b piezas a la izquierda para juntarlas.
  - Se puede tener un estado sin normalizar, por ejemplo 8 sueltas en base 5; ahí el numeral sale «—» hasta juntar.
  - Motor: `abrir`, `juntar`, `estado` y `desarmar`, con una prueba de 500 tableros al azar. Caso 20 nuevo, comprobado a mano.
  - Teclado: ← y → eligen la columna, Enter abre y J junta. También hay botones y «Juntar todo».
- **Cuatro operaciones** (5a34404). En el paso 8 está «Hacerla a mano»: en la suma se juntan las llevadas y en la resta se abren los préstamos arrastrando, con la misma interacción que numeración.
  - Motor: `aMano`, `abrirMano`, `juntarMano` y `estadoMano`, con una prueba de 400 cuentas al azar en bases 2 a 10. Caso 20 nuevo (503 − 178 y 47 + 38), comprobado a mano.
- **Celular:** en los dos, `Celular.arrastre` toma el gesto solo si empieza cerca de una pieza que se puede mover; lejos de ella, el dedo desplaza la página.
- **Playwright:** con ratón y con toque, a 390 y 1366, en claro y oscuro.
- **También en cuatro operaciones:** rₑ en vez de r′ (decisión de Gerson) y el tope de 340 px en el celular (892f620).

## 7 nov 2026 · El cuadrado de fichas (`plantillas/potenciacion/`)

**Qué hice.**

- **`motor.js`** (UMD, `window.MotorPotenciacion`): raíces enteras con BigInt y Newton, sin `Math.sqrt`. Tiene:
  - `raizEntera`: raíz por defecto y por exceso, con su residuo, la potencia y la siguiente;
  - `esCuadrado` y `esCubo`;
  - `agregarParaSiguiente`: la L de 2k + 1;
  - terminaciones y criterios de exclusión, cada uno con su razón;
  - `menorMultiplicador` y `menorDivisor` para cuadrado o cubo;
  - `cuadradosEntre`, `cuadradosDeCifras` y `cifrasRaiz`;
  - `sumaImpares`, `terminaEn5` y `restosCuadrados`;
  - los dibujos: cuadrado con sobrante, la L, las capas de impares, el cubo isométrico y la cáscara 3k² + 3k + 1.
- **`casos.json`:** 19 casos, verificados aparte.
- **`motor.test.js`:** 42 pruebas, todas contra fuerza bruta:
  - N = k² + r con 0 ≤ r ≤ 2k hasta 20 000;
  - los criterios no excluyen ningún cuadrado hasta 1000²;
  - multiplicadores y divisores mínimos;
  - las fichas de los dibujos se conservan y no se enciman;
  - ningún error coincide con la correcta ni con otro error.
- **`papel.json`:** 10 problemas propios.
- **Interacción:** se arrastra la esquina del cuadrado para cambiar el lado k en los pasos 1 y 8, con `Celular.arrastre`, flechas del teclado y botones.
- **Paso a paso** (8 pasos, 6 predicciones; todo hipótesis):

  | Paso | Pregunta | Correcta | Distractores |
  | --- | --- | --- | --- |
  | 2 | Raíz cuadrada entera por defecto de 150 y su residuo | 12 y 6 | (13; 19) `confunde-raiz-por-defecto-y-por-exceso`, (11; 29) `resto-mayor-que-2k`, (12; 0,24) `resto-como-parte-decimal` |
  | 3 | De 15 × 15 a 16 × 16 | 31 | 30 `olvida-la-esquina`, 16 `agrega-un-solo-lado`, 32 `cuenta-dos-lados-y-repite-la-esquina` |
  | 4 | Solo uno es cuadrado perfecto, sin sacar raíces (con la pista del resto entre 4) | 7921 | 2711 `termina-en-uno-y-por-eso-es-cuadrado`, 36 000 `ignora-los-ceros-finales`, 2235 `terminar-en-5-basta` |
  | 5 | Menor multiplicador de 72 para que sea cubo | 3 | 2 `lo-hace-cuadrado-no-cubo`, 9 `multiplica-por-lo-que-sobra`, 6 `multiplica-por-todos-los-primos` |
  | 6 | Menor divisor de 2160 para que sea cuadrado | 15 | 5 `olvida-el-exponente-impar-mayor`, 135 `quita-el-factor-entero`, 30 `divide-entre-todos-los-primos` |
  | 7 | Cuadrados de 49 a 400 | 14 | 13 `olvida-el-mas-uno`, 20 `cuenta-desde-1`, 18 `raiz-de-la-diferencia` |

- **«¿Qué pasa si…?»:**

  | Experimento | Pregunta | Correcta | Distractores |
  | --- | --- | --- | --- |
  | 1 | 1 + 3 + … + 19 | 100 | 190, 361, 110 |
  | 2 | 65² | 4225 | 3625, 3025, 130 |
  | 3 | Restos de un cuadrado entre 3 | 0 o 1 | — |
  | 4 | Cifras de la raíz de un número de 7 cifras | 4 | — |
  | 5 | De 5³ a 6³ | 91 | 75, 36, 16 |

**Pruebas.** `npm test`: 2584 de 2586; fallan solo las 2 de catálogo. Playwright corrió en las 8 combinaciones (1366 y 390, claro y oscuro, con y sin movimiento reducido): sin errores, asserts ni desbordes. El arrastre de la esquina funciona con el dedo (5 → 7 sin mover la página), con el ratón y con las flechas; lejos de la esquina, el dedo desplaza la página.

**Subagentes.**

- **Verificador independiente.** Recalculó con fuerza bruta: raíces por búsqueda lineal, multiplicadores probando uno por uno, cuadrados contados, ruedas con pow mod 10 y bordes 2⁵² y 2⁵³ − 1. **0 discrepancias** en 19 casos y 10 de papel.

  Después de la revisión cambiaron tres casos, y los comprobé a mano:
  - el paso 3 a 16² − 15² = 31;
  - el experimento 3 a restos entre 3;
  - campos nuevos como 3163² = 10 004 569.
- **Revisor de contenido**, 2 graves:
  - las lecturas en vivo de los pasos 1 y 8 se quedaban con el lado viejo;
  - el paso 2 regalaba el paso 3 («r + r′ = 25 = 2·12 + 1» y la L completa). Se quitó y el paso 3 pasó a 15 → 16.

  Medios:
  - el paso 2 no decía «por defecto», y la raíz por exceso era defendible;
  - rₑ en vez de r′, y la letra solo cuando k es la raíz;
  - al 2711 del paso 4 solo lo descarta el resto entre 4. Ahora va la pista, y el experimento 3 pasó a restos entre 3 para no quedar regalado;
  - antes de responder, el 65² ya se veía partido y la leyenda de los impares decía «lado»;
  - regla 4: m nombraba las copias, k y r nombraban dos cosas en el paso 8, y los primos estaban en el color de N;
  - matemática en el HTML, que pasó al motor (`area`, `potencia`, `siguiente`).

  Bajos: N del paso 1 hasta 120, «√150 = 12,24…», 26 → 32 en el paso 3, el producto siempre con ×, la rueda y el hueco del paso 6.

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| N (fichas) | #1f5fbf | #7cb0ff |
| k (lado o raíz) | #a05200 | #f0a04a |
| r (residuo por defecto, sobran) | #0f766e | #5ed9c8 |
| rₑ (residuo por exceso, faltan) | #a10fbf | #cf6bfa |
| L (se agregan) | #466d14 | #a3d65e |
| m (multiplicador) | #b02c41 | #f17384 |
| d (divisor) | #77032c | #fdb4ce |

- **ΔE00 entre los que salen juntos:** mínimo 23,6 en claro y 25,3 en oscuro (r–L).
- **m–d:** 13,7 / 16,8, pero nunca salen juntos (m solo en el paso 5, d solo en el paso 6).
- **Contraste:** ≥ 4,53 en claro y ≥ 4,63 en oscuro. En las opciones, los números van en color sin chip.

**Pendiente.**

- La cáscara del cubo que crece todavía tapa parte del cubo viejo.
- Sin ítems en el banco de aritmética.
- **Para el informe:** el de aritmética no tiene ninguna fila de potenciación, numeración ni cuatro operaciones. Conviene una línea que diga que no hay datos de estos temas (no toqué `docs/`).

**Pedidos para la integración.**

- **Catálogo:** agregar `potenciacion` a `aritmetica.potenciacion-y-radicacion`, correr `npm run catalogo` y subir `VERSION`. Volver a hacer merge de numeración y cuatro operaciones por el arrastre.
- **`docs/diseno.md`:** la tabla de colores de arriba.
- **`docs/pendientes.md`** (Detalles): «**Potenciación** (`plantillas/potenciacion/`, rutina de aritmética, 7 nov 2026): el cuadrado de fichas (raíz entera por defecto y por exceso con su residuo y la esquina que se arrastra, la L de 2k + 1, criterios de exclusión por última cifra, ceros y restos, menor multiplicador o divisor para cuadrado o cubo con cubitos, cuadrados entre a y b, suma de impares, cuadrado de n5 y la cáscara del cubo); 19 casos verificados aparte; 10 de papel; 6 predicciones y 5 «¿qué pasa si…?»; todo hipótesis. Sin ítems en el banco de aritmética.» En ma4, quitar «potenciación» de «Faltan». En numeración y cuatro operaciones: «arrastre en el explorador (7 nov 2026)».
- **`CLAUDE.md`:** sumar «el cuadrado de fichas» a la lista y una línea en Historia: «Potenciación (7 nov 2026, rutina de aritmética): `plantillas/potenciacion/` (el cuadrado de fichas: raíz entera con residuo, la L de 2k + 1, criterios de exclusión, multiplicador mínimo para cuadrado o cubo y cuadrados entre a y b; 19 casos verificados aparte).»

## 7 nov 2026 · La balanza de las mezclas (`plantillas/mezclas/`)

**Qué hice.**

- **`motor.js`** (UMD, `window.MotorMezclas`): fracciones exactas con BigInt; los textos salen con coma decimal («S/ 4,80», «0,750», «≈ 6,64»). Tiene:
  - `precioMedio`, `gradoMezcla` y `leyMedia`;
  - `aspa` (proporción irreducible) y `cantidadPara`;
  - `aguaPara`, `ley`, `quilates`, `leyDeQuilates` y `oroFino`;
  - `aleacionPara`, `oroPara`, `masAlcohol` y `sacarYReponer`;
  - `balanza`: el momento neto, el estado («equilibrio», «casi» con el intervalo, «baja-izquierda» o «baja-derecha») y el ángulo.

  Si el valor pedido queda fuera del rango, el motor devuelve «sin solución» con la razón.
- **`casos.json`:** 19 casos, verificados aparte.
- **`motor.test.js`:** 40 pruebas de propiedades:
  - el valor medio queda entre el mínimo y el máximo;
  - los momentos son iguales a los dos lados;
  - escalar las cantidades no cambia el valor medio;
  - el aspa reproduce el valor medio;
  - el agua nunca sube el grado;
  - quilates y ley van y vuelven;
  - los errores son distintos entre sí;
  - bordes: un ingrediente, cantidad 0 y valor medio en un extremo.
- **`papel.json`:** 10 problemas propios: precio, aspa, grados, agua, quilates, ley, cobre y tres ingredientes. Una prueba revisa que la indicación no traiga «aspa», «ponderado» ni «promedio».
- **Escena:** tres dibujos:
  - la balanza, con la regla fija, la barra que se inclina y los sacos con altura según la cantidad;
  - los vasos, con el alcohol puro separado arriba;
  - la barra de oro en 24 partes.

  El apoyo se arrastra con `Celular.arrastre`, con las flechas y con botones. Usa `Celular.dpr()` y `Celular.variable`; no hay animación continua.
- **Paso a paso** (8 pasos, 6 predicciones):

  | Paso | Pregunta | Correcta | Distractores |
  | --- | --- | --- | --- |
  | 1 | Explorar: sacos fijos de 10 y 10 kg; solo se mueve el apoyo | — | — |
  | 2 | 30 kg a S/ 4 y 20 kg a S/ 6 | S/ 4,80 | S/ 5,00 `AR15-promedio-simple` (parcial), S/ 5,20 `cruza-las-cantidades`, S/ 10,00 `suma-los-precios` |
  | 3 | S/ 3 y S/ 8 para S/ 5 | 3 kg del de S/ 3 por cada 2 kg del de S/ 8 | 2 : 3 `aspa-al-reves`, 1 : 1 `mitad-y-mitad`, 8 : 3 `proporcion-con-los-precios-cruzados` (≈ S/ 4,36) |
  | 4 | 10 L de 60° y 30 L de 20° | 30° | 40° `AR15-promedio-simple` (parcial), 80° `suma-los-grados`, 50° `cruza-los-litros` |
  | 5 | Agua para bajar 12 L de 75° a 45° | 8 L | 18 L `aspa-al-reves`, 30 L `resta-grados-como-litros`, 20 L `da-el-volumen-final` |
  | 6 | Oro puro en 48 g de 18 quilates | 36 g | 18 g `quilates-como-gramos`, 8,64 g `quilates-como-porcentaje`, 12 g `da-el-otro-metal` |
  | 7 | 60 g de 18 quilates a 22 quilates con oro de 24 quilates (oro puro) | 120 g | 30 g `aspa-al-reves`, 10 g `cambio-de-ley-por-la-masa`, 180 g `da-la-masa-final` |

- **«¿Qué pasa si…?»** (4):

  | Experimento | Pregunta | Correcta | Distractores |
  | --- | --- | --- | --- |
  | 1 | Duplicar las cantidades del café | sigue en S/ 22 | S/ 24 (AR15, parcial), entre otros |
  | 2 | ¿Se puede S/ 9 con S/ 3 y S/ 8? | no | — |
  | 3 | 10 L de 30° contra 6 L de 50° | tienen lo mismo de alcohol | — |
  | 4 | Sacar 10 L de 40 L de 80° y reponer con agua | 60° | 40° (AR15, parcial), entre otros |

- **Respaldo:** las cuatro opciones AR15 van como «parcial» y citan con cautela a Pollatsek, Lima y Well (1981), sin cifras. Todo lo demás es hipótesis.

**Pruebas.** `npm test`: 3167 de 3169; fallan solo las 2 de catálogo. `pasada-celular.py` no marca nada para mezclas. Playwright corrió en las 8 combinaciones, con el arrastre del apoyo con ratón, toque y teclado: sin errores ni desbordes; en el celular, el lienzo queda a la vista al responder y el dedo lejos del apoyo desplaza la página.

**Subagentes.**

- **El constructor** lo cortó el límite de uso a medias: dejé un commit de respaldo y siguió desde ahí.
- **Verificador independiente.** Con fracciones, sacó el valor medio de los momentos que se anulan, el aspa buscando el par entero más chico y el agua, el oro y el cobre por búsqueda, conservando el alcohol o el metal fino. **0 discrepancias** en 19 casos y 10 de papel.

  El error 8 : 3 del paso 3, que entró después de la revisión, lo comprobé a mano: (8·3 + 3·8)/11 = 48/11.
- **Revisor de contenido.**
  - **Grave:** el paso 1, con kilos que se cambiaban, enseñaba que el equilibrio se va hacia el saco con más kilos. Con eso, en el paso 2 la única opción menor que 5 era la correcta y AR15 quedaba contaminado. Ahora el paso 1 tiene sacos fijos de 10 y 10, y el selector de kilos solo está en el paso 8.
  - **Medios:**
    - regla 4: en el aspa, cada distancia va ahora en el color de su ingrediente, como en el dibujo;
    - los 120 g de oro de 24 salían en naranja y turquesa;
    - lo que enseñaba el paso 2 dejaba el paso 3 con una sola opción plausible: el 3 : 8 pasó a 8 : 3, con los precios cruzados;
    - el lector de pantalla se comía la coma después de los soles.
  - **Bajos:** ley en milésimas (≈ 0,688), soles siempre con dos decimales, la escala del paso 7 que insinuaba la respuesta y la unidad en el intervalo «casi».
  - **Respaldo:** confirmó que las cuatro AR15 son de verdad «no ponderar». La del experimento 4 (80° con agua) es la más lejana al ejemplo del informe.

**Colores** (claro / oscuro; los mismos hex de fracciones):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| A (primer ingrediente) | #1f5fbf | #7cb0ff |
| B (segundo ingrediente, también el agua o el oro que se agrega) | #a05200 | #f0a04a |
| pm (valor de la mezcla y apoyo) | #a10fbf | #cf6bfa |
| al (alcohol puro) | #466d14 | #a3d65e |
| f (oro puro de una pieza) | #0f766e | #5ed9c8 |

- **ΔE00 mínimo entre los que salen juntos:** 27,1 en claro y 29,3 en oscuro (A–pm). f contra el gris del otro metal: 33,3 / 35,2.
- **Contraste:** ≥ 4,53 en claro y ≥ 4,63 en oscuro.

**Pendiente.**

- La pestaña «¿Qué pasa si…?» no se bloquea, como en las hermanas, así que sus explicaciones (rango y alcohol puro) se pueden leer antes de los pasos.
- El cobre que se agrega para bajar la ley está solo en papel (p7).
- Sin ítems en el banco de aritmética.

**Pedidos para la integración.**

- **Catálogo:** agregar `mezclas` a `aritmetica.mezclas-y-aleaciones`, correr `npm run catalogo` y subir `VERSION`.
- **`docs/diseno.md`:** la tabla de colores de arriba.
- **Informe** (si se quiere): anotar que el promedio simple en mezclas se mide como AR15 (parcial) en esta plantilla.
- **`docs/pendientes.md`** (Detalles): «**Mezclas** (`plantillas/mezclas/`, rutina de aritmética, 7 nov 2026): la balanza de las mezclas (el precio medio es el punto de equilibrio y el apoyo se arrastra; regla del aspa como momentos, grados de alcohol con el alcohol puro aparte, agua que baja el grado, ley y quilates con la barra de 24 partes, oro que se agrega, rango imposible, sacar y reponer); 19 casos verificados aparte; 10 de papel; 6 predicciones y 4 «¿qué pasa si…?»; AR15 parcial, lo demás hipótesis. Sin ítems en el banco de aritmética.» En ma4, quitar «mezclas» de «Faltan».
- **`CLAUDE.md`:** sumar «la balanza de las mezclas» a la lista y una línea en Historia: «Mezclas (7 nov 2026, rutina de aritmética): `plantillas/mezclas/` (la balanza de las mezclas: precio medio como equilibrio, aspa, grados de alcohol, agua, ley y quilates; 19 casos verificados aparte).»
