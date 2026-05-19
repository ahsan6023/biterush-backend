const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

router.post('/seed-from-backup', async (req, res) => {
  try {
    const backupPath = path.join(__dirname, '../menu-data.json');
    const items = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    const collection = mongoose.connection.db.collection('menuitems');
    await collection.deleteMany({});
    await collection.insertMany(items);
    
    res.json({ success: true, message: `Seeded ${items.length} items to database` });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;