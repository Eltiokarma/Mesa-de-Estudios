# Ronda 6, química A: «Lee» y «Así se resuelve» (16 nov 2026)

Rama `teoria6/quimica-a`, salida de `main` (9d8a46e). Hay un commit por unidad y cada uno se subió con su push. No se integró a main.

**Qué se hizo.** Las 10 unidades del encargo tienen «Lee» y «Así se resuelve» en todas sus ideas: 48 ideas en total.
- **Cómo se trabajó:**
  - El trabajo se repartió entre cinco subagentes, cada uno con dos unidades y en una copia aparte del repo.
  - La sesión principal revisó cada archivo, corrió las pruebas, recorrió con Playwright e integró unidad por unidad.
- **Dos subagentes se cortaron** al final por el límite de uso semanal: el de reacciones y estequiometría, y el de gases y líquidos.
  - Las 4 unidades ya estaban escritas.
  - La sesión principal las revisó completas, rehízo a mano las cuentas de las semillas, corrigió dos tarjetas y las integró.

**Pruebas por unidad, antes de cada commit:**
- `npm run catalogo`;
- `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`: 764 de 764 en verde;
- Playwright a 360 × 780 sobre al menos una idea, con un alumno `{ uni: 'unmsm', grado: '5' }`. Comprueba lo siguiente:
  - la idea abre en «Lee»;
  - el botón pasa de tarjeta en tarjeta y «Ir directo a jugar» salta al juego;
  - «Así se resuelve» revela los pasos uno por uno y muestra la respuesta;
  - «Otro ejemplo» cambia el enunciado;
  - no hay errores de consola.

En todos los casos dio TODO OK. Al final se corrió el `npm test` completo; su resultado está en «Verificación final».

**Regla para «Así se resuelve».** Las cuentas usan las mismas funciones, motores y listas de «Ahora tú», con `azar(s + 900)`; en las ideas que trabajan con una tabla de casos se usa `(s + 900) % largo`. Ningún número está escrito a mano.

Donde hacía falta, las listas de casos de «Ahora tú» se sacaron a constantes del archivo para compartirlas: en nomenclatura, gases y líquidos. En las 10 unidades se comprobó que `ahoraTu.generar(0..39)`, «Predice» y «La regla» dan exactamente lo mismo que antes. La excepción son los textos corregidos por objetos que no se dibujan (abajo).

---

## Por unidad

### quimica.materia-y-energia
1. **sustancia-mezcla**
   - Lee: qué estudia la química (el cobre de Toquepala, el balón de gas, la chicha), «especie» y «fase», y qué mirar: especies y capas.
   - Resuelve: clasificar la muestra de la lupa en elemento, compuesto o mezcla homogénea o heterogénea. Paso `aplica`.
2. **fisico-quimico-nuclear**
   - Lee: por fuera no basta; estados de agregación; propiedades físicas y químicas (el balón que arde, el cobre que se pone verde); qué mirar antes y después.
   - Resuelve: decidir si un cambio es físico, químico o nuclear, con los casos de «Ahora tú». Sin figura, como «Ahora tú».
3. **calor-sensible-latente**
   - Lee: calor contra temperatura; calor específico (el Titicaca suaviza el frío de sus orillas); cambios de fase (las heladas de Puno).
   - Resuelve: alterna dos problemas, Q = m·c·ΔT del agua líquida y Q = m·L del hielo a 0 °C. Lleva los ejes Q–T.
4. **masa-energia**
   - Lee: Einstein en 1905, sin la fórmula; energía química contra nuclear (el gas de Camisea); las unidades mg y TJ.
   - Resuelve: E = Δm·c², pasando de mg a kg. La comprobación lo lleva a TJ.

### quimica.estructura-atomica
1. **nucleo-identidad**
   - Lee: el tamaño del átomo, las tres partículas, Z y A (el cobre de Cuajone, Z = 29).
   - Resuelve: los electrones de un ion (e = Z − carga) o los neutrones (N = A − Z). Lleva la figura del ion.
2. **modelos-atomicos**
   - Lee: saber sin ver; un modelo es como un mapa de Juliaca; cómo leer la cadena.
   - Resuelve: emparejar una evidencia con su modelo, con el año como comprobación.
3. **numeros-cuanticos**
   - Lee: los números cuánticos como una dirección (barrio, calle, casa); las letras s, p, d y f.
   - Resuelve: alterna tres problemas: los orbitales de un subnivel (2l + 1), los electrones de un subnivel y los electrones de un nivel (se comprueba con 2n²).
4. **configuracion-electronica**
   - Lee: llenar de abajo hacia arriba como un balde; cómo se escribe (el nitrógeno); átomos e iones.
   - Resuelve: la configuración de un átomo o ion. Se comprueba sumando los superíndices. Las cajas aparecen vacías y después llenas.
5. **desapareados-isoelectronicos**
   - Lee: el espín como un imán diminuto; Hund como los asientos de una combi; qué es «isoelectrónico» (Na⁺ y Ne).
   - Resuelve: contar los electrones desapareados en las cajas de valencia.

### quimica.tabla-periodica
1. **periodos-grupos-bloques**
   - Lee: la tabla se ordena por Z (el cobre de Toquepala y el oxígeno del aire de Juliaca); periodos, grupos, bloques y la escalera.
   - Resuelve: el periodo y el grupo de un Z a partir de su configuración. Se comprueba que los exponentes suman Z.
2. **ubicacion-lewis**
   - Lee: cómo se lee «2p⁶»; los electrones de valencia (la sal de Maras); el símbolo de Lewis.
   - Resuelve: del último nivel al periodo, el grupo y los puntos de Lewis.
3. **radio-atomico-ionico**
   - Lee: el picómetro; cómo se define el radio; catión y anión.
   - Resuelve: cuál de dos átomos tiene mayor radio. Compara dividiendo los dos radios.
4. **energia-ionizacion**
   - Lee: arrancar un electrón cuesta energía; X(g) → X⁺(g) + e⁻; no es la afinidad electrónica.
   - Resuelve: quién pide más energía, con la diferencia de las dos EI, y por qué falla la flecha en los saltos.
5. **electronegatividad**
   - Lee: el par compartido (el agua del Titicaca); la escala de Pauling; ΔEN.
   - Resuelve: ΔEN de un enlace y hacia qué átomo se corre el par.

### quimica.enlace-quimico
1. **tres-enlaces**
   - Lee: metales y no metales (el cobre de Cuajone), cationes y aniones; las bolitas son un modelo.
   - Resuelve: clasificar el enlace por los elementos de la fórmula. Paso `aplica`.
2. **lewis-octeto**
   - Lee: Lewis es una cuenta dibujada; el metano de Camisea, con 8 electrones de valencia calculados; la regla del octeto.
   - Resuelve: los electrones de valencia N_val de un ion o molécula (la suma menos la carga).
3. **resonancia**
   - Lee: el ozono y la luz ultravioleta del altiplano; el orden de enlace; las estructuras de resonancia.
   - Resuelve: el orden de enlace del híbrido, como total ÷ posiciones.
4. **forma-polaridad**
   - Lee: regiones de electrones, flechas de dipolo, el microondas y el agua.
   - Resuelve: si la molécula es polar, con el motor `plantillas/enlace` (regiones, hibridación y polaridad).
5. **fuerzas-intermoleculares**
   - Lee: el agua hierve a unos 87 °C en Juliaca, por eso se compara a 1 atm; enlace contra atracción entre moléculas.
   - Resuelve: cuál hierve más alto, con la diferencia de temperaturas.

### quimica.nomenclatura-inorganica
1. **estados-oxidacion**
   - Lee: el estado de oxidación es una cuenta y no una carga real; la lejía (NaClO) frente a la sal (NaCl), sin dar valores.
   - Resuelve: el ω del átomo que falta. Las fichas pasan de «?» al valor.
2. **tres-nombres**
   - Lee: nombres comunes (la cal viva, el óxido de un clavo), los tres sistemas, los prefijos y los sufijos -oso/-ico.
   - Resuelve: el nombre Stock de un óxido.
3. **arbol-funciones**
   - Lee: las familias o funciones; la soda cáustica y el ácido de la batería; primero ver si es metal o no metal.
   - Resuelve: la fórmula de un oxácido (óxido + H₂O, simplificado) o de un hidróxido.
4. **sales**
   - Lee: la sal de Maras y la familia de las sales (yeso, mármol, salitre); catión y anión; se nombran al revés.
   - Resuelve: la fórmula de una sal, con la proporción mínima y el paréntesis.
5. **sales-acidas-basicas-hidratadas**
   - Lee: el bicarbonato como sal ácida; sales con «algo más».
   - Resuelve: clasificar una sal separada en iones. La comprobación es la suma de cargas.

### quimica.mol-y-composicion
1. **masa-atomica-promedio**
   - Lee: los isótopos; la unidad u; la abundancia (el cloro de la sal).
   - Resuelve: el promedio ponderado de dos isótopos, con la lupa.
2. **mol-masa-molar**
   - Lee: contar pesando (la quinua en el mercado de Juliaca); el mol; la masa molar del H₂O.
   - Resuelve: alterna gramos → moles y moles → entidades. Para NaCl y CaCO₃ dice «unidades fórmula».
3. **relaciones-en-formula**
   - Lee: la fórmula es una receta; moléculas frente a unidades fórmula.
   - Resuelve: los moles de átomos de un elemento en n mol de compuesto, con paréntesis. Usa las barras de `quim-composicion`, porque la lupa no dibuja Al₂(SO₄)₃ ni Ca(OH)₂.
4. **composicion-formula-empirica**
   - Lee: qué hay en 100 g; del análisis a la fórmula; el etano de Camisea → CH₃.
   - Resuelve: el % en masa de un elemento, o la fórmula molecular a partir de la empírica.
5. **leyes-ponderales**
   - Lee: Lavoisier y la leña; Proust y el agua; CO contra CO₂.
   - Resuelve: alterna tres casos: el O en el agua (8 : 1), la conservación (C + O₂ → CO₂) y las proporciones múltiples.

### quimica.reacciones-y-balance
1. **indicios**
   - Lee: las cuatro pistas (indicios); una pista no es una prueba (la chicha de jora fermenta y aparece alcohol); qué mirar en las partículas.
   - Resuelve: si hubo reacción química en un caso cotidiano, con su comprobación por propiedades. Paso `aplica`.
2. **clasificar**
   - Lee: pocos patrones; las letras AB y X; qué mirar.
   - Resuelve: el tipo de reacción. El tipo se deduce de qué sustancias son elementos sueltos y se compara con el patrón de letras. Paso `aplica` con la lupa.
3. **tanteo**
   - Lee: Lavoisier; el coeficiente y el subíndice; el metano de Camisea.
   - Resuelve: el coeficiente que falta. Se despeja con un elemento, se comprueba elemento por elemento y la lupa se llena.
4. **oxida-reduce**
   - Lee: el ω y para qué sirve aquí; la calamina oxidada.
   - Resuelve: el agente oxidante o reductor, contando los electrones perdidos y ganados en la recta.
5. **ion-electron**
   - Lee: las semirreacciones, el medio ácido y el permanganato.
   - Resuelve: cuántos e⁻ cierran la carga de una semirreacción. Se comprueba con el cambio de ω.

### quimica.estequiometria
1. **via-de-los-moles**
   - Lee: la ecuación como receta (la sopa de quinua); el amoniaco y los fertilizantes; el mol como paquete.
   - Resuelve: los gramos de un reactivo a partir de los gramos de otro, de ida y vuelta.
2. **reactivo-limitante**
   - Lee: lo que se acaba; limitante y exceso; el aire de sobra en el gas del balón.
   - Resuelve: el producto máximo. Los moles se dividen entre el coeficiente y queda un sobrante.
3. **pureza-rendimiento**
   - Lee: la caliza y la cal viva; la pureza; el rendimiento.
   - Resuelve: los gramos de CaO de una muestra impura con un rendimiento dado.
4. **masa-equivalente**
   - Lee: ácidos, bases y neutralización; la leche de magnesia; contar lo que se va (θ).
   - Resuelve: M_eq = M/θ, con la masa molar calculada a partir de los átomos.

### quimica.gases
1. **una-condicion**
   - Lee: qué mide la presión (Juliaca 0,62 atm, Lima casi 1 atm); el kelvin.
   - Resuelve: alterna Boyle, Charles y Gay-Lussac, y comprueba con PV o con la razón de las temperaturas.
2. **ecuacion-estado**
   - Lee: los cuatro datos P, V, T y n; un gas en la altura.
   - Resuelve: alterna V = nRT/P, la densidad y la masa molar a partir de la densidad.
3. **presiones-parciales**
   - Lee: el aire es una mezcla (78 y 21); la fracción molar.
   - Resuelve: la presión parcial como la fracción molar por la presión total. Las parciales suman la total.
4. **graham**
   - Lee: efusión (el globo de helio) y difusión (el perfume).
   - Resuelve: la razón de rapideces √(M₂/M₁). Se comprueba elevando al cuadrado.
5. **gas-de-reaccion**
   - Lee: un gas que nace (vinagre con bicarbonato, zinc con ácido); la receta.
   - Resuelve: de gramos de reactivo a litros de gas, a veces en las condiciones de Juliaca.

### quimica.liquidos-y-solidos
1. **orden-y-libertad**
   - Lee: la misma agua en tres estados (el Titicaca, los nevados, el aire de Juliaca); forma y volumen; la sal de Maras con lupa.
   - Resuelve: si una muestra es líquido o gas, o sólido cristalino o amorfo, según una pista. Paso `aplica`.
2. **capilaridad**
   - Lee: la «piel» del agua; la viscosidad no es la tensión superficial; la servilleta que se moja; que el juego muestra una curva y no el tubo.
   - Resuelve: la nueva altura con h·r constante.
3. **presion-vapor**
   - Lee: la ropa que se seca sin hervir en Juliaca; la presión de vapor; hervir no es evaporar.
   - Resuelve: la temperatura de ebullición leída en la curva para una presión dada.
4. **diagrama-fases**
   - Lee: el diagrama como mapa; las fronteras; el CO₂ y el hielo seco.
   - Resuelve: la fase del CO₂ en un punto, con el punto triple, el crítico y la curva de sublimación.
5. **gas-humedo**
   - Lee: el vapor que no se ve; la humedad relativa; el gas recogido sobre agua.
   - Resuelve: alterna la humedad relativa y la presión del gas seco (total menos vapor).

---

## Glosario agregado
- materia-y-energia: especie, estado de agregación, propiedad física, propiedad química.
- estructura-atomica: subnivel, espín, regla de Hund, paramagnético, diamagnético.
- tabla-periodica: picómetro.
- enlace-quimico: orden de enlace, región de electrones, dipolo-dipolo.
- nomenclatura-inorganica: nomenclatura tradicional.
- mol-y-composicion: unidad fórmula, composición centesimal.
- reacciones-y-balance: descomposición, desplazamiento, doble desplazamiento, indicio, medio ácido.
- gases: cero absoluto.
- liquidos-y-solidos: evaporación, presión de saturación.

## Semillas revisadas a mano
Cada semilla se rehízo aparte, con la fórmula química (`node -e` o calculadora) y sin llamar al generador. Todas cuadraron.

### materia-y-energia
- Idea 1:
  - s3: mezcla heterogénea;
  - s4: elemento;
  - s5: compuesto.
- Idea 2:
  - s3: el vidrio que se rompe es un cambio físico;
  - s4: la leche que se agria, químico;
  - s6: el radio-226 que pasa a radón, nuclear.
- Idea 3:
  - s3: 240·4,18·15 = 15 048 J;
  - s4: 140·334 = 46 760 J;
  - s5: 150·4,18·30 = 18 810 J.
- Idea 4:
  - s3: 700 mg dan 6,3·10¹³ J;
  - s4: 610 mg dan 5,49·10¹³ J;
  - s5: 420 mg dan 3,78·10¹³ J.

### estructura-atomica
- Idea 1:
  - s3: Ca²⁺ tiene 18 electrones;
  - s4: el ³⁹K tiene N = 20;
  - s5: S²⁻ tiene 18 electrones.
- Idea 2: s3 es Bohr; s5, Rutherford; s6, el modelo actual.
- Idea 3:
  - s3: 5s tiene 1 orbital;
  - s4: 4d tiene 10 electrones;
  - s5: el nivel n = 2 tiene 8 electrones.
- Idea 4: s3 (S²⁻), s4 (F⁻) y s5 (Na⁺) coinciden con un Aufbau escrito aparte.
- Idea 5:
  - s3: Cl, 1 electrón desapareado;
  - s4: S, 2;
  - s5: Fe²⁺, 4.

### tabla-periodica
- Idea 1:
  - s0: Na, periodo 3 y grupo 1;
  - s1: Cl, 3 y 17;
  - s2: Ga, 4 y 13.
- Idea 2:
  - s0: 3s² es Mg;
  - s1: 4s¹ es K;
  - s2: 4s² 4p³ es As.
- Idea 3: Mg/S = 1,65; C/O = 1,40; Al/B = 1,36.
- Idea 4:
  - Na − K = 77;
  - Ca − Ga = 11;
  - He − Ne = 291. Con NIST sin redondear da 292: es redondeo.
- Idea 5: Si–O = 1,54; B–N = 1,00; C–F = 1,43.

### enlace-quimico
- Idea 1: Al es metálico; Cl₂, covalente; Cu, metálico.
- Idea 2: CN⁻ tiene 10; HCN, 10; ClO⁻, 14.
- Idea 3: O₃ da 1½; SO₃, 1⅓; HCOO⁻, 1½.
- Idea 4: SO₂, NH₃ y H₂O son polares. Las regiones VSEPR se rehicieron aparte.
- Idea 5:
  - HF − HCl = 105 °C;
  - Br₂ − Cl₂ = 93 °C;
  - n-pentano − neopentano = 26 °C.

### nomenclatura-inorganica
- Idea 1:
  - s0: S en SO₃²⁻ es +4;
  - s1: Cr en K₂Cr₂O₇ es +6;
  - s2: H en NaH es −1.
- Idea 2: PbO₂ (IV); SO₃ (VI); N₂O₅ (V).
- Idea 3: H₂CO₃; Fe(OH)₃; Mg(OH)₂; HClO₄.
- Idea 4: CaSO₄; FeCl₃; NH₄Cl.
- Idea 5:
  - Cu₂(OH)₂CO₃ es básica;
  - CaSO₄·2H₂O es hidratada;
  - NaCl es neutra.

### mol-y-composicion
- Idea 1: 44,9 u; 64,6 u; 74,7 u.
- Idea 2:
  - 3 mol de NaCl son 1,807·10²⁴;
  - 50 g de CaCO₃ son 0,5 mol;
  - 0,5 mol de H₂SO₄ son 3,011·10²³.
- Idea 3: 6 mol de S; 3 mol de N; 3 mol de C.
- Idea 4:
  - 25 % de H en CH₄;
  - 39,3 % de Na;
  - P₂O₅, con k = 2.
- Idea 5:
  - 40 g de O en 45 g de agua;
  - 15 + 40 = 55 g de CO₂;
  - CO : CO₂ = 1 : 2.

### reacciones-y-balance
- Idea 1:
  - s0: el cobre que se pone verde es químico;
  - s1: el hielo del Titicaca es físico;
  - s2: la chicha que fermenta es química.
- Idea 2:
  - S + O₂ es síntesis;
  - 2 KClO₃ es descomposición;
  - Fe + 2 HCl es desplazamiento.
- Idea 3: CH₄ + 2 O₂ → CO₂ + 2 H₂O. Las cuentas de C, H y O dan 1 = 1, 4 = 4 y 4 = 4 en s0, s1 y s2.
- Idea 4:
  - 2 Fe + 3 Cl₂: 6 e⁻ perdidos = 6 ganados;
  - C + O₂: 4 = 4;
  - ZnO + C: 2 = 2.
- Idea 5:
  - SO₄²⁻: n = 8; los átomos cuadran: O 4 = 4 y H 10 = 2 + 8;
  - PbO₂: n = 2;
  - ClO⁻: n = 2.

### estequiometria
- Idea 1:
  - 64 g de CH₄ piden 256 g de O₂;
  - 24 g de Mg piden 16 g de O₂;
  - 12 g de C piden 32 g de O₂.
- Idea 2:
  - con 4 mol de N₂ y 3 mol de H₂ salen 2 mol de NH₃ y sobran 3 de N₂;
  - con 2 y 3 salen 2 y sobra 1;
  - con 5 mol de H₂ y 1 de O₂ salen 2 mol de H₂O y sobran 3 de H₂.
- Idea 3:
  - 200 g, 80 % y 70 % dan 62,72 g;
  - 350 g, 60 % y 75 % dan 88,2 g;
  - 400 g, 60 % y 90 % dan 120,96 g, que se muestran como 121 g.
- Idea 4: Mg(OH)₂ da 29; H₂SO₄ con θ = 1 da 98; H₂C₂O₄ da 45.

### gases
- Idea 1:
  - 1·8/2 = 4 atm;
  - 5·360/310 = 5,81 L;
  - 8·370/320 = 9,25 atm.
- Idea 2:
  - 0,082·300/0,8 = 30,75 L;
  - ρ(N₂) = 1,5·28/(0,082·273) = 1,876 g/L;
  - M = 0,357·0,082·273/2 = 4,0 g/mol.
- Idea 3: (3/7)·1,5 = 0,643; (5/6)·2 = 1,667; (6/7)·4 = 3,43.
- Idea 4: √8 = 2,83; √20 = 4,47; √4 = 2.
- Idea 5:
  - 0,082·283/0,62 = 37,43 L;
  - 1,5·0,082·298 = 36,65 L;
  - 6·0,082·298 = 146,6 L.

### liquidos-y-solidos
- Idea 1: el aceite es líquido; el vapor, gas; la nieve, sólido cristalino.
- Idea 2: 6/0,75 = 8; 9/0,25 = 36; 12/0,25 = 48.
- Idea 3: el agua hierve a 94 °C con unos 81 kPa, a 109 °C con unos 139 kPa y a 113 °C con unos 160 kPa. Coincide con las tablas de vapor.
- Idea 4: la sublimación del CO₂ está en unos 4,1 atm a −60 °C y en unos 0,4 atm a −90 °C. Coincide con los datos de referencia.
- Idea 5: 1/2,34 = 43 %; 95 − 3,17 = 91,83 kPa; 0,5/4,25 = 12 %.

## Objetos corregidos (antes → después)
- materia-y-energia, fisico-quimico-nuclear, «Predice»:
  - antes: «Hierves agua pura en una olla y suben burbujas…»;
  - después: «Hierves agua pura y suben burbujas…».
  - La figura no tiene olla.
- materia-y-energia, calor-sensible-latente, «Predice»:
  - antes: «Un cubo de 10 g de hielo…»;
  - después: «Una muestra de 10 g de hielo…».
  - La figura es la curva.
- mol-y-composicion, leyes-ponderales, «Ahora tú» y su `siFuera`:
  - antes: «En un frasco cerrado…»;
  - después: «En un sistema cerrado…».
  - La figura son barras.
- estequiometria, via-de-los-moles y reactivo-limitante, consignas:
  - antes: «Cada bolita es 1 mol»;
  - después: «Cada molécula dibujada vale (es) 1 mol».
  - Las moléculas se dibujan con varias bolitas.
- liquidos-y-solidos, capilaridad, consigna:
  - antes: «Un tubo de vidrio delgado entra en un líquido y el líquido sube. El radio del tubo cambia solo»;
  - después: «Un líquido sube por un tubo de vidrio delgado. La curva da la altura para cada radio; el punto la recorre solo».
  - El tubo no se dibuja; la tarjeta de «Lee» lo aclara.

### Correcciones de la sesión principal en tarjetas nuevas
- **gases, una-condicion:** «las mismas 8 bolitas» pasó a «las mismas 8 partículas», porque son 8 moléculas de N₂ de dos bolitas cada una.
- **estequiometria, masa-equivalente:** se quitó de la última tarjeta «y con él se divide la masa molar». Acercaba la respuesta de «Predice», donde la trampa es dividir entre los H de la fórmula.

## Pedidos de vectores para Gerson
1. **materia-y-energia, fisico-quimico-nuclear («Predice»):** una olla al fuego con burbujas que suben, para que la pregunta del hervor tenga su escena.
2. **mol-y-composicion, leyes-ponderales («Ahora tú»):** un frasco o recipiente cerrado con su contenido, para mostrar que en un sistema cerrado la masa no se pierde.
3. **liquidos-y-solidos, capilaridad (juego):** un tubo capilar metido en un líquido, con la altura h que sube y el radio r, al lado de la curva h contra r.
4. **estructura-atomica, modelos-atomicos (opcional):** el experimento de Rutherford, con la fuente alfa, la lámina de oro, la pantalla y las partículas que pasan y las que rebotan. Hoy es solo una cadena de texto.
5. **estructura-atomica, configuracion-electronica y desapareados-isoelectronicos (opcional):** un imán que atrae o no atrae la muestra, para ver la diferencia entre paramagnético y diamagnético.

## Lo que no se pudo y por qué
- **Las «moléculas» de NaCl y CaCO₃ en «Ahora tú»** de mol-masa-molar son unidades fórmula, porque son compuestos iónicos.
  - No se cambió, porque el encargo solo permite tocar «Ahora tú» por objetos que no se dibujan.
  - «Así se resuelve» sí dice «unidades fórmula». Queda para Gerson.
- **Sin figura en «Así se resuelve»**, porque «Ahora tú» tampoco la tiene:
  - fisico-quimico-nuclear;
  - tres-enlaces, lewis-octeto y fuerzas-intermoleculares;
  - indicios.
- **Figura solo en algunos casos:**
  - en resonancia y forma-polaridad, solo en las especies que la pieza ya dibuja;
  - en numeros-cuanticos, el caso «cuántos orbitales» no lleva figura en el enunciado, porque las cajas darían la respuesta.
- **desapareados-isoelectronicos** solo resuelve la variante de las cajas de valencia. La variante de radios usa otra pieza (`recta`), y un `resuelve` lleva una sola pieza.
- **nucleo-identidad** usa solo iones con Z ≤ 20, porque la figura de capas llega hasta el calcio.
- **«Subnivel»** quedó definido en estructura-atomica, que es la unidad que lo estrena. Tabla-periódica y enlace lo marcan desde ahí.
- **«Orden» sale subrayado** en tabla-periódica («Un orden por Z»), por una forma suelta de otra unidad, probablemente «orden de reacción». No es de esta lista y no se tocó.
- **Rótulos de tramos angostos** en las barras de relaciones-en-formula: salen fuera de la barra. Es cosa de la pieza, que no se toca.
- **Listas copiadas.** En materia-y-energia (las muestras) y en estructura-atomica (las especies), «Así se resuelve» trae una copia de las listas de «Ahora tú», para no tocar «Ahora tú». Si alguien cambia esas listas, tiene que cambiar las dos.

## Lo no verificado
- Que las tarjetas de «Lee» no adelanten la respuesta de «Predice» lo revisaron quien escribió cada unidad y la sesión principal. Nadie lo revisó a ciegas.
- **Datos de contexto que se dan por ciertos sin fuente en el archivo:**
  - el Titicaca suaviza el frío de sus orillas;
  - las heladas de Puno;
  - el gas de Camisea en las cocinas;
  - el cobre de Toquepala y de Cuajone;
  - Juliaca a unos 3825 m y 0,62 atm;
  - el permanganato para desinfectar verduras;
  - la leche de magnesia.
- **Playwright no recorrió todas las ideas:** solo una o dos por unidad en la integración, y varias más en las copias de los subagentes. La lista está en «Verificación final». Las ideas que no se recorrieron pasaron el validador, que revisa 12 semillas de `resuelve` por idea.

## Verificación final (rama integrada)
- **Pruebas:** `npm test` completo dio 8788 de 8788 en verde.
- **Playwright** a 360 × 780 sobre la rama integrada, con el alumno `{ uni: 'unmsm', grado: '5' }`, en **las 48 ideas** de las 10 unidades. Las 48 dieron TODO OK:
  - abren en «Lee»;
  - el botón pasa de tarjeta en tarjeta, la última dice «Siguiente: Juega» e «Ir directo a jugar» salta al juego;
  - en «Así se resuelve», los pasos se revelan uno por uno, sale la respuesta y «Otro ejemplo» cambia el enunciado;
  - no hay errores de consola.
- **Capturas revisadas a ojo:** una muestra, no las 48. Entre ellas: radio-atomico-ionico, forma-polaridad, calor-sensible-latente, modelos-atomicos, estados-oxidacion, relaciones-en-formula, tanteo y capilaridad. La figura y el texto se ven bien.

Con esto, la nota de «Lo no verificado» sobre Playwright queda corregida: se recorrieron todas las ideas. Lo que no se miró una por una son las capturas.
