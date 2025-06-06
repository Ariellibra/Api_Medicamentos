const $ = (id) => document.getElementById(id);

const imagenes = {
  "paracetamol": "https://cdn.icon-icons.com/icons2/3377/PNG/512/pill_capsule_medicine_healthcare_icon_212493.png",
  "ibuprofeno": "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
  "amoxicilina": "https://cdn-icons-png.flaticon.com/512/811/811484.png",
  "default": "https://cdn-icons-png.flaticon.com/512/1047/1047711.png"
};

function getImagen(med) {
  const nombre = (med.droga || med.marca || "").toLowerCase();
  return imagenes[nombre] || imagenes["default"];
}

function renderMedicamentos(medicamentos) {
  const contenedor = $("productos");
  contenedor.innerHTML = "";
  if (!medicamentos.length) {
    contenedor.innerHTML = "<p>No se encontraron medicamentos.</p>";
    return;
  }

  medicamentos.forEach(med => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${getImagen(med)}" alt="${med.marca || med.droga}">
      <h2>${med.marca || med.droga}</h2>
      <p><strong>Laboratorio:</strong> ${med.laboratorio || "-"}</p>
      <p><strong>Presentación:</strong> ${med.presentacion || "-"}</p>
      <p><strong>Precio:</strong> $${med.copago ?? "N/A"}</p>
    `;
    contenedor.appendChild(card);
  });
}

async function cargarMedicamentos() {
  try {
    const res = await fetch("/medicamentos");
    if (!res.ok) throw new Error("Error en la API");
    const data = await res.json();
    renderMedicamentos(data);

    $("buscador").addEventListener("input", () => {
      const texto = $("buscador").value.toLowerCase();
      const filtrados = data.filter(med =>
        med.marca?.toLowerCase().includes(texto) ||
        med.laboratorio?.toLowerCase().includes(texto)
      );
      renderMedicamentos(filtrados);
    });

  } catch (e) {
    console.error("Error al cargar medicamentos:", e);
    $("productos").innerHTML = "<p>Error al cargar medicamentos.</p>";
  }
}

cargarMedicamentos();