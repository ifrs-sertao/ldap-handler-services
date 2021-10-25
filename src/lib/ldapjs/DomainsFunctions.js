const connection = require('../../app/config/CreateClientConnection');
require('dotenv').config()

const {ldapClient, ldapjs } = connection;

const adSuffix = process.env.ADSUFFIX;

module.exports = {

    async searchDomainFunction(domain) {

        const opts = {
            filter: `(&(objectCategory=domain)(|(dn=${domain})(dc=${domain})))`,
            scope: 'sub',
        };

        const result = await new Promise((resolve, reject) => {

            let domains = [];

            ldapClient.search(adSuffix, opts, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    res.on('searchEntry', async function (entry) {
                        domains.push(entry.object)
                    });
                    res.on('end', async function () {
                        if (domains.length < 1) {
                            reject()
                        } else {
                            resolve(domains);
                        }
                    })
                }
            });
        }).then(data => { return data }).catch(() => { return false })

        return result
    }
}
