const mongoose = require("mongoose");
const coinModel = require("./Models/coins");

async function createCoin({
  name,
  avgBuyAmount,
  quantity,
  investedAmount,
  lastDate,
  status,
}) {
  try {
    let date = new Date();

    let newCoin = new coinModel({
      name,
      avgBuyAmount,
      quantity,
      investedAmount,
      lastDate,
      status,
    });
    let ExistCoin = await coinModel.findOne({ name: name });

    if (ExistCoin.quantity !== quantity) await coinModel.create(newCoin);
    else console.log(`${name}  exist`);
    return newCoin;
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

    let ExistCoin = await coinModel.findOne({ name: name });

    if (!ExistCoin) {
      await coinModel.create(newCoin);
    } else {
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

      console.log(updatedCoin); // Log the updated document if needed
    }

    return updatedCoin;
  } catch (e) {
    console.log(e);
  }
}

module.exports = { createCoin, viewCoins, editCoin };
