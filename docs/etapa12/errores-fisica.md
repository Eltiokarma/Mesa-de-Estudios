# Errores de diseño de Fluidos — etapa 12

Las operaciones de esta ficha son hipótesis propias para construir distractores calculables. No son frecuencias observadas, códigos extraídos de estudios ni atribuciones a postulantes peruanos. Todas llevan `respaldo: hipotesis`.

Cada alternativa se obtiene aplicando una operación concreta a las entradas visibles del caso. Se verifica su valor, escala, explicación y diferencia frente a la correcta. No se agregan números para completar la lista. La existencia de esta ficha no acredita por sí sola que el generador haya pasado las pruebas; los resultados se consignan en el informe de la unidad.

Las familias mantienen las condiciones del modelo: referencias absolutas o manométricas explícitas, equilibrio según el montaje, peso y empuje con sentidos definidos, película con número de interfaces visible, capilaridad de contacto nulo y flujo ideal estacionario. Una operación errónea no cambia silenciosamente esas condiciones.

## Operaciones de la práctica propia

| Código | Operación hipotética aplicada |
|---|---|
| FLP-BAROMETRO-REFERENCIA-INVIERTE_ALTURAS | Invertiste la razón de alturas entre las dos lecturas. |
| FLP-BAROMETRO-REFERENCIA-OMITE_TOPE_FINAL | Supusiste vacío sobre la segunda columna. |
| FLP-BAROMETRO-REFERENCIA-OMITE_TOPE_INICIAL | Supusiste vacío sobre la primera columna. |
| FLP-BERNOULLI-DESNIVEL-CONSERVA_RAPIDEZ | Conservaste la rapidez aunque cambió el área. |
| FLP-BERNOULLI-DESNIVEL-DUPLICA_AREA_ORIFICIO | Usaste el doble del área de salida al hallar rapidez. |
| FLP-BERNOULLI-DESNIVEL-INVIERTE_CAMBIO_ALTURA | Cambiaste el signo de la contribución de altura. |
| FLP-BERNOULLI-DESNIVEL-INVIERTE_CAMBIO_CINETICO | Cambiaste el signo de la contribución de rapidez. |
| FLP-BERNOULLI-DESNIVEL-OMITE_FACTOR_DOS | Omitiste el dos que proviene de la energía cinética. |
| FLP-BERNOULLI-DESNIVEL-USA_CAUDAL_COMO_RAPIDEZ | Tomaste la cifra de caudal como rapidez. |
| FLP-CAPILARIDAD-RADIO-CONVERSION_ALTURA_POR_DIEZ | Dividiste los centímetros entre diez en vez de cien. |
| FLP-CAPILARIDAD-RADIO-DA_RADIO | Entregaste el radio cuando se pidió el diámetro. |
| FLP-CAPILARIDAD-RADIO-OMITE_CARAS_CALIBRACION | Calibraste el coeficiente como si la película tuviera una sola cara. |
| FLP-CAPILARIDAD-RADIO-OMITE_FACTOR_DOS | Omitiste el factor dos al despejar el radio. |
| FLP-CAUDAL-VOLUMEN-DIVIDE_TIEMPO_DOS_VECES | Dividiste dos veces entre la duración. |
| FLP-CAUDAL-VOLUMEN-INVIERTE_COCIENTE | Dividiste tiempo entre volumen. |
| FLP-CAUDAL-VOLUMEN-OMITE_TIEMPO | Diste el volumen recogido como si fuera caudal. |
| FLP-COEFICIENTE-PELICULA-DUPLICA_CARAS | Contaste otra vez las dos caras de la película. |
| FLP-COEFICIENTE-PELICULA-IGNORA_PESO | Atribuiste toda la fuerza de sostén a la película. |
| FLP-COEFICIENTE-PELICULA-SUMA_PESO | Sumaste el peso en vez de descontarlo del sostén. |
| FLP-COLUMNAS-INMISCIBLES-DA_COLUMNA_BASE | Diste la columna equivalente del líquido más denso. |
| FLP-COLUMNAS-INMISCIBLES-DA_COLUMNA_LIGERA | Diste toda la altura del líquido añadido. |
| FLP-COLUMNAS-INMISCIBLES-INVIERTE_DENSIDADES | Invertiste las densidades al igualar las presiones. |
| FLP-CONTINUIDAD-SECCIONES-CONSERVA_RAPIDEZ | Conservaste la rapidez en vez del caudal. |
| FLP-CONTINUIDAD-SECCIONES-CUADRA_AREAS | Elevaste al cuadrado una razón que ya compara áreas. |
| FLP-CONTINUIDAD-SECCIONES-INVIERTE_AREAS | Invertiste la razón de áreas. |
| FLP-CONTINUIDAD-SECCIONES-USA_DIAMETROS | Usaste diámetros directamente como si fueran áreas. |
| FLP-DENSIDAD-DOS-LECTURAS-SUMA_EN_DENOMINADOR | Sumaste las lecturas para hallar el empuje. |
| FLP-DENSIDAD-DOS-LECTURAS-SUMA_EN_NUMERADOR | Sumaste ambas lecturas para hallar el peso del cuerpo. |
| FLP-DENSIDAD-DOS-LECTURAS-USA_LECTURA_LIQUIDO | Calculaste la masa con la lectura dentro del líquido. |
| FLP-DENSIDAD-MUESTRA-DIVIDE_VOLUMEN_DOS_VECES | Dividiste dos veces entre el volumen. |
| FLP-DENSIDAD-MUESTRA-INVIERTE_COCIENTE | Dividiste volumen entre masa. |
| FLP-DENSIDAD-MUESTRA-MULTIPLICA_VOLUMEN | Multiplicaste masa por volumen. |
| FLP-EQUILIBRIO-CUERPO-DA_PORCENTAJE_EMERGIDO | Diste la parte emergida en lugar de la sumergida. |
| FLP-EQUILIBRIO-CUERPO-INVIERTE_DENSIDADES | Invertiste la razón de densidades al hallar la fracción. |
| FLP-EQUILIBRIO-CUERPO-SUMA_FUERZAS | Sumaste peso y empuje pese a sus sentidos opuestos. |
| FLP-EQUILIBRIO-CUERPO-USA_EMPUJE_SOLO | Tomaste el empuje como tensión y omitiste el peso. |
| FLP-EQUILIBRIO-CUERPO-USA_PESO_SOLO | Tomaste el peso como tensión y omitiste el empuje. |
| FLP-EQUILIBRIO-CUERPO-USA_VOLUMEN_TOTAL | Supusiste que todo el cuerpo estaba sumergido. |
| FLP-FUERZA-PISTONES-CONSERVA_FUERZA | Conservaste la fuerza en vez de la presión añadida. |
| FLP-FUERZA-PISTONES-CUADRA_AREAS | Elevaste al cuadrado una razón que ya compara áreas. |
| FLP-FUERZA-PISTONES-INVIERTE_AREAS | Invertiste la razón de áreas. |
| FLP-MANOMETRO-SIGNO-CONFUNDE_DESNIVEL_CON_DOBLE | Tomaste la mitad del desnivel total indicado. |
| FLP-MANOMETRO-SIGNO-DUPLICA_DESNIVEL | Duplicaste un dato que ya era la separación entre superficies. |
| FLP-MANOMETRO-SIGNO-INVIERTE_SIGNO | Intercambiaste cuál superficie está más alta. |
| FLP-PELICULA-CARAS-CAMBIA_NUMERO_CARAS | Contaste dos interfaces cuando solo hay una. |
| FLP-PELICULA-CARAS-USA_AREA_EN_VEZ_CONTACTO | Elevaste al cuadrado el contacto como si se pidiera un área. |
| FLP-PELICULA-CARAS-USA_COEFICIENTE_COMO_FUERZA | Diste el coeficiente como si fuera una fuerza. |
| FLP-PRENSA-DESNIVEL-INVIERTE_DESNIVEL | Aumentaste la presión al subir. |
| FLP-PRENSA-DESNIVEL-OMITE_DESNIVEL | Conservaste la presión pese al cambio de altura. |
| FLP-PRENSA-DESNIVEL-USA_AREA_ENTRADA | Aplicaste la presión de salida al área del otro pistón. |
| FLP-PRESION-CARA-CONVERSION_AREA_POR_DIEZ | Dividiste el área entre mil en vez de diez mil. |
| FLP-PRESION-CARA-DUPLICA_CARA | Sumaste otra cara que no recibe esa fuerza. |
| FLP-PRESION-CARA-USA_FUERZA_COMO_PRESION | Diste la cifra de fuerza como presión. |
| FLP-RECORRIDO-VOLUMEN-CUADRA_AREAS | Volviste a elevar al cuadrado la razón de áreas. |
| FLP-RECORRIDO-VOLUMEN-OMITE_CAMBIO_DE_AREA | Asignaste a ambos pistones el mismo recorrido. |
| FLP-RECORRIDO-VOLUMEN-USA_DIAMETROS | Usaste la razón de diámetros como razón de áreas. |
| FLP-REFERENCIA-PROFUNDIDAD-MULTIPLICA_MUESTRA | Calculaste densidad multiplicando masa por volumen. |
| FLP-REFERENCIA-PROFUNDIDAD-OMITE_REFERENCIA | Omitiste restar la presión superficial. |
| FLP-REFERENCIA-PROFUNDIDAD-SUMA_REFERENCIA | Sumaste ambas presiones en lugar de restarlas. |
| FLP-VOLUMEN-DESPLAZADO-OMITE_GRAVEDAD | Diste la masa desplazada como si fuera una fuerza. |
| FLP-VOLUMEN-DESPLAZADO-USA_VOLUMEN_EMERGIDO | Tomaste la parte emergida como volumen desplazado. |
| FLP-VOLUMEN-DESPLAZADO-USA_VOLUMEN_TOTAL | Usaste también el volumen que está fuera del líquido. |

## Hipótesis de los pares de reserva del curso — etapa 12

Estas seis operaciones fueron construidas para los dos pares propios `flu-01` y `flu-02`.
Su resultado numérico se verifica con balances independientes. No constituyen frecuencias observadas
ni evidencia empírica de postulantes peruanos; todas tienen respaldo `hipotesis`.

| Código | Operación que produce el distractor | Formas A / B |
| --- | --- | --- |
| FL12-C-PESO | Omitir todo el empuje y dar el peso del cuerpo como lectura. | 18 / 24 N |
| FL12-C-DENSIDAD-INFERIOR | Calcular todo el volumen desplazado con la densidad inferior y restar ese empuje al peso. | 6 / 7,5 N |
| FL12-C-EMPUJE | Dar el empuje de ambos líquidos como lectura del dinamómetro. | 10,4 / 14,1 N |
| FL12-C-SIN-ALTURA | Aplicar continuidad pero eliminar el término de altura del balance energético. | 140 / 158,5 kPa |
| FL12-C-ALTURA-INVERTIDA | Tratar el descenso como un ascenso en el balance energético. | 130 / 138,5 kPa |
| FL12-C-SIN-CINETICA | Mantener la altura pero omitir el cambio de energía cinética. | 156 / 192 kPa |

En `flu-01` se pregunta la lectura de un dinamómetro que sostiene un cuerpo totalmente sumergido en
dos líquidos inmiscibles. Las respuestas son 7,6 N y 9,9 N. En `flu-02` se aplica continuidad y
Bernoulli a un flujo estacionario con descenso; las respuestas son 150 kPa y 178,5 kPa.
Los casos declaran sus condiciones. Las cuatro formas tienen una sola respuesta correcta;
se comprueba aparte que ninguna alternativa copia un dato del enunciado.
