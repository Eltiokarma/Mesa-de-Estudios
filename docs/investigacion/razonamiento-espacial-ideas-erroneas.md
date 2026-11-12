# Razonamiento matemático espacial: errores típicos (hipótesis)

Rutina rm-espacial, 8 nov 2026. Este informe da código a las trampas que la clasificación de la admisión de San Marcos (`docs/clasificacion/trampas-admision-unmsm/rm-a.md` y `rm-b.md`) dedujo de las alternativas y resoluciones de los exámenes 2019-I a 2027-I en las familias visuales y espaciales de razonamiento matemático: cubos y vistas, dados y dominó, rutas, rodamientos y poleas, simetrías y giros, papel doblado, particiones y conteo de figuras.

**Ninguno tiene dato publicado.** Todos son `hipotesis` («hipótesis nuestra» en pantalla) hasta que los datos del colegio digan otra cosa. Donde un código es la cara espacial de uno del informe de aritmética y razonamiento (`aritmetica-razonamiento-ideas-erroneas.md`), se dice; en ese caso la opción puede llevar `parcial` solo si ese código tiene dato (AR18 lo tiene; RM5 no).

Los códigos usan el prefijo **RME** para no chocar con los RM7 en adelante que pueda abrir otra rutina.

## Cubos, sólidos y vistas

| Código | Error | Ejemplo propio | Frecuencia en la admisión |
| --- | --- | --- | --- |
| RME1 | **Contar como visibles (o pintadas) las caras pegadas** entre cubitos, o la que se apoya en la mesa o la pared. | Dos cubitos pegados y pintados por fuera: «12 caras» (son 10; 8 si están sobre la mesa y no se pintan las bases). | Caras pintadas, inducción con sólidos, cubos que cubren un sólido |
| RME2 | **Contar dos veces el cubito donde se cruzan dos túneles.** | Cubo de 3 × 3 × 3 con dos túneles que se cruzan en el centro: «se quitan 6» (son 5). | Cubo agujereado (3 preguntas) |
| RME3 | **Contar solo los cubitos que se ven** y olvidar los ocultos detrás o debajo. | Escalera de tres peldaños vista de frente: «6 cubitos» cuando hay más detrás. | Completar un cubo o una caja |
| RME4 | **Equivocar cuántas caras pintadas tiene cada posición**: esquina 3, arista 2, centro de cara 1, interior 0. | En un cubo de 4 × 4 × 4 pintado, contar las esquinas entre los de dos caras: «32» (son 24). | Cubos pintados |
| RME5 | **Leer una sola vista o confundir la superior con la frontal**, o tomar un sólido compatible que no es el de volumen máximo. | Con las tres vistas de un sólido, contar los cubitos de la vista frontal como si fueran todos. | Proyecciones (9 preguntas) |
| RME6 | **Contar cubos atravesados en vez de caras atravesadas** (o al revés). | Una barra cruza 3 cubitos en fila: «3 caras» (atraviesa 6). | Cubos atravesados por barras |

## Dados y dominó

| Código | Error | Ejemplo propio | Frecuencia |
| --- | --- | --- | --- |
| RME10 | **Olvidar que en el dado las caras opuestas suman 7.** | Si arriba hay 2, «abajo puede haber cualquiera». | Casi todas las de dados (trampa 8 de rm-a) |
| RME11 | **Contar como visibles la cara de abajo o las caras en contacto** entre dados. | Torre de 3 dados: sumar las 6 caras de cada uno menos solo la de abajo del primero. | Dados apilados, caras no visibles |
| RME12 | **Repetir fichas del dominó** (que son únicas) o contar (a, b) y (b, a) como fichas distintas. | «Hay 49 fichas en el dominó del 0 al 6» (son 28). | Dominó (3) |
| RME13 | **En el dado que rueda, subir la cara equivocada**: la que queda arriba al volcar hacia adelante es la que estaba atrás, no la de adelante. | Dado con 1 arriba y 2 adelante que rueda hacia adelante: «arriba queda 2» (queda la de atrás, 5). | Dado que rueda (4) |

## Rodamientos, giros y poleas

| Código | Error | Ejemplo propio | Frecuencia |
| --- | --- | --- | --- |
| RME20 | **Tomar la longitud de la pista como recorrido del centro**: olvidar los arcos en las esquinas que salen y el atajo en las que entran. | Rueda por fuera de un rectángulo: «el centro recorre el perímetro» (falta una vuelta de arcos). | Recorrido del centro (6) |
| RME21 | **Usar el radio equivocado**: el lado en vez de la diagonal en un vuelco, o el radio de la pista en vez del del centro. | Cuadrado que vuelca: todos los arcos con radio igual al lado. | Vuelcos, regiones barridas (6) |
| RME22 | **Usar el mismo ángulo en cada vuelco** cuando la figura o el piso no es regular. | Trapecio que vuelca: los cuatro giros de 90°. | Vuelcos de polígonos |
| RME23 | **No reducir el giro a menos de una vuelta, o girar en el sentido contrario.** | Girar 810° horario: «2 vueltas y 90° antihorario». | Giro y superposición, rotación en el plano |
| RME24 | **Tomar la simetría respecto de un punto como reflexión en un eje.** La simetría central es un giro de 180°. | Reflejar una letra respecto de un vértice y dibujarla como en un espejo. | Simetrías (trampa 4 de rm-a) |
| RME25 | **En una región barrida, sumar el perímetro de la figura sin los arcos** (o los arcos sin los tramos rectos). | Rectángulo que gira media vuelta: perímetro = la suma de los lados. | Región generada por rotación (3) |
| RME26 | **Olvidar que la faja cruzada y el contacto invierten el sentido** (la faja abierta y el eje no). | Cinco poleas en cadena: «todas giran igual». | Sentido de giro de poleas |
| RME27 | **Tomar iguales los desplazamientos en poleas solidarias**: en un mismo eje se comparte el ángulo, no el arco. | Poleas de 10 y 30 cm en un eje: si una cuerda baja 6 cm, «la otra sube 6» (sube 18). | Poleas y bloques (2) |
| RME28 | **Igualar vueltas en vez de longitudes de arco** cuando dos puntos marcados deben volver a tocarse. | Ruedas de 6 y 9 cm: «la chica da 9 vueltas hasta que vuelven a coincidir» (da 3: hace falta el mismo arco, 36π cm). | Coincidencias (3) |

RM5 (más dientes, más vueltas) sigue siendo el error de proporción en engranajes.

## Rutas y caminos

| Código | Error | Ejemplo propio | Frecuencia |
| --- | --- | --- | --- |
| RME30 | **Sumar las rutas de dos tramos en vez de multiplicarlas.** Cara de AR18 (enumeración sin sistema). | 3 caminos de A a B y 4 de B a C: «7 de A a C» (son 12). | Rutas por tramos (4) |
| RME31 | **No desarrollar la superficie y medir por el borde**, o desarrollar una sola vuelta cuando la hormiga da varias. | Hormiga que sube por fuera de un tarro dando 2 vueltas: «2 × la altura + 2 × la circunferencia». | Camino mínimo sobre superficie (4) |
| RME32 | **Repetir vértices o dejar fuera la condición de dirección** al contar rutas en un sólido de alambre. | Contar caminos que retroceden en un cubo de alambre cuando solo se permite avanzar. | Rutas en 3D (5) |

AR18 (enumeración sin sistema) tiene dato y se usa con `parcial` donde la opción es «olvidar rutas al listarlas».

## Papel, particiones y conteo de figuras

| Código | Error | Ejemplo propio | Frecuencia |
| --- | --- | --- | --- |
| RME40 | **No multiplicar el corte por las capas del doblez.** | Hoja doblada en cuatro y un agujero: «1 agujero al abrir» (4). | Papel doblado y cortado (4) |
| RME41 | **No ver las piezas que quedan unidas por el doblez** (o las que se separan). | Hoja doblada en dos y cortada por el medio: «4 piezas» (3: la del doblez queda entera). | Papel cortado: piezas |
| RME42 | **Cortar en línea recta sin buscar el borde más quebrado** cuando se pide el mayor perímetro. | Tablero de 4 × 4 en dos piezas congruentes: el corte recto da el menor perímetro, no el mayor. | Particiones congruentes (3) |
| RME43 | **Olvidar los tramos rectos o un arco compartido** en un perímetro con semicircunferencias. | Dos zonas con un arco común: contar ese arco una sola vez al sumar. | Perímetros con arcos |
| RME44 | **Contar dos veces las casillas de las esquinas**, que son comunes a dos lados (o al revés). | Marco de 5 × 5: «20 casillas en el borde» (16). | Casillas en bordes (trampa 7 de rm-a) |
| RME45 | **Olvidar las ubicaciones giradas o reflejadas** de una pieza al contar cuántas caben. | La L de 3 casillas en un tablero de 3 × 3: contar solo las que van como en el dibujo. | Conteo de piezas |

## Errores de los generadores (8 nov 2026)

Los abrieron los generadores de formato «predicciones». Todos son hipótesis.

| Código | Error | Módulo |
| --- | --- | --- |
| RME170 | Quitar una sola capa por medida (n − 1 en vez de n − 2) al contar cubitos con k caras pintadas. | cubitos-conteo |
| RME171 | Contar cubitos pintados en vez de caras pintadas. | cubitos-conteo |
| RME172 | Responder otra cantidad del problema: lo que se quita en vez de lo que queda, el total en vez de lo que falta, el volumen en vez del número de ladrillos. | cubitos-conteo |
| RME173 | Restar los cruces de dos en dos cuando tres túneles se cruzan en un mismo cubito. | cubitos-conteo |
| RME174 | Tomar como lado del cubo el producto de las medidas o la mayor de ellas, en vez del MCM. | cubitos-conteo |
| RME175 | Sumar los ladrillos que van en cada dirección en vez de multiplicarlos. | cubitos-conteo |
| RME176 | En el dominó, olvidar las fichas dobles. | dados-caras |
| RME177 | En el área exterior de una torre, olvidar la base cuando sí se cuenta, o las caras escalonadas de los costados. | cubitos-conteo |
| RME178 | Restar del total el extremo equivocado (el máximo en vez del mínimo, o al revés). | dados-caras |
| RME179 | No usar una condición del enunciado (la cara de arriba dada, la regla de los contactos, el producto). | dados-caras |
| RME180 | Creer que la faja abierta también invierte el sentido. | poleas-giros |
| RME181 | Contar las poleas que giran en el otro sentido (el complemento). | poleas-giros |
| RME182 | Equivocar si el bloque sube o baja, sin mirar de qué lado cuelga cada cuerda ni si la faja es cruzada. | poleas-giros |
| RME183 | Tomar el mismo ángulo en dos poleas unidas por faja: la faja comparte el arco, no el ángulo. | poleas-giros |
| RME184 | Contar la posición inicial como una de las coincidencias. | poleas-giros |
| RME185 | Dar el MCM (arco común o dientes) sin dividirlo entre el tamaño de la rueda. | poleas-giros |
| RME186 | Multiplicar rutas alternativas (una «o» la otra) en vez de sumarlas. | rutas-tramos |
| RME187 | No aplicar la condición de paso obligado o prohibido, o contar justo las que excluye. | rutas-tramos |
| RME188 | Con un cruce cerrado, restar una sola ruta en vez de todas las que pasan por él. | rutas-tramos |
| RME189 | En una cuadrícula, contar 2 opciones por cuadra (2^(m+n)) sin ver que las cuadras al este y al norte están fijas. | rutas-tramos |

## Errores de las escenas (12 nov 2026)

Los abrieron las escenas al construirse. Todos son hipótesis.

### cuadricula-piezas

| Código | Error |
| --- | --- |
| RME160 | Confundir área y perímetro: al rearmar un rectángulo como cuadrado, conservar el perímetro o tomar el área como perímetro o como lado; medir una pieza por su número de casillas. |
| RME161 | Rearmar solo con cortes rectos (tiras), con más trozos de los necesarios, o creer que no se puede. |
| RME162 | Olvidar caras al enchapar o pintar: los costados, o la que no se ve en el dibujo. |
| RME163 | Tomar un costado escalonado como si fuera el rectángulo lleno que lo encierra. |
| RME164 | Contar las 8 posiciones de una pieza simétrica aunque algunas coincidan. |
| RME165 | En el perímetro de las piezas, repartir el del total sin sumar los cortes, o sumar también los lados pegados. |
| RME166 | Contar también las figuras que no cumplen la condición (los cuadrados con casillas sombreadas). |
| RME167 | Extender el patrón de los primeros términos sin comprobarlo en la figura pedida. |
| RME168 | En una fracción de área por resta, equivocar las piezas que sobran (tomarlas iguales, olvidar la chica, quedarse con lo que sobra). |
| RME169 | Triángulos con puntos: no restar las ternas alineadas, o restar una por recta en vez de C(k, 3). |
| RME190 | Contar los marcos (rectángulos) donde cabe una pieza en vez de sus ubicaciones. |
| RME191 | Tomar la semicircunferencia como si fuera la circunferencia entera (πd). |

### vistas-cubitos

| Código | Error |
| --- | --- |
| RME100 | Leer la vista desde el lado contrario (la superior con el frente arriba, la lateral desde la izquierda). |
| RME101 | Sumar lo que se cuenta en las tres vistas (cuadraditos, regiones o esquinas) como si fuera del sólido. |
| RME102 | Tomar la caja entera (largo × ancho × alto) como sólido máximo. |
| RME103 | Poner un cubito por cuadradito de la superior, olvidando las alturas que piden la frontal y la lateral. |
| RME104 | Contar cuadraditos o puntos de la cuadrícula en vez de caras o vértices enteros. |
| RME105 | Suponer que el sólido tiene las 6 caras y los 8 vértices de una caja. |
| RME106 | Completar la caja que envuelve al sólido en vez del cubo. |
| RME107 | Suponer que la sucesión agrega siempre lo mismo. |
| RME108 | No comprobar que n³ sea múltiplo del volumen de la pieza. |
| RME109 | Confundir lo que se agrega con el total (copias en vez de cubitos, o el cubo entero). |
| RME192 | Al rodear un sólido, contar caras en vez de cubitos, sin ver que un cubito en una esquina entrante tapa dos caras. |
| RME193 | Contar solo las caras que salen en las vistas. |

RME3 (solo los cubitos visibles) se parece a GE13 de `geometria-ideas-erroneas.md` (Ben-Chaim, Lappan y Houang, 1985), que trata de contar cubitos de un sólido dibujado; aquí sigue como hipótesis.

### dados-domino

| Código | Error |
| --- | --- |
| RME120 | Suponer mal el período de un circuito: creer que tras una vuelta el dado queda como empezó, o contar de 4 en 4 vueltas como en línea recta. |
| RME121 | Seguir solo la cara de arriba del dado que rueda, sin actualizar los costados. |
| RME122 | Creer que dos dados con las opuestas que suman 7 son siempre el mismo dado girado (existen dados espejo). |
| RME123 | Tomar como opuestas dos caras solo porque nunca salen juntas en las vistas. |
| RME124 | Aplicar «las opuestas suman 7» a un cubo marcado que no es un dado común. |
| RME125 | Olvidar las fichas dobles del dominó (el generador dados-caras usa RME176 para lo mismo). |
| RME126 | No aplicar a todas las caras o puntajes una condición del enunciado (paridad, producto, suma fija, una pista). |
| RME127 | Olvidar la mitad en blanco (el 0) del dominó. |
| RME128 | En una cadena de dominó, elegir las fichas ocultas sin respetar que las mitades que se tocan son iguales. |
| RME129 | Responder el otro extremo (el máximo por el mínimo). |

### rutas-espacio

| Código | Error |
| --- | --- |
| RME140 | Aplicar la fórmula de la caja completa (n!/(a!b!c!)) a una estructura a la que le faltan cubitos o aristas. |
| RME141 | Contar solo las rutas más cortas cuando se piden todas las que no repiten punto. |
| RME142 | Al usar la simetría, duplicar también las rutas que van sobre el eje. |
| RME143 | En el recorrido máximo, creer que se recorren todas las aristas sin mirar los vértices impares. |
| RME144 | No aplicar «pasa por todos los puntos»: contar todas las rutas simples. |
| RME145 | En la hélice de k vueltas, tomar cada vuelta con toda la altura: k·√(h² + C²). |
| RME146 | No reflejar la pared de adentro al desarrollar el tarro (restar las distancias al borde en vez de sumarlas). |
| RME147 | Con dos cilindros tangentes, desarrollar uno solo. |
| RME148 | En el recorrido máximo, quitar un tramo por cada vértice impar en vez de uno por cada par de impares. |
| RME149 | Sumar lo que se repite en vez de quitarlo (confundir el máximo sin repetir con el mínimo que pasa por todo). |
| RME194 | Permutar todos los vértices de en medio sin mirar si hay alambre entre ellos. |
| RME195 | Tomar «sin repetir punto» como si fuera «sin repetir tramo» (o al revés) y dar el mismo número. |
| RME196 | Creer que, si se pueden repetir puntos, las rutas son infinitas aunque no se repitan tramos. |
| RME197 | En la franja, contar 2 opciones por punto (2^puntos) en vez de por columna. |
| RME198 | Duplicar el total por una vuelta o un sentido extra. |
| RME199 | Desarrollar una sola vuelta del cilindro cuando la hormiga da varias. |
| RME201 | Medir el camino por el aire (la recta entre los puntos) en vez de sobre la superficie. |

En rutas-espacio también se usan RME31, RME167 (seguir 2, 4, 6…), RME186 (multiplicar alternativas) y RME189 (tres opciones en cada paso: 3^n).

### papel-doblado

| Código | Error |
| --- | --- |
| RME150 | Tomar el doblez de un rectángulo, cuando se juntan vértices opuestos, por la diagonal que los une o por su mitad. |
| RME151 | No usar que el doblez es la mediatriz (EA = EC): suponerlo paralelo a un lado, cortando el lado en su punto medio, o con la hipotenusa equivocada. |
| RME152 | Copiar el corte corrido a su lugar sin reflejarlo: todas las copias con la misma orientación. |
| RME153 | Desdoblar solo uno de los dobleces (salen copias de menos). |
| RME154 | Contar una jugada por ficha distinta, como si se volteara una por vez. |
| RME155 | No usar la paridad ni que una ficha puede voltearse varias veces: dividir las distintas entre k, voltear cada grupo una vez, o creer que siempre se puede. |
| RME156 | Creer que dos reflexiones seguidas se anulan; en rectas que se cortan dan un giro. |
| RME157 | Contar los tajos como piezas (en una tira, las piezas son una más que los tajos). |
| RME158 | Tomar los pedazos de un corte sobre un doblez como figuras aparte y contar como borde sus tramos sobre el doblez. |
| RME159 | Creer que, en un corte sobre un doblez, cada capa da la figura entera. |
| RME200 | Extender la paridad de los volteos de a dos a los volteos de a tres. |
