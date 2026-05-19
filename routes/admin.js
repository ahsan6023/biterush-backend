const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

// Secret key for JWT (change this to something random)

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-only-for-development';
// ============================================
// MIDDLEWARE: Check if admin is logged in
// ============================================
const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access denied. Please login first.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        error: 'Admin not found' 
      });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired token. Please login again.' 
    });
  }
};

// ============================================
// LOGIN ROUTE
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }
    
    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }
    
    admin.lastLogin = new Date();
    await admin.save();
    
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({
      success: true,
      token: token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// SETUP ROUTE - Create first admin (Run ONCE)
// ============================================
router.get('/setup', async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      return res.json({ 
        success: false, 
        message: 'Admin already exists!' 
      });
    }
    
    const admin = new Admin({
      username: 'admin',
      password: 'admin123'
    });
    
    await admin.save();
    
    res.json({ 
      success: true, 
      message: 'Admin created!',
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================
// VERIFY TOKEN ROUTE
// ============================================
router.get('/verify', verifyAdmin, async (req, res) => {
  res.json({ 
    success: true, 
    admin: { username: req.admin.username }
  });
});

// ============================================
// CHANGE PASSWORD ROUTE
// ============================================
router.post('/change-password', verifyAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters' 
      });
    }
    
    const admin = await Admin.findById(req.admin.id);
    const isValid = await admin.comparePassword(currentPassword);
    
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }
    
    admin.password = newPassword;
    await admin.save();
    
    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// ============================================
// PROTECTED ROUTES
// ============================================

// GET all menu items
router.get('/menu', verifyAdmin, async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST - Add new menu item
router.post('/menu', verifyAdmin, async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT - Update menu item
router.put('/menu/:id', verifyAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE - Delete menu item
router.delete('/menu/:id', verifyAdmin, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET all orders
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.json({ success: true, orders, totalRevenue, totalOrders: orders.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH - Update order status
router.patch('/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
