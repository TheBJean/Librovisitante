-- Crea la base de datos
CREATE DATABASE IF NOT EXISTS libro_visitas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE libro_visitas;

-- Tabla de visitantes
CREATE TABLE IF NOT EXISTS visitantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitante_id INT NOT NULL,
    contenido VARCHAR(300) NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitante_id) REFERENCES visitantes(id) ON DELETE CASCADE
); 