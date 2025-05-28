const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const medicamentosRouter = require("./routes/medicamentos");

const app = express();

/* ───── CONFIG STATIC  (para servir index.html) ───── */
app.use(express.static(path.join(__dirname, "public")));   // <‐‐ poné tu index.html dentro de /public
/* ──────────────────────────────────────────────────── */

app.use(express.json());

let medicamentos = [];
let nextId = 1;

// Cargar datos desde CSV 
fs.createReadStream(__dirname + '/data/medicamentos.csv')
  .pipe(csv({ separator: ";" }))
  .on("data", (data) => {
    const limpio = {};
    for (let key in data) {
      const clave = key.trim().toUpperCase();
      limpio[clave] = data[key].trim();
    }
    limpio.id = nextId++;
    medicamentos.push(limpio);
  })
  .on("end", () => {
    console.log("Medicamentos cargados desde CSV"); 
  });

// Middleware personalizado, crea un ID para medicamentos
//automáticamente
app.use((req, res, next) => {
  req.medicamentos = medicamentos;
  req.nextId = () => nextId++;
  next();
});

// Ruta de medicamento
app.use("/medicamentos", medicamentosRouter);

// Ruta adicional confirmando el funcionamiento del servidor
app.get("/info", (req, res) => {
  res.send("API de medicamentos funcionando correctamente");
});

/*─── export para Passenger ───*/
module.exports = app;

/*─── opcional: levantate solo si corro `node app.js` localmente ───*/
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor local en puerto ${PORT}`));
}