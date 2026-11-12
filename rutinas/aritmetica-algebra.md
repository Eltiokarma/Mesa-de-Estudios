# Rutina de aritmética y álgebra: reporte

Sesión paralela, en la rama `rutina/aritmetica-algebra` (sale de `claude/awesome-wozniak-5etl1n` en 47a694b), 8 nov 2026. La meta de Gerson: que toda pregunta de aritmética y álgebra de la admisión real de San Marcos (`docs/datos/admision-unmsm.csv`) que estaba en «medio» quede en «si».

Regla 5: no se abrió ningún PDF. El CSV y las trampas de `docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md` se usaron solo como mapa (tipo de problema, «falta», «resumen», «trampa»). Los enunciados, números, contextos y soluciones son propios.

## Qué se construyó

Diez generadores nuevos de formato «predicciones» (`nucleo/predicciones.js`). Los 113 huecos son casi todos paramétricos, así que no hizo falta ninguna escena nueva. Tampoco se tocaron las escenas que ya existían; los generadores las complementan y miles de problemas propios salen de cada uno.

| Generador | Unidades (la principal primero) | Tipos | Casos | Papel | Pruebas | Filas |
| --- | --- | --- | --- | --- | --- | --- |
| `ecuaciones-polinomiales` | ecuaciones polinomiales, factorización, complejos | Cardano-Vieta (cuadrados, cubos, tercera raíz, progresión), caja cúbica (dimensiones y recorte), bicuadradas (consecutivos, precio, raíces imaginarias), dos modelos igualados, parámetro por raíz y P(x) = d, raíz triple, conjugadas complejas e irracionales, divisores binómicos | 18 | 10 | 29 | 13 |
| `inecuaciones-planteo` | inecuaciones, números reales, valor absoluto, programación lineal | planteo con solución entera única (ventas, dos personas), dos incógnitas enteras (única y máximo), cuadrática de planteo, áreas (perímetro común, dos rectángulos), discriminante (menor entero, pelota y malla, signo constante), móviles, acotar una homográfica y k/(x² + c), medias aritmética y geométrica con cercos, desigualdad triangular, programación lineal entera | 22 | 10 | 32 | 16 |
| `division-polinomios` | división de polinomios, factorización | cocientes notables (exponentes, término central, fila, término k, coeficiente), resto por divisor cuadrático, identidad de la división en 0 y en 1, parámetros para división exacta, caja y teorema del resto, MCD y MCM mónicos (valor, MCM dado, grado) | 18 | 10 | 26 | 9 |
| `funciones-dominio-rango` | funciones, tipos de funciones e inversa, exponenciales y logaritmos | composición en cadena (evaluar y despejar), logaritmo entero (ingreso y cifras), área entre ⟦x⟧ y \|x\|, costo de un tanque, logístico, rango con exponencial y valor absoluto, dominios con radicales anidados e irracionales, racional simplificable, restringir para inyectividad, dominio de logaritmos con base variable, clasificar funciones de contexto, monotonía V/F | 24 | 10 | 32 | 12 |
| `sistemas-ecuaciones` | sistemas, lineales y cuadráticas, exponentes, matrices, valor absoluto | intercambio de trabajo con pagos, soluciones enteras positivas, parámetro con discriminante, Vieta con raíces transformadas, franja alrededor de un rectángulo, exponenciales con dos variables, Vandermonde con Cramer, potencias de matriz y traza, valor absoluto en contexto | 22 | 10 | 31 | 10 |
| `fracciones-problemas` | números racionales, MCD y MCM | fracciones acotadas, irreducibles PESI, porcentajes periódicos, fracción del resto con cotas, equivalentes, trabajo con rendimiento que cambia, fracción más cercana, formar fracciones, cifras del periodo, suma entera, tipo de decimal, PG con MCD, Euclides por exceso | 19 | 10 | 25 | 13 |
| `estadistica-datos` | estadística, sucesiones y series | dato extremo con promedio y cota, mediana y moda contra la media, reconstruir datos (cinco y seis, con incógnitas; únicos por enumeración), varianza y desviación de aX + b, MA, MG y MH, promedios de subconjuntos | 22 | 10 | 31 | 8 |
| `porcentajes-planteo` | porcentajes, razones, magnitudes, mezclas, conjuntos | variación porcentual de área y volumen, partes de un total, Carroll y tablas de doble entrada (con periódicos), simplificar conjuntos, sistema con porcentajes, extracciones sucesivas, ventas por tramos y ganancia sobre costo o venta, encadenados, afín contra proporcional, llegadas que cambian la razón, sobrante con conversión de volumen | 19 | 10 | 29 | 12 |
| `probabilidad-conteo` | probabilidades, análisis combinatorio | Bayes con dos y tres causas, exactamente k (distintas y binomial), bloques en una probabilidad, traspaso entre urnas, ronda y fila con bloques que se permutan | 17 | 10 | 24 | 9 |
| `numeros-sucesiones` | sucesiones y series, divisibilidad, primos y divisores, numeración, potenciación | intercalada, PA enlazada con PG, fracciones con dos leyes, términos comunes, sumatorias (cuadrados, productos, cubos), grupo que falta por divisibilidad, afirmaciones sobre divisores, primos en PA, numerales con cifras repetidas, grifos con cifras en otra base, cubos en otra base | 19 | 10 | 28 | 11 |

Cada generador trae:
- `generador.js` (UMD, sin DOM), con la lista de tipos y la fila que cubre cada uno en la cabecera;
- `generador.test.js`: `probarGenerador` con 600 semillas y un **recálculo independiente por otro camino** (fuerza bruta, enumeración, división larga, Durand-Kerner, simulación, integración numérica, `parseInt` en otra base…), más pruebas de propiedades: salen todos los tipos, todas las alternativas con la misma forma, ningún distractor da la correcta, datos creíbles, textos limpios, un color por variable y el papel recalculado;
- `casos.json`, verificado a ciegas;
- `papel.json` con 10 problemas propios (regla 6), cada respuesta recalculada en la prueba;
- `plantilla.json` (formato `predicciones`, borrador 0.1.0) con un título neutro, que no regala la respuesta ni el método.

Cada problema es una predicción que bloquea: el alumno elige antes de ver la solución (`app/practica.js`). Cada alternativa incorrecta sale de un error con nombre, explicación y respaldo. Los colores son `c-o`, `c-i`, `c-h` y `c-d`, uno por variable dentro de cada problema.

## Método

Se siguió `docs/metodo/`, con cuatro manos por generador, todas subagentes:
1. **Constructor**, con un brief común para generadores y su grupo de filas del CSV.
2. **Verificador a ciegas.** Recibió cada problema de `casos.json` en texto, sin la clave; lo resolvió sin leer el generador y después comparó. **Coinciden los 200 casos de los diez generadores.** Los casos que cambiaron después de la revisión (14 entre cinco generadores) los recalculó a mano la conversación principal y queda anotado en el `verificacion` de cada `casos.json`.
3. **Revisor de contenido.** Revisó 25 semillas completas y, por su cuenta, miles más. En ningún generador encontró una respuesta correcta mal calculada. Sí encontró explicaciones que no describían su error, distractores imposibles o que se descartan solos, claves de color que nombraban dos cosas, plurales, verosimilitud y respaldos mal amarrados.
4. **Correcciones**, enviadas al mismo constructor.

Casos graves que salieron en la revisión y ya están corregidos:
- `estadistica-datos`: números sueltos en los segmentos de la solución, que `app/practica.js` mostraba como «undefined». Desde ahí, todos los generadores prueban en 600 semillas que cada segmento es texto o `{v, t}` con una clave declarada. Un barrido de 3000 semillas en los diez da limpio.
- `funciones-dominio-rango`: dos distractores cuya explicación no correspondía al valor.
- `sistemas-ecuaciones`: «vale 4, no 4» en las potencias de matriz con a = 2.
- `inecuaciones-planteo`: códigos AR5, AL19 y AL1 puestos a errores que el informe no describe.

**Playwright** se corrió sobre una copia del repo con el catálogo armado; aquí no se corrió `npm run catalogo` sobre `app/datos/`. Para cada generador se recorrió la práctica (entrada, 4 problemas con su retroalimentación) y el papel, a 390 × 844 y 1366 × 768, en claro y en oscuro. No hubo errores de consola ni desbordes, y el papel muestra los 10 problemas. La cabecera de la práctica es el título de `plantilla.json`: ninguno nombra el método ni la respuesta.

## Respaldo de los distractores

- **Ningún distractor quedó como «documentado».** AR1 y AR7 lo estaban en `porcentajes-planteo` y bajaron a «parcial», porque el dato del informe es de otra forma del error.
- **Parcial**, cuando el error es la cara numérica de uno del informe: AR3, AR4, AR13, AR15, AR17 (la ronda contada como fila), AR20, AL8, AL9, AL19 (solo cuando se toma como respuesta la raíz de la ecuación asociada), AL21, AL22, AL28 y AL31.
- **El resto son hipótesis con id descriptivo.** Hay trampas inferidas que no tienen código en `docs/investigacion/`: Bayes con la condicional directa, bloque sin permutar por dentro, poste y valla, una sola ley en la intercalada, signo del discriminante invertido, vértice no entero en programación lineal, esquinas de la franja contadas dos veces, MCD con la mayor potencia, resto evaluado en el coeficiente, y más. Entran como hipótesis con un id nuevo, para que la medición del colegio las confirme o no.

## Cobertura, contada en el CSV

Solo se tocaron filas de aritmética y álgebra. En el CSV el id de fila no es único entre cursos, así que la actualización filtra también por curso.

| Curso | Antes: si / medio | Después: si / medio |
| --- | --- | --- |
| Aritmética | 130 / 54 | 184 / 0 |
| Álgebra | 101 / 59 | 160 / 0 |

Cada fila marcada lleva en `modulo` el id del generador nuevo.

## Coberturas que conviene mirar

Estas filas se marcaron «si» porque su campo «falta» queda cubierto. Pero el tipo de la academia trae un giro que el generador presenta de otra forma:
- **2025-I medicina #38** (división): la identidad de la división se evalúa en 0 y en 1, pero no hay una variante con un exponente desconocido.
- **2025-II #42** (factorización): se pide la raíz no entera de la cúbica, no asignar α < β < γ dentro de una expresión.
- **2024-I medicina #32** (medias): con el producto fijo, «dados» pide la menor media aritmética.
- **2023-II #33** (estadística): se pide el mayor o el menor valor posible del mayor dato, no el menor dato.
- **2025-II medicina #40** (sistemas): la «cota de gasto» del resumen no se modeló; se cubre aˣ·bʸ = pᴺ con una condición lineal.
- **2021-09-11 #37** (inecuaciones): «el mayor número posible» en vez de la razón entre dos máximos.
- **2022-03-19 #34** (divisores): N va como producto de potencias, no como diferencia de cuartas potencias.
- **La trampa 52/AL17** (aceptar el parámetro que vuelve incompatible el sistema) no la usa ningún generador.

## Cambios en núcleos compartidos

Ninguno. No se tocó `nucleo/`, `app/` ni `VERSION`.

## Para la integración

- `npm test`: 5051 en verde y 1 falla, `app/datos/catalogo.json está al día`, que se arregla con `npm run catalogo` al integrar.
- La rama ya agrega los diez ids a sus unidades en `catalogo/cursos/aritmetica.json` y `catalogo/cursos/algebra.json`. Falta correr `npm run catalogo` y subir `VERSION` en `app/sw.js`.
- Cursos con 4 plantillas o más: revisar el banco de entrada y salida (`catalogo/pruebas/<curso>.json`), que exige máximo 2 ítems por plantilla. Los generadores nuevos no agregan ítems al banco.
- Ojo: `node --test plantillas/<id>/` (con la carpeta) falla en Node 22 con MODULE_NOT_FOUND; se corre con el archivo `generador.test.js`. `npm test` sí los encuentra.

## Lo que queda

- En aritmética y álgebra no queda ninguna fila en «medio».
- Detalles menores que no se corrigieron:
  - en `porcentajes-planteo` hay ids `AR5-…` que van como hipótesis para «responder otra cantidad». No inflan el respaldo, pero el prefijo apunta a un error del informe más angosto;
  - el «(3m)» recargado en el discriminante de `sistemas-ecuaciones`.
- Lo que mida el colegio dirá cuáles de los cerca de 300 ids de hipótesis son errores reales.
