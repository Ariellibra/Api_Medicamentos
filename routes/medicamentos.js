const express = require("express");
const router = express.Router();
const db = require("../db");
const catchAsync = require("../utils/catchAsync");

// GET /medicamentos
router.get("/", catchAsync( async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM medicamentos");
  res.json(rows);
}));
// router.get("/", (req, res) => {
//   res.json(req.medicamentos);
// });


// GET /medicamentos/:id
router.get("/:id", catchAsync( async (req, res) => {
  const [rows] = await db.query("SELECT * FROM medicamentos WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
  res.json(rows[0]);
}));
// router.get("/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const encontrado = req.medicamentos.find(m => m.id === id);
//   if (!encontrado) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
//   res.json(encontrado);
// });

// GET /medicamentos/filtro/:droga
router.get("/filtro/:droga", catchAsync(async (req, res) => {
  const droga = `%${req.params.droga}%`;
  const [rows] = await db.query("SELECT * FROM medicamentos WHERE droga LIKE ?", [droga])
  if (rows.length === 0) return res.status(404).json({ mensaje: "No se encontraron medicamentos con esa droga" })
  res.json(rows);
}));
// router.get("/filtro/:droga", (req, res) => {
//   const droga = req.params.droga.toLowerCase();
//   const resultados = req.medicamentos.filter(m => m.DROGA && m.DROGA.toLowerCase().includes(droga));
//   if (resultados.length === 0) return res.status(404).json({ mensaje: "No se encontraron medicamentos con esa droga" });
//   res.json(resultados);
// });

// GET /medicamentos/laboratorio/:nombre
router.get("/laboratorio/:nombre", catchAsync(async (req, res) => {
  const laboratorio = `%${req.params.nombre}%`;
  const [rows] = await db.query("SELECT * FROM medicamentos WHERE laboratorio LIKE ?", [laboratorio])
  if (rows.length === 0) return res.status(404).json({ mensaje: "No se encontraron medicamentos de ese laboratorio" })
  res.json(rows);
}));
// router.get("/laboratorio/:nombre", (req, res) => {
//   const nombre = req.params.nombre.toLowerCase();
//   const resultados = req.medicamentos.filter(m =>
//     m.LABORATORIO && m.LABORATORIO.toLowerCase().includes(nombre)
//   );
//   if (resultados.length === 0) {
//     return res.status(404).json({ mensaje: "No se encontraron medicamentos de ese laboratorio" });
//   }
//   res.json(resultados);
// });

// POST /medicamentos
router.post("/", catchAsync(async (req, res) => {
  const { DROGA, MARCA, PRESENTACION, LABORATORIO, COBERTURA, COPAGO } = req.body;

  if (!DROGA || !MARCA) return res.status(400).json({ mensaje: "Faltan campos obligatorios" });

  const [result] = await db.query(`INSTERT INTO medicamentos (droga, marca, presentacion, laboratorio, cobertura, copago) 
    VALUES (?, ?, ?, ?, ?, ?)`, [DROGA, MARCA, PRESENTACION, LABORATORIO, COBERTURA, COPAGO]);
  res.status(201).json({ mensaje: "Medicamento agregado", id: result.insertId });
}));
// router.post("/", (req, res) => {
//   const nuevo = req.body;
//   if (!nuevo.DROGA || !nuevo.MARCA) {
//     return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
//   }
//   nuevo.id = req.nextId();
//   req.medicamentos.push(nuevo);
//   res.status(201).json({ mensaje: "Medicamento agregado", data: nuevo });
// });

// PUT /medicamentos/:id
router.put("/:id", catchAsync(async (req, res) => {
  const id = parseInt(req.params.id);
  const { DROGA, MARCA, PRESENTACION, LABORATORIO, COBERTURA, COPAGO } = req.body;

  const [result] = await db.query(
    `UPDATE medicamentos SET droga=?, marca=?, presentacion=?, laboratorio=?, cobertura=?, copago=?
    WHERE id=?`,
    [DROGA, MARCA, PRESENTACION, LABORATORIO, COBERTURA, COPAGO, id]
  );

  if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Medicamento no encontrado" });

  res.json({ mensaje: "Medicamento actualizado" });
  
}));
// router.put("/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = req.medicamentos.findIndex(m => m.id === id);
//   if (index === -1) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
//   req.medicamentos[index] = { ...req.body, id };
//   res.json({ mensaje: "Medicamento actualizado", data: req.medicamentos[index] });
// });

// DELETE /medicamentos/:id
router.delete("/:id", catchAsync(async (req, res) => {
  const id = parseInt(req.params.id);
  const [result] = await db.query("DELETE FROM medicamentos WHERE id = ?", [id]);
  if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
  res.sendStatus(204);
}));
// router.delete("/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const existe = req.medicamentos.find(m => m.id === id);
//   if (!existe) return res.status(404).json({ mensaje: "Medicamento no encontrado para eliminar" });
//   req.medicamentos = req.medicamentos.filter(m => m.id !== id);
//   res.sendStatus(204);
// });



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
