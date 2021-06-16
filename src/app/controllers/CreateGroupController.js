const { authenticate, getGroup, addGroup }= require('../../lib/functions-ldap');
require('dotenv').config()

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const passwordRoot = process.env.PASSWORD;
const adSuffix = process.env.ADSUFFIX;
const ouGroups = process.env.OU_GROUPS;



module.exports = {
   
    async createGroup(req, res) {

        let { name } = req.body;

        name = name.toUpperCase();

        const newDN = `CN=${name}`.concat(`,${ouGroups}`).concat(`,${adSuffix}`)
        // const newDN = ouGroups.concat(`,${adSuffix}`)

        const newGroup_data = {
            name: name,
            cn: name,
            displayName: name,
            sAMAccountName: name,
            description: name,
            objectClass: ['top', 'group']
        };

        console.log("newDN", newDN)
        console.log("newGroup_data", newGroup_data)


        // autenticar
        const auth = await authenticate(userRoot, passwordRoot);
        if (!auth) {
            return res.status(401).send({ error: "Authentication failed! Please, try again!" });
        }

        // pegar nome do grupo e buscar searchgroup
        const foundGroup = await getGroup(name)
        if (foundGroup) {
            return res.status(401).send({ error: `O grupo ${name} já existe` });
        };

         // adicionar grupo
         const addNewGroup = await addGroup(newDN, newGroup_data);
         if (!addNewGroup) {
             return res.status(401).send("Grupo não pode ser criado");
         };

        // returno para o usuario
        return res.status(201).send({
            success: `O grupo ${name} foi adicionado com sucesso`,
            user: newGroup_data
        });

    }
}