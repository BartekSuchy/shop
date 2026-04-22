const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware - sprawdza czy zalogowany
const isAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Brak tokenu' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Nieprawidłowy token' });
  }
};

// Pobierz koszyk
router.get('/', isAuth, (req, res) => {
  db.query(
    `SELECT ci.id, ci.quantity, p.name, p.price, p.image_url
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Dodaj do koszyka
router.post('/', isAuth, (req, res) => {
  const { product_id } = req.body;

  db.query(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
    [req.user.id, product_id],
    (err, rows) => {
      if (rows.length > 0) {
        db.query(
          'UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?',
          [req.user.id, product_id]
        );
      } else {
        db.query(
          'INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)',
          [req.user.id, product_id]
        );
      }
      res.json({ message: 'Dodano do koszyka!' });
    }
  );
});

// Usuń z koszyka
router.delete('/:id', isAuth, (req, res) => {
  db.query(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Usunięto z koszyka!' });
    }
  );
});

module.exports = router;