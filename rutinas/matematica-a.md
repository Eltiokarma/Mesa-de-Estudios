# Rutina de matemática A (álgebra y trigonometría): reporte

Sesión paralela pedida por Gerson. Construye, una por una, plantillas de escena completas y revisadas en la rama `rutina/matematica-a`. La conversación principal las integra (catálogo, diseño, pendientes, CLAUDE.md). Orden de la lista: exponenciales y logaritmos, identidades trigonométricas, polinomios, funciones trigonométricas inversas.

Cada plantilla pasa por tres subagentes: constructor, verificador independiente de los casos (sin leer el motor) y revisor de contenido. Lo que encuentran se aplica antes de pasar a la siguiente.

## 6 nov 2026 · Exponenciales y logaritmos: la escalera de la base (`plantillas/exponenciales-logaritmos/`)

**Qué hice.**

- **`motor.js`** (UMD, sin DOM, fracciones exactas: log₆₄ 8 = 1/2 sale exacto). Cubre logaritmos con propiedades y cambio de base, la inversa de bˣ, ecuaciones exponenciales (igualar bases y cambio de variable u = bˣ), ecuaciones e inecuaciones logarítmicas con el dominio, inecuaciones exponenciales con base < 1, crecimiento, vida media y bˣ contra x². Rechaza la base 0, 1 o negativa y N ≤ 0. Cada resultado trae `errores` y `coinciden`.
- **`casos.json`**: 22 casos. **`motor.test.js`**: 44 pruebas, entre ellas la de propiedades (ningún error típico da la respuesta, en los casos y en un barrido de 300 parámetros por función) y la que comprueba que cada predicción sale del motor con opciones distintas y de la misma forma.
- **`papel.json`**: 10 problemas propios.
- **`plantilla.json`**: unidades `algebra.exponenciales-y-logaritmos` y `algebra.tipos-de-funciones-e-inversa`; borrador 0.1.0.
- **`index.html`**:
  - **Paso a paso** (9 pasos): una escalera donde cada salto multiplica por la base, con un marcador que se arrastra. Tiene 8 predicciones que bloquean:
    - log₂(8·4), con el distractor AL10;
    - log₂(8+8), con AL10 en sus dos formas;
    - el cambio de base, con AL31;
    - la inversa de 2ˣ, que se refleja en y = x y luego tiene la base como perilla (AL29 y reflejos en los ejes);
    - 4^(x+1) = 2^(3x), con AL32;
    - 4ˣ − 3·2ˣ + 2 = 0, con el cambio de variable;
    - log₂x + log₂(x−2) = 3, con la recta del dominio y la raíz extraña;
    - el cultivo que se duplica, en cuadritos contra t² (AL33).
  - **¿Qué pasa si…?** (6): sumar 1 al exponente (AL11), log₂(a²) (AL31), log₅1 + log₅5, (1/2)ˣ > 1/8 (invertir el sentido), la vida media con 96 g y 2ˣ contra x². Las pastillas se bloquean hasta responder las anteriores.
- **Respaldo.**
  - 'Parcial' solo para AL10, AL31 (Chua y Wood 2005, según resúmenes) y AL29.
  - 'Hipótesis' para AL11, AL32 y AL33, y para EL1 a EL25, que son hipótesis nuestras: cada uno lleva su id y su regla en el motor. Ningún error va como 'documentado'.

**Pruebas.** `npm test`: 1313; pasan 1311 y fallan solo las 2 esperadas (catálogo y app). Playwright a 1366×768 y 390×844, claro y oscuro, con y sin movimiento reducido: sin errores de consola. El bloqueo no se salta con clic forzado, quitando `disabled` desde la consola ni con el hash.

**Subagentes.**

- **Verificador independiente** (no leyó el motor): recalculó con fracciones los 21 casos de entonces, sustituyendo raíces, revisando el dominio y componiendo las inversas. No hubo discrepancias. Pidió casos de borde y entraron todos:
  - inecuación logarítmica con base 1/2 y dominio;
  - (1/3)ˣ ≤ 9;
  - log_{1/4} 8 = −3/2;
  - log₃x + log₃(x−8) = 2;
  - ecuaciones sin solución (log₂x = log₂(x−3) y 4ˣ + 3·2ˣ + 2 = 0);
  - vida media con tiempos que no son múltiplos (40√2);
  - inversa con x negativo;
  - bases inválidas.
- **Revisor de contenido:** encontró dos fallas graves, las dos corregidas.
  - En el paso 6 se veían los tres arcos ×4 que llegaban a 64 y regalaban x = 2. Ahora se ve uno solo antes de responder.
  - En el experimento 6 los rótulos de las curvas mostraban cuál terminaba arriba.

  También corregí:
  - el paso 4: la escalera ya no destaca 1, 8 y 64, y el enunciado da los logaritmos;
  - la x con dos colores en el paso 8;
  - el experimento «Un salto más», que delataba la respuesta (ahora «Sumar 1 al exponente»);
  - una frase falsa del experimento 6;
  - el paso final de papel p8;
  - el «solo» de las opciones;
  - el 26,7 g, que era la única opción con decimal;
  - «según resúmenes» en la fuente de la inversa;
  - rótulos y ecuaciones que se partían en el celular;
  - el texto para lectores de pantalla.

**Pendiente o dudoso.**

- EL12 («divide entre los periodos») queda como N0/(t/T). El verificador lo pensó como N0/2: es una definición del distractor, no un error de cálculo.
- En el paso 5 el daltonismo se cubre con el rótulo «y = 2ˣ» en el dibujo, no con «la continua».

**Pedidos para la integración.**

1. Catálogo: poner `exponenciales-logaritmos` en `algebra.exponenciales-y-logaritmos` y en `algebra.tipos-de-funciones-e-inversa`, y correr `npm run catalogo`. Sumar ítems de entrada y salida de álgebra (la prueba avisa).
2. `docs/diseno.md`, colores de la escalera de la base. El ΔE00 mínimo es 23,6 en claro y 25,3 en oscuro (el par t–t²); el contraste más bajo, 4,63.

   | Variable | Claro | Oscuro |
   | --- | --- | --- |
   | Base b y factor (naranja) | #a05200 | #f0a04a |
   | Exponente x, logaritmo y la curva log_b x (fucsia) | #a10fbf | #cf6bfa |
   | Potencia N, u, argumentos, bacterias, gramos y la curva bˣ (azul) | #1f5fbf | #7cb0ff |
   | Tiempo t (verde) | #466d14 | #a3d65e |
   | t² (turquesa) | #0f766e | #5ed9c8 |

   El color va por papel, no por letra: x es fucsia cuando es exponente y azul cuando es argumento (paso 8). La recta y = x va en gris a trazos.
3. `docs/investigacion/algebra-funciones-ideas-erroneas.md`: conviene sumar una tabla con EL1 a EL25 como hipótesis nuestras.
4. Líneas para `docs/pendientes.md` y `CLAUDE.md`: «Exponenciales y logaritmos (6 nov 2026, rutina de matemática A): `plantillas/exponenciales-logaritmos/` (la escalera de la base: sumar logaritmos es multiplicar, la inversa reflejada, ecuaciones con el dominio y el cultivo contra t²; 22 casos verificados aparte)».
