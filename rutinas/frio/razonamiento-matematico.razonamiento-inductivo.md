# Lector en frío: `razonamiento-matematico.razonamiento-inductivo` (20 nov 2026)

Ronda 1, con el método de `docs/metodo/unidad/4-lector-frio.md`: dos lectores nuevos, solo con capturas `--lector --entera`
a 390 px (momentos de las seis ideas y 18 tarjetas de ejemplos, tres por idea). El lector A vio las ideas 1 a 3; el B, las
ideas 4 a 6 y las 18 tarjetas. Capturas en el scratchpad de la sesión
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ri/lector/`: 133 + 18, sin repetidas
por md5 y sin el aviso del catálogo). Informes completos: `frio-A.md` y `frio-B.md` en esa misma carpeta.

**Ojo:** en estas capturas de Lee, Mira y «Así se resuelve» solo se ve la primera tarjeta o el primer paso; los dos
lectores lo dicen una vez y no lo cuentan como falla. Los dos rehicieron todas las cuentas que vieron: todas correctas.
Lo que el código confirma o agrava está en la auditoría (`rutinas/auditoria/razonamiento-matematico.razonamiento-inductivo.md`).

## Lo que trabó al lector A (ideas 1 a 3)

- Idea 1, Mira: «Figura 4» con un solo cuadrado en el paso 1.
- Idea 1, La regla: «× (n − 1)» baja solo al segundo renglón y parece multiplicar a «figura 1 + paso».
- Idea 2, Lee: la torta (tres velitas juntas a la derecha) no tiene que ver con la tarjeta 1; los puntitos grises no se explican.
- Idea 2, Predice: el título dice «Tres casos» y se muestran cinco.
- Idea 2, Mira: los 31 pedazos no se pueden contar en el dibujo.
- Idea 2, La regla: «⇏» no se explica; la fórmula se parte («⇒ se» / «descarta»); el «Vale si» no se entiende.
- Idea 2, Ahora tú: ver que 1681 no es primo pide probar divisores hasta 41, y nada sugiere 40 × 41 + 41.
- Idea 3, Juega: la figura 1 en tinta, y en Mira en turquesa.
- Idea 3, Mira y regla: «lineal» sin explicar.
- **Idea 3, La regla: «se prueba con un caso más» choca con la idea 2 («un caso más solo descarta»).**

## Lo que trabó al lector B (ideas 4 a 6 y tarjetas)

- Idea 4, Predice: los Datos «1, 8 y 27» casi dicen que son cubos.
- Idea 4, La regla: la llave «promedio» abarca dos n; en una fila par no hay lata del medio.
- Idea 4, Así se resuelve: el mismo dibujo cambia de impares a 1, 2, 3…
- Idea 5, Lee: «(30 cifras 9)» parece 30 nueves en total; teclas sin rótulo.
- Idea 5, Mira: la pantalla muestra el caso de 4 nueves y el paso 1 habla de 1 a 3.
- Idea 5, La regla: n sin decir qué es.
- Idea 5, Ahora tú: la regla de los nueves no sirve para los seises y nadie lo avisa.
- Idea 6, Lee y Juega: mostacillas sin color, solo con letra, que se tocan.
- Idea 6, La regla: la mostacilla 12 marcada y el 12 del cociente.
- Idea 6, Ahora tú: solo 3 opciones (falta Roja); otro orden de colores; el «23 entre 4» de Datos coincide con 95 = 4 × 23 + 3.
- Tarjetas: 03 («21 columnas sueltas… 147»), 04 (demasiado fácil), 06 (Datos «El 2 es primo» regala; «Solo el 2» impreciso),
  07 (Datos con la fórmula), 09 («n × (n + 2)» sin explicar), 12 («2 multiplicado n − 1 veces»), 13 («?» aunque cabe),
  14 (no avisa que con más de 9 unos se rompe), 15 («9 × 20» sin decir por qué; «el 3 y el 6»), 16 a 18 («23 entre 4»).

## Correcciones de la ronda 1

Con el criterio del cierre (`docs/metodo/unidad/cierre-delegado.md`, paso 4): lo que confunde se corrige con prueba; lo que
es del diseño o del dibujo de prueba queda anotado. Detalle y pruebas en la sección «Correcciones (19 nov)» de la auditoría.

| Nota | Qué se hizo |
|---|---|
| A, «se prueba con un caso más» (la nota que más pesa) | Toda la unidad dice lo mismo: la regla sale de cómo se arma; un caso más se **comprueba** y, si falla, descarta (ideas 2 a 5, regla, Mira, ejemplos, «Así se resuelve»). Prueba sobre todos los textos (A1). |
| A, regla de la idea 1 | La llave «lo que agregan los pasos» encierra «paso × (n − 1)» (M5). |
| A, ⇏, fórmula partida, «Vale si» | Regla «[un caso que falla] (contraejemplo) la descarta»; «Vale si» en palabras (M6). |
| A, 31 pedazos | Mira dice «con la lupa se ven todos». No se numeran: no caben (Gerson revisa). |
| A, 1681 | La solución escribe 40 × 41 + 41 = 41 × 41 (B5). |
| A, puntitos grises | Leyenda «velita: el círculo del borde, con su llama» (B3). |
| A, figura 1 de las chapitas | Sin turquesa en Mira: no agrega nada (B7). |
| A, «lineal» | «Agrega 4, 6, 8: no siempre lo mismo» (M8). |
| A, «Figura 4» en Mira; «Tres casos» con cinco; la torta de Lee | No se tocó: Mira arma la figura paso a paso; el título es el de la idea; mover las velitas cambiaría la torta de 6 (la prueba de la pieza la fija). |
| B, Datos que regalan (tarjetas 06 y 07) | Fuera «El 2 es primo» y la fórmula de la figura n; el cierre de la 06 es exacto (M2). Los Datos «1, 8 y 27» de Predice se quedan: son casos, no la regla. |
| B, seises y unos | La forma del resultado (cuatros, un 3, cincos y un 6…) y «vale hasta 9 unos; con 10, hay llevadas» (M10). |
| B, «23 entre 4» | «17 entre 5 da 3 y sobran 2» en teoría y práctica (M4). |
| B, falta Roja | Pulseras de 4 o 5 colores, bloques de 4 a 6 cifras y más errores con nombre: 4 opciones en toda semilla (M3). |
| B, n en la regla de la idea 5 | «Para n cifras repetidas…» (B9). |
| B, promedio en filas pares | Nota «su promedio» y el «Vale si» con (15 + 17) ÷ 2 = 16 (B8). |
| B, «(30 cifras 9)» | «(30 cifras 9 cada uno)». |
| B, tarjetas 03, 09, 12 y 15 | 03: «21 sale de repartir 152 entre 7, como si cada columna tuviera sus 7 fósforos»; 09: «Filas por columnas: 1 × 3, 2 × 4, 3 × 5»; 12: «2 × 2 × … × 2, con n − 1 doses»; 15: la forma del resultado y «el 3 y el 6, que no se repiten». |
| B, mostacilla 12; tarjeta 13 con «?»; Mira de la idea 5; tarjeta 04; mostacillas sin color; dibujo de latas que cambia | No se tocó: la marca es la de los lugares que cierran ciclo; los ejercicios nunca muestran el resultado; la pantalla de Mira es el caso de prueba que el paso 2 nombra; la 04 es de nivel 1; los colores de las mostacillas y las latas son dibujos de prueba (Gerson). |
