const axios = require('axios');
const crypto = require('crypto');

const apiKey = '654cf8e93872490001ce73f3';
const apiSecret = '979ab4eb-515e-49c1-a750-997daca86390';
const apiPassphrase = 'portfolio_node';

const baseUrl = 'https://api.kucoin.com';
const endpoint = '/api/v1/accounts'; // Replace with your desired endpoint

const timestamp = Date.now();
const nonce = crypto.randomBytes(16).toString('hex');

const payload = `${timestamp}${nonce}${endpoint}`;
const signature = crypto.createHmac('sha256', apiSecret).update(payload).digest('base64');

const headers = {
  'KC-API-KEY': apiKey,
  'KC-API-SIGN': signature,
  'KC-API-TIMESTAMP': timestamp,
  'KC-API-PASSPHRASE': apiPassphrase,
  'Content-Type': 'application/json',
};

axios.post(`${baseUrl}${endpoint}`, {/* Your request data */}, { headers })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error.response.data);
  });
