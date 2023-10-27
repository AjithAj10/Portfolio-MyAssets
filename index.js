const express = require('express');
const router = require('./Routers'); // Import the router
const app = express();
const mongoose = require("mongoose");
const coinsModel = require('./Models/coins');
require('dotenv').config();
app.use(express.json());


app.use('/', router); // Use the router at the root path


const url = process.env.DB_URL;

let fn = async () => {
  try {
    await mongoose.connect(url);
    console.log("connected...");
 
  } catch (err) {
    console.error(err);
  }
};
fn();


app.listen(3000, () => {
    console.log('App running on port 3000');
});
