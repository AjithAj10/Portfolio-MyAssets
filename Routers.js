const express = require('express');
const router = express.Router();
const Binance = require('./Binance');
const imageParser = require('./dataFromImage.js');

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


module.exports = router;
