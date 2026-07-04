const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'myapp',
});

app.get('/', (req, res) => {
  res.send('Hello DevOps!');
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('/data', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        visited_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('INSERT INTO visits DEFAULT VALUES');
    const result = await pool.query('SELECT COUNT(*) FROM visits');
    res.json({
      message: 'Data berhasil disimpan dan dibaca dari PostgreSQL',
      total_visits: result.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
