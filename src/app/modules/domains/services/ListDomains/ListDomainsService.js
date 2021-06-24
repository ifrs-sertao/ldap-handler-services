const AppError = require('../../../../../shared/errors/AppError')
const domainsRepository = require('../../repositories/DomainsRepository')

class ListDomainsService {

    constructor() {}

    async execute() {

        const listDomains = await domainsRepository.list(`*`)
        
        if (!listDomains) {
            throw new AppError(500, `The domains cannot be listed`);

        };

        return listDomains
    }
}

module.exports = new ListDomainsService;
