const express = require('express');
const usersRoutes = express.Router(); 

const createUserController = require("../app/users/services/CreateUser/CreateUserController");
const searchUserController = require("../app/users/services/SearchUser/SearchUserController");
const authenticateUserController = require("../app/users/services/AuthenticateUser/AuthenticateUserController");
const isUserMemberOfController = require("../app/users/services/IsUserMemberOf/IsUserMemberOfController");
const updateUserController = require("../app/users/services/UpdateUser/UpdateUserController");
const updateUserPasswordController = require("../app/users/services/UpdateUserPassword/UpdateUserPasswordController");
const enableUserController = require("../app/users/services/EnableUser/EnableUserController");
const disableUserController = require("../app/users/services/DisableUser/DisableUserController");


usersRoutes.post("/create", createUserController.handle);
usersRoutes.get("/:user", searchUserController.handle);
usersRoutes.post("/:user/authenticate", authenticateUserController.handle);
usersRoutes.get("/:user/member-of/:group", isUserMemberOfController.handle);
usersRoutes.put("/:user", updateUserController.handle);
usersRoutes.put("/:user/password", updateUserPasswordController.handle);
usersRoutes.put("/:user/enable", enableUserController.handle);
usersRoutes.put("/:user/disable", disableUserController.handle);



////////////////////////////////////////////
// TO DO
// DELETE /:user


module.exports = usersRoutes