var assert = require('assert');
const { readProducts, readFeatures, readRelatedProducts, readStyles} = require('./server/controllers/products.js');

describe('Product API', function() {
  describe('readProduct', function() {
    it('readProduct should return product_id of given id', () => {
      return readProduct(1)
      .then (data => {
        assert.equal(data.rows[0].product_id, 1);
      })
    });
    it('readProduct should return product_name of given id', () => {
      return readProduct(1)
      .then (data => {
        assert.equal(data.rows[0].product_name, "Camo Onesie");
      })
    });
  });
  describe('readFeatures', function() {
    it('readFeatures should return two features', () => {
      return readFeatures(1)
      .then (data => {
        assert.equal(data.rows.length, 2);
      })
    });
  });
});