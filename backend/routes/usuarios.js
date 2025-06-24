// Importa Express para manejar rutas HTTP
const express = require("express");

// Crea un enrutador (Router) de Express para manejar rutas relacionadas con "usuarios"
const router = express.Router();

// Importa el pool de conexiones a la base de datos MySQL (con soporte para promesas)
const pool = require("../db");


// 📌 GET /usuarios - Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    // Ejecuta una consulta SQL para obtener todos los registros de la tabla "usuarios"
    const [rows] = await pool.query("SELECT * FROM usuarios");

    // Devuelve el resultado (array de usuarios) como respuesta en formato JSON
    res.json(rows);
  } catch (error) {
    // Si ocurre un error en la consulta, se muestra en consola y se responde con estado 500
    console.error("ERROR AL OBTENER USUARIOS:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});


// Exporta el enrutador para poder usarlo en el archivo principal del backend
module.exports = router;

