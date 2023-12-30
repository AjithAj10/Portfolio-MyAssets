const mongoose = require("mongoose");
const coinModel = require("./Models/coins");
const { getLatestTrades } = require("./Binance");

async function createCoin({
  name,
  avgBuyAmount,
  quantity,
  investedAmount,
  lastDate,
  status,
}) {
  try {
    let ExistCoin = await coinModel.findOne({ name: name });
    let trades = await getLatestTrades(`${name}USDT`);

    if(ExistCoin && ExistCoin.quantity == quantity){
      console.log(name + " exist");
      return;
    }
    if (!ExistCoin) {
      let newCoin;
      if (!(Math.abs(trades[trades.length - 1].qty - quantity) > 0.1)) {
        const trade = trades[trades.length - 1];
        newCoin = new coinModel({
          name,
          avgBuyAmount: trade.price,
          quantity,
          investedAmount: Math.ceil(trade.quoteQty),
          date: trade.time,
          exchange: 'binance',
          status: "active",
        });
      }else {
        const avg = 10/quantity;
        newCoin = new coinModel({
          name,
          avgBuyAmount: avg,
          quantity,
          investedAmount: 10,
          date: trades[trades.length - 1].time,
          exchange: 'binance',
          status: "in-progress",
        })
      }
      await coinModel.create(newCoin);
    } else {
      const trade = trades[trades.length - 1];
      if (!(trades[trades.length - 1].qty - ExistCoin.quantity) > 0.11) {
        //call update
        editCoin({
          name,
          avgBuyAmount: trade.price,
          quantity,
          investedAmount: Math.ceil(trade.quoteQty),
          date: trade.time,
          status: "active",
        });

        return `edited ${name}`;
      } else {
        const trade = trades[trades.length - 1];
        //more calcultions to find entry
        let findQty = 0;
        let findInvested = 0;
        for (let i = 0; i < trades.length; i++) {
          const qtyAsString = trades[trades.length - i - 1].qty;
          const qtyAsNumber = parseFloat(qtyAsString);
          findQty += qtyAsNumber;

          const InvestAsString = trades[trades.length - i - 1].quoteQty;
          const InvestAsNumber = parseFloat(InvestAsString);
          findInvested += InvestAsNumber;
          
          if(findQty - quantity <= 0 && findQty - quantity >= -0.1) {
            i = trades.length;
            break;
        }
        if( i == trades.length - 1 ) {
          findQty = quantity;
          findInvested = 0;
        }
      }
      if(findInvested)  avgBuyAmount = findInvested / quantity;
      
      editCoin({
        name,
        avgBuyAmount,
        quantity,
        investedAmount: findInvested ? findInvested : investedAmount,
        date: trade.time,
        status: findInvested ? "active" : "in-progress",
      });
    }
  }
    return;
  } catch (e) {
    console.log(e);
  }
}
async function viewCoins() {
  try {
    const AllCoins = await coinModel.find();

    return AllCoins;
  } catch (e) {
    console.log(e);
  }
}
async function trunc() {
  let ExistCoin = await coinModel.deleteMany();
}
async function editCoin({
  name,
  avgBuyAmount,
  quantity,
  investedAmount,
  date,
  status,
}) {
  try {
    const lastDate = new Date(date);

    let newCoin = new coinModel({
      name,
      avgBuyAmount,
      quantity,
      investedAmount,
      lastDate,
      status,
    });

    //let ExistCoin = await coinModel.findOne({ name: name });

    const filter = { name: name }; // Specify the coin name to update
    const update = {
      $set: {
        avgBuyAmount: avgBuyAmount,
        quantity: quantity,
        investedAmount: investedAmount,
        lastDate: lastDate,
        status: status,
      },
    };

    const options = { new: true }; // Optional settings, such as returning the updated document

    // Update the document
    const updatedCoin = await coinModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    //console.log(updatedCoin); // Log the updated document if needed

    return updatedCoin;
  } catch (e) {
    console.log(e);
    return e;
  }
}

module.exports = { createCoin, viewCoins, editCoin, trunc };
