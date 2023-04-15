const { Pool, Client } = require('pg');
const config = require('../dbconfig.js');

const pool = new Pool({
  user: config.USER,
  database: config.DATABASE,
  password: config.PASSWORD,
  port: config.PORT,
  host: config.HOST});

  const readProducts = (limit) => {
    return pool.query( `SELECT * FROM products LIMIT ${limit}`)
  }

  const readProduct = (id) => {
    return pool.query(`SELECT * FROM products WHERE product_id = ${id}`)
  };

  const readFeatures = (id) => {
    return pool.query(`SELECT feature_name, feature_value FROM features where product_id = ${id}`)
  };

  const readRelatedProducts = (id) => {
    return pool.query(`SELECT json_agg(related.related_product_id) FROM related where related.current_product_id = ${id}`)
  }

  const readStyles = (id) => {
    return pool.query(`SELECT row_to_json(t)
    FROM (
      SELECT product_id,
      (
      SELECT array_to_json(array_agg(row_to_json(d)))
      FROM (
        SELECT style_id, style_name, original_price, sale_price, default_style, (
          SELECT json_agg(t)
          FROM (
          SELECT photo_url, thumbnail_url FROM photos
          WHERE photos.style_id = styles.style_id) t) AS photos,
          (
          SELECT json_agg(t)
          FROM (
            SELECT size, quantity FROM sizes
            WHERE sizes.style_id = styles.style_id
            ) t) AS skus
      FROM STYLES
      WHERE styles.product_id = products.product_id ) d ) AS results
      FROM products
      WHERE products.product_id = ${id} ) t`
    )
  }

  module.exports = {readProducts, readProduct, readFeatures, readRelatedProducts, readStyles};
