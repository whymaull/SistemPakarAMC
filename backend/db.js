const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistem_pakar_amc'
});

db.connect(err => {
  if (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
  } else {
    console.log('✅ Terkoneksi ke database MySQL');
  }
});

module.exports = db;
