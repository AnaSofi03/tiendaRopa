// Importa Express
const express = require("express");

// Crea un enrutador para manejar las rutas relacionadas a "productos"
const router = express.Router();

// Importa el archivo de conexión a la base de datos (pool con promesas)
const db = require("../db");


// 📌 Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    // Ejecuta una consulta SQL para obtener todos los registros de la tabla productos
    const [rows] = await db.query("SELECT * FROM productos");

    // Devuelve la lista de productos en formato JSON
    res.json(rows);
  } catch (err) {
    // Si hay un error, devuelve un estado 500 con un mensaje de error
    res.status(500).json({ error: "Error al obtener productos" });
  }
});


// 📌 Agregar un nuevo producto
router.post("/", async (req, res) => {
  // Extrae los datos enviados en el cuerpo de la solicitud
  const { nombre, precio, stock, descripcion, talle, categoria } = req.body;

  // Verifica que los campos obligatorios estén presentes
  if (!nombre || !precio) {
    return res.status(400).json({ error: "Los campos son obligatorios" });
  }

  try {
    // Inserta un nuevo producto en la base de datos
    const [result] = await db.query(
      "INSERT INTO productos (nombre, precio, stock, descripcion, talle, categoria) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, precio || "", stock || 0, descripcion || "", talle || "", categoria || ""]
    );

    // Devuelve el nuevo producto con su ID generado automáticamente
    res.status(201).json({ id: result.insertId, nombre, precio, stock, descripcion, talle, categoria });
  } catch (err) {
    // Maneja errores de inserción
    res.status(500).json({ error: "Error al agregar producto" });
  }
});


// 📌 Eliminar un producto por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Obtiene el ID de la URL

  try {
    // Ejecuta la consulta para eliminar el producto con el ID dado
    await db.query("DELETE FROM productos WHERE id = ?", [id]);

    // Responde con éxito
    res.json({ success: true });
  } catch (err) {
    // Maneja errores de eliminación
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});


// 📌 Actualizar producto por ID (PUT)
router.put("/:id", (req, res) => {
  const id = req.params.id; // Obtiene el ID de la URL

  // Extrae los datos del cuerpo de la solicitud
  const { nombre, precio, stock, descripcion, talle, categoria } = req.body;

  // Consulta SQL para actualizar el producto
  const sql = `
    UPDATE productos
    SET nombre = ?, precio = ?, stock = ?, descripcion = ?, talle = ?, categoria = ?
    WHERE id = ?
  `;

  // Ejecuta la consulta SQL
  db.query(sql, [nombre, precio, stock, descripcion, talle, categoria, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar producto:", err);
      return res.status(500).json({ error: "Error al actualizar producto" });
    }

    // Si no se encontró el producto para actualizar
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Éxito al actualizar
    res.json({ message: "Producto actualizado exitosamente" });
  });
});


// Exporta el enrutador para poder usarlo en el archivo principal del backend
module.exports = router;
