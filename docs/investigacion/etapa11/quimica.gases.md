# QU11 · Química · Estado gaseoso

> Parte del documento de ChatGPT de las 32 unidades (21 nov 2026), por verificar. Cómo se leyó la evidencia y el contrato común de las escenas: `docs/investigacion/etapas-9-12/como-leer.md`.


## 1. Resumen en cinco líneas

El modelo gaseoso relaciona partículas, choques, temperatura, presión y volumen.  
Cada ley exige identificar qué permanece constante.  
La ecuación ideal utiliza temperatura y presión absolutas.  
Mezclas y reacciones se resuelven contando moles gaseosos.  
Lo más difícil es distinguir las propiedades del conjunto de las de una partícula.

## 2. Qué se pregunta en los exámenes

| Tipo | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Gas ideal, volumen molar y masa molar | UNMSM | Media/alta | Temario histórico; no estimada | UNMSM, Química 6.3 |
| Mezcla gaseosa y combustión con exceso | UNI | Alta | Aparición 2021-1, Química 19 | UNI |
| Cambios de presión, volumen, temperatura y moles | Preparación conceptual | Media/alta | No estimada | Flowers, 9.2 |

## 3. Errores típicos

| Código | Qué hace | Por qué | Estado | Fuente |
|---|---|---|---|---|
| G-VAC | Llena el espacio entre partículas con aire continuo | Dificultad para concebir el modelo corpuscular | Documentado | Chamizo y Márquez, 2006, pregunta 1 |
| G-TEM | Usa Celsius en razones o presión manométrica en gas ideal | Confunde escala de lectura y magnitud absoluta | Hipótesis | Diseño propio |
| G-FIJ | Aplica una ley sin controlar cantidad o temperatura | Atiende solo a dos variables | Hipótesis | Diseño propio |
| G-PAR | Atribuye la compresión macroscópica al encogimiento de partículas | Traslada directamente propiedades del recipiente a las entidades | Hipótesis | Diseño propio |

## 4. Lo que la unidad da por sabido

Mol, masa molar, balance, estequiometría, proporciones, presión y temperatura. Se introduce aquí Kelvin y se recupera presión absoluta.

## 5. Las ideas, en orden

### Idea 1. Partículas y paredes — ¿Qué representa la presión?

**Aprende:** la presión resulta de intercambios de movimiento con las paredes.

**Lee / objeto:** inflador de bicicleta y recipiente transparente en vista conceptual. «El gas ocupa el volumen disponible». «La transparencia del dibujo ayuda a mirar un modelo». «La muestra está formada por partículas».

**Juega:** introduce un número contado de partículas y comprueba que ninguna atraviesa la pared; todavía no comprime ni calienta.

**Predice:** se comprime un gas a temperatura constante en un recipiente cerrado, dentro del modelo de partículas. ¿Qué cambia principalmente? A) La separación entre las partículas **[correcta]**. B) El tamaño de cada partícula, que se encoge como el recipiente [G-PAR]. C) La cantidad de partículas, que disminuye aunque no escape gas ni reaccione [G-FIJ]. D) La cantidad de un relleno continuo entre partículas, tratado como si fuera otra sustancia del modelo [G-VAC].

**Mira:** comprime conservando partículas y temperatura; muestra más encuentros con paredes.

**La regla:** el gas ideal considera partículas de volumen propio despreciable frente al recipiente, movimiento continuo y choques elásticos, sin interacciones entre choques. La temperatura absoluta se relaciona con energía cinética traslacional media; no todas las partículas tienen igual rapidez. Una partícula no posee la presión macroscópica de la muestra. El modelo pierde precisión a alta densidad y cerca de condensación.

**Palabras:** *modelo ideal*: simplificación con supuestos; ejemplos: volumen propio despreciable, choques elásticos, atracciones ignoradas. *Presión absoluta*: referida al vacío; ejemplos: presión atmosférica, gas encerrado, presión total calculada.

**Así se resuelve:** identificar controles; describir movimiento y choques; distinguir conjunto y partícula; comprobar límites del ideal. **Ahora tú:** dibujo → cambios controlados → límites del modelo.

### Idea 2. Mantener controles — ¿Qué ley corresponde?

**Aprende:** selecciona una relación según variables constantes.

**Lee / objeto:** jeringa cerrada, termómetro y sensor. «El émbolo cambia volumen». «El termómetro registra temperatura». «Comparar estados exige declarar controles».

**Juega:** ajusta volumen a temperatura y cantidad fijas hasta una presión objetivo. Calentar permanece bloqueado.

**Predice:** un gas se mantiene con cantidad y volumen constantes. Al pasar de 20 °C a 40 °C, ¿qué puede afirmarse de su presión absoluta? A) Aumenta menos del doble **[correcta]**. B) Se duplica por duplicarse la lectura Celsius [G-TEM]. C) Aumenta exactamente 20 unidades de presión, trasladando el cambio Celsius [G-TEM]. D) Se reduce a la mitad porque se invierte sin motivo el factor de temperatura [G-TEM].

**Mira:** convierte lecturas a Kelvin antes de comparar.

**La regla:** $P$ es presión absoluta, $V$ volumen, $T$ temperatura absoluta, $n$ cantidad en mol. A T y n fijos, PV es constante; a P y n fijos, V/T; a V y n fijos, P/T; a P y T fijos, V/n. Si $t_C$ es lectura Celsius, $T[\mathrm K]=t_C[{}^\circ\mathrm C]+273,15$. Kelvin no lleva grado. Entre estados ideales puede compararse $PV/(nT)$, manteniendo explícitos los cambios de n.

**Palabras:** *isotérmico*: a temperatura constante; ejemplos: baño térmico, compresión controlada, expansión a igual T. *Isobárico*: a presión constante; ejemplos: émbolo con carga fija, expansión regulada, calentamiento con P controlada.

**Así se resuelve:** listar cambios y controles; convertir a absolutos; seleccionar relación; despejar; revisar cierre del recipiente. **Ahora tú:** ley simple → combinada → cambio de moles.

### Idea 3. Volumen y química — ¿Cómo convertir un gas a moles?

**Aprende:** el volumen molar depende de condiciones.

**Lee / objeto:** bolsa de gas de laboratorio con etiqueta de condiciones. «El volumen requiere temperatura y presión». «Una muestra puede cambiar de tamaño». «La ecuación química relaciona cantidades de sustancia».

**Juega:** completa fichas de muestras con P, V y T; el programa exige unidades y referencia de presión. No compara condiciones diferentes.

**Predice:** ¿qué condiciones permiten comparar el volumen de un mol de dos gases dentro del modelo ideal? A) Fijar la misma presión y temperatura absolutas **[correcta]**. B) Basta igual cantidad de sustancia, con cualquier presión y temperatura [G-FIJ]. C) Basta igual temperatura, aunque las presiones sean distintas [G-FIJ]. D) Basta igual presión, aunque las temperaturas sean distintas [G-FIJ].

**Mira:** conserva n y modifica P o T para obtener volúmenes diferentes.

**La regla:** $PV=nRT$, con $R$ constante de gases en unidades compatibles. El volumen molar $V_m=RT/P$. Con masa m y masa molar M, $n=m/M$; la densidad $\rho=PM/(RT)$. A iguales P y T, los volúmenes ideales son proporcionales a los moles. Los coeficientes de reacción relacionan volúmenes solo para gases medidos bajo esas mismas condiciones. «Condiciones normales» debe definirse numéricamente; no se memoriza un volumen molar sin referencia.

**Palabras:** *volumen molar*: espacio por mol bajo condiciones dadas; ejemplos: baja presión, alta presión, distinta temperatura. *Densidad gaseosa*: masa por volumen; ejemplos: nitrógeno, dióxido de carbono, mezcla a condiciones dadas.

**Así se resuelve:** escoger R coherente; obtener n; usar ecuación balanceada; convertir producto a volumen final con sus condiciones. **Ahora tú:** gas ideal → masa molar → gasometría de reacción.

### Idea 4. Contar todos los componentes — ¿Cómo se suman presiones?

**Aprende:** la presión total incluye cada componente gaseoso.

**Lee / objeto:** recipientes de gases identificados conectados a uno común. «Cada especie conserva identidad si no reacciona». «El volumen final se comparte». «Un componente puede ser vapor de agua».

**Juega:** mezcla dos gases no reactivos y verifica inventario; no muestra recogida sobre agua.

**Predice:** al recoger gas sobre agua, ¿la presión medida pertenece necesariamente solo al gas buscado? A) No; puede incluir vapor de agua **[correcta]**. B) Sí, los otros componentes no cuentan [G-FIJ]. C) Sí, si la lectura es manométrica [G-TEM]. D) El vapor no son partículas sino relleno continuo [G-VAC].

**Mira:** identifica componentes y sus contribuciones.

**La regla:** $P=\sum_iP_i$, $P_i=y_iP$, con fracción molar $y_i=n_i/\sum_jn_j$. Para gas saturado recogido sobre agua, con solo esos componentes, $P_{\mathrm{seco}}=P-P_{\mathrm{vapor}}$; la presión de vapor se proporciona a la temperatura de trabajo. Si hay reacción, primero resolver composición final. Extensión: en efusión ideal a igual T, la razón de tasas $u_1/u_2=\sqrt{M_2/M_1}$; no equivale a una ley exacta de difusión en todo ambiente.

**Palabras:** *parcial*: contribución de un componente; ejemplos: nitrógeno, oxígeno, vapor de agua. *Efusión*: escape molecular por orificio muy pequeño; ejemplos: gas ligero, pesado, comparación a igual T.

**Así se resuelve:** inventariar gases finales; hallar moles y fracciones; aplicar Dalton; descontar vapor solo bajo sus condiciones. **Ahora tú:** mezcla seca → húmeda → reacción con exceso y condensación indicada.

## 6. Letras y símbolos

| Símbolo | Significado | Unidad / advertencia |
|---|---|---|
| $P,V,T,n$ | Presión absoluta, volumen, temperatura, cantidad | Pa, m³, K, mol u otras coherentes |
| $t_C,R,V_m$ | Celsius, constante gaseosa, volumen molar | °C; unidad compatible; volumen/mol |
| $m,M,\rho$ | Masa, masa molar, densidad | Unidades coherentes |
| $P_i,y_i,n_i,u_i$ | Presión parcial, fracción, moles, tasa de efusión | Presión, sin unidad, mol, cantidad/tiempo |
| $i,j,\sum$ | Índices y suma | R no es radio |

## 7. Otras formas de explicarla

La jeringa conecta volumen y presión; comprimir rápido puede calentar un gas real. Las partículas no deben crecer con temperatura. El inventario de moles ayuda con mezclas; todos los gases comparten el volumen, no compartimentos ficticios. Apoyo: Chamizo y Márquez; Flowers, 9.2.

## 8. Datos del mundo

FIVB da un intervalo de presión interna del balón en varias unidades, útil para leer una especificación real. Para gas ideal deben aportarse además presión atmosférica, volumen y temperatura y precisar la conversión de sobrepresión a absoluta. No se asigna una presión atmosférica exacta a Puno solo por su ubicación.

## 9. Dudas y decisiones

Efusión es ampliación final. Gasometría debe declarar gas seco, saturado o condensado. No se verificó cuál ley gaseosa domina en exámenes recientes. La representación de partículas es conceptual y no a escala.

## 10. Fuentes

- UNMSM (proceso 2023-I). *Reglamento de admisión*, Química 6.3. [Documento](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- UNI (2021). *Solucionario Admisión 2021-1*, Química 19. [Documento](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2021.pdf).
- Chamizo, J. A.; Márquez, J. R. (2006). *Modelación molecular*, RMIE 11(31), 1241–1257. [Original](https://ojs.rmie.mx/index.php/rmie/article/download/1287/1658/3332).
- Flowers, P.; Theopold, K.; Langley, R.; Robinson, W. R. (2019). *Chemistry 2e*, [9.2, The Ideal Gas Law](https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law).
- FIVB (2025). *Official Volleyball Rules 2025–2028*, 3.1. [Documento](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf).
