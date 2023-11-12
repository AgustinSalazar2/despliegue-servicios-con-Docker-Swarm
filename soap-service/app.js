const express = require('express');
const soap = require('soap');
const mysql = require('mysql2/promise');
const app = express();
require('dotenv').config();

let port = 5555;
let hostWebServSOAP = process.env.WEB_SERVICE_SOAP_HOST || 'localhost';
let hostMySQLDB = process.env.MYSQL_DB_HOST || 'localhost';

// Preparando la configuración de la conexion a la base de datos
const pool = mysql.createPool({
    host: hostMySQLDB,
    user: 'root',
    password: 'root1',
    database: 'prueba'
});

// Definicion del metodo en el servicio web SOAP, que pbtendra los registros de la tabla 'perfiles' de la DB mysql
const service = {
    PerfilesService: {
        PerfilesPort: {
            ConsultarPerfiles: async function (args) {
                const connection = await pool.getConnection();
                const [rows] = await connection.execute('SELECT * FROM perfiles');
                connection.release();
                return {
                    Perfil: rows
                };
            },
        },
    },
};

// Creacion del servicio SOAP
const wsdl = require('fs').readFileSync('perfiles.wsdl', 'utf8');
app.use('/wsdl', function(req, res) {
    res.set('Content-Type', 'text/xml');
    res.status(200).send(wsdl);
});
// Objeto de configuracion para iniciar el servicio SOAP, 
// (es opcional, porque se pueden pasar los parametros de manera individual)
const soapOptions = {
    // Endpoint del servicio SOAP
    path: '/consultar_con_soap',
    services: service,
    xml: wsdl
};
// soap.listen(app, soapOptions);

soap.listen(app, '/consultar_con_soap', service, wsdl);

app.listen(port, function () {
    console.log(`Servicio web SOAP escuchando en http://${hostWebServSOAP}:${port}/consultar_con_soap`);
});