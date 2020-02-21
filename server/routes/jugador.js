const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Jugador = require('../models/jugador');
const { verificaToken, verificaRol } = require('../middlewares/autentication')
const app = express();



app.get('/jugador', verificaToken, (req, res) => {




    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Jugador.find({}, 'nombre nick email juegosAdquiridos google horasDeJuego')
        .skip(desde)
        .limit(limite)
        .exec((err, jugadores) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Jugador.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    jugadores,
                    cuantos: conteo
                });
            })


        })


});

app.post('/jugador', [verificaToken, verificaRol], (req, res) => {

    let body = req.body;

    let jugador = new Jugador({

            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role,
            nick: body.nick,
            juegosAdquiridos: body.juegosAdquiridos,
            horasDeJuego: body.horasDeJuego
        })
        //Con esto se graba en la base de datos.

    jugador.save((err, jugadorDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            jugador: jugadorDB
        });
    })



});

app.put('/jugador/:id', [verificaToken, verificaRol], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'nick', 'role', 'estado', 'img', 'juegosAdquiridos']);


    Jugador.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, jugadorDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            jugador: jugadorDB
        });

    })
});

app.delete('/jugador/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };



    Jugador.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, jugadorBorrado) => {



        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!jugadorBorrado) {
            return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Jugador no encontrado'
                    }
                }

            )
        }
        res.json({
            ok: true,
            jugador: jugadorBorrado
        })
    })
});



module.exports = app;