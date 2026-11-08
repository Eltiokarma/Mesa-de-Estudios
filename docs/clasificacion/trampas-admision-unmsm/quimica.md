# Química UNMSM 2019-I a 2027-I: trampas que se repiten

Fuente: 307 preguntas clasificadas en `clasif/quimica.jsonl` (47 solucionarios y 3 exámenes escaneados de 2021, con OCR). 290 llevan trampa. Aquí se agrupan en abstracto. Las cuentas son aproximadas: una pregunta puede caer en dos grupos y hay preguntas repetidas entre áreas del mismo día.

Códigos de los informes de `docs/investigacion/`: ES (estequiometría), GQ y SO (gases y soluciones), EQ, AB y EC (equilibrio, ácidos-bases, electroquímica), AT, TP y EN (átomo, tabla, enlace), CI (cinética), QA (ambiente), MA, NO, HC y FO (materia, nomenclatura, orgánica), BM y BMH (biomoléculas). «Nueva» quiere decir que ningún código la recoge.

## Cálculo

| # | Trampa (en abstracto) | Veces | Código |
|---|---|---|---|
| 1 | Usar la ecuación sin balancear: sumar sus coeficientes o tomar la relación molar 1:1 (sobre todo con ácidos dipróticos) | ~11 | ES12 (en parte); el «sumar coeficientes sin balancear» es nueva |
| 2 | Contar moles de moléculas en vez de moles de átomos: olvidar el subíndice de la fórmula o que el gas es diatómico | ~11 | ES18, ES6 |
| 3 | Errores de unidades: potencias de diez, mL↔L↔m³, mg↔g, porcentaje↔g/L | ~10 | nueva |
| 4 | Hallar mal el reactivo limitante: por menor masa, sin dividir por los coeficientes, o calcular con el reactivo en exceso | ~7 | ES20, ES21 |
| 5 | Dar como «sobrante» la masa del exceso que reacciona, o la masa consumida en vez de la que queda | ~4 | nueva (cercana a ES22) |
| 6 | No aplicar rendimiento o pureza, o aplicarlos en el paso equivocado (incluye la ley de mineral calculada sobre el concentrado y no sobre la mena) | ~7 | nueva |
| 7 | Normalidad tratada como molaridad: olvidar el factor de protones u oxidrilos, o la carga del catión | ~7 | SO15 |
| 8 | Al diluir, usar el volumen de agua añadida como volumen final | ~3 | SO5 (en parte) |
| 9 | Dar el pH en vez del pOH (o al revés), o tomar [OH⁻] = [H⁺] | ~6 | AB7 (en parte) |
| 10 | Usar temperatura en °C en las leyes de los gases | 3 | nueva |
| 11 | Aplicar 22,4 L/mol fuera de condiciones normales o a un líquido | 2 | ES5 |
| 12 | Graham invertido / fracción en masa en vez de fracción molar en Dalton | 2 | GQ11 / nueva |
| 13 | Ley de equilibrio sin elevar a los coeficientes, u orden de reacción tomado de los coeficientes globales | 2 | CI9 |
| 14 | Faraday: olvidar la carga del ion en la masa equivalente | ~3 | nueva |

## Electroquímica y redox

| # | Trampa | Veces | Código |
|---|---|---|---|
| 15 | Confundir agente oxidante con reductor, o especie oxidada con reducida («el agente oxidante se oxida») | ~13 | EC9 (en parte); el cruce agente/especie es nueva |
| 16 | Fem de la pila: restar en orden inverso, sumar potenciales de reducción o multiplicarlos por coeficientes; ánodo y cátodo invertidos en la notación | ~8 | EC4, EC12 |
| 17 | Electrólisis: trasladar los signos de la pila a la celda electrolítica, ubicar mal los gases, suponer moles iguales de H₂ y O₂, o depositar un metal activo desde solución acuosa | ~7 | EC3, EC8 |
| 18 | Electrones que van del cátodo al ánodo | 1 | EC6 |
| 19 | Dismutación: creer que todo el elemento cambia en el mismo sentido | 2 | nueva |

## Cinética y equilibrio

| # | Trampa | Veces | Código |
|---|---|---|---|
| 20 | Confundir catalizador (se regenera) con intermediario (se forma y se consume) | 4 | CI8 (en parte), nueva |
| 21 | Creer que el catalizador desplaza el equilibrio o cambia K | 1 | EQ12 |
| 22 | Leer la energía de activación desde cero o desde el complejo activado; tomar el complejo activado por un producto | 3 | CI12, CI6 |
| 23 | Le Chatelier a ciegas: desplazar hacia la especie que se agrega, o creer que un líquido puro desplaza el equilibrio | 3 | EQ14, EQ13 |
| 24 | Leer el calor en los productos como absorbido / creer exotérmica una reacción con ΔH > 0 | ~3 | CI3 (en parte), nueva |

## Átomo, tabla y enlace

| # | Trampa | Veces | Código |
|---|---|---|---|
| 25 | Configuración de iones: escribir la del átomo neutro, quitar electrones 3d antes que 4s, ignorar las anomalías de Cr y Cu | ~7 | nueva |
| 26 | Intercambiar grupo y periodo, o tomar como periodo el subnivel de mayor energía | ~5 | nueva |
| 27 | Invertir las tendencias periódicas (radio, carácter metálico, electronegatividad) | 2 | TP7 (en parte) |
| 28 | El octeto como ley: no ver el octeto expandido, el helio o el radical libre | ~4 | EN3 |
| 29 | Hibridación mal asignada: sp² en un triple enlace, sp³ en el carboxilo, ignorar los carbonos del anillo, «lineal» para sp² | ~12 | EN12 |
| 30 | Confundir número de enlaces pi con número de electrones pi, o dobles enlaces con carbonos sp² | ~5 | nueva |
| 31 | Propiedades de los sólidos iónicos: llamarlos amorfos o conductores en estado sólido | 2 | EN1 (en parte) |
| 32 | Isótopos con propiedades químicas distintas | 1 | AT4 (en parte) |
| 33 | Mezclar los aportes de los modelos atómicos (Thomson, Rutherford, Bohr, orbitales) | 2 | AT5 |

## Orgánica y biomoléculas

| # | Trampa | Veces | Código |
|---|---|---|---|
| 34 | Polaridad, solubilidad y ebullición mal predichas: «grupo polar = soluble», ramificación que sube la ebullición, dipolo-dipolo por encima del puente de hidrógeno, presión de vapor al revés | ~12 | EN16, HC2, EN11, FO2 |
| 35 | Grupo funcional mal reconocido: aldehído/alcohol, éster/éter, lactona/lactama, metoxi/metilo, amina/amida, carboxilo leído como cetona más alcohol, llamar hidrocarburo a un compuesto con O o N | ~10 | FO4, FO3 |
| 36 | Nomenclatura orgánica: numerar desde el extremo equivocado, cadena principal mal elegida, prioridad de grupos, fenilo/bencilo/ciclohexilo, o-m-p | ~10 | HC3 |
| 37 | Aromaticidad mal reconocida: anillo con un solo doble enlace, policíclicos o esteroides llamados aromáticos | ~5 | nueva |
| 38 | Fenoles: llamarlos alcoholes, básicos o sin acidez, o contarlos como segundo protón | ~4 | nueva |
| 39 | Oxidación y reducción orgánica al revés (alcohol→aldehído o aldehído→ácido llamados reducción) | 3 | nueva |
| 40 | Isomería cis-trans donde un carbono tiene dos grupos iguales; confundir cis-trans con R/S | 2 | HC4 |
| 41 | Biomoléculas: desnaturalización por calor reversible, aldosa y cetosa como isómeros de posición, forma del aminoácido a pH fisiológico | 3 | BM8 / nueva |

## Materia, reacciones, nomenclatura y ambiente

| # | Trampa | Veces | Código |
|---|---|---|---|
| 42 | Sufijos y sistemas de nomenclatura inorgánica: oso/ico, ito/ato, hipo/per, mezclar stock con tradicional, peróxido/dióxido | ~9 | NO2 |
| 43 | No cruzar cargas al escribir la fórmula de un compuesto iónico | 2 | NO1, NO3 |
| 44 | Clasificar mal las reacciones: simple y doble desplazamiento, combustión que no sería redox, ácido-base llamada redox, descomposición llamada reversible | ~7 | MA8 (en parte), nueva |
| 45 | Elemento/compuesto/mezcla confundidos (una molécula diatómica llamada compuesto, una sustancia pura llamada mezcla) | ~5 | MA9 |
| 46 | Cambio de fase leído como cambio químico; sublimación directa e inversa confundidas | 2 | MA1, AT3 |
| 47 | Ambiente: invernadero y calentamiento global como causa y efecto al revés, fosfatos que «evitan» la eutrofización, filtrar o sedimentar que desinfecta, lluvia ácida que sube el pH, contaminantes secundarios llamados primarios | ~7 | QA5, QA15, QA16, AM2 |
| 48 | Metalurgia: confundir los procesos de cada metal (tostación, lixiviación, cianuración, flotación), el agente reductor del alto horno o el tipo de compuesto del mineral | ~7 | nueva (QA13 solo en parte) |
| 49 | Ácidos y bases conceptuales: ácido débil que se vuelve fuerte al concentrarse, base débil con pH < 7, neutralización que siempre da pH 7, punto de equivalencia mal leído | 4 | AB2, AB9, AB11 |

## Las nuevas que más pesan

Son frecuentes en el examen y no están en los informes:

1. Usar la ecuación sin balancear (#1).
2. Errores de unidades y de potencias de diez (#3).
3. Cruzar agente con especie en redox (#15).
4. Configuración de iones de transición (#25).
5. Grupo contra periodo (#26).
6. Enlaces pi contra electrones pi (#30).
7. Procesos metalúrgicos (#48).
8. Rendimiento y pureza mal aplicados (#6).
