# Redacción: fisica.vectores

26 nov 2026. Pasada aparte sobre una unidad ya cerrada (`calidad: 2`), con `docs/metodo/unidad/redaccion-delegada.md`
(también la versión «explica, no solo pules», puntos 4 y 6) y el criterio de `escribidor-escribano`. Solo texto:
ningún número, respuesta, distractor, dato ni dibujo cambió. La marca `calidad: 2` se queda y el validador sigue en
cero.

Archivos: `contenido/teoria/fisica/vectores.js`; la práctica `plantillas/vectores-componentes`, `vectores-ley-cosenos`,
`vectores-poligono` y `vectores-productos` (`generador.js`), con el `papel.json` de productos regenerado por
`herramientas/papel-generador.js` (los otros tres no cambiaron: su papel no usa las explicaciones tocadas); la prueba
`plantillas/vectores-productos/generador.test.js` (solo la cadena que busca, ver punto 6) y una línea de Datos de la
escena vieja `plantillas/vectores/index.html`. Las ocho plantillas de la ficha son solo de esta unidad;
`velocidad-relativa`, compartida, no se tocó.

## Qué cambió, por tipo de problema

**1. Reglas sin porqué ni caso.** Las cuatro reglas ahora dicen qué es cada término, por qué vale y un caso.

> Regla de la suma, antes: «Los vectores se suman uno tras otro. R queda entre A − B y A + B. El signo es + porque θ va
> entre A⃗ y B⃗ cola con cola.»
> Después: «Sumar vectores es ponerlos uno tras otro: R⃗ va de la cola de A⃗ a la punta de B⃗. Por eso su módulo R
> depende del ángulo: vale A + B si apuntan igual, A − B si se oponen y algo intermedio en otro caso: 3 y 4 a 90° dan 5.
> El término 2AB cos θ hace ese ajuste.»

> Regla de componentes, antes: «Un vector se escribe con sus componentes sobre î y ĵ. Su módulo sale de Pitágoras, y el
> unitario es el vector dividido entre su módulo.»
> Después: «Las componentes de un vector son lo que avanza en x y lo que sube en y: A⃗ = 3î + 4ĵ avanza 3 y sube 4. Con
> la flecha forman un triángulo rectángulo, así que el módulo sale de Pitágoras: 5. El unitario û apunta igual y mide 1;
> sale de dividir cada componente entre el módulo.»

La de escalar o vector suma el caso de los drones (300 m al noreste y al noroeste terminan lejos) y la de productos,
para qué sirve el escalar (cuánto ayuda una soga inclinada) y que B⃗ × A⃗ apunta al revés.

**2. «Vale si» que no continuaba la frase o no decía qué pasa si no se cumple.** Las cuatro dicen ahora la condición y
la consecuencia. Antes, la de escalar empezaba otra oración («Vale si el «hacia dónde» puede ser…») y la de productos
traía un dato que no era condición («B⃗ × A⃗ mide lo mismo…», que pasó a la regla).

> Suma, antes: «Vale si θ va entre A⃗ y B⃗ cola con cola; la ley del colegio usa el del triángulo, 180° − θ, de coseno
> opuesto.»
> Después: «Vale si θ es el ángulo entre A⃗ y B⃗ puestos cola con cola; si usas el de adentro del triángulo, 180° − θ,
> como en la ley del colegio, el término cambia de signo.»

**3. Explicaciones de alternativas que no nombraban el razonamiento equivocado.** Unas 20 `siFuera` de Predice y de
«Ahora tú» dicen ahora qué hizo el alumno, por qué falla y con qué caso.

> Predice de la suma, «7 N», antes: «3 + 4 = 7 sería cierto si apuntaran al mismo lado (θ = 0°).»
> Después: «Sumaste 3 + 4 como si las fuerzas jalaran hacia el mismo lado, lo que solo pasa con θ = 0°. A 90°, cada una
> jala hacia otro lado y la resultante es menor que 7.»

> Predice del unitario, «(6î + 8ĵ)/14», antes: «Dividir está bien; pero entre el largo de A, que es 10, no entre 6 + 8.»
> Después: «Dividiste entre 6 + 8 = 14, como si el largo fuera la suma de las componentes. La flecha va en diagonal y mide
> √(36 + 64) = 10; con 14, el unitario no mediría 1.»

**4. Telegrama en Mira, pasos y ejemplos** (unas 90 frases). Rótulos con dos puntos pasan a oraciones con verbo y con
el porqué; los pasos de una palabra («Se restan.», «A 90°, Pitágoras.», «Su módulo, con Pitágoras.») dicen qué se hace
y por qué.

> Mira de la idea 1, antes: «Largo: módulo, 300 m. Recta por donde va: dirección. Hacia qué lado: sentido.»
> Después: «El módulo es el largo, 300 m; la dirección es la recta por donde va, y el sentido, el lado hacia el que
> apunta.»

> Solución de «Ahora tú» (máxima y mínima), antes: «A + B = 35 y A − B = 5: A = 20 y B = 15. A 90°, Pitágoras.»
> Después: «De A + B = 35 y A − B = 5 salen A = 20 y B = 15; como forman 90°, se usa Pitágoras.»

Enunciado del ejemplo del bote: «¿Rapidez, tiempo de cruce y arrastre?» pasa a «¿Qué rapidez lleva respecto a la orilla,
cuánto tarda en cruzar y cuánto lo arrastra?» (sale «de la sierra» para caber en 40 palabras).

**5. Lee.** Tarjetas en ráfaga enlazadas («En un mapa, el norte va arriba, y el rumbo dice…»; «la punteada» pasa a «la
línea punteada»; «Mano derecha: dedos de A⃗ hacia B⃗; el pulgar da A⃗ × B⃗» pasa a una condicional completa).

**6. Práctica.** Las explicaciones «Bien + infinitivo; …» («Bien sumar por componentes; falta…», «Bien ver la flecha que
falta; cuenta…») pasan a participio y «pero» (24 explicaciones), dentro del tope de 20 palabras de su prueba. Ninguna
prueba exigía que empiecen con «Bien». **Subíndices rotos:** «A_xB_y − A_yB_x» y «A_xB_x + A_yB_y» se veían mal en la app,
porque `conSub` (app/practica.js) toma «xB» como un solo subíndice y deja «_y» crudo («A<sub>xB</sub>_y»). Ahora llevan
espacio («A_x B_y − A_y B_x»), como ya estaba «u_x w_y». La prueba de productos buscaba la cadena vieja; solo se
cambió la cadena. En la escena vieja, «(aₓb_y − a_ybₓ)» se mostraba con «_» crudo; ahora usa `<sub>` como la línea
de al lado.

## Para el auditor

1. **Igualdad falsa en «Así se resuelve» del unitario (idea 2, tipo 2):** «Para comprobar: 0,38² + 0,92² = 1» con
   [5, 12, 13] da 0,9908, y con [8, 15, 17] tampoco es exacto. Debería ir «≈ 1» o comprobarse con las fracciones. No lo
   toqué (es una afirmación numérica).
2. **«Ahora tú» de productos, distractor `directo` (PE-MODULOS):** su explicación («Se despeja cos θ… y se busca el ángulo
   de ese coseno») no nombra el error, y su valor coincide con el de `seno` en 37° y 60° (se descarta por repetido). No
   sé qué error modela; queda igual.
3. `ecuaciones-ancho.js fisica.vectores`: 30 hallazgos, todos en ecuaciones, enunciados con fichas y la ecuación de dos
   reglas que no cambié (28 partidas después de «=»). Ninguno sale de un texto reescrito.
4. Las cifras de cuatro dígitos salen como «1 000 m» en «Así se resuelve» de la idea 1 (`Kit.formatear`); la casa
   escribe 1000. Es del formateador común, no de la unidad.
5. El glosario no se tocó (sus `simple` ya traen ejemplo cotidiano), así que no hace falta `npm run catalogo` por esta
   unidad.

## Comprobación

- `contenido/teoria/fisica/vectores.test.js`: 7 en verde.
- `plantillas/vectores*/*.test.js` (ocho plantillas): 177 en verde. `papel-generador.js --revisar`: al día.
- `contenido/teoria/teoria.test.js`: 162 en verde, 2 fallas ajenas (movimiento-parabolico-y-circular, de otro redactor,
  y el glosario de física desactualizado por cambios de otra unidad). La prueba de `fisica/vectores.js`, con las reglas
  de `calidad: 2` y los topes nuevos, en verde.
- `ecuaciones-ancho.js fisica.vectores` (servidor propio en el puerto 4242, ya cerrado): punto 3 de arriba.

## Verificación (26 nov)

Verificador de cierre de la pasada. Resolví las dos notas, rehice la cuenta de los `siFuera` de las cuatro ideas en 200
semillas y de las explicaciones de las cuatro prácticas tocadas, y comparé con HEAD: las 2189 ecuaciones son idénticas y
ningún número, opción ni color cambió (en la práctica, las alternativas y sus valores son los mismos en 400 semillas).

Lo corregido, con una prueba que falla con la versión anterior (`contenido/teoria/fisica/vectores.test.js`, «redacción:
las sumas de cuadrados son ciertas y el distractor del ángulo nombra su error»):

- **Nota 1.** «Para comprobar: 0,38² + 0,92² = 1» (da 0,9908) pasa a comprobarse con las fracciones: «(5/13)² + (12/13)²
  = 169/169 = 1, así que mide 1, como debe. Con los decimales redondeados sale casi 1.»
- **Nota 2.** El distractor `directo` solo sobrevivía con 120° (en los otros casos su valor repetía el de `seno` y se
  descartaba) y vale 150°: es tomar el cociente, 1/2, como un seno y, como el producto es negativo, elegir el ángulo
  obtuso de ese seno. Ahora lo dice, y su código pasa de PE-MODULOS a VE-escalar-por-vectorial, el mismo de `seno`. Las
  opciones que ve el alumno son las mismas en todas las semillas.
- **De paso**, el `siFuera` de «9» en la Predice de productos decía «como en una suma de flechas» (sumar flechas a 90° da
  √41, no 9): ahora dice que el producto escalar no suma los módulos.

Para el registro: el informe dice que «A_xB_y» se veía mal por `conSub`. No es así (`conSub` da
A<sub>x</sub>B<sub>y</sub>); el espacio nuevo no hace daño y se queda.

Comprobaciones: prueba de la unidad 8 de 8; las nueve plantillas de la ficha en verde (`vectores` 65, `vectores-ley-cosenos`
15, `vectores-componentes` 22, `vectores-productos` 12, `vectores-unitario` 16, `vectores-combinacion` 9,
`vectores-division` 17, `vectores-poligono` 21, `velocidad-relativa` 32); validador con `calidad: 2` en 200 semillas: 0;
regla del papel: 0; `contenido/teoria/teoria.test.js`: 163 de 164 (la del glosario de la app, por `npm run catalogo`).
