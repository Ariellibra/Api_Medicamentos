const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("../db");

router.post("/", async (_req, res) => {
  /* 1. Crear la tabla si no existe */
  console.log("Creando tabla...");
  await db.query(`
    CREATE TABLE IF NOT EXISTS medicamentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      droga VARCHAR(255),
      marca VARCHAR(255),
      presentacion VARCHAR(255),
      laboratorio VARCHAR(255),
      cobertura DECIMAL(5,2),
      copago DECIMAL(10,2)
    );
  `);

  /* 2. Vaciar la tabla (opcional) */
  console.log("Vaciando tabla...");
  await db.query("TRUNCATE TABLE medicamentos");

  /* 3. Leer CSV y preparar datos */
  const file = path.join(__dirname, "..", "data", "medicamentos.csv");
  console.log("Leyendo CSV:", file);
  const rows = [];

  fs.createReadStream(file)
    .pipe(csv({ separator: ";" }))
    .on("data", (d) => {
      // limpiar signos $ y % y espacios
      const cobertura = parseFloat(String(d.COBERTURA).replace("%", "").trim());
      const copago = parseFloat(String(d.COPAGO).replace("$", "").replace(",", "").trim());

      rows.push([
        d.DROGA?.trim(),
        d.MARCA?.trim(),
        d.PRESENTACION?.trim(),
        d.LABORATORIO?.trim(),
        cobertura,
        copago
      ]);
    })
    .on("end", async () => {
      /* 4. Insertar en bloque */
      await db.query(
        `INSERT INTO medicamentos
         (droga, marca, presentacion, laboratorio, cobertura, copago)
         VALUES ?`,
        [rows]
      );
      res.json({ ok: true, inserted: rows.length });
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).json({ ok: false, error: err.message });
    });
});

module.exports = router;
