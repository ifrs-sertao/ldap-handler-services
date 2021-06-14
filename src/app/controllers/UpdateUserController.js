// var ldapjs = require('ldapjs');
const { authenticate, updateUser, getUser, addUserToGroup }= require('../../lib/functions-ldap');
require('dotenv').config()

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const passwordRoot = process.env.PASSWORD;
// const adSuffix = process.env.ADSUFFIX;

const OU_ANO = process.env.OU_ANO;

// OU que será criado os usuários - [] colocar como dinâmica
const OU_ALUNOS = `OU=${OU_ANO}, OU=NODEJS-TESTE, OU=USUARIOS,OU=CAMPUS,DC=devdom,DC=sertao,DC=ifrs,DC=edu,DC=br`;



module.exports = {
    
    async updateUser(req, res) {

        const { user } = req.params;
        const updateUser_data = req.body

        //quais attributos pode ser atualizados? fazer lista aqui e verificar com includes

        // autenticar
        const auth = await authenticate(userRoot, passwordRoot);
        if (!auth) {
            return res.status(401).send({ error: "Authentication failed! Please, try again!" });
        }

        // busca usuario no LDAP
        const foundUser = await getUser(user)
        if (!foundUser) {
            return res.status(401).send({ error: `O usuário ${user} não foi encontrado na base LDAP`});
        };

        // modificar atributos do usuario 
        const updateNewUser = await updateUser(foundUser.dn, {...updateUser_data}); 
        if (!updateNewUser) {
            return res.status(401).send({ error: `O usuário ${user} não foi atualizado`});
        };

        // busca usuario atualizado no LDAP
        const foundUpdatedUser = await getUser(user)
        if (!foundUpdatedUser) {
            return res.status(401).send({ error: `O usuário ${user} não foi encontrado na base LDAP`});
        };

        // returno para o usuario
        return res.status(201).send({
            success: `O e-mail do aluno ${foundUpdatedUser.cn} foi alterado com sucesso`,
            user: foundUpdatedUser,
        });
    },

    async updateUserPassword(req, res) {

        const { user } = req.params;
        const { password } = req.body

        // autenticar
        const auth = await authenticate(userRoot, passwordRoot);
        if (!auth) {
            return res.status(401).send({ error: "Authentication failed! Please, try again!" });
        }

        // busca usuario no LDAP
        const foundUser = await getUser(user)
        if (!foundUser) {
            return res.status(401).send({ error: `O usuário ${user} não foi encontrado na base LDAP`});
        };

        // modificar a senha do usuario 
        const updateUserPassword = await updateUser(foundUser.dn, { password: password}); 
        if (!updateUserPassword) {
            return res.status(401).send({ error: `A senha do usuário ${user} não foi atualizada`});
        };
        
        // encaminhar email para o usuário informando a nova senha
        


        // returno para o usuario
        return res.status(201).send({
            success: `Senha do usuário ${user} foi alterada com sucesso`,
            user: foundUser,
        });
    },


    
}