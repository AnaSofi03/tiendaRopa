// Importa Express
const express = require("express");
const router = express.Router();
const db = require("../db");

// 📌 Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT productos.*, categorias.nombre AS categoria, talles.nombre AS talle
       FROM productos
       LEFT JOIN categorias ON productos.categoria_id = categorias.id
       LEFT JOIN talles ON productos.talle_id = talles.id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// 📌 Agregar un nuevo producto
router.post("/", async (req, res) => {
  const { nombre, precio, stock, descripcion, categoria_id, talle_id } = req.body;

  if (!nombre || !precio || !stock || !categoria_id || !talle_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO productos (nombre, precio, stock, descripcion, categoria_id, talle_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, precio, stock, descripcion, categoria_id, talle_id]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      precio,
      stock,
      descripcion,
      categoria_id,
      talle_id
    });
  } catch (err) {
    console.error("Error al agregar producto:", err);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// 📌 Eliminar un producto por ID
router.delete(":id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// 📌 Actualizar producto por ID (PUT)
router.put(":id", async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, descripcion, categoria_id, talle_id } = req.body;

  if (!nombre || !precio || !stock || !categoria_id || !talle_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const [result] = await db.query(
      `UPDATE productos SET nombre = ?, precio = ?, stock = ?, descripcion = ?, categoria_id = ?, talle_id = ?
       WHERE id = ?`,
      [nombre, precio, stock, descripcion, categoria_id, talle_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

module.exports = router;
