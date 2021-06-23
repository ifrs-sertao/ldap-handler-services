const express = require('express');
const ousRoutes = express.Router();

const createOUController = require("../app/ous/services/CreateOU/CreateOUController");
const searchOUController = require("../app/ous/services/SearchOU/SearchOUController");
const listOUsController = require("../app/ous/services/ListOUs/ListOUsController");

ousRoutes.post("/create", createOUController.handle);
ousRoutes.post("/search", searchOUController.handle);
ousRoutes.get("/", listOUsController.handle);



module.exports = ousRoutes
