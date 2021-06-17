const { authenticate, getUser } = require('../../../../lib/functions-ldap');
require('dotenv').config()
const AppError = require('../../../../shared/errors/AppError')

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const passwordRoot = process.env.PASSWORD;

class SearchUserService {

    constructor() {}

    async execute(user) {

        console.log('entrando no serviço)')

        // autenticar
        const auth = await authenticate(userRoot, passwordRoot);
        if (!auth) {
            throw new AppError(401, `Authentication failed! Please, try again!`)
        }

        // busca usuário
        const foundUser = await getUser(user)
        if (!foundUser) {
            throw new AppError(404, `The user ${user} does not exists!"`);
        };

        return foundUser
    }
}

module.exports = new SearchUserService;
