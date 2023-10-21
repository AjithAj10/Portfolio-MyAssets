const Binance = require('node-binance-api');
const axios = require('axios');
const crypto = require('crypto');
// Initialize the Binance API client with your API key and secret.
 const API_KEY= 'cAQH6HwNOZfOn6nJxmA7utzuwQEKAmS4WxMdEjuLzrBw7SWXGHmLyyx23ZKHZKzA';
 const API_SECRET= 'ffunAEjjz46m7ra6zIIuVnLxCMBlu6ZcdVy7S6encMwb7brI1YFBYQSLu3xkFlVs';

async function fetchBinanceAssets (){
  const BASE_URL = 'https://api.binance.com';
const ENDPOINT = '/api/v3/account';

// Fetch the server time from Binance
const result = axios.get(`${BASE_URL}/api/v3/time`)
  .then(async response => {
    const serverTime = response.data.serverTime;

    // Create a timestamp for the request based on the server time
    const timestamp = serverTime;

    // Create a query string with the timestamp
    const queryString = `timestamp=${timestamp}`;

    // Create the signature
    const signature = crypto
      .createHmac('sha256', API_SECRET)
      .update(queryString)
      .digest('hex');

    // Define the headers for the request
    const headers = {
      'X-MBX-APIKEY': API_KEY,
    };

    // Define the request URL
    const url = `${BASE_URL}${ENDPOINT}?${queryString}&signature=${signature}`;

    // Send the request
   let data = await axios.get(url, { headers })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error(error);
      });
      
      return data;
  })
  .catch(error => {
    console.error(error);
  });
  return result
  
  }

  module.exports = {fetchBinanceAssets}