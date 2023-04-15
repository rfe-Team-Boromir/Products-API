const express = require('express');
const app = express();
const { getProducts, getProduct, getRelatedProducts, getStyles } = require('./models/products.js');
const port = 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get(`/products/`, (req, res) => {
  getProducts(req.query.count)
  .then(data => {
    res.send(data);
  })
})
app.get(`/products/product/`, (req, res) => {
  getProduct(req.query.product_id, (data) => {
    res.send(data);
  })
})

app.get(`/products/related/`, (req, res) => {
  getRelatedProducts(req.query.product_id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    console.log(err, 'err with related query call');
  })
})

app.get(`/products/styles/`, (req, res) => {
  getStyles(req.query.product_id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    console.log(err, 'err with styles query call');
  })
})