const express = require('express');
const app = express();


app.use(require('./jugador'));
app.use(require('./login'));

module.exports = app;