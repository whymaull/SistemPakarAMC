const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM diagnosis', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM diagnosis WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

router.post('/', (req, res) => {
  const selectedGejala = req.body.gejala_ids;

  if (!Array.isArray(selectedGejala) || selectedGejala.length === 0) {
    return res.status(400).json({ message: 'Gejala tidak valid' });
  }

  const query = `
    SELECT d.id, d.nama, d.saran
    FROM rulebase r
    JOIN diagnosis d ON r.diagnosis_id = d.id
    WHERE r.gejala_id IN (?)
    GROUP BY d.id
    ORDER BY COUNT(r.gejala_id) DESC
    LIMIT 1
  `;

  db.query(query, [selectedGejala], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      const hasil = results[0];

      const waktu = new Date();
      const insertRiwayat = `
        INSERT INTO riwayat_diagnosa (waktu, gejala, diagnosis_id)
        VALUES (?, ?, ?)
      `;
      db.query(insertRiwayat, [waktu, JSON.stringify(selectedGejala), hasil.id], () => {
        return res.json(hasil);
      });
    } else {
      return res.json({ message: 'Tidak ditemukan diagnosis yang cocok.' });
    }
  });
});


module.exports = router;
