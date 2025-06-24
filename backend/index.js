// Importa el módulo Express, que sirve para crear un servidor web en Node.js
const express = require("express");

// Importa el módulo CORS, que permite conexiones entre frontend y backend desde diferentes dominios
const cors = require("cors");

// Crea una instancia de la aplicación de Express
const app = express();

// Define el puerto en el que se va a ejecutar el servidor backend
const PORT = 3001;

// Estas líneas parecen estar fuera de contexto porque `usuariosRoutes` no está definido en este archivo.
// Generarían un error a menos que definas esa constante antes.
// Se pueden eliminar o corregir.
console.log("Usuarios route:", typeof usuariosRoutes);
console.log("Es función:", typeof usuariosRoutes === "function");

// Middleware para permitir solicitudes desde otros orígenes (CORS)
app.use(cors());

// Middleware para que Express entienda datos en formato JSON en las peticiones
app.use(express.json());

// Rutas disponibles en el backend:
// Todas las rutas que empiecen con "/usuarios" serán manejadas por el archivo './routes/usuarios.js'
app.use("/usuarios", require("./routes/usuarios"));

// Todas las rutas que empiecen con "/productos" serán manejadas por el archivo './routes/productos.js'
app.use("/productos", require("./routes/productos"));

// Todas las rutas que empiecen con "/ventas" serán manejadas por el archivo './routes/ventas.js'
app.use("/ventas", require("./routes/ventas"));

// Inicia el servidor en el puerto especificado y muestra un mensaje en consola
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
