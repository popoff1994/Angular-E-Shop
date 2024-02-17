const db = require('../db');

const findAll = async () => {
  const sql = `
    SELECT 
      p.product_id, 
      p.name, 
      p.short_description,
      p.long_description,
      p.specs,
      p.category_id,
      c.name as category_name,
      c.description as category_description,
      p.price, 
      (SELECT LISTAGG(pi.image_url, ',') WITHIN GROUP (ORDER BY pi.image_url) 
       FROM product_images pi 
       WHERE pi.product_id = p.product_id
      ) AS image_urls
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;

  const options = {
    fetchInfo: {
      "LONG_DESCRIPTION": { type: db.STRING },
      "SPECS": { type: db.STRING },
      "CATEGORY_DESCRIPTION": { type: db.STRING }
    },
    outFormat: db.OUT_FORMAT_OBJECT 
  };

  try {
    const result = await db.execute(sql, [], options);
    const rows = result.rows.map(row => {
      try {
        // Attempt to parse SPECS and log the original string if parsing fails.
        const specsParsed = row.SPECS ? JSON.parse(row.SPECS) : null;
        return {
          ...row,
          IMAGE_URLS: row.IMAGE_URLS ? row.IMAGE_URLS.split(',') : [],
          SPECS: specsParsed
        };
      } catch (error) {
        console.error(`Error parsing SPECS for product_id=${row.PRODUCT_ID}:`, row.SPECS, error);
        return { ...row, SPECS: null }; // Handle the error gracefully.
      }
    });

    return rows;
  } catch (err) {
    console.error('Error in findAll:', err);
    throw err;
  }
};

const findById = async (productId) => {
  const sql = `
    SELECT
      p.product_id,
      p.name,
      p.short_description,
      p.long_description,
      p.specs,
      p.category_id,
      c.name as category_name,
      c.description as category_description,
      p.price,
      (SELECT LISTAGG(pi.image_url, ',') WITHIN GROUP (ORDER BY pi.image_url) 
       FROM product_images pi 
       WHERE pi.product_id = p.product_id) AS image_urls
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.product_id = :productId`;
  const binds = { productId };
  const options = {
    fetchInfo: {
      "LONG_DESCRIPTION": { type: db.STRING },
      "SPECS": { type: db.STRING },
      "CATEGORY_DESCRIPTION": { type: db.STRING }
    },
    outFormat: db.OUT_FORMAT_OBJECT
  };

  try {
    const result = await db.execute(sql, binds, options);
    
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    row.SPECS = row.SPECS ? JSON.parse(row.SPECS) : null;
    return {
      ...row,
      IMAGE_URLS: row.IMAGE_URLS ? row.IMAGE_URLS.split(',') : [],
    };
  } catch (err) {
    console.error('Error in findById:', err);
    throw err;
  }
};



const create = async (name, short_description, long_description, specs, price, category_id, imageUrls) => {
  const productSql = `
    INSERT INTO products (name, short_description, long_description, specs, price, category_id) 
    VALUES (:NAME, :SHORT_DESCRIPTION, :LONG_DESCRIPTION, :SPECS, :PRICE, :CATEGORY_ID) 
    RETURNING product_id INTO :PRODUCT_ID
  `;
  const productBinds = {
    NAME: name,
    SHORT_DESCRIPTION: short_description,
    LONG_DESCRIPTION: long_description,
    SPECS: specs,
    PRICE: price,
    CATEGORY_ID: category_id,
    PRODUCT_ID: { dir: db.BIND_OUT, type: db.NUMBER }
  };
  const options = { autoCommit: false };

  try {
    const result = await db.execute(productSql, productBinds, options);
    const productId = result.outBinds.PRODUCT_ID[0];

    if (imageUrls && imageUrls.length > 0) {
      const imageSql = `
        INSERT INTO product_images (product_id, image_url) 
        VALUES (:PRODUCT_ID, :IMAGE_URL)
      `;
      for (let imageUrl of imageUrls) {
        await db.execute(imageSql, { PRODUCT_ID: productId, IMAGE_URL: imageUrl }, { autoCommit: false });
      }
    }

    await db.commit();
    return { productId, ...result };
  } catch (err) {
    await db.rollback();
    throw err;
  }
};

const findByCategoryId = async (categoryId) => {
  const sql = `
      SELECT 
          p.product_id, 
          p.name, 
          p.short_description,
          p.long_description,
          p.specs,
          p.price, 
          p.category_id,
          (SELECT LISTAGG(pi.image_url, ',') WITHIN GROUP (ORDER BY pi.image_url) 
              FROM product_images pi 
              WHERE pi.product_id = p.product_id) AS image_urls
      FROM products p
      WHERE p.category_id = :categoryId
  `;
  
  const options = {
    outFormat: db.OUT_FORMAT_OBJECT,
    fetchInfo: {
      "LONG_DESCRIPTION": { type: db.STRING },
      "SPECS": { type: db.STRING },
      "CATEGORY_DESCRIPTION": { type: db.STRING }
    }
  };
  
  try {
    const result = await db.execute(sql, {categoryId}, options);
    const rows = result.rows.map(row => {
      return {
        ...row,
        IMAGE_URLS: row.IMAGE_URLS ? row.IMAGE_URLS.split(',') : [],
        SPECS: row.SPECS ? JSON.parse(row.SPECS) : null
      };
    });

    return rows;
  } catch (err) {
    console.error('Error in findByCategoryId:', err);
    throw err;
  }
};



module.exports = {
  findAll,
  create,
  findById,
  findByCategoryId,
};
