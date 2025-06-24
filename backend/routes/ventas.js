// Importa Express para manejar rutas HTTP
const express = require("express");

// Crea un enrutador para manejar las rutas relacionadas a "ventas"
const router = express.Router();

// Importa la conexión a la base de datos
const db = require("../db");


// 📌 POST /ventas - Registrar una nueva venta
router.post("/", async (req, res) => {
  // Extrae los datos del cuerpo de la solicitud
  const {
    cliente_id, productos, total, fecha,
    nombreCliente, contactoCliente, direccionCliente
  } = req.body;

  try {
    // Inserta la venta en la tabla 'ventas'
    const [ventaResult] = await db.query(
      "INSERT INTO ventas (cliente_id, fecha, total, nombre_cliente, contacto_cliente, direccion_cliente) VALUES (?, ?, ?, ?, ?, ?)",
      [cliente_id || null, fecha, total, nombreCliente, contactoCliente, direccionCliente]
    );

    // Obtiene el ID de la venta recién insertada
    const venta_id = ventaResult.insertId;

    // Por cada producto vendido, se registra en la tabla 'detalle_ventas' y se actualiza el stock
    for (const p of productos) {
      // Inserta el detalle de cada producto en la venta
      await db.query(
        "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unit, nombre_cliente, contacto_cliente, direccion_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [venta_id, p.id, p.cantidad, p.precio, nombreCliente, contactoCliente, direccionCliente]
      );

      // Resta del stock la cantidad vendida
      await db.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [p.cantidad, p.id]
      );
    }

    // Devuelve mensaje de éxito con el ID de la venta creada
    res.json({ message: "Venta registrada", venta_id });
  } catch (err) {
    // Si ocurre un error, responde con estado 500
    res.status(500).json({ error: "Error al registrar venta" });
  }
});


// 📌 GET /ventas - Obtener todas las ventas (sin detalles)
router.get("/", async (req, res) => {
  try {
    // Consulta para obtener las ventas con sus datos principales
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

    // Devuelve la lista de ventas
    res.json(ventas);
  } catch (err) {
    // Si ocurre un error, responde con estado 500
    res.status(500).json({ error: "Error al obtener ventas" });
  }
});


// 📌 GET /ventas/filtrar - Filtrar ventas por nombre de cliente, fecha o producto
router.get("/filtrar", async (req, res) => {
  // Extrae los parámetros de consulta desde la URL
  const { nombre, fecha, producto } = req.query;

  try {
    // Ejecuta una consulta compleja que une ventas, detalle_ventas y productos
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

    // Devuelve el resultado de la búsqueda filtrada
    res.json(ventas);
  } catch (err) {
    // Si ocurre un error, muestra el mensaje en consola y responde con estado 500
    console.error("Error al filtrar ventas:", err);
    res.status(500).json({ error: "Error al filtrar ventas" });
  }
});


// Exporta el enrutador para poder usarlo en el archivo principal del backend
module.exports = router;
