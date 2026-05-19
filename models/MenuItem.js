const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['pizza', 'burgers', 'drinks', 'salads', 'deals'],
    required: true
  },
  emoji: { type: String, default: '🍔' },
  imageUrl: { type: String, default: '' },  // ← ADD THIS LINE
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);