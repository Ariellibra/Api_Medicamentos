const $ = (id) => document.getElementById(id);

// Navegación entre secciones
const enlaces = document.querySelectorAll(".admin-nav a");
const secciones = document.querySelectorAll(".admin-section");

enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
        e.preventDefault();
        enlaces.forEach((el) => el.classList.remove("active"));
        enlace.classList.add("active");
        secciones.forEach((sec) => sec.classList.remove("active"));
        const destino = $(enlace.dataset.target);
        if (destino) destino.classList.add("active");
        $("adminTitulo").textContent = enlace.textContent;
    });
});

// Cargar todos los medicamentos en tabla
async function cargarTabla() {
    const r = await fetch("/medicamentos");
    const data = await r.json();
    const tbody = document.querySelector("#tablaMedicamentos tbody");
    tbody.innerHTML = "";
    data.forEach((med) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${med.id}</td>
      <td>${med.droga}</td>
      <td>${med.marca}</td>
      <td>${med.laboratorio}</td>
      <td>${med.cobertura}%</td>
      <td>$${med.copago}</td>
      <td>
        <button class='btn btn-sm btn-outline-primary' onclick='abrirModal(${JSON.stringify(
            med
        )})'>✏️</button>
        <button class='btn btn-sm btn-outline-danger' onclick='confirmarBorrado(${med.id})'>🗑️</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

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
    $("outputCrear").textContent = JSON.stringify(j, null, 2);
    cargarTabla();
}

// Buscar medicamento por ID o texto
async function buscarMedicamento() {
    const id = $("buscarId").value;
    const texto = $("buscarTexto").value.trim().toLowerCase();
    let resultado = null;
    try {
        if (id) {
            const r = await fetch(`/medicamentos/${id}`);
            if (!r.ok) throw new Error("No encontrado");
            resultado = await r.json();
            rellenarCamposEditarYEliminar(resultado);
        } else if (texto) {
            const r = await fetch("/medicamentos");
            const data = await r.json();
            const filtro = data.find((med) =>
                med.marca?.toLowerCase().includes(texto) ||
                med.laboratorio?.toLowerCase().includes(texto)
            );
            if (!filtro) throw new Error("No encontrado");
            resultado = filtro;
            rellenarCamposEditarYEliminar(resultado);
        } else {
            throw new Error("Ingrese un ID o texto para buscar");
        }
        $("resultadoBuscar").textContent = JSON.stringify(resultado, null, 2);
    } catch (e) {
        $("resultadoBuscar").textContent = e.message;
    }
}

// Rellenar los campos de editar/eliminar
function rellenarCamposEditarYEliminar(med) {
    $("editarId").value = med.id;
    $("editarDroga").value = med.droga;
    $("editarMarca").value = med.marca;
    $("editarPresentacion").value = med.presentacion;
    $("editarLab").value = med.laboratorio;
    $("editarCobertura").value = med.cobertura;
    $("editarCopago").value = med.copago;
    $("eliminarId").value = med.id;
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
    $("outputEditar").textContent = JSON.stringify(j, null, 2);
    cargarTabla();
}

// Eliminar medicamento
async function eliminarMedicamento() {
    const id = $("eliminarId").value;
    $("confirmarId").value = id;
    $("modalEliminar").style.display = "flex";
}

async function eliminarMedicamentoConfirmado() {
    const id = $("confirmarId").value;
    await fetch(`/medicamentos/${id}`, { method: "DELETE" });
    $("outputEliminar").textContent = `Eliminado ID ${id}`;
    cerrarConfirmacion();
    cargarTabla();
}

function confirmarBorrado(id) {
    const modal = $("modalEliminar");
    modal.classList.remove("d-none");
    modal.classList.add("d-flex");
    $("confirmarId").value = id;
}

function cerrarConfirmacion() {
    const modal = $("modalEliminar");
    modal.classList.remove("d-flex");
    modal.classList.add("d-none");
}

function abrirModal(med) {
    const modal = $("modal");
    modal.classList.remove("d-none");
    modal.classList.add("d-flex");

    $("editId").value = med.id;
    $("editDroga").value = med.droga;
    $("editMarca").value = med.marca;
    $("editPresentacion").value = med.presentacion;
    $("editLab").value = med.laboratorio;
    $("editCobertura").value = med.cobertura;
    $("editCopago").value = med.copago;
}

function cerrarModal() {
    const modal = $("modal");
    modal.classList.remove("d-flex");
    modal.classList.add("d-none");
}

async function guardarEdicion() {
    const id = $("editId").value;
    const datos = {
        DROGA: $("editDroga").value,
        MARCA: $("editMarca").value,
        PRESENTACION: $("editPresentacion").value,
        LABORATORIO: $("editLab").value,
        COBERTURA: +$("editCobertura").value,
        COPAGO: +$("editCopago").value,
    };
    await fetch(`/medicamentos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    cerrarModal();
    cargarTabla();
}

// Iniciar
cargarTabla();
