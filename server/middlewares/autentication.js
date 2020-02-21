const jwt = require('jsonwebtoken');

//====================
//Verificar token
//====================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.jugador = decoded.jugador;
        next();

    });


};

//====================
//Verificar Rol
//====================

let verificaRol = (req, res, next) => {


    let jugador = req.jugador;
    if (jugador.role === 'PRO_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El jugador no está autorizado'
            }
        })
    }


}


module.exports = {
    verificaToken,
    verificaRol
}