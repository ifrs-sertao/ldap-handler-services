// var ldapjs = require('ldapjs');
const { authenticate, getUser, getGroup, addUserToGroup }= require('../../lib/functions-ldap');
require('dotenv').config()

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const password = process.env.PASSWORD;
// const adSuffix = process.env.ADSUFFIX;

// const OU_ANO = process.env.OU_ANO;

// OU que será criado os usuários - [] colocar como dinâmica
// const OU_ALUNOS = `OU=${OU_ANO}, OU=NODEJS-TESTE, OU=USUARIOS,OU=CAMPUS,DC=devdom,DC=sertao,DC=ifrs,DC=edu,DC=br`;



module.exports = {
   
    async addUserInGroup(req, res) {

        let { group, user } = req.params;

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

        // pegar nome do grupo no params e buscar searchgroup e pegar groupDN - qual attr do grupo é unico? name? uid?
        const foundGroup = await getGroup(group)
        if (!foundGroup) {
            return res.status(401).send({ error: `O grupo ${group} não foi encontrado na base LDAP` });
        };

        // verificar se usuário já está no grupo
        const userAlreadyInGroup = foundGroup.member.includes(foundUser.dn);
        if (userAlreadyInGroup) {
            return res.status(401).send({ error: `Usuário já está no grupo ${group}`});
        };

        // vincular usuario ao grupo
        const addGroups = await addUserToGroup(foundUser.dn, foundGroup.dn);
        if (!addGroups) {
            return res.status(401).send({ error: "Usuário não foi adicionado no grupo"});
        };

         // returno para o usuario
         return res.status(201).send({
            success: `O usuário ${foundUser.cn} foi adicionado ao grupo ${foundGroup.cn} com sucesso`,
        });


    }
}