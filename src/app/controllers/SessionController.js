const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: "360d", // colocar como anual
    });
}

module.exports = {

    async login(req, res) {
        try {

            const { user, group } = req

            return res.send({
                user,
                group,
                token: generateToken({ id: user}),
                success: 'Autenticação realizada com sucesso' ,        
            });

        } catch (error) {
            return res.status(400).send({ error: 'Try again' });
        }
    }
}