const express = require('express');
const usersRoutes = express.Router(); 

const autenticateController = require("../app/controllers/AuthenticateUserController");
const createController = require("../app/controllers/CreateUserController");
const updateController = require("../app/controllers/UpdateUserController");

//novas
const searchUserController = require("../app/users/services/SearchUser/SearchUserController");


usersRoutes.post("/:user/authenticate", autenticateController.authenticateUser);
usersRoutes.post("/create", createController.createUser);
usersRoutes.put("/:user", updateController.updateUser);
// usersRoutes.get("/:user", searchController.searchUser);
usersRoutes.put("/:user/password", updateController.updateUserPassword);


/// novas
usersRoutes.get("/:user", searchUserController.handle);


////////////////////////////////////////////
// TO DO
// PUT /user/:user/enable
// PUT /user/:user/disable


module.exports = usersRoutes
