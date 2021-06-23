require('dotenv').config()
const AppError = require('../../../../shared/errors/AppError')
const usersRepository = require('../../repositories/UsersRepository')

const domain = process.env.DOMAIN

class AuthenticateUserService {

    constructor() {}

    async execute(user, password) {

        const foundUser = await usersRepository.searchByUser(user)
        if (!foundUser) {
            throw new AppError(404, `The user ${user} does not exists!`);
        };

        const sAMAccountName = foundUser.sAMAccountName.concat(`${domain}`) 

        const auth = await usersRepository.authenticateUser(sAMAccountName, password);
        if (!auth) {
            throw new AppError(401, `Senha inválida! Falha na autenticação!`)
        }

        return auth
    }
}

module.exports = new AuthenticateUserService;
