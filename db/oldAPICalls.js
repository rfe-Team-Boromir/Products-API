const { Pool, Client } = require('pg');
const config = require('../dbconfig.js');

const pool = new Pool({
  user: config.USER,
  database: config.DATABASE,
  port: config.PORT,
  host: config.HOST});

// get the product matching product_id input
const getProduct = (id, callback) => {
  let productInfo;
  pool.query(`SELECT * FROM products WHERE product_id = ${id}`)
  .then((res) => {
    productInfo = res.rows[0];
    return pool.query(`SELECT feature_name, feature_value FROM features where product_id = ${id}`)
  })
  .then((res) => {
    productInfo.features = res.rows;
    callback(productInfo);
  })
  .catch(err => {console.log(err, 'err getting product from db')})
}
// // get the related products matching product_id input
// const getRelatedProducts = (id, callback) => {
//   let relatedProducts = [];
//   // gets all of the related products and their descriptions
//   pool.query(`SELECT * FROM related where current_product_id = ${id}`)
//   .then((res) => {
//     (res.rows).forEach(product => {
//       relatedProducts.push(product.related_product_id);
//     })
//     callback(relatedProducts);
//   })
//   .catch(err => {console.log(err, 'err getting product from db')})
// }

// now much after after indexing current_product_id ==>  from 1-2s to 20ms! Also now returning a promise instead of using a callback!!
const getRelatedProducts2 = (id) => {
  return pool.query(`SELECT json_agg(related.related_product_id) FROM related where related.current_product_id = ${id}`)
  .then((res) => {
    return (res.rows[0].json_agg)
    })
    //callback(relatedProducts);
  .catch(err => {console.log(err, 'err getting product from db')})
}


  // ensure that styles contain all of the pictures and stock as well
const getStyles = (id, callback) => {
  let styles;
  let photos = {};
  let skus = {};
  pool.query(`SELECT * FROM styles join photos on styles.style_id = photos.style_id where product_id = ${id}`)
  .then(res => {
    let stylesInfo = res.rows;
    stylesInfo.forEach(style => {
      if (photos[Number(style.style_id)] === undefined) {
        photos[Number(style.style_id)] = [];
      }
      photos[Number(style.style_id)].push({thumbnail_url: style.thumbnail_url, url: style.photo_url});
    })
    return pool.query(`SELECT * FROM styles join sizes on styles.style_id = sizes.style_id where product_id = ${id}`)
  })
  .then(res => {
    let stockInfo = res.rows;
    stockInfo.forEach(stock => {
      if (skus[Number(stock.style_id)] === undefined) {
        skus[Number(stock.style_id)] = {};
      }
      skus[Number(stock.style_id)][Number(stock.size_id)] = {quantity: Number(stock.quantity), value: stock.size}
    })
  })
  .then(() => {
    return pool.query(`SELECT * FROM styles where product_id = ${id}`)
  })
  .then(res => {
    styles = res.rows;
    styles.forEach(style => {
      style['photos'] = photos[style.style_id];
      style['skus'] = skus[style.style_id];
    })
    callback(styles);
  })
  .catch(err => {console.log(err, 'err getting styles from db')})
}


// {
//   style_id: 3,
//   product_id: 1,
//   style_name: 'Ocean Blue & Grey',
//   sale_price: '100',
//   original_price: '140',
//   default_style: 0,
//   photo_id: 15,
//   photo_url: 'https://images.unsplash.com/photo-1557760257-b02421ae77fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80',
//   thumbnail_url: 'https://images.unsplash.com/photo-1557760257-b02421ae77fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
//   size_id: 17,
//   size: 'XL',
//   quantity: 15
// }
  // done with one query
  const getStyles2 = (id, callback) => {
    let styles = {};
    styles.product_id = id;
    styles.results = {};
    pool.query(`SELECT * FROM styles inner join photos on styles.style_id = photos.style_id
    inner join sizes on styles.style_id = sizes.style_id where product_id = ${id}`)
    .then(res => {
      (res.rows).forEach(product => {
        let styleId = Number(product.style_id);
        if (styles.results[styleId] === undefined) {
          styles.results[styleId] = {};
        }
        if (styles.results[styleId].photos === undefined) {
          styles.results[styleId].photos = [];
        }
        if (styles.results[styleId].skus === undefined) {
          styles.results[styleId].skus = {};
        }
        styles.results[styleId].style_id = product.style_id;
        styles.results[styleId].name = product.style_name;
        styles.results[styleId].original_price = product.original_price;
        styles.results[styleId].sale_price = product.sale_price;
        styles.results[styleId]['default?'] = Boolean(product.default_style);
        styles.results[styleId].photos.push({thumbnail_url: product.thumbnail_url, url: product.photo_url});
        styles.results[styleId].skus[product.size_id] = {quantity: Number(product.quantity), value: product.size};
      })
      let results = [];
      for (let key in styles.results) {
        results.push(styles.results[key]);
      }
      styles.results = results;
      callback(styles);
    })
    .catch(err => {console.log(err, 'err getting styles from db')})
  }


  const getStyles3 = (id) => {
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
    .then(res => {
      return res.rows[0].row_to_json;
    })
    .catch(err => {console.log(err, 'err getting styles from db')})
  }

  module.exports = {getProduct, getStyles, getStyles2, getStyles3, getRelatedProducts2};