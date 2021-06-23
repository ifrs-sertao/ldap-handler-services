const express = require('express');
const groupsRoutes = express.Router();

const listGroupsController = require("../app/groups/services/ListGroups/ListGroupsController");
const createGroupController = require("../app/groups/services/CreateGroup/CreateGroupController");
const searchGroupController = require("../app/groups/services/SearchGroup/SearchGroupController");
const addUserToGroupController = require("../app/groups/services/AddUserToGroup/AddUserToGroupController");

groupsRoutes.get("/", listGroupsController.handle);
groupsRoutes.post("/create", createGroupController.handle);
groupsRoutes.get("/:group", searchGroupController.handle);
groupsRoutes.post("/:group/user/:user", addUserToGroupController.handle);



module.exports = groupsRoutes