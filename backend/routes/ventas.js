// routes/ventas.js

const express = require("express");
const router = express.Router();
const db = require("../db");

// 📌 POST /ventas - Registrar una venta usando procedimiento almacenado
router.post("/", async (req, res) => {
  const {
    cliente_id,
    usuario_id,
    producto_id,
    cantidad,
    metodo_pago_id
  } = req.body;

  try {
    await db.query("CALL registrar_venta(?, ?, ?, ?, ?)", [
      cliente_id,
      usuario_id,
      producto_id,
      cantidad,
      metodo_pago_id
    ]);
    res.status(201).json({ message: "Venta registrada exitosamente (procedimiento)" });
  } catch (err) {
    console.error("Error al registrar venta:", err);
    res.status(500).json({ error: "Error al registrar venta" });
  }
});

// 📌 GET /ventas - Obtener todas las ventas (solo datos de la tabla 'ventas')
router.get("/", async (req, res) => {
  try {
    const [ventas] = await db.query(`
      SELECT 
        id,
        fecha,
        total,
        nombre_cliente AS nombreCliente,
        contacto_cliente AS contactoCliente,
        direccion_cliente AS direccionCliente
      FROM ventas
    `);
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener ventas" });
  }
});

// 📌 GET /ventas/filtrar - Filtrar ventas por nombre de cliente, fecha o producto
router.get("/filtrar", async (req, res) => {
  const { nombre, fecha, producto } = req.query;

  try {
    const [ventas] = await db.query(
      `SELECT 
        v.id AS ventaId,
        v.fecha,
        v.total,
        v.nombre_cliente AS nombreCliente,
        v.contacto_cliente AS contactoCliente,
        v.direccion_cliente AS direccionCliente,
        p.nombre AS nombreProducto,
        dv.cantidad,
        dv.precio_unit
      FROM ventas v
      JOIN detalle_ventas dv ON v.id = dv.venta_id
      JOIN productos p ON dv.producto_id = p.id
      WHERE
        (? IS NULL OR v.nombre_cliente LIKE ?)
        AND (? IS NULL OR v.fecha = ?)
        AND (? IS NULL OR p.nombre LIKE ?)
      ORDER BY v.fecha DESC`,
      [
        nombre || null, `%${nombre || ""}%`,
        fecha || null, fecha || null,
        producto || null, `%${producto || ""}%`
      ]
    );

    res.json(ventas);
  } catch (err) {
    console.error("Error al filtrar ventas:", err);
    res.status(500).json({ error: "Error al filtrar ventas" });
  }
});

// 📌 GET /ventas/vista - Obtener ventas desde la vista 'vista_ventas_detalle_completa'
router.get("/vista", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM vista_ventas_detalle_completa");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener datos de la vista:", err);
    res.status(500).json({ error: "Error al obtener ventas desde vista" });
  }
});

module.exports = router;
