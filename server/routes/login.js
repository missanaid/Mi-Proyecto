const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const _ = require('underscore');

const Jugador = require('../models/jugador');
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Jugador.findOne({ email: body.email }, (err, jugadorDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!jugadorDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }


        if (!bcrypt.compareSync(body.password, jugadorDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            jugador: jugadorDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCIDAD });

        res.json({
            ok: true,
            jugador: jugadorDB,
            token
        });


    });

});

//Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return ({
                ok: false,
                err: e
            });
        });


    Jugador.findOne({ email: googleUser.email }, (err, jugadorDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (jugadorDB) {

            if (jugadorDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    jugador: jugadorDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCIDAD });


                return res.json({
                    ok: true,
                    jugador: jugadorDB,
                    token,
                });

            }

        } else {
            // Si el jugador no existe en nuestra base de datos
            let jugador = new Jugador();

            jugador.nombre = googleUser.nombre;
            jugador.email = googleUser.email;
            jugador.img = googleUser.img;
            jugador.google = true;
            jugador.password = ':3';

            jugador.save((err, jugadorDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    jugador: jugadorDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCIDAD });


                return res.json({
                    ok: true,
                    jugador: jugadorDB,
                    token,
                });

            });
        }
    });


});




module.exports = app;