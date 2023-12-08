const express = require('express');
const router = express.Router();
const Binance = require('./Binance');
const imageParser = require('./dataFromImage.js');
const AddCoin = require('./AddCoin');
const Ku_API_KEY = "654cf8e93872490001ce73f3";
const axios = require('axios');

router.get('/binance/assets', async (req, res) => {
    try {
        const result = await Binance.fetchBinanceAssets();
        let balances = result.filter(balance => balance.free > 0.1);
        res.send(balances);
    } catch (err) {
        res.send(err);
        console.log('error', err);
    }
});

router.use('/binance/trade', async (req, res) => {
    try {
        const result = await Binance.getLatestTrades();
        console.log(result);
        res.send(result);
    } catch (err) {
        res.send(err);
        console.log('error', err);
    }
});

router.use('/imageParser', async (req,res) => {
    let data = await imageParser.extractTextFromImage();
    res.send(data)
})

router.post('/addCoin', async (req, res) => {
    let data = await AddCoin.createCoin(req.body);
    res.send(data);
})
router.get('/viewCoins', async (req, res) => {
    let data = await AddCoin.viewCoins();
    res.send(data);
})
router.post('/edit/coin', async (req, res) => {
    let data = await AddCoin.editCoin(req.body);
    console.log(req.body);
    res.send(data);
})

router.get('/ku/assets', async (req, res) => {
    try{
        console.log('api error');
    const response = await axios.get('https://api.kucoin.com/api/v1/accounts', {
        headers: {
          Authorization: `Bearer ${Ku_API_KEY}`,
        },
      });
    console.log(response.data);
      return response.data.balances;
    }catch(err){
        console.log(err);
    }
    })
    
    




module.exports = router;
