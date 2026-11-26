# Redacción: fisica.impulso-y-choques

26 nov 2026. Redactor con `docs/metodo/unidad/redaccion-delegada.md` y la skill `escribidor-escribano`, sobre la unidad
ya cerrada (`calidad: 2`, auditoría y lector en frío en `rutinas/auditoria/` y `rutinas/frio/`). Solo cambió el texto:
ningún número, respuesta, distractor, dato, dibujo ni color. La marca `calidad: 2` se queda.

Archivos: `contenido/teoria/fisica/impulso-y-choques.js` y `plantillas/fis-impulso-choques/generador.js` (con su
`papel.json` regenerado por `herramientas/papel-generador.js`). En el árbol de trabajo también se copió a
`nucleo/teoria.js` el bloque PRESUPUESTO nuevo (topes del 26 nov), sin tocar nada más de ese archivo.

Leído: las seis ideas con todos sus momentos, los 90 ejemplos, 20 semillas de «Así se resuelve» y de «Ahora tú» por
idea, el glosario (16 términos), la tabla de letras y los 18 tipos de la práctica con sus explicaciones de error y el
papel.

## Qué cambió, por tipo de problema

**1. Marco roto en las seis condiciones.** La app antepone «Vale si»; las seis empezaban con mayúscula y una oración
suelta («Vale si La masa es positiva; pₓ = m·vₓ…»). Ahora son subordinadas que completan el marco.

> Antes: «Choque frontal, sin empuje externo, entre cuerpos que se acercaban. Para alturas: caída desde el reposo, piso
> fijo, sin aire.»
> Después: «Vale si el choque es de frente, sin empuje externo, entre cuerpos que se acercaban; para las alturas,
> además, la pelota cae desde el reposo sobre un piso fijo y sin aire.»

**2. El molde telegráfico de los errores (`siFuera`, unos 160).** «Bien A; B. Así sale X.» se leía como lista. Un
ayudante `siFue` lo arma como oración («Bien A, pero B. Así sale X.»), igual en las cuatro familias (antes había
«Sale», «Eso da», «Así obtienes»). Además se reescribieron una sesentena de frases con jerga o sin referente:

> Antes: «Bien conservar el total; elegiste la solución sin interacción. Sale 5 m/s.»
> Después: «Bien conservar el total, pero dejaste la velocidad que tenía antes del choque. Así sale 5 m/s.»

> Antes: «Bien usar H; usaste el complemento lineal de e.» → Después: «Bien usar H, pero lo multiplicaste por 1 − e en
> vez de por e².»

Otras: «la masa receptora», «el balance interno», «la componente pendiente», «impusiste una velocidad común»,
«supusiste elasticidad perfecta», «invertiste solo una resta», «dividiste velocidades aisladas», «omitiste al receptor».

**3. La última línea de los ejemplos de examen (30 ejemplos).** Era una ráfaga de rótulos («15: omite el carrito.
9: omite la carga.», «Las demás: 7,2 (velocidad anterior); 0,9 (omite el dos)…»). Ahora es una oración con el mismo
molde en toda la unidad (ayudante `lasOtras` y causas cortas por error):

> Después: «Las otras salen de un error: 15 si omitiste el carrito, 9 si omitiste la carga, 86,4 si no convertiste los
> km/h y 8 si omitiste la velocidad.»

**4. Ráfaga y jerga en Lee, Mira, regla, voces y pasos.** Se enlazaron las oraciones con su relación (causa,
consecuencia) y se dijo en palabras lo que antes era jerga: «componente», «rapidez relativa», «separación y
acercamiento», «adhesión», «receptor», «estados inicial y final», «SI», «numerador ponderado», «E_PG».

> Antes (Lee, idea 3): «Los dos carritos y el resorte forman nuestro sistema. El resorte tiene masa despreciable. La
> línea punteada marca el grupo que vamos a estudiar; no es una pared ni ejerce fuerza.»
> Después: «Los dos carritos y el resorte, cuya masa despreciamos, forman nuestro sistema: el grupo de cuerpos que vamos
> a estudiar juntos. La línea punteada lo encierra, pero no es una pared ni ejerce fuerza.»

> Antes (regla, idea 4): «Conserva cantidad de movimiento durante el impacto. Un choque elástico conserva también
> energía cinética; una adhesión no. Separa el impacto de una subida o un frenado posterior.»
> Después: «En el choque se conserva la cantidad de movimiento total. Un choque elástico también conserva la energía
> cinética; uno en que los cuerpos quedan unidos, no. Si después hay una subida o un frenado, se calcula aparte.»

> Antes («Ahora tú», centro de masa): «La posición inicial = 3,5 m; la velocidad = 3,25 m/s. Sumamos el avance.»
> Después: «El centro de masa empieza en 3,5 m y se mueve a 3,25 m/s; a esa posición le sumamos lo que avanza en el
> tiempo dado.»

Las soluciones genéricas que no valían para todos los casos se volvieron ciertas para todos (idea 1: «Convertimos las
unidades…» en un caso sin conversiones; idea 2: «El balance usa los signos y las unidades del mismo eje»). Las frases
copiadas de otro caso que marcó el lector ya las había corregido la auditoría; la de «la situada en el origen» quedó
más clara («también la del carrito que está en el origen»).

**5. Glosario.** Cinco entradas: `simple` de cantidad de movimiento, choque elástico y coeficiente de restitución
(eran vagas: «una cifra para describir la llegada y la salida del contacto»); `def` de fuerza media y de línea del
impacto («dirección normal al contacto» pasa a «perpendicular a la superficie de contacto»).

**6. Práctica.** Las explicaciones de error decían «Bien que distingas el sentido. Si cambias el signo pedido, sale
−4 kg·m/s.»; el «Bien que» con subjuntivo se lee como concesión. Ahora: «Bien distinguir el sentido, pero si cambias el
signo, sale −20 kg·m/s. El signo de v_x pasa a p_x, y el módulo nunca es negativo.», el mismo molde de la teoría.
Además se quitó jerga (SI, «peso» por importancia en el centro de masa, «firmado», «complemento», «numerador
ponderado», «E_PG», «Combina…») y se regeneró `papel.json`.

## Lo que no cambió

Números, respuestas, distractores, datos, figuras, ecuaciones y colores. La lectura de los `siFuera` sigue terminando
en su valor (las pruebas lo comprueban). Lee de restitución sigue sin adelantar la respuesta de la Predice (define e
en palabras, como la dejó la auditoría).

## Comprobaciones

- Pruebas de la unidad (`contenido/teoria/fisica/impulso-y-choques*.test.js`) y de la práctica
  (`plantillas/fis-impulso-choques/*.test.js`): 104 en verde.
- Validador con `calidad: 2` y 200 semillas: 0 problemas.
- `herramientas/ecuaciones-ancho.js fisica.impulso-y-choques`: los mismos 10 resultados partidos después de «=» y 1
  después de «;» que dejó la auditoría (lección 19: los arregla la app); ninguno nuevo.
- `app/datos/glosario/fisica.json` ya trae el glosario nuevo.

## Para el auditor

- No vi cuentas ni afirmaciones falsas en el texto.
- Siguen abiertos B5 de la auditoría (gráfica positiva de la regla del impulso sin su área escrita; resultados como
  2,977… m) y A3/B4 (subíndices crudos en la práctica y el glosario de la app): no son de texto.
- Los causas cortas de los ejemplos de examen viven en `IC_CORTO`, `CT_CORTO` y `crErrorCorto`, por id de error; si un
  ejemplo nuevo usa un id con otro sentido, hay que agregar la clave `familia:id` o `tipo:id`.
- En la práctica, IC-COMP-1 aparece tanto si piden el módulo como la componente; el arreglo nuevo («el signo de v_x
  pasa a p_x, y el módulo nunca es negativo») vale para los dos casos.
