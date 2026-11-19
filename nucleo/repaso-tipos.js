/*
 * A qué unidad del catálogo pertenece cada problema de un generador que cubre varias unidades (cola de repaso).
 * El repaso pregunta «¿Qué tipo de problema es?» y solo repasa una unidad con problemas que sean de ella; un generador
 * mixto (sistemas-ecuaciones trae trazas de matrices) no lo dice, así que esta tabla lo dice por variante.
 *
 * CLASIFICACIÓN HECHA POR UN MODELO (13 nov 2026), leyendo un enunciado de muestra de cada variante contra los
 * temas de las unidades del generador. Nadie la revisó todavía. Solo se mapeó lo que tenía una unidad clara; lo
 * dudoso quedó fuera (esa variante no se usa en el repaso, pero sigue en la práctica). Para corregir una fila,
 * cámbiala aquí: herramientas de prueba en nucleo/repaso-tipos.test.js.
 *
 * Clave de cada variante: problema._datos.tipo; en quimica-conceptos, _datos.tema o _datos.conjunto (sus tipos son
 * formatos: V/F, correcta, incorrecta, relacionar). Un generador puede además devolver p.unidadCatalogo: manda.
 * Funciona en el navegador (window.RepasoTipos) y en Node (require).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RepasoTipos = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const F = 'fisica.', Q = 'quimica.', AL = 'algebra.', AR = 'aritmetica.', G = 'geometria.', T = 'trigonometria.', RM = 'razonamiento-matematico.';
  const todo = (u, ks) => Object.fromEntries(ks.map(k => [k, u]));
  const TABLA = {
    // 18 nov: «MRU, MRUV y caída libre» se partió (docs/etapa4/decisiones.md): las medias y la ida y vuelta son de
    // Movimiento rectilíneo uniforme; la gráfica v–t y la ecuación horaria, de MRUV y caída libre.
    'cinematica-medias': { vt: F + 'mruv-y-caida-libre', ecuacion: F + 'mruv-y-caida-libre', idavuelta: F + 'movimiento-rectilineo', media: F + 'movimiento-rectilineo',
      // 19 nov: «Movimiento parabólico y circular» se partió (docs/etapa5/propuesta-fisica.md): el plano x–y es de
      // Movimiento parabólico (conserva el id); la latitud, de Movimiento circular.
      xy: F + 'movimiento-parabolico-y-circular', latitud: F + 'movimiento-circular' },
    'clasificar-reacciones': todo(Q + 'reacciones-y-balance', ['aguaDura', 'redoxSet', 'aLaVez', 'rol', 'vf', 'calor', 'tipoEnergia', 'tipo', 'relacionar', 'dismutacion']),
    // 'vida-media' ya no va a Materia y energía (17 nov: esa unidad tiene su plantilla vida-media y salió de esta ficha);
    // queda sin fila, fuera del repaso, como lo dudoso.
    // 18 nov (etapa 4, propuesta de Estructura atómica §9): la ficha se separa por unidad. Tabla periódica: ubicar y
    // familia. Estructura atómica: los tipos de sus ideas 1, 4, 5 y 6; con { unidad } el generador arma los suyos (también
    // neutro, valencia y magnetico, que solo salen ahí) y los marca con p.unidadCatalogo. Esta fila clasifica los que salen
    // sin unidad.
    'configuracion-ubicacion': { ubicar: Q + 'tabla-periodica', familia: Q + 'tabla-periodica',
      ...todo(Q + 'estructura-atomica', ['anomala', 'cuanticos', 'cation', 'atomo-ion', 'desapareados', 'particulas', 'anion', 'contar']) },
    // 18 nov: conversiones-quimica ya no sirve a Estructura atómica (sus longitudes en Å salieron de esa unidad).
    'conversiones-quimica': todo(Q + 'materia-y-energia', ['latente', 'densidad', 'vida', 'delta', 'lectura']),
    'dinamica-fuerzas': { resorte: F + 'dinamica', motriz: F + 'dinamica', peralte: F + 'dinamica', tabla: F + 'dinamica', plataforma: F + 'dinamica',
      escalera: F + 'estatica', astro: F + 'gravitacion', gravitatoria: F + 'gravitacion' },
    // 19 nov (cierre de División de polinomios, rutinas/auditoria/algebra.division-de-polinomios.md): division-polinomios
    // sale de esa unidad (trae MCD y MCM, de Factorización, y la unidad tiene su práctica division-practica). Queda solo
    // para Factorización: ya no es mixto y sale de la tabla.
    // 19 nov (etapa 7, docs/etapa7/propuesta-algebra.md, decisión 9): el generador sale de Factorización (daba Cardano-Vieta
    // y bicuadradas en su examen); su tipo divisores (una raíz racional no entera) es de Ecuaciones polinomiales.
    'ecuaciones-polinomiales': todo(AL + 'ecuaciones-polinomiales', ['parametro', 'vieta', 'caja', 'conjugada', 'multiple', 'bicuadrada', 'igualar', 'divisores']),
    'estadistica-datos': todo(AR + 'estadistica', ['varianza', 'central', 'medias', 'reconstruir', 'extremo']),
    // El tipo de problema es estequiometría aunque el contexto sea una grasa o una mena.
    'estequiometria-admision': todo(Q + 'estequiometria', ['grasa', 'termo', 'hidroxido', 'mineral', 'redox', 'flotacion', 'atomos']),
    // 19 nov (etapa 7, docs/etapa7/propuesta-aritmetica.md): fracciones-problemas deja de servir a MCD y MCM (la unidad
    // tiene su práctica mcd-mcm, por idea). Queda solo para Números racionales: ya no es mixto y sale de la tabla.
    'funciones-dominio-rango': { ...todo(AL + 'funciones', ['racional-simplificable', 'rango-exp-abs', 'dominio-radicales', 'area-entero-abs', 'composicion']),
      ...todo(AL + 'tipos-de-funciones-e-inversa', ['inyectiva-restringir', 'clasificar-verbal', 'costo-recipiente', 'monotonia-vf']),
      ...todo(AL + 'exponenciales-y-logaritmos', ['log-entero', 'logistico', 'dominio-log']) },
    // 19 nov (etapa 6): geo-areas-circulares deja de servir a Longitud de arco (tiene su práctica trig-arco-sector): ya no
    // es mixto y sale de la tabla.
    'geo-circunferencia-metrica': { ...todo(G + 'circunferencia', ['tangentes-iguales', 'tangente', 'pitot', 'inscriptible', 'poncelet']),
      ...todo(G + 'relaciones-metricas', ['secantes', 'cuerdas', 'arcos-cuerdas']) },
    // 19 nov (etapa 6): geo-poligonos queda solo para Polígonos regulares; Polígonos y cuadriláteros usa
    // geo-poligonos-cuadrilateros (docs/etapa6/propuesta-geometria.md, decisión 13). Ya no es mixto: sale de la tabla.
    'geo-proporcionalidad': todo(G + 'proporcionalidad-y-semejanza', ['bisectriz', 'raices-areas', 'incentro', 'cuerdas', 'bis-semejanza', 'thales']),
    // 18 nov (docs/etapa4/decisiones.md): la condición de obtusángulo (x² frente a a² + b²) va a Relaciones métricas, y
    // las bisectrices con 37°/2 y 53°/2, a Puntos notables, igual que TIPOS_POR_UNIDAD del generador.
    'geo-triangulos-notables': { obtusangulo: G + 'relaciones-metricas', ...todo(G + 'puntos-notables', ['ortocentro', 'arco', 'angulos', 'mitades']) },
    'inecuaciones-planteo': { ...todo(AL + 'inecuaciones', ['discriminante', 'area', 'moviles', 'entero-unico', 'cuadratica-entera']),
      ...todo(AL + 'programacion-lineal', ['lineal-entera', 'dos-enteros']), 'valor-absoluto': AL + 'valor-absoluto-y-radicales',
      racional: AL + 'numeros-reales', medias: AL + 'numeros-reales' },
    'nombre-polifuncional': todo(Q + 'funciones-organicas', ['oxidacion', 'sufijo', 'nombre', 'cadena', 'ester', 'amina']),
    'numeros-sucesiones': { ...todo(AR + 'sucesiones-y-series', ['fracciones', 'intercalada', 'sumatoria', 'pa-pg', 'comunes']),
      ...todo(AR + 'numeros-primos-y-divisores', ['divisores', 'primos-pa']), grupos: AR + 'divisibilidad',
      ...todo(AR + 'numeracion', ['grifos', 'cifras']), cubos: AR + 'potenciacion-y-radicacion' },
    'porcentajes-planteo': { ...todo(AR + 'porcentajes', ['dimensiones', 'sistema', 'encadenados', 'sobrante', 'tramos', 'doble-entrada', 'partes']),
      conjuntos: AR + 'conjuntos', llegadas: AR + 'razones-y-proporciones', extracciones: AR + 'mezclas-y-aleaciones' },
    'probabilidad-conteo': { ...todo(AR + 'probabilidades', ['bloques-prob', 'bayes', 'exactamente', 'traspaso']), ...todo(AR + 'analisis-combinatorio', ['circular', 'fila']) },
    'quimica-conceptos': {
      pourbaix: Q + 'electroquimica', pilas: Q + 'electroquimica', 'celda-metanol': Q + 'electroquimica',
      sustancias: Q + 'materia-y-energia', ramas: Q + 'materia-y-energia',
      ...todo(Q + 'biomoleculas-y-productos-naturales', ['cadenas-laterales', 'derivados-glucosa', 'aldosas-cetosas', 'proteinas', 'carotenoide', 'alimentos', 'vitaminas', 'coenzimas', 'precursores', 'funciones']),
      ...todo(Q + 'enlace-quimico', ['hidruros', 'ionicos']),
      ...todo(Q + 'hidrocarburos', ['isomeros-geometricos', 'hidrogenacion']),
      // 18 nov: con { unidad: Estructura atómica } salen solo sus temas (y el nuevo «isotopos», marcado con
      // p.unidadCatalogo); «ion-sodio» es un tema de Tabla periódica (radio del ion y periodo) y va allá.
      ...todo(Q + 'estructura-atomica', ['modelos', 'rutherford', 'dalton', 'cientificos']), 'ion-sodio': Q + 'tabla-periodica',
      'equilibrio-sangre': Q + 'equilibrio-quimico', 'lewis-bronsted': Q + 'acidos-y-bases',
      ...todo(Q + 'liquidos-y-solidos', ['liquidos', 'solidos', 'tipo-solido', 'solido-propiedad', 'solido-ejemplo']),
      ...todo(Q + 'ambiente-y-quimica-aplicada', ['esferas', 'contaminantes', 'tendencia', 'suelo-aire']),
      ...todo(Q + 'funciones-organicas', ['hidratacion-oxidacion', 'fermentacion', 'paba']),
      metalurgia: Q + 'recursos-naturales', ...todo(Q + 'nomenclatura-inorganica', ['oxidos', 'sales-acidas']),
    },
    'refraccion-snell': todo(F + 'optica-geometrica', ['rapidez', 'angulo', 'limite', 'indice', 'fondo', 'ensayos']),
    'rm-ciclos': { ...todo(RM + 'razonamiento-inductivo', ['figuras', 'espiral', 'unidades']), canciones: RM + 'frecuencia-de-sucesos' },
    'rm-deduccion': todo(RM + 'razonamiento-deductivo', ['asignacion', 'silogismo', 'siempre-cierto', 'puntajes']),
    'rm-diofanticas': { ...todo(RM + 'maximos-y-minimos', ['borrar', 'monedas', 'expresion', 'tres-precios', 'grupos']), ...todo(RM + 'planteo-de-ecuaciones', ['dos-articulos', 'alcanza', 'reparto']) },
    'rm-fichas': { ...todo(RM + 'transformaciones-de-figuras', ['lineal', 'semejanza', 'contorno', 'petalo']), ...todo(RM + 'maximos-y-minimos', ['cajas', 'hexagonos']),
      ...todo(RM + 'razonamiento-inductivo', ['fibonacci', 'medios']) },
    'rm-movimientos': todo(RM + 'traslados-y-puntos-cardinales', ['bocas', 'tubo', 'salto', 'caballo', 'canoa', 'pares']),
    'rm-parentesco': { orden: RM + 'ordenamiento-de-informacion', ...todo(RM + 'razonamiento-deductivo', ['edades', 'arbol', 'minimo', 'cadena', 'billetes']) },
    'rm-planteo': { ...todo(RM + 'planteo-de-ecuaciones', ['pista', 'progresion', 'canje', 'diana', 'cortes']), torneo: RM + 'tablas-graficos-y-suficiencia' },
    // 18 nov (Gerson, cuarta ronda): sistemas-ecuaciones salió de «Exponentes y radicales», que repasa con su propia
    // plantilla (exponentes-radicales, de una sola unidad); el tipo exponencial queda sin fila, fuera del repaso.
    'sistemas-ecuaciones': { ...todo(AL + 'sistemas-de-ecuaciones', ['vandermonde', 'parametro', 'enteros', 'trabajo']), matriz: AL + 'matrices-y-determinantes',
      ...todo(AL + 'ecuaciones-lineales-y-cuadraticas', ['vieta', 'franja']), 'valor-absoluto': AL + 'valor-absoluto-y-radicales' },
    'soluciones-meq-ppm': todo(Q + 'soluciones', ['meq', 'igualar', 'ppmGas', 'ppmMasa', 'mezcla', 'jarabe', 'preparar', 'precipitacion', 'masa', 'carbonato', 'volumen', 'volumen-pct']),
    'trig-angulos-verticales': todo(T + 'triangulos-rectangulos', ['entre-edificios', 'mismo-lado', 'puente-simbolico', 'mitad-cima', 'movimiento', 'condicion-angulo', 'ambos-lados', 'objeto-elevado', 'dron-camino']),
    'trig-extremos': { ...todo(T + 'funciones-trigonometricas', ['cuadratica', 'racional', 'puerta', 'senoide']), 'area-ct': T + 'circunferencia-trigonometrica' },
    'trig-identidades': { ...todo(T + 'arcos-multiples', ['triple-producto', 'reduccion-doble', 'triangulo-doble', 'maximo', 'acotar', 'cadena']),
      ...todo(T + 'arcos-compuestos', ['condicional', 'terreno']), ...todo(T + 'identidades-fundamentales', ['suma-k', 'cofuncion']) },
    'trig-oblicuangulos': { ...todo(T + 'triangulos-oblicuangulos', ['circunradio', 'faro', 'ley-tangentes']), ...todo(T + 'areas-y-lineas-notables', ['lado-minimo', 'ceviana', 'areas']) },
    'velocidad-relativa': { ...todo(F + 'movimiento-rectilineo', ['cruce', 'marco', 'idavuelta']), botes: F + 'impulso-y-choques', bote: F + 'vectores' },
  };

  /*
   * Problemas de lápiz y papel (plantillas/<id>/papel.json) de las escenas que cubren varias unidades: a qué unidad
   * (o unidades) pertenece cada uno. Las escenas de una sola unidad no necesitan fila. También CLASIFICADO POR UN
   * MODELO (13 nov 2026) leyendo cada enunciado; lo dudoso quedó fuera. El repaso usa el papel solo en las unidades que
   * no tienen generador (orden de Gerson, 14 nov 2026).
   */
  const lista = (u, ids) => Object.fromEntries(ids.map(k => [k, u]));
  const ps = (...n) => n.map(x => 'p' + x);
  const PAPEL = {
    conjuntos: lista([AR + 'conjuntos', AL + 'logica-y-conjuntos'], ps(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)),
    logica: lista([AR + 'logica-proposicional', AL + 'logica-y-conjuntos'], ps(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)),
    polinomios: { ...lista(AL + 'polinomios', ps(1, 2, 3, 4)), ...lista(AL + 'division-de-polinomios', ps(5, 6, 7, 8, 10)), p9: AL + 'ecuaciones-polinomiales' },
    sucesiones: { ...lista([AL + 'sucesiones-y-series', AR + 'sucesiones-y-series'], ps(1, 2, 4, 5, 6, 7, 8)), ...lista(RM + 'razonamiento-inductivo', ps(3, 9)) },
    'regla-de-tres': { ...lista(AR + 'razones-y-proporciones', ps(1, 2, 3)), ...lista(AR + 'magnitudes-proporcionales', ps(4, 5, 6, 7, 8, 9)), p10: RM + 'ruedas-poleas-engranajes' },
    solidos: { ...lista(G + 'prisma-y-piramide', ps(1, 2)), ...lista(G + 'solidos-de-revolucion', ps(3, 4, 5, 6, 7, 8, 10)), p9: G + 'poliedros' },
    // 17 nov: la escena del cuadrado que crece sirve a las dos mitades de «Exponentes, radicales y productos notables» y a
    // factorización. p7 (2ⁿ⁺³ con 2ⁿ = 5) es de exponentes y radicales. p6 (la diagonal de un rectángulo) pide Pitágoras,
    // que esa unidad no enseña (auditoría, M11, 18 nov): queda fuera, como p8 (fracciones algebraicas) y p9 (logaritmos).
    'cuadrado-crece': { ...lista(AL + 'productos-notables', ps(1, 2, 4, 10)), ...lista(AL + 'factorizacion', ps(3, 5)), p7: AL + 'exponentes-y-productos-notables' },
    'cinta-radio': { ...lista(T + 'angulo-trigonometrico', ps(1, 2, 4, 10)), ...lista(T + 'longitud-de-arco-y-sector', ps(3, 5, 6, 7, 8, 9)) },
    // p1, p2, p4 y p10 eran de razones-trigonometricas-agudas; esa unidad ya no lista la escena (17 nov, auditoría M7:
    // traía problemas de unidades posteriores): quedan fuera del repaso.
    'circunferencia-trig': { p3: T + 'triangulos-rectangulos',
      ...lista([T + 'reduccion-al-primer-cuadrante', T + 'angulos-en-posicion-normal'], ps(5, 6)), p7: T + 'funciones-trigonometricas',
      ...lista(T + 'ecuaciones-trigonometricas', ps(8, 9)) },
    'geometria-analitica': { ...lista(G + 'geometria-analitica', ps(1, 2, 3, 9, 10)), ...lista(T + 'recta-en-el-plano', ps(4, 5, 6, 7, 8)) },
    conicas: lista(T + 'conicas', ps(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)),
    'trazos-rutas': { ...lista(RM + 'trazos-y-perimetros', ps(1, 2, 3, 4, 5, 6, 7)), ...lista(RM + 'rutas-y-visualizacion-espacial', ps(8, 9, 10)) },
    'cuadricula-piezas': { ...lista(RM + 'transformaciones-de-figuras', ps(1, 2, 3, 6, 7)), ...lista(RM + 'trazos-y-perimetros', ps(4, 5)) },
    'rutas-espacio': lista(RM + 'rutas-y-visualizacion-espacial', ps(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)),
    'papel-doblado': lista(RM + 'transformaciones-de-figuras', ps(1, 2, 3, 4, 5, 6, 7, 10)),
    'orden-informacion': { ...lista(RM + 'ordenamiento-de-informacion', ps(1, 2, 3, 4, 5)), p6: RM + 'razonamiento-deductivo',
      ...lista(RM + 'verdades-y-mentiras', ps(7, 8)), ...lista(RM + 'certezas', ps(9, 10)) },
    // 18 nov: la escena del MRUV sirve a las dos mitades de «MRU, MRUV y caída libre». p1 (encuentro de dos combis) y
    // p6 (pendiente de una recta x–t) son de Movimiento rectilíneo uniforme; los demás, de MRUV y caída libre.
    mruv: { ...lista(F + 'movimiento-rectilineo', ps(1, 6)), ...lista(F + 'mruv-y-caida-libre', ps(2, 3, 4, 5, 7, 8, 9, 10)) },
    // 19 nov: la escena del tiro sirve a las dos mitades de «Movimiento parabólico y circular». p2 a p6 y p9 (tiros) son de
    // Movimiento parabólico; p1 (poleas), p7 y p10 (rueda de bicicleta) y p8 (pista circular), de Movimiento circular.
    'tiro-parabolico': { ...lista(F + 'movimiento-parabolico-y-circular', ps(2, 3, 4, 5, 6, 9)), ...lista(F + 'movimiento-circular', ps(1, 7, 8, 10)) },
    'ondas-electromagneticas': { ...lista(F + 'ondas-electromagneticas', ps(1, 3, 4, 6, 7, 8, 9, 10)), ...lista(F + 'optica-geometrica', ps(11, 12)) },
    // 18 nov (etapa 4, propuesta de Estructura atómica §9): el papel de la escena del átomo y la tabla (p1, p2: partículas;
    // p3, p4 y p10: iones, cuánticos y desapareados; p5 a p9: tabla periódica) y el de configuracion-ubicacion, que dice
    // la unidad de cada problema en su campo «unidades».
    // 19 nov (etapa 5): Tabla periódica se partió; p5 (ubicación) se queda y p6 a p9 (radio, ionización) van a Propiedades periódicas.
    'atomo-y-tabla': { ...lista(Q + 'estructura-atomica', ps(1, 2, 3, 4, 10)), ...lista(Q + 'tabla-periodica', ps(5)), ...lista(Q + 'propiedades-periodicas', ps(6, 7, 8, 9)) },
    'configuracion-ubicacion': { ...lista(Q + 'tabla-periodica', ps(1, 2, 9)), ...lista(Q + 'estructura-atomica', ps(3, 4, 5, 6, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22)) },
  };
  // Unidades de un problema de papel (lista vacía si no se sabe).
  function unidadesPapel(pl, id) {
    if (!pl || !pl.papel || pl.formato === 'lectura') return [];
    if (pl.unidades.length === 1) return [pl.unidades[0]];
    const v = (PAPEL[pl.id] || {})[id];
    return (Array.isArray(v) ? v : v ? [v] : []).filter(u => pl.unidades.includes(u));
  }
  // ¿El papel de esta plantilla tiene problemas de la unidad?
  function papelCubre(pl, unidad) {
    // El papel de los módulos de lectura trae textos enteros: la lectura entra al repaso por otro camino.
    if (!pl || !pl.papel || pl.formato === 'lectura' || !pl.unidades.includes(unidad)) return false;
    if (pl.unidades.length === 1) return true;
    return Object.values(PAPEL[pl.id] || {}).some(v => (Array.isArray(v) ? v : [v]).includes(unidad));
  }

  // Unidad de un problema ya generado, o null si no se sabe. pl: { id, unidades } (la ficha del catálogo).
  function unidadDe(pl, p) {
    if (!pl || !p) return null;
    if (p.unidadCatalogo && pl.unidades.includes(p.unidadCatalogo)) return p.unidadCatalogo;
    if (pl.unidades.length === 1) return pl.unidades[0];
    const m = TABLA[pl.id], d = p._datos || {};
    if (!m) return null;
    const u = (d.tema && m[d.tema]) || (d.conjunto && m[d.conjunto]) || m[d.tipo] || null;
    return u && pl.unidades.includes(u) ? u : null;
  }
  // ¿El generador puede dar problemas de esta unidad?
  function cubre(pl, unidad) {
    if (!pl || !pl.unidades.includes(unidad)) return false;
    if (pl.unidades.length === 1) return true;
    return Object.values(TABLA[pl.id] || {}).includes(unidad);
  }

  return { TABLA, unidadDe, cubre, PAPEL, unidadesPapel, papelCubre };
});
