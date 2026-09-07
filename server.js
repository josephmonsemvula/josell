const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Connexion BDD via variable d'environnement
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Route d'inscription
app.post('/api/signup', async (req, res) => {
  const { nom, postnom, prenom, telephone, orange_money, whatsapp, email, password } = req.body;
  try {
    const query = `
      INSERT INTO users (nom, postnom, prenom, telephone, orange_money, whatsapp, email, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;
    const values = [nom, postnom, prenom, telephone, orange_money, whatsapp, email, password];
    const result = await pool.query(query, values);
    res.json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur JoSell en ligne sur le port ${PORT}`));