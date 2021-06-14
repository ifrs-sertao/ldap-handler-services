// var ldapjs = require('ldapjs');
const { authenticate, getUser, getGroup, addUserToGroup }= require('../../lib/functions-ldap');
require('dotenv').config()

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const password = process.env.PASSWORD;
const adSuffix = process.env.ADSUFFIX;

const OU_ANO = process.env.OU_ANO;

// OU que será criado os usuários - [] colocar como dinâmica
const OU_ALUNOS = `OU=${OU_ANO}, OU=NODEJS-TESTE, OU=USUARIOS,OU=CAMPUS,DC=devdom,DC=sertao,DC=ifrs,DC=edu,DC=br`;



module.exports = {
   
    async searchGroup(req, res) {

        let { group } = req.params;

        // autenticar
        const auth = await authenticate(userRoot, password);
        if (!auth) {
            return res.status(401).send({ error: "Authentication failed! Please, try again!" });
        }

        // pegar nome do grupo no params e buscar searchgroup e pegar groupDN
        const foundGroup = await getGroup(group)
        if (!foundGroup) {
            return res.status(401).send({ error: `O grupo ${group} não foi encontrado na base LDAP` });
        };

         // returno para o usuario
         return res.status(201).send({
            success: `O grupo ${foundGroup.cn} existe na base LDAP`,
            group: foundGroup
        });


    }
}