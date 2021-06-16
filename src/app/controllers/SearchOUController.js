const { authenticate, getOU }= require('../../lib/functions-ldap');
require('dotenv').config()

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const password = process.env.PASSWORD;

module.exports = {
   
    async searchOU(req, res) {

        const { ou } = req.body;

        const arrayOuData = ou.split(",")
        const ouName = arrayOuData[0].split("=")
        const name = ouName[1]


        // autenticar
        const auth = await authenticate(userRoot, password);
        if (!auth) {
            return res.status(401).send({ error: "Authentication failed! Please, try again!" });
        }

        // verificar se OU existe
        const foundOU = await getOU(name)
        if (!foundOU) {
            return res.status(401).send({ error: `A OU ${ou} não foi encontrada na base LDAP` });
        };

         // returno para o usuario
         return res.status(200).send({
            success: `A OU ${foundOU.dn} existe na base LDAP`,
            ou: foundOU
        });

    }
}