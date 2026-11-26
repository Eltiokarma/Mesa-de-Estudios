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
