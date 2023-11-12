
-- Crear la base de datos "prueba"
CREATE DATABASE IF NOT EXISTS prueba;

-- Usar la base de datos "prueba"
USE prueba;

-- Crear la tabla "perfiles"
CREATE TABLE IF NOT EXISTS perfiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomUsuario VARCHAR(200),
    perfil VARCHAR(200),
    activo VARCHAR(10)
);

-- Insertar registros en la tabla "perfiles"
INSERT INTO perfiles (nomUsuario, perfil, activo) VALUES
    ('Usuario1', 'Cajero', 'Si'),
    ('Usuario2', 'Administrador', 'No');