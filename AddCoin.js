const mongoose = require("mongoose");
const coinModel = require("./Models/coins");

async function createCoin({name,avgBuyAmount,quantity,investedAmount, lastDate, status}) {

    try{
        let date = new Date();
        
    let newCoin = new coinModel({name,avgBuyAmount,quantity,investedAmount,date,status});

    await coinModel.create(newCoin);

    return newCoin;

    }catch(e){
        console.log(e);
    }
}

module.exports = {createCoin}