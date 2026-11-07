# Rutina de física B: reporte

Rama `rutina/fisica-b`, sacada de `claude/awesome-wozniak-5etl1n`. Unidades de 5.º de electricidad, magnetismo y física moderna, en este orden: electrostática, magnetismo, inducción, física moderna y ondas electromagnéticas. Cada plantilla sigue el método de `docs/metodo/`: constructor, verificador independiente con `entradas.py`, revisor de contenido y correcciones devueltas al mismo constructor.

**Ojo para la integración:** `rutinas/fisica.md` (rama `rutina/fisica`) todavía pone electrostática y ondas en su lista. Electrostática ya la hice aquí; hay que avisarle a esa rutina que no la repita.

## 7 nov 2026 · Magnetismo: imanes, cables y cargas (`plantillas/magnetismo/`)

### Qué hice

Escena «Imanes, cables y cargas: campo y fuerza magnética» para la unidad `fisica.magnetismo`. La idea central:
- La fuerza magnética es perpendicular a v y a B, y por eso la carga gira en un círculo con rapidez constante.
- Una carga quieta, o que se mueve paralela al campo, no siente fuerza.
- El campo de un hilo da vueltas alrededor de él y baja como 1/r.
- Entre corrientes opuestas, los campos se suman.
- Dos cables se hacen fuerzas iguales, aunque lleven corrientes distintas.

**Motor** (`MotorMagnetismo`, cabecera hasta la línea 84):
- Fuerza sobre una carga: q·v×B en 3D.
- Movimiento circular y hélice, con la trayectoria exacta.
- Campos: hilo, superposición de hilos, espira y solenoide, y la brújula.
- Fuerza sobre un conductor y entre cables paralelos.
- Líneas de un imán de dos polos, solo para dibujar.
- Unidades SI, μ₀/2π = 2 × 10⁻⁷ y senos notables exactos.

**Vistas:**
- El imán con sus líneas.
- De frente, con la notación ⊙/⊗.
- En perspectiva con los tres ejes: se arrastra la punta de v o del cable, la vista se gira con botones y F lleva escuadras de 90°.
- Cables con brújulas.
- El solenoide de costado.

**Paso a paso** (8 pasos, los 8 con predicción):
1. Imán y protón quieto.
2. Protón que entra contra B.
3. v ⊥ B con la mano derecha.
4. v a 37° de la horizontal, con B vertical.
5. El electrón.
6. El hilo al doble de distancia.
7. El punto medio entre corrientes opuestas.
8. Cables de 10 A y 20 A.

**¿Qué pasa si…?** (5 experimentos): el doble de rapidez, el cable girado a 30°, una corriente invertida, el solenoide con el doble de n y las brújulas de Oersted con 100 A.

**Papel:** 10 problemas propios, y la indicación solo trae fórmulas.

### Pruebas

- 21 casos en `casos.json` y 44 pruebas del motor. Propiedades con un cálculo independiente:
  - F perpendicular a v y a B;
  - la trayectoria contra RK4;
  - T no depende de v;
  - Ampère por un círculo y por un cuadrado;
  - la espira contra Biot–Savart;
  - las brújulas tangentes al campo;
  - las líneas del imán siguen el campo.
- `npm test`: 2410 pasan y 2 fallan, `catalogo.test.js` y `app.test.js`. Es lo esperado hasta que se integre.
- Playwright en 390×844 y 1366×768, en claro y oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes.
  - El revisor arrastró con eventos táctiles reales.
  - Si el dedo toca lejos de lo arrastrable, la página se desplaza.

### Subagentes y lo que corrigieron

- **Verificador independiente:** recalculó los 21 casos y sus variantes sin leer el motor, con fracciones exactas. La fuerza la sacó con el módulo y el sentido por determinante, y la trayectoria por geometría. No hubo ninguna discrepancia. Pidió aclarar en la cabecera:
  - que `perpendicular` significa que F es perpendicular a v y a B;
  - las unidades de los errores del periodo (en segundos) y del solenoide (en Bpi).
- **Revisor de contenido:** no encontró nada grave. Lo corregido:
  - En el experimento 1 en el celular, la F del protón 2 pisaba al protón 1: ahora arranca arriba de su círculo.
  - El paso 1, opción A, no calzaba con MG1 tal como lo describe el informe.
  - La lectura 3D dice «hacia +z» y la leyenda «z sale hacia ti».
  - La indicación del papel regalaba los pasos 1, 2 y 8.
  - Las brújulas pasaron de 10 A a 100 A, porque con 10 A el campo era menor que el de la Tierra.
  - Se rehízo la explicación del experimento 3.
  - Bajos: «F = 0» en el paso 4, la leyenda y la precisión del radio del electrón, la flecha I visible, la circunferencia que pasa por P dibujada en vivo, líneas del imán también desde S, la cita de la mano derecha invertida y el subtítulo.
- **De la integración** (conversación principal): el título y el subtítulo son preguntas neutras, y los pasos bloqueados se anuncian como «Paso N, bloqueado».

### Predicciones y respaldo

- **Documentado:**
  - MG1: un imán atrae a una carga quieta. Cerca de 4 de cada 10 aciertan después del curso.
  - MG5: entre corrientes opuestas, «se anulan». Cerca de 4 de cada 10 aciertan, sin mejora con el curso.
- **Parcial:** MG2 (se frena, o la fuerza va en la dirección del campo), MG3 (el ángulo con la horizontal), MG4 (corrientes opuestas se atraen), MG6 (más corriente empuja más), EL9 (el polo como una carga) y la mano derecha invertida.
- **Hipótesis:** 1/d² en el hilo, olvidar el seno, olvidar el signo del electrón y los distractores de los experimentos.

### Colores

| Variable | Claro | Oscuro | Nota |
| --- | --- | --- | --- |
| q carga | #a05200 | #f0a04a | el de electrostática |
| F fuerza | #1f5fbf | #7cb0ff | el de electrostática |
| d, r, R, L longitudes | #5c531f | #fdf2b4 | el de electrostática |
| θ ángulo | #a10fbf | #cf6bfa | el de electrostática |
| v velocidad | #c0364a | #f17384 | el de MRUV; claro con 5,11 sobre el papel y 4,56 sobre el chip |
| B campo magnético | #2a7638 | #7fd67f | nuevo; distinto del turquesa de E |
| I corriente | #7a1010 | #ff5e4d | nuevo; el azul de circuitos ya es F |

- ΔE00 mínimo entre los que salen juntos: 21,1 en claro y 21,9 en oscuro, entre B y las longitudes.
- v e I quedan cerca (18,0 en claro y 12,9 en oscuro), pero nunca comparten pantalla: la vista 3D muestra v o el cable, no los dos.
- Todos pasan AA sobre el papel y sobre el chip.
- Van en tinta o gris: m, T, n, los polos N y S, las brújulas, los ejes y las trayectorias.
- **Para Gerson:** B usa el mismo verde que U en electrostática, e I el mismo granate que W. Nunca se cruzan, pero el sistema queda con un hex para dos variables en plantillas distintas. ¿Se acepta?

### Pendiente

- En el paso 1, B = 0,2 T a 8 cm del polo es alto para un imán de barra; uno de neodimio sí llega. Se dejó así porque el caso 1 lo usa. La respuesta no cambia: F = 0.
- La espira solo está en el motor y el papel, no en la escena.
- El círculo del electrón se dibuja unas 1800 veces más grande que el real, y un rótulo lo dice.
- La letra T nombra el periodo y la unidad tesla en las mismas lecturas del paso 3, como en las academias.
- Las cifras del informe están por verificar con los PDF.

### Pedidos para la integración

- `catalogo/cursos/fisica.json`: en `fisica.magnetismo`, `"plantillas": ["magnetismo"]`. Luego `npm run catalogo` y subir `VERSION` en `app/sw.js`.
- `docs/diseno.md`, variables de magnetismo (`plantillas/magnetismo/`): campo magnético B `--c-B` verde (#2a7638, oscuro #7fd67f), corriente I `--c-I` granate (#7a1010, oscuro #ff5e4d), velocidad v `--c-v` rojo (#c0364a, oscuro #f17384), y carga q, fuerza F, longitudes y θ como en electrostática. Las convenciones ⊙ (sale) y ⊗ (entra) van en el color de B.
- `docs/pendientes.md`, línea propuesta: «**Magnetismo** (`plantillas/magnetismo/`, rutina de física B, 7 nov 2026): imanes, cables y cargas (imán y carga quieta, carga paralela al campo, mano derecha frente a una vista 3D que se gira, ángulo entre v y B, electrón, hilo con 1/r, punto medio entre corrientes opuestas, fuerzas iguales entre cables, radio y periodo, conductor girado, solenoide y Oersted); 21 casos verificados aparte; 10 de papel; 8 predicciones y 5 «¿qué pasa si…?». Documentados: MG1 y MG5; parciales: MG2 a MG4, MG6 y EL9. Falta en la escena la espira (está en el motor y el papel). Sin ítems en el banco de física.»
- `CLAUDE.md`: agregar «imanes, cables y cargas» a la lista de plantillas, y en la historia: «Magnetismo (7 nov 2026, rutina de física B): `plantillas/magnetismo/` (imán y carga quieta, mano derecha en una vista 3D, círculo con rapidez constante, hilo, punto medio entre corrientes, cables paralelos, solenoide y Oersted; 21 casos verificados aparte).»
- Banco de física: candidatos el protón paralelo a B, que sigue recto, y el punto medio entre corrientes opuestas (MG5, documentado).

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
