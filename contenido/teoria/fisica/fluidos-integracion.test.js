'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const raiz=path.resolve(__dirname,'../../..'),leer=p=>JSON.parse(fs.readFileSync(path.join(raiz,p),'utf8'));
const Avance=require('../../../nucleo/avance.js'),RT=require('../../../nucleo/repaso-tipos.js'),Repaso=require('../../../nucleo/repaso.js'),Pruebas=require('../../../nucleo/pruebas.js');
const {verificadores}=require('../../../catalogo/pruebas/verificar.js'),Papel=require('../../../herramientas/papel-reglas.js');
const U='fisica.fluidos',ids=['presion-profundidad','vasos-comunicantes','prensa-hidraulica','empuje','tension-superficial','bernoulli'];
const copia=x=>JSON.parse(JSON.stringify(x));
const cerca=(a,b,m='')=>assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(a),Math.abs(b)),`${m}: ${a} frente a ${b}`);
function estado(mask=63){return{avanceV:1,vistas:{[U]:'2026-11-12'},teoria:{[U]:{ideas:Object.fromEntries(ids.map((id,j)=>[id,{hecha:!!(mask&2**j),prediccion:j?'opcion-antigua':'c',momento:'mira',casos:j+1}]))}}};}
test('Fluidos: migración conserva estudio, cartas, repaso, fechas e historial',()=>{
  const e=estado();e.glosario={[U]:{presion:'sabe',densidad:'repasa'}};e.repaso={[U]:{desde:'2026-11-10',toca:'2026-11-30',paso:2,aciertos:4}};e.respuestas=[{unidad:U,correcta:false}];e.eventos=[{unidad:U,tipo:'prediccion',correcta:true}];e.teoria['otra.unidad']={ideas:{otra:{hecha:true,prediccion:'b'}}};const antes=copia(e);
  assert.equal(Avance.migrar(e),true);assert.equal(e.prediccionFL,1);
  for(const id of ids)assert.deepEqual(e.teoria[U].ideas[id],Object.fromEntries(Object.entries(antes.teoria[U].ideas[id]).filter(([k])=>k!=='prediccion')));
  for(const k of['vistas','glosario','repaso','respuestas','eventos'])assert.deepEqual(e[k],antes[k],k);assert.deepEqual(e.teoria['otra.unidad'],antes.teoria['otra.unidad']);
  assert.equal(Avance.teoriaCompleta(e,{id:U,teoria:{ideas:6}}),true);assert.equal(Avance.nivel(e,{id:U,teoria:{ideas:6}}).estudio,true);
  const despues=copia(e);assert.equal(Avance.migrar(e),false);assert.deepEqual(e,despues);
});
test('Fluidos: migración conserva exactamente los64subconjuntos de ideas hechas',()=>{
  for(let mask=0;mask<64;mask++){const e=estado(mask);Avance.migrar(e);for(const[j,id]of ids.entries())assert.equal(e.teoria[U].ideas[id].hecha,!!(mask&2**j));assert.equal(Avance.nivel(e,{id:U,teoria:{ideas:6}}).estudio,mask===63);assert.equal(Object.keys(e.teoria[U].ideas).length,6);assert.equal(Avance.migrar(e),false);}
  const e=estado(0);e.marcadas={[U]:'2026-11-01'};Avance.migrar(e);assert.equal(e.marcadas[U],'2026-11-01');assert.equal(Avance.nivel(e,{id:U,teoria:{ideas:6}}).estudio,true);
});
test('Fluidos: migración respeta huellas y no reinicia predicciones nuevas por segunda vez',()=>{
  for(const huella of[undefined,'',null,'pregunta-vigente']){const e=estado();for(const id of ids)if(huella!==undefined)e.teoria[U].ideas[id].prediccionDe=huella;Avance.migrar(e);for(const[j,id]of ids.entries())assert.equal(e.teoria[U].ideas[id].prediccion,huella?(j?'opcion-antigua':'c'):undefined);e.teoria[U].ideas.empuje.prediccion='respuesta-nueva';const antes=copia(e);assert.equal(Avance.migrar(e),false);assert.deepEqual(e,antes);}
});
test('Fluidos: ficha conserva temas y legados, y añade energía y práctica propia',()=>{
  const f=leer('catalogo/cursos/fisica.json').unidades.find(x=>x.id===U);
  assert.deepEqual(f.requiere,['fisica.estatica','fisica.trabajo-y-energia']);assert.deepEqual(f.plantillas,['fis-fluidos','fluidos','fluidos-hidrodinamica']);
  assert.deepEqual(f.temas,['Densidad y presión','Presión hidrostática y atmosférica','Manómetro, barómetro y vasos comunicantes','Principio de Pascal','Principio de Arquímedes','Tensión superficial','Caudal, continuidad y Bernoulli (solo San Marcos)']);
  const d=require('./fluidos.js');assert.deepEqual(d.ideas.map(i=>i.id),ids);const temas=new Set(d.ideas.flatMap(i=>i.temas));assert.deepEqual(f.temas.filter(t=>!temas.has(t)),[]);
  for(const id of['fluidos','fluidos-hidrodinamica']){const f=leer(`plantillas/${id}/plantilla.json`);assert.equal(f.rehacer,true);assert.deepEqual(f.unidades,[U]);assert.ok(fs.existsSync(path.join(raiz,'plantillas',id,f.escena||f.generador)));assert.equal(RT.cubre(f,U),true);assert.equal(RT.unidadDe(f,{}),U);}
});
test('Fluidos: práctica por idea se clasifica en repaso sin modificar otras unidades',()=>{
  const f=leer('plantillas/fis-fluidos/plantilla.json'),G=require('../../../plantillas/fis-fluidos/generador.js');assert.deepEqual(f.unidades,[U]);assert.deepEqual(Object.keys(G.TIPOS_POR_IDEA).sort(),[...ids].sort());assert.equal(RT.cubre(f,U),true);assert.equal(RT.cubre(f,'fisica.dinamica'),false);
  for(const[idea,tipos]of Object.entries(G.TIPOS_POR_IDEA))for(const tipo of tipos)for(let semilla=0;semilla<4;semilla++){const p=G.generar(semilla,{unidad:U,idea,tipo});assert.equal(p._datos.tipo,tipo);assert.equal(RT.unidadDe(f,p),U);}
  const e={alumno:'a1'},eventos=[{tipo:'prediccion',unidad:U,alumno:'a1',t:'2026-11-12T12:00:00Z'}];assert.deepEqual(Repaso.sembrar(e,eventos,u=>RT.cubre(f,u),t=>t.slice(0,10)),[U]);assert.equal(e.repaso[U].toca,'2026-11-14');const antes=copia(e.repaso);assert.deepEqual(Repaso.sembrar(e,eventos,()=>true),[]);assert.deepEqual(e.repaso,antes);
});
test('Fluidos: papel C2 simulado de toda la ficha, incluidas ambas plantillas heredadas',()=>{
  const u=leer('catalogo/cursos/fisica.json').unidades.find(x=>x.id===U);
  for(const id of u.plantillas){const f=leer(`plantillas/${id}/plantilla.json`),p=leer(`plantillas/${id}/${f.papel}`);assert.deepEqual(Papel.revisar({id,ficha:f,papel:p},new Set([U])),[],id);if(id==='fis-fluidos'){assert.equal(p.problemas.length,8);assert.equal(RT.papelCubre(f,U),true);for(const q of p.problemas)assert.deepEqual(RT.unidadesPapel(f,q.id),[U]);}}
});
// Integración hidrostática por pequeñas porciones: la diferencia de presión en cada
// tramo, multiplicada por una sección auxiliar, da el empuje. La tensión sale del equilibrio.
function empuje(Vsup,Vinf,rhoSup,rhoInf,g){let dp=0;const A=.017,N=64;for(const[V,rho]of[[Vsup,rhoSup],[Vinf,rhoInf]])for(let j=0;j<N;j++){const dz=(V/1e6)/A/N;dp+=rho*g*dz;}return A*dp;}
function lineal(fn){const a=fn(0),b=fn(1),r=-a/(b-a);assert.notEqual(a,b);cerca(fn(r),0,'Residuo lineal');return r;}
function positivo(fn){let a=0,b=1;while(fn(b)<0)b*=2;for(let j=0;j<100;j++){const m=(a+b)/2;if(fn(m)<0)a=m;else b=m;}return(a+b)/2;}
function independiente(id,d){
  if(id==='flu-01'){const E=empuje(d.Vsup,d.Vinf,d.rhoSup,d.rhoInf,d.g),P=d.m*d.g;return{correcta:lineal(T=>T+E-P),errores:{'FL12-C-PESO':P,'FL12-C-DENSIDAD-INFERIOR':lineal(T=>T+empuje(d.Vsup,d.Vinf,d.rhoInf,d.rhoInf,d.g)-P),'FL12-C-EMPUJE':E}};}
  // Una porción de un litro: Wpresiones = ΔEc + ΔEpg; continuidad fija su rapidez final.
  const volumen=.001,Q=d.A1/10000*d.v1,v2=positivo(v=>d.A2/10000*v-Q),masa=d.rho*volumen,dK=masa*(v2*v2-d.v1*d.v1)/2,dU=-masa*d.g*d.descenso;
  const p=(K,U)=>lineal(p2=>d.p1*1000*volumen-p2*1000*volumen-K-U);
  return{correcta:p(dK,dU),errores:{'FL12-C-SIN-ALTURA':p(dK,0),'FL12-C-ALTURA-INVERTIDA':p(dK,-dU),'FL12-C-SIN-CINETICA':p(0,dU)}};
}
function comprobarValores(id,d){const a=independiente(id,d),b=verificadores[id](d);cerca(b.correcta,a.correcta);assert.deepEqual(Object.keys(b.errores).sort(),Object.keys(a.errores).sort());for(const k of Object.keys(a.errores))cerca(b.errores[k],a.errores[k],k);const valores=[a.correcta,...Object.values(a.errores)];for(let j=0;j<valores.length;j++)for(let k=j+1;k<valores.length;k++)assert.ok(Math.abs(valores[j]-valores[k])>1e-7,'Opciones únicas');return a;}
test('Fluidos: dos pares reservados con16alternativas exactas y sin copiar datos',()=>{
  const b=leer('catalogo/pruebas/fisica.json');assert.deepEqual(Pruebas.validar(b),[]);assert.equal(b.pares.length,10);const claves={'flu-01':{A:7.6,B:9.9},'flu-02':{A:150,B:178.5}};
  for(const id of Object.keys(claves)){assert.equal(b.pares.filter(x=>x.par===id).length,0);const ps=b.reserva.filter(x=>x.par===id);assert.equal(ps.length,1);const p=ps[0];assert.equal(p.plantilla,'fis-fluidos');assert.equal(p.unidad,U);
    for(const f of['A','B']){const it=p[f],r=comprobarValores(id,it.datos);cerca(r.correcta,claves[id][f]);assert.equal(it.opciones.length,4);assert.equal(it.opciones.filter(o=>o.correcta).length,1);assert.equal(it.opciones.filter(o=>Math.abs(o.valor-r.correcta)<1e-8).length,1);const datosVisibles=new Set((it.enunciado.match(/\d+(?:,\d+)?/g)||[]).map(n=>Number(n.replace(',','.'))));
      for(const v of Object.values(it.datos))assert.ok(datosVisibles.has(v),'Dato numérico visible '+v);
      for(const o of it.opciones){const n=Number(o.texto.match(/^\d+(?:,\d+)?/)[0].replace(',','.'));cerca(n,o.valor,'Valor visible');assert.match(o.texto,id==='flu-01'?/ N$/:/ kPa$/);assert.ok(!datosVisibles.has(n),'No copiar dato '+o.texto);if(o.correcta)cerca(o.valor,r.correcta);else{cerca(o.valor,r.errores[o.error]);assert.equal(b.errores[o.error].respaldo,'hipotesis');}}
      if(id==='flu-01'){assert.ok(it.datos.rhoSup<it.datos.rhoInf);assert.match(it.enunciado,/inmiscibles/);assert.match(it.enunciado,/sin contacto/);assert.match(it.enunciado,/reposo/);assert.ok(r.correcta>0);}
      else{assert.match(it.enunciado,/estacionaria/);assert.match(it.enunciado,/incompresible/);assert.match(it.enunciado,/línea de corriente/);assert.match(it.enunciado,/no hay bombas, turbinas ni pérdidas/);assert.match(it.enunciado,/presión absoluta/);}
    }
  }
});
test('Fluidos:400variantes de cada verificador se contrastan con balances independientes',()=>{
  let comprobados=0;for(let s=0;comprobados<400;s++){
    assert.ok(s<1000);const d={Vsup:100+(s%17)*20,Vinf:200+(s%13)*30,rhoSup:650+(s%7)*50,rhoInf:1200+(s%9)*50,g:9+(s%3)*.5};d.m=(d.rhoSup*d.Vsup+d.rhoInf*d.Vinf)/1e6+3+(s%5)*.1;
    const r=independiente('flu-01',d),vs=[r.correcta,...Object.values(r.errores)];if(vs.some((v,j)=>vs.slice(j+1).some(w=>Math.abs(v-w)<1e-7)))continue;
    assert.ok(vs.every(x=>x>0));comprobarValores('flu-01',d);comprobados++;
  }
  for(let s=0;s<400;s++){const A2=2+s%7,d={p1:130+s%17,A1:A2*(1.5+(s%3)*.5),A2,v1:1+(s%9)/4,descenso:.25+(s%9)/4,rho:800+(s%7)*50,g:9+(s%3)*.5};const r=comprobarValores('flu-02',d);assert.ok([r.correcta,...Object.values(r.errores)].every(x=>x>0));}
});
