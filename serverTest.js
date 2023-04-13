const http = require('k6/http')
const {check, sleep} = require('k6')

module.exports = {
  options: {
      stages:[
        {duration:'30s', target:10},
        {duration:'1m', target:50},//normal request load
        {duration:'1m', target:1000},// request load around the breaking point
        {duration:'1m', target:1000},
        {duration:'30s', target:2000},// request load beyond the breaking point
        {duration:'30s', target:0},//scale down to 0 requests for recovery stage
    ],
    thresholds: {
      http_req_failed: ['rate<0.01'],
      http_req_duration: ['p(90)<20', 'p(95)<50', 'p(100)<150']
    }
  },

default: function () {

    const pages = [
      '/products/related/?product_id=1',
      '/products/product/?product_id=1',
      '/products/styles/?product_id=1'
    ]

    for (let page of pages) {
      const res = http.get('http://localhost:3000' + page);
      check(res, {
        'status was 200': (r) => r.status === 200,
        'duration was <= 20ms': (r) => r.timings.duration <= 20,
        'duration was <= 50ms': (r) => r.timings.duration <= 50,
        'duration was <= 150ms': (r) => r.timings.duration <= 150,
      });
      sleep(1);
    }
  }


}