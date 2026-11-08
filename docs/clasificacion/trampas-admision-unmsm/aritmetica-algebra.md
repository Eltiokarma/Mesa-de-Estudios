# Trampas que se repiten: aritmética y álgebra (UNMSM 2019-I a 2027-I)

344 preguntas clasificadas (184 de aritmética, 160 de álgebra), en 47 solucionarios y 3 exámenes escaneados de 2021.

**Ojo con el origen.** Los solucionarios de Saco Oliveros casi nunca comentan los distractores. Solo resuelven. Las trampas de abajo las deduje de dos cosas: de las alternativas (cuando una sale de un error reconocible) y de los puntos donde la resolución tiene que tener cuidado. Son hipótesis para armar opciones de predicción y no son datos de errores observados en postulantes. Los conteos suman las preguntas cuyo campo `trampa` cae en esa familia. Una pregunta puede tocar más de una.

Códigos: AR/RM = `aritmetica-razonamiento-ideas-erroneas.md`; AL y CX = `algebra-funciones-ideas-erroneas.md`; MT, BN, CO = `matematica-avanzada-ideas-erroneas.md`.

## Aritmética

| # | Trampa (en abstracto) | Veces | Código |
|---|---|---|---|
| 1 | Fracción o porcentaje tomado sobre la base equivocada: sobre el total en vez de sobre lo que queda (o al revés), o sobre la base inicial en un encadenado | 13 (racionales 6, porcentajes 4, interés 1, sistema con recipiente 1, Carroll 1) | AR3 (y AR1 en los encadenados) |
| 2 | Ganancia calculada sobre el costo cuando el enunciado la pone sobre la venta, o al revés. También el precio medio armado con el precio de venta | 4 (mezclas 3, porcentajes 1) | AR3 (caso particular) |
| 3 | Confundir lo que queda con lo que se quita: ley con impureza, "se disuelve el 19 %" usado como factor, "disminuye en 2/3" leído como "queda en 2/3" | 3 | AR4 |
| 4 | Tasa y tiempo en periodos distintos (trimestral, bimestral, mensual, días) sin convertir, o respuesta en el periodo equivocado | 8 (interés y descuento) | nueva |
| 5 | Clasificar mal una magnitud en regla de tres compuesta: horas diarias, dificultad o eficiencia, reparto inverso hecho como directo, inversa con el cuadrado tomada como inversa simple | 7 | AR8, AR9, AR10 |
| 6 | Relación afín (costo fijo más costo proporcional) tratada como proporcional | 1 (más 3 de álgebra que olvidan el costo fijo) | AR7 |
| 7 | En trabajo conjunto se suman o promedian los tiempos en vez de las rapideces | 2 | AR7 / nueva |
| 8 | Promedio de promedios, purezas o costos sin ponderar. La rapidez media con trabajo igual sale como media aritmética y no armónica | 5 | AR15, AR14 |
| 9 | Combinatoria: contar con orden cuando no importa, o sin orden cuando sí importa (variaciones contra combinaciones) | 4 | AR17 |
| 10 | Combinatoria: no admitir la repetición, o admitirla mal (también el cero inicial en códigos) | 2 | AR19 |
| 11 | Bloques que van juntos sin permutar por dentro, o fila contra círculo | 4 (3 de combinatoria, 1 de probabilidad) | nueva |
| 12 | "Por lo menos" y "a lo más": contar solo el caso extremo o fijar los mínimos y elegir el resto libre | 2 | nueva (cerca de AR18) |
| 13 | Sumar en vez de multiplicar las elecciones independientes | 1 | nueva |
| 14 | Bayes: responder la condicional directa P(efecto | causa) en vez de la inversa | 4 | nueva |
| 15 | Extracciones sin reposición tratadas como independientes (lo hace el propio solucionario de 2020-I) | 2 | nueva (cerca de AR20) |
| 16 | Confundir la probabilidad condicional con la de la intersección, o sumar en vez de multiplicar | 3 | nueva |
| 17 | "Exactamente dos" de tres eventos sin quitar el caso en que ocurren los tres. También dividir entre el total y no entre el condicionante | 2 | nueva |
| 18 | Residuo por defecto contra por exceso ("le faltan k para otro grupo"). También la división por exceso de Euclides tratada como por defecto | 3 | nueva |
| 19 | Producto de los divisores en vez del MCM, o el MCM sin igualar antes los residuos | 2 | AR13 (parcial) |
| 20 | Múltiplos de varios primos sumados sin inclusión-exclusión | 2 | nueva |
| 21 | Divisores propios contra totales. La unidad contada como primo | 3 | nueva |
| 22 | Contar fracciones reducibles (o impropias) cuando se piden irreductibles | 5 | nueva |
| 23 | Cifras que no respetan la base (cifra igual o mayor que la base, primera cifra cero). También los restos leídos en el orden equivocado | 5 | nueva |
| 24 | Error del poste y la valla: restar los extremos sin sumar uno, contar mal los periodos o la coincidencia inicial, contar las esquinas dos veces, dividir entre términos en vez de entre intervalos | 7 (sucesiones, MCM y potenciación) | nueva (en RM la cubre `cortes-pesadas`) |
| 25 | Sucesión: una sola ley para una sucesión intercalada, o buscar la ley sin restituir fracciones simplificadas | 2 | nueva (cerca de RM2) |
| 26 | Variaciones porcentuales de dimensiones sumadas en vez de multiplicadas | 1 | AR1 |
| 27 | Estadística: mediana sin ordenar o con un solo central cuando hay número par de datos. Varianza que "cambia al restar una constante" o "se multiplica por k" | 3 | nueva |
| 28 | Lógica: "ya que" o "puesto que" simbolizado en el orden en que se escribe. De un antecedente falso se "deduce" algo | 3 | nueva |
| 29 | Préstamo olvidado en la resta y complemento aritmético aplicado también a la última cifra | 2 | nueva |
| 30 | Responder otra cantidad (la del grupo equivocado, en otra unidad: litros contra mililitros) | 2 | AR5 (parcial) |

## Álgebra

| # | Trampa (en abstracto) | Veces | Código |
|---|---|---|---|
| 31 | Traducción verbal invertida o mal leída: "excede en", "menos que", "no puede ser menor que" | 4 | RM1 / AL1 |
| 32 | Olvidar el costo fijo en utilidad = ingreso − costo | 3 | nueva (cerca de AR7) |
| 33 | Responder otra cantidad: unidades en vez de ganancia, tiempo del máximo en vez del máximo, tiempo total en vez de tardanza, población final en vez de incremento, "cuántas veces es" contra "cuántas veces aumentó", el coeficiente en vez de lo pedido | 8 | AR5 (parcial) / nueva |
| 34 | Unidades del modelo sin convertir (decenas, miles) | 2 | nueva |
| 35 | Crecimiento o decaimiento exponencial tratado como lineal (vida media "en partes iguales", "el doble de tiempo para la cuarta parte") | 4 | AL33 |
| 36 | Logaritmo de un cociente como cociente de logaritmos. Signo o cociente invertido al despejar con ln | 2 | AL31, AL10 |
| 37 | Identidades estiradas: (a+b)³ = a³ + b³, doble producto olvidado, (x₁+x₂)² usado como x₁² + x₂² | 3 | AL8, AL11 |
| 38 | Inecuaciones: extremos incluidos o excluidos mal, redondeo del entero hacia el lado equivocado, solución aislada perdida (numerador al cuadrado igual a cero) | 6 | AL19 |
| 39 | Dominio: denominador que se anula, simplificar un factor sin excluir su raíz, radical interior o logaritmo interior olvidados, no intersecar con el dominio | 5 | AL21 (parcial) / nueva |
| 40 | Discriminante con el signo de la condición invertido (positivo contra negativo para raíces no reales) | 1 | nueva |
| 41 | Valor absoluto: un solo caso de la igualdad, solo el valor absoluto exterior, o quitarlo y quedarse con un valor negativo | 3 | AL22, AL23 |
| 42 | Inyectividad: intervalo que contiene el vértice, todo el dominio de una raíz cuadrática, \|f\| de una inyectiva tomada como inyectiva, dominio de la inversa igual al de la función | 5 | AL29 (parcial) / nueva |
| 43 | Desplazamiento del argumento en sentido contrario | 1 | AL28 |
| 44 | Valor numérico: P(0) confundido con P(1) (término independiente contra suma de coeficientes), evaluar el argumento desplazado sin despejar, resto evaluado en el coeficiente y no en la raíz del divisor | 4 | nueva |
| 45 | Grado absoluto como suma de los grados de los términos | 1 | nueva |
| 46 | Raíces negativas o no reales aceptadas o descartadas sin mirar el contexto ("no hay raíces" porque no son reales) | 2 | nueva |
| 47 | Complejos: conjugado que cambia el signo de la parte real | 2 | CX12 / CX13 |
| 48 | Complejos: iⁿ reducido con el cociente y no con el resto entre 4. (1 + i)² = 2 (como si i² = 1). Suma con el conjugado confundida | 3 | CX3, CX1 |
| 49 | Término del binomio con el índice igual al lugar | 1 | BN2 / BN10 |
| 50 | Elipse: semieje sin sumar el desplazamiento del centro | 1 | CO8 (parcial) |
| 51 | Programación lineal: evaluar solo algunos vértices, quedarse con un vértice no entero cuando la variable es entera o dar la respuesta en miles sin convertir | 4 | nueva |
| 52 | Sistema con parámetro: aceptar el valor que lo vuelve incompatible | 1 | AL17 |
| 53 | Planteo geométrico: esquinas de una franja contadas dos veces, perímetro usado como suma de dos lados, cuatro paredes iguales o con tapa | 3 | nueva |

## Lo que más se repite

1. **Base equivocada del porcentaje o la fracción** (13 o más, contando sus variantes 2 y 3: unos 20). Coincide con AR3/AR4. En San Marcos casi siempre aparece como "fracción del resto" y como ganancia sobre la venta contra sobre el costo, más que como descuentos sucesivos.
2. **Periodos de tasa y tiempo sin convertir** (8). No está en el informe. Interés y descuento comercial salen en casi todos los periodos desde 2024.
3. **Magnitud mal clasificada en la regla de tres compuesta** (7). Cubre AR8 a AR10.
4. **Error del poste y la valla en conteos** (7). No está en el informe de aritmética.
5. **Responder otra cantidad que la pedida** (unas 10 entre aritmética y álgebra). Solo AR5 se le parece.
6. **Bayes y condicional invertida** (4) y **promedios sin ponderar** (5).
7. **Dominio e inecuaciones con extremos mal tratados** (11). Corresponde a AL19 y AL21.

## Notas

- Hay dos casi repetidas: 2023-I/10-16 #42 (sistema 3x3 de compras, otros datos) con 2019-II/03-10 #47, y 2027-I humanidades, adicional #34 (regla del producto) con 2025-I medicina #34.
- Errores de los propios solucionarios: en 2020-I/09-15 #39 llaman "independientes" a extracciones sin reposición. 2024-I/12-03 #32 trae datos inconsistentes, y el solucionario lo dice. En 2027-I/10-25 #39 la resolución usa (x+3) aunque el enunciado da (x−3). En 2027-I/10-24 #34 el titular está mal ubicado.
- Los exámenes escaneados de 2021 traen respuestas marcadas a mano (aspas o círculos). Las anoté en `nota` como "marca a mano" y dejé `clave` vacía, como pide el brief.
