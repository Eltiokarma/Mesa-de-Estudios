"""Restaura en D y comprueba4213 identidades,1000 nuevas y3939 controles."""
from pathlib import Path
from datetime import datetime,timezone
import json,hashlib,shutil,subprocess,sys,tempfile,zipfile
EXTRA=['piloto-fisica-preuni-501-527','piloto-fisica-dimensional-propuestos-1-50','piloto-fisica-cinematica1-propuestos-1-60','piloto-fisica-dinamica-propuestos-1-60','piloto-fisica-cinematica2-propuestos-1-60','piloto-fisica-vectorial-propuestos-1-43']
R=Path(__file__).resolve().parents[1];L=R/'fuentes/ocr-local/cuzcano';A=L/'archivo-ejercicios'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
 return h.hexdigest()
def main():
 zpath=A/'archivo-ejercicios.zip';target=Path(tempfile.mkdtemp(prefix='restauracion-rm-1000-',dir=A)).resolve()
 assert target.is_relative_to(A.resolve()) and target.name.startswith('restauracion-rm-1000-') and target!=A.resolve()
 with zipfile.ZipFile(zpath) as z:
  assert z.testzip() is None
  for name in z.namelist():assert (target/name).resolve().is_relative_to(target),name
  z.extractall(target)
 print('Extracción en D completada.',flush=True)
 current=read(target/'cierre-rm-1000/avance-lotes.json');assert current['estado']=='completado' and current['completados']==1000
 folders=[f'piloto-fisica-preuni-{a}-{min(a+29,500)}' for a in range(1,501,30)]+EXTRA
 for source in ['coleccion-fisica-1000/resumen.json','coleccion-algebra-1000/avance.json','cierre-fisica-temas-100/avance-lotes.json','cierre-fisica-bulk-100/avance-lotes.json','cierre-multicurso-814/avance-lotes.json']:
  folders.extend(lot['carpeta'] for lot in read(target/source)['lotes'])
 folders.extend(lot['carpeta'] for lot in current['lotes']);assert len(folders)==len(set(folders))==105
 runs=[]
 for i,script in enumerate([target/'archivo-ejercicios/comprobar_archivo.py']+[target/name/'verificar.py' for name in folders]):
  run=subprocess.run([sys.executable,'-X','utf8',str(script)],cwd=script.parent,capture_output=True,text=True,encoding='utf8',check=True)
  runs.append({'control':script.relative_to(target).as_posix(),'salida':run.stdout.strip()})
  if i%15==0:print(f'Comprobaciones de bloques:{i}/105',flush=True)
 index=read(target/'archivo-ejercicios/indice.json');manifest=read(target/'archivo-ejercicios/manifiesto.json');byuid={e['uid']:e for e in index['ejercicios']}
 assert len(byuid)==len(index['ejercicios'])==4213
 baseline=read(target/'cierre-rm-1000/base-pre-tanda.json');assert baseline['total']==len(baseline['sha256_fichas'])==3213
 for uid,expected in baseline['sha256_fichas'].items():assert byuid[uid]['sha256_ficha']==expected,uid
 fresh={f"{lot['libro_id']}:{lot['tipo']}:{n}" for lot in current['lotes'] for n in lot['numeros']}
 assert len(fresh)==1000 and fresh==set(byuid)-set(baseline['sha256_fichas'])
 coverage=read(target/'cobertura-temas/cobertura.json');closure=read(target/'cierre-rm-1000/avance.json')
 assert coverage['total_fichas']==4213 and coverage['temas_con_minimo_de_revision']==28
 assert all(t['revisados']==100 for t in closure['temas']) and len(closure['temas'])==10
 count=sum(read(target/name/'comprobaciones.json')['ejercicios'] for name in folders);assert count==3939
 assert all(not n.endswith('.pdf') for n in manifest['archivos'])
 result={'fecha_utc':datetime.now(timezone.utc).isoformat(),'criterio_activo':'100_por_tema','minimo_por_tema':100,'nuevos_tanda_actual':1000,'fichas_previas_sin_cambios':3213,'ejercicios_indexados':4213,'controles_totales':count,'bloques_comprobados':len(folders),'archivos_controlados':len(manifest['archivos']),'temas_con_minimo_revision':28,'cursos':closure['cursos'],'con_observaciones_nuevos':closure['con_observaciones_en_nuevos'],'todos_los_temas_completados':False,'sha256_zip':sha(zpath),'bytes_zip':zpath.stat().st_size,'sin_pdf_ni_ocr_originales':True,'ocr_repetido':False,'pruebas':runs}
 assert target.is_relative_to(A.resolve()) and target.name.startswith('restauracion-rm-1000-') and target!=A.resolve()
 shutil.rmtree(target);result['extraccion_temporal_retirada']=not target.exists()
 write(A/'prueba-restauracion-rm-1000.json',result);write(A/'prueba-restauracion-100-por-tema.json',result)
 public={k:v for k,v in result.items() if k!='pruebas'}
 write(R/'fuentes/cuzcano/respaldo-100-por-tema.json',public);write(R/'fuentes/cuzcano/respaldo-algebra-1000.json',public)
 print(json.dumps(public,ensure_ascii=False),flush=True)
if __name__=='__main__':main()
