const express = require('express');
const soap = require('soap');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

let port = 3000;
let hostCliente = process.env.APP_CLIENTE_HOST || 'localhost';
let hostWebServSOAP = process.env.WEB_SERVICE_SOAP_HOST || 'localhost';

function displayResults(data) {
  let tabla = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Perfiles de Usuarios</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      <style>
          table {
            width: 80%;
          }
          th {
            border: 2px solid black;
            padding: 6px;
            text-align: center;
            font-size: 18px;
          }
          td {
              border: 2px solid black;
              padding: 6px;
              text-align: left;
              font-size: 16px;
          }
          h1, h3 {
            text-align: center;
          }
          h2#tabla {
            text-align: center;
          }
      </style>
  </head>
  <body>
    <div class="row g-3 align-items-center">
        <div class="col-sm-4">
          <form id="miFormulario" class="form form-control form-control-md m-3">
            <div class="mb-1">
                <label for="nomUsuario" class="form-label">Nombre de usuario</label>
                <input type="text" class="form-control" id="nomUsuario" name="nomUsuario" required>
            </div>
            <div class="mb-1">
                <label for="perfil" class="form-label">Perfil</label>
                <select class="form-select form-select-sm" id="perfil" name="perfil">
                    <option value="Administrador">Administrador</option>
                    <option value="Cajero">Cajero</option>
                    <option value="Repositor">Repositor</option>
                </select>
            </div>
            <div class="mb-1">
                <label for="activo" class="form-label">Activo</label>
                <select class="form-select form-select-sm" id="activo" name="activo">
                    <option value="Si">Si</option>
                    <option value="No">No</option>
                </select>
            </div>
            <input type="submit" class="btn btn-primary btn-sm" value="Grabar con REST">
          </form>
        </div>
        <div class="col-sm-6 m-5 pb-5"><h2>Guardar con Servicio Web REST</h2></div>
    </div>
    <div class="px-5">
    <h2 id="tabla" class="">Listado Consultado con Servicio Web SOAP</h2>
    <table class="table px-5 table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>Usuario</th>
          <th>Perfil</th>
          <th>Activo</th>
        </tr>
      </thead>
      <tbody>`
  data.forEach(function (row) {
      tabla += `
        <tr>
          <td>${row.nomUsuario}</td>
          <td>${row.perfil}</td>
          <td>${row.activo}</td>
        </tr>
      `;
  });
  tabla += `
      </tbody>
    </table>
    </div>

    <script>
        document.getElementById('miFormulario').addEventListener('submit', function (event) {
            event.preventDefault();
            let nomUsuario = document.getElementById('nomUsuario').value;
            let perfil = document.getElementById('perfil').value;
            let activo = document.getElementById('activo').value;
            enviarDatosAPI(nomUsuario, perfil, activo);
        });
        function enviarDatosAPI(nomUsuario, perfil, activo) {
            const urlFetch = 'http://localhost:5050/insertar_con_rest';
            const datos = { 
                nomUsuario, 
                perfil, 
                activo
            };
            // console.log(nomUsuario)
            // console.log(perfil)
            // console.log(activo)
            fetch(urlFetch, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta de la API: ', data);
                if (data && data.result) {
                    // Luego de almacenar el registro exitosamente, se recarga la ruta home.
                    window.location.href = 'http://localhost:3000';
                } else {
                    console.error('La API no respondió con éxito:', data);
                }
            })
            .catch(error => {
                console.error('Error al enviar datos a la API:', error);
            });
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
  </body>
  </html>`;

  return tabla
}

const url = `http://${hostWebServSOAP}:5555/consultar_con_soap?wsdl`;

app.get('/', (_req, res) => {
  try {
    // Se realiza la solicitud al servicio web SOAP
    soap.createClient(url, (err, client) => {
      if (err) {
          console.error("Error al crear el cliente SOAP:", err);
          return;
      }
      // Se llamar al método configurado en el servicio web SOAP
      client.ConsultarPerfiles({}, (err, result) => {
          if (err) {
              console.error("Error al llamar al servicio SOAP:", err);
              return;
          }
          // Se extraen los datos de la respuesta
          const data = result.Perfil;
          // Se devuelven los resultados en una tabla HTML
          const respuesta = displayResults(data);
          return res.send(respuesta);
      });
    });
  } catch (error) {
    console.log('Error raro: ', error)
    res.json({ msg: error.message})
  }
})

app.listen(port, () => {
  console.log(`Cliente escuchando en http://${hostCliente}:${port}`);
});