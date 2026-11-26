# Redacción · aritmetica.potenciacion-y-radicacion (26 nov 2026)

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre
`contenido/teoria/aritmetica/potenciacion-y-radicacion.js` (las seis ideas, sus 90 ejemplos, los casos de «Así se
resuelve» y «Ahora tú», el laboratorio y el glosario) y su práctica `plantillas/potencias-raices/` (generador y
`papel.json`, regenerado con `node herramientas/papel-generador.js potencias-raices`).

No se tocó ningún número, respuesta, distractor, dato, color, letra ni dibujo. Los valores de las opciones son los
mismos, y también el orden de consumo del azar, así que los casos del generador (`casos.json`) siguen valiendo sin
tocarlos. Solo cambió el texto.

## Qué cambió, por tipo de problema

1. **Condiciones con el marco roto (las seis ideas).** La app antepone «Vale si» a `condicion`, y ninguna de las seis
   cuadraba: empezaban con mayúscula («Se mira…», «Terminar bien…», «Cuadrados y cubos…») o con una oración que no
   completa «Vale si». Se reescribieron para que la suma sea una oración.
   - Antes: «Vale si Cuadrados y cubos a la vez son sextas potencias: al contar «cuadrados o cubos» se restan una vez.»
     Después: «Vale si se cuentan los dos extremos. Los números que son cuadrado y cubo a la vez son sextas potencias:
     al contar «cuadrados o cubos», se restan una vez.»
   - Antes: «Vale si Terminar bien es una condición necesaria, no suficiente: el criterio solo descarta. Los cubos
     terminan en cualquier cifra.» Después: «Vale si se usa para descartar: terminar bien es una condición necesaria,
     pero no suficiente. No sirve para cubos, que pueden terminar en cualquier cifra.»
2. **`siFuera` en telegrama o en molde «Bien X. Pero Y» (teoría y práctica).** El «Bien» no decía qué estuvo bien y la
   segunda parte no daba el porqué. Se escribieron con el acierto dicho y la razón completa, con formas variadas («X
   está bien, pero…», «Completaste…, pero…», «Es cierto que…, pero…») para no dejar otro molde.
   - Antes: «Bien partir 270 = 2 × 3³ × 5. Pero a cada exponente le falta su propia cantidad.» Después: «Partir
     270 = 2 × 3³ × 5 está bien, pero multiplicar por todos los primos sube también los exponentes que ya cumplían.»
   - Antes: «Bien mirar los primos. Pero el 5² ya es par: 600 × 30 = 18 000 no es cuadrado.» Después: «Con 30 entra
     también un 5, y el 5² ya era par: pasa a 5³. Por eso 600 × 30 = 18 000 no es cuadrado.»
   - Antes: «Bien con los primos de exponente escrito. Pero el que no lo lleva tiene exponente 1.» Después:
     «Completaste los primos con exponente escrito, pero el que no lo lleva tiene exponente 1 y también hay que
     completarlo.»
3. **Pasos y soluciones sin verbo o sin el porqué (ejemplos, Mira, Así se resuelve, Ahora tú, papel).** Se completaron
   las frases nominales y se escribió la consecuencia que el alumno tenía que adivinar.
   - Antes: «Los de la bandeja más los que sobran.» Después: «Tenía los caramelos de la bandeja más los que le
     sobraron.»
   - Antes: «Lo que falta para llegar a él.» Después: «Hay que sumar lo que le falta a 600 para llegar a 729.»
   - Antes: «Exponentes pares desde 0: 3 para el 2, 2 para el 3, 2 para el 5.» Después: «Cada primo puede ir con un
     exponente par desde 0: el 2 tiene 3 opciones, el 3 tiene 2 opciones y el 5 tiene 2 opciones.»
   - Antes (papel p4): «Cada exponente sube al múltiplo de 2 que sigue.» Después: «Cada exponente que no cumple sube
     al par que sigue.» (el exponente par no sube).
4. **Tarjetas de «Lee» en ráfaga.** Oraciones cortas sin enlace, un sujeto que faltaba («Con cubitos de chocolate arma
   cubos…») y términos sin presentar. Se enlazaron y se presentó «base» (idea 5) y «cáscara» (idea 4, que antes solo
   aparecía como «Cáscara aparte», un rótulo que no existe en el control).
   - Antes: «Doña Juana tiene 30 caramelos. Arma la bandeja cuadrada más grande que puede: 5 × 5 = 25. La de 6 × 6 ya
     pide 36.» Después: «Doña Juana tiene 30 caramelos y arma la bandeja cuadrada más grande que puede: la de 5 × 5,
     con 25. La de 6 × 6 no le alcanza, porque pide 36.»
   - Antes: «Cada número mayor que 1 se parte en primos, su factorización.» Después: «Todo número mayor que 1 se puede
     escribir como un producto de primos: esa es su factorización.»
5. **Reglas.** Se completaron los tramos elípticos («cubo perfecto, si es múltiplo de 3», «Igual con cubos», «Por
   centésimas, igual con 0,01»), dentro del tope de 45.
6. **Afirmaciones que generalizaban de más (verdad, sin tocar números).** «La raíz no termina en la misma cifra que el
   cubo» (idea 4, tipo 4 y práctica `arista`) es falso en general (4³ = 64); ahora dice «Aquí la raíz…». «√30 está
   entre 5 y 6, más cerca de 5,5» no decía de qué estaba más cerca; ahora: «Como 30 queda cerca del medio, conviene
   probar cerca de 5,5». En «7☐69», el paso partía de «7 000 está entre 83² y 90²» sin decir por qué importaba; ahora
   deduce que la raíz va de 84 a 89. «37² pasa mucho de 74» perdió el «mucho».
7. **Detalles de norma y forma.** «termina en 1 cero» pasó a «termina en un solo cero»; el dato de las sextas
   potencias terminaba en «729…» y el papel le agregaba punto («729….»): ahora es «como 1, 64 o 729», en la teoría y en
   la práctica. Lecturas en vivo completadas dentro del tope de 12 («faltan 34 para 4³», «el tramo encierra a N»).
8. **Ecuaciones a 390 px.** El barrido marcó cuatro igualdades partidas después de «=»; tres estaban así desde antes y
   una la causó esta pasada. Se reordenó el texto (no las cuentas) de los cuatro: el enunciado de «De k² a k», el dato
   del residuo por exceso (ahora `rₑ = (k + 1)² − N: el residuo por exceso, lo que falta`) y dos pasos de ejemplo.

## Para el auditor (no se arregló: es número, dibujo o contenido)

1. **Alta · lo previo.** Idea 6, tarjeta de «Lee» «La calculadora de doña Juana»: el texto y la pantalla dicen
   √2 = 1,4142135, y la Predice pregunta entre qué centésimas está √2 (entre 1,41 y 1,42). La tarjeta adelanta la
   respuesta, aunque el comentario del archivo dice que «no da cifras de √2 después de 1,4». Habría que mostrar otra
   raíz en la calculadora (o cortar la pantalla) y quitar la cifra del texto.
2. Idea 4, «Ahora tú» tipo 4 (`casoAristaCubo`): la solución dice «está entre 10³ y 30³», pero el filtro deja solo
   k = 12, 13, 17 y 18, todos entre 10³ y 20³. Es cierto, pero impreciso; el dato podría decir 20³.
3. Idea 1, tipo 2 (`casoMultiplica` para cubo): cuando N ya es un cuadrado (3 969 = 63², semilla 2), el distractor
   AT-OTRO-INDICE vale 1 («completa para un cuadrado»). Es cierto, pero es un distractor raro.
4. Idea 3, ejemplo «El mayor con raíz 23»: la trampa E (546 = 529 + 17) no sale de ningún error identificado; la
   redacté como «suma 17, que no sale de ninguna cuenta del borde». Conviene cambiarla por un error real.
5. Formato de cifras dispar en la unidad: en la idea 3 (`casoReconstruir`) y en «Así se resuelve» de la idea 4 salen
   números de cuatro cifras sin pasar por `ent` (1106, «Faltan 1144», 1260), mientras la idea 4 escribe «1 081». Las
   dos formas son correctas, pero conviene una sola.
6. `casoDefectoExceso` (E-RDIV): «N/2 al cuadrado pasa de N» es falso para N = 2 y 3; hoy esos valores están en
   `USADOS6` y no salen. Si cambia esa lista, la frase falla.
7. La práctica no excluye los casos de la teoría: `mult-cuadrado` puede sacar 600, el de la Predice de la idea 1.
8. Tres condiciones nuevas empiezan con «N es un entero positivo» o «N es positivo», que antes estaba implícito
   (caramelos, cubitos). No es un dato nuevo, pero el auditor debe confirmar que no estorba.

## Pruebas

- `node --test contenido/teoria/aritmetica/potenciacion-y-radicacion.test.js`: 8 de 8 (incluye la de 400 semillas con
  `calidad: 2` simulada y los topes).
- Validador con `calidad: 2` simulada (`Teoria.problemas`, 60 semillas): sin problemas.
- `node --test plantillas/potencias-raices/generador.test.js`: 33 de 33. `papel-generador.js --revisar`: al día.
- `node --test contenido/teoria/teoria.test.js`: 161 de 164; las tres fallas son de otras unidades en curso
  (`quimica/materia-y-energia`, `quimica/propiedades-periodicas`) y del glosario de Álgebra sin regenerar.
- `node herramientas/ecuaciones-ancho.js aritmetica.potenciacion-y-radicacion`: 54 pantallas y 502 renglones, ninguna
  ecuación se corta ni se parte en mal sitio.
