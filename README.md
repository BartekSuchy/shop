# 🛒 Sklep internetowy

Aplikacja e-commerce zbudowana w React, Node.js i MySQL.

## Funkcje
- Przeglądanie i wyszukiwanie produktów
- Rejestracja i logowanie (JWT)
- Dodawanie produktów do koszyka
- Panel admina — dodawanie i usuwanie produktów
- Upload zdjęć produktów

## Tech stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Baza danych: MySQL
- Autentykacja: JWT + bcrypt
- Upload plików: Multer

## Uruchomienie

### Backend
```bash
cd backend
npm install
node index.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Baza danych
Utwórz bazę `shop` w MySQL i wykonaj zapytania z pliku `database.sql`.

## Konto admina
- Email: admin@admin.com
- Hasło: password
