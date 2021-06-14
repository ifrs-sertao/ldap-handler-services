const express = require('express');
const usersRoutes = express.Router(); 

const autenticateController = require("../app/controllers/AuthenticateUserController");
const createController = require("../app/controllers/CreateUserController");
const updateController = require("../app/controllers/UpdateUserController");
const searchController = require("../app/controllers/SearchUserController");

usersRoutes.post("/:user/authenticate", autenticateController.authenticateUser);
usersRoutes.post("/create", createController.createUser);
usersRoutes.put("/:user", updateController.updateUser);
usersRoutes.get("/:user", searchController.searchUser);

usersRoutes.put("/:user/password", updateController.updateUserPassword);

// TO DO
// PUT /user/:user/enable
// PUT /user/:user/disable


module.exports = usersRoutes
