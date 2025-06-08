const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("../db");

console.log("Cargando rutas de setup...");
router.post("/", async (_req, res) => {
  /* 1. Crear la tabla si no existe */
  console.log("Creando tabla...");

  await db.query(`
    CREATE TABLE IF NOT EXISTS laboratorios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) UNIQUE,
      cantMedicamentos INT DEFAULT 0
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS medicamentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      droga VARCHAR(255),
      marca VARCHAR(255),
      presentacion VARCHAR(255),
      laboratorio_id INT,
      cobertura DECIMAL(5,2),
      copago DECIMAL(10,2),
      FOREIGN KEY (laboratorio_id) REFERENCES laboratorios(id) ON DELETE SET NULL
    );
  `);

  /* 2. Vaciar la tabla (opcional) */
  console.log("Vaciando tabla...");
  await db.query("TRUNCATE TABLE medicamentos");
  await db.query("TRUNCATE TABLE laboratorios");

  /* 3. Leer CSV y preparar datos */
  const file = path.join(__dirname, "..", "data", "medicamentos.csv");
  console.log("Leyendo CSV:", file);
  const rows = [];

  fs.createReadStream(file)
    .pipe(csv({ separator: ";" }))
    .on("data", (d) => {

      if (d && Object.keys(d)[0].charCodeAt(0) === 0xFEFF) {
        const clean = {};
        for (const k in d) {
          const cleanKey = k.replace(/^\uFEFF/, ""); // elimina el BOM si existe
          clean[cleanKey] = d[k];
        }
        d = clean;
      }

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
      const laboratoriosMap = new Map(); // nombre → id

      for (const med of rows) {
        const nombre = med[3]; // LABORATORIO

        if (!laboratoriosMap.has(nombre)) {
          const [r] = await db.query("INSERT INTO laboratorios (nombre, cantMedicamentos) VALUES (?, ?)", [nombre, 0]);
          laboratoriosMap.set(nombre, r.insertId);
        }

        // esta línea no hace nada útil:
        // laboratoriosMap.set(nombre, laboratoriosMap.get(nombre));
        // podés borrarla
      }

      for (const med of rows) {
        const [droga, marca, presentacion, laboratorioNombre, cobertura, copago] = med;
        const laboratorioId = laboratoriosMap.get(laboratorioNombre);

        await db.query(
          `INSERT INTO medicamentos (droga, marca, presentacion, laboratorio_id, cobertura, copago)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [droga, marca, presentacion, laboratorioId, cobertura, copago]
        );
      }

      for (const [_, id] of laboratoriosMap) {
        const [r] = await db.query("SELECT COUNT(*) as total FROM medicamentos WHERE laboratorio_id = ?", [id]);
        await db.query("UPDATE laboratorios SET cantMedicamentos = ? WHERE id = ?", [r[0].total, id]);
      }

      res.json({ ok: true, mensaje: "Medicamentos y laboratorios cargados correctamente" });
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).json({ ok: false, error: err.message });
    });

});

module.exports = router;
