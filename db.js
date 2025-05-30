const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'usuario',
    password: process.env.DB_PASS || 'contraseña',
    database: process.env.DB_NAME || 'api_medicamentos',
    waitForConnections: true,
    connectionLimit: 10,
})

module.exports = pool;