const fs = require("fs");

const buscarRutaMaldita = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const ruta = `${dir}/${file}`;
        const stat = fs.statSync(ruta);

        if (stat.isDirectory()) {
            buscarRutaMaldita(ruta);
        } else if (file.endsWith(".js")) {
            const contenido = fs.readFileSync(ruta, "utf8");
            if (contenido.includes(`("/:`) || contenido.includes(`('/:`)) {
                console.log("⚠️ Posible error en:", ruta);
            }
        }
    });
};

buscarRutaMaldita(".");
