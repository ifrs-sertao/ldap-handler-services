require('dotenv').config()

const searchUserService = require('./SearchUserService')

class searchUserController {

    constructor() {}

    async handle(request, response) {

        let { user } = request.params;

        const foundUser = await searchUserService.execute(user)

        return response.status(200).send(foundUser);

    }
}

module.exports = new searchUserController;
