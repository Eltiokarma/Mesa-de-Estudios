'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {calcular}=require('./oraculo-independiente.cjs');
const TIPOS=['densidad-muestra','presion-cara','referencia-profundidad','manometro-signo','columnas-inmiscibles','barometro-referencia','fuerza-pistones','recorrido-volumen','prensa-desnivel','volumen-desplazado','equilibrio-cuerpo','densidad-dos-lecturas','pelicula-caras','coeficiente-pelicula','capilaridad-radio','caudal-volumen','continuidad-secciones','bernoulli-desnivel'];
const cerca=(a,b,m='')=>assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=2e-9*Math.max(1e-7,Math.abs(a),Math.abs(b)),m+': '+a+' ≠ '+b);
const metricas={problemas:0,alternativas:0,igualdades:0,entradas:0};
function plano(x){if(x==null)return '';if(typeof x!=='object')return String(x);if(Array.isArray(x))return x.map(plano).join('');assert.ok('t'in x,'Nodo inesperado '+JSON.stringify(x));return plano(x.t);}
const supers={'⁻':'-','⁺':'+','⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
function normal(s){return plano(s).replace(/[−–]/g,'-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'$1').replace(/,/g,'.').replace(/[⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,x=>'^('+[...x].map(c=>supers[c]).join('')+')').replace(/[·×]/g,'*').replace(/÷/g,'/');}
function expresion(s,env={}){
  s=normal(s).replace(/\s/g,'').replace(/(\d|\))(?=π|[A-Za-df-z])/g,'$1*').replace(/(π|\))(?=\()/g,'$1*');
  const ts=s.match(/\d+(?:\.\d+)?(?:e[+-]?\d+)?|[\p{L}_][\p{L}_\d]*|[()+\-*/^]/gu)||[];assert.equal(ts.join(''),s,'Expresión desconocida '+s);let i=0;
  function atom(){const t=ts[i++];if(t==='('){const z=suma();assert.equal(ts[i++],')',s);return z;}if(t==='π')return Math.PI;if(/^\d/.test(t||''))return Number(t);assert.ok(Object.hasOwn(env,t),'Símbolo sin valor '+t+' en '+s);return env[t];}
  function potencia(){let a=atom();if(ts[i]==='^'){i++;a**=unario();}return a;}
  function unario(){if(ts[i]==='+'){i++;return unario();}if(ts[i]==='-'){i++;return-unario();}return potencia();}
  function producto(){let a=unario();while(ts[i]==='*'||ts[i]==='/'){const op=ts[i++],b=unario();a=op==='*'?a*b:a/b;}return a;}
  function suma(){let a=producto();while(ts[i]==='+'||ts[i]==='-'){const op=ts[i++],b=producto();a=op==='+'?a+b:a-b;}return a;}
  const v=suma();assert.equal(i,ts.length,'Cuenta incompleta '+s);assert.ok(Number.isFinite(v),'Cuenta finita');return v;
}
function numero(n){const z=Math.round((Math.abs(n)+1e-11*Math.max(1,Math.abs(n)))*1000)/1000,s=z.toFixed(3).replace(/0+$/,'').replace(/\.$/,''),[a,b]=s.split('.');return(n<0&&z?'-':'')+a.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(b?','+b:'');}
function formato(v,u){const t=numero(v),z=expresion(t);return(Math.abs(z-v)>1e-9*Math.max(1,Math.abs(v))?'≈ ':'')+t+(u?' '+u:'');}
function cantidadVisible(t,v,u){let s=plano(t).trim(),aprox=s.includes('≈');assert.ok(s.endsWith(u),'Unidad incorrecta: '+s+' / '+u);s=s.slice(0,-u.length).trim().replace(/^≈\s*/,'');const z=expresion(s);if(aprox)assert.ok(Math.abs(z-v)<=.00050001,'Redondeo '+t+' / '+v);else cerca(z,v,'Cantidad exacta '+t);return z;}
function numericos(t){const s=normal(t),ms=s.match(/[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?(?:\*10\^\([+-]?\d+\))?/g)||[];return ms.map(x=>expresion(x));}
const magnitudes={masaKg:'m',volumenL:'V',fuerzaN:'F',areaCm2:'A',pSuperficialKPa:'p',pSensorKPa:'p',rho:'rho',desnivelCm:'h',pAtmKPa:'p',volumenLigeroCm3:'V',areaRamaCm2:'A',rhoLigero:'rho',rhoBase:'rho',pAtmInicialKPa:'p',pTopeInicialKPa:'p',alturaInicialCm:'h',pTopeFinalKPa:'p',alturaFinalCm:'h',areaEntradaCm2:'A',areaSalidaCm2:'A',fuerzaEntradaN:'F',diametroEntradaCm:'d',diametroSalidaCm:'d',recorridoEntradaCm:'ell',trabajoEntradaJ:'W',alturaEntradaM:'z',alturaSalidaM:'z',volumenTotalCm3:'V',volumenSumergidoCm3:'V',lecturaAireN:'T',lecturaLiquidoN:'T',rhoLiquido:'rho',caras:'n',gammaMNPorM:'gamma',longitudContactoCm:'L',fuerzaSostenMN:'T',masaAlambreG:'m',fuerzaPeliculaMN:'F',ascensoCm:'h',tiempoS:'t',rapidezEntrada:'v',pEntradaKPa:'p',caudalLPorS:'Q',areaOrificioCm2:'A'};
function visibles(d,p){const previo=plano(p.enunciado)+' '+plano(p.pregunta)+' '+p.datos.map(plano).join(' '),ns=numericos(previo),porColor={};
  for(const nodo of [...p.enunciado,...p.pregunta])if(nodo&&typeof nodo==='object'){assert.ok(nodo.v);(porColor[nodo.v]||=[]).push(...numericos(nodo.t));assert.doesNotMatch(nodo.t,/\d\.\d/,'Coma decimal');}
  for(const[k,v]of Object.entries(d))if(typeof v==='number'&&!['nivel'].includes(k)){assert.ok(ns.some(x=>Math.abs(x-v)<=1e-8*Math.max(1,Math.abs(v))),'Entrada oculta '+k+'='+v+' en '+previo);if(magnitudes[k])assert.ok((porColor[magnitudes[k]]||[]).some(x=>Math.abs(x-v)<=1e-8*Math.max(1,Math.abs(v))),'Color de '+k);metricas.entradas++;}
  for(const dato of p.datos){const t=plano(dato);assert.ok(t.split(/\s+/).length<=22,'Dato largo '+t);assert.doesNotMatch(t,/\b(?:divide|multiplica|despeja|reemplaza|sustituye|calcula|usa la fórmula)/i,'Datos da un camino');assert.doesNotMatch(t,/(?:F|T|p|Q|v|h|γ|ρ)\s*[=≈]\s*[A-Za-zγρπ]/,'Fórmula en Datos');}
}
// Las unidades de las relaciones se evalúan en SI; porcentaje conserva la escala0–100.
const UNIDADES={'kg/m³':1,'kg/L':1000,'mN/m':.001,'N/m':1,'m/s²':1,'m³/s':1,'L/s':.001,'cm³':1e-6,'m³':1,'cm²':1e-4,'m²':1,'kPa':1000,'Pa':1,'mN':.001,'N':1,'kg':1,'g':.001,'cm':.01,'mm':.001,'m/s':1,'m':1,'L':.001,'s':1,'J':1,'%':1};
const uds=Object.keys(UNIDADES).sort((a,b)=>b.length-a.length),udPat=uds.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
function unidadFinal(s){return uds.find(u=>s.trim().endsWith(' '+u));}
function entorno(d,e){
  const v=e.variables,x={...v,ρ:v.rho,γ:v.gamma};
  const alias={masa:'m',volumen:'V',densidad:'rho',fuerza:'F',área:'A',presión:'p',profundidad:'h',peso:'P',empuje:'E',tensión:'T',caudal:'Q',tiempo:'t',radio:'r',diámetro:'d',coeficiente:'gamma',longitud:'L'};
  for(const[k,z]of Object.entries(alias))if(v[z]!==undefined)x[k]=v[z];
  const estados={presióndelsensor:'p',presiónsuperficial:'p0',presiónmanométrica:'p',alturaligera:'hL',alturaequivalente:'hB',separación:'h',presiónexteriorinicial:'pA1',presiónsuperiorinicial:'pT1',presiónexteriorfinal:'pA2',presiónsuperiorfinal:'pT2',alturainicial:'h1',alturafinal:'h2',fuerzadeentrada:'F1',fuerzadesalida:'F2',áreadeentrada:'a1',áreadesalida:'a2',diámetrodeentrada:'d1',diámetrodesalida:'d2',recorridodeentrada:'l1',recorridodesalida:'l2',presióndeentrada:'p1',presióndesalida:'p2',volumensumergido:'Vs',densidaddelcuerpo:'rho',fuerzasuperficial:'F',rapidezdesalida:'v2',rapidezdeentrada:'v1',cambioporrapidez:'cambioK',cambioporaltura:'cambioH'};
  for(const[k,z]of Object.entries(estados))if(v[z]!==undefined)x[k]=v[z];
  if(v.fraccion!==undefined)x.porcentajesumergido=100*v.fraccion;
  if(d.tipo==='bernoulli-desnivel'&&d.variante==='deposito')x.v=v.v2;
  return x;
}
function igualdades(p,e){
  const env=entorno(p._datos,e);let total=0;
  for(const fila of p.solucion){const texto=plano(fila).replace(/\.$/,'');for(let b of texto.split(/;|⇒/)){
    if(!/[=≈]/.test(b))continue;if(b.includes(':'))b=b.slice(b.lastIndexOf(':')+1);
    const parts=b.split(/([=≈])/).map(s=>s.trim()),expr=parts.filter((_,i)=>!(i%2));
    const factors=expr.map((_,i)=>UNIDADES[expr.slice(i).map(unidadFinal).find(Boolean)||e.unidad]);
    const vals=expr.map((s,i)=>{
      let units=false,variables=false;
      const clean=s.replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g,'$1').replace(/,/g,'.').replace(/[−–]/g,'-').replace(new RegExp('([+-]?\\d+(?:\\.\\d+)?)\\s+('+udPat+')(?![\\p{L}/²³])','gu'),(_,n,u)=>{units=true;return '('+n+'*'+UNIDADES[u]+')';});
      for(const key of Object.keys(env))if(new RegExp('(^|[^\\p{L}])'+key+'($|[^\\p{L}])','u').test(clean.replace(/\s/g,'')))variables=true;
      return expresion(clean,env)*(units||variables?1:factors[i]);
    });
    for(let i=1;i<vals.length;i++){if(parts[2*i-1]==='=')cerca(vals[i-1],vals[i],'Igualdad '+b);else assert.ok(Math.abs(vals[i-1]-vals[i])<=.00050001*factors[i],'Aproximación '+b);total++;}
  }}
  assert.ok(total>0,'Faltan cuentas verificables');metricas.igualdades+=total;
}
function afirmaciones(p,e){
  const d=p._datos,s=p.solucion.map(plano).join(' '),datos=p.datos.map(plano).join(' '),v=e.variables;
  if(d.tipo==='manometro-signo')assert.ok(e.valor>0?s.includes('supera la del aire'):s.includes('menor que la del aire'),'Sentido de la diferencia de presión');
  if(d.tipo==='equilibrio-cuerpo'){
    if(d.variante==='libre'){cerca(v.rho*v.Vs*v.g,v.P,'Peso igual al empuje parcial');assert.match(s,/flotación libre/);assert.match(datos,/No hay cuerda ni sostén/);}
    else{assert.ok(d.variante==='suspension'?v.P>v.E:v.E>v.P);assert.ok(s.includes(d.variante==='suspension'?'cuerda tira hacia arriba':'cuerda tira hacia abajo'));}
  }
  if(d.tipo==='capilaridad-radio'){assert.match(datos,/ángulo de contacto es 0°/);assert.match(datos,/volumen del menisco es despreciable/);assert.ok(v.h/v.r>=40-1e-9);cerca(2*Math.PI*v.r*v.gamma,Math.PI*v.r*v.r*v.h*v.rho*v.g,'Balance de toda la circunferencia');}
  if(d.tipo==='pelicula-caras')cerca(v.F*.013,v.n*v.gamma*v.L*.013,'Trabajo de cada cara');
  if(d.tipo==='coeficiente-pelicula')cerca(v.T,v.F+v.P,'Sostén contra peso y película');
  if(d.tipo==='bernoulli-desnivel'&&d.variante==='tuberia'){cerca(v.a1*v.v1,v.a2*v.v2,'Volúmenes por unidad de tiempo');cerca(v.p1/v.rho+v.v1*v.v1/2+v.g*v.z1,v.p2/v.rho+v.v2*v.v2/2+v.g*v.z2,'Energía por masa entre secciones');assert.ok(v.cambioK*v.cambioH<0,'Cambios que compiten');}
}
function validar(p){const d=p._datos,e=calcular(d);assert.ok(!Object.hasOwn(d,'valor')&&!Object.hasOwn(d,'respuesta'),'Entradas sin respuestas');cerca(p.respuesta.valor,e.valor,d.tipo+' respuesta física');assert.equal(p.respuesta.unidad,e.unidad);visibles(d,p);
  const candidatos=[e.valor,...Object.values(e.errores)];assert.equal(candidatos.length,4);assert.equal(new Set(candidatos.map(v=>normal(formato(v,e.unidad)))).size,4,'Unicidad tras formato');assert.equal(p.alternativas.length,4);assert.equal(p.alternativas.filter(a=>a.correcta).length,1);
  for(const a of p.alternativas){const prefijo='FLP-'+d.tipo.toUpperCase()+'-',op=a.error?.id.slice(prefijo.length),v=a.correcta?e.valor:e.errores[op];assert.ok(Number.isFinite(v),'Operación de error '+op);if(!a.correcta){assert.ok(a.error.id.startsWith(prefijo));assert.equal(a.error.respaldo,'hipotesis');assert.equal(a.error.fuente,'docs/etapa12/errores-fisica.md');const ratio=Math.abs(v/e.valor);assert.ok(ratio>=.05-1e-9&&ratio<=20+1e-9,'Escala');assert.ok(normal(a.error.explicacion).includes(normal(formato(v,e.unidad))),'Cifra y unidad en explicación: '+a.error.explicacion);}
    cerca(a.valor,v,a.error?.id||'Correcta');cantidadVisible(a.texto,v,e.unidad);assert.equal(normal(a.texto),normal(formato(v,e.unidad)),'Formato independiente');assert.equal(candidatos.filter(z=>Math.abs(z-a.valor)<=1e-8*Math.max(1,Math.abs(z))).length,1,'Una operación por opción');metricas.alternativas++;}
  assert.ok(p._verificacion);assert.equal(p._verificacion.errores.length,3);assert.equal(new Set(p._verificacion.errores.map(x=>x.operacion)).size,3);for(const error of p._verificacion.errores){assert.ok(error.operacion in e.errores);cerca(error.valor,e.errores[error.operacion],'Error trazado');}
  for(const[k,v]of Object.entries(p._verificacion.intermedios||{})){assert.ok(k in e.intermedios,'Intermedio nuevo '+k);cerca(v,e.intermedios[k],'Intermedio '+k);}
  igualdades(p,e);afirmaciones(p,e);metricas.problemas++;return e;
}
module.exports={TIPOS,calcular,plano,normal,expresion,formato,cantidadVisible,validar,metricas};

if(!process.env.FLUIDOS_ORACULO_EXPORTAR){
  const G=require('./generador.js');
  test('Fluidos: balances exactos y calibraciones de las variantes',()=>{
    const ejemplos=[
      [{tipo:'equilibrio-cuerpo',variante:'anclaje',masaKg:.2,volumenTotalCm3:600,rho:1000,g:10},4],
      [{tipo:'recorrido-volumen',variante:'trabajo',diametroEntradaCm:3,diametroSalidaCm:6,trabajoEntradaJ:6.3,fuerzaEntradaN:35},4.5],
      [{tipo:'pelicula-caras',caras:1,gammaMNPorM:22,longitudContactoCm:16},3.52],
      [{tipo:'continuidad-secciones',variante:'areas',areaEntradaCm2:14,areaSalidaCm2:7,rapidezEntrada:1.5},3],
      [{tipo:'capilaridad-radio',fuerzaPeliculaMN:4.4,longitudContactoCm:10,caras:2,rho:1100,g:10,ascensoCm:2,pide:'diametro'},.4],
      [{tipo:'manometro-signo',rho:840,g:10,desnivelCm:15,ramaMasAlta:'abierta',pAtmKPa:100},1.26]
    ];for(const[d,v]of ejemplos)cerca(calcular(d).valor,v);
  });
  for(const tipo of TIPOS)test(tipo+':400 semillas, entradas, opciones y ecuaciones independientes',()=>{
    const variantes=new Set(),letras=new Set();for(let s=0;s<400;s++){const p=G.generar(s,{tipo});try{validar(p);}catch(e){e.message=tipo+' semilla '+s+': '+e.message;throw e;}letras.add(p.alternativas.find(a=>a.correcta).letra);variantes.add(p._datos.variante??p._datos.ramaMasAlta??p._datos.pide??p._datos.caras);}
    assert.equal(letras.size,4,'Todas las letras');if(tipo==='equilibrio-cuerpo')assert.equal(variantes.size,3);if(['manometro-signo','recorrido-volumen','pelicula-caras','capilaridad-radio','continuidad-secciones','bernoulli-desnivel'].includes(tipo))assert.equal(variantes.size,2,'Cobertura de variantes');
  });
  test('Fluidos: veinte referencias calculadas desde las entradas finales',()=>{
    const archivo=JSON.parse(fs.readFileSync(path.join(__dirname,'casos.json'),'utf8'));assert.equal(archivo.plantilla,'fis-fluidos');assert.equal(archivo.casos.length,20);assert.equal(new Set(archivo.casos.map(c=>c.opciones.tipo)).size,18);
    for(const c of archivo.casos){const p=G.generar(c.semilla,c.opciones),e=validar(p);assert.deepEqual(p._datos,c.entrada);cerca(c.esperado.respuesta,e.valor);assert.equal(c.esperado.unidad,e.unidad);assert.equal(normal(c.esperado.texto),normal(formato(e.valor,e.unidad)));assert.deepEqual(c.esperado.fraccionExacta,e.exacto);assert.deepEqual(c.erroresEsperados,e.errores);}
  });
  test('Fluidos: ocho problemas de papel preservan datos y cuentas verificadas',()=>{
    const papel=JSON.parse(fs.readFileSync(path.join(__dirname,'papel.json'),'utf8'));assert.equal(papel.problemas.length,8);assert.deepEqual(papel,require('../../herramientas/papel-generador.js').armar('fis-fluidos'));
    for(let i=0;i<8;i++){const p=G.generar('papel-'+(i+1)),e=validar(p),escrito=papel.problemas[i];assert.ok(escrito.enunciado.includes(plano(p.enunciado)));assert.ok(escrito.enunciado.includes(plano(p.pregunta)));for(const d of p.datos)assert.ok(escrito.enunciado.includes(plano(d)));const letra=p.alternativas.find(a=>a.correcta).letra;assert.equal(normal(escrito.respuesta),normal(letra+') '+formato(e.valor,e.unidad)));assert.deepEqual(escrito.pasos,p.solucion.map(plano));}
  });
  test('Fluidos: el oráculo rechaza alteraciones y datos que no se publicaron',()=>{
    const p=G.generar(31,{tipo:'referencia-profundidad'}),a=structuredClone(p);a.respuesta.valor*=1.01;assert.throws(()=>validar(a),/respuesta física/);
    const b=structuredClone(p);b._datos.volumenL+=.0001;assert.throws(()=>validar(b));
    const c=structuredClone(p);c.alternativas.find(a=>!a.correcta).valor*=1.01;assert.throws(()=>validar(c),/FLP-/);
    const z=structuredClone(p);z.solucion.at(-1).find(n=>n&&typeof n==='object'&&n.v==='rho').t='9 999';assert.throws(()=>validar(z),/Igualdad/);
    const m=G.generar(30,{tipo:'manometro-signo'});m.solucion[0]=[m._datos.ramaMasAlta==='abierta'?'Su presión es menor que la del aire.':'Su presión supera la del aire.'];assert.throws(()=>validar(m),/Sentido/);
  });
}
