const express = require('express');
const { verificaToken, verificaRol } = require('../middlewares/autentication');

let app = express();
let Producto = require('../models/producto');



//================================
// Obtener todos los productos
//================================


app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('jugador', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        })




});

//================================
// Obtener producto por ID
//================================


app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('jugador', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB

            })
        })
});

//=======================
// Buscar productos por termino
//=======================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //RegExp crea un objeto 'expresión regular' para encontrar texto de acuerdo a un patrón.
    // la 'i' significa ignorar mayúsculas o minúsculas
    //'g' busqueda global
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })

        })
});

//================================
// Crear producto
//================================


app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    //crear nueva instancia del producto
    let producto = new Producto({
        //
        jugador: req.jugador._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

});

//================================
// Actualizar productos por ID
//================================


app.put('/producto/:id', [verificaToken, verificaRol], (req, res) => {

    let id = req.params.id;
    let body = req.body;



    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;


        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })
});



app.delete('/producto/:id', verificaToken, (req, res) => {



    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID del producto no existe'
                }
            });
        }
        //se le cambia el estado a falso para que no lo muestre pero no se elimina
        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoBorrado,
                mensaje: 'Producto eliminado'
            })
        })
    })

});


module.exports = app;