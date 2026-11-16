# Lector en frío: fisica.magnitudes-y-vectores («Magnitudes y unidades» desde el 16 nov)

Método: `docs/plan-calidad.md`, filtro 2. Un agente sin contexto hace de alumno de 5.º y ve solo las capturas a 360 × 780.

## Idea 1, «Otra unidad, otro número»: Juega (16 nov 2026)

**Aprendizaje esperado (no se le mostró):** el poste mide lo mismo en cualquier unidad; cambia el número: en decímetros es 10 veces más y en centímetros, 100 veces más.

**Lo que dijo que aprendió:** «El poste mide lo mismo; lo que cambia es el número según la unidad, porque 1 m = 10 dm = 100 cm, así que de metros a centímetros multiplico por 100 (6,5 m = 650 cm).» Coincide.

**¿Sin profesor?** «Sí. La misión y la leyenda se entienden solas.»

**Lo que señaló y cómo se corrigió:**

| Señal del lector | Corrección |
| --- | --- |
| Las etiquetas «7,4 m», «74 dm» y «740 cm» tapan a medias los números 8, 80 y 800 de las reglas. | La regla no escribe el número que caería bajo la etiqueta. |
| El botón fijo «Siguiente» tapa el pie de la figura. | La figura bajó de 380 a 334 de alto. |
| «Casos probados: 1 de 3» no se entiende. | Dice «Prueba 3 valores distintos: llevas 1.» (en todas las unidades). |
| La pregunta de Tilo («¿cambia el poste o el número?») confunde, porque en el juego el poste sí cambia al mover la barra. | Ahora pregunta: «Mira las tres reglas: ¿marcan alturas distintas o la misma altura con otro número?». |
| No se sabe cuánto vale cada rayita chica ni cuánto baja cada toque del −. | Pendiente: decidir con Gerson si hace falta. |
| El subrayado punteado bajo «L» (término del glosario) no se sabe si se toca. | Pendiente: es de toda la app, no de esta idea. |

## Idea 1 completa: Lee, Predice, Mira, La regla, Así se resuelve y Ahora tú (16 nov 2026)

Se rehízo el resto de la idea:
- **Lee:** se agregaron 4 tarjetas.
- **Combi:** la de Predice, Mira y Así se resuelve se dibuja con una pieza nueva, `fis-combi`.
- **La regla:** se liga al poste y a la combi.
- **Ejercicios:** largos y rapidez, con situaciones creíbles.

Pasaron tres lectores en frío, cada uno nuevo.

**Primer lector («más o menos»).** Encontró:
- en «Mira», el botón grande llevaba a «La regla» desde el paso 1, y se saltó la explicación;
- en «Así se resuelve», el paso nuevo quedaba bajo el botón;
- un salto del poste a los km/h sin presentar las unidades compuestas;
- frases genéricas de Tilo («Antes de mover nada», «Ya tenemos modelo», «Escena nueva, sin el juego»);
- un bus a 144 km/h, que no es creíble.

Todo se corrigió:
- «Mira» avanza con «Paso N de M» (vale para todas las unidades);
- el paso nuevo de «Así se resuelve» queda a la vista (también en todas);
- una tarjeta de «Lee» presenta las unidades compuestas;
- las voces de Tilo cambiaron, y en todos los compañeros «la ficha» pasó a ser «el resumen»;
- los ejercicios usan rapideces creíbles.

**Segundo lector («más o menos»).** Aprendió el método solo y resolvió bien el caso final (108 km/h = 30 m/s). Le quedaron tres preguntas para un profesor:
1. De dónde sale el 3,6.
2. Por qué 1000 m sobre 1 km «vale 1».
3. Cómo se usan los m², que se mencionaban sin ningún ejemplo.

Se corrigió así:
- «Mira» tiene ahora 6 pasos: uno dice que 1000 m y 1 km son el mismo largo, y otro, que por 1000 y entre 3600 es lo mismo que entre 3,6;
- la explicación del error en «Predice» ya no nombra el 3,6 sin contexto;
- las conversiones de áreas y volúmenes salieron de esta idea: llegaban sin preparación. Se proponen para otra idea al reordenar la unidad.

**Revisión a mano de las cuentas** (semillas de «Así se resuelve» y «Ahora tú»):
- 54 km/h = 15 m/s;
- 90 km/h = 25 m/s;
- 108 km/h = 30 m/s;
- 18 m = 1800 cm;
- 8,5 m = 850 cm;
- 55 min = 3300 s;
- 25 m/s = 90 km/h;
- 15 m/s = 54 km/h.

**Tercer lector («más o menos»).** Aprendió la receta (dividir entre 3,6), pero no la idea de los factores. Le faltaba saber:
- por qué 1000 m sobre 1 km «vale 1»;
- por qué la fracción de la hora sale al revés en «Mira» y en «La regla»;
- qué es el «·».

Se corrigió así:
- «Mira» es ahora una cadena de 7 pasos donde las unidades se tachan arriba con abajo; `{ tacha }` es nuevo en `nucleo/ecuacion.js`;
- la regla dice cómo se pone cada factor («arriba si estaba abajo, y al revés»);
- la multiplicación se escribe «×»;
- Tilo ya no dice «Nuestra predicción»;
- se quitó la arroba de «Lee».

**Cuarto lector («más o menos, tirando a sí»).**
- **Lo que logró solo:**
  - resolvió el caso final con los factores tachando unidades (108 km/h = 30 m/s);
  - armó solo el caso al revés con la regla, sin que se lo enseñaran (10 m/s = 36 km/h).
- **Lo que señaló, ya corregido:**
  - por qué 1000 m entre 1 km da 1: ahora «algo entre algo igual da 1»;
  - de dónde salió su error: la explicación muestra 72 × 3,6;
  - de dónde sale el 3600: ahora «60 × 60 s»;
  - el kilogramo de «Lee», que no se usaba: se quitó;
  - la respuesta del ejemplo resuelto: queda a la vista.
- **Lo que queda pendiente (es de toda la app):**
  - el botón fijo tapa parte del contenido hasta que se baja la pantalla;
  - las palabras del glosario, subrayadas con puntos, no dicen que se pueden tocar.

## Idea 2, «Áreas y volúmenes» (nueva, 16 nov 2026)

Se arma con la pieza nueva `fis-area`:
- el mismo piso, lado a lado, con cuadros de 1 m y de 1 dm;
- Mira cierra con un cubo de 1 dm³ = 1 L y con 1 m³ = 1000 L;
- los ejercicios son de chacras en hectáreas, pizarras, tanques del techo de 600 a 2500 L y botellas.

**Primer lector («más o menos»).** Aprendió a multiplicar, pero le faltaba:
- qué es el «factor»;
- la conversión al revés: de chica a grande se divide;
- el m³.

Además, la misión se cumplía llevando la barra al máximo, y «Ahora tú» era igual al ejemplo resuelto. Se corrigió así:
- glosario «factor de conversión»;
- la regla dice cuándo se multiplica y cuándo se divide, y su condición dice cuándo no vale;
- un paso de Mira con el m³;
- la misión pide 625 dm²;
- «Ahora tú» trae otro tipo de caso que el ejemplo;
- los miles ya no se parten en dos renglones, en todas las ecuaciones de la app;
- el paso nuevo de Mira queda a la vista.

**Segundo lector («más o menos»).**
- **Lo que logró:** aprendió la idea («100 en una fila, pero hay 100 filas») y resolvió el ejercicio (2500 L = 2,5 m³). Inventó casos en las dos direcciones y los resolvió bien.
- **Lo que pidió:** que la hectárea se presente antes. Ahora va en una tarjeta de «Lee».
- **Lo que no es un problema de la app:** lo que vio tapado lo causaba el script de capturas, que sube la pantalla en cada paso.

**Revisión a mano de las cuentas:**
- 2,5 ha = 25 000 m²;
- 2,4 m² = 24 000 cm²;
- 1100 L = 1,1 m³;
- 625 cm³ = 0,625 L.

## Idea 3, «Las dimensiones deben cuadrar» (rehecha, 16 nov 2026)

Se rehízo sobre una balanza (pieza nueva `fis-balanza-dim`): a cada lado de una fórmula real, de qué está hecho ese lado, escrito en letras. Así se reemplazaron las «fichas huecas que dividen». En el juego se prueban fórmulas de la distancia de una combi, y la misión es encontrar la que lleva aceleración.

**Primer lector («más o menos»).**
- **Lo que logró:** entendió la balanza y despejó bien la dimensión de k en el ejercicio final ([k] = M L⁻²). Comprobó solo dos fórmulas: una real (v² = 2ad, cuadra) y una inventada (d = v²t, no cuadra).
- **Lo que le frenó, ya corregido:**
  - no sabía la dimensión de la aceleración: ahora va en la leyenda, junto con la de la rapidez;
  - no sabía qué son los corchetes: ahora la leyenda dice «la dimensión de»;
  - la opción «m/s², sin dimensión» se contradecía: ahora dice «Ninguna: k es solo un número»;
  - la condición se leía mal detrás del «Vale si»;
  - no sabía de dónde salen las dimensiones de la energía y de la presión: ahora el ejemplo resuelto lo dice («fuerza por distancia»);
  - no sabía qué pasa con L² ÷ L²: ahora dice que lo que queda con 0 desaparece;
  - «Prueba 3 valores» no calzaba cuando son opciones: ahora dice «casos».
- **Pendiente:** fórmulas con sumas (d = v t + ½ a t²), donde cada término debe cuadrar por separado. Se puede agregar como un tipo de ejercicio más.

## Ronda del Resumen (16 nov, tarde): «Palabras de esta idea»

Capturas del Resumen en celular (360 × 780) y de la hoja al tocar «unidad» y «dimensión». Lector nuevo, sin el código.

- **Veredicto:** «Sí. La idea 1 se entiende sola con el dibujo del poste y las tres reglas. Para la idea 2 y la idea 3 llegaría con dudas».
- Explicó con sus palabras medir, unidad, magnitud, factor de conversión, área, litro, dimensión, fórmula y constante.
- Hallazgos corregidos en la misma ronda:
  - la leyenda nombraba símbolos que no estaban en la figura (la A del área; a, T⁻¹ y [ ] en la balanza): el Resumen muestra solo los que se ven;
  - la pregunta de áreas hablaba de cm² y la figura de dm²: ahora «¿Por qué un metro cuadrado no son 10 decímetros cuadrados?»;
  - la balanza del Resumen mostraba d contra v / t sin explicar por qué no cuadra: ahora va con d = v · t (`juega.resumen`);
  - L era el alto del poste en la idea 1 y la longitud en la idea 3: el alto del poste pasa a llamarse h;
  - el aviso decía que la regla aparece al terminar, junto a un botón «Ver la regla»: el aviso ahora dice que se puede ver antes;
  - la hoja abierta desde la caja repetía la misma aproximación: ahí ya no la repite;
  - «se mida en m/s» y «sin mirar la unidad» en «dimensión»: reescritos;
  - los subrayados del glosario dentro de la leyenda recargaban: la leyenda ya no se marca.
- Pendiente: volumen y hectárea no tienen dibujo en el Resumen; el factor de conversión dice qué es, no cómo se usa (eso lo enseña la idea 1).
