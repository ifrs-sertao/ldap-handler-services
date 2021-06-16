const express = require('express');
const ousRoutes = express.Router();

const searchOUController = require("../app/controllers/SearchOUController");
const createOUController = require("../app/controllers/CreateOUController");


ousRoutes.post("/search", searchOUController.searchOU);
ousRoutes.post("/create", createOUController.createOU);



// add grupo
//editar grupo?


module.exports = ousRoutes
