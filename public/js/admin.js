const $ = (id) => document.getElementById(id);

// Cambiar sección activa al hacer clic en el panel izquierdo
document.querySelectorAll('.admin-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Activar link
        document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');

        // Mostrar sección correspondiente
        const target = link.dataset.target;
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        $(target).classList.add('active');

        // Cambiar título
        $('adminTitulo').textContent = link.textContent;
    });
});

async function cargarTodos() {
    try {
        const res = await fetch('/medicamentos');
        const data = await res.json();
        $('outputVer').textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        $('outputVer').textContent = 'Error al cargar medicamentos';
    }
}

async function crearMedicamento(e) {
    e.preventDefault();
    const datos = {
        DROGA: $('droga').value,
        MARCA: $('marca').value,
        PRESENTACION: $('presentacion').value,
        LABORATORIO: $('laboratorio').value,
        COBERTURA: +$('cobertura').value,
        COPAGO: +$('copago').value
    };

    try {
        const r = await fetch('/medicamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const j = await r.json();
        $('outputCrear').textContent = JSON.stringify(j, null, 2);
    } catch (e) {
        $('outputCrear').textContent = 'Error al crear medicamento';
    }
}

async function editarMedicamento() {
    const id = +$('editarId').value;
    if (!id) return alert('Ingresá un ID válido');

    const datos = {
        DROGA: prompt('Nueva droga'),
        MARCA: prompt('Nueva marca'),
        PRESENTACION: prompt('Nueva presentación'),
        LABORATORIO: prompt('Nuevo laboratorio'),
        COBERTURA: +prompt('Nueva cobertura'),
        COPAGO: +prompt('Nuevo copago')
    };

    try {
        const r = await fetch(`/medicamentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const j = await r.json();
        $('outputEditar').textContent = JSON.stringify(j, null, 2);
    } catch (e) {
        $('outputEditar').textContent = 'Error al editar medicamento';
    }
}

async function eliminarMedicamento() {
    const id = +$('eliminarId').value;
    if (!id) return alert('Ingresá un ID válido');
    if (!confirm('¿Eliminar este medicamento?')) return;

    try {
        const r = await fetch(`/medicamentos/${id}`, { method: 'DELETE' });
        $('outputEliminar').textContent = r.status === 204 ? 'Eliminado correctamente' : 'Error al eliminar';
    } catch (e) {
        $('outputEliminar').textContent = 'Error al eliminar medicamento';
    }
}

// Mostrar medicamentos al cargar
window.addEventListener('DOMContentLoaded', cargarTodos);
