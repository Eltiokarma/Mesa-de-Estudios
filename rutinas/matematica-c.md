# Rutina de matemática C: reporte

Sesión paralela de la rama `rutina/matematica-c` (creada desde `claude/awesome-wozniak-5etl1n`). La conversación principal integra. Dos tareas: la escena `plantillas/coordenadas-polares/` y los pares de reserva del banco de entrada y salida de álgebra, geometría y trigonometría.

## 7 nov 2026 · Banco: pares de reserva de álgebra, geometría y trigonometría

**Qué hice.** 16 pares en `reserva` (no en las formas), 2 por cada escena del curso que no tenía par. Criterio: transferencia cercana, o sea la misma tarea y los mismos códigos de error que una predicción de la escena, con otra situación y otros números, sin copiar `papel.json`. Cada par tiene su verificador en `catalogo/pruebas/verificar.js` (secciones «Reserva de … (rutina de matemática C)»), y ahí la respuesta y cada distractor salen del motor de su plantilla. Algunos verificadores comprueban además que el enunciado cuadre con el motor: la hipotenusa dada, que P equidiste de A y de B, el polígono con un vértice arriba y los radicales exactos en tt-01.

| Par | Plantilla | Qué mide | Correcta A / B | Códigos |
| --- | --- | --- | --- | --- |
| cx-01 | numeros-complejos | Módulo √(a² + b²) | 17 / 13 | AL9 (parcial), CX10, CX11 |
| cx-02 | numeros-complejos | iⁿ con el resto entre 4 (i²⁷, i⁵⁹) | −i / −i | CX2, CX3, CX4 |
| re-01 | numeros-reales | \|x − a\| ≤ r como trozo | [1; 9] / [−2; 8] | AL22 (parcial), NR5, NR6 |
| re-02 | numeros-reales | Imagen de kx + t con k < 0 | [−11; 7⟩ / ⟨−10; 6] | AL20, NR20, NR22 |
| po-01 | polinomios | Resto de P ÷ (x + 2) es P(−2) | 11 / 15 | PO8, PO15, PO27 |
| po-02 | polinomios | Teorema del factor, despejar k | −8 / −10 | PO17, PO33, AL16 |
| pl-01 | programacion-lineal | Traducir «a lo más» | 5x + 2y ≤ 40 / 3x + 4y ≤ 120 | PL14 (parcial), PL15, PL12 (parcial) |
| pl-02 | programacion-lineal | Máximo de z en los vértices | (5; 4) / (4; 5) | PL5, PL4, PL7 |
| cg-01 | congruencia | Punto de la mediatriz equidista | 25 cm / 41 km | PM-como-PB, suma-de-segmentos, GE11 |
| cg-02 | congruencia | Mediana a la hipotenusa = mitad | 8,5 cm / 12,5 m | mediana-igual-cateto, GE8 (parcial), mediana-promedio-catetos |
| sa-01 | segmentos-angulos | Alternos internos iguales, despejar x | 45 / 50 | GE17, despeje-signo, da-el-angulo-y-no-x |
| sa-02 | segmentos-angulos | Segmentos que se pisan | 8 km / 9 cm | suma-segmentos-solapados, resta-da-otro-segmento, promedia-los-datos |
| si-01 | simetria | Simétrico respecto de y = x + c | (3; 6) / (5; 4) | se-queda-en-el-pie, refleja-en-vertical, intercambia-coordenadas |
| si-02 | simetria | Ejes de un regular impar | 5 / 3 | solo-el-eje-vertical, impar-sin-ejes, cuenta-vertices-y-lados-aparte |
| tt-01 | transformaciones-trig | sen A + sen B a producto, sin tabla | √6/2 / √2/2 | TR16, TT2, TT1 |
| tt-02 | transformaciones-trig | (sen px + sen qx)/(cos px + cos qx) | tan 8x / tan 7x | TT4, TT2, TT3 |

No hay pares para conjuntos y lógica en álgebra porque ya están en la reserva de aritmética (ari-23 a ari-26).

**Pruebas.** `npm test`: 4126 en verde, comprobado en una copia limpia de la rama antes de cada push. `app/datos/pruebas.json` regenerado: la reserva no viaja a la app, pero sí los códigos nuevos del diccionario `errores`.

**Avisos que quedan (no fallan).**

- Los 16 pares avisan «ya está en el catálogo; pasa el par de "reserva" a "pares"». Siguen en reserva porque las formas de álgebra, geometría y trigonometría ya tienen 10 pares, el tope. Si se quieren en la app, hay que elegir cuáles salen.
- Cada par comparte sus códigos con una predicción de su escena. Eso es lo esperado en transferencia cercana. No hubo avisos de parecido con el papel (re-02 se cambió porque se parecía a p5).

**Dudoso.**

- `GE11-resta-cuadrados` estaba como `hipotesis` en el banco y como `parcial` en la escena. Al integrar, la principal lo dejó en `parcial` (el informe de geometría lo da así por el estudio de Bolema).
- si-02 B (el triángulo, 3 ejes) puede salir más fácil que A (el pentágono). El heptágono está en la escena y el eneágono obligaba a escribir «nueve lados», lo que dejaba la respuesta en el enunciado.

## 7 nov 2026 · Coordenadas polares: el radar (`plantillas/coordenadas-polares/`)

**Qué hice.** Seguí el método de cuatro manos: constructor, verificador a ciegas, revisor de contenido y yo.

- **`motor.js`** (UMD, `window.MotorPolares`, sin DOM; exacto con k√m y ángulos notables, y con a lo más dos decimales y coma en los demás). Cubre:
  - el punto (r; θ) con r negativo y sus escrituras equivalentes;
  - el cuadrante;
  - polares ↔ cartesianas, con el cuadrante correcto (no el arctan de la calculadora);
  - θ = k como recta completa, porque r recorre todos los reales;
  - r = a, y r = a cos θ y a sen θ (también con a < 0), con su cartesiana;
  - las rosas: n pétalos si n es impar y 2n si es par, de largo |a|;
  - la forma polar del complejo (r cis θ, r·e^(iθ) y la binómica sin partes 0).

  El rango principal es r ≥ 0 y θ en [0°; 360°⟩; el complejo trae además el argumento principal en ⟨−180°; 180°], como en numeros-complejos. Los errores van de CP1 a CP27 y son hipótesis nuestras (el prefijo PO ya era de polinomios). Tres van como parcial: TR11 (cruza seno y coseno), TR12 (sin signo) y AL9 (r = |x| + |y|).
- **`casos.json`**: 20 casos con «tambien». **`motor.test.js`**: 40 pruebas, entre ellas:
  - ida y vuelta entre polares y cartesianas, y (−r; θ) = (r; θ + 180°);
  - puntos muestreados que cumplen la ecuación de su curva;
  - puntas de las rosas contadas;
  - forma polar del complejo igual a `aPolares`;
  - ningún error coincide con la correcta;
  - las predicciones salen del motor, distintas y con la misma forma.
- **`papel.json`**: 10 problemas propios.
- **`plantilla.json`**: unidad `trigonometria.coordenadas-polares-y-complejos`, borrador 0.1.0. Ya está en el catálogo (lo puse para que `npm test` quede en verde) y lleva la pasada de pegatina.
- **`index.html`**: un radar con anillos y rayos donde se arrastra el punto (ratón, dedo y teclado).
  - **Paso a paso** (8 pasos, 7 predicciones que bloquean):
    1. ¿Dónde está (4; 210°)? III cuadrante (CP1, CP9, CP2).
    2. (−2; 30°) con r positivo: (2; 210°) (CP5, CP3, CP4).
    3. (3; 60°) con r = −3: (−3; 240°) (CP7, CP8, CP6).
    4. (4; 150°) a cartesianas: (−2√3; 2) (TR11, CP14, TR12).
    5. (−2; −2) a polares: (2√2; 225°) (CP10, AL9, CP13).
    6. θ = 60° con r real: una recta que pasa por el polo (CP25, CP27, CP26).
    7. r = 4 cos θ: centro (2; 0) y radio 2 (CP15, CP17, CP16).
    8. El complejo como par polar, con r cis θ y r·e^(iθ). No tiene predicción y remite a «La flecha en el plano» para el producto, el cociente y De Moivre, sin duplicarlos.
  - **¿Qué pasa si…?** (5, en orden):
    1. (0; −3) a polares.
    2. r = −6 sen θ.
    3. r = 10 cos θ en cartesianas.
    4. La rosa r = 2 sen 3θ.
    5. La rosa r = 3 cos 2θ.

    Las perillas de a y n aparecen recién después de responder el experimento 5, para que el 4 no regale el 5. Los tramos con r < 0 van a trazos en tinta.

**Colores** (ΔE00 mínimo: 23,4 en claro y 21,9 en oscuro; contraste mínimo 4,63):

| Variable | Claro | Oscuro |
| --- | --- | --- |
| r | #a10fbf | #cf6bfa |
| θ | #1f5fbf | #7cb0ff |
| x | #a05200 | #f0a04a |
| y | #466d14 | #a3d65e |
| a | #0f766e | #5ed9c8 |
| n (contador de pétalos) | #453717 | #ffda0a |

Los colores de r, θ, x e y son los mismos que el módulo, el argumento, Re e Im de numeros-complejos. n es café en claro y amarillo en oscuro: fue la única opción con ΔE00 ≥ 20 en los dos temas. Hay dos excepciones contra el verde de «correcto», que siempre va con texto y borde: a (ΔE00 11) e y (15,6 en claro y 17,3 en oscuro).

**Pruebas.** `npm test`: 4207 en verde. `pasada-celular.py` no marca nada. El constructor y el revisor recorrieron la escena con Playwright en 390×844 y 1366×768, claro y oscuro, con y sin movimiento reducido, y con ratón, dedo y teclado: no hubo errores de consola ni desbordes. Yo lo repetí a 390 y 1366 sin errores; la cabecera no suelta nada y las pastillas 2 a 5 empiezan bloqueadas.

**Subagentes.**

- **Verificador a ciegas** (solo leyó la cabecera): usó radicales con Fraction, ángulos con atan2, equivalentes por fuerza bruta, circunferencias ajustadas a puntos muestreados y pétalos contados como máximos de |r|. **0 discrepancias** en los 20 casos; solo hubo diferencias de formato.
  - Después de la revisión cambiaron dos textos verificados de `rectaTheta`: «una recta que pasa por el polo» y «una semirrecta que empieza en el polo», para que las opciones tengan la misma forma. El sentido es el mismo.
  - La cabecera ahora termina en la línea 115.
- **Revisor de contenido.** Encontró una falla grave: el título del paso 7 («una curva que pasa por el polo») descartaba CP15. Ahora dice «Predice: la curva r = a cos θ». Además se corrigió:
  - el estado final de los pasos 2, 3 y 5, que con movimiento reducido perdía el rayo θ + 180°, el camino a trazos y el punto de «la calculadora»;
  - la falta de tramos de r negativo en las rosas y en los pasos 6 y 7;
  - el experimento 4, que regalaba el 5;
  - `null` en la forma exponencial con ángulos no notables;
  - la correcta del paso 6, que era la única con «completa»;
  - las fracciones del motor, que ahora se usan en los rótulos;
  - «3i» en vez de «0 + 3i»;
  - el paso 4, que ahora permite r negativo;
  - etiquetas cortadas a 390 px;
  - el −6 en el color de a;
  - «y = −2» en lugar de «−2i»;
  - el aria-live, que ahora avisa con retardo;
  - el enlace con `?desde=app`;
  - la cita de Williams en TR11;
  - √(x² + y²) = x + y (en vez de a y b);
  - la frase sobre los radares de los barcos, que miden desde el norte.

**Banco.** Dos pares en la reserva de trigonometría, con su verificador en `verificar.js`:

| Par | Qué mide | Correcta A / B | Códigos |
| --- | --- | --- | --- |
| cp-01 | (x; y) a polares en el II cuadrante | (6; 120°) / (6; 150°) | CP10, CP13, CP12 |
| cp-02 | Centro y radio de r = a sen θ | centro (0; 7) y radio 7 / centro (0; 8) y radio 8 | CP15, CP16, CP17 |

**Pendiente o dudoso.**

- n no tiene el mismo tono en claro y en oscuro (café y amarillo). El revisor lo aceptó porque hay precedentes; si Gerson prefiere un solo tono, hay que sacrificar ΔE00 en uno de los dos temas.
- Falta una línea en el informe de trigonometría: «Coordenadas polares (CP1 a CP27, 7 nov 2026): hipótesis nuestras; la lista está en la cabecera de `plantillas/coordenadas-polares/motor.js`».

**Pedidos para la integración.**

1. Subir `VERSION` en `app/sw.js` (no lo toqué, para no chocar con la principal).
2. Agregar a `docs/diseno.md` los colores de la tabla de arriba.
3. Agregar la línea anterior a `docs/investigacion/trigonometria-ideas-erroneas.md`.
4. Líneas para `docs/pendientes.md` y `CLAUDE.md`: «Coordenadas polares (7 nov 2026, rutina de matemática C): `plantillas/coordenadas-polares/` (el radar: r negativo que pasa por el polo, el cuadrante que la calculadora no ve, θ = k como recta, r = a cos θ como circunferencia que pasa por el polo, rosas con pétalos de r negativo y la forma polar del complejo enlazada con la flecha en el plano; 20 casos verificados aparte)».
