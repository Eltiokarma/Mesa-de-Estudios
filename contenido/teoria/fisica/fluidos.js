/* Fluidos: modelos ideales, datos explícitos y seis ideas. Propuesta: docs/etapa12/propuesta-fisica.md. */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(Math.abs(n) < 1e-10 ? 0 : n, d);
  const COLORES = { p:'i', F:'h', E:'h', P:'h', T:'h', W:'o', rho:'f', m:'f', gamma:'f', n:'f', A:'d', V:'d', h:'d', z:'d', ell:'d', L:'d', r:'d', d:'d', theta:'d', v:'o', Q:'o', t:'h', g:'h' };
  const V = (clave, texto) => ({ v: `c-${COLORES[clave]}`, t: String(texto), m: clave });
  const sub = (base, indice) => ({ sub: [base, indice] });
  const sup = (base, potencia = '2') => ({ sup: [base, potencia] });
  const frac = (arriba, abajo) => ({ frac: [arriba, abajo] });
  const raiz = contenido => ({ raiz: contenido });
  const S = Object.fromEntries(Object.keys(COLORES).map(k => [k, V(k, { rho:'ρ', gamma:'γ', ell:'ℓ', theta:'θ' }[k] || k)]));
  const Q = (clave, n, unidad = '', decimales = 2) => V(clave, `${f(n, decimales)}${unidad ? ` ${unidad}` : ''}`);
  const est = (datos, estado = {}) => ({ pieza: 'fis-estatica', datos, estado });
  const ejes = (datos, estado = {}) => ({ pieza: 'ejes', datos, estado });
  const paso = (texto, ecuacion) => ({ texto, ...(ecuacion ? { ecuacion } : {}) });
  const glosario = [];
  const flu = (datos, estado = {}) => ({ pieza:'fis-fluidos-e12', datos, estado });
  function opciones(valor, errores, formato = n => String(n)) {
    const lista = [{ id: 'c', texto: formato(valor), correcta: true, valor }, ...errores.map((e, n) => ({ id: `d${n}`, texto: formato(e.valor), valor: e.valor, error: e.error, siFuera: e.siFuera }))];
    if (new Set(lista.map(o => o.texto)).size !== lista.length) throw new Error('Fluidos: alternativas repetidas');
    if (errores.some(e => e.valor === valor)) throw new Error('Fluidos: dos respuestas correctas');
    return lista;
  }
  // Los adaptadores comparten el caso calculado, no confunden las familias de Resuelve y Ahora tú.
  function resuelto(c) {
    return { enunciado: c.enunciado, datos: c.datos, dibujo: c.dibujo, caso: c.caso,
      pasos: [{ tipo: 'pide', texto: c.pide }, { tipo: 'datos', texto: c.tengo }, { tipo: 'regla', ...c.regla },
        ...c.cuentas.map(p => ({ tipo: 'cuentas', ...p })), { tipo: 'sentido', texto: c.sentido }], respuesta: c.respuesta };
  }
  function pregunta(c) {
    return { pregunta: c.enunciado, datos: c.datos, dibujo: c.dibujo, caso: c.caso, opciones: c.opciones,
      solucion: { texto: c.sentido, ecuacion: c.cuentas[c.cuentas.length - 1].ecuacion || c.respuesta } };
  }
  function ejemplo(c, nivel, titulo, indice = 0) {
    const sol = [c.regla, ...c.cuentas];
    const out = { nivel, titulo, enunciado: c.enunciado, datos: c.datos, figura: c.dibujo, solucion: sol, respuesta: c.respuesta, caso: c.caso };
    if (nivel === 3) {
      const ops = c.opciones.slice(), rotar = indice % ops.length;
      out.alternativas = ops.slice(rotar).concat(ops.slice(0, rotar)).map(o => o.texto);
      // Cada valor incorrecto se nombra con su explicación; nunca se reutiliza A como nombre de un cuerpo.
      out.solucion.push({ texto: c.erroresEjemplo || 'Las otras opciones confunden la magnitud pedida con un dato o cambian la operación necesaria.' });
    }
    if (out.solucion.length > 4) throw new Error('Fluidos: solución demasiado larga');
    return out;
  }

  function azar(semilla) {
    let q = (semilla * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }

const idea1 = (() => {
  const n=x=>f(x,3), q=(k,x,u='')=>Q(k,x,u,6), pa=sub(S.p,'abs'), ps=sub(S.p,'0'), pm=sub(S.p,'man'), pe=sub(S.p,'ext');
  const signo=x=>Math.abs(Number(x.toFixed(3))-x)<1e-9?' = ':' ≈ ';
  const mostrar=(x,u)=>(signo(x).includes('≈')?'≈ ':'')+n(x)+' '+u;
  const unidad={densidad:'kg/L',presion:'Pa',fuerza:'N',incremento:'kPa',manometrica:'kPa','densidad-conversion':'kg/m³',area:'cm²',absoluta:'kPa',profundidad:'m','densidad-desnivel':'kg/m³','muestra-profundidad':'m','area-tapa':'cm²','dos-lecturas':'kPa','masa-presiones':'kg','tapa-profundidad':'m'};
  const clave={densidad:'rho',presion:'p',fuerza:'F',incremento:'p',manometrica:'p','densidad-conversion':'rho',area:'A',absoluta:'p',profundidad:'h','densidad-desnivel':'rho','muestra-profundidad':'h','area-tapa':'A','dos-lecturas':'p','masa-presiones':'m','tapa-profundidad':'h'};
  const liquido=['Líquido homogéneo en reposo; densidad constante.','Para este modelo, g = 10 m/s².'];
  const eq=['1 kPa = 1000 Pa.','1 L = 0,001 m³.','1 cm² = 0,0001 m².'];
  const er=(operacion,valor,motivo,corto)=>({operacion,valor,motivo,corto});
  function pistones(areas,fuerzas,presiones){
    const ids=areas.map((a,i)=>'cara-'+i),dos=ids.length===2;
    return flu({tipo:'prensa',modo:'medida',escala:{transversal:dos?2000:4000,fuerza:dos?0.5:1},
      prensa:{profundidad:0.1,conectados:false,pistones:areas.map((a,i)=>({id:ids[i],area:a/10000}))},
      flechas:fuerzas.map((F,i)=>({id:'f-'+i,ref:ids[i],magnitud:F,sentido:1,color:'h'})),
      rotulos:areas.flatMap((a,i)=>[{ref:ids[i],fila:0,texto:'A = '+n(a)+' cm²',color:'d'},
        {ref:ids[i],fila:1,texto:'F = '+n(fuerzas[i])+' N',color:'h'},
        ...(presiones&&presiones[i]!==null?[{ref:ids[i],fila:2,texto:'p = '+n(presiones[i])+' kPa',color:'i'}]:[])]),
      alt:dos?'Dos caras independientes reciben fuerzas normales iguales; sus áreas están indicadas.':'Una fuerza normal actúa sobre un pistón horizontal de área conocida.'});
  }
  function figura(tipo,e){
    // Solo se entregan a la pieza entradas conocidas; el esquema es independiente de la respuesta.
    if(['presion','fuerza','area'].includes(tipo)){
      const etiquetas=[];
      if(e.F!==undefined)etiquetas.push({texto:'F = '+n(e.F)+' N',color:'h'});
      if(e.A!==undefined)etiquetas.push({texto:'A = '+n(e.A)+' m²',color:'d'});
      if(e.p!==undefined)etiquetas.push({texto:'p = '+n(e.p)+(tipo==='fuerza'?' Pa':' kPa'),color:'i'});
      return flu({tipo:'prensa',modo:'esquema',prensa:{conectados:false,pistones:[{id:'cara'}]},
        flechas:e.F!==undefined?[{id:'f',ref:'cara',sentido:1,cualitativa:true,color:'h'}]:[],
        rotulos:etiquetas.map((x,i)=>({...x,ref:'cara',fila:i})),alt:'Una cara plana de un pistón recibe una fuerza normal resultante. Se indica su presión media cuando está dada.'});
    }
    if(['muestra-profundidad','masa-presiones'].includes(tipo)){
      const filas=[{ref:'muestra',fila:0,texto:'Muestra',color:'f'},
        {ref:'muestra',fila:1,texto:'Volumen: '+n(e.VL)+' L',color:'d'},
        ...(e.m!==undefined?[{ref:'muestra',fila:2,texto:'Masa: '+n(e.m)+' kg',color:'f'}]:[]),
        {ref:'tanque',fila:0,texto:'Tanque',color:'f'},
        {ref:'tanque',fila:1,texto:'Superficie: '+n(e.p0)+' kPa',color:'i'},
        {ref:'tanque',fila:2,texto:'Sensor: '+n(e.pAbs)+' kPa',color:'i'}];
      return flu({tipo:'vasos',modo:'esquema',vasos:[{id:'muestra'},{id:'tanque'}],
        puntos:[{id:'sensor',recipiente:'tanque'}],
        cotas:[{de:'superficie-tanque',a:'sensor',lado:'izq',separacion:12,texto:e.h===undefined?'h = ?':n(e.h)+' m',color:'d'}],
        rotulos:filas,alt:'Una muestra y un tanque contienen el mismo líquido. Solo el tanque tiene el sensor de presión; los tamaños no están a escala.'});
    }
    if(['densidad-desnivel','dos-lecturas'].includes(tipo)){
      return flu({tipo:'vasos',modo:'medida',escala:{vertical:40,transversal:40},vasos:[{id:'tanque',alto:5.2,ancho:3,nivel:5}],
        puntos:[{id:'superior',recipiente:'tanque',altura:5-e.h1},{id:'inferior',recipiente:'tanque',altura:5-e.h2}],
        cotas:[{de:'superficie-tanque',a:'superior',lado:'izq',texto:n(e.h1)+' m',color:'d'},
          {de:'superficie-tanque',a:'inferior',lado:'der',texto:n(e.h2)+' m',color:'d'}],
        rotulos:[{ref:'tanque',fila:0,texto:'Dos sensores de presión',color:'i'},
          ...(tipo==='dos-lecturas'?[{ref:'tanque',fila:1,texto:'Superior: '+n(e.p1)+' kPa',color:'i'},{ref:'tanque',fila:2,texto:'Inferior: '+n(e.p2)+' kPa',color:'i'}]:
            [{ref:'tanque',fila:1,texto:'Aumento: '+n(e.dp)+' kPa',color:'i'}])],
        alt:'Dos sensores están a las profundidades indicadas desde la misma superficie; el inferior registra la presión mayor.'});
    }
    const rotulos=[];
    const add=(texto,color)=>rotulos.push({ref:'tanque',texto,color});
    if(e.m!==undefined)add('Masa: '+n(e.m)+' kg','f');
    if(e.VL!==undefined)add('Volumen: '+n(e.VL)+' L','d');
    if(e.rho!==undefined)add('ρ = '+n(e.rho)+' kg/m³','f');
    if(e.h!==undefined)add('h = '+n(e.h)+' m','d');
    if(e.p0!==undefined)add('Superficie: '+n(e.p0)+' kPa','i');
    if(e.pAbs!==undefined)add('Interior: '+n(e.pAbs)+' kPa','i');
    if(e.pExt!==undefined)add('Exterior: '+n(e.pExt)+' kPa','i');
    if(e.F!==undefined)add('F = '+n(e.F)+' N','h');
    if(e.A!==undefined)add('Área: '+n(e.A)+' m²','d');
    if(e.mg!==undefined)add('Masa: '+n(e.mg)+' g','f');
    if(e.Vcm!==undefined)add('Volumen: '+n(e.Vcm)+' cm³','d');
    if(e.h1!==undefined)add('Sensor 1: '+n(e.h1)+' m','d');
    if(e.h2!==undefined)add('Sensor 2: '+n(e.h2)+' m','d');
    const tapa=tipo.includes('tapa'),cerrado=tapa||tipo==='manometrica';
    const sensor=['incremento','absoluta','profundidad'].includes(tipo);
    return flu({tipo:'vasos',modo:'esquema',vasos:[{id:'tanque',forma:'recto',...(tapa?{tapa:'fondo',cerrado:true}:cerrado?{tapa:true}:{})}],
      ...(sensor?{puntos:[{id:'sensor',recipiente:'tanque'}]}:{}),
      ...(tapa||sensor?{cotas:[{de:'superficie-tanque',a:tapa?'tapa-tanque':'sensor',lado:'der',texto:e.h===undefined?'h = ?':'h',color:'d'}]}:{}),
      rotulos:rotulos.slice(0,3).map((x,i)=>({...x,fila:i})),alt:tapa?'Un tanque cerrado tiene una tapa horizontal en el fondo, debajo de la superficie. La profundidad pedida no está a escala.':'Un recipiente muestra datos conocidos. El esquema no representa a escala las incógnitas.'});
  }
  function caso(tipo,e,conOpciones=false){
    const k=clave[tipo],u=unidad[tipo],g=e.g||10;
    let valor,enunciado,regla,cuentas,errores=[],intermedios={},datos=[...liquido];
    const final=(izq,num)=>[izq,signo(num),Q(k,num,u,3)];
    switch(tipo){
      case 'densidad':
        valor=e.m/e.VL;datos=['La masa corresponde solo al líquido.','El volumen está medido en litros.'];
        enunciado=['Una muestra de líquido tiene ',q('m',e.m,'kg'),' y ocupa ',q('V',e.VL,'L'),'. ¿Cuál es su densidad en kg/L?'];
        regla=paso('La densidad relaciona la masa del líquido con el volumen que ocupa.',[S.rho,' = ',frac(S.m,S.V)]);
        cuentas=[paso('Dividimos las cantidades compatibles.',final([S.rho,' = ',frac(q('m',e.m),q('V',e.VL))],valor))];break;
      case 'presion':
        valor=e.F/e.A;datos=['La fuerza indicada es la resultante normal sobre una sola cara.'];
        enunciado=['Una fuerza normal de ',q('F',e.F,'N'),' actúa sobre una cara de ',q('A',e.A,'m²'),'. ¿Qué presión media produce?'];
        regla=paso('Dividimos la fuerza normal entre el área de la cara.',[S.p,' = ',frac(S.F,S.A)]);
        cuentas=[paso('La presión queda en pascales.',final([S.p,' = ',frac(q('F',e.F),q('A',e.A))],valor))];break;
      case 'fuerza':
        valor=e.p*e.A;datos=['La presión indicada es el promedio sobre toda la cara.'];
        enunciado=['Una presión media de ',q('p',e.p,'Pa'),' actúa sobre una cara plana de ',q('A',e.A,'m²'),'. ¿Qué fuerza normal resultante ejerce?'];
        regla=paso('Despejamos la fuerza que actúa sobre esa cara.',[S.p,' = ',frac(S.F,S.A),'   ·   ',S.F,' = ',S.p,' · ',S.A]);
        cuentas=[paso('Multiplicamos presión por área.',final([S.F,' = ',q('p',e.p),' · ',q('A',e.A)],valor))];break;
      case 'incremento':
        valor=e.rho*g*e.h/1000;datos.push(eq[0]);
        enunciado=['Un líquido de ',q('rho',e.rho,'kg/m³'),' está en reposo. ¿Cuánto aumenta la presión al bajar ',q('h',e.h,'m'),' desde su superficie?'];
        regla=paso('La columna añade presión a la referencia de la superficie.',[S.p,' − ',ps,' = ',S.rho,' · ',S.g,' · ',S.h]);
        cuentas=[paso('Calculamos el aumento y lo expresamos en kilopascales.',final([S.p,' − ',ps,' = ',frac([q('rho',e.rho),' · ',q('g',g),' · ',q('h',e.h)],'1000')],valor))];break;
      case 'manometrica':
        valor=e.pAbs-e.pExt;datos=['Las dos presiones dadas son absolutas.'];
        enunciado=['Un tanque cerrado registra ',q('p',e.pAbs,'kPa'),' absolutos. El aire exterior está a ',q('p',e.pExt,'kPa'),' absolutos. ¿Cuál es la presión manométrica?'];
        regla=paso('La presión manométrica compara el interior con el aire exterior.',[pm,' = ',pa,' − ',pe]);
        cuentas=[paso('Restamos la referencia exterior.',final([pm,' = ',q('p',e.pAbs),' − ',q('p',e.pExt)],valor))];break;
      case 'densidad-conversion':
        valor=e.mg/e.Vcm*1000;datos=['La masa corresponde solo al líquido.','1 g = 0,001 kg; 1 cm³ = 0,000001 m³.'];
        enunciado=['Una muestra tiene ',q('m',e.mg,'g'),' y ocupa ',q('V',e.Vcm,'cm³'),'. ¿Cuál es su densidad en kg/m³?'];
        regla=paso('Usamos masa y volumen en las unidades solicitadas.',[S.rho,' = ',frac(S.m,S.V)]);
        cuentas=[paso('Convertimos ambas cantidades.',[S.m,' = ',q('m',e.mg/1000,'kg'),'; ',S.V,' = ',q('V',e.Vcm/1e6,'m³')]),
          paso('El cociente conserva el significado de densidad.',final([S.rho,' = ',frac(q('m',e.mg/1000),q('V',e.Vcm/1e6))],valor))];break;
      case 'area':
        valor=e.F/(e.p*1000)*10000;datos=['La fuerza indicada es la resultante normal sobre una sola cara.',eq[0],eq[2]];
        enunciado=['Una fuerza normal resultante de ',q('F',e.F,'N'),' produce una presión media de ',q('p',e.p,'kPa'),' sobre una cara. ¿Qué área tiene, en cm²?'];
        regla=paso('Aislamos el área y usamos la presión en pascales.',[S.p,' = ',frac(S.F,S.A),'   ·   ',S.A,' = ',frac(S.F,S.p)]);
        cuentas=[paso('Calculamos el área en metros cuadrados.',[S.A,' = ',frac(q('F',e.F),[q('p',e.p),' · 1000']),' = ',q('A',valor/10000,'m²')]),
          paso('Convertimos a centímetros cuadrados.',final([S.A,' = ',q('A',valor/10000),' · 10 000'],valor))];break;
      case 'absoluta':
        valor=e.p0+e.rho*g*e.h/1000;datos.push('La presión superficial indicada es absoluta.',eq[0]);
        enunciado=['La superficie de un líquido está a ',q('p',e.p0,'kPa'),'. Su densidad es ',q('rho',e.rho,'kg/m³'),'. ¿Qué presión absoluta hay a ',q('h',e.h,'m'),' de profundidad?'];
        regla=paso('La presión interior conserva la referencia absoluta de la superficie.',[pa,' = ',ps,' + ',S.rho,' · ',S.g,' · ',S.h]);
        cuentas=[paso('Expresamos el aumento de presión en kilopascales.',final([pa,' = ',q('p',e.p0),' + ',frac([q('rho',e.rho),' · ',q('g',g),' · ',q('h',e.h)],'1000')],valor))];break;
      case 'profundidad':
        valor=(e.pAbs-e.p0)*1000/(e.rho*g);datos.push('Las presiones interior y superficial son absolutas.',eq[0]);
        enunciado=['Un líquido de ',q('rho',e.rho,'kg/m³'),' tiene ',q('p',e.p0,'kPa'),' en la superficie y ',q('p',e.pAbs,'kPa'),' en un sensor. ¿A qué profundidad está?'];
        regla=paso('Restamos la referencia antes de aislar la profundidad.',[pa,' = ',ps,' + ',S.rho,' · ',S.g,' · ',S.h,'   ·   ',S.h,' = ',frac([pa,' − ',ps],[S.rho,' · ',S.g])]);
        cuentas=[paso('Convertimos la diferencia a pascales.',final([S.h,' = ',frac(['(',q('p',e.pAbs),' − ',q('p',e.p0),') · 1000'],[q('rho',e.rho),' · ',q('g',g)])],valor))];break;
      case 'densidad-desnivel':
        valor=e.dp*1000/(g*(e.h2-e.h1));datos.push(eq[0],'Las profundidades parten de la misma superficie.');
        enunciado=['La presión aumenta ',q('p',e.dp,'kPa'),' entre sensores a ',q('h',e.h1,'m'),' y ',q('h',e.h2,'m'),'. ¿Cuál es la densidad del líquido?'];
        regla=paso('La diferencia de presión corresponde a la columna entre sensores. Δ indica una diferencia.', ['Δ',S.p,' = ',S.rho,' · ',S.g,' · Δ',S.h]);
        cuentas=[paso('Restamos profundidades y despejamos la densidad.',['Δ',S.h,' = ',q('h',e.h2),' − ',q('h',e.h1),' = ',q('h',e.h2-e.h1,'m'),'; ',S.rho,' = ',frac(['Δ',S.p],[S.g,' · Δ',S.h])]),
          paso('Usamos la diferencia de presión en pascales.',final([S.rho,' = ',frac([q('p',e.dp),' · 1000'],[q('g',g),' · ',q('h',e.h2-e.h1)])],valor))];break;
      case 'muestra-profundidad': {
        const rho=e.m/e.VL*1000;valor=(e.pAbs-e.p0)*1000/(rho*g);intermedios={rho};
        datos.push('La muestra y el tanque contienen el mismo líquido.','Las dos presiones indicadas son absolutas.',eq[0],eq[1]);
        enunciado=['Una muestra de ',q('m',e.m,'kg'),' ocupa ',q('V',e.VL,'L'),'. En el tanque, superficie y sensor marcan ',q('p',e.p0,'kPa'),' y ',q('p',e.pAbs,'kPa'),'. ¿A qué profundidad está el sensor?'];
        regla=paso('La muestra permite calcular la densidad del tanque.',[S.rho,' = ',frac(S.m,S.V),' = ',frac(q('m',e.m),q('V',e.VL/1000)),' = ',q('rho',rho,'kg/m³')]);
        cuentas=[paso('Aislamos la profundidad en la relación hidrostática.',[pa,' = ',ps,' + ',S.rho,' · ',S.g,' · ',S.h,'   ·   ',S.h,' = ',frac([pa,' − ',ps],[S.rho,' · ',S.g])]),
          paso('Sustituimos la diferencia de presión y la densidad.',final([S.h,' = ',frac(['(',q('p',e.pAbs),' − ',q('p',e.p0),') · 1000'],[q('rho',rho),' · ',q('g',g)])],valor))];
        errores=[er('SIN_SUPERFICIE',e.pAbs*1000/(rho*g),'omitiste restar la presión superficial','omite referencia'),er('SUMA_SUPERFICIE',(e.pAbs+e.p0)*1000/(rho*g),'sumaste las presiones','suma presiones'),er('PRODUCTO_MUESTRA',valor/(e.VL*e.VL),'multiplicaste masa por volumen al hallar densidad','multiplica masa y volumen')];break;
      }
      case 'area-tapa': {
        const pInt=e.p0+e.rho*g*e.h/1000,dp=pInt-e.pExt;valor=e.F/(dp*1000)*10000;intermedios={pInt,dp};
        datos=['Líquido homogéneo en reposo; g = 10 m/s² en este modelo.','Tapa horizontal: la presión es uniforme en cada cara.','La fuerza neta indicada corresponde solo a las presiones.','Las presiones dadas son absolutas.',eq[0],eq[2]];
        enunciado=['Una tapa está ',q('h',e.h,'m'),' bajo un líquido de ',q('rho',e.rho,'kg/m³'),'. Superficie y exterior están a ',q('p',e.p0,'kPa'),' y ',q('p',e.pExt,'kPa'),'. La fuerza neta es ',q('F',e.F,'N'),'. ¿Qué área tiene?'];
        regla=paso('Calculamos la presión interior en la tapa.',[pa,' = ',ps,' + ',S.rho,' · ',S.g,' · ',S.h,'   ·   ',pa,' = ',q('p',e.p0),' + ',frac([q('rho',e.rho),' · ',q('g',g),' · ',q('h',e.h)],'1000'),' = ',q('p',pInt,'kPa')]);
        cuentas=[paso('Las caras reciben fuerzas opuestas; despejamos el área.',[S.F,' = (',pa,' − ',pe,') · ',S.A,'   ·   ',S.A,' = ',frac(S.F,[pa,' − ',pe])]),
          paso('Calculamos el área y la convertimos a centímetros cuadrados.',final([S.A,' = ',frac([q('F',e.F),' · 10 000'],['(',q('p',pInt),' − ',q('p',e.pExt),') · 1000'])],valor))];
        errores=[er('SIN_EXTERIOR',e.F/(pInt*1000)*10000,'ignoraste la presión exterior','omite exterior'),er('SIN_COLUMNA',e.F/((e.p0-e.pExt)*1000)*10000,'omitiste la columna líquida','omite columna'),er('SUMA_CARAS',e.F/((pInt+e.pExt)*1000)*10000,'sumaste fuerzas de sentidos opuestos','suma fuerzas opuestas')];break;
      }
      case 'dos-lecturas': {
        const rho=(e.p2-e.p1)*1000/(g*(e.h2-e.h1));valor=e.p1-rho*g*e.h1/1000;intermedios={rho};
        datos.push('Ambos sensores miden presión absoluta en el mismo líquido.','Las profundidades parten de la misma superficie.',eq[0]);
        enunciado=['A ',q('h',e.h1,'m'),' se miden ',q('p',e.p1,'kPa'),'; a ',q('h',e.h2,'m'),', ',q('p',e.p2,'kPa'),'. ¿Cuál es la presión absoluta en la superficie?'];
        regla=paso('Al restar las lecturas se elimina la referencia superficial.',[sub(S.p,'2'),' − ',sub(S.p,'1'),' = ',S.rho,' · ',S.g,' · (',sub(S.h,'2'),' − ',sub(S.h,'1'),')']);
        cuentas=[paso('Aislamos la densidad con la columna entre sensores.',[S.rho,' = ',frac(['(',q('p',e.p2),' − ',q('p',e.p1),') · 1000'],[q('g',g),' · (',q('h',e.h2),' − ',q('h',e.h1),')']),' = ',q('rho',rho,'kg/m³')]),
          paso('Despejamos la referencia con la primera lectura.',final([ps,' = ',sub(S.p,'1'),' − ',S.rho,' · ',S.g,' · ',sub(S.h,'1'),'   ·   ',ps,' = ',q('p',e.p1),' − ',frac([q('rho',rho),' · ',q('g',g),' · ',q('h',e.h1)],'1000')],valor))];
        errores=[er('PRIMER_SENSOR',e.p1,'tomaste la primera lectura como superficial','usa primera lectura'),er('SUMA_COLUMNA',e.p1+rho*g*e.h1/1000,'sumaste la columna al subir','suma al subir'),er('SEGUNDO_SIN_REFERENCIA',e.p1-e.p2*e.h1/e.h2,'hallaste densidad suponiendo presión superficial nula','supone referencia nula')];break;
      }
      case 'masa-presiones': {
        const rho=(e.pAbs-e.p0)*1000/(g*e.h);valor=rho*e.VL/1000;intermedios={rho};
        datos.push('La muestra tiene la misma densidad que el líquido del tanque.','Las dos presiones son absolutas.',eq[0],eq[1]);
        enunciado=['Superficie y sensor, a ',q('h',e.h,'m'),', marcan ',q('p',e.p0,'kPa'),' y ',q('p',e.pAbs,'kPa'),'. ¿Qué masa tiene una muestra de ',q('V',e.VL,'L'),'?'];
        regla=paso('Aislamos la densidad a partir de la presión hidrostática.',[pa,' − ',ps,' = ',S.rho,' · ',S.g,' · ',S.h,'   ·   ',S.rho,' = ',frac([pa,' − ',ps],[S.g,' · ',S.h])]);
        cuentas=[paso('Calculamos la densidad con las presiones en pascales.',[S.rho,' = ',frac(['(',q('p',e.pAbs),' − ',q('p',e.p0),') · 1000'],[q('g',g),' · ',q('h',e.h)]),' = ',q('rho',rho,'kg/m³')]),
          paso('Despejamos la masa y convertimos el volumen a metros cúbicos.',final([S.rho,' = ',frac(S.m,S.V),'   ·   ',S.m,' = ',S.rho,' · ',S.V,' = ',q('rho',rho),' · ',q('V',e.VL/1000)],valor))];
        errores=[er('SIN_SUPERFICIE',e.pAbs*e.VL/(g*e.h),'ignoraste la presión superficial','omite superficie'),er('SUMA_SUPERFICIE',(e.pAbs+e.p0)*e.VL/(g*e.h),'sumaste las presiones','suma presiones'),er('SIN_GRAVEDAD',valor*g,'omitiste la gravedad al hallar densidad','omite gravedad')];break;
      }
      case 'tapa-profundidad': {
        const dp=e.F/(e.Acm/10000)/1000;valor=(dp-(e.p0-e.pExt))*1000/(e.rho*g);intermedios={dp};
        datos=['Líquido homogéneo en reposo; g = 10 m/s² en este modelo.','Tapa horizontal: la presión es uniforme en cada cara.','La fuerza neta indicada corresponde solo a las presiones.','Las presiones dadas son absolutas.',eq[0],eq[2]];
        enunciado=['Una tapa de ',q('A',e.Acm,'cm²'),' recibe ',q('F',e.F,'N'),' netos. El líquido tiene ',q('rho',e.rho,'kg/m³'),'; superficie y exterior están a ',q('p',e.p0,'kPa'),' y ',q('p',e.pExt,'kPa'),'. ¿A qué profundidad está?'];
        regla=paso('Las presiones opuestas producen una fuerza neta.',[S.F,' = (',pa,' − ',pe,') · ',S.A,'   ·   ',pa,' − ',pe,' = ',frac(q('F',e.F),q('A',e.Acm/10000)),' = ',q('p',dp*1000,'Pa')]);
        cuentas=[paso('Sustituimos la presión hidrostática y aislamos la profundidad.',[S.h,' = ',frac([frac(S.F,S.A),' − (',ps,' − ',pe,')'],[S.rho,' · ',S.g])]),
          paso('Usamos la diferencia de presión en pascales.',final([S.h,' = ',frac(['(',q('p',dp),' − (',q('p',e.p0),' − ',q('p',e.pExt),')) · 1000'],[q('rho',e.rho),' · ',q('g',g)])],valor))];
        errores=[er('SIN_REFERENCIA',dp*1000/(e.rho*g),'atribuiste toda la diferencia a la columna','omite referencia superficial'),er('SUMA_REFERENCIA',(dp+e.p0-e.pExt)*1000/(e.rho*g),'sumaste la diferencia superficial','suma diferencia superficial'),er('SIN_EXTERIOR',(dp-e.p0)*1000/(e.rho*g),'restaste la presión superficial sin incluir la exterior','omite exterior')];break;
      }
      default:throw new Error('Tipo desconocido: '+tipo);
    }
    const errorPublico=errores.map(x=>({valor:x.valor,error:'FL12-P-'+x.operacion,siFuera:'Identificaste los datos; '+x.motivo+'. Obtienes '+mostrar(x.valor,u)+'.'}));
    const ops=conOpciones?opciones(valor,errorPublico,x=>mostrar(x,u)):[];
    return {enunciado,datos,dibujo:figura(tipo,e),pide:['Busco ',V(k,({rho:'la densidad',p:'la presión',F:'la fuerza',A:'el área',h:'la profundidad',m:'la masa'})[k]),'.'],
      tengo:Object.entries(e).filter(([k])=>k!=='g').map(([k,x])=>({m:q('m',x,'kg'),VL:q('V',x,'L'),mg:q('m',x,'g'),Vcm:q('V',x,'cm³'),rho:q('rho',x,'kg/m³'),F:q('F',x,'N'),A:q('A',x,'m²'),p:q('p',x,'kPa'),p0:q('p',x,'kPa'),pAbs:q('p',x,'kPa'),dp:q('p',x,'kPa'),h:q('h',x,'m'),h1:q('h',x,'m'),h2:q('h',x,'m')}[k]||String(x))).flatMap((x,i)=>i?['; ',x]:[x]),
      regla,cuentas,sentido:['La respuesta es ',V(k,mostrar(valor,u)),', con las unidades y la referencia solicitadas.'],respuesta:[V(k,mostrar(valor,u))],opciones:ops,
      caso:{tipo,...e,g,valor,unidad:u,intermedios,errores:errores.map(({operacion,valor})=>({operacion,valor}))},
      erroresEjemplo:errores.map(x=>mostrar(x.valor,u)+': '+(x.corto||x.motivo)).join('; ')+'.'};
  }
  const muestras=[
    ['densidad',{m:1.8,VL:2},'Masa en un volumen'],['presion',{F:180,A:0.6},'Una fuerza normal'],
    ['fuerza',{p:2500,A:0.04},'Fuerza sobre una cara'],['incremento',{rho:1000,h:0.6},'Debajo de la superficie'],
    ['manometrica',{pAbs:94,pExt:100},'Una lectura bajo la referencia'],
    ['densidad-conversion',{mg:150,Vcm:125},'La misma densidad en otras unidades'],['area',{F:240,p:60},'Despejar una superficie'],
    ['absoluta',{rho:800,h:0.75,p0:95},'La presión sobre el líquido'],['profundidad',{rho:1400,pAbs:128,p0:100},'Ubicar el sensor'],
    ['densidad-desnivel',{dp:7.2,h1:0.2,h2:1.1},'Dos profundidades conocidas'],
    ['muestra-profundidad',{m:1.5,VL:2,p0:90,pAbs:120},'De la muestra al tanque'],
    ['area-tapa',{rho:1000,h:0.4,p0:116,pExt:100,F:600},'Las dos caras de una tapa'],
    ['dos-lecturas',{p1:108,p2:120,h1:0.4,h2:1.6},'Reconstruir la presión superficial'],
    ['masa-presiones',{p0:100,pAbs:130,h:2,VL:1.5},'Pesar una muestra mediante lecturas'],
    ['tapa-profundidad',{Acm:24,F:72,rho:1000,p0:110,pExt:100},'La profundidad de una tapa']
  ];
  const firma=(t,e)=>t+'|'+JSON.stringify(Object.entries(e).sort());
  const reservadas=new Set(muestras.map(([t,e])=>firma(t,e)));
  function generar(semilla,practica){
    const r=azar(semilla+(practica?17000:9000));
    for(let intento=0;intento<200;intento++){
      let t,e;
      if(!practica){
        t=r.de(['densidad-conversion','area','absoluta','profundidad','densidad-desnivel']);
        const rho=r.de([700,900,1100,1300]),h=r.de([0.4,0.8,1.2,1.6]),p0=r.de([84,92,96]);
        if(t==='densidad-conversion'){const Vcm=r.de([80,160,240,320]);e={mg:rho*Vcm/1000,Vcm};}
        if(t==='area'){e={F:r.de([120,180,300,360]),p:r.de([15,25,30,45])};if((10*e.F)%e.p!==0)continue;}
        if(t==='absoluta')e={rho,h,p0};
        if(t==='profundidad')e={rho,p0,pAbs:p0+rho*10*h/1000};
        if(t==='densidad-desnivel'){const h1=r.de([0.1,0.3,0.5]),h2=h1+h;e={dp:rho*10*h/1000,h1,h2};}
      }else{
        t=r.de(['muestra-profundidad','area-tapa','dos-lecturas','masa-presiones','tapa-profundidad']);
        const rho=r.de([750,900,1000,1250]),h=r.de([1.6,2.4,3.2,4]),p0=r.de([80,96,104]),V=r.de([1.2,1.6,2,2.4]);
        if(t==='muestra-profundidad')e={m:rho*V/1000,VL:V,p0,pAbs:p0+rho*10*h/1000};
        if(t==='area-tapa'){const pExt=p0-20,A=r.de([0.002,0.004,0.006,0.008]);e={rho,h,p0,pExt,F:(20+rho*10*h/1000)*1000*A};}
        if(t==='dos-lecturas'){const h1=r.de([0.2,0.4,0.6]),h2=h1+h;e={p1:p0+rho*10*h1/1000,p2:p0+rho*10*h2/1000,h1,h2};}
        if(t==='masa-presiones')e={p0,pAbs:p0+rho*10*h/1000,h,VL:V};
        if(t==='tapa-profundidad'){const pExt=p0-12,Acm=r.de([16,20,32,40]);e={rho,p0,pExt,Acm,F:(12+rho*10*h/1000)*1000*Acm/10000};}
      }
      e=Object.fromEntries(Object.entries(e).map(([k,v])=>[k,typeof v==='number'?Number(v.toFixed(8)):v]));
      if(reservadas.has(firma(t,e)))continue;
      const c=caso(t,e,practica);
      if(practica&&c.caso.errores.some(x=>Math.abs(x.valor/c.caso.valor)<0.05||Math.abs(x.valor/c.caso.valor)>20))continue;
      return practica?pregunta(c):resuelto(c);
    }
    throw new Error('No salió un caso de presión distinto y dentro de escala.');
  }
  glosario.push(
    {termino:'densidad',simbolo:'ρ',medida:'kg/m³',formas:['densidad','densidades'],simple:'Cuánta masa hay en un volumen de material.',def:'Masa de una muestra dividida entre el volumen que ocupa.',ejemplos:['Una muestra de 2 kg en 2 L tiene densidad de 1 kg/L.','Dos litros y un litro del mismo líquido homogéneo tienen igual densidad.','Conocer masa y volumen permite comparar materiales.']},
    {termino:'presión',simbolo:'p',medida:'Pa',formas:['presión','presiones'],simple:'Una medida de la acción normal distribuida sobre una superficie.',def:'Magnitud escalar que describe la acción normal distribuida de un fluido sobre una superficie.',ejemplos:['Un sensor registra la presión en el interior de un tanque.','La presión se mide en pascales.','Una pared y un fondo reciben fuerzas normales de un líquido.']},
    {termino:'presión absoluta',simbolo:'p',medida:'Pa',formas:['presión absoluta','presiones absolutas'],simple:'Presión medida desde el vacío como referencia.',def:'Presión cuya referencia de cero es el vacío.',ejemplos:['Una lectura absoluta identifica su referencia.','Una cámara puede tener menor presión absoluta que el aire exterior.','La presión absoluta no puede ser negativa.']},
    {termino:'presión manométrica',simbolo:'p',medida:'Pa',formas:['presión manométrica','presiones manométricas'],simple:'Diferencia de presión respecto al aire que rodea el instrumento.',def:'Presión interior menos presión atmosférica de referencia.',ejemplos:['Cero manométrico indica igual presión que el aire de referencia.','Una lectura manométrica negativa corresponde a presión menor que la exterior.','Dos instrumentos deben usar la misma referencia para comparar sus lecturas.']}
  );
  const pred={F:90,A1:30,A2:15},pInicial=pred.F/(pred.A1/10000)/1000,pFinal=pred.F/(pred.A2/10000)/1000;
  const compara=revelar=>pistones([pred.A1,pred.A2],[pred.F,pred.F],[pInicial,revelar?pFinal:null]);
  const columna=flu({tipo:'vasos',modo:'esquema',vasos:[{id:'tanque'}],puntos:[{id:'sensor',recipiente:'tanque'}],
    cotas:[{de:'superficie-tanque',a:'sensor',lado:'der',texto:'h',color:'d'}],
    rotulos:[{ref:'tanque',fila:0,texto:'Presión superficial',color:'i'},{ref:'tanque',fila:1,texto:'Columna de líquido',color:'f'},{ref:'tanque',fila:2,texto:'Profundidad vertical: h',color:'d'}],
    alt:'Un recipiente con líquido en reposo; la profundidad vertical parte de su superficie.'});
  const caras=flu({tipo:'vasos',modo:'esquema',vasos:[{id:'tanque',tapa:'fondo',cerrado:true}],
    rotulos:[{ref:'tanque',fila:0,texto:'Tapa horizontal en el fondo',color:'d'},
      {ref:'tanque',fila:1,texto:'Interior: presión absoluta',color:'i'},
      {ref:'tanque',fila:2,texto:'Exterior: aire de referencia',color:'i'}],
    alt:'La tapa horizontal del fondo tiene líquido en su cara superior y aire exterior en la inferior.'});
  return {
    id:'presion-profundidad',titulo:'Un líquido y una superficie',pregunta:'¿Cómo relacionas una fuerza, una superficie y la presión de un líquido?',
    temas:['Densidad y presión','Presión hidrostática y atmosférica'],pieza:'fis-fluidos-e12',
    aprendizaje:'Distingo fuerza y presión; calculo la densidad y uso una referencia para interpretar la presión de un líquido quieto.',
    actividad:'Aplicar una fuerza normal a un pistón y leer la presión que añade al líquido.',
    lee:{tarjetas:[
      {titulo:'Una cara que empuja al líquido',texto:'Un pistón es una pieza móvil que empuja al líquido. La fuerza normal actúa perpendicularmente a su cara. El sensor mide la presión añadida respecto al aire exterior.',dibujo:pistones([20],[20],[10])},
      {titulo:'Masa y volumen son cantidades distintas',texto:['La densidad ',S.rho,' indica cuánta masa ',S.m,' corresponde al volumen ',S.V,'. Se calcula dividiendo masa entre volumen. Una muestra de 0,8 kg en 1 L tiene 0,8 kg/L.'],ecuacion:[S.rho,' = ',frac(S.m,S.V)]},
      {titulo:'La referencia de una lectura',texto:'La presión absoluta se mide desde el vacío. La presión manométrica compara con el aire exterior. En el juego, el sensor muestra la presión añadida por tu fuerza; se mide en kilopascales.'}
    ]},
    ejemplos:muestras.map(([t,e,titulo],i)=>ejemplo(caso(t,e,i>=10),Math.floor(i/5)+1,titulo,i-10)),
    juega:{pieza:'fis-fluidos-e12',consigna:'Un pistón horizontal empuja un líquido encerrado. Ajusta la fuerza normal para alcanzar la lectura pedida.',voz:'Compara las lecturas mientras la misma cara recibe fuerzas diferentes.',
      mision:{texto:'Haz que el sensor registre 30 kPa de presión añadida.',logrado:v=>Math.abs(v.F/0.002/1000-30)<1e-9,bien:'La lectura llegó a 30 kPa con la misma área.',pista:'Prueba otra fuerza y compara la lectura del sensor.'},
      controles:[{id:'F',etiqueta:'Fuerza normal, F',color:'c-h',opciones:[20,40,60,80].map(F=>({valor:F,texto:F+' N'})),inicio:20}],
      leyenda:[{s:S.F,t:'fuerza normal adicional, sin incluir el aire exterior'},{s:S.A,t:'área fija de la cara: 20 cm²'},{s:S.p,t:'presión añadida respecto al aire, medida en kPa'},{s:'Modelo',t:'equilibrio; pistón sin masa ni rozamiento'}],
      dibujo:v=>pistones([20],[v.F],[v.F/0.002/1000]),lectura:v=>['Con ',q('F',v.F,'N'),', el sensor marca ',q('p',v.F/0.002/1000,'kPa'),'.'],resumen:{F:40},minimo:2},
    predice:{pregunta:'El sensor mide 30 kPa con una fuerza de 90 N sobre 30 cm². Conservas la fuerza y usas 15 cm². ¿Qué presión añadida esperas?',
      datos:['La fuerza actúa perpendicularmente sobre cada cara.','El pistón está en equilibrio y no tiene masa ni rozamiento.','Ambos casos usan el mismo aire exterior como referencia.'],
      opciones:opciones(pFinal,[{valor:pInicial,error:'FL12-P-CONSERVA',siFuera:'Conservaste la fuerza. Esa lectura corresponde al área inicial: 30 kPa.'},
        {valor:pInicial*pred.A2/pred.A1,error:'FL12-P-PROPORCIONAL',siFuera:'Reconociste media área; hiciste la presión proporcional al área y obtuviste 15 kPa.'},
        {valor:pInicial*(pred.A1/pred.A2)**2,error:'FL12-P-DOBLE_CAMBIO',siFuera:'Reconociste que cambia el área; aplicaste dos veces su factor y obtuviste 120 kPa.'}],x=>n(x)+' kPa'),
      dibujo:compara(false),revelar:compara(true),coincide:'Coincide: la misma fuerza actúa sobre media área y añade el doble de presión.'},
    mira:{pieza:'fis-fluidos-e12',datos:compara(true).datos,pasos:[
      {estado:{paso:0},texto:'La presión media divide la fuerza normal entre el área.',ecuacion:[S.p,' = ',frac(S.F,S.A)]},
      {estado:{paso:1},texto:'La fuerza permanece; convertimos la nueva área a metros cuadrados.',ecuacion:[S.p,' = ',frac(q('F',90),q('A',0.0015)),' = ',q('p',60000,'Pa'),' = ',q('p',60,'kPa')]},
      {estado:{datos:columna.datos},texto:'Una columna de área constante tiene volumen igual al área por profundidad.',ecuacion:[S.V,' = ',S.A,' · ',S.h,'   ·   ',S.m,' = ',S.rho,' · ',S.V]},
      {estado:{datos:columna.datos},texto:['El peso añade presión; ',ps,' es presión superficial; ',S.g,' es la aceleración gravitatoria.'],ecuacion:[S.p,' − ',ps,' = ',frac([S.m,' · ',S.g],S.A),' = ',S.rho,' · ',S.g,' · ',S.h]},
      {estado:{datos:columna.datos},texto:'La presión interior suma la referencia superficial y el aporte de la columna.',ecuacion:[pa,' = ',ps,' + ',S.rho,' · ',S.g,' · ',S.h]},
      {estado:{datos:columna.datos},texto:'Entre dos profundidades, la misma referencia superficial se cancela al restar.',ecuacion:[sub(S.p,'2'),' − ',sub(S.p,'1'),' = ',S.rho,' · ',S.g,' · (',sub(S.h,'2'),' − ',sub(S.h,'1'),')']},
      {estado:{datos:caras.datos},texto:'Restamos la referencia exterior; dos caras horizontales reciben fuerzas normales opuestas.',ecuacion:[pm,' = ',pa,' − ',pe,'   ·   ',S.F,' = ',pm,' · ',S.A]}
    ]},
    regla:{texto:'La presión media relaciona fuerza normal y área. En un líquido quieto, aumenta con la profundidad vertical. La presión manométrica resta la referencia atmosférica.',
      ecuacion:[S.p,' = ',frac(S.F,S.A),'   ·   ',pa,' = ',ps,' + ',S.rho,' · ',S.g,' · ',S.h],
      condicion:'Líquido homogéneo en reposo, gravedad uniforme; referencia superficial conocida. Sobre una cara horizontal, la presión es uniforme.',
      voz:'La densidad es masa entre volumen. Una presión absoluta y una manométrica usan ceros distintos.',dibujo:columna},
    resuelve:{pieza:'fis-fluidos-e12',generar:s=>generar(s,false)},ahoraTu:{pieza:'fis-fluidos-e12',generar:s=>generar(s,true)}
  };
})();

const idea2 = (() => {
  const fmt = x => f(x, 3), q = (k, x, u = '') => Q(k, x, u, 6);
  const exacto = x => Math.abs(x - Number(x.toFixed(3))) < 1e-8;
  const signo = x => exacto(x) ? ' = ' : ' ≈ ';
  const mostrar = (x, u) => (exacto(x) ? '' : '≈ ') + fmt(x) + ' ' + u;
  const pa = sub(S.p, 'atm'), pc = sub(S.p, 'cámara'), pt = sub(S.p, 'sup'), pm = sub(S.p, 'man');
  const rl = sub(S.rho, 'ligero'), rb = sub(S.rho, 'base'), hl = sub(S.h, 'ligero'), hb = sub(S.h, 'base');
  const dz = ['Δ', S.z], dh = ['Δ', S.h], z0 = sub(S.z, '0'), zf = sub(S.z, 'final');
  const er = (operacion, valor, causa, corto) => ({ operacion, valor, causa, corto });
  const unir = xs => xs.flatMap((x, i) => i ? ['; ', x] : [x]);
  const final = (simbolo, expresion, valor, k, u) => [simbolo, ' = ', expresion, signo(valor), Q(k, valor, u, 3)];
  const modelo = ['Los líquidos están en reposo; se desprecia la capilaridad.', ['Para el modelo, ', S.g, ' = ', q('g', 10, 'm/s²'), '.']];

  function tubo(izquierda, derecha, rotulos = [], cerrado = false, extra = {}) {
    return flu({ tipo: 'tubo-u', escala: { vertical: 450, transversal: 450 },
      tuboU: { alto: 0.42, ancho: 0.045, ramas: [
        { id: 'izquierda', cerrada: cerrado, capas: izquierda.map((alto, i) => ({ alto, tono: i + 1 })) },
        { id: 'derecha', capas: derecha.map((alto, i) => ({ alto, tono: i + 1 })) }
      ] }, rotulos, ...extra });
  }
  function previo() {
    return flu({ tipo: 'tubo-u', modo: 'esquema', tuboU: { ramas: [
      { id: 'izquierda', capas: [{}] }, { id: 'derecha', capas: [{}] }
    ] }, rotulos: [{ texto: 'Antes de añadir el líquido' }],
    alt: 'Estado previo: el mismo líquido ocupa las ramas abiertas de un tubo en U.' });
  }
  function barometro(c, alturaConocida) {
    return flu({ tipo: 'barometro', ...(alturaConocida ? { escala: { vertical: 190, transversal: 190 } } : { modo: 'esquema' }),
      barometro: { ...(alturaConocida ? { alto: 1.05, ancho: 0.1, columna: c.h } : {}), camara: c.pTop === 0 ? 'vacio' : 'gas' },
      ...(alturaConocida ? { cotas: [{ de: 'cubeta', a: 'columna', separacion: 44, texto: fmt(c.h) + ' m', color: 'd' }] } : {}),
      rotulos: [{ texto: 'Cubeta abierta al aire' }, { fila: 1, texto: 'Arriba: ' + fmt(c.pTop) + ' Pa', color: 'i' }],
      alt: alturaConocida ? 'Barómetro con altura medida desde la superficie de la cubeta y presión superior indicada.' : 'Esquema de un barómetro; la altura desconocida no está representada a escala.' });
  }
  function figura(c) {
    if (c.tipo.startsWith('manometro')) {
      const h = c.h ?? c.hCm / 100, izq = 0.1 + (c.sentido < 0 ? h : 0), der = 0.1 + (c.sentido > 0 ? h : 0);
      return tubo([izq], [der], [{ ref: 'izquierda', texto: 'Cámara' }, { ref: 'derecha', texto: 'Aire exterior' },
        { texto: 'Desnivel: ' + fmt(h * 100) + ' cm', fila: 1, color: 'd' }], true,
        { cotas: [{ de: 'superficie-izquierda', a: 'superficie-derecha', separacion: 28, texto: 'h', color: 'd' }],
          alt: 'Manómetro con cámara a la izquierda. La superficie ' + (c.sentido > 0 ? 'derecha' : 'izquierda') + ' está más alta; se indica el desnivel conocido.' });
    }
    if (c.tipo === 'barometro-presion') return barometro(c, true);
    if (c.tipo === 'barometro-altura') return barometro(c, false);
    if (c.tipo === 'barometro-calibracion') {
      const d = barometro({ h: c.h1, pTop: c.pTop1 }, true);
      d.datos.rotulos.push({ texto: 'Primer estado', fila: 2 });
      d.datos.alt = 'Primer estado del barómetro: la altura y la presión superior son datos conocidos.';
      return d;
    }
    if (c.tipo === 'capas-gas') return tubo([0.06, ...c.capas.map(x => x.h)], [0.06 + c.hBase],
      [{ ref: 'izquierda', texto: 'Gas sobre dos capas' }, { ref: 'derecha', texto: 'Aire exterior' }], true,
      { alt: 'Dos capas conocidas están sobre el líquido base; la rama derecha está abierta al aire. La presión del gas no se muestra.' });
    return previo();
  }

  function calcular(c, conOpciones = false) {
    c = { ...c, g: 10 };
    const rho = c.rho ?? c.rhoGcm3 * 1000, h = c.h ?? c.hCm / 100;
    let valor, k = 'p', u = 'Pa', enunciado, regla, cuentas, entradas = [], errores = [], intermedios = {};
    let condiciones = [...modelo];
    const dato = (...partes) => entradas.push(partes);
    const presion = c.tipo.startsWith('manometro');
    if (presion) {
      dato('Densidad: ', q('rho', c.rho ?? c.rhoGcm3, c.rho === undefined ? 'g/cm³' : 'kg/m³'), '; desnivel: ', q('h', c.h ?? c.hCm, c.h === undefined ? 'cm' : 'm'), '.');
      dato('Presión absoluta del aire: ', q('p', c.pAtm, 'Pa'), '.');
      condiciones.push('La cámara está a la izquierda; la superficie ' + (c.sentido > 0 ? 'derecha' : 'izquierda') + ' está más alta.');
      const dp = c.sentido * rho * 10 * h;
      valor = c.tipo === 'manometro-gauge' ? dp : c.pAtm + dp;
      enunciado = c.tipo === 'manometro-gauge' ? 'Un manómetro abierto contiene el líquido indicado. ¿Qué presión manométrica tiene la cámara?' : 'El manómetro compara una cámara con el aire exterior. ¿Cuál es la presión absoluta de la cámara?';
      regla = paso('Bajando aumenta la presión; subiendo disminuye. Usamos el desnivel entre ambas superficies.',
        [pc, ' = ', pa, c.sentido > 0 ? ' + ' : ' − ', S.rho, ' · ', S.g, ' · ', S.h, '   ·   ', pm, ' = ', pc, ' − ', pa]);
      const producto = [q('rho', rho), ' · ', q('g', 10), ' · ', q('h', h)];
      cuentas = [paso('Aplicamos el sentido del recorrido y la referencia pedida.',
        final(c.tipo === 'manometro-gauge' ? pm : pc,
          c.tipo === 'manometro-gauge' ? [c.sentido < 0 ? '−(' : '(', ...producto, ')'] : [q('p', c.pAtm), c.sentido > 0 ? ' + ' : ' − ', ...producto], valor, k, u))];
      if (c.rhoGcm3 !== undefined) cuentas.unshift(paso('Convertimos densidad y longitud antes de calcular.',
        [S.rho, ' = ', q('rho', c.rhoGcm3), ' · 1000 = ', q('rho', rho, 'kg/m³'), '   ·   ', S.h, ' = ', frac(q('h', c.hCm), '100'), ' = ', q('h', h, 'm')]));
      const base = c.tipo === 'manometro-gauge' ? 0 : c.pAtm;
      errores = [er('SIGNO', base - dp, 'invertiste cuál superficie está más alta', 'invierte el signo'),
        er('MEDIO_DESNIVEL', base + dp / 2, 'usaste medio desnivel como altura completa', 'usa medio desnivel'),
        er('DOBLE_DESNIVEL', base + 2 * dp, 'duplicaste el desnivel entre superficies', 'duplica el desnivel')];
    } else if (c.tipo === 'barometro-presion' || c.tipo === 'barometro-altura') {
      dato('Densidad: ', q('rho', c.rho, 'kg/m³'), '; presión superior: ', q('p', c.pTop, 'Pa'), '.');
      const inversa = c.tipo === 'barometro-altura';
      dato(inversa ? 'Presión absoluta del aire: ' : 'Altura sobre la cubeta: ', q(inversa ? 'p' : 'h', inversa ? c.pAtm : c.h, inversa ? 'Pa' : 'm'), '.');
      condiciones.push('La cubeta está abierta; su superficie no cambia apreciablemente de nivel.');
      k = inversa ? 'h' : 'p'; u = inversa ? 'm' : 'Pa';
      valor = inversa ? (c.pAtm - c.pTop) / (c.rho * 10) : c.pTop + c.rho * 10 * c.h;
      enunciado = inversa ? 'La cámara superior del barómetro tiene la presión indicada. ¿Qué altura alcanza la columna sobre la cubeta?' : 'La columna del barómetro está en equilibrio. ¿Cuál es la presión del aire sobre la cubeta?';
      regla = paso('La presión de arriba más el aporte de la columna iguala la del aire sobre la cubeta.',
        [pa, ' = ', pt, ' + ', S.rho, ' · ', S.g, ' · ', S.h,
          ...(inversa ? ['   ·   ', S.h, ' = ', frac([pa, ' − ', pt], [S.rho, ' · ', S.g])] : [])]);
      cuentas = [paso(inversa ? 'Restamos las presiones antes de dividir.' : 'Sumamos la presión superior y la columna.',
        final(inversa ? S.h : pa, inversa ? frac([q('p', c.pAtm), ' − ', q('p', c.pTop)], [q('rho', c.rho), ' · ', q('g', 10)])
          : [q('p', c.pTop), ' + ', q('rho', c.rho), ' · ', q('g', 10), ' · ', q('h', c.h)], valor, k, u))];
      errores = inversa ? [er('OMITE_SUPERIOR', c.pAtm / (c.rho * 10), 'omitiste la presión superior', 'omite presión superior'),
        er('SUMA_SUPERIOR', (c.pAtm + c.pTop) / (c.rho * 10), 'sumaste las presiones en vez de restarlas', 'suma las presiones'),
        er('DOS_COLUMNAS', valor / 2, 'contaste dos columnas en el mismo desnivel', 'cuenta dos columnas'),
        er('SIN_GRAVEDAD', (c.pAtm - c.pTop) / c.rho, 'omitiste la aceleración gravitatoria', 'omite la gravedad')]
        : [er('OMITE_SUPERIOR', c.rho * 10 * c.h, 'omitiste la presión superior', 'omite presión superior'),
          er('DOBLE_COLUMNA', c.pTop + 2 * c.rho * 10 * c.h, 'contaste dos veces la columna', 'duplica la columna'),
          er('MEDIA_COLUMNA', c.pTop + c.rho * 10 * c.h / 2, 'usaste la mitad de la altura', 'usa media altura'),
          er('SIN_GRAVEDAD', c.pTop + c.rho * c.h, 'omitiste la aceleración gravitatoria', 'omite la gravedad')];
    } else if (c.tipo.startsWith('dosliquidos')) {
      const alto = c.hLigero ?? (c.volumenCm3 !== undefined ? c.volumenCm3 / 1e6 : c.mLigeroG / 1000 / c.rhoLigero) / (c.areaCm2 / 10000);
      const densidad = c.tipo === 'dosliquidos-densidad';
      const alturaBase = densidad ? alto - c.desnivel : c.rhoLigero * alto / c.rhoBase;
      condiciones.push('Ramas de igual sección constante, abiertas al mismo aire; líquidos inmiscibles.');
      dato('Densidad base: ', q('rho', c.rhoBase, 'kg/m³'), ...(densidad ? [] : ['; densidad añadida: ', q('rho', c.rhoLigero, 'kg/m³')]), '.');
      if (c.hLigero !== undefined) dato('Columna añadida: ', q('h', c.hLigero, 'm'), ...(densidad ? ['; desnivel entre superficies: ', q('h', c.desnivel, 'm')] : []), '.');
      else dato(c.volumenCm3 !== undefined ? 'Volumen añadido: ' : 'Masa añadida: ', q(c.volumenCm3 !== undefined ? 'V' : 'm', c.volumenCm3 ?? c.mLigeroG, c.volumenCm3 !== undefined ? 'cm³' : 'g'), '; área de cada rama: ', q('A', c.areaCm2, 'cm²'), '.');
      if (densidad && c.hLigero === undefined) dato('Desnivel entre superficies: ', q('h', c.desnivel, 'm'), '.');
      if (c.tipo === 'dosliquidos-ascenso') dato('Nivel inicial sobre el fondo: ', q('z', c.zInicial, 'm'), '.');
      intermedios = { hLigero: alto, hBase: alturaBase };
      k = densidad ? 'rho' : c.tipo === 'dosliquidos-ascenso' ? 'z' : 'h'; u = densidad ? 'kg/m³' : 'm';
      valor = densidad ? c.rhoBase * alturaBase / alto : c.tipo === 'dosliquidos-desnivel' ? alto - alturaBase : alturaBase / 2 + (c.pide === 'nivel-final' ? c.zInicial : 0);
      enunciado = densidad ? (c.volumenCm3 !== undefined ? 'Se conoce el volumen añadido al tubo en U. ¿Qué densidad tiene el líquido más ligero?' : 'Se añade un líquido inmiscible más ligero al tubo en U. ¿Qué densidad tiene ese líquido?')
        : c.tipo === 'dosliquidos-desnivel' ? 'Se añade la columna ligera indicada. ¿Qué diferencia vertical queda entre las dos superficies libres?'
          : c.pide === 'nivel-final' ? 'Se añade la masa indicada a la rama izquierda. ¿A qué altura sobre el fondo queda el líquido base en la derecha?'
            : 'Se añade la columna ligera a la izquierda. ¿Cuánto sube la superficie de la rama derecha desde su posición inicial?';
      const balance = [rl, ' · ', hl, ' = ', rb, ' · ', hb];
      regla = paso('A la altura de la interfaz igualamos presiones; el aire común y la gravedad se cancelan.',
        [...balance, '   ·   ', densidad ? rl : hb, ' = ', densidad ? frac([rb, ' · ', hb], hl) : frac([rl, ' · ', hl], rb)]);
      if (c.mLigeroG !== undefined) regla.ecuacion.unshift(rl, ' = ', frac(S.m, S.V), '   ·   ', S.V, ' = ', frac(S.m, rl), '   ·   ', hl, ' = ', frac(S.V, S.A), '   ·   ');
      if (c.volumenCm3 !== undefined) regla.ecuacion.unshift(S.V, ' = ', S.A, ' · ', hl, '   ·   ', hl, ' = ', frac(S.V, S.A), '   ·   ');
      const preparacion = [];
      if (c.volumenCm3 !== undefined) preparacion.push(hl, ' = ', frac([q('V', c.volumenCm3), ' ÷ 1000000'], [q('A', c.areaCm2), ' ÷ 10000']), ' = ', q('h', alto, 'm'), '   ·   ');
      if (c.mLigeroG !== undefined) preparacion.push(S.V, ' = ', frac([q('m', c.mLigeroG), ' ÷ 1000'], q('rho', c.rhoLigero)), ' = ', q('V', c.mLigeroG / 1000 / c.rhoLigero, 'm³'), '   ·   ', hl, ' = ', frac(S.V, S.A), ' = ', frac(q('V', c.mLigeroG / 1000 / c.rhoLigero), [q('A', c.areaCm2), ' ÷ 10000']), ' = ', q('h', alto, 'm'), '   ·   ');
      if (densidad) {
        preparacion.push(hb, ' = ', hl, ' − ', dh, ' = ', q('h', alto), ' − ', q('h', c.desnivel), ' = ', q('h', alturaBase, 'm'));
        cuentas = [paso('Reconstruimos las alturas desde los datos geométricos.', preparacion),
          paso('Sustituimos las alturas medidas desde la interfaz.', final(rl, frac([q('rho', c.rhoBase), ' · ', q('h', alturaBase)], q('h', alto)), valor, k, u))];
        errores = [er('USA_DESNIVEL', c.rhoBase * c.desnivel / alto, 'usaste el desnivel como columna base', 'confunde desnivel y columna'),
          er('INVIERTE_ALTURAS', c.rhoBase * alto / alturaBase, 'invertiste la razón de alturas', 'invierte las alturas'),
          er('IGUALA_DENSIDADES', c.rhoBase, 'supusiste iguales las densidades de ambos líquidos', 'iguala las densidades')];
      } else {
        preparacion.push(hb, ' = ', frac([q('rho', c.rhoLigero), ' · ', q('h', alto)], q('rho', c.rhoBase)), signo(alturaBase), Q('h', alturaBase, 'm', 3));
        cuentas = [paso('Calculamos la columna base sobre la interfaz.', preparacion)];
        if (c.tipo === 'dosliquidos-desnivel') {
          cuentas.push(paso('Restamos las alturas desde la misma interfaz.', final(dh, [q('h', alto), ' − ', q('h', alturaBase)], valor, k, u)));
          errores = [er('COLUMNA_BASE', alturaBase, 'respondiste la columna base sobre la interfaz', 'da la columna base'),
            er('COLUMNA_LIGERA', alto, 'respondiste toda la columna añadida', 'da toda la columna'), er('NIVELES_IGUALES', 0, 'igualaste superficies de líquidos distintos', 'iguala las superficies')];
        } else {
          const base = c.pide === 'nivel-final' ? c.zInicial : 0;
          cuentas.push(paso('La misma sección reparte el desnivel en dos movimientos iguales; añadimos el nivel inicial cuando corresponde.',
            [hb, ' = 2 · ', dz, '   ·   ', dz, ' = ', frac(hb, '2'), ...(base ? ['   ·   ', zf, ' = ', z0, ' + ', dz] : []),
              '   ·   ', ...final(base ? zf : dz, base ? [q('z', base), ' + ', frac(q('h', alturaBase), '2')] : frac(q('h', alturaBase), '2'), valor, k, u)]));
          errores = [er('TODO_DESNIVEL', base + alturaBase, 'confundiste el desnivel con el ascenso individual', 'da todo el desnivel'),
            er('OTRO_DESNIVEL', base + (alto - alturaBase) / 2, 'repartiste la diferencia entre superficies libres', 'reparte otro desnivel'),
            er('IGUALA_DENSIDADES', base + alto / 2, 'supusiste iguales ambas densidades', 'iguala las densidades')];
        }
      }
    } else if (c.tipo === 'capas-gas') {
      const suma = c.capas.reduce((s, x) => s + x.rho * x.h, 0), aporteBase = c.rhoBase * 10 * c.hBase;
      valor = c.pAtm + aporteBase - 10 * suma;
      condiciones.push('Las capas son inmiscibles; la inferior es más densa. La rama derecha está abierta.');
      dato('Aire: ', q('p', c.pAtm, 'Pa'), '; líquido base: ', q('rho', c.rhoBase, 'kg/m³'), '; altura sobre interfaz: ', q('h', c.hBase, 'm'), '.');
      dato('Capa inferior: ', q('rho', c.capas[0].rho, 'kg/m³'), ' y ', q('h', c.capas[0].h, 'm'), '; superior: ', q('rho', c.capas[1].rho, 'kg/m³'), ' y ', q('h', c.capas[1].h, 'm'), '.');
      enunciado = 'Un gas actúa sobre dos capas en la rama izquierda. ¿Cuál es su presión absoluta?';
      const sumaSim = [sub(S.rho, '1'), ' · ', sub(S.h, '1'), ' + ', sub(S.rho, '2'), ' · ', sub(S.h, '2')];
      regla = paso('Igualamos presiones en la interfaz inferior y despejamos la presión del gas.',
        [pc, ' + ', S.g, ' · (', ...sumaSim, ') = ', pa, ' + ', rb, ' · ', S.g, ' · ', hb,
          '   ·   ', pc, ' = ', pa, ' + ', rb, ' · ', S.g, ' · ', hb, ' − ', S.g, ' · (', ...sumaSim, ')']);
      cuentas = [paso('Bajamos desde el aire y subimos por las dos capas.', final(pc,
        [q('p', c.pAtm), ' + ', q('rho', c.rhoBase), ' · ', q('g', 10), ' · ', q('h', c.hBase), ' − ', q('g', 10), ' · (', q('rho', c.capas[0].rho), ' · ', q('h', c.capas[0].h), ' + ', q('rho', c.capas[1].rho), ' · ', q('h', c.capas[1].h), ')'], valor, k, u))];
      errores = [er('INVIERTE_RECORRIDO', c.pAtm - aporteBase + 10 * suma, 'invertiste las subidas y bajadas', 'invierte el recorrido'),
        er('SUMA_CAPAS', c.pAtm + aporteBase + 10 * suma, 'sumaste presión al subir por las capas', 'suma al subir'),
        er('OMITE_SUPERIOR', valor + 10 * c.capas[1].rho * c.capas[1].h, 'omitiste la capa superior', 'omite la capa superior')];
    } else if (c.tipo === 'barometro-calibracion') {
      const densidad = (c.pAtm1 - c.pTop1) / (10 * c.h1), inversa = c.pide === 'altura';
      k = inversa ? 'h' : 'p'; u = inversa ? 'm' : 'Pa';
      valor = inversa ? (c.pAtm2 - c.pTop2) / (densidad * 10) : c.pTop2 + densidad * 10 * c.h2;
      intermedios = { rho: densidad };
      condiciones.push('El líquido conserva su densidad; la cubeta tiene superficie prácticamente inmóvil.');
      dato('Al inicio: aire ', q('p', c.pAtm1, 'Pa'), ', arriba ', q('p', c.pTop1, 'Pa'), ' y altura ', q('h', c.h1, 'm'), '.');
      dato('Después: arriba ', q('p', c.pTop2, 'Pa'), inversa ? ', aire ' : ', altura ', q(inversa ? 'p' : 'h', inversa ? c.pAtm2 : c.h2, inversa ? 'Pa' : 'm'), '.');
      enunciado = inversa ? 'El primer estado calibra el líquido del barómetro. ¿Qué altura tendrá la columna en el segundo estado?' : 'El primer estado calibra el líquido del barómetro. ¿Qué presión tendrá el aire en el segundo estado?';
      regla = paso('El primer equilibrio permite despejar la densidad; usamos la misma en el segundo.',
        [sub(pa, '1'), ' = ', sub(pt, '1'), ' + ', S.rho, ' · ', S.g, ' · ', sub(S.h, '1'),
          '   ·   ', S.rho, ' = ', frac([sub(pa, '1'), ' − ', sub(pt, '1')], [S.g, ' · ', sub(S.h, '1')])]);
      cuentas = [paso('Calculamos la densidad a partir de la primera lectura.', final(S.rho,
        frac([q('p', c.pAtm1), ' − ', q('p', c.pTop1)], [q('g', 10), ' · ', q('h', c.h1)]), densidad, 'rho', 'kg/m³')),
        paso(inversa ? 'Despejamos la segunda altura y sustituimos.' : 'Sumamos la presión superior y la nueva columna.',
          [inversa ? sub(S.h, '2') : sub(pa, '2'), ' = ', inversa ? frac([sub(pa, '2'), ' − ', sub(pt, '2')], [S.rho, ' · ', S.g]) : [sub(pt, '2'), ' + ', S.rho, ' · ', S.g, ' · ', sub(S.h, '2')],
            '   ·   ', ...final(inversa ? sub(S.h, '2') : sub(pa, '2'), inversa ? frac([q('p', c.pAtm2), ' − ', q('p', c.pTop2)], [q('rho', densidad), ' · ', q('g', 10)])
              : [q('p', c.pTop2), ' + ', q('rho', densidad), ' · ', q('g', 10), ' · ', q('h', c.h2)], valor, k, u)])];
      const rhoSin = c.pAtm1 / (10 * c.h1), rhoSuma = (c.pAtm1 + c.pTop1) / (10 * c.h1);
      errores = [er('OMITE_PRIMERA_SUPERIOR', inversa ? (c.pAtm2 - c.pTop2) / (rhoSin * 10) : c.pTop2 + rhoSin * 10 * c.h2, 'omitiste la presión superior al calibrar', 'omite presión al calibrar'),
        er('OMITE_SEGUNDA_SUPERIOR', inversa ? c.pAtm2 / (densidad * 10) : densidad * 10 * c.h2, 'omitiste la presión superior del segundo estado', 'omite segunda presión superior'),
        er('SUMA_PRIMERA_SUPERIOR', inversa ? (c.pAtm2 - c.pTop2) / (rhoSuma * 10) : c.pTop2 + rhoSuma * 10 * c.h2, 'sumaste las presiones al calibrar', 'suma al calibrar')];
    } else throw new Error('Familia de columnas desconocida: ' + c.tipo);

    const usados = new Set([mostrar(valor, u)]);
    errores = errores.filter(e => { const s = mostrar(e.valor, u); if (!Number.isFinite(e.valor) || usados.has(s)) return false; usados.add(s); return true; }).slice(0, 3);
    if (conOpciones && errores.length !== 3) throw new Error('Faltan tres errores distintos de columnas.');
    const ops = conOpciones ? opciones(valor, errores.map(e => ({ valor: e.valor, error: 'FL12-C-' + e.operacion,
      siFuera: 'Identificaste los datos; ' + e.causa + '. Obtienes ' + mostrar(e.valor, u) + '.' })), x => mostrar(x, u)) : [];
    enunciado = [...entradas[0], ' ', enunciado];
    const datos = [...condiciones, ...entradas.slice(1)];
    return { enunciado, datos, dibujo: figura(c), pide: ['Busco ', V(k, k === 'p' ? 'la presión solicitada' : k === 'rho' ? 'la densidad añadida' : 'la medida vertical solicitada'), '.'],
      tengo: unir(entradas), regla, cuentas, sentido: ['La respuesta es ', V(k, mostrar(valor, u)), ', según la referencia indicada.'],
      respuesta: [V(k, mostrar(valor, u))], opciones: ops,
      caso: { ...c, valor, unidad: u, intermedios, errores: errores.map(({ operacion, valor }) => ({ operacion, valor })) },
      erroresEjemplo: errores.map(e => mostrar(e.valor, u) + ': ' + e.corto).join('; ') + '.' };
  }

  // Las entradas de ejemplo se mantienen explícitas para su auditoría independiente.
  const muestras = [
    {"tipo":"manometro-gauge","rho":1000,"g":10,"h":0.18,"sentido":1,"pAtm":100000,"titulo":"Una diferencia positiva"},
    {"tipo":"manometro-gauge","rho":1200,"g":10,"h":0.05,"sentido":-1,"pAtm":100000,"titulo":"Una cámara por debajo del aire"},
    {"tipo":"manometro-absoluta","rho":800,"g":10,"h":0.125,"sentido":1,"pAtm":96000,"titulo":"La referencia del aire"},
    {"tipo":"barometro-presion","rho":13600,"g":10,"h":0.7,"pTop":0,"titulo":"Una columna con cámara vacía"},
    {"tipo":"barometro-presion","rho":12500,"g":10,"h":0.64,"pTop":2000,"titulo":"La presión sobre la columna"},
    {"tipo":"barometro-altura","rho":13600,"g":10,"pAtm":104000,"pTop":2000,"titulo":"Despejar la altura"},
    {"tipo":"dosliquidos-desnivel","rhoLigero":750,"rhoBase":1000,"hLigero":0.16,"titulo":"Dos superficies diferentes"},
    {"tipo":"manometro-gauge","rhoGcm3":0.9,"hCm":8,"g":10,"sentido":-1,"pAtm":100000,"titulo":"Densidad y longitud en otras unidades"},
    {"tipo":"dosliquidos-densidad","rhoBase":1200,"hLigero":0.2,"desnivel":0.05,"titulo":"Reconstruir la densidad"},
    {"tipo":"dosliquidos-ascenso","rhoLigero":600,"rhoBase":1000,"hLigero":0.1,"zInicial":0.18,"pide":"ascenso","titulo":"El movimiento de una rama"},
    {"tipo":"barometro-calibracion","g":10,"pAtm1":100000,"pTop1":2000,"h1":0.7,"pTop2":3000,"h2":0.65,"pide":"presion","titulo":"Calibrar antes de comparar"},
    {"tipo":"capas-gas","rhoBase":1000,"g":10,"hBase":0.3,"pAtm":100000,"capas":[{"rho":800,"h":0.15},{"rho":600,"h":0.1}],"titulo":"Dos capas bajo un gas"},
    {"tipo":"dosliquidos-ascenso","rhoLigero":600,"rhoBase":1000,"mLigeroG":300,"areaCm2":25,"zInicial":0.22,"pide":"nivel-final","titulo":"Masa añadida y nivel final"},
    {"tipo":"dosliquidos-densidad","rhoBase":1200,"volumenCm3":360,"areaCm2":24,"desnivel":0.045,"titulo":"Del volumen a la densidad"},
    {"tipo":"barometro-calibracion","g":10,"pAtm1":98000,"pTop1":2000,"h1":0.64,"pTop2":2000,"pAtm2":104000,"pide":"altura","titulo":"Una nueva altura tras calibrar"}
  ];

  const familias = ['manometro-gauge', 'manometro-absoluta', 'barometro-presion', 'barometro-altura', 'dosliquidos-desnivel', 'dosliquidos-densidad', 'dosliquidos-ascenso', 'capas-gas', 'barometro-calibracion'];
  function generar(semilla, practica) {
    const r = azar(semilla + (practica ? 27000 : 19000));
    const primeras = practica ? [1, 3, 5, 6, 8] : [0, 2, 4, 7];
    for (let intento = 0; intento < 100; intento++) {
      const tipo = familias[semilla < (practica ? 12 : 4) ? primeras[semilla % primeras.length] : r.ent(0, 8)];
      const base = r.de(practica ? [1040, 1120, 1440] : [960, 1080, 1280]);
      const h = r.de([0.04, 0.08, 0.12, 0.16, 0.2]), atm = r.de(practica ? [93000, 101000, 109000] : [91000, 99000, 107000]);
      const razon = r.de([0.25, 0.6, 0.75]), ligero = base * razon;
      let c = { tipo };
      if (tipo.startsWith('manometro')) c = { ...c, rho: base, h, sentido: r.de([-1, 1]), pAtm: atm };
      if (tipo === 'barometro-presion') c = { ...c, rho: base * 10, h: r.de([0.55, 0.6, 0.65, 0.8]), pTop: practica ? 1500 : 2500 };
      if (tipo === 'barometro-altura') { const rho = base * 10, pTop = practica ? 1500 : 2500; c = { ...c, rho, pTop, pAtm: pTop + rho * 10 * r.de([0.45, 0.5, 0.6, 0.8]) }; }
      if (tipo === 'dosliquidos-desnivel') c = { ...c, rhoLigero: ligero, rhoBase: base, hLigero: h };
      if (tipo === 'dosliquidos-densidad') c = { ...c, rhoBase: base, hLigero: h, desnivel: Number((h * (1 - razon)).toFixed(8)) };
      if (tipo === 'dosliquidos-ascenso') c = { ...c, rhoLigero: ligero, rhoBase: base, hLigero: h, zInicial: practica ? 0.24 : 0.16, pide: practica ? 'nivel-final' : 'ascenso' };
      if (tipo === 'capas-gas') c = { ...c, rhoBase: base, hBase: 0.24, pAtm: atm, capas: [{ rho: base * 0.75, h: 0.12 }, { rho: base * 0.5, h: h / 2 }] };
      if (tipo === 'barometro-calibracion') { const rho = base * 10, h1 = r.de([0.5, 0.6, 0.8]), pTop1 = practica ? 1700 : 2300, pTop2 = practica ? 3100 : 3700;
        c = { ...c, pAtm1: pTop1 + rho * 10 * h1, pTop1, h1, pTop2, ...(practica ? { pAtm2: pTop2 + rho * 10 * 0.7, pide: 'altura' } : { h2: 0.7, pide: 'presion' }) }; }
      const resultado = calcular(c, practica);
      if (practica && resultado.caso.errores.some(e => e.valor !== 0 && (Math.abs(e.valor / resultado.caso.valor) < 0.05 || Math.abs(e.valor / resultado.caso.valor) > 20))) continue;
      return practica ? pregunta(resultado) : resuelto(resultado);
    }
    throw new Error('No se encontró un caso de columnas con opciones distintas.');
  }

  const presionControl = v => Number(Number(v.p).toFixed(0));
  const juego = v => { const p = presionControl(v), h = p / 10000;
    return tubo([0.2 - h / 2], [0.2 + h / 2], [
      { x: 85, y: 24, texto: 'ρ = 1000 kg/m³', color: 'f' }, { x: 235, y: 24, texto: 'g = 10 m/s²', color: 'h' },
      { ref: 'izquierda', texto: 'Cámara' }, { ref: 'derecha', texto: 'Aire exterior' },
      { texto: 'p = ' + fmt(p) + ' Pa', fila: 1, color: 'i' },
      { texto: 'h' + signo(h * 100) + fmt(h * 100) + ' cm', fila: 2, color: 'd' }
    ], true, { alt: 'Un manómetro compara la cámara con el aire. Ambas superficies se desplazan conservando el volumen del líquido.' }); };
  const inicial = tubo([0.2], [0.2], [{ texto: 'Antes de añadir el líquido' }], false,
    { alt: 'Antes de verter, el mismo líquido alcanza igual nivel en ambas ramas abiertas.' });
  const hp = 0.15, rhoP = 800, rhoB = 1000, hbP = rhoP * hp / rhoB, dp = hp - hbP;
  const revelada = tubo([0.2 - hbP / 2, hp], [0.2 + hbP / 2], [
    { ref: 'izquierda', texto: 'Ligero: 800 kg/m³', color: 'f' }, { ref: 'derecha', texto: 'Base: 1000 kg/m³', color: 'f' },
    { texto: 'Entre superficies: ' + fmt(dp * 100) + ' cm', fila: 1, color: 'd' },
    { texto: 'Ascenso derecho: ' + fmt(hbP * 50) + ' cm', fila: 2, color: 'd' }
  ], false, { alt: 'Después de añadir el líquido ligero, la diferencia entre superficies es ' + fmt(dp * 100) + ' cm y la superficie derecha sube ' + fmt(hbP * 50) + ' cm.' });

  glosario.push(
    { termino: 'manómetro', formas: ['manómetro', 'manómetros'], simple: 'Instrumento que compara presiones mediante una lectura.', def: 'Instrumento que permite medir la presión de un fluido respecto de una referencia.', ejemplos: ['Un manómetro conecta una cámara con el aire exterior.', 'Un tubo en U permite observar dos superficies líquidas.', 'La referencia debe indicarse junto con la lectura.'] },
    { termino: 'barómetro', formas: ['barómetro', 'barómetros'], simple: 'Instrumento que mide la presión del aire exterior.', def: 'Instrumento usado para medir la presión atmosférica, por ejemplo mediante una columna de líquido.', ejemplos: ['Un barómetro de líquido incluye un tubo y una cubeta.', 'La parte superior del tubo tiene una presión que debe especificarse.', 'La columna se mide desde la superficie de la cubeta.'] },
    { termino: 'interfaz', formas: ['interfaz', 'interfaces'], simple: 'Superficie que separa dos materiales en contacto.', def: 'Superficie de contacto entre dos medios, como dos líquidos inmiscibles.', ejemplos: ['Dos líquidos que no se mezclan tienen una interfaz visible.', 'Una interfaz sirve como referencia para medir una columna.', 'Una superficie entre líquido y gas también es una interfaz.'] },
    { termino: 'vasos comunicantes', formas: ['vasos comunicantes'], simple: 'Recipientes unidos por una conexión que permite pasar líquido.', def: 'Conjunto de recipientes conectados por una región por la que puede circular un líquido.', ejemplos: ['Las dos ramas de un tubo en U están comunicadas por abajo.', 'Dos recipientes pueden comunicarse mediante un tubo.', 'Una válvula cerrada interrumpe la comunicación entre recipientes.'] }
  );

  return {
    id: 'vasos-comunicantes', titulo: 'Leer columnas de líquido', pregunta: '¿Qué información contienen las alturas de un líquido conectado?',
    temas: ['Manómetro, barómetro y vasos comunicantes'], pieza: 'fis-fluidos-e12',
    aprendizaje: 'Relaciono presiones mediante columnas y distingo una altura desde la interfaz del movimiento de una superficie.',
    actividad: 'Cambiar la presión de una cámara y observar dos superficies conectadas.',
    lee: { tarjetas: [
      { titulo: 'Dos superficies y una conexión', texto: 'Los vasos comunicantes permiten que un líquido pase de una rama a otra. El tubo en U sirve como manómetro: una rama se conecta a la cámara y la otra al aire.', dibujo: juego({ p: 0 }) },
      { titulo: 'Desde dónde se mide', texto: ['Una altura ', S.h, ' necesita dos niveles de referencia. La interfaz separa materiales en contacto. El ascenso de una superficie se mide desde su posición anterior, no desde otra superficie.'] },
      { titulo: 'Comparar y medir', texto: 'El manómetro compara la cámara con el aire exterior. El barómetro mide la presión del aire. En ambos casos importa qué hay sobre cada columna; no se supone un vacío sin indicarlo.' }
    ] },
    ejemplos: muestras.map((c, i) => ejemplo(calcular(c, i >= 10), Math.floor(i / 5) + 1, c.titulo, i - 10)),
    juega: { pieza: 'fis-fluidos-e12', consigna: 'Ajusta lentamente la presión añadida en la cámara y compara los niveles de las dos ramas.', voz: 'Observa la diferencia entre superficies, no el movimiento de una sola.',
      mision: { texto: 'Consigue un desnivel de 10 cm entre las superficies.', logrado: v => presionControl(v) === 1000, bien: 'La separación entre las superficies llegó a 10 cm.', pista: 'Cambia la presión y lee el desnivel completo.' },
      controles: [{ id: 'p', etiqueta: 'Presión manométrica, p', min: 0, max: 1500, paso: 500, inicio: 0, decimales: 0, unidad: 'Pa', color: 'c-i', auto: { velocidad: 250 } }],
      leyenda: [{ s: S.p, t: 'presión de la cámara respecto al aire exterior' }, { s: S.h, t: 'desnivel completo entre las superficies' },
        { s: S.rho, t: 'densidad del líquido: 1000 kg/m³' }, { s: S.g, t: 'gravedad del modelo: 10 m/s²' },
        { s: 'Modelo', t: 'ramas iguales; cambio lento entre estados de equilibrio' }],
      dibujo: juego, lectura: v => ['El desnivel ', S.h, ' = ', Q('h', presionControl(v) / 100, 'cm', 3), ' crece con ', S.p, '.'], resumen: { p: 500 }, minimo: 3 },
    predice: { pregunta: ['Se añaden ', q('h', hp * 100, 'cm'), ' de líquido de ', q('rho', rhoP, 'kg/m³'), ' sobre otro de ', q('rho', rhoB, 'kg/m³'), '. ¿Cuánto más alta queda su superficie que la de la otra rama?'],
      datos: ['Ambas ramas están abiertas al mismo aire; los líquidos no se mezclan.', 'La figura muestra el estado previo a añadir el segundo líquido.', 'El líquido está en reposo; se desprecia la capilaridad.'], dibujo: inicial, revelar: revelada,
      opciones: opciones(dp * 100, [
        { valor: hbP * 100, error: 'FL12-C-COLUMNA_BASE', siFuera: 'Relacionaste ambas columnas; respondiste la altura sobre la interfaz: ' + fmt(hbP * 100) + ' cm.' },
        { valor: hp * 100, error: 'FL12-C-COLUMNA_LIGERA', siFuera: 'Identificaste la columna añadida; esa longitud completa mide ' + fmt(hp * 100) + ' cm.' },
        { valor: 0, error: 'FL12-C-NIVELES_IGUALES', siFuera: 'Reconociste el mismo aire; impusiste superficies iguales pese a las distintas densidades: 0 cm.' }
      ], x => fmt(x) + ' cm'), coincide: 'Coincide: primero comparamos columnas desde la interfaz; después restamos sus alturas.' },
    mira: { pieza: 'fis-fluidos-e12', datos: revelada.datos, pasos: [
      { estado: { paso: 0 }, texto: 'A la altura de la interfaz, el líquido base comunicado tiene igual presión.', ecuacion: [pa, ' + ', rl, ' · ', S.g, ' · ', hl, ' = ', pa, ' + ', rb, ' · ', S.g, ' · ', hb] },
      { estado: { paso: 1 }, texto: 'Cancelamos aire y gravedad comunes; despejamos la altura de la columna base.', ecuacion: [hb, ' = ', frac([rl, ' · ', hl], rb), ' = ', frac([q('rho', rhoP), ' · ', q('h', hp)], q('rho', rhoB)), ' = ', q('h', hbP, 'm')] },
      { estado: { paso: 2 }, texto: 'La diferencia entre superficies resta alturas medidas desde la misma interfaz.', ecuacion: [dh, ' = ', hl, ' − ', hb, ' = ', q('h', hp), ' − ', q('h', hbP), ' = ', q('h', dp, 'm')] },
      { estado: { paso: 3 }, texto: 'En ramas iguales, una superficie baja lo mismo que sube la otra.', ecuacion: [dz, ' = ', frac(hb, '2'), ' = ', frac(q('h', hbP), '2'), ' = ', q('z', hbP / 2, 'm')] },
      { estado: { datos: barometro({ pTop: 2000 }, false).datos }, texto: 'En un barómetro sumamos la presión superior; no siempre es despreciable.', ecuacion: [pa, ' = ', pt, ' + ', S.rho, ' · ', S.g, ' · ', S.h] }
    ] },
    regla: { texto: 'Al bajar por un líquido aumenta la presión; al subir disminuye. Igualamos presiones donde corresponde y medimos cada altura desde referencias explícitas.',
      ecuacion: [sub(S.p, 'abajo'), ' = ', sub(S.p, 'arriba'), ' + ', S.rho, ' · ', S.g, ' · ', S.h, '   ·   ', rl, ' · ', hl, ' = ', rb, ' · ', hb],
      condicion: 'Fluidos en reposo, densidades constantes y gravedad uniforme. La igualdad de columnas requiere la misma presión sobre ambas superficies.',
      voz: 'El ascenso individual y la diferencia entre superficies son medidas distintas.', dibujo: revelada },
    resuelve: { pieza: 'fis-fluidos-e12', generar: s => generar(s, false) },
    ahoraTu: { pieza: 'fis-fluidos-e12', generar: s => generar(s, true) }
  };
})();

  return {
    unidad:'fisica.fluidos', version:'1.0.0', estado:'borrador',
    colores: COLORES,
    letras: { p:'presión', F:'fuerza normal aplicada', E:'empuje', P:'peso', T:'tensión de la suspensión', W:'trabajo de una fuerza', ρ:'densidad', m:'masa', γ:'coeficiente de tensión superficial', n:'número de caras', A:'área de sección', V:'volumen', h:'distancia vertical entre los niveles indicados', z:'altura sobre la referencia común', ℓ:'recorrido de un pistón', L:'longitud de contacto', r:'radio', d:'diámetro', θ:'ángulo de contacto', v:'rapidez media', Q:'caudal volumétrico', t:'tiempo', g:'módulo de la aceleración de la gravedad' },
    requiere:['/nucleo/kit/piezas/fis-fluidos-e12.js','/nucleo/kit/piezas/fis-estatica.js','/nucleo/kit/piezas/ejes.js'],
    glosario,
    historia: {
      texto:'En una carta del 11 de junio de 1644, Torricelli describió un tubo invertido sobre una cubeta de mercurio. La columna no cayó por completo. Relacionó su sostén con la presión del aire sobre la cubeta. El barómetro permitió estudiar una acción invisible mediante una altura que se podía medir y comparar.',
      pregunta:'¿Qué permite averiguar la altura de una columna de líquido?',
      fuente:{titulo:'Museo Galileo: el experimento de Torricelli',url:'https://catalogue.museogalileo.it/indepth/TorricellianExperiment.html'},
    },
    
    ideas:[idea1, idea2],
  };
});
