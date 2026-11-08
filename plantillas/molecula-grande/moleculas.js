/*
 * Biblioteca de «La lupa de las moléculas grandes»: 30 moléculas reales (biomoléculas y productos naturales).
 *
 * Cada entrada: id, nombre (común), smiles (el que lee motor.js; los índices de átomo cuentan desde 0 en el orden en
 * que aparecen los átomos en el SMILES, sin contar los H), familia y clase (la ficha de tabla), solubilidad (en agua,
 * de tabla), dato (una o dos frases que se saben con seguridad), y a veces pka (de tabla, Lehninger, para la forma
 * según el pH) y fischer (la molécula se dibuja en proyección de Fischer).
 * Los SMILES se comprobaron con RDKit (herramienta de autor, coordenadas.py): fórmula molecular y, donde hay un SMILES
 * de PubChem para comparar, la misma molécula con su estereoquímica. El motor no usa RDKit: todo lo calcula en JS.
 * Las coordenadas 2D (x, y en largos de enlace, y hacia arriba) las escribe coordenadas.py con RDKit
 * (AllChem.Compute2DCoords; las familias se alinean con su plantilla; Fischer a mano). No editar ese bloque a mano.
 * Funciona en el navegador (window.MoleculasGrandes) y en Node (require).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MoleculasGrandes = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const LISTA = [
    // Aminoácidos aromáticos (forma neutra escrita; la forma según el pH la arma el motor con los pKa)
    { id: 'fenilalanina', smiles: 'N[C@@H](Cc1ccccc1)C(=O)O', nombre: 'fenilalanina', familia: 'aminoácido aromático (esencial)', clase: 'aminoácido', solubilidad: 'soluble en agua',
      pka: { carboxilo: 1.83, amino: 9.13 }, dato: 'Aminoácido esencial: viene de la dieta. En el hígado se hidroxila en el anillo y da tirosina.' },
    { id: 'tirosina', smiles: 'N[C@@H](Cc1ccc(O)cc1)C(=O)O', nombre: 'tirosina', familia: 'aminoácido aromático', clase: 'aminoácido', solubilidad: 'poco soluble en agua',
      pka: { carboxilo: 2.20, amino: 9.11, fenol: 10.07 }, plantilla: 'fenilalanina', dato: 'Se forma de la fenilalanina. De ella salen la dopamina, la adrenalina y las hormonas tiroideas.' },
    { id: 'triptofano', smiles: 'N[C@@H](Cc1c[nH]c2ccccc12)C(=O)O', nombre: 'triptófano', familia: 'aminoácido aromático (esencial)', clase: 'aminoácido', solubilidad: 'poco soluble en agua',
      pka: { carboxilo: 2.38, amino: 9.39 }, plantilla: 'fenilalanina', dato: 'Aminoácido esencial con un anillo de indol. Es el punto de partida de la serotonina.' },
    // Glúcidos
    { id: 'glucosa-abierta', smiles: 'O=C[C@H](O)[C@@H](O)[C@H](O)[C@H](O)CO', nombre: 'D-glucosa (cadena abierta)', familia: 'monosacárido: aldohexosa', clase: 'glúcido', solubilidad: 'muy soluble en agua',
      fischer: true, dato: 'Aldosa de seis carbonos. En agua casi toda está cerrada en anillo; la cadena abierta es una parte muy pequeña.' },
    { id: 'glucosa-ciclica', smiles: 'OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O', nombre: 'β-D-glucopiranosa', familia: 'monosacárido: aldohexosa cíclica', clase: 'glúcido', solubilidad: 'muy soluble en agua',
      dato: 'La glucosa cerrada en un anillo de seis: el O del carbono 5 se une al carbono 1 y queda un hemiacetal.' },
    { id: 'fructosa', smiles: 'OCC(=O)[C@@H](O)[C@H](O)[C@H](O)CO', nombre: 'D-fructosa (cadena abierta)', familia: 'monosacárido: cetohexosa', clase: 'glúcido', solubilidad: 'muy soluble en agua',
      fischer: true, dato: 'Cetosa de seis carbonos, el azúcar de las frutas y de la miel. Tiene la misma fórmula que la glucosa.' },
    { id: 'sacarosa', smiles: 'OC[C@H]1O[C@H](O[C@]2(CO)O[C@H](CO)[C@@H](O)[C@@H]2O)[C@H](O)[C@@H](O)[C@@H]1O', nombre: 'sacarosa', familia: 'disacárido (glucosa + fructosa)', clase: 'glúcido', solubilidad: 'muy soluble en agua',
      dato: 'El azúcar de mesa. Glucosa y fructosa se unen por sus carbonos anoméricos: no queda hemiacetal libre y no es un azúcar reductor.' },
    // Vitamina A y su familia
    { id: 'retinol', smiles: 'CC1=C(C(C)(C)CCC1)/C=C/C(C)=C/C=C/C(C)=C/CO', nombre: 'retinol (vitamina A)', familia: 'vitamina liposoluble', clase: 'lípido (isoprenoide)', solubilidad: 'liposoluble',
      dato: 'Vitamina A. En el cuerpo se oxida a retinal y después a ácido retinoico.' },
    { id: 'retinal', smiles: 'CC1=C(C(C)(C)CCC1)/C=C/C(C)=C/C=C/C(C)=C/C=O', nombre: 'retinal', familia: 'vitamina liposoluble (forma aldehído)', clase: 'lípido (isoprenoide)', solubilidad: 'liposoluble',
      plantilla: 'retinol', dato: 'Unido a la proteína opsina forma la rodopsina, el pigmento del ojo que capta la luz.' },
    { id: 'acido-retinoico', smiles: 'CC1=C(C(C)(C)CCC1)/C=C/C(C)=C/C=C/C(C)=C/C(=O)O', nombre: 'ácido retinoico', familia: 'vitamina liposoluble (forma ácida)', clase: 'lípido (isoprenoide)', solubilidad: 'liposoluble',
      plantilla: 'retinol', dato: 'La forma ácida de la vitamina A; regula genes del crecimiento de la piel y del embrión.' },
    { id: 'beta-caroteno', smiles: 'CC1=C(C(C)(C)CCC1)/C=C/C(C)=C/C=C/C(C)=C/C=C/C=C(C)/C=C/C=C(C)/C=C/C2=C(C)CCCC2(C)C', nombre: 'β-caroteno', familia: 'carotenoide (provitamina A)', clase: 'hidrocarburo (polieno)', solubilidad: 'insoluble en agua',
      plantilla: 'retinol', dato: 'El pigmento naranja de la zanahoria y del zapallo. Al partirse por la mitad da dos moléculas de retinal.' },
    // Otras vitaminas
    { id: 'vitamina-c', smiles: 'OC[C@H](O)[C@H]1OC(=O)C(O)=C1O', nombre: 'ácido ascórbico (vitamina C)', familia: 'vitamina hidrosoluble', clase: 'derivado de glúcido', solubilidad: 'hidrosoluble',
      dato: 'Antioxidante: actúa como agente reductor; al oxidarse cede 2 electrones y queda ácido deshidroascórbico. Hace falta para formar colágeno.' },
    { id: 'nicotinamida', smiles: 'NC(=O)c1cccnc1', nombre: 'nicotinamida (vitamina B3)', familia: 'vitamina hidrosoluble', clase: 'amida heterocíclica', solubilidad: 'hidrosoluble',
      dato: 'Una forma de la vitamina B3 (niacina). Es parte de las coenzimas NAD⁺ y NADP⁺, que llevan electrones en la respiración celular.' },
    { id: 'vitamina-e', smiles: 'Cc1c(C)c2O[C@](C)(CCC[C@H](C)CCC[C@H](C)CCCC(C)C)CCc2c(C)c1O', nombre: 'α-tocoferol (vitamina E)', familia: 'vitamina liposoluble', clase: 'lípido (isoprenoide)', solubilidad: 'liposoluble',
      dato: 'Antioxidante de las membranas: protege a los ácidos grasos insaturados de la oxidación.' },
    { id: 'vitamina-d3', smiles: 'C=C1CC[C@H](O)C/C1=C/C=C1\\CCC[C@@]2(C)[C@H]1CC[C@@H]2[C@H](C)CCCC(C)C', nombre: 'colecalciferol (vitamina D₃)', familia: 'vitamina liposoluble (secoesteroide)', clase: 'lípido (esteroide abierto)', solubilidad: 'liposoluble',
      dato: 'Se forma en la piel desde el 7-deshidrocolesterol con la luz ultravioleta. Se hidroxila primero en el hígado (carbono 25) y después en el riñón (carbono 1): así queda el calcitriol, la forma activa.' },
    // Esteroides
    { id: 'colesterol', smiles: 'C[C@H](CCCC(C)C)[C@H]1CC[C@H]2[C@@H]3CC=C4C[C@@H](O)CC[C@]4(C)[C@H]3CC[C@]12C', nombre: 'colesterol', familia: 'esterol', clase: 'lípido (esteroide)', solubilidad: 'insoluble en agua',
      dato: 'Esterol de las membranas animales. De él salen las hormonas esteroideas, los ácidos biliares y la vitamina D.' },
    { id: 'testosterona', smiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1CC[C@@H]2O', nombre: 'testosterona', familia: 'hormona esteroidea (andrógeno)', clase: 'lípido (esteroide)', solubilidad: 'muy poco soluble en agua',
      dato: 'Hormona sexual masculina; se forma a partir del colesterol.' },
    { id: 'estradiol', smiles: 'C[C@]12CC[C@H]3[C@@H](CCc4cc(O)ccc34)[C@@H]1CC[C@@H]2O', nombre: 'estradiol', familia: 'hormona esteroidea (estrógeno)', clase: 'lípido (esteroide)', solubilidad: 'muy poco soluble en agua',
      plantilla: 'testosterona', dato: 'Hormona sexual femenina; se forma a partir de la testosterona. Es de los pocos esteroides con un anillo aromático.' },
    // Polifenoles, colorantes y alcaloides
    { id: 'quercetina', smiles: 'O=C1C(O)=C(c2ccc(O)c(O)c2)Oc2cc(O)cc(O)c21', nombre: 'quercetina', familia: 'flavonoide (polifenol)', clase: 'flavonoide', solubilidad: 'muy poco soluble en agua',
      dato: 'Flavonoide de la cebolla, la manzana y el té; antioxidante.' },
    { id: 'curcumina', smiles: 'COc1cc(/C=C/C(=O)CC(=O)/C=C/c2ccc(O)c(OC)c2)ccc1O', nombre: 'curcumina', familia: 'colorante natural (polifenol)', clase: 'colorante', solubilidad: 'insoluble en agua',
      dato: 'El colorante amarillo de la cúrcuma (el palillo de la cocina peruana).' },
    { id: 'capsaicina', smiles: 'CC(C)/C=C/CCCCC(=O)NCc1ccc(O)c(OC)c1', nombre: 'capsaicina', familia: 'capsaicinoide', clase: 'amida natural', solubilidad: 'muy poco soluble en agua',
      dato: 'Da el picor al ají y al rocoto. Por eso el picor no se quita con agua.' },
    { id: 'cafeina', smiles: 'Cn1cnc2c1C(=O)N(C)C(=O)N2C', nombre: 'cafeína', familia: 'alcaloide (xantina)', clase: 'alcaloide', solubilidad: 'soluble en agua (más en agua caliente)',
      sinPrincipal: true,   // la IUPAC la nombra como purina-2,6-diona: la lupa de la función principal no se ofrece
      dato: 'Alcaloide del café, el té y la guaraná. Su esqueleto es el de la purina, el mismo de la adenina.' },
    { id: 'adenina', smiles: 'Nc1ncnc2[nH]cnc12', nombre: 'adenina', familia: 'base nitrogenada (purina)', clase: 'heterociclo nitrogenado', solubilidad: 'poco soluble en agua fría',
      dato: 'Base púrica del ADN y del ARN; también es parte del ATP y del NAD⁺.' },
    // Hormona tiroidea
    { id: 'tiroxina', smiles: 'N[C@@H](Cc1cc(I)c(Oc2cc(I)c(O)c(I)c2)c(I)c1)C(=O)O', nombre: 'tiroxina (T4)', familia: 'hormona tiroidea', clase: 'aminoácido yodado', solubilidad: 'muy poco soluble en agua',
      pka: null, plantilla: 'fenilalanina', dato: 'Hormona de la tiroides con cuatro yodos. Se forma a partir de la tirosina; por eso la sal se yoda.' },
    // Organosulfurado
    { id: 'alicina', smiles: 'C=CCS(=O)SCC=C', nombre: 'alicina', familia: 'organosulfurado del ajo', clase: 'organosulfurado', solubilidad: null,
      dato: 'Aparece cuando se machaca el ajo: una enzima la forma a partir de la aliina. Da el olor del ajo recién picado.' },
    // Ácidos del metabolismo
    { id: 'acido-citrico', smiles: 'OC(=O)CC(O)(CC(=O)O)C(=O)O', nombre: 'ácido cítrico', familia: 'hidroxiácido tricarboxílico', clase: 'ácido orgánico', solubilidad: 'muy soluble en agua',
      dato: 'El ácido del limón. Da nombre al ciclo de Krebs (ciclo del ácido cítrico).' },
    { id: 'acido-piruvico', smiles: 'CC(=O)C(=O)O', nombre: 'ácido pirúvico', familia: 'cetoácido', clase: 'ácido orgánico', solubilidad: 'muy soluble en agua',
      dato: 'Termina la glucólisis. Sin oxígeno, en el músculo se reduce a ácido láctico.' },
    // Ácidos grasos
    { id: 'acido-oleico', smiles: 'CCCCCCCC/C=C\\CCCCCCCC(=O)O', nombre: 'ácido oleico', familia: 'ácido graso monoinsaturado (cis)', clase: 'lípido (ácido graso)', solubilidad: 'insoluble en agua',
      dato: 'Ácido graso del aceite de oliva y de la palta. Su doble enlace cis dobla la cadena.' },
    { id: 'acido-taririco', smiles: 'CCCCCCCCCCCC#CCCCCC(=O)O', nombre: 'ácido tarírico', familia: 'ácido graso con triple enlace', clase: 'lípido (ácido graso)', solubilidad: 'insoluble en agua',
      dato: 'Uno de los pocos ácidos grasos naturales con un triple enlace; está en semillas de plantas del género Picramnia.' },
    // Antibiótico
    { id: 'penicilina-g', smiles: 'CC1(C)S[C@@H]2[C@H](NC(=O)Cc3ccccc3)C(=O)N2[C@H]1C(=O)O', nombre: 'penicilina G', familia: 'antibiótico natural (del hongo Penicillium)', clase: 'β-lactama', solubilidad: 'su sal de potasio es soluble en agua',
      dato: 'Antibiótico que se obtiene del hongo Penicillium. El anillo de cuatro con el C=O y el N (β-lactama) es la parte activa.' },
  ];

  // COORDENADAS (las escribe coordenadas.py; no editar a mano)
  const COORDENADAS = {
    'fenilalanina': [[-0.826,1.12],[-1.079,0.153],[-0.368,-0.55],[0.597,-0.285],[1.308,-0.988],[2.273,-0.723],[2.525,0.244],[1.814,0.947],[0.85,0.682],[-2.043,-0.112],[-2.296,-1.079],[-2.755,0.591]],
    'tirosina': [[-0.826,1.12],[-1.079,0.153],[-0.368,-0.55],[0.597,-0.285],[1.308,-0.988],[2.273,-0.723],[2.525,0.244],[3.49,0.509],[1.814,0.947],[0.85,0.682],[-2.043,-0.112],[-2.296,-1.079],[-2.755,0.591]],
    'triptofano': [[-0.826,1.12],[-1.079,0.153],[-0.368,-0.55],[0.597,-0.285],[0.949,0.651],[1.948,0.604],[2.213,-0.36],[3.107,-0.808],[3.165,-1.807],[2.33,-2.357],[1.436,-1.908],[1.378,-0.91],[-2.043,-0.112],[-2.296,-1.079],[-2.755,0.591]],
    'glucosa-abierta': [[0.8,0.6],[0.0,-0.0],[0.0,-1.0],[1.0,-1.0],[0.0,-2.0],[-1.0,-2.0],[0.0,-3.0],[1.0,-3.0],[0.0,-4.0],[1.0,-4.0],[0.0,-5.0],[0.8,-5.6]],
    'glucosa-ciclica': [[2.437,0.763],[1.875,-0.065],[0.878,0.008],[0.442,0.908],[-0.555,0.981],[-0.991,1.881],[-1.117,0.154],[-2.114,0.227],[-0.681,-0.746],[-1.243,-1.574],[0.316,-0.819],[0.752,-1.719]],
    'fructosa': [[0.8,0.6],[0.0,-0.0],[0.0,-1.0],[1.0,-1.0],[0.0,-2.0],[-1.0,-2.0],[0.0,-3.0],[1.0,-3.0],[0.0,-4.0],[1.0,-4.0],[0.0,-5.0],[0.8,-5.6]],
    'sacarosa': [[-1.438,-2.36],[-2.163,-1.672],[-1.929,-0.699],[-0.97,-0.416],[-0.737,0.557],[0.222,0.84],[0.947,0.152],[0.187,-0.497],[0.369,-1.481],[1.556,0.945],[2.499,0.611],[3.323,1.177],[4.226,0.747],[2.473,-0.389],[3.266,-0.997],[1.514,-0.672],[1.18,-1.615],[-1.462,1.245],[-1.228,2.218],[-2.421,0.961],[-3.146,1.65],[-2.654,-0.011],[-3.613,-0.295]],
    'retinol': [[-1.638,-1.559],[-2.467,-1.0],[-2.398,-0.002],[-3.227,0.557],[-3.815,1.365],[-2.533,1.276],[-4.126,0.118],[-4.195,-0.88],[-3.366,-1.439],[-1.499,0.437],[-0.67,-0.122],[0.229,0.317],[0.298,1.314],[1.058,-0.242],[1.957,0.197],[2.786,-0.362],[3.684,0.077],[3.754,1.075],[4.514,-0.482],[5.412,-0.043],[6.242,-0.602]],
    'retinal': [[-1.638,-1.559],[-2.467,-1.0],[-2.398,-0.002],[-3.227,0.557],[-3.815,1.365],[-2.533,1.276],[-4.126,0.118],[-4.195,-0.88],[-3.366,-1.439],[-1.499,0.437],[-0.67,-0.122],[0.229,0.317],[0.298,1.314],[1.058,-0.242],[1.957,0.197],[2.786,-0.362],[3.684,0.077],[3.754,1.075],[4.514,-0.482],[5.412,-0.043],[6.242,-0.602]],
    'acido-retinoico': [[-1.638,-1.559],[-2.467,-1.0],[-2.398,-0.002],[-3.227,0.557],[-3.815,1.365],[-2.533,1.276],[-4.126,0.118],[-4.195,-0.88],[-3.366,-1.439],[-1.499,0.437],[-0.67,-0.122],[0.229,0.317],[0.298,1.314],[1.058,-0.242],[1.957,0.197],[2.786,-0.362],[3.684,0.077],[3.754,1.075],[4.514,-0.482],[5.412,-0.043],[5.482,0.955],[6.242,-0.602]],
    'beta-caroteno': [[-1.638,-1.559],[-2.467,-1.0],[-2.398,-0.002],[-3.227,0.557],[-3.815,1.365],[-2.533,1.276],[-4.126,0.118],[-4.195,-0.88],[-3.366,-1.439],[-1.499,0.437],[-0.67,-0.122],[0.229,0.317],[0.298,1.314],[1.058,-0.242],[1.957,0.197],[2.786,-0.362],[3.684,0.077],[3.754,1.075],[4.514,-0.482],[5.412,-0.043],[6.242,-0.602],[7.14,-0.163],[7.97,-0.722],[7.9,-1.719],[8.868,-0.283],[9.697,-0.842],[10.596,-0.403],[11.425,-0.961],[11.356,-1.959],[12.324,-0.523],[13.153,-1.081],[14.052,-0.642],[14.881,-1.201],[14.812,-2.199],[15.78,-0.762],[15.849,0.235],[15.02,0.794],[14.121,0.355],[13.127,0.25],[13.845,1.316]],
    'vitamina-c': [[-2.785,0.319],[-1.792,0.437],[-1.193,-0.363],[-1.586,-1.282],[-0.2,-0.244],[0.48,-0.978],[1.388,-0.558],[2.261,-1.045],[1.269,0.435],[2.002,1.115],[0.288,0.629],[-0.132,1.536]],
    'nicotinamida': [[1.722,-0.866],[1.222,0.0],[1.722,0.866],[0.222,-0.0],[-0.278,0.866],[-1.278,0.866],[-1.778,0.0],[-1.278,-0.866],[-0.278,-0.866]],
    'vitamina-e': [[-1.047,-2.446],[-1.79,-1.777],[-1.583,-0.799],[-0.633,-0.489],[-2.327,-0.13],[-2.12,0.848],[-2.864,1.516],[-3.334,2.399],[-2.076,2.133],[-1.149,1.759],[-0.361,2.375],[0.566,2.002],[1.354,2.618],[0.706,1.011],[1.634,0.638],[1.774,-0.352],[2.701,-0.726],[2.841,-1.716],[3.489,-0.11],[4.416,-0.484],[5.204,0.133],[6.131,-0.241],[6.919,0.375],[6.271,-1.231],[-3.814,1.207],[-4.022,0.228],[-3.278,-0.44],[-3.485,-1.419],[-4.436,-1.728],[-2.741,-2.087],[-2.948,-3.065]],
    'vitamina-d3': [[2.922,-1.333],[3.66,-0.658],[4.614,-0.96],[5.351,-0.284],[5.135,0.692],[5.873,1.367],[4.182,0.993],[3.444,0.318],[2.491,0.619],[1.753,-0.056],[0.799,0.245],[0.583,1.222],[-0.37,1.523],[-1.108,0.848],[-0.892,-0.129],[-1.872,0.071],[0.062,-0.43],[0.07,-1.43],[-0.879,-1.747],[-1.473,-0.942],[-2.473,-0.951],[-2.966,-1.821],[-2.98,-0.089],[-3.98,-0.097],[-4.487,0.765],[-5.487,0.757],[-5.994,1.619],[-5.98,-0.113]],
    'colesterol': [[-3.011,-1.693],[-2.26,-1.032],[-2.457,-0.052],[-3.404,0.268],[-3.601,1.248],[-4.548,1.568],[-4.745,2.549],[-5.299,0.908],[-1.312,-1.352],[-1.014,-2.307],[-0.014,-2.318],[0.306,-1.371],[1.224,-0.974],[2.026,-1.571],[2.944,-1.175],[3.06,-0.182],[3.978,0.215],[4.094,1.208],[5.012,1.604],[3.292,1.805],[2.374,1.409],[2.258,0.415],[1.455,1.012],[1.34,0.019],[0.537,0.616],[-0.381,0.22],[-0.497,-0.774],[-1.357,-0.264]],
    'testosterona': [[-2.416,1.079],[-1.849,0.255],[-1.327,1.108],[-0.327,1.082],[0.15,0.203],[-0.372,-0.65],[0.105,-1.528],[1.105,-1.554],[1.627,-0.702],[2.627,-0.728],[3.149,0.125],[4.149,0.099],[2.672,1.004],[1.672,1.03],[1.15,0.177],[0.672,1.056],[-1.372,-0.623],[-2.06,-1.349],[-2.963,-0.918],[-2.832,0.073],[-3.558,0.761]],
    'estradiol': [[-2.416,1.079],[-1.849,0.255],[-1.327,1.108],[-0.327,1.082],[0.15,0.203],[-0.372,-0.65],[0.105,-1.528],[1.105,-1.554],[1.627,-0.702],[2.627,-0.728],[3.149,0.125],[4.149,0.099],[2.672,1.004],[1.672,1.03],[1.15,0.177],[-1.372,-0.623],[-2.06,-1.349],[-2.963,-0.918],[-2.832,0.073],[-3.558,0.761]],
    'quercetina': [[1.497,2.057],[1.069,1.154],[0.072,1.072],[-0.497,1.895],[-0.356,0.168],[-1.352,0.087],[-1.921,0.91],[-2.918,0.828],[-3.346,-0.075],[-4.343,-0.157],[-2.777,-0.898],[-3.205,-1.802],[-1.78,-0.817],[0.213,-0.654],[1.21,-0.573],[1.778,-1.395],[2.775,-1.314],[3.344,-2.137],[3.203,-0.41],[2.634,0.412],[3.062,1.316],[1.638,0.331]],
    'curcumina': [[-6.743,0.092],[-5.911,-0.462],[-5.015,-0.017],[-4.182,-0.571],[-3.286,-0.127],[-2.453,-0.68],[-1.558,-0.236],[-0.725,-0.789],[-0.788,-1.787],[0.171,-0.345],[1.004,-0.898],[0.941,-1.896],[1.9,-0.454],[2.732,-1.007],[3.628,-0.563],[4.461,-1.117],[5.357,-0.672],[5.42,0.326],[6.316,0.77],[4.587,0.879],[4.65,1.877],[3.817,2.431],[3.691,0.435],[-3.223,0.871],[-4.056,1.425],[-4.952,0.981],[-5.785,1.534]],
    'capsaicina': [[-6.856,0.065],[-5.934,0.452],[-5.809,1.444],[-5.138,-0.152],[-4.216,0.235],[-3.419,-0.37],[-2.497,0.018],[-1.701,-0.587],[-0.779,-0.199],[0.017,-0.804],[-0.108,-1.796],[0.939,-0.417],[1.736,-1.021],[2.658,-0.634],[3.454,-1.238],[4.376,-0.851],[4.501,0.141],[5.423,0.529],[3.705,0.746],[3.83,1.738],[3.034,2.343],[2.783,0.358]],
    'cafeina': [[2.253,-0.896],[1.627,-0.115],[1.891,0.849],[1.055,1.398],[0.275,0.773],[0.628,-0.163],[-0.005,-0.937],[0.349,-1.872],[-0.992,-0.775],[-1.625,-1.549],[-1.345,0.16],[-2.332,0.322],[-0.712,0.934],[-1.066,1.87]],
    'adenina': [[-1.08,1.562],[-0.802,0.601],[-1.495,-0.12],[-1.218,-1.081],[-0.247,-1.32],[0.446,-0.6],[1.446,-0.633],[1.786,0.308],[0.996,0.922],[0.169,0.361]],
    'tiroxina': [[-0.826,1.12],[-1.079,0.153],[-0.368,-0.55],[0.597,-0.285],[1.308,-0.988],[2.273,-0.723],[2.984,-1.426],[2.525,0.244],[3.49,0.509],[4.201,-0.194],[3.948,-1.161],[4.66,-1.864],[4.407,-2.831],[5.624,-1.599],[6.335,-2.302],[5.877,-0.632],[6.841,-0.367],[5.166,0.071],[1.814,0.947],[2.067,1.915],[0.85,0.682],[-2.043,-0.112],[-2.296,-1.079],[-2.755,0.591]],
    'alicina': [[-2.656,0.835],[-1.684,0.602],[-1.4,-0.357],[-0.427,-0.59],[-0.143,-1.549],[0.261,0.135],[1.233,-0.098],[1.922,0.627],[2.894,0.394]],
    'acido-citrico': [[-2.5,0.564],[-1.5,0.564],[-1.0,1.43],[-1.0,-0.302],[-0.0,-0.302],[0.0,0.698],[1.0,-0.302],[1.5,0.564],[1.0,1.43],[2.5,0.564],[-0.0,-1.302],[-0.866,-1.802],[0.866,-1.802]],
    'acido-piruvico': [[1.0,0.866],[0.5,0.0],[1.0,-0.866],[-0.5,-0.0],[-1.0,0.866],[-1.0,-0.866]],
    'acido-oleico': [[7.108,1.8],[6.109,1.742],[5.66,0.849],[4.662,0.791],[4.213,-0.103],[3.215,-0.161],[2.766,-1.054],[1.767,-1.112],[1.318,-2.006],[0.32,-2.063],[-0.229,-1.228],[-1.228,-1.286],[-1.777,-0.45],[-2.775,-0.508],[-3.325,0.328],[-4.323,0.27],[-4.872,1.106],[-5.87,1.048],[-6.32,0.154],[-6.42,1.883]],
    'acido-taririco': [[-8.169,0.146],[-7.256,0.554],[-6.447,-0.033],[-5.534,0.375],[-4.724,-0.212],[-3.811,0.195],[-3.001,-0.392],[-2.088,0.016],[-1.278,-0.571],[-0.365,-0.163],[0.444,-0.75],[1.358,-0.342],[2.271,0.065],[3.184,0.473],[3.993,-0.114],[4.906,0.294],[5.716,-0.293],[6.629,0.115],[6.733,1.109],[7.439,-0.472]],
    'penicilina-g': [[-1.717,-2.05],[-1.991,-1.088],[-2.919,-1.461],[-1.006,-0.916],[-0.866,0.074],[-0.426,0.972],[0.52,1.296],[1.274,0.639],[1.082,-0.343],[2.22,0.963],[2.974,0.305],[2.781,-0.676],[3.535,-1.333],[4.481,-1.009],[4.673,-0.028],[3.92,0.629],[-1.324,1.412],[-1.648,2.358],[-1.764,0.514],[-2.459,-0.205],[-3.45,-0.064],[-4.066,-0.851],[-3.823,0.864]],
  };
  // FIN COORDENADAS

  const POR_ID = {};
  for (const m of LISTA) { POR_ID[m.id] = m; m.coords = COORDENADAS[m.id] || null; }
  return { LISTA, POR_ID, COORDENADAS };
});
