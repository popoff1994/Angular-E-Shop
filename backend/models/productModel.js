const db = require('../db');

const findAll = async () => {
  const sql = `SELECT product_id, name, description, price, image_url FROM products`;
  try {
    const result = await db.execute(sql);
    return result.rows;
  } catch (err) {
    throw err;
  }
};


module.exports = {
  findAll,
};
