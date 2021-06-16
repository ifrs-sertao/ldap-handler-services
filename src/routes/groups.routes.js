const express = require('express');
const groupsRoutes = express.Router();

const createGroupController = require("../app/controllers/CreateGroupController");
const searchGroupController = require("../app/controllers/SearchGroupController");
const addUserInGroupController = require("../app/controllers/AddUserInGroupController");

groupsRoutes.post("/create", createGroupController.createGroup);
groupsRoutes.get("/:group/", searchGroupController.searchGroup);
groupsRoutes.post("/:group/user/:user", addUserInGroupController.addUserInGroup);




module.exports = groupsRoutes
