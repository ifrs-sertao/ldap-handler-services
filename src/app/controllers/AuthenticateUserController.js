// var ldapjs = require('ldapjs');
const { authenticate, getUser }= require('../../lib/functions-ldap');
require('dotenv').config()

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const passwordRoot = process.env.PASSWORD;
// const adSuffix = process.env.ADSUFFIX;

const OU_ANO = process.env.OU_ANO;

// OU que será criado os usuários - [] colocar como dinâmica
const OU_ALUNOS = `OU=${OU_ANO}, OU=NODEJS-TESTE, OU=USUARIOS,OU=CAMPUS,DC=devdom,DC=sertao,DC=ifrs,DC=edu,DC=br`;



module.exports = {
    async authenticateUser(req, res) {

        let { user } = req.params;
        let { password } = req.body;


         // autenticar
         const auth = await authenticate(userRoot, passwordRoot);
         if (!auth) {
             return res.status(401).send({ error: "Authentication failed! Please, try again!" });
         }

        // busca usuario no LDAP
        const foundUser = await getUser(user)
        if (!foundUser) {
            return res.status(401).send({ error: `O usuário ${user} não foi encontrado na base LDAP` });
        };

        const sAMAccountName = foundUser.sAMAccountName.concat('@campus.sertao.ifrs.edu.br') // colocar como dinamico isso

        // autenticar
        const auth_user = await authenticate(sAMAccountName, password);
        if (!auth_user) {
            return res.status(401).send({ error: "Não foi possível realizar a autenticação com esse usuário e senha" });
        }

        // returno para o usuario
        return res.status(201).send({
            success: `Autenticação realizada com sucesso`,
        });

    },

    // async login(req, res) {

    //     let { user, password } = req.body;

    //      // autenticar
    //      const auth = await authenticate(userRoot, passwordRoot);
    //      if (!auth) {
    //          return res.status(401).send({ error: "Authentication failed! Please, try again!" });
    //      }

    //     // busca usuario no LDAP
    //     const foundUser = await getUser(user)
    //     if (!foundUser) {
    //         return res.status(401).send({ error: `O usuário ${user} não foi encontrado na base LDAP` });
    //     };

    //     const sAMAccountName = foundUser.sAMAccountName.concat('@campus.sertao.ifrs.edu.br') // colocar como dinamico isso

    //     // autenticar
    //     const auth_user = await authenticate(sAMAccountName, password);
    //     if (!auth_user) {
    //         return res.status(401).send({ error: "Não foi possível realizar a autenticação com esse usuário e senha" });
    //     }

    //     // verifica se o grupo existe
    //     const foundGroup = await getGroup(group)
    //     if (!foundGroup) {
    //         return res.status(401).send({ error: `O grupo ${group} não foi encontrado na base LDAP` });
    //     };

    //     // verificar se usuário está no grupo
    //     const userAlreadyInGroup = foundGroup.member.includes(foundUser.dn);
    //     if (userAlreadyInGroup) {
    //         return res.status(401).send({ error: `Usuário já está no grupo ${group}` });
    //     };

    //     req.user = username // envia isso pro SessionController.login
    //     req.group = groupName

    //     console.log(req.user)
    //     console.log(req.group)

    //     next()

    // }
}