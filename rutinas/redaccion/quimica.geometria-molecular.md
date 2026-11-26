# Redacción · quimica.geometria-molecular · 26 nov 2026

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre una unidad ya
cerrada (`calidad: 2`). Solo cambió el texto. No se tocó ningún número, respuesta, distractor (salvo la redacción de tres
opciones de ebullición, ver el punto 5), dato, dibujo, color ni letra, y la marca `calidad: 2` se queda.

Archivos: `contenido/teoria/quimica/geometria-molecular.js` y la práctica propia de la unidad,
`plantillas/geometria-fuerzas/` (`generador.js`, `papel.json` regenerado con `herramientas/papel-generador.js`, una línea
de `casos.json` y una regex de `generador.test.js`). `enlace` también está en la ficha, pero la comparte Enlace químico,
así que no se tocó.

## Qué cambió, por tipo de problema

**1. `siFuera` del molde «X, cierto. Pero Y.» o «Bien X. Pero Y.»** Era lo que más se repetía: unos 30 en la teoría y
unos 20 en la práctica. Pasan a «Sería así si…», que dice qué tendría que cambiar para que la opción fuera cierta, y
después qué pasa aquí. Ninguna práctica exigía abrir con «Bien», así que no quedó ningún «Bien».

- Antes: «Bien contar los átomos. Pero los pares libres también ocupan lugar.» (forma)
  Después: «Sería así si el átomo central no tuviera pares libres. Los pares libres también ocupan lugar y empujan a los átomos.»
- Antes: «El par empuja, cierto. Pero hay tres H, no dos: no puede ser angular.» (Predice 1)
  Después: «Sería así con dos H, como en el agua. El NH₃ tiene tres H alrededor del N, y con tres no queda angular.»
- Antes: «Más masa suele dar más London, cierto. Aquí pesa más la otra atracción.» (ebullición)
  Después: «Sería así si solo importaran las fuerzas de London, que crecen con la masa. Aquí pesa más otra cosa: el NH₃ forma puentes de hidrógeno.»

**2. Verdadero o falso: el porqué suelto.** La solución pegaba el porqué sin decir de qué afirmación era («I F, II F, III
V. Se nombra solo por los átomos.»). Ahora dice «La I es falsa: la forma se nombra solo por los átomos.», y los porqués de
los cuatro bancos se completaron con su sujeto («tiene tres» → «un carbono sp² tiene tres regiones»; «tiene un H unido a
F» → «el HF tiene un H unido a F»). El `siFuera` pasó de «Bien las otras dos.» a «Las otras dos están bien juzgadas, pero…».

**3. Telegrama en soluciones, pasos y ejemplos.** Rótulos con dos puntos encadenados pasan a oraciones con sujeto y verbo.

- Antes: «CCl₄: cuatro flechas iguales en el tetraedro: se anulan.»
  Después: «En el CCl₄, las cuatro flechas son iguales y se anulan en el tetraedro.»
- Antes: «Apolar: no hay dipolo-dipolo. Sin H unido a N, O o F: no hay puente de hidrógeno. Queda London.»
  Después: «Como es apolar, no hay dipolo-dipolo, y como no tiene H unido a N, O o F, no hay puente de hidrógeno. Solo quedan las fuerzas de London.»
- Antes: «Sin el par, los átomos forman una pirámide: forma piramidal.» (Mira 1)
  Después: «Si no se cuenta el par, los cuatro átomos forman una pirámide: la forma es piramidal.»

**4. Las cuatro condiciones, leídas con «Vale si».** Tres no eran oración: «Vale si doble o triple: una región. Con 5:
…», «Vale si se mira en 3D. Un par libre…», «Vale si para moléculas de tamaño parecido; …». Ahora: «Vale si el central
tiene hasta cuatro regiones, y cada doble o triple cuenta como una; con cinco salen bipirámide, balancín…» (la prueba A1
pide esos nombres en la condición), «Vale si la forma se mira en 3D, no en el dibujo del papel.» y «Vale si las moléculas
que se comparan tienen un tamaño parecido.». Lo que no era condición pasó a la regla: «Cada enlace pi tiene 2
electrones» (idea 2), la excepción de los pares opuestos XeF₂ y XeF₄ (idea 3) y «al hervir se separan moléculas sin
romper enlaces» (idea 4).

**5. Textos generados que salían cojos en algunas semillas.**
- «2 enlaces y 0 pares libres», «tiene ningún par libre» y «0 pares libres: forma tetraédrica» pasan a «ningún par libre»
  o «no tiene pares libres» (helper `parTxt` en la teoría; `desc` en la práctica).
- «se ordenan como una trigonal plana» → «se ordenan como un triángulo plano»; la ecuación del resuelto muestra AX₂E₂ con
  subíndices, como ya hacía «Ahora tú».
- «1 enlace pi, de 2 electrones cada uno» → «Hay 1 enlace pi, que tiene 2 electrones.»
- Dos dos puntos seguidos en las razones de ebullición: «El Br₂: es más grande: más fuerzas de London» → «El Br₂: es más
  grande, con más fuerzas de London» (igual el n-pentano y el HCl). Es la redacción de la opción correcta, no su sentido;
  por eso cambió la línea 321 de `casos.json`.
- Resuelto de ebullición: «El etanol forma puentes de hidrógeno; el CH₃OCH₃ no: sus moléculas se atraen más» dejaba
  «sus» apuntando al CH₃OCH₃. Ahora: «Las moléculas del etanol se atraen más, porque el etanol forma puentes de hidrógeno
  y el CH₃OCH₃ no.»

**6. Enunciados de la práctica sin verbo.** «La molécula H₂C=CH₂.» → «La fórmula de la molécula es H₂C=CH₂.»; «El HCl:
molécula polar; sin H unido a N, O o F.» → «El HCl es una molécula polar y no tiene H unido a N, O o F.»; «El HCl y el
F₂, a 1 atm.» → «Se comparan el HCl y el F₂, a 1 atm.»; «Las moléculas …» → «Se comparan las moléculas …» (la regex de
`generador.test.js` que lee esa lista pasó de «Las moléculas» a «las moléculas»). La solución de «¿Qué atracciones hay?»
ya no repite el enunciado: dice qué da cada rasgo («Como es polar, tiene dipolo-dipolo; …, y London la tienen todas.»).

**7. «Lee», «Mira», glosario y laboratorio.** «de la estructura de Lewis (Enlace químico)» → «como los que viste en la
estructura de Lewis»; «Tres atracciones» enlaza las tres en una oración que dice quién suma cuál; «esa es la trampa
medida» (jerga de la investigación) → «esa es la trampa del examen»; glosario: «El enlace de en medio, que tiene todo
enlace.» → «El primer enlace entre dos átomos, el que va justo entre ellos.» y «Una molécula sin lados con carga.» → «Una
molécula sin un lado algo positivo y otro algo negativo.».

**8. Una ecuación que se partía a 390 px** (anterior a esta pasada): la regla de la idea 2 juntaba «doble…; triple…» en
un solo tramo; ahora van separados por el `SEP` de siempre.

## Para el auditor (no lo cambié, o lo cambié solo en el texto)

1. **QM-PI-DOBLE** (electrones pi, valor 4·p): la explicación decía «cuenta los electrones del enlace entero, con el
   sigma», falso cuando hay un triple (H–C≡N da 8, y el triple tiene 6). Reescribí la explicación para que diga lo que el
   valor hace («Sería así si cada enlace pi tuviera 4 electrones»), en la teoría y en la práctica. El valor no cambió.
2. Ejemplo 10 de la idea 2 (PCl₅, sp³d): «El fósforo puede usarlo porque es del periodo 3, donde ya hay orbitales d».
   Es el modelo escolar; la química actual discute que el octeto expandido use orbitales d. Decide si basta así.
3. Condición de la idea 4: «Vale si las moléculas que se comparan tienen un tamaño parecido.» Los ejemplos del NH₃ y el
   PH₃ o del H₂O y el H₂S comparan masas distintas, y ahí el puente gana igual. La condición vale para el orden general
   de las fuerzas; quizá convenga decir «cuando ninguna forma puentes de hidrógeno».
4. «Puente de hidrógeno: un H unido a N, O o F atrae un par libre de N, O o F vecino» (dato) frente al glosario, que dice
   «un par libre de otra molécula vecina» sin nombrar N, O o F. No es falso, pero las dos versiones no coinciden.
5. Práctica `cualPolar` y `puente`: «Se comparan las moléculas X, Y, Z, W.» sigue siendo una lista sin «y» final, porque
   la prueba la separa por comas.

## Comprobaciones

- `node --test contenido/teoria/quimica/geometria-molecular.test.js`: 15 de 15 (incluye la simulación del validador con
  calidad 2 y los oráculos de «Ahora tú» en 400 semillas).
- `node --test contenido/teoria/teoria.test.js`: la unidad pasa (topes de palabras incluidos). La última corrida tuvo una
  falla ajena: `geometria.puntos-notables`, glosario de 31 palabras, de otra unidad en obra.
- `node --test plantillas/geometria-fuerzas/generador.test.js`: 8 de 8; `papel.json` regenerado (8 problemas).
- `node herramientas/ecuaciones-ancho.js quimica.geometria-molecular`: la primera corrida marcó la partida del punto 8;
  arreglada, la segunda dio «todo cabe» (40 pantallas).
- Lectura de 40 semillas por idea de «Ahora tú», 6 de «Así se resuelve» y 300 de la práctica, en busca de concordancias,
  ceros y porqués sueltos.

## Verificación (26 nov)

Verificador de cierre de la pasada. Revisé las cinco notas, rehice la cuenta de las explicaciones de alternativas con
sentido nuevo (regiones, ángulos, forma, hibridación, sigma y pi, polaridad, fuerzas y ebullición, en la teoría y en la
práctica) y comparé con la versión de antes: de las 75 ecuaciones solo cambian las dos que el redactor anotó (AX₂E₂ con
subíndices y el `SEP` de la regla 2), y siguen coincidiendo las comparaciones de texto del código (`como.split('; ')`,
`bien.startsWith('Puente')`, la regex «las moléculas» de la prueba).

Lo corregido, con una prueba que falla con la versión anterior:

- **«Sería así si la molécula fuera plana» a moléculas planas** (hallazgo propio). Las explicaciones nuevas del ángulo de
  90° (QM-ANGULO-PLANO) y de la forma «del papel» (EN8) decían eso al BF₃, el BCl₃, el CH₂O o el SO₃, que son planos, y a
  moléculas angulares o en T, que también lo son. Ahora: «Sería así si los enlaces formaran una cruz, como en el dibujo
  del papel…» y «Sería así si los átomos se repartieran por igual en el plano del papel…», en la teoría y en la práctica.
- **QM-HIB-SIEMPRE-SP3 en la práctica** (hallazgo propio). Cuando el central es sp³ sin pares libres (CH₄, CCl₄, CHCl₃),
  la alternativa vale sp², y la explicación decía «No todo átomo central es como el carbono del metano». Ahora dice su
  valor: «Sería sp² con tres regiones; este átomo tiene cuatro.» (y «Sería sp³ con cuatro regiones…» en el otro caso).
- **Nota 3 (condición de la idea 4).** «Vale si las moléculas que se comparan tienen un tamaño parecido» dejaba fuera los
  ejemplos del NH₃ y el PH₃ o del H₂O y el H₂S. Ahora: «Vale si las moléculas tienen un tamaño parecido, o si una forma
  puentes de hidrógeno: el puente gana aun frente a una molécula más pesada, como el NH₃ frente al PH₃.»

Pruebas nuevas: `geometria-molecular.test.js` («redacción: «plana» no se le dice a una molécula plana…») y
`plantillas/geometria-fuerzas/generador.test.js` («redacción: el dibujo del papel no se confunde con «plana»…»).

Decidido por la sesión, Gerson revisa después:

- Nota 1 (QM-PI-DOBLE): la explicación del redactor ya da el valor (4 por cada pi); verificado, se queda.
- Nota 2 (PCl₅ y orbitales d): se queda el modelo escolar, que es el que pide el examen.
- Nota 4 (puente de hidrógeno en el dato y en el glosario): no se contradicen; se queda.
- Nota 5 (lista sin «y» en «Se comparan las moléculas…»): se queda, la prueba la separa por comas.

Comprobaciones: prueba de la unidad 16 de 16; `plantillas/geometria-fuerzas/generador.test.js` 9 de 9, con `papel.json`
regenerado (al día); validador con `calidad: 2` en 200 semillas: 0; regla del papel: 0; `contenido/teoria/teoria.test.js`:
163 de 164 (falla solo el glosario de `app/datos/`, por regenerar con `npm run catalogo`).
