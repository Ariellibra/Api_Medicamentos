// test-db.js
require("dotenv").config(); // Carga el archivo .env
const db = require("./db"); // Tu módulo de conexión

async function testConnection() {
    try {
        const [rows] = await db.query("SELECT NOW() AS fecha");
        console.log("✅ Conexión exitosa. Fecha del servidor MySQL:", rows[0].fecha);
        process.exit(0);
    } catch (err) {
        console.error("❌ Error de conexión:", err.message);
        process.exit(1);
    }
}

testConnection();