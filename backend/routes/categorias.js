const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categorias");
  res.json(rows);
});

module.exports = router;
