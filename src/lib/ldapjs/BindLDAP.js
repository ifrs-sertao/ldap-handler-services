require('dotenv').config()

module.exports = {

    async bindLDAP(user, password, ldapClient) {

        const result = new Promise((resolve, reject) => {

            ldapClient.bind(user, password, function (err) {
                if (err) {
                    console.log('ERRO: Falha na autenticação LDAP');
                    console.log(err)
                    reject(err)
                } else {
                    console.log("SUCESSO: Autenticação realizada com sucesso - Conexão LDAP realizada");
                    resolve()
                }
            })
        }).then(data => { return true }).catch(() => { return false })
    
        return { result, ldapClient }
    }
    
}