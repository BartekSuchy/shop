const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

const app = express();

app.use(cors());
app.use(express.json());


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.listen(process.env.PORT, () => {
  console.log(`Serwer działa na http://localhost:${process.env.PORT}`);
});