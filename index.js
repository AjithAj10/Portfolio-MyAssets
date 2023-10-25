const express = require('express');
const router = require('./Routers'); // Import the router
const app = express();

app.use('/', router); // Use the router at the root path

app.listen(3000, () => {
    console.log('App running on port 3000');
});
