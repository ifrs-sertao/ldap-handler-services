const ldapjs = require('ldapjs');
require('dotenv').config()
const AppError = require('../../shared/errors/AppError')

const { bindLDAP } = require('../../lib/ldapjs/BindLDAP');


class CreateClientConnection {
    constructor() {
        this.user = process.env.USERROOT;
        this.password = process.env.PASSWORD;
        this.url = process.env.URL
    }

    CreateClient() {
        const ldapConfig = {
            url: this.url,
        }
    
        const ldapOptions = {
            url: ldapConfig.url,
            reconnect: true
        };
    
        const ldapClient = ldapjs.createClient(ldapOptions);
        ldapClient.on('error', (err) => {
            if (err) {
                console.log(`Error in ldapClient: ${err}`);
            }
        });

        const auth = bindLDAP(this.user, this.password, ldapClient)
        if (!auth) {
            throw new AppError(500, `Fail in bind!`)
        }

        return { ldapjs, ldapClient}
    }
  
}

module.exports = new CreateClientConnection;