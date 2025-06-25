const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM talles");
  res.json(rows);
});

module.exports = router;
