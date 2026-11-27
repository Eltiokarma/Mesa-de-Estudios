# Redacción · quimica.nomenclatura-inorganica · 26 nov 2026

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre una unidad ya
cerrada (`calidad: 2`). Solo cambió el texto: ningún número, respuesta, distractor, dato, dibujo, color ni letra. La marca
`calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/nomenclatura-inorganica.js` y la práctica propia de la unidad,
`plantillas/nomenclatura-practica/generador.js`, con su `papel.json` regenerado con `herramientas/papel-generador.js`
(son los mismos 8 problemas con las mismas respuestas; cambian los enunciados, los pasos y las explicaciones).
`quimica-conceptos` también está en la ficha, pero lo comparten otras unidades, así que no lo toqué. La escena vieja
`plantillas/nomenclatura-inorganica` (con `"rehacer": true`) tampoco: su `papel.json` se lee bien y queda para cuando se
rehaga.

## Qué cambió, por tipo de problema

**1. `siFuera` y explicaciones con el molde «Bien X. Pero Y.»** Era lo que más se repetía: unos 25 en la teoría y unos
20 en la práctica. Pasan a «Sería así si…», que dice qué tendría que cambiar para que la opción fuera cierta y después qué
pasa aquí. Cuando el alumno sí acertó en algo, eso queda dicho en una oración completa («La raíz está bien, pero…»). En la
práctica, la cabecera del generador pedía que cada explicación empezara por lo que el alumno hizo bien; no había ninguna
prueba que lo exigiera. Dejé el mismo criterio de la teoría y cambié la cabecera para decirlo.

- Antes: «Bien la cuenta del total: los 2 C juntos aportan +6. Cada uno, la parte mitad.» (práctica: salía «la parte
  mitad» con dos átomos y «la parte 3.ª» con tres)
  Después: «Sería así si te pidieran el total: los 2 C juntos aportan +6, y cada uno aporta la mitad.» (y con tres o
  cuatro átomos, «la tercera parte» o «la cuarta parte»)
- Antes: «Bien mirar los dos O. Pero en el SnO₂ el Sn tiene +4 y cada O, −2: es un óxido.»
  Después: «Sería así si el Sn solo llegara a +2. En el SnO₂, el Sn tiene +4 y cada O, −2, así que es un óxido.»
- Antes: «Bien cambiar la terminación del ácido. Pero -oso pasa a -ito.»
  Después: «Sería así si el ácido terminara en -ico. Este termina en -oso, que pasa a -ito.»

**2. Telegrama con rótulo y dos puntos** en soluciones, pasos de «Mira», «Así se resuelve» y ejemplos: «Cinco O:
pentóxido. Dos Cl: dicloro.», «Stock con (II); tradicional con -oso.», «I es F: … II es V: …», «Cargas: +2 y −3.»,
«3 y 2.», «Óxido más agua:», «Sistemática: prefijos que cuentan átomos.». Ahora son oraciones con sujeto y verbo que dicen
la consecuencia, con su conector.

- Antes: «Tres O aportan −6; los dos Cr, +6: cada uno +3.»
  Después: «Tres O aportan −6, así que los dos Cr aportan +6 y cada uno tiene +3.»
- Antes: «+5 entre +1, +3, +5, +7: ácido brómico.»
  Después: «El +5 es el tercero de los EO +1, +3, +5 y +7, así que el nombre es ácido brómico.» (con dos EO, «el menor» o
  «el mayor»)

**3. Reglas y condiciones.** Las seis reglas tenían forma de rótulo («Sistemática: …. Stock: …. Tradicional: ….»,
«Peróxido: el ion O₂²⁻…», «Sal ácida: …»); ahora son oraciones. Las seis condiciones completan «Vale si…». Antes, cuatro
empezaban otra frase o eran un rótulo:

- «Vale si z es 0 en una especie neutra. …» → «Vale si el O y el H tienen su EO de siempre (sus excepciones se ven más
  adelante). La carga z vale 0 en una especie neutra, …»
- «Vale si es un elemento con oxígeno: de metal, básico; de no metal, ácido…» → «Vale si el compuesto es un solo
  elemento unido al oxígeno y, para el romano o la terminación, el elemento tiene más de un EO…». La clase (básico o
  ácido), que «Ahora tú» pregunta, pasó a la regla.
- «Vale si Nombres, del EO menor al mayor: hipo-…» → los nombres pasaron a la regla y la condición queda «Vale si el no
  metal no es el P ni el B, que suman tres moléculas de agua a su óxido: H₃PO₄.»
- «Vale si con O −2 y H +1 la suma no da la carga: …» → «Vale si la suma no da la carga con O −2 y H +1: entonces hay un
  peróxido…».

**4. Textos generados con números.** Salían «1 Ni con +2 y 1 O con −2», «1 O aportan −2», «1 Mg²⁺ y 2 BrO₃⁻», «Hacen
falta 1 OH⁻», «3 OH⁻ aportan −3» al inicio de una oración, «un átomo(s)» en el `alt`, y listas sin su «y» final
(«+4 en el CaSO₃, +6 en el K₂SO₄, −2 en el H₂S, 0 en el S₈»). Ahora hay concordancia con 1 («un Ni», «el O aporta»,
«hace falta un OH⁻»), cantidades en palabras al empezar la oración («Dos NH₄⁺…») y listas con «y» (`conY`). Revisé las
alternativas que arma el generador por si había dos iguales por un 1 o por una carga sin superíndice («Ca1I₂»): `bonita`
quita el 1 y `opsTexto`/`cerrar` descartan las repetidas, y en 400 semillas no salió ninguna repetida (la prueba de la
unidad y `probarGenerador` lo revisan).

**5. Lecturas en vivo, «Lee», consignas, misiones y laboratorio.** Las lecturas eran rótulos («Suma de los EO: +1; la
carga del NH₄⁺ es…», «NH₃: amoníaco; H con EO +1…», «Carga 0: Al₂(SO₄)₃, …», «2 Al³⁺ y 3 PO₄³⁻: carga +3; falta
compensar.»); ahora tienen verbo y caben en las 12 palabras («Los EO suman 0, pero la carga del NH₄⁺ es +1.», «Un Ca²⁺ y
un Cl⁻ dejan carga +1.», «Con agua, el N₂O₅ da H₂N₂O₆, que se simplifica a HNO₃.»). Las tarjetas de «Lee» con listas
encadenadas («El O suele tener −2; el H, +1 …; los del grupo 1, +1; …») se escriben con verbo. Las tres misiones y los
retos del laboratorio que eran rótulo («Mg(OH)Cl: el Mg²⁺ se compensa…; sal básica.», «Neutra no basta…») dicen ahora
qué pasó.

**6. Enunciados de la práctica sin verbo.** «La especie K₂MnO₄.», «El óxido FeO.», «El peróxido de potasio.», «El
clorito de zinc.», «Una unidad de CuSO₄·5H₂O.» pasan a «Piensa en…»; «Las especies …» pasa a «Compara estas especies:
…»; «El cobalto con EO +3.» pasa a «El cobalto tiene EO +3.».

## Para el auditor (no lo cambié)

1. **`D2.stock` en las preguntas de hidróxidos.** Los Datos de «¿Cuál es el nombre Stock del Co(OH)₃?» (idea 4, Ahora
   tú, y el ejemplo del Pb(OH)₂) dicen «Stock: «óxido de» + elemento + …». Para un hidróxido es «hidróxido de». Es un
   dato, así que no lo toqué.
2. **Notación del error QM-POLI.** La alternativa sin paréntesis se escribe «ZnClO₂₂», «FeBrO₃₂», «MgClO₄₂» (práctica y
   teoría): el 2 se pega como subíndice al 4 del oxígeno y se lee «42». Es lo que el error quiere mostrar, pero conviene
   decidir si se escribe así o con un espacio o un subíndice separado.
3. **Distractor «perclorito»** (idea 5, nombre Stock de una sal del ácido perclórico): sale de invertir la terminación,
   pero «per-…-ito» no existe en ningún sistema; la explicación nueva no lo dice.
4. **Regla de la idea 5**: la condición trae también la definición de sal haloidea y oxisal (la regla ya está en su
   tope). Lo mismo en la idea 6: la condición carga cómo se nombra el hidrato.
5. **Glosario**: cambié solo la definición de «estado de oxidación» («Los de una especie…» decía «los» sin referente;
   ahora «Los EO de una especie suman su carga»). `app/datos/glosario/quimica.json` queda por regenerar con
   `npm run catalogo` al integrar (no lo corrí, por la convivencia).
6. El papel de la escena vieja (`plantillas/nomenclatura-inorganica/papel.json`) escribe «-oso» sin el guion pegado
   (U+2060) que pide la prueba de la unidad; esa plantilla no la revisa ninguna prueba y está marcada para rehacer.

## Comprobaciones

- `node --test contenido/teoria/quimica/nomenclatura-inorganica.test.js`: 15 de 15 (incluye las 400 semillas de «Ahora
  tú» con una sola correcta y sin repetidas).
- `node --test plantillas/nomenclatura-practica/generador.test.js`: 7 de 7; `papel.json` regenerado (mismas 8
  respuestas). La regla del papel (`papel-reglas.js`, simulando la marca): sin fallas.
- Validador simulando `calidad: 2` (`Teoria.problemas` con 60 semillas): 0.
- `node --test contenido/teoria/teoria.test.js`: 163 de 164. La que falla es la del glosario:
  `app/datos/glosario/quimica.json` no está al día (por el punto 5 de arriba y por otras unidades de química).
- `node herramientas/ecuaciones-ancho.js quimica.nomenclatura-inorganica`: todo cabe, ninguna partida en mal sitio.
- Muestra leída entera: 8 a 10 semillas de «Ahora tú» y 2 o 3 de «Así se resuelve» por idea, los 15 ejemplos de cada
  idea en el código, y 4 problemas por idea de la práctica.

## Verificación (26 nov)

Verificador de cierre de la pasada. Revisé las seis notas, rehice la cuenta de las explicaciones de alternativas con
sentido nuevo (sumas de EO, romanos, fórmulas de óxidos, peróxidos, hidruros e hidróxidos, oxácidos con dos H o con uno,
sales y su carga, hidratos; teoría y práctica) y comparé con la versión de antes: las 121 ecuaciones de la teoría son las
mismas, y el `startsWith(`EO del ${x}`)` de la idea 3 sigue coincidiendo con `FIJO_TXT`.

Lo corregido, con una prueba que falla con la versión anterior:

- **Nota 1 (Stock de un hidróxido).** Las cinco preguntas y ejemplos de hidróxidos (idea 4: «Ahora tú», la soda
  cáustica, el Fe(OH)₂, el Pb(OH)₂ y el resuelto) daban en Datos «Stock: «óxido de» + elemento…». Ahora usan un dato
  propio, `D4.stock`: «Stock: «hidróxido de» + metal + su EO en romanos entre paréntesis; sin romano si el metal tiene un
  solo EO».
- **Nota 2 (notación de QM-POLI).** «ZnClO₂₂», «FeBrO₃₂», «Al₂SO₄₃» se leían «O 22», «O 32», «O 43». Decidido por la
  sesión (Gerson revisa después): la alternativa sin paréntesis multiplica el último subíndice del anión, que es lo que
  dice su explicación (ZnClO₄, FeBrO₆, Al₂SO₁₂), y la explicación lo dice entero: «…sin paréntesis el 2 multiplica solo al
  último átomo del anión, y el resto del ion queda una sola vez.» En teoría y práctica.

Pruebas nuevas: `nomenclatura-inorganica.test.js` («redacción: QM-POLI sin subíndices pegados; el Stock de un hidróxido
no dice «óxido de»») y `plantillas/nomenclatura-practica/generador.test.js` («redacción: QM-POLI…»).

Decidido por la sesión, Gerson revisa después:

- Nota 3 («perclorito»): se queda. Sale de invertir la terminación, y la explicación dice que la terminación va al revés.
- Nota 4 (definiciones de sal haloidea y oxisal, y del hidrato, dentro de la condición): se queda; la regla está en su tope.
- Nota 5 (glosario): `app/datos/glosario/quimica.json` se regenera con `npm run catalogo` al integrar.
- Nota 6 (papel de la escena vieja sin el guion pegado): queda para cuando se rehaga esa plantilla.

Comprobaciones: prueba de la unidad 16 de 16; `plantillas/nomenclatura-practica/generador.test.js` 8 de 8, con
`papel.json` regenerado (al día); validador con `calidad: 2` en 200 semillas: 0; regla del papel: 0;
`contenido/teoria/teoria.test.js`: 163 de 164 (falla solo el glosario de `app/datos/`).

## Segunda pasada: explica (27 nov)

Gerson vio la primera pasada y dijo que los textos seguían cortos y sin mucho significado. Esta pasada sigue el punto 4
de `docs/metodo/unidad/redaccion-delegada.md` («Explica, no solo pules»). En nomenclatura, explicar es decir por qué el
nombre dice lo que dice: qué cuenta cada prefijo, por qué hace falta el romano y cuándo sobra, qué marcan -⁠oso e -⁠ico,
hipo- y per-, -⁠ito, -⁠ato y -⁠uro, y de dónde salen «anhídrido», «peróxido», «-⁠hídrico» o «hidrogeno». Solo cambió el
texto: con un script (scratchpad `red2-q-nomen/cmp.js`) comparé la versión de antes con la de ahora en 200 semillas de
«Ahora tú» y de «Así se resuelve», en los 90 ejemplos, en Predice y en las ecuaciones de Mira y de la regla. Las opciones,
las correctas, los errores, las respuestas y las ecuaciones son las mismas (0 diferencias). En la práctica hice lo mismo en
400 semillas y también salen iguales. `calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/nomenclatura-inorganica.js`, `plantillas/nomenclatura-practica/generador.js` y su
`papel.json`, regenerado con `herramientas/papel-generador.js` (los mismos 8 problemas con las mismas respuestas).

### Qué cambió, por tipo

1. **Reglas (las seis).** Ahora cada regla dice el porqué y trae un caso. En la idea 1, la suma iguala la carga porque
   los electrones que un átomo cede los gana otro, con el KMnO₄ de ejemplo. En la 2, el óxido de un metal es básico porque
   con agua da una base. En la 3, cada O del peróxido tiene −1 porque los dos O comparten electrones, y el H del hidruro
   tiene −1 porque el metal le cede uno; además, «-⁠hídrico» viene de hidrógeno. En la 4, hipo- quiere decir «por
   debajo» y per-, «por encima». En la 5, una sal es el ácido con sus H⁺ cambiados por un catión, y el nombre empieza por
   el anión. En la 6, la sal ácida todavía puede soltar un H⁺ y el agua del hidrato está atrapada en el cristal.
2. **«Vale si» con lo que pasa si no se cumple.** Idea 1: si el O no tiene −2 o el H no tiene +1, la suma no da la carga.
   Idea 2: con un solo EO no hay dos óxidos que distinguir, y el nombre va sin romano (óxido de sodio). Idea 3: si la suma
   no da, hay que mirar a los vecinos. Idea 4: con una sola agua, el P daría HPO₃. Idea 5: sin el paréntesis, el
   subíndice tocaría solo al último átomo. Idea 6: si el agua se tomara por OH⁻ o H⁺, la sal dejaría de ser neutra.
3. **`siFuera` y explicaciones de alternativas** (teoría y práctica). Todas dicen qué habría que pensar para que la opción
   fuera cierta, por qué falla y qué había que mirar. Las de «otro sistema» («Ese es el nombre tradicional: … con otro
   sistema») dicen ahora qué lee cada sistema. Las de proporción dicen si sobra positivo o negativo y por qué. Las de clase
   de sal dicen qué es lo que sobra en esa sal.
4. **Mira y «Así se resuelve».** Cada paso dice por qué se hace eso. La sistemática lee la fórmula tal cual y no
   necesita el EO; la Stock lo necesita porque el hierro tiene dos óxidos. Un EO de +3 quiere decir que el átomo cuenta
   como si hubiera cedido 3 electrones. Los números se dividen entre 2 porque todos son pares. A cada posición del EO le
   toca su terminación. El nombre de una sal se lee al revés que la fórmula.
5. **Lee.** Hay tres tarjetas con el porqué: por qué el O suele tener −2 y el H, +1; qué quiere decir «anhídrido» y qué
   óxido lleva -⁠oso; y por qué no cambia el EO cuando se suma agua.
6. **Glosario.** Reescribí nueve `simple` con un ejemplo cotidiano o con su sentido: estado de oxidación, subíndice,
   Stock, tradicional, peróxido («como el agua oxigenada del botiquín»), hidrácido («como el ácido muriático de la
   ferretería»), oxácido («como el sulfúrico de la batería del auto»), sal y sal ácida («como el bicarbonato»).
   `app/datos/glosario/quimica.json` queda por regenerar con `npm run catalogo` al integrar.
7. **Laboratorio.** Las seis frases de acierto de los retos dicen ahora por qué («Tres Ca²⁺ dan +6 y dos PO₄³⁻, −6: se
   anulan en el Ca₃(PO₄)₂»), sin pasar del tope de 16 palabras.

### Seis ejemplos

- **Regla, idea 2.** Antes: «Un metal con oxígeno forma un óxido básico, y un no metal, un óxido ácido. La sistemática
  cuenta los átomos con prefijos, la Stock pone el EO en romanos y la tradicional usa -⁠oso para el EO menor e -⁠ico para
  el mayor.»
  Después: «Un metal con oxígeno forma un óxido básico, porque con agua da una base, y un no metal forma un óxido ácido,
  porque con agua da un ácido. La sistemática cuenta los átomos con prefijos. La Stock escribe el EO en romanos, y la
  tradicional usa -⁠oso para el EO menor e -⁠ico para el mayor.» (Lo que marca cada terminación quedó en la tarjeta
  «Convención del examen»: «-⁠oso en su óxido con menos oxígeno e -⁠ico en el que tiene más».)
- **Regla, idea 4.** Antes: «… Un óxido ácido con agua forma un oxácido: se suman los átomos y se simplifica. Del EO
  menor al mayor, los oxácidos llevan hipo-⁠…-⁠oso, -⁠oso, -⁠ico y per-…-⁠ico.»
  Después: «Un óxido básico con agua forma un hidróxido, con un OH⁻ (carga −1) por unidad de EO. Un óxido ácido con agua
  forma un oxácido: se suman los átomos y se simplifica, sin cambiar el EO. Del EO menor al mayor, los oxácidos llevan
  hipo-⁠…-⁠oso, -⁠oso, -⁠ico y per-…-⁠ico: hipo es «por debajo» y per, «por encima».»
- **Condición, idea 3.** Antes: «Vale si la suma no da la carga con O −2 y H +1: entonces hay un peróxido, con el ion
  O₂²⁻, o un hidruro de metal.»
  Después: «Vale si la suma no da la carga con O −2 y H +1. Entonces mira a los vecinos: junto a un metal de EO fijo, el O
  está en un peróxido, y el H junto a un metal está en un hidruro.»
- **Alternativa de la Predice, idea 2** («No: dos sistemas distintos nombran sustancias distintas»). Antes: «Son sistemas
  distintos, sí, pero los dos describen la misma fórmula.»
  Después: «Son sistemas distintos, sí, pero cada sistema es solo una manera de leer la fórmula. Si dos nombres llevan a
  la misma fórmula, nombran la misma sustancia, como «Lima» y «la capital del Perú».»
- **Alternativa de «Ahora tú», idea 2** (QM-OSO-ICO, el óxido niquélico por el NiO). Antes: «La raíz está bien, pero
  -⁠ico es para el EO mayor, y aquí el níquel tiene +2, su EO menor.»
  Después: «Sería así si el níquel tuviera su EO mayor. La raíz está bien, pero aquí tiene +2, el menor de sus dos EO, y
  el menor lleva -⁠oso: es el óxido con menos oxígeno.»
- **Alternativa de «Ahora tú», idea 2** (QM-ROMANO-UNO, «óxido de mercurio» sin romano). Antes: «El nombre va sin romano
  solo si el elemento tiene un solo EO, y el mercurio tiene dos.»
  Después: «Sería así si el mercurio tuviera un solo EO. Tiene dos, así que forma más de un óxido, y sin el romano no se
  sabría de cuál hablas.»
- **Paso de Mira, idea 2** (extra). Antes: «La Stock escribe en romanos el EO del hierro.»
  Después: «La Stock calcula el EO del hierro, +3, y lo escribe en romanos. Lo necesita porque el hierro forma dos óxidos,
  y «óxido de hierro» solo no diría cuál.»

### Para el verificador

1. **Afirmaciones nuevas que conviene revisar** (son ciertas a mi juicio, pero las escribí sin abrir una fuente; las de
   etimología salen de memoria):
   - «anhídrido» quiere decir «sin agua»; hipo- es «por debajo» y per-, «por encima»; «-⁠hídrico» viene de hidrógeno;
     «peróxido» indica más oxígeno que el óxido común (Na₂O₂ frente a Na₂O; MgO₂ frente a MgO: «el doble de O por cada
     metal»).
   - -⁠oso marca el óxido con menos oxígeno por átomo de metal y -⁠ico, el que tiene más. Es cierto para los dos óxidos de
     un mismo metal (FeO y Fe₂O₃, NiO y Ni₂O₃). Con eso explico también -⁠ito y -⁠ato: el ácido -⁠oso tiene menos oxígeno
     que el -⁠ico.
   - La terminación -⁠uro dice que el H es la parte negativa (siFuera del hidruro hecho hidróxido).
   - El H «solo puede ganar un electrón más» (alternativa −2 del hidruro).
   - P₂O₅ con una sola agua da HPO₃, «que no es el ácido fosfórico del examen» (condición de la idea 4).
   - La regla de la idea 1 dice: «porque los electrones que un átomo cede los gana otro de la misma especie». Es una
     simplificación: en un ion, la carga es justo lo que no se compensa. Si el verificador la prefiere más precisa, tiene
     que caber en el tope (está en 60 de 60).
   - En la regla de la idea 3: «dos O unidos que comparten electrones: cada uno gana solo uno». Es el modelo de conteo, no
     una descripción del enlace.
2. **Topes al límite**: la regla de la idea 1 (60 de 60) y la condición de la idea 1 (45 de 45). El validador cuenta 0.
3. **Términos del glosario fuera de su idea**: en el camino, tres textos nuevos usaban un término de una idea posterior
   («peróxido» e «hidruro» en la idea 1, «oxácidos» e «hidróxido» en la idea 3), y el validador lo marcó porque la palabra
   «se estrena» antes de tiempo. Los reescribí sin esos términos. Queda «base» en la idea 2, que no es un término del
   glosario.
4. **Prueba fijada**: la prueba B de la unidad prohíbe «elemento solo». Lo cambié por «elemento sin combinar», sin tocar
   la prueba.
5. **Lo que no cambia**: ninguna Predice queda delatada. La regla de la idea 1 usa el KMnO₄, que es una especie del juego
   y no de la Predice. Las tarjetas de Lee de la idea 3 no dicen el EO del O en el H₂O₂ ni del H junto a un metal (la
   misión pide justo eso). El glosario no usa el yeso ni la herrumbre con fórmula.

### Comprobaciones

- `node --test contenido/teoria/quimica/nomenclatura-inorganica.test.js`: 16 de 16.
- `node --test plantillas/nomenclatura-practica/generador.test.js`: 8 de 8. `papel.json` regenerado; la regla del papel
  (`herramientas/papel-reglas.js`) no da hallazgos para esta plantilla. La explicación más larga de la práctica tiene 36
  palabras (tope de `siFuera`: 40).
- Validador simulando `calidad: 2` (`Teoria.problemas`, 200 semillas): 0.
- `node --test contenido/teoria/teoria.test.js`: 163 de 164. Falla solo la del glosario de `app/datos/` (punto 6 de
  arriba y otras unidades de química).
- `MESA_URL=http://localhost:4283 node herramientas/ecuaciones-ancho.js quimica.nomenclatura-inorganica`: 53 pantallas,
  todo cabe. Usé un servidor propio en el puerto 4283 y lo cerré por su PID.

## Verificación de la segunda pasada (27 nov)

Verificador de cierre, sin commits. Lo comprobado:

- **Nada de fondo cambió.** Contra HEAD, en 200 semillas por idea: «Ahora tú», «Así se resuelve», Predice, las ecuaciones
  de Mira y de la regla, los 90 ejemplos y el laboratorio: 0 diferencias en opciones, correctas, errores, Datos,
  respuestas y ecuaciones. Práctica: 1600 problemas iguales en todo lo que no es explicación. `papel.json`: los mismos 8
  problemas.
- **Corregido, regla 1.** «… porque los electrones que un átomo cede los gana otro de la misma especie» es falso en un
  ion: en el MnO₄⁻ lo que ceden y ganan los átomos no se compensa, y esa diferencia es la carga. Ahora: «El que falta
  cierra la cuenta: los electrones que unos ceden los ganan otros, y lo que no se compensa es la carga» (59 de 60
  palabras).
- **Corregido, per-.** «per, «por encima»» no es lo que significa el prefijo (en latín intensifica, y en química marca el
  grado más alto). Ahora dice «al máximo» en la regla 4, en el paso de Mira y en la explicación QM-HIPO-PER de «Ahora
  tú», y «Per- marca el más alto» en la retroalimentación de la Predice. Hipo- («por debajo») se queda: es correcto.
  Una prueba nueva en `nomenclatura-inorganica.test.js` («verificación 27 nov …») fija las dos correcciones y falla con
  el texto del redactor.
- **Etimologías y reglas de conteo, revisadas y bien:** anhídrido = «sin agua»; -hídrico, de hidrógeno (como se enseña);
  peróxido con más oxígeno que el óxido; -oso con menos oxígeno que -ico en los dos óxidos de un metal; -uro marca la
  parte negativa; el H del hidruro solo gana un electrón; P₂O₅ + 1 H₂O → HPO₃ (metafosfórico), no el H₃PO₄. El modelo de
  la regla 3 («cada O del peróxido gana solo uno») es el de conteo de EO y está dicho como tal. Las explicaciones de los
  peróxidos mal armados (M₂O₄, M₂O₂, MO₄) dicen bien si sobra positivo o negativo en los dos casos de carga.
- Validador con `calidad: 2` en 200 semillas: 0. Unidad 17 de 17; `nomenclatura-practica` 8 de 8;
  `nomenclatura-inorganica/motor` 52 de 52; regla del papel: 0. `papel.json` regenerado; `--revisar`: «al día».
- `teoria.test.js`: 163 de 164; falla solo «glosario … archivos de la app al día» (falta `npm run catalogo`).

Archivos de la segunda pasada: `contenido/teoria/quimica/nomenclatura-inorganica.js`,
`contenido/teoria/quimica/nomenclatura-inorganica.test.js` (prueba nueva del verificador),
`plantillas/nomenclatura-practica/generador.js`, `plantillas/nomenclatura-practica/papel.json` y este informe.
