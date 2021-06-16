const { authenticate, getOU, addOU }= require('../../lib/functions-ldap');
require('dotenv').config()

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const password = process.env.PASSWORD;
const adSuffix = process.env.ADSUFFIX;  


module.exports = {
   
    async createOU(req, res) {

        let { ou } = req.body;
        ou = ou.concat(`,${adSuffix}`)
        // ou = ou.toUpperCase();
        const arrayOuData = ou.split(",")
        const ouName = arrayOuData[0].split("=")

        const newOU_data = {
            name: ouName[1],
            ou: ouName[1],
            objectClass: ['top', 'organizationalUnit']
        }

        console.log("ou", ou)

        // autenticar
        const auth = await authenticate(userRoot, password);
        if (!auth) {
            return res.status(401).send({ error: "Authentication failed! Please, try again!" });
        }

        // verificar se OU existe
        const foundOU = await getOU(newOU_data.name)
        
        if (foundOU) {
            return res.status(401).send({ error: `A OU ${ou} já existe` });
        };

        // // criar OU
        const addNewOU= await addOU(ou, newOU_data);
        if (!addNewOU) {
            return res.status(401).send({ error: "OU não pode ser criada"});
        };

         // verificar se OU existe
         const foundCreatedOU = await getOU(newOU_data.name)
        
         // returno para o usuario
         return res.status(200).send({
            success: `A OU ${ou} foi criada`,
            ou: foundCreatedOU
        });

    }
}