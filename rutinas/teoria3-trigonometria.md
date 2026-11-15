# Ronda 3 de teoría: glosario y retos comprobados en trigonometría (15 nov 2026)

Encargo: `rutinas/encargos/teoria3-trigonometria.md`. Rama `teoria3/trigonometria`, un commit por unidad. Sin PR y sin integrar a main.

## Cómo se hizo

- **Mapa de términos primero.** Antes de escribir, se decidió qué unidad estrena cada término. Se usó la primera aparición en el texto, medida con las mismas formas que marca el lector. Así ninguna palabra se define dos veces.
- **Reparto.** La unidad 1 la hizo la sesión principal. Las unidades 2 a 19 las hicieron cuatro sesiones de apoyo en paralelo, cada una solo con sus archivos y sus términos.
- **Validación por unidad.** Antes de cada commit se corrieron `Teoria.problemas` y el glosario del curso.
- **`app/datos` sin mezclas.** Se armó con `npm run catalogo` en un worktree aparte, desde el estado ya comprometido, para que no entrara trabajo a medias de otra unidad. Con eso pasaron `contenido/teoria/teoria.test.js` y `nucleo/glosario.test.js` (161 de 161) en cada commit.
- **Revisión de la sesión principal.**
  - Se leyeron las 210 definiciones con su ejemplo y se rehicieron las cuentas.
  - Se corrigieron cuatro cosas:
    - «rodar sin deslizar» decía que el punto de apoyo avanza;
    - la redacción de «identidad auxiliar»;
    - «altura» ahora cubre también la y con signo de una gráfica;
    - «cofunción» quedó como forma de «co-razón», para no tener dos entradas de la misma idea.
  - Se ordenaron los retos para que el primero de cada mesa se logre moviendo los controles, sin guardar casos.

## Términos y retos por unidad

«Heredados» son los términos definidos en otra unidad del curso que también aparecen en esta (los cuenta `app/datos/glosario/trigonometria.json`).

| Unidad | Propios | Heredados | Mesas con retos | Retos |
|---|---|---|---|---|
| angulo-trigonometrico | 13 | 6 | 3 de 3 | 13 |
| longitud-de-arco-y-sector | 12 | 5 | 3 de 3 | 12 |
| razones-trigonometricas-agudas | 15 | 6 | 3 de 3 | 12 |
| triangulos-rectangulos | 9 | 12 | 3 de 3 | 12 |
| recta-en-el-plano | 15 | 17 | 3 de 3 | 13 |
| angulos-en-posicion-normal | 11 | 18 | 3 de 3 | 14 |
| reduccion-al-primer-cuadrante | 6 | 16 | 2 de 2 | 9 |
| circunferencia-trigonometrica | 10 | 30 | 3 de 3 | 13 |
| identidades-fundamentales | 10 | 26 | 2 de 2 | 10 |
| arcos-compuestos | 8 | 14 | 3 de 3 | 12 |
| arcos-multiples | 8 | 15 | 3 de 3 | 12 |
| transformaciones-trigonometricas | 10 | 13 | 3 de 3 | 12 |
| funciones-trigonometricas | 10 | 18 | 3 de 3 | 12 |
| funciones-trigonometricas-inversas | 12 | 15 | 3 de 3 | 12 |
| ecuaciones-trigonometricas | 11 | 20 | 3 de 3 | 13 |
| triangulos-oblicuangulos | 11 | 23 | 3 de 3 | 14 |
| areas-y-lineas-notables | 13 | 20 | 3 de 3 | 13 |
| conicas | 13 | 22 | 3 de 3 | 14 |
| coordenadas-polares-y-complejos | 13 | 19 | 3 de 3 | 14 |

Total: 210 términos propios y 236 retos comprobados en 55 mesas.


## Mesas ampliadas

- **Ninguna.** No cambió ningún `id` de mesa ni de control, ni ningún rango.
- **Cambios de código en las mesas**, para que `logrado` use la misma cuenta que dibuja (regla 1):
  - se sacaron ayudantes que comparten el dibujo, la lectura y los retos: `vueltasEntre`, `coterm`, `aCent`, `arcoDe`, `arcoL`, `areaL`, `giroDeB`, `hipL`, `senL`, `distAB`, `pendAB`, `distRP`, `ladoLC`, `viajeDe`, `areaLAL`, `cevianaT`, `deltaRP`, `argDe`, entre otros;
  - los topes de los controles pasaron a constantes.
- **Arreglo de un error en `ecuaciones-trigonometricas`, mesa `franja-libre`:** con sen θ = 0 y b = 720°, el 720° no se contaba ni se dibujaba. Ahora `en720` cubre ese caso además de cos θ = 1.

## Textos de la teoría que cambiaron para que un término aparezca

Son cambios chicos en consignas, reglas, pasos de «Mira» y condiciones, siempre dentro de los topes de palabras. Algunos ejemplos:
- «Resolver un triángulo rectángulo es hallar lo que falta…»;
- «Ley de proyecciones: …»;
- «Es el caso ambiguo: …»;
- «Por la identidad auxiliar, …»;
- «Suma a producto…».

En funciones-trigonometricas se cambiaron dos «su inversa» por «1 entre…», para que no los marque la definición de «función inversa».

## Palabras que se dudaron

- **Se dejaron fuera** porque no salen en el texto: «excentricidad», «conjugado», «desfase», «sinusoide», «línea secante», «línea cosecante» y «ecuación condicional».
- **Se dejaron fuera** porque son de uso común o tienen otro sentido en otra unidad: «hueco», «recta numérica», «extremo», «media vuelta», «simétrico», «resultante», «suplemento», «flecha», «cuerda», «raíz», «unión» y «compás».
- **«razón», «opuesto» y «notables» sueltos** no son formas de ningún término, porque en otras unidades significan proporción, número opuesto o líneas notables.
- **«crece» y «decrece»** no son formas de «creciente» y «decreciente»: «crece» sale con su sentido común en las unidades 1 a 6.
- **«sistema» suelto** no se marca. Solo se marca «sistema de ecuaciones», para no chocar con «sistema sexagesimal».
- **Términos de geometría básica que se definieron igual** porque el curso los usa sin explicarlos: «circunferencia», «radio», «vértice», «altura», «perímetro», «diámetro», «cuadrilátero», «potencia», «cubo» y «denominador».
- **Se definen más adelante de donde aparecen por primera vez:**
  - «cuarto de vuelta» sale antes en la unidad 1 y se define en la 7;
  - «cotangente», «secante» y «cosecante» salen en la unidad 3 y se definen en la 6, donde son centrales;
  - «función» sale una vez en la unidad 6 y se define en la 13.

  En esas unidades anteriores, la hoja dice «Se explica en…».

## Pedidos al molde

1. **Palabras con dos sentidos en el mismo curso.** El molde da una sola definición por curso.
   - «tangente»: la razón (unidad 3) y la recta tangente (cónicas). Los textos fijos de cónicas dicen «recta tangente», pero el lector puede marcar «tangente» en los `ahoraTu` generados y en la lectura de `recta-y-parabola`.
   - «rama»: un tramo de la gráfica, de la inversa o de la hipérbola. La definición se escribió general.
   - «grado»: la unidad de ángulo y el grado de un polinomio. Hoy no se marca porque «grado» suelto no es forma de nada.
   - «identidad auxiliar»: en arcos-compuestos es a sen x + b cos x; en identidades-fundamentales, «las auxiliares» son (sen ± cos)².
   - «secante»: la razón y la recta secante.
   - «altura»: la geométrica y el valor y de una gráfica. Se arregló con una definición doble.

   Haría falta poder dar un sentido local por unidad, o excluir una forma en una unidad.
2. **Los códigos de error cuentan como texto.** `G.texto` (`nucleo/glosario.js`) lee el campo `error` («CONV-INVERSA»). Como la búsqueda no distingue mayúsculas, «inversa» se encuentra en un código de la unidad 1. Sugerencia: agregar `error` a `NO_TEXTO`.
3. **Los retos de comparación solo se prueban con los primeros 160 casos de la grilla**, y el primer control es el que más varía. Eso obligó a reescribir o descartar comparaciones buenas:
   - «dos triángulos contra uno» en `compas-libre`;
   - «dos puntos con PF = PD» en `foco-y-directriz`;
   - las de `rodea`, `dos-arcos` y `triangulo-libre`.

   En mesas de más de 20 000 casos, la muestra al azar casi nunca encuentra el par. Sugerencia: probar pares sacados de toda la grilla, o una muestra mayor.
4. **`logrado` no recibe los rangos de los controles.** Los retos de extremo («el mayor…») tienen que repetir los topes como constantes de la unidad. Sería más limpio que `logrado` recibiera la mesa.

## Verificación

- **Pruebas:** `node --test contenido/teoria/teoria.test.js nucleo/glosario.test.js` en cada commit, y `npm test` completo antes del último push.
- **Playwright a 360 × 780**, con `npm run dev` sobre el estado comprometido, en `angulo-trigonometrico`, `razones-trigonometricas-agudas`, `circunferencia-trigonometrica`, `funciones-trigonometricas` y `conicas`. En cada una:
  - un término subrayado abre su hoja: «Nuevo en este tema» o «Se explica en…»;
  - el glosario del tema muestra sus términos y la búsqueda encuentra palabras de todo el curso;
  - en el laboratorio, mover los controles cumple el primer reto, y aparecen «✓ Lo lograste» y la línea de Mara;
  - no hubo errores de página.
- **Al construirlos**, cada reto de una sola mesa se comprobó contra la grilla completa: se puede lograr y no está cumplido al abrir la mesa.

## No verificado

- **Unidades sin recorrer en el navegador:** de las 19, se recorrieron 5. Las otras 14 solo tienen el validador y las pruebas.
- **Retos de comparación:** no se probaron a mano en el navegador guardando casos. Solo los comprobó el validador.
- **Tipo de cada reto:** en la lista de abajo lo estima el texto con una regla simple. Las sesiones de apoyo dieron el tipo real en sus informes y casi siempre coincide.
- **Personas reales:** ningún alumno vio las definiciones. Cuáles se consultan más lo dirá la medición (`momento: 'glosario'`).

## Retos por mesa

Tipo estimado por el texto: _comparación_ si mira los casos guardados; si no, _extremo_, _exacto_ o _forma_.


### angulo-trigonometrico

Términos: ángulo trigonométrico, lado inicial, sentido antihorario, sentido horario, ángulos coterminales, grado sexagesimal, grado centesimal, radián, minuto sexagesimal, vuelta, circunferencia, radio, arco.

- **dos-giros**
  - Consigue dos giros coterminales que se separen justo tres vueltas. · _exacto_
  - Haz que θ₂ sea el opuesto de θ₁ y que igual terminen juntos. · _exacto_
  - Con θ₁ sobre dos vueltas, pon en θ₂ su coterminal negativo más cercano a cero. · _extremo_
  - Guarda dos casos con el mismo θ₁: uno coterminal y otro que no. · _comparación_
- **tres-escalas**
  - Haz que el giro mida exactamente −150ᵍ. · _exacto_
  - Consigue un giro de π/2 radianes en sentido horario. · _forma_
  - Busca el menor giro positivo que dé un número entero de grados centesimales. · _extremo_
  - Encuentra un giro que se escriba con el mismo número en grados y en centesimales. · _exacto_
  - Guarda dos giros que se diferencien en 100ᵍ exactos. · _comparación_
- **arco-sale**
  - Haz que el arco mida justo 3 cm con un radio de 2 cm. · _exacto_
  - Busca el ángulo más chico que dé un arco de 6 cm. · _extremo_
  - Lleva el arco casi a la vuelta completa, sin cerrarla. · _forma_
  - Guarda dos casos con el mismo ángulo, uno con el doble de radio. · _comparación_

### longitud-de-arco-y-sector

Términos: longitud de arco, ángulo central, sector circular, trapecio circular, semisuma, altura, vértice, número de vueltas, rodar sin deslizar, faja, engranaje, eje común.

- **sector-completo**
  - Busca el menor ángulo cuyo arco ya sea más largo que el radio. · _extremo_
  - Consigue un arco de 2π cm sin dar la vuelta entera. · _forma_
  - Haz que el área dé, en número, el doble que el arco. · _forma_
  - Guarda dos sectores de igual ángulo, uno con el doble de radio. · _comparación_
- **rodea**
  - Da una vuelta por fuera y logra justo 3 vueltas de la marca. · _exacto_
  - Por dentro, rodea el aro una vez y logra una sola vuelta de la marca. · _forma_
  - Haz que la marca apunte como al inicio sin que el centro haya vuelto. · _forma_
  - Logra 6 vueltas de la marca con el camino del centro más corto posible. · _extremo_
- **faja-libre**
  - Haz que B dé una vuelta entera mientras A gira menos de media vuelta. · _forma_
  - Consigue el mayor giro de B que permiten las ruedas. · _extremo_
  - Con faja, haz que el borde de A arrastre justo 2π cm. · _exacto_
  - Guarda una faja y un engranaje con los mismos radios y el mismo giro de A. · _comparación_

### razones-trigonometricas-agudas

Términos: razón trigonométrica, triángulo rectángulo, cateto, cateto opuesto, cateto adyacente, hipotenusa, ángulo agudo, seno, coseno, tangente, ángulos complementarios, razones recíprocas, triángulos semejantes, ángulo notable, teorema de Pitágoras.

- **tres-razones**
  - Haz que la tangente de θ valga justo 1. · _exacto_
  - Haz que el seno de θ pase de 0,9. · _forma_
  - Arma otro triángulo de lados enteros, distinto del 3-4-5 inicial. · _forma_
  - Guarda dos triángulos de distinto tamaño con el mismo seno. · _comparación_
- **semejantes**
  - Haz que el cateto rojo del grande mida justo 3. · _exacto_
  - Haz que el seno de θ pase de 0,8. · _forma_
  - Consigue el cateto rojo más largo que permite la mesa. · _extremo_
  - Guarda dos casos con el mismo θ y distinto k. Compara sus senos. · _comparación_
- **complemento-libre**
  - Haz que el seno y el coseno de θ sean iguales. · _exacto_
  - Busca un θ cuyo seno sea el coseno de 70°. · _forma_
  - Haz que csc θ pase de 10. · _forma_
  - Haz que el cateto rojo mida justo la mitad de la hipotenusa. · _exacto_

### triangulos-rectangulos

Términos: resolver un triángulo, despejar, horizontal, vertical, línea visual, ángulo de elevación, ángulo de depresión, ángulo de observación, distancia.

- **instrumento**
  - Con el ojo a 1,5 m de altura, consigue una torre de 7,5 m. · _forma_
  - Pon el ojo en el suelo y haz que la torre mida lo mismo que d. · _exacto_
  - Haz la torre más alta posible sin pasar de 45° de elevación. · _extremo_
  - A 60°, busca la menor distancia que dé una torre de más de 10 m. · _extremo_
- **faro**
  - Haz que la lancha quede tan lejos del pie como alto es el faro. · _forma_
  - Guarda dos casos con el mismo ángulo y el faro al doble de alto. · _comparación_
  - Lleva la lancha lo más lejos posible del faro. · _extremo_
  - Acerca la lancha hasta quedar a menos de media altura del pie. · _forma_
- **letrero-cerca**
  - Para tu letrero, busca la distancia donde β es mayor. · _extremo_
  - Guarda dos distancias distintas, con el mismo letrero, que den el mismo β. · _comparación_
  - Consigue que β mida justo 45°. · _exacto_
  - Acércate a medio metro del poste y mira qué le pasa a β. · _forma_

### recta-en-el-plano

Términos: plano cartesiano, coordenadas, origen, segmento, distancia entre dos puntos, punto medio, baricentro, determinante, valor absoluto, pendiente, ángulo de inclinación, ecuación de la recta, intercepto, rectas paralelas, rectas perpendiculares.

- **dos-puntos**
  - Pon A y B en la misma vertical y mira qué pasa con la pendiente. · _exacto_
  - Deja A y B a distancia 5 exacta, sin alinearlos en la cuadrícula. · _exacto_
  - Haz que el punto medio M caiga en el origen. · _forma_
  - Pon A y B lo más lejos posible uno del otro. · _extremo_
  - Guarda dos casos con la misma distancia y distinta pendiente. · _comparación_
- **recta-y-punto**
  - Pon el punto P justo sobre la recta. · _exacto_
  - Haz la recta horizontal y deja P a distancia 4 de ella. · _forma_
  - Sin mover la recta, lleva P lo más lejos posible de ella. · _extremo_
  - Guarda dos rectas paralelas, una a cada lado de P, a la misma distancia. · _comparación_
- **triangulo-libre**
  - Pon los tres vértices en línea: el área tiene que dar 0. · _forma_
  - Arma un triángulo de área exacta 6. · _exacto_
  - Recorre P, Q y R en sentido antihorario: haz positivo el determinante. · _forma_
  - Haz que el baricentro G caiga en el origen. · _forma_

### angulos-en-posicion-normal

Términos: posición normal, lado final, radio vector, abscisa, ordenada, cuadrante, cotangente, secante, cosecante, ángulo cuadrantal, no definida.

- **seis-razones**
  - Pon P sobre un eje y elige una razón que no esté definida. · _forma_
  - Consigue que la razón elegida valga 0, con P fuera del origen. · _exacto_
  - Pon P en el cuadrante IV y elige una razón positiva. · _forma_
  - Con la tangente, busca el P del cuadrante II con la tangente más negativa. · _extremo_
  - Guarda dos puntos distintos con las seis razones iguales. · _comparación_
- **mismo-lado**
  - Pon Q en el lado final de P, pero más cerca del origen. · _extremo_
  - Con k negativo, logra que Q tenga el mismo seno que P. · _exacto_
  - Haz que P quede en el cuadrante II y Q en el IV. · _forma_
  - Busca la Q más lejana del origen que comparta lado final con P. · _extremo_
- **giro-y-opuesto**
  - Haz que P y P′ coincidan sin dejar θ en 0°. · _forma_
  - Busca un θ de más de una vuelta con el mismo lado final que 135°. · _extremo_
  - Haz que P′, el punto de −θ, quede en el cuadrante II. · _forma_
  - Busca el giro más negativo de la mesa con sen θ = 1. · _extremo_
  - Guarda dos giros de signo contrario con el mismo coseno y distinto seno. · _comparación_

### reduccion-al-primer-cuadrante

Términos: reducción al primer cuadrante, primer cuadrante, ángulo de referencia, co-razón, ángulos suplementarios, cuarto de vuelta.

- **cualquier-giro**
  - Consigue una razón negativa cuyo ángulo de referencia mida 60°. · _exacto_
  - Busca un giro del cuadrante III donde la razón elegida sea positiva. · _forma_
  - Haz que la tangente no esté definida con un giro negativo. · _forma_
  - Busca el giro más negativo de la mesa con el lado final de 855°. · _extremo_
  - Guarda dos giros de cuadrantes distintos con la misma razón y el mismo valor. · _comparación_
- **siete-relaciones**
  - Con la pareja 90° − θ, haz que P′ caiga justo sobre P. · _exacto_
  - Haz que la lectura cambie a la co-razón y dé los dos signos negativos. · _forma_
  - Con la pareja 180° + θ, deja a P′ lo más abajo posible. · _extremo_
  - Con el mismo θ, guarda dos parejas distintas cuyos P′ tengan la misma altura. · _comparación_

### circunferencia-trigonometrica

Términos: circunferencia trigonométrica, número real, arco dirigido, origen de arcos, línea seno, línea coseno, línea tangente, línea cotangente, creciente, decreciente.

- **seis-lineas**
  - Haz que seno y coseno valgan lo mismo, con signo incluido. · _exacto_
  - Con las seis líneas, haz que solo tangente y cotangente sean positivas. · _forma_
  - Con tan y cot a la vista, deja la tangente sin valor. · _forma_
  - Con sec y csc, busca el P cuya secante quede más cerca del centro. · _extremo_
  - Guarda dos P de cuadrantes distintos con el mismo seno. · _comparación_
- **dos-arcos**
  - Con el coseno, consigue que la línea más larga sea también la de mayor valor. · _extremo_
  - Con la tangente, haz que dos arcos que terminan en puntos distintos den el mismo valor. · _exacto_
  - Con el seno, logra el mismo largo para los dos, pero con signos contrarios. · _exacto_
  - Con el seno, haz que sen θ₁ − sen θ₂ sea lo más grande posible. · _extremo_
- **numero-sin-tope**
  - Busca el menor t positivo que termine en el cuadrante III. · _extremo_
  - Con t distinto de 0, deja P lo más cerca posible de A. · _extremo_
  - Da más de una vuelta en sentido horario y termina en el cuadrante II. · _extremo_
  - Guarda dos t de signo contrario que terminen en el mismo cuadrante. · _comparación_

### identidades-fundamentales

Términos: identidad trigonométrica, identidad pitagórica, identidad recíproca, identidad por cociente, dominio, demostrar, refutar, contraejemplo, simplificar, término doble.

- **tres-triangulos**
  - Con el triángulo de seno y coseno, haz que los dos catetos midan igual. · _exacto_
  - Con el triángulo de tangente, haz que la secante mida justo √2. · _exacto_
  - Con el triángulo de tangente, acércate todo lo que puedas a 90° sin perder la secante. · _forma_
  - Con el triángulo de cotangente, pon P donde ese triángulo no exista. · _forma_
  - Guarda dos θ de cuadrantes distintos con el triángulo de seno y coseno. · _comparación_
- **dos-miembros**
  - Con sen θ + cos θ = 1, busca un θ donde las dos curvas sí coincidan. · _exacto_
  - Con sen θ + cos θ = 1, busca dónde la izquierda se aleja más del 1. · _extremo_
  - Con √(sen²θ) = sen θ, encuentra un contraejemplo. · _exacto_
  - Con (1 − cos²θ)/sen θ = sen θ, pon el punto en un hueco. · _exacto_
  - Con sen⁴θ − cos⁴θ = sen²θ − cos²θ, guarda dos θ de cuadrantes distintos donde coincidan. · _comparación_

### arcos-compuestos

Términos: arco compuesto, denominador, onda, cresta, amplitud, identidad auxiliar, ángulo auxiliar, factor común.

- **suma-diferencia**
  - Que la torre llegue justo a la línea roja, con α y β distintos de 0. · _exacto_
  - Con seno, separa la torre de la línea roja lo más que puedas. · _extremo_
  - Resta (β negativo) y deja la torre y la línea roja a lados opuestos del cero. · _forma_
  - Guarda dos casos con el mismo rayo rojo y distinta torre. · _comparación_
- **tangente-fina**
  - Lleva α + β justo a 90° y mira qué hace el denominador. · _exacto_
  - Haz que tan(α + β) valga justo 1, sin dejar ningún ángulo en 0°. · _exacto_
  - Pasa los 90° y busca el punto rojo más bajo que todavía se vea. · _extremo_
  - Guarda dos casos con igual α + β y distinta suma tan α + tan β. · _comparación_
- **ondas-libres**
  - Haz que la cresta roja mida justo 2,5, con a y b distintos de 0. · _exacto_
  - Busca la cresta roja más alta posible. · _extremo_
  - Haz que la cresta roja caiga justo en x = 45°. · _exacto_
  - Guarda dos casos con la misma cresta roja y distinto a + b. · _comparación_

### arcos-multiples

Términos: ángulo doble, ángulo mitad, ángulo triple, potencia, degradación, cubo, polinomio, candidato.

- **doble-y-mitad**
  - Busca un θ distinto de 0° con sen 2θ igual a 2 sen θ. · _exacto_
  - Iguala las alturas del rayo rojo y el naranja, sin que valgan 0. · _exacto_
  - Busca el primer θ en que la altura turquesa queda bajo el eje x. · _extremo_
  - Guarda dos θ con la misma altura naranja y mitades de signo contrario. · _comparación_
- **punto-a-punto**
  - Pon el punto lleno justo sobre la línea de 1/2. · _exacto_
  - Haz que el hueco llegue a su punto más bajo. · _extremo_
  - Haz que el punto lleno y el hueco coincidan. · _forma_
  - Guarda sen² x y cos² x con el mismo x, lejos de 1/2. · _comparación_
- **tres-candidatos**
  - Busca una altura con solo dos candidatos. · _forma_
  - Haz que uno de los candidatos sea justo 0. · _exacto_
  - Busca la altura más baja que todavía tenga tres candidatos. · _extremo_
  - Con seno, guarda dos alturas opuestas y compara sus candidatos. · _comparación_

### transformaciones-trigonometricas

Términos: semidiferencia, rombo, diagonal, suma a producto, producto a suma, sumatoria, productoria, polígono regular, ángulo medio, prostaféresis.

- **rombo-entero**
  - Haz que la flecha roja R se anule. · _forma_
  - Haz que R apunte hacia la semisuma, no al revés. · _forma_
  - Con A y B distintas, haz la flecha R lo más larga posible. · _extremo_
  - Guarda dos pares con la misma semisuma y R en sentidos opuestos. · _comparación_
- **cadena-larga**
  - Cierra una cadena: que la última flecha vuelva al origen. · _forma_
  - Cierra la cadena con el paso x más chico que puedas. · _extremo_
  - Con dos flechas o más, logra Σ cos = 0 sin cerrar la cadena. · _exacto_
  - Guarda dos cadenas con el mismo paso, distinto n y la misma Σ sen. · _comparación_
- **muchos-dobles**
  - Haz que el producto valga 0. · _exacto_
  - Haz que el producto valga justo 1/2ⁿ, con n factores. · _exacto_
  - Con cinco factores, busca el producto más grande. · _extremo_
  - Guarda x y 180° − x con los mismos factores y compara los productos. · _comparación_

### funciones-trigonometricas

Términos: función trigonométrica, gráfica, periodo, frecuencia, rango, asíntota, desplazamiento vertical, función par, función impar, múltiplo común.

- **onda-completa**
  - Haz que la onda vaya justo de −1 a 3. · _exacto_
  - Busca el periodo más largo que deja la mesa. · _extremo_
  - Haz que la onda empiece bajando desde su línea media. · _forma_
  - Guarda dos ondas con el mismo rango y distinto A. · _comparación_
- **cuatro-funciones**
  - Pon x justo sobre una asíntota de la función elegida. · _exacto_
  - Acércate a una asíntota hasta lograr el valor más grande posible. · _extremo_
  - Con secante o cosecante, busca un x donde valga justo 1 o −1. · _exacto_
  - Guarda tan y cot en un mismo x, y multiplica sus valores. · _comparación_
- **suma-de-ondas**
  - Consigue que la suma roja se repita cada π. · _forma_
  - Con m distinto de n, busca el periodo común más corto. · _extremo_
  - Haz que la roja sea una sola onda, el doble de alta. · _forma_
  - Guarda dos pares distintos con el mismo periodo común, que no sea 2π. · _comparación_

### funciones-trigonometricas-inversas

Términos: función inversa, rama, valor principal, arcoseno, arcocoseno, arcotangente, arcocotangente, arcosecante, arcocosecante, recíproco, composición, reflejo.

- **cuatro-ramas**
  - Con arcsen o arccos, busca el mayor k que todavía tiene ángulo. · _extremo_
  - Haz que la inversa devuelva un ángulo negativo. · _forma_
  - Con arccot, consigue justo 135°. · _exacto_
  - Guarda arcsen k y arccos k con el mismo k, y suma los dos ángulos. · _comparación_
- **cancela-o-no**
  - Haz que la inversa se cancele: que devuelva el mismo x. · _exacto_
  - Con arcsen, busca el x más grande que todavía se cancela. · _extremo_
  - Con arccos, elige un x negativo y mira que devuelve −x. · _forma_
  - Guarda dos x distintos con los que la inversa devuelva el mismo ángulo. · _comparación_
- **tres-reflejos**
  - Haz que el punto naranja y su reflejo verde coincidan. · _forma_
  - Con arccos, lleva el punto naranja lo más alto posible. · _extremo_
  - Con arcsen, deja el punto naranja justo a la altura π/6. · _exacto_
  - Con arccos, guarda k y −k, y compara las dos alturas. · _comparación_

### ecuaciones-trigonometricas

Términos: ecuación trigonométrica, solución, solución general, familia de soluciones, solución particular, intervalo, conjunto solución, factor, factorizar, sistema de ecuaciones, intersección.

- **tres-funciones**
  - Con seno, busca una altura k que dé una sola solución en la vuelta. · _forma_
  - Con seno, consigue que 210° sea una de las soluciones. · _forma_
  - Con coseno, logra dos soluciones que sumen exactamente 360°. · _exacto_
  - Con tangente, lleva k a un extremo y cuenta las soluciones. · _forma_
  - Guarda dos casos de seno: uno con dos soluciones y otro sin ninguna. · _comparación_
- **franja-libre**
  - Consigue cinco soluciones dentro de la franja. · _forma_
  - Con seno, pon el final b justo sobre un corte. · _exacto_
  - Con k distinto de 0, 1 y −1, logra un número impar de soluciones. · _forma_
  - Guarda dos casos con el mismo b y distinta cantidad de soluciones. · _comparación_
- **factor-fuera**
  - Consigue la mayor cantidad posible de soluciones distintas. · _extremo_
  - Haz que el segundo factor repita un ángulo del primero. · _extremo_
  - Consigue que 120° sea solución del segundo factor. · _forma_
  - Guarda dos casos con distinta c y el mismo conjunto solución. · _comparación_

### triangulos-oblicuangulos

Términos: triángulo oblicuángulo, ángulo opuesto, ángulo obtuso, ley de senos, diámetro, inscrito, caso ambiguo, ley de cosenos, ley de proyecciones, ley de tangentes, rumbo.

- **cosenos-libre**
  - Haz que a mida justo lo que daría Pitágoras. · _exacto_
  - Arma un triángulo equilátero: los tres lados iguales. · _exacto_
  - Haz que a sea más corto que b y que c a la vez. · _extremo_
  - Busca el lado a más largo que permite la mesa. · _extremo_
  - Guarda dos casos con los mismos b y c: uno con A agudo y otro obtuso. · _comparación_
- **compas-libre**
  - Consigue un solo triángulo, rectángulo en B. · _forma_
  - Haz que el compás no toque la base: ningún triángulo. · _forma_
  - Logra un solo triángulo con a mayor o igual que b. · _extremo_
  - Con A = 60° y b = 6, busca el menor a que forme triángulo. · _extremo_
  - Guarda dos casos con los mismos A y b y distinta cantidad de triángulos. · _comparación_
- **viaje-libre**
  - Arma un viaje con un ángulo recto en C. · _forma_
  - Haz que el segundo tramo vuelva justo hacia A. · _exacto_
  - Consigue que el regreso mida lo mismo que los dos tramos juntos. · _exacto_
  - Guarda dos viajes con los mismos largos, rumbos distintos y el mismo regreso. · _comparación_

### areas-y-lineas-notables

Términos: perímetro, semiperímetro, fórmula de Herón, circunferencia circunscrita, circunradio, inradio, circunferencia exinscrita, exradio, ceviana, mediana, bisectriz, teorema de Stewart, cuadrilátero.

- **lados-y-angulo**
  - Sin cambiar b ni c, busca el ángulo que da el área más grande. · _extremo_
  - Consigue un área de exactamente 6. · _exacto_
  - Haz que la altura h mida justo la mitad del lado c. · _exacto_
  - Guarda dos casos con los mismos lados, ángulos distintos e igual área. · _comparación_
- **heron-sin-cierre**
  - Elige lados que no cierren y mira qué queda bajo la raíz. · _forma_
  - Haz que p menos el lado mayor sea justo cero. · _extremo_
  - Consigue un área entera con tres lados distintos. · _forma_
  - Con a = 10, busca el área más grande que permite la mesa. · _extremo_
  - Guarda dos triángulos con el mismo perímetro y distinta área. · _comparación_
- **bisectriz-o-mediana**
  - Haz que la bisectriz y la mediana caigan en el mismo punto. · _exacto_
  - Pon D justo en el pie de la bisectriz. · _exacto_
  - Sin cambiar b, mueve D hasta la ceviana más corta. · _extremo_
  - Guarda dos casos con el mismo b, distinto D y cevianas del mismo largo. · _comparación_

### conicas

Términos: lugar geométrico, cónica, foco, directriz, parábola, elipse, hipérbola, eje focal, semieje, recta tangente, discriminante, ecuación general, rotación de ejes.

- **foco-y-directriz**
  - Cambia p y vuelve a poner P sobre la curva: PF = PD. · _exacto_
  - Pon P en el punto de la curva más cercano al foco. · _extremo_
  - Pon P debajo de la directriz y compara las dos distancias. · _forma_
  - Guarda dos puntos simétricos respecto al eje y, con el mismo p. · _comparación_
- **cuerda-libre**
  - Lleva el lápiz P a la punta más alta de la elipse. · _extremo_
  - Junta los dos focos y mira qué curva dibuja la cuerda. · _forma_
  - Haz que la curva se aplane en el segmento entre los focos. · _forma_
  - Busca la elipse más achatada sin que llegue a ser un segmento. · _extremo_
  - Guarda dos elipses con el mismo semieje b y distinto a. · _comparación_
- **recta-y-parabola**
  - Haz que la recta toque la parábola una sola vez. · _forma_
  - Consigue que la recta no corte la parábola. · _forma_
  - Con la recta horizontal, haz que toque la parábola solo en su vértice. · _forma_
  - Con m = 1, busca el menor k que todavía toque la parábola. · _extremo_
  - Guarda dos rectas paralelas: una que corte dos veces y otra que no corte. · _comparación_

### coordenadas-polares-y-complejos

Términos: coordenadas polares, polo, eje polar, número complejo, unidad imaginaria, plano complejo, eje real, módulo, argumento, cis, forma trigonométrica, forma exponencial, fórmula de De Moivre.

- **radio-negativo**
  - Con un r negativo, lleva el punto a (0; 2). · _forma_
  - Con r negativo, pon el punto en el primer cuadrante. · _extremo_
  - Lleva el punto al polo. · _forma_
  - Guarda dos casos con el mismo θ y r de signos opuestos. · _comparación_
- **cuatro-cuadrantes**
  - Busca un z donde arctan(b/a) sí dé el argumento. · _forma_
  - Haz que el argumento sea justo 135°. · _exacto_
  - Consigue un z de módulo 2,5 que no esté sobre un eje. · _forma_
  - Busca el z de mayor módulo con argumento en el cuarto cuadrante. · _extremo_
  - Guarda dos z con el mismo arctan(b/a) y argumentos distintos. · _comparación_
- **producto-cociente**
  - Consigue que z·w caiga sobre el eje real positivo. · _forma_
  - Haz que z·w apunte justo al revés que z. · _exacto_
  - Con dividir, logra que z/w mida exactamente 1. · _exacto_
  - Busca la flecha verde más larga posible. · _extremo_
  - Guarda un producto y un cociente con los mismos z y w. · _comparación_

