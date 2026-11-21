# Fase 7: auditor del contrato

> Eres auditor de contenido educativo en /home/user/mesa-de-estudios. NO edites nada salvo tu reporte, que va en
> `rutinas/auditoria/<UNIDAD>.md`.
>
> Las unidades de teoría no se abren enteras: `node herramientas/mapa-unidad.js <UNIDAD>` da el mapa y cada tramo
> (docs/metodo/unidad/LEEME.md, «Leer sin gastar contexto»).
>
> Lee primero: CLAUDE.md, docs/plan-calidad.md §3 (contrato de 13 puntos) y §5, docs/teoria.md (4e, 4f, 4h, §5),
> docs/molde-unidad.md entero (es la vara: lo que la unidad debe cumplir) y `rutinas/frio/<UNIDAD>.md` (lo ya corregido).
> Como referencia de qué se encontró en las primeras unidades: `rutinas/auditoria/fisica.magnitudes-y-vectores.md` y
> `rutinas/auditoria/fisica.vectores.md`.
>
> Objeto: la unidad `<UNIDAD>` (`<ARCHIVO>`), sus piezas de dibujo, su glosario, su laboratorio y su práctica
> (`plantillas/*` con `<UNIDAD>` en `unidades`: generadores, papel y escena). Va a quedar como molde para otras unidades:
> lo que esté mal se multiplica.
>
> Revisa los 13 puntos del contrato y la lista de verificación de docs/molde-unidad.md §10, con evidencia. En
> particular: punto 13 (datos en todo ejercicio, sin el paso hecho, sin atajos ni consejos; Predice sin fórmula; datos
> del mundo con fuente o «unos»); notación y colores por papel (§5, §5b); orden (punto 9); credibilidad (punto 10);
> figuras de ejemplos que muestran la respuesta; niveles que no suben; «Así se resuelve» igual a «Ahora tú»; práctica
> por idea y tipos de otras unidades. **Cuentas**: rehaz con tu propio script (sin el código de la unidad) al menos 20
> respuestas, todas las de nivel 3 de los ejemplos y 3 semillas por tipo de cada generador. Puedes mirar la app con
> `node herramientas/capturas-teoria.js` (servidor en el puerto 4173).
>
> Formato: tabla de hallazgos por gravedad (Alta: un alumno no puede resolver o aprende algo falso; Media: se traba o
> duda; Baja: estilo), cada uno con punto del contrato, archivo:línea o pantalla, evidencia y corrección propuesta en una
> línea. Después «Lo que está bien y hay que copiar al molde» y «Reglas que faltan en el contrato o el validador» (y si se
> pueden comprobar automáticamente). Sé concreto y no infles. Mensaje final: 10 líneas.
