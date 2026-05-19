require('dotenv').config();  // Add this line at the very top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  // DEPLOYMENT: Replace http://localhost:3000 with your deployed frontend URL
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => res.json({ message: 'BiteRush API running' }));

// MongoDB Connection
// DEPLOYMENT: Replace mongodb://localhost:27017/biterush with your MongoDB Atlas URI
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/biterush')
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
