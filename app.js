require('dotenv').config();

const express = require("express");
const path = require("path");
const medicamentosRouter = require("./routes/medicamentos");
const errorHandler = require("./middleware/errorHandler")
const setupRouter = require("./routes/setup");

const app = express();

/* ───── CONFIG STATIC  (para servir index.html) ───── */
app.use(express.static(path.join(__dirname, "public")));   // <‐‐ poné tu index.html dentro de /public
/* ──────────────────────────────────────────────────── */

app.use(express.json());
app.use("/setup", setupRouter);

// Ruta de medicamento
app.use("/medicamentos", medicamentosRouter);

// Ruta adicional confirmando el funcionamiento del servidor
app.get("/info", (_req, res) => {
  res.send("API de medicamentos funcionando correctamente");
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("*", (_req, res) => {
  res.redirect("/");
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