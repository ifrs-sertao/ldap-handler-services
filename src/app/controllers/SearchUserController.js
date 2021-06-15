// var ldapjs = require('ldapjs');
const { authenticate, getUser }= require('../../lib/functions-ldap');
require('dotenv').config()

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const password = process.env.PASSWORD;
// const adSuffix = process.env.ADSUFFIX;


module.exports = {
   
    async searchUser(req, res) {

        let { user } = req.params;

        // autenticar
        const auth = await authenticate(userRoot, password);
        if (!auth) {
            return res.status(401).send({ error: "Authentication failed! Please, try again!" });
        }

        // busca usuario no LDAP
        const foundUser = await getUser(user)
        if (!foundUser) {
            return res.status(401).send({ error: `O usuário ${user} não foi encontrado na base LDAP` });
        };

         // returno para o usuario
         return res.status(200).send({
            success: `O usuário ${foundUser.cn} foi encontrado`,
            user: foundUser
        });


    }
}