# Encargo para Codex: Física, Oscilaciones (Etapa 11), y después Fluidos (Etapa 12)

26 nov 2026. Mientras Claude cierra la Etapa 9 (siete cursos, más la auditoría de tus dos unidades de física),
Codex sigue con la rama de **física**, que nadie más toca. Mismo método de antes: `docs/metodo/unidad/etapa-delegada.md`,
con la investigación de `docs/investigacion/etapa11/` (breve en `breve/fisica.oscilaciones.md`) y después la de
`etapa12/` para Fluidos.

- Rama propia desde `main`: `codex/etapa11-fisica-oscilaciones` (y después `codex/etapa12-fisica-fluidos`).
- No toques otros cursos. Los archivos compartidos (`nucleo/avance.js`, `catalogo/pruebas/verificar.js`,
  `catalogo/pruebas/fisica.json`, piezas comunes) solo con un bloque propio y aditivo al final de su sección.
- Sin `calidad: 2`. Al terminar, el informe con «Listo para integrar».

## Lo que encontraron los lectores en frío en Impulso y choques y en Gravitación (evítalo desde el principio)

Tus cuentas salieron bien en las dos unidades: ningún lector encontró un número malo. Lo que falló fue la
presentación, y solo se ve en las capturas.

1. **Notación cruda.** Salieron `v_f,x`, `P_tot al,x`, `F_x (N)`, `m_A·v_A,x`, `g_superficie`, `escnueva` con guion
   bajo o pegados, en Datos, resueltos, leyendas y ejes. Todo subíndice va con los nodos de ecuación del núcleo
   (mira cómo lo hace `contenido/teoria/fisica/trabajo-y-energia.js`), nunca como texto con «_».
2. **Texto de los dibujos.** En Gravitación los rótulos del SVG salían partidos por letra («Ref er encia») y con
   letras cambiadas («ϹM» por «GM»). Usa los rótulos de las piezas existentes (`nucleo/kit/`) y no inventes una forma
   nueva de escribir texto en SVG.
3. **Datos no regalan el camino.** En «Así se resuelve», «Ahora tú» y las tarjetas, Datos traía la fórmula ya armada
   para el caso. Datos da valores, unidades y equivalencias que el alumno no puede inferir; la fórmula la pone él.
   Tampoco conversiones que no se usan (min, h, MJ, «1 km/s = 1000 m/s» si no hace falta).
4. **Lo distinto se ve distinto.** Radios de órbitas distintos dibujados iguales; carritos con posiciones distintas
   en la misma columna; carritos que van a chocar dibujados en pistas separadas. Si dos medidas comparables difieren,
   el dibujo lo muestra a escala (o dice «El dibujo no está a escala» y aun así respeta el orden).
5. **Nada antes de enseñarlo.** La Predice de restitución usaba e = separación/acercamiento sin haberlo dicho; en
   Kepler, «Así se resuelve» pedía r_p = a(1 − e), que la regla no enseña.
6. **Una letra, un significado.** «a» era semieje y subíndice de «lejano»; «A» y «B» eran cuerpos y alternativas.
7. **Los resueltos difíciles no se saltan el despeje.** En nivel 3 (tarjetas 8 y 14) el resuelto pasaba de la
   fórmula al número sin reemplazar ni despejar.
8. **Sin jerga.** «Impacto frontal pasivo», «usa la solución con separación», «una balanza mide apoyo», «la energía
   mecánica fija si la sonda retorna», «Progreso del ensayo 0,06», «Parte del intervalo (0 inicio, 1 final)».
   Escribe para un alumno de 5.º de secundaria.
9. **Controles que cuadran con el dibujo.** El deslizador decía 23 kg y el dibujo 23,5 kg; un reloj que corre
   mientras «solo se muestra el estado inicial».
10. **Predice con números limpios.** Una alternativa «≈ 3,674 m/s» no es una predicción; el resultado 2,977… m en
    «Así se resuelve» tampoco ayuda.
11. **Un color por variable.** g y GM salían en negro después de que M era morada.

Si tu entorno puede correr Playwright: `MESA_URL=http://localhost:<PORT> node herramientas/capturas-teoria.js
<UNIDAD> <carpeta> momentos,ejemplos` y mira cada captura antes de entregar. Si no puede, dilo en el informe y
Claude las saca en el cierre.
