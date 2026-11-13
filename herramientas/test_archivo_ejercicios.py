import json
import tempfile
import unittest
from pathlib import Path
from indexar_ejercicios_locales import build,verify,package,identity

class ArchiveTest(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent)
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name)
        self.folder=self.root/'piloto-test';self.folder.mkdir()
        self.ficha=self.folder/'ejercicio.json'
        self.ficha.write_text(json.dumps({'id':'tema-problema-8','fuente':{'libro_id':'libro','paginas_pdf':[2]},'estado':'parcial'}),encoding='utf-8')
        (self.folder/'index.html').write_text('<a href="ejercicio.json">Ficha</a>',encoding='utf-8')

    def test_cambio_y_faltante_se_detectan(self):
        build(self.root);verify(self.root)
        self.ficha.write_text('{}',encoding='utf-8')
        with self.assertRaisesRegex(ValueError,'modificado'):verify(self.root)
        self.ficha.unlink()
        with self.assertRaises(FileNotFoundError):verify(self.root)

    def test_no_acepta_dos_fichas_con_misma_identidad(self):
        (self.folder/'otra.json').write_bytes(self.ficha.read_bytes())
        with self.assertRaisesRegex(ValueError,'duplicado'):build(self.root)

    def test_identidad_distingue_ejemplo_y_problema(self):
        base={'fuente':{'libro_id':'libro'}}
        a=identity(dict(base,id='tema-ejemplo-8'))[0]
        b=identity(dict(base,id='tema-problema-8'))[0]
        self.assertNotEqual(a,b)

    def test_enlace_fuera_del_archivo_rechazado(self):
        (self.folder/'index.html').write_text('<a href="../../secreto.json">Fuera</a>',encoding='utf-8')
        with self.assertRaisesRegex(ValueError,'fuera'):build(self.root)

    def test_reutiliza_sin_origen_y_empaqueta(self):
        build(self.root);index,manifest=verify(self.root)
        self.assertEqual(len(index['ejercicios']),1)
        self.assertTrue(package(self.root).is_file())
        _,changes=build(self.root)
        self.assertEqual(changes,{'nuevos':[],'modificados':[],'retirados':[]})

    def dossier(self,files=None):
        folder=self.root/'cierre-test';folder.mkdir()
        (folder/'index.html').write_text('<img src="figura.svg">',encoding='utf-8')
        (folder/'figura.svg').write_text('<svg/>',encoding='utf-8')
        (folder/'dossier.json').write_text(json.dumps({'titulo':'Guía','lector':'index.html','archivos':files or ['index.html','figura.svg']}),encoding='utf-8')
        return folder

    def test_dossier_se_respalda_sin_contar_como_ejercicio(self):
        self.dossier();index,_=build(self.root);_,manifest=verify(self.root)
        self.assertEqual(len(index['ejercicios']),1)
        self.assertEqual(len(index['dossiers']),1)
        self.assertIn('cierre-test/figura.svg',manifest['archivos'])
        import zipfile
        with zipfile.ZipFile(package(self.root)) as z:self.assertIn('cierre-test/figura.svg',z.namelist())

    def test_dossier_rechaza_enlace_omitido_y_ruta_externa(self):
        folder=self.dossier(['index.html'])
        with self.assertRaisesRegex(ValueError,'no incluido'):build(self.root)
        (folder/'dossier.json').write_text(json.dumps({'titulo':'Guía','lector':'index.html','archivos':['index.html','../../fuera.txt']}),encoding='utf-8')
        with self.assertRaisesRegex(ValueError,'fuera'):build(self.root)

    def test_dossier_rechaza_archivo_faltante(self):
        self.dossier(['index.html','ausente.svg'])
        with self.assertRaises(FileNotFoundError):build(self.root)

if __name__=='__main__':unittest.main()
