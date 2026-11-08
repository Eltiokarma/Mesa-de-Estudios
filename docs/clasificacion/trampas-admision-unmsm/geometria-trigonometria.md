# Trampas recurrentes: geometría y trigonometría (UNMSM 2019-I a 2027-I)

Fuente: campo `trampa` de `geometria-trigonometria.jsonl` (282 preguntas: 169 de geometría, 113 de trigonometría; 65 con trampa reconocible). Las trampas se infieren de las alternativas y de la resolución del solucionario: son hipótesis sobre el distractor, no datos de alumnos. Los 3 exámenes escaneados de 2021 no tienen clave ni solucionario y no aportan trampas.

Códigos: `GE` = `docs/investigacion/geometria-ideas-erroneas.md`; `TR` = `trigonometria-ideas-erroneas.md`; `CO` = cónicas en `matematica-avanzada-ideas-erroneas.md`.

## Trigonometría

| Trampa (en abstracto) | Veces | Código |
| --- | --- | --- |
| Signo que no se ajusta al cuadrante: razón positiva en el II o III cuadrante, seno de un ángulo negativo, coseno de un obtuso, áreas en la C.T. sin el signo, raíz del coseno que no le corresponde al cuadrante | 9 | TR12, TR15 (TR14 en la reducción) |
| Raíz extraña o solución que sobra: la otra raíz de la cuadrática, una solución fuera del intervalo, valores que anulan un denominador o la raíz imposible del coseno (cos x = 2) | 7 | TR21 (nueva en parte: no verificar restricciones) |
| Se queda con la primera solución cuando piden la segunda (o cuenta mal las soluciones en el intervalo) | 1 | TR22 |
| Unidades angulares: trata grados o minutos centesimales como sexagesimales | 2 | nueva (vecina de TR1 a TR3) |
| Usa el ángulo en grados en la fórmula del arco o del sector | 1 | TR4 |
| Mezcla de unidades al final: añade π a un resultado ya numérico, deja segundos donde piden minutos | 2 | nueva |
| Linealidad: en a·sen x + b·cos x toma a + b como máximo; omite el factor 2 de cada transformación suma-producto | 2 | TR16 |
| Ángulos verticales: suma de tangentes donde va la diferencia (o al revés) al combinar dos observaciones | 2 | TR9 (variante; nueva en su forma) |
| Elige la razón equivocada (seno en lugar de coseno del mismo ángulo) | 1 | TR9 |
| Razón de sectores o trapecios circulares con la razón de radios sin elevar al cuadrado | 1 | GE1 (llevado a sectores) |
| Perímetro del sector: cuenta solo el arco o solo los radios | 1 | GE4 / GE19 |
| Al multiplicar una desigualdad por un negativo no invierte los extremos; toma el máximo del valor absoluto de la secante como máximo de la secante | 2 | nueva (vecina de TR13) |
| Funciones inversas: confunde el valor con su raíz; gráfica de arcotangente reflejada con asíntotas o sentido equivocados; suma de arcos donde va la diferencia | 3 | nueva |
| Área de triángulo: da la mitad sin duplicar | 1 | nueva |

## Geometría

| Trampa (en abstracto) | Veces | Código |
| --- | --- | --- |
| Escala con la razón lineal (o con la que no toca) en áreas y volúmenes: triángulos semejantes, conos llenos hasta una fracción de la altura, esferas fundidas, tronco de cono llenado a 2/3 de la altura | 6 | GE1, GE2 (GE22 en el tronco) |
| Suma áreas en vez de sus raíces (triángulos semejantes formados por paralelas desde un punto interior) | 1 | GE1 (variante) |
| Radio y diámetro intercambiados, radio incompleto o resta de radios antes de elevar al cuadrado (corona) | 5 | GE19 |
| Falta el factor 1/3 en la pirámide o el cono | 2 | GE20 |
| Usa el lado (o la altura) donde va la semidiagonal o la apotema | 1 | GE21 / GE11 |
| Área de superficie: suma caras que el sólido no tiene o deja fuera una base | 2 | nueva (vecina de GE14) |
| Desigualdades: toma el valor límite que la desigualdad estricta excluye, o aplica solo la desigualdad triangular sin la condición de obtusángulo | 5 | nueva |
| Baricentro con coordenadas: divide entre 2 en vez de entre 3 | 1 | nueva |
| Cónicas: signos cambiados en la ecuación general o ejes intercambiados | 3 | CO7, CO8, CO11 |
| Elipse inscrita en un marco: no descuenta el ancho en ambos lados | 1 | nueva |
| Caja de cartón: descuenta una sola vez el corte de cada esquina | 1 | nueva |
| Ángulo entre bisectrices: usa la fórmula del excentro o el ángulo agudo en lugar del obtuso | 1 | nueva (vecina de GE8) |
| Signo del ángulo entre rectas (tangente positiva del agudo cuando piden el otro) | 1 | TR12 (llevado a geometría analítica) |

## Notas

- Las tres trampas más repetidas no son de cálculo fino sino de criterio: el signo por cuadrante (TR12/TR15), la escala no lineal (GE1/GE2) y las soluciones que sobran o faltan (TR21/TR22). Las tres tienen código; las de desigualdades estrictas y la condición de obtusángulo (5 veces) no tienen código y conviene agregarlas al informe de geometría.
- Dos preguntas con trampa de desigualdad tienen problemas de enunciado: 2023-I (10/12/2022) #34 el solucionario dice que no hay valor, y 2024-I área A #35 la respuesta correcta con la condición de obtuso no está entre las alternativas. No sirven como dato de error, pero muestran que el examen sí pregunta la condición de obtusángulo.
- No aparecen en los solucionarios los errores conceptuales de nivel visual (GE7 a GE10), ni TR7/TR8 (seno como longitud), ni el caso ambiguo (TR23). San Marcos pregunta con figura y casi siempre en contexto; el error que castiga es de procedimiento.
