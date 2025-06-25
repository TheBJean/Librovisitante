const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Configura tu conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // Cambia si tu usuario es diferente
    password: 'root',         
    database: 'libro_visitas'
});

// Endpoint para registrar visitante
app.post('/api/visitantes', (req, res) => {
    const { nombre, email } = req.body;
    db.query(
        'INSERT INTO visitantes (nombre, email) VALUES (?, ?)',
        [nombre, email],
        (err, result) => {
            if (err) return res.status(400).json({ error: 'Correo ya registrado o error en datos' });
            res.json({ id: result.insertId, nombre, email });
        }
    );
});

// Endpoint para enviar mensaje
app.post('/api/mensajes', (req, res) => {
    const { visitante_id, contenido } = req.body;
    db.query(
        'INSERT INTO mensajes (visitante_id, contenido) VALUES (?, ?)',
        [visitante_id, contenido],
        (err, result) => {
            if (err) return res.status(400).json({ error: 'Error al guardar mensaje' });
            res.json({ id: result.insertId });
        }
    );
});

// Endpoint para obtener todos los mensajes
app.get('/api/mensajes', (req, res) => {
    db.query(
        `SELECT m.contenido, m.fecha_hora, v.nombre 
         FROM mensajes m 
         JOIN visitantes v ON m.visitante_id = v.id 
         ORDER BY m.fecha_hora DESC`,
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener mensajes' });
            res.json(results);
        }
    );
});

// Endpoint para obtener los últimos 5 mensajes
app.get('/api/ultimos', (req, res) => {
    db.query(
        `SELECT m.contenido, m.fecha_hora, v.nombre 
         FROM mensajes m 
         JOIN visitantes v ON m.visitante_id = v.id 
         ORDER BY m.fecha_hora DESC LIMIT 5`,
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener mensajes' });
            res.json(results);
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor Node.js escuchando en http://localhost:3000');
});