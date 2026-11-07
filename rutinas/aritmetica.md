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
