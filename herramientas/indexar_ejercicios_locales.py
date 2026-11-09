"""Índice de fichas cotejadas. No ejecuta OCR ni vuelve a interpretar documentos.

--actualizar crea un nuevo manifiesto, mostrando cambios frente al anterior.
Sin esa opción verifica el manifiesto existente. --zip reúne el material local.
Los archivos de consulta permanecen bajo fuentes/ocr-local/, excluido de Git.
"""
import argparse
import hashlib
import html
import json
import re
import zipfile
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
LOCAL=ROOT/'fuentes/ocr-local/cuzcano'

def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def write(path,data):path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def inside(root,path):
    path=path.resolve()
    if not path.is_relative_to(root.resolve()):raise ValueError(f'Ruta fuera del archivo local: {path}')
    return path

def identity(data):
    source=data.get('fuente',{})
    book=source.get('libro_id',data.get('libro_id'))
    if not book:return None
    number=source.get('numero',data.get('ejercicio'))
    kind=source.get('tipo','ejercicio')
    match=re.search(r'-(problema|ejemplo|aplicacion)-(\d+)$',data.get('id',''))
    if match:kind,number=match.group(1),int(match.group(2))
    if not isinstance(number,int):return None
    return f'{book}:{kind}:{number}',book,kind,number

class References(HTMLParser):
    def __init__(self):super().__init__();self.links=[]
    def handle_starttag(self,tag,attrs):
        for key,value in attrs:
            if key in ('src','href') and value and not value.startswith(('#','http:','https:','data:','mailto:')):
                self.links.append(value.split('#')[0])

def build(local):
    local=local.resolve();archive=local/'archivo-ejercicios';archive.mkdir(exist_ok=True)
    entries=[];files=set();seen=set();dossiers=[]
    for folder in sorted(local.iterdir()):
        if not folder.is_dir() or not folder.name.startswith(('piloto-','polinomios-lote-')):continue
        found=[]
        for path in sorted(folder.glob('*.json')):
            data=json.loads(path.read_text(encoding='utf-8'))
            ident=identity(data) if isinstance(data,dict) else None
            if ident is None:continue
            uid,book,kind,number=ident
            if uid in seen:raise ValueError(f'Ejercicio duplicado: {uid}')
            seen.add(uid);found.append(path);source=data.get('fuente',{})
            pages=source.get('paginas_pdf',[data['pagina_pdf']] if 'pagina_pdf' in data else [])
            hashes={}
            direct=source.get('sha256_ocr_original',data.get('sha256_ocr_original'))
            if direct and len(pages)==1:hashes[str(pages[0])]=direct
            verification=folder/'verificacion.json'
            if verification.exists():
                known=json.loads(verification.read_text(encoding='utf-8')).get('sha256_ocr_original',{})
                for page in pages:
                    key=f'{book}/p-{page:04d}.json'
                    if key in known:hashes[str(page)]=known[key]
            for sidecar in (local/book).glob('revision-*.json'):
                rev=json.loads(sidecar.read_text(encoding='utf-8'))
                ref=rev.get('ficha_local')
                if ref and (sidecar.parent/ref).resolve()==path.resolve() and rev.get('sha256_ocr_original'):
                    hashes[str(rev['pagina_pdf'])]=rev['sha256_ocr_original']
            for page,expected in hashes.items():
                original=local/book/f'p-{int(page):04d}.json'
                if original.exists() and digest(original)!=expected:raise ValueError(f'OCR de origen cambiado: {original}')
            entries.append({'uid':uid,'libro_id':book,'tipo':kind,'numero':number,'paginas_pdf':pages,
                'tema':data.get('tema',source.get('titulo',kind+' '+str(number))),
                'estado':data.get('estado','no_indicado'),'ficha':path.relative_to(local).as_posix(),
                'lector':(folder/'index.html').relative_to(local).as_posix(),'sha256_ficha':digest(path),
                'sha256_ocr_por_pagina':hashes,'pagina_completa_validada':False})
        if not found:continue
        reader=folder/'index.html'
        if not reader.is_file():raise FileNotFoundError(reader)
        parser=References();parser.feed(reader.read_text(encoding='utf-8'))
        files.update(found);files.add(reader)
        files.update(folder.glob('*.svg'));files.update(folder.glob('*.py'))
        for link in parser.links:
            target=inside(local,folder/link)
            if not target.is_file():raise FileNotFoundError(target)
            files.add(target)
        for name in ['verificacion.json','fichas.json']:
            if (folder/name).is_file():files.add(folder/name)
    # Supporting guides are not exercises. Their explicit inventories travel in
    # the same backup without changing exercise identities or counts.
    for inventory in sorted(local.glob('*/dossier.json')):
        data=json.loads(inventory.read_text(encoding='utf-8'));folder=inventory.parent
        reader=inside(local,folder/data['lector'])
        declared={inside(local,folder/name) for name in data['archivos']}
        if reader not in declared:raise ValueError('Lector no declarado en dossier: '+str(reader))
        for path in declared:
            if not path.is_file():raise FileNotFoundError(path)
        files.update(declared);files.add(inventory)
        dossiers.append({'titulo':data['titulo'],'lector':reader.relative_to(local).as_posix(),
            'inventario':inventory.relative_to(local).as_posix(),'archivos':len(declared)+1})
    for dossier in dossiers:
        reader=local/dossier['lector'];parser=References();parser.feed(reader.read_text(encoding='utf-8'))
        for link in parser.links:
            target=inside(local,reader.parent/link)
            if not target.is_file():raise FileNotFoundError(target)
            if target not in files:raise ValueError('Enlace de dossier no incluido en respaldo: '+str(target))
    entries.sort(key=lambda x:(x['libro_id'],x['tipo'],x['numero']))
    index={'schema_version':1,'alcance':'Ejercicios revisados; no inventario completo de libros ni certificación de páginas.','ejercicios':entries,'dossiers':dossiers}
    write(archive/'indice.json',index)
    rows=''.join('<tr><td>'+html.escape(e['tema'])+'</td><td>'+html.escape(e['tipo'])+' '+str(e['numero'])+'</td><td>'+html.escape(e['estado'])+'</td><td><a href="../'+html.escape(e['lector'])+'">Abrir lector</a> · <a href="../'+html.escape(e['ficha'])+'">Ficha</a></td></tr>' for e in entries)
    doc='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Archivo de ejercicios revisados</title><style>body{font:16px/1.6 system-ui;background:#f0f4f7;color:#20384c;margin:0}main{max-width:1150px;margin:auto;padding:28px}table{background:white;border-collapse:collapse;width:100%}th,td{text-align:left;padding:13px;border-bottom:1px solid #d5e0e7}a{color:#006c82}h1{line-height:1.2}.table{overflow:auto}small{color:#536c80}</style><main><h1>Archivo de ejercicios revisados</h1><p>'+str(len(entries))+' fichas localizables por libro y ejercicio. Cada ficha conserva su lector y sus condiciones de revisión. No es necesario repetir el OCR para consultarlas.</p><p><strong>Conservación:</strong> este archivo y el ZIP son locales. GitHub sólo recibe herramientas y metadatos; conviene guardar el ZIP en una ubicación de respaldo propia.</p><p><a href="indice.json">Índice estructurado</a> · <a href="manifiesto.json">Control de integridad</a></p><div class="table"><table><thead><tr><th>Tema</th><th>Ejercicio</th><th>Estado</th><th>Acceso</th></tr></thead><tbody>'+rows+'</tbody></table></div><p><small>Un hash detecta cambios de archivos; no certifica la corrección matemática. Las fichas con discrepancias o condiciones conservan su estado.</small></p></main></html>'
    if dossiers:
        links='<h2>Guías y cierres de revisión</h2><ul>'+''.join('<li><a href="../'+html.escape(d['lector'])+'">'+html.escape(d['titulo'])+'</a></li>' for d in dossiers)+'</ul>'
        doc=doc.replace('<div class="table">',links+'<div class="table">',1)
    (archive/'index.html').write_text(doc,encoding='utf-8')
    checker='''"""Verifica el archivo extraído, sin PDF, OCR ni servicios externos."""
import hashlib,json
from pathlib import Path
folder=Path(__file__).resolve().parent
root=folder.parent
manifest=json.loads((folder/'manifiesto.json').read_text(encoding='utf-8'))
for name,expected in manifest['archivos'].items():
    path=(root/name).resolve()
    if not path.is_relative_to(root):raise ValueError('Ruta fuera del archivo: '+name)
    if not path.is_file():raise FileNotFoundError(name)
    if hashlib.sha256(path.read_bytes()).hexdigest()!=expected:raise ValueError('Archivo cambiado: '+name)
print(str(len(manifest['archivos']))+' archivos íntegros. Abrir archivo-ejercicios/index.html.')
'''
    (archive/'comprobar_archivo.py').write_text(checker,encoding='utf-8')
    files.update([archive/'indice.json',archive/'index.html',archive/'comprobar_archivo.py'])
    manifests={p.relative_to(local).as_posix():digest(p) for p in sorted(files)}
    previous=archive/'manifiesto.json';old=json.loads(previous.read_text(encoding='utf-8')).get('archivos',{}) if previous.exists() else {}
    changes={'nuevos':sorted(set(manifests)-set(old)),'modificados':sorted(k for k in set(old)&set(manifests) if old[k]!=manifests[k]),'retirados':sorted(set(old)-set(manifests))}
    write(previous,{'schema_version':1,'generado_utc':datetime.now(timezone.utc).isoformat(),'raiz':'..','archivos':manifests,'cambios_desde_registro_anterior':changes})
    return index,changes

def verify(local):
    archive=local/'archivo-ejercicios';manifest=json.loads((archive/'manifiesto.json').read_text(encoding='utf-8'))
    for name,expected in manifest['archivos'].items():
        path=inside(local,local/name)
        if not path.is_file():raise FileNotFoundError(path)
        if digest(path)!=expected:raise ValueError(f'Archivo modificado: {name}')
    index=json.loads((archive/'indice.json').read_text(encoding='utf-8'))
    for e in index['ejercicios']:
        for page,expected in e['sha256_ocr_por_pagina'].items():
            original=local/e['libro_id']/f'p-{int(page):04d}.json'
            if original.exists() and digest(original)!=expected:raise ValueError(f'OCR modificado: {original}')
    return index,manifest

def package(local):
    index,manifest=verify(local);target=local/'archivo-ejercicios/archivo-ejercicios.zip'
    with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
        for name in manifest['archivos']:z.write(inside(local,local/name),name)
        z.write(local/'archivo-ejercicios/manifiesto.json','archivo-ejercicios/manifiesto.json')
    with zipfile.ZipFile(target) as z:
        if z.testzip() is not None:raise ValueError('ZIP dañado')
        for name,expected in manifest['archivos'].items():
            if hashlib.sha256(z.read(name)).hexdigest()!=expected:raise ValueError(f'Contenido de ZIP distinto: {name}')
    return target

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--actualizar',action='store_true');parser.add_argument('--zip',action='store_true');args=parser.parse_args()
    if args.actualizar:
        _,changes=build(LOCAL);print(json.dumps({k:len(v) for k,v in changes.items()},ensure_ascii=False))
    index,manifest=verify(LOCAL)
    if args.zip:print(str(package(LOCAL)))
    print(json.dumps({'ejercicios':len(index['ejercicios']),'archivos_verificados':len(manifest['archivos'])},ensure_ascii=False))
if __name__=='__main__':main()

