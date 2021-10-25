FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 1111

CMD ["npm", "run", "start"]

# docker build -t ifrs/ldap-api-backend .
# docker container run -d --name ldap-api-backend -p 1111:1111 ifrs/ldap-api-backend