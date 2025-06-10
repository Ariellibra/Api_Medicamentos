const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /medicamentos - Lista todos los medicamentos con nombre del laboratorio
router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT m.id, m.droga, m.marca, m.presentacion,
       l.nombre AS laboratorio,
       m.cobertura, m.copago
      FROM medicamentos m
      JOIN laboratorios l ON m.laboratorio_id = l.id
      ORDER BY m.id ASC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /medicamentos/filtro/:droga - Buscar por droga
router.get("/filtro/:droga", async (req, res, next) => {
  try {
    const droga = `%${req.params.droga}%`;
    const [rows] = await db.query(`
      SELECT m.id, m.droga, m.marca, m.presentacion,
             l.nombre AS laboratorio,
             m.cobertura, m.copago
      FROM medicamentos m
      JOIN laboratorios l ON m.laboratorio_id = l.id
      WHERE m.droga LIKE ?
    `, [droga]);
    if (!rows.length) return res.status(404).json({ mensaje: "No se encontraron medicamentos con esa droga" });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /medicamentos/filtro/:marca - Buscar por marca
router.get("/marca/:nombre", async (req, res, next) => {
  try {
    const nombre = `%${req.params.nombre}%`;
    const [rows] = await db.query(`
      SELECT m.id, m.nombre, m.marca, m.presentacion,
             l.nombre AS laboratorio,
             m.cobertura, m.copago
      FROM medicamentos m
      JOIN laboratorios l ON m.laboratorio_id = l.id
      WHERE m.nombre LIKE ?
    `, [nombre]);
    if (!rows.length) return res.status(404).json({ mensaje: "No se encontraron medicamentos con esa nombre" });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /medicamentos/laboratorio/:nombre - Buscar por nombre de laboratorio
router.get("/laboratorio/:nombre", async (req, res, next) => {
  try {
    const nombre = `%${req.params.nombre}%`;
    const [rows] = await db.query(`
      SELECT m.id, m.droga, m.marca, m.presentacion,
             l.nombre AS laboratorio,
             m.cobertura, m.copago
      FROM medicamentos m
      JOIN laboratorios l ON m.laboratorio_id = l.id
      WHERE l.nombre LIKE ?
    `, [nombre]);
    if (!rows.length) return res.status(404).json({ mensaje: "No se encontraron medicamentos de ese laboratorio" });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /medicamentos - Crear medicamento
router.post("/", async (req, res, next) => {
  try {
    const { DROGA, MARCA, PRESENTACION, LABORATORIO, COBERTURA, COPAGO } = req.body;
    if (!DROGA || !MARCA || !LABORATORIO) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    // Buscar el ID del laboratorio
    const [[lab]] = await db.query("SELECT id FROM laboratorios WHERE nombre = ?", [LABORATORIO]);
    if (!lab) return res.status(404).json({ mensaje: "Laboratorio no encontrado" });

    const [result] = await db.query(
      `INSERT INTO medicamentos (droga, marca, presentacion, laboratorio_id, cobertura, copago)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [DROGA, MARCA, PRESENTACION, lab.id, COBERTURA, COPAGO]
    );

    res.status(201).json({ mensaje: "Medicamento agregado", id: result.insertId });
  } catch (err) {
    next(err);
  }
});

// PUT /medicamentos/:id - Actualizar medicamento
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const { DROGA, MARCA, PRESENTACION, LABORATORIO, COBERTURA, COPAGO } = req.body;

    const [[lab]] = await db.query("SELECT id FROM laboratorios WHERE nombre = ?", [LABORATORIO]);
    if (!lab) return res.status(404).json({ mensaje: "Laboratorio no encontrado" });

    const [result] = await db.query(
      `UPDATE medicamentos SET droga=?, marca=?, presentacion=?, laboratorio_id=?, cobertura=?, copago=? WHERE id=?`,
      [DROGA, MARCA, PRESENTACION, lab.id, COBERTURA, COPAGO, id]
    );

    if (!result.affectedRows) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
    res.json({ mensaje: "Medicamento actualizado" });
  } catch (err) {
    next(err);
  }
});

// DELETE /medicamentos/:id - Eliminar medicamento
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const [result] = await db.query("DELETE FROM medicamentos WHERE id=?", [id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// GET /medicamentos/:id - Buscar medicamento por ID
router.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT m.id, m.droga, m.marca, m.presentacion,
             l.nombre AS laboratorio,
             m.cobertura, m.copago
      FROM medicamentos m
      JOIN laboratorios l ON m.laboratorio_id = l.id
      WHERE m.id = ?
    `, [req.params.id]);

    if (!rows.length) return res.status(404).json({ mensaje: "Medicamento no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
