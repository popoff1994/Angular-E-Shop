const CategoryModel = require('../models/categoryModel');

const getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.findAll();
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err.message);
        res.status(500).send('Error fetching categories');
    }
    };

module.exports = {
    getCategories
};