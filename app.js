require('dotenv').config();

const express = require("express");

// DEBUG DE RUTAS
["get", "post", "put", "delete", "use"].forEach(method => {
  const original = express.Router.prototype[method];
  express.Router.prototype[method] = function (path, ...rest) {
    if (typeof path === "string") {
      console.log(`[RUTA] ${method.toUpperCase()} ${path}`);
    }
    return original.call(this, path, ...rest);
  };
});

const path = require("path");
const medicamentosRouter = require("./routes/medicamentos");
const errorHandler = require("./middleware/errorHandler")
const setupRouter = require("./routes/setup");

// Servir Bootstrap CSS
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
// Servir Bootstrap JS (incluye Popper)
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

const app = express();

console.log("Iniciando app...");

/* ───── CONFIG STATIC  (para servir index.html) ───── */
app.use(express.static(path.join(__dirname, "public")));   // <‐‐ poné tu index.html dentro de /public
/* ──────────────────────────────────────────────────── */

app.use(express.json());

console.log("Cargando setupRouter");
app.use("/setup", setupRouter);

// Ruta de medicamento
console.log("Cargando medicamentosRouter");
app.use("/medicamentos", medicamentosRouter);

// Ruta adicional confirmando el funcionamiento del servidor
app.get("/info", (_req, res) => {
  res.send("API de medicamentos funcionando correctamente");
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware de error global (al final SIEMPRE)
app.use(errorHandler);

/*─── export para Passenger ───*/
module.exports = app;

/*─── opcional: levantate solo si corro `node app.js` localmente ───*/
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor local en puerto ${PORT}`));
}