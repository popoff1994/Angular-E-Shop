const jwt = require('jsonwebtoken');
const CartModel = require('../models/cartModel');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId, QUANTITY } = req.body;

    await CartModel.addToCart(userId, productId, QUANTITY);
    res.status(200).json('Item added to cart successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).json('Error adding item to cart.');
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.user_id; 
    const items = await CartModel.getCartItems(userId);
    res.status(200).json(items);
  } catch (error) {
    console.error('Error retrieving cart items:', error);
    res.status(500).json({ message: 'Error retrieving cart items.' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId } = req.body;
    await CartModel.removeFromCart(userId, productId);
    res.status(200).json('Item removed from cart successfully.');
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json('Error removing item from cart.');
  }
};
exports.removeAllFromCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId } = req.body;
    await CartModel.removeAllFromCart(userId, productId);
    res.status(200).json('All items removed from cart successfully.');
  } catch (error) {
    console.error('Error removing all items from cart:', error);
    res.status(500).json('Error removing all items from cart.');
  }
}
exports.setCartQuantity = async (req, res) => {
  try {
      const userId = req.user.user_id;
      const { productId, QUANTITY } = req.body;
      console.log('userId:', userId, 'productId:', productId, 'QUANTITY:', QUANTITY);
      await CartModel.setCartQuantity(userId, productId, QUANTITY);
      res.status(200).json({ message: 'Cart item quantity updated successfully.' });
  } catch (error) {
      console.error('Error setting cart item quantity:', error);
      res.status(500).json({ message: 'Error setting cart item quantity.' });
  }
};




