/*

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
*/

// Crear medicamento
async function crearMedicamento(e) {
    e.preventDefault();
    const datos = {
        DROGA: $("droga").value,
        MARCA: $("marca").value,
        PRESENTACION: $("presentacion").value,
        LABORATORIO: $("laboratorio").value,
        COBERTURA: +$("cobertura").value,
        COPAGO: +$("copago").value,
    };
    const r = await fetch("/medicamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    const j = await r.json();
    $("outputCrear").textContent = `✅ Medicamento creado correctamente: ${JSON.stringify(j, null, 2)}`;
    cargarTabla();
}

// Buscar medicamento por ID o texto
async function buscarMedicamento() {
    const id = $("buscarId").value.trim();
    const texto = $("buscarTexto").value.trim();

    try {
        if (id) {
            const r = await fetch(`/medicamentos/${id}`);
            if (!r.ok) throw new Error("❌ No encontrado");
            const resultado = await r.json();
            rellenarCamposEditarYEliminar(resultado);
            $("resultadoBuscar").textContent = `🔍 Resultado encontrado:\n${JSON.stringify(resultado, null, 2)}`;
        } else if (texto) {
            const r = await fetch(`/medicamentos/filtro?texto=${encodeURIComponent(texto)}`);
            if (!r.ok) throw new Error("❌ No encontrado");
            const resultados = await r.json();
            if (resultados.length === 1) {
                rellenarCamposEditarYEliminar(resultados[0]);
            }
            $("resultadoBuscar").textContent = `🔍 Resultados encontrados:\n${JSON.stringify(resultados, null, 2)}`;
        } else {
            throw new Error("⚠️ Ingrese un ID o texto para buscar");
        }
    } catch (e) {
        $("resultadoBuscar").textContent = e.message;
    }
}

// Editar medicamento
async function editarMedicamento() {
    const id = $("editarId").value;
    const datos = {
        DROGA: $("editarDroga").value,
        MARCA: $("editarMarca").value,
        PRESENTACION: $("editarPresentacion").value,
        LABORATORIO: $("editarLab").value,
        COBERTURA: +$("editarCobertura").value,
        COPAGO: +$("editarCopago").value,
    };
    const r = await fetch(`/medicamentos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    const j = await r.json();
    $("outputEditar").textContent = `✏️ Medicamento actualizado: ${JSON.stringify(j, null, 2)}`;
    cargarTabla();
}

// Eliminar medicamento confirmado
async function eliminarMedicamentoConfirmado() {
    const id = $("confirmarId").value;
    await fetch(`/medicamentos/${id}`, { method: "DELETE" });
    $("outputEliminar").textContent = `🗑️ Medicamento con ID ${id} eliminado correctamente`;
    cerrarConfirmacion();
    cargarTabla();
}
