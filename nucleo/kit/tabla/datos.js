/*
 * Datos de la tabla viva: los 118 elementos. ARCHIVO GENERADO por herramientas/tabla-datos.js: no se edita a mano.
 *
 * Fuentes (bajadas el 2026-11-14):
 *   - Z, símbolo, peso atómico estándar (`estandar`, tal cual) y abreviado (`peso` ± `incertidumbre`, con su texto
 *     en `pesoTexto` para no perder los ceros): CIAAW, Standard Atomic Weights 2024 y Abridged Standard Atomic Weights
 *     2024 (https://www.ciaaw.org/atomic-weights.htm y abridged-atomic-weights.htm). Notas g, m y r de la CIAAW.
 *   - `masico`: solo en los elementos SIN peso atómico estándar; números másicos del isótopo más estable conocido
 *     (NUBASE2020, compilado por la CIAAW en radioactive-elements.htm). Varios si la CIAAW no los distingue.
 *     No es un peso atómico: se muestra entre corchetes y con su rótulo.
 *   - `nombre` y `otros` en español: transcritos por un modelo, POR VERIFICAR con la nomenclatura de la RSEQ.
 *   - `ei`: primera energía de ionización del átomo neutro, NIST Atomic Spectra Database (Ionization Energies), en eV
 *     y en kJ/mol (× 96,485 33). `tipo`: medido, calculado (entre paréntesis en NIST) o extrapolado (entre corchetes).
 *   - `en` (escala de Pauling), `radio` (de van der Waals, en pm), `estado` a 25 °C y `clase`: PubChem, Periodic
 *     Table. Es una compilación sin fuente por valor: POR VERIFICAR. Sin las electronegatividades estimadas (Fr, Po,
 *     At, Am a Lr) ni el estado y la clase predichos de Z = 104 a 118.
 * Ninguna propiedad se estima (decisión 9): lo que no está aquí no existe para la tabla.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Kit = root.Kit || {}).tablaDatos = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const ELEMENTOS = [
    {"Z":1,"simbolo":"H","nombre":"hidrógeno","peso":1.008,"pesoTexto":"1.0080","incertidumbre":0.0002,"estandar":"[1.007 84, 1.008 11]","notas":["m"],"ei":{"ev":13.598434599702,"kj":1312,"tipo":"calculado","inc":"0.000000000012","ref":"HDEL"},"en":2.2,"radio":120,"estado":"gas","clase":"no metal"},
    {"Z":2,"simbolo":"He","nombre":"helio","peso":4.0026,"pesoTexto":"4.0026","incertidumbre":0.0001,"estandar":"4.002 602(2)","notas":["g","r"],"ei":{"ev":24.587389011,"kj":2372,"tipo":"medido","inc":"0.000000025","ref":"L17714"},"radio":140,"estado":"gas","clase":"gas noble"},
    {"Z":3,"simbolo":"Li","nombre":"litio","peso":6.94,"pesoTexto":"6.94","incertidumbre":0.06,"estandar":"[6.938, 6.997]","notas":["m"],"ei":{"ev":5.391714996,"kj":520,"tipo":"medido","inc":"0.000000022","ref":"L12261"},"en":0.98,"radio":182,"estado":"sólido","clase":"alcalino"},
    {"Z":4,"simbolo":"Be","nombre":"berilio","peso":9.0122,"pesoTexto":"9.0122","incertidumbre":0.0001,"estandar":"9.012 1831(5)","ei":{"ev":9.322699,"kj":900,"tipo":"medido","inc":"0.000007","ref":"L5964"},"en":1.57,"radio":153,"estado":"sólido","clase":"alcalinotérreo"},
    {"Z":5,"simbolo":"B","nombre":"boro","peso":10.81,"pesoTexto":"10.81","incertidumbre":0.02,"estandar":"[10.806, 10.821]","notas":["m"],"ei":{"ev":8.298019,"kj":801,"tipo":"medido","inc":"0.000003","ref":"L12312"},"en":2.04,"radio":192,"estado":"sólido","clase":"semimetal"},
    {"Z":6,"simbolo":"C","nombre":"carbono","peso":12.011,"pesoTexto":"12.011","incertidumbre":0.002,"estandar":"[12.0096, 12.0116]","ei":{"ev":11.260288,"kj":1086,"tipo":"medido","inc":"0.0000011","ref":"L20057"},"en":2.55,"radio":170,"estado":"sólido","clase":"no metal"},
    {"Z":7,"simbolo":"N","nombre":"nitrógeno","peso":14.007,"pesoTexto":"14.007","incertidumbre":0.001,"estandar":"[14.006 43, 14.007 28]","notas":["m"],"ei":{"ev":14.53413,"kj":1402,"tipo":"medido","inc":"0.00004","ref":"L1411"},"en":3.04,"radio":155,"estado":"gas","clase":"no metal"},
    {"Z":8,"simbolo":"O","nombre":"oxígeno","peso":15.999,"pesoTexto":"15.999","incertidumbre":0.001,"estandar":"[15.999 03, 15.999 77]","notas":["m"],"ei":{"ev":13.618055,"kj":1314,"tipo":"medido","inc":"0.000007","ref":"L74,L3760"},"en":3.44,"radio":152,"estado":"gas","clase":"no metal"},
    {"Z":9,"simbolo":"F","nombre":"flúor","peso":18.998,"pesoTexto":"18.998","incertidumbre":0.001,"estandar":"18.998 403 162(5)","ei":{"ev":17.42282,"kj":1681,"tipo":"medido","inc":"0.00005","ref":"L7481,L526"},"en":3.98,"radio":135,"estado":"gas","clase":"halógeno"},
    {"Z":10,"simbolo":"Ne","nombre":"neón","peso":20.18,"pesoTexto":"20.180","incertidumbre":0.001,"estandar":"20.1797(6)","notas":["g","m"],"ei":{"ev":21.564541,"kj":2081,"tipo":"medido","inc":"0.000007","ref":"L8826,L1407"},"radio":154,"estado":"gas","clase":"gas noble"},
    {"Z":11,"simbolo":"Na","nombre":"sodio","peso":22.99,"pesoTexto":"22.990","incertidumbre":0.001,"estandar":"22.989 769 28(2)","ei":{"ev":5.13907696,"kj":496,"tipo":"medido","inc":"0.00000025","ref":"L10921,L9648"},"en":0.93,"radio":227,"estado":"sólido","clase":"alcalino"},
    {"Z":12,"simbolo":"Mg","nombre":"magnesio","peso":24.305,"pesoTexto":"24.305","incertidumbre":0.002,"estandar":"[24.304, 24.307]","ei":{"ev":7.646236,"kj":738,"tipo":"medido","inc":"0.000004","ref":"L10635,L6969"},"en":1.31,"radio":173,"estado":"sólido","clase":"alcalinotérreo"},
    {"Z":13,"simbolo":"Al","nombre":"aluminio","peso":26.982,"pesoTexto":"26.982","incertidumbre":0.001,"estandar":"26.981 5384(3)","ei":{"ev":5.985769,"kj":578,"tipo":"medido","inc":"0.000003","ref":"L7215,L10321"},"en":1.61,"radio":184,"estado":"sólido","clase":"metal del bloque p"},
    {"Z":14,"simbolo":"Si","nombre":"silicio","peso":28.085,"pesoTexto":"28.085","incertidumbre":0.001,"estandar":"[28.084, 28.086]","ei":{"ev":8.15168,"kj":787,"tipo":"medido","inc":"0.00003","ref":"L5815"},"en":1.9,"radio":210,"estado":"sólido","clase":"semimetal"},
    {"Z":15,"simbolo":"P","nombre":"fósforo","peso":30.974,"pesoTexto":"30.974","incertidumbre":0.001,"estandar":"30.973 761 998(5)","ei":{"ev":10.486686,"kj":1012,"tipo":"medido","inc":"0.000015","ref":"L5148"},"en":2.19,"radio":180,"estado":"sólido","clase":"no metal"},
    {"Z":16,"simbolo":"S","nombre":"azufre","peso":32.06,"pesoTexto":"32.06","incertidumbre":0.02,"estandar":"[32.059, 32.076]","ei":{"ev":10.3600167,"kj":1000,"tipo":"medido","inc":"0.0000014","ref":"L23116"},"en":2.58,"radio":180,"estado":"sólido","clase":"no metal"},
    {"Z":17,"simbolo":"Cl","nombre":"cloro","peso":35.45,"pesoTexto":"35.45","incertidumbre":0.01,"estandar":"[35.446, 35.457]","notas":["m"],"ei":{"ev":12.967633,"kj":1251,"tipo":"medido","inc":"0.000016","ref":"L19191"},"en":3.16,"radio":175,"estado":"gas","clase":"halógeno"},
    {"Z":18,"simbolo":"Ar","nombre":"argón","peso":39.95,"pesoTexto":"39.95","incertidumbre":0.16,"estandar":"[39.792, 39.963]","ei":{"ev":15.7596119,"kj":1521,"tipo":"medido","inc":"0.0000005","ref":"L9217"},"radio":188,"estado":"gas","clase":"gas noble"},
    {"Z":19,"simbolo":"K","nombre":"potasio","peso":39.098,"pesoTexto":"39.098","incertidumbre":0.001,"estandar":"39.0983(1)","ei":{"ev":4.34066373,"kj":419,"tipo":"medido","inc":"0.00000009","ref":"L5451,L5783,L7185"},"en":0.82,"radio":275,"estado":"sólido","clase":"alcalino"},
    {"Z":20,"simbolo":"Ca","nombre":"calcio","peso":40.078,"pesoTexto":"40.078","incertidumbre":0.004,"estandar":"40.078(4)","notas":["g"],"ei":{"ev":6.113154921,"kj":590,"tipo":"medido","inc":"0.0000000005","ref":"L22848"},"en":1,"radio":231,"estado":"sólido","clase":"alcalinotérreo"},
    {"Z":21,"simbolo":"Sc","nombre":"escandio","peso":44.956,"pesoTexto":"44.956","incertidumbre":0.001,"estandar":"44.955 907(4)","ei":{"ev":6.56149,"kj":633,"tipo":"medido","inc":"0.00006","ref":"L7185,L2110"},"en":1.36,"radio":211,"estado":"sólido","clase":"de transición"},
    {"Z":22,"simbolo":"Ti","nombre":"titanio","peso":47.867,"pesoTexto":"47.867","incertidumbre":0.001,"estandar":"47.867(1)","ei":{"ev":6.82812,"kj":659,"tipo":"medido","inc":"0.000012","ref":"L17996"},"en":1.54,"radio":187,"estado":"sólido","clase":"de transición"},
    {"Z":23,"simbolo":"V","nombre":"vanadio","peso":50.942,"pesoTexto":"50.942","incertidumbre":0.001,"estandar":"50.9415(1)","ei":{"ev":6.746187,"kj":651,"tipo":"medido","inc":"0.000021","ref":"L17712,L20010"},"en":1.63,"radio":179,"estado":"sólido","clase":"de transición"},
    {"Z":24,"simbolo":"Cr","nombre":"cromo","peso":51.996,"pesoTexto":"51.996","incertidumbre":0.001,"estandar":"51.9961(6)","ei":{"ev":6.76651,"kj":653,"tipo":"medido","inc":"0.00004","ref":"L7185,L2832"},"en":1.66,"radio":189,"estado":"sólido","clase":"de transición"},
    {"Z":25,"simbolo":"Mn","nombre":"manganeso","peso":54.938,"pesoTexto":"54.938","incertidumbre":0.001,"estandar":"54.938 043(2)","ei":{"ev":7.434038,"kj":717,"tipo":"medido","inc":"0.0000012","ref":"L19057"},"en":1.55,"radio":197,"estado":"sólido","clase":"de transición"},
    {"Z":26,"simbolo":"Fe","nombre":"hierro","peso":55.845,"pesoTexto":"55.845","incertidumbre":0.002,"estandar":"55.845(2)","ei":{"ev":7.9024681,"kj":762,"tipo":"medido","inc":"0.0000012","ref":"L7743c109"},"en":1.83,"radio":194,"estado":"sólido","clase":"de transición"},
    {"Z":27,"simbolo":"Co","nombre":"cobalto","peso":58.933,"pesoTexto":"58.933","incertidumbre":0.001,"estandar":"58.933 194(3)","ei":{"ev":7.88101,"kj":760,"tipo":"medido","inc":"0.00012","ref":"L10545"},"en":1.88,"radio":192,"estado":"sólido","clase":"de transición"},
    {"Z":28,"simbolo":"Ni","nombre":"níquel","peso":58.693,"pesoTexto":"58.693","incertidumbre":0.001,"estandar":"58.6934(4)","notas":["r"],"ei":{"ev":7.639878,"kj":737,"tipo":"medido","inc":"0.000017","ref":"L12369"},"en":1.91,"radio":163,"estado":"sólido","clase":"de transición"},
    {"Z":29,"simbolo":"Cu","nombre":"cobre","peso":63.546,"pesoTexto":"63.546","incertidumbre":0.003,"estandar":"63.546(3)","notas":["r"],"ei":{"ev":7.72638,"kj":745,"tipo":"medido","inc":"0.000004","ref":"L14897"},"en":1.9,"radio":140,"estado":"sólido","clase":"de transición"},
    {"Z":30,"simbolo":"Zn","nombre":"zinc","otros":["cinc"],"peso":65.38,"pesoTexto":"65.38","incertidumbre":0.02,"estandar":"65.38(2)","notas":["r"],"ei":{"ev":9.394197,"kj":906,"tipo":"medido","inc":"0.000006","ref":"L13951"},"en":1.65,"radio":139,"estado":"sólido","clase":"de transición"},
    {"Z":31,"simbolo":"Ga","nombre":"galio","peso":69.723,"pesoTexto":"69.723","incertidumbre":0.001,"estandar":"69.723(1)","ei":{"ev":5.999302,"kj":579,"tipo":"medido","inc":"0.0000012","ref":"L5566"},"en":1.81,"radio":187,"estado":"sólido","clase":"metal del bloque p"},
    {"Z":32,"simbolo":"Ge","nombre":"germanio","peso":72.63,"pesoTexto":"72.630","incertidumbre":0.008,"estandar":"72.630(8)","ei":{"ev":7.899435,"kj":762,"tipo":"medido","inc":"0.000012","ref":"L3935,L12369"},"en":2.01,"radio":211,"estado":"sólido","clase":"semimetal"},
    {"Z":33,"simbolo":"As","nombre":"arsénico","peso":74.922,"pesoTexto":"74.922","incertidumbre":0.001,"estandar":"74.921 595(6)","ei":{"ev":9.78855,"kj":944,"tipo":"medido","inc":"0.00025","ref":"L1351"},"en":2.18,"radio":185,"estado":"sólido","clase":"semimetal"},
    {"Z":34,"simbolo":"Se","nombre":"selenio","peso":78.971,"pesoTexto":"78.971","incertidumbre":0.008,"estandar":"78.971(8)","notas":["r"],"ei":{"ev":9.752368,"kj":941,"tipo":"medido","inc":"0.000006","ref":"L21645"},"en":2.55,"radio":190,"estado":"sólido","clase":"no metal"},
    {"Z":35,"simbolo":"Br","nombre":"bromo","peso":79.904,"pesoTexto":"79.904","incertidumbre":0.003,"estandar":"[79.901, 79.907]","ei":{"ev":11.81381,"kj":1140,"tipo":"medido","inc":"0.00006","ref":"L351,L67"},"en":2.96,"radio":183,"estado":"líquido","clase":"halógeno"},
    {"Z":36,"simbolo":"Kr","nombre":"kriptón","peso":83.798,"pesoTexto":"83.798","incertidumbre":0.002,"estandar":"83.798(2)","notas":["g","m"],"ei":{"ev":13.9996055,"kj":1351,"tipo":"medido","inc":"0.0000020","ref":"L12196"},"en":3,"radio":202,"estado":"gas","clase":"gas noble"},
    {"Z":37,"simbolo":"Rb","nombre":"rubidio","peso":85.468,"pesoTexto":"85.468","incertidumbre":0.001,"estandar":"85.4678(3)","notas":["g"],"ei":{"ev":4.1771281,"kj":403,"tipo":"medido","inc":"0.0000012","ref":"L4740,L5783"},"en":0.82,"radio":303,"estado":"sólido","clase":"alcalino"},
    {"Z":38,"simbolo":"Sr","nombre":"estroncio","peso":87.62,"pesoTexto":"87.62","incertidumbre":0.01,"estandar":"87.62(1)","notas":["g","r"],"ei":{"ev":5.69486745,"kj":549,"tipo":"medido","inc":"0.00000012","ref":"L15350,L5644"},"en":0.95,"radio":249,"estado":"sólido","clase":"alcalinotérreo"},
    {"Z":39,"simbolo":"Y","nombre":"itrio","peso":88.906,"pesoTexto":"88.906","incertidumbre":0.001,"estandar":"88.905 838(2)","ei":{"ev":6.21726,"kj":600,"tipo":"medido","inc":"0.00010","ref":"L8844,L2111,L9735"},"en":1.22,"radio":219,"estado":"sólido","clase":"de transición"},
    {"Z":40,"simbolo":"Zr","nombre":"circonio","peso":91.222,"pesoTexto":"91.222","incertidumbre":0.003,"estandar":"91.222(3)","notas":["g"],"ei":{"ev":6.634126,"kj":640,"tipo":"medido","inc":"0.000005","ref":"L21107"},"en":1.33,"radio":186,"estado":"sólido","clase":"de transición"},
    {"Z":41,"simbolo":"Nb","nombre":"niobio","peso":92.906,"pesoTexto":"92.906","incertidumbre":0.001,"estandar":"92.906 37(1)","ei":{"ev":6.75885,"kj":652,"tipo":"medido","inc":"0.00004","ref":"L6829"},"en":1.6,"radio":207,"estado":"sólido","clase":"de transición"},
    {"Z":42,"simbolo":"Mo","nombre":"molibdeno","peso":95.95,"pesoTexto":"95.95","incertidumbre":0.01,"estandar":"95.95(1)","notas":["g"],"ei":{"ev":7.09243,"kj":684,"tipo":"medido","inc":"0.00004","ref":"L6829"},"en":2.16,"radio":209,"estado":"sólido","clase":"de transición"},
    {"Z":43,"simbolo":"Tc","nombre":"tecnecio","masico":[97,98],"ei":{"ev":7.11938,"kj":687,"tipo":"medido","inc":"0.00003","ref":"L15237"},"en":1.9,"radio":209,"estado":"sólido","clase":"de transición"},
    {"Z":44,"simbolo":"Ru","nombre":"rutenio","peso":101.07,"pesoTexto":"101.07","incertidumbre":0.02,"estandar":"101.07(2)","notas":["g"],"ei":{"ev":7.3605,"kj":710,"tipo":"medido","inc":"0.00005","ref":"L10032"},"en":2.2,"radio":207,"estado":"sólido","clase":"de transición"},
    {"Z":45,"simbolo":"Rh","nombre":"rodio","peso":102.91,"pesoTexto":"102.91","incertidumbre":0.01,"estandar":"102.905 49(2)","ei":{"ev":7.4589,"kj":720,"tipo":"medido","inc":"0.00005","ref":"L10032"},"en":2.28,"radio":195,"estado":"sólido","clase":"de transición"},
    {"Z":46,"simbolo":"Pd","nombre":"paladio","peso":106.42,"pesoTexto":"106.42","incertidumbre":0.01,"estandar":"106.42(1)","notas":["g"],"ei":{"ev":8.336839,"kj":804,"tipo":"medido","inc":"0.000010","ref":"L20363"},"en":2.2,"radio":202,"estado":"sólido","clase":"de transición"},
    {"Z":47,"simbolo":"Ag","nombre":"plata","peso":107.87,"pesoTexto":"107.87","incertidumbre":0.01,"estandar":"107.8682(2)","notas":["g"],"ei":{"ev":7.576234,"kj":731,"tipo":"medido","inc":"0.000025","ref":"L11835"},"en":1.93,"radio":172,"estado":"sólido","clase":"de transición"},
    {"Z":48,"simbolo":"Cd","nombre":"cadmio","peso":112.41,"pesoTexto":"112.41","incertidumbre":0.01,"estandar":"112.414(4)","notas":["g"],"ei":{"ev":8.99382,"kj":868,"tipo":"medido","inc":"0.000016","ref":"L18843"},"en":1.69,"radio":158,"estado":"sólido","clase":"de transición"},
    {"Z":49,"simbolo":"In","nombre":"indio","peso":114.82,"pesoTexto":"114.82","incertidumbre":0.01,"estandar":"114.818(1)","ei":{"ev":5.7863558,"kj":558,"tipo":"medido","inc":"0.0000005","ref":"L21649"},"en":1.78,"radio":193,"estado":"sólido","clase":"metal del bloque p"},
    {"Z":50,"simbolo":"Sn","nombre":"estaño","peso":118.71,"pesoTexto":"118.71","incertidumbre":0.01,"estandar":"118.710(7)","notas":["g"],"ei":{"ev":7.343918,"kj":709,"tipo":"medido","inc":"0.000012","ref":"L3936"},"en":1.96,"radio":217,"estado":"sólido","clase":"metal del bloque p"},
    {"Z":51,"simbolo":"Sb","nombre":"antimonio","peso":121.76,"pesoTexto":"121.76","incertidumbre":0.01,"estandar":"121.760(1)","notas":["g"],"ei":{"ev":8.608389,"kj":831,"tipo":"medido","inc":"0.000012","ref":"L8844,L6684"},"en":2.05,"radio":206,"estado":"sólido","clase":"semimetal"},
    {"Z":52,"simbolo":"Te","nombre":"telurio","peso":127.6,"pesoTexto":"127.60","incertidumbre":0.03,"estandar":"127.60(3)","notas":["g"],"ei":{"ev":9.009808,"kj":869,"tipo":"medido","inc":"0.000006","ref":"L21109"},"en":2.1,"radio":206,"estado":"sólido","clase":"semimetal"},
    {"Z":53,"simbolo":"I","nombre":"yodo","peso":126.9,"pesoTexto":"126.90","incertidumbre":0.01,"estandar":"126.904 47(3)","ei":{"ev":10.451236,"kj":1008,"tipo":"medido","inc":"0.000025","ref":"L13998,L22518"},"en":2.66,"radio":198,"estado":"sólido","clase":"halógeno"},
    {"Z":54,"simbolo":"Xe","nombre":"xenón","peso":131.29,"pesoTexto":"131.29","incertidumbre":0.01,"estandar":"131.293(6)","notas":["g","m"],"ei":{"ev":12.1298437,"kj":1170,"tipo":"medido","inc":"0.0000015","ref":"L12013,L9794,L6426"},"en":2.6,"radio":216,"estado":"gas","clase":"gas noble"},
    {"Z":55,"simbolo":"Cs","nombre":"cesio","peso":132.91,"pesoTexto":"132.91","incertidumbre":0.01,"estandar":"132.905 451 96(6)","ei":{"ev":3.89390572743,"kj":376,"tipo":"medido","inc":"0.00000000017","ref":"L19479"},"en":0.79,"radio":343,"estado":"sólido","clase":"alcalino"},
    {"Z":56,"simbolo":"Ba","nombre":"bario","peso":137.33,"pesoTexto":"137.33","incertidumbre":0.01,"estandar":"137.327(7)","ei":{"ev":5.2116646,"kj":503,"tipo":"medido","inc":"0.0000012","ref":"L6347,L9224"},"en":0.89,"radio":268,"estado":"sólido","clase":"alcalinotérreo"},
    {"Z":57,"simbolo":"La","nombre":"lantano","peso":138.91,"pesoTexto":"138.91","incertidumbre":0.01,"estandar":"138.905 47(7)","notas":["g"],"ei":{"ev":5.5769,"kj":538,"tipo":"medido","inc":"0.0006","ref":"L3974,L16228"},"en":1.1,"radio":240,"estado":"sólido","clase":"lantánido"},
    {"Z":58,"simbolo":"Ce","nombre":"cerio","peso":140.12,"pesoTexto":"140.12","incertidumbre":0.01,"estandar":"140.116(1)","notas":["g"],"ei":{"ev":5.5386,"kj":534,"tipo":"medido","inc":"0.0004","ref":"L4277"},"en":1.12,"radio":235,"estado":"sólido","clase":"lantánido"},
    {"Z":59,"simbolo":"Pr","nombre":"praseodimio","peso":140.91,"pesoTexto":"140.91","incertidumbre":0.01,"estandar":"140.907 66(1)","ei":{"ev":5.4702,"kj":528,"tipo":"extrapolado","inc":"0.0004","ref":"L19006"},"en":1.13,"radio":239,"estado":"sólido","clase":"lantánido"},
    {"Z":60,"simbolo":"Nd","nombre":"neodimio","peso":144.24,"pesoTexto":"144.24","incertidumbre":0.01,"estandar":"144.242(3)","notas":["g"],"ei":{"ev":5.52475,"kj":533,"tipo":"medido","inc":"0.00005","ref":"L23155"},"en":1.14,"radio":229,"estado":"sólido","clase":"lantánido"},
    {"Z":61,"simbolo":"Pm","nombre":"prometio","masico":[145],"ei":{"ev":5.58187,"kj":539,"tipo":"medido","inc":"0.00004","ref":"L20992"},"radio":236,"estado":"sólido","clase":"lantánido"},
    {"Z":62,"simbolo":"Sm","nombre":"samario","peso":150.36,"pesoTexto":"150.36","incertidumbre":0.02,"estandar":"150.36(2)","notas":["g"],"ei":{"ev":5.643722,"kj":545,"tipo":"medido","inc":"0.000021","ref":"L21624"},"en":1.17,"radio":229,"estado":"sólido","clase":"lantánido"},
    {"Z":63,"simbolo":"Eu","nombre":"europio","peso":151.96,"pesoTexto":"151.96","incertidumbre":0.01,"estandar":"151.964(1)","notas":["g"],"ei":{"ev":5.670385,"kj":547,"tipo":"medido","inc":"0.000005","ref":"L13382"},"radio":233,"estado":"sólido","clase":"lantánido"},
    {"Z":64,"simbolo":"Gd","nombre":"gadolinio","peso":157.25,"pesoTexto":"157.25","incertidumbre":0.01,"estandar":"157.249(2)","notas":["g"],"ei":{"ev":6.1498,"kj":593,"tipo":"medido","inc":"0.00004","ref":"L11798"},"en":1.2,"radio":237,"estado":"sólido","clase":"lantánido"},
    {"Z":65,"simbolo":"Tb","nombre":"terbio","peso":158.93,"pesoTexto":"158.93","incertidumbre":0.01,"estandar":"158.925 354(7)","ei":{"ev":5.8638,"kj":566,"tipo":"medido","inc":"0.0006","ref":"L4277"},"radio":221,"estado":"sólido","clase":"lantánido"},
    {"Z":66,"simbolo":"Dy","nombre":"disprosio","peso":162.5,"pesoTexto":"162.50","incertidumbre":0.01,"estandar":"162.500(1)","notas":["g"],"ei":{"ev":5.939061,"kj":573,"tipo":"medido","inc":"0.000006","ref":"L22122"},"en":1.22,"radio":229,"estado":"sólido","clase":"lantánido"},
    {"Z":67,"simbolo":"Ho","nombre":"holmio","peso":164.93,"pesoTexto":"164.93","incertidumbre":0.01,"estandar":"164.930 329(5)","ei":{"ev":6.0215,"kj":581,"tipo":"medido","inc":"0.0006","ref":"L4277"},"en":1.23,"radio":216,"estado":"sólido","clase":"lantánido"},
    {"Z":68,"simbolo":"Er","nombre":"erbio","peso":167.26,"pesoTexto":"167.26","incertidumbre":0.01,"estandar":"167.259(3)","notas":["g"],"ei":{"ev":6.1077,"kj":589,"tipo":"medido","inc":"0.0010","ref":"L4277"},"en":1.24,"radio":235,"estado":"sólido","clase":"lantánido"},
    {"Z":69,"simbolo":"Tm","nombre":"tulio","peso":168.93,"pesoTexto":"168.93","incertidumbre":0.01,"estandar":"168.934 219(5)","ei":{"ev":6.184402,"kj":597,"tipo":"medido","inc":"0.000009","ref":"L22274"},"en":1.25,"radio":227,"estado":"sólido","clase":"lantánido"},
    {"Z":70,"simbolo":"Yb","nombre":"iterbio","peso":173.05,"pesoTexto":"173.05","incertidumbre":0.02,"estandar":"173.045(10)","notas":["g"],"ei":{"ev":6.25416,"kj":603,"tipo":"medido","inc":"0.000012","ref":"L4980"},"radio":242,"estado":"sólido","clase":"lantánido"},
    {"Z":71,"simbolo":"Lu","nombre":"lutecio","peso":174.97,"pesoTexto":"174.97","incertidumbre":0.01,"estandar":"174.966 69(5)","notas":["g"],"ei":{"ev":5.425871,"kj":524,"tipo":"medido","inc":"0.000012","ref":"L10494,L1638"},"en":1.27,"radio":221,"estado":"sólido","clase":"lantánido"},
    {"Z":72,"simbolo":"Hf","nombre":"hafnio","peso":178.49,"pesoTexto":"178.49","incertidumbre":0.01,"estandar":"178.486(6)","notas":["g"],"ei":{"ev":6.82507,"kj":659,"tipo":"medido","inc":"0.000012","ref":"L14027,L10033"},"en":1.3,"radio":212,"estado":"sólido","clase":"de transición"},
    {"Z":73,"simbolo":"Ta","nombre":"tantalio","peso":180.95,"pesoTexto":"180.95","incertidumbre":0.01,"estandar":"180.947 88(2)","ei":{"ev":7.549571,"kj":728,"tipo":"medido","inc":"0.000025","ref":"L13153"},"en":1.5,"radio":217,"estado":"sólido","clase":"de transición"},
    {"Z":74,"simbolo":"W","nombre":"wolframio","otros":["tungsteno"],"peso":183.84,"pesoTexto":"183.84","incertidumbre":0.01,"estandar":"183.84(1)","ei":{"ev":7.86403,"kj":759,"tipo":"medido","inc":"0.00010","ref":"L11604"},"en":2.36,"radio":210,"estado":"sólido","clase":"de transición"},
    {"Z":75,"simbolo":"Re","nombre":"renio","peso":186.21,"pesoTexto":"186.21","incertidumbre":0.01,"estandar":"186.207(1)","ei":{"ev":7.83352,"kj":756,"tipo":"medido","inc":"0.00011","ref":"L11604"},"en":1.9,"radio":217,"estado":"sólido","clase":"de transición"},
    {"Z":76,"simbolo":"Os","nombre":"osmio","peso":190.23,"pesoTexto":"190.23","incertidumbre":0.03,"estandar":"190.23(3)","notas":["g"],"ei":{"ev":8.43823,"kj":814,"tipo":"medido","inc":"0.00020","ref":"L8105"},"en":2.2,"radio":216,"estado":"sólido","clase":"de transición"},
    {"Z":77,"simbolo":"Ir","nombre":"iridio","peso":192.22,"pesoTexto":"192.22","incertidumbre":0.01,"estandar":"192.217(2)","ei":{"ev":8.96702,"kj":865,"tipo":"medido","inc":"0.00022","ref":"L8105"},"en":2.2,"radio":202,"estado":"sólido","clase":"de transición"},
    {"Z":78,"simbolo":"Pt","nombre":"platino","peso":195.08,"pesoTexto":"195.08","incertidumbre":0.02,"estandar":"195.084(9)","ei":{"ev":8.95883,"kj":864,"tipo":"medido","inc":"0.00010","ref":"L9735,L11689"},"en":2.28,"radio":209,"estado":"sólido","clase":"de transición"},
    {"Z":79,"simbolo":"Au","nombre":"oro","peso":196.97,"pesoTexto":"196.97","incertidumbre":0.01,"estandar":"196.966 570(4)","ei":{"ev":9.225554,"kj":890,"tipo":"medido","inc":"0.000004","ref":"L12088"},"en":2.54,"radio":166,"estado":"sólido","clase":"de transición"},
    {"Z":80,"simbolo":"Hg","nombre":"mercurio","peso":200.59,"pesoTexto":"200.59","incertidumbre":0.01,"estandar":"200.592(3)","ei":{"ev":10.437504,"kj":1007,"tipo":"medido","inc":"0.000006","ref":"L11931,L11984"},"en":2,"radio":209,"estado":"líquido","clase":"de transición"},
    {"Z":81,"simbolo":"Tl","nombre":"talio","peso":204.38,"pesoTexto":"204.38","incertidumbre":0.01,"estandar":"[204.382, 204.385]","ei":{"ev":6.1082873,"kj":589,"tipo":"medido","inc":"0.0000012","ref":"L16353"},"en":1.62,"radio":196,"estado":"sólido","clase":"metal del bloque p"},
    {"Z":82,"simbolo":"Pb","nombre":"plomo","peso":207.2,"pesoTexto":"207.2","incertidumbre":1.1,"estandar":"[206.14, 207.94]","ei":{"ev":7.4166799,"kj":716,"tipo":"medido","inc":"0.0000006","ref":"L11569"},"en":2.33,"radio":202,"estado":"sólido","clase":"metal del bloque p"},
    {"Z":83,"simbolo":"Bi","nombre":"bismuto","peso":208.98,"pesoTexto":"208.98","incertidumbre":0.01,"estandar":"208.980 40(1)","ei":{"ev":7.285516,"kj":703,"tipo":"medido","inc":"0.000006","ref":"L10664,L6247"},"en":2.02,"radio":207,"estado":"sólido","clase":"metal del bloque p"},
    {"Z":84,"simbolo":"Po","nombre":"polonio","masico":[209],"ei":{"ev":8.41807,"kj":812,"tipo":"medido","inc":"0.000004","ref":"L20887,L20886"},"radio":197,"estado":"sólido","clase":"semimetal"},
    {"Z":85,"simbolo":"At","nombre":"astato","masico":[210],"ei":{"ev":9.31751,"kj":899,"tipo":"medido","inc":"0.00008","ref":"L18394"},"radio":202,"estado":"sólido","clase":"halógeno"},
    {"Z":86,"simbolo":"Rn","nombre":"radón","masico":[222],"ei":{"ev":10.7485,"kj":1037,"tipo":"medido","inc":"","ref":"L272,L7432"},"radio":220,"estado":"gas","clase":"gas noble"},
    {"Z":87,"simbolo":"Fr","nombre":"francio","masico":[223],"ei":{"ev":4.0727411,"kj":393,"tipo":"medido","inc":"0.0000011","ref":"L10714"},"radio":348,"estado":"sólido","clase":"alcalino"},
    {"Z":88,"simbolo":"Ra","nombre":"radio","masico":[226],"ei":{"ev":5.2784239,"kj":509,"tipo":"medido","inc":"0.0000025","ref":"L4979"},"en":0.9,"radio":283,"estado":"sólido","clase":"alcalinotérreo"},
    {"Z":89,"simbolo":"Ac","nombre":"actinio","masico":[227],"ei":{"ev":5.380235,"kj":519,"tipo":"medido","inc":"0.000012","ref":"L22136,L17893"},"en":1.1,"radio":260,"estado":"sólido","clase":"actínido"},
    {"Z":90,"simbolo":"Th","nombre":"torio","peso":232.04,"pesoTexto":"232.04","incertidumbre":0.01,"estandar":"232.0377(4)","notas":["g"],"ei":{"ev":6.3067,"kj":609,"tipo":"medido","inc":"0.00025","ref":"L15992"},"en":1.3,"radio":237,"estado":"sólido","clase":"actínido"},
    {"Z":91,"simbolo":"Pa","nombre":"protactinio","peso":231.04,"pesoTexto":"231.04","incertidumbre":0.01,"estandar":"231.035 88(1)","ei":{"ev":5.89,"kj":568,"tipo":"extrapolado","inc":"0.12","ref":"L16359"},"en":1.5,"radio":243,"estado":"sólido","clase":"actínido"},
    {"Z":92,"simbolo":"U","nombre":"uranio","peso":238.03,"pesoTexto":"238.03","incertidumbre":0.01,"estandar":"238.028 91(3)","notas":["g","m"],"ei":{"ev":6.19405,"kj":598,"tipo":"medido","inc":"0.00006","ref":"L5494,L7765"},"en":1.38,"radio":240,"estado":"sólido","clase":"actínido"},
    {"Z":93,"simbolo":"Np","nombre":"neptunio","masico":[237],"ei":{"ev":6.265608,"kj":605,"tipo":"medido","inc":"0.000019","ref":"L23048"},"en":1.36,"radio":221,"estado":"sólido","clase":"actínido"},
    {"Z":94,"simbolo":"Pu","nombre":"plutonio","masico":[244],"ei":{"ev":6.02576,"kj":581,"tipo":"medido","inc":"0.00025","ref":"L15992,L11260"},"en":1.28,"radio":243,"estado":"sólido","clase":"actínido"},
    {"Z":95,"simbolo":"Am","nombre":"americio","masico":[243],"ei":{"ev":5.97381,"kj":576,"tipo":"medido","inc":"0.00025","ref":"L15992"},"radio":244,"estado":"sólido","clase":"actínido"},
    {"Z":96,"simbolo":"Cm","nombre":"curio","masico":[247],"ei":{"ev":5.992241,"kj":578,"tipo":"medido","inc":"0.000020","ref":"L22423"},"radio":245,"estado":"sólido","clase":"actínido"},
    {"Z":97,"simbolo":"Bk","nombre":"berkelio","masico":[247],"ei":{"ev":6.19785,"kj":598,"tipo":"medido","inc":"0.00025","ref":"L15992"},"radio":244,"estado":"sólido","clase":"actínido"},
    {"Z":98,"simbolo":"Cf","nombre":"californio","masico":[251],"ei":{"ev":6.281878,"kj":606,"tipo":"medido","inc":"0.000006","ref":"L22260"},"radio":245,"estado":"sólido","clase":"actínido"},
    {"Z":99,"simbolo":"Es","nombre":"einstenio","masico":[252],"ei":{"ev":6.3684,"kj":614,"tipo":"medido","inc":"0.00006","ref":"L22449"},"radio":245,"estado":"sólido","clase":"actínido"},
    {"Z":100,"simbolo":"Fm","nombre":"fermio","masico":[257],"ei":{"ev":6.5,"kj":627,"tipo":"extrapolado","inc":"0.07","ref":"L16359"},"estado":"sólido","clase":"actínido"},
    {"Z":101,"simbolo":"Md","nombre":"mendelevio","masico":[258],"ei":{"ev":6.58,"kj":635,"tipo":"extrapolado","inc":"0.07","ref":"L16359"},"estado":"sólido","clase":"actínido"},
    {"Z":102,"simbolo":"No","nombre":"nobelio","masico":[259],"ei":{"ev":6.62621,"kj":639,"tipo":"medido","inc":"0.00005","ref":"L20870"},"estado":"sólido","clase":"actínido"},
    {"Z":103,"simbolo":"Lr","nombre":"laurencio","masico":[262,266],"ei":{"ev":4.96,"kj":479,"tipo":"medido","inc":"0.05","ref":"L21372"},"estado":"sólido","clase":"actínido"},
    {"Z":104,"simbolo":"Rf","nombre":"rutherfordio","masico":[267],"ei":{"ev":6.02,"kj":581,"tipo":"calculado","inc":"0.04","ref":"L19691"}},
    {"Z":105,"simbolo":"Db","nombre":"dubnio","masico":[268],"ei":{"ev":6.8,"kj":656,"tipo":"calculado","inc":"0.5","ref":"L12825"}},
    {"Z":106,"simbolo":"Sg","nombre":"seaborgio","masico":[269,271],"ei":{"ev":7.8,"kj":753,"tipo":"extrapolado","inc":"0.5","ref":"L7830"}},
    {"Z":107,"simbolo":"Bh","nombre":"bohrio","masico":[270,274],"ei":{"ev":7.7,"kj":743,"tipo":"extrapolado","inc":"0.5","ref":"L13544"}},
    {"Z":108,"simbolo":"Hs","nombre":"hasio","masico":[269,270],"ei":{"ev":7.6,"kj":733,"tipo":"extrapolado","inc":"0.5","ref":"L13544"}},
    {"Z":109,"simbolo":"Mt","nombre":"meitnerio","masico":[277,278]},
    {"Z":110,"simbolo":"Ds","nombre":"darmstatio","masico":[281]},
    {"Z":111,"simbolo":"Rg","nombre":"roentgenio","masico":[282]},
    {"Z":112,"simbolo":"Cn","nombre":"copernicio","masico":[285]},
    {"Z":113,"simbolo":"Nh","nombre":"nihonio","masico":[285,286]},
    {"Z":114,"simbolo":"Fl","nombre":"flerovio","masico":[289,290]},
    {"Z":115,"simbolo":"Mc","nombre":"moscovio","masico":[288,289,290]},
    {"Z":116,"simbolo":"Lv","nombre":"livermorio","masico":[291,292,293]},
    {"Z":117,"simbolo":"Ts","nombre":"teneso","masico":[294]},
    {"Z":118,"simbolo":"Og","nombre":"oganesón","masico":[294]}
  ];
  ELEMENTOS.forEach(Object.freeze);
  const FUENTES = Object.freeze({
    peso: 'CIAAW, Standard Atomic Weights 2024 (abreviado)',
    masico: 'NUBASE2020 (Kondev y otros, Chinese Physics C 45, 030001), compilado por la CIAAW',
    nombre: 'Transcrito por modelo; por verificar con la RSEQ',
    ei: 'NIST Atomic Spectra Database, Ionization Energies',
    en: 'PubChem (compilación), escala de Pauling; por verificar',
    radio: 'PubChem (compilación), radio de van der Waals; por verificar',
    estado: 'PubChem (compilación); por verificar',
    clase: 'PubChem (compilación); los semimetales no tienen una lista oficial de la IUPAC'
  });
  return Object.freeze({ ELEMENTOS: Object.freeze(ELEMENTOS), FUENTES });
});
