# Ronda 6: «Lee» y «Así se resuelve» en razonamiento verbal, parte A (16 nov 2026)

Encargo: `rutinas/encargos/teoria6-razonamiento-verbal-a.md`. Rama `teoria6/razonamiento-verbal-a`, un commit por unidad.
Las 9 unidades de la lista tienen los dos momentos en **todas** sus ideas (29 ideas). Definiciones la hice yo y fijó el
patrón; las otras 8 las hicieron cuatro subagentes en copias aparte (dos unidades cada uno). Yo revisé el texto
(semilla 4 de cada idea, además de las 0 a 2 que revisaron ellos), pulí frases y corrí todo de nuevo en esta rama.

## El patrón (igual en las 9)

- **«Así se resuelve» usa el mismo banco que «Ahora tú» (regla 1).** El banco de cada idea salió de `ahoraTu.generar`
  a una constante (`BANCO_DEF`, `BANCO_RASGO`, `BANCO_RELACION`…); «Ahora tú» quedó idéntico: se compararon las 12
  semillas de cada idea antes y después, sin cambios.
- **Otro caso que el de «Ahora tú».** `otroIndice(s, n)` sale de `azar(s + 900)` y nunca cae en `s % n`, el índice de
  «Ahora tú» con la misma semilla. El orden de las opciones también sale de `azar(s + 900)`.
- **Figura:** la tarjeta del caso (vecinos, par base, oración con hueco, texto numerado) más la lista de opciones. En el
  paso «Lo aplico» la correcta se marca (`i`) y las demás se tachan; en eliminación, la oración que sobra sale en rojo y
  en «¿Tiene sentido?» se tapa con el sello «Sin pérdida»; en plan, el orden completo con el sello «Orden coherente».
- **Pasos:** `pide` → (`datos`) → `regla` (en palabras del alumno, no copia `regla.texto`) → `aplica` («Lo aplico»,
  uno o dos) → `sentido` (descarta la trampa típica del banco con su `siFuera`, o relee con la respuesta puesta).
- **Trozos de color largos** van con `largo: true` (`nucleo/ecuacion.js`) o solo en color la cabeza (`corto()`): sin eso
  un texto rojo largo se salía de la tarjeta a 360 px.
- **«Lee»:** 2 a 4 tarjetas; la última dice qué mirar en el juego. Cada subagente leyó la pregunta de «Predice» antes de
  escribir y quitó lo que la dejaba deducir (en `denota-connota` quedó en 2 tarjetas por eso; en `mapa-conceptual` se
  evitaron «enlace» y «mapa conceptual» porque su definición del glosario delata la respuesta).
- No se agregaron términos al glosario: las palabras técnicas de las tarjetas ya estaban (el conteo de términos por
  unidad del catálogo subió porque los textos nuevos usan términos que ya existían).

## Por unidad

### definiciones (2 ideas)
| Idea | Lee | Así se resuelve |
|---|---|---|
| genero-diferencia | Definir en el examen · Los vecinos (combi y bus en Juliaca) · Qué mirar (los casos rojos de la silla) | La definición de otro concepto del banco (reloj, puente, lápiz…): vecinos → regla clase + rasgo → clase y rasgo en color, correcta marcada → compruebo con la opción parecida (RVD2) |
| rasgo-necesario | Qué es un rasgo (el cóndor del Colca) · Casi siempre no es siempre · Qué mirar (aves fuera y colados) | El rasgo de otro concepto (insecto, instrumento musical, triángulo…): las dos pruebas → la opción frecuente falla la primera (RVD1) → la amplia falla la segunda (RVD3) → la que nombra un caso no da rasgo (RV56) |

### analogias (3 ideas)
| Idea | Lee | Así se resuelve |
|---|---|---|
| relacion-no-tema | Dos pares que se parecen · La oración puente («El chofer maneja la combi») · Qué mirar | Par base del banco: oración puente → se prueba con las opciones → trampa del par al revés (RV16) |
| clase-y-causa | Grupos y miembros (cereal y quinua de Puno) · Lo que provoca algo (la leche fuera de la refrigeradora) · Qué mirar | Género y especie o causa y efecto, mismo orden; trampa: el par al revés |
| sinonimo-antonimo | Sinónimos · Antónimos · Qué mirar | Nombra el rasgo del par base; descarta la palabra distinta que mide otro rasgo (RV21) |

### sentido-contextual (4 ideas)
| Idea | Lee | Así se resuelve |
|---|---|---|
| acepcion | Una palabra, varios sentidos («banco») · La oración da pistas · Qué mirar | Pista → acepción → sinónimo o antónimo; trampa: la primera acepción que uno recuerda (RV18) |
| denota-connota | Elogiar y criticar · Qué mirar (2 tarjetas: una de connotación regalaba «Predice») | Conserva lo que describe y cambia la valoración; descarta la que cambia la conducta (RVL1) y la de igual valoración (RVL2) |
| palabra-precisa | Varias palabras posibles · El verbo dice la acción · Qué mirar | Partes que deciden → descarta el verbo vago (RVL3) y el que choca (RV23) → relee la oración completa |
| inferir-significado | Palabras nuevas · Lo que rodea a la palabra · Qué mirar | La parte que habla de la palabra y su tipo (consecuencia, contraste, explicación) → significado → descarta la asociación sin apoyo (RVL4) |

### conectores (3 ideas)
| Idea | Lee | Así se resuelve |
|---|---|---|
| relacion-primero | Palabras que unen · Lo que se espera («me levanté tarde») · Qué mirar | Las dos ideas → la relación antes que las opciones → el conector entra al hueco → compara con la opción RV24 |
| clases | Familias de conectores · Mirar a los dos lados · Qué mirar (la quinua) | Clase y forma: antes y después del hueco → clase → conector de esa clase → descarta otra clase |
| locuciones | Un conector de varias palabras · La prueba del cambio · Qué mirar (el pasaje del tren) | Relación → conector corto → locución que vale lo mismo → relee con el corto |

### eliminacion-de-oraciones (3 ideas)
| Idea | Lee | Así se resuelve |
|---|---|---|
| redundancia | La pregunta del examen · Decir dos veces («subir para arriba») · Qué mirar (el cuy) | Tema → dos oraciones que dicen lo mismo → sobra la k (en rojo) → se tapa y se relee; otra oración sí aporta |
| impertinencia | Todo texto tiene tema · Palabras que engañan (los dos «banco») · Qué mirar (la quena) | Igual, con la oración de otro asunto aunque repita una palabra |
| incompatibilidad | Un texto que se sostiene · Mismo asunto, mismo momento (lluvia y sol en Juliaca) · Qué mirar (la laguna) | Igual, con la oración que niega lo ya dado por cierto |

### plan-de-redaccion (3 ideas)
Usa la misma función `caso()` de «Ahora tú» con la semilla s + 900 (orden correcto, números de la vista y distractor).
| Idea | Lee | Así se resuelve |
|---|---|---|
| abre-y-retoma | Plan de redacción · Palabras que señalan («ella ya llegó» en el WhatsApp del salón) · Qué mirar (las abejas) | Otro texto del banco (andenes, Amazonas, sol…): la que abre → orden completo → pruebo un orden equivocado y falla |
| tiempo-y-causa | Marcadores de tiempo · El chuño · Qué mirar | Fechas y marcadores, la causa antes del efecto (Arguedas, helada, deforestación…) |
| analizar-comparar | Dos flautas (quena y zampoña en la Candelaria) · Palabras que comparan · Qué mirar | Primero el todo o las dos cosas; después partes, diferencias y semejanzas |

### cohesion-y-coherencia (4 ideas)
| Idea | Lee | Así se resuelve |
|---|---|---|
| referente | Palabras que señalan · Sin referente claro («ya lo traje») · Qué mirar (Marta) | Se prueba el candidato «más cercano» y se descarta; queda el que tiene sentido; anáfora o catáfora según el banco |
| repetir-sustituir-callar | Volver a nombrar · La vicuña · Qué mirar | Descarta dos recursos con su explicación; queda el correcto |
| conocido-y-nuevo | Los caminos incas (Qhapaq Ñan) · Una oración que falta · Qué mirar | La oración que sigue al espacio → descarta una → el espacio lleno con el sello «El hilo sigue» |
| no-contradiccion | Dos palabras (cohesión y coherencia) · Palabras de cantidad · Qué mirar | Las dos afirmaciones → ¿una niega la otra? → veredicto con sello → descarta la opción que confía en el conector |

### tipologia-textual (3 ideas)
| Idea | Lee | Así se resuelve |
|---|---|---|
| proposito | Cuatro maneras de escribir · Un mismo tema (la helada en la puna) · Qué mirar | ¿Qué tipo domina? Propósito de todo el texto → descarta la trampa RV41 |
| normas-textualidad | Oraciones y conjunto · Una palabra nueva (textualidad) · Qué mirar (el aviso del agua) | ¿Funciona como texto? Sentido, propósito y situación; el largo no decide |
| niveles | Tres niveles · Ferias de la región · Qué mirar | Nivel de una pregunta sobre la feria: dónde está la respuesta |

### tema-e-idea-principal (3 ideas)
| Idea | Lee | Así se resuelve |
|---|---|---|
| tema-e-idea | Dos preguntas al leer · Un caso cercano (el mercado de Juliaca) · Qué mirar | Tema y cuántas oraciones → la idea que afirma algo y cubre todas → descarta la que es solo la primera oración |
| jerarquia | Cada oración, un papel · Un aviso del colegio · Qué mirar (la quinua) | El papel de la oración k frente a la principal |
| mapa-conceptual | Un tema en una hoja · Conceptos · Qué mirar | Proposición fiel: concepto → enlace → concepto, en la dirección del texto; trampa: la flecha al revés |

## Semillas revisadas a mano

Semillas 0, 1 y 2 de cada idea (87 casos): la correcta marcada es la `ok` del banco, la trampa descartada coincide con
su `siFuera` y el caso no es el de «Ahora tú» con la misma semilla. Todas cuadran. Ejemplos:
- definiciones: reloj, puente, lápiz · insecto, instrumento musical, triángulo.
- analogías: página : libro → vagón : tren; helada : pérdida de cosecha → erosión : derrumbe; escaso : abundante → vacío : lleno.
- sentido contextual: alto → barato; firme → obstinado; «reunieron», «inundó», «recetó»; ilegible, potable, locuaz.
- conectores: «además», «porque», «sin embargo»; «a pesar de que» = aunque, «de modo que» = por eso, «puesto que» = porque.
- eliminación: cóndor (sobra la 4), alpaca (3), reciclaje (4); sueño (3), terremotos (4), vacuna (4); cosecha, tienda, biblioteca (4).
- plan: andenes 3–2–4–1, Amazonas 2–4–1–3, sol 3–1–4–2.
- tipología: Mateo → narrativo, quinua → expositivo; «¿Fue bueno el crecimiento?» → crítico.
- tema: sueño, celular en clase, reciclaje; mapa de vacunas, uros y totora, sol.
Además leí la semilla 4 de las 29 ideas entera y pulí frases con dos puntos dobles («Descarto «X»: …: …»).

## Objetos que la figura no dibuja

**Ninguno que corregir.** En las 9 unidades la figura es texto (`rv-texto`: tarjetas, listas numeradas, huecos,
bandejas de fichas). Lo que nombran la consigna, la `voz`, «Mira», las preguntas y la lectura son palabras u oraciones
que están a la vista; el «marcador» o «resaltador» de las consignas de tipología y tema es la manija que la pieza sí
dibuja. Los ejemplos de «Lee» (combi, quinua, cóndor, banco de la plaza) van en tarjetas sin figura y ninguna dice
«mira el…». Credibilidad revisada: el cóndor de 15 kg, más de 3000 variedades de papa, el puente renovado en 4 días.

### Pedidos de vectores para Gerson
Ninguno.

## Lo que no se pudo y por qué

Bugs y textos raros de «Ahora tú» que vimos pero **no tocamos**, porque el encargo prohíbe tocar «Ahora tú»:
- `cohesion-y-coherencia`, idea `referente`: con «Los vecinos limpiaron la plaza. Después, la llenaron…», la figura
  marca el «la» de «la plaza» (primera aparición) y pierde «llenaron de flores». La solución pasa «Lucía» a minúscula.
- `cohesion-y-coherencia`, idea `repetir-sustituir-callar`: con «El agua es vital. El agua limpia…», marca el primer
  «El agua» (el referente, no la repetición), deja un fragmento vacío y pierde el resto del texto.
  En «Así se resuelve» esto ya está bien: se toma la última aparición.
- `sentido-contextual`, idea `acepcion`: el banco trae «gopel», que no es una palabra, como trampa de parónimo (RV20);
  puede salir también en «Así se resuelve», que usa el mismo banco. Queda para Gerson decidir si se cambia.

## Lo no verificado

- Playwright (`rutinas/teoria6-razonamiento-verbal-a/pw.js`) recorre todas las ideas, pero «Lee» y «Así se resuelve»
  solo con la semilla 0 y «Otro ejemplo» con la 1. El desborde de los pasos lo mide `desborde.js` (del subagente de
  conectores) en las 12 semillas de cada idea; las capturas las miré por muestreo (al menos una de «Lee» y una de
  «Así se resuelve» por unidad), no todas.
- En «Lee», una tarjeta larga queda en parte bajo el botón fijo de abajo hasta hacer scroll (pasa igual en las
  unidades de referencia): es del lector, que no se toca.
- El script espera fijo 1,2 s al abrir; con la CPU cargada falló alguna vez «abre en Lee» y pasó al repetir.
- Las semillas 3 a 11 solo pasaron el validador (topes, tipos, sin NaN) y el detector de desborde, no la lectura a mano.
- No probado en un celular real de gama baja ni con lector de pantalla.

## Verificación

- `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`: 764 de 764 (el validador
  revisa 12 semillas de «Así se resuelve» por idea).
- Playwright a 360 × 780, alumno `{ uni: 'unmsm', grado: '5' }`, las 29 ideas (`pw.js <unidad> todas`): abre en «Lee», el
  botón pasa de tarjeta en tarjeta y llega a «Juega», «Ir directo a jugar» salta; en «Así se resuelve» el botón revela
  los pasos uno a uno, sale la respuesta y «Otro ejemplo» cambia el enunciado; sin desborde y sin errores de consola.
- `desborde.js`: sin pasos que se salgan de la tarjeta en las 12 semillas de las 29 ideas.
- `npm test` completo antes del último push: 8788 de 8788.
- `app/datos/catalogo.json` y `app/datos/glosario/razonamiento-verbal.json` regenerados con `npm run catalogo` (solo cambia
  el conteo de términos del glosario por unidad); van en el último commit.
