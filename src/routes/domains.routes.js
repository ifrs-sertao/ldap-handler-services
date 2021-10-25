const express = require('express');
const domainsRoutes = express.Router();

const listDomainsController = require("../app/modules/domains/services/ListDomains/ListDomainsController");

domainsRoutes.get("/", listDomainsController.handle);


module.exports = domainsRoutes