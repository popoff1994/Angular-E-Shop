const db = require('../db');

const findAll = async () => {
    const sql = `
      SELECT id, name, description, image_url
      FROM categories
    `;
    const options = {
        fetchInfo: {
            "DESCRIPTION": { type: db.STRING }
        },
        outFormat: db.OUT_FORMAT_OBJECT
      };
    try {
      const result = await db.execute(sql, [], options);
      return result.rows;
    } catch (err) {
      console.error('Error fetching categories:', err);
      throw err;
    }
  };



    module.exports = {
        findAll
    };