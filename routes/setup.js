const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("../db");

console.log("Cargando rutas de setup...");

router.post("/", async (_req, res) => {
  try {
    /* 1. Crear las tablas si no existen */
    console.log("Creando tablas...");

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
        FOREIGN KEY (laboratorio_id) REFERENCES laboratorios(id)
      );
    `);

    /* 2. Vaciar las tablas */
    console.log("Vaciando tablas...");
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE medicamentos");
    await db.query("TRUNCATE TABLE laboratorios");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");

    /* 3. Leer el CSV */
    const file = path.join(__dirname, "..", "data", "medicamentos.csv");
    console.log("Leyendo CSV:", file);
    const rows = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(file)
        .pipe(csv({ separator: ";" }))
        .on("data", (d) => {
          if (d && Object.keys(d)[0].charCodeAt(0) === 0xFEFF) {
            const clean = {};
            for (const k in d) {
              const cleanKey = k.replace(/^\uFEFF/, "");
              clean[cleanKey] = d[k];
            }
            d = clean;
          }

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
        .on("end", resolve)
        .on("error", reject);
    });

    /* 4. Insertar laboratorios únicos */
    console.log("Insertando laboratorios únicos...");
    const laboratorioSet = new Set(rows.map(r => r[3]));
    const laboratorioArr = [...laboratorioSet].map(nombre => [nombre]);
    await db.query("INSERT INTO laboratorios (nombre) VALUES ?", [laboratorioArr]);

    /* 5. Obtener todos los laboratorios con sus IDs */
    const [labs] = await db.query("SELECT id, nombre FROM laboratorios");
    const labMap = new Map(labs.map(l => [l.nombre, l.id]));

    /* 6. Preparar rows medicamentos */
    const medsToInsert = rows.map(([droga, marca, presentacion, laboratorio, cobertura, copago]) => [
      droga,
      marca,
      presentacion,
      labMap.get(laboratorio) || null,
      cobertura,
      copago
    ]);

    await db.query(
      `INSERT INTO medicamentos (droga, marca, presentacion, laboratorio_id, cobertura, copago)
       VALUES ?`,
      [medsToInsert]
    );

    /* 7. Actualizar cantidad de medicamentos por laboratorio */
    for (const [nombre, id] of labMap.entries()) {
      const [r] = await db.query("SELECT COUNT(*) as total FROM medicamentos WHERE laboratorio_id = ?", [id]);
      await db.query("UPDATE laboratorios SET cantMedicamentos = ? WHERE id = ?", [r[0].total, id]);
    }

    res.json({ ok: true, mensaje: "Medicamentos y laboratorios cargados correctamente", inserted: medsToInsert.length });

  } catch (err) {
    console.error("🔥 Error en /setup:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
