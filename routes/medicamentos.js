const express = require("express");
const router = express.Router();

// GET /medicamentos
router.get("/", (req, res) => {
  res.json(req.medicamentos);
});

// GET /medicamentos/:id
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const encontrado = req.medicamentos.find(m => m.id === id);
  if (!encontrado) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
  res.json(encontrado);
});

// GET /medicamentos/filtro/:droga
router.get("/filtro/:droga", (req, res) => {
  const droga = req.params.droga.toLowerCase();
  const resultados = req.medicamentos.filter(m => m.DROGA && m.DROGA.toLowerCase().includes(droga));
  if (resultados.length === 0) return res.status(404).json({ mensaje: "No se encontraron medicamentos con esa droga" });
  res.json(resultados);
});

// GET /medicamentos/filtro2/:laboratorio
/*router.get("/filtro2/:laboratorio", (req, res) => {
  const laboratorio = req.params.laboratorio.toLowerCase();
  const resultados = req.medicamentos.filter(m => m.LABORATORIO && m.LABORATORIO.toLowerCase().includes(laboratorio));
  if (resultados.length === 0) return res.status(404).json({ mensaje: "No se encontraron medicamentos con ese laboratorio" });
  res.json(resultados);
}); */


// POST /medicamentos
router.post("/", (req, res) => {
  const nuevo = req.body;
  if (!nuevo.DROGA || !nuevo.MARCA) {
    return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
  }
  nuevo.id = req.nextId();
  req.medicamentos.push(nuevo);
  res.status(201).json({ mensaje: "Medicamento agregado", data: nuevo });
});

// PUT /medicamentos/:id
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = req.medicamentos.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
  req.medicamentos[index] = { ...req.body, id };
  res.json({ mensaje: "Medicamento actualizado", data: req.medicamentos[index] });
});

// DELETE /medicamentos/:id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existe = req.medicamentos.find(m => m.id === id);
  if (!existe) return res.status(404).json({ mensaje: "Medicamento no encontrado para eliminar" });
  req.medicamentos = req.medicamentos.filter(m => m.id !== id);
  res.sendStatus(204);
});



// GET /medicamentos/ordenar/:campo
/*
router.get("/ordenar/:campo", (req, res) => {
  const campo = req.params.campo.toUpperCase();
  const copia = [...req.medicamentos];

  if (!copia[0] || !(campo in copia[0])) {
    return res.status(400).json({ mensaje: `Campo '${campo}' no válido` });
  }

  copia.sort((a, b) => {
    const valorA = (a[campo] || "").toLowerCase();
    const valorB = (b[campo] || "").toLowerCase();
    return valorA.localeCompare(valorB);
  });

  res.json(copia);
});
*/

module.exports = router;
