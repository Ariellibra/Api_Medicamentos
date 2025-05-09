const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const medicamentosRouter = require("../routes/medicamentos");

const app = express();
app.use(express.json());

let medicamentos = [];
let nextId = 1;

// Cargar datos desde CSV 
fs.createReadStream("data/medicamentos.csv")
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

// Iniciar servidor
app.listen(7050, () => {
  console.log("Servidor corriendo en el puerto 7050");
});
