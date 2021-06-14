const { authenticate, getUser, getGroup }= require('../../lib/functions-ldap');
require('dotenv').config()

const userRoot = process.env.USERROOT;
const passwordRoot = process.env.PASSWORD;

const groupAdmins = process.env.GROUP_ADMINS;
const domain = process.env.DOMAIN;


module.exports = {

    async login(req, res, next) {

        try {

            const { user, password } = req.body;

            // grupo que pode logar na apliacação
            const group = `${groupAdmins}`;

            // autenticar como root para procurar o usuario e grupos
            const auth = await authenticate(userRoot, passwordRoot);
            if (!auth) {
                return res.status(401).send({ error: "Authentication failed! Please, try again!" });
            }

            // busca usuario no LDAP
            const foundUser = await getUser(user)
            if (!foundUser) {
                return res.status(401).send({ error: `O usuário ${user} não foi encontrado na base LDAP` });
            };

            const sAMAccountName = foundUser.sAMAccountName.concat(`${domain}`) // colocar como dinamico isso
            console.log("sAMAccountName", sAMAccountName)

            // autenticar com o usuario informado
            const auth_user = await authenticate(sAMAccountName, password);
            if (!auth_user) {
                return res.status(401).send({ error: `Não foi possível realizar a autenticação com o usuário ${user} e a senha informada` });
            }

            // verifica se o grupo existe
            const foundGroup = await getGroup(group)
            if (!foundGroup) {
                return res.status(401).send({ error: `O grupo ${group} não foi encontrado na base LDAP` });
            };

            // verificar se usuário está no grupo
            const isUserMemberOfGroup = foundGroup.member.includes(foundUser.dn);
            if (!isUserMemberOfGroup) {
                return res.status(401).send({ error: `Usuário ${user } não tem permissões para acessar` });
            };

            req.user = user // envia isso pro SessionController.login
            req.group = group

            console.log(req.user)
            console.log(req.group)

            next()

        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Internal error!' });
        }

    }
}