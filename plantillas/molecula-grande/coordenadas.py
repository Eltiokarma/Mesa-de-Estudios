#!/usr/bin/env python3
"""Herramienta de autor de «La lupa de las moléculas grandes» (no la usa la escena ni el motor).

Lee los SMILES de moleculas.js, comprueba con RDKit que se leen y escribe en moleculas.js el bloque COORDENADAS:
para cada molécula, la lista [x, y] de sus átomos pesados en el orden del SMILES (el mismo orden del motor), en
largos de enlace, con y hacia arriba.
  - AllChem.Compute2DCoords para cada molécula.
  - Las que tienen «plantilla» se alinean con la molécula plantilla (GenerateDepictionMatching2DStructure sobre la
    parte común), para que la familia se vea igual (retinol, retinal, ácido retinoico y β-caroteno; fenilalanina,
    tirosina, triptófano y tiroxina; testosterona y estradiol).
  - Las que tienen «fischer: true» (azúcares abiertos) se dibujan a mano en proyección de Fischer: la cadena en
    vertical con el C1 arriba y el O de cada carbono a la izquierda o a la derecha según su configuración D.
Uso: python3 plantillas/molecula-grande/coordenadas.py
"""
import os, re, json
from rdkit import Chem
from rdkit.Chem import AllChem, rdFMCS
from rdkit.Chem.rdMolDescriptors import CalcMolFormula

AQUI = os.path.dirname(os.path.abspath(__file__))
RUTA = os.path.join(AQUI, 'moleculas.js')
src = open(RUTA, encoding='utf-8').read()

entradas = []
for m in re.finditer(r"\{ id: '([^']+)', smiles: '((?:[^'\\]|\\.)+)'(.*?)\n", src):
    smi = m.group(2).replace('\\\\', '\\')
    pl = re.search(r"plantilla: '([^']+)'", m.group(3) + src[m.end():m.end() + 400].split('{ id:')[0])
    fi = 'fischer: true' in (m.group(3) + src[m.end():m.end() + 400].split('{ id:')[0])
    entradas.append((m.group(1), smi, pl.group(1) if pl else None, fi))

# Fischer: lado del O de cada carbono de la cadena (+1 derecha, -1 izquierda), de la configuración D conocida.
FISCHER = {
    # O=C[C@H](O)[C@@H](O)[C@H](O)[C@H](O)CO: C1 arriba; OH del C2 a la derecha, C3 izquierda, C4 y C5 derecha.
    'glucosa-abierta': {'cadena': [1, 2, 4, 6, 8, 10], 'arriba': 0, 'abajo': 11, 'lado': {3: 1, 5: -1, 7: 1, 9: 1}},
    # OCC(=O)[C@@H](O)[C@H](O)[C@H](O)CO: C1 arriba (CH2OH), C2 = O a la derecha, C3 izquierda, C4 y C5 derecha.
    'fructosa': {'cadena': [1, 2, 4, 6, 8, 10], 'arriba': 0, 'abajo': 11, 'lado': {3: 1, 5: -1, 7: 1, 9: 1}},
}

def fischer(mol, f):
    n = mol.GetNumAtoms(); xy = [[0.0, 0.0] for _ in range(n)]
    for k, i in enumerate(f['cadena']): xy[i] = [0.0, -float(k)]
    xy[f['arriba']] = [0.8, 0.6]
    xy[f['abajo']] = [0.8, -len(f['cadena']) + 0.4]
    for o, lado in f['lado'].items():
        c = [a.GetIdx() for a in mol.GetAtomWithIdx(o).GetNeighbors()][0]
        xy[o] = [float(lado), xy[c][1]]
    return xy

mols, coords = {}, {}
for id_, smi, pl, fi in entradas:
    mol = Chem.MolFromSmiles(smi)
    assert mol is not None, id_
    mols[id_] = mol
for id_, smi, pl, fi in entradas:
    mol = mols[id_]
    if fi:
        coords[id_] = fischer(mol, FISCHER[id_]); continue
    if pl:
        ref = mols[pl]
        if not ref.GetNumConformers(): AllChem.Compute2DCoords(ref)
        mcs = rdFMCS.FindMCS([ref, mol], ringMatchesRingOnly=True, completeRingsOnly=True, timeout=10)
        patt = Chem.MolFromSmarts(mcs.smartsString)
        try:
            AllChem.GenerateDepictionMatching2DStructure(mol, ref, refPatt=patt)
        except Exception:
            AllChem.Compute2DCoords(mol)
    else:
        AllChem.Compute2DCoords(mol)
    conf = mol.GetConformer()
    # RDKit usa 1,5 Å por enlace: se pasa a largos de enlace.
    coords[id_] = [[round(conf.GetAtomPosition(i).x / 1.5, 3), round(conf.GetAtomPosition(i).y / 1.5, 3)] for i in range(mol.GetNumAtoms())]
    print(f'{id_:18s} {CalcMolFormula(mol):14s} {mol.GetNumAtoms()} átomos' + (f' (alineada con {pl})' if pl else ''))

bloque = '  const COORDENADAS = {\n' + ''.join(f"    '{k}': {json.dumps(v, separators=(',', ':'))},\n" for k, v in coords.items()) + '  };\n'
nuevo = re.sub(r'  // COORDENADAS \(las escribe coordenadas\.py; no editar a mano\)\n.*?  // FIN COORDENADAS',
               '  // COORDENADAS (las escribe coordenadas.py; no editar a mano)\n' + bloque.replace('\\', '\\\\') + '  // FIN COORDENADAS', src, flags=re.S)
open(RUTA, 'w', encoding='utf-8').write(nuevo)
print('moleculas.js: coordenadas de', len(coords), 'moléculas')
