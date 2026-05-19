const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET /api/menu — get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/menu/seed — seed default menu items
router.post('/seed', async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    const defaultItems = [
      // PIZZA
      { name: 'Pepperoni Feast', description: 'Double pepperoni, extra cheese, garlic base', price: 1299, category: 'pizza', emoji: '🍕' },
      { name: 'BBQ Chicken Pizza', description: 'Grilled chicken, BBQ sauce, red onion, cheddar', price: 1399, category: 'pizza', emoji: '🍕' },
      { name: 'Veggie Supreme', description: 'Bell peppers, mushrooms, olives, fresh tomatoes', price: 1099, category: 'pizza', emoji: '🍕' },
      { name: 'Margherita Classic', description: 'San Marzano tomato, buffalo mozzarella, fresh basil', price: 999, category: 'pizza', emoji: '🍕' },
      { name: 'Spicy Inferno', description: 'Jalapeños, spicy sausage, chili flakes, mozzarella', price: 1449, category: 'pizza', emoji: '🍕' },
      { name: 'Four Cheese', description: 'Mozzarella, cheddar, parmesan, gorgonzola blend', price: 1349, category: 'pizza', emoji: '🍕' },
      // BURGERS
      { name: 'Classic Smash Burger', description: 'Smashed beef patty, American cheese, pickles, special sauce', price: 799, category: 'burgers', emoji: '🍔' },
      { name: 'Crispy Chicken Burger', description: 'Fried chicken fillet, coleslaw, mayo, brioche bun', price: 849, category: 'burgers', emoji: '🍔' },
      { name: 'Double Trouble', description: 'Two beef patties, double cheese, caramelized onions', price: 1099, category: 'burgers', emoji: '🍔' },
      { name: 'Mushroom Swiss', description: 'Beef patty, sautéed mushrooms, Swiss cheese, garlic aioli', price: 949, category: 'burgers', emoji: '🍔' },
      { name: 'BBQ Bacon Burger', description: 'Beef patty, crispy bacon, BBQ sauce, cheddar, onion rings', price: 1149, category: 'burgers', emoji: '🍔' },
      { name: 'Veggie Burger', description: 'Chickpea patty, lettuce, tomato, avocado, tahini', price: 749, category: 'burgers', emoji: '🍔' },
      // DRINKS
      { name: 'Fresh Lemonade', description: 'Freshly squeezed lemon, mint, sugar, chilled water', price: 299, category: 'drinks', emoji: '🍋' },
      { name: 'Mango Shake', description: 'Real mango, milk, sugar, crushed ice', price: 349, category: 'drinks', emoji: '🥭' },
      { name: 'Cold Coffee', description: 'Espresso, cold milk, vanilla, whipped cream', price: 399, category: 'drinks', emoji: '☕' },
      { name: 'Strawberry Smoothie', description: 'Fresh strawberries, yogurt, honey, crushed ice', price: 379, category: 'drinks', emoji: '🍓' },
      { name: 'Mint Margarita', description: 'Mint leaves, lime, sugar syrup, sparkling water', price: 329, category: 'drinks', emoji: '🍹' },
      { name: 'Oreo Milkshake', description: 'Oreo cookies, vanilla ice cream, full cream milk', price: 449, category: 'drinks', emoji: '🥤' },
      // SALADS
      { name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan, caesar dressing', price: 699, category: 'salads', emoji: '🥗' },
      { name: 'Greek Salad', description: 'Feta, olives, tomatoes, cucumber, oregano dressing', price: 649, category: 'salads', emoji: '🥗' },
      { name: 'Chicken Avocado Salad', description: 'Grilled chicken, avocado, cherry tomatoes, balsamic', price: 849, category: 'salads', emoji: '🥗' },
      { name: 'Garden Fresh Salad', description: 'Mixed greens, carrots, cucumber, lemon vinaigrette', price: 549, category: 'salads', emoji: '🥗' },
      { name: 'Pasta Salad', description: 'Penne, bell peppers, olives, Italian dressing', price: 599, category: 'salads', emoji: '🥗' },
      { name: 'Coleslaw Bowl', description: 'Shredded cabbage, carrot, creamy mayo dressing', price: 449, category: 'salads', emoji: '🥗' },
      // DEALS
      { name: 'Family Feast Deal', description: '2 large pizzas + 4 drinks + garlic bread', price: 3499, category: 'deals', emoji: '🎉' },
      { name: 'Burger Combo', description: '1 burger + fries + drink of choice', price: 1099, category: 'deals', emoji: '🎁' },
      { name: 'Student Saver', description: '1 pizza slice + salad + cold drink', price: 699, category: 'deals', emoji: '🎓' },
      { name: 'Date Night Deal', description: '1 large pizza + pasta + 2 desserts', price: 2799, category: 'deals', emoji: '❤️' },
      { name: 'Lunch Special', description: 'Burger + drink + side salad (weekdays only)', price: 899, category: 'deals', emoji: '☀️' },
      { name: 'Party Pack', description: '3 large pizzas + 6 drinks + 2 sides', price: 5499, category: 'deals', emoji: '🥳' },
    ];
    await MenuItem.insertMany(defaultItems);
    res.json({ success: true, message: `${defaultItems.length} items seeded` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
