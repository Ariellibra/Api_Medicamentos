const $ = (id) => document.getElementById(id);

// Muestra una sola sección
function mostrar(seccion) {
    ['ver', 'crear', 'editar', 'eliminar'].forEach(id => {
        $(id).style.display = (id === seccion) ? "block" : "none";
    });
    $("titulo").textContent = `Panel de Laboratorios → ${seccion.charAt(0).toUpperCase() + seccion.slice(1)}`;
}

// Cargar tabla de laboratorios
async function cargarLaboratorios() {
    try {
        const r = await fetch('/laboratorios');
        const data = await r.json();
        const tbody = $("tablaLabs");
        tbody.innerHTML = "";
        data.forEach(lab => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${lab.id}</td>
        <td>${lab.nombre}</td>
        <td>${lab.cantMedicamentos || 0}</td>
      `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        alert("Error cargando laboratorios: " + e.message);
    }
}

// Crear laboratorio
async function crearLaboratorio() {
    const nombre = $("nuevoLab").value;
    try {
        const r = await fetch('/laboratorios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });
        const j = await r.json();
        $("outputCrear").textContent = JSON.stringify(j, null, 2);
        cargarLaboratorios();
    } catch (e) {
        $("outputCrear").textContent = e.message;
    }
}

// Editar laboratorio
async function editarLaboratorio() {
    const id = +$("editId").value;
    const nombre = $("editNombre").value;
    try {
        const r = await fetch(`/laboratorios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
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
    const id = +$("deleteId").value;
    try {
        const r = await fetch(`/laboratorios/${id}`, { method: 'DELETE' });
        if (r.ok) {
            $("outputEliminar").textContent = `Laboratorio ${id} eliminado correctamente.`;
            cargarLaboratorios();
        } else {
            const j = await r.json();
            $("outputEliminar").textContent = j.mensaje || "Error al eliminar.";
        }
    } catch (e) {
        $("outputEliminar").textContent = e.message;
    }
}
