# Etapa 5: decisiones (19 nov 2026)

**Gerson delegó el criterio** (19 nov): las propuestas no esperan su visto bueno. Cada propuesta termina en
«Decisiones tomadas (Gerson revisa después)» con la opción elegida, el motivo y la alternativa descartada, y la sesión
siguió con esa opción. Gerson revisa todo después (ideas, ejercicios y exámenes) como control de calidad. Valen todas las
decisiones generales de `docs/etapa2/`, `docs/etapa3/` y `docs/etapa4/decisiones.md`.

## Las diez unidades (ocho del árbol; dos nacieron al partir)

| Unidad | Ideas | Práctica nueva | Estado |
| --- | --- | --- | --- |
| aritmetica.divisibilidad | 6 | divisibilidad-restos | calidad 2 |
| trigonometria.angulo-trigonometrico | 5 | trig-sistemas-angulares | calidad 2 |
| quimica.tabla-periodica (partida) | 4 | tabla-ubicacion | calidad 2 |
| quimica.propiedades-periodicas (nueva) | 4 | propiedades-tabla | calidad 2 |
| razonamiento-verbal.definiciones | 5 | definiciones | calidad 2 |
| algebra.polinomios | 6 | polinomios-practica | calidad 2 |
| geometria.congruencia | 6 | geo-congruencia | calidad 2 |
| razonamiento-matematico.ordenamiento-de-informacion | 6 | rm-ordenamiento | calidad 2 |
| fisica.movimiento-parabolico-y-circular (partida: «Movimiento parabólico») | 5 | fis-parabolico | calidad 2 |
| fisica.movimiento-circular (nueva) | 6 | los nueve circular-* por idea | calidad 2 |

Cada una pasó: propuesta, idea 1 revisada por la sesión en capturas, resto de ideas con 15 ejemplos, práctica por idea,
dos lectores en frío (solo capturas), un auditor con código que rehízo todas las cuentas por otro camino, y
correcciones con su prueba. Informes en `rutinas/auditoria/<unidad>.md` y `rutinas/frio/<unidad>.md`.

## Decisiones generales de la etapa
- **Partir unidades:** Tabla periódica (8 ideas) → Tabla periódica + Propiedades periódicas (`partidoTP`); Movimiento
  parabólico y circular (11 ideas) → Movimiento parabólico + Movimiento circular (`partidoPC`). El avance se migra.
- **Validador de calidad 2** (`nucleo/teoria-reglas.js`, `herramientas/papel-reglas.js`,
  `docs/metodo/unidad/reglas-validador.md`): once reglas de teoría y tres de papel sacadas de las auditorías. Una
  alternativa cuenta como nombrada por su letra **o por su valor** (la decisión de la etapa 3 sobre puntos A, B, C manda).
- **Papel de escenas compartidas:** cada problema dice de qué unidad es (`unidades`), para que el repaso no mezcle temas.
- **App:** el contador de «Juega» dice qué falta sin «llevas»; la alternativa elegida va en tinta (no en el violeta de la
  marca); los superíndices se dibujan con `<sup>`; la comilla de apertura no se separa del término del glosario;
  herramienta `herramientas/ecuaciones-ancho.js` (ninguna ecuación se sale a 390 px).
- **Prueba del curso:** todas las formas ya tenían 10 pares: los ítems nuevos de esta etapa van a la reserva
  (ari-31/32, tri-11, qui-18/19, pp-01/02, cg-03/04, rm-20/21, fis-23 a 26).

## Para que Gerson mire primero (decididas por la sesión)
Cada propuesta y cada auditoría tiene su lista completa. Las que más cambian lo que ve el alumno:
1. **Divisibilidad:** los restos con varios divisores y la inclusión-exclusión van a MCD y MCM (9 de 15 preguntas de San
   Marcos del tema); el múltiplo con circulito (7̊ + 3); el título de la idea 6 pasa a «Dos clases de monedas, pago justo».
2. **Ángulo trigonométrico:** idea nueva «S, C y R: fórmula general» y el radián en 4.º lugar; los coterminales salen como
   tema; Predice del radián sin «2·π·radio» en sus datos (contradice la §4 de la propuesta).
3. **Tabla periódica:** la idea 1 cuenta desde el gas noble sin configuración; Predice del yodo pide periodo y electrones
   de valencia; radios de Clementi (calculados) en vez de covalentes; la moneda de un sol no se nombra (sin fuente).
4. **Definiciones:** el formato UNI (definición + cinco palabras) es una hipótesis: no hay examen de verbal UNI en el
   repo; «definición negativa» sin `simple`; Ilave → Lampa.
5. **Polinomios:** el juego de multiplicar es (2x + a)(x + b), no el de la propuesta; xᵐ·xⁿ va en los datos de Predice.
6. **Congruencia:** idea nueva «Lados y ángulos correspondientes» (11 de 20 preguntas de San Marcos); «circunferencia»,
   «radio», «diámetro» y «paralelogramo» siguen en este glosario hasta mudarlos.
7. **Ordenamiento:** tres ideas nuevas (pisos y llegadas, comparaciones, sumas y diferencias); la fila se ve de espaldas;
   los tipos heredados de Deductivo (parentesco «orden» y «edades») conviene reescribirlos o sacarlos.
8. **Movimiento circular:** no pide Ángulo trigonométrico (dice «si llevaste Trigonometría…»); «vueltas/s²» con su dato;
   T y t en el mismo turquesa (las dos son tiempo).
9. **Dibujos de prueba** que los lectores no reconocieron o que se ven flojos: la bolsita que parece botella
   (`arit-puesto`), la tapa rosca, el caballo como óvalo, la licuadora como disco, los uñeros cortados del diccionario.
