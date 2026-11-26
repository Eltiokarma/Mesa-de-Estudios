# Auditoría de contenido: «Puntos notables del triángulo» (geometria.puntos-notables)

26 nov 2026. Auditor externo con criterio delegado (cierre de la Etapa 9, `docs/metodo/unidad/cierre-delegado.md`), que no
escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Vara: `docs/molde-unidad.md` §4 y §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa9/propuesta-geometria.md`. Notas del redactor:
`rutinas/redaccion/geometria.puntos-notables.md`. Lo que vieron los dos lectores en frío está en
`rutinas/frio/geometria.puntos-notables.md`; aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/geometria/puntos-notables.js` (sin `calidad: 2`): 6 ideas (baricentro, circuncentro, incentro,
  ortocentro, excentro, euler) con sus 7 momentos, los 90 ejemplos, «Ahora tú» y «Así se resuelve», el glosario y las 3 mesas.
- La práctica nueva `plantillas/geo-puntos-notables/` (24 tipos, `casos.json`, `papel.json` con 8).
- La app a 390 px con `--entera --lector` (servidor propio en el puerto 4235). Capturas de antes en
  `/tmp/claude-0/-home-user-Mesa-de-Estudios/c6e6072f-61c1-5ae4-9fde-081abfdefa41/scratchpad/cierre-geometria/lector/`; de después, en
  `…/cierre-geometria/despues/`.

**Cuentas.** Rehechas con scripts propios en `…/cierre-geometria/aud/`, que no usan el código de la unidad: leen solo el texto.
- `formulas.js`: **2 400 casos** (200 semillas de «Ahora tú» y 200 de «Así se resuelve» por idea) resueltos con fórmulas
  cerradas, otro camino que la prueba de la unidad (que usa coordenadas): 2/3 de la mediana, áreas S/3 y S/6, BG = hip/3,
  R = hip/2 y 2·m∠A, OBC = 90° − A, s − a, r = (a + b − c)/2 y S/s, BHC = 180° − A, HBC = 90° − C, AP por Pitágoras,
  AT = s, BT = BD = s − c, BEC = 90° − A/2 y 180° − BIC, Euler 1 : 2, R/2. Por caso: una sola opción correcta, la marcada, y
  que el triángulo exista. **0 fallas.**
- A mano: **los 90 ejemplos** con sus 30 de nivel 3 y la explicación de cada alternativa (la del 8 cm de Circuncentro 14 no
  existía; ver A2), **las 6 predicciones** con sus distractores (G a 8 de A; O fuera a unos 44,72 m: √(20² + 40²); AF = 3;
  H fuera; 4 circunferencias; O, G y H).
- `escala.js`: **cada figura de ejemplo y de 200 semillas de «Así se resuelve»** medida con la escala de sus rótulos y de los
  lados del enunciado (si son coherentes a 15 %): tramo «?», ángulo pedido con transportador o radio. Ver A3.
- Misiones y lecturas: las comprueba la prueba propia de la unidad en toda su grilla (pasa).
- Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas: 0 problemas) y `herramientas/ecuaciones-ancho.js`
  (antes: 7 partidas después de «=»).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10 | Idea 5, «Así se resuelve» del ángulo BEC (t = 1), paso «¿Tiene sentido?» | «E ve a BC más cerrado que A» es falso con A < 60° (A = 40° da BEC = 70°). Nota Alta del redactor. | Decir lo que siempre vale: BEC sale agudo porque a 90° se le resta la mitad de A. |
| A2 | 10, regla 3 | Idea 2, ejemplo 14 (tarjeta 06 del lector A) | «8 cm usa 10 cm como hipotenusa»: con un cateto de 12 y una hipotenusa de 10 el triángulo no existe. El 8 sale de 20 − 12 (restar los lados en lugar de los cuadrados). | Explicar el 8 por la cuenta que lo da. |
| A3 | 13, lección 5 | Figuras: Baricentro 14 (AG = 8 se mide con la escala de 13 cm), Incentro 7 y 14 (r a escala), Incentro 10 (BIC a 2 %), Ortocentro 1 y 6, Excentro 1, Circuncentro 15 (ángulos con transportador a menos de 15 %); «Así se resuelve» de Incentro (13 de 67 semillas: el isósceles 10, 15, 15 deja F en el punto medio), Ortocentro t = 0 y 1 (fijo: 60 de 67 a menos de 15 %), Excentro t = 1 (22), Circuncentro t = 1 (12) | Lo pedido se lee con regla o transportador antes de razonar; la tarjeta 03 y la 09 del lector A lo hicieron. Además dicen «no está a escala» cinco figuras que sí lo están (lo pedido es la regla misma) y Euler 3 sin dibujo. | Dibujar con otras medidas que las del enunciado (más de 15 % lejos, comprobado en todas las semillas) o elegir datos lejos del dibujo; «no está a escala» solo donde es cierto. |
| A4 | 13 | «Ahora tú» de Ortocentro (BHC y A desde BHC), Excentro (AT, BEC, A desde BEC) y Euler (GH desde OG, y la elección con «equidista de los vértices»); Excentro 3 («son perpendiculares»); Euler 14 | El recuadro Datos trae la relación del caso ya armada (m∠BHC = 180° − m∠A, AT = s, 90° − m∠A ÷ 2, GH = 2 · OG): el ejercicio es una resta (lector B). En Euler 14, «O equidista de los vértices» contesta «misma distancia de tres pueblos». | Datos con herramientas generales (cuadrilátero de 360°, opuestos por el vértice, exteriores y bisectrices); pedir lo que exige un paso más (BD, OH); la elección con definiciones y la propiedad de la mediatriz. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 11 | Idea 5, ejemplos 11 y 14 (nivel 3); 8 (nivel 2) | Un paso cada uno (AT = s; perímetro = 2 · AT; AT = 30 ÷ 2): el nivel 3 no sube. Lector B: «en excentro casi no suben». | 11 pide CD (s, BT, BD = BT, resta); 14 pide BC (perímetro y resta); 8 pide BT con el perímetro. |
| M2 | 11 | Idea 4, ejemplo 15 (nivel 3) | Es el ejemplo 6 (nivel 2) con otro número. | Dar m∠B y m∠C: primero sale A. |
| M3 | 11 | Idea 6, ejemplo 14 (nivel 3, tarjeta 18) | El más fácil de la idea va último y los Datos lo regalan. | Elegir el centro y decir dónde queda (ángulos 25°, 45°, 110°). |
| M4 | 7 (regla 7) | `ecuaciones-ancho.js`: 7 renglones | «= ⏎ 12 cm», «R = ⏎ 17 m», «GH = ⏎ 10 cm», «AB = ⏎ 15 cm» y el dato de Pitágoras «= ⏎ hipotenusa²» (dos ideas). | Primer paso de la cadena al texto; respuesta de Euler entera en violeta; Pitágoras en palabras (como Circunferencia). |
| M5 | 9 | Idea 6: Lee, Juega, Predice, Mira | Con A = (1,5; 3,5) la O pisa BC, H se pega a A e I queda a 0,07 de la recta de Euler; G e I se enciman (lector B). En Predice, con los cuatro centros dibujados la recta se mide con regla. | Cartulina EA = (0,5; 4,75): O a 1,98 de BC, I a 0,45 de la recta; juego desde (1, 5); Predice sin centros. |
| M6 | 10 | Glosario «punto notable» (nota Media del redactor) | «Tres líneas del mismo tipo»: el excentro sale de una bisectriz interior y dos exteriores. | Nombrar la excepción. |
| M7 | 2 | Idea 6: regla y Datos de nueve puntos; tarjeta 17 | R no se dice qué es. | «R es el radio de la circunscrita». |
| M8 | 2 | Idea 4, «Vale si» | «Primero se mira qué rectas forman el ángulo en H» no dice cuánto vale (lector B). Además restringía de más: con A obtuso sigue valiendo (nota del redactor). | «Los ángulos B y C son agudos (A puede ser obtuso). Si B o C es obtuso, BHC mide lo mismo que A» (comprobado por coordenadas). |
| M9 | 2 | Idea 2: regla y «Vale si»; «circunradio» | m∠A en carmín sin ángulo dibujado; «el ángulo BOC menor» no se entendía; «circunradio» aparece sin presentar (lector A). | Letras y arco de A en el acutángulo; «O queda al otro lado de BC»; la regla presenta el nombre. |
| M10 | 2 | Idea 3, regla | Sin puente entre x del dibujo y s − a; r sin rótulo (lector A). | «En el dibujo, x = s − a = 12 − 9 = 3»; rótulo r. |
| M11 | 3 | Idea 5: Predice; regla | «Pileta» y «veredas» sin presentar; la «s» junto a AB parecía s = AB; ángulo A sin marcar (lector B). | Pregunta con «avenidas»; «s» cerca de T; arco de A. |
| M12 | 3 | Ideas 2 y 4, Predice (Datos) | «A 20 m de la vertical de B» y «3 km más allá de B» costaron (lectores A y B). | «El pie de A sobre BC está a 20 m de B»; «queda 3 km a la izquierda de B, fuera del tramo BC». |
| M13 | 3 | «Ahora tú»: voces de Neri | Excentro («interior y exteriores») y Euler («reparte OH»): no calzan con la mitad de los tipos. | Voces que sirven a todos los tipos. |
| M14 | 3, 13 | Idea 1, «Así se resuelve» | «15 cm» queda junto a G y se lee como GM (con eso sale AG = 30). | Sin rótulo de AM en el dibujo; AM va en el enunciado. |
| M15 | 13 | Circuncentro 8 y «Así se resuelve» t = 0 | Sin dibujo; «inscrito sobre el mismo arco» no se ve (lector A). | Dibujo con OBC = 25° (no a escala) y el parque con su poste. |

### Baja (estilo)

| # | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|
| B1 | Circuncentro 13 | «8,66 y 6,67 cm no salen de ninguna igualdad»: distractores sin error real. | 8,66 = altura de BOC; 5,77 = circunradio de un equilátero de lado 10. |
| B2 | Incentro 8 | «s = 30 ÷ 2 = 15» sin unidad (lector A). | «15 cm». |
| B3 | Excentro 12 | 15 y 7,5 cm «suman o parten tramos que no están»: no son errores reales. | Pendiente (ver «Pendiente»). |
| B4 | Circuncentro 8 contra 14 | El 8 (nivel 2) cuesta más que el 14 (nivel 3) (lector A). | Pendiente. |
| B5 | Idea 6, ejemplo 14 (nota Baja del redactor) | «En general, no quedan a igual distancia»: la lectura es la correcta. | Se reescribió entero (M3). |
| B6 | Objetos de la primera pantalla | Cartulina y lápiz, casas y tanque, pueblos: cuadraditos que sin texto no se reconocen (los dos lectores). Son dibujos de prueba (M4 del plan). | Para la sesión de dibujos. |

### Lo que el autor tocó fuera de la unidad
Nada fuera de su archivo, su prueba y su plantilla.

## Lo que está bien y hay que copiar al molde
- La prueba propia rehace cada respuesta desde el texto con coordenadas y fuerza bruta, y mide las lecturas del juego en
  toda la grilla: encontró cero errores de cuenta; el auditor tampoco (2 400 casos por otro camino).
- Las misiones tienen una sola salida en su grilla y no se cumplen al abrir; la del ortocentro (H en un pueblo) y la de
  Euler (los cuatro en fila con AB = AC) enseñan el caso borde.
- Los distractores de las predicciones salen de errores con código, y las explicaciones de nivel 3 dicen el valor que dan.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| Medir lo pedido en el dibujo con la escala de sus rótulos y de los lados del enunciado (tramo, ángulo, radio): más de 15 % lejos, salvo que lo pedido sea la regla misma (G a 2/3, OC = OA). Y «no está a escala» solo si es cierto y solo con dibujo. | Sí: está en la prueba de la unidad (`medible`); se puede llevar a geo-objeto para todas las unidades de geometría. |
| Datos de «Ahora tú»: si la regla de la idea es una relación entre dos medidas (BHC y A, BEC y A, GH y OG), los Datos no la traen armada cuando el ejercicio pide una de ellas desde la otra. | En parte: una lista por unidad de patrones prohibidos en Datos según la pregunta. |
| Nivel 3 no es un nivel 2 con otro número (misma firma de enunciado). | Sí (la prueba de la unidad lo hace). |
| Una explicación «X usa Y como hipotenusa» exige que el triángulo con Y de hipotenusa exista. | Difícil; mejor: cada explicación de alternativa trae la cuenta que da su valor. |

## Correcciones (26 nov)

Todas con prueba que falla con la versión anterior (se comprobó cambiando el archivo por la copia de antes):
`puntos-notables.test.js` suma cinco pruebas «cierre» (5 de 5 fallan antes) y `generador.test.js` una (falla antes).

| # | Qué se hizo |
|---|---|
| A1 | El paso dice «sale agudo, como todo ángulo BEC: a 90° se le resta la mitad de A». |
| A2 | «8 cm resta los lados, 20 − 12, en lugar de sus cuadrados». |
| A3 | Helpers `triAng`, `lejos`, `figLejos` y `sinMedirAF`. Baricentro 14 en A = (5, 6); Incentro 7 con BC = 9 dibujado; Incentro 14 en A = (6, 4); Circuncentro 15 y 8 con otros ángulos; Excentro 1 con A de 80°. «Así se resuelve»: Circuncentro t = 1 y Excentro t = 1 eligen la primera figura que cabe con lo pedido lejos; Incentro t = 0 elige entre nueve formas la que deja AF lejos con la escala de cualquiera de los tres lados; Ortocentro t = 0 y t = 1 usan datos lejos del triángulo fijo (A en 30–40° o 80–84°; C fuera de 46–57°), porque deformarlo lo dejaba angosto y apretaba H contra BC. Cambiaron tres datos de ejemplos por la misma razón (decidido por la sesión): Incentro 10 (A = 30°, BIC = 105°), Ortocentro 1 (A = 30°, BHC = 150°) y Ortocentro 6 (A = 36°, BHC = 144°). «No está a escala» sale de cinco figuras que sí lo están (Baricentro 1, 2 y 9, Circuncentro 3, Incentro 2), de Euler 3 (sin dibujo) y de «Así se resuelve» de Euler t = 0. Prueba: `medible` en los 90 ejemplos y 200 semillas por idea. |
| A4 | Ortocentro (BHC y A): Datos de alturas, cuadrilátero de 360° y opuestos por el vértice, con la solución por ese camino. Excentro: el tipo AT pasa a pedir BD (Datos AT = s y tangentes iguales); BEC y A desde BEC con exteriores y suma de ángulos. Euler: OG pide OH; `D_CENTROS` solo con definiciones, más la línea de la mediatriz, la de la bisectriz o la del equilibrio según el encargo. Excentro 3: «I en la bisectriz interior de B, E en la exterior», «interior y exterior suman 180°», «una bisectriz parte su ángulo en dos»; la solución hace la cuenta. Práctica: `bhc` y `bec` con las mismas herramientas. |
| M1–M3 | Excentro 8 (BT = 4 cm), 11 (CD = 6 cm), 14 (BC = 11 cm); Ortocentro 15 (B = 70°, C = 60°, BHC = 130°); Euler 14 (circuncentro, fuera). Alternativas con su error y letra correcta en el mismo lugar. Comentarios de cuentas al día. |
| M4 | `ecuaciones-ancho`: «Ninguna ecuación se corta, se sale del ancho ni se parte en mal sitio» (68 pantallas). |
| M5 | EA = (0,5; 4,75) con letras fijas (`letrasFijas`); juego desde (1, 5); Predice con `sinCentros`. Prueba de distancias. |
| M6 | «Cruce de tres líneas del triángulo: medianas, alturas, bisectrices o mediatrices; en el excentro, una bisectriz interior y dos exteriores» (20 palabras). |
| M7 | `D_NUEVE` dice qué es R (también en la práctica); el centro va en `D_NUEVEC`, solo en Euler 15; la regla lo dice en «Vale si». |
| M8 | Hecho y comprobado con coordenadas en la prueba. |
| M9 | Letras A, B, C y el arco de A en carmín en el acutángulo de la regla; «R se llama circunradio»; «Vale si» reescrito. El rótulo R no cabe en ninguna posición a 200 px: los radios van en turquesa, el color de R. |
| M10–M15 | Hechos como se propuso. |
| B1, B2 | Hechos. |

Pruebas: `puntos-notables.test.js` 16 de 16 (validador con `calidad: 2` en 200 semillas: 0 problemas);
`generador.test.js` 10 de 10; `papel.json` regenerado; `npm run catalogo`; `contenido/teoria/teoria.test.js`: 162 de 164,
las dos que fallan son de química en curso (`mol-y-composicion.js` y `app/datos/glosario/quimica.json`), no de esta unidad.
`formulas.js`: 2 400 casos, 0 fallas después de los cambios.

### Pendiente
- B3 (Excentro 12, distractores 15 y 7,5 cm) y B4 (orden de dificultad del circuncentro): baratos, pero piden decidir qué
  error real representan; quedan para la próxima pasada.
- B6: los objetos de la primera pantalla (cartulina y lápiz, casas y tanque, pueblos, avenidas) para la sesión de dibujos.
- La regla de Euler sigue apretada (nueve puntos, N, d y 2d en poco espacio); se movieron las letras, pero un dibujo más
  grande o en dos pasos sería mejor. Gerson revisa.
- La práctica conserva `at` y `gh` de nivel 1 con la regla en Datos (aplicar la regla es el nivel 1 de la práctica);
  decidido por la sesión, Gerson revisa después.
