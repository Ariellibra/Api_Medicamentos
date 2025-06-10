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

// Cargar tabla de laboratorios
async function cargarLaboratorios() {
    try {
        const r = await fetch("/laboratorios");
        const data = await r.json();
        const tbody = $("tablaLaboratorios").querySelector("tbody");
        tbody.innerHTML = "";
        data.forEach(lab => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${lab.id}</td>
                <td>${lab.nombre}</td>
                <td>${lab.cantMedicamentos || 0}</td>
                <td>
                    <button class='btn btn-sm btn-outline-primary' onclick='abrirModal(${JSON.stringify(lab)})'>✏️</button>
                    <button class='btn btn-sm btn-outline-danger' onclick='confirmarBorrado(${lab.id})'>🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.warn("Error cargando laboratorios: " + e.message);
    }
}

// Crear laboratorio
async function crearLaboratorio(e) {
    e.preventDefault();
    const nombre = $("nombreLab").value;
    try {
        const r = await fetch("/laboratorios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre })
        });
        const j = await r.json();
        $("outputCrear").textContent = JSON.stringify(j, null, 2);
        cargarLaboratorios();
    } catch (e) {
        $("outputCrear").textContent = e.message;
    }
}

// Buscar laboratorio por ID o nombre
async function buscarLaboratorio() {
    const id = $("buscarId").value;
    const nombre = $("buscarNombre").value.trim().toLowerCase();
    let resultado = null;
    try {
        if (id) {
            const r = await fetch(`/laboratorios/${id}`);
            if (!r.ok) throw new Error("No encontrado");
            resultado = await r.json();
            rellenarCamposEditarYEliminar(resultado);
        } else if (nombre) {
            const r = await fetch("/laboratorios");
            const data = await r.json();
            const filtro = data.find((lab) =>
                lab.nombre?.toLowerCase().includes(nombre)
            );
            if (!filtro) throw new Error("No encontrado");
            resultado = filtro;
            rellenarCamposEditarYEliminar(resultado);
        } else {
            throw new Error("Ingrese un ID o nombre para buscar");
        }
        $("resultadoBuscar").textContent = JSON.stringify(resultado, null, 2);
    } catch (e) {
        $("resultadoBuscar").textContent = e.message;
    }
}

// Rellenar campos
function rellenarCamposEditarYEliminar(lab) {
    $("editarId").value = lab.id;
    $("editarNombre").value = lab.nombre;
    $("eliminarId").value = lab.id;
}

// Editar laboratorio
async function editarLaboratorio() {
    const id = +$("editarId").value;
    const nombre = $("editarNombre").value;
    try {
        const r = await fetch(`/laboratorios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre })
        });
        const j = await r.json();
        $("outputEditar").textContent = JSON.stringify(j, null, 2);
        cargarLaboratorios();
    } catch (e) {
        $("outputEditar").textContent = e.message;
    }
}

// Eliminar laboratorio
async function eliminarLaboratorio() {
    const id = $("eliminarId").value;
    $("confirmarId").value = id;
    $("modalEliminar").classList.remove("d-none");
    $("modalEliminar").classList.add("d-flex");
}

async function eliminarLaboratorioConfirmado() {
    const id = $("confirmarId").value;
    try {
        await fetch(`/laboratorios/${id}`, { method: "DELETE" });
        $("outputEliminar").textContent = `Eliminado ID ${id}`;
        cerrarConfirmacion();
        cargarLaboratorios();
    } catch (e) {
        $("outputEliminar").textContent = e.message;
    }
}

function confirmarBorrado(id) {
    $("confirmarId").value = id;
    $("modalEliminar").classList.remove("d-none");
    $("modalEliminar").classList.add("d-flex");
}

function cerrarConfirmacion() {
    $("modalEliminar").classList.remove("d-flex");
    $("modalEliminar").classList.add("d-none");
}

function abrirModal(lab) {
    $("editId").value = lab.id;
    $("editNombre").value = lab.nombre;
    $("modal").classList.remove("d-none");
    $("modal").classList.add("d-flex");
}

function cerrarModal() {
    $("modal").classList.remove("d-flex");
    $("modal").classList.add("d-none");
}

async function guardarEdicion() {
    const id = $("editId").value;
    const nombre = $("editNombre").value;
    await fetch(`/laboratorios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
    });
    cerrarModal();
    cargarLaboratorios();
}

// Limpiar inputs
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
document.addEventListener("DOMContentLoaded", () => {
    cargarLaboratorios();

    const botonesLimpiar = document.querySelectorAll(".limpiar-btn");
    botonesLimpiar.forEach(boton => {
        boton.addEventListener("click", () => {
            const seccion = boton.closest(".admin-section");
            if (seccion) limpiarInputsEnSeccion(seccion.id);
        });
    });
});
