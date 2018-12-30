/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config();
const request = require('request');
const expect = require('chai').expect;
const MongoClient = require('mongodb');
const dbString = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const StockHandler = require('../controllers/stockHandler.js');

const Stock = new Schema({
  stock: String,
  price: Number,
  likes: [String]
});

const Ticker = mongoose.model('stock', Stock);

var price;

mongoose.connect(dbString, {useNewUrlParser: true},(err, db) => {
  if(err) throw(err)
  console.log('connected to: ' + db.db.databaseName);
});

module.exports = function (app) {
  //var price;
  app.route('/api/stock-prices')
    .get(function (req, res){
      //console.log('running get request...')
      var stockName = req.query.stock.toUpperCase();
      var stockTwoName = req.query.stockTwo? req.query.stockTwo.toUpperCase() : undefined;
      var like = req.query.like
      var url = 'https://api.iextrading.com/1.0/stock/' + stockName + '/price';
      var ip = req.connection.remoteAddress;
      request({url: url}, function(err, res, body){
        price = body;
        //console.log(price);
      })
      //console.log(stockName, stockTwoName);
      if(!stockTwoName){
        setTimeout(function(){
          Ticker.findOne({name: stockName}, (err, doc)=>{
            if(err && err.reason != undefined) console.error(err);
            if(doc&&!like){
              console.log('stock and !like')
              res.json({stockData: {stock: doc.stock, price: doc.price, likes: doc.likes.length}});
            }
            if(doc&&like){
              //console.log('stock and like', price);
              if(!doc.likes.includes(ip)){ 
                doc.likes.push(ip);
              }
              //console.log(stock);
              //stock.price = price
              doc.save((err, saved) =>{
                if(err) throw(err);
                res.json({stockData: {stock: saved.stock, price: saved.price, likes: saved.likes.length}});
              });
            }
            if(!doc){
              //console.log('!stock', price)
              const newDoc = new Ticker({
                stock: stockName,
                price: price,
                likes: like ? [ip] : []
              })
              newDoc.save((err,saved)=>{
                if(err) throw(err)
                res.json({stockData: {stock: saved.stock, price: saved.price, likes: saved.likes.length}})
              })
            }
          })
        }, 3000)
      } else {
        //console.log('double stock')
        var stockNameArr = [stockName, stockTwoName]
        var stockArr = [];
        
        Ticker.find({stock: stockName}, (err, doc) => {
          if(err && err.reason != undefined) throw(err);
          if(!doc){
            res.send(stockName + ' not found');
          } else {
            stockArr.push(doc);
          }
        })
        Ticker.find({stock: stockTwoName}, (err, doc) => {
          if(err && err.reason != undefined) throw(err);
          if(!doc){
            res.send(stockName + ' not found');
          } else {
            stockArr.push(doc);
            //console.log(stockArr)
            
            res.json({stockData: [
              {
                stock: stockArr[0][0].stock,
                price: stockArr[0][0].price,
                rel_likes: stockArr[0][0].likes.length - stockArr[1][0].likes.length
              },
              {
                stock: stockArr[1][0].stock,
                price: stockArr[1][0].price,
                rel_likes: stockArr[1][0].likes.length - stockArr[0][0].likes.length
              }
            ]})
          }
        })      
      }
    })    
};
;