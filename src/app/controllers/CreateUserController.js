const { authenticate, getUser, addUser, updateUser, addUserToGroup, getMsSFU30MaxUidNumber, updateMsSFU30MaxUidNumber, getOU }= require('../../lib/functions-ldap');
require('dotenv').config()

// Credentials LDAP Administrator 
const userRoot = process.env.USERROOT;
const passwordRoot = process.env.PASSWORD;

module.exports = {
    async createUser(req, res) {

        let { fullname, matricula, cpf, mail, ou } = req.body;

        // tratar variaveis - fazer uma função pra isso
        const arrayNames = fullname.split(" ")
        let nome = arrayNames[0]
        arrayNames.pop()
        let sobrenome = arrayNames.join(' '); 
        nome = nome.toUpperCase();
        sobrenome = sobrenome.toUpperCase();
        fullname = fullname.toUpperCase();

        // trata OU
        const arrayOuData = ou.split(",")
        const ouArrayNames = arrayOuData[0].split("=")
        const ouName = ouArrayNames[1]

        const dn = `CN=${fullname}`;

        // Usuário a ser adicionado na base LDAP
        // const newDN = `${dn},${OU_ALUNOS}`; //nome 
        const newDN = `${dn},${ou}`; //nome 

        
        // "dn": "CN=ANDRE VITOR BORTOLI,OU=ALUNOS,OU=USUARIOS,OU=CAMPUS,DC=campus,DC=sertao,DC=ifrs,DC=edu,DC=br",
        const newUser_data = {
            givenName: nome, // Nome completo
            sn: sobrenome,
            cn: fullname,
            displayName: fullname,
            sAMAccountName: cpf, // CPF completo
            mail: mail, // Email matricula com zeros
            userPrincipalName: `${cpf}@campus.sertao.ifrs.edu.br`,
            userAccountControl: 512,
            postalCode: cpf, // CPF completo
            objectClass: ['top', 'posixGroup', 'person', 'organizationalPerson', 'user']
        };


        // autenticar
        const auth = await authenticate(userRoot, passwordRoot);
        if (!auth) {
            return res.status(401).send({ error: "Authentication failed! Please, try again!" });
        }

        // verificar se OU existe
        const foundOU = await getOU(ouName)
        if (!foundOU) {
            return res.status(401).send({ error: `A OU ${ou} não foi encontrada na base LDAP` });
        };

        // adicionar usuario
        const addNewUser = await addUser(newDN, newUser_data);
        if (!addNewUser) {
            return res.status(401).send("Usuário não pode ser criado");
        };

        // pega o atributo msSFU30MaxUidNumber para inserir no campo uidNumber do usuário
        const { msSFU30MaxUidNumber } = await getMsSFU30MaxUidNumber();
        if (!msSFU30MaxUidNumber) {
            return res.status(401).send({ error: "atributo getMsSFU30MaxUidNumber não encontrado"});

        }
        const new_msSFU30MaxUidNumber = parseInt(msSFU30MaxUidNumber) + 1;

        const newUser_unixAttributes = {
            msSFU30Name: cpf,
            msSFU30NisDomain: 'devdom', //teste - produção trocar para campus, talvez colocar em .env
            uid: matricula,  // MATRICULA com zeros
            postOfficeBox: matricula,   // MATRICULA sem zeros FALTA AQUI
            uidNumber: new_msSFU30MaxUidNumber,
            // uidNumber: '951616161651561', //para testes
            gidNumber: 10000,
            loginShell: '/bin/bash',
            pwdLastSet: 0,
            unixHomeDirectory: `/home/${cpf}`,
            userPassword: cpf,
        };

        // modificar atributos do usuario 
        const updateNewUser = await updateUser(newDN, newUser_unixAttributes);
        if (!updateNewUser) {
            return res.status(401).send({ error: "Usuário não foi atualizado"});
        };

        // atualiza valor do msSFU30MaxUidNumber
        const update_MsSFU30MaxUidNumber = await updateMsSFU30MaxUidNumber(new_msSFU30MaxUidNumber);
        if (!update_MsSFU30MaxUidNumber) {
            return res.status(401).send({ error: "msSFU30MaxUidNumber não foi atualizado"});
        };

        // vincular usuario ao grupo ALUNOS -- acho que tirar, isso é outra função
        const groupDn = "CN=ALUNOS,OU=GRUPOS,OU=CAMPUS,DC=devdom,DC=sertao,DC=ifrs,DC=edu,DC=br";
        const addGroups = await addUserToGroup(newDN, groupDn);
        if (!addGroups) {
            return res.status(401).send({ error: "Usuário não foi adicinado no grupo"});
        };

         // busca usuario no LDAP
         const foundNewUser = await getUser(cpf)
         if (!foundNewUser) {
             return res.status(401).send({ error: `O usuário ${cpf} não foi encontrado na base LDAP` });
         };

        // returno para o usuario
        return res.status(201).send({
            success: `O usuário ${fullname} foi adicionado com sucesso`,
            user: foundNewUser
        });

    }
}