const express = require('express');
const app = express();
const db = require('./db/db.js');
const port = 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get(`/products/product/`, (req, res) => {
  db.getProduct(req.query.product_id, (data) => {
    res.send(data);
  })
})

app.get(`/products/related/`, (req, res) => {
  db.getRelatedProducts2(req.query.product_id)
  .then(data => {
    res.send(data);
  })
})

app.get(`/products/styles/`, (req, res) => {
  db.getStyles3(req.query.product_id)
  .then(data => {
    res.send(data);
  })
})