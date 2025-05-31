const express = require("express");
const router = express.Router();
const db = require("../db");
const catchAsync = require("../utils/catchAsync");

// GET /medicamentos
router.get("/", catchAsync(async (_req, res) => {
  const [rows] = await db.query("SELECT * FROM medicamentos");
  res.json(rows);
}));

// GET /medicamentos/filtro/:droga
router.get("/filtro/:droga", catchAsync(async (req, res) => {
  const droga = `%${req.params.droga}%`;
  const [rows] = await db.query("SELECT * FROM medicamentos WHERE droga LIKE ?", [droga]);
  if (rows.length === 0) return res.status(404).json({ mensaje: "No se encontraron medicamentos con esa droga" });
  res.json(rows);
}));

// GET /medicamentos/laboratorio/:nombre
router.get("/laboratorio/:nombre", catchAsync(async (req, res) => {
  const laboratorio = `%${req.params.nombre}%`;
  const [rows] = await db.query("SELECT * FROM medicamentos WHERE laboratorio LIKE ?", [laboratorio]);
  if (rows.length === 0) return res.status(404).json({ mensaje: "No se encontraron medicamentos de ese laboratorio" });
  res.json(rows);
}));

// POST /medicamentos
router.post("/", catchAsync(async (req, res) => {
  const { DROGA, MARCA, PRESENTACION, LABORATORIO, COBERTURA, COPAGO } = req.body;

  if (!DROGA || !MARCA) return res.status(400).json({ mensaje: "Faltan campos obligatorios" });

  const [result] = await db.query(`INSERT INTO medicamentos (droga, marca, presentacion, laboratorio, cobertura, copago) 
    VALUES (?, ?, ?, ?, ?, ?)`, [DROGA, MARCA, PRESENTACION, LABORATORIO, COBERTURA, COPAGO]);
  res.status(201).json({ mensaje: "Medicamento agregado", id: result.insertId });
}));

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

// DELETE /medicamentos/:id
router.delete("/:id", catchAsync(async (req, res) => {
  const id = parseInt(req.params.id);
  const [result] = await db.query("DELETE FROM medicamentos WHERE id = ?", [id]);
  if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
  res.sendStatus(204);
}));

// GET /medicamentos/:id
router.get("/:id", catchAsync(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM medicamentos WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
  res.json(rows[0]);
}));

module.exports = router;
