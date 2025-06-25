// Simulación de almacenamiento temporal en el navegador
let visitante = null;
let mensajes = [];

// Renderizar mensajes en la tabla
function renderMensajes(mensajes) {
    const tbody = document.querySelector('#tabla-mensajes tbody');
    tbody.innerHTML = '';
    mensajes.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${m.nombre}</td><td>${m.contenido}</td><td>${m.fecha_hora}</td>`;
        tbody.appendChild(tr);
    });
}

// Renderizar últimos 5 mensajes
function renderUltimos(ultimos) {
    const ul = document.getElementById('ultimos-lista');
    ul.innerHTML = '';
    ultimos.forEach(u => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${u.nombre}:</b> ${u.contenido} <small>(${u.fecha_hora})</small>`;
        ul.appendChild(li);
    });
}

// Cargar todos los mensajes
function cargarMensajes() {
    fetch('http://localhost:3000/api/mensajes')
        .then(res => res.json())
        .then(data => renderMensajes(data));
    fetch('http://localhost:3000/api/ultimos')
        .then(res => res.json())
        .then(data => renderUltimos(data));
}

// Registro de visitante
document.getElementById('registro-form').onsubmit = function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!nombre || !email) {
        document.getElementById('registro-error').textContent = 'Faltan datos';
        return;
    }
    fetch('http://localhost:3000/api/visitantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.getElementById('registro-error').textContent = data.error;
        } else {
            visitante = data;
            document.getElementById('visitante-nombre').textContent = visitante.nombre;
            document.getElementById('registro-section').style.display = 'none';
            document.getElementById('mensaje-section').style.display = 'block';
            document.getElementById('registro-error').textContent = '';
        }
    });
};

// Envío de mensaje
document.getElementById('mensaje-form').onsubmit = function(e) {
    e.preventDefault();
    const contenido = document.getElementById('contenido').value.trim();
    if (!contenido || contenido.length > 300) {
        document.getElementById('mensaje-error').textContent = 'Mensaje vacío o demasiado largo';
        return;
    }
    fetch('http://localhost:3000/api/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitante_id: visitante.id, contenido })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.getElementById('mensaje-error').textContent = data.error;
        } else {
            cargarMensajes();
            document.getElementById('contenido').value = '';
            document.getElementById('mensaje-error').textContent = '';
        }
    });
};

// Inicializar
cargarMensajes();

// Cerrar sesión
document.getElementById('cerrar-sesion').onclick = function() {
    visitante = null;
    document.getElementById('mensaje-section').style.display = 'none';
    document.getElementById('registro-section').style.display = 'block';
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
}; 