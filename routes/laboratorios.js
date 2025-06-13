const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /laboratorios - Listar todos los laboratorios
router.get("/", async (_req, res, next) => {
    try {
        const [rows] = await db.query("SELECT * FROM laboratorios");
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /laboratorios/:id - Obtener un laboratorio por ID
router.get("/:id", async (req, res, next) => {
    try {
        const [rows] = await db.query("SELECT * FROM laboratorios WHERE id = ?", [req.params.id]);
        if (!rows.length) return res.status(404).json({ mensaje: "Laboratorio no encontrado" });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST /laboratorios - Crear un nuevo laboratorio
router.post("/", async (req, res, next) => {
    try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ mensaje: "Falta el nombre del laboratorio" });

        const [result] = await db.query("INSERT INTO laboratorios (nombre) VALUES (?)", [nombre]);
        res.status(201).json({ mensaje: "Laboratorio creado", id: result.insertId });
    } catch (err) {
        next(err);
    }
});

// PUT /laboratorios/:id - Actualizar laboratorio
router.put("/:id", async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const id = +req.params.id;
        if (!nombre) return res.status(400).json({ mensaje: "Falta el nombre del laboratorio" });

        const [result] = await db.query("UPDATE laboratorios SET nombre = ? WHERE id = ?", [nombre, id]);
        if (!result.affectedRows) return res.status(404).json({ mensaje: "Laboratorio no encontrado" });

        res.json({ mensaje: "Laboratorio actualizado" });
    } catch (err) {
        next(err);
    }
});

// DELETE /laboratorios/:id - Eliminar laboratorio
router.delete("/:id", async (req, res, next) => {
    try {
        const id = +req.params.id;
        const [result] = await db.query("DELETE FROM laboratorios WHERE id = ?", [id]);
        if (!result.affectedRows) return res.status(404).json({ mensaje: "Laboratorio no encontrado" });
        res.sendStatus(204);
        res.json({ mensaje: "Laboratorio eliminado" });
    } catch (err) {
        next(err);
    }
});

// GET /laboratorios/:id/medicamentos/count - cantidad de medicamentos asociados a un laboratorio
router.get("/:id/medicamentos/count", async (req, res) => {
    try {
        const id = +req.params.id;
        const [rows] = await db.query(
            "SELECT COUNT(*) as total FROM medicamentos WHERE laboratorio_id = ?",
            [id]
        );
        res.json({ total: rows[0].total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
