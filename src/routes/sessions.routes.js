const express = require('express');
const sessionsRoutes = express.Router();

const sessionController = require("../app/controllers/SessionController");
const SessionValidator = require('../app/validators/session')
const SessionMiddlewares = require('../app/middlewares/session')


sessionsRoutes.post("/login", SessionValidator.login, sessionController.login);
sessionsRoutes.post("/verify", SessionMiddlewares.auth);



module.exports = sessionsRoutes
