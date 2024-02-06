const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const db = require('./db');
require('dotenv').config();
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');

app.use(express.json());
// app.use(cors());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:4200', 
  credentials: true, 
};
app.use(cors(corsOptions));

// Initialize database pool
db.initialize().catch((err) => {
  console.error('Failed to initialize DB:', err);
  process.exit(1);
});

// Routes
app.use('/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/cart', cartRoutes)


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('SIGTERM', () => {
  db.close().then(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});