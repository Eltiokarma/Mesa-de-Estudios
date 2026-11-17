# Lector en frío: Materia y energía (quimica.materia-y-energia, 17 nov)

Dos lectores nuevos, sin código, que solo vieron capturas a 390 px y responden como alumno de 5.º de Juliaca:

- **Momentos**: los siete momentos de las cinco ideas, en orden (solo el paso 1 de Mira y la tarjeta 1 de Lee).
- **Ejemplos**: 15 tarjetas, las n.º 3, 8 y 14 de cada idea (una por nivel), con su recuadro «Datos».

Las capturas que vieron quedaron fuera del repo (`scratchpad/frio/quim/` y `quim/lector/`); las de después de corregir, en
`scratchpad/frio/quim-corr/`.

## Lo que entendieron bien

- La idea 1 entera: los tres vasos, la lupa como modelo, el hielo como una sustancia en dos fases. Resolvieron solos un
  caso nuevo (O₂ en la lupa → elemento; agua con sal → mezcla homogénea).
- La densidad con la balanza y la probeta (piedra, lingote, vidrio), el Predice de las dos ollas en Juliaca y la
  balanza del Sol (la nivelada no regala la respuesta; la inclinada la muestra después).
- El recuadro «Datos» ayuda: «con él puedo resolver sin haber memorizado nada».
- Mejor entendidos: el saco de papa, el alcohol del botiquín y el óxido del clavo (el dibujo coincide con los números).

## Hallazgos, por gravedad

### Alta

1. **El propano C₃H₈ dibujado con 2 H y no con 8** (lupa de Mira y de La regla de la idea 3, ejemplo 09): contando en el
   dibujo salen 2 H; el contador dice 8. «Es el error más grave que encontré».
2. **La regla de calor rota**: «Q = m · cₑ · ΔT Q =» en una línea, con un hueco grande, y «m · L» en la otra.
3. **Colores que cambian de papel**: Q naranja en el juego y en el eje, violeta en la fórmula; m pasa a naranja en la
   misma pantalla; ΔT y L comparten el turquesa; el violeta es a la vez 87 °C y ρ en la regla de propiedades; en los
   ejemplos, el resultado de un volumen (500 mL) y de una masa (79 g) sale violeta, y Δm y E cambian de color de la 13 a
   la 15.
4. **El juego de calor delata el Predice**: la curva entera punteada ya muestra la meseta en 87 °C antes de jugar (da la
   respuesta de la misión y la del Predice del hielo).
5. **El ejemplo 12 habla de «una curva temperatura–tiempo» que no está dibujada.**
6. **Lo que el resuelto usa y nadie dio**: el cuadrado de c (aparece 9 × 10¹⁶ sin ver 3 × 10⁸ al cuadrado), 1 g = 0,001
   kg, el 30 ÷ 3, el «+32» y el «273», qué es L y el 80 sin unidad, ΔK y Δ°F, «intensiva» solo subrayada, por qué 87 °C
   en Juliaca y no 100 °C, la «J» del Lee de la idea 5.
7. **«Datos» regala la respuesta**: en la 07 la definición de cambio nuclear repite el enunciado; en la 01 y la 03 casi.

### Media

8. La probeta solo muestra el nivel final: no se puede sacar V = 30 ni V = 20 cm³ (Lee y Juega de la idea 2).
9. 20 balones dibujados contra «unos 211 balones», sin decir cuánto vale cada dibujito ni qué es la caja punteada; la
   energía del balón en verde y E en violeta sin decir que son cosas distintas; 1,1 mg daba 9,7 × 10¹⁰ J (con 3 × 10⁸
   sale 9,9).
10. El estaño del bronce (ejemplo 02), todo en una franja: parece otra fase y contradice «se reparten parejo».
11. «Ahora tú» de la idea 3 es el mismo caso de Mira (el gas que arde), con otro nombre: «gas natural» contra C₃H₈.
12. N (azul hueca) y H (turquesa hueca) casi no se distinguen; en la lupa de la olla hay 6 moléculas antes y 3 después
    («¿se perdieron?»).
13. Niveles que no suben: la 03 («examen») es más fácil que la 02; la 12 casi no sube sobre la 11.
14. El exponente «10⁻²⁷» desarmado, «10¹⁰» con el 0 como «º» y el menos de «10⁻⁶» como una rayita alta.

### Leve

15. La moneda parece «un caracol o un bicho con antenas».
16. El contador «O: 10» de Mira toca el borde de la tarjeta.
17. «Cuánto del objeto pesas y mides %» confunde; la manchita cuadriculada del vaso (granitos sin disolver) no se explica.
18. La línea punteada de la lupa del clavo (ejemplo 08) nadie la explica; la 09 no recuerda cómo se lee C₃H₈.
19. «Vale si Vale para…» en calor, y «Vale si» como título no se entiende en general.
20. Bruna casi da la respuesta del Predice de las ollas («Piensa en el agua, no en el tamaño de la olla»).
21. Las pantallas 6 y 7 de las ideas 3, 4 y 5 no tienen dibujo; de lo nuclear no hay ningún ejemplo dibujado en la regla.
22. En la idea 1, la línea punteada de la lupa de «Ahora tú» ya dice «2 fases»; Si (café con punto) y H se parecen.
23. El número del círculo de cada tarjeta (3, 8, 14) no le dice nada al lector de ejemplos; la burbuja «2» de la fila
    de ideas sale cortada; la 10 (calor latente) «no parece la misma idea» que la 11 y la 12.

## Correcciones (17 nov)

Hechas en `contenido/teoria/quimica/materia-y-energia.js` y su test, y en `nucleo/kit/piezas/quim-cocina.js` y su test.
`quim-vasos` y `quim-particulas` no cambiaron (lo que ven otras unidades sigue igual). Cuentas que cambiaron, rehechas
con un script aparte que no usa la unidad (`scratchpad/ed/cuentas-corr.py`, 30 de 30 bien).

| # | Qué se hizo |
| --- | --- |
| 1 | El propano se dibuja con sus 11 átomos (3 C y 8 H; un hidrógeno más chico, `h`, para que quepa en su celda) y el alcohol con sus 9 (C₂H₆O). **Prueba nueva**: cada molécula dibujada en toda la unidad (lupas, Mira, ejemplos, Ahora tú en 60 semillas, laboratorio) tiene los átomos de su fórmula, con las fórmulas escritas aparte en el test; otra prueba mide que ninguna partícula pise a otra y que ningún átomo de Mira salga de su caja. En Mira el propano cae en una celda de adentro. |
| 2 | La regla de calor lleva el separador que pone cada fórmula en su línea (`'   ·   '`); prueba nueva. |
| 3 | Un color por magnitud en toda la unidad: m naranja, V turquesa, ρ violeta; Q violeta en el juego, el eje, el control, el arrastre, Mira, la regla y las cuentas; cₑ y L turquesa; **la temperatura y ΔT verde en toda la unidad** (también el 87 °C de la idea 2, que ya no es violeta como ρ); Δm naranja y E violeta en todos los ejemplos; la energía de un balón verde; el número de balones en carmín. El resultado lleva el color de su magnitud (500 mL turquesa, 79 g naranja, 0,5 g naranja). **Prueba nueva** que recorre ejemplos, Mira, regla, leyendas, lecturas y 40 semillas de Así se resuelve y Ahora tú y exige un solo color por magnitud; otra, que el eje, el termómetro y el rótulo de Q de los dibujos usen su color. |
| 4 | El juego de calor ya no dibuja la curva entera punteada ni la marca de 87 °C en el eje (marcas 0, 50 y 100): la meseta aparece solo cuando el calor llega. La tarjeta «Qué mirar» ya no dice que hay un tramo que hace una sola cosa. Prueba nueva. |
| 5 | El ejemplo 12 trae su curva temperatura–tiempo (de −10 °C a 70 °C, con una meseta en medio): se leen el inicio y el final en la figura, lo que además sube el nivel sobre la 11. |
| 6 | El cuadrado de c a la vista en cada ejemplo y paso que lo usa («c² = (3 × 10⁸)² = 9 × 10¹⁶») y «Potencias de 10» en los datos (prueba nueva); 1 g = 1 ÷ 1000 = 0,001 kg en la 15; 30 ÷ 3 = 10 cm³ en la 06 (con la densidad de una parte y la de la barra entera, y una figura de la barra); «+32» y «273» en los datos de la 11, la 12 y «Ahora tú» de escalas (punto y variación juntos, para elegir); L explicada con su llave y el 80 con su unidad en Mira; un paso de Mira para K y °F; «intensiva: no depende de cuánto hay» con su llave en Mira; un paso nuevo de Mira: Juliaca, a unos 3800 m, hierve a unos 87 °C y al nivel del mar a 100 °C; «La energía se mide en joules (J)» y «c = 3 × 10⁸ m/s» en la primera tarjeta de Lee de la idea 5. Unidades en la cuenta de la 10 (100 g · 540 cal/g). |
| 7 | La 07 ya no dice en el enunciado que el carbono pasó a nitrógeno: eso se lee en la lupa, y los datos traen las tres definiciones (físico, químico, nuclear) entre las que se elige. La 03 se rehízo (ver 13). La 01 queda igual: es de definición y el punto 13 pide las definiciones entre las que se elige. |
| 8 | La probeta (pieza, opción `marcas`) dice «antes» en la raya punteada y «después» en el agua, con «100 mL» arriba; si el agua sube poco, «antes» baja para no pisarse. Va en Lee, Juega, Ahora tú y los ejemplos con probeta. Prueba nueva en la pieza. |
| 9 | La fila de balones lleva título: «Cada balón dibujado vale 100; la caja punteada, 1000» (en el laboratorio, 10 000 y 100 000). Leyenda: «un balón» en verde, «balones» en carmín. La masa del control se redondea a su décima antes de calcular: 1,1 mg da 9,9 × 10¹⁰ J y unos 215 balones. El granito con círculo punteado pasó a un montoncito de polvo (carga nueva `pizca`). |
| 10 | El bronce reparte sus 4 estaños por toda la lupa (arriba a la izquierda, a la derecha, al centro y abajo). |
| 11 | «El gas natural arde» salió de «Ahora tú»; entra «La leche se agria» (químico, lo decide el motor: C₁₂H₂₂O₁₁ + H₂O → 4 C₃H₆O₃). Prueba nueva. |
| 12 | El nitrógeno pasa a bolita llena (azul llena contra turquesa hueca); leyendas al día. La lectura de un cambio de estado a gas dice «más separadas». |
| 13 | La 14 de la idea 1 (nivel 3) es ahora «Oxígeno con ozono»: O₂ y O₃ mezclados, «es un elemento porque solo tiene oxígeno» → mezcla homogénea de dos elementos (dos trampas a la vez; la clase la comprueba el motor). La 12 de calor sube con la curva (ver 5). |
| 14 | En la idea 5, las potencias de 10 van como potencias de la ecuación (`{ sup }`) y no con superíndices de Unicode, que la fuente no trae (⁰ y ⁻). En los textos con tope corto solo se cambian los que llevan ⁰ o ⁻. |
| 15 | Carga nueva `moneda` (disco echado con su canto) para la moneda de plata. |
| 16 | La fila de átomos de Mira pasó a un rótulo bajo la caja de antes («C 3 · O 10 · H 8»): en el celular, con la fuente real, el número pisaba al átomo siguiente. La de después la dice el paso 3 («C: 3 = 3; O: 10 = 10; H: 8 = 8»), para no mostrarla con la caja vacía. Prueba nueva: todo texto dentro del lienzo y ningún átomo fuera de su caja. |
| 17 | El control dice «Pedazo que cortas y pesas» y la leyenda «%: qué parte del objeto entero es el pedazo». Leyenda nueva para los granitos sin disolver y otra que dice que el azúcar, el aceite y la glucosa se dibujan en corto. |
| 18 | La 08 trae en los datos qué es la línea punteada; la 09, cómo se lee un subíndice (sin subíndice, 1). |
| 19 | La condición de calor ya no empieza con «Vale» y trae el punto (K = °C + 273, °F = 1,8 · °C + 32) y la variación «sin sumar». |
| 20 | La voz del Predice de las ollas: «Antes de mirar, decide con lo que ya sabes del agua que hierve». |
| Sal | **Decisión de Gerson (mesa de revisión, 17 nov)**: la sal disuelta se dibuja con los iones sueltos, Na⁺ y Cl⁻ entre las moléculas de agua; en el cristal y en el fondo sin disolver sigue como par NaCl. Cambió en el juego de la idea 1, la muestra de agua salada de Ahora tú, el agua de mar (ejemplo 6) y «Sal en el agua» (idea 3, ejemplo 5, con 3 aguas para que quepan). El motor sigue viendo una mezcla homogénea (los iones cuentan como NaCl). Textos: «La sal se disolvió: iones sueltos entre el agua, 1 fase»; el porqué del tipo 0 dice «agua e iones de la sal»; leyenda «iones de la sal; disuelta, van sueltos». Prueba nueva (un Cl⁻ por Na⁺, ningún par disuelto) y la de iones que no se pisan sigue en verde. |

### Pendiente, y por qué

- **Para Gerson**:
  - El color del resultado ahora sigue a su magnitud (no siempre violeta), como pidió la corrección. Es una lectura
    del molde §3 («el de su variable») por encima de §5b («violeta: lo que se pide»): confirmar y, si va, escribirlo en
    `docs/molde-unidad.md`.
  - El carmín para el número de balones (§5b lo reserva a los ángulos; esta unidad no tiene ángulos).
  - Verde (ΔT) junto a naranja (m) en Q = m · cₑ · ΔT: §5b avisa que se acercan en protanopía. Cada uno lleva su letra.
  - Las moléculas grandes (azúcar, glucosa, aceite) se dibujan en corto, y la leyenda lo dice. En la chicha, la glucosa
    en corto junto al alcohol completo no deja contar átomos: ¿se acepta o se cambia el ejemplo?
  - ¿Lleva dibujo «Así se resuelve» y «Ahora tú» en las ideas 3, 4 y 5? ¿Un ejemplo nuclear dibujado en la regla?
- **Fuera de alcance (app/ o núcleo)**:
  - «Vale si» como título de la condición (`app/teoria.js`): se entiende mal en general.
  - Los superíndices de Unicode en toda la app: convenía que `nucleo/ecuacion.js` los pinte como `<sup>`; aquí se
    arregló solo dentro de la idea 5. En una ficha de color, la potencia queda como dos fichas (base y exponente).
  - La llave de «calor específico» deja un hueco entre cₑ y ΔT en la regla (la nota es más ancha que la letra).
  - El número del círculo de la tarjeta (3, 8, 14) y la burbuja «2» cortada en la fila de ideas.
- **Leve, sin cambio**: la línea punteada de la lupa en «Ahora tú» de la idea 1 es el borde de fase del modelo
  (enseñado en Juega); Si y H se distinguen por el punto; la 01 de definición; la 10 (calor latente) es de la idea.
- **Otro encargo**: la idea de vida media que Gerson pidió de vuelta la agrega otro agente; esta corrección no la tocó
  (la prueba «sin radiactividad ni vida media» tendrá que cambiar con ella).

Pruebas: `node --test contenido/teoria/teoria.test.js contenido/teoria/quimica/*.test.js nucleo/kit/piezas/*.test.js`,
679 de 679 (la unidad suma 10 pruebas nuevas y `quim-cocina` una); `npm test`, 9228 de 9228. `npm run catalogo` hecho. Capturas nuevas de momentos y
ejemplos (con `--entera --lector`) en `scratchpad/frio/quim-corr/`, revisadas a ojo en las pantallas que cambiaron.
