const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM clientes");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { nombre, contacto, direccion } = req.body;
  const [result] = await db.query(
    "INSERT INTO clientes (nombre, contacto, direccion) VALUES (?, ?, ?)",
    [nombre, contacto, direccion]
  );
  res.status(201).json({ id: result.insertId });
});

module.exports = router;
