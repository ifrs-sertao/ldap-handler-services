var ldapjs = require('ldapjs');
require('dotenv').config()

// Credentials LDAP Administrator 
// const userRoot = process.env.USERROOT;
const passwordRoot = process.env.PASSWORD;
const adSuffix = process.env.ADSUFFIX;  


// Criando cliente para conexão LDAP -- COLOCAR ISSO EM ARQ SEPARADO E FUNÇÃO
const ldapConfig = {
    url: process.env.URL
}

const ldapOptions = {
    url: ldapConfig.url,
};

const ldapClient = ldapjs.createClient(ldapOptions);
ldapClient.on('error', (err) => {
    if (err) {
        console.log(`Error in ldapClient: ${err}`);
    };
});
/////////////////////////////////////////////////

/*use this to create connection*/
async function authenticate(user, password) {

    const result = await bindPromise_autenticate(user, password)
        .then(data => {
            return true
        })
        .catch(err => {
            return false
        })

    return result
}

/*use this to add user*/
async function addUser(newDN, newUser) {

    const result = await addPromise_createUser(newDN, newUser)
    .then(data => {
        return true
    })
    .catch(err => {
        return false
    })

    return result
}

/*use this to update user attributes*/
async function updateUser(newDN, newUser_unixAttributes) {

    for (var [key, value] of Object.entries(newUser_unixAttributes)) {

        var change = "";
        if (key == "password") {

            console.log("key", key)
            const newPassword = encodeNewPassword(value)
            console.log("newPassword", newPassword)

            change = new ldapjs.Change({
                operation: 'replace', // use replace to update the existing attribute
                modification: {
                    unicodePwd: newPassword
                    
                }
            });

        } else {
            change = new ldapjs.Change({
                // operation: 'add',  //use add to add new attribute
                operation: 'replace', // use replace to update the existing attribute
                modification: {
                    [key]: value
                }
            });
        }

     
        const result = await modifyPromise_updateUser(newDN, change, key, value)
            .then(data => {
                return true
            })
            .catch(err => {
                console.log(err)
                return false
            })
    
        
        if (!result) {
            return false
        } 
    }

    return true
}


/*use this to add user to group*/
async function addUserToGroup(newDN, groupname) {  // groupname =  "ALUNOS"
    var change = new ldapjs.Change({
        operation: 'add',
        modification: {
            member: newDN
        }
    });

    const result = await addPromise_addUserInGroup(groupname, change)
        .then(data => {
            return true
        })
        .catch(err => {
            return false
        })

    return result
}

/*use this to get msSFU30MaxUidNumber*/
async function getMsSFU30MaxUidNumber() {

    const ypserver = process.env.YPSERVER

    var opts = {
        filter: '(objectClass=msSFU30DomainInfo)',
        scope: 'sub',
        attributes: ['msSFU30MaxUidNumber']
    };

    const result = await searchPromise_getMsSFU30MaxUidNumber(ypserver, opts)
            .then(data => {
                return data
            })
            .catch(err => {
                return false
            })

    return result
}

/*use this to update msSFU30MaxUidNumber*/
async function updateMsSFU30MaxUidNumber(new_msSFU30MaxUidNumber) {

    // let new_value = msSFU30MaxUidNumber = new_msSFU30MaxUidNumber + 1
    // console.log('atualizar para', new_value)

    ypserver = "CN=devdom,CN=ypservers,CN=ypServ30,CN=RpcServices,CN=System,DC=devdom,DC=sertao,DC=ifrs,DC=edu,DC=br" // trocar para produção

        var change = new ldapjs.Change({
            // operation: 'add',  //use add to add new attribute
            operation: 'replace', // use replace to update the existing attribute
            modification: {
                msSFU30MaxUidNumber: new_msSFU30MaxUidNumber
            }
        });

    const result = await modifyPromise_updateMsSFU30MaxUidNumber(ypserver, change)
        .then(data => {
            return true
        })
        .catch(err => {
            return false
        })

    return result
}




/// PROMISES


const bindPromise_autenticate = (user, password) => {
    return new Promise((resolve, reject) => {

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
    })
}

const addPromise_createUser = (newDN, newUser) => {
    return new Promise((resolve, reject) => {

        ldapClient.add(newDN, newUser, function (err) {
            if (err) {
                console.log("ERRO: Criação do usuário: " + err);
                reject(err)
            } else {
                console.log("SUCESSO: Usuário criado");
                resolve()
            }
        })
    })
}

const searchPromise_getMsSFU30MaxUidNumber = (ypserver, opts) => {
    return new Promise((resolve, reject) => {

        ldapClient.search(ypserver, opts, function (err, res) {
            if (err) {
                console.log("ERRO: Atributo não encontrado " + err)
                reject(err);
            } else {
                res.on('searchEntry', async function (entry) {
                    console.log('SUCESSO: MsSFU30MaxUidNumber localizado : ' + JSON.stringify(entry.object.msSFU30MaxUidNumber));
                    const data = entry.object
                    resolve(data);
                });
            }
        });
    })
}

const modifyPromise_updateUser = (newDN, change, key, value) => {
    return new Promise((resolve, reject) => {

        ldapClient.modify(newDN, change, function (err) {
            if (err) {
                console.log("ERRO: Atualização do usuário: "  + [key] + " : " + err);
                reject(err)
            } else {
                console.log("SUCESSO: Usuário atualizado - Atributo: " + [key]);
                resolve()
            }
        });
    })
}

const modifyPromise_updateMsSFU30MaxUidNumber = (ypserver, change) => {
    return new Promise((resolve, reject) => {

        ldapClient.modify(ypserver, change, function (err) {
            if (err) {
                console.log("ERRO: msSFU30MaxUidNumber não foi atualizado" + err);
                reject(err)
            } else {
                console.log("SUCESSO: msSFU30MaxUidNumber atualizado");
                resolve()
            }
        });
    })
}

const addPromise_addUserInGroup = (groupname, change) => {
    return new Promise((resolve, reject) => {

        ldapClient.modify(groupname, change, function (err) {
            if (err) {
                console.log("ERRO: Usuário não foi adicionado ao grupo: " + err);
                reject(err)
            } else {
                console.log("SUCESSO: Usuário adicionado ao grupo: " + groupname)
                resolve()
            }
        })
    })
}



/*use this to search a user*/
async function getUser(usuario) {

    // aqui deve ser filtrado na mesma OU de criação
    var opts = {
        filter: `(&(|(objectclass=person)(objectclass=user))(|(postalcode=${usuario})(postofficebox=${usuario})(uid=${usuario})(samaccountname=${usuario})(mail=${usuario})))`,
        scope: 'sub',
        // attributes: ['dn','cn', 'mail', 'samaccountname', 'uid', ],
        attributes: [
            'givenName',
            'sn',
            'cn',
            'displayName',
            'sAMAccountName',
            'mail',
            'userPrincipalName', 
            'userAccountControl',
            'postalCode',
            'objectClass',
            'msSFU30Name',
            'msSFU30NisDomain',
            'uid',
            'postOfficeBox',
            'uidNumber',
            'gidNumber',
            'loginShell',
            'pwdLastSet',
            'unixHomeDirectory',
        ],  //colocar todos os atributos aqui - tentar pegar os grupos tbm  
    };

    const result = await searchPromise_getUser(adSuffix, opts)
            .then(data => {
                return data
            })
            .catch(err => {
                return false
            })

    return result
}

const searchPromise_getUser = (adSuffix, opts) => {
    return new Promise((resolve, reject) => {

        let users = [];

        ldapClient.search(adSuffix, opts, function (err, res) {
            if (err) {
                console.log("ERRO: Erro na busca pelo usuário " + err)
                reject(err);
            } else {
                res.on('searchEntry', async function (entry) {
                    console.log('SUCESSO: Usuário encontrado : ' + JSON.stringify(entry.object));
                    users.push(entry.object)
                });
                res.on('end', async function () {
                    if (users.length < 1) {
                        // console.log("ERRO: Nenhum usuário encontrado")
                        reject()
                    } else {
                        // console.log('SUCESSO: Usuário(s) encontrado(s) : ' + JSON.stringify(users));
                        resolve(...users);
                    }
                })
            }
        });
    })
}



/*use this to search a group*/
async function getGroup(grupo) {

    // aqui deve ser filtrado na mesma OU de criação
    var opts = {
        filter: `(&(objectCategory=group)(|(cn=${grupo})(name=${grupo})))`,
        scope: 'sub',
        attributes: [
            'cn',
            'dn',
            'name',
            'dn',
            'member'
        ]
    };

    const result = await searchPromise_getGroup(adSuffix, opts)
            .then(data => {
                return data
            })
            .catch(err => {
                return false
            })

    return result
}

const searchPromise_getGroup = (adSuffix, opts) => {
    return new Promise((resolve, reject) => {

        let groups = [];

        ldapClient.search(adSuffix, opts, function (err, res) {
            if (err) {
                console.log("ERRO: Erro na busca pelo grupo " + err)
                reject(err);
            } else {
                res.on('searchEntry', async function (entry) {
                    console.log('SUCESSO: Grupo encontrado');
                    groups.push(entry.object)
                });
                res.on('end', async function () {
                    if (groups.length < 1) {
                        // console.log("ERRO: Nenhum usuário encontrado")
                        reject()
                    } else {
                        // console.log('SUCESSO: Usuário(s) encontrado(s) : ' + JSON.stringify(groups));
                        resolve(...groups);
                    }
                })
            }
        });
    })
}

/*use this to search a OU*/
async function getOU(ou) {

    console.log("ou", ou)
    console.log()

    // aqui deve ser filtrado na mesma OU de criação
    var opts = {
        filter: `(&(objectClass=organizationalUnit)(ou=${ou}))`,
        // filter: `(&(objectCategory=group)(|(dn=${ou})))`,
        // filter: `(&(objectClass=organizationalUnit))`,
        scope: 'sub',
        // attributes: [
        //     'cn',
        //     'dn',
        //     'name',
        //     'dn',
        //     'member'
        // ]
    };

    const result = await searchPromise_getOU(adSuffix, opts, ou)
            .then(data => {
                return data
            })
            .catch(err => {
                console.log('aqui erro', err)
                return false
            })

    return result
}

const searchPromise_getOU = (adSuffix, opts) => {
    return new Promise((resolve, reject) => {

        let ous = [];

        ldapClient.search(adSuffix, opts, function (err, res) {
            if (err) {
                console.log("ERRO: Erro na busca pela OU " + err)
                reject(err);
            } else {
                res.on('searchEntry', async function (entry) {
                    console.log('SUCESSO: OU encontrada' + JSON.stringify(entry.object));
                    ous.push(entry.object)
                });
                res.on('end', async function () {
                    if (ous.length < 1) {
                        console.log("ERRO: Nenhum OU encontrado")
                        reject()
                    } else {
                        // console.log('SUCESSO: Usuário(s) encontrado(s) : ' + JSON.stringify(groups));
                        resolve(...ous);
                    }
                })
            }
        });
    })
}

// Encrypted old password -- usar para troca de senha com bind das credentials do usuario - modify delete e add
// function encodeOldPassword(password) {
//     var pwd = Buffer.from('"' + password + '"', 'utf16le').toString();
//     return pwd;
// }

// Encrypted new password
function encodeNewPassword(password) {
    console.log(password)
    var pwd = Buffer.from('"' + password + '"', 'utf16le').toString();
    console.log(pwd)
    return pwd;
}


/*use this to add OU*/
async function addOU(newDN, newOU) {

    const result = await addPromise_ouCreate(newDN, newOU)
    .then(data => {
        return true
    })
    .catch(err => {
        console.log('erro', err)
        return false
    })

    return result
}

const addPromise_ouCreate = (newDN, newOU) => {
    return new Promise((resolve, reject) => {

        ldapClient.add(newDN, newOU, function (err) {
            if (err) {
                console.log("ERRO: Criação da OU: " + err);
                reject(err)
            } else {
                console.log("SUCESSO: OU criada");
                resolve()
            }
        })
    })
}

/*use this to add group*/
async function addGroup(newDN, newGroup) {

    console.log("newDN", newDN )
    console.log("newGroup", newGroup)


    const result = await addPromise_createGroup(newDN, newGroup)
    .then(data => {
        return true
    })
    .catch(err => {
        return false
    })

    return result
}

const addPromise_createGroup = (newDN, newGroup) => {
    return new Promise((resolve, reject) => {

        console.log("newDN", newDN )
    console.log("newGroup", newGroup)

        ldapClient.add(newDN, newGroup, function (err) {
            if (err) {
                console.log("ERRO: Criação do grupo: " + err);
                reject(err)
            } else {
                console.log("SUCESSO: Grupo criado");
                resolve()
            }
        })
    })
}

module.exports = { authenticate, addUser, updateUser, addUserToGroup, getMsSFU30MaxUidNumber, updateMsSFU30MaxUidNumber, getUser, getGroup, getOU, addOU, addGroup }