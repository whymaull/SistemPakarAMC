const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// === REGISTER ===
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }
        return res.status(500).json({ message: 'Gagal mendaftar.', error: err });
      }

      res.status(201).json({ message: 'Pendaftaran berhasil.', userId: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hash password.', error: err });
  }
});

// === LOGIN ===
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' });
  }

  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Gagal login.', error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email tidak ditemukan.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah.' });
    }

    res.json({
      message: 'Login berhasil.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
});

module.exports = router;
