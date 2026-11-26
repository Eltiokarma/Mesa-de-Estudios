# Lector en frío: «Potenciación y radicación» (aritmetica.potenciacion-y-radicacion)

26 nov 2026. Dos lectores en frío, solo con capturas a 390 px (`capturas-teoria.js … momentos,ejemplos --entera
--lector`, ninguna pantalla de error): A, ideas 1 a 3 y tarjetas 01 a 09; B, ideas 4 a 6 y tarjetas 10 a 18. Los dos
rehicieron las cuentas y todas cuadran. Informes completos en el scratchpad de la sesión (`cierre-aritmetica/frio-a.md`
y `frio-b.md`); aquí, lo que señalaron y cómo quedó. De Lee, Mira y «Así se resuelve» vieron solo la primera tarjeta o
el primer paso: varias dudas (qué es la cáscara, qué es rₑ, el cubo perfecto) se responden en una tarjeta que no vieron.

## Lo que señalaron

**Lector A.** Juega 1 no dice cómo salen 8 filas de 9 de 2³ y 3²; la regla 1 trae el cubo perfecto «de golpe»; la
Predice de la idea 2 se responde por «entre dos cuadrados seguidos» y no por la cifra final que se jugó, y las
calculadoras con 1 936 y 2 025 más los Datos casi la regalan; la caja de la regla 2 partida («se / descarta»); la «e» de
rₑ sin explicar en Juega y rₑ sin color; el «Vale si» de la idea 3 («rₑ solo se usa si N no es cuadrado») choca con
r + rₑ = 2k + 1, que parece valer siempre; tarjeta 03 «cualquier 3 por un cuadrado» sin porqué; tarjeta 04 salta a 49
sin decir 4 900 = 49 × 100; tarjeta 08 con colores sueltos; tarjetas 07 a 09 de bandeja sin dibujo; los Datos de la 09
(«a lo más 2k») casi regalan el planteo.

**Lector B.** «Cáscara: Pegada / Aparte» sin decir qué es; «r = 216» encimado y tachado por los cubitos en Mira y la
regla 4, que choca con el 217 recién predicho; los circulitos vacíos del juego 5 sin leyenda; la regla 5 trae cubos,
sextas potencias y «cuadrados o cubos» sin práctica antes; en el juego 6 no queda claro si la recta mide N o la raíz;
«la raíz no se reparte en una suma» en el «Vale si» de la 6 y la tarjeta 16 (√(36 + 64)) parecen de otra idea; tarjeta
12 con una trampa que usa 2k + 1, no visto en esa idea; tarjeta 14 con 49 pegado al extremo 50; tarjeta 17 empieza en
1,72 sin decir por qué; los Datos de la 11 dejan todo hecho.

## Correcciones de la ronda 1

Prueba: «lector en frío, ronda 1» en `contenido/teoria/aritmetica/potenciacion-y-radicacion.test.js` (falla con el texto
anterior). Topes de texto y validador con `calidad: 2` simulada, en verde; ecuaciones a 390 px, todo cabe.

| Lo que trabó | Cómo quedó |
| --- | --- |
| Juega 1: cómo salen las filas | La consigna dice «en filas iguales, con tantas filas como caramelos por fila si se puede: 72 van en 8 filas de 9». |
| Regla 2 partida | «⇒ se descarta» con espacios que no se parten; la herramienta de ancho no la lista más. |
| rₑ sin explicar en Juega | La leyenda dice «rₑ: residuo por exceso: lo que falta». rₑ sigue en tinta: es la decisión de la propuesta (§7: lo que falta va en tinta y punteado, para no juntar dos colores en la bandeja). |
| «Vale si» de la idea 3 | «rₑ y r + rₑ = 2k + 1 solo se usan cuando no lo es». |
| Tarjeta 03 (idea 1, «El menor de dos cifras») | «Sirve cualquier 3 por un cuadrado, porque un cuadrado solo suma exponentes pares»; el «12 = 3 × 2²» ya no se parte después del «=». |
| Tarjeta 04 (idea 2, «Dos ceros al final») | «4 900 = 49 × 100, y 49 = 7² y 100 = 10²». |
| Tarjeta 08 (idea 3, «Los dos residuos de 130») | k y r con su color (k = 11 en violeta, r en carmín); rₑ en tinta, como en toda la unidad. |
| Cáscara sin explicar | Leyenda del juego 4: «cáscara: los que sobran, que empiezan el siguiente» (además de la tarjeta 3 de Lee). |
| «r = 216» en Mira y regla 4 | El dibujo de la cáscara va sin ese rótulo (opción `sinR` de `cuboDe`). Captura revisada. |
| Tarjeta 12 (idea 4, «Completar el cubo») | «**E** copia el 2 × 6 + 1 de las bandejas cuadradas» (la idea 3, que ya se vio). |
| Circulitos vacíos del juego 5 | Leyenda «○: un cuadrado perfecto fuera del tramo». |
| Tarjeta 14 (idea 5, «Bandejas sin sobrantes») | El tramo pasa a 55–160 (sigue dando 5: de 8² a 12²): ningún cuadrado queda pegado a un extremo. Los circulitos vacíos se quedan: pintar los de adentro diría cuántos son. |
| Juega 6: qué mide la recta | La consigna termina «La recta mide N y los cuadrados». |
| «Vale si» de la idea 6 | «N es positivo, y el error es menor que el paso. Si N es una suma, primero se suma: la raíz no se reparte, √(9 + 16) = 5, no 7.» Queda dicho como un caso de N, que es como lo pregunta el examen. |
| Tarjeta 17 (idea 6, «√3 por centésimas») | Empieza «Se prueban centésimas desde 1,71: 1,71² = 2,9241 y 1,72² = 2,9584 caben…». |
| Calculadora de la idea 6 (lector B la vio con 1,4142135) | Corregida por la auditoría: ahora muestra √6. |

**Se quedan, con la razón (decidido por la sesión, Gerson revisa después):**
- **Predice de la idea 2** (2 021 entre 44² y 45²): lo que se juega es la cifra final, y la Predice pregunta justo si
  esa cifra basta; los Datos con 44² y 45² son la herramienta para decir que no. Quitarlos obliga a sacar raíces de
  cabeza. Se queda como la propuesta la decidió.
- **Cubo perfecto en la regla 1** y **cubos, sextas potencias y «cuadrados o cubos» en la regla 5**: la regla dice todo
  lo que piden los ejercicios (molde §2), y el cubo perfecto lo presenta la tarjeta 2 de Lee de la idea 1, que el
  lector no vio. No se agregó un paso de Mira.
- **Datos con la fórmula** (tarjeta 09, «a lo más 2k»; tarjeta 11, 3k² + 3k + 1): son la fórmula que se usa, que el
  contrato pide dar (punto 13); el ejercicio practica usarla.
- **Tarjetas 07 a 09 y 12 sin dibujo**: un dibujo de la bandeja con los lugares punteados mostraría la respuesta
  (cuántos faltan). Queda para la galería de Gerson.
- **Tarjeta 16** (√(36 + 64)): es el error E-RSUMA, que la idea 6 trabaja como trampa de examen (propuesta §5).
- **Circulitos encimados cerca de 0 (juego 5) y en el tramo de 4 a 4,41 (juego 6)**: es la escala de la recta (0 a 200 y
  0 a 22) en la pieza común `recta`; no se toca desde la unidad.
