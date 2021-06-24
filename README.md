<h1 align="center">LDAP HANDLER SERVICES</h1>

## REST API microservice for Active Directory/LDAP implementations.
Uma proposta de REST API agnóstica para implementações LDAP como Samba 4, Active Directoty e OpenLDAP.

<br/>
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

To access the documentation (swagger-api), open a browser and enter the following URL.
```sh 
http://localhost:1111/api-docs
```
Here's an example showing the documentation (this a static page, the functions does not works): 
https://ifrs-sertao.github.io/ldap-handler-services/ 

<br/>

## License

MIT
