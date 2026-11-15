# Ronda 3 de la teoría en química: glosario por tema y retos comprobados (15 nov 2026)

Rama `teoria3/quimica`, que sale de `claude/awesome-einstein-ch5g9a`. Hay un commit por unidad, en el orden de
`catalogo/cursos/quimica.json`, y cada commit trae su `npm run catalogo` y las pruebas de teoría y glosario en verde.
El trabajo se hizo en cuatro tandas paralelas de cinco unidades. Antes de empezar se armó un reparto de términos por
unidad, para que ningún término se definiera dos veces. La integración y el recorrido en el navegador los hizo la sesión
principal.

## Términos por unidad

«Propios» son los que define la unidad. «Heredados» son los que define otra unidad y aparecen en esta: el lector los
marca con «Lo viste en…» o «Se explica en…». Los números salen de `app/datos/glosario/quimica.json`.

| # | Unidad | Propios | Heredados | Términos propios |
|---|---|---|---|---|
| 1 | materia-y-energia | 15 | 8 | sustancia, elemento, compuesto, molécula, mezcla, mezcla homogénea, mezcla heterogénea, fase, cambio físico, cambio químico, cambio nuclear, energía, calor sensible, calor latente, calor específico |
| 2 | estructura-atomica | 15 | 6 | átomo, protón, neutrón, electrón, número atómico, número de masa, isótopo, ion, catión, anión, orbital, números cuánticos, configuración electrónica, electrón desapareado, isoelectrónico |
| 3 | tabla-periodica | 14 | 16 | periodo, grupo, bloque, electrones de valencia, símbolo de Lewis, metal, no metal, semimetal, radio atómico, carga nuclear, energía de ionización, afinidad electrónica, electronegatividad, tendencia periódica |
| 4 | enlace-quimico | 15 | 20 | enlace químico, enlace iónico, enlace covalente, enlace metálico, regla del octeto, estructura de Lewis, par libre, resonancia, híbrido, dipolo, molécula polar, forma molecular, fuerzas intermoleculares, puente de hidrógeno, fuerzas de London |
| 5 | nomenclatura-inorganica | 15 | 17 | estado de oxidación, nomenclatura sistemática, nomenclatura Stock, óxido básico, óxido ácido, hidróxido, oxácido, hidrácido, sal, oxisal, ion poliatómico, sal ácida, sal hidratada, peróxido, hidruro |
| 6 | mol-y-composicion | 13 | 17 | mol, número de Avogadro, entidad, cantidad de sustancia, masa molar, masa atómica, unidad de masa atómica, abundancia, fórmula empírica, fórmula molecular, ley de Lavoisier, ley de Proust, proporciones múltiples |
| 7 | reacciones-y-balance | 15 | 16 | reacción química, reactivo, producto, coeficiente, subíndice, oxidación, reducción, agente oxidante, agente reductor, redox, semirreacción, método ion-electrón, exotérmica, endotérmica, síntesis |
| 8 | estequiometria | 9 | 15 | estequiometría, razón molar, reactivo limitante, reactivo en exceso, producto teórico, rendimiento, pureza, equivalente, masa equivalente |
| 9 | gases | 15 | 9 | presión, kelvin, ley de Boyle, ley de Charles, ley de Gay-Lussac, ecuación de estado, gas ideal, condiciones normales, volumen molar, presión parcial, fracción molar, ley de Dalton, ley de Graham, efusión, difusión |
| 10 | liquidos-y-solidos | 15 | 10 | sólido cristalino, sólido amorfo, tensión superficial, viscosidad, capilaridad, presión de vapor, ebullición, diagrama de fases, punto triple, punto crítico, fluido supercrítico, sublimación, humedad relativa, gas húmedo, gas seco |
| 11 | soluciones | 15 | 12 | solución, soluto, solvente, coloide, suspensión, efecto Tyndall, solubilidad, curva de solubilidad, solución saturada, concentración, molaridad, molalidad, normalidad, dilución, porcentaje en masa |
| 12 | cinetica-quimica | 13 | 16 | rapidez de reacción, perfil de energía, energía de activación, complejo activado, calor de reacción, catalizador, ley de velocidad, orden de reacción, constante de velocidad, vida media, primer orden, mecanismo, etapa elemental |
| 13 | equilibrio-quimico | 11 | 16 | equilibrio químico, reacción reversible, reacción directa, reacción inversa, constante de equilibrio, cociente de reacción, acción de masas, grado de reacción, disociación, tabla inicio–cambio–equilibrio, principio de Le Châtelier |
| 14 | acidos-y-bases | 15 | 13 | ácido, base, Brønsted-Lowry, base de Lewis, par conjugado, ionización, ácido fuerte, ácido débil, constante de acidez, pKa, escala de pH, pOH, neutralización, titulación, punto de equivalencia |
| 15 | electroquimica | 13 | 19 | pila galvánica, electrodo, ánodo, cátodo, puente salino, potencial de reducción, fuerza electromotriz, reacción espontánea, energía libre, metal noble, electrólisis, faraday, diagrama de Pourbaix |
| 16 | hidrocarburos | 15 | 17 | hidrocarburo, alcano, alqueno, alquino, cicloalcano, hibridación, aromático, benceno, cadena principal, isómero, cis, trans, isómero óptico, adición, sustitución |
| 17 | funciones-organicas | 15 | 18 | grupo funcional, alcohol, fenol, éter, carbonilo, aldehído, cetona, ácido carboxílico, éster, amina, amida, nitrilo, isómero de función, sufijo, localizador |
| 18 | biomoleculas-y-productos-naturales | 15 | 17 | monosacárido, enlace glucosídico, hidrólisis, polímero, ácido graso, triglicérido, aminoácido, enlace peptídico, proteína, desnaturalización, liposoluble, hidrosoluble, alcaloide, polifenol, carotenoide |
| 19 | recursos-naturales | 15 | 12 | petróleo, destilación fraccionada, refinación, craqueo, octanaje, isooctano, detonación, combustión, combustión completa, combustión incompleta, hollín, gas natural, mena, ley del mineral, recuperación |
| 20 | ambiente-y-quimica-aplicada | 15 | 19 | contaminante, smog, lluvia ácida, efecto invernadero, capa de ozono, CFC, eutrofización, oxígeno disuelto, potabilización, desinfección, reciclaje, monómero, polimerización por adición, nanoescala, corrosión |

En total son 283 términos propios. Ninguna unidad pasa de 15 términos: estructura-atomica, enlace-quimico,
nomenclatura-inorganica y reacciones-y-balance se recortaron hasta llegar a 15.

## Retos por unidad (todas las mesas tienen retos)

Tipos: **Ex** = extremo, **Ca** = caso exacto, **Fo** = forma o patrón, **Co** = comparación de dos guardados.
Con ★ se marca el reto que toca la idea central. Todos los `logrado` usan las funciones que dibujan la mesa.

| Unidad | Mesa: retos |
|---|---|
| materia-y-energia | hielo-a-vapor 4: Ex (menor calor con todo líquido), Co★ (distinto Q, misma T: calor latente), Ca (mitad hervida), Ex (vapor > 120 °C) · gramo-carbon 3: Ex★ (menor masa ≥ 1000 t de carbón), Co (triple de energía), Ex (un gramo entero) |
| estructura-atomica | arma-ion 4: Ca★ (isótopo del Na con A = 25), Fo (anión isoelectrónico del argón), Ex (catión sin electrones), Co (isóbaros) · cajas-ion 4: Fo (catión sin desapareados), Ex (máximo de desapareados), Ca (último electrón en 4s), Co★ (dos especies con la configuración del neón) |
| tabla-periodica | tres-propiedades 4: Ex★ (átomo más grande), Ex (EI máxima), Ex (el menor del periodo 4), Co (mismo grupo, periodos distintos) · dos-elementos 4: Fo★ (vecinos del periodo 3 que rompen la tendencia), Fo (uno debajo del otro), Ex (mayor diferencia de EN), Ca (misma EN) |
| enlace-quimico | dos-dipolos 4: Fo★ (dipolos que se anulan), Ca (total = un enlace), Ex (dipolo máximo), Co (doble de dipolo) · resonancia-libre 3: Ca (híbrido del carbonato), Co★ (mismo ion, otro lugar del doble enlace), Co (NO₃⁻ y CO₃²⁻ isoelectrónicos) |
| nomenclatura-inorganica | sal-a-mano 4: Ca★ (fosfato de calcio neutro), Fo (neutra sin simplificar), Ex (la simplificada con más fichas), Co (mismo anión) · estados-raros 4: Ca (O en H₂O₂), Ca (H en NaH), Ex (estado más alto que cuadra), Co (mismo estado en dos especies) |
| mol-y-composicion | isotopos 4: Ca★ (cloro de 35,5 u), Ca (promedio a la mitad), Ex (promedio igual a un isótopo), Co (igual promedio, distinta abundancia) · atomos-o-masa 4: Fo★ (O pesa más de la mitad con menos de un tercio de átomos), Ca (40 % de C), Ex (mayor % de H), Co (fórmula empírica igual) |
| reacciones-y-balance | metano-libre 4: Ca★ (enteros mínimos), Fo (cuadra sin mínimos), Ex (más moléculas), Co (arreglar cambiando solo el O₂) · semirreacciones 4: Ca (permanganato), Ex (más electrones), Fo (pasarse de largo), Co (el doble de e⁻) |
| estequiometria | limitante-libre 4: Ca★ (que no sobre nada), Fo (limita el que tiene más moles), Ex (mayor producto sin sobrante), Co (igual producto, distinto sobrante) · caliza 4: Ca (56 g de CaO), Co★ (pureza y rendimiento intercambiados), Ex (caliza más liviana para ≥ 100 g), Fo (impurezas que pesan más que el CaO) |
| gases | cilindro-completo 4: Ca★ (Boyle: duplicar P con V), Ca (100 K y la misma P), Ex (P máxima), Co (igual P, doble de gas) · mezcla-embolo 4: Fo★ (Dalton: agregar He sin cambiar la P del N₂), Ca (O₂ con la mitad de la total), Ex (mayor total), Co (igual total) |
| liquidos-y-solidos | dos-liquidos 4: Ca★ (agua a 90 °C), Fo (agua bajo 70 °C), Ex (menor P con etanol sobre 60 °C), Co (el agua de un caso hierve donde el etanol del otro) · mapa-co2 4: Ca (CO₂ líquido a 20 °C), Ex (menor P con líquido), Fo (supercrítico), Co★ (sublimación: sólido y gas sin líquido) |
| soluciones | mezcla-dos 4: Ca★ (0,25 M: se suman moles), Fo (la mitad exacta solo con V iguales), Ex (pasar de 0,3 M), Co (misma c, distinto V) · dos-sales 4: Ca★ (sobre la curva: saturada), Fo (NaCl con sal que sobra), Ex (menor T para 50 g de KNO₃), Co (disuelto y con sólido) |
| cinetica-quimica | perfil-catalizador 4: Fo (endotérmica), Ca (barrera inversa de 150 kJ/mol), Ca★ (catalizador: baja Eₐ, ΔH igual), Co (con y sin catalizador) · curva-con-todo 4: Ca★ (una vida media), Ex (fin en orden cero), Ex (queda < 10 %), Co (misma fracción con otra [A]₀) |
| equilibrio-quimico | mezcla-libre 4: Ca★ (equilibrio en caliente), Fo (retroceder en frío), Ex (Q más alto), Co (dos equilibrios distintos con el mismo K) · desde-cualquier-lado 4: Ca (partes iguales), Fo (desde B, más B que A), Ex (A < 0,2), Co★ (mismo equilibrio desde los dos lados) |
| acidos-y-bases | vaso-que-se-diluye 4: Fo★ (débil ionizado más de la mitad), Ca (HCl a pH 3), Ex (pH más alto), Co (HF y acético con igual n) · titula-cualquiera 4: Ca (punto de equivalencia), Ca (pH = pKa), Ex (pH > 12), Co★ (HCl y HF con igual C) |
| electroquimica | escala-completa 4: Fo (par que no reacciona), Ca (+1,10 V), Ex (menor fem positiva), Co★ (el par al revés) · deposito-libre 4: Ex (menor tiempo para 10 g de Cu), Ex (el que menos deposita), Co★ (Ag contra Cu), Co (manda I·t) · metal-en-el-mapa 4: Fo (el agua se reduce), Fo (agua y metal estables), Ca (pH 14 sobre la línea del H₂), Ca (Ag que se oxida sin soltar O₂) |
| hidrocarburos | cadena-que-crece 5: Ca★ (12 H), Ex (anillo más chico con triple enlace), Fo (doble enlace imposible), Co (alqueno y cicloalcano), Co (+2 H por C) · a-contra-b 4: Fo★ (dos isómeros), Fo (dos dibujos de la misma molécula), Ex (más ramas), Ca (ni isómeros) |
| funciones-organicas | grupo-en-la-cadena 5: Fo★ (C=O al extremo: aldehído), Ca (C=O al centro de 5 C), Fo (localizador menor), Ex (la cetona más corta), Co (mismo nombre) · misma-formula 4: Ca (fenol o éter), Ca★ (ácido y éster isómeros), Fo (un solo grupo), Co (misma pareja de familias) |
| biomoleculas-y-productos-naturales | polimero 5: Ca (disacárido de glucosa), Ca★ (5 aguas: se cuentan uniones), Co (cadena contra anillo), Ex (el más pesado), Fo (anillo que no se cierra) · grasa-mixta 4: Ca★ (tres insaturadas), Ex (la más liviana), Ca (una sola con doble cis), Co (misma masa con otros ácidos) · dobles-y-color 3: Ex★ (la primera con color), Ex (la incolora de λ más larga), Co |
| recursos-naturales | dos-platos 4: Ca (solo gasolina), Fo★ (fracciones que se traslapan), Ex (todas), Co (mismo ancho) · mena-barras 4: Ex★ (menor ley del mineral para 10 kg), Ca (50 kg), Fo (se pierde más de lo que se recupera), Co (mismos kilos) · oxigeno-libre 4: Ca (hollín), Fo★ (CO sin hollín), Ca (carbón con el O₂ justo), Co (metano y carbón) |
| ambiente-y-quimica-aplicada | tres-filtros 4: Ex (≥ 60 kg), Ca (la mitad exacta), Fo (el filtro flojo pone el techo), Co★ (otro orden: se multiplican) · cubo-partido 4: Ca★ (área diez veces), Ex (menor k para pasar 100 cm²), Co (misma área), Ex (área máxima) |

## Mesas ampliadas

**Ninguna.** No cambió ningún id de mesa ni de control. Solo se sacaron funciones del motor que ya calculaban dibujo y
lectura, para que los retos usen la misma cuenta:
- energiaMg y carbon (materia);
- muTotal (enlace);
- cargaMano, sumaRaro y cuadra (nomenclatura);
- pCil, pPar y pTot (gases);
- familias (funciones);
- kgSale (recursos);
- areaCubo (ambiente).

## Palabras que dudamos

- **«porcentaje en masa»:** mol-y-composicion lo usa primero, pero quedó definido en soluciones, como estaba en el
  reparto. En mol-y-composicion se ve igual, con «Se explica en Soluciones». Si Gerson prefiere, se mueve.
- **«subíndice»:** mol-y-composicion también lo usa antes que reacciones-y-balance, igual que el caso anterior.
- **«reacción» y «producto» a secas:** se marcan en todo el curso. «Producto» también tiene sentido de multiplicación
  («producto iónico»), y ahí la definición química no calza.
- **Nombres de leyes que coinciden con personas:** «Boyle», «Proust», «Lavoisier» y «faraday» también marcan al
  personaje de la historia.
- **«Arrhenius»:** quedó fuera, porque también es el nombre de la historia de cinética.
- **Formas sueltas descartadas:** «radio», «dispersión», «inversa», «constante», «ley» y «fracción» no van como formas
  sueltas, porque marcarían mal otros textos («radio del tubo», «dispersión de partículas alfa», «ley de Boyle»…).
- **Cambios frente al reparto inicial, porque el texto lo dice así:**
  - «símbolo de Lewis» en vez de «notación de Lewis»;
  - «forma molecular» en vez de «geometría molecular»;
  - «carga nuclear» en vez de «carga nuclear efectiva»;
  - «calor de reacción» en vez de «entalpía»;
  - «acción de masas», porque «ley de acción de masas» pasa el tope de 4 palabras;
  - «escala de pH» en vez de «pH», porque el término necesita 3 letras o más. «pH» va en sus formas.
- **Fuera por el tope de 15:** núcleo, subnivel, paramagnético, apolar, nomenclatura tradicional, sal haloidea, sal
  básica, tanteo, doble desplazamiento, eliminación, glicerol, vitamina y producto natural.
- **Fuera porque no salen en el texto:** función química, radio iónico, sobresaturada, choque eficaz, grado de
  disociación, indicador, carbono quiral, isomería estructural, atomicidad y semicelda.
- **«monómero»:** el reparto lo ponía en biomoléculas, pero ahí no sale en el texto; quedó en ambiente.

## Pedidos al molde

1. **Retos de comparación y el validador.** El validador prueba las comparaciones solo con los primeros 160 casos de
   la grilla, y el primer control es el que varía más rápido. Una comparación que dependa del último control no se
   puede validar, aunque se pueda lograr. Retos que quedaron fuera por esto:
   - «una mezcla fría y otra caliente en equilibrio» (equilibrio-quimico, mezcla-libre);
   - «mismo potencial a pH 0 y a pH 14» (electroquimica, metal-en-el-mapa);
   - «2, 4, 2, 4» del metano (reacciones-y-balance);
   - una comparación en dos-elementos (tabla-periodica).

   Pedido: que la muestra de pares cubra todos los controles.
2. **Los códigos de error cuentan como texto.** `Glosario.texto` lee el campo `error` (p. ej. `QM-DALTON-FRACCION`):
   «Dalton» parecía aparecer solo por un código. Conviene saltar `error`, igual que `id`.
3. **Formas que marcan mal fuera de su unidad.** Sería útil limitar una forma suelta a la unidad que la define o
   excluirla en otra: «radio» y «dispersión», o nombres de personas en la historia.
4. **Mesas con un solo control de opciones** (dobles-y-color, misma-formula). La única comparación posible es
   «guarda dos distintas». «Guarda tres» permitiría retos de patrón.
5. **Mesa que admite especies imposibles.** cajas-ion (estructura-atomica) deja armar especies como H³⁻. El reto que
   llevaba ahí se acotó a cationes, pero la mesa sigue permitiéndolas desde la ronda 2.

## Recorrido en el navegador (Playwright, 360 × 780)

`node rutinas/teoria3-quimica/pw.js <unidades…>`, con `npm run dev`. Se recorrieron las 20 unidades:
- abre la primera idea y toca un término subrayado;
- abre el glosario del tema y busca una palabra;
- en cada una de las 43 mesas, busca con el motor un caso que cumpla el primer reto de un argumento, lo pone con los
  controles reales y lee la tarjeta.

**Resultado:**
- en las 43 mesas salió «✓ Lo lograste» con la línea `bien` de Bruna;
- el ancho quedó siempre en 360 px;
- no hubo errores de consola.

Al ver los casos se corrigieron dos retos:
- **«Encuentra un ion con todos sus electrones apareados».** Se cumplía con H³⁻; ahora pide un catión.
- **«Una fórmula que sea a la vez fenol y éter».** Decía algo falso, porque son dos isómeros posibles de la misma
  fórmula; se reescribió.

**Observación:** en materia-y-energia, reacciones-y-balance, liquidos-y-solidos y soluciones, la primera pantalla de
la idea 1 no tiene ningún término subrayado visible. Los términos salen en los pasos y la regla.

## Lo no verificado

- **Solo se probó el primer reto de cada mesa.** Los demás pasaron el validador: se pueden lograr, no están cumplidos
  al abrir y `logrado` no falla. Pero no se cumplieron uno por uno en el navegador.
- **Las comparaciones con casos guardados** no se recorrieron con Playwright.
- **Las definiciones y ejemplos** se revisaron a mano, no hay un cálculo aparte. Lo mismo vale para las masas de
  glucosa 180, maltosa 342, glicina 75, ácido palmítico 256 y triestearina 890, y para los intervalos de ebullición de
  las fracciones del petróleo.
- **«El H₂S hierve a −60 °C»** es un dato de manual: no lo calcula el código.
- **No se miraron todas las capturas.** Se revisaron las hojas del glosario y las tarjetas de reto de una muestra,
  entre ellas cajas-ion, donde salió el caso de H³⁻.
