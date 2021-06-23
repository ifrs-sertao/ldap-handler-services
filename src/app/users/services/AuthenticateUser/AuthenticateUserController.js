const authenticateUserService = require('./AuthenticateUserService')

class AuthenticateUserController {

    constructor() {}

    async handle(request, response) {

        const { user } = request.params;
        const { password } = request.body

        const auth = await authenticateUserService.execute(user, password)

        return response.status(200).send({
            message: `Autenticação realizada com sucesso!`
        });

    }
}

module.exports = new AuthenticateUserController;
