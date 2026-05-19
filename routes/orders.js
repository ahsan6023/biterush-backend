const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders — place a new order
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod } = req.body;
    
    // Transform items to match your schema
    const transformedItems = items.map(item => ({
      itemId: item._id || item.id,  // Maps "sample_p2" to itemId field
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      category: item.category || '',
      emoji: item.emoji || ''
    }));
    
    const order = new Order({ 
      customer, 
      items: transformedItems, 
      totalAmount,
      paymentMethod: paymentMethod || 'Cash on Delivery'
    });
    
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/orders — get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/status — update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;