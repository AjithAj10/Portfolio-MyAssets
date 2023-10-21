const express = require('express');
const app = express();
const Binance = require('./Binance');

app.use('/binance/assets', async (req,res) => {
 try {
 const result = await Binance.fetchBinanceAssets();
 //console.log(result);
 let balances = result.balances.filter(balance => balance.locked > 0.1)
  res.send(balances);
 }
catch (err) {
  res.send(err);
  console.log('error', err);
 }
})





app.listen('3000',() => {
    console.log('App running...');
})
