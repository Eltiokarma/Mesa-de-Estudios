# Redacción · quimica.estructura-atomica · 26 nov 2026

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre una unidad ya
cerrada (`calidad: 2`). Solo texto: ningún número, respuesta, distractor, dato, dibujo, color ni letra cambió. La marca
`calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/estructura-atomica.js`, su prueba `estructura-atomica.test.js` (cinco expresiones
regulares que fijaban la redacción vieja; se ajustaron a la nueva sin cambiar lo que comprueban) y la práctica propia de
la unidad, `plantillas/particulas-nucleo/generador.js` y `plantillas/niveles-orbitales/generador.js`, cada una con su
`papel.json` regenerado con `herramientas/papel-generador.js` (mismos 8 problemas; solo cambian pasos y explicaciones).
Las otras plantillas de la ficha (`quimica-conceptos`, `configuracion-ubicacion`, `atomo-y-tabla`) son compartidas con
otras unidades y no se tocaron.

Se leyó todo el texto que ve el alumno, volcado por código: las 6 ideas con sus «Lee», consignas, misiones, leyendas,
lecturas en vivo, Predice, «Mira», reglas y condiciones, 20 semillas de «Así se resuelve» y de «Ahora tú» por idea, los
90 ejemplos, el glosario (29 términos), la historia y las tres mesas del laboratorio; de la práctica, 300 semillas de
cada generador y su papel.

## Qué cambió, por tipo de problema

**1. Rótulos con dos puntos en lugar de oraciones (lo más repetido, unos 120 casos).** Pasos de «Mira», soluciones y
pasos de los ejemplos encadenaban rótulos («Hierro neutro: [Ar] 4s² 3d⁶. Carga +3: salen 3.», «Dalton, 1808: …»,
«Piso 3: 9 orbitales y 18 electrones.»). Ahora tienen sujeto y verbo, con la consecuencia dicha.

- Antes: «Fe³⁺: sale uno más; el 4s ya está vacío, sale del 3d.» (idea 5, «Mira»)
  Después: «Para el Fe³⁺ sale uno más, y como el 4s ya está vacío, sale del 3d.»
- Antes: «Bohr, 1913: solo ciertos niveles; al bajar, el electrón suelta luz de un color.» (idea 2, «Mira»)
  Después: «En 1913, Bohr propuso que el electrón solo ocupa ciertos niveles, y que al bajar de uno a otro suelta luz de un
  color.»
- Antes: «Neutro: 26 electrones. Hasta el 4s van 2 + 2 + 6 + 2 + 6 + 2 = 20.» (idea 4, ejemplo «El hierro»)
  Después: «Como es neutro, tiene 26 electrones. Hasta el 4s van 2 + 2 + 6 + 2 + 6 + 2 = 20.»

**2. Reglas dichas como lista de rótulos.** Las seis reglas pasan a oraciones. Ejemplo (idea 2): «Cada modelo explicó una
evidencia nueva. Dalton: átomos macizos (proporciones fijas). Thomson: el electrón. Rutherford: núcleo diminuto y
positivo. Bohr: niveles; al bajar, luz de un color. Hoy: orbitales.» → «Cada modelo explicó una evidencia nueva. Dalton
explicó las proporciones fijas con átomos macizos; Thomson halló el electrón; Rutherford halló un núcleo diminuto y
positivo; en Bohr, el electrón que baja de nivel suelta luz de un color, y hoy se usan orbitales.» Las condiciones de las
ideas 1, 2, 3 y 6 se leen ahora de corrido detrás de «Vale si».

**3. `siFuera` con el molde «Bien X. Pero Y.» sin verbo (unos 110).** En la teoría se rehicieron como oraciones que
dicen qué estuvo bien y qué cambiar: «Bien multiplicar por 100 000. Pero …» → «Multiplicar por 100 000 está bien. Pero
…»; «Bien el orden. Pero esa tiene 18 electrones» → «El orden está bien. Pero esa configuración tiene 18 electrones, y
el átomo neutro tiene 19.» Algunos decían poco o algo raro: «Bien el doble de los orbitales. Pero s es ℓ = 0: la s es
0.» → «Doblar los orbitales está bien. Pero s es ℓ = 0, porque la cuenta empieza con s = 0.»; «Bien buscar un modelo.
Pero Thomson propuso…» → «Thomson propuso electrones dentro de una esfera positiva. Esa idea respondía a otra evidencia,
no a esta.» El relleno genérico de `opciones()` («Bien el camino. Revisa la cuenta paso por paso: ese número no sale.»)
pasó a «El camino puede estar bien, pero la cuenta no da ese número: revísala paso por paso.»

En la práctica, el «Bien» del arranque se dejó: las pruebas de `particulas-nucleo` y `niveles-orbitales` exigen que
cada explicación empiece por «Bien» (`/^Bien/` y `/^(Bien|Ese sí)/`). Ahí se corrigió lo que seguía (ver punto 5).

**4. Textos generados que salían rotos en algunas semillas.**
- Plurales con 1: «Piso 1: 1 cuartos», «Hasta el 4s van 20; los 1 que quedan, al 3d», «quedan 1: 5s, 4d y 5p», «salieron
  1 electrones», «Salen los 1 del 4s», «esa tiene 1 electrones», «llegaron 1». Ahora concuerdan («el que queda entra al
  3d», «queda 1 electrón», «salió 1 electrón»).
- Mayúscula perdida: «neón tiene todas sus cajas con pareja» abría la solución en minúscula → «El neón tiene…».
- Verdadero o falso (idea 2): «I V, II V, III F. Al bajar, suelta luz…» → «En orden queda VVF. La III es falsa: al bajar
  de nivel, el electrón suelta luz de un color fijo.»; los pasos de «Así se resuelve» dicen «La I es verdadera: …».
- Cifras sin espacio de miles en la escala del átomo: «100000 mm» → «100 000 mm» (mismo número, con `Kit.formatear`).
- «Cinco ↑ y 5 en pareja» (idea 6, «Así se resuelve») → «primero cinco ↑, una por caja, y los 5 que siguen se aparean».

**5. Masa por peso (escala de la verdad).** «Un protón pesa unas 1836 veces lo que un electrón» (Lee y glosario), «unas
7300 veces más pesadas que un electrón» (Lee de la alfa y glosario), «uno pesa más» (siFuera de isótopos, en la teoría y
en `particulas-nucleo`) y «protones y neutrones pesan mucho más» (práctica): todo pasa a masa («tiene unas 1836 veces la
masa de un electrón»). Las cifras no cambian.

**6. Ráfagas en «Lee» y en la historia.** «Nadie ve un átomo. Un modelo es…» → «Como nadie puede ver un átomo, un modelo
es…»; la tarjeta del hotel de la idea 3 pasó de cinco oraciones sueltas a dos enlazadas; «Ojo: aquí…» (ideas 1 y 4)
se dice como contraste («Como N son los neutrones, al nitrógeno…»). Historia: «Desde 1808, John Dalton explicó…» →
«En 1808, …, aunque algunas de sus fórmulas estaban equivocadas.»

**7. Alternativas de ejemplos que no se explicaban.** Se agregó la explicación que faltaba, con el error que da cada
valor: idea 2, ejemplos 11 (C y E), 12 (B), 13 (D y E) y 15 (B); idea 5, ejemplos 11 (C y E), 12 (E) y 15 (E); idea 6,
ejemplo 15 (B y D). Los valores se comprobaron a mano contra las alternativas (por ejemplo, idea 5 ej. 12: E =
[Ar] 3d⁹ tiene 27 electrones, el cobalto sin quitar ninguno).

**8. Prosa que repetía la ecuación.** El paso 5 de «Mira» de la idea 6 repetía «(3; 2; −2; −½)», que ya está en su
ecuación, y además se partía dentro del paréntesis a 390 px; ahora dice «Ese sexto electrón es el último del Fe²⁺, y
quedan 4 electrones solos.»

## Comprobaciones

- `node --test contenido/teoria/quimica/estructura-atomica.test.js`: 29 de 29 (con `calidad: 2`, que la unidad ya
  declara; la prueba «la unidad entera cumple el contrato de calidad 2» corre el validador completo y queda en cero).
- `node --test contenido/teoria/teoria.test.js`: 164 de 164.
- Práctica: `particulas-nucleo` 34 de 34, `niveles-orbitales` 31 de 31; también `configuracion-ubicacion` y
  `atomo-y-tabla` en verde (261 en total con la unidad).
- `node herramientas/papel-reglas.js`: nada de estas plantillas.
- `node herramientas/ecuaciones-ancho.js quimica.estructura-atomica`: queda 1 (ver abajo, es anterior a esta pasada).

## Para el auditor

1. **Ecuación de la regla de la idea 4** (`'1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p'`): a 390 px se parte
   después de una flecha. Ya estaba así en `HEAD`; es una ecuación y no se tocó.
2. **`casoOrbSub`, distractor `l`** (idea 3, «Ahora tú»): con ℓ = 0 da el valor 3 y su explicación dice «Leíste bien ℓ.
   Pero cada valor de mₗ… son 2ℓ + 1». Para un s, 3 no sale de «leer ℓ»; conviene revisar ese caso.
3. **Explicaciones nuevas de alternativas** (punto 7): las afirmaciones son mías; en particular, idea 2 ej. 15: «La B no
   era un problema: su átomo ya era neutro» (el de Rutherford). Conviene que el auditor las confirme.
4. **Laboratorio, mesa «Arma cualquier átomo o ion»:** el `bien` de la cuarta invitación dice «no son isótopos, son
   elementos diferentes»; el nombre que la unidad enseña es *isóbaros*. Y la mesa de la nube dice «ψ +» y «ψ −» sin
   presentar ψ. No se cambió porque toca contenido.
5. **Pruebas de la práctica que fuerzan el telegrama:** exigir que la explicación empiece por «Bien» empuja a «Bien el
   3d. Pero…». Si Gerson lo aprueba, la regla podría aceptar también «Es cierto que…» o «… está bien».
6. **Glosario en la app:** cambiaron la definición de «protón» y la de «partícula alfa». Hace falta `npm run catalogo`
   al integrar para que `app/datos/glosario/quimica.json` lo recoja (no se corrió aquí porque ese archivo lo están
   tocando otras sesiones).

## Verificación (26 nov)

Verificador de cierre. Se rehicieron las cuentas de todas las alternativas que esta pasada explicó por primera vez
(punto 7: idea 2, ejemplos 11, 12, 13 y 15; idea 5, ejemplos 11, 12 y 15; idea 6, ejemplo 15) y de los `siFuera` que
cambiaron de sentido (escala del átomo, Bohr, Rutherford, isótopos e isoelectrónicos, orbitales, configuración e iones,
Hund). Todas cuadran: por ejemplo, Cr³⁺ C = [Ar] 4s¹ 3d² (excepción y tres del 3d), E = [Ar] 3d⁶ (24 electrones, el 4s
pasado al 3d); Co²⁺ E = [Ar] 3d⁹ (27); yodo E = (5; 1; −1; −½), el cuarto 5p; escala, 1 cm → 10 m es el factor 1000.
La B del ejemplo 15 de la idea 2 («su átomo ya era neutro») es correcta.

**Errores corregidos (con prueba que falla con la versión del redactor):**
- **3d de un catión, distractor «átomo neutro» (venía de antes):** con carga 2+ decía «cambia el 4s, no el 3d», falso
  para el Cu²⁺ ([Ar] 4s¹ 3d¹⁰ → 3d⁹). Esa alternativa solo sale cuando el 3d cambia; ahora el texto depende de eso
  («después del 4s también sale alguno del 3d»). Prueba nueva en `estructura-atomica.test.js`.
- **Laboratorio, mismo A y distinto Z:** decía «no son isótopos, son elementos diferentes»; ahora «son isóbaros, núcleos
  de elementos diferentes», el nombre que enseña la unidad.
- **Laboratorio, nube del orbital p:** usaba «ψ +» y «ψ −» sin presentar ψ; ahora «ψ es la onda del electrón: cada lóbulo
  lleva su signo, + o −, y no una carga.» (dentro del tope de 16 palabras).

**Notas confirmadas o decididas:**
- `casoOrbSub`, distractor `l` con ℓ = 0: no es un error visible. Con un s, su valor (3) coincide con el de `l1`, y la
  alternativa sale con la explicación de `l1` («s es ℓ = 0…»); se comprobó en 600 semillas.
- Ecuación de la regla de la idea 4, partida tras una flecha a 390 px: se deja (ecuación anterior a esta pasada; partir
  una cadena de flechas no cambia la lectura). Decidido por la sesión, Gerson revisa después.
- «Bien» obligatorio en la práctica: se quitó esa comprobación de `particulas-nucleo` y de `niveles-orbitales`
  (`/^Bien/` y `/^(Bien|Ese sí)/`); las demás siguen. Las explicaciones todavía abren con «Bien»; reescribirlas queda
  para otra pasada.
- Se revisaron las explicaciones reescritas de las dos plantillas (isóbaros, isótonos, A con iones): cuadran.

**Comprobación:** `estructura-atomica.test.js` 31/31; `particulas-nucleo` 34/34, `niveles-orbitales` 31/31 (y las
compartidas `configuracion-ubicacion` 91/91, `atomo-y-tabla` 76/76); validador con `calidad: 2` en 200 semillas: 0;
`papel-reglas.js`: nada de estas plantillas; `ecuaciones-ancho`: queda solo el corte de la regla de la idea 4.
`teoria.test.js` (última corrida): 163 de 164; la unidad pasa, y la única falla es `quimica/mol-y-composicion.js`, otra unidad en obra. La prueba del glosario, que en una corrida anterior fallaba por `app/datos/glosario/*.json` desfasado, ya pasa.
## Segunda pasada: explica (27 nov)

Gerson vio la unidad en la app y dijo que los textos seguían cortos y sin mucho significado. Esta pasada siguió el punto 4
de `docs/metodo/unidad/redaccion-delegada.md` («Explica, no solo pules») con los topes nuevos del punto 6. Solo texto:
ningún número, respuesta, distractor, dato, dibujo, color ni letra cambió, y `calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/estructura-atomica.js` y la práctica propia, `plantillas/particulas-nucleo/generador.js`
y `plantillas/niveles-orbitales/generador.js`, con su `papel.json` regenerado (`herramientas/papel-generador.js`; mismos 8
problemas). Las plantillas compartidas no se tocaron y no se corrió `npm run catalogo`.

### Qué cambió, por tipo

1. **Reglas (6).** Cada una dice ahora por qué vale lo que dice: el ion sigue siendo el mismo elemento porque Z no cambia
   (idea 1); cada modelo cambió porque apareció una evidencia que el anterior no explicaba (idea 2); el piso n tiene n
   pasillos (idea 3); el 4s va antes que el 3d porque cuesta menos, y el Cr y el Cu quedan así porque es más estable
   (idea 4); el catión pierde primero los electrones más alejados del núcleo (idea 5); los electrones solos no se anulan
   y por eso un imán atrae a la especie (idea 6).
2. **«Vale si» (6).** Cada condición dice además qué pasa cuando no se cumple: en un proceso nuclear sí cambia el
   elemento; fuera de su época el modelo falla; un ion o un átomo excitado se acomoda de otra forma; con la convención
   contraria cambian los signos del último electrón.
3. **Lee y Mira.** Las tarjetas agregan el porqué (casi toda la masa está en el núcleo; un modelo se cambia si un
   resultado no cuadra; los dos de un cuarto tienen espín opuesto porque dos electrones nunca tienen la misma dirección
   completa). Los 36 pasos de «Mira» dicen qué cambia y por qué («el cuarto ya no encuentra una caja vacía, así que se
   aparea…»).
4. **Predice: los 18 `siFuera`.** Cada uno nombra el razonamiento equivocado, dice por qué falla y qué había que mirar.
5. **«Así se resuelve».** Los pasos dicen por qué se hace cada cosa. El verdadero o falso de la idea 2 se partió en un
   paso por afirmación (juntas pasaban de 50 palabras), y el «sentido» ya no dice «con una sola letra cambiada, ya sería
   otra alternativa», que no explicaba nada.
6. **«Ahora tú»: unas 150 explicaciones de alternativas, en las seis ideas.** Se dejó el molde «X está bien. Pero Y.» y
   cada explicación dice qué hizo el alumno («le quitaste la carga», «seguiste por pisos», «contaste uno de más»), por qué
   no vale y qué se debió mirar. La evidencia que lleva a cada modelo (idea 2) dice ahora qué explicó cada científico y qué
   pide la evidencia dada; el relleno de las cuentas vecinas sigue igual.
7. **Los 90 ejemplos.** Las explicaciones de las alternativas incorrectas nombran el error y su causa («como si el ion
   fuera neutro», «olvida que el Ca²⁺ ya perdió dos»), y los pasos secos dicen qué significa el resultado.
8. **Glosario (18 `simple`).** Cada uno con un ejemplo o una imagen de todos los días, dentro de las 14 palabras: «el
   carbono de un lápiz tiene seis», «como piso, pasillo y cuarto», «como un pasajero sin compañero». Ninguno delata una
   predicción (las pruebas de lo previo pasan).
9. **Práctica.** Las dos plantillas ya no abren cada explicación con «Bien X.»: se rehicieron las 38 de
   `particulas-nucleo` y las 45 de `niveles-orbitales` con el mismo criterio, conservando el «Así sale…» que la prueba exige.
   En un dato de `particulas-nucleo` quedaba un «el protón pesa unas 1836 veces más»: pasa a masa.
10. **Concordancias que salían rotas en algunas semillas:** «quedan 1 electrón solo», «los mismos 1 electrones» (hidrógeno),
   «la diferencia de 1 protones», «salen 1», «mostrarlos» con un solo electrón.

### Seis ejemplos de antes y después

**Regla, idea 1.**
- Antes: «Z decide el elemento, y A suma protones y neutrones. Los isótopos tienen el mismo Z y reaccionan igual (¹²C y
  ¹⁴C); los isóbaros, el mismo A (¹⁴C y ¹⁴N); los isótonos, el mismo N (¹³C y ¹⁴N), y los isoelectrónicos, los mismos
  electrones.»
- Después: «Z, que cuenta los protones, decide el elemento: un átomo que gana o pierde electrones sigue siendo ese
  elemento, pero queda con carga: es un ion. Los isótopos tienen el mismo Z y reaccionan igual (¹²C y ¹⁴C); los isóbaros,
  el mismo A (¹⁴C y ¹⁴N); los isótonos, el mismo N (¹³C y ¹⁴N), y los isoelectrónicos, los mismos electrones.»

**Regla, idea 5.**
- Antes: «Un anión suma electrones en el orden de llenado. Un catión pierde primero los de mayor n (4s antes que 3d) y, a
  igual n, los de mayor ℓ (5p antes que 5s).»
- Después: «Un anión recibe sus electrones extra en el orden de llenado, como si siguiera llenando el hotel. Un catión
  pierde primero los de mayor n (4s antes que 3d), que son los más alejados del núcleo, y, a igual n, los de mayor ℓ (5p
  antes que 5s).»

**«Vale si», idea 4.**
- Antes: «Vale si el átomo es neutro y está en su estado de menor energía.»
- Después: «Vale si el átomo es neutro y está en su estado de menor energía; si es un ion o recibió energía, sus
  electrones se acomodan de otra forma.»

**`siFuera` de Predice, idea 2 (la opción «Electrones en órbitas fijas»).**
- Antes: «Las órbitas fijas son de Bohr, dos años después, y tratan de los electrones, así que no explican por qué unas
  alfas rebotan.»
- Después: «Las órbitas fijas son del modelo de Bohr, de dos años después, y hablan de los electrones. Un electrón tiene
  muy poca masa para hacer rebotar una alfa, así que las órbitas no explican el rebote.»

**Explicación de alternativas, idea 1, ejemplo 12 («Número de masa de un ion»).**
- Antes: «La A suma electrones y neutrones: 24 + 30. La C resta la carga en vez de sumarla: 22 + 30.»
- Después: «La A suma electrones y neutrones, 24 + 30, como si el ion fuera neutro. La C resta la carga en vez de
  sumarla, 22 + 30, aunque un ion positivo tiene más protones que electrones.»

**Explicación de alternativa en «Ahora tú», idea 2 (evidencia «Unas pocas alfas rebotan…», opción Thomson).**
- Antes: «Thomson propuso electrones dentro de una esfera positiva. Esa idea respondía a otra evidencia, no a esta.»
- Después: «Thomson propuso electrones dentro de una esfera positiva para explicar los rayos catódicos. Esta evidencia
  habla de un rebote, y solo una carga positiva concentrada hace rebotar a una alfa.»

### Comprobaciones

- `estructura-atomica.test.js`: 31 de 31 (la unidad declara `calidad: 2`; el validador completo queda en cero). Validador
  simulando `calidad: 2` con 200 semillas: cero.
- `particulas-nucleo` 34 de 34 y `niveles-orbitales` 31 de 31; las compartidas `configuracion-ubicacion` y `atomo-y-tabla`,
  167 de 167.
- `teoria.test.js`: 163 de 164. La única falla es «glosario … archivos de la app al día», porque cambiaron 18 `simple` y
  no se corrió `npm run catalogo` (lo corre la sesión al integrar).
- `ecuaciones-ancho` (servidor propio en el puerto 4262, cerrado al terminar): queda solo el corte de la regla de la
  idea 4 tras una flecha, que viene de antes.
- Un barrido de 400 semillas por idea y 600 por plantilla buscando plurales rotos, «undefined», «NaN» y espacios dobles:
  quedan solo falsos positivos.

### Para el auditor

1. **Afirmaciones nuevas que conviene confirmar** (son ciertas a nivel escolar, pero son mías): «un electrón tiene muy
   poca masa para hacer rebotar una alfa» (idea 2); «los electrones de la capa de valencia son los que participan en las
   reacciones» (idea 4, Lee); «el 4s… son los más externos o más alejados del núcleo» (idea 5, regla, Mira y pasos), que
   simplifica la razón real del orden de salida; «3d⁵ y 3d¹⁰ son más estables» como causa de la excepción del Cr y el Cu;
   en el «Lee» de la idea 3, «dos electrones nunca tienen la dirección completa igual» (Pauli, sin nombrarlo).
2. **Condiciones nuevas de «Vale si»:** idea 4 («si es un ion o recibió energía, sus electrones se acomodan de otra
   forma») e idea 5 («si recibió energía, algún electrón puede estar en un subnivel más alto»). Conviene ver que no
   choquen con lo que el examen da por supuesto.
3. **Dalton y el agua:** el primer borrador de «Mira» (idea 2) ponía de ejemplo «dos de hidrógeno por uno de oxígeno en
   el agua» como explicación de Dalton, pero Dalton escribía el agua como HO. Se cambió por «nunca en pedazos de átomo».
4. **`casoDesap`, distractor «todos»:** con el cromo (4s¹ 3d⁵) la explicación vieja decía «algunos ya van en pareja», y
   eso es falso porque no hay ningún par. Ahora, si el último subnivel no pasa de una flecha por caja, la explicación dice
   que otro subnivel también tiene electrones solos.
5. **Sigue de antes:** la ecuación de la regla de la idea 4 se parte tras una flecha a 390 px.
6. **Glosario en la app:** al integrar hace falta `npm run catalogo` para que `app/datos/glosario/quimica.json` recoja
   los 18 `simple` nuevos.

## Verificación de la segunda pasada (27 nov)

Verificador de cierre. Se leyeron todas las oraciones nuevas (teoría en 60 semillas por idea; `particulas-nucleo` y
`niveles-orbitales` en 120) contra HEAD y se resolvieron las notas.

**Datos, opciones y respuestas contra HEAD (200 semillas por idea, más las 500 a 505):** iguales. Solo cambian el texto,
el V/F de «Así se resuelve» de la idea 2 partido en un paso por afirmación (las mismas respuestas) y, en
`particulas-nucleo`, el dato «el protón pesa unas 1836 veces más» → «tiene unas 1836 veces su masa» (mismo número).

**Corregido (con prueba que falla con la versión del redactor, en `estructura-atomica.test.js`):**
- **Configuración tras el kriptón (idea 4, «Ahora tú»).** La solución decía «se llenan el 5s, el 4d y el 5p» con 1 a 12
  electrones, que no llegan al 5p (con 1 o 2, ni al 4d). Venía de antes; ahora nombra solo los subniveles que reciben
  electrones: «quedan 3 electrones, que van al 5s y al 4d…»; «queda 1 electrón, que va al 5s, el más barato».
- **Cromo y cobre (idea 4).** La solución decía «queda medio lleno o lleno» para los dos; ahora dice cuál: «medio lleno,
  con 5» (Cr) o «lleno, con 10» (Cu).
- **Condición de la idea 4.** «Si es un ion…, sus electrones se acomodan de otra forma» chocaba con la regla 5 (un anión
  sigue el orden de llenado). Ahora: «si perdió electrones o recibió energía, sus electrones pueden quedar de otra forma».
  (Con «catión» la idea 5 dejaba de estrenar esa palabra y el validador de calidad 2 fallaba.)
- **Porqués del V/F (idea 2):** dos encadenaban dos «:» («es uno de sus postulados: los átomos…»); ahora «es uno de sus
  postulados, y para él también tenían la misma masa» y «es su idea central, y entre dos niveles no hay lugares
  intermedios».
- Sin prueba, de lengua: «Sale 1 electrón: primero los del 4s…» (Cu⁺) → «Sale 1 electrón, y sale del 4s, que está en el
  nivel más alto; el 3d no se toca.»; en `niveles-orbitales`, «no tiene mₗ = +1: su ℓ es menor» → «…, porque su ℓ es menor».

**Notas del redactor, confirmadas (cierto en química escolar):** «los del 4s son los más externos, los más alejados del
núcleo» es la regla de los libros y del examen (salen primero los de mayor n; la razón fina, de energías del ion, no se
pide); «3d⁵ y 3d¹⁰ son más estables» es la explicación escolar de Cr y Cu; un electrón tiene muy poca masa para
desviar una alfa (la alfa tiene unas 7300 veces su masa, también cierto); los de valencia son los que participan en las
reacciones; «dos electrones nunca tienen la dirección completa igual» (Pauli); la condición de la idea 5 no choca con el
examen. Dalton y el agua: bien quitado.

**Comprobación:** `estructura-atomica.test.js` 32/32; `particulas-nucleo`, `niveles-orbitales`, `configuracion-ubicacion`
y `atomo-y-tabla` en verde; validador con `calidad: 2` en 200 semillas: 0; `papel-generador.js --revisar`: al día;
`papel-reglas.js`: nada de estas plantillas (solo `quimica-conceptos p2`, compartida, sin tocar).

`contenido/teoria/teoria.test.js`: 163 de 164; la única falla, «glosario … archivos de la app al día», espera a
`npm run catalogo`.

Archivos de esta verificación: `contenido/teoria/quimica/estructura-atomica.js`, `contenido/teoria/quimica/estructura-atomica.test.js`,
`plantillas/niveles-orbitales/generador.js`.
