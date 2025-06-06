const contenedor = document.querySelector("#productos");
const inputBusqueda = document.getElementById("buscador");

const imagenes = {
  "Paracetamol": "https://cdn.icon-icons.com/icons2/3377/PNG/512/pill_capsule_medicine_healthcare_icon_212493.png",
  "Ibuprofeno": "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
  "Amoxicilina": "https://cdn-icons-png.flaticon.com/512/811/811484.png",
  "default": "https://cdn-icons-png.flaticon.com/512/1047/1047711.png"
};

function mostrarProductos(meds) {
  contenedor.innerHTML = "";
  meds.forEach(med => {
    const nombre = med.marca || med.droga || "Sin nombre";
    const imgSrc = imagenes[nombre] || imagenes["default"];

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${imgSrc}" alt="${nombre}">
      <h2>${nombre}</h2>
      <p><strong>Laboratorio:</strong> ${med.laboratorio}</p>
      <p><strong>Presentación:</strong> ${med.presentacion}</p>
      <p><strong>Precio:</strong> $${med.copago}</p>
    `;
    contenedor.appendChild(card);
  });
}

fetch('https://api-medicamentos.librahost.com.ar/')
  .then(res => res.json())
  .then(data => {
    mostrarProductos(data);
    inputBusqueda.addEventListener("input", () => {
      const texto = inputBusqueda.value.toLowerCase();
      const filtrados = data.filter(med =>
        med.marca?.toLowerCase().includes(texto) ||
        med.laboratorio?.toLowerCase().includes(texto)
      );
      mostrarProductos(filtrados);
    });
  })
  .catch(error => {
    console.error("Error al cargar medicamentos:", error);
    contenedor.innerHTML = "<p>Error al cargar medicamentos.</p>";
  });
