# Rutina de física B: reporte

Rama `rutina/fisica-b`, sacada de `claude/awesome-wozniak-5etl1n`. Unidades de 5.º de electricidad, magnetismo y física moderna, en este orden: electrostática, magnetismo, inducción, física moderna y ondas electromagnéticas. Cada plantilla sigue el método de `docs/metodo/`: constructor, verificador independiente con `entradas.py`, revisor de contenido y correcciones devueltas al mismo constructor.

**Ojo para la integración:** `rutinas/fisica.md` (rama `rutina/fisica`) todavía pone electrostática y ondas en su lista. Electrostática ya la hice aquí; hay que avisarle a esa rutina que no la repita.

## 7 nov 2026 · Electrostática: cargas que se empujan (`plantillas/electrostatica/`)

### Qué hice

Escena «Cargas que se empujan: Coulomb, campo y potencial» para la unidad `fisica.electrostatica`. La idea central es que las dos fuerzas de Coulomb son siempre iguales y opuestas, aunque las cargas se dibujen de distinto tamaño. Además, el campo de una carga existe en todo el plano, haya o no carga de prueba, y el potencial (un número con signo) se separa del campo (una flecha).

- **Motor** (`MotorElectrostatica`, cabecera hasta la línea 50). Calcula:
  - Coulomb, el cambio de distancia y la superposición por componentes.
  - Campo, potencial y la carga de prueba (F = q₀E).
  - El trabajo, que no depende del camino (`trabajoCamino`).
  - Las esferas colgadas, buscando el equilibrio por bisección con hilos de largo L.
  - El campo uniforme con su trayectoria.
  - La capacidad de placas y el condensador sin carga.
  - Serie, paralelo y energía.
  - El contacto entre esferas conductoras.
  - Para el dibujo: el mapa de campo y las equipotenciales.
  - Unidades: serie, paralelo y energía en µF, µC y µJ; `capacidad` y `cambioPlacas` en SI y en pF.
- **Paso a paso** (8 pasos, los 8 con predicción que bloquea): ¿quién empuja más?, esferas colgadas con q y 2q, distancia doble, superposición 3-4-5, la carga de prueba que cambia de signo, el punto medio entre +q y −q, el trabajo por otro camino y condensadores en serie.
- **¿Qué pasa si…?** (5 experimentos, con pastillas bloqueadas): carga negativa entre placas, dos cargas iguales y su punto medio, condensador sin carga, placas más separadas y dos esferas que se tocan.
- **Papel:** 10 problemas propios con pasos.

### Pruebas

- 22 casos en `casos.json` (los 10 del informe más 12 propios) y 46 pruebas en `motor.test.js`, con propiedades al azar:
  - tercera ley;
  - E = −∇V comparado con una derivada numérica;
  - el trabajo no depende del camino;
  - tan θ = F/(mg);
  - C no depende de Q;
  - el contacto conserva la carga e iguala potenciales.
- `npm test`: 1970 pasan y 2 fallan, `catalogo.test.js` y `app.test.js`. Es lo esperado hasta que se integre.
- Playwright a 390×844 y 1366×768, en claro y oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes.
  - En el celular, el lienzo sube a la vista al responder.
  - El dedo desplaza la página si toca lejos de lo arrastrable (radio de unos 40 px).

### Subagentes y lo que corrigieron

- **Verificador independiente:** recalculó los 22 casos con fracciones, por otros caminos y sin leer el motor. No encontró discrepancias numéricas. Pidió corregir la cabecera del motor, que decía µF/µC en funciones que en realidad trabajan en SI, y documentar los errores que no tenían definición escrita.
- **Revisor:** no encontró nada grave. Corregido:
  - EL7 pasó de 'documentado' a 'parcial': el informe dice que acierta 1 de cada 8, pero no cuántos responden C = 0.
  - Faltaba la masa en el experimento 1.
  - «La carga se mueve con las flechas del campo» cambió a «la fuerza apunta como las flechas».
  - Dibujo de las esferas: el peso y F ahora se ven del mismo largo, y hay una raya para r.
  - «El ángulo lo decide la masa» quedó precisado.
  - Rótulos que se encimaban a 390 px en el paso 5 y en las placas.
  - Bajos: frase sobre el tamaño del disco (es la carga, no la fuerza), rótulo de q y ΔU en color en el paso 7, recta V = 0 discontinua, &nbsp; alrededor de «=», textos del paso 8 y del contacto.
  - U claro pasó a #2a7638 porque el chip estaba en 4,499.
- **Agregado por la revisión:** la predicción del paso 7, «¿cambia W por un camino más largo?». La correcta es que da lo mismo; los tres distractores son hipótesis.

### Predicciones y respaldo

- **Documentado:**
  - EL1 (cerca del 46 % de 133) y EL2 (cerca del 32 %) en «¿quién empuja más?».
  - EL3 (cerca del 57 % y del 19 %) en las esferas.
  - EL4 (cerca del 76 %) en la carga de prueba.
- **Parcial:** EL5 (el 45 % habla de cuánta fuerza, no de su sentido), EL7 y EL8.
- **Hipótesis:** 1/r en vez de 1/r², sumar fuerzas como números, «todo se anula» en el punto medio, sumar capacidades en serie, el camino largo y el lado del desvío entre placas.

### Colores

| Variable | Claro | Oscuro | Contraste claro (papel / chip) |
| --- | --- | --- | --- |
| q, Q carga | #a05200 | #f0a04a | AA |
| F fuerza | #1f5fbf | #7cb0ff | AA (el azul de I en circuitos) |
| E campo | #0f766e | #5ed9c8 | AA (el turquesa de R en circuitos) |
| V potencial | #b3246b | #ff86bd | AA (el magenta de V en circuitos) |
| r, d distancia | #5c531f | #fdf2b4 | AA (nunca salen juntas) |
| θ ángulo | #a10fbf | #cf6bfa | AA |
| W trabajo | #7a1010 | #ff5e4d | AA |
| C capacidad | #3328c4 | #9f9bff | AA |
| U energía | #2a7638 | #7fd67f | 5,3 / 4,7 |

- ΔE00 mínimo entre los colores que salen juntos:
  - q-F-r-θ: 21,9 en claro y 24,5 en oscuro.
  - q-E-F-r-V-W: 21,9 / 24,5 (el mínimo es q–r).
  - C-q-V-U: 28,9 / 26,2.
- Pares cercanos que nunca salen juntos: F–C (12,1 en oscuro), θ–C, E–U y V–θ.
- El signo de la carga no tiene color propio: el disco lleva el tono de q con el + o el − escrito en tinta.

### Pendiente

- Faltan en la escena: dieléctricos (el motor admite κ), la polarización de un aislante (EL6) y el imán con una carga quieta (EL9, mejor en magnetismo).
- `trabajoCamino` no tiene caso en `casos.json`; solo lo cubre una propiedad al azar.
- En el paso 7, el camino punteado se encima con las equipotenciales sobre los arcos.
- En el celular, sin movimiento reducido, el desplazamiento suave del paso 7 tarda unos 450 ms, más que los 380 ms de la animación. Es el comportamiento de `nucleo/celular.js` y no lo toqué.
- Las cifras del informe están por verificar con los PDF.

### Pedidos para la integración

- `catalogo/cursos/fisica.json`: en `fisica.electrostatica`, `"plantillas": ["electrostatica"]`. Luego `npm run catalogo` y subir `VERSION` en `app/sw.js`.
- `docs/diseno.md`, variables de electrostática (`plantillas/electrostatica/`):
  - carga q `--c-q` naranja (#a05200, oscuro #f0a04a);
  - fuerza F `--c-F` azul (#1f5fbf, oscuro #7cb0ff);
  - campo E `--c-E` turquesa (#0f766e, oscuro #5ed9c8);
  - potencial V `--c-V` magenta (#b3246b, oscuro #ff86bd), el de circuitos;
  - distancia r y d `--c-r` oliva (#5c531f, oscuro #fdf2b4);
  - ángulo θ violeta (#a10fbf, oscuro #cf6bfa);
  - trabajo W granate (#7a1010, oscuro #ff5e4d);
  - capacidad C índigo (#3328c4, oscuro #9f9bff);
  - energía U verde (#2a7638, oscuro #7fd67f);
  - el signo de la carga va escrito, sin color.
- `docs/pendientes.md`, línea propuesta: «**Electrostática** (`plantillas/electrostatica/`, rutina de física B, 7 nov 2026): cargas que se empujan (las dos fuerzas siempre iguales, esferas colgadas con q y 2q, 1/r², superposición, campo visible sin carga de prueba, carga de prueba que cambia de signo, punto medio con E y V separados, trabajo que no depende del camino, condensadores en serie, placas, Q = 0 con C ≠ 0 y contacto); 22 casos verificados aparte; 10 de papel; 8 predicciones y 5 «¿qué pasa si…?». Documentados: EL1 a EL4; parciales: EL5, EL7 y EL8. Falta: dieléctricos, EL6 y EL9. Sin ítems en el banco de física.»
- `CLAUDE.md`: agregar «las cargas que se empujan» a la lista de plantillas y una línea de historia: «Electrostática (7 nov 2026, rutina de física B): `plantillas/electrostatica/` (cargas que se empujan: Coulomb con las dos flechas iguales, esferas colgadas, superposición, campo y potencial por separado, trabajo, condensadores y contacto; 22 casos verificados aparte).»
- Banco de física (`catalogo/pruebas/fisica.json`): caben ítems de electrostática, por ejemplo q y 2q colgadas, o el punto medio entre +q y −q.
