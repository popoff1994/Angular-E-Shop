const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/authenticateToken');

router.post('/add', authenticateToken, cartController.addToCart);

router.get('/items', authenticateToken, cartController.getCartItems);

router.delete('/remove', authenticateToken, cartController.removeFromCart);

router.post('/removeAll', authenticateToken, cartController.removeAllFromCart);

router.put('/quantity', authenticateToken, cartController.setCartQuantity);

module.exports = router;