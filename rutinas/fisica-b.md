# Rutina de física B: reporte

Rama `rutina/fisica-b`, sacada de `claude/awesome-wozniak-5etl1n`. Unidades de 5.º de electricidad, magnetismo y física moderna, en este orden: electrostática, magnetismo, inducción, física moderna y ondas electromagnéticas. Cada plantilla sigue el método de `docs/metodo/`: constructor, verificador independiente con `entradas.py`, revisor de contenido y correcciones devueltas al mismo constructor.

**Ya resuelto:** la conversación principal le avisó a la rutina de física que la electricidad es de esta rama.

## 7 nov 2026 · Banco de física: fis-11 a fis-15 en reserva (pedido de la principal)

### Qué hice
- 5 pares A/B nuevos en la `reserva` de `catalogo/pruebas/fisica.json`, uno por escena. Siguen en reserva porque el tope es de 10 ítems por forma.
- Un verificador por par en `catalogo/pruebas/verificar.js`; cada uno saca la respuesta y los distractores del motor de su escena.
- El banco pasa a la versión 1.2.0. Se agregaron el informe de ondas electromagnéticas y 15 códigos de error, con el mismo respaldo que tienen en su escena.
- Toca `catalogo/`, que esta rutina no suele tocar. Lo hice porque la principal lo pidió explícitamente.

### Pares y unidades

| Par | Escena | Unidad | Qué pide | A / B | Códigos (respaldo) |
| --- | --- | --- | --- | --- | --- |
| fis-11 | electrostatica | `fisica.electrostatica` | Carga final de la esfera chica cuando toca a una grande y las dos ya tenían carga (reparto por radios) | 120 nC / 100 nC | EL8 se reparte por igual (parcial), la chica se queda con más y toda pasa a la grande (hipótesis) |
| fis-12 | magnetismo | `fisica.magnetismo` | Campo en el punto medio de dos cables con corrientes opuestas (A: 30 cm y 45 A; B: batería de auto, 50 cm y 100 A) | 120 µT / 160 µT | MG5 opuestas se anulan (documentado), usa la distancia entre cables y 1/d² (hipótesis) |
| fis-13 | induccion | `fisica.induccion-electromagnetica` | Un electroimán que se apaga frente a una espira: sentido de la corriente vista desde detrás de la espira, y el campo inducido. A: cara norte; B: cara sur | antihoraria, alejándose / horaria, hacia el electroimán | MG8–MG9 contra el campo (documentado), mano derecha invertida y no circula (parcial) |
| fis-14 | fisica-moderna | `fisica.fisica-moderna` | ¿Cuál de dos luces arranca electrones: una intensa bajo el umbral u otra tenue sobre él? | solo la violeta / solo la verde | FM2 basta subir la intensidad (documentado), la intensidad compensa (parcial), intensidad mínima (hipótesis) |
| fis-15 | ondas-electromagneticas | `fisica.ondas-electromagneticas` | Rapidez, λ y color de una luz dentro de un medio, dada su frecuencia (A: diamante, n = 2,5; B: líquido, n = 1,25) | 1,2 × 10⁸ m/s, 160 nm, sigue violeta / 2,4 × 10⁸ m/s, 400 nm, sigue verde | OE12 (dos variantes) y la luz siempre va a c (hipótesis) |

### Revisiones
- **Constructor:** al principio había dos parecidos y los rehízo. fis-11 calcaba palabras de la escena de las esferas, y fis-15 era casi el p8 del papel.
- **Revisor a ciegas:** las 10 claves eran correctas y no había nada grave. Lo corregido:
  - fis-11: las cargas pasaron de µC a nC, porque con µC el aire se rompería.
  - fis-12: la lámpara de 9 A no era realista y el distractor 1/d² daba 500 mT, que se descarta solo por tamaño. Ahora son cables gruesos y los valores van en µT.
  - fis-12: una variante del error de la distancia da siempre el mismo número que «contar un solo cable»; lo aclaré en su descripción.
  - fis-13 A: copiaba la configuración y la respuesta del paso 5 de la escena. Ahora las dos formas se miran desde detrás de la espira.
  - La letra de la correcta ya no coincide entre A y B en 4 de los 5 pares.
- **Desvío en fis-12 A:** con 40 cm y 60 A, un distractor repetía la corriente del enunciado. Quedó en 30 cm y 45 A.

### Notas para el análisis
- fis-13: el código «no circula» se midió con un imán que se mueve. Aquí nada se mueve, así que puede atraer por otra idea: «sin movimiento no hay inducción».
- fis-14 repite el patrón de la escena (la luz tenue es la que arranca electrones). Es transferencia cercana válida y cae igual en las dos formas.
- fis-15 A: el distractor de color dice «pasa a ultravioleta» y suena más extremo que el de B.
- La escena de electrostática usa µC en el contacto de esferas (12 µC en 1 cm), que físicamente es imposible. Es la convención de academia; queda como pendiente de la escena, sin cambio.

### Pruebas
- `node --test catalogo/pruebas/pruebas.test.js`: 61 de 62. Solo falla «app/datos/pruebas.json está al día», que se arregla con `npm run catalogo`.
- `parecidos.js`: ningún parecido. Quedan 5 avisos de «comparte 3 códigos con la predicción que imita», que es lo esperado; revisé a mano que la situación es otra.

### Pedidos
- `npm run catalogo`. Los pares quedan en reserva hasta que se arme la forma del piloto.

## 7 nov 2026 · Ondas electromagnéticas: la antena y el arcoíris (`plantillas/ondas-electromagneticas/`)

### Qué hice

La principal pidió dos cosas: primero un informe y después una escena corta. Las dos están hechas.

**Informe nuevo:** `docs/investigacion/ondas-electromagneticas-ideas-erroneas.md`, con los errores OE1 a OE20.
- La red no dejó abrir ningún artículo completo. Todo sale de resúmenes, fragmentos o notas docentes, y el informe lo avisa arriba.
- Solo OE6 tiene cifra («se ven objetos solo con UV»: cerca de 8 de cada 10 de 283 escolares).
- OE1 a OE5 y OE7 a OE11 son parciales. Bajé OE5 a parcial porque su 30 % no trae muestra.
- OE12 a OE20 son hipótesis nuestras.

**Escena:** «La antena y el arcoíris: ondas electromagnéticas», unidad `fisica.ondas-electromagneticas`. La idea central:
- Una onda electromagnética es un campo eléctrico y un campo magnético que oscilan juntos, en fase, perpendiculares entre sí y al avance.
- En el vacío todas viajan a c.
- Lo que cambia de una a otra es f, y con ella λ y la energía del fotón: en el espectro las tres van en una sola regla, como en física moderna.
- En un medio cambian v y λ, pero no f.
- Qué atraviesa qué depende de la frecuencia y del material.

**Motor** (`MotorOndasEM`, cabecera hasta la línea 113):
- conversión entre frecuencia y longitud de onda, y las regiones del espectro;
- fotón;
- campos y la dirección de B;
- tiempo de viaje y eco;
- medio con índice n;
- tabla de qué atraviesa qué (simplificada, y la escena lo dice);
- lectura de la expresión de la onda (`leerOnda`) e intensidad;
- si una radiación ioniza.

**Notación:** el campo eléctrico va sin letra (escrito «campo eléctrico», en azul), porque la E es la energía del fotón, como en física moderna. Una nota dice que en los libros y en el examen se escribe E₀ = c·B₀.

**Paso a paso** (7 pasos, todos con predicción; las correctas van C A B D B A C):
1. La radio y el foco hacia la Luna.
2. ¿Cómo oscila B?
3. El espectro ordenado por frecuencia.
4. λ de una emisora de FM.
5. La radio cruza una pared y la luz no.
6. Luz de 600 nm al entrar al agua.
7. Leer la expresión de la onda.

**¿Qué pasa si…?** (4): la emisora más potente, el Sol que se apaga, la puerta del horno y B₀ a partir del campo eléctrico.

**Papel:** 10 problemas propios, entre ellos uno de intensidad y uno de leer la onda.

**Celular:** botones para saltar a radio FM, microondas, rojo, verde, violeta, ultravioleta y rayos X.

### Pruebas

- 23 casos y 42 pruebas del motor.
- `npm test`: 3539 en verde; fallan solo las 2 de catálogo, como se espera.
- `pasada-celular.py`: no marca nada pendiente (QUEDA).
- Playwright a 390×844 y 1366×768, en claro y oscuro, con y sin movimiento reducido, revisado por el constructor y el revisor:
  - sin errores de consola ni desbordes;
  - con la predicción pendiente, el banco del celular mide 330 px o menos;
  - el dedo sobre el dibujo desplaza la página (probado con toque real).

### Subagentes y lo que corrigieron

- **Informe:** lo escribió un subagente de investigación; yo bajé OE5 a parcial.
- **Verificador independiente**, dos vueltas:
  - Primera: 124 de 124 campos coinciden. Dos nombres de caso estaban mal (600 nm es naranja; 1 mm todavía es infrarrojo) y ya están corregidos.
  - Segunda, tras la revisión: la tabla nueva, `leerOnda` e intensidad. Coinciden los 31 campos.
- **Revisor, graves:**
  - La tabla de qué atraviesa qué afirmaba de más. Ahora la rejilla deja pasar el infrarrojo; el vidrio frena parte del ultravioleta; el hueso absorbe mucho más los rayos X, pero no todos; la piel deja pasar algo de luz roja.
  - En el paso 6, «se ve naranja bajo el agua» chocaba con que en lo hondo todo se ve azulado; ahora se explica.
  - En el paso 2, la perspectiva hacía ver B desfasado (justo el error OE14). Bajó el sesgo, se marca una cresta y hay un rótulo «hacia ti».
- **Revisor, medios:**
  - El enunciado del paso 5 tenía una salida defendible por las ventanas; ahora es un cuarto sin ventanas.
  - La escala decía «de 10 en 10»; en realidad es ×10 000 por marca.
  - Citas sin cifras de más, y la rejilla del horno explicada como onda, no como objeto.
  - Nota de E₀ = c·B₀.
  - En el celular, el enunciado ya no queda tapado.
- **Veredicto del revisor:** así como estaba era delgada y repetía física moderna. Por eso se agregó el paso 7, lo que el examen sí pregunta: leer E₀ sen(kx − ωt) para sacar λ, f, la región y la dirección de B, más la intensidad en el motor y el papel. Con eso se queda como plantilla propia.

### Predicciones y respaldo

- No hay ninguna documentada: OE6 no entró en ninguna predicción.
- **Parcial:** OE1 a OE5 (la radio no es luz, rapideces distintas, v crece con f, energía con la amplitud, necesita un medio), OE4 en la emisora potente y OE9 en el horno.
- **Hipótesis:** OE12 a OE20 y los errores de la lectura de la onda (λ = k, λ = 1/k, λ = k/2π).
- Todas las citas llevan «por verificar».

### Colores

| Variable | Claro | Oscuro | Nota |
| --- | --- | --- | --- |
| λ | #0d6b78 | #24e4f9 | como en física moderna |
| f | #5c531f | #fdf2b4 | como en física moderna |
| E energía del fotón | #a55412 | #ffa64d | como en física moderna |
| campo eléctrico (sin letra) | #1f5fbf | #7cb0ff | el azul de F; el turquesa de E en electrostática quedaba a ΔE00 ≈ 10 de λ |
| B | #2a7638 | #7fd67f | como en magnetismo |
| c y v rapidez | #c0364a | #f17384 | el rojo de v |
| n índice | #7614b8 | #aa74fb | el violeta de P en física moderna (nunca salen juntos) |

- ΔE00 mínimo: 21,1 en claro y 21,9 en oscuro, entre f y B.
- Contraste AA en todos. El más justo es c/v en claro: 4,56 sobre su chip.
- El color de la luz va solo en banda translúcida (alfa 0,34; 0,25 en oscuro). Las ondas van en tinta.

### Pendiente

- En el paso 2, la perspectiva todavía corre un poco las crestas de B respecto de las del campo eléctrico. La cresta marcada muestra que salen juntas.
- La tabla de qué atraviesa qué es simplificada.
- Las cifras del informe salen de resúmenes. Para leer los artículos completos habría que permitir esos dominios en la red de la sesión.
- No hay datos peruanos ni latinoamericanos.

### Pedidos para la integración

- `catalogo/cursos/fisica.json`: en `fisica.ondas-electromagneticas`, poner `"plantillas": ["ondas-electromagneticas"]` y `"investigacion": "docs/investigacion/ondas-electromagneticas-ideas-erroneas.md"`. Luego `npm run catalogo` y subir `VERSION` en `app/sw.js`.
- `docs/diseno.md`: variables de ondas electromagnéticas (`plantillas/ondas-electromagneticas/`).
  - λ, f y la energía del fotón E como en física moderna.
  - El campo eléctrico sin letra, en el azul de F (#1f5fbf, oscuro #7cb0ff), porque E es la energía del fotón.
  - B como en magnetismo.
  - c y v en el rojo de v.
  - El índice n en el violeta de P (#7614b8, oscuro #aa74fb).
- `docs/pendientes.md`, línea propuesta: «**Ondas electromagnéticas** (`plantillas/ondas-electromagneticas/`, rutina de física B, 7 nov 2026): la antena y el arcoíris (todas a c en el vacío, campo eléctrico y B en fase y perpendiculares, espectro en una sola regla con λ, f y energía del fotón, FM de 100 MHz, qué atraviesa qué, luz que entra al agua, leer E₀ sen(kx − ωt) e intensidad); 23 casos verificados aparte en dos vueltas; 10 de papel; 7 predicciones y 4 «¿qué pasa si…?». Informe nuevo `docs/investigacion/ondas-electromagneticas-ideas-erroneas.md` (OE1 a OE20, desde resúmenes, por verificar). Nada documentado. Sin ítems en el banco de física.»
- `CLAUDE.md`:
  - Agregar «la antena y el arcoíris» a la lista de plantillas.
  - Historia: «Ondas electromagnéticas (7 nov 2026, rutina de física B): `plantillas/ondas-electromagneticas/` (la antena y el arcoíris: todas a c, campos en fase y perpendiculares, espectro, qué atraviesa qué, cambio de medio y lectura de la onda; 23 casos verificados aparte) e informe `docs/investigacion/ondas-electromagneticas-ideas-erroneas.md`.»

## 7 nov 2026 · Física moderna: la lámpara y la placa (`plantillas/fisica-moderna/`)

### Qué hice

Escena «La lámpara y la placa: fotones y efecto fotoeléctrico» para la unidad `fisica.fisica-moderna`. Relatividad queda fuera: es solo de San Marcos. La idea central:
- La luz llega en paquetes de energía hf = hc/λ.
- La frecuencia decide si sale un electrón y con cuánta energía máxima: Kmax = hf − φ, una recta con pendiente h y corte en f₀.
- La intensidad decide cuántos fotones llegan, y con eso cuántos electrones salen por segundo, que es la corriente de saturación.
- La pila solo acelera o frena a los electrones que ya salieron (V₀ = Kmax/e).
- Bajo la frecuencia umbral no hay corriente, con ninguna intensidad ni voltaje.

**Motor** (`MotorFisicaModerna`, cabecera hasta la línea 104). Usa dos juegos de constantes: «eV» con hc = 1240 eV·nm, y «SI» con h = 6,6 × 10⁻³⁴ J·s. Calcula:
- el fotón y el efecto fotoeléctrico;
- el fototubo con su curva I–V, un modelo simple que la escena declara como tal;
- el viaje de cada electrón;
- fotones por segundo;
- Bohr, con transiciones y la serie de Balmer;
- rayos X: λmin y espectro;
- la recta Kmax–f, Wien e incertidumbre;
- el color de la luz, solo para el dibujo.

**El experimento:** deslizadores de λ, intensidad P y voltaje V, con electrones visibles entre las placas. En el paso a paso se habilitan de a poco y solo después de responder, para no adelantar el paso siguiente.

**Paso a paso** (8 pasos, todos con predicción; las correctas van B D A C D A C B):
1. 620 nm con el doble de intensidad.
2. Subir la pila.
3. Kmax y V₀ con 310 nm.
4. El doble de intensidad con 310 nm.
5. La gráfica Kmax–f.
6. Fotones por segundo de un láser.
7. Bohr de 3 a 2.
8. Rayos X a 31 kV.

**¿Qué pasa si…?** (5 experimentos): el zinc, la luz roja intensa contra la azul tenue, la pila al revés, la mitad de λ y el tubo de rayos X de 31 a 62 kV.

**Papel:** 10 problemas propios.

### Pruebas

- 21 casos en `casos.json`.
- 44 pruebas del motor. Una de ellas comprueba que los electrones del dibujo llegan en la misma fracción que la corriente del modelo; otra, que 620 nm se dibuja rojo.
- `npm test`: 3215 pasan; fallan solo las 2 de catálogo, que es lo esperado.
- `herramientas/pasada-celular.py`: no marca QUEDA. La escena usa Celular.dpr, Celular.variable y Celular.bucle.
- Playwright a 390×844 y 1366×768, claro y oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes.
  - El dedo sobre el lienzo desplaza la página, porque no hay nada que arrastrar.
  - Los deslizadores responden al toque y tienen 44 px de alto.

### Subagentes y lo que corrigieron

**Verificador independiente.** Recalculó por otros caminos (E = hf con f = c/λ, Rydberg para Bohr, energía total en 1 s). Coinciden 178 de 180 campos. Las 2 diferencias son convenciones del electrón, ya escritas en la cabecera:
- xMax = null si el electrón llega al colector;
- x = 0 después de volver al cátodo.

**Revisor, grave.** El color de la luz del haz quedaba al lado de colores de variable casi iguales: violeta 405 nm contra P (ΔE00 2,4), cian 490 nm contra λ oscuro, y 620 nm pintado naranja junto a I y E. Lo corregido:
- El color de la luz va solo en la banda translúcida.
- Los fotones, las líneas del espectro y los puntos del láser van en tinta, o con contorno de tinta y relleno al 35 %.
- 620 nm se ve rojo.

**Revisor, medios.**
- FM3 pasa a «parcial», porque su dato es de aciertos.
- La fuente de FM1 en el paso 1 aclara que el dato es de la pregunta del voltaje.
- El paso 7 trae En = −13,6/n² en el enunciado, con un distractor nuevo: «el nivel de llegada», que da 365 nm.
- Pantalla grande: deslizadores en 3 columnas, y el banco se desplaza por dentro si no cabe.
- La curva I–V se declara como «modelo simple».
- En el celular, con la predicción pendiente, el banco mide 311 px como máximo; antes eran unos 400.

**Revisor, bajos:** textos de las fuentes de Bohr y del paso 4, el rótulo −V₀ que se montaba sobre el eje, y los deslizadores a 44 px.

### Predicciones y respaldo

- **Documentado:**
  - FM1, la pila arranca electrones: cerca de 1 de cada 5 acierta, y el error lo comete cerca del 42 % de los que fallan.
  - FM1 en el paso 1 C, con la aclaración de que el dato es de la pregunta del voltaje.
  - FM2, «basta subir la intensidad», en el paso 1 A y el experimento 2 B: lo dice explícito cerca de 1 de cada 20 de los que fallan.
- **Parcial:** FM3, las variantes de FM2 y FM4 en el paso 4, y la variante de FM1 «la pila vence la función trabajo».
- **Hipótesis:** Kmax sin restar φ, mezclar J y eV, los fotones por segundo, Bohr con 1/n y el nivel de llegada, rayos X sin el kilo o sin e, y los distractores de los experimentos.

### Colores

| Variable | Claro | Oscuro | Nota |
| --- | --- | --- | --- |
| λ longitud de onda | #0d6b78 | #24e4f9 | el petróleo de Φ en inducción |
| f frecuencia | #5c531f | #fdf2b4 | el oliva de las longitudes |
| E energía del fotón | #a55412 | #ffa64d | el ocre de ε en inducción |
| φ función trabajo | #1f5fbf | #7cb0ff | el azul de F |
| Kmax | #2a7638 | #7fd67f | el verde de B y U |
| V y V₀ | #b3246b | #ff86bd | el magenta de circuitos |
| I corriente | #6e110c | #f95a24 | el de inducción |
| P intensidad | #7614b8 | #aa74fb | nuevo |

- ΔE00 mínimo entre los que salen juntos: 21,1 en claro (f–Kmax) y 20,6 en oscuro (E–I).
- Todos pasan AA sobre el papel y sobre el chip. Los más justos: E claro con 4,58 y P oscuro con 4,61.
- n, h, N y e van en tinta.
- El color de la luz no es un color de variable: solo va en la banda translúcida, y la leyenda lo dice.

### Pendiente

- Cuerpo negro (Wien) e incertidumbre están solo en el motor y el papel; láser y relatividad quedan fuera de la escena.
- En 1366×768, el banco de los pasos 3 y 4 con la curva I–V mide 12 px más que el espacio; se resuelve con el desplazamiento interno.
- 620 nm se llama «rojo», aunque los punteros reales son de 630 a 650 nm. Se dejó así porque da 2 eV exactos.
- Las cifras del informe están por verificar con los PDF.

### Pedidos para la integración

- `catalogo/cursos/fisica.json`: en `fisica.fisica-moderna`, `"plantillas": ["fisica-moderna"]`. Luego `npm run catalogo` y subir `VERSION` en `app/sw.js`.
- `docs/diseno.md`, variables de física moderna (`plantillas/fisica-moderna/`):
  - λ petróleo (#0d6b78, oscuro #24e4f9);
  - f oliva (#5c531f, oscuro #fdf2b4);
  - energía del fotón E ocre (#a55412, oscuro #ffa64d);
  - función trabajo φ azul (#1f5fbf, oscuro #7cb0ff);
  - Kmax verde (#2a7638, oscuro #7fd67f);
  - V y V₀ magenta;
  - I granate de inducción;
  - intensidad P violeta (#7614b8, oscuro #aa74fb), nuevo.
  - El color de la luz solo va en la banda translúcida del haz; los fotones van en tinta.
- `docs/pendientes.md`, línea propuesta: «**Física moderna** (`plantillas/fisica-moderna/`, rutina de física B, 7 nov 2026): la lámpara y la placa (fotoeléctrico con deslizadores de λ, intensidad y voltaje; intensidad que no arranca electrones, la pila que no los saca, Kmax y potencial de frenado, corriente de saturación, gráfica Kmax–f, fotones por segundo, Bohr con Balmer y rayos X); 21 casos verificados aparte; 10 de papel; 8 predicciones y 5 «¿qué pasa si…?». Documentados: FM1 y FM2; parciales: FM3 y FM4. Falta en la escena: cuerpo negro, láser e incertidumbre (Wien e incertidumbre están en el motor y el papel). Sin ítems en el banco de física.»
- `CLAUDE.md`: agregar «la lámpara y la placa» a la lista de plantillas, y en la historia: «Física moderna (7 nov 2026, rutina de física B): `plantillas/fisica-moderna/` (la lámpara y la placa: fotoeléctrico que el alumno ajusta, intensidad contra frecuencia, potencial de frenado, recta Kmax–f, fotones, Bohr y rayos X; 21 casos verificados aparte).»
- Banco de física: candidato la luz de 620 nm sobre φ = 2,5 eV con el doble de intensidad (FM2, documentado).

## 7 nov 2026 · Inducción: el imán, la espira y el foquito (`plantillas/induccion/`)

### Qué hice

Escena «El imán, la espira y el foquito: inducción electromagnética» para la unidad `fisica.induccion-electromagnetica`. La idea central:
- La fem es la rapidez con que cambia el flujo: la pendiente de Φ(t), no su altura.
- Un imán quieto no induce nada, aunque esté cerca.
- La corriente inducida crea un campo Bᵢ que se opone al cambio del flujo. Al acercar el imán, la bobina lo repele; al alejarlo, lo atrae y Bᵢ refuerza el campo del imán.
- También inducen el cambio de área, el giro de la espira y una barra que se mueve.

**Motor** (`MotorInduccion`, cabecera hasta la línea 105):
- Flujo con el ángulo medido desde la normal o desde el plano.
- Faraday por cambio de campo, de área o de ángulo, también con la espira abierta.
- Lenz: sentido visto desde el imán, cara norte o sur, si repele o atrae.
- Barra: fem BLv, con su fuerza y su potencia.
- Modelo suave del imán, solo para el dibujo y las gráficas Φ(t) y ε(t).
- Generador: pico y valor eficaz.
- Transformador. Con continua da Vs = 0 y Pp = null: no pasa nada por el núcleo y la primaria disipa Vp²/R.

**Paso a paso** (8 pasos, todos con predicción; las correctas van C B D C B A D A):
1. El imán quieto a 3 cm.
2. ¿Cuándo marca más? (la pendiente de Φ).
3. Faraday con números.
4. Lenz al acercar el polo norte.
5. Lenz al alejarlo.
6. La barra en el riel.
7. El generador y el valor eficaz.
8. El transformador.

**¿Qué pasa si…?** (5 experimentos): el doble de rápido, el polo sur, la bobina que gira 60°, el transformador con pila y la bobina cortada.

**Arrastre:** el imán y la barra se arrastran con ratón, dedo y teclado. En los pasos 1 y 2 y en el experimento 1, el imán solo se acerca, para no adelantar el paso 5.

**Papel:** 10 problemas propios; la indicación trae solo fórmulas.

### Pruebas

- 22 casos en `casos.json` y 44 pruebas del motor. Propiedades:
  - Lenz contra Biot–Savart sumado tramo a tramo;
  - ε = −N·dΦ/dt con derivada numérica, y ∫ε dt = −N·ΔΦ;
  - P = F·v = ε·I en la barra;
  - el valor eficaz como raíz del cuadrado medio;
  - el transformador con continua;
  - el pico ×f al ir f veces más rápido;
  - las líneas del imán tangentes al campo.
- `npm test`: 2583 pasan y 2 fallan, las de catálogo, que es lo esperado.
- Playwright en 390×844 y 1366×768, claro y oscuro, con y sin movimiento reducido: sin errores de consola ni desbordes.
  - El revisor arrastró con eventos táctiles reales. El dedo lejos desplaza la página.

### Subagentes y lo que corrigieron

**Verificador independiente:** recalculó los 22 casos a ciegas. Lenz y la barra los sacó por la fuerza q·v×B sobre los portadores, no por el signo de ΔΦ. Todo coincide, con dos diferencias de convención:
- `Pp` con pila: en la revisión pasó de 0 a null. Es el único cambio a `casos.json`, y la verificación lo anota.
- El signo de `errores.anguloConPlano`: se usa el módulo.

**Revisor, graves:**
- Las correctas quedaban casi siempre en la A. Se reordenaron: dos de cada letra.
- En los pasos 1 y 2, alejar el imán mostraba la corriente al revés, la respuesta del paso 5. Ahora el arrastre solo acerca, y hay un botón «Llevar el imán a 15 cm».

**Revisor, medios:**
- Paso 5, opción D: de documentado a parcial.
- Transformador con continua: hipótesis.
- El enunciado de la pila aclara que la primaria tiene resistencia.
- Leyenda del experimento 5 neutra.
- El paso 7 ya no da ε = NBAω sen ωt.
- Los pasos 4 y 5 terminan quietos en el instante de más corriente, con Bᵢ e I visibles.
- Nueva retroalimentación de la C en el paso 2.
- El rótulo «Vs ≠ 0 un instante» ya no se corta.

**Revisor, bajos:**
- Citas de la mano derecha y de MG8.
- `soloPolo` corregido en el motor.
- Regla 4: «polo norte» con palabras, porque N son las vueltas; N y S solo pintados en el imán.
- Un solo instrumento, el amperímetro.
- Vueltas del transformador en razón 4:1.
- Rótulos que se tapaban.

### Predicciones y respaldo

- **Documentado:**
  - MG7 (imán quieto induce): cerca de 1 de cada 4 acierta antes del curso y unos 7 de cada 10 después.
  - MG8 (sentido contrario al alejar): más de un tercio.
- **Parcial:**
  - MG8 al acercar, porque el dato es del imán que se aleja.
  - Paso 5 D (no circula), porque el estudio no dice qué eligieron los demás.
  - MG9 y MG10.
  - Paso 1 D (mencionado en entrevistas).
  - La mano derecha invertida.
  - MG8 decidir solo por el polo o solo por el movimiento.
- **Hipótesis:** olvidar N, multiplicar por R, eficaz entre 2, la razón del transformador invertida, el transformador con continua y el resto de los experimentos.

### Colores

| Variable | Claro | Oscuro | Nota |
| --- | --- | --- | --- |
| B campo del imán | #2a7638 | #7fd67f | el de magnetismo; ⊙ y ⊗ en este color |
| Bᵢ campo inducido | #4a13ae | #7e84fc | nuevo |
| Φ flujo | #0d6b78 | #24e4f9 | nuevo |
| ε fem | #a55412 | #ffa64d | nuevo |
| I corriente | #6e110c | #f95a24 | se corre del de magnetismo (#7a1010/#ff5e4d) para separarse de v; ΔE00 2,4 y 8,3 respecto de aquel |
| v velocidad | #c0364a | #f17384 | el de MRUV |
| F fuerza | #1f5fbf | #7cb0ff | |
| A, L, d medidas | #5c531f | #fdf2b4 | |
| θ ángulo | #a10fbf | #cf6bfa | |
| V voltaje | #b3246b | #ff86bd | el de circuitos |

- ΔE00 mínimo entre los que salen juntos: 20,1 en claro (I–v) y 20,6 en oscuro (I–ε).
- Pares cercanos que nunca comparten pantalla: v–V, Bᵢ–θ, θ–V y Bᵢ–F. En la barra no se dibuja Bᵢ.
- Todos pasan AA sobre el papel y el chip. Los más justos: v claro con 4,56, y Bᵢ e I oscuros con 4,63.

### Pendiente

- El modelo del imán (Φmax = 2 × 10⁻⁴ Wb, a = 3 cm) solo sirve para el dibujo; ninguna predicción pide un número que salga de él.
- El destello «Vs ≠ 0 un instante» no se capturó a mitad de la animación.
- Las cifras del informe están por verificar con los PDF.

### Pedidos para la integración

- `catalogo/cursos/fisica.json`: en `fisica.induccion-electromagnetica`, `"plantillas": ["induccion"]`. Luego `npm run catalogo` y subir `VERSION` en `app/sw.js`.
- `docs/diseno.md`, variables de inducción (`plantillas/induccion/`): B como en magnetismo; campo inducido Bᵢ `--c-Bi` índigo (#4a13ae, oscuro #7e84fc); flujo Φ `--c-phi` petróleo (#0d6b78, oscuro #24e4f9); fem ε `--c-fem` ocre (#a55412, oscuro #ffa64d); corriente I granate (#6e110c, oscuro #f95a24), corrido del de magnetismo para separarse de v (mismo criterio que I azul en circuitos); v, F, medidas, θ y V como en las hermanas.
- `docs/pendientes.md`, línea propuesta: «**Inducción** (`plantillas/induccion/`, rutina de física B, 7 nov 2026): el imán, la espira y el foquito (imán quieto sin corriente, fem como pendiente del flujo, Faraday, Lenz al acercar y al alejar con el campo inducido, barra en el riel, generador con valor eficaz, transformador y transformador con pila, bobina cortada); 22 casos verificados aparte; 10 de papel; 8 predicciones y 5 «¿qué pasa si…?». Documentados: MG7 y MG8; parciales: MG9, MG10 y MG8 al acercar. Sin ítems en el banco de física.»
- `CLAUDE.md`: agregar «el imán, la espira y el foquito» a la lista de plantillas, y en la historia: «Inducción (7 nov 2026, rutina de física B): `plantillas/induccion/` (el imán, la espira y el foquito: imán quieto, fem como pendiente del flujo, Lenz al acercar y al alejar, barra, generador y transformador; 22 casos verificados aparte).»
- Banco de física: candidato el imán quieto junto a la bobina (MG7, documentado).

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
