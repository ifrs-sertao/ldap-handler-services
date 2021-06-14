const express = require('express');
const ousRoutes = express.Router();

const searchOUController = require("../app/controllers/SearchOUController");

ousRoutes.get("/", searchOUController.searchOU);


// add grupo
//editar grupo?


module.exports = ousRoutes
