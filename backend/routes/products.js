const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware - sprawdza czy admin
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Brak tokenu' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Brak dostępu' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Nieprawidłowy token' });
  }
};

// Pobierz wszystkie produkty
router.get('/', (req, res) => {
  db.query('SELECT * FROM products ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Dodaj produkt (tylko admin)
router.post('/', isAdmin, upload.single('image'), (req, res) => {
  console.log('Body:', req.body)
  console.log('File:', req.file)
  const { name, description, price, stock } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

  db.query(
    'INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, image_url, stock],
    (err) => {
      if (err) {
        console.log('DB Error:', err)
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Produkt dodany!' });
    }
  );
});

// Usuń produkt (tylko admin)
router.delete('/:id', isAdmin, (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Produkt usunięty!' });
  });
});

module.exports = router;