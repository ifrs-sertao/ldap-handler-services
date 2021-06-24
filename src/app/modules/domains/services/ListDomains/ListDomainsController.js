const listDomainsService = require('./ListDomainsService');

class ListDomainsController {

    constructor() {}

    async handle(request, response) {

        const listDomains = await listDomainsService.execute();

        return response.status(200).send(listDomains);

    }
}

module.exports = new ListDomainsController;