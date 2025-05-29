const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const query = `
    SELECT r.id, r.gejala_id, g.nama AS nama_gejala, r.diagnosis_id, d.nama AS nama_diagnosis
    FROM rulebase r
    JOIN gejala g ON r.gejala_id = g.id
    JOIN diagnosis d ON r.diagnosis_id = d.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

module.exports = router;
