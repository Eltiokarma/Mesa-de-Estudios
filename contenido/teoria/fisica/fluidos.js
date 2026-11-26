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
    id: 'presion-profundidad',titulo:'Un líquido y una superficie',pregunta:'¿Cómo relacionas una fuerza, una superficie y la presión de un líquido?',
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
    resuelve:{pieza:'fis-fluidos-e12',generar:s=>generar(s,false)},
    ahoraTu:{pieza:'fis-fluidos-e12',generar:s=>generar(s,true)}
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
  const modelo = ['Los líquidos están en reposo; no hay efectos apreciables de la superficie.', ['Para el modelo, ', S.g, ' = ', q('g', 10, 'm/s²'), '.']];

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
      datos: ['Ambas ramas están abiertas al mismo aire; los líquidos no se mezclan.', 'La figura muestra el estado previo a añadir el segundo líquido.', 'El líquido está en reposo; no hay efectos apreciables de la superficie.'], dibujo: inicial, revelar: revelada,
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

const idea3 = (() => {
  const F1=sub(S.F,'1'),F2=sub(S.F,'2'),A1=sub(S.A,'1'),A2=sub(S.A,'2'),l1=sub(S.ell,'1'),l2=sub(S.ell,'2');
  const p1=sub(S.p,'1'),p2=sub(S.p,'2'),r1=sub(S.r,'1'),r2=sub(S.r,'2'),d2=sub(S.d,'2');
  const W1=sub(S.W,'1'),W2=sub(S.W,'2');
  const dec = n => { for(let j=0;j<=6;j++)if(Math.abs(n*10**j-Math.round(n*10**j))<1e-7)return j;return null; };
  const racional = n => { for(let d=1;d<=10000;d++){const a=Math.round(n*d);if(Math.abs(a/d-n)<1e-10)return[a,d];}return null; };
  const q=(k,n,u='')=>{const dd=dec(n);if(dd!==null)return Q(k,n,u,dd);const z=racional(n);return z?[frac(V(k,z[0]),V(k,z[1])),...(u?[` ${u}`]:[])]:['≈ ',Q(k,n,u,3)];};
  const literal=(n,u='')=>{const dd=dec(n),z=dd===null?racional(n):null;return `${dd!==null?f(n,dd):z?`${z[0]}/${z[1]}`:`≈ ${f(n,3)}`}${u?` ${u}`:''}`;};
  const leyF=[frac(F1,A1),' = ',frac(F2,A2)];
  const leyV=[A1,' × ',l1,' = ',A2,' × ',l2];
  const leyW=[W1,' = ',F1,' × ',l1,' = ',F2,' × ',l2,' = ',W2];
  const baseDatos=['Líquido incompresible, sin fugas; pistones sin masa ni rozamiento.','Centros a igual altura y misma presión exterior; movimiento muy lento.'];
  // Las fuerzas se leen numéricamente; las flechas representan solo su sentido.
  function prensa(d={},extra={}){
    const medida=d.A1cm2!==undefined&&d.A2cm2!==undefined;
    const pistones=medida?[{id:'entrada',area:d.A1cm2/10000},{id:'salida',area:d.A2cm2/10000}]:[{id:'entrada'},{id:'salida'}];
    const rotulos=[{ref:'entrada',y:30,texto:'Entrada'},{ref:'salida',y:30,texto:'Salida'},
      {x:160,y:56,texto:'Flechas: solo sentido',color:'h'}];
    const flechas=[];
    for(const [i,id] of [[1,'entrada'],[2,'salida']]){
      const A=d[`A${i}cm2`],F=d[`F${i}N`],l=d[`l${i}cm`];
      if(A!==undefined)rotulos.push({ref:id,fila:0,texto:`Área: ${literal(A,'cm²')}`,color:'d'});
      if(F!==undefined){rotulos.push({ref:id,fila:1,texto:`Fuerza: ${literal(F,'N')}`,color:'h'});flechas.push({ref:id,cualitativa:true,sentido:1,anclaje:i===1?'entra':'sale'});}
      if(l!==undefined)rotulos.push({ref:id,fila:2,texto:`Recorre: ${literal(l,'cm')}`,color:'d'});
    }
    return flu({tipo:'prensa',modo:medida?'medida':'esquema',alto:380,
      ...(medida?{escala:{transversal:2000,axial:1000},prensa:{profundidad:.1,conectados:true,pistones}}:{prensa:{conectados:true,pistones}}),
      flechas,rotulos,...extra,alt:extra.alt||'Dos pistones horizontales conectados por un líquido. Las fuerzas y las medidas dadas aparecen junto a cada pistón; las flechas indican solo el sentido.'});
  }
  function circulos(d){
    const completos=d.r2cm!==undefined,rr=completos?[8*d.r1cm,8*d.r2cm]:[28,44],xs=[78,240];
    const textos=[{x:160,y:26,texto:'Secciones circulares',ancla:'middle'},
      {x:78,y:55,texto:'Entrada',ancla:'middle'},{x:240,y:55,texto:'Salida',ancla:'middle'},
      {x:78,y:218,texto:`Radio: ${literal(d.r1cm,'cm')}`,color:'d',ancla:'middle'},
      {x:240,y:218,texto:completos?`Radio: ${literal(d.r2cm,'cm')}`:'Diámetro por hallar',color:'d',ancla:'middle'}];
    if(d.F1N!==undefined)textos.push({x:78,y:246,texto:`Entrada: ${literal(d.F1N,'N')}`,color:'h',ancla:'middle'});
    if(d.l1cm!==undefined)textos.push({x:78,y:246,texto:`Recorre ${literal(d.l1cm,'cm')}`,color:'d',ancla:'middle'});
    if(d.l2cm!==undefined)textos.push({x:240,y:246,texto:`Recorre ${literal(d.l2cm,'cm')}`,color:'d',ancla:'middle'});
    if(!completos)textos.push({x:160,y:278,texto:'Esquema sin escala',ancla:'middle'});
    return est({alto:300,objetos:xs.map((x,j)=>({tipo:'disco',c:[x,130],r:rr[j]})),
      lineas:xs.map((x,j)=>({de:[x,130],a:[x+rr[j],130],discontinua:false})),textos,
      alt:completos?'Las dos caras circulares tienen los radios dados. Se comparan con la misma escala.':'Dos secciones circulares dibujadas sin escala. Solo se indica el radio de entrada; el diámetro de salida es desconocido.'});
  }
  function desnivel(d){
    return est({alto:330,objetos:[{tipo:'caja',x:74,y:192,w:12,h:42},{tipo:'caja',x:242,y:122,w:12,h:64}],
      lineas:[{de:[80,150],a:[128,150],discontinua:false},{de:[128,150],a:[200,58],discontinua:false},{de:[200,58],a:[236,58],discontinua:false},
        {de:[80,192],a:[148,192],discontinua:false},{de:[148,192],a:[220,122],discontinua:false},{de:[220,122],a:[236,122],discontinua:false},
        {de:[74,171],a:[170,171],discontinua:true},{de:[170,90],a:[242,90],discontinua:true}],
      cotas:[{de:[170,171],a:[170,90],lado:1,sep:14,color:'d'}],
      textos:[{x:160,y:24,texto:'Centros a distintas alturas',ancla:'middle'},
        {x:74,y:230,texto:`Área: ${literal(d.A1cm2,'cm²')}`,color:'d',ancla:'middle'},{x:242,y:230,texto:`Área: ${literal(d.A2cm2,'cm²')}`,color:'d',ancla:'middle'},
        {x:74,y:256,texto:`Entrada: ${literal(d.F1N,'N')}`,color:'h',ancla:'middle'},{x:242,y:256,texto:'Salida por hallar',color:'h',ancla:'middle'},
        {x:160,y:280,texto:`Desnivel entre centros: ${literal(d.h2menos1m,'m')}`,color:'d',ancla:'middle'},
        {x:160,y:306,texto:'Equilibrio; esquema sin escala',ancla:'middle'}],
      alt:'Dos pistones en equilibrio. El centro de salida está por encima del centro de entrada, a la distancia indicada. El esquema no está a escala.'});
  }
  function etapas(d){
    return est({alto:300,objetos:[{tipo:'caja',x:36,y:152,w:8,h:24},{tipo:'caja',x:128,y:176,w:8,h:72},{tipo:'caja',x:184,y:155,w:8,h:30},{tipo:'caja',x:284,y:170,w:8,h:60}],
      lineas:[{de:[40,128],a:[124,104],discontinua:false},{de:[40,152],a:[124,176],discontinua:false},
        {de:[132,140],a:[180,140],discontinua:false},{de:[188,125],a:[280,110],discontinua:false},{de:[188,155],a:[280,170],discontinua:false}],
      textos:[{x:82,y:30,texto:'Etapa 1',ancla:'middle'},{x:234,y:30,texto:'Etapa 2',ancla:'middle'},
        {x:82,y:60,texto:`Áreas: ${f(d.A1cm2)} y ${f(d.A2cm2)} cm²`,color:'d',ancla:'middle'},
        {x:234,y:60,texto:`Áreas: ${f(d.A3cm2)} y ${f(d.A4cm2)} cm²`,color:'d',ancla:'middle'},
        {x:160,y:212,texto:'Unión rígida entre etapas',ancla:'middle'},
        {x:82,y:240,texto:`Entrada: ${literal(d.F1N,'N')}`,color:'h',ancla:'middle'},
        {x:234,y:240,texto:`Salida: ${literal(d.l4cm,'cm')}`,color:'d',ancla:'middle'},
        {x:160,y:278,texto:'Esquema sin escala',ancla:'middle'}],
      alt:'Dos prensas horizontales en serie. La salida de la primera está unida rígidamente a la entrada de la segunda. El esquema indica únicamente áreas, fuerza de entrada y recorrido final conocidos.'});
  }
  function caso(tipo,d){
    let valor,unidad,clave,enunciado,regla,cuentas,sentido,dibujo,malos,causas;
    let datos=baseDatos.slice();
    const pascal=texto=>paso(texto,leyF),volumen=texto=>paso(texto,leyV),trabajo=texto=>paso(texto,leyW);
    const salida=()=>prensa(d);
    switch(tipo){
      case'fuerza-salida':{
        const k=d.A2cm2/d.A1cm2;valor=d.F1N*k;unidad='N';clave='F';
        enunciado=['Una prensa tiene áreas ',q('A',d.A1cm2,'cm²'),' y ',q('A',d.A2cm2,'cm²'),'. Sobre la entrada actúan ',q('F',d.F1N,'N'),'. ¿Qué fuerza transmite a la salida?'];
        regla=pascal('Igualamos la presión manométrica media sobre ambos pistones.');
        cuentas=[paso('Multiplicamos la fuerza de entrada por la razón de áreas.',[F2,' = ',F1,' × ',frac(A2,A1),' = ',q('F',d.F1N),' × ',frac(q('A',d.A2cm2),q('A',d.A1cm2)),' = ',q('F',valor,'N')])];
        sentido='La salida tiene más área: recibe mayor fuerza, aunque comparte la misma presión media.';malos=[d.F1N,d.F1N/k,d.F1N*k*k];causas=['iguala las fuerzas','invierte la razón de áreas','aplica dos veces la razón'];dibujo=salida();break;}
      case'fuerza-entrada':{
        const k=d.A2cm2/d.A1cm2;valor=d.F2N/k;unidad='N';clave='F';
        enunciado=['La entrada de una prensa tiene ',q('A',d.A1cm2,'cm²'),' y la salida, ',q('A',d.A2cm2,'cm²'),'. ¿Qué fuerza de entrada equilibra ',q('F',d.F2N,'N'),' en la salida?'];
        regla=pascal('La fuerza necesaria depende de las dos áreas.');
        cuentas=[paso('Despejamos la fuerza sobre el pistón de entrada.',[F1,' = ',F2,' × ',frac(A1,A2),' = ',q('F',d.F2N),' × ',frac(q('A',d.A1cm2),q('A',d.A2cm2)),' = ',q('F',valor,'N')])];
        sentido='Para equilibrar la resistencia de salida, la entrada necesita una fuerza menor si su área es menor.';malos=[d.F2N,d.F2N*k,d.F2N/k**2];causas=['iguala las fuerzas','invierte la razón de áreas','divide dos veces por la razón'];dibujo=salida();break;}
      case'area-salida':{
        const k=d.F2N/d.F1N;valor=d.A1cm2*k;unidad='cm²';clave='A';
        enunciado=['La entrada de una prensa tiene ',q('A',d.A1cm2,'cm²'),' y recibe ',q('F',d.F1N,'N'),'. La salida transmite ',q('F',d.F2N,'N'),'. ¿Cuál es el área de salida?'];
        regla=pascal('A igual presión media, la razón de áreas coincide con la razón de fuerzas.');
        cuentas=[paso('Despejamos el área de salida.',[A2,' = ',A1,' × ',frac(F2,F1),' = ',q('A',d.A1cm2),' × ',frac(q('F',d.F2N),q('F',d.F1N)),' = ',q('A',valor,'cm²')])];
        sentido='El área buscada es mayor porque la fuerza de salida es mayor.';malos=[d.A1cm2,d.A1cm2/k,d.A1cm2*k*k];causas=['conserva el área de entrada','invierte la razón de fuerzas','cuadra la razón de fuerzas'];dibujo=salida();break;}
      case'ventaja-mecanica':
        valor=d.F2N/d.F1N;unidad='';clave=null;
        enunciado=['Una prensa recibe ',q('F',d.F1N,'N'),' en la entrada y transmite ',q('F',d.F2N,'N'),' en la salida. ¿Cuánto vale su ventaja mecánica?'];
        regla=paso('La ventaja mecánica compara la fuerza útil de salida con la fuerza de entrada.',['ventaja mecánica = ',frac(F2,F1)]);
        cuentas=[paso('Dividimos fuerzas expresadas en la misma unidad.',['ventaja = ',frac(q('F',d.F2N),q('F',d.F1N)),' = ',literal(valor)])];
        sentido='La ventaja mecánica es una razón sin unidad; no mide presión ni trabajo.';malos=[d.F2N-d.F1N,d.F1N/d.F2N,valor**2];causas=['resta las fuerzas','invierte la comparación','cuadra la comparación'];dibujo=salida();break;
      case'presion-manometrica':
        valor=10*d.F2N/d.A2cm2;unidad='kPa';clave='p';
        enunciado=['La salida de una prensa equilibra ',q('F',d.F2N,'N'),' sobre ',q('A',d.A2cm2,'cm²'),'. ¿Cuál es la presión manométrica media del líquido sobre esa cara?'];
        datos.push('1 cm² = 0,0001 m²; 1 kPa = 1000 Pa.');
        regla=paso('La fuerza adicional corresponde a la presión interior menos la exterior.',[p2,' = ',frac(F2,A2)]);
        cuentas=[paso('Convertimos el área y dividimos la fuerza entre ella.',[p2,' = ',frac(q('F',d.F2N,'N'),q('A',d.A2cm2/10000,'m²')),' = ',q('p',valor*1000,'Pa'),' = ',q('p',valor,'kPa')])];
        sentido='Esta lectura es una diferencia respecto de la presión exterior; no es la presión absoluta.';malos=[d.F2N/d.A2cm2,d.F2N,10*d.A2cm2/d.F2N];causas=['confunde N/cm² con kPa','confunde fuerza con presión','invierte fuerza y área'];dibujo=salida();break;
      case'fuerza-radios':{
        const k=(d.r2cm/d.r1cm)**2;valor=d.F1N*k;unidad='N';clave='F';
        enunciado=['Los pistones circulares de una prensa tienen radios ',q('r',d.r1cm,'cm'),' y ',q('r',d.r2cm,'cm'),'. Si entran ',q('F',d.F1N,'N'),', ¿qué fuerza transmite la salida?'];
        regla=paso('El área circular depende del cuadrado del radio.',[S.A,' = π',sup(S.r),'   ;   ',...leyF]);
        cuentas=[paso('Pi se cancela al dividir las áreas.',[frac(A2,A1),' = ',frac(sup(r2),sup(r1)),' = ',frac(sup(q('r',d.r2cm)),sup(q('r',d.r1cm))),' = ',literal(k)]),
          paso('Usamos esa razón de áreas en la relación de fuerzas.',[F2,' = ',q('F',d.F1N),' × ',literal(k),' = ',q('F',valor,'N')])];
        sentido='Duplicar el radio cuadruplica el área; la fuerza depende del área, no directamente del radio.';malos=[d.F1N*d.r2cm/d.r1cm,d.F1N,d.F1N/k];causas=['usa la razón de radios','iguala las fuerzas','invierte la razón de áreas'];dibujo=circulos(d);break;}
      case'fuerza-areas-unidades':{
        const entrada=d.A1mm2/100,k=d.A2cm2/entrada;valor=d.F1N*k;unidad='N';clave='F';
        enunciado=['La entrada de una prensa tiene ',q('A',d.A1mm2,'mm²'),' y la salida, ',q('A',d.A2cm2,'cm²'),'. Si se aplican ',q('F',d.F1N,'N'),', ¿qué fuerza transmite la salida?'];
        datos.push('1 cm² = 100 mm².');regla=pascal('Las áreas deben expresarse en la misma unidad antes de formar su razón.');
        cuentas=[paso('Convertimos el área de entrada a centímetros cuadrados.',[A1,' = ',q('A',d.A1mm2,'mm²'),' = ',q('A',entrada,'cm²')]),
          paso('Despejamos la fuerza de salida y sustituimos las áreas compatibles.',[F2,' = ',F1,' × ',frac(A2,A1),' = ',q('F',d.F1N),' × ',frac(q('A',d.A2cm2),q('A',entrada)),' = ',q('F',valor,'N')])];
        sentido='La conversión de un área usa el cuadrado del factor de longitud.';malos=[d.F1N*d.A2cm2/(d.A1mm2/10),d.F1N,d.F1N/k];causas=['convierte el área con factor diez','iguala las fuerzas','invierte la razón de áreas'];dibujo=prensa({A1cm2:entrada,A2cm2:d.A2cm2,F1N:d.F1N});break;}
      case'recorrido-salida':{
        const k=d.A2cm2/d.A1cm2;valor=d.l1cm/k;unidad='cm';clave='ell';
        enunciado=['Una prensa tiene áreas ',q('A',d.A1cm2,'cm²'),' y ',q('A',d.A2cm2,'cm²'),'. El pistón de entrada avanza ',q('ell',d.l1cm,'cm'),'. ¿Cuánto avanza el de salida?'];
        regla=volumen('El volumen que entra por un pistón sale por el otro.');
        cuentas=[paso('Calculamos el volumen que desplaza la entrada.',[S.V,' = ',q('A',d.A1cm2),' × ',q('ell',d.l1cm),' = ',q('V',d.A1cm2*d.l1cm,'cm³')]),
          paso('Despejamos el recorrido de salida.',[l2,' = ',frac(S.V,A2),' = ',frac(q('V',d.A1cm2*d.l1cm),q('A',d.A2cm2)),' = ',q('ell',valor,'cm')])];
        sentido='El pistón de mayor área necesita un recorrido menor para desplazar el mismo volumen.';malos=[d.l1cm,d.l1cm*k,d.l1cm/k**2];causas=['iguala los recorridos','invierte la razón de áreas','aplica dos veces la reducción'];dibujo=salida();break;}
      case'recorrido-unidades':{
        const l=d.l1mm/10,k=d.A2cm2/d.A1cm2;valor=l/k;unidad='cm';clave='ell';
        enunciado=['Las áreas de entrada y salida son ',q('A',d.A1cm2,'cm²'),' y ',q('A',d.A2cm2,'cm²'),'. La entrada avanza ',q('ell',d.l1mm,'mm'),'. ¿Cuántos centímetros avanza la salida?'];
        datos.push('1 cm = 10 mm.');regla=volumen('Convertimos el recorrido antes de calcular el volumen transferido.');
        cuentas=[paso('Expresamos el recorrido de entrada en centímetros.',[l1,' = ',q('ell',d.l1mm,'mm'),' = ',q('ell',l,'cm')]),
          paso('Despejamos el recorrido de salida y reemplazamos.',[l2,' = ',frac([A1,' × ',l1],A2),' = ',frac([q('A',d.A1cm2),' × ',q('ell',l)],q('A',d.A2cm2)),' = ',q('ell',valor,'cm')])];
        sentido='Los dos productos de área por recorrido representan un mismo volumen.';malos=[d.l1mm/k,l,l*k];causas=['no convierte milímetros','iguala los recorridos','invierte la razón de áreas'];dibujo=prensa({A1cm2:d.A1cm2,A2cm2:d.A2cm2,l1cm:l});break;}
      case'trabajo-salida':
        valor=d.F1N*d.l1cm/100;unidad='J';clave='W';
        enunciado=['Una fuerza constante de ',q('F',d.F1N,'N'),' empuja la entrada de una prensa durante ',q('ell',d.l1cm,'cm'),'. ¿Qué trabajo recibe la resistencia de salida en el modelo ideal horizontal?'];
        datos.push('1 m = 100 cm; 1 J = 1 N·m.');regla=trabajo('Sin pérdidas ni cambio gravitatorio del líquido, se conserva el trabajo transmitido.');
        cuentas=[paso('Expresamos el recorrido en metros.',[l1,' = ',q('ell',d.l1cm,'cm'),' = ',q('ell',d.l1cm/100,'m')]),
          paso('La fuerza actúa en el sentido del recorrido.',[W2,' = ',W1,' = ',q('F',d.F1N),' × ',q('ell',d.l1cm/100),' = ',q('W',valor,'J')])];
        sentido='La prensa puede aumentar la fuerza; el recorrido se reduce y el trabajo ideal no aumenta.';malos=[valor*10,-valor,d.F1N/(d.l1cm/100)];causas=['convierte centímetros con factor diez','cambia el signo del trabajo recibido','divide entre el recorrido'];dibujo=salida();break;
      case'serie-trabajo':{
        const k1=d.A2cm2/d.A1cm2,k2=d.A4cm2/d.A3cm2,l=d.l4cm/100;valor=d.F1N*k1*k2*l;unidad='J';clave='W';
        const F3=sub(S.F,'3'),F4=sub(S.F,'4'),A3=sub(S.A,'3'),A4=sub(S.A,'4'),l4=sub(S.ell,'4'),W4=sub(S.W,'4');
        enunciado=['Dos prensas horizontales están en serie. Entran ',q('F',d.F1N,'N'),' y la última salida avanza ',q('ell',d.l4cm,'cm'),'. ¿Qué trabajo recibe la resistencia final?'];
        datos.push(['Áreas de la primera etapa: ',A1,' = ',q('A',d.A1cm2,'cm²'),'; ',A2,' = ',q('A',d.A2cm2,'cm²'),'.'],
          ['Áreas de la segunda: ',A3,' = ',q('A',d.A3cm2,'cm²'),'; ',A4,' = ',q('A',d.A4cm2,'cm²'),'.'],
          'La unión rígida transmite la misma fuerza y recorrido entre las dos etapas.', '1 m = 100 cm.');
        regla=paso('Aplicamos Pascal a cada etapa; la unión transmite la fuerza entre ambas.',[...leyF,'   ;   ',frac(F3,A3),' = ',frac(F4,A4),'   ;   ',F3,' = ',F2,'   ;   ',W4,' = ',F4,' × ',l4]);
        cuentas=[paso('Despejamos el trabajo final en función de la fuerza de entrada.',[W4,' = ',F1,' × ',frac(A2,A1),' × ',frac(A4,A3),' × ',l4]),
          paso('Reemplazamos las razones y el recorrido expresado en metros.',[W4,' = ',q('F',d.F1N),' × ',frac(q('A',d.A2cm2),q('A',d.A1cm2)),' × ',frac(q('A',d.A4cm2),q('A',d.A3cm2)),' × ',q('ell',l),' = ',q('W',valor,'J')])];
        sentido='Las ganancias de fuerza de las etapas se multiplican; el trabajo sigue limitado por el recorrido de entrada.';
        malos=[d.F1N*k1*l,d.F1N*k2*l,d.F1N*k1**2*k2*l,d.F1N*(k1+k2)*l];causas=['omite la segunda etapa','omite la primera etapa','cuadra la primera ganancia','suma las ganancias'];dibujo=etapas(d);break;}
      case'radios-trabajo-recorrido':{
        const k=(d.r2cm/d.r1cm)**2;valor=d.WJ/(d.F1N*k)*100;unidad='cm';clave='ell';
        enunciado=['Una prensa circular tiene radios ',q('r',d.r1cm,'cm'),' y ',q('r',d.r2cm,'cm'),'. Entran ',q('F',d.F1N,'N'),' y se entregan ',q('W',d.WJ,'J'),'. ¿Cuánto recorre la salida?'];
        datos.push('1 m = 100 cm; 1 J = 1 N·m.');
        regla=paso('Usamos las áreas circulares, Pascal y el trabajo transmitido.',[S.A,' = π',sup(S.r),'   ;   ',...leyF,'   ;   ',W2,' = ',F2,' × ',l2]);
        cuentas=[paso('Despejamos el recorrido después de expresar la fuerza mediante los radios.',[F2,' = ',F1,' × ',frac(sup(r2),sup(r1)),'   ;   ',l2,' = ',frac(W2,[F1,' × ',frac(sup(r2),sup(r1))])]),
          paso('Reemplazamos y convertimos el recorrido a centímetros.',[l2,' = ',frac(q('W',d.WJ),[q('F',d.F1N),' × ',frac(sup(q('r',d.r2cm)),sup(q('r',d.r1cm)))]),' = ',q('ell',valor/100,'m'),' = ',q('ell',valor,'cm')])];
        sentido='Un trabajo disponible fija el recorrido cuando ya conocemos la fuerza que recibe la salida.';
        malos=[d.WJ/(d.F1N*d.r2cm/d.r1cm)*100,d.WJ/d.F1N*100,d.WJ/(d.F1N*k*k)*100,d.WJ/(d.F1N/k)*100];causas=['usa la razón de radios','omite la ganancia','cuadra la razón de áreas','invierte la razón de áreas'];dibujo=circulos(d);break;}
      case'trabajo-fuerza-entrada':{
        const l=d.l2cm/100,Fsal=d.W2J/l,k=d.A2cm2/d.A1cm2;valor=Fsal/k;unidad='N';clave='F';
        enunciado=['La salida de una prensa recibe ',q('W',d.W2J,'J'),' mientras recorre ',q('ell',d.l2cm,'cm'),'. Sus áreas de entrada y salida son ',q('A',d.A1cm2,'cm²'),' y ',q('A',d.A2cm2,'cm²'),'. ¿Qué fuerza entró?'];
        datos.push('1 m = 100 cm; 1 J = 1 N·m.');regla=paso('El trabajo permite obtener la fuerza de salida antes de usar Pascal.',[W2,' = ',F2,' × ',l2,'   ;   ',...leyF]);
        cuentas=[paso('Aislamos la fuerza de salida y luego la de entrada.',[F2,' = ',frac(W2,l2),'   ;   ',F1,' = ',frac(W2,l2),' × ',frac(A1,A2)]),
          paso('Sustituimos el recorrido en metros y las áreas compatibles.',[F1,' = ',frac(q('W',d.W2J),q('ell',l)),' × ',frac(q('A',d.A1cm2),q('A',d.A2cm2)),' = ',q('F',valor,'N')])];
        sentido='Primero se reconstruye la fuerza útil de salida; su área mayor explica por qué la fuerza de entrada es menor.';
        malos=[Fsal,Fsal/k**2,Fsal*k,Fsal*d.A1cm2/(d.A1cm2+d.A2cm2)];causas=['da la fuerza de salida','cuadra la reducción','invierte la razón','suma las áreas del divisor'];dibujo=salida();break;}
      case'desnivel-estatico':{
        const a1=d.A1cm2/10000,a2=d.A2cm2/10000,delta=d.rho*d.g*d.h2menos1m;valor=(d.F1N/a1-delta)*a2;unidad='N';clave='F';
        enunciado=['En una prensa quieta, el centro de salida está ',q('h',d.h2menos1m,'m'),' por encima del de entrada. Se aplican ',q('F',d.F1N,'N'),'. ¿Qué fuerza equilibra la salida?'];
        datos=['Líquido en reposo; pistones sin masa ni rozamiento y misma presión exterior.',
          ['Áreas: ',A1,' = ',q('A',d.A1cm2,'cm²'),'; ',A2,' = ',q('A',d.A2cm2,'cm²'),'.'],
          ['Densidad: ',S.rho,' = ',q('rho',d.rho,'kg/m³'),'.'],['Gravedad: ',S.g,' = ',q('g',d.g,'m/s²'),'.'],'1 cm² = 0,0001 m².'];
        regla=paso('Al ascender entre centros, la presión disminuye; relacionamos cada presión media con su fuerza.',[p2,' = ',p1,' − ',S.rho,' × ',S.g,' × ',S.h,'   ;   ',p1,' = ',frac(F1,A1),'   ;   ',F2,' = ',p2,' × ',A2]);
        cuentas=[paso('Sustituimos la primera presión y aislamos la fuerza de salida.',[F2,' = (',frac(F1,A1),' − ',S.rho,' × ',S.g,' × ',S.h,') × ',A2]),
          paso('Reemplazamos las áreas en metros cuadrados y el desnivel entre centros.',[F2,' = (',frac(q('F',d.F1N),q('A',a1)),' − ',q('rho',d.rho),' × ',q('g',d.g),' × ',q('h',d.h2menos1m),') × ',q('A',a2),' = ',q('F',valor,'N')])];
        sentido='La salida está más alta: tiene menor presión media. Este cálculo es estático y no compara trabajos.';
        malos=[d.F1N/a1*a2,(d.F1N/a1+delta)*a2,(d.F1N/a1-delta)*a1,(d.F1N/a1-2*delta)*a2];causas=['omite el desnivel','invierte el sentido vertical','usa el área de entrada','duplica el desnivel'];dibujo=desnivel(d);break;}
      case'diametro-desde-volumen':{
        const k=d.l1cm/d.l2cm;valor=2*d.r1cm*Math.sqrt(k);unidad='cm';clave='d';
        enunciado=['El pistón circular de entrada tiene radio ',q('r',d.r1cm,'cm'),' y recorre ',q('ell',d.l1cm,'cm'),'. La salida recorre ',q('ell',d.l2cm,'cm'),'. ¿Cuál es el diámetro de salida?'];
        regla=paso('Conservamos volumen y expresamos las áreas mediante los radios.',[...leyV,'   ;   ',S.A,' = π',sup(S.r),'   ;   ',S.d,' = 2',S.r]);
        cuentas=[paso('Despejamos el radio positivo y duplicamos para obtener el diámetro.',[sup(r2),' = ',sup(r1),' × ',frac(l1,l2),'   ;   ',d2,' = 2',r1,raiz(frac(l1,l2))]),
          paso('Reemplazamos los datos sin confundir radio y diámetro.',[d2,' = 2 × ',q('r',d.r1cm),' × ',raiz(frac(q('ell',d.l1cm),q('ell',d.l2cm))),' = ',q('d',valor,'cm')])];
        sentido='El menor recorrido corresponde a mayor área; la raíz convierte la razón de áreas en una razón de radios.';
        malos=[valor/2,2*d.r1cm*k,2*d.r1cm,2*d.r1cm/Math.sqrt(k)];causas=['da el radio','usa la razón sin raíz','conserva el diámetro inicial','invierte el volumen'];dibujo=circulos(d);break;}
      case'area-entrada':{
        const k=d.F2N/d.F1N;valor=d.A2cm2/k;unidad='cm²';clave='A';
        enunciado=['La salida de una prensa tiene ',q('A',d.A2cm2,'cm²'),' y transmite ',q('F',d.F2N,'N'),'. Entran ',q('F',d.F1N,'N'),'. ¿Qué área tiene el pistón de entrada?'];
        regla=pascal('A igual altura comparamos las fuerzas divididas entre sus áreas.');
        cuentas=[paso('Aislamos el área de entrada.',[A1,' = ',A2,' × ',frac(F1,F2)]),paso('Sustituimos las fuerzas y el área conocidas.',[A1,' = ',q('A',d.A2cm2),' × ',frac(q('F',d.F1N),q('F',d.F2N)),' = ',q('A',valor,'cm²')])];
        sentido='La entrada transmite la misma presión media mediante menor fuerza y menor área.';malos=[d.A2cm2,d.A2cm2*k,d.A2cm2/k**2];causas=['iguala las áreas','invierte la razón de fuerzas','cuadra la reducción'];dibujo=salida();break;}
      case'incremento-presion':{
        valor=(d.FfN-d.FiN)*10/d.Acm2;unidad='kPa';clave='p';
        const Fi=sub(S.F,'i'),Ff=sub(S.F,'f'),dp=['Δ',S.p];
        enunciado=['Sobre una misma cara de ',q('A',d.Acm2,'cm²'),', la fuerza aplicada pasa de ',q('F',d.FiN,'N'),' a ',q('F',d.FfN,'N'),'. ¿Qué incremento de presión se transmite al líquido?'];
        datos.push('1 cm² = 0,0001 m²; 1 kPa = 1000 Pa.');
        regla=paso('El incremento de presión corresponde al cambio de fuerza sobre la misma área.',[dp,' = ',frac([Ff,' − ',Fi],S.A)]);
        cuentas=[paso('Restamos las fuerzas final e inicial.',['Δ',S.F,' = ',q('F',d.FfN),' − ',q('F',d.FiN),' = ',q('F',d.FfN-d.FiN,'N')]),
          paso('Dividimos por el área y expresamos el incremento en kilopascales.',[dp,' = ',frac(q('F',d.FfN-d.FiN),q('A',d.Acm2/10000)),' = ',q('p',valor*1000,'Pa'),' = ',q('p',valor,'kPa')])];
        sentido='Pascal transmite el cambio de presión; la presión previa no se vuelve a sumar al incremento.';
        malos=[d.FfN*10/d.Acm2,(d.FfN+d.FiN)*10/d.Acm2,-valor];causas=['da la presión final','suma las dos fuerzas','invierte la resta'];dibujo=prensa({A1cm2:d.Acm2});break;}
      case'volumen-transferido':
        valor=d.A2cm2*d.l2cm;unidad='cm³';clave='V';
        enunciado=['La salida de una prensa tiene ',q('A',d.A2cm2,'cm²'),' y avanza ',q('ell',d.l2cm,'cm'),'. ¿Qué volumen de líquido recibe al avanzar?'];
        regla=paso('Una sección constante barre un volumen igual al área por su recorrido.',[S.V,' = ',A2,' × ',l2]);
        cuentas=[paso('Multiplicamos magnitudes expresadas en centímetros.',[S.V,' = ',q('A',d.A2cm2),' × ',q('ell',d.l2cm),' = ',q('V',valor,'cm³')])];
        sentido='Ese mismo volumen salió de la cámara de entrada, porque el líquido no se comprime ni se pierde.';malos=[d.l2cm/d.A2cm2,d.A2cm2/d.l2cm,d.A2cm2+d.l2cm];causas=['divide recorrido entre área','divide área entre recorrido','suma área y recorrido'];dibujo=salida();break;
      default:throw Error(`Tipo de prensa desconocido: ${tipo}`);
    }
    valor=Number(valor.toPrecision(14));malos=malos.map(x=>Number(x.toPrecision(14)));
    const errores=malos.map((v,j)=>({valor:v,error:`FL12-H-${tipo}-${j}`,siFuera:`Usaste los datos dados; ${causas[j]} y obtendrías ${literal(v,unidad)}.`}));
    const respuesta=clave?[q(clave,valor,unidad)]:[literal(valor)];
    return {enunciado,datos,dibujo,pide:`Se pide ${({F:'la fuerza indicada',A:'el área indicada',p:'la presión indicada',ell:'el recorrido indicado',W:'el trabajo transmitido',d:'el diámetro de salida',V:'el volumen transferido'})[clave]||'la ventaja mecánica'}.`,
      tengo:'Identificamos las medidas dadas, la entrada y la salida; conservamos la referencia de presión y las unidades indicadas.',regla,cuentas,sentido,respuesta,
      opciones:opciones(valor,errores,v=>literal(v,unidad)),caso:{tipo,...d,valor,unidad,errores:malos.map((v,j)=>({id:j,valor:v,operacion:causas[j]}))},
      erroresEjemplo:malos.map((v,j)=>`${literal(v,unidad)}: ${causas[j]}.`).join(' ')};
  }
  const muestras=[
    ['fuerza-salida',{A1cm2:5,A2cm2:20,F1N:18},'La fuerza de salida'],
    ['fuerza-entrada',{A1cm2:8,A2cm2:24,F2N:90},'La fuerza necesaria'],
    ['area-salida',{A1cm2:6,F1N:15,F2N:45},'Reconstruir un área'],
    ['ventaja-mecanica',{F1N:24,F2N:72},'Comparar las fuerzas'],
    ['presion-manometrica',{F2N:96,A2cm2:32},'La presión sobre una cara'],
    ['fuerza-radios',{r1cm:2,r2cm:4,F1N:25},'Dos radios distintos'],
    ['fuerza-areas-unidades',{A1mm2:600,A2cm2:18,F1N:27},'Compatibilizar las áreas'],
    ['recorrido-salida',{A1cm2:6,A2cm2:18,l1cm:15},'El recorrido de salida'],
    ['recorrido-unidades',{A1cm2:8,A2cm2:20,l1mm:30},'De milímetros a centímetros'],
    ['trabajo-salida',{F1N:40,l1cm:25},'El trabajo transmitido'],
    ['serie-trabajo',{A1cm2:4,A2cm2:12,A3cm2:5,A4cm2:10,F1N:18,l4cm:4},'Dos etapas conectadas'],
    ['radios-trabajo-recorrido',{r1cm:2,r2cm:4,F1N:20,WJ:4.8},'Recorrido desde el trabajo'],
    ['trabajo-fuerza-entrada',{W2J:7.2,l2cm:4,A1cm2:6,A2cm2:18},'Fuerza desde el trabajo'],
    ['desnivel-estatico',{A1cm2:4,A2cm2:12,F1N:20,rho:1000,g:10,h2menos1m:.5},'Centros a distintas alturas'],
    ['diametro-desde-volumen',{r1cm:2,l1cm:18,l2cm:8},'Un diámetro por reconstruir'],
  ];
  const firma=(tipo,d)=>tipo+JSON.stringify(Object.fromEntries(Object.entries(d).sort(([a],[b])=>a.localeCompare(b))));
  const reservadas=new Set(muestras.map(([tipo,d])=>firma(tipo,d)));
  function generar(s,ahora){
    const az=azar(s+(ahora?900001:130001));
    for(let intento=0;intento<80;intento++){
      let tipo,d;const j=(s+intento)%4;
      if(!ahora){
        if(j===0){tipo='area-entrada';const F1N=az.de([16,28,40]),k=az.de([2,3,4]);d={A2cm2:az.de([15,21,27,33]),F1N,F2N:F1N*k};}
        if(j===1){tipo='incremento-presion';const Acm2=az.de([7,11,13,17]),i=az.ent(2,5),salto=az.ent(1,3);d={Acm2,FiN:Acm2*i,FfN:Acm2*(i+salto)};}
        if(j===2){tipo='volumen-transferido';d={A2cm2:az.de([2,3,4]),l2cm:az.de([2.5,3.5,4])};if(d.A2cm2===d.l2cm)continue;}
        if(j===3){tipo='trabajo-salida';d={F1N:az.de([28,36,44,52,60]),l1cm:az.de([30,40,50,60,70])};}
      }else{
        if(j===0){tipo='fuerza-radios';const r1cm=az.de([1.5,2.5,3.5]),k=az.de([1.5,2]);d={r1cm,r2cm:r1cm*k,F1N:az.de([12,16,20,24,28,32])};}
        if(j===1){tipo='recorrido-salida';const A1cm2=az.de([7,9,11]);d={A1cm2,A2cm2:A1cm2*az.de([2,3,4]),l1cm:az.de([16,20,24,28,32])};}
        if(j===2){tipo='desnivel-estatico';const A1cm2=az.de([3,5,7]);d={A1cm2,A2cm2:A1cm2*az.de([2,3,4]),F1N:A1cm2*az.de([3,4,6]),rho:az.de([800,1200]),g:10,h2menos1m:az.de([.25,.5,.75])};}
        if(j===3){tipo='diametro-desde-volumen';const k=az.de([1.25,1.5]),l2cm=az.de([4,8,12,16]);d={r1cm:az.de([1.2,1.4,1.6,1.8,2.2,2.4,2.6,2.8,3.2,3.4]),l1cm:l2cm*k*k,l2cm};}
      }
      if(reservadas.has(firma(tipo,d)))continue;
      const c=caso(tipo,d);if(c.caso.errores.some(e=>Math.abs(e.valor/c.caso.valor)>20||Math.abs(c.caso.valor/e.valor)>20))continue;
      return ahora?pregunta(c):resuelto(c);
    }throw Error('No salió un caso de prensa dentro del dominio reservado.');
  }
  const pred={k:3,l2cm:2},predValor=pred.k*pred.l2cm;
  const esquemaPred={conectados:true,pistones:[{id:'entrada',tamano:'pequeno'},{id:'salida',tamano:'grande'}]};
  const antes=prensa({}, {prensa:esquemaPred,rotulos:[{ref:'entrada',y:30,texto:'Entrada'},{ref:'salida',y:30,texto:'Salida'},
    {x:160,fila:0,texto:'Salida: área triple',color:'d'},{x:160,fila:1,texto:'Salida: recorrido 2 cm',color:'d'}],alt:'Una prensa horizontal. El área de salida es triple y su recorrido dado es dos centímetros. El recorrido de entrada todavía es desconocido.'});
  const revela=prensa({l1cm:predValor,l2cm:pred.l2cm},{prensa:esquemaPred,alt:'La prensa horizontal desplaza el mismo volumen por ambos pistones: entrada seis centímetros y salida dos centímetros. Las caras conservan el orden de tamaño dado, sin escala.'});
  // Una animación de volumen posterior a Predice; los dos recorridos usan la misma escala axial.
  const movido=flu({tipo:'prensa',alto:380,escala:{transversal:2000,axial:600},
    prensa:{profundidad:.1,conectados:true,pistones:[{id:'entrada',area:.001,recorrido:.06},{id:'salida',area:.003,recorrido:.02}]},
    cotas:[{de:'inicio-entrada',a:'entrada',eje:'x',separacion:65,texto:'6 cm',color:'d'},{de:'inicio-salida',a:'salida',eje:'x',separacion:65,texto:'2 cm',color:'d'}],
    rotulos:[{ref:'entrada',y:30,texto:'Entrada'},{ref:'salida',y:30,texto:'Salida'},
      {ref:'entrada',fila:0,texto:'Área: 10 cm²',color:'d'},{ref:'salida',fila:0,texto:'Área: 30 cm²',color:'d'},
      {x:160,fila:1,texto:'Un par de áreas con razón 3',color:'d'}],
    alt:'Después de responder: el pistón de entrada avanza seis centímetros y el de salida dos, con la misma escala horizontal. Las áreas están en razón uno a tres.'});
  glosario.push(
    {termino:'prensa hidráulica',formas:['prensa hidráulica','prensas hidráulicas'],simple:'Un dispositivo que transmite fuerzas mediante un líquido encerrado.',def:'Máquina cuyos pistones actúan sobre un líquido encerrado. Permite aplicar una fuerza en un lugar y transmitirla a otro.',ejemplos:['Un modelo de taller conecta dos pistones mediante un líquido.','Los pistones pueden moverse horizontalmente o verticalmente según el montaje.','Un modelo ideal declara si desprecia fugas, rozamiento y masa de sus pistones.']},
    {termino:'ventaja mecánica',simple:'Una comparación entre la fuerza útil de salida y la fuerza de entrada.',def:'Razón entre la magnitud de la fuerza útil que entrega una máquina y la fuerza aplicada a su entrada.',ejemplos:['Una máquina puede recibir 10 N y transmitir 20 N.','Dos máquinas se comparan usando la misma definición de entrada y salida.','La ventaja mecánica no se mide en newtons ni en pascales.']}
  );
  return {
    id: 'prensa-hidraulica',titulo:'Dos pistones conectados',pregunta:'¿Cómo se relacionan las fuerzas y los recorridos de una prensa hidráulica?',temas:['Principio de Pascal'],pieza:'fis-fluidos-e12',
    aprendizaje:'Relaciono fuerzas, áreas y recorridos; distingo presión transmitida de fuerza y compruebo qué conserva una prensa ideal.',
    actividad:'Ajustar la fuerza de entrada y comparar la fuerza que puede equilibrar la salida.',
    lee:{tarjetas:[
      {titulo:'Un líquido entre dos pistones',texto:'Esta prensa hidráulica tiene pistones horizontales. El líquido ideal no se comprime y no puede escapar. Los centros están a igual altura; ambos pistones están rodeados por el mismo aire.',dibujo:prensa({A1cm2:10,A2cm2:40})},
      {titulo:'Entrada y salida',texto:['La fuerza ',F1,' empuja la entrada. La fuerza ',F2,' es la que el líquido transmite a la salida. Una resistencia opuesta mantiene el equilibrio. La ventaja mecánica compara ambas magnitudes.']},
      {titulo:'Qué muestran las flechas',texto:['Las flechas indican el sentido de las fuerzas; sus longitudes no comparan magnitudes. Lee los valores en newtons. Las áreas ',A1,' y ',A2,' corresponden a las caras de entrada y salida.']}
    ]},
    ejemplos:muestras.map(([tipo,d,titulo],j)=>ejemplo(caso(tipo,d),1+Math.floor(j/5),titulo,Math.max(0,j-10))),
    juega:{pieza:'fis-fluidos-e12',consigna:['Ajusta la fuerza de entrada. Compara las fuerzas para ',A1,' = ',q('A',10,'cm²'),' y ',A2,' = ',q('A',40,'cm²'),'.'],voz:'Compara las fuerzas sin confundirlas con presión.',
      mision:{texto:'Equilibra una resistencia de 120 N en la salida.',logrado:v=>v.F*40/10===120,bien:'La fuerza de salida equilibra la resistencia indicada.'},
      controles:[{id:'F',etiqueta:'Fuerza de entrada',color:'c-h',opciones:[10,20,30,40].map(n=>({valor:n,texto:`${n} N`})),inicio:10}],
      leyenda:[{s:F1,t:'fuerza externa sobre la entrada'},{s:F2,t:'fuerza transmitida a la salida'},{s:A1,t:'área de entrada: 10 cm²'},{s:A2,t:'área de salida: 40 cm²'},{s:'Flechas',t:'solo indican el sentido, no la magnitud'}],
      dibujo:v=>prensa({A1cm2:10,A2cm2:40,F1N:v.F,F2N:v.F*4}),lectura:v=>[F1,' = ',q('F',v.F,'N'),'; ',F2,' = ',q('F',v.F*4,'N'),'.'],resumen:{F:20},minimo:2},
    predice:{pregunta:'En otra prensa, el área de salida es triple de la de entrada. Para que la salida avance 2 cm, ¿cuánto debe avanzar la entrada?',
      datos:baseDatos.slice(),dibujo:antes,revelar:revela,opciones:opciones(predValor,[
        {valor:pred.l2cm,error:'FL12-H-IGUAL-RECORRIDO',siFuera:'Identificaste el recorrido de salida; igualar recorridos daría 2 cm, pero las áreas son distintas.'},
        {valor:pred.l2cm/pred.k,error:'FL12-H-INVIERTE-VOLUMEN',siFuera:'Reconociste la razón de áreas; invertirla al hallar la entrada daría 2/3 cm.'},
        {valor:pred.l2cm*pred.k**2,error:'FL12-H-DOBLE-RAZON',siFuera:'Reconociste el factor tres; aplicarlo dos veces daría 18 cm.'}],n=>literal(n,'cm')),
      coincide:'Coincide: el pistón de entrada recorre más distancia para desplazar el mismo volumen.'},
    mira:{pieza:'fis-fluidos-e12',datos:revela.datos,pasos:[
      {estado:{datos:movido.datos},texto:'Igualamos los volúmenes; el recorrido de entrada compensa su menor área.',ecuacion:[...leyV,'   ;   ',l1,' = ',frac([A2,' × ',l2],A1),' = 3 × ',q('ell',2,'cm'),' = ',q('ell',6,'cm')]},
      {estado:{datos:prensa({A1cm2:10,A2cm2:40,F1N:30,F2N:120}).datos},texto:'Pascal transmite el incremento de presión; a igual altura comparamos las presiones medias.',ecuacion:[...leyF,'   ;   ',F2,' = ',F1,' × ',frac(A2,A1)]},
      {texto:'En caras verticales, la presión media coincide con la del centro simétrico.',ecuacion:[p1,' = ',frac(F1,A1),'   ;   ',p2,' = ',frac(F2,A2)]},
      {texto:'El trabajo ideal transmitido combina fuerza y recorrido, sin aumentar energía.',ecuacion:leyW},
      {texto:'El área circular depende del radio al cuadrado; el diámetro duplica el radio.',ecuacion:[S.A,' = π',sup(S.r),'   ;   ',S.d,' = 2',S.r]},
      {texto:'Una unión rígida transmite la misma fuerza y el mismo recorrido entre etapas.',ecuacion:[sub(S.F,'3'),' = ',F2,'   ;   ',sub(S.ell,'3'),' = ',l2,'   ;   ',frac(sub(S.F,'4'),sub(S.F,'3')),' = ',frac(sub(S.A,'4'),sub(S.A,'3'))]},
      {texto:'Si el centro de salida está más alto, la presión disminuye al ascender.',ecuacion:[p2,' = ',p1,' − ',S.rho,' × ',S.g,' × ',S.h,'   ;   ',S.h,': desnivel positivo entre centros']}
    ]},
    regla:{texto:'Iguala presiones medias a igual altura y conserva el volumen. En el modelo horizontal ideal se transmite el mismo trabajo. Con desnivel, incorpora la diferencia hidrostática.',
      ecuacion:[...leyF,' (igual altura)   ;   ',...leyV,'   ;   ',...leyW,'   ;   ',S.A,' = π',sup(S.r),'   ;   ',S.d,' = 2',S.r,'   ;   ',p2,' = ',p1,' - ',S.rho,' × ',S.g,' × ',S.h,' (salida más alta, equilibrio)'],
      condicion:'Líquido incompresible; sin fugas ni rozamiento; pistones sin masa, presión exterior común. Igual trabajo: montaje horizontal sin cambio gravitatorio.',dibujo:revela},
    resuelve:{pieza:'fis-fluidos-e12',generar:s=>generar(s,false)},
    ahoraTu:{pieza:'fis-fluidos-e12',generar:s=>generar(s,true)}
  };
})();

const idea4 = (() => {
  const q=(k,x,u='')=>Q(k,x,u,6), n=x=>f(x,3), vs=sub(S.V,'s'), rl=sub(S.rho,'líquido'), rc=sub(S.rho,'cuerpo');
  const ta=sub(S.T,'aire'), tl=sub(S.T,'líquido'), v1=sub(S.V,'1'), v2=sub(S.V,'2'), r1=sub(S.rho,'1'), r2=sub(S.rho,'2');
  const mp=sub(S.m,'carga'), mt=sub(S.m,'total'), dE=sub(S.E,'2'), iE=sub(S.E,'1');
  const aprox=x=>Math.abs(Number(x.toFixed(3))-x)>1e-9;
  const muestra=(x,u)=>(aprox(x)?'≈ ':'')+n(x)+(u?' '+u:'');
  const eqfin=(sim,x,k,u)=>[sim,aprox(x)?' ≈ ':' = ',Q(k,x,u,3)];
  const er=(operacion,valor,motivo,corto)=>({operacion,valor,motivo,corto});
  const comun=['Cuerpo rígido, líquido quieto y g = 10 m/s².','No hay contacto con paredes ni fondo.','Se desprecia el empuje del aire y el efecto de la superficie.'];
  const conv='1 cm³ = 0,000001 m³.';
  const tipos={empuje:['E','N'],desplazado:['E','N'],profundidad:['E','N'],suspension:['T','N'],fraccion:['V','%'],'volumen-flota':['V','cm³'],'densidad-liquido':['rho','kg/m³'],'densidad-lecturas':['rho','kg/m³'],capas:['T','N'],anclaje:['T','N'],'cambio-liquido':['T','N'],carga:['m','kg']};

  function figura(tipo,e){
    const libre=['fraccion','volumen-flota','densidad-liquido','carga'].includes(tipo);
    const parcial=libre||(tipo==='empuje'&&e.Vs<e.V)||(tipo==='suspension'&&e.fraccion<1);
    const soporte=libre?'ninguno':tipo==='anclaje'?'inferior':'superior';
    const rotulos=[{ref:'tina',fila:0,texto:libre?'Flotación libre y estable':soporte==='inferior'?'Cuerda sujeta al fondo':'Suspensión desde arriba',color:'h'}];
    if(e.m!==undefined)rotulos.push({ref:'tina',fila:1,texto:'Masa: '+n(e.m)+' kg',color:'f'});
    else if(e.Ta!==undefined)rotulos.push({ref:'tina',fila:1,texto:'Lectura en aire: '+n(e.Ta)+' N',color:'h'});
    else if(e.rho!==undefined)rotulos.push({ref:'tina',fila:1,texto:'Líquido: '+n(e.rho)+' kg/m³',color:'f'});
    if(e.Vcm!==undefined)rotulos.push({ref:'tina',fila:2,texto:'Volumen total: '+n(e.Vcm)+' cm³',color:'d'});
    else if(e.V!==undefined)rotulos.push({ref:'tina',fila:2,texto:'Volumen total: '+f(e.V,6)+' m³',color:'d'});
    else if(e.Tl!==undefined)rotulos.push({ref:'tina',fila:2,texto:'Primera lectura: '+n(e.Tl)+' N',color:'h'});
    const fraccionDada=tipo==='empuje'?e.Vs/e.V:['suspension','densidad-liquido'].includes(tipo)?e.fraccion:undefined;
    const vaso={id:'tina',bloque:{id:'bloque',soporte,inmersion:parcial?'parcial':'completa',...(libre?{forma:'ancho'}:{}),...(fraccionDada!==undefined?{fraccionDada}:{})}};
    if(tipo==='capas'){vaso.capas=[{tono:1},{tono:2}];vaso.bloque.fraccionSuperiorDada=e.V1cm/e.Vcm;}
    return flu({tipo:'vasos',modo:'esquema',vasos:[vaso],rotulos,
      alt:tipo==='capas'?'Un cuerpo sostenido desde arriba ocupa partes de dos líquidos inmiscibles. La capa inferior es más densa.':
        libre?(fraccionDada!==undefined?'Un bloque ancho flota libremente con la fracción sumergida dada. La densidad pedida no está representada.':'Un bloque ancho flota libremente en orientación estable. La fracción inicial dibujada es esquemática; no representa un resultado calculado.'):
        'Un cuerpo '+(parcial?'parcialmente':'completamente')+' sumergido está sostenido por una cuerda '+(soporte==='inferior'?'inferior':'superior')+'. No toca el recipiente.'});
  }
  function construir(tipo,e){
    const [k,u]=tipos[tipo],g=10;
    let valor,enunciado,regla,cuentas,errores,intermedios={},datos=[...comun],sentido;
    const terminar=(sim,exp)=>[sim,' = ',exp,aprox(valor)?' ≈ ':' = ',Q(k,valor,u,3)];
    switch(tipo){
      case 'empuje': {
        const E=e.rho*g*e.Vs;valor=E;
        enunciado=['Un bloque de ',q('V',e.V,'m³'),' tiene ',q('V',e.Vs,'m³'),' dentro de un líquido de ',q('rho',e.rho,'kg/m³'),'. ¿Cuál es el empuje?'];
        datos.push('Un mecanismo externo mantiene la inmersión indicada.');
        regla=paso('Usamos el volumen dentro del líquido, aunque el bloque tenga una parte fuera.',[S.E,' = ',rl,' · ',S.g,' · ',vs]);
        cuentas=[paso('Multiplicamos la densidad del líquido por gravedad y volumen sumergido.',terminar(S.E,[q('rho',e.rho),' · ',q('g',g),' · ',q('V',e.Vs)]))];
        errores=[er('SIN_G',E/g,'Consideraste el líquido desplazado, pero diste su masa en lugar de su peso.','omite g'),
          e.V>e.Vs?er('TOTAL',e.rho*g*e.V,'Usaste la densidad del líquido, pero contaste también la parte del bloque que está fuera.','usa todo el volumen'):er('G_DOS',E*g,'Elegiste el volumen correcto, pero multiplicaste dos veces por la gravedad.','aplica g dos veces'),
          er('MITAD',E/2,'Reconociste fuerzas en caras opuestas, pero dividiste el empuje entre dos sin justificarlo.','divide el empuje entre dos')];
        sentido='El empuje corresponde al líquido desplazado, no al peso del cuerpo.';break;
      }
      case 'desplazado':
        valor=e.mf*g;enunciado=['Un cuerpo desplaza líquido cuya masa es ',q('m',e.mf,'kg'),'. ¿Cuál es el empuje que recibe?'];
        datos.push('Una suspensión superior mantiene al cuerpo totalmente sumergido.');
        regla=paso('El empuje tiene el valor del peso del líquido desplazado.',[S.E,' = ',sub(S.m,'líquido'),' · ',S.g]);
        cuentas=[paso('La masa dada es la del líquido desplazado.',terminar(S.E,[q('m',e.mf),' · ',q('g',g)]))];
        errores=[er('MASA',e.mf,'Usaste el dato pertinente, pero respondiste con masa en lugar de fuerza.','confunde masa y fuerza'),er('G_DOS',valor*g,'Identificaste el líquido desplazado, pero aplicaste dos veces la gravedad.','aplica g dos veces'),er('MITAD',valor/2,'Consideraste dos caras, pero el empuje resultante no se divide entre ellas.','divide entre dos')];
        sentido='La masa desplazada permite calcular el empuje sin conocer la forma del cuerpo.';break;
      case 'profundidad': {
        const E=e.rho*g*e.V;valor=E-E;intermedios={E};
        enunciado=['Un cuerpo rígido de ',q('V',e.V,'m³'),' está totalmente sumergido en líquido de ',q('rho',e.rho,'kg/m³'),'. Su cara superior baja de ',q('h',e.h1,'m'),' a ',q('h',e.h2,'m'),'. ¿Cuánto cambia el empuje?'];
        datos.push('Las profundidades parten de la superficie. La densidad del líquido no cambia.','Una suspensión superior sostiene el cuerpo en cada posición.');
        regla=paso('Al estar completamente sumergido, desplaza el mismo volumen en ambas posiciones.',[iE,' = ',dE,' = ',rl,' · ',S.g,' · ',S.V]);
        cuentas=[paso('Ambos empujes son iguales; restamos final menos inicial.',terminar([dE,' - ',iE],[q('E',E),' - ',q('E',E)]))];
        errores=[er('SOLO_E',E,'Reconociste el empuje, pero diste su valor en vez del cambio.','da el empuje'),er('PROF_CAMBIO',E*(e.h2/e.h1-1),'Usaste las profundidades, pero supusiste que el empuje crece en esa proporción.','hace proporcional a profundidad'),er('PROF_FINAL',E*e.h2/e.h1,'Comparaste profundidades, pero multiplicaste el empuje por esa razón y no calculaste un cambio.','escala el empuje inicial')];
        sentido='La presión aumenta en ambas caras; su diferencia mantiene el mismo empuje.';break;
      }
      case 'suspension': {
        const V=e.Vcm/1e6,Vs=V*e.fraccion,P=e.m*g,E=e.rho*g*Vs;valor=P-E;intermedios={V,Vs,P,E};
        enunciado=['Un bloque de ',q('m',e.m,'kg'),' y ',q('V',e.Vcm,'cm³'),' tiene ',q('V',100*e.fraccion,'%'),' de su volumen sumergido en líquido de ',q('rho',e.rho,'kg/m³'),'. ¿Qué marca la suspensión superior?'];
        datos.push(conv,'El bloque está en reposo y la cuerda tira hacia arriba.');
        regla=paso('El peso se equilibra con el empuje y la tensión superior.',[S.T,' + ',S.E,' = ',S.P,'   ;   ',S.T,' = ',S.P,' - ',S.E]);
        cuentas=[paso('Calculamos peso y empuje con el volumen realmente sumergido.',[S.P,' = ',q('m',e.m),' · ',q('g',g),' = ',q('P',P,'N'),'   ;   ',S.E,' = ',q('rho',e.rho),' · ',q('g',g),' · ',q('V',Vs),' = ',q('E',E,'N')]),
          paso('La cuerda aporta la fuerza que falta hacia arriba.',terminar(S.T,[q('P',P),' - ',q('E',E)]))];
        errores=[er('PESO',P,'Calculaste el peso, pero dejaste fuera la fuerza del líquido.','da solo el peso'),er('EMPUJE',E,'Calculaste el empuje, pero la pregunta pide la tensión de la cuerda.','da solo el empuje'),er('SUMA',P+E,'Reconociste ambas fuerzas, pero sumaste sus magnitudes aunque actúan en sentidos opuestos.','suma peso y empuje')];
        sentido='La lectura es positiva: una cuerda superior puede mantener este equilibrio.';break;
      }
      case 'fraccion':
        valor=100*e.rhob/e.rho;
        enunciado=['Un cuerpo de densidad media ',q('rho',e.rhob,'kg/m³'),' flota libremente en líquido de ',q('rho',e.rho,'kg/m³'),'. ¿Qué porcentaje de su volumen está sumergido?'];
        datos.push('Solo actúan verticalmente peso y empuje; la orientación es estable.');
        regla=paso('En flotación libre, igualamos empuje y peso antes de cancelar gravedad y volumen.',[rl,' · ',S.g,' · ',vs,' = ',rc,' · ',S.g,' · ',S.V]);
        cuentas=[paso('La razón entre volúmenes es la razón entre densidades.',[frac(vs,S.V),' = ',frac(rc,rl),' = ',frac(q('rho',e.rhob),q('rho',e.rho))]),paso('Expresamos esa misma fracción como porcentaje.',eqfin(frac(vs,S.V),valor,k,u))];
        errores=[er('FUERA',100-valor,'Hallaste una fracción, pero respondiste con el porcentaje fuera del líquido.','da la parte emergida'),er('INVERSA',100*e.rho/e.rhob,'Comparaste densidades, pero invertiste cuál corresponde al líquido.','invierte densidades'),er('TODO',100,'Reconociste el equilibrio, pero supusiste que exige inmersión completa.','supone inmersión completa')];
        sentido='La fracción está entre cero y uno: el cuerpo queda parcialmente sumergido.';break;
      case 'volumen-flota':
        valor=e.m/e.rho*1e6;intermedios={Vs:valor/1e6};
        enunciado=['Un bloque de ',q('m',e.m,'kg'),' y ',q('V',e.Vcm,'cm³'),' flota libremente en líquido de ',q('rho',e.rho,'kg/m³'),'. ¿Qué volumen queda sumergido, en cm³?'];
        datos.push(conv,'Solo actúan verticalmente peso y empuje; la orientación es estable.');
        regla=paso('El equilibrio permite cancelar gravedad y despejar el volumen sumergido.',[rl,' · ',S.g,' · ',vs,' = ',S.m,' · ',S.g,'   ;   ',vs,' = ',frac(S.m,rl)]);
        cuentas=[paso('El cociente da metros cúbicos; convertimos a centímetros cúbicos.',terminar(vs,[frac(q('m',e.m),q('rho',e.rho)),' · 1000000']))];
        errores=[er('TOTAL',e.Vcm,'Identificaste el volumen del cuerpo, pero no toda su parte está dentro del líquido.','da todo el volumen'),er('FUERA',e.Vcm-valor,'Calculaste una parte del cuerpo, pero diste el volumen que permanece fuera.','da la parte emergida'),er('PESO_MASA',valor*g,'Consideraste el equilibrio, pero usaste el peso como si fuera la masa.','usa el peso como masa')];
        sentido='El volumen obtenido es menor que el total; corresponde a flotación parcial.';break;
      case 'densidad-liquido':
        valor=e.rhob/e.fraccion;
        enunciado=['Un cuerpo de densidad media ',q('rho',e.rhob,'kg/m³'),' flota libremente con ',q('V',100*e.fraccion,'%'),' de su volumen sumergido. ¿Cuál es la densidad del líquido?'];
        datos.push('Solo actúan verticalmente peso y empuje; la orientación es estable.');
        regla=paso('La razón de volúmenes permite despejar la densidad del líquido.',[frac(vs,S.V),' = ',frac(rc,rl),'   ;   ',rl,' = ',frac(rc,frac(vs,S.V))]);
        cuentas=[paso('Usamos la fracción sumergida, no el porcentaje como número entero.',terminar(rl,frac(q('rho',e.rhob),q('V',e.fraccion))))];
        errores=[er('MULTIPLICA',e.rhob*e.fraccion,'Usaste la fracción sumergida, pero multiplicaste cuando el despeje exige dividir.','multiplica por la fracción'),er('FUERA',e.rhob/(1-e.fraccion),'Planteaste un cociente, pero empleaste la fracción que está fuera del líquido.','usa la parte emergida'),er('CUERPO',e.rhob,'Identificaste la densidad del cuerpo, pero la igualaste a la del líquido.','iguala ambas densidades')];
        sentido='El líquido resulta más denso que el cuerpo que flota parcialmente.';break;
      case 'densidad-lecturas': {
        const E=e.Ta-e.Tl,V=E/(e.rho*g),m=e.Ta/g;valor=m/V;intermedios={E,V,m};
        enunciado=['Un dinamómetro marca ',q('T',e.Ta,'N'),' en aire y ',q('T',e.Tl,'N'),' con el mismo cuerpo totalmente sumergido en líquido de ',q('rho',e.rho,'kg/m³'),'. ¿Cuál es la densidad del cuerpo?'];
        datos.push('El cuerpo está en reposo; en ambos casos la cuerda tira hacia arriba.');
        regla=paso('El descenso de lectura es el empuje; la lectura en aire da el peso.',[ta,' - ',tl,' = ',rl,' · ',S.g,' · ',S.V,'   ;   ',S.m,' = ',frac(ta,S.g)]);
        cuentas=[paso('Despejamos volumen y sustituimos en masa entre volumen.',[S.V,' = ',frac([ta,' - ',tl],[rl,' · ',S.g]),'   ;   ',rc,' = ',frac([rl,' · ',ta],[ta,' - ',tl])]),
          paso('Sustituimos las dos lecturas, sin confundir su diferencia con el peso.',terminar(rc,frac([q('rho',e.rho),' · ',q('T',e.Ta)],[q('T',e.Ta),' - ',q('T',e.Tl)])))];
        errores=[er('LECTURA_SUMERGIDA',e.rho*e.Tl/(e.Ta-e.Tl),'Reconociste la pérdida de lectura, pero usaste la lectura sumergida como peso del cuerpo.','usa la lectura sumergida como peso'),er('SUMA_LECTURAS',e.rho*e.Ta/(e.Ta+e.Tl),'Identificaste las dos lecturas, pero las sumaste en lugar de hallar su diferencia.','suma las lecturas'),er('DENSIDAD_LIQUIDO',e.rho,'Identificaste la densidad del líquido, pero respondiste con ella para el cuerpo.','confunde las dos densidades')];
        sentido='La densidad calculada supera la del líquido, coherente con una suspensión superior.';break;
      }
      case 'capas': {
        const V1=e.V1cm/1e6,V2=(e.Vcm-e.V1cm)/1e6,E=g*(e.rho1*V1+e.rho2*V2),P=e.m*g;valor=P-E;intermedios={V1,V2,E,P};
        enunciado=['Un cuerpo de ',q('m',e.m,'kg'),' y ',q('V',e.Vcm,'cm³'),' ocupa ',q('V',e.V1cm,'cm³'),' en la capa superior de ',q('rho',e.rho1,'kg/m³'),'; el resto está en otra de ',q('rho',e.rho2,'kg/m³'),'. ¿Qué marca su suspensión superior?'];
        datos.push(conv,'Líquidos inmiscibles; la capa inferior es más densa.','El cuerpo está en reposo, completamente sumergido entre las dos capas.');
        regla=paso('Sumamos ambos empujes y despejamos la tensión del equilibrio.',[S.T,' + ',S.E,' = ',S.P,'   ;   ',S.T,' = ',S.m,' · ',S.g,' - ',S.g,' · (',r1,' · ',v1,' + ',r2,' · ',v2,')']);
        cuentas=[paso('El segundo volumen es el total menos el de la capa superior.',[v2,' = ',S.V,' - ',v1,' = ',q('V',V2,'m³')]),
          paso('Cada parte desplaza el líquido de su propia capa.',terminar(S.T,[q('m',e.m),' · ',q('g',g),' - ',q('g',g),' · (',q('rho',e.rho1),' · ',q('V',V1),' + ',q('rho',e.rho2),' · ',q('V',V2),')']))];
        errores=[er('SOLO_SUPERIOR',P-e.rho1*g*e.Vcm/1e6,'Consideraste todo el volumen, pero aplicaste a ambas partes la densidad de la capa superior.','usa solo la densidad superior'),er('SOLO_INFERIOR',P-e.rho2*g*e.Vcm/1e6,'Consideraste todo el volumen, pero aplicaste a ambas partes la densidad de la capa inferior.','usa solo la densidad inferior'),er('SUMA',P+E,'Calculaste las fuerzas, pero sumaste peso y empuje al buscar la tensión superior.','suma peso y empuje')];
        sentido='El empuje total incluye las dos capas; la cuerda aporta el resto de la fuerza ascendente.';break;
      }
      case 'anclaje': {
        const V=e.Vcm/1e6,E=e.rho*g*V,P=e.m*g;valor=E-P;intermedios={V,E,P};
        enunciado=['Un cuerpo de ',q('m',e.m,'kg'),' y ',q('V',e.Vcm,'cm³'),' está completamente sumergido en líquido de ',q('rho',e.rho,'kg/m³'),'. Una cuerda lo sujeta al fondo sin contacto. ¿Cuánta tensión ejerce?'];
        datos.push(conv,'El cuerpo está en reposo; la cuerda tira hacia abajo.');
        regla=paso('El empuje equilibra las dos fuerzas descendentes: peso y tensión.',[S.E,' = ',S.P,' + ',S.T,'   ;   ',S.T,' = ',S.E,' - ',S.P]);
        cuentas=[paso('Sustituimos el empuje y el peso en el balance despejado.',[S.T,' = ',rl,' · ',S.g,' · ',S.V,' - ',S.m,' · ',S.g]),
          paso('La tensión es una magnitud positiva, con dirección hacia abajo.',terminar(S.T,[q('rho',e.rho),' · ',q('g',g),' · ',q('V',V),' - ',q('m',e.m),' · ',q('g',g)]))];
        errores=[er('PESO',P,'Identificaste una fuerza descendente, pero diste solo el peso del cuerpo.','da solo el peso'),er('EMPUJE',E,'Calculaste el empuje, pero olvidaste que el peso ya aporta parte de la fuerza descendente.','da solo el empuje'),er('SUMA',E+P,'Reconociste peso y empuje, pero sumaste magnitudes en lugar de equilibrar sus sentidos.','suma peso y empuje')];
        sentido='La cuerda inferior tira hacia abajo; una cuerda superior no sostendría este estado.';break;
      }
      case 'cambio-liquido': {
        const V=(e.Ta-e.Tl)/(e.rho1*g),E2=e.rho2*g*V;valor=e.Ta-E2;intermedios={V,E2};
        enunciado=['Un cuerpo marca ',q('T',e.Ta,'N'),' en aire y ',q('T',e.Tl,'N'),' al sumergirse totalmente en líquido de ',q('rho',e.rho1,'kg/m³'),'. ¿Qué lectura tendrá al sumergirse en otro de ',q('rho',e.rho2,'kg/m³'),'?'];
        datos.push('En ambos líquidos está en reposo, sujeto por la misma cuerda superior.');
        regla=paso('La primera diferencia de lecturas permite encontrar el volumen del cuerpo.',[ta,' - ',sub(S.T,'1'),' = ',r1,' · ',S.g,' · ',S.V,'   ;   ',S.V,' = ',frac([ta,' - ',sub(S.T,'1')],[r1,' · ',S.g])]);
        cuentas=[paso('Usamos ese mismo volumen en el segundo equilibrio.',[sub(S.T,'2'),' = ',ta,' - ',r2,' · ',S.g,' · ',S.V,' = ',ta,' - ',frac(r2,r1),' · (',ta,' - ',sub(S.T,'1'),')']),
          paso('La nueva densidad cambia el empuje; el peso permanece.',terminar(sub(S.T,'2'),[q('T',e.Ta),' - ',frac(q('rho',e.rho2),q('rho',e.rho1)),' · (',q('T',e.Ta),' - ',q('T',e.Tl),')']))];
        errores=[er('MISMA_LECTURA',e.Tl,'Conservaste el cuerpo, pero también conservaste la lectura aunque cambió el líquido.','conserva la lectura'),er('RAZON_INVERSA',e.Ta-(e.Ta-e.Tl)*e.rho1/e.rho2,'Comparaste densidades, pero invertiste la razón que multiplica al primer empuje.','invierte la razón de densidades'),er('SUMA',e.Ta+E2,'Calculaste el nuevo empuje, pero lo sumaste al peso para obtener la lectura.','suma peso y empuje')];
        sentido='El segundo líquido ejerce mayor empuje; la lectura superior disminuye y sigue siendo positiva.';break;
      }
      case 'carga': {
        const V=e.Vcm/1e6,Vs=V*e.fraccion,total=e.rho*Vs;valor=total-e.m;intermedios={V,Vs,total};
        enunciado=['Un bloque de ',q('V',e.Vcm,'cm³'),' y ',q('m',e.m,'kg'),' flota en líquido de ',q('rho',e.rho,'kg/m³'),'. ¿Qué masa debes añadir para sumergir ',q('V',e.fraccion*100,'%'),' del bloque?'];
        datos.push(conv,'La carga permanece fuera del líquido y centrada sobre el bloque.','La flotación final es libre, parcial y de orientación estable.');
        regla=paso('El empuje final sostiene el peso del bloque y el de la carga.',[rl,' · ',S.g,' · ',vs,' = (',S.m,' + ',mp,') · ',S.g]);
        cuentas=[paso('Cancelamos gravedad y aislamos la masa añadida.',[mp,' = ',rl,' · ',vs,' - ',S.m]),
          paso('La parte sumergida pertenece al bloque; la carga no desplaza líquido.',terminar(mp,[q('rho',e.rho),' · ',q('V',e.fraccion),' · ',q('V',V),' - ',q('m',e.m)]))];
        errores=[er('MASA_TOTAL',total,'Calculaste la masa sostenida, pero no restaste la masa que ya tiene el bloque.','da la masa total'),er('TODO',e.rho*V-e.m,'Restaste la masa del bloque, pero supusiste que queda completamente sumergido.','sumerge todo el bloque'),er('MASA_INICIAL',e.m,'Identificaste el dato de masa inicial, pero lo repetiste como masa añadida sin usar la inmersión.','repite la masa inicial')];
        sentido='La carga añadida es positiva y el volumen sumergido final es menor que el volumen total.';break;
      }
      default:throw Error('Familia de empuje desconocida: '+tipo);
    }
    const ops=opciones(valor,errores.map(x=>({valor:x.valor,error:'FL12-E-'+x.operacion,siFuera:x.motivo})),x=>muestra(x,u));
    const pregunta=['la fuerza pedida','el porcentaje sumergido','el volumen sumergido','la densidad pedida','la masa añadida'][tipo==='fraccion'?1:tipo==='volumen-flota'?2:tipo.includes('densidad')?3:tipo==='carga'?4:0];
    const tengo={empuje:'Conozco la densidad del líquido y los volúmenes total y sumergido.',desplazado:'Conozco la masa del líquido desplazado y la gravedad del modelo.',profundidad:'Conozco el volumen, la densidad del líquido y las dos profundidades.',suspension:'Conozco la masa, el volumen total, la inmersión y la densidad del líquido.',fraccion:'Conozco las densidades del cuerpo y del líquido.',
      'volumen-flota':'Conozco la masa, el volumen total y la densidad del líquido.','densidad-liquido':'Conozco la densidad del cuerpo y su fracción sumergida.','densidad-lecturas':'Conozco las dos lecturas y la densidad del líquido.',capas:'Conozco la masa, los volúmenes y las densidades de ambas capas.',anclaje:'Conozco la masa, el volumen y la densidad del líquido; la cuerda tira hacia abajo.','cambio-liquido':'Conozco las dos lecturas iniciales y las densidades de los dos líquidos.',carga:'Conozco la masa inicial, el volumen del bloque y la inmersión final pedida.'}[tipo];
    return {enunciado,datos,dibujo:figura(tipo,e),pide:['Busco ',V(k,pregunta),'.'],tengo,regla,cuentas,sentido,
      respuesta:[V(k,muestra(valor,u))],opciones:ops,caso:{tipo,...e,g,valor,unidad:u,intermedios,errores:errores.map(({operacion,valor})=>({operacion,valor}))},
      erroresEjemplo:errores.map(x=>muestra(x.valor,u)+': '+x.corto+'.').join(' ')};
  }
  const muestras=[
    ['empuje',{rho:1000,V:0.0008,Vs:0.0003},'Solo la parte dentro'],
    ['empuje',{rho:800,V:0.0005,Vs:0.0005},'Todo el cuerpo dentro'],
    ['empuje',{rho:1200,V:0.001,Vs:0.0004},'Un líquido distinto'],
    ['desplazado',{mf:0.75},'La masa desplazada'],
    ['profundidad',{rho:900,V:0.0004,h1:0.2,h2:0.8},'Dos posiciones del mismo cuerpo'],
    ['suspension',{m:1.2,Vcm:400,rho:1000,fraccion:1},'La lectura de una cuerda superior'],
    ['fraccion',{rhob:600,rho:1000},'La parte que queda dentro'],
    ['volumen-flota',{m:0.45,Vcm:600,rho:900},'Volumen y equilibrio libre'],
    ['suspension',{m:1.5,Vcm:1000,rho:1250,fraccion:0.4},'La suspensión con inmersión parcial'],
    ['densidad-liquido',{rhob:900,fraccion:0.75},'Reconstruir la densidad del líquido'],
    ['densidad-lecturas',{Ta:12,Tl:8,rho:1000},'La densidad desde dos lecturas'],
    ['capas',{m:1.4,Vcm:1000,V1cm:400,rho1:800,rho2:1200},'Un cuerpo entre dos capas'],
    ['anclaje',{m:0.2,Vcm:500,rho:1000},'La cuerda que tira hacia abajo'],
    ['cambio-liquido',{Ta:15,Tl:11,rho1:800,rho2:1200},'El mismo cuerpo en otro líquido'],
    ['carga',{Vcm:2000,m:0.8,rho:1000,fraccion:0.75},'Una carga sobre el bloque']
  ];
  const bancos=[['suspension','fraccion','densidad-lecturas','carga'],['empuje','volumen-flota','densidad-liquido','capas','anclaje','cambio-liquido']];
  function generar(s,ahora){
    const r=azar(s+ (ahora?74013:41009)),tipo=bancos[+ahora][s%bancos[+ahora].length];
    for(let intento=0;intento<100;intento++){
      let e;
      const rho=r.de(ahora?[880,1040,1160]:[920,1080,1240]),Vcm=r.de([350,450,550,650,750]),fr=r.de([0.3,0.4,0.6,0.7]);
      if(tipo==='suspension')e={rho,Vcm,m:rho*Vcm/1e6*r.de([2.5,3,3.5]),fraccion:r.de([0.4,0.7,1])};
      if(tipo==='fraccion')e={rho,rhob:rho*fr};
      if(tipo==='densidad-lecturas'){const Ta=r.de([14,17,19,22,25]);e={rho,Ta,Tl:Ta*r.de([0.6,0.7,0.75])};}
      if(tipo==='carga'){const V=Vcm/1e6;e={rho,Vcm,m:rho*V*0.2,fraccion:r.de([0.6,0.7,0.75,0.8])};}
      if(tipo==='empuje')e={rho,V:Vcm/1e6,Vs:Vcm/1e6*fr};
      if(tipo==='volumen-flota')e={rho,Vcm,m:rho*Vcm/1e6*fr};
      if(tipo==='densidad-liquido')e={rhob:rho*fr,fraccion:fr};
      if(tipo==='capas'){const rho1=r.de([720,840,960]),rho2=rho1+400;e={rho1,rho2,Vcm,V1cm:Vcm*fr,m:rho2*Vcm/1e6*1.8};}
      if(tipo==='anclaje')e={rho,Vcm,m:rho*Vcm/1e6*r.de([0.2,0.3,0.4])};
      if(tipo==='cambio-liquido'){const Ta=r.de([14,17,19,22]),rho1=r.de([720,840,960]);e={Ta,Tl:Ta*0.8,rho1,rho2:rho1*1.5};}
      try{const c=construir(tipo,e);return ahora?pregunta(c):resuelto(c);}catch(err){if(!/alternativas repetidas|dos respuestas correctas/.test(err.message))throw err;}
    }
    throw Error('Empuje: no se obtuvo un caso con alternativas distintas');
  }

  function juego(v){
    const vc=Math.max(0,Math.min(600,Math.round(v.Vs))),vol=vc/1e6,nivel=0.14+vol/0.024,base=nivel-vol/0.005;
    return flu({tipo:'vasos',modo:'medida',escala:{vertical:600,transversal:600},vasos:[{id:'tina',alto:0.28,ancho:0.24,profundidad:0.10,nivel,bloque:{id:'bloque',ancho:0.10,profundidad:0.05,alto:0.12,base,soporte:'superior'}}],
      rotulos:[{ref:'tina',fila:0,texto:'V = 600 cm³',color:'d'},{ref:'tina',fila:1,texto:'Dentro: '+n(vc)+' cm³',color:'d'},{ref:'tina',fila:2,texto:'Lectura cubierta',color:'h'}],
      alt:'El mecanismo sostiene un bloque de 600 cm³. El volumen dentro del líquido es '+n(vc)+' cm³. La superficie sube al introducir el bloque; la lectura de fuerza está cubierta.'});
  }
  const pred=construir('suspension',{m:0.8,Vcm:500,rho:1000,fraccion:1}),Pp=pred.caso.intermedios.P,Ep=pred.caso.intermedios.E,Tp=pred.caso.valor;
  const ancla=construir('anclaje',{m:0.3,Vcm:800,rho:1000}).caso;
  function fuerzas(P,E,T,abajo=false,sinT=false){
    return {alto:300,objetos:[{tipo:'caja',x:160,y:155,w:80,h:40}],
      flechas:[{de:[160,164],ang:-90,largo:P*9,color:'h',texto:'P = '+n(P)+' N'},
        {de:[135,106],ang:90,largo:E*9,color:'h',texto:'E = '+n(E)+' N'},
        ...(!sinT?[{de:abajo?[200,164]:[190,106],ang:abajo?-90:90,largo:T*9,color:'h',texto:'T = '+n(T)+' N'}]:[])],
      textos:[{x:160,y:282,texto:abajo?'La cuerda tira hacia abajo':'La cuerda tira hacia arriba',ancla:'middle',color:'h'}],
      alt:'Diagrama de fuerzas: peso '+n(P)+' N hacia abajo, empuje '+n(E)+' N hacia arriba'+(!sinT?', tensión '+n(T)+' N hacia '+(abajo?'abajo':'arriba'):'')+'. Escala común de fuerza.'};
  }
  const esquemaFuerzas={alto:300,objetos:[{tipo:'caja',x:160,y:160,w:90,h:55}],flechas:[{de:[160,71],ang:-90,largo:32,color:'h'},{de:[160,193],ang:90,largo:32,color:'h'}],textos:[{x:80,y:78,texto:'Fuerza superior',color:'h',ancla:'middle'},{x:240,y:210,texto:'Fuerza inferior',color:'h',ancla:'middle'},{x:160,y:272,texto:'Fuerzas esquemáticas',ancla:'middle'}],alt:'Las presiones actúan normalmente sobre las caras superior e inferior del cuerpo. Las flechas muestran direcciones, sin escala.'};
  const libre={alto:300,objetos:[{tipo:'caja',x:160,y:160,w:120,h:35}],flechas:[{de:[160,116],ang:90,largo:48,color:'h',texto:'E'},{de:[160,169],ang:-90,largo:48,color:'h',texto:'P'}],textos:[{x:160,y:274,texto:'Flotación libre en equilibrio',ancla:'middle'}],alt:'Un bloque ancho tiene solo empuje hacia arriba y peso hacia abajo. En equilibrio sus magnitudes son iguales.'};
  const dosLecturas={alto:300,objetos:[
    {tipo:'gancho',x:80,y:38,w:30},{tipo:'gancho',x:240,y:38,w:30},
    {tipo:'cuerda',de:[80,68],a:[80,130]},{tipo:'cuerda',de:[240,68],a:[240,130]},
    {tipo:'caja',x:80,y:170,w:56,h:40},{tipo:'caja',x:240,y:170,w:56,h:40}],
    textos:[{x:80,y:214,texto:'En aire',ancla:'middle'},{x:240,y:214,texto:'Sumergido',ancla:'middle'},
      {x:80,y:248,texto:'T en aire',ancla:'middle',color:'h'},{x:240,y:248,texto:'T en líquido',ancla:'middle',color:'h'},
      {x:160,y:282,texto:'El mismo cuerpo en dos estados',ancla:'middle'}],
    alt:'El mismo cuerpo cuelga de un dinamómetro en dos estados: en aire y completamente sumergido. Se identifican las dos lecturas sin dar valores.'};
  const porciones={alto:300,objetos:[{tipo:'caja',x:80,y:170,w:56,h:42},{tipo:'caja',x:240,y:170,w:56,h:42}],
    flechas:[{de:[80,118],ang:90,largo:38,color:'h',texto:'Empuje 1'},{de:[240,118],ang:90,largo:38,color:'h',texto:'Empuje 2'}],
    textos:[{x:80,y:210,texto:'Parte en capa 1',ancla:'middle',color:'d'},{x:240,y:210,texto:'Parte en capa 2',ancla:'middle',color:'d'},
      {x:160,y:280,texto:'Dos aportes; flechas sin escala',ancla:'middle'}],
    alt:'Las dos porciones desplazadas se muestran por separado. Cada líquido aporta un empuje ascendente. Las flechas son cualitativas y no comparan magnitudes.'};
  const capas=figura('capas',muestras[11][1]);
  glosario.push(
    {termino:'empuje',simbolo:'E',medida:'N',formas:['empuje','empujes'],simple:'Fuerza resultante que un fluido ejerce sobre un cuerpo inmerso.',def:'Resultante de las fuerzas de presión que el fluido ejerce sobre el cuerpo.',ejemplos:['Un líquido ejerce empuje sobre un cuerpo sostenido por una cuerda.','El empuje se mide en newtons.','Un objeto que se hundiría al soltarlo también recibe empuje.']},
    {termino:'volumen desplazado',simbolo:'V',medida:'m³',formas:['volumen desplazado','líquido desplazado'],simple:'Espacio del líquido que pasa a ocupar la parte introducida del cuerpo.',def:'Volumen del espacio que ocuparía el líquido si no estuviera la parte sumergida del cuerpo.',ejemplos:['Un bloque puede entrar solo parcialmente en una tina.','El nivel puede subir sin que se derrame líquido.','La parte del bloque que permanece fuera no ocupa espacio dentro del líquido.']}
  );
  return {
    id: 'empuje',titulo:'Un bloque dentro del líquido',pregunta:'¿Qué sostiene al cuerpo cuando una parte o todo su volumen entra en el líquido?',temas:['Principio de Arquímedes'],pieza:'fis-fluidos-e12',
    aprendizaje:'Calculo el empuje con el volumen sumergido y equilibro las fuerzas para interpretar flotación y lecturas de suspensión.',actividad:'Introducir un bloque sostenido y reconocer qué volumen ocupa dentro del líquido.',
    lee:{tarjetas:[
      {titulo:'Un cuerpo sostenido sobre una tina',texto:'El mecanismo sostiene un bloque rígido. Puedes introducir una parte o todo el bloque sin soltarlo. El líquido no sale de la tina: su nivel cambia mientras el cuerpo entra.',dibujo:juego({Vs:0})},
      {titulo:'Dos volúmenes que debemos distinguir',texto:['El volumen total ',S.V,' pertenece a todo el bloque. El volumen sumergido ',vs,' corresponde a la parte dentro del líquido. En esta tina, el volumen desplazado ocupa espacio sin derramarse.']},
      {titulo:'La lectura del instrumento',texto:['El dinamómetro mide la tensión ',S.T,' de la cuerda. Su lectura es el peso aparente en esta suspensión. La pantalla permanece cubierta mientras reconoces la inmersión; las fuerzas se estudiarán después.']}
    ]},
    juega:{pieza:'fis-fluidos-e12',consigna:'Introduce el bloque sin soltarlo y alcanza el volumen desplazado de la misión.',voz:'Observa qué parte entra y cómo cambia el nivel de la tina.',
      controles:[{id:'Vs',etiqueta:'Volumen dentro del líquido',color:'c-d',min:0,max:600,paso:100,inicio:0}],
      mision:{texto:'Haz que el bloque desplace 400 cm³ de líquido.',logrado:v=>Math.round(v.Vs)===400,bien:'El volumen dentro del líquido coincide con la misión.',pista:'Compara el volumen indicado con el que pide la misión.'},
      leyenda:[{s:S.V,t:'volumen total del bloque: 600 cm³'},{s:'Bloque',t:'dimensiones: 10×5×12 cm; suspensión superior'},{s:vs,t:'volumen sumergido, medido en cm³'},{s:'Tina',t:'base: 24×10 cm; altura: 28 cm'},{s:'Nivel',t:'inicial: 14 cm; el líquido no rebosa'},{s:'Contacto',t:'el bloque no toca paredes ni fondo'}],
      dibujo:juego,lectura:v=>['El volumen ',vs,' dentro del líquido es ',q('V',Math.max(0,Math.min(600,Math.round(v.Vs))),'cm³'),'.'],resumen:{Vs:300},minimo:2},
    predice:{pregunta:pred.enunciado,datos:pred.datos,dibujo:pred.dibujo,opciones:pred.opciones,revelar:est(fuerzas(Pp,Ep,Tp)),coincide:'La lectura corresponde a la fuerza de la cuerda: el líquido también sostiene al cuerpo.'},
    mira:{pieza:'fis-estatica',datos:{cortes:[esquemaFuerzas,fuerzas(Pp,Ep,Tp,false,true),fuerzas(Pp,Ep,Tp),libre,fuerzas(ancla.intermedios.P,ancla.intermedios.E,ancla.valor,true),dosLecturas,porciones]},pasos:[
      {estado:{corte:0},texto:'La diferencia entre presiones produce una fuerza neta ascendente: el empuje.',ecuacion:[S.E,' = (',sub(S.p,'inferior'),' - ',sub(S.p,'superior'),') · ',S.A,' = ',rl,' · ',S.g,' · ',vs]},
      {estado:{corte:1},texto:'En Predice, todo el volumen está dentro; calculamos el empuje del líquido.',ecuacion:[S.E,' = ',q('rho',pred.caso.rho),' · ',q('g',10),' · ',q('V',pred.caso.intermedios.Vs),' = ',q('E',Ep,'N')]},
      {estado:{corte:2},texto:'El peso se reparte entre empuje y tensión; despejamos la lectura.',ecuacion:[S.T,' = ',S.m,' · ',S.g,' - ',S.E,' = ',q('m',pred.caso.m),' · ',q('g',10),' - ',q('E',Ep),' = ',q('T',Tp,'N')]},
      {estado:{corte:3},texto:'Al flotar libremente, solo peso y empuje se equilibran.',ecuacion:[rl,' · ',S.g,' · ',vs,' = ',rc,' · ',S.g,' · ',S.V,'   ;   ',frac(vs,S.V),' = ',frac(rc,rl)]},
      {estado:{corte:4},texto:'Una cuerda inferior tira hacia abajo; su tensión se suma al peso.',ecuacion:[S.E,' = ',S.P,' + ',S.T,'   ;   ',S.T,' = ',S.E,' - ',S.P]},
      {estado:{corte:5},texto:'Dos lecturas permiten despejar volumen; en aire, despreciamos el empuje.',ecuacion:[ta,' - ',tl,' = ',rl,' · ',S.g,' · ',S.V,'   ;   ',S.V,' = ',frac([ta,' - ',tl],[rl,' · ',S.g])]},
      {estado:{corte:6},texto:'Con dos capas, cada parte desplazada aporta su propio empuje.',ecuacion:[S.E,' = ',S.g,' · (',r1,' · ',v1,' + ',r2,' · ',v2,')']}
    ]},
    regla:{texto:'El empuje depende del volumen sumergido. En reposo, equilibra todas las fuerzas: la flotación libre y las suspensiones superior e inferior son montajes distintos.',ecuacion:[S.E,' = ',rl,' · ',S.g,' · ',vs],
      condicion:'Cuerpo rígido; líquido quieto y homogéneo por capa; sin contacto con el recipiente ni efectos superficiales.',
      voz:'Completamente sumergido en el mismo líquido uniforme, el cuerpo rígido desplaza igual volumen a cualquier profundidad.',dibujo:capas},
    ejemplos:muestras.map(([t,e,titulo],i)=>ejemplo(construir(t,e),Math.floor(i/5)+1,titulo,i-10)),
    resuelve:{pieza:'fis-fluidos-e12',generar:s=>generar(s,false)},
    ahoraTu:{pieza:'fis-fluidos-e12',generar:s=>generar(s,true)}
  };
})();

const idea5 = (() => {
  const q=(k,x,u='')=>Q(k,x,u,6),n=x=>f(x,3),eqsign=x=>Math.abs(x-Number(x.toFixed(3)))<1e-10?' = ':' ≈ ';
  const mostrar=(v,u)=>(eqsign(v).includes('≈')?'≈ ':'')+n(v)+' '+u;
  const sep='   ·   ',fc=sub(S.F,'cal'),lc=sub(S.L,'cal'),nc=sub(S.n,'cal');
  const formulaF=[S.F,' = ',S.n,' · ',S.gamma,' · ',S.L];
  const formulaCap=['2π · ',S.r,' · ',S.gamma,' = ',S.rho,' · π · ',sup(S.r),' · ',S.h,' · ',S.g];
  function pelicula(e,lectura){
    const L=e.Lcm!==undefined?e.Lcm/100:e.Lmm!==undefined?e.Lmm/1000:null;
    const ancho=L===null?140:L*1500,izq=160-ancho/2,der=160+ancho/2;
    const textos=[{x:160,y:28,texto:e.n===1?'Una superficie activa':'Película sobre un marco',ancla:'middle'},
      {x:160,y:264,texto:'n = '+(e.n||2)+' '+((e.n||2)===1?'superficie':'caras'),color:'f',ancla:'middle'}];
    if(e.gamma!==undefined)textos.push({x:160,y:286,texto:'γ = '+n(e.gamma)+' N/m',color:'f',ancla:'middle'});
    if(e.gammaMilli!==undefined)textos.push({x:160,y:286,texto:'γ = '+n(e.gammaMilli)+' mN/m',color:'f',ancla:'middle'});
    if(L===null)textos.push({x:160,y:310,texto:'Esquema sin escala',ancla:'middle'});
    if(lectura!==undefined)textos.push({x:160,y:64,texto:'T = '+n(lectura*1000)+' mN',color:'h',ancla:'middle'});
    return est({alto:330,lineas:[{de:[izq,120],a:[der,120],discontinua:false},{de:[izq,120],a:[izq,206],discontinua:false},
      {de:[der,120],a:[der,206],discontinua:false},{de:[izq,206],a:[der,206],discontinua:false},
      {de:[izq+ancho*.2,190],a:[izq+ancho*.42,138]},{de:[izq+ancho*.55,190],a:[izq+ancho*.77,138]}],
      cotas:[{de:[izq,206],a:[der,206],lado:1,sep:16,texto:L===null?'L':'L = '+n(L*100)+' cm',color:'d'}],
      flechas:lectura===undefined?[]:[{de:[160,116],ang:90,largo:lectura*6000,color:'h'}],textos,
      alt:L===null?'Un marco sostiene una película; la longitud desconocida no está dibujada a escala.':'El alambre superior tiene la longitud indicada. La película está debajo y el sostén actúa hacia arriba.'});
  }
  function capilar(e){
    const textos=[{x:160,y:26,texto:'Capilar circular vertical',ancla:'middle'},
      {x:160,y:50,texto:'θ = 0°',color:'d',ancla:'middle'},{x:160,y:318,texto:'Esquema sin escala',ancla:'middle'}];
    if(e.rMm!==undefined)textos.push({x:160,y:74,texto:'r = '+n(e.rMm)+' mm',color:'d',ancla:'middle'});
    else if(e.dMm!==undefined)textos.push({x:160,y:74,texto:'d = '+n(e.dMm)+' mm',color:'d',ancla:'middle'});
    if(e.hCm!==undefined)textos.push({x:160,y:98,texto:'h = '+n(e.hCm)+' cm',color:'d',ancla:'middle'});
    if(e.gamma!==undefined)textos.push({x:160,y:290,texto:'γ = '+n(e.gamma)+' N/m',color:'f',ancla:'middle'});
    return est({alto:338,lineas:[{de:[136,126],a:[136,260],discontinua:false},{de:[160,126],a:[160,260],discontinua:false},
      {de:[36,236],a:[136,236],discontinua:false},{de:[160,236],a:[284,236],discontinua:false},
      {de:[36,236],a:[36,268],discontinua:false},{de:[284,236],a:[284,268],discontinua:false},{de:[36,268],a:[284,268],discontinua:false}],
      angulos:[{c:[148,156],r:12,de:180,a:360}],cotas:[{de:[190,236],a:[190,168],texto:'h',color:'d',lado:1,sep:12}],textos,
      alt:'Un tubo circular contiene una columna elevada sobre el depósito. El esquema no representa a escala el ascenso ni el radio.'});
  }
  const unidades={fuerza:'mN',coeficiente:'N/m',longitud:'cm',sosten:'mN','coeficiente-peso':'N/m','capilar-altura':'cm','calibracion-sosten':'mN','calibracion-capilar':'cm','capilar-diametro':'mm','capilar-pelicula':'mN','sosten-capilar-diametro':'mm'};
  const claves={fuerza:'F',coeficiente:'gamma',longitud:'L',sosten:'T','coeficiente-peso':'gamma','capilar-altura':'h','calibracion-sosten':'T','calibracion-capilar':'h','capilar-diametro':'d','capilar-pelicula':'F','sosten-capilar-diametro':'d'};
  const er=(operacion,valor,motivo,corto)=>({operacion,valor,motivo,corto});
  function caso(tipo,e,conOpciones=false){
    const u=unidades[tipo],k=claves[tipo],g=e.g||10;
    const L=e.Lcm!==undefined?e.Lcm/100:e.Lmm!==undefined?e.Lmm/1000:undefined;
    const r=e.rMm!==undefined?e.rMm/1000:e.dMm!==undefined?e.dMm/2000:undefined;
    const h=e.hCm===undefined?undefined:e.hCm/100;
    const gamma=e.gamma!==undefined?e.gamma:e.gammaMilli!==undefined?e.gammaMilli/1000:undefined;
    const peso=e.mGramos===undefined?undefined:e.mGramos/1000*g;
    const Lcal=e.LcalCm===undefined?undefined:e.LcalCm/100;
    let valor,regla,cuentas,enunciado,errores=[],intermedios={},datos=[];
    const salida=(izq,v)=>[izq,eqsign(v),Q(k,v,u,3)];
    const longitudDada=e.Lcm!==undefined?q('L',e.Lcm,'cm'):q('L',e.Lmm,'mm');
    const gammaDada=e.gamma!==undefined?q('gamma',e.gamma,'N/m'):q('gamma',e.gammaMilli,'mN/m');
    const convertirL=e.Lmm!==undefined?'1 mm = 0,001 m.':'1 cm = 0,01 m.';
    const film=['Superficie plana; alambre quieto y guías sin rozamiento.','El peso del alambre se desprecia.'];
    const cap=['Tubo circular vertical; líquido homogéneo y depósito grande.',['El líquido moja por completo la pared: ',S.theta,' = ',q('theta',0,'°'),'. Se desprecia el volumen del menisco.'],['Para este modelo, ',S.g,' = ',q('g',10,'m/s²'),'.']];
    const soporte=['Película debajo del alambre; sostén hacia arriba. El alambre está quieto.','Guías sin rozamiento; peso de la película despreciable.',['Para este modelo, ',S.g,' = ',q('g',10,'m/s²'),'.']];
    switch(tipo){
    case 'fuerza':{
      valor=e.n*gamma*L*1000;datos=[...film,convertirL,'1 mN = 0,001 N.'];if(e.gammaMilli!==undefined)datos.push('1 mN/m = 0,001 N/m.');
      enunciado=['Un borde recto de ',longitudDada,' recibe el tirón de ',q('n',e.n),e.n===1?' superficie activa':' caras de una película',', con ',S.gamma,' = ',gammaDada,'. ¿Qué fuerza superficial recibe?'];
      regla=paso('Sumamos el tirón de las superficies que actúan sobre el borde.',formulaF);
      cuentas=[paso('Usamos metros y convertimos la fuerza a milinewtons.',salida([S.F,' = ',q('n',e.n),' · ',q('gamma',gamma),' · ',q('L',L),' · 1000'],valor))];
      errores=[er(e.n===2?'UNA_CARA':'MEDIA_LONGITUD',valor/2,e.n===2?'contaste una cara de la película':'tomaste media longitud de contacto','divide el tirón entre dos'),er('DOBLE_CARAS',valor*2,'contaste el doble de superficies activas','duplica las caras'),er('LONGITUD_DECIMA',valor/10,'convertiste la longitud a la décima parte','reduce diez veces la longitud')];break;
    }
    case 'coeficiente':{
      valor=e.FmN/1000/(e.n*L);datos=[...film,convertirL,'1 mN = 0,001 N.'];
      enunciado=['Una película de ',q('n',e.n),' caras tira con ',q('F',e.FmN,'mN'),' de un alambre de ',longitudDada,'. ¿Cuál es su tensión superficial ',S.gamma,'?'];
      regla=paso('Aislamos el coeficiente, conservando el número de caras.',[...formulaF,sep,S.gamma,' = ',frac(S.F,[S.n,' · ',S.L])]);
      cuentas=[paso('La longitud de cada cara se expresa en metros.',salida([S.gamma,' = ',frac(q('F',e.FmN/1000),[q('n',e.n),' · ',q('L',L)])],valor))];
      errores=[er('SIN_CARAS',valor*e.n,'omitiste dividir entre las dos caras','omite el número de caras'),er('CUATRO_CARAS',valor/2,'contaste cuatro caras en vez de dos','cuenta cuatro caras'),er('LONGITUD_DECUPLA',valor/10,'convertiste la longitud a diez veces su valor','aumenta diez veces la longitud')];break;
    }
    case 'longitud':{
      valor=e.FmN/1000/(e.n*gamma)*100;datos=[...film,'1 mN = 0,001 N.','1 m = 100 cm.'];
      enunciado=['Una película de ',q('n',e.n),' caras tiene ',S.gamma,' = ',gammaDada,' y tira con ',q('F',e.FmN,'mN'),'. ¿Cuánto mide el alambre de contacto, en centímetros?'];
      regla=paso('Despejamos la longitud común a ambas caras.',[...formulaF,sep,S.L,' = ',frac(S.F,[S.n,' · ',S.gamma])]);
      cuentas=[paso('Calculamos en metros y convertimos a centímetros.',salida([S.L,' = ',frac([q('F',e.FmN/1000),' · 100'],[q('n',e.n),' · ',q('gamma',gamma)])],valor))];
      errores=[er('SIN_CARAS',valor*e.n,'contaste una cara en lugar de dos','cuenta una cara'),er('CUATRO_CARAS',valor/2,'contaste cuatro caras en lugar de dos','cuenta cuatro caras'),er('METROS_POR_DIEZ',valor/10,'multiplicaste metros por diez en vez de cien','convierte metros con factor diez')];break;
    }
    case 'sosten':{
      const F=e.n*gamma*L;valor=(F+peso)*1000;intermedios={F,peso};datos=[...soporte,convertirL,'1 g = 0,001 kg; 1 mN = 0,001 N.'];
      enunciado=['Un alambre de ',longitudDada,' y ',q('m',e.mGramos,'g'),' sostiene debajo una película de ',q('n',e.n),' caras con ',S.gamma,' = ',gammaDada,'. ¿Qué fuerza hacia arriba lo mantiene quieto?'];
      regla=paso('El sostén equilibra el tirón superficial y el peso.',[S.T,' = ',S.F,' + ',S.m,' · ',S.g,' = ',S.n,' · ',S.gamma,' · ',S.L,' + ',S.m,' · ',S.g]);
      cuentas=[paso('Sumamos en newtons y convertimos a milinewtons.',salida([S.T,' = (',q('n',e.n),' · ',q('gamma',gamma),' · ',q('L',L),' + ',q('m',e.mGramos/1000),' · ',q('g',g),') · 1000'],valor))];
      errores=[er('SIN_PESO',F*1000,'omitiste el peso del alambre','omite el peso'),er('RESTA_PESO',(F-peso)*1000,'restaste el peso aunque también apunta abajo','resta el peso'),er('DOBLE_TIRON',(2*F+peso)*1000,'duplicaste el tirón de la película','duplica el tirón superficial')];break;
    }
    case 'coeficiente-peso':{
      const F=e.TmN/1000-peso;valor=F/(e.n*L);intermedios={F,peso};datos=[...soporte,convertirL,'1 g = 0,001 kg; 1 mN = 0,001 N.'];
      enunciado=['El sostén de un alambre superior marca ',q('T',e.TmN,'mN'),'. El alambre tiene ',q('m',e.mGramos,'g'),' y ',longitudDada,'; la película tiene ',q('n',e.n),' caras. ¿Cuál es ',S.gamma,'?'];
      regla=paso('Descontamos el peso antes de calcular el coeficiente.',[S.T,' = ',S.n,' · ',S.gamma,' · ',S.L,' + ',S.m,' · ',S.g,sep,S.gamma,' = ',frac([S.T,' − ',S.m,' · ',S.g],[S.n,' · ',S.L])]);
      cuentas=[paso('El numerador es solo el tirón de la película.',salida([S.gamma,' = ',frac([q('T',e.TmN/1000),' − ',q('m',e.mGramos/1000),' · ',q('g',g)],[q('n',e.n),' · ',q('L',L)])],valor))];
      errores=[er('SIN_DESCONTAR',e.TmN/1000/(e.n*L),'atribuiste toda la lectura a la película','no descuenta el peso'),er('SUMA_PESO',(e.TmN/1000+peso)/(e.n*L),'sumaste el peso en vez de descontarlo','suma el peso'),er('UNA_CARA',F/L,'contaste una sola cara','cuenta una cara')];break;
    }
    case 'capilar-altura':{
      valor=2*gamma/(e.rho*g*r)*100;intermedios={r};datos=[...cap,'1 mm = 0,001 m; 1 m = 100 cm.'];
      enunciado=['Un líquido de ',q('rho',e.rho,'kg/m³'),' y ',S.gamma,' = ',gammaDada,' entra en un capilar de ',e.rMm!==undefined?'radio ':'diámetro ',e.rMm!==undefined?q('r',e.rMm,'mm'):q('d',e.dMm,'mm'),'. ¿Cuánto asciende, en centímetros?'];
      regla=paso('El tirón de la circunferencia sostiene el peso de la columna.',[...formulaCap,sep,S.h,' = ',frac(['2 · ',S.gamma],[S.rho,' · ',S.g,' · ',S.r])]);
      cuentas=[paso(e.dMm!==undefined?'El radio es la mitad del diámetro dado.':'Convertimos el radio a metros.',[S.r,' = ',e.dMm!==undefined?frac(q('d',e.dMm,'mm'),'2'):q('r',e.rMm,'mm'),' = ',q('r',r,'m')]),
        paso('Sustituimos y convertimos el ascenso a centímetros.',salida([S.h,' = ',frac(['2 · ',q('gamma',gamma),' · 100'],[q('rho',e.rho),' · ',q('g',g),' · ',q('r',r)])],valor))];
      errores=[er('SIN_DOS',valor/2,'omitiste el factor dos de la circunferencia','omite el factor dos'),er('MITAD_RADIO',valor*2,'usaste la mitad del radio correcto','reduce el radio a la mitad'),er('RADIO_DECUPLO',valor/10,'usaste un radio diez veces mayor','aumenta diez veces el radio')];break;
    }
    case 'calibracion-sosten':{
      const ga=e.FcalmN/1000/(e.nCal*Lcal),F=e.n*ga*L;valor=(F+peso)*1000;intermedios={gamma:ga,F,peso};datos=[...soporte,'Ambas películas contienen el mismo líquido a igual temperatura.','En la medición inicial se desprecia el peso del alambre.','1 cm = 0,01 m; 1 g = 0,001 kg; 1 mN = 0,001 N.'];
      enunciado=['Una película de ',q('n',e.nCal),' caras tira con ',q('F',e.FcalmN,'mN'),' sobre ',q('L',e.LcalCm,'cm'),'. Otra tiene ',q('n',e.n),' caras, ',longitudDada,' y alambre de ',q('m',e.mGramos,'g'),'. ¿Qué sostén necesita la segunda?'];
      regla=paso('La primera medición determina el coeficiente del líquido.',[fc,' = ',nc,' · ',S.gamma,' · ',lc,sep,S.gamma,' = ',frac(fc,[nc,' · ',lc]),sep,S.gamma,' = ',frac(q('F',e.FcalmN/1000),[q('n',e.nCal),' · ',q('L',Lcal)]),' = ',q('gamma',ga,'N/m')]);
      cuentas=[paso('La segunda película y el peso tiran hacia abajo.',[S.T,' = ',S.n,' · ',S.gamma,' · ',S.L,' + ',S.m,' · ',S.g]),
        paso('Sustituimos los datos de la segunda película.',salida([S.T,' = (',q('n',e.n),' · ',q('gamma',ga),' · ',q('L',L),' + ',q('m',e.mGramos/1000),' · ',q('g',g),') · 1000'],valor))];
      errores=[er('SIN_CARAS_CAL',(2*F+peso)*1000,'omitiste las caras al calibrar el coeficiente','omite caras al calibrar'),er('SIN_PESO',F*1000,'omitiste el peso del segundo alambre','omite el peso'),er('DOBLE_PESO',(F+2*peso)*1000,'contaste dos veces el peso del alambre','duplica el peso')];break;
    }
    case 'calibracion-capilar':{
      const ga=e.FcalmN/1000/(e.nCal*Lcal);valor=2*ga/(e.rho*g*r)*100;intermedios={gamma:ga,r};datos=[...cap,'La película y el capilar contienen el mismo líquido a igual temperatura.','El peso del alambre de calibración se desprecia.','1 cm = 0,01 m; 1 mm = 0,001 m; 1 mN = 0,001 N.'];
      enunciado=['Una película de ',q('n',e.nCal),' caras tira con ',q('F',e.FcalmN,'mN'),' sobre ',q('L',e.LcalCm,'cm'),'. Ese líquido tiene ',q('rho',e.rho,'kg/m³'),'. ¿Cuánto asciende en un capilar de radio ',q('r',e.rMm,'mm'),'?'];
      regla=paso('Despejamos el coeficiente a partir de la película.',[fc,' = ',nc,' · ',S.gamma,' · ',lc,sep,S.gamma,' = ',frac(fc,[nc,' · ',lc]),sep,S.gamma,' = ',frac(q('F',e.FcalmN/1000),[q('n',e.nCal),' · ',q('L',Lcal)]),' = ',q('gamma',ga,'N/m')]);
      cuentas=[paso('El balance capilar permite aislar el ascenso.',[...formulaCap,sep,S.h,' = ',frac(['2 · ',S.gamma],[S.rho,' · ',S.g,' · ',S.r])]),
        paso('Sustituimos el radio en metros y entregamos centímetros.',salida([S.h,' = ',frac(['2 · ',q('gamma',ga),' · 100'],[q('rho',e.rho),' · ',q('g',g),' · ',q('r',r)])],valor))];
      errores=[er('SIN_CARAS_CAL',2*valor,'omitiste las caras al calibrar el coeficiente','omite caras al calibrar'),er('SIN_DOS',valor/2,'omitiste el factor dos del balance capilar','omite el factor dos'),er('LONGITUD_CAL_DECUPLA',valor/10,'usaste diez veces la longitud de calibración','aumenta diez veces la longitud')];break;
    }
    case 'capilar-diametro':{
      valor=4*gamma/(e.rho*g*h)*1000;intermedios={r:valor/2000};datos=[...cap,'1 cm = 0,01 m; 1 m = 1000 mm.'];
      enunciado=['Un líquido de ',q('rho',e.rho,'kg/m³'),' y ',S.gamma,' = ',gammaDada,' asciende ',q('h',e.hCm,'cm'),' en un capilar. ¿Cuál es el diámetro interior, en milímetros?'];
      regla=paso('Aislamos el radio en el balance de la columna.',[...formulaCap,sep,S.r,' = ',frac(['2 · ',S.gamma],[S.rho,' · ',S.g,' · ',S.h])]);
      cuentas=[paso('El diámetro contiene dos radios.',[S.d,' = 2 · ',S.r,' = ',frac(['4 · ',S.gamma],[S.rho,' · ',S.g,' · ',S.h])]),
        paso('Convertimos la altura a metros y el diámetro a milímetros.',salida([S.d,' = ',frac(['4 · ',q('gamma',gamma),' · 1000'],[q('rho',e.rho),' · ',q('g',g),' · ',q('h',h)])],valor))];
      errores=[er('DA_RADIO',valor/2,'entregaste el radio en vez del diámetro','da el radio'),er('DUPLICA_DIAMETRO',valor*2,'duplicaste nuevamente el diámetro calculado','duplica el diámetro'),er('ALTURA_DECIMA',valor*10,'convertiste la altura a la décima parte','reduce diez veces la altura')];break;
    }
    case 'capilar-pelicula':{
      const ga=e.rho*g*r*h/2;valor=e.n*ga*L*1000;intermedios={gamma:ga,r,h};datos=[...cap,'La película usa el mismo líquido a igual temperatura.','El alambre de la película tiene peso despreciable.','1 cm = 0,01 m; 1 mm = 0,001 m; 1 mN = 0,001 N.'];
      enunciado=['Un líquido de ',q('rho',e.rho,'kg/m³'),' asciende ',q('h',e.hCm,'cm'),' en un capilar de radio ',q('r',e.rMm,'mm'),'. ¿Qué tirón produce su película de ',q('n',e.n),' caras sobre un alambre de ',longitudDada,'?'];
      regla=paso('El ascenso permite despejar el coeficiente del líquido.',[...formulaCap,sep,S.gamma,' = ',frac([S.rho,' · ',S.g,' · ',S.r,' · ',S.h],'2'),sep,S.gamma,' = ',frac([q('rho',e.rho),' · ',q('g',g),' · ',q('r',r),' · ',q('h',h)],'2'),' = ',q('gamma',ga,'N/m')]);
      cuentas=[paso('Aplicamos ese coeficiente a las caras de la película.',formulaF),paso('Calculamos el tirón en milinewtons.',salida([S.F,' = ',q('n',e.n),' · ',q('gamma',ga),' · ',q('L',L),' · 1000'],valor))];
      errores=[er('SIN_MITAD_CAL',2*valor,'omitiste dividir entre dos al hallar el coeficiente','omite la división entre dos'),er('UNA_CARA',valor/2,'contaste una sola cara de la película','cuenta una cara'),er('ALTURA_DECIMA',valor/10,'convertiste el ascenso a la décima parte','reduce diez veces el ascenso')];break;
    }
    case 'sosten-capilar-diametro':{
      const ga=(e.TmN/1000-peso)/(e.n*L);valor=4*ga/(e.rho*g*h)*1000;intermedios={gamma:ga,peso,r:valor/2000};datos=[['Tubo circular vertical, depósito grande y líquido homogéneo; contacto completo: ',S.theta,' = ',q('theta',0,'°'),'.'],'Se desprecia el volumen del menisco.','Película debajo del alambre; sostén hacia arriba. Equilibrio sin rozamiento; peso de la película despreciable.',['Mismo líquido y temperatura en ambos montajes; ',S.g,' = ',q('g',10,'m/s²'),'.'],'1 cm = 0,01 m; 1 g = 0,001 kg; 1 mN = 0,001 N.','1 m = 1000 mm.'];
      enunciado=['Un alambre superior de ',q('m',e.mGramos,'g'),' y ',longitudDada,' recibe ',q('T',e.TmN,'mN'),' de sostén; la película tiene ',q('n',e.n),' caras. Su líquido, de ',q('rho',e.rho,'kg/m³'),', asciende ',q('h',e.hCm,'cm'),'. ¿Qué diámetro tiene el capilar?'];
      regla=paso('Restamos el peso para inferir el coeficiente.',[S.T,' = ',S.n,' · ',S.gamma,' · ',S.L,' + ',S.m,' · ',S.g,sep,S.gamma,' = ',frac([S.T,' − ',S.m,' · ',S.g],[S.n,' · ',S.L]),sep,S.gamma,' = ',frac([q('T',e.TmN/1000),' − ',q('m',e.mGramos/1000),' · ',q('g',g)],[q('n',e.n),' · ',q('L',L)]),' = ',q('gamma',ga,'N/m')]);
      cuentas=[paso('Despejamos radio y luego diámetro del balance capilar.',[S.r,' = ',frac(['2 · ',S.gamma],[S.rho,' · ',S.g,' · ',S.h]),sep,S.d,' = 2 · ',S.r]),
        paso('Sustituimos el coeficiente y expresamos el diámetro en milímetros.',salida([S.d,' = ',frac(['4 · ',q('gamma',ga),' · 1000'],[q('rho',e.rho),' · ',q('g',g),' · ',q('h',h)])],valor))];
      const factor=4/(e.rho*g*h)*1000;
      errores=[er('SIN_DESCONTAR',e.TmN/1000/(e.n*L)*factor,'atribuiste toda la lectura a la película','no descuenta el peso'),er('SUMA_PESO',(e.TmN/1000+peso)/(e.n*L)*factor,'sumaste el peso al inferir el coeficiente','suma el peso'),er('DA_RADIO',valor/2,'entregaste el radio en lugar del diámetro','da el radio')];break;
    }
    default:throw Error('Caso de superficie desconocido: '+tipo);
    }
    const erroresPublicos=errores.map(x=>({valor:x.valor,error:'FL12-S-'+x.operacion,siFuera:'Usaste los datos; '+x.motivo+'. Resulta '+mostrar(x.valor,u)+'.'}));
    const ops=conOpciones?opciones(valor,erroresPublicos,v=>mostrar(v,u)):[];
    const esCap=tipo.includes('capilar');
    const datosDados={gamma:[S.gamma,'gamma','N/m'],gammaMilli:[S.gamma,'gamma','mN/m'],Lcm:[S.L,'L','cm'],Lmm:[S.L,'L','mm'],n:[S.n,'n',''],FmN:[S.F,'F','mN'],TmN:[S.T,'T','mN'],mGramos:[S.m,'m','g'],rMm:[S.r,'r','mm'],dMm:[S.d,'d','mm'],hCm:[S.h,'h','cm'],rho:[S.rho,'rho','kg/m³'],g:[S.g,'g','m/s²'],FcalmN:[fc,'F','mN'],LcalCm:[lc,'L','cm'],nCal:[nc,'n','']};
    const tengo=Object.entries(e).flatMap(([clave,valor],i)=>{const [simbolo,color,unidad]=datosDados[clave];return [...(i?['; ']:[]),simbolo,' = ',q(color,valor,unidad)];});
    return {enunciado,datos,dibujo:esCap?capilar(e):pelicula(e),pide:['Busco ',V(k,{F:'el tirón superficial',T:'la fuerza de sostén',gamma:'la tensión superficial',L:'la longitud de contacto',h:'el ascenso',d:'el diámetro interior'}[k]),'.'],
      tengo,regla,cuentas,sentido:['El resultado es ',V(k,mostrar(valor,u)),'. Corresponde a ',esCap&&tipo!=='capilar-pelicula'?'un capilar circular que el líquido moja por completo.':'las superficies y fuerzas indicadas.'],
      respuesta:[V(k,mostrar(valor,u))],opciones:ops,caso:{tipo,...e,g,valor,unidad:u,intermedios,errores:errores.map(({operacion,valor})=>({operacion,valor}))},
      erroresEjemplo:errores.map(x=>mostrar(x.valor,u)+': '+x.corto).join('; ')+'.'};
  }
  const muestras=[
    ['fuerza',{gamma:.04,Lcm:5,n:1},'Una superficie activa'],['fuerza',{gamma:.025,Lcm:8,n:2},'Las dos caras de una película'],
    ['coeficiente',{FmN:9,Lcm:15,n:2},'Medir el coeficiente'],['longitud',{FmN:10,gamma:.025,n:2},'Encontrar la longitud'],
    ['fuerza',{gammaMilli:30,Lcm:10,n:1},'Un coeficiente en milinewtons por metro'],['fuerza',{gamma:.02,Lmm:120,n:2},'El alambre medido en milímetros'],
    ['sosten',{gamma:.03,Lcm:10,n:2,mGramos:.2,g:10},'El alambre también pesa'],['coeficiente-peso',{TmN:10,Lcm:10,n:2,mGramos:.4,g:10},'Descontar el peso de la lectura'],
    ['capilar-altura',{gamma:.05,rMm:.5,rho:1000,g:10},'Ascenso en un tubo fino'],['capilar-altura',{gamma:.04,dMm:.8,rho:1000,g:10},'Del diámetro al radio'],
    ['calibracion-sosten',{FcalmN:4,LcalCm:10,nCal:2,Lcm:15,n:2,mGramos:.3,g:10},'Cambiar de alambre'],
    ['calibracion-capilar',{FcalmN:6,LcalCm:10,nCal:2,rMm:.3,rho:1000,g:10},'De la película al capilar'],
    ['capilar-diametro',{gamma:.06,hCm:3,rho:800,g:10},'El ascenso revela el diámetro'],
    ['capilar-pelicula',{hCm:2,rMm:.4,rho:1000,g:10,Lcm:15,n:2},'Del capilar a la película'],
    ['sosten-capilar-diametro',{TmN:14,Lcm:10,n:2,mGramos:.2,g:10,hCm:3,rho:1000},'La lectura conduce al diámetro']
  ];
  const firma=(tipo,e)=>tipo+'|'+JSON.stringify(Object.fromEntries(Object.entries(e).filter(([k])=>k!=='g').sort(([a],[b])=>a.localeCompare(b))));
  const reservadas=new Set(muestras.map(([t,e])=>firma(t,e)));
  function generar(semilla,practica){
    const rnd=azar(semilla+(practica?21379:8273));
    const tipos=practica?['calibracion-sosten','calibracion-capilar','capilar-diametro','capilar-pelicula','sosten-capilar-diametro']:['coeficiente','longitud','sosten','coeficiente-peso','capilar-altura'];
    const tipo=tipos[semilla%5];
    for(let intento=0;intento<120;intento++){
      const ga=rnd.de(practica?[.028,.042,.056]:[.024,.036,.048]),Lcm=rnd.de([10,12,14,16,18]),mGramos=rnd.de([.1,.2]),rho=rnd.de([800,1000,1200]),rMm=rnd.de([.3,.4,.5,.6]),hCm=rnd.de([2.5,3,4]),LcalCm=rnd.de([8,10,12,15]);
      let e;
      if(tipo==='coeficiente')e={FmN:2*ga*Lcm/100*1000,Lcm,n:2};
      if(tipo==='longitud')e={FmN:2*ga*Lcm/100*1000,gamma:ga,n:2};
      if(tipo==='sosten')e={gamma:ga,Lcm,n:2,mGramos,g:10};
      if(tipo==='coeficiente-peso')e={TmN:2*ga*Lcm/100*1000+mGramos*10,Lcm,n:2,mGramos,g:10};
      if(tipo==='capilar-altura')e={gamma:ga,...(semilla%2?{rMm}:{dMm:2*rMm}),rho,g:10};
      if(tipo==='calibracion-sosten')e={FcalmN:2*ga*LcalCm/100*1000,LcalCm,nCal:2,Lcm,n:2,mGramos,g:10};
      if(tipo==='calibracion-capilar')e={FcalmN:2*ga*LcalCm/100*1000,LcalCm,nCal:2,rMm,rho,g:10};
      if(tipo==='capilar-diametro')e={gamma:ga,hCm,rho,g:10};
      if(tipo==='capilar-pelicula'){const hh=2*ga/(rho*10*rMm/1000)*100;if(Math.abs(hh-Number(hh.toFixed(6)))>1e-10)continue;e={hCm:hh,rMm,rho,g:10,Lcm,n:2};}
      if(tipo==='sosten-capilar-diametro')e={TmN:2*ga*Lcm/100*1000+mGramos*10,Lcm,n:2,mGramos,g:10,hCm,rho};
      e=Object.fromEntries(Object.entries(e).map(([k,v])=>[k,Number(v.toFixed(6))]));
      if(reservadas.has(firma(tipo,e)))continue;
      const c=caso(tipo,e,practica),v=c.caso.valor;
      if(c.caso.errores.some(er=>er.valor<=0||Math.max(v,er.valor)/Math.min(v,er.valor)>20+1e-10))continue;
      if(practica&&new Set(c.opciones.map(o=>o.texto)).size!==4)continue;
      // La columna es larga frente al radio para omitir el volumen del menisco.
      if(tipo.includes('capilar')){const gaReal=c.caso.intermedios.gamma??e.gamma,rReal=c.caso.intermedios.r??e.rMm/1000,hh=e.hCm!==undefined?e.hCm/100:(2*gaReal/(rho*10*rReal));if(hh/rReal<40-1e-9)continue;}
      return practica?pregunta(c):resuelto(c);
    }
    throw Error('No se obtuvo un caso de superficie válido.');
  }
  glosario.push(
    {termino:'tensión superficial',simbolo:'γ',medida:'N/m',formas:['tensión superficial'],simple:'Propiedad de una superficie líquida que tiende a reducir su área.',def:'Coeficiente que relaciona el tirón de una superficie con su longitud de contacto.',ejemplos:['Una película líquida tira del alambre que la limita.','El coeficiente depende del líquido y de su temperatura.','La tensión superficial se mide en newtons por metro.']},
    {termino:'línea de contacto',simbolo:'L',medida:'m',formas:['línea de contacto','longitud de contacto'],simple:'Borde donde una superficie líquida toca otro material.',def:'Línea sobre la que actúa el tirón de una superficie líquida.',ejemplos:['Un borde recto del alambre tiene una longitud de contacto.','La pared de un tubo circular tiene un contacto alrededor de su contorno.','La longitud de contacto se distingue del área de la película.']},
    {termino:'capilaridad',formas:['capilaridad','capilar'],simple:'Ascenso o descenso de un líquido en un tubo fino por efectos de superficie.',def:'Cambio de nivel asociado a la tensión superficial y al contacto del líquido con la pared.',ejemplos:['El nivel en un tubo fino puede diferir del nivel del depósito.','La forma del contacto depende del líquido y de la pared.','En un tubo circular, radio y diámetro son medidas diferentes.']}
  );
  const pred={gamma:.03,Lcm:12,n:2},Fp=pred.n*pred.gamma*pred.Lcm/100;
  const filmMira=pelicula(pred,Fp).datos,capMira=capilar({}).datos,datosMira={...filmMira,cortes:[filmMira,capMira]};
  return {
    id: 'tension-superficial',titulo:'La superficie también tira',pregunta:'¿Cuánta fuerza puede ejercer una superficie líquida?',
    temas:['Tensión superficial'],pieza:'fis-estatica',aprendizaje:'Distingo fuerza y tensión superficial; cuento las caras de una película y explico el ascenso capilar mediante un balance de fuerzas.',actividad:'Cambiar el coeficiente de una película y observar la fuerza que mantiene quieto su alambre.',
    lee:{tarjetas:[
      {titulo:'Un alambre sobre una película',texto:'Una película líquida ocupa un marco y toca un alambre móvil. La película está debajo del alambre. Un sostén hacia arriba lo mantiene quieto.',dibujo:pelicula({Lcm:6,n:2,gamma:.02})},
      {titulo:'Dos magnitudes distintas',texto:['La fuerza de sostén se mide en newtons. El coeficiente ',S.gamma,' caracteriza la superficie y se mide en newtons por metro. La letra griega γ no es la gravedad ',S.g,'.']},
      {titulo:'Un modelo para comparar',texto:'El alambre del juego tiene peso despreciable y las guías no rozan. Los valores del coeficiente son datos del modelo, sin atribuirlos a una sustancia particular.'}
    ]},
    juega:{pieza:'fis-estatica',consigna:'Cambia el coeficiente de la película y observa el sostén necesario para mantener quieto el alambre.',voz:'El alambre y el número de caras permanecen iguales.',
      controles:[{id:'gamma',etiqueta:'Tensión superficial, γ',color:'c-f',opciones:[.02,.03,.04,.05].map(x=>({valor:x,texto:n(x)+' N/m'})),inicio:.02}],
      mision:{texto:'Consigue una fuerza de sostén de 4,8 mN.',logrado:v=>Math.abs(2*v.gamma*.06*1000-4.8)<1e-9,bien:'El alambre queda sostenido con la fuerza pedida.',pista:'Compara la lectura después de elegir otro coeficiente.'},
      leyenda:[{s:S.L,t:'longitud fija del alambre: 6 cm'},{s:S.n,t:'dos caras activas de la película'},{s:S.gamma,t:'coeficiente de la superficie, en N/m'},{s:S.T,t:'sostén hacia arriba, en milinewtons'}],
      dibujo:v=>pelicula({Lcm:6,n:2,gamma:v.gamma},2*v.gamma*.06),lectura:v=>['El sostén marca ',q('T',2*v.gamma*.06*1000,'mN'),'.'],resumen:{gamma:.03},minimo:2},
    predice:{pregunta:['Otra película tiene ',q('n',2),' caras, ',S.gamma,' = ',q('gamma',.03,'N/m'),' y un alambre de ',q('L',12,'cm'),'. ¿Qué fuerza de sostén lo mantiene quieto?'],
      datos:['El peso del alambre es despreciable.','La película está debajo del alambre; las guías no rozan.','1 cm = 0,01 m; 1 mN = 0,001 N.'],
      opciones:opciones(Fp*1000,[{valor:pred.gamma*.12*1000,error:'FL12-S-UNA_CARA',siFuera:'Usaste la longitud correcta; contaste una cara. Resulta 3,6 mN.'},
        {valor:4*pred.gamma*.12*1000,error:'FL12-S-CUATRO_CARAS',siFuera:'Reconociste varias superficies; contaste cuatro caras. Resulta 14,4 mN.'},
        {valor:2*pred.gamma*.012*1000,error:'FL12-S-CM_MIL',siFuera:'Contaste dos caras; dividiste centímetros entre mil. Resulta 0,72 mN.'}],v=>mostrar(v,'mN')),
      dibujo:pelicula(pred),revelar:pelicula(pred,Fp),coincide:'Coincide: las dos caras tiran del mismo alambre y sus fuerzas se suman.'},
    mira:{pieza:'fis-estatica',datos:datosMira,pasos:[
      {estado:{paso:0},texto:'Cada superficie tira del borde; las dos caras suman sus fuerzas.',ecuacion:formulaF},
      {estado:{paso:1},texto:'Usamos la longitud en metros y contamos las dos caras.',ecuacion:[S.F,' = ',q('n',2),' · ',q('gamma',.03),' · ',q('L',.12),' = ',q('F',Fp,'N'),' = ',q('F',Fp*1000,'mN')]},
      {estado:{paso:2},texto:'Si el alambre pesa, el sostén también equilibra ese peso.',ecuacion:[S.T,' = ',S.F,' + ',S.m,' · ',S.g]},
      {estado:{corte:1},texto:'El ángulo de contacto se mide entre pared y superficie, dentro del líquido.',ecuacion:[S.theta,' = ',q('theta',0,'°')]},
      {estado:{corte:1},texto:'Con contacto completo, una superficie tira hacia arriba por la circunferencia del tubo.',ecuacion:[S.F,' = ',S.gamma,' · 2π · ',S.r]},
      {estado:{corte:1},texto:'El volumen usa el radio, mitad del diámetro. La columna tiene peso.',ecuacion:[S.d,' = 2 · ',S.r,sep,S.V,' = π · ',sup(S.r),' · ',S.h,sep,S.P,' = ',S.rho,' · ',S.V,' · ',S.g]},
      {estado:{corte:1},texto:'En equilibrio, el tirón sostiene la columna; se cancela un radio.',ecuacion:[...formulaCap,sep,S.h,' = ',frac(['2 · ',S.gamma],[S.rho,' · ',S.g,' · ',S.r])]}
    ]},
    regla:{texto:'Una película suma el tirón de sus caras. En un capilar que se moja por completo, el tirón de la circunferencia sostiene la columna elevada.',
      ecuacion:[...formulaF,sep,S.h,' = ',frac(['2 · ',S.gamma],[S.rho,' · ',S.g,' · ',S.r])],
      condicion:'Equilibrio sin rozamiento. Capilar circular vertical: θ = 0, líquido homogéneo, depósito grande y volumen del menisco despreciable.',
      voz:'El menisco es la superficie curva del líquido. El empuje y la tensión superficial pueden actuar juntos.',dibujo:capilar({})},
    ejemplos:muestras.map(([tipo,e,titulo],i)=>ejemplo(caso(tipo,e,i>=10),Math.floor(i/5)+1,titulo,i-10)),
    resuelve:{pieza:'fis-estatica',generar:s=>generar(s,false)},
    ahoraTu:{pieza:'fis-estatica',generar:s=>generar(s,true)}
  };
})();

const idea6 = (() => {
  const s1=k=>sub(S[k],'1'),s2=k=>sub(S[k],'2');
  const q=(k,n,u='',d=3)=>Q(k,n,u,d);
  const mostrar=(n,u)=>`${Math.abs(n-Number(n.toFixed(3)))>1e-8?'≈ ':''}${f(n,3)} ${u}`;
  const resultado=(k,n,u)=>[V(k,mostrar(n,u))];
  const fin=(k,n,u)=>[Math.abs(n-Number(n.toFixed(3)))>1e-8?' ≈ ':' = ',q(k,n,u)];
  const bern=[S.p,' + ',frac([S.rho,' · ',sup(S.v)],'2'),' + ',S.rho,' · ',S.g,' · ',S.z,' = constante'];
  const dp=[s2('p'),' = ',s1('p'),' + ',S.rho,' · (',frac([sup(s1('v')),' − ',sup(s2('v'))],'2'),' + ',S.g,' · (',s1('z'),' − ',s2('z'),'))'];
  const cont=[s1('A'),' · ',s1('v'),' = ',s2('A'),' · ',s2('v')];
  const dato=(sim,k,n,u)=>[sim,' = ',q(k,n,u)];
  const flujoIdeal='Líquido incompresible; flujo estacionario, sin bombas ni pérdidas por rozamiento, sobre una misma línea de corriente.';
  const depositoIdeal='Depósito grande y abierto; salida al aire. Rapidez superficial despreciable, sin pérdidas ni contracción del chorro; estado instantáneo.';
  function tubo(e,oculta=false,conFlechas=false){
    let a1=e.area1||e.area,a2=e.area2||e.area;
    if(e.d1){a1=Math.PI*e.d1**2/4;a2=Math.PI*e.d2**2/4;}
    const medido=!!(a1&&a2)&&!oculta;
    const secciones=medido?[{id:'entrada',area:a1/10000,z:e.z1||0},{id:'salida',area:a2/10000,z:e.z2||0}]:[{id:'entrada'},{id:'salida'}];
    const rotulos=[{ref:'entrada',texto:'Entrada'},{ref:'salida',texto:'Salida'}];
    if(e.area1||e.area)rotulos.push({ref:'entrada',fila:1,texto:`Área: ${f(e.area1||e.area)} cm²`,color:'d'});
    if(e.area2)rotulos.push({ref:'salida',fila:1,texto:`Área: ${f(e.area2)} cm²`,color:'d'});
    if(e.d1){rotulos.push({ref:'entrada',fila:1,texto:`Diámetro: ${f(e.d1)} cm`,color:'d'},{ref:'salida',fila:1,texto:`Diámetro: ${f(e.d2)} cm`,color:'d'});}
    if(e.v1!=null)rotulos.push({ref:'entrada',fila:2,texto:`Rapidez: ${f(e.v1)} m/s`,color:'o'});
    if(e.v2!=null)rotulos.push({ref:'salida',fila:2,texto:`Rapidez: ${f(e.v2)} m/s`,color:'o'});
    const flechas=conFlechas?['entrada','salida'].flatMap((ref,i)=>e[i?'v2':'v1']==null?[]:[{ref,clase:'rapidez',magnitud:e[i?'v2':'v1'],anclaje:'centro'}]):[];
    return flu({tipo:'flujo',modo:medido?'medida':'esquema',escala:{transversal:1800,vertical:60,rapidez:32},
      flujo:{forma:e.d1?'circular':'prismatico',profundidad:.025,secciones},rotulos,flechas,
      alt:medido?'Dos secciones del conducto. Las secciones comparten escala; las alturas usan otra escala indicada.':'Esquema del conducto sin escala; no representa un área o una rapidez desconocidas.'});
  }
  function deposito(e){
    const conocido=e.h!=null;
    return flu({tipo:'vasos',modo:conocido?'medida':'esquema',escala:{vertical:40,transversal:400},
      vasos:[{id:'deposito',...(conocido?{alto:e.h+.4,ancho:.25,nivel:e.h+.2}:{}),salida:{id:'salida',...(conocido?{altura:.2}:{}),lado:'der'}}],
      cotas:[{de:'superficie-deposito',a:'salida',lado:'izq',texto:conocido?`h = ${f(e.h)} m`:'h = ?',color:'d'}],
      rotulos:[{ref:'deposito',texto:'Superficie y salida al aire',color:'i'},{ref:'deposito',fila:1,texto:'Estado en un instante'},{ref:'deposito',fila:2,texto:'Anchos y alturas: escalas distintas'}],
      alt:'Depósito abierto con salida lateral. La profundidad se mide verticalmente desde la superficie hasta la salida.'});
  }
  function alturas(e){
    const y1=218-e.z1*70,y2=218-e.z2*70;
    return est({alto:338,lineas:[{de:[26,218],a:[294,218],discontinua:true},
      {de:[65,y1],a:[75,y1]},{de:[70,y1-5],a:[70,y1+5]},
      {de:[245,y2],a:[255,y2]},{de:[250,y2-5],a:[250,y2+5]}],
      cotas:e.z1===e.z2?[]:[{de:[160,y1],a:[160,y2],sep:0,texto:`Desnivel: ${f(Math.abs(e.z1-e.z2))} m`,color:'d'}],
      textos:[{x:160,y:28,texto:'Dos puntos del mismo flujo',ancla:'middle'},
        {x:70,y:78,texto:'Entrada',ancla:'middle'},{x:250,y:78,texto:'Salida',ancla:'middle'},
        {x:70,y:102,texto:`z = ${f(e.z1)} m`,color:'d',ancla:'middle'},{x:250,y:102,texto:`z = ${f(e.z2)} m`,color:'d',ancla:'middle'},
        {x:70,y:264,texto:`v = ${f(e.v1)} m/s`,color:'o',ancla:'middle'},{x:250,y:264,texto:`v = ${f(e.v2)} m/s`,color:'o',ancla:'middle'},
        {x:160,y:292,texto:'Alturas con la misma escala',ancla:'middle'},{x:160,y:316,texto:'Separación horizontal esquemática',ancla:'middle'}],
      alt:'Dos puntos del flujo con sus alturas a una escala vertical común; no se representa el área desconocida del conducto.'});
  }
  function caso(tipo,e){
    const d={...e},g=e.g||10;let valor,u,k,enunciado,regla,cuentas,errores=[],intermedios={};
    const datos=[],valores=[];
    const campo={litros:[S.V,'V','L'],tiempo:[S.t,'t','s'],area:[S.A,'A','cm²'],rapidez:[S.v,'v','m/s'],caudal:[S.Q,'Q','L/s'],area1:[s1('A'),'A','cm²'],area2:[s2('A'),'A','cm²'],v1:[s1('v'),'v','m/s'],v2:[s2('v'),'v','m/s'],d1:[s1('d'),'d','cm'],d2:[s2('d'),'d','cm'],p1:[s1('p'),'p','kPa'],p2:[s2('p'),'p','kPa'],rho:[S.rho,'rho','kg/m³'],z1:[s1('z'),'z','m'],z2:[s2('z'),'z','m'],h:[S.h,'h','m'],g:[S.g,'g','m/s²']};
    for(const [c,n]of Object.entries(e)){if(campo[c]){const [s,b,u]=campo[c];valores.push(dato(s,b,n,u));}}
    const esDeposito=['torricelli-rapidez','altura-desde-caudal','deposito-caudal'].includes(tipo);
    const presion=tipo.includes('presion');
    if(presion&&!('g'in e)&&!['area-desde-presiones','densidad-desde-presiones'].includes(tipo))valores.push(dato(S.g,'g',g,'m/s²'));
    if(presion)datos.push('Las presiones son absolutas; las alturas parten del mismo nivel de referencia.',flujoIdeal);
    else datos.push(esDeposito?depositoIdeal:'Líquido incompresible; flujo estacionario por un conducto lleno, sin fugas.');
    const usaAreaSI=!!(e.area||e.area1||e.area2)&&!['continuidad-area','area-continuidad','presion-areas','area-desde-presiones','densidad-desde-presiones'].includes(tipo);
    if(usaAreaSI)datos.push(['1 cm² = ',sup('10','−4'),' m².']);
    if(['volumen-paso','rapidez-caudal','tiempo-volumen','altura-desde-caudal','deposito-caudal'].includes(tipo))datos.push(['1 L = ',sup('10','−3'),' m³.']);
    if(presion)datos.push('1 kPa = 1000 Pa.');
    const er=(operacion,n,motivo)=>({operacion,valor:n,motivo});
    const qreg=paso('El caudal mide el volumen que atraviesa una sección por unidad de tiempo.',[S.Q,' = ',frac(S.V,S.t),' = ',S.A,' · ',S.v]);
    const creg=paso('En el mismo tiempo pasa igual volumen por las dos secciones.',cont);
    switch(tipo){
      case 'caudal-tiempo':{
        valor=e.litros/e.tiempo;u='L/s';k='Q';enunciado='Un recipiente recoge el volumen indicado mientras fluye líquido. ¿Cuál es el caudal medio?';regla=qreg;
        cuentas=[paso('Dividimos el volumen recogido entre el tiempo transcurrido.',[S.Q,' = ',frac(q('V',e.litros,'L'),q('t',e.tiempo,'s')),...fin(k,valor,u)])];
        errores=[er('invierte',e.tiempo/e.litros,'invertiste volumen y tiempo'),er('sin-tiempo',e.litros,'omitiste el tiempo'),er('medio-tiempo',2*valor,'usaste la mitad del tiempo')];break;}
      case 'volumen-paso':{
        const a=e.area/10000;valor=a*e.rapidez*e.tiempo*1000;u='L';k='V';intermedios={caudal:a*e.rapidez*1000};
        enunciado='El líquido mantiene la rapidez indicada en una sección. ¿Qué volumen la atraviesa durante ese tiempo?';regla=qreg;
        cuentas=[paso('Despejamos el volumen y expresamos el área en metros cuadrados.',[S.V,' = ',S.A,' · ',S.v,' · ',S.t,'   ·   ',S.A,' = ',q('A',a,'m²',4)]),paso('Sustituimos; el volumen en metros cúbicos se convierte a litros.',[S.V,' = ',q('A',a,'',4),' · ',q('v',e.rapidez),' · ',q('t',e.tiempo),' = ',q('V',valor/1000,'m³'),...fin(k,valor,u)])];
        errores=[er('sin-tiempo',valor/e.tiempo,'omitiste el tiempo'),er('mitad-tiempo',valor/2,'contaste solo medio intervalo'),er('doble-area',valor*2,'duplicaste el área')];break;}
      case 'rapidez-caudal':{
        valor=e.caudal/(e.area*.1);u='m/s';k='v';enunciado='Se conoce el caudal y el área de una sección. ¿Cuál es la rapidez del líquido?';regla=qreg;
        cuentas=[paso('Despejamos la rapidez y convertimos caudal y área a unidades SI.',[S.v,' = ',frac(S.Q,S.A),'   ·   ',S.Q,' = ',q('Q',e.caudal/1000,'m³/s',4),'   ·   ',S.A,' = ',q('A',e.area/10000,'m²',4)]),paso('Dividimos el caudal entre el área.',[S.v,' = ',frac(q('Q',e.caudal/1000,'',4),q('A',e.area/10000,'',4)),...fin(k,valor,u)])];
        errores=[er('litro-centimetro',e.caudal/e.area,'dividiste los números sin convertir sus unidades'),er('doble-area',valor/2,'usaste el doble de área'),er('mitad-area',valor*2,'usaste la mitad del área')];break;}
      case 'continuidad-area':case 'area-continuidad':case 'continuidad-diametro':{
        const porD=tipo==='continuidad-diametro',buscaA=tipo==='area-continuidad';
        valor=porD?e.v1*(e.d1/e.d2)**2:buscaA?e.area1*e.v1/e.v2:e.area1*e.v1/e.area2;
        u=buscaA?'cm²':'m/s';k=buscaA?'A':'v';enunciado=buscaA?'Cambian las rapideces entre las dos secciones. ¿Qué área tiene la salida?':porD?'El conducto circular cambia de diámetro. ¿Qué rapidez tiene el líquido en la salida?':'El conducto cambia de área. ¿Qué rapidez tiene el líquido en la salida?';regla=creg;
        const expresion=buscaA?frac([s1('A'),' · ',s1('v')],s2('v')):porD?[s1('v'),' · ',sup(['(',frac(s1('d'),s2('d')),')'])]:frac([s1('A'),' · ',s1('v')],s2('A'));
        cuentas=[paso(porD?'En una sección circular, el área es proporcional al cuadrado del diámetro.':'Aislamos la magnitud pedida conservando el caudal.',[...(porD?[S.A,' = ',frac(['π · ',sup(S.d)],'4'),'   ·   ']:[]),s2(k),' = ',expresion]),paso('Sustituimos medidas expresadas en las mismas unidades.',[s2(k),' = ',buscaA?frac([q('A',e.area1),' · ',q('v',e.v1)],q('v',e.v2)):porD?[q('v',e.v1),' · ',sup(['(',frac(q('d',e.d1),q('d',e.d2)),')'])]:frac([q('A',e.area1),' · ',q('v',e.v1)],q('A',e.area2)),...fin(k,valor,u)])];
        errores=porD?[er('diametro-lineal',e.v1*e.d1/e.d2,'usaste diámetros en vez de áreas'),er('conserva-rapidez',e.v1,'conservaste la rapidez'),er('razon-inversa',e.v1*(e.d2/e.d1)**2,'invertiste la razón de áreas')]:buscaA?[er('razon-inversa',e.area1*e.v2/e.v1,'invertiste la razón de rapideces'),er('conserva-area',e.area1,'conservaste el área'),er('razon-cuadrada',e.area1*(e.v1/e.v2)**2,'elevaste al cuadrado la razón de rapideces')]:[er('razon-inversa',e.v1*e.area2/e.area1,'hiciste la rapidez proporcional al área'),er('conserva-rapidez',e.v1,'conservaste la rapidez'),er('razon-cuadrada',e.v1*(e.area1/e.area2)**2,'trataste las áreas como diámetros')];break;}
      case 'tiempo-volumen':{
        const caudal=e.area*.1*e.rapidez;valor=e.litros/caudal;u='s';k='t';intermedios={caudal};enunciado='El flujo llena un recipiente sin variar. ¿Cuánto tarda en reunir el volumen indicado?';regla=qreg;
        cuentas=[paso('Despejamos el tiempo y calculamos primero el caudal.',[S.t,' = ',frac(S.V,S.Q),'   ·   ',S.Q,' = ',q('A',e.area/10000,'',4),' · ',q('v',e.rapidez),' = ',q('Q',caudal/1000,'m³/s',4)]),paso('Convertimos el volumen a metros cúbicos y dividimos.',[S.t,' = ',frac(q('V',e.litros/1000),q('Q',caudal/1000,'',4)),...fin(k,valor,u)])];
        errores=[er('doble-caudal',valor/2,'usaste el doble de caudal'),er('sin-rapidez',e.litros/(e.area*.1),'tomaste una rapidez de un metro por segundo'),er('mitad-caudal',valor*2,'usaste la mitad del caudal')];break;}
      case 'presion-horizontal':case 'presion-desnivel':case 'presion-areas':{
        const v2=e.v2??e.v1*e.area1/e.area2,cin=e.rho*(e.v1**2-v2**2)/2000,alt=e.rho*g*(e.z1-e.z2)/1000;
        valor=e.p1+cin+alt;u='kPa';k='p';intermedios={v2,cin,alt};
        enunciado=tipo==='presion-areas'?'El conducto cambia de sección y altura. ¿Qué presión absoluta hay en la salida?':tipo==='presion-desnivel'?'El líquido desciende mientras aumenta su rapidez. ¿Qué presión absoluta hay en la salida?':'El conducto es horizontal. ¿Qué presión absoluta hay en la salida?';
        regla=paso('Bernoulli conserva la suma de los aportes de presión, rapidez y altura.',bern);
        const v2calc=[s2('v'),' = ',frac([s1('A'),' · ',s1('v')],s2('A')),' = ',frac([q('A',e.area1),' · ',q('v',e.v1)],q('A',e.area2)),' = ',q('v',v2,'m/s')];
        cuentas=[paso(e.v2==null?'Obtenemos la rapidez por continuidad y aislamos la presión de salida.':'Aislamos la presión de salida; conservamos el signo de cada diferencia.',[...(e.v2==null?[...v2calc,'   ·   ']:[]),...dp]),paso('Evaluamos los dos aportes en pascales y los sumamos a la presión inicial en kilopascales.',[
          frac([q('rho',e.rho),' · (',sup(q('v',e.v1)),' − ',sup(q('v',v2)),')'],'2'),' = ',q('p',cin*1000,'Pa'),'   ·   ',
          q('rho',e.rho),' · ',q('g',g),' · (',q('z',e.z1),' − ',q('z',e.z2),')',' = ',q('p',alt*1000,'Pa'),'   ·   ',
          s2('p'),' = ',q('p',e.p1),' + (',q('p',cin),') + (',q('p',alt),')',...fin(k,valor,u)])];
        errores=[er('cin-signo',e.p1-cin+alt,'invertiste el cambio asociado a la rapidez'),er('sin-cin',e.p1+alt,'omitiste el cambio de rapidez'),er('altura-signo',e.p1+cin-alt,'invertiste la diferencia de alturas')];
        if(alt===0)errores[2]=er('sin-medio',e.p1+2*cin,'omitiste el factor de un medio');break;}
      case 'area-desde-presiones':{
        const dv=2*(e.p1-e.p2)*1000/e.rho,v2=Math.sqrt(e.v1**2+dv);valor=e.area1*e.v1/v2;u='cm²';k='A';intermedios={v2};
        enunciado='Un conducto horizontal tiene las presiones indicadas. ¿Qué área tiene la salida?';regla=paso('A igual altura, Bernoulli relaciona la caída de presión con el cambio de rapidez.',bern);
        cuentas=[paso('Despejamos la rapidez de salida y sustituimos la diferencia de presión.',[s2('v'),' = ',raiz([sup(s1('v')),' + ',frac(['2 · (',s1('p'),' − ',s2('p'),')'],S.rho)]),'   ·   ',s2('v'),' = ',raiz([sup(q('v',e.v1)),' + ',frac(['2 · (',q('p',e.p1),' − ',q('p',e.p2),') · 1000'],q('rho',e.rho))]),...fin('v',v2,'m/s')]),paso('Despejamos el área mediante continuidad y sustituimos las rapideces.',[s2('A'),' = ',frac([s1('A'),' · ',s1('v')],s2('v')),'   ·   ',s2('A'),' = ',frac([q('A',e.area1),' · ',q('v',e.v1)],q('v',v2)),...fin(k,valor,u)])];
        errores=[er('sin-inicial',e.area1*e.v1/Math.sqrt(dv),'omitiste la rapidez inicial dentro de la raíz'),er('razon-inversa',e.area1*v2/e.v1,'invertiste la razón de rapideces'),er('sin-medio',e.area1*e.v1/Math.sqrt(e.v1**2+dv/2),'omitiste el factor dos al despejar')];break;}
      case 'torricelli-rapidez':case 'altura-desde-caudal':case 'deposito-caudal':{
        const v=tipo==='altura-desde-caudal'?e.caudal/(e.area*.1):Math.sqrt(2*g*e.h);
        valor=tipo==='altura-desde-caudal'?v*v/(2*g):tipo==='deposito-caudal'?e.area*.1*v:v;
        u=tipo==='altura-desde-caudal'?'m':tipo==='deposito-caudal'?'L/s':'m/s';k=tipo==='altura-desde-caudal'?'h':tipo==='deposito-caudal'?'Q':'v';intermedios={v};
        enunciado=tipo==='altura-desde-caudal'?'El caudal de salida tiene el valor indicado. ¿A qué profundidad bajo la superficie está el orificio?':tipo==='deposito-caudal'?'La salida está a la profundidad indicada. ¿Cuál es el caudal en ese instante?':'La salida está a la profundidad indicada. ¿Con qué rapidez sale el líquido en ese instante?';
        regla=paso('Con igual presión exterior, la pérdida de altura proporciona la rapidez de salida.',[S.rho,' · ',S.g,' · ',S.h,' = ',frac([S.rho,' · ',sup(S.v)],'2')]);
        if(tipo==='altura-desde-caudal')cuentas=[paso('Primero despejamos la rapidez a partir del caudal y el área.',[S.v,' = ',frac(S.Q,S.A),'   ·   ',S.v,' = ',frac(q('Q',e.caudal/1000,'',4),q('A',e.area/10000,'',4)),...fin('v',v,'m/s')]),paso('Despejamos la profundidad, elevamos la rapidez al cuadrado y sustituimos.',[S.h,' = ',frac(sup(S.v),['2 · ',S.g]),'   ·   ',S.h,' = ',frac(sup(q('v',v)),['2 · ',q('g',g)]),...fin(k,valor,u)])];
        else {cuentas=[paso('Despejamos la rapidez y elegimos la raíz positiva.',[S.v,' = ',raiz(['2 · ',S.g,' · ',S.h]),'   ·   ',S.v,' = ',raiz(['2 · ',q('g',g),' · ',q('h',e.h)]),...fin('v',v,'m/s')])];if(tipo==='deposito-caudal')cuentas.push(paso('Multiplicamos área por rapidez y convertimos el caudal a litros por segundo.',[S.Q,' = ',S.A,' · ',S.v,'   ·   ',S.Q,' = ',q('A',e.area/10000,'',4),' · ',q('v',v),' = ',q('Q',valor/1000,'m³/s',4),...fin(k,valor,u)]));}
        errores=tipo==='altura-desde-caudal'?[er('sin-dos',valor*2,'omitiste el factor dos del denominador'),er('sin-cuadrado',v/(2*g),'omitiste el cuadrado de la rapidez'),er('caudal-rapidez',e.caudal**2/(2*g),'usaste el número del caudal como rapidez')]:[er('sin-dos',valor/Math.sqrt(2),'omitiste el factor dos dentro de la raíz'),er('sin-raiz',tipo==='deposito-caudal'?e.area*.1*2*g*e.h:2*g*e.h,'omitiste la raíz cuadrada'),er('doble-altura',valor*Math.sqrt(2),'duplicaste la profundidad')];break;}
      case 'densidad-desde-presiones':{
        const v2=e.v1*e.area1/e.area2,dif=v2*v2-e.v1*e.v1;valor=2*(e.p1-e.p2)*1000/dif;u='kg/m³';k='rho';intermedios={v2};
        enunciado='Un líquido circula por un conducto horizontal. Con las áreas y presiones dadas, ¿cuál es su densidad?';regla=paso('Continuidad determina la rapidez de salida; Bernoulli relaciona las presiones a igual altura.',[...cont,'   ·   ',s1('p'),' − ',s2('p'),' = ',frac(S.rho,'2'),' · (',sup(s2('v')),' − ',sup(s1('v')),')']);
        cuentas=[paso('Despejamos la rapidez de salida y sustituimos las áreas.',[s2('v'),' = ',frac([s1('A'),' · ',s1('v')],s2('A')),'   ·   ',s2('v'),' = ',frac([q('A',e.area1),' · ',q('v',e.v1)],q('A',e.area2)),...fin('v',v2,'m/s')]),paso('Despejamos la densidad; convertimos la diferencia de presión a pascales.',[S.rho,' = ',frac(['2 · (',s1('p'),' − ',s2('p'),')'],[sup(s2('v')),' − ',sup(s1('v'))]),'   ·   ',S.rho,' = ',frac(['2 · (',q('p',e.p1),' − ',q('p',e.p2),') · 1000'],[sup(q('v',v2)),' − ',sup(q('v',e.v1))]),...fin(k,valor,u)])];
        errores=[er('sin-dos',valor/2,'omitiste el factor dos al despejar'),er('sin-inicial',2*(e.p1-e.p2)*1000/(v2*v2),'omitiste el término de rapidez inicial'),er('sin-cuadrados',2*(e.p1-e.p2)*1000/(v2-e.v1),'restaste rapideces sin elevarlas al cuadrado')];break;}
      default:throw new Error('Flujo: caso desconocido '+tipo);
    }
    const ops=opciones(valor,errores.map(x=>({valor:x.valor,error:'FL12-Q-'+x.operacion,siFuera:`Reconociste los datos; ${x.motivo}. Obtienes ${mostrar(x.valor,u)}.`})),x=>mostrar(x,u));
    const dibujo=esDeposito?deposito(e):['presion-horizontal','presion-desnivel'].includes(tipo)?alturas(e):tubo(e,['area-continuidad','area-desde-presiones'].includes(tipo));
    const sentido=tipo==='presion-desnivel'?'En este caso, el descenso compensa el aumento de rapidez; la presión de salida es mayor.':esDeposito?'El resultado corresponde al nivel dado en ese instante; al vaciarse el depósito, cambia.':'El resultado conserva el volumen transportado y respeta las condiciones del modelo indicado.';
    const datosAgrupados=[];
    for(let i=0;i<valores.length;i+=3)datosAgrupados.push(valores.slice(i,i+3).flatMap((x,j)=>j?['; ',...x]:x));
    const conNumeros=['En este caso, ',...valores.slice(0,2).flatMap((x,j)=>j?[' y ',...x]:x),'. ',enunciado];
    return {enunciado:conNumeros,datos:[...datosAgrupados,...datos],dibujo,pide:['Busco ',V(k,{Q:'el caudal',V:'el volumen',v:'la rapidez',A:'el área',t:'el tiempo',p:'la presión de salida',h:'la profundidad',rho:'la densidad'}[k]),'.'],tengo:datosAgrupados[0],regla,cuentas,sentido,respuesta:resultado(k,valor,u),opciones:ops,caso:{tipo,...d,g,valor,unidad:u,intermedios,errores:errores.map(({operacion,valor})=>({operacion,valor}))},erroresEjemplo:errores.map(x=>`${mostrar(x.valor,u)}: ${x.motivo}`).join('; ')+'.'};
  }
  const muestras=[
    ['caudal-tiempo',{litros:18,tiempo:12},'Recoger un volumen'],['volumen-paso',{area:4,rapidez:2,tiempo:30},'El volumen que atraviesa una sección'],
    ['rapidez-caudal',{caudal:1.2,area:8},'Una rapidez a partir del caudal'],['continuidad-area',{area1:10,area2:5,v1:3},'Dos áreas conocidas'],
    ['area-continuidad',{area1:12,v1:2,v2:3},'Encontrar el área de salida'],['continuidad-diametro',{d1:6,d2:3,v1:.5},'Diámetro y área circular'],
    ['tiempo-volumen',{area:6,rapidez:2.5,litros:90},'Tiempo para llenar un recipiente'],['presion-horizontal',{p1:120,rho:1000,v1:1,v2:3,z1:0,z2:0},'Presiones a igual altura'],
    ['presion-desnivel',{p1:150,rho:1000,v1:2,v2:4,z1:1,z2:0},'Rapidez y altura cambian juntas'],['torricelli-rapidez',{h:1.25,g:10},'Rapidez en una salida al aire'],
    ['presion-areas',{p1:132,rho:1000,area1:12,area2:6,v1:2,z1:0,z2:.5},'Continuidad antes de Bernoulli'],
    ['area-desde-presiones',{p1:130,p2:114,rho:1000,area1:12,v1:2,z1:0,z2:0},'La presión permite encontrar un área'],
    ['altura-desde-caudal',{caudal:6.4,area:8,g:10},'Una profundidad a partir del caudal'],['deposito-caudal',{h:1.8,g:10,area:5},'Cuánto sale en ese instante'],
    ['densidad-desde-presiones',{p1:100,p2:96.8,v1:1,area1:12,area2:4,z1:0,z2:0},'Encontrar la densidad del líquido']
  ];
  const firma=(t,e)=>t+'|'+JSON.stringify(Object.entries(e).sort());const reservadas=new Set(muestras.map(([t,e])=>firma(t,e)));
  function generar(seed,practica){
    const r=azar(seed+(practica?43000:41000));
    for(let intento=0;intento<200;intento++){
      let t,e;if(!practica){t=r.de(['presion-areas','deposito-caudal']);
        if(t==='presion-areas'){const area1=r.de([8,10,12]),v1=r.de([1,2]);e={p1:r.de([110,124,140]),rho:1000,area1,area2:area1/2,v1,z1:0,z2:r.de([.3,.7])};}
        else {const v=r.de([3,4,6,8]);e={h:v*v/20,g:10,area:r.de([2,3,5,7])};}
      }else{t=r.de(['caudal-tiempo','continuidad-diametro','area-desde-presiones']);
        if(t==='caudal-tiempo'){const tiempo=r.de([4,6,8,10]),caudal=r.de([.5,1.5,2,2.5]);e={litros:tiempo*caudal,tiempo};}
        if(t==='continuidad-diametro'){const d2=r.de([1,2,3]);e={d1:d2*2,d2,v1:r.de([.5,.75,1.25])};}
        if(t==='area-desde-presiones'){const v1=r.de([1,2,3]),p1=r.de([120,144,160]);e={p1,p2:p1-4*v1*v1,rho:1000,area1:r.de([6,9,12,15]),v1,z1:0,z2:0};}
      }
      if(reservadas.has(firma(t,e)))continue;
      let c;try{c=caso(t,e);}catch(err){if(/alternativas|correctas/.test(err.message))continue;throw err;}
      if(c.opciones.some(o=>Math.abs(o.valor/c.caso.valor)>20||Math.abs(o.valor/c.caso.valor)<.05))continue;
      return practica?pregunta(c):resuelto(c);
    }throw new Error('Flujo: no se encontró un caso distinto con opciones útiles.');
  }
  glosario.push(
    {termino:'caudal',simbolo:'Q',medida:'m³/s',formas:['caudal','caudales'],simple:'Volumen de líquido que atraviesa una sección en cada unidad de tiempo.',def:'Cociente entre volumen transportado y tiempo transcurrido.',ejemplos:['Recoger líquido en un recipiente permite medir un caudal.','Una unidad de caudal es el litro por segundo.','El caudal describe volumen transportado, no masa transportada.']},
    {termino:'flujo estacionario',formas:['flujo estacionario'],simple:'Flujo cuyas propiedades en cada punto no cambian con el tiempo.',def:'En cada lugar fijo, la presión y la velocidad permanecen constantes mientras se observa el flujo.',ejemplos:['Se puede estudiar un tramo de tubería cuando sus lecturas dejan de cambiar.','Estacionario no significa que el líquido esté quieto.','El flujo durante el arranque de una bomba puede no ser estacionario.']},
    {termino:'línea de corriente',formas:['línea de corriente','líneas de corriente'],simple:'Curva que sigue la dirección del movimiento del líquido en cada punto.',def:'Línea tangente a la velocidad del fluido en todos sus puntos.',ejemplos:['Una línea de corriente puede curvarse en un codo.','Su dirección coincide con la velocidad local.','Bernoulli compara puntos de una misma línea de corriente bajo sus condiciones.']}
  );
  const juego=v=>tubo({area1:4,area2:4,v1:v,v2:v},false,true);
  const pred={area1:6,area2:3,v1:2},vPred=pred.v1*pred.area1/pred.area2;
  const antes=tubo(pred,false,true),despues=tubo({...pred,v2:vPred},false,true);
  const depositoMira=deposito({h:1.25});
  return {
    id: 'bernoulli',titulo:'Seguir el líquido que pasa',pregunta:'¿Cómo relacionas el volumen que pasa, la rapidez, la presión y la altura?',
    temas:['Caudal, continuidad y Bernoulli (solo San Marcos)'],pieza:'fis-fluidos-e12',aprendizaje:'Calculo caudal, conservo el volumen que circula y comparo presión, rapidez y altura bajo condiciones explícitas.',actividad:'Cambiar la rapidez del líquido que atraviesa una sección fija y observar el volumen transportado.',
    lee:{tarjetas:[{titulo:'Contar el líquido que pasa',texto:'El caudal indica cuánto volumen atraviesa una sección por unidad de tiempo. Puedes medirlo recogiendo líquido y tomando el tiempo. El juego muestra lo que pasa durante un segundo.'},
      {titulo:'Seguir dos secciones',texto:'Entrada y salida son dos lugares del mismo conducto lleno. El líquido es incompresible: no cambia de volumen al avanzar. No entra ni sale líquido por las paredes.'},
      {titulo:'Reconocer las condiciones',texto:'En un flujo estacionario, las lecturas de cada lugar permanecen constantes. Al comparar presiones también indicaremos alturas y si se desprecian pérdidas por rozamiento.'}]},
    ejemplos:muestras.map(([t,e,titulo],i)=>ejemplo(caso(t,e),Math.floor(i/5)+1,titulo,i-10)),
    juega:{pieza:'fis-fluidos-e12',consigna:'El conducto mantiene un área A de 4 cm². Cambia la rapidez y observa cuánto líquido pasa en un segundo.',voz:'Compara el volumen transportado con la rapidez del líquido.',
      mision:{texto:'Consigue que pasen 0,6 L durante un segundo.',logrado:v=>Math.abs(v.v*.4-.6)<1e-9,bien:'Pasan 0,6 L en un segundo.',pista:'Cambia la rapidez y compara el volumen indicado.'},
      controles:[{id:'v',etiqueta:'Rapidez del líquido, v',color:'c-o',opciones:[.5,1,1.5,2].map(v=>({valor:v,texto:f(v)+' m/s'})),inicio:.5}],
      leyenda:[{s:S.A,t:'área fija: 4 cm²; sección rectangular'},{s:S.v,t:'rapidez del líquido'},{s:S.V,t:'volumen transportado durante un segundo'},{s:'Escalas',t:'secciones: escala común; alturas: otra escala'}],
      dibujo:v=>juego(v.v),lectura:v=>['En un segundo pasa un volumen ',S.V,' de ',q('V',v.v*.4,'L'),'.'],resumen:{v:1},minimo:2},
    predice:{pregunta:'Un líquido pasa por 6 cm² a 2 m/s y llega a una sección de 3 cm². ¿Qué rapidez esperas en la salida?',
      datos:['Conducto lleno, sin fugas; líquido incompresible y flujo estacionario.','Secciones rectangulares con la misma profundidad. Las áreas comparten escala; las alturas usan otra escala.'],dibujo:antes,revelar:despues,
      opciones:opciones(vPred,[{valor:pred.v1*pred.area2/pred.area1,error:'FL12-Q-PROPORCIONAL',siFuera:'Reconociste media área; hiciste la rapidez proporcional al área y obtuviste 1 m/s.'},{valor:pred.v1,error:'FL12-Q-CONSERVA',siFuera:'Conservaste la rapidez inicial y obtuviste 2 m/s.'},{valor:pred.v1*(pred.area1/pred.area2)**2,error:'FL12-Q-CUADRADO',siFuera:'Trataste las áreas como diámetros y obtuviste 8 m/s.'}],v=>mostrar(v,'m/s')),coincide:'Coincide: el mismo volumen atraviesa media área y necesita el doble de rapidez.'},
    mira:{pieza:'fis-fluidos-e12',datos:despues.datos,pasos:[
      {estado:{},texto:'El volumen es área por longitud recorrida. Dividir entre el tiempo da el caudal.',ecuacion:[S.V,' = ',S.A,' · ',S.v,' · ',S.t,'   ·   ',S.Q,' = ',frac(S.V,S.t),' = ',S.A,' · ',S.v]},
      {estado:{},texto:'Sin fugas, conservamos el caudal; despejamos y sustituimos la rapidez de salida.',ecuacion:[...cont,'   ·   ',s2('v'),' = ',frac([s1('A'),' · ',s1('v')],s2('A')),' = ',frac([q('A',6),' · ',q('v',2)],q('A',3)),' = ',q('v',4,'m/s')]},
      {estado:{},texto:'Si el conducto es circular, el área depende del cuadrado del diámetro.',ecuacion:[S.A,' = ',frac(['π · ',sup(S.d)],'4')]},
      {estado:{datos:tubo({}).datos},texto:'Sin pérdidas, el trabajo de presión cambia las energías cinética y potencial del líquido.',ecuacion:bern},
      {estado:{datos:tubo({}).datos},texto:'La altura también importa: aislamos la presión de salida sin descartar ningún aporte.',ecuacion:dp},
      {estado:{datos:depositoMira.datos},texto:'Depósito grande: ambas presiones son atmosféricas; la rapidez superficial es despreciable.',ecuacion:[S.rho,' · ',S.g,' · ',S.h,' = ',frac([S.rho,' · ',sup(S.v)],'2'),'   ·   ',S.v,' = ',raiz(['2 · ',S.g,' · ',S.h])]},
      {estado:{datos:depositoMira.datos},texto:'Para invertir el problema, despejamos primero la rapidez o la profundidad.',ecuacion:[S.v,' = ',frac(S.Q,S.A),'   ·   ',S.h,' = ',frac(sup(S.v),['2 · ',S.g])]}
    ]},
    regla:{texto:'El caudal relaciona volumen y tiempo. Continuidad conserva el caudal; Bernoulli relaciona presión, rapidez y altura. Torricelli describe la salida instantánea desde un depósito grande.',
      ecuacion:[S.Q,' = ',frac(S.V,S.t),' = ',S.A,' · ',S.v,'   ·   ',...bern],
      condicion:'Continuidad: líquido incompresible, sin fugas. Bernoulli: flujo estacionario, sin bombas ni pérdidas, sobre una línea de corriente.',voz:'Compara alturas antes de concluir cómo cambia la presión.',dibujo:despues},
    resuelve:{pieza:'fis-fluidos-e12',generar:s=>generar(s,false)},
    ahoraTu:{pieza:'fis-fluidos-e12',generar:s=>generar(s,true)}
  };
})();
const labPresion = (() => {
  const incremento=v=>v.rho*10*v.h/1000;
  return {id:'presion-total',titulo:'Presión y referencia',pieza:'fis-fluidos-e12',
    consigna:'El recipiente está abierto al aire indicado. Cambia el líquido, la profundidad del sensor y la presión exterior; compara las dos lecturas.',
    controles:[
      {id:'h',etiqueta:'Profundidad del sensor, h',min:0,max:.8,paso:.2,inicio:.2,unidad:'m',decimales:1,color:'c-d'},
      {id:'rho',etiqueta:'Densidad del líquido, ρ',opciones:[800,1000,1200].map(valor=>({valor,texto:valor+' kg/m³'})),inicio:1000,color:'c-f'},
      {id:'p0',etiqueta:'Presión absoluta del aire',opciones:[80,100,120].map(valor=>({valor,texto:valor+' kPa'})),inicio:100,color:'c-i'}
    ],
    dibujo:v=>flu({tipo:'vasos',escala:{vertical:180,transversal:180},vasos:[{id:'tanque',alto:1,ancho:.6,nivel:.9}],
      puntos:[{id:'sensor',recipiente:'tanque',altura:.9-v.h}],
      cotas:v.h?[{de:'superficie-tanque',a:'sensor',lado:'der',texto:`h = ${f(v.h)} m`,color:'d'}]:[],
      rotulos:[{ref:'tanque',texto:`Aire: ${f(v.p0)} kPa absolutos`,color:'i'},
        {ref:'tanque',fila:1,texto:`ρ = ${f(v.rho)} kg/m³`,color:'f'},
        {ref:'tanque',fila:2,texto:'g = 10 m/s²; líquido en reposo',color:'h'}],
      alt:'Un sensor cambia de profundidad en un líquido quieto y abierto al aire exterior. Las longitudes comparten escala.'}),
    lectura:v=>[sub(S.p,'abs'),' = ',Q('p',v.p0+incremento(v),'kPa'),'; ',sub(S.p,'man'),' = ',Q('p',incremento(v),'kPa')],
    invitaciones:[
      {texto:'Consigue la mayor presión absoluta que permite esta mesa.',logrado:v=>Math.abs(v.p0+incremento(v)-129.6)<1e-9,bien:'Usas el aire de mayor presión, el líquido más denso y la máxima profundidad.'},
      {texto:'Haz que la presión manométrica sea 4 kPa.',logrado:v=>Math.abs(incremento(v)-4)<1e-9,bien:'El sensor registra 4 kPa por encima de la presión del aire.'},
      {texto:'Con aire a 80 kPa, consigue una presión absoluta de 88 kPa.',logrado:v=>v.p0===80&&Math.abs(v.p0+incremento(v)-88)<1e-9,bien:'La presión absoluta suma 8 kPa a los 80 kPa del aire.'}
    ]};
})();

const labEmpuje = (() => {
  const volumen=0.001,baseBloque=0.20*0.10,baseTina=0.30*0.20,g=10;
  const cuerpo=sub(S.rho,'cuerpo'),liquido=sub(S.rho,'líquido');
  function estado(v){
    const P=v.rhoc*volumen*g,flota=v.rhoc<v.rhol,neutro=v.rhoc===v.rhol;
    const Vs=flota?P/(v.rhol*g):volumen,E=v.rhol*g*Vs,nivel=0.20+Vs/baseTina;
    const base=flota?nivel-Vs/baseBloque:0.10;
    return {P,E,Vs,nivel,base,flota,neutro};
  }
  const porcentaje=x=>(Math.abs(Number(x.toFixed(3))-x)>1e-9?'≈ ':'')+f(x,3)+' %';
  return {id:'bloque-libre',titulo:'Un bloque sin cuerda',pieza:'fis-fluidos-e12',
    consigna:'El bloque homogéneo flota horizontalmente en orientación estable o se suelta sumergido desde el reposo. Cambia las densidades y compara las fuerzas.',
    controles:[
      {id:'rhoc',etiqueta:'Densidad media del cuerpo',opciones:[600,1000,1400].map(valor=>({valor,texto:valor+' kg/m³'})),inicio:1400,color:'c-f'},
      {id:'rhol',etiqueta:'Densidad del líquido',opciones:[800,1000,1200].map(valor=>({valor,texto:valor+' kg/m³'})),inicio:1000,color:'c-f'}
    ],
    leyenda:[{s:cuerpo,t:'densidad media del bloque rígido'},{s:liquido,t:'densidad uniforme del líquido en reposo'},
      {s:S.V,t:'volumen total: 1 L; dimensiones: 20×10×5 cm'},{s:'Tina',t:'base: 30×20 cm; altura: 30 cm'},
      {s:'Nivel',t:'inicial: 20 cm; el líquido no rebosa'},{s:S.g,t:'10 m/s²; sin efectos de la superficie'},{s:'Aire',t:'su empuje se desprecia en este modelo'},
      {s:'Modelo',t:'compara fuerzas; no simula el movimiento posterior'}],
    dibujo:v=>{
      const e=estado(v);
      return flu({tipo:'vasos',modo:'medida',escala:{vertical:600,transversal:600},
        vasos:[{id:'tina',alto:.30,ancho:.30,profundidad:.20,nivel:e.nivel,bloque:{id:'bloque',ancho:.20,profundidad:.10,alto:.05,base:e.base,soporte:'ninguno'}}],
        rotulos:[{ref:'tina',fila:0,texto:'Cuerpo: '+f(v.rhoc,0)+' kg/m³',color:'f'},
          {ref:'tina',fila:1,texto:'Líquido: '+f(v.rhol,0)+' kg/m³',color:'f'},
          {ref:'tina',fila:2,texto:e.flota?'Dentro: '+porcentaje(100*e.Vs/volumen):e.neutro?'Equilibrio dentro del líquido':'Posición inicial al soltar',color:e.flota?'d':undefined}],
        alt:e.flota?'Un bloque ancho flota parcialmente y sin cuerda; se conserva el volumen del líquido.':
          e.neutro?'El bloque está completamente sumergido, sin cuerda y sin contacto con el fondo. Está en equilibrio dentro del líquido.':
          'El bloque aparece completamente sumergido en su posición inicial al soltarlo, sin cuerda y separado del fondo. La figura no representa una posición final de equilibrio.'});
    },
    lectura:v=>{const e=estado(v);return [S.P,' = ',Q('P',e.P,'N',3),'; ',S.E,' = ',Q('E',e.E,'N',3),'. ',e.flota?'Flota parcialmente.':e.neutro?'Equilibrio dentro del líquido.':'Al soltarlo, se hunde.'];},
    invitaciones:[
      {texto:'Haz que el bloque flote con la mitad de su volumen sumergido.',logrado:v=>{const e=estado(v);return e.flota&&Math.abs(e.Vs/volumen-.5)<1e-9;},bien:'La mitad del volumen del bloque está dentro del líquido.'},
      {texto:'Consigue equilibrio completamente sumergido, sin cuerda ni contacto con el fondo.',logrado:v=>estado(v).neutro,bien:'Peso y empuje se equilibran con todo el bloque dentro del líquido.'},
      {texto:'Haz que, al soltarlo, el peso supere al empuje en 6 N.',logrado:v=>{const e=estado(v);return !e.flota&&!e.neutro&&Math.abs(e.P-e.E-6)<1e-9;},bien:'El peso supera al empuje en 6 N; el bloque comienza a hundirse.'}
    ]};
})();

const labPrensa = (() => {
  const F1=sub(S.F,'1'),F2=sub(S.F,'2'),l1=sub(S.ell,'1'),l2=sub(S.ell,'2');
  const estado=v=>({fuerza:v.F*v.A2/v.A1,recorrido:v.l1*v.A1/v.A2,trabajo:v.F*v.l1/100});
  return {id:'prensa',titulo:'Fuerza, recorrido y trabajo',pieza:'fis-fluidos-e12',
    consigna:'Cambia las áreas, la fuerza y el recorrido de entrada. Compara lo que recibe la salida, con ambos centros a igual altura.',
    voz:'Líquido incompresible; sin fugas, rozamiento ni masa de pistones. Presión exterior común y movimiento muy lento.',
    controles:[
      {id:'A1',etiqueta:'Área de entrada',opciones:[10,20].map(valor=>({valor,texto:valor+' cm²'})),inicio:10,color:'c-d'},
      {id:'A2',etiqueta:'Área de salida',opciones:[20,40].map(valor=>({valor,texto:valor+' cm²'})),inicio:20,color:'c-d'},
      {id:'F',etiqueta:'Fuerza de entrada',opciones:[20,40,60].map(valor=>({valor,texto:valor+' N'})),inicio:20,color:'c-h'},
      {id:'l1',etiqueta:'Recorrido de entrada',min:0,max:6,paso:2,inicio:2,unidad:'cm',decimales:0,color:'c-d'}
    ],
    dibujo:v=>{const e=estado(v);return flu({tipo:'prensa',alto:400,escala:{transversal:2000,axial:1000},
      prensa:{profundidad:.1,conectados:true,pistones:[{id:'entrada',area:v.A1/10000,recorrido:v.l1/100},{id:'salida',area:v.A2/10000,recorrido:e.recorrido/100}]},
      flechas:[{ref:'entrada',cualitativa:true,sentido:1,anclaje:'entra'},{ref:'salida',cualitativa:true,sentido:1,anclaje:'entra'}],
      cotas:v.l1?[{de:'inicio-entrada',a:'entrada',eje:'x',separacion:70,color:'d'},
        {de:'inicio-salida',a:'salida',eje:'x',separacion:70,color:'d'}]:[],
      rotulos:[{x:76,y:30,texto:'Entrada'},{x:244,y:30,texto:'Salida'},
        {x:160,y:56,texto:'Flechas: solo sentido',color:'h'},
        {x:76,fila:0,texto:`Área: ${f(v.A1)} cm²`,color:'d'},
        {x:244,fila:0,texto:`Área: ${f(v.A2)} cm²`,color:'d'},
        {x:76,fila:1,texto:`Fuerza: ${f(v.F)} N`,color:'h'},
        {x:244,fila:1,texto:`Fuerza: ${f(e.fuerza)} N`,color:'h'},
        {x:76,fila:2,texto:`Recorre: ${f(v.l1)} cm`,color:'d'},
        {x:244,fila:2,texto:`Recorre: ${f(e.recorrido)} cm`,color:'d'},
        {x:160,y:368,texto:'Caras prismáticas; profundidad común'}],
      alt:'Dos pistones prismáticos horizontales. Las áreas comparten escala transversal y los recorridos, una escala axial común. Las flechas solo indican el sentido; las fuerzas se leen en newtons.'});},
    lectura:v=>{const e=estado(v);return[F2,' = ',Q('F',e.fuerza,'N'),'; ',l2,' = ',Q('ell',e.recorrido,'cm'),'; ',sub(S.W,'1'),' = ',sub(S.W,'2'),' = ',Q('W',e.trabajo,'J')];},
    invitaciones:[
      {texto:'Con 20 N en la entrada, consigue 80 N en la salida.',logrado:v=>v.F===20&&estado(v).fuerza===80,bien:'La salida tiene cuatro veces el área y transmite cuatro veces la fuerza de entrada.'},
      {texto:'Haz que 4 cm de entrada produzcan 1 cm de salida.',logrado:v=>v.l1===4&&estado(v).recorrido===1,bien:'El volumen se conserva: la cara cuatro veces mayor recorre la cuarta parte.'},
      {texto:'Transmite 3,6 J de trabajo a la resistencia de salida.',logrado:v=>Math.abs(estado(v).trabajo-3.6)<1e-9,bien:'Se transmiten 3,6 J: aumentar la fuerza de salida reduce su recorrido.'}
    ]};
})();

const laboratorio = [labPresion, labEmpuje, labPrensa];
const laboratorioIdeas = {"presion-total":["presion-profundidad"],"bloque-libre":["empuje"],"prensa":["prensa-hidraulica"]};

  return {
    unidad:'fisica.fluidos', version:'1.0.0', estado:'completa',
    colores: COLORES,
    letras: { p:'presión', F:'fuerza normal aplicada', E:'empuje', P:'peso', T:'tensión de la suspensión', W:'trabajo de una fuerza', ρ:'densidad', m:'masa', γ:'coeficiente de tensión superficial', n:'número de caras', A:'área de sección', V:'volumen', h:'distancia vertical entre los niveles indicados', z:'altura sobre la referencia común', ℓ:'recorrido de un pistón', L:'longitud de contacto', r:'radio', d:'diámetro', θ:'ángulo de contacto', v:'rapidez media', Q:'caudal volumétrico', t:'tiempo', g:'módulo de la aceleración de la gravedad' },
    requiere:['/nucleo/kit/piezas/fis-fluidos-e12.js','/nucleo/kit/piezas/fis-estatica.js','/nucleo/kit/piezas/ejes.js'],
    glosario,
    historia: {
      texto:'En una carta del 11 de junio de 1644, Torricelli describió un tubo invertido sobre una cubeta de mercurio. La columna no cayó por completo. Relacionó su sostén con la presión del aire sobre la cubeta. El barómetro permitió estudiar una acción invisible mediante una altura que se podía medir y comparar.',
      pregunta:'¿Qué permite averiguar la altura de una columna de líquido?',
      fuente:{titulo:'Museo Galileo: el experimento de Torricelli',url:'https://catalogue.museogalileo.it/indepth/TorricellianExperiment.html'},
    },
    laboratorio, laboratorioIdeas,
    ideas:[idea1, idea2, idea3, idea4, idea5, idea6],
  };
});
