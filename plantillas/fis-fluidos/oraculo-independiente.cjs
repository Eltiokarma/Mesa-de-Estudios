/* Solo verificación: balances exactos sobre entradas originales, sin producción. */
'use strict';
const assert=require('node:assert/strict');
function mcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a||1n;}
class R{
  constructor(n,d=1n){n=BigInt(n);d=BigInt(d);assert.notEqual(d,0n);if(d<0n){n=-n;d=-d;}const q=mcd(n,d);this.n=n/q;this.d=d/q;}
  static de(x){if(x instanceof R)return x;assert.ok(Number.isFinite(Number(x)),'Número finito');const[a,ex='0']=String(x).toLowerCase().split('e'),[b,z='']=a.split('.');let n=BigInt(b+z),d=10n**BigInt(z.length),e=Number(ex);if(e>0)n*=10n**BigInt(e);if(e<0)d*=10n**BigInt(-e);return new R(n,d);}
  mas(x){x=R.de(x);return new R(this.n*x.d+x.n*this.d,this.d*x.d);}
  menos(x){x=R.de(x);return this.mas(new R(-x.n,x.d));}
  por(x){x=R.de(x);return new R(this.n*x.n,this.d*x.d);}
  entre(x){x=R.de(x);return new R(this.n*x.d,this.d*x.n);}
  cuadrado(){return this.por(this);}
  opuesto(){return new R(-this.n,this.d);}
  valor(){return Number(this.n)/Number(this.d);}
}
const r=R.de;
function resolver(balance){const cero=balance(r(0)),pendiente=balance(r(1)).menos(cero);assert.notEqual(pendiente.n,0n);const x=cero.opuesto().entre(pendiente);assert.equal(balance(x).n,0n,'El balance debe cerrar exactamente');return x;}
function columna(rho,g,h){const A=r('0.023');return r(rho).por(A).por(h).por(g).entre(A);}
function trabajo(F,distancia){let W=r(0);for(let i=0;i<16;i++)W=W.mas(r(F).por(r(distancia).entre(16)));return W;}
function tiron(gamma,L,n){const avance=r('.007');let W=r(0);for(let cara=0;cara<n;cara++)W=W.mas(r(gamma).por(L).por(avance));return W.entre(avance);}
function gammaMedida(F,L,n){return resolver(ga=>tiron(ga,L,n).menos(F));}
function rapidezVolumen(Q,A){const tiempo=r('.37');return resolver(v=>r(A).por(v).por(tiempo).menos(r(Q).por(tiempo)));}
function radioCapilar(gamma,rho,g,h){
  // Perímetro/peso del cilindro: se cancela πr, positivo. No se usa una respuesta inferida.
  return resolver(rad=>r(gamma).por(2).menos(r(rho).por(rad).por(h).por(g)));
}
function calcular(d){
  const g=r(d.g??10),tipo=d.tipo,er={},intermedios={};let v,u,vars={g};
  const error=(id,z)=>{er[id]=r(z);};
  switch(tipo){
  case 'densidad-muestra':{
    const m=r(d.masaKg),V=r(d.volumenL).entre(1000),rho=resolver(x=>x.por(V).menos(m));v=rho.entre(1000);u='kg/L';
    Object.assign(vars,{m,V,rho});error('INVIERTE_COCIENTE',r(d.volumenL).entre(m));error('MULTIPLICA_VOLUMEN',m.por(d.volumenL));error('DIVIDE_VOLUMEN_DOS_VECES',m.entre(r(d.volumenL).cuadrado()));break;
  }
  case 'presion-cara':{
    const F=r(d.fuerzaN),A=r(d.areaCm2).entre(10000),p=resolver(x=>x.por(A).menos(F));v=p.entre(1000);u='kPa';Object.assign(vars,{F,A,p});
    error('CONVERSION_AREA_POR_DIEZ',resolver(x=>x.por(A.por(10)).menos(F)).entre(1000));error('DUPLICA_CARA',resolver(x=>x.por(A.por(2)).menos(F)).entre(1000));error('USA_FUERZA_COMO_PRESION',F);break;
  }
  case 'referencia-profundidad':{
    const m=r(d.masaKg),V=r(d.volumenL).entre(1000),rho=resolver(x=>x.por(V).menos(m)),p0=r(d.pSuperficialKPa).por(1000),p=r(d.pSensorKPa).por(1000),h=resolver(x=>p0.mas(columna(rho,g,x)).menos(p));
    assert.ok(h.valor()>0&&p0.valor()>0);v=h;u='m';intermedios.rho=rho;Object.assign(vars,{m,V,rho,p,p0,h});
    error('OMITE_REFERENCIA',resolver(x=>columna(rho,g,x).menos(p)));error('SUMA_REFERENCIA',resolver(x=>columna(rho,g,x).menos(p.mas(p0))));
    const rhoMal=m.por(d.volumenL).por(1000);error('MULTIPLICA_MUESTRA',resolver(x=>p0.mas(columna(rhoMal,g,x)).menos(p)));break;
  }
  case 'manometro-signo':{
    assert.ok(['abierta','gas'].includes(d.ramaMasAlta));const signo=d.ramaMasAlta==='abierta'?1:-1,rho=r(d.rho),h=r(d.desnivelCm).entre(100),pExt=r(d.pAtmKPa).por(1000),p=columna(rho,g,h).por(signo);assert.ok(pExt.mas(p).valor()>0);
    v=p.entre(1000);u='kPa';Object.assign(vars,{rho,h,p,pExt,pAbs:pExt.mas(p)});error('INVIERTE_SIGNO',v.opuesto());error('CONFUNDE_DESNIVEL_CON_DOBLE',columna(rho,g,h.entre(2)).por(signo).entre(1000));error('DUPLICA_DESNIVEL',columna(rho,g,h.por(2)).por(signo).entre(1000));break;
  }
  case 'columnas-inmiscibles':{
    const rhoL=r(d.rhoLigero),rhoB=r(d.rhoBase),V=r(d.volumenLigeroCm3).entre(1e6),A=r(d.areaRamaCm2).entre(10000),hL=resolver(h=>A.por(h).menos(V));assert.ok(rhoL.valor()>0&&rhoL.valor()<rhoB.valor());
    const hB=resolver(h=>columna(rhoB,g,h).menos(columna(rhoL,g,hL))),h=hL.menos(hB);assert.ok(h.valor()>0);v=h.por(100);u='cm';
    Object.assign(intermedios,{alturaLigeraCm:hL.por(100),alturaBaseCm:hB.por(100)});Object.assign(vars,{rhoL,rhoB,V,A,hL,hB,h});
    error('DA_COLUMNA_BASE',hB.por(100));error('DA_COLUMNA_LIGERA',hL.por(100));const hMal=resolver(h=>columna(rhoL,g,h).menos(columna(rhoB,g,hL)));error('INVIERTE_DENSIDADES',hL.menos(hMal).por(100));break;
  }
  case 'barometro-referencia':{
    const pA1=r(d.pAtmInicialKPa).por(1000),pT1=r(d.pTopeInicialKPa).por(1000),pT2=r(d.pTopeFinalKPa).por(1000),h1=r(d.alturaInicialCm).entre(100),h2=r(d.alturaFinalCm).entre(100);
    assert.ok(pA1.valor()>pT1.valor()&&h1.valor()>0&&h2.valor()>0);const rho=resolver(x=>pT1.mas(columna(x,g,h1)).menos(pA1)),pA2=pT2.mas(columna(rho,g,h2));v=pA2.entre(1000);u='kPa';
    intermedios.rho=rho;Object.assign(vars,{rho,h1,h2,pA1,pA2,pT1,pT2});
    const rhoMal=resolver(x=>columna(x,g,h1).menos(pA1));error('OMITE_TOPE_INICIAL',pT2.mas(columna(rhoMal,g,h2)).entre(1000));error('OMITE_TOPE_FINAL',columna(rho,g,h2).entre(1000));error('INVIERTE_ALTURAS',pT2.mas(pA1.menos(pT1).por(h1).entre(h2)).entre(1000));break;
  }
  case 'fuerza-pistones':{
    const a1=r(d.areaEntradaCm2).entre(10000),a2=r(d.areaSalidaCm2).entre(10000),F1=r(d.fuerzaEntradaN),p=resolver(x=>x.por(a1).menos(F1)),F2=p.por(a2);v=F2;u='N';
    intermedios.presionAdicionalPa=p;Object.assign(vars,{a1,a2,F1,F2,p});error('CONSERVA_FUERZA',F1);error('INVIERTE_AREAS',resolver(x=>x.por(a2).menos(F1)).por(a1));error('CUADRA_AREAS',F2.por(a2).entre(a1));break;
  }
  case 'recorrido-volumen':{
    const d1=r(d.diametroEntradaCm).entre(100),d2=r(d.diametroSalidaCm).entre(100),a1=d1.cuadrado(),a2=d2.cuadrado();
    // Las áreas comparten π/4; la semejanza deja un balance exacto en d².
    const l1=d.variante==='trabajo'?resolver(l=>trabajo(d.fuerzaEntradaN,l).menos(d.trabajoEntradaJ)):r(d.recorridoEntradaCm).entre(100),l2=resolver(l=>a2.por(l).menos(a1.por(l1)));
    v=l2.por(100);u='cm';intermedios.recorridoEntradaM=l1;Object.assign(vars,{d1,d2,l1,l2,F1:d.fuerzaEntradaN===undefined?undefined:r(d.fuerzaEntradaN),W:d.trabajoEntradaJ===undefined?undefined:r(d.trabajoEntradaJ)});
    error('USA_DIAMETROS',resolver(l=>d2.por(l).menos(d1.por(l1))).por(100));error('OMITE_CAMBIO_DE_AREA',l1.por(100));error('CUADRA_AREAS',resolver(l=>a2.cuadrado().por(l).menos(a1.cuadrado().por(l1))).por(100));break;
  }
  case 'prensa-desnivel':{
    const a1=r(d.areaEntradaCm2).entre(10000),a2=r(d.areaSalidaCm2).entre(10000),F1=r(d.fuerzaEntradaN),rho=r(d.rho),z1=r(d.alturaEntradaM),z2=r(d.alturaSalidaM),p1=resolver(p=>p.por(a1).menos(F1)),dp=columna(rho,g,z2.menos(z1)),p2=p1.menos(dp);
    assert.ok(z2.valor()>z1.valor()&&p2.valor()>0);const F2=p2.por(a2);v=F2;u='N';Object.assign(intermedios,{presionEntradaPa:p1,presionSalidaPa:p2});Object.assign(vars,{a1,a2,F1,F2,rho,z1,z2,p1,p2});
    error('OMITE_DESNIVEL',p1.por(a2));error('INVIERTE_DESNIVEL',p1.mas(dp).por(a2));error('USA_AREA_ENTRADA',p2.por(a1));break;
  }
  case 'volumen-desplazado':{
    const V=r(d.volumenTotalCm3).entre(1e6),Vs=r(d.volumenSumergidoCm3).entre(1e6),rho=r(d.rho);assert.ok(Vs.valor()>0&&Vs.valor()<V.valor());const E=rho.por(Vs).por(g);v=E;u='N';Object.assign(vars,{V,Vs,rho,E});
    error('USA_VOLUMEN_TOTAL',rho.por(V).por(g));error('USA_VOLUMEN_EMERGIDO',rho.por(V.menos(Vs)).por(g));error('OMITE_GRAVEDAD',rho.por(Vs));break;
  }
  case 'equilibrio-cuerpo':{
    const m=r(d.masaKg),V=r(d.volumenTotalCm3).entre(1e6),rho=r(d.rho),P=m.por(g),E=rho.por(V).por(g);Object.assign(intermedios,{pesoN:P,empujeCompletoN:E});Object.assign(vars,{m,V,rho,P,E});
    if(d.variante==='libre'){const Vs=resolver(vol=>rho.por(vol).por(g).menos(P)),f=Vs.entre(V);assert.ok(f.valor()>0&&f.valor()<1);v=f.por(100);u='%';Object.assign(vars,{Vs,fraccion:f});error('USA_VOLUMEN_TOTAL',100);error('DA_PORCENTAJE_EMERGIDO',r(1).menos(f).por(100));error('INVIERTE_DENSIDADES',r(100).entre(f));}
    else{assert.ok(['suspension','anclaje'].includes(d.variante));const signo=d.variante==='suspension'?1:-1,T=resolver(t=>E.mas(t.por(signo)).menos(P));assert.ok(T.valor()>0);v=T;u='N';vars.T=T;error('USA_PESO_SOLO',P);error('USA_EMPUJE_SOLO',E);error('SUMA_FUERZAS',P.mas(E));}break;
  }
  case 'densidad-dos-lecturas':{
    const Ta=r(d.lecturaAireN),Tl=r(d.lecturaLiquidoN),rhoL=r(d.rhoLiquido);assert.ok(Ta.valor()>Tl.valor()&&Tl.valor()>0);const m=resolver(m=>m.por(g).menos(Ta)),V=resolver(V=>Tl.mas(rhoL.por(V).por(g)).menos(Ta)),rho=resolver(rho=>rho.por(V).menos(m));v=rho;u='kg/m³';Object.assign(intermedios,{masaKg:m,volumenM3:V});Object.assign(vars,{Ta,Tl,rhoL,m,V,rho});
    vars.E=Ta.menos(Tl);error('USA_LECTURA_LIQUIDO',resolver(m=>m.por(g).menos(Tl)).entre(V));const Vmal=resolver(V=>rhoL.por(V).por(g).menos(Ta.mas(Tl)));error('SUMA_EN_DENOMINADOR',m.entre(Vmal));error('SUMA_EN_NUMERADOR',resolver(m=>m.por(g).menos(Ta.mas(Tl))).entre(V));break;
  }
  case 'pelicula-caras':{
    const L=r(d.longitudContactoCm).entre(100),gamma=r(d.gammaMNPorM).entre(1000),n=d.caras;assert.ok(n===1||n===2);const F=tiron(gamma,L,n);v=F.por(1000);u='mN';Object.assign(vars,{L,gamma,n:r(n),F});
    error('CAMBIA_NUMERO_CARAS',tiron(gamma,L,n===1?2:1).por(1000));error('USA_AREA_EN_VEZ_CONTACTO',tiron(gamma,L.cuadrado(),n).por(1000));error('USA_COEFICIENTE_COMO_FUERZA',d.gammaMNPorM);break;
  }
  case 'coeficiente-pelicula':{
    const T=r(d.fuerzaSostenMN).entre(1000),m=r(d.masaAlambreG).entre(1000),L=r(d.longitudContactoCm).entre(100),n=d.caras,P=m.por(g),F=resolver(f=>f.mas(P).menos(T));assert.ok(F.valor()>0);const gamma=gammaMedida(F,L,n);v=gamma.por(1000);u='mN/m';
    Object.assign(intermedios,{pesoMN:P.por(1000),fuerzaSuperficialMN:F.por(1000)});Object.assign(vars,{T,m,L,n:r(n),P,F,gamma});error('IGNORA_PESO',gammaMedida(T,L,n).por(1000));error('SUMA_PESO',gammaMedida(T.mas(P),L,n).por(1000));error('DUPLICA_CARAS',gammaMedida(F,L,n*2).por(1000));break;
  }
  case 'capilaridad-radio':{
    const F=r(d.fuerzaPeliculaMN).entre(1000),L=r(d.longitudContactoCm).entre(100),n=d.caras,rho=r(d.rho),h=r(d.ascensoCm).entre(100),gamma=gammaMedida(F,L,n),radio=radioCapilar(gamma,rho,g,h);assert.ok(h.entre(radio).valor()>=40-1e-8);assert.ok(['radio','diametro'].includes(d.pide));
    const factor=d.pide==='diametro'?2:1;v=radio.por(factor*1000);u='mm';Object.assign(intermedios,{gammaNPorM:gamma,radioM:radio});Object.assign(vars,{F,L,n:r(n),rho,h,gamma,r:radio,d:radio.por(2)});
    error('OMITE_CARAS_CALIBRACION',radioCapilar(gammaMedida(F,L,1),rho,g,h).por(factor*1000));error(d.pide==='diametro'?'DA_RADIO':'OMITE_FACTOR_DOS',radio.por(factor*500));error('CONVERSION_ALTURA_POR_DIEZ',radioCapilar(gamma,rho,g,h.por(10)).por(factor*1000));break;
  }
  case 'caudal-volumen':{
    const V=r(d.volumenL).entre(1000),t=r(d.tiempoS),Q=resolver(q=>q.por(t).menos(V));v=Q.por(1000);u='L/s';Object.assign(vars,{V,t,Q});error('INVIERTE_COCIENTE',t.entre(d.volumenL));error('OMITE_TIEMPO',d.volumenL);error('DIVIDE_TIEMPO_DOS_VECES',r(d.volumenL).entre(t.cuadrado()));break;
  }
  case 'continuidad-secciones':{
    const diam=d.variante==='diametros';assert.ok(diam||d.variante==='areas');const a1=diam?r(d.diametroEntradaCm).cuadrado():r(d.areaEntradaCm2),a2=diam?r(d.diametroSalidaCm).cuadrado():r(d.areaSalidaCm2),v1=r(d.rapidezEntrada),Q=a1.por(v1),v2=rapidezVolumen(Q,a2);v=v2;u='m/s';Object.assign(vars,{v1,v2,razonAreas:a1.entre(a2)});
    error(diam?'USA_DIAMETROS':'INVIERTE_AREAS',diam?rapidezVolumen(r(d.diametroEntradaCm).por(v1),r(d.diametroSalidaCm)):rapidezVolumen(a2.por(v1),a1));error('CONSERVA_RAPIDEZ',v1);error('CUADRA_AREAS',rapidezVolumen(a1.cuadrado().por(v1),a2.cuadrado()));break;
  }
  case 'bernoulli-desnivel':{
    if(d.variante==='deposito'){
      const Q=r(d.caudalLPorS).entre(1000),A=r(d.areaOrificioCm2).entre(10000),v2=rapidezVolumen(Q,A),masa=r('.037'),h=resolver(h=>masa.por(g).por(h).menos(masa.por(v2.cuadrado()).entre(2)));v=h;u='m';intermedios.rapidezSalida=v2;Object.assign(vars,{Q,A,v2,h});
      error('OMITE_FACTOR_DOS',resolver(h=>masa.por(g).por(h).menos(masa.por(v2.cuadrado()))));const vv=rapidezVolumen(Q,A.por(2));error('DUPLICA_AREA_ORIFICIO',resolver(h=>g.por(h).menos(vv.cuadrado().entre(2))));error('USA_CAUDAL_COMO_RAPIDEZ',r(d.caudalLPorS).cuadrado().entre(g.por(2)));
    }else{
      assert.equal(d.variante,'tuberia');const rho=r(d.rho),a1=r(d.areaEntradaCm2).entre(10000),a2=r(d.areaSalidaCm2).entre(10000),v1=r(d.rapidezEntrada),Q=a1.por(v1),v2=rapidezVolumen(Q,a2),p1=r(d.pEntradaKPa).por(1000),z1=r(d.alturaEntradaM),z2=r(d.alturaSalidaM),vol=r('.017'),masa=rho.por(vol);
      const deltaK=masa.por(v2.cuadrado().menos(v1.cuadrado())).entre(2),deltaU=masa.por(g).por(z2.menos(z1));assert.ok(deltaK.valor()*deltaU.valor()<0);assert.notEqual(deltaK.mas(deltaU).n,0n);
      const p2=resolver(p=>p1.menos(p).por(vol).menos(deltaK).menos(deltaU));assert.ok(p2.valor()>0);v=p2.entre(1000);u='kPa';intermedios.rapidezSalida=v2;Object.assign(vars,{rho,a1,a2,v1,v2,Q,p1,p2,z1,z2,deltaK,deltaU});
      intermedios.cambioCineticoKPa=deltaK.opuesto().entre(vol).entre(1000);intermedios.cambioAlturaKPa=deltaU.opuesto().entre(vol).entre(1000);
      vars.cambioK=deltaK.opuesto().entre(vol);vars.cambioH=deltaU.opuesto().entre(vol);
      error('INVIERTE_CAMBIO_CINETICO',resolver(p=>p1.menos(p).por(vol).mas(deltaK).menos(deltaU)).entre(1000));error('INVIERTE_CAMBIO_ALTURA',resolver(p=>p1.menos(p).por(vol).menos(deltaK).mas(deltaU)).entre(1000));error('CONSERVA_RAPIDEZ',resolver(p=>p1.menos(p).por(vol).menos(deltaU)).entre(1000));
    }break;
  }
  default:throw Error('Familia sin oráculo: '+tipo);
  }
  const convertir=o=>Object.fromEntries(Object.entries(o).filter(([,v])=>v!==undefined).map(([k,z])=>[k,z instanceof R?z.valor():z]));
  assert.ok(Number.isFinite(v.valor()));
  return{valor:v.valor(),unidad:u,exacto:{numerador:String(v.n),denominador:String(v.d)},errores:convertir(er),intermedios:convertir(intermedios),variables:convertir(vars)};
}
module.exports={R,calcular};
