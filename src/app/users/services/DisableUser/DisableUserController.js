const disableUserService = require('./DisableUserService');

class DisableUserController {

    constructor() {}

    async handle(request, response) {

        const { user } = request.params;

        const disable = await disableUserService.execute(user);

        return response.status(200).send({
            enable: !disable,
        });

    }
}

module.exports = new DisableUserController;