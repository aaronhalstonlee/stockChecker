/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          console.log(res.body.name)
          assert.property(res.body, 'name')
          assert.property(res.body, 'price')
          assert.property(res.body, 'likes')
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'msft', like: true})
          .end(function(err, res){
            assert.equal(res.body.like, true)
            done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        done();
      });
      
      test('2 stocks', function(done) {
        done();
      });
      
      test('2 stocks with like', function(done) {
        done();
      });
      
    });

});
