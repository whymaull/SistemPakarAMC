const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const diagnosisRoutes = require('./routes/diagnosis');
const gejalaRoutes = require('./routes/gejala');
const rulebaseRoutes = require('./routes/rulebase');
const riwayatRoutes = require('./routes/riwayat');

app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/gejala', gejalaRoutes);
app.use('/api/rulebase', rulebaseRoutes);
app.use('/api/riwayat', riwayatRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
