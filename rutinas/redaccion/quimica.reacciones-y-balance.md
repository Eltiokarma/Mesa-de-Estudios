# Redacción · quimica.reacciones-y-balance (26 nov 2026)

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre
`contenido/teoria/quimica/reacciones-y-balance.js` y su práctica `plantillas/reacciones-practica/` (generador y
`papel.json`, regenerado con `node herramientas/papel-generador.js reacciones-practica`).

No se tocó ningún número, respuesta, distractor, dato, color, ecuación ni dibujo. Las opciones de Predice y de «Ahora
tú» conservan su texto (solo cambiaron sus `siFuera`), así que la correcta sigue igual de larga que antes frente a las
demás. Se conservan las frases que lee la prueba de la unidad («Se transfieren N electrones», «Se igualan N
electrones») y la flecha «→» con espacio duro: el script de cambios lo pone en todo texto nuevo, y
`herramientas/ecuaciones-ancho.js` da «todo cabe» (54 pantallas, 241 renglones).

## Qué cambió, por tipo de problema

1. **`siFuera` y explicaciones en molde (teoría: unos 90; práctica: todas).** Casi todas seguían «Bien X. Pero Y.»,
   con un «bien» que no decía qué estuvo bien ni en qué caso la respuesta sería cierta. Se reescribieron con el
   acierto en palabras, el caso en que sería cierta y la razón, en varias formas («Es cierto que…, pero», «Sería… si…;
   aquí…», «El número está bien, pero…»), para no dejar otro molde.
   - Antes: «Bien esperar un sólido. Pero el NaCl lleva (ac): queda disuelto en el agua.»
     Después: «Es cierto que aparece un sólido, pero no es la sal: el NaCl lleva (ac), así que queda disuelto en el agua.»
   - Antes: «Perder oxígeno suele ir con reducirse, bien. Por eso el Fe₂O₃ es el oxidante.» (el «por eso» no se seguía)
     Después: «Es cierto que el Fe₂O₃ pierde oxígeno, pero por eso su hierro se reduce, y el reactivo que se reduce es
     el oxidante, no el reductor.»
   - Antes: «Bien ver el calor escrito. Pero está con los productos: la reacción es exotérmica.»
     Después: «Sería endotérmica si el calor estuviera escrito con los reactivos; aquí está con los productos, así que
     es exotérmica.»
2. **Soluciones y pasos en rótulos (ejemplos, «Así se resuelve», Mira, «Ahora tú», práctica).** Muchas líneas eran
   listas del tipo «Carbono: 3 CO₂. Hidrógeno: 8 H, 4 H₂O.» o «Zn: de 0 a +2, pierde 2. Ag: de +1 a 0, gana 1.» Se
   pasaron a oraciones con sujeto, verbo y el enlace dicho («así que», «porque», «con»).
   - Antes: «Oxígeno: 2 y 3; el menor común es 6: 3 O₂ y 2 Al₂O₃.» Después: «El oxígeno va de 2 en 2 a la izquierda y
     de 3 en 3 a la derecha; el menor múltiplo común es 6, con 3 O₂ y 2 Al₂O₃.»
   - Antes: «HCl: 10 que se oxidan y 6 que quedan en KCl y MnCl₂: 16.» Después: «Del HCl, 10 se oxidan y 6 quedan
     como cloruro en el KCl y el MnCl₂: van 16.»
   - Pasos «pide» sin verbo («El indicio que se verá al mezclar…», «Los dos agentes: …») pasan a «Se pide…».
   - En la práctica: «Balanceada:» pasa a «Con los enteros más pequeños, la ecuación balanceada queda así:».
3. **Reglas con elisiones en cadena.** Idea 6: «En cada semirreacción: el átomo que cambia; el O, con H₂O; el H, con
   H⁺; la carga, con e⁻.» pasa a «En cada semirreacción se iguala primero el átomo que cambia, después el O con H₂O, el
   H con H⁺ y la carga con electrones.» Lo mismo en las reglas de las ideas 1, 2 y 5.
4. **«Vale si» roto.** Cuatro condiciones no continuaban la frase o traían un dato suelto detrás. Idea 4: «Vale si hay
   redox si algún EO cambia…» pasa a «Vale si algún EO cambia, aunque no haya oxígeno; los agentes se buscan entre los
   reactivos…». Idea 1: el dato del agua que hierve y la soda cáustica entra como parte de la condición («…y no de un
   cambio de estado o de una disolución, como…»). Ideas 2 y 6: condiciones nuevas que sí son condiciones («se lee la
   ecuación de izquierda a derecha y el calor aparte…», «el medio es ácido; en medio básico, además…»).
5. **Concordancia en textos armados.** «Entran 1 sustancias», «Cambian 1 átomos», «1 Cu pierden», «quedarían 1
   átomos», «cada uno gana 1 electrones», «faltan solo 1» salían en algunas semillas; ahora el verbo y el sustantivo
   concuerdan con la cuenta. «Una suma de 14» ya no dice «con 14 la ecuación cuadra» (14 era una suma, no un coeficiente).
6. **Sueltos.** Lecturas en vivo de la idea 4 como oración («El Zn pasa de 0 a +2: pierde electrones y se oxida»);
   historia sin la oración de 5 palabras («Su notación no era la de hoy» entra en la anterior con «aunque»); invitaciones
   del laboratorio («Triple receta, mismas proporciones. ¿Cambió algo del inventario por molécula?» pasa a «Es la receta
   mínima multiplicada por tres, con las mismas proporciones entre las moléculas.»); «una agua» pasa a «una molécula»;
   en la práctica, el enunciado «Cinco reacciones.» pasa a «Las alternativas son cinco reacciones químicas.».

## Para el auditor (no se cambió)

1. **Idea 3, ejemplo «Una fracción que se va», segundo paso:** «Solo el 5/2 por 2 dejaría el carbono en 1 contra 2.» Es
   falso: con 1, 5, 2, 1 el carbono cuadra (2 y 2); lo que no cuadra es el oxígeno (10 a la izquierda y 5 a la derecha).
2. **Glosario, «endotérmica»:** el ejemplo «Una compresa fría que se enfría al apretarla» es una disolución (nitrato de
   amonio en agua), y la idea 1 enseña que disolver no es reaccionar.
3. **Idea 6, ejemplo «Verdadero o falso»:** la B (FVV) se explica solo como «cruza los agentes», pero también da la II
   (carga +2) como verdadera. Y en el ejemplo «En medio básico», la D («1 a la derecha») se explica «cuenta el agua»,
   que no dice de dónde sale el 1.
4. **Glosario, «redox»:** la definición dice «uno se oxida y otro se reduce», y la unidad enseña la dismutación, en que
   el mismo elemento hace las dos cosas.
5. **Lecturas del juego de la idea 1:** quedan en 9 a 12 palabras con la ecuación completa; el tope de 12 obligó a
   frases cortas («sale un gas», «aparece un sólido»).

## Pruebas

- `node --test contenido/teoria/quimica/reacciones-y-balance.test.js plantillas/reacciones-practica/generador.test.js`:
  14 en verde.
- `contenido/teoria/teoria.test.js` (con `npm run test:corto`): 163 de 164; la única falla es de
  `quimica/materia-y-energia.js` (otra unidad en curso), no de esta.
- Validador simulando `calidad: 2` (con las piezas de `requiere` cargadas): sin problemas.
- Regla del papel simulando `calidad: 2`: sin fallas.
- `node herramientas/ecuaciones-ancho.js quimica.reacciones-y-balance`: todo cabe.
