const { readProducts, readProduct, readFeatures, readRelatedProducts, readStyles} = require('../controllers/products.js');

const getProducts = (count) => {
  return readProducts(count)
  .then((res) => {
    return res.rows;
  })
  .catch(err => {console.log(err, 'err getting product from db')})
}

const getProduct = (id, callback) => {
  let productInfo;
  return readProduct(id)
  .then((res) => {
    productInfo = res.rows[0];
    return readFeatures(id)
  })
  .then((res) => {
    productInfo.features = res.rows;
    callback(productInfo);
  })
  .catch(err => {console.log(err, 'err getting product from db')})
}

const getRelatedProducts = (id) => {
  return readRelatedProducts(id)
  .then((res) => {
    return (res.rows[0].json_agg)
    })
    //callback(relatedProducts);
  .catch(err => {console.log(err, 'err getting product from db')})
}

const getStyles = (id) => {
  return readStyles(id)
  .then(res => {
    return res.rows[0].row_to_json;
  })
  .catch(err => {console.log(err, 'err getting styles from db')})
}

module.exports = {getProducts, getProduct, getRelatedProducts, getStyles};