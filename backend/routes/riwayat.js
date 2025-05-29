const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const query = `
    SELECT r.id, r.waktu, r.gejala, d.nama AS diagnosis
    FROM riwayat_diagnosa r
    LEFT JOIN diagnosis d ON r.diagnosis_id = d.id
    ORDER BY r.waktu DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { gejala, diagnosis_id } = req.body;
  const waktu = new Date();
  const query = 'INSERT INTO riwayat_diagnosa (waktu, gejala, diagnosis_id) VALUES (?, ?, ?)';
  db.query(query, [waktu, gejala, diagnosis_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Riwayat berhasil disimpan!', id: result.insertId });
  });
});

module.exports = router;
