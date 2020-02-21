const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');



let app = express();
let Producto = require('../models/producto');



//================================
// Obtener todos los productos
//================================


app.get('/producto', verificaToken, (req, res) => {



});

//================================
// Obtener producto por ID
//================================


app.get('/producto/:id', verificaToken, (req, res) => {



});

//================================
// Crear producto
//================================


app.post('/producto', verificaToken, (req, res) => {


});

//================================
// Actualizar productos por ID
//================================


app.put('/producto/:id', verificaToken, (req, res) => {


});

app.delete('/producto/:id', verificaToken, (req, res) => {


});


















module.exports = app;