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
    'cinematica-medias': { vt: F + 'movimiento-rectilineo', ecuacion: F + 'movimiento-rectilineo', idavuelta: F + 'movimiento-rectilineo', media: F + 'movimiento-rectilineo',
      xy: F + 'movimiento-parabolico-y-circular', latitud: F + 'movimiento-parabolico-y-circular' },
    'clasificar-reacciones': todo(Q + 'reacciones-y-balance', ['aguaDura', 'redoxSet', 'aLaVez', 'rol', 'vf', 'calor', 'tipoEnergia', 'tipo', 'relacionar', 'dismutacion']),
    'configuracion-ubicacion': { 'vida-media': Q + 'materia-y-energia', ubicar: Q + 'tabla-periodica', familia: Q + 'tabla-periodica',
      ...todo(Q + 'estructura-atomica', ['anomala', 'cuanticos', 'cation', 'atomo-ion', 'desapareados', 'particulas', 'anion', 'contar']) },
    'conversiones-quimica': todo(Q + 'materia-y-energia', ['latente', 'densidad', 'vida', 'delta', 'lectura']),
    'dinamica-fuerzas': { resorte: F + 'dinamica', motriz: F + 'dinamica', peralte: F + 'dinamica', tabla: F + 'dinamica', plataforma: F + 'dinamica',
      escalera: F + 'estatica', astro: F + 'gravitacion', gravitatoria: F + 'gravitacion' },
    'division-polinomios': { ...todo(AL + 'division-de-polinomios', ['parametros', 'cociente', 'resto2', 'caja', 'identidad']), mcdmcm: AL + 'factorizacion' },
    'ecuaciones-polinomiales': { ...todo(AL + 'ecuaciones-polinomiales', ['parametro', 'vieta', 'caja', 'conjugada', 'multiple', 'bicuadrada', 'igualar']), divisores: AL + 'factorizacion' },
    'estadistica-datos': todo(AR + 'estadistica', ['varianza', 'central', 'medias', 'reconstruir', 'extremo']),
    // El tipo de problema es estequiometría aunque el contexto sea una grasa o una mena.
    'estequiometria-admision': todo(Q + 'estequiometria', ['grasa', 'termo', 'hidroxido', 'mineral', 'redox', 'flotacion', 'atomos']),
    'fracciones-problemas': { ...todo(AR + 'numeros-racionales', ['suma-entera', 'equivalentes', 'periodo', 'trabajo', 'acotada', 'porcentaje', 'formar', 'tipo-decimal', 'diferencia', 'stock']),
      ...todo(AR + 'mcd-y-mcm', ['pesi', 'euclides', 'pg-mcd']) },
    'funciones-dominio-rango': { ...todo(AL + 'funciones', ['racional-simplificable', 'rango-exp-abs', 'dominio-radicales', 'area-entero-abs', 'composicion']),
      ...todo(AL + 'tipos-de-funciones-e-inversa', ['inyectiva-restringir', 'clasificar-verbal', 'costo-recipiente', 'monotonia-vf']),
      ...todo(AL + 'exponenciales-y-logaritmos', ['log-entero', 'logistico', 'dominio-log']) },
    'geo-areas-circulares': { ...todo(G + 'longitud-y-areas-circulares', ['corona', 'sector', 'cuadrantes', 'lunulas', 'sombreada', 'concentricas']), rueda: T + 'longitud-de-arco-y-sector' },
    'geo-circunferencia-metrica': { ...todo(G + 'circunferencia', ['tangentes-iguales', 'tangente', 'pitot', 'inscriptible', 'poncelet']),
      ...todo(G + 'relaciones-metricas', ['secantes', 'cuerdas', 'arcos-cuerdas']) },
    'geo-poligonos': { ...todo(G + 'poligonos-y-cuadrilateros', ['rombo', 'cuadrados', 'trapecio', 'encajados', 'equiangulo']),
      ...todo(G + 'poligonos-regulares', ['diagonales', 'hexagono', 'soporte', 'area-regular']) },
    'geo-proporcionalidad': todo(G + 'proporcionalidad-y-semejanza', ['bisectriz', 'raices-areas', 'incentro', 'cuerdas', 'bis-semejanza', 'thales']),
    'geo-triangulos-notables': { ...todo(G + 'triangulos', ['desigualdad', 'obtusangulo', 'mitades']), ...todo(G + 'puntos-notables', ['ortocentro', 'arco', 'angulos']) },
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
      ...todo(Q + 'estructura-atomica', ['ion-sodio', 'modelos', 'rutherford', 'dalton', 'cientificos']),
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
    'sistemas-ecuaciones': { ...todo(AL + 'sistemas-de-ecuaciones', ['vandermonde', 'parametro', 'enteros', 'trabajo']), matriz: AL + 'matrices-y-determinantes',
      ...todo(AL + 'ecuaciones-lineales-y-cuadraticas', ['vieta', 'franja']), 'valor-absoluto': AL + 'valor-absoluto-y-radicales', exponencial: AL + 'exponentes-y-productos-notables' },
    'soluciones-meq-ppm': todo(Q + 'soluciones', ['meq', 'igualar', 'ppmGas', 'ppmMasa', 'mezcla', 'jarabe', 'preparar', 'precipitacion', 'masa', 'carbonato', 'volumen', 'volumen-pct']),
    'trig-angulos-verticales': todo(T + 'triangulos-rectangulos', ['entre-edificios', 'mismo-lado', 'puente-simbolico', 'mitad-cima', 'movimiento', 'condicion-angulo', 'ambos-lados', 'objeto-elevado', 'dron-camino']),
    'trig-extremos': { ...todo(T + 'funciones-trigonometricas', ['cuadratica', 'racional', 'puerta', 'senoide']), 'area-ct': T + 'circunferencia-trigonometrica' },
    'trig-identidades': { ...todo(T + 'arcos-multiples', ['triple-producto', 'reduccion-doble', 'triangulo-doble', 'maximo', 'acotar', 'cadena']),
      ...todo(T + 'arcos-compuestos', ['condicional', 'terreno']), ...todo(T + 'identidades-fundamentales', ['suma-k', 'cofuncion']) },
    'trig-oblicuangulos': { ...todo(T + 'triangulos-oblicuangulos', ['circunradio', 'faro', 'ley-tangentes']), ...todo(T + 'areas-y-lineas-notables', ['lado-minimo', 'ceviana', 'areas']) },
    'velocidad-relativa': { ...todo(F + 'movimiento-rectilineo', ['cruce', 'marco', 'idavuelta']), botes: F + 'impulso-y-choques', bote: F + 'magnitudes-y-vectores' },
  };

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

  return { TABLA, unidadDe, cubre };
});
