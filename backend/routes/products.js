const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/:productId', productController.getProduct);
router.post('/create', productController.createProduct);

module.exports = router;