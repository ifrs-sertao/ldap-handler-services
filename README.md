<h1 align="center">LDAP HANDLER SERVICES</h1>

## REST API microservice for Active Directory/LDAP implementations.

<br/>

## Running locally

Clone the repository:

```sh
https://github.com/ifrs-sertao/ldap-handler-services
```

Rename env-example file to .env, and change data.

Change the secret in /src/app/config/auth.json.

Build docker image:
```sh
docker build -t ldap-handler-services .
```

Start your container using the docker run:
```sh 
docker container run -d --name ldap-handler-services -p 1111:1111 ldap-handler-services
```

<br/>
<br/>


## API Endpoints
```js

Base URL: http://localhost:1111/api/v1/

# Authentication

Logar com usuário
POST /auth/login
body:
{
	"user": "99999999",
	"password": "secretpassword"
}	

# Users

Busca usuário específico
GET /users/:user

Criar novo usuário
POST /users/create
body: 
{
	"fullname": "Ronaldo Fenomeno Nazario",
	"matricula": "99999999",
	"cpf": "12345678900",
	"mail": "ronaldo.nazario@gmail.com",
    "ou": "OU=futebol,OU=teste,DC=devdom,DC=com"
}

- Atualiza usuário
PUT /users/:user
body: 
{
    "atributo_ldap_user": "valor"
    "mail": "test@gmail.com"
}

- Auntenticar com usuario e senha específicos
POST /users/:user/authenticate
body: 
{
	"password": "senha"
}	

- Atualiza senha de um usuário
PUT /users/:user/password
body: 
{
	"password": "teste"
}

# Groups

- Busca grupo específico
GET /groups/:group

- Adiciona usuário no grupo
POST /groups/:group/user/:user


# Organizational Units

- Busca OU específica
GET /ous - 
body:
{
	"ou": "OU=teste,DC=devdom,DC=com"
}

```

## License

MIT
