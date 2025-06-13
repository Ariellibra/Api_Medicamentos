/*const $ = (id) => document.getElementById(id);

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
    const id = $("buscarId").value.trim();
    const texto = $("buscarTexto").value.trim();

    try {
        if (id) {
            const r = await fetch(`/medicamentos/${id}`);
            if (!r.ok) throw new Error("No encontrado");
            const resultado = await r.json();
            rellenarCamposEditarYEliminar(resultado);
            $("resultadoBuscar").textContent = JSON.stringify(resultado, null, 2);
        } else if (texto) {
            const r = await fetch(`/medicamentos/filtro?texto=${encodeURIComponent(texto)}`);
            if (!r.ok) throw new Error("No encontrado");
            const resultados = await r.json();
            if (resultados.length === 1) {
                rellenarCamposEditarYEliminar(resultados[0]);
            }
            $("resultadoBuscar").textContent = JSON.stringify(resultados, null, 2);
        } else {
            throw new Error("Ingrese un ID o texto para buscar");
        }
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

function limpiarInputsEnSeccion(seccionId) {
    const seccion = document.getElementById(seccionId);
    if (!seccion) return;

    const inputs = seccion.querySelectorAll("input, pre");
    inputs.forEach(input => {
        if (input.tagName === "INPUT") input.value = "";
        if (input.tagName === "PRE") input.textContent = "";
    });
}

// Iniciar
cargarTabla();

document.addEventListener("DOMContentLoaded", () => {
    const botonesLimpiar = document.querySelectorAll(".limpiar-btn");

    botonesLimpiar.forEach(boton => {
        boton.addEventListener("click", () => {
            // Buscar el div padre con clase "admin-section"
            const seccion = boton.closest(".admin-section");
            if (seccion) {
                limpiarInputsEnSeccion(seccion.id);
            }
        });
    });
}); 
*/

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

const BASE_URL = location.protocol === 'file:'
    ? "https://api-medicamentos.librahost.com.ar"
    : "";

// Cargar todos los medicamentos en tabla
async function cargarTabla() {
    const r = await fetch(`${BASE_URL}/medicamentos`);
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
    const id = $("buscarId").value.trim();
    const texto = $("buscarTexto").value.trim();

    try {
        if (id) {
            const r = await fetch(`/medicamentos/${id}`);
            if (!r.ok) throw new Error("No encontrado");
            const resultado = await r.json();
            rellenarCamposEditarYEliminar(resultado);
            $("resultadoBuscar").textContent = JSON.stringify(resultado, null, 2);
        } else if (texto) {
            const r = await fetch(`/medicamentos/filtro?texto=${encodeURIComponent(texto)}`);
            if (!r.ok) throw new Error("No encontrado");
            const resultados = await r.json();
            if (resultados.length === 1) {
                rellenarCamposEditarYEliminar(resultados[0]);
            }
            $("resultadoBuscar").textContent = JSON.stringify(resultados, null, 2);
        } else {
            throw new Error("Ingrese un ID o texto para buscar");
        }
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
    try {
        const r = await fetch(`/medicamentos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.mensaje || "Error al actualizar");

        $("outputEditar").textContent = j.mensaje;
        alert(j.mensaje);
        cargarTabla();
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Eliminar medicamento
async function eliminarMedicamento() {
    const id = $("eliminarId").value;
    $("confirmarId").value = id;
    $("modalEliminar").style.display = "flex";
}

async function eliminarMedicamentoConfirmado() {
    const id = $("confirmarId").value;
    try {
        const r = await fetch(`/medicamentos/${id}`, { method: "DELETE" });
        const j = await r.json();
        if (!r.ok) throw new Error(j.mensaje || "Error al eliminar");

        $("outputEliminar").textContent = j.mensaje;
        alert(j.mensaje);
        cerrarConfirmacion();
        cargarTabla();
    } catch (error) {
        alert("Error: " + error.message);
    }
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
    try {
        const r = await fetch(`/medicamentos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.mensaje || "Error al actualizar");

        alert(j.mensaje);
        cerrarModal();
        cargarTabla();
    } catch (error) {
        alert("Error: " + error.message);
    }
}

function limpiarInputsEnSeccion(seccionId) {
    const seccion = document.getElementById(seccionId);
    if (!seccion) return;

    const inputs = seccion.querySelectorAll("input, pre");
    inputs.forEach(input => {
        if (input.tagName === "INPUT") input.value = "";
        if (input.tagName === "PRE") input.textContent = "";
    });
}

// Iniciar
cargarTabla();

document.addEventListener("DOMContentLoaded", () => {
    const botonesLimpiar = document.querySelectorAll(".limpiar-btn");

    botonesLimpiar.forEach(boton => {
        boton.addEventListener("click", () => {
            const seccion = boton.closest(".admin-section");
            if (seccion) {
                limpiarInputsEnSeccion(seccion.id);
            }
        });
    });
});

