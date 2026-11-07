# Rutina de matemática B (geometría, aritmética y razonamiento matemático): reporte

Sesión paralela a la conversación principal, en la rama `rutina/matematica-b`. Orden de la lista: sólidos, geometría analítica, interés, relojes y calendarios, congruencia. No toca polígonos, fracciones ni orden de información, porque esos los hace la conversación principal. Cada plantilla pasa por tres subagentes: constructor, verificador independiente de casos (sin leer el motor) y revisor de contenido.

## 6 nov 2026 · El sólido que se abre (`plantillas/solidos/`)

**Qué hice.**

- **`motor.js`** (UMD, sin DOM) tiene:
  - las funciones de cada sólido: `prisma`, `piramide` (con h o con ap), `cilindro`, `cono` (con h o con g), `conoDeSector`, `esfera` (con el cilindro circunscrito), `troncoCono` y `troncoPiramide`;
  - las de conteo: `bloque` (cubitos visibles, ocultos y caras pintadas), `cuboPintado`, `poliedro` (Euler), `aristasUnicas` y `hojaEnrollada`;
  - `desarrollo(tipo, d, f)`: abre el sólido en 3D con un árbol de bisagras rígidas, de f = 0 (cerrado) a f = 1 (plano);
  - `tresPiramides`: la caja partida en tres pirámides iguales (Cavalieri), con el vértice que se corre.

  Los valores son exactos: con círculos, sale el coeficiente de π. Cada resultado trae `errores` y `coinciden`.
- **`casos.json`:** 19 casos con sus «tambien», entre ellos los casos 8 y 9 del informe de geometría y el ejemplo de GE13.
- **`motor.test.js`:** 41 pruebas.
  - Del desarrollo: las bisagras no se despegan, las caras son rígidas, el área no cambia al abrir y f = 1 queda plano y sin caras encimadas.
  - Medidas: el rectángulo 2πr × h y el sector de 360°·r/g.
  - Volúmenes y conteos: las tres pirámides llenan la caja y lo visible más lo oculto da el total.
  - Ningún error coincide con la respuesta (300 parámetros al azar).
  - Bordes: cubo de 1 y 2, bloques con un lado 1, ap ≤ apotema de la base, g ≤ r, sector de 0° o 400°. Además se valida el papel.
- **`papel.json`:** 10 problemas propios: caja, pirámide, cono r 8 h 6, lata por el diámetro, sector de 240°, esfera inscrita, bloque 5 × 4 × 3 pintado, vaso troncocónico, Euler y cartulina enrollada.
- **`index.html`, paso a paso** (8 pasos, 6 predicciones que bloquean):
  1. la caja que se abre (exploración);
  2. los cubitos de la caja 3 × 2 × 4 (GE13 y GE14, ambos parcial);
  3. el área lateral de la pirámide de base 6 y h 4: 60, contra 48 de GE21;
  4. su volumen: 48, contra 144 de GE20, y la caja que se parte en tres;
  5. el largo de la etiqueta de la lata (GE19);
  6. el área lateral del cono r 3, h 4 (15π), que se abre en un sector de 216°;
  7. la esfera dentro del cilindro (2/3);
  8. el explorador.
- **`index.html`, «¿qué pasa si…?»** (5 experimentos):
  1. la misma hoja, dos cilindros (bajo y alto);
  2. el semicírculo que se hace cono;
  3. el cubo 6 × 6 × 6 pintado;
  4. el vaso (tronco de cono);
  5. las aristas del prisma hexagonal.

  Las pastillas y los puntos están bloqueados, con `disabled`, `aria-disabled` y «… bloqueado».

**Pruebas.** `npm test`: 1310 en total, 1308 pasan y fallan solo `app.test.js` y `catalogo.test.js`, que se esperaba porque la plantilla aún no está en el catálogo. Playwright recorrió los dos modos a 1366 × 768 y 390 × 844, en claro y en oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes, y el dibujo queda fijo arriba en el celular.

**Subagentes.**

- **Verificador independiente** (no leyó el motor). Recalculó los 19 casos originales y los 10 problemas de papel con fracciones y un segundo método en cada caso: conteo celda por celda, Herón, área por coordenadas y cono grande menos cono chico. Encontró **0 discrepancias**. También pidió:
  - evitar alternativas que coinciden entre sí: en la esfera de r = 3, el área y el volumen dan 36π; en el cono de p3, A_T = V;
  - casos de borde.

  Apliqué todo. Los casos nuevos (cubo de 6, bloques 5 × 4 × 3 y 1 × 3 × 4, p3 y p7) los volvió a verificar por conteo cubito por cubito: 0 discrepancias. Con la convención documentada también cuadran los vértices de `tresPiramides`.
- **Revisor de contenido.** Apliqué casi todo:
  - **Cubo pintado:** el 64 estaba mal etiquetado y el problema repetía el cubo de 5 de la ampliadora. Ahora es un cubo de 6 con distractores 125, 96 y 16, todos hipótesis.
  - **Vaso:** el comentario «no crece parejo» era falso. Además, el dibujo con la punta gris adelantaba el método: ahora antes de responder se ve solo el tronco.
  - **GE13** pasó de documentado a parcial (la cifra del informe es de éxito global, no de cada error) y usa el mismo id que la ampliadora, `GE13-cuenta-visibles`.
  - **«Guardan lo mismo»** ya no se marca como GE14, sino como hipótesis cercana a GE5.
  - **Letras:** los cilindros A y B pasaron a «bajo» y «alto». En Euler hay un aviso de que V y A no son volumen ni área.
  - **Colores:** 2πr y los cubitos sin pintura van en tinta; R del vaso tiene color propio.
  - **No apliqué:** el sólido en L para P1 y un problema de tronco de pirámide en papel (ya hay 10).

**Colores** (claro / oscuro):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| h | #c0364a | #f17384 |
| r | #0f766e | #5ed9c8 |
| ap | #17451e | #40bf59 |
| g | #5f6f00 | #c8dc3c |
| A_B | #a05200 | #f0a04a |
| A_L | #1f5fbf | #7cb0ff |
| V | #a10fbf | #cf6bfa |
| R (vaso) | #7d6a00 | #e3c84a |

- **ΔE00 entre los que salen juntos:** mínimo 25,9 en claro y 26,9 en oscuro. R queda a 11 de g, pero nunca salen juntos.
- **Contraste:** ≥ 5,0:1.
- **Rojo de avisos:** h queda a ΔE00 ≈ 5 del rojo, como en otras plantillas; el aviso siempre va con texto.

**Pendiente.**

- La escena de las tres pirámides separadas se ve cargada.
- El semicírculo se ve raro a mitad del enrollado.
- Lo que no cubre:
  - prisma oblicuo, tronco de prisma y tronco de cilindro;
  - tronco de pirámide en la escena (está en el motor);
  - casquete y zona esférica, y Pappus-Guldin;
  - secciones paralelas a la base y poliedros regulares (tetraedro, octaedro).
- Las cifras de GE13 están por leer en el original.

**Pedidos para la integración.**

1. En `catalogo/cursos/geometria.json`, agregar `"solidos"` a `plantillas` de `geometria.prisma-y-piramide`, `geometria.solidos-de-revolucion` y `geometria.poliedros`. Después, `npm run catalogo`.
2. En `docs/diseno.md`, la tabla de colores de arriba. Además: A_B se lee «base» y A_L «lateral»; 2πr y los cubitos sin pintura van en tinta.
3. En el informe de geometría, GE13 dice «Documentado», pero la cifra es de éxito global: conviene bajarlo a «Parcial», como ya lo usan la ampliadora y los sólidos. La opción de caras visibles usa `GE13-cuenta-caras-visibles`, otro subtipo que la ampliadora no tiene.
4. Para `docs/pendientes.md` y CLAUDE.md: «Sólidos (6 nov 2026): `plantillas/solidos/` (desarrollo plano animado de prisma, pirámide, cilindro y cono; apotema y generatriz contra la altura; tres pirámides llenan la caja; Arquímedes; cubitos ocultos, cubo pintado y Euler; 19 casos verificados aparte; 10 de papel)».
5. Banco de entrada y salida de geometría: sumar ítems de sólidos cuando entre al catálogo (la prueba avisa).

## 6 nov 2026 · El plano con imán (`plantillas/geometria-analitica/`)

**Qué hice.**

- **`motor.js`** (UMD, fracciones exactas, raíces simplificadas, puntos escritos (x; y)):
  - funciones de puntos y rectas: `distancia`, `puntoMedio`, `divide` (AP : PB = m : n), `pendiente`, `recta` en sus tres formas, `rectaGeneral` (enteros primos entre sí, A > 0), `posicion`, `perpendicular` y `paralela`;
  - distancias y áreas: `distanciaPuntoRecta` (con el pie), `distanciaParalelas`, `area` (zapatito) y `ordenCruzado` (los dos lazos);
  - además, `masEmpinada`, `baricentro`, `circunferencia` y `circunferenciaGeneral` (circunferencia, punto o vacía).

  Cada resultado trae `errores`, `coinciden` (errores que dan lo mismo que la respuesta), `repetidos` (dos errores iguales entre sí) y `noAplica`.
- **`casos.json`:** 20 casos con sus «tambien».
- **`motor.test.js`:** 43 pruebas. Hay propiedades con 400 puntos al azar: Pitágoras, AP/PB, m₁·m₂ = −1, el pie sobre la recta y el área como base × altura / 2. También se prueba que ningún error coincide con la respuesta ni con otro error, la validación de entrada y el papel.
- **`papel.json`:** 10 problemas propios: perímetro, extremo dado el punto medio, razón 2 : 3, pendiente y ángulo, ecuación general, perpendicular, el valor de k, punto a recta, área de un cuadrilátero y circunferencia de diámetro AB.
- **`index.html`, paso a paso** (9 pasos, 7 predicciones):
  1. distancia;
  2. exploración con puntos que se arrastran con imán;
  3. punto que divide 1 : 2;
  4. pendiente: el error y/x de un solo punto es G2, parcial (la cifra es de gráficas de movimiento);
  5. exploración de las tres formas, con P₁ y P₂;
  6. b de la recta;
  7. la pendiente perpendicular, con el triángulo que gira 90°;
  8. distancia de un punto a una recta;
  9. área por zapatito en sentido horario.

  En los pasos 1, 8 y 9, antes de responder la figura se dibuja «referencial», sin cuadrícula, para que no se pueda contar la respuesta.
- **`index.html`, «¿qué pasa si…?»** (6 experimentos): la recta vertical, el punto medio con negativos, la V de pendientes 2 y −2, la distancia entre paralelas que hay que igualar primero, el zapatito en orden cruzado y cuál recta está más inclinada.

**Pruebas.** `npm test`: 1433 en total, 1431 pasan y fallan solo las 2 del catálogo, que se esperaba. Playwright revisó cinco configuraciones (1366 y 390, claro y oscuro, con movimiento reducido): sin errores ni desbordes; las pastillas están bloqueadas y el dibujo queda fijo arriba en el celular.

**Subagentes.**

- **Verificador independiente** (no leyó el motor). Usó fracciones y un segundo método en cada caso: A + t(B − A), producto punto, arccos de las normales, Cramer y producto cruz.
  - Primera pasada: 20 de 20 casos y 10 de 10 de papel, sin ninguna discrepancia.
  - Pidió tres cosas, ya aplicadas:
    - el caso vertical, donde restar cuadrados da lo mismo que la respuesta, va en `coinciden`;
    - con m = ±1, dos errores salían iguales entre sí: ahora van en `repetidos`;
    - con Δy = 0, Δx/Δy no existe: ahora va en `noAplica`.
  - Segunda pasada, sobre los casos nuevos (rectas generales con A < 0, con C = 0 y horizontal; distancia 0; paralelas con factor negativo; colineales; baricentro; circunferencia general, punto y vacía): todo OK.
  - Solo se ajustó la perpendicular a una recta vertical: «igual», que da otra recta vertical, quedó como distractor.
- **Revisor de contenido.** Apliqué todo:
  - **Grave:** A y B eran a la vez los puntos y los coeficientes de Ax + By + C = 0, y además chocaban con b. Ahora los puntos son P₁ y P₂.
  - **Medio:**
    - La cuadrícula dejaba contar la respuesta en los pasos 1, 8 y 9: ahora la figura es referencial hasta responder.
    - La opción correcta caía siempre en la misma letra: ahora está repartida.
    - La cita de GE11 decía más de lo que trae el informe: ahora es hipótesis.
    - La frase de AL25 estaba mal armada.
    - m y b no tenían color dentro de las ecuaciones.
    - La escalera de m = −5 se dibujaba subiendo.
    - En el experimento 3, solo la correcta llevaba ángulo.
  - **Menor:** rótulos encimados, el punto móvil sin nombre (ahora U), ecuaciones cortadas en el celular y un guardián en «Siguiente».

**Colores** (claro / oscuro): Δx #a05200 / #f0a04a; Δy #466d14 / #a3d65e; d #a10fbf / #cf6bfa; P y M #0f766e / #5ed9c8; L₁ y m₁ #1f5fbf / #7cb0ff; L₂ y m₂ #c0364a / #f17384; b #77032c / #ffa8b8; área S #7d6a00 / #e3c84a.

- **ΔE00 entre los que salen juntos:** mínimo 22,6 en claro y 20,4 en oscuro.
- **Pares cercanos que nunca comparten dibujo:** S y Δy (17), L₂ y b (12,6 en oscuro).
- **Contraste:** AA en los dos modos.

**Pendiente.**

- Lo que no cubre, por orden de lo más preguntado:
  - circunferencia en la escena (solo está en el papel y en el motor), parábola y elipse;
  - mediatriz y forma simétrica x/a + y/b = 1;
  - tangente a una circunferencia;
  - simétrico de un punto respecto de una recta;
  - ángulo «de L₁ a L₂»;
  - división externa.
- Casi todos los distractores son hipótesis nuestras, porque no hay informe de ideas erróneas de analítica.
- En el paso 5, «b = 5» roza los números del eje cuando P₂ cae sobre él.

**Pedidos para la integración.**

1. En `catalogo/cursos/geometria.json`, unidad `geometria.geometria-analitica`: `"plantillas": ["geometria-analitica"]`. Hoy tiene `investigacion: null`. Después, `npm run catalogo`.
2. En el catálogo, agregar «Área por coordenadas» a los temas de esa unidad, o dejar anotado que la escena lo trae aunque el catálogo no lo liste.
3. `algebra.funciones` podría enlazarse también. No lo puse porque ya la cubre la gráfica con perillas.
4. En `docs/diseno.md`, un párrafo «Variables del plano con imán» con la tabla de colores de arriba.
5. Para `docs/pendientes.md` y CLAUDE.md: «Plano con imán (6 nov 2026): `plantillas/geometria-analitica/` (distancia, punto que divide, pendiente, las tres formas de la recta, paralelas y perpendiculares, punto a recta y zapatito; 20 casos verificados aparte; 10 de papel). Falta un informe de ideas erróneas de analítica y la escena de cónicas».
6. Banco de entrada y salida de geometría: sumar ítems cuando entre al catálogo.
