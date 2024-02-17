const ProductModel = require('../models/productModel');

const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).send('Error fetching products');
  }
};
const getProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10)
    const product = await ProductModel.findById(productId);
    res.json(product);
  } catch (err) {
    console.error('Error fetching product', err.message);
    res.status(500).send('Error fetching product')
  }
}

const createProduct = async (req, res) => {
  const { NAME, SHORT_DESCRIPTION, LONG_DESCRIPTION, SPECS, PRICE, CATEGORY_ID, IMAGE_URLS } = req.body; 
  try {
    const newProduct = await ProductModel.create(NAME, SHORT_DESCRIPTION, LONG_DESCRIPTION, SPECS, PRICE, CATEGORY_ID, IMAGE_URLS);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).send('Error creating product');
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId, 10);
    const products = await ProductModel.findByCategoryId(categoryId);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products by category:', err.message);
    res.status(500).send('Error fetching products by category');
  }
}



module.exports = {
  getProducts,
  createProduct,
  getProduct,
  getProductsByCategory,
};
