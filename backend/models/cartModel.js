const db = require('../db');

class CartModel {
  static async addToCart(userId, productId, quantity) {
    const existingItemSql = `SELECT * FROM CART_ITEMS WHERE user_id = :userId AND product_id = :productId`;
    const result = await db.execute(existingItemSql, { userId, productId });
    if (result.rows.length > 0) {
      const newQuantity = result.rows[0].QUANTITY + quantity;
    
      const updateSql = `UPDATE CART_ITEMS SET quantity = :newQuantity WHERE user_id = :userId AND product_id = :productId`;
      await db.execute(updateSql, { newQuantity, userId, productId });
    } else {
      const insertSql = `INSERT INTO CART_ITEMS (user_id, product_id, quantity) VALUES (:userId, :productId, :quantity)`;
      await db.execute(insertSql, { userId, productId, quantity });
    }
  }
  

  static async getCartItems(userId) {
    const sql = `SELECT ci.quantity, p.* FROM CART_ITEMS ci JOIN PRODUCTS p ON ci.product_id = p.PRODUCT_ID WHERE ci.user_id = :userId`;
    try {
      const params = { userId };
      const result = await db.execute(sql, params);
      return result;
    } catch (err) {
      throw err;
    }
  }
  static async removeFromCart(userId, productId) {
    const checkSql = `SELECT * FROM CART_ITEMS WHERE user_id = :userId AND product_id = :productId`;
    const checkResult = await db.execute(checkSql, { userId, productId });

    if (checkResult.rows.length > 0) {
        const currentQuantity = checkResult.rows[0].QUANTITY;

        if (currentQuantity > 1) {
            const updateSql = `UPDATE CART_ITEMS SET quantity = quantity - 1 WHERE user_id = :userId AND product_id = :productId`;
            await db.execute(updateSql, { userId, productId });
        } else {
            const deleteSql = `DELETE FROM CART_ITEMS WHERE user_id = :userId AND product_id = :productId`;
            await db.execute(deleteSql, { userId, productId });
        }
    } else {
        throw new Error("Item not found in cart.");
    }
}
  static async removeAllFromCart(userId, productId) {
    const deleteSql = `DELETE FROM CART_ITEMS WHERE user_id = :userId AND product_id = :productId`;
    await db.execute(deleteSql, { userId, productId });
  }

  static async setCartQuantity(userId, productId, QUANTITY) {
    const checkSql = `SELECT * FROM CART_ITEMS WHERE user_id = :userId AND product_id = :productId`;
    const checkResult = await db.execute(checkSql, { userId, productId });

    if (checkResult.rows.length > 0) {
        const updateSql = `UPDATE CART_ITEMS SET quantity = :quantity WHERE user_id = :userId AND product_id = :productId`;
        await db.execute(updateSql, { QUANTITY, userId, productId });
    } else {
        const insertSql = `INSERT INTO CART_ITEMS (user_id, product_id, quantity) VALUES (:userId, :productId, :quantity)`;
        await db.execute(insertSql, { userId, productId, QUANTITY });
    }
}


   
}

module.exports = CartModel;