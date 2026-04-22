const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rejestracja
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Podaj email i hasło' });

  const hashed = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashed],
    (err) => {
      if (err) return res.status(500).json({ error: 'Email już istnieje' });
      res.json({ message: 'Zarejestrowano!' });
    }
  );
});

// Logowanie
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
    if (err || rows.length === 0) return res.status(401).json({ error: 'Błędny email lub hasło' });

    const user = rows[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Błędny email lub hasło' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, role: user.role, email: user.email });
  });
});

module.exports = router;