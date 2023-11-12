// (Servicio Web REST)
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let port = 5050;
let hostWebServREST = process.env.WEB_SERVICE_REST_HOST || 'localhost';
let hostMySQLDB = process.env.MYSQL_DB_HOST || 'localhost';

const pool = mysql.createPool({
    host: hostMySQLDB,
    user: 'root',
    password: 'root1',
    database: 'prueba'
});

app.post('/insertar_con_rest', async (req, res) => {
    const {
        nomUsuario,
        perfil,
        activo
    } = req.body;
    try {
        const db = await pool.getConnection();
        const insertQuery = 'INSERT INTO perfiles (nomUsuario, perfil, activo) VALUES (?, ?, ?)';
        const resp = await db.execute(insertQuery, [nomUsuario, perfil, activo])
        // console.log(resp)
        db.release();
        if (resp[0]) {
            res.status(200).json(
                { 
                    result: 'ok', 
                    message: 'Usuario Agregado con exito',
                }
            )
        }
    } catch (error) {
        console.log('Errorr: ' + error.message);
    }
});

app.get('/consultar_con_rest', async (req, res) => {
    try {
        const db = await pool.getConnection();
        const query = 'SELECT * FROM perfiles';
        const result = await db.execute(query);
        db.release();
        res.json(result[0]);
    } catch (error) {
        console.log('Errorr: ' + error.message);
    }
})

app.listen(port, () => {
    console.log(`Servicio REST escuchando en http://${hostWebServREST}:${port}`);
});