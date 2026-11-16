# Ronda 6: «Lee» y «Así se resuelve» en geometría (parte A): reporte (16 nov 2026)

Rama `teoria6/geometria-a`. Encargo: `rutinas/encargos/teoria6-geometria-a.md`. Hay un commit por unidad, con push después de cada uno. `npm test` completo pasa 8788 de 8788.

Cómo se hizo:
- Un subagente por unidad, cada uno en su copia del repo y tocando solo el archivo de su unidad.
- La sesión principal integró cada archivo y corrió:
  - `npm run catalogo`;
  - `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'` (764 de 764 en cada unidad);
  - el recorrido de Playwright `rutinas/teoria6-geometria-a/pw.js` a 360 × 780.
- Todas las ideas de las 9 unidades (43 en total) traen `lee` (de 3 a 4 tarjetas) y `resuelve`.
- `resuelve` usa `azar(s + 900)` con las mismas cuentas o figuras de su «Ahora tú», y sus pasos van en el orden pide → datos → regla → cuentas (o `aplica`) → sentido.
- Se comparó que no cambiara lo que ya existía, con `generar` de «Ahora tú» en las semillas 0 a 39, «Predice», «Mira», «La regla», el juego en su estado inicial y el laboratorio, contra `main` (9d8a46e). Solo cambian las cuatro correcciones de «Objetos corregidos».

Recorrido de Playwright (`node rutinas/teoria6-geometria-a/pw.js <unidad> [salida] [idea]`, con `npm run dev`):
- Se recorrió la primera idea de cada unidad.
  - En congruencia, además, `mediana-hipotenusa`, por la figura corregida.
- Las 9 dieron todo ✓ y ninguna tuvo errores de consola:
  - abre en «Lee»;
  - el botón pasa de tarjeta en tarjeta y en la última dice «Siguiente: Juega»;
  - «Ir directo a jugar» salta al juego;
  - «Así se resuelve» revela los pasos uno por uno y muestra la respuesta;
  - «Otro ejemplo» cambia el enunciado.
- Revisé a ojo las capturas de triángulos, relaciones métricas y circunferencia.

## Por unidad: qué cuenta «Lee» y qué resuelve

### segmentos-y-angulos (5 ideas)
| Idea | Lee | Resuelve |
| --- | --- | --- |
| suma-de-segmentos | El segmento como la carretera Juliaca–Puno imaginada recta; «entre» con Caracoto; qué mirar: AB + BC frente a AC. | A, B, C y D en orden: BC = AC + BD − AD. |
| abertura | Vértice y lados; los grados (vuelta, media vuelta, esquina); los nombres de las clases. Evita el reloj, porque adelantaría «Predice». | Suma de dos ángulos consecutivos y la clase del ángulo que resulta. |
| bisectrices | Complemento (esquina de una cancha), suplemento y bisectriz; qué mirar: α y β. | Ecuaciones con C(x) y S(x), en los tres tipos de «Ahora tú». |
| paralelas | Rieles del tren Juliaca–Cusco, la secante, sus ocho ángulos y los nombres de los pares. | Alternos internos (se igualan) o conjugados internos (suman 180°), con expresiones en x. |
| quiebre | Camino en zigzag a un cerro; cómo se leen a, b y x. | Se pide x = a + b o b = x − a, con la paralela auxiliar en las cuentas. |

### triangulos (4 ideas)
| Idea | Lee | Resuelve |
| --- | --- | --- |
| suma-de-angulos | Vigas de un techo de calamina en Juliaca; ángulo interior y exterior; clases por ángulos y por lados. | Exterior = suma de los dos interiores lejanos (pide el exterior o un interior). |
| desigualdad | Tres palitos que a veces cierran y a veces no; la bisagra de 5 y 8; mirar los topes. | Cuántos enteros puede tomar el tercer lado. |
| lineas-notables | Las cuatro líneas notables; las marcas (rayitas, arcos, cuadradito). | Reconocer la línea por su marca, con el paso `aplica`. |
| angulo-de-bisectrices | Doblar papel; incentro I; bisectriz interior y exterior. | ∠BIC = 90° + A/2 o ∠BEC = A/2. |

### congruencia (5 ideas)
| Idea | Lee | Resuelve |
| --- | --- | --- |
| criterios | Ventanas iguales de un edificio de Juliaca; las seis piezas; cómo se lee LAL. | Elegir LAL, ALA, LLL o «no basta» (LLA, AAA), con el paso `aplica`. |
| mediatriz-bisectriz | La distancia a una avenida es perpendicular; mediatriz y bisectriz; equidistar (un paradero de Puno). | Igualar ax + b de las dos distancias. |
| base-media | Punto medio y rayitas; la base media; el listón de un techo a dos aguas. | MN = BC/2, o el perímetro del triángulo de los puntos medios. |
| mediana-hipotenusa | Esquinas rectas; hipotenusa y catetos; la mediana desde C. | ∠MCA o ∠MCB por el triángulo isósceles. |
| notables | Las escuadras; la letra k; el albañil que comprueba una esquina con 3-4-5. | Lados con k: despejar k y armar el lado pedido; comprobar con Pitágoras. |

### poligonos-y-cuadrilateros (5 ideas)
| Idea | Lee | Resuelve |
| --- | --- | --- |
| suma-de-angulos | Señal de «Pare»; nombres de polígonos; rincón (interior) y giro (exterior). | Suma interior, exterior del regular o n desde la suma (n de 5 a 10, para que se pueda dibujar). |
| diagonales | Palitos de una cometa; un lado no es diagonal. | D = n(n − 3)/2, o n desde D. |
| paralelogramos | Rieles; «un nombre es una lista de condiciones». | ∠C con ángulos en x, o el nombre por las diagonales (`aplica`). |
| trapecios | Un balde de costado; bases y mediana. | Mediana, PQ = (B − b)/2 o la base menor. |
| trapezoides | Chacras del altiplano; los cuatro puntos medios. | Perímetro de MNPQ = suma de las diagonales, o el cuarto ángulo. |

### circunferencia (6 ideas)
| Idea | Lee | Resuelve |
| --- | --- | --- |
| tangentes | Cortar, tocar o pasar lejos; el punto de contacto; dos tangentes desde fuera de una pileta. | PT o r con Pitágoras. |
| posiciones | Ondas en el Titicaca; secantes, tangentes y concéntricas. | Clasificar comparando d con R + r y con R − r. |
| inscrito | Arcos en grados; central o inscrito según el vértice; faroles en una pileta. | Central, inscrito o semiinscrito. |
| interior-exterior | Dos veredas que se cruzan en una plaza de Puno; dos arcos por ángulo; secantes. | Semisuma (dentro) o semidiferencia (fuera). |
| poncelet-pitot | Un plato en una bandeja; tangentes iguales; Pitot y Poncelet. | r con Poncelet, o DA con Pitot (figura con sus cuatro tangentes reales). |
| cuadrilatero-inscrito | Cuatro bancas en el borde de una pileta; los ángulos opuestos. | ∠D = 180° − ∠B, o decidir si se puede inscribir (cometa con la circunferencia por A, B y C). |

### proporcionalidad-y-semejanza (5 ideas)
| Idea | Lee | Resuelve |
| --- | --- | --- |
| thales | Un lado partido en dos tramos; paralelas (rieles); la marca de paralelas. | EC o AE con Tales. |
| bisectriz | La bisectriz parte el ángulo; los tramos BD y DC. | BD = a·c/(b + c), o AI/ID. |
| ceva-menelao | La ceviana; dar la vuelta al triángulo. | Ceva (semillas pares) o Menelao (impares), con la figura a escala. |
| semejanza | El mapa y la plaza de Armas de Puno; la correspondencia ABC ∼ A′B′C′. | AD con una paralela o una antiparalela. |
| area-y-escala | La escala k; la fotocopiadora al 200 %; longitud contra área. | Área × k² o perímetro × k. |

### puntos-notables (3 ideas)
| Idea | Lee | Resuelve |
| --- | --- | --- |
| baricentro | La mediana (terreno en Juliaca); el baricentro G (cartón en equilibrio); AG y GM. | AG, GM o el área de un triangulito, S/6. |
| centros | Cada centro y sus líneas; un pozo a igual distancia de tres comunidades. | ∠BXC con X = O, H, I o E (A sobre el arco capaz: el dibujo mide lo que dice). |
| euler | O, G y H en el equilátero y fuera de él; Euler en 1765. | GH = 2·OG, OH, o el radio de nueve puntos, R/2. |

### relaciones-metricas (6 ideas)
| Idea | Lee | Resuelve |
| --- | --- | --- |
| triangulo-rectangulo | Hipotenusa, catetos y altura; la esquina 3-4-5 en las obras; p y q. | h² = pq, o cateto² = hipotenusa · proyección. |
| euclides | Ángulo agudo y obtuso; el pie fuera de BC; terrenos sin esquinas rectas. | b² = a² + c² ∓ 2am. |
| stewart | La ceviana (una acequia); mediana y bisectriz; m y n. | Mediana, bisectriz (d² = bc − mn) o una ceviana cualquiera. |
| heron | Medir lados es fácil y trazar la altura no; el semiperímetro. | Área con Herón, comprobada con la altura 2S/base. |
| potencia | Cuerda, secante y tangente; tramos medidos desde P. | Dos cuerdas, secante con tangente o dos secantes. |
| ptolomeo | Cuadrilátero inscrito; lados opuestos; las tablas de cuerdas. | Ptolomeo (entre 68 cuadriláteros inscritos que existen) o Viette. |

### poligonos-regulares (4 ideas)
| Idea | Lee | Resuelve |
| --- | --- | --- |
| central-y-apotema | Polígono regular (la señal de «Pare» sí, el rombo no); el centro O; radio contra apotema. | Ángulo central, apotema del hexágono o área P·a/2. |
| inscritos-notables | Inscrito; «en función de R»; los tres polígonos del examen. | Lado o apotema del triángulo, el cuadrado o el hexágono inscritos. |
| dos-n-lados | Arquímedes y π; partir cada arco. | Apotema de n lados y después ℓ₂ₙ = √(2R² − 2R·aₙ) (6 pasos). |
| seccion-aurea | Cortar una cinta para la Candelaria; dos razones; el nombre φ. | Diagonal = φ·lado, o parte mayor = total/φ. |

En cada unidad se revisó que «Lee» no adelante la respuesta de «Predice»: cada subagente leyó la pregunta y sus opciones, y yo lo repasé al integrar con un volcado de Lee, Predice y un resuelto de cada idea.

## Semillas revisadas a mano

| Unidad | Revisaron los subagentes | Revisé al integrar (repetí la cuenta) |
| --- | --- | --- |
| segmentos-y-angulos | 0, 1, 2 | 4 |
| triangulos | 0, 1, 2 (en angulo-de-bisectrices, además, el dibujo de E en las semillas impares 1 a 11) | 3 |
| congruencia | 0, 1, 2 (en criterios, 0 a 4) | 3 |
| poligonos-y-cuadrilateros | 0, 1, 2 | 4 |
| circunferencia | 0, 1, 2 (más un script que mide las figuras nuevas en 40 semillas) | 1, 3 |
| proporcionalidad-y-semejanza | 0, 1, 2 | 5 |
| puntos-notables | 0 a 3 | 4 |
| relaciones-metricas | 0, 1, 2 (más un script que mide los segmentos rotulados en 12 semillas) | 7 |
| poligonos-regulares | 0 a 3 | 5 |

Las cuentas cuadran en todas las ideas. El detalle de cada semilla está en los mensajes de los commits y en la conversación de la sesión.

## Objetos corregidos

- **congruencia, criterios, y mesa `compas-lla`:** los textos hablaban de un compás que la figura no dibuja; lo que se ve es una circunferencia punteada.
  - Cambié la voz de «Predice», «Coincide», la voz de «Mira» (que además decía «lápiz y papel») y los textos alternativos de `lla()` y `llaLibre()`.
  - En la mesa cambié el título («La circunferencia de LLA»), la consigna, la etiqueta del arrastre y cuatro textos de los retos.
  - Los `id` no cambian.
- **congruencia, mediana-hipotenusa, figura de «Ahora tú»:** el rótulo decía ∠A = a°, pero el ángulo dibujado medía 90° − a (C iba en `polar(5, 180 − 2a)`). Ahora C va en `polar(5, 2a)`. Medí el ángulo en 4 semillas y coincide.
  - Es la única línea de «Ahora tú» que se tocó. Lo hice porque el dibujo contradecía el texto (el encargo pide revisar que el texto sea creíble). Las preguntas, las opciones y la solución no cambian.
- **poligonos-y-cuadrilateros, diagonales, `revelar` de «Predice»:** decía «Decágono con sus 35 diagonales» y no dibujaba ninguna, porque `poli()` ignoraba `todas: 0`. Ahora sí las dibuja.

## Pedidos de vectores para Gerson

| Unidad | Idea | Objeto | Para qué |
| --- | --- | --- | --- |
| congruencia | criterios y mesa `compas-lla` | Un compás abierto, con la punta en B y abertura BC, que trace la circunferencia | Mostrar la construcción LLA como se hace en el cuaderno. Hoy solo se ve la circunferencia punteada. |
| poligonos-y-cuadrilateros | suma-de-angulos («Predice») | Una figurita (Neri) que camine por el borde del octógono y gire en cada vértice | Hacer visible el «giro» exterior que la pregunta pide imaginar. |
| poligonos-regulares | central-y-apotema («Lee») | Señal de «Pare» (octógono) | Ilustrar la tarjeta «Lados y ángulos iguales». Opcional. |
| poligonos-regulares | seccion-aurea («Lee») | Cinta de la Candelaria cortada en dos | Ilustrar «Cortar en dos partes». Opcional. |
| circunferencia | las seis | Pileta con una persona afuera; dos ondas en el lago; pileta con dos faroles; plaza con dos veredas; plato en una bandeja; cuatro bancas en una pileta | Ilustrar las tarjetas de «Lee». Opcionales: hoy van sin figura, como «Imagina…». |

Las tarjetas de «Lee» que nombran objetos de la vida diaria (rieles, chacras, techos, la plaza de Armas) no tienen figura y los presentan como comparación, igual que «Ana» en la unidad de referencia. No dicen que esos objetos estén en el dibujo.

## Lo que no se pudo y por qué

Hay errores en «Ahora tú» que no se corrigieron, porque el encargo no deja tocar «Ahora tú» salvo por un objeto que no se dibuja. «Así se resuelve» los esquiva. Quedan para otra tanda:
- **relaciones-metricas, ptolomeo:** AC sale al azar, pero con los cuatro lados ya queda fija. En 146 de 150 casos el cuadrilátero inscrito no existe.
- **relaciones-metricas, Viette:** en 9 de 150 casos los cuatro lados no cierran un cuadrilátero (por ejemplo, 9, 2, 2, 2).
- **relaciones-metricas, potencia con dos secantes:** en 29 de 100 casos el tramo exterior PC sale mayor o igual que la secante completa PD.
- **proporcionalidad-y-semejanza, semejanza con antiparalela:** puede dar AD > AB, con D fuera del lado (AB = 6, AC = 10, AE = 5 → AD = 8,33). Además, algunas razones salen sin simplificar («3/3»).
- **segmentos-y-angulos, quiebre:** cuando se pide b, el texto alternativo de la figura dice el valor de b. Un lector de pantalla lo lee y regala la respuesta.

Otras dos cosas:
- **segmentos-y-angulos:** su glosario ya tiene 24 términos, que es el tope. Por eso no se agregaron «extremos» ni «línea quebrada», y las tarjetas se escribieron sin ellos.
- **Términos nuevos en el glosario:** «pentágono» (poligonos-y-cuadrilateros) y «correspondencia» (proporcionalidad-y-semejanza).

## Lo no verificado

- Con Playwright recorrí una idea por unidad (dos en congruencia), no las 43. Las demás solo pasaron el validador, que revisa 12 semillas por idea, y la revisión de texto.
- A ojo miré capturas de tres unidades (triángulos, relaciones métricas y circunferencia). En las otras seis solo verifiqué que el recorrido diera ✓; no miré las figuras de «Así se resuelve» una por una.
- A 360 × 780, en algunas tarjetas largas de «Lee» el texto queda debajo del botón fijo y hay que desplazar la página. Es el lector (`app/teoria.js`), que no se toca; no lo comparé con las unidades de referencia.
- Las figuras nuevas no las vio un humano. Las de circunferencia y relaciones métricas se midieron por script; las de las otras unidades, solo por sus rótulos.
