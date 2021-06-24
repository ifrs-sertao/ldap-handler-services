const { searchDomainFunction } = require('../../../../lib/ldapjs/DomainsFunctions')

class DomainsRepository  {

  constructor() {};

  async list(domain) {
    
    const listDomains = await searchDomainFunction(domain);

    return listDomains;
  }

}

module.exports = new DomainsRepository;