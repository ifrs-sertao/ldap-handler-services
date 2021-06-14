const express = require('express');
const groupsRoutes = express.Router();

const searchGroupController = require("../app/controllers/SearchGroupController");
const addUserInGroupController = require("../app/controllers/AddUserInGroupController");

groupsRoutes.get("/:group/", searchGroupController.searchGroup);
groupsRoutes.post("/:group/user/:user", addUserInGroupController.addUserInGroup);


// add grupo
//editar grupo?


module.exports = groupsRoutes
