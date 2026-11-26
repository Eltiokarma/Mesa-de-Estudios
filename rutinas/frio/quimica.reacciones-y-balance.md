# Lector en frío: «Reacciones químicas y balance» (quimica.reacciones-y-balance)

26 nov 2026. Dos lectores en frío, solo con capturas a 390 px (`capturas-teoria.js … momentos,ejemplos --entera
--lector`): A, ideas 1 a 3 y tarjetas 01 a 09; B, ideas 4 a 6 y tarjetas 10 a 18. Los dos contaron átomos y carga de
cada ecuación y las partículas de cada vaso. Informes completos en el scratchpad de la sesión (`frio-a.md`,
`frio-b.md`); aquí, lo que señalaron y cómo quedó.

## Lo que señalaron

**Lector A.** Química sin errores (cada ecuación y cada vaso cuadran). Lo trabaron: el mismo ⊙ para Zn(s), Fe³⁺ y Fe
metálico, y la leyenda «⊙ 1, ● 2» sin elemento en la idea 3; en Mira de la idea 2, «ni una ni otra» sin decir qué es,
la caja de exotérmica sin flecha y el metano sin «+ calor»; la voz de «Ahora tú» 2 pide buscar el calor cuando solo
se pregunta la forma; el pie «A + B → AB: dos sustancias forman una» se lee cortado; la tarjeta de nivel 3 de
indicios regalada («sale un gas» en el enunciado); «Ia, IIb» se lee «la»; las tarjetas sin dibujo; el sodio en agua
también calienta.

**Lector B.** Dos errores de contenido: la tarjeta «Una oxidación» dice «faltan 2 O a la derecha» (faltan a la
izquierda) y la tarjeta «El hidrógeno» muestra ClO₃⁻ + 6 H⁺ → Cl⁻ + 3 H₂O con carga +5 contra −1 sin aviso. Además:
el juego 5 con «2 Cu + 1 AgNO₃ → 2 Cu(NO₃)₂ + 1 Ag», que no cuadra en N ni O; Datos sin el EO del Cl en FeCl₃, el del
O en PbO y el +2 del Zn; los objetos de Lee 4, 5 y 6 grises (sin el azul, el rojizo, la plata ni el morado); la flecha
de la ecuación grande como guion; la regla 5 («los electrones … son los átomos»); Mira 6 con la semirreacción
terminada desde el paso 1 y una fila «básico»; la regla 6 y su «Vale si»; las tarjetas del fósforo y del zinc con
nitrato, que se saltan de dónde salen el 2, el 10 y el 8; la voz de Predice 5 casi da la respuesta.

## Correcciones de la ronda 1

Cada una con su prueba (detalle en `rutinas/auditoria/quimica.reacciones-y-balance.md`, «Correcciones (26 nov)»).

| Señalado | Cómo quedó |
|---|---|
| «Faltan 2 O a la derecha» (B) | «El SO₄²⁻ tiene 2 O más que el SO₂: faltan 2 O a la izquierda…». Busqué el patrón en el generador (400 semillas): el lado del agua sale siempre del motor y estaba bien; el error era solo de la tarjeta. |
| ClO₃⁻ + 6 H⁺ sin electrones (B) | «La carga todavía no cuadra: faltan los electrones.» En las semillas, las semirreacciones a medias solo aparecen en preguntas que piden justo lo que falta. |
| Juego 5 sin cuadrar (B) | Ecuación iónica, Cu + Ag⁺ → Cu²⁺ + Ag, con el deslizador «Ag⁺» y la consigna «el nitrato no cambia». |
| EO que faltan en Datos (B) | Línea nueva en los Datos del EO: cloro, bromo o yodo en una sal sin oxígeno, −1. «Plomo y amoníaco» trae el −2 del O. El +2 del Zn se saca del Cl −1 con «la suma de los EO es la carga», que ya está. |
| Objetos grises (B) | Colores de las sustancias en `quim-reaccion` (de prueba). |
| Flecha como guion (B) | La flecha de la ecuación va en la letra de la interfaz. |
| Regla 5 (B) | «Los electrones que gana o pierde una fórmula se cuentan multiplicando los átomos que cambian por el salto de EO.» |
| Mira 6 (B) | El recuadro arranca en NO₃⁻ → NO. La fila «básico» se queda: se llena recién en el paso 4, que la explica («si fuera básico» se salía del lienzo a 390 px). |
| Regla 6 y su «Vale si» (B) | «…el medio es ácido, con H⁺. En medio básico se hace lo mismo y al final se suman a cada lado tantos OH⁻ como H⁺ haya…». |
| Tarjetas del fósforo y del zinc con nitrato (B) | Un paso con la cuenta del H y el O, y otro con el 10 H⁺ y los 8 e⁻. |
| Voz de Predice 5 (B) | «Mira la fórmula entera, no solo el símbolo del hierro.» |
| Un símbolo por especie (A) | Fe³⁺ como ion hueco (igual que el Zn²⁺); el Fe metálico sigue punto. La cuenta de la idea 3 dice «Fe: 1», «O: 2». |
| Mira de la idea 2 (A) | Nodo «CH₄ + 2 O₂ → CO₂ + 2 H₂O + calor» → «combustión: no es ninguna de las cuatro formas»; y «calor con los productos: sale» → «exotérmica», con flechas. |
| Voz de «Ahora tú» 2 (A) | «Mira qué te piden: la forma, el calor o las dos cosas.» |
| Pie «forman una» (A) | «dos sustancias se juntan en una sola» y «una sola sustancia se separa en dos». |
| Tarjeta 03 regalada (A) | Nivel 3 nuevo: el bicarbonato en el horno a unos 180 °C; ¿qué estado se le escribe al H₂O y al CO₂? (los dos, gas). |
| «Ia, IIb» (A) | «I-b, II-a, III-c». |
| Tarjetas sin dibujo (A y B) | No es un fallo de la captura: los 90 ejemplos no tienen figura, como casi todos los de química. **Para Gerson.** |
| Sodio en agua que calienta (A) | Sin cambio: la pregunta pide el indicio de la ecuación y ninguna opción habla de calor. |
